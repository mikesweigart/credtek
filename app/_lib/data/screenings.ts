// Background-check / sanctions-screening reads for the real app.
// RLS-scoped to the tenant by the cookie-bound client. Backed by the
// `screenings` table (migration 0010). Returns [] when unconfigured or
// before the migration runs, so the provider workspace degrades gracefully.

import { createSupabaseServerClient } from "../supabase/serverClient";
import { currentTenantId } from "./workspace";

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

export async function listScreenings(providerId: string): Promise<DbScreening[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const tid = await currentTenantId();
  if (!tid) return [];
  const { data, error } = await supabase
    .from("screenings")
    .select(SCREENING_COLS)
    .eq("provider_id", providerId)
    .eq("tenant_id", tid)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as unknown as DbScreening[];
}
