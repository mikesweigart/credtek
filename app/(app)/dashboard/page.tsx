// Coordinator dashboard. All data is mocked from /app/_lib/mockProviders.ts —
// the real Supabase queries land here in week 2-3 of the build plan, and
// the visual structure (KPI tiles, pipeline rows, agent feed) is what the
// landing page sells, so partners see continuity from marketing to demo.

import Link from "next/link";
import { AGENT_FEED, PROVIDERS } from "../../_lib/mockProviders";
import { NavIcon } from "../../_components/NavIcon";

export const metadata = {
  title: "Dashboard",
};

const STATUS_PILL_CLASS: Record<string, string> = {
  active: "pstat s-active",
  enrolling: "pstat s-pending",
  supervision: "pstat s-pending",
  flag: "pstat s-flag",
};

// How far through the credentialing pipeline each status sits — drives the
// per-row progress bar so a coordinator can read momentum at a glance.
const STAGE_PCT: Record<string, number> = {
  active: 100,
  enrolling: 65,
  supervision: 45,
  flag: 30,
};

type Kpi = {
  icon: string;
  label: string;
  value: string;
  emphasis?: boolean;
  trend: { dir: "up" | "down" | "flag"; text: string };
};

const KPIS: Kpi[] = [
  { icon: "providers", label: "Active providers", value: "214", trend: { dir: "up", text: "12 this month" } },
  { icon: "recred", label: "In credentialing", value: "31", trend: { dir: "up", text: "8 this month" } },
  {
    icon: "zap",
    label: "Avg days to active",
    value: "42",
    emphasis: true,
    trend: { dir: "up", text: "47d faster" },
  },
  { icon: "alert", label: "Expiring < 30 days", value: "7", trend: { dir: "flag", text: "2 critical" } },
];

function TrendChip({ dir, text }: { dir: "up" | "down" | "flag"; text: string }) {
  const iconName = dir === "flag" ? "alert" : dir === "down" ? "trendDown" : "trendUp";
  return (
    <span className={`kpi-trend t-${dir}`}>
      <NavIcon name={iconName} size={12} />
      {text}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">Coordinator cockpit · live demo</span>
        <h1>Good morning, Marisol.</h1>
        <p>Here&rsquo;s what needs you today, and how your panel is moving.</p>
      </section>

      {/* Point-to-flow — the single most important action, up top. */}
      <Link href="/approvals" className="dash-cta-strip">
        <span className="dash-cta-ic">
          <NavIcon name="approvals" size={20} />
        </span>
        <span className="dash-cta-body">
          <strong>3 approvals waiting</strong>
          <span>Payer enrollment drafts are ready for your review.</span>
        </span>
        <span className="dash-cta-go">
          Review now <NavIcon name="chevron" size={15} />
        </span>
      </Link>

      <section className="kpi-row">
        {KPIS.map((k) => (
          <div key={k.label} className={k.emphasis ? "kpi kpi-hero" : "kpi"}>
            <div className="kpi-top">
              <span className="kpi-ic">
                <NavIcon name={k.icon} size={17} />
              </span>
              <TrendChip dir={k.trend.dir} text={k.trend.text} />
            </div>
            <div className="kpi-val">{k.emphasis ? <em>{k.value}</em> : k.value}</div>
            <div className="kpi-lbl">{k.label}</div>
          </div>
        ))}
      </section>

      <section className="dash-grid">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <h3>Pipeline · 31 in progress</h3>
            <Link href="/providers" className="dash-panel-link">
              View all <NavIcon name="chevron" size={14} />
            </Link>
          </div>
          {PROVIDERS.map((p) => (
            <Link key={p.slug} href={`/providers/${p.slug}`} className="dash-row">
              <div className="dash-row-av">{p.initials}</div>
              <div className="dash-row-main">
                <div className="dash-row-name">
                  {p.name}, {p.credential}
                </div>
                <div className="dash-row-meta">{p.meta}</div>
                <div className="dash-row-prog" aria-hidden="true">
                  <span
                    className={`dash-row-prog-bar s-${p.status}`}
                    style={{ width: `${STAGE_PCT[p.status] ?? 50}%` }}
                  />
                </div>
              </div>
              <div className="dash-row-states">{p.licenseStates.join("·")}</div>
              <div className={STATUS_PILL_CLASS[p.status]}>{p.statusLabel}</div>
            </Link>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h3>Agent activity</h3>
            <span className="dash-live">
              <span className="dash-live-dot" />
              LIVE
            </span>
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
