// GET /api/integrations/list — list IntegrationJobs with optional filters.
//
// Query params (all optional):
//   tenant_id    — filter by customer org
//   provider_id  — filter by provider slug
//   status       — filter by IntegrationStatus
//   limit        — max rows (default 50, capped 200)

import { NextResponse } from "next/server";
import {
  listJobs,
  serializeJob,
} from "../../../_lib/ial/jobStore";
import type { IntegrationStatus } from "../../../_lib/ial/types";

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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tenantId = url.searchParams.get("tenant_id") ?? undefined;
  const providerId = url.searchParams.get("provider_id") ?? undefined;
  const status = url.searchParams.get("status") ?? undefined;
  const limitParam = url.searchParams.get("limit");
  const limit = Math.min(
    Math.max(Number.parseInt(limitParam ?? "50", 10) || 50, 1),
    200,
  );

  if (status && !VALID_STATUSES.includes(status as IntegrationStatus)) {
    return NextResponse.json(
      {
        error: "invalid_status",
        message: `status must be one of ${VALID_STATUSES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const filtered = listJobs({
    tenantId,
    providerId,
    status: status as IntegrationStatus | undefined,
  });

  // Newest first
  const sorted = [...filtered].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
  const page = sorted.slice(0, limit);

  return NextResponse.json({
    total: filtered.length,
    returned: page.length,
    limit,
    jobs: page.map(serializeJob),
  });
}
