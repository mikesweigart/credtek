// POST /api/integrations/submit — create a new IntegrationJob.
//
// Demo-only: no auth gate, no real persistence beyond Lambda warm
// reuse. Production Sprint 1 wires this to Supabase + per-tenant auth +
// audit log. The wire-format here is what the real endpoint will return.

import { NextResponse } from "next/server";
import {
  createJob,
  serializeJob,
  transitionJob,
  type CreateJobInput,
} from "../../../_lib/ial/jobStore";
import type { IntegrationTier } from "../../../_lib/ial/types";

const VALID_TIERS: IntegrationTier[] = [
  "tier_1_api",
  "tier_2_partner",
  "tier_3_browser",
  "tier_4_human",
];

type SubmitBody = {
  tenant_id?: string;
  integration_type?: string;
  tier?: string;
  provider_id?: string;
  payload?: Record<string, unknown>;
  /** Optional: skip the awaiting_approval gate (Tier 1/4 only). */
  auto_submit?: boolean;
};

export async function POST(req: Request) {
  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Body must be valid JSON" },
      { status: 400 },
    );
  }

  // --- Validation ----------------------------------------------------
  const missing: string[] = [];
  if (!body.tenant_id) missing.push("tenant_id");
  if (!body.integration_type) missing.push("integration_type");
  if (!body.tier) missing.push("tier");
  if (!body.provider_id) missing.push("provider_id");
  if (!body.payload) missing.push("payload");
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "missing_fields", missing },
      { status: 400 },
    );
  }
  if (!VALID_TIERS.includes(body.tier as IntegrationTier)) {
    return NextResponse.json(
      {
        error: "invalid_tier",
        message: `tier must be one of ${VALID_TIERS.join(", ")}`,
      },
      { status: 400 },
    );
  }

  // --- Create -------------------------------------------------------
  const input: CreateJobInput = {
    tenantId: body.tenant_id!,
    integrationType: body.integration_type!,
    tier: body.tier as IntegrationTier,
    providerId: body.provider_id!,
    payload: body.payload!,
    createdBy: "api_demo_user",
  };
  const job = createJob(input);

  // --- Initial transition --------------------------------------------
  // Tier 3 always goes to awaiting_approval first (human-in-the-loop).
  // Tier 1/4 can go straight to submitted if auto_submit is set.
  const wantsAutoSubmit = body.auto_submit === true;
  if (job.tier === "tier_3_browser") {
    transitionJob({
      jobId: job.id,
      toStatus: "awaiting_approval",
      actorType: "user",
    });
  } else if (wantsAutoSubmit) {
    transitionJob({
      jobId: job.id,
      toStatus: "submitted",
      actorType: "user",
    });
  }

  const final = job; // re-read in production; for demo, just serialize the latest known
  return NextResponse.json(
    { job: serializeJob(final) },
    { status: 201 },
  );
}

export async function GET() {
  return NextResponse.json(
    {
      info: "POST a JSON body to create an IntegrationJob",
      example_body: {
        tenant_id: "mindscape",
        integration_type: "optum_enrollment",
        tier: "tier_3_browser",
        provider_id: "james-mitchell",
        payload: {
          providerName: "James Mitchell",
          credential: "LCSW",
          state: "CA",
          npi: "2109834567",
        },
        auto_submit: false,
      },
      docs: "/api-docs",
    },
    { status: 200 },
  );
}
