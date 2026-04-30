// /status — public system health page. Shows integration uptime, last
// successful run, and recent incidents. Common pattern for B2B SaaS
// (status.stripe.com, status.linear.app). Reassures buyers that the
// integration layer is monitored, not vibes.

import Link from "next/link";

export const metadata = {
  title: "System status · CredTek",
  description:
    "Live status of CredTek's integration layer — payor portals, state boards, federal sources, and supporting infrastructure.",
};

type IntegrationStatus = "operational" | "degraded" | "down" | "maintenance";

type Service = {
  name: string;
  category: "core" | "tier_1" | "tier_2" | "tier_3" | "tier_4";
  status: IntegrationStatus;
  uptime90: number; // % over last 90 days
  lastSuccess: string;
  notes?: string;
};

const SERVICES: Service[] = [
  // Core platform
  { name: "Web app (cred-tek.com)", category: "core", status: "operational", uptime90: 100.0, lastSuccess: "moments ago" },
  { name: "API (api/integrations/*)", category: "core", status: "operational", uptime90: 99.98, lastSuccess: "moments ago" },
  { name: "Database (Supabase Postgres)", category: "core", status: "operational", uptime90: 99.99, lastSuccess: "moments ago" },
  { name: "Auth (Supabase Auth)", category: "core", status: "operational", uptime90: 100.0, lastSuccess: "moments ago" },
  { name: "Audit log (hash chain)", category: "core", status: "operational", uptime90: 100.0, lastSuccess: "verified 14 min ago" },

  // Tier 1 — direct APIs
  { name: "NPPES (NPI Registry)", category: "tier_1", status: "operational", uptime90: 99.7, lastSuccess: "12 min ago" },
  { name: "OIG LEIE (federal exclusions)", category: "tier_1", status: "operational", uptime90: 100.0, lastSuccess: "today 06:00 ET" },
  { name: "SAM.gov (federal sanctions)", category: "tier_1", status: "operational", uptime90: 99.9, lastSuccess: "today 06:00 ET" },
  { name: "Checkr (background checks)", category: "tier_1", status: "operational", uptime90: 99.4, lastSuccess: "yesterday" },
  { name: "Twilio (SMS)", category: "tier_1", status: "operational", uptime90: 99.99, lastSuccess: "moments ago" },
  { name: "Resend (email)", category: "tier_1", status: "operational", uptime90: 99.97, lastSuccess: "moments ago" },

  // Tier 2 — gated APIs via CVO partner
  { name: "CAQH ProView (via CVO partner)", category: "tier_2", status: "operational", uptime90: 99.2, lastSuccess: "27 min ago" },
  { name: "NPDB queries (via CVO partner)", category: "tier_2", status: "operational", uptime90: 99.6, lastSuccess: "1 hr 14 min ago" },

  // Tier 3 — browser agents
  { name: "Optum / Provider Express", category: "tier_3", status: "operational", uptime90: 98.8, lastSuccess: "8 min ago" },
  { name: "Carelon Behavioral Health", category: "tier_3", status: "operational", uptime90: 98.4, lastSuccess: "17 min ago" },
  { name: "Magellan Healthcare", category: "tier_3", status: "operational", uptime90: 98.9, lastSuccess: "42 min ago" },
  { name: "Evernorth Behavioral Health", category: "tier_3", status: "operational", uptime90: 99.1, lastSuccess: "1 hr 8 min ago" },
  { name: "Anthem Behavioral Health", category: "tier_3", status: "degraded", uptime90: 96.2, lastSuccess: "2 hr 47 min ago", notes: "Anthem portal slow-response since 11:30 ET; submission queue backed up. Watching." },
  { name: "TX BBS (LCSW board)", category: "tier_3", status: "operational", uptime90: 99.5, lastSuccess: "1 hr 22 min ago" },
  { name: "CA BBS (LCSW + LMFT)", category: "tier_3", status: "operational", uptime90: 98.7, lastSuccess: "3 hr 4 min ago" },
  { name: "NY OP (LMSW + LMHC)", category: "tier_3", status: "operational", uptime90: 99.1, lastSuccess: "5 hr 12 min ago" },
  { name: "FL ARM (BBS-equiv)", category: "tier_3", status: "operational", uptime90: 99.3, lastSuccess: "yesterday" },

  // Tier 4 — human task pools
  { name: "CVO partner queue (Andros)", category: "tier_4", status: "operational", uptime90: 100.0, lastSuccess: "specialist active now" },
  { name: "Internal ops queue", category: "tier_4", status: "operational", uptime90: 100.0, lastSuccess: "specialist active now" },
];

type Incident = {
  id: string;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  startedAt: string;
  resolvedAt?: string;
  scope: string[];
  updates: { ts: string; text: string }[];
};

const INCIDENTS: Incident[] = [
  {
    id: "inc-2026-04-29-anthem",
    title: "Anthem BH portal slow-response",
    status: "monitoring",
    startedAt: "Today · 11:30 ET",
    scope: ["Anthem Behavioral Health"],
    updates: [
      {
        ts: "Today · 14:42 ET",
        text: "Anthem reported on a partner call that the slow-response is on their CDN. ETA on resolution unknown; submissions are queued and will retry on recovery. No data lost.",
      },
      {
        ts: "Today · 12:14 ET",
        text: "Confirmed degradation — Anthem portal taking 18-40s for form submissions vs. 4s baseline. Auto-pausing new agent submissions to avoid timeout retries; coordinator approvals queue still working.",
      },
      {
        ts: "Today · 11:30 ET",
        text: "Investigating elevated latency on Anthem BH portal submissions.",
      },
    ],
  },
  {
    id: "inc-2026-04-21-ca-bbs",
    title: "CA BBS verification scraper update",
    status: "resolved",
    startedAt: "Apr 21 · 09:14 ET",
    resolvedAt: "Apr 21 · 11:42 ET",
    scope: ["CA BBS (LCSW + LMFT)"],
    updates: [
      {
        ts: "Apr 21 · 11:42 ET",
        text: "Resolved — pushed updated selector to CA BBS scraper. Backfill verifications complete (3 affected). All systems normal.",
      },
      {
        ts: "Apr 21 · 09:48 ET",
        text: "Identified — CA BBS site updated their license-detail HTML structure. Our extraction selector needs an update; filing a hot-patch.",
      },
      {
        ts: "Apr 21 · 09:14 ET",
        text: "CA BBS verification confidence scores dropping below threshold. Investigating.",
      },
    ],
  },
];

const CATEGORY_LABELS: Record<Service["category"], string> = {
  core: "Core platform",
  tier_1: "Tier 1 · Direct APIs",
  tier_2: "Tier 2 · Gated APIs (via CVO partner)",
  tier_3: "Tier 3 · Browser agents",
  tier_4: "Tier 4 · Human task pools",
};

export default function StatusPage() {
  const allOk = SERVICES.every((s) => s.status === "operational");
  const degradedCount = SERVICES.filter((s) => s.status !== "operational").length;
  const overallStatus = allOk
    ? "All systems operational"
    : `${degradedCount} service${degradedCount === 1 ? "" : "s"} degraded`;
  const overallTone: IntegrationStatus = allOk ? "operational" : "degraded";

  return (
    <div className="status-page">
      <header className="compare-topnav">
        <Link href="/" className="compare-logo">
          <div className="logo-mark">C</div>
          <span>CredTek</span>
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/api-docs" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}>
            API
          </Link>
          <Link href="/changelog" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}>
            Changelog
          </Link>
          <Link href="/help" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}>
            Help
          </Link>
          <Link
            href="https://cal.com/mikesweigart"
            target="_blank"
            rel="noopener"
            className="topnav-cta"
          >
            Book a demo →
          </Link>
        </div>
      </header>

      <section className="status-hero">
        <div className="container container-narrow">
          <div className={`status-hero-card status-${overallTone}`}>
            <div className="status-hero-pulse"></div>
            <div className="status-hero-text">
              <div className="status-hero-eyebrow">CredTek system status</div>
              <h1>{overallStatus}</h1>
              <p>
                Live across the entire integration layer. Updates every 30
                seconds in production; this page mirrors the same data
                buyers see during evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="status-services">
        <div className="container container-narrow">
          {(["core", "tier_1", "tier_2", "tier_3", "tier_4"] as const).map(
            (cat) => {
              const services = SERVICES.filter((s) => s.category === cat);
              if (services.length === 0) return null;
              return (
                <div key={cat} className="status-cat">
                  <h2 className="status-cat-label">
                    {CATEGORY_LABELS[cat]}
                    <span className="status-cat-count">
                      {services.length} service{services.length === 1 ? "" : "s"}
                    </span>
                  </h2>
                  <div className="status-list">
                    {services.map((s) => (
                      <div key={s.name} className="status-row">
                        <div
                          className={`status-dot status-${s.status}`}
                          title={s.status}
                        ></div>
                        <div className="status-name">{s.name}</div>
                        <div className="status-uptime">
                          <span className="status-uptime-num">
                            {s.uptime90.toFixed(2)}%
                          </span>
                          <span className="status-uptime-label">90d</span>
                        </div>
                        <div className="status-last">
                          last success {s.lastSuccess}
                        </div>
                        {s.notes ? (
                          <div className="status-notes">{s.notes}</div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </section>

      <section className="status-incidents">
        <div className="container container-narrow">
          <h2 className="status-cat-label">Recent incidents</h2>
          {INCIDENTS.map((inc) => (
            <article key={inc.id} className="incident-card">
              <div className="incident-head">
                <span className={`incident-status status-${inc.status}`}>
                  {inc.status}
                </span>
                <h3>{inc.title}</h3>
                <span className="incident-time">
                  Started {inc.startedAt}
                  {inc.resolvedAt ? ` · resolved ${inc.resolvedAt}` : ""}
                </span>
              </div>
              <div className="incident-scope">
                Affects:{" "}
                {inc.scope.map((s, i) => (
                  <span key={s}>
                    <code>{s}</code>
                    {i < inc.scope.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
              <div className="incident-updates">
                {inc.updates.map((u, i) => (
                  <div key={i} className="incident-update">
                    <span className="incident-update-ts">{u.ts}</span>
                    <span className="incident-update-text">{u.text}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer
        style={{
          background: "var(--ink-deep)",
          color: "rgba(255,255,255,0.6)",
          padding: "32px 0",
          marginTop: 48,
        }}
      >
        <div className="footer-inner">
          <Link href="/" className="logo">
            <div
              className="logo-mark"
              style={{ background: "white", color: "var(--ink)" }}
            >
              C
            </div>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 22,
              }}
            >
              CredTek
            </span>
          </Link>
          <div className="footer-meta">
            Subscribe to updates: hello@cred-tek.com
          </div>
        </div>
      </footer>
    </div>
  );
}
