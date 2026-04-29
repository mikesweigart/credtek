// Supervision page — every pre-licensed clinician on one screen, sorted
// by who needs attention this week. This is the BH coordinator's daily
// driver. Today the closest comparable is a Google Sheet that breaks.

import Link from "next/link";
import { PROVIDERS } from "../../_lib/mockProviders";

export const metadata = {
  title: "Supervision",
};

export default function SupervisionPage() {
  const supervisees = PROVIDERS.filter((p) => p.preLicensed);
  const fmt = new Intl.NumberFormat("en-US");

  // Sort by attention-needed: cosig late > earliest projected licensure >
  // alphabetical.
  const sorted = [...supervisees].sort((a, b) => {
    const aLate = a.status === "flag" ? -1 : 0;
    const bLate = b.status === "flag" ? -1 : 0;
    if (aLate !== bLate) return aLate - bLate;
    return a.name.localeCompare(b.name);
  });

  // KPIs
  const cosigOverdue = supervisees.filter((p) => p.status === "flag").length;
  const projectedThisQuarter = supervisees.filter((p) =>
    p.preLicensed?.projectedLicensure?.includes("2026"),
  ).length;
  const totalHoursThisWeek = supervisees.reduce(
    (sum, p) => sum + (p.preLicensed?.weeklyHours ?? 0),
    0,
  );

  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">The thing nobody else does</span>
        <h1>Supervision</h1>
        <p>
          Every pre-licensed clinician on your team. Hours, cosignatures, and
          state-board projections — all current.
        </p>
      </section>

      <section className="kpi-row" style={{ marginBottom: 22 }}>
        <div className="kpi">
          <div className="kpi-lbl">Pre-licensed</div>
          <div className="kpi-val">
            <em>{supervisees.length}</em>
          </div>
          <div className="kpi-delta up">across the team</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Cosig overdue</div>
          <div className="kpi-val">{cosigOverdue}</div>
          <div className={cosigOverdue > 0 ? "kpi-delta flag" : "kpi-delta up"}>
            {cosigOverdue > 0 ? "⚐ supervisor reminder sent" : "all current"}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Hours this week</div>
          <div className="kpi-val">{totalHoursThisWeek}</div>
          <div className="kpi-delta up">across the cohort</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Projected licensure 2026</div>
          <div className="kpi-val">
            <em>{projectedThisQuarter}</em>
          </div>
          <div className="kpi-delta up">FTE moving to independent</div>
        </div>
      </section>

      <div className="dash-panel">
        <div className="dash-panel-head">
          <h3>Roster · sorted by attention needed</h3>
          <span className="filt">CLICK A ROW FOR FULL DETAIL →</span>
        </div>
        {sorted.map((p) => {
          const plan = p.preLicensed!;
          const pct = Math.round(
            (plan.completedHours / plan.requiredHours) * 100,
          );
          const cosig = p.status === "flag";
          return (
            <Link
              key={p.slug}
              href={`/providers/${p.slug}?tab=supervision`}
              className="sup-row"
            >
              <div className="sup-row-av">{p.initials}</div>
              <div className="sup-row-main">
                <div className="sup-row-top">
                  <span className="sup-row-name">
                    {p.name}, {p.credential}
                  </span>
                  <span className="sup-row-target">
                    → {plan.targetCredential} ({plan.state})
                  </span>
                </div>
                <div className="sup-row-bar">
                  <div
                    className="sup-row-bar-fill"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="sup-row-numbers">
                  {fmt.format(plan.completedHours)} /{" "}
                  {fmt.format(plan.requiredHours)} hrs · {pct}% · supervisor{" "}
                  <strong>{plan.supervisor}</strong>
                </div>
              </div>
              <div className="sup-row-side">
                <div className="sup-row-side-label">This week</div>
                <div className="sup-row-side-val">
                  {plan.weeklyHours} hrs
                  {cosig ? (
                    <span className="sup-row-flag">cosig late</span>
                  ) : (
                    <span className="sup-row-ok">cosigned ✓</span>
                  )}
                </div>
              </div>
              <div className="sup-row-side">
                <div className="sup-row-side-label">Projected</div>
                <div className="sup-row-side-val">{plan.projectedLicensure}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div
        className="dash-panel"
        style={{ marginTop: 22, padding: "20px 22px" }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 14,
            color: "var(--ink)",
          }}
        >
          State board rule engines
        </h3>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>
          CredTek tracks each supervisee against the actual rule set for their
          target license — direct client contact ratios, group hour caps,
          supervisor qualification rules, quarterly evaluation cadence.{" "}
          <strong style={{ color: "var(--ink)" }}>
            All 50 states covered.
          </strong>{" "}
          When a state board updates the rules (e.g. CA's recent BBS revision),
          we update the engine once for everyone — no audit panic at your
          group.
        </p>
      </div>
    </>
  );
}
