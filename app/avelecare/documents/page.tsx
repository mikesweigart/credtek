// Documents & Compliance — central library showing every credentialing
// document across the AVEL eCare roster. Demo data linked to real
// providers from _data/seed.ts so the page feels internally consistent
// with the rest of the portal.

import Link from "next/link";
import { AvelTopbar } from "../_components/AvelNav";
import { PROVIDERS, SPACES } from "../_data/seed";

export const metadata = { title: "Documents & Compliance" };

type DocStatus = "Current" | "Expiring soon" | "Expired" | "Pending" | "Awaiting upload";

type DocRow = {
  id: string;
  name: string;
  type:
    | "State License"
    | "DEA Registration"
    | "Board Certification"
    | "Malpractice (COI)"
    | "CV"
    | "Background Check"
    | "Reference"
    | "Hospital Privileging"
    | "Training Cert"
    | "NPDB Query";
  providerSlug: string;
  spaceId?: string;
  expires?: string;
  status: DocStatus;
  size: string;
};

// Seeded credentialing documents — realistic mix per provider, with
// at least one expiring item to drive the dashboard alert state.
const DOCS: DocRow[] = [
  // Alex Johnson (Emergency · WA + MN)
  { id: "d-001", name: "WA Medical License — A. Johnson", type: "State License", providerSlug: "alex-johnson", spaceId: "east-adams", expires: "Apr 14, 2027", status: "Current", size: "412 KB" },
  { id: "d-002", name: "MN Medical License — A. Johnson", type: "State License", providerSlug: "alex-johnson", spaceId: "mn-rural", expires: "Sep 30, 2026", status: "Current", size: "388 KB" },
  { id: "d-003", name: "DEA Registration — A. Johnson", type: "DEA Registration", providerSlug: "alex-johnson", expires: "Jul 2, 2027", status: "Current", size: "208 KB" },
  { id: "d-004", name: "Malpractice COI 2026 — A. Johnson", type: "Malpractice (COI)", providerSlug: "alex-johnson", expires: "Jan 1, 2027", status: "Current", size: "1.2 MB" },

  // Daniel Kim — expiring WA license (drives dashboard alert)
  { id: "d-005", name: "WA Medical License — D. Kim", type: "State License", providerSlug: "daniel-kim", spaceId: "east-adams", expires: "Jun 12, 2026", status: "Expiring soon", size: "404 KB" },
  { id: "d-006", name: "OR Medical License — D. Kim", type: "State License", providerSlug: "daniel-kim", expires: "Mar 8, 2027", status: "Current", size: "401 KB" },
  { id: "d-007", name: "Malpractice COI 2026 — D. Kim", type: "Malpractice (COI)", providerSlug: "daniel-kim", expires: "Mar 1, 2027", status: "Current", size: "980 KB" },
  { id: "d-008", name: "Board Cert — Internal Medicine — D. Kim", type: "Board Certification", providerSlug: "daniel-kim", expires: "Dec 31, 2029", status: "Current", size: "612 KB" },

  // Sarah Chen (BH · NY)
  { id: "d-009", name: "NY Medical License — S. Chen", type: "State License", providerSlug: "sarah-chen", spaceId: "ny-crisis", expires: "Aug 22, 2027", status: "Current", size: "395 KB" },
  { id: "d-010", name: "Board Cert — Psychiatry — S. Chen", type: "Board Certification", providerSlug: "sarah-chen", status: "Pending", size: "—" },
  { id: "d-011", name: "CV — S. Chen", type: "CV", providerSlug: "sarah-chen", status: "Current", size: "248 KB" },

  // James Mitchell (LCSW · NY)
  { id: "d-012", name: "NY LCSW License — J. Mitchell", type: "State License", providerSlug: "james-mitchell", spaceId: "ny-crisis", expires: "Oct 30, 2027", status: "Current", size: "302 KB" },
  { id: "d-013", name: "Malpractice COI — J. Mitchell", type: "Malpractice (COI)", providerSlug: "james-mitchell", expires: "Jan 1, 2027", status: "Current", size: "1.1 MB" },
  { id: "d-014", name: "Background Check — J. Mitchell", type: "Background Check", providerSlug: "james-mitchell", status: "Current", size: "184 KB" },

  // Robert Hayes (Emergency · KS)
  { id: "d-015", name: "KS Medical License — R. Hayes", type: "State License", providerSlug: "robert-hayes", spaceId: "ks-rhtp", expires: "May 17, 2027", status: "Current", size: "421 KB" },
  { id: "d-016", name: "Board Cert — Emergency Medicine — R. Hayes", type: "Board Certification", providerSlug: "robert-hayes", expires: "Dec 31, 2028", status: "Current", size: "598 KB" },
  { id: "d-017", name: "DEA Registration — R. Hayes", type: "DEA Registration", providerSlug: "robert-hayes", expires: "Nov 4, 2027", status: "Current", size: "215 KB" },

  // Aisha Patel (supervision)
  { id: "d-018", name: "TX LPC-A License — A. Patel", type: "State License", providerSlug: "aisha-patel", spaceId: "school-health", expires: "Jul 1, 2027", status: "Current", size: "291 KB" },
  { id: "d-019", name: "Supervision Plan — A. Patel", type: "Training Cert", providerSlug: "aisha-patel", status: "Current", size: "542 KB" },

  // Olivia Reed — onboarding (some missing)
  { id: "d-020", name: "SD Nursing License — O. Reed", type: "State License", providerSlug: "olivia-reed", spaceId: "school-health", expires: "Feb 28, 2028", status: "Current", size: "278 KB" },
  { id: "d-021", name: "CV — O. Reed", type: "CV", providerSlug: "olivia-reed", status: "Current", size: "201 KB" },
  { id: "d-022", name: "Background Check — O. Reed", type: "Background Check", providerSlug: "olivia-reed", status: "Awaiting upload", size: "—" },
  { id: "d-023", name: "Pediatric Care Attestation — O. Reed", type: "Training Cert", providerSlug: "olivia-reed", status: "Awaiting upload", size: "—" },

  // Kevin Park (PharmD)
  { id: "d-024", name: "MN Pharmacist License — K. Park", type: "State License", providerSlug: "kevin-park", spaceId: "senior-care", expires: "Mar 20, 2027", status: "Current", size: "356 KB" },
  { id: "d-025", name: "DEA Registration — K. Park", type: "DEA Registration", providerSlug: "kevin-park", expires: "Aug 14, 2026", status: "Expiring soon", size: "210 KB" },
];

function statusClass(s: DocStatus): string {
  switch (s) {
    case "Current":          return "doc-status-ok";
    case "Expiring soon":    return "doc-status-warn";
    case "Expired":          return "doc-status-bad";
    case "Pending":          return "doc-status-pending";
    case "Awaiting upload":  return "doc-status-missing";
  }
}

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
        subtitle="One source of truth for every credentialing and compliance document across AVEL eCare."
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
          <Link className="avel-link" href="/avelecare">Back to Dashboard</Link>
        </div>
      </div>
    </>
  );
}
