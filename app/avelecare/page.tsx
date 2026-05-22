// AVEL eCare credentialing portal — Dashboard (root).
// AVEL eCare-branded "command center" view: KPI tiles, pipeline visual,
// alerts panel, service-line filter chips, and a roll-up by space.
// All numbers computed from the seeded data in _data/seed.ts so the
// rest of the portal stays internally consistent with this view.

import Link from "next/link";
import { AvelTopbar } from "./_components/AvelNav";
import {
  PROVIDERS,
  SPACES,
  SERVICE_LINES,
  STAGE_LABEL,
  providersByStage,
  readyToBill,
  readyToWork,
  inPipeline,
  withExpiringCredentials,
  spaceStats,
  type Stage,
} from "./_data/seed";

const STAGES_ORDER: Stage[] = [
  "intake",
  "psv",
  "privileges",
  "compliance",
  "enrollment",
  "ready",
];

function avgDaysToCredential(): number {
  // Just the ready providers' time-in-stage as a stand-in average. In
  // a real system this would compute end-to-end from intake.
  const ready = readyToBill();
  if (ready.length === 0) return 0;
  const total = ready.reduce((acc, p) => acc + p.daysInStage + 28, 0);
  return Math.round(total / ready.length);
}

function avgDaysPayerEnrollment(): number {
  const enrolling = PROVIDERS.filter((p) => p.stage === "enrollment");
  if (enrolling.length === 0) return 22;
  const total = enrolling.reduce((acc, p) => acc + p.daysInStage, 0);
  return Math.round(total / enrolling.length);
}

export default function AvelDashboard() {
  const pipeline = inPipeline().length;
  const ready = readyToBill().length;
  const working = readyToWork().length;
  const expiring = withExpiringCredentials();

  return (
    <>
      <AvelTopbar
        title="Credentialing Command Center"
        subtitle="See which clinicians are ready to deliver and bill virtual care across every AVEL eCare service line and partner facility."
      />

      <div className="avel-content">
        {/* ────────── BRANDED WELCOME BAND ──────────
            Subtle dashboard-only hero ribbon. Sets context that this is
            AVEL eCare's tool the moment the page loads, then steps aside
            so the KPIs do the real work below. */}
        <div className="avel-dash-hero">
          <div className="avel-dash-hero-overlay" />
          <div className="avel-dash-hero-content">
            <div className="avel-dash-hero-eyebrow">Virtual Health System</div>
            <div className="avel-dash-hero-title">
              Welcome back. Here&apos;s where AVEL eCare credentialing stands today.
            </div>
            <div className="avel-dash-hero-meta">
              {PROVIDERS.length} active clinicians · {SPACES.length} spaces &amp; programs · {readyToBill().length} ready to bill
            </div>
          </div>
        </div>

        {/* ────────── KPI ROW ────────── */}
        <div className="avel-kpis">
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Providers in pipeline</div>
            <div className="avel-kpi-val">{pipeline}</div>
            <div className="avel-kpi-delta">Across {SPACES.length} spaces</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Ready to work</div>
            <div className="avel-kpi-val avel-kpi-val-pos">{working}</div>
            <div className="avel-kpi-delta">{Math.round((working / PROVIDERS.length) * 100)}% of roster</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Ready to bill</div>
            <div className="avel-kpi-val avel-kpi-val-pos">{ready}</div>
            <div className="avel-kpi-delta">{Math.round((ready / PROVIDERS.length) * 100)}% of roster</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Avg time to credential</div>
            <div className="avel-kpi-val">{avgDaysToCredential()}<span className="avel-kpi-unit">d</span></div>
            <div className="avel-kpi-delta">Across all service lines</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Avg time to payer enrollment</div>
            <div className="avel-kpi-val">{avgDaysPayerEnrollment()}<span className="avel-kpi-unit">d</span></div>
            <div className="avel-kpi-delta">Active enrollments only</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Credentials expiring (60d)</div>
            <div className="avel-kpi-val avel-kpi-val-warn">{expiring.length}</div>
            <div className="avel-kpi-delta">Review &amp; renew</div>
          </div>
        </div>

        {/* ────────── SERVICE-LINE FILTER STRIP ────────── */}
        <div className="avel-card avel-filter-strip">
          <div className="avel-filter-strip-lbl">Service line</div>
          <div className="avel-filter-strip-chips">
            <span className="avel-chip avel-chip-active">All</span>
            {SERVICE_LINES.map((sl) => (
              <span key={sl} className="avel-chip">{sl}</span>
            ))}
          </div>
        </div>

        {/* ────────── PIPELINE VISUAL ────────── */}
        <div className="avel-card avel-pipeline">
          <div className="avel-card-head">
            <div>
              <div className="avel-card-title">Credentialing pipeline</div>
              <div className="avel-card-sub">Every active AVEL eCare clinician, by current stage. Click a column to drill in.</div>
            </div>
            <Link className="avel-link" href="/avelecare/providers">View all providers →</Link>
          </div>

          <div className="avel-pipeline-cols">
            {STAGES_ORDER.map((stage) => {
              const provs = providersByStage(stage);
              return (
                <div key={stage} className="avel-pipeline-col">
                  <div className="avel-pipeline-col-head">
                    <div className="avel-pipeline-stage">{STAGE_LABEL[stage]}</div>
                    <div className="avel-pipeline-count">{provs.length}</div>
                  </div>
                  <div className="avel-pipeline-body">
                    {provs.length === 0 ? (
                      <div className="avel-pipeline-empty">
                        No providers in this stage — no bottleneck here.
                      </div>
                    ) : (
                      provs.map((p) => (
                        <div key={p.id} className="avel-pipeline-card">
                          <div className="avel-pipeline-av">{p.initials}</div>
                          <div className="avel-pipeline-id">
                            <div className="avel-pipeline-name">{p.name}</div>
                            <div className="avel-pipeline-meta">
                              {p.serviceLines[0]} · Day {p.daysInStage}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ────────── ALERTS + SPACE ROLLUP ────────── */}
        <div className="avel-grid-2">
          <div className="avel-card">
            <div className="avel-card-head">
              <div className="avel-card-title">Key risks &amp; alerts</div>
              <span className="avel-pill avel-pill-warn">{expiring.length + PROVIDERS.filter(p => p.flags.length > 0).length - expiring.length} active</span>
            </div>
            <ul className="avel-alert-list">
              {PROVIDERS.filter((p) => p.flags.length > 0).map((p) => (
                <li key={p.id} className="avel-alert">
                  <div className="avel-alert-icon" aria-hidden="true">{p.flags.some(f => /expir/i.test(f)) ? "⏱" : p.flags.some(f => /pend/i.test(f)) ? "⏳" : "⚐"}</div>
                  <div className="avel-alert-body">
                    <div className="avel-alert-title">
                      <strong>{p.name}</strong>, {p.credentials}
                    </div>
                    <div className="avel-alert-detail">{p.flags[0]}</div>
                  </div>
                  <Link href={`/avelecare/providers`} className="avel-alert-link">Review →</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="avel-card">
            <div className="avel-card-head">
              <div className="avel-card-title">Readiness by space</div>
              <Link className="avel-link" href="/avelecare/spaces">All spaces →</Link>
            </div>
            <div className="avel-space-rollup">
              {SPACES.map((s) => {
                const stats = spaceStats(s.id);
                const pct = stats.total > 0 ? Math.round((stats.ready / stats.total) * 100) : 0;
                return (
                  <Link
                    key={s.id}
                    href={`/avelecare/spaces/${s.slug}`}
                    className="avel-space-row"
                  >
                    <div className="avel-space-row-id">
                      <div className="avel-space-row-name">{s.name}</div>
                      <div className="avel-space-row-meta">{s.region} · {s.serviceLine}</div>
                    </div>
                    <div className="avel-space-row-bar">
                      <span className="avel-space-row-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="avel-space-row-pct">{pct}%</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
