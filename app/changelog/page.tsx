// /changelog — chronological release notes. Public-facing, helps the
// project feel alive to partners checking in between demos.

import Link from "next/link";

export const metadata = {
  title: "Changelog · CredTek",
  description: "What we've shipped on CredTek, in order.",
};

type Release = {
  version: string;
  date: string;
  headline: string;
  highlights: string[];
};

const RELEASES: Release[] = [
  {
    version: "v0.7",
    date: "April 29, 2026",
    headline: "Live API + competitive context",
    highlights: [
      "Live HTTP API endpoints — POST /api/integrations/submit, GET /api/integrations/list, GET/POST /api/integrations/[id] — all driving the IAL state machine against an in-memory mock store",
      "Public /api-docs reference page with example requests, responses, and status codes",
      "/compare — head-to-head feature matrix vs. Modio, Symplr/CredentialStream, Medallion across BH depth, automation, compliance, implementation",
      "/ops/templates — task template catalog with SLAs, pools, steps, result schemas, margin per template",
      "/sign-in mock auth landing (Supabase Auth wires next session)",
      "/help knowledge base with 6 articles for credentialing coordinators",
      "/changelog (this page)",
    ],
  },
  {
    version: "v0.6",
    date: "April 28, 2026 (overnight)",
    headline: "Customer + ops surfaces, IAL backend foundation",
    highlights: [
      "/welcome — 5-step customer onboarding wizard (workspace → states → payors → Modio import → team)",
      "/notifications — full activity stream with kind filters",
      "/ops/audit — SHA-256 hash-chained audit log viewer (IAL §9 made visible)",
      "/ops/margin — per-integration cost vs. customer-price reporting (IAL §8)",
      "IAL backend modules: types, pure-function state machine (§4), audit-chain helpers (§9) — ready to swap in Supabase",
    ],
  },
  {
    version: "v0.5",
    date: "April 28, 2026",
    headline: "Operations Queue (Tier 4 specialist surface)",
    highlights: [
      "/ops/queue — sortable/filterable ticket queue with SLA color coding, KPI strip",
      "/ops/queue/[id] — ticket detail with sub-task checklist, structured result form per task template, internal notes thread, artifacts panel, cost-vs-margin breakdown",
      "Demo banner adds 'Switch to Ops view' for partner walkthroughs",
    ],
  },
  {
    version: "v0.4",
    date: "April 28, 2026",
    headline: "UX overhaul — provider intake + demo polish",
    highlights: [
      "Mobile-first provider intake at /intake/[token] — 5-step flow with mock OCR + structured extraction",
      "/invite — coordinator-side invite flow with recent-invites table",
      "/supervision — pre-licensed roster, BH coordinator's daily-driver",
      "/approvals — agent approval queue with Approve/Edit/Reject demo toasts",
      "/settings — workspace, team, integrations, billing in one scrollable page",
      "Provider detail tabs (Overview / Licenses / Payors / Supervision / Documents) all wired",
      "DemoBanner across every (app) page · NotificationBell in topbar · DemoButton component for every previously-inert button",
      "Filter chips on /providers and /payors (URL-driven, deep-linkable)",
      "'Live demo →' link added to landing-page nav",
    ],
  },
  {
    version: "v0.3",
    date: "April 28, 2026",
    headline: "Multi-state license matrix, payor Kanban, sales pack",
    highlights: [
      "/licenses — 50-state license matrix matching the landing-page mockup",
      "/payors — four-stage enrollment Kanban with cards linking to provider detail",
      "/providers — full roster page",
      "/sales/ markdown pack: cold-outbound email templates, LinkedIn DM scripts, 20-min demo talk track with screenshot cues",
    ],
  },
  {
    version: "v0.2",
    date: "April 27, 2026",
    headline: "Coordinator cockpit dashboard",
    highlights: [
      "/dashboard — Good-morning greeting, KPI tiles (Active / Pipeline / Avg Days / Expiring), pipeline panel with status pills, live agent activity feed",
      "/providers/[slug] — provider detail with the BH-specific supervision tracker (1,840/3,000 hours, weekly cosignature, projected licensure date)",
      "App-shell sidebar with sticky navigation",
      "Mock data layer (mockProviders.ts) — pattern that survives the Supabase swap",
    ],
  },
  {
    version: "v0.1",
    date: "April 27, 2026",
    headline: "Landing page live",
    highlights: [
      "Hormozi-framed marketing site at credtek.vercel.app — hero, pain agitation, why-others-fail, three feature mockups, value stack, cost-of-inaction, 45-day guarantee, two-line pricing, FAQ, final CTA",
      "Custom domain wired (cred-tek.com)",
      "Vercel auto-deploy from main",
      "Repo + scaffolding for the rest of the build",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="changelog-page">
      <header className="compare-topnav">
        <Link href="/" className="compare-logo">
          <div className="logo-mark">C</div>
          <span>CredTek</span>
        </Link>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Link
            href="/api-docs"
            style={{
              color: "var(--ink-soft)",
              textDecoration: "none",
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.04em",
            }}
          >
            API
          </Link>
          <Link
            href="/dashboard"
            style={{
              color: "var(--ink-soft)",
              textDecoration: "none",
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.04em",
            }}
          >
            Live demo
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

      <section className="changelog-hero">
        <div className="container container-narrow">
          <span className="section-eyebrow">Shipping log</span>
          <h1>
            What we&apos;ve shipped, <em>in order.</em>
          </h1>
          <p className="changelog-lead">
            CredTek went from empty repo to a real product with 22 routes,
            a live HTTP API, and an Operations Queue surface in three days.
            Updated continuously — partners following along on GitHub will
            see the next release here within minutes of merge.
          </p>
        </div>
      </section>

      <section className="changelog-list">
        <div className="container container-narrow">
          {RELEASES.map((r, i) => (
            <article key={r.version} className="changelog-entry">
              <div className="changelog-rail">
                <div
                  className={
                    i === 0
                      ? "changelog-marker latest"
                      : "changelog-marker"
                  }
                >
                  {i === 0 ? "★" : "●"}
                </div>
                {i < RELEASES.length - 1 ? (
                  <div className="changelog-line"></div>
                ) : null}
              </div>
              <div className="changelog-body">
                <div className="changelog-head">
                  <span className="changelog-version">{r.version}</span>
                  <span className="changelog-date">{r.date}</span>
                  {i === 0 ? (
                    <span className="changelog-tag">Latest</span>
                  ) : null}
                </div>
                <h3 className="changelog-headline">{r.headline}</h3>
                <ul className="changelog-bullets">
                  {r.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
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
          marginTop: 32,
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
            Credentialing built for behavioral health · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
