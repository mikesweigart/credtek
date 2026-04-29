// In-memory mock IntegrationJob store. Used by the /api/integrations/*
// route handlers so the endpoints actually return realistic data.
//
// Production: this gets replaced by Supabase via the integration_jobs
// table per IAL §5. The shape never changes — only the persistence layer.
//
// Note: serverless invocations can lose this state. We stash on globalThis
// to survive lambda warm reuse, which covers the same-session-demo case.
// New cold lambdas re-seed from the constants below.

import {
  applyTransition,
  decideTransition,
  isTerminal,
} from "./stateMachine";
import type {
  ActorType,
  IntegrationJob,
  IntegrationStatus,
  IntegrationTier,
} from "./types";

type GlobalState = {
  __credtekJobStore?: Map<string, IntegrationJob>;
  __credtekJobCounter?: number;
};
const G = globalThis as unknown as GlobalState;

function ensureStore(): Map<string, IntegrationJob> {
  if (!G.__credtekJobStore) {
    G.__credtekJobStore = new Map<string, IntegrationJob>();
    seed(G.__credtekJobStore);
  }
  return G.__credtekJobStore;
}

function nextId(): string {
  G.__credtekJobCounter = (G.__credtekJobCounter ?? 1000) + 1;
  // ULID-flavored: not a real ULID, just a stable demo-friendly ID.
  return `job_01HZX${G.__credtekJobCounter.toString(36).toUpperCase().padStart(8, "0")}`;
}

// ---------------------------------------------------------------------
// Seed data — mirrors what the customer-facing UI shows so the API
// returns the same providers and stages partners see in the demo.
// ---------------------------------------------------------------------

function seed(store: Map<string, IntegrationJob>): void {
  const now = new Date();
  const baseDays = (n: number) => new Date(now.getTime() - n * 86_400_000);

  const seeds: IntegrationJob[] = [
    {
      id: "job_01HZX700000000A1",
      tenantId: "mindscape",
      integrationType: "optum_enrollment",
      tier: "tier_3_browser" as IntegrationTier,
      providerId: "james-mitchell",
      status: "drafted" as IntegrationStatus,
      payload: {
        providerName: "James Mitchell",
        credential: "LCSW",
        state: "CA",
        npi: "2109834567",
        caqhId: "12345678",
      },
      result: null,
      eta: new Date(now.getTime() + 14 * 86_400_000),
      submittedAt: null,
      completedAt: null,
      createdBy: "user_marisol",
      costCents: 0,
      metadata: { attempts: 0 },
      auditLogId: "audit_seed_a1",
      createdAt: baseDays(1),
      updatedAt: baseDays(1),
    },
    {
      id: "job_01HZX700000000A2",
      tenantId: "mindscape",
      integrationType: "carelon_enrollment",
      tier: "tier_3_browser" as IntegrationTier,
      providerId: "james-mitchell",
      status: "submitted" as IntegrationStatus,
      payload: { providerName: "James Mitchell", credential: "LCSW", state: "CA" },
      result: null,
      eta: new Date(now.getTime() + 38 * 86_400_000),
      submittedAt: baseDays(12),
      completedAt: null,
      createdBy: "user_marisol",
      costCents: 50,
      metadata: { attempts: 1, externalReference: "CAR-2026-04-EN-99812" },
      auditLogId: "audit_seed_a2",
      createdAt: baseDays(13),
      updatedAt: baseDays(12),
    },
    {
      id: "job_01HZX700000000A3",
      tenantId: "mindscape",
      integrationType: "optum_enrollment",
      tier: "tier_3_browser" as IntegrationTier,
      providerId: "sarah-reyes",
      status: "completed" as IntegrationStatus,
      payload: { providerName: "Dr. Sarah Reyes", credential: "PsyD", state: "TX" },
      result: {
        networkStatus: "in_network",
        effectiveDate: "2026-03-21",
        externalReference: "OPT-2026-02-CR-44288",
      },
      eta: new Date(now.getTime() - 38 * 86_400_000),
      submittedAt: baseDays(76),
      completedAt: baseDays(38),
      createdBy: "user_marisol",
      costCents: 50,
      metadata: { attempts: 1, confidenceScore: 0.99 },
      auditLogId: "audit_seed_a3",
      createdAt: baseDays(80),
      updatedAt: baseDays(38),
    },
    {
      id: "job_01HZX700000000A4",
      tenantId: "mindscape",
      integrationType: "tx_lpc_verification",
      tier: "tier_1_api" as IntegrationTier,
      providerId: "aisha-patel",
      status: "completed" as IntegrationStatus,
      payload: { licenseNumber: "TX-86421", providerName: "Aisha Patel" },
      result: {
        licenseStatus: "active",
        verificationDate: "2026-04-28",
        confidenceScore: 0.994,
      },
      eta: new Date(now.getTime() - 1 * 86_400_000),
      submittedAt: baseDays(1),
      completedAt: baseDays(1),
      createdBy: "agent_psv_state_board",
      costCents: 0,
      metadata: { attempts: 1, confidenceScore: 0.994 },
      auditLogId: "audit_seed_a4",
      createdAt: baseDays(1),
      updatedAt: baseDays(1),
    },
    {
      id: "job_01HZX700000000A5",
      tenantId: "mindscape",
      integrationType: "tx_medicaid_superior_enrollment",
      tier: "tier_4_human" as IntegrationTier,
      providerId: "daniel-kim",
      status: "awaiting_info" as IntegrationStatus,
      payload: { providerName: "Dr. Daniel Kim", credential: "MD", state: "TX" },
      result: null,
      eta: new Date(now.getTime() + 47 * 86_400_000),
      submittedAt: baseDays(18),
      completedAt: null,
      createdBy: "user_marisol",
      costCents: 20000,
      metadata: {
        attempts: 2,
        assignedTo: "Patricia Yang (CVO)",
        externalReference: "SUP-2026-04-EN-887412",
        lastError: "Superior requested DEA refresh — agent attached fresh DEA, awaiting committee.",
      },
      auditLogId: "audit_seed_a5",
      createdAt: baseDays(20),
      updatedAt: baseDays(6),
    },
  ];

  for (const j of seeds) store.set(j.id, j);
}

// ---------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------

export function getJob(id: string): IntegrationJob | null {
  return ensureStore().get(id) ?? null;
}

export function listJobs(filter?: {
  tenantId?: string;
  providerId?: string;
  status?: IntegrationStatus;
}): IntegrationJob[] {
  const all = [...ensureStore().values()];
  return all.filter((j) => {
    if (filter?.tenantId && j.tenantId !== filter.tenantId) return false;
    if (filter?.providerId && j.providerId !== filter.providerId) return false;
    if (filter?.status && j.status !== filter.status) return false;
    return true;
  });
}

export type CreateJobInput = {
  tenantId: string;
  integrationType: string;
  tier: IntegrationTier;
  providerId: string;
  payload: Record<string, unknown>;
  createdBy: string;
  /** Estimated turnaround used for ETA. */
  estimatedHours?: number;
  costCents?: number;
};

/**
 * Create a new IntegrationJob in `drafted` state. The caller must
 * subsequently call transitionJob() to move it forward — the spec's
 * state machine enforces transitions explicitly.
 */
export function createJob(input: CreateJobInput): IntegrationJob {
  const now = new Date();
  const etaHours = input.estimatedHours ?? 72;
  const job: IntegrationJob = {
    id: nextId(),
    tenantId: input.tenantId,
    integrationType: input.integrationType,
    tier: input.tier,
    providerId: input.providerId,
    status: "drafted",
    payload: input.payload,
    result: null,
    eta: new Date(now.getTime() + etaHours * 3_600_000),
    submittedAt: null,
    completedAt: null,
    createdBy: input.createdBy,
    costCents: input.costCents ?? 0,
    metadata: { attempts: 0 },
    auditLogId: `audit_${nextId().slice(4)}`,
    createdAt: now,
    updatedAt: now,
  };
  ensureStore().set(job.id, job);
  return job;
}

export type TransitionResult =
  | { ok: true; job: IntegrationJob }
  | { ok: false; reason: string; status: number };

/**
 * Apply a state transition to a stored job. Validates against the IAL
 * state machine before mutating. Production: also writes the transition
 * row to integration_job_transitions and an audit-log entry.
 */
export function transitionJob(args: {
  jobId: string;
  toStatus: IntegrationStatus;
  actorType: ActorType;
  patch?: Parameters<typeof applyTransition>[0]["patch"];
}): TransitionResult {
  const store = ensureStore();
  const job = store.get(args.jobId);
  if (!job) return { ok: false, reason: "job not found", status: 404 };
  if (isTerminal(job.status))
    return {
      ok: false,
      reason: `job is in terminal state ${job.status}`,
      status: 409,
    };
  const decision = decideTransition({
    fromStatus: job.status,
    toStatus: args.toStatus,
    actorType: args.actorType,
  });
  if (!decision.ok)
    return { ok: false, reason: decision.reason, status: 422 };
  const next = applyTransition({
    job,
    toStatus: args.toStatus,
    now: new Date(),
    patch: args.patch,
  });
  store.set(next.id, next);
  return { ok: true, job: next };
}

/**
 * Serialize a job to JSON-safe shape (Date → ISO strings) for API
 * responses. Mirrors the shape we'll return from real Supabase queries.
 */
export function serializeJob(j: IntegrationJob): Record<string, unknown> {
  return {
    id: j.id,
    tenant_id: j.tenantId,
    integration_type: j.integrationType,
    tier: j.tier,
    provider_id: j.providerId,
    status: j.status,
    payload: j.payload,
    result: j.result,
    eta: j.eta?.toISOString() ?? null,
    submitted_at: j.submittedAt?.toISOString() ?? null,
    completed_at: j.completedAt?.toISOString() ?? null,
    created_by: j.createdBy,
    cost_cents: j.costCents,
    metadata: j.metadata,
    audit_log_id: j.auditLogId,
    created_at: j.createdAt.toISOString(),
    updated_at: j.updatedAt.toISOString(),
  };
}
