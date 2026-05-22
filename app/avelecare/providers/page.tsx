// Providers — full Avel clinician roster. Table layout with
// service line / space / readiness chips. Filter chips are
// presentational only in this Phase-1 build; full client-side
// filtering is the next iteration (the seed dataset is small
// enough to render everything in one pass).

import Link from "next/link";
import { AvelTopbar } from "../_components/AvelNav";
import { PROVIDERS, SPACES, STAGE_LABEL } from "../_data/seed";

export const metadata = { title: "Providers" };

export default function AvelProviders() {
  return (
    <>
      <AvelTopbar
        title="Providers"
        subtitle="Track credentialing and enrollment status for every Avel eCare clinician in one place."
      />

      <div className="avel-content">
        {/* ────────── Filter strip + Add button ────────── */}
        <div className="avel-toolbar">
          <div className="avel-toolbar-filters">
            <select className="avel-select" defaultValue="">
              <option value="">All service lines</option>
              <option>Emergency</option>
              <option>Critical Care / ICU</option>
              <option>Hospitalist</option>
              <option>Behavioral Health</option>
              <option>EMS</option>
              <option>Pharmacy</option>
              <option>Senior Care</option>
              <option>School Health</option>
              <option>Specialty Clinic</option>
            </select>
            <select className="avel-select" defaultValue="">
              <option value="">All spaces</option>
              {SPACES.map((s) => (
                <option key={s.id}>{s.shortName}</option>
              ))}
            </select>
            <select className="avel-select" defaultValue="">
              <option value="">All stages</option>
              <option>Intake</option>
              <option>PSV</option>
              <option>Privileges</option>
              <option>Compliance</option>
              <option>Payer Enrollment</option>
              <option>Ready to Bill</option>
            </select>
            <select className="avel-select" defaultValue="">
              <option value="">Any readiness</option>
              <option>Ready to Work</option>
              <option>Ready to Bill</option>
              <option>At risk</option>
              <option>In onboarding</option>
            </select>
          </div>
          <div className="avel-toolbar-actions">
            <button type="button" className="avel-btn-ghost">Bulk import</button>
            <button type="button" className="avel-btn-primary">+ Add provider</button>
          </div>
        </div>

        {/* ────────── Providers table ────────── */}
        <div className="avel-card avel-card-flush">
          <table className="avel-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Role</th>
                <th>Service lines</th>
                <th>States</th>
                <th>Stage</th>
                <th>Ready to work</th>
                <th>Ready to bill</th>
                <th>Flags</th>
              </tr>
            </thead>
            <tbody>
              {PROVIDERS.map((p) => (
                <tr key={p.id} className="avel-table-row">
                  <td>
                    <div className="avel-table-name-cell">
                      <div className="avel-table-av">{p.initials}</div>
                      <div>
                        <div className="avel-table-name">{p.name}, {p.credentials}</div>
                        <div className="avel-table-spec">{p.specialty}</div>
                      </div>
                    </div>
                  </td>
                  <td className="avel-table-cell-soft">{p.role}</td>
                  <td>
                    <div className="avel-cell-chips">
                      {p.serviceLines.map((sl) => (
                        <span key={sl} className="avel-mini-chip">{sl.split(" / ")[0]}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="avel-cell-states">{p.statesLicensed.join(" · ")}</div>
                  </td>
                  <td>
                    <span className={`avel-stage-pill stage-${p.stage}`}>
                      {STAGE_LABEL[p.stage]}
                    </span>
                  </td>
                  <td>
                    {p.readyToWork ? (
                      <span className="avel-readiness avel-readiness-yes">Yes</span>
                    ) : (
                      <span className="avel-readiness avel-readiness-no">No</span>
                    )}
                  </td>
                  <td>
                    {p.readyToBill ? (
                      <span className="avel-readiness avel-readiness-yes">Yes</span>
                    ) : (
                      <span className="avel-readiness avel-readiness-no">No</span>
                    )}
                  </td>
                  <td className="avel-table-flags">
                    {p.flags.length > 0 ? (
                      <span className="avel-flag" title={p.flags.join("; ")}>
                        ⚐ {p.flags[0].length > 36 ? p.flags[0].slice(0, 34) + "…" : p.flags[0]}
                      </span>
                    ) : (
                      <span className="avel-table-cell-soft">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="avel-table-foot">
          Showing {PROVIDERS.length} of {PROVIDERS.length} providers · Avel eCare clinician roster, May 2026
          &nbsp;·&nbsp;
          <Link className="avel-link" href="/avelecare">Back to Dashboard</Link>
        </div>
      </div>
    </>
  );
}
