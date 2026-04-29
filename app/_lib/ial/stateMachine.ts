// IAL state machine — the one place IntegrationJob status changes.
// Mirrors §4 of the IAL spec. Direct mutation of `status` outside this
// module is forbidden; production database trigger enforces it.
//
// This module is pure logic — no database, no audit-log writes — so it
// can be unit-tested standalone. The orchestrator that wires this into
// the database + audit log lives in app/api/integrations/* (built in
// IAL Sprint 1 once Supabase is online).

import type {
  ActorType,
  IntegrationJob,
  IntegrationStatus,
} from "./types";

// ---------------------------------------------------------------------
// Allowed transitions table (from §4 of the spec)
// ---------------------------------------------------------------------

type TransitionDef = {
  from: IntegrationStatus;
  to: IntegrationStatus;
  /** Which actor types can drive this transition. */
  allowedActors: ActorType[];
  /** Human-readable reason this transition exists, for diagnostics. */
  rationale: string;
};

const TRANSITIONS: TransitionDef[] = [
  // Initial path
  {
    from: "drafted",
    to: "awaiting_approval",
    allowedActors: ["user"],
    rationale: "Coordinator submits Tier 3 job for human approval",
  },
  {
    from: "drafted",
    to: "submitted",
    allowedActors: ["system", "user"],
    rationale: "Tier 1 / Tier 4 job goes straight to submission",
  },
  {
    from: "drafted",
    to: "cancelled",
    allowedActors: ["user"],
    rationale: "Coordinator abandons before submission",
  },

  // Approval gate (Tier 3 only)
  {
    from: "awaiting_approval",
    to: "submitted",
    allowedActors: ["user"],
    rationale: "Approver greenlights; trigger Tier 3 agent execution",
  },
  {
    from: "awaiting_approval",
    to: "cancelled",
    allowedActors: ["user"],
    rationale: "Approver rejects; refund cost, log reason",
  },

  // Active processing
  {
    from: "submitted",
    to: "in_progress",
    allowedActors: ["system", "agent", "specialist"],
    rationale: "External system or specialist began work",
  },
  {
    from: "submitted",
    to: "awaiting_info",
    allowedActors: ["system", "agent"],
    rationale: "External system rejected with info request",
  },
  {
    from: "in_progress",
    to: "awaiting_info",
    allowedActors: ["system", "agent", "specialist"],
    rationale: "Mid-processing, more info needed",
  },
  {
    from: "awaiting_info",
    to: "submitted",
    allowedActors: ["user", "specialist"],
    rationale: "Coordinator/specialist provides info, resubmit",
  },

  // Terminal
  {
    from: "in_progress",
    to: "completed",
    allowedActors: ["system", "agent", "specialist"],
    rationale: "Successful completion with result",
  },
  {
    from: "in_progress",
    to: "failed",
    allowedActors: ["system", "agent", "specialist"],
    rationale: "Permanent failure, manual review required",
  },
  {
    from: "submitted",
    to: "completed",
    allowedActors: ["system"],
    rationale: "Tier 1 synchronous APIs may complete without intermediate state",
  },
  {
    from: "submitted",
    to: "failed",
    allowedActors: ["system"],
    rationale: "Tier 1 synchronous failure",
  },

  // Cancellation from any non-terminal state
  ...(
    ["awaiting_approval", "submitted", "in_progress", "awaiting_info"] as const
  ).flatMap<TransitionDef>((from) => [
    {
      from,
      to: "cancelled" as IntegrationStatus,
      allowedActors: ["user", "specialist"],
      rationale: `Cancel from ${from}: refund if applicable`,
    },
  ]),
];

const TERMINAL: ReadonlySet<IntegrationStatus> = new Set([
  "completed",
  "failed",
  "cancelled",
]);

// ---------------------------------------------------------------------
// Pure decision functions — testable, no I/O
// ---------------------------------------------------------------------

export function isTerminal(status: IntegrationStatus): boolean {
  return TERMINAL.has(status);
}

export function findTransition(
  from: IntegrationStatus,
  to: IntegrationStatus,
): TransitionDef | undefined {
  return TRANSITIONS.find((t) => t.from === from && t.to === to);
}

export type TransitionDecision =
  | { ok: true; transition: TransitionDef }
  | { ok: false; reason: string };

/**
 * Decide whether the proposed transition is allowed.
 * Returns a structured result so callers can branch without throws.
 */
export function decideTransition(args: {
  fromStatus: IntegrationStatus;
  toStatus: IntegrationStatus;
  actorType: ActorType;
}): TransitionDecision {
  if (args.fromStatus === args.toStatus) {
    return { ok: false, reason: "no-op transition" };
  }
  if (TERMINAL.has(args.fromStatus)) {
    return {
      ok: false,
      reason: `cannot transition from terminal state ${args.fromStatus}`,
    };
  }
  const t = findTransition(args.fromStatus, args.toStatus);
  if (!t) {
    return {
      ok: false,
      reason: `no rule allows ${args.fromStatus} → ${args.toStatus}`,
    };
  }
  if (!t.allowedActors.includes(args.actorType)) {
    return {
      ok: false,
      reason: `actor type ${args.actorType} not allowed for this transition (allowed: ${t.allowedActors.join(", ")})`,
    };
  }
  return { ok: true, transition: t };
}

// ---------------------------------------------------------------------
// Side-effect free job updater
// ---------------------------------------------------------------------

/**
 * Returns the new IntegrationJob shape after transition. The caller is
 * responsible for persisting both the new job state and an audit-log
 * entry in the same database transaction (see app/api/integrations/*).
 */
export function applyTransition(args: {
  job: IntegrationJob;
  toStatus: IntegrationStatus;
  /** ISO timestamp of the transition; injected to keep the function pure. */
  now: Date;
  /** Optional updates to apply alongside the status change. */
  patch?: Partial<
    Pick<IntegrationJob, "result" | "eta" | "costCents" | "metadata">
  >;
}): IntegrationJob {
  const next: IntegrationJob = {
    ...args.job,
    status: args.toStatus,
    updatedAt: args.now,
  };

  // Stamp lifecycle timestamps when entering specific states.
  if (args.toStatus === "submitted" && !next.submittedAt) {
    next.submittedAt = args.now;
  }
  if (
    (args.toStatus === "completed" || args.toStatus === "failed") &&
    !next.completedAt
  ) {
    next.completedAt = args.now;
  }

  if (args.patch?.result !== undefined) next.result = args.patch.result;
  if (args.patch?.eta !== undefined) next.eta = args.patch.eta;
  if (args.patch?.costCents !== undefined) next.costCents = args.patch.costCents;
  if (args.patch?.metadata !== undefined) {
    next.metadata = { ...next.metadata, ...args.patch.metadata };
  }

  return next;
}
