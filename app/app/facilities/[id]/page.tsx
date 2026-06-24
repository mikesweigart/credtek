// Real facility detail — the facility's own credentialing record.

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getFacilityById,
  FACILITY_TYPE_LABEL,
  FACILITY_STATUS_LABEL,
} from "../../../_lib/data/facilities";

export const dynamic = "force-dynamic";

// The facility-level credentialing file we build and keep current.
const FILE_ITEMS = [
  "Facility / operating license",
  "Accreditation (Joint Commission · HFAP · DNV)",
  "CLIA certificate (labs)",
  "CMS-855A Medicare/Medicaid enrollment",
  "Type-2 NPI",
  "Certificate of insurance (malpractice / GL)",
  "Payer facility contracts",
];

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const f = await getFacilityById(id);
  return { title: f ? `${f.name} · CredTek` : "Facility not found" };
}

export default async function FacilityDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const f = await getFacilityById(id);
  if (!f) notFound();

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

      <div className="portal-grid-2">
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
          <h2 className="portal-card-h">Credentialing file</h2>
          <p className="portal-sub" style={{ marginTop: 0 }}>
            What we build and keep current for this facility.
          </p>
          <ul className="portal-checklist">
            {FILE_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
