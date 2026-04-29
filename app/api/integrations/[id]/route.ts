// GET /api/integrations/[id]    — fetch a single job
// POST /api/integrations/[id]   — apply a state transition
//
// Production Sprint 1 wires this to Supabase + audit log + tenant-scoped
// auth. The wire-format mirrors what the real endpoint will return.

import { NextResponse } from "next/server";
import {
  getJob,
  serializeJob,
  transitionJob,
} from "../../../_lib/ial/jobStore";
import type {
  ActorType,
  IntegrationStatus,
} from "../../../_lib/ial/types";

type Params = { params: Promise<{ id: string }> };

const VALID_STATUSES: IntegrationStatus[] = [
  "drafted",
  "awaiting_approval",
  "submitted",
  "in_progress",
  "awaiting_info",
  "completed",
  "failed",
  "cancelled",
];

const VALID_ACTORS: ActorType[] = ["system", "user", "agent", "specialist"];

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) {
    return NextResponse.json(
      { error: "not_found", id },
      { status: 404 },
    );
  }
  return NextResponse.json({ job: serializeJob(job) });
}

type TransitionBody = {
  to_status?: string;
  actor_type?: string;
  patch?: {
    result?: Record<string, unknown>;
    eta?: string;
    cost_cents?: number;
    metadata?: Record<string, unknown>;
  };
};

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;

  let body: TransitionBody;
  try {
    body = (await req.json()) as TransitionBody;
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Body must be valid JSON" },
      { status: 400 },
    );
  }

  if (!body.to_status) {
    return NextResponse.json(
      { error: "missing_field", missing: ["to_status"] },
      { status: 400 },
    );
  }
  if (!VALID_STATUSES.includes(body.to_status as IntegrationStatus)) {
    return NextResponse.json(
      {
        error: "invalid_to_status",
        message: `to_status must be one of ${VALID_STATUSES.join(", ")}`,
      },
      { status: 400 },
    );
  }
  const actorType =
    (body.actor_type as ActorType) ?? ("user" as ActorType);
  if (!VALID_ACTORS.includes(actorType)) {
    return NextResponse.json(
      {
        error: "invalid_actor_type",
        message: `actor_type must be one of ${VALID_ACTORS.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const result = transitionJob({
    jobId: id,
    toStatus: body.to_status as IntegrationStatus,
    actorType,
    patch: body.patch
      ? {
          result: body.patch.result,
          eta: body.patch.eta ? new Date(body.patch.eta) : undefined,
          costCents: body.patch.cost_cents,
          metadata: body.patch.metadata as
            | Partial<{
                confidenceScore: number;
                attempts: number;
                lastError: string;
                assignedTo: string;
                externalReference: string;
              }>
            | undefined,
        }
      : undefined,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "transition_rejected", reason: result.reason },
      { status: result.status },
    );
  }
  return NextResponse.json({ job: serializeJob(result.job) });
}
