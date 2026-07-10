// Reports & Analytics — example reports that show how Eastside Hospital
// credentialing impacts access, staffing, and revenue. CSS-driven
// bar/heatmap visualizations (no chart library) so the page loads
// fast and styles cleanly with the rest of the portal.

import Link from "next/link";
import { AvelTopbar } from "../_components/AvelNav";

export const metadata = { title: "Reports & Analytics" };

// ──────────────────────────────────────────────────────────────
// Demo data — fabricated but plausible for Eastside Hospital's mix.
// ──────────────────────────────────────────────────────────────

const TIME_TO_CRED: { line: string; days: number; sla: number }[] = [
  { line: "Emergency",          days: 38, sla: 45 },
  { line: "Critical Care / ICU", days: 42, sla: 45 },
  { line: "Hospitalist",        days: 41, sla: 45 },
  { line: "Behavioral Health",  days: 51, sla: 45 },
  { line: "School Health",      days: 47, sla: 45 },
  { line: "EMS",                days: 35, sla: 45 },
  { line: "Senior Care",        days: 44, sla: 45 },
  { line: "Specialty Clinic",   days: 39, sla: 45 },
];

const ENROLLMENT_BY_STATE: { state: string; days: number; volume: number }[] = [
  { state: "WA", days: 32, volume: 18 },
  { state: "MN", days: 41, volume: 24 },
  { state: "KS", days: 28, volume: 12 },
  { state: "NY", days: 52, volume: 14 },
  { state: "SD", days: 24, volume: 9 },
  { state: "ND", days: 26, volume: 8 },
  { state: "IA", days: 33, volume: 11 },
  { state: "NE", days: 30, volume: 6 },
  { state: "OR", days: 38, volume: 7 },
  { state: "TX", days: 47, volume: 5 },
];

const NOT_YET_BILLABLE: { reason: string; count: number; tone: "warn" | "neutral" }[] = [
  { reason: "Payer enrollment pending (Medicaid)", count: 4, tone: "warn" },
  { reason: "PSV awaiting board verification", count: 2, tone: "neutral" },
  { reason: "Facility privileging incomplete", count: 2, tone: "neutral" },
  { reason: "Supervision hours in progress", count: 1, tone: "neutral" },
  { reason: "Intake / onboarding (early stage)", count: 1, tone: "neutral" },
];

const EXPIRATION_HEATMAP: { window: string; emergency: number; icu: number; hosp: number; bh: number; pharm: number; sh: number }[] = [
  { window: "0–30 days",   emergency: 1, icu: 0, hosp: 1, bh: 0, pharm: 1, sh: 0 },
  { window: "31–60 days",  emergency: 0, icu: 1, hosp: 2, bh: 1, pharm: 0, sh: 1 },
  { window: "61–90 days",  emergency: 2, icu: 0, hosp: 1, bh: 2, pharm: 1, sh: 0 },
  { window: "91–180 days", emergency: 3, icu: 2, hosp: 3, bh: 4, pharm: 2, sh: 2 },
];

function heatColor(count: number): string {
  if (count === 0) return "var(--avel-line-soft)";
  if (count === 1) return "rgba(33, 160, 170, 0.18)";
  if (count === 2) return "rgba(33, 160, 170, 0.36)";
  if (count === 3) return "rgba(33, 160, 170, 0.55)";
  return "rgba(33, 160, 170, 0.78)";
}

function heatTextColor(count: number): string {
  return count >= 3 ? "white" : "var(--avel-ink)";
}

export default function AvelReports() {
  return (
    <>
      <AvelTopbar
        title="Reports & Analytics"
        subtitle="Understand how credentialing impacts access, staffing, and revenue across Eastside Hospital's footprint."
      />

      <div className="avel-content">
        {/* ────────── Headline summary cards ────────── */}
        <div className="avel-kpis avel-kpis-4">
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Avg time to credential</div>
            <div className="avel-kpi-val">42<span className="avel-kpi-unit">d</span></div>
            <div className="avel-kpi-delta">3d under 45-day SLA</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Avg time to payer enrollment</div>
            <div className="avel-kpi-val">34<span className="avel-kpi-unit">d</span></div>
            <div className="avel-kpi-delta">Across all states &amp; payers</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Not-yet-billable providers</div>
            <div className="avel-kpi-val avel-kpi-val-warn">10</div>
            <div className="avel-kpi-delta">Of 15 active · 67% billable</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Expirations in next 90d</div>
            <div className="avel-kpi-val avel-kpi-val-warn">17</div>
            <div className="avel-kpi-delta">Renewal workflow auto-runs</div>
          </div>
        </div>

        {/* ────────── Time to credential by service line ────────── */}
        <div className="avel-card">
          <div className="avel-card-head">
            <div>
              <div className="avel-card-title">Time to credential by service line</div>
              <div className="avel-card-sub">
                Average days from intake to ready-to-work. Red bar marks the 45-day SLA.
              </div>
            </div>
            <span className="avel-link" aria-hidden="true">Last 90 days ▾</span>
          </div>
          <div className="rep-barchart">
            {TIME_TO_CRED.map((row) => {
              const pct = Math.min(100, (row.days / 60) * 100); // scale to 60-day max
              const over = row.days > row.sla;
              return (
                <div key={row.line} className="rep-bar-row">
                  <div className="rep-bar-label">{row.line}</div>
                  <div className="rep-bar-track">
                    <span
                      className={`rep-bar-fill ${over ? "rep-bar-fill-warn" : ""}`}
                      style={{ width: `${pct}%` }}
                    />
                    {/* SLA marker line */}
                    <span
                      className="rep-bar-sla"
                      style={{ left: `${(row.sla / 60) * 100}%` }}
                      title="45-day SLA"
                    />
                  </div>
                  <div className="rep-bar-value">
                    {row.days}d
                    {over ? <span className="rep-bar-over"> +{row.days - row.sla}</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="rep-legend">
            <span><span className="rep-legend-swatch" /> under SLA</span>
            <span><span className="rep-legend-swatch rep-legend-swatch-warn" /> over SLA</span>
            <span><span className="rep-legend-line" /> 45-day SLA</span>
          </div>
        </div>

        <div className="avel-grid-2">
          {/* ────────── Time to enrollment by state ────────── */}
          <div className="avel-card">
            <div className="avel-card-head">
              <div>
                <div className="avel-card-title">Time to payer enrollment · by state</div>
                <div className="avel-card-sub">Submission to effective date, weighted by enrollment volume.</div>
              </div>
            </div>
            <table className="avel-table rep-state-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Volume</th>
                  <th>Avg days</th>
                  <th>Distribution</th>
                </tr>
              </thead>
              <tbody>
                {ENROLLMENT_BY_STATE.map((s) => {
                  const pct = Math.min(100, (s.days / 60) * 100);
                  return (
                    <tr key={s.state} className="avel-table-row">
                      <td className="rep-state-name">{s.state}</td>
                      <td className="avel-table-cell-soft">{s.volume}</td>
                      <td>
                        <strong>{s.days}d</strong>
                      </td>
                      <td className="rep-state-bar-cell">
                        <span className="rep-state-bar">
                          <span className="rep-state-bar-fill" style={{ width: `${pct}%` }} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ────────── Not-yet-billable breakdown ────────── */}
          <div className="avel-card">
            <div className="avel-card-head">
              <div>
                <div className="avel-card-title">Not-yet-billable providers</div>
                <div className="avel-card-sub">
                  Why 10 of 15 active clinicians aren&apos;t fully billable yet — and where to unblock them.
                </div>
              </div>
            </div>
            <ul className="rep-reason-list">
              {NOT_YET_BILLABLE.map((r) => (
                <li key={r.reason} className="rep-reason">
                  <div className={`rep-reason-num ${r.tone === "warn" ? "rep-reason-num-warn" : ""}`}>
                    {r.count}
                  </div>
                  <div className="rep-reason-body">
                    <div className="rep-reason-text">{r.reason}</div>
                    <div className="rep-reason-action">
                      {r.tone === "warn"
                        ? "Escalate via payer liaison"
                        : "Routine — track to completion"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="avel-callout-soft">
              Closing the 4 pending Medicaid enrollments would unlock an estimated{" "}
              <strong>$184,000 / month</strong> in billable virtual-care revenue.
            </div>
          </div>
        </div>

        {/* ────────── Credential expiration heatmap ────────── */}
        <div className="avel-card">
          <div className="avel-card-head">
            <div>
              <div className="avel-card-title">Credential expiration risk · next 180 days</div>
              <div className="avel-card-sub">
                Count of expiring credentials by service line. Darker = more renewals
                landing in that window.
              </div>
            </div>
          </div>
          <div className="rep-heatmap">
            <div className="rep-heatmap-head">
              <div></div>
              <div>Emergency</div>
              <div>ICU</div>
              <div>Hospitalist</div>
              <div>Behavioral Health</div>
              <div>Pharmacy</div>
              <div>School Health</div>
            </div>
            {EXPIRATION_HEATMAP.map((row) => (
              <div key={row.window} className="rep-heatmap-row">
                <div className="rep-heatmap-label">{row.window}</div>
                {[row.emergency, row.icu, row.hosp, row.bh, row.pharm, row.sh].map((cnt, i) => (
                  <div
                    key={i}
                    className="rep-heatmap-cell"
                    style={{ background: heatColor(cnt), color: heatTextColor(cnt) }}
                  >
                    {cnt > 0 ? cnt : "·"}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="avel-table-foot">
          Eastside Hospital Reports &amp; Analytics · data through May 2026
          &nbsp;·&nbsp;
          <Link className="avel-link" href="/eastside-hospital">Back to Dashboard</Link>
        </div>
      </div>
    </>
  );
}
