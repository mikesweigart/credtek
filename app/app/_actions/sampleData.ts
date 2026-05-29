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
import { getSessionContext, canEdit } from "../../_lib/data/workspace";
import { slugify } from "../../_lib/data/providers";

const SEED_TAG = "credtek:sample";

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
};

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

  // Insert providers, then their licenses/credentials.
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
  }

  revalidatePath("/app");
  revalidatePath("/app/providers");
  revalidatePath("/app/followups");
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

  revalidatePath("/app");
  revalidatePath("/app/providers");
  revalidatePath("/app/followups");
  redirect("/app?seeded=cleared");
}
