// Multi-state license matrix. Reuses the .state-cell.* classes from the
// landing-page mockup so partners see visual continuity from marketing
// to product.

import { LICENSE_TOTALS, STATES } from "../../_lib/mockProviders";

export const metadata = {
  title: "Licenses",
};

export default function LicensesPage() {
  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">Multi-state command</span>
        <h1>License Matrix</h1>
        <p>
          {STATES.length} jurisdictions · 214 providers · updated 2 minutes ago
        </p>
      </section>

      <section className="kpi-row" style={{ marginBottom: 28 }}>
        <div className="kpi">
          <div className="kpi-lbl">Active licenses</div>
          <div className="kpi-val">
            <em>{LICENSE_TOTALS.active}</em>
          </div>
          <div className="kpi-delta up">across the team</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Compact eligible</div>
          <div className="kpi-val">{LICENSE_TOTALS.compactEligible}</div>
          <div className="kpi-delta up">PSYPACT · CC · SWC</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">In progress</div>
          <div className="kpi-val">{LICENSE_TOTALS.inProgress}</div>
          <div className="kpi-delta up">avg 28 days to issue</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Expiring &lt; 30d</div>
          <div className="kpi-val">{LICENSE_TOTALS.expiringSoon}</div>
          <div className="kpi-delta flag">⚐ auto-renewals drafted</div>
        </div>
      </section>

      <div
        className="dash-panel"
        style={{ padding: "20px 22px", marginBottom: 18 }}
      >
        <div
          className="lga-legend"
          style={{ marginBottom: 16, fontSize: 11 }}
        >
          <span>
            <span
              className="swatch"
              style={{ background: "var(--ink)" }}
            ></span>{" "}
            Licensed
          </span>
          <span>
            <span
              className="swatch"
              style={{
                background: "rgba(123,158,137,0.3)",
                border: "1px solid rgba(123,158,137,0.5)",
              }}
            ></span>{" "}
            Compact eligible
          </span>
          <span>
            <span
              className="swatch"
              style={{
                background: "rgba(201,146,61,0.2)",
                border: "1px solid rgba(201,146,61,0.5)",
              }}
            ></span>{" "}
            In progress
          </span>
          <span>
            <span
              className="swatch"
              style={{
                background: "rgba(184,85,63,0.15)",
                border: "1px solid rgba(184,85,63,0.5)",
              }}
            ></span>{" "}
            Expiring &lt;30d
          </span>
          <span>
            <span
              className="swatch"
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line)",
              }}
            ></span>{" "}
            Eligible · no provider
          </span>
        </div>

        <div className="state-grid">
          {STATES.map((s) => (
            <div
              key={s.code}
              className={`state-cell ${s.status}`}
              title={`${s.name} — ${labelForStatus(s.status)}`}
            >
              {s.code}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          fontSize: 13,
          color: "var(--muted)",
          marginTop: 12,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.04em",
        }}
      >
        HOVER ANY STATE FOR FULL NAME · CLICK COMING IN V2
      </div>
    </>
  );
}

function labelForStatus(s: string): string {
  switch (s) {
    case "licensed":
      return "Licensed";
    case "compact":
      return "Compact eligible";
    case "pending":
      return "In progress";
    case "expiring":
      return "Expiring within 30 days";
    case "eligible":
      return "Eligible · no provider currently practicing";
    default:
      return s;
  }
}
