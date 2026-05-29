// Add a provider — native form + server action that PERSISTS to
// Supabase, scoped to the signed-in user's tenant (RLS-enforced).
// Works without client JS (progressive enhancement).

import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../../_lib/supabase/serverClient";
import { getSessionContext } from "../../../_lib/data/workspace";
import { slugify } from "../../../_lib/data/providers";

export const dynamic = "force-dynamic";

async function createProvider(formData: FormData) {
  "use server";
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");
  if (!ctx.tenantId) redirect("/app/providers");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/app/providers/new?error=name");

  const credential = String(formData.get("credential") ?? "").trim() || null;
  const npi = String(formData.get("npi") ?? "").trim() || null;
  const specialty = String(formData.get("specialty") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "enrolling");
  const states = String(formData.get("states") ?? "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/app/providers");

  await supabase.from("providers").insert({
    tenant_id: ctx.tenantId,
    slug: slugify(name),
    name,
    credential,
    npi,
    specialty,
    status,
    license_states: states,
  });

  revalidatePath("/app/providers");
  revalidatePath("/app");
  redirect("/app/providers");
}

export default async function NewProviderPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await props.searchParams;

  return (
    <div className="portal-form-wrap">
      <div className="portal-head">
        <Link href="/app/providers" className="portal-back">← Providers</Link>
        <h1 className="portal-h1">Add a provider</h1>
        <p className="portal-sub">Create a clinician record. You can add licenses, documents, and enrollments next.</p>
      </div>

      <form action={createProvider} className="portal-form">
        {error === "name" && (
          <div className="portal-form-error">Please enter the provider&apos;s name.</div>
        )}

        <label className="portal-field">
          <span className="portal-label">Full name *</span>
          <input name="name" type="text" required placeholder="Dr. Sarah Reyes" className="portal-input" />
        </label>

        <div className="portal-field-row">
          <label className="portal-field">
            <span className="portal-label">Credential</span>
            <input name="credential" type="text" placeholder="MD · DO · NP · LCSW" className="portal-input" />
          </label>
          <label className="portal-field">
            <span className="portal-label">NPI</span>
            <input name="npi" type="text" inputMode="numeric" placeholder="10-digit NPI" className="portal-input" />
          </label>
        </div>

        <label className="portal-field">
          <span className="portal-label">Primary specialty</span>
          <input name="specialty" type="text" placeholder="Emergency Medicine" className="portal-input" />
        </label>

        <label className="portal-field">
          <span className="portal-label">States licensed</span>
          <input name="states" type="text" placeholder="WA, MN, GA" className="portal-input" />
          <span className="portal-help">Comma-separated two-letter codes.</span>
        </label>

        <label className="portal-field">
          <span className="portal-label">Status</span>
          <select name="status" className="portal-input" defaultValue="enrolling">
            <option value="enrolling">Enrolling</option>
            <option value="active">Active</option>
            <option value="supervision">In supervision</option>
            <option value="flag">Needs attention</option>
          </select>
        </label>

        <div className="portal-form-actions">
          <Link href="/app/providers" className="acct-btn-secondary">Cancel</Link>
          <button type="submit" className="acct-btn-primary">Create provider</button>
        </div>
      </form>
    </div>
  );
}
