// /compare — head-to-head feature matrix vs. Modio, Symplr/CredentialStream,
// and Medallion. Public marketing page. Hormozi-aligned: name competitors
// explicitly, anchor to specific BH workflows, end with a single CTA.

import Link from "next/link";

export const metadata = {
  title: "CredTek vs. Modio, Symplr, Medallion · CredTek",
  description:
    "Head-to-head feature comparison for behavioral health credentialing platforms. CredTek vs. Modio Health, Symplr CredentialStream, and Medallion.",
};

type Verdict = "yes" | "partial" | "no" | "n_a";

type Row = {
  feature: string;
  detail?: string;
  credtek: Verdict;
  modio: Verdict;
  symplr: Verdict;
  medallion: Verdict;
  /** Optional: short note for one of the cells. */
  notes?: { credtek?: string; modio?: string; symplr?: string; medallion?: string };
};

type Section = { title: string; rows: Row[] };

const SECTIONS: Section[] = [
  {
    title: "Behavioral health depth",
    rows: [
      {
        feature: "Pre-licensed supervision tracker",
        detail: "Hours, cosignatures, state-board rule engines for LMSW / LPC-A / LMFT-A",
        credtek: "yes",
        modio: "no",
        symplr: "no",
        medallion: "no",
      },
      {
        feature: "BH payor specialization",
        detail: "Dedicated agents for Optum/UBH, Carelon, Magellan, Evernorth BH, Anthem BH",
        credtek: "yes",
        modio: "partial",
        symplr: "partial",
        medallion: "partial",
        notes: {
          modio: "general payor list, no BH specialization",
          symplr: "all payors but generic forms",
          medallion: "MD-first, BH bolted on",
        },
      },
      {
        feature: "Master's-level clinician credential support",
        detail: "LCSW / LPC / LMFT / BCBA workflows that don't break the data model",
        credtek: "yes",
        modio: "partial",
        symplr: "yes",
        medallion: "partial",
      },
      {
        feature: "PSYPACT / Counseling Compact / SW Compact eligibility",
        credtek: "yes",
        modio: "no",
        symplr: "partial",
        medallion: "no",
      },
    ],
  },
  {
    title: "Automation & AI",
    rows: [
      {
        feature: "AI-native architecture",
        detail: "Agents at the core with human approval gates; not chatbots bolted on a CRUD app",
        credtek: "yes",
        modio: "no",
        symplr: "no",
        medallion: "partial",
      },
      {
        feature: "Real payor-portal auto-fill",
        detail: "Agent fills the form end-to-end with confidence scoring and human approval",
        credtek: "yes",
        modio: "no",
        symplr: "no",
        medallion: "partial",
        notes: {
          modio: "task tracker, not auto-fill",
          medallion: "human-driven with hidden ops",
        },
      },
      {
        feature: "Agentic state-board PSV",
        detail: "Direct verification across all 50 BH boards, not just APIs where they exist",
        credtek: "yes",
        modio: "partial",
        symplr: "partial",
        medallion: "partial",
      },
      {
        feature: "OCR + LLM document intake",
        detail: "Provider snaps a photo; agent extracts every field with confidence scoring",
        credtek: "yes",
        modio: "no",
        symplr: "partial",
        medallion: "partial",
      },
      {
        feature: "Predictive re-credentialing forecast",
        detail: "180-day rolling forecast, auto-drafted Completed Provider Files",
        credtek: "yes",
        modio: "no",
        symplr: "yes",
        medallion: "partial",
      },
    ],
  },
  {
    title: "Compliance & audit",
    rows: [
      {
        feature: "NCQA CVO partnership (year-1)",
        detail: "Day-one NCQA-compliant files via certified CVO partner",
        credtek: "yes",
        modio: "no",
        symplr: "yes",
        medallion: "yes",
      },
      {
        feature: "One-click NCQA audit binder",
        detail: "Generate a payor-ready evidence packet for delegated credentialing",
        credtek: "yes",
        modio: "no",
        symplr: "yes",
        medallion: "partial",
      },
      {
        feature: "Tamper-evident audit log (SHA-256 hash chain)",
        credtek: "yes",
        modio: "no",
        symplr: "yes",
        medallion: "partial",
      },
      {
        feature: "HIPAA + signed BAA day one",
        credtek: "yes",
        modio: "yes",
        symplr: "yes",
        medallion: "yes",
      },
      {
        feature: "SOC 2 Type II",
        credtek: "partial",
        modio: "yes",
        symplr: "yes",
        medallion: "yes",
        notes: {
          credtek: "audit started; report due Q3 2026",
        },
      },
    ],
  },
  {
    title: "Implementation & pricing",
    rows: [
      {
        feature: "Time to live",
        credtek: "yes",
        modio: "yes",
        symplr: "no",
        medallion: "yes",
        notes: {
          credtek: "14 days",
          modio: "14-21 days",
          symplr: "9 months typical",
          medallion: "21-45 days",
        },
      },
      {
        feature: "Public, transparent pricing",
        credtek: "yes",
        modio: "no",
        symplr: "no",
        medallion: "no",
      },
      {
        feature: "45-day performance guarantee",
        detail: "Refund if average time-to-active doesn't drop below 60 days",
        credtek: "yes",
        modio: "no",
        symplr: "no",
        medallion: "no",
      },
      {
        feature: "Designed for 50–500 provider mid-market",
        credtek: "yes",
        modio: "yes",
        symplr: "no",
        medallion: "yes",
        notes: {
          symplr: "built for 5,000+ provider hospital systems",
        },
      },
    ],
  },
];

export default function ComparePage() {
  return (
    <div className="compare-page">
      <header className="compare-topnav">
        <Link href="/" className="compare-logo">
          <div className="logo-mark">C</div>
          <span>CredTek</span>
        </Link>
        <Link
          href="https://cal.com/mikesweigart"
          target="_blank"
          rel="noopener"
          className="topnav-cta"
        >
          Book a demo →
        </Link>
      </header>

      <section className="compare-hero">
        <div className="container">
          <span className="section-eyebrow">CredTek vs. the alternatives</span>
          <h1>
            How CredTek stacks up against{" "}
            <em>Modio, Symplr, and Medallion.</em>
          </h1>
          <p className="compare-lead">
            Honest head-to-head. We name the tradeoffs explicitly so you can
            challenge any line in this table during a demo. If something
            here is wrong, tell us — we'll fix it.
          </p>
        </div>
      </section>

      <section className="compare-table-wrap">
        <div className="container">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="compare-th-feat">Feature</th>
                <th className="compare-th compare-th-credtek">
                  CredTek
                  <span className="compare-th-tag">BH-native</span>
                </th>
                <th className="compare-th">Modio</th>
                <th className="compare-th">
                  Symplr<br />
                  <span className="compare-th-sub">CredentialStream</span>
                </th>
                <th className="compare-th">Medallion</th>
              </tr>
            </thead>
            <tbody>
              {SECTIONS.map((section) => (
                <SectionBlock key={section.title} section={section} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="compare-cta">
        <div className="container container-narrow center">
          <h2>
            Worth 20 minutes to see <em>your providers</em> running through
            CredTek?
          </h2>
          <p>
            We pull a sample of your actual roster, run them through the
            platform live, and show you the time-to-active math. No slides.
            No fluff.
          </p>
          <Link
            href="https://cal.com/mikesweigart"
            target="_blank"
            rel="noopener"
            className="btn-primary"
            style={{ display: "inline-flex", marginTop: 16 }}
          >
            Book a 20-min demo →
          </Link>
          <div className="final-meta" style={{ marginTop: 24, color: "var(--muted)" }}>
            45-day guarantee · live in 14 days · no contract required to start
          </div>
        </div>
      </section>

      <footer style={{ background: "var(--ink-deep)", color: "rgba(255,255,255,0.6)", padding: "32px 0", marginTop: 48 }}>
        <div className="footer-inner">
          <Link href="/" className="logo">
            <div className="logo-mark" style={{ background: "white", color: "var(--ink)" }}>C</div>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 22 }}>
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

function SectionBlock({ section }: { section: Section }) {
  return (
    <>
      <tr className="compare-section">
        <td colSpan={5}>{section.title}</td>
      </tr>
      {section.rows.map((row, i) => (
        <FeatureRow key={`${section.title}-${i}`} row={row} />
      ))}
    </>
  );
}

function FeatureRow({ row }: { row: Row }) {
  return (
    <tr className="compare-row">
      <td className="compare-feat">
        <div className="compare-feat-name">{row.feature}</div>
        {row.detail ? (
          <div className="compare-feat-detail">{row.detail}</div>
        ) : null}
      </td>
      <Cell verdict={row.credtek} note={row.notes?.credtek} highlight />
      <Cell verdict={row.modio} note={row.notes?.modio} />
      <Cell verdict={row.symplr} note={row.notes?.symplr} />
      <Cell verdict={row.medallion} note={row.notes?.medallion} />
    </tr>
  );
}

function Cell({
  verdict,
  note,
  highlight,
}: {
  verdict: Verdict;
  note?: string;
  highlight?: boolean;
}) {
  const className = `compare-cell verdict-${verdict}${
    highlight ? " highlight" : ""
  }`;
  const symbol =
    verdict === "yes"
      ? "✓"
      : verdict === "partial"
        ? "◐"
        : verdict === "no"
          ? "✕"
          : "—";
  return (
    <td className={className}>
      <span className="compare-symbol">{symbol}</span>
      {note ? <div className="compare-note">{note}</div> : null}
    </td>
  );
}
