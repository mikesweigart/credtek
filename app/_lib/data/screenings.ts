// Background-check / sanctions-screening reads for the real app.
// RLS-scoped to the tenant by the cookie-bound client. Backed by the
// `screenings` table (migration 0010). Returns [] when unconfigured or
// before the migration runs, so the provider workspace degrades gracefully.

import { createSupabaseServerClient } from "../supabase/serverClient";
import { currentTenantId } from "./workspace";
import {
  reportQueryError,
  okResult,
  failedResult,
  type QueryResult,
} from "./observe";

export type ScreeningSource =
  | "oig_leie"
  | "sam_gov"
  | "npdb"
  | "state_medicaid"
  | "ofac"
  | "criminal_background"
  | "license_sanctions"
  | "other";

export type ScreeningResult = "clear" | "flagged" | "pending" | "not_run";

export type DbScreening = {
  id: string;
  source: ScreeningSource;
  result: ScreeningResult;
  checked_on: string | null;
  reference: string | null;
  notes: string | null;
  created_at: string;
};

export const SCREENING_SOURCE_LABEL: Record<ScreeningSource, string> = {
  oig_leie: "OIG LEIE",
  sam_gov: "SAM.gov",
  npdb: "NPDB",
  state_medicaid: "State Medicaid sanctions",
  ofac: "OFAC",
  criminal_background: "Criminal background",
  license_sanctions: "License-board sanctions",
  other: "Other",
};

export const SCREENING_RESULT_LABEL: Record<ScreeningResult, string> = {
  clear: "Clear",
  flagged: "Flagged",
  pending: "Pending",
  not_run: "Not run",
};

// The standard screen set a credentialing file is expected to carry.
export const STANDARD_SCREENS: ScreeningSource[] = [
  "oig_leie",
  "sam_gov",
  "npdb",
  "state_medicaid",
  "criminal_background",
];

const SCREENING_COLS = "id, source, result, checked_on, reference, notes, created_at";

/**
 * Sanctions / exclusion screening history for a provider.
 *
 * Returns a QueryResult rather than a bare array on purpose. An empty
 * screening list means "this provider has no exclusion hits" — which is
 * exactly what a coordinator needs to see before letting someone treat
 * patients and bill federal programs. If the query FAILED, rendering that
 * same empty state would assert a clean OIG/SAM record we never actually
 * verified. That is the one failure mode this panel must not have, so we
 * report the difference and let the UI say "couldn't check".
 */
export async function listScreenings(
  providerId: string,
): Promise<QueryResult<DbScreening>> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return failedResult<DbScreening>();
  const tid = await currentTenantId();
  if (!tid) return failedResult<DbScreening>();
  const { data, error } = await supabase
    .from("screenings")
    .select(SCREENING_COLS)
    .eq("provider_id", providerId)
    .eq("tenant_id", tid)
    .order("created_at", { ascending: false });
  if (error) {
    reportQueryError("listScreenings", error);
    return failedResult<DbScreening>();
  }
  if (!data) return failedResult<DbScreening>();
  return okResult(data as unknown as DbScreening[]);
}
