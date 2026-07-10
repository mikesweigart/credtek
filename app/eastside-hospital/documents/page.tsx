// Documents & Compliance — central library showing every credentialing
// document across the Eastside Hospital roster. Demo data linked to real
// providers from _data/seed.ts so the page feels internally consistent
// with the rest of the portal.

import Link from "next/link";
import { AvelTopbar } from "../_components/AvelNav";
import { PROVIDERS, SPACES } from "../_data/seed";
import { DOCS, docStatusClass as statusClass } from "../_data/documents";

export const metadata = { title: "Documents & Compliance" };

function providerName(slug: string): string {
  return PROVIDERS.find((p) => p.slug === slug)?.name ?? "—";
}

function spaceName(id?: string): string {
  if (!id) return "—";
  return SPACES.find((s) => s.id === id)?.shortName ?? "—";
}

export default function AvelDocuments() {
  const expiringCount = DOCS.filter((d) => d.status === "Expiring soon" || d.status === "Expired").length;
  const pendingCount = DOCS.filter((d) => d.status === "Pending" || d.status === "Awaiting upload").length;
  const currentCount = DOCS.filter((d) => d.status === "Current").length;

  return (
    <>
      <AvelTopbar
        title="Documents & Compliance"
        subtitle="One source of truth for every credentialing and compliance document across Eastside Hospital."
      />

      <div className="avel-content">
        {/* ────────── KPI tiles ────────── */}
        <div className="avel-kpis avel-kpis-4">
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Total documents</div>
            <div className="avel-kpi-val">{DOCS.length}</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Current</div>
            <div className="avel-kpi-val avel-kpi-val-pos">{currentCount}</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Expiring / expired</div>
            <div className="avel-kpi-val avel-kpi-val-warn">{expiringCount}</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Pending / missing</div>
            <div className="avel-kpi-val">{pendingCount}</div>
          </div>
        </div>

        {/* ────────── Toolbar ────────── */}
        <div className="avel-toolbar">
          <div className="avel-toolbar-filters">
            <select className="avel-select" defaultValue="">
              <option value="">All providers</option>
              {PROVIDERS.map((p) => <option key={p.id}>{p.name}</option>)}
            </select>
            <select className="avel-select" defaultValue="">
              <option value="">All spaces</option>
              {SPACES.map((s) => <option key={s.id}>{s.shortName}</option>)}
            </select>
            <select className="avel-select" defaultValue="">
              <option value="">All document types</option>
              <option>State License</option>
              <option>DEA Registration</option>
              <option>Board Certification</option>
              <option>Malpractice (COI)</option>
              <option>CV</option>
              <option>Background Check</option>
              <option>Reference</option>
              <option>Hospital Privileging</option>
              <option>Training Cert</option>
              <option>NPDB Query</option>
            </select>
            <select className="avel-select" defaultValue="">
              <option value="">Any status</option>
              <option>Current</option>
              <option>Expiring soon</option>
              <option>Expired</option>
              <option>Pending</option>
              <option>Awaiting upload</option>
            </select>
          </div>
          <div className="avel-toolbar-actions">
            <button type="button" className="avel-btn-ghost">Export CSV</button>
            <button type="button" className="avel-btn-primary">+ Upload document</button>
          </div>
        </div>

        {/* ────────── Documents table ────────── */}
        <div className="avel-card avel-card-flush">
          <table className="avel-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Provider</th>
                <th>Space</th>
                <th>Expires</th>
                <th>Size</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {DOCS.map((d) => (
                <tr key={d.id} className="avel-table-row">
                  <td>
                    <div className="doc-name">
                      <span className="doc-name-icon" aria-hidden="true">📄</span>
                      <span>{d.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="doc-type-pill">{d.type}</span>
                  </td>
                  <td className="avel-table-cell-soft">{providerName(d.providerSlug)}</td>
                  <td className="avel-table-cell-soft">{spaceName(d.spaceId)}</td>
                  <td className="avel-table-cell-soft">{d.expires ?? "—"}</td>
                  <td className="avel-table-cell-soft">{d.size}</td>
                  <td>
                    <span className={`doc-status-pill ${statusClass(d.status)}`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="avel-table-foot">
          Showing {DOCS.length} of {DOCS.length} documents
          &nbsp;·&nbsp;
          <Link className="avel-link" href="/eastside-hospital">Back to Dashboard</Link>
        </div>
      </div>
    </>
  );
}
