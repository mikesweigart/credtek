// Credentialing sub-records for a provider — licenses, credentials,
// documents, payer enrollments — plus the reference payer list. All
// reads are RLS-scoped to the signed-in user's tenant.

import { createSupabaseServerClient } from "../supabase/serverClient";
import { currentTenantId } from "./workspace";

export type ExpirableStatus = "active" | "expiring_soon" | "expired" | "pending" | "awaiting";
export type CredentialKind = "state_license" | "dea" | "cds" | "board_cert" | "coi_malpractice" | "caqh" | "other";
export type EnrollmentStatus = "not_started" | "drafted" | "submitted" | "awaiting_info" | "active" | "denied" | "termed";
export type Stage = "intake" | "psv" | "privileging" | "committee" | "enrollment" | "approved";

export const STAGE_ORDER: Stage[] = ["intake", "psv", "privileging", "committee", "enrollment", "approved"];
export const STAGE_LABEL: Record<Stage, string> = {
  intake: "Intake",
  psv: "Primary Source Verification",
  privileging: "Privileging",
  committee: "Committee review",
  enrollment: "Payer enrollment",
  approved: "Approved · ready to bill",
};

export const CREDENTIAL_KIND_LABEL: Record<CredentialKind, string> = {
  state_license: "State license",
  dea: "DEA registration",
  cds: "CDS registration",
  board_cert: "Board certification",
  coi_malpractice: "Malpractice (COI)",
  caqh: "CAQH attestation",
  other: "Other",
};

export type DbLicense = {
  id: string;
  state: string;
  license_number: string | null;
  status: ExpirableStatus;
  expires_on: string | null;
};
export type DbCredential = {
  id: string;
  kind: CredentialKind;
  identifier: string | null;
  status: ExpirableStatus;
  expires_on: string | null;
};
export type DbDocument = {
  id: string;
  name: string;
  doc_type: string;
  status: string;
  expires_on: string | null;
  created_at: string;
};
export type DbEnrollment = {
  id: string;
  payer_id: string;
  state: string | null;
  status: EnrollmentStatus;
  submitted_on: string | null;
  effective_date: string | null;
  payers: { name: string; short_name: string | null } | { name: string; short_name: string | null }[] | null;
};
export type DbPayer = { id: string; name: string; short_name: string | null };

export async function listLicenses(providerId: string): Promise<DbLicense[]> {
  const s = await createSupabaseServerClient();
  if (!s) return [];
  const tid = await currentTenantId();
  if (!tid) return [];
  const { data } = await s
    .from("provider_licenses")
    .select("id, state, license_number, status, expires_on")
    .eq("provider_id", providerId)
    .eq("tenant_id", tid)
    .order("expires_on", { ascending: true });
  return (data as DbLicense[]) ?? [];
}

export async function listCredentials(providerId: string): Promise<DbCredential[]> {
  const s = await createSupabaseServerClient();
  if (!s) return [];
  const tid = await currentTenantId();
  if (!tid) return [];
  const { data } = await s
    .from("provider_credentials")
    .select("id, kind, identifier, status, expires_on")
    .eq("provider_id", providerId)
    .eq("tenant_id", tid)
    .order("expires_on", { ascending: true });
  return (data as DbCredential[]) ?? [];
}

export async function listDocuments(providerId: string): Promise<DbDocument[]> {
  const s = await createSupabaseServerClient();
  if (!s) return [];
  const tid = await currentTenantId();
  if (!tid) return [];
  const { data } = await s
    .from("documents")
    .select("id, name, doc_type, status, expires_on, created_at")
    .eq("provider_id", providerId)
    .eq("tenant_id", tid)
    .order("created_at", { ascending: false });
  return (data as DbDocument[]) ?? [];
}

export async function listEnrollments(providerId: string): Promise<DbEnrollment[]> {
  const s = await createSupabaseServerClient();
  if (!s) return [];
  const tid = await currentTenantId();
  if (!tid) return [];
  const { data } = await s
    .from("enrollments")
    .select("id, payer_id, state, status, submitted_on, effective_date, payers ( name, short_name )")
    .eq("provider_id", providerId)
    .eq("tenant_id", tid)
    .order("created_at", { ascending: false });
  return (data as DbEnrollment[]) ?? [];
}

export async function listPayers(): Promise<DbPayer[]> {
  const s = await createSupabaseServerClient();
  if (!s) return [];
  const { data } = await s.from("payers").select("id, name, short_name").order("name");
  return (data as DbPayer[]) ?? [];
}

export function payerName(e: DbEnrollment): string {
  if (!e.payers) return "—";
  if (Array.isArray(e.payers)) return e.payers[0]?.name ?? "—";
  return e.payers.name ?? "—";
}
