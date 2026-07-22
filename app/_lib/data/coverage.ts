// Server-side coverage query. The pure types + STATUS_DISPLAY live in
// coverage-view.ts so client components can consume them without
// pulling the Supabase server client into the browser bundle.

import { createSupabaseServerClient } from "../supabase/serverClient";
import { currentTenantId } from "./workspace";
import type { EnrollmentStatus } from "./credentialing";
import type {
  CoverageData,
  CoveragePayer,
  CoverageProvider,
} from "./coverage-view";

export type {
  CoverageCell,
  CoverageData,
  CoveragePayer,
  CoverageProvider,
} from "./coverage-view";

const PENDING_STATUSES: EnrollmentStatus[] = ["drafted", "submitted", "awaiting_info"];

function cellKey(state: string, payerId: string): string {
  return `${state.toUpperCase()}:${payerId}`;
}

export async function getCoverage(): Promise<CoverageData> {
  const s = await createSupabaseServerClient();
  const tid = await currentTenantId();
  if (!s || !tid) {
    return {
      providers: [],
      payers: [],
      totals: { enrollments: 0, active: 0, pending: 0, denied: 0, notStarted: 0, gaps: 0, states: 0, payers: 0, billableProviders: 0 },
    };
  }

  // providers + enrollments are tenant-owned and filtered explicitly.
  // payers is deliberately NOT filtered: it's global reference data with
  // no tenant_id column, shared by every workspace.
  const [{ data: pData }, { data: enrData }, { data: payerData }] = await Promise.all([
    s.from("providers").select("id, name, credential, license_states, status, credentialing_stage").eq("tenant_id", tid).order("name"),
    s.from("enrollments").select("id, provider_id, payer_id, state, status, effective_date, submitted_on").eq("tenant_id", tid),
    s.from("payers").select("id, name, short_name, kind").order("name"),
  ]);

  const payers: CoveragePayer[] = (payerData as CoveragePayer[]) ?? [];
  const providers: CoverageProvider[] = ((pData ?? []) as Array<{
    id: string; name: string; credential: string | null; license_states: string[];
  }>).map((p) => ({
    id: p.id,
    name: p.name,
    credential: p.credential,
    states: (p.license_states ?? []).map((x) => x.toUpperCase()),
    cells: new Map(),
    billableCount: 0,
    pendingCount: 0,
    gapCount: 0,
  }));

  const providerById = new Map(providers.map((p) => [p.id, p]));

  let active = 0, pending = 0, denied = 0, notStarted = 0;
  for (const e of (enrData ?? []) as Array<{
    id: string; provider_id: string; payer_id: string; state: string | null;
    status: EnrollmentStatus; effective_date: string | null; submitted_on: string | null;
  }>) {
    const prov = providerById.get(e.provider_id);
    if (!prov) continue;
    const stateUpper = (e.state ?? "").toUpperCase();
    if (!stateUpper) continue;
    const k = cellKey(stateUpper, e.payer_id);
    prov.cells.set(k, {
      status: e.status,
      enrollmentId: e.id,
      effectiveDate: e.effective_date,
      submittedOn: e.submitted_on,
    });
    if (e.status === "active") active++;
    else if (PENDING_STATUSES.includes(e.status)) pending++;
    else if (e.status === "denied" || e.status === "termed") denied++;
    else if (e.status === "not_started") notStarted++;
  }

  let totalGaps = 0;
  const allStates = new Set<string>();
  let billableProviders = 0;
  for (const prov of providers) {
    let billable = 0, pend = 0, gaps = 0;
    for (const state of prov.states) {
      allStates.add(state);
      for (const payer of payers) {
        const k = cellKey(state, payer.id);
        const cell = prov.cells.get(k);
        if (!cell) {
          prov.cells.set(k, { status: "no_enrollment", enrollmentId: null, effectiveDate: null, submittedOn: null });
          gaps++;
        } else if (cell.status === "active") {
          billable++;
        } else if (PENDING_STATUSES.includes(cell.status as EnrollmentStatus)) {
          pend++;
        }
      }
    }
    prov.billableCount = billable;
    prov.pendingCount = pend;
    prov.gapCount = gaps;
    if (billable > 0) billableProviders++;
    totalGaps += gaps;
  }

  return {
    providers,
    payers,
    totals: {
      enrollments: active + pending + denied + notStarted,
      active,
      pending,
      denied,
      notStarted,
      gaps: totalGaps,
      states: allStates.size,
      payers: payers.length,
      billableProviders,
    },
  };
}
