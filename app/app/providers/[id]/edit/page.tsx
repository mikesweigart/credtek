// Edit a provider — pre-filled native form + updateProvider server action.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getProviderById } from "../../../../_lib/data/providers";
import { updateProvider } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProviderPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const p = await getProviderById(id);
  if (!p) return notFound();

  return (
    <div className="portal-form-wrap">
      <div className="portal-head">
        <Link href={`/app/providers/${p.id}`} className="portal-back">← {p.name}</Link>
        <h1 className="portal-h1">Edit provider</h1>
      </div>

      <form action={updateProvider} className="portal-form">
        <input type="hidden" name="providerId" value={p.id} />

        <label className="portal-field">
          <span className="portal-label">Full name *</span>
          <input name="name" type="text" required defaultValue={p.name} className="portal-input" />
        </label>

        <div className="portal-field-row">
          <label className="portal-field">
            <span className="portal-label">Credential</span>
            <input name="credential" type="text" defaultValue={p.credential ?? ""} className="portal-input" />
          </label>
          <label className="portal-field">
            <span className="portal-label">NPI</span>
            <input name="npi" type="text" inputMode="numeric" defaultValue={p.npi ?? ""} className="portal-input" />
          </label>
        </div>

        <label className="portal-field">
          <span className="portal-label">Primary specialty</span>
          <input name="specialty" type="text" defaultValue={p.specialty ?? ""} className="portal-input" />
        </label>

        <label className="portal-field">
          <span className="portal-label">States licensed</span>
          <input name="states" type="text" defaultValue={(p.license_states ?? []).join(", ")} className="portal-input" />
          <span className="portal-help">Comma-separated two-letter codes.</span>
        </label>

        <label className="portal-field">
          <span className="portal-label">Status</span>
          <select name="status" className="portal-input" defaultValue={p.status}>
            <option value="enrolling">Enrolling</option>
            <option value="active">Active</option>
            <option value="supervision">In supervision</option>
            <option value="flag">Needs attention</option>
          </select>
        </label>

        <div className="portal-form-actions">
          <Link href={`/app/providers/${p.id}`} className="acct-btn-secondary">Cancel</Link>
          <button type="submit" className="acct-btn-primary">Save changes</button>
        </div>
      </form>
    </div>
  );
}
