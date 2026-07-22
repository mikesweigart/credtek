"use server";

// Sample data — one click and the workspace shows the platform working.
// Five providers, intentionally spaced across stages with realistic
// timing so the dashboard immediately renders KPIs, automation badges,
// and at least one SLA red flag.
//
// Safety:
//  • Editor-only (server-side checked).
//  • Marks every seeded row in meta JSON so reset() only removes ours.
//  • No-op (with a helpful redirect) if the workspace already has any
//    providers, to avoid surprising users with real data.

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../_lib/supabase/serverClient";
import { supabaseAdmin } from "../../_lib/supabase/server";
import { getSessionContext, canEdit } from "../../_lib/data/workspace";
import { slugify } from "../../_lib/data/providers";

const SEED_TAG = "credtek:sample";

type EnrollmentStatus = "not_started" | "drafted" | "submitted" | "awaiting_info" | "active" | "denied" | "termed";

type SeedSpec = {
  name: string;
  credential: string;
  npi: string;
  specialty: string;
  states: string[];
  stage: "intake" | "psv" | "privileging" | "committee" | "enrollment" | "approved";
  daysAgoEntered: number; // how long they've been in their current stage
  status: "active" | "enrolling" | "supervision" | "flag";
  email: string; // contact email (lives in meta JSON so the follow-up sender can use it)
  licenses?: { state: string; license_number: string; status: string; expires_on: string | null }[];
  credentials?: { kind: string; identifier: string; status: string; expires_on: string | null }[];
  /** Per-state enrollment outcomes by payer short_name */
  enrollments?: { state: string; payerKey: string; status: EnrollmentStatus; effective?: string; submitted?: string }[];
};

// Stable identifier for sample payers, used as short_name so we can find
// them on reseed without hitting unique-constraint problems (the table
// has no name unique key).
const SAMPLE_PAYERS = [
  { short_name: "Medicare",  name: "Medicare (CMS)",        kind: "medicare" },
  { short_name: "UHC",       name: "UnitedHealthcare",      kind: "commercial" },
  { short_name: "Aetna",     name: "Aetna",                 kind: "commercial" },
  { short_name: "BCBS",      name: "Blue Cross Blue Shield", kind: "commercial" },
  { short_name: "Cigna",     name: "Cigna Healthcare",      kind: "commercial" },
  { short_name: "Humana",    name: "Humana",                kind: "commercial" },
];

const SEED: SeedSpec[] = [
  {
    name: "Dr. Sarah Reyes",
    credential: "PsyD",
    npi: "1487209456",
    specialty: "Psychology",
    states: ["TX", "FL", "GA"],
    stage: "intake",
    daysAgoEntered: 1,
    status: "enrolling",
    email: "sarah.reyes@example.com",
    licenses: [
      { state: "TX", license_number: "PSY-44219", status: "active", expires_on: dateInDays(180) },
    ],
    // Intake stage — no enrollments started yet (every cell will show as a gap)
  },
  {
    name: "James Mitchell",
    credential: "LCSW",
    npi: "2109834567",
    specialty: "Behavioral Health",
    states: ["CA", "OR"],
    stage: "psv",
    daysAgoEntered: 12, // 10-day SLA — flagged
    status: "flag",
    email: "j.mitchell@example.com",
    licenses: [
      { state: "CA", license_number: "LCS-23488", status: "active", expires_on: dateInDays(220) },
      { state: "OR", license_number: "LCS-118203", status: "active", expires_on: dateInDays(310) },
    ],
    credentials: [
      { kind: "caqh", identifier: "CAQH-29384772", status: "active", expires_on: dateInDays(120) },
    ],
    // PSV — too early for enrollments
  },
  {
    name: "Dr. Alex Johnson",
    credential: "MD",
    npi: "1326004587",
    specialty: "Emergency Medicine",
    states: ["WA", "MN", "ID"],
    stage: "privileging",
    daysAgoEntered: 9,
    status: "enrolling",
    email: "alex.johnson@example.com",
    licenses: [
      { state: "WA", license_number: "MD-66201", status: "active", expires_on: dateInDays(270) },
      { state: "MN", license_number: "MD-21884", status: "active", expires_on: dateInDays(190) },
    ],
    credentials: [
      { kind: "dea", identifier: "AJ1234567", status: "active", expires_on: dateInDays(540) },
      { kind: "board_cert", identifier: "ABEM-44827", status: "active", expires_on: dateInDays(910) },
    ],
    // Privileging stage — a couple of payer apps already drafted ahead of stage advance
    enrollments: [
      { state: "WA", payerKey: "Medicare", status: "drafted" },
      { state: "WA", payerKey: "UHC",      status: "drafted" },
    ],
  },
  {
    name: "Dr. Priya Raman",
    credential: "MD",
    npi: "1598243710",
    specialty: "Cardiology",
    states: ["NY", "NJ"],
    stage: "enrollment",
    daysAgoEntered: 18,
    status: "enrolling",
    email: "p.raman@example.com",
    licenses: [
      { state: "NY", license_number: "MD-89012", status: "active", expires_on: dateInDays(360) },
      { state: "NJ", license_number: "MD-71045", status: "active", expires_on: dateInDays(450) },
    ],
    credentials: [
      { kind: "dea", identifier: "PR9876543", status: "active", expires_on: dateInDays(620) },
      { kind: "board_cert", identifier: "ABIM-29103", status: "active", expires_on: dateInDays(1100) },
    ],
    // Mid-enrollment — mix of submitted, awaiting, denial (appeal in flight), some active
    enrollments: [
      { state: "NY", payerKey: "Medicare", status: "active",        effective: dateInDays(-7) },
      { state: "NY", payerKey: "UHC",      status: "submitted",     submitted: dateInDays(-12) },
      { state: "NY", payerKey: "Aetna",    status: "awaiting_info", submitted: dateInDays(-18) },
      { state: "NY", payerKey: "BCBS",     status: "submitted",     submitted: dateInDays(-10) },
      { state: "NY", payerKey: "Cigna",    status: "denied",        submitted: dateInDays(-22) },
      { state: "NJ", payerKey: "Medicare", status: "active",        effective: dateInDays(-7) },
      { state: "NJ", payerKey: "UHC",      status: "submitted",     submitted: dateInDays(-14) },
      { state: "NJ", payerKey: "Aetna",    status: "drafted" },
    ],
  },
  {
    name: "Marcus Webb",
    credential: "NP",
    npi: "1734590821",
    specialty: "Family Practice",
    states: ["CO"],
    stage: "approved",
    daysAgoEntered: 4,
    status: "active",
    email: "m.webb@example.com",
    licenses: [
      { state: "CO", license_number: "NP-55207", status: "active", expires_on: dateInDays(420) },
    ],
    credentials: [
      { kind: "dea", identifier: "MW5432109", status: "active", expires_on: dateInDays(700) },
      { kind: "caqh", identifier: "CAQH-50983217", status: "active", expires_on: dateInDays(200) },
    ],
    // Approved + billable across the major payers; one humana still in flight
    enrollments: [
      { state: "CO", payerKey: "Medicare", status: "active", effective: dateInDays(-32) },
      { state: "CO", payerKey: "UHC",      status: "active", effective: dateInDays(-30) },
      { state: "CO", payerKey: "Aetna",    status: "active", effective: dateInDays(-25) },
      { state: "CO", payerKey: "BCBS",     status: "active", effective: dateInDays(-22) },
      { state: "CO", payerKey: "Cigna",    status: "active", effective: dateInDays(-18) },
      { state: "CO", payerKey: "Humana",   status: "submitted", submitted: dateInDays(-15) },
    ],
  },
];

function dateInDays(d: number): string {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString().slice(0, 10);
}
function timeAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export async function seedSampleData() {
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");
  if (!canEdit(ctx.role) || !ctx.tenantId) redirect("/app?error=role");

  const s = await createSupabaseServerClient();
  if (!s) redirect("/app?error=db");

  // Don't overwrite real data. If anything exists, just open the dashboard.
  const { data: existing } = await s.from("providers").select("id").limit(1);
  if (existing && existing.length > 0) {
    redirect("/app?seeded=exists");
  }

  // Resolve the sample payers to IDs. Payers are GLOBAL reference data with
  // SELECT-only RLS — there is NO insert policy, so a tenant's cookie-bound
  // client cannot create the ones it's missing. That silently dropped every
  // sample enrollment (the payer_id lookup below returns null), leaving the
  // flagship "billable" story empty. Seed them with the service-role admin
  // client, which is the correct owner for shared reference data anyway, and
  // guarantees our short_names resolve regardless of what migration 0001
  // pre-seeded. Fall back to the cookie client only if the service-role key
  // is absent (best-effort — reads are allowed, the insert may no-op).
  // IMPORTANT: `payers` is GLOBAL reference data — no tenant_id, no unique
  // constraint on name. Anything inserted here is permanently visible in
  // EVERY tenant's payer list. So we match against what already exists as
  // aggressively as we can, and only create a row as a last resort.
  //
  // An exact short_name lookup is not good enough: migration 0001 seeds
  // "Anthem BCBS" while SAMPLE_PAYERS uses "BCBS", so the exact match
  // misses and we'd insert a duplicate BCBS that every customer sees.
  // Bias deliberately toward matching — linking a sample enrollment to a
  // near-identical payer is harmless; polluting shared reference data for
  // all tenants is not.
  const payerWriter = supabaseAdmin() ?? s;
  const payerIdByKey: Record<string, string> = {};

  const { data: allPayers } = await payerWriter
    .from("payers")
    .select("id, name, short_name");

  const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
  const overlaps = (a: string, b: string) =>
    Boolean(a && b) && (a === b || a.includes(b) || b.includes(a));

  for (const sample of SAMPLE_PAYERS) {
    const sn = norm(sample.short_name);
    const nm = norm(sample.name);
    const hit = (allPayers ?? []).find((py) => {
      const psn = norm((py.short_name as string) ?? "");
      const pnm = norm((py.name as string) ?? "");
      return overlaps(psn, sn) || overlaps(pnm, nm) || overlaps(pnm, sn) || overlaps(psn, nm);
    });
    if (hit) payerIdByKey[sample.short_name] = hit.id as string;
  }

  const toInsert = SAMPLE_PAYERS.filter((p) => !(p.short_name in payerIdByKey));
  if (toInsert.length > 0) {
    const { data: inserted } = await payerWriter
      .from("payers")
      .insert(toInsert)
      .select("id, short_name");
    for (const py of inserted ?? []) {
      if (py.short_name) payerIdByKey[py.short_name as string] = py.id as string;
    }
  }

  // Insert providers, then their licenses/credentials/enrollments.
  for (const p of SEED) {
    const enteredAt = timeAgo(p.daysAgoEntered);
    const createdAt = timeAgo(p.daysAgoEntered + 1); // entered after created
    const { data: prov, error } = await s
      .from("providers")
      .insert({
        tenant_id: ctx.tenantId,
        slug: slugify(p.name),
        name: p.name,
        credential: p.credential,
        npi: p.npi,
        status: p.status,
        specialty: p.specialty,
        license_states: p.states,
        meta: JSON.stringify({ source: SEED_TAG, email: p.email }),
        credentialing_stage: p.stage,
        stage_entered_at: enteredAt,
        created_at: createdAt,
      })
      .select("id")
      .single();

    if (error || !prov) continue;

    if (p.licenses?.length) {
      await s.from("provider_licenses").insert(
        p.licenses.map((l) => ({
          tenant_id: ctx.tenantId,
          provider_id: prov.id,
          state: l.state,
          license_number: l.license_number,
          status: l.status,
          expires_on: l.expires_on,
        }))
      );
    }

    if (p.credentials?.length) {
      await s.from("provider_credentials").insert(
        p.credentials.map((c) => ({
          tenant_id: ctx.tenantId,
          provider_id: prov.id,
          kind: c.kind,
          identifier: c.identifier,
          status: c.status,
          expires_on: c.expires_on,
        }))
      );
    }

    if (p.enrollments?.length) {
      const rows = p.enrollments
        .map((e) => {
          const payer_id = payerIdByKey[e.payerKey];
          if (!payer_id) return null;
          return {
            tenant_id: ctx.tenantId,
            provider_id: prov.id,
            payer_id,
            state: e.state,
            status: e.status,
            effective_date: e.effective ?? null,
            submitted_on: e.submitted ?? null,
          };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null);
      if (rows.length > 0) {
        await s.from("enrollments").insert(rows);
      }
    }
  }

  revalidatePath("/app");
  revalidatePath("/app/providers");
  revalidatePath("/app/followups");
  revalidatePath("/app/coverage");
  redirect("/app?seeded=ok");
}

export async function resetSampleData() {
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");
  if (!canEdit(ctx.role) || !ctx.tenantId) redirect("/app?error=role");

  const s = await createSupabaseServerClient();
  if (!s) redirect("/app?error=db");

  // Only delete rows we tagged in meta as sample data — never touches real providers.
  const { data: ours } = await s
    .from("providers")
    .select("id, meta")
    .ilike("meta", `%${SEED_TAG}%`);

  if (ours && ours.length) {
    const ids = ours.map((p) => p.id as string);
    // ON DELETE CASCADE on FK takes care of licenses/credentials/enrollments/documents.
    await s.from("providers").delete().in("id", ids);
  }

  // Note: we intentionally do NOT delete sample payers — they're global
  // reference rows that real enrollments may reference. Leaving them in
  // place is the safe + idempotent choice.

  revalidatePath("/app");
  revalidatePath("/app/providers");
  revalidatePath("/app/followups");
  revalidatePath("/app/coverage");
  redirect("/app?seeded=cleared");
}
