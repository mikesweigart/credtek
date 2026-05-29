// Real provider detail — reads the live record (RLS-scoped to tenant).

import Link from "next/link";
import { notFound } from "next/navigation";
import { getProviderById } from "../../../_lib/data/providers";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  enrolling: "Enrolling",
  supervision: "Supervision",
  flag: "Needs attention",
};

export default async function PortalProviderDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const p = await getProviderById(id);
  if (!p) return notFound();

  return (
    <div>
      <div className="portal-head">
        <Link href="/app/providers" className="portal-back">← Providers</Link>
        <h1 className="portal-h1">
          {p.name}{p.credential ? `, ${p.credential}` : ""}
        </h1>
        <p className="portal-sub">
          {p.specialty ?? "—"} ·{" "}
          <span className={`portal-status portal-status-${p.status}`}>
            {STATUS_LABEL[p.status] ?? p.status}
          </span>
        </p>
      </div>

      <div className="portal-card">
        <dl className="portal-detail-grid">
          <div><dt>NPI</dt><dd>{p.npi ?? "—"}</dd></div>
          <div><dt>Specialty</dt><dd>{p.specialty ?? "—"}</dd></div>
          <div><dt>States licensed</dt><dd>{p.license_states?.length ? p.license_states.join(" · ") : "—"}</dd></div>
          <div><dt>Status</dt><dd>{STATUS_LABEL[p.status] ?? p.status}</dd></div>
          <div><dt>Added</dt><dd>{new Date(p.created_at).toLocaleDateString()}</dd></div>
        </dl>
      </div>

      <div className="portal-card">
        <div className="portal-card-head">
          <h2>Credentialing</h2>
        </div>
        <p className="portal-muted">
          Licensure, primary-source verification, payer enrollment, and documents attach here.
          Coming in the next build — for now this record is saved to your workspace and editable.
        </p>
      </div>
    </div>
  );
}
