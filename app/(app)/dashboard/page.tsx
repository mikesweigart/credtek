// Coordinator dashboard. All data is mocked from /app/_lib/mockProviders.ts —
// the real Supabase queries land here in week 2-3 of the build plan, and
// the visual structure (KPI tiles, pipeline rows, agent feed) is what the
// landing page sells, so partners see continuity from marketing to demo.

import Link from "next/link";
import { AGENT_FEED, PROVIDERS } from "../../_lib/mockProviders";

export const metadata = {
  title: "Dashboard",
};

const STATUS_PILL_CLASS: Record<string, string> = {
  active: "pstat s-active",
  enrolling: "pstat s-pending",
  supervision: "pstat s-pending",
  flag: "pstat s-flag",
};

export default function DashboardPage() {
  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">Coordinator cockpit · live demo</span>
        <h1>Good morning, Marisol.</h1>
        <p>3 items need approval · 2 expirations in the next 14 days</p>
      </section>

      <section className="kpi-row">
        <div className="kpi">
          <div className="kpi-lbl">Active providers</div>
          <div className="kpi-val">
            <em>214</em>
          </div>
          <div className="kpi-delta up">↑ 12 vs. last month</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">In credentialing</div>
          <div className="kpi-val">31</div>
          <div className="kpi-delta up">↑ 8 vs. last month</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Avg days to active</div>
          <div className="kpi-val">
            <em>42</em>
          </div>
          <div className="kpi-delta up">↓ 47 days vs. baseline</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Expiring &lt; 30d</div>
          <div className="kpi-val">7</div>
          <div className="kpi-delta flag">⚐ 2 critical</div>
        </div>
      </section>

      <section className="dash-grid">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <h3>Pipeline · 31 providers</h3>
            <span className="filt">CLICK A ROW →</span>
          </div>
          {PROVIDERS.map((p) => (
            <Link
              key={p.slug}
              href={`/providers/${p.slug}`}
              className="dash-row"
            >
              <div className="dash-row-av">{p.initials}</div>
              <div>
                <div className="dash-row-name">
                  {p.name}, {p.credential}
                </div>
                <div className="dash-row-meta">{p.meta}</div>
              </div>
              <div className="dash-row-states">
                {p.licenseStates.join("·")}
              </div>
              <div className={STATUS_PILL_CLASS[p.status]}>{p.statusLabel}</div>
            </Link>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h3>Agent activity</h3>
            <span className="filt">LIVE</span>
          </div>
          <div className="dash-feed">
            {AGENT_FEED.map((ev, i) => {
              const dotClass =
                ev.tone === "gold"
                  ? "dash-ev-dot gold"
                  : ev.tone === "danger"
                    ? "dash-ev-dot danger"
                    : "dash-ev-dot";
              return (
                <div key={i} className="dash-ev">
                  <div className={dotClass}></div>
                  <div>
                    <div
                      className="dash-ev-text"
                      dangerouslySetInnerHTML={{ __html: ev.text }}
                    />
                    <div className="dash-ev-time">{ev.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
