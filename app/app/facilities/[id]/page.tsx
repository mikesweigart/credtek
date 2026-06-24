// Real facility detail — the facility's own credentialing file, managed
// live: licensure, accreditation, CLIA, CMS-855A, COI. Mirrors the
// provider workspace (RLS-scoped, role-gated server actions).

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getFacilityById,
  listFacilityCredentials,
  FACILITY_TYPE_LABEL,
  FACILITY_STATUS_LABEL,
  FACILITY_CREDENTIAL_KIND_LABEL,
  type FacilityCredentialKind,
} from "../../../_lib/data/facilities";
import { getSessionContext, canEdit } from "../../../_lib/data/workspace";
import { addFacilityCredential, deleteFacilityCredential } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_OPTS = ["active", "pending", "expiring_soon", "expired"];

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const f = await getFacilityById(id);
  return { title: f ? `${f.name} · CredTek` : "Facility not found" };
}

export default async function FacilityDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const [f, creds, ctx] = await Promise.all([
    getFacilityById(id),
    listFacilityCredentials(id),
    getSessionContext(),
  ]);
  if (!f) notFound();
  const editor = canEdit(ctx.role);

  const created = (() => {
    try {
      return new Date(f.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  })();

  return (
    <div>
      <div className="portal-head">
        <Link href="/app/facilities" className="portal-back">← Facilities</Link>
        <div className="portal-head-row">
          <div>
            <h1 className="portal-h1">{f.name}</h1>
            <p className="portal-sub">
              {FACILITY_TYPE_LABEL[f.facility_type] ?? f.facility_type}
              {f.primary_state ? ` · ${f.primary_state}` : ""}
              {f.locations > 1 ? ` · ${f.locations} locations` : ""}
            </p>
          </div>
          <span className={`portal-status portal-status-${f.status}`}>
            {FACILITY_STATUS_LABEL[f.status] ?? f.status}
          </span>
        </div>
      </div>

      <div className="portal-card">
        <h2 className="portal-card-h">Facility record</h2>
        <dl className="portal-dl">
          <div className="portal-dl-row"><dt>Type</dt><dd>{FACILITY_TYPE_LABEL[f.facility_type] ?? f.facility_type}</dd></div>
          <div className="portal-dl-row"><dt>Type-2 NPI</dt><dd>{f.npi ?? "—"}</dd></div>
          <div className="portal-dl-row"><dt>Primary state</dt><dd>{f.primary_state ?? "—"}</dd></div>
          <div className="portal-dl-row"><dt>Locations</dt><dd>{f.locations}</dd></div>
          <div className="portal-dl-row"><dt>Status</dt><dd>{FACILITY_STATUS_LABEL[f.status] ?? f.status}</dd></div>
          <div className="portal-dl-row"><dt>Added</dt><dd>{created}</dd></div>
        </dl>
      </div>

      <div className="portal-card">
        <div className="portal-card-head">
          <h2>Credentialing file</h2>
          <span className="portal-muted">{creds.length} item{creds.length === 1 ? "" : "s"}</span>
        </div>

        {editor && (
          <form action={addFacilityCredential} className="portal-inline-form">
            <input type="hidden" name="facilityId" value={f.id} />
            <select name="kind" className="portal-input" defaultValue="facility_license">
              {(Object.keys(FACILITY_CREDENTIAL_KIND_LABEL) as FacilityCredentialKind[]).map((k) => (
                <option key={k} value={k}>{FACILITY_CREDENTIAL_KIND_LABEL[k]}</option>
              ))}
            </select>
            <input name="identifier" placeholder="Number / ID" className="portal-input portal-input-sm" />
            <input name="issuer" placeholder="Issuer (JC, CMS…)" className="portal-input portal-input-sm" />
            <select name="status" className="portal-input portal-input-sm" defaultValue="active">
              {STATUS_OPTS.map((o) => <option key={o} value={o}>{o.replace("_", " ")}</option>)}
            </select>
            <input name="expires_on" type="date" className="portal-input portal-input-sm" aria-label="Expires" />
            <button type="submit" className="acct-btn-primary">Add</button>
          </form>
        )}

        {creds.length === 0 ? (
          <p className="portal-muted">
            No credentials on file yet. The standard facility file: operating license · accreditation (JC/HFAP/DNV)
            · CLIA (labs) · CMS-855A Medicare/Medicaid · certificate of insurance.
          </p>
        ) : (
          <ul className="portal-rows">
            {creds.map((c) => (
              <li key={c.id} className="portal-row">
                <span className="portal-row-main">
                  {FACILITY_CREDENTIAL_KIND_LABEL[c.kind] ?? c.kind}
                  {c.identifier ? ` · ${c.identifier}` : ""}
                  {c.issuer ? ` · ${c.issuer}` : ""}
                </span>
                <span className={`portal-pill portal-pill-${c.status}`}>{c.status.replace("_", " ")}</span>
                <span className="portal-row-meta">{c.expires_on ? `exp ${c.expires_on}` : "—"}</span>
                {editor && (
                  <form action={deleteFacilityCredential} className="portal-del-form">
                    <input type="hidden" name="facilityId" value={f.id} />
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className="portal-del-btn" aria-label="Remove">✕</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
