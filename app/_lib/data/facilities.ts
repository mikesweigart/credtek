// Facility reads/writes for the real app. RLS-scoped to the signed-in
// user's tenant by the cookie-bound Supabase client — exactly like
// providers, because a facility is a credentialed entity in its own right
// (its own licenses, accreditation, CLIA, CMS enrollment, payer contracts).
//
// Backed by the `facilities` table (migration 0009). Reads return [] / null
// when the backend isn't configured, so the app degrades gracefully.

import { createSupabaseServerClient } from "../supabase/serverClient";

export type FacilityType =
  | "hospital"
  | "asc"
  | "urgent_care"
  | "clinic_group"
  | "laboratory"
  | "imaging_center"
  | "bh_facility"
  | "snf_ltc"
  | "pharmacy"
  | "other";

export type FacilityStatus = "active" | "enrolling" | "revalidation" | "flag";

export type DbFacility = {
  id: string;
  slug: string;
  name: string;
  facility_type: FacilityType;
  npi: string | null; // organizational (Type 2) NPI
  status: FacilityStatus;
  status_label: string | null;
  primary_state: string | null;
  locations: number;
  meta: string | null;
  created_at: string;
};

export const FACILITY_TYPE_LABEL: Record<FacilityType, string> = {
  hospital: "Hospital",
  asc: "Ambulatory Surgery Center",
  urgent_care: "Urgent care",
  clinic_group: "Clinic / group practice",
  laboratory: "Laboratory (CLIA)",
  imaging_center: "Imaging center",
  bh_facility: "Behavioral health facility",
  snf_ltc: "Skilled nursing / LTC",
  pharmacy: "Pharmacy",
  other: "Other",
};

export const FACILITY_STATUS_LABEL: Record<FacilityStatus, string> = {
  active: "Active",
  enrolling: "Enrolling",
  revalidation: "Revalidation",
  flag: "Needs attention",
};

// Explicit projection — never select("*") for a list (over-fetch + unstable).
const FACILITY_COLS =
  "id, slug, name, facility_type, npi, status, status_label, primary_state, locations, meta, created_at";

// Hard ceiling so one tenant's growth can't OOM a render.
const MAX_FACILITIES_FETCH = 1000;

export type ListFacilitiesOptions = {
  limit?: number;
  offset?: number;
};

export async function listFacilities(
  opts: ListFacilitiesOptions = {},
): Promise<DbFacility[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const limit = Math.min(
    Math.max(opts.limit ?? MAX_FACILITIES_FETCH, 1),
    MAX_FACILITIES_FETCH,
  );
  const offset = Math.max(opts.offset ?? 0, 0);

  const { data, error } = await supabase
    .from("facilities")
    .select(FACILITY_COLS)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error || !data) return [];
  return data as unknown as DbFacility[];
}

/** Exact tenant-scoped count (HEAD request — no rows over the wire). */
export async function countFacilities(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return 0;
  const { count, error } = await supabase
    .from("facilities")
    .select("id", { count: "exact", head: true });
  if (error || count == null) return 0;
  return count;
}

export async function getFacilityById(id: string): Promise<DbFacility | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("facilities")
    .select(FACILITY_COLS)
    .eq("id", id)
    .maybeSingle();
  return (data as unknown as DbFacility) ?? null;
}
