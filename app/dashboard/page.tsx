// Dashboard placeholder. The real coordinator cockpit (week 2 of the
// 30-day MVP plan) will replace this with the agent activity feed,
// provider pipeline, and KPI tiles modeled in the landing-page mockup.

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "48px 24px",
        background: "var(--paper)",
      }}
    >
      <div style={{ maxWidth: 560, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "var(--gold-deep)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            background: "rgba(201, 146, 61, 0.08)",
            border: "1px solid rgba(201, 146, 61, 0.25)",
            padding: "7px 13px",
            borderRadius: 100,
            marginBottom: 24,
          }}
        >
          Coordinator cockpit · coming week 2
        </div>
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 48,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: 0,
            marginBottom: 16,
            fontWeight: 400,
          }}
        >
          Dashboard{" "}
          <em style={{ color: "var(--gold)" }}>under construction</em>.
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "var(--ink-soft)",
            lineHeight: 1.55,
            margin: 0,
            marginBottom: 28,
          }}
        >
          Pipeline tiles, multi-state license matrix, payor Kanban, and the
          live agent feed all land here. For now, the marketing site is the
          headline — see{" "}
          <a href="/" style={{ color: "var(--ink)", fontWeight: 600 }}>
            credtek.com
          </a>
          .
        </p>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--ink)",
            color: "white",
            padding: "12px 22px",
            borderRadius: 10,
            fontWeight: 500,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          ← Back to landing
        </a>
      </div>
    </main>
  );
}
