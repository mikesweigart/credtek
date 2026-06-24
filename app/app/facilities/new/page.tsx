// Add a facility — native form + server action that PERSISTS to Supabase,
// scoped to the signed-in user's tenant (RLS-enforced). Progressive
// enhancement: works without client JS.

import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../../_lib/supabase/serverClient";
import { getSessionContext } from "../../../_lib/data/workspace";
import { slugify } from "../../../_lib/data/providers";
import { FACILITY_TYPE_LABEL, type FacilityType } from "../../../_lib/data/facilities";

export const dynamic = "force-dynamic";

const VALID_TYPES = Object.keys(FACILITY_TYPE_LABEL) as FacilityType[];

async function createFacility(formData: FormData) {
  "use server";
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");
  if (!ctx.tenantId) redirect("/app/facilities/new?error=tenant");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/app/facilities/new?error=name");

  const typeRaw = String(formData.get("facility_type") ?? "clinic_group");
  const facility_type = (VALID_TYPES.includes(typeRaw as FacilityType)
    ? typeRaw
    : "clinic_group") as FacilityType;
  const npi = String(formData.get("npi") ?? "").trim() || null;
  const primary_state =
    String(formData.get("primary_state") ?? "").trim().toUpperCase().slice(0, 2) || null;
  const locationsRaw = Number.parseInt(String(formData.get("locations") ?? "1"), 10);
  const locations = Number.isFinite(locationsRaw) ? Math.max(1, Math.min(locationsRaw, 100000)) : 1;
  const status = String(formData.get("status") ?? "enrolling");

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/app/facilities/new?error=db");

  const { error: saveError } = await supabase.from("facilities").insert({
    tenant_id: ctx.tenantId,
    slug: slugify(name),
    name,
    facility_type,
    npi,
    primary_state,
    locations,
    status,
  });
  if (saveError) redirect("/app/facilities/new?error=save");

  revalidatePath("/app/facilities");
  revalidatePath("/app");
  redirect("/app/facilities");
}

const ERROR_MESSAGES: Record<string, string> = {
  name: "Please enter the facility's name.",
  tenant:
    "Your workspace isn't fully set up yet, so nothing was saved. Try signing out and back in — if it keeps happening, contact support.",
  db: "We couldn't reach the database just now. Nothing was saved — please try again in a moment.",
  save: "Something went wrong saving this facility. Nothing was saved — please check the details and try again.",
};

export default async function NewFacilityPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await props.searchParams;
  const errorMessage = error ? ERROR_MESSAGES[error] : null;

  return (
    <div className="portal-form-wrap">
      <div className="portal-head">
        <Link href="/app/facilities" className="portal-back">← Facilities</Link>
        <h1 className="portal-h1">Add a facility</h1>
        <p className="portal-sub">
          Create a facility record. You can add licensure, accreditation, CLIA, CMS enrollment, and
          payer contracts next.
        </p>
      </div>

      <form action={createFacility} className="portal-form">
        {errorMessage && (
          <div className="portal-form-error" role="alert">{errorMessage}</div>
        )}

        <label className="portal-field">
          <span className="portal-label">Facility name *</span>
          <input name="name" type="text" required placeholder="Lakeside Surgical Center" className="portal-input" />
        </label>

        <div className="portal-field-row">
          <label className="portal-field">
            <span className="portal-label">Facility type</span>
            <select name="facility_type" className="portal-input" defaultValue="clinic_group">
              {VALID_TYPES.map((t) => (
                <option key={t} value={t}>{FACILITY_TYPE_LABEL[t]}</option>
              ))}
            </select>
          </label>
          <label className="portal-field">
            <span className="portal-label">Type-2 NPI</span>
            <input name="npi" type="text" inputMode="numeric" placeholder="Organizational NPI" className="portal-input" />
          </label>
        </div>

        <div className="portal-field-row">
          <label className="portal-field">
            <span className="portal-label">Primary state</span>
            <input name="primary_state" type="text" placeholder="GA" maxLength={2} className="portal-input" />
          </label>
          <label className="portal-field">
            <span className="portal-label">Locations</span>
            <input name="locations" type="number" min={1} defaultValue={1} className="portal-input" />
            <span className="portal-help"># of physical sites under this facility.</span>
          </label>
        </div>

        <label className="portal-field">
          <span className="portal-label">Status</span>
          <select name="status" className="portal-input" defaultValue="enrolling">
            <option value="enrolling">Enrolling</option>
            <option value="active">Active</option>
            <option value="revalidation">Revalidation</option>
            <option value="flag">Needs attention</option>
          </select>
        </label>

        <div className="portal-form-actions">
          <Link href="/app/facilities" className="acct-btn-secondary">Cancel</Link>
          <button type="submit" className="acct-btn-primary">Create facility</button>
        </div>
      </form>
    </div>
  );
}
