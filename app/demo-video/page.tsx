// /demo-video — async demo landing page. Loom embed at the top, chapters
// + summary below, single Calendly CTA at the bottom. Mike records the
// video once and pastes the share URL into LOOM_URL below.
//
// The script Mike follows is at /sales/demo-recording-script.md in the repo.

import Link from "next/link";

export const metadata = {
  title: "Watch the 7-min CredTek demo · CredTek",
  description:
    "A 7-minute walkthrough of CredTek — the credentialing platform built by operators with 40+ years of enterprise medical credentialing experience.",
};

// ───────────────────────────────────────────────────────────────────────
// PASTE THE LOOM URL HERE AFTER RECORDING
// Example: "https://www.loom.com/share/abc123def456"
// Until this is set, the page renders a "Recording in progress" placeholder
// with a fallback to book a live demo.
// ───────────────────────────────────────────────────────────────────────
const LOOM_URL: string = "";

const CHAPTERS: { ts: string; title: string; detail: string }[] = [
  {
    ts: "0:00",
    title: "Why we built CredTek",
    detail:
      "40 years of enterprise medical credentialing experience + AI agents + a coordinator approval gate on everything.",
  },
  {
    ts: "1:00",
    title: "What your team sees Monday morning",
    detail:
      "Dashboard walkthrough — KPI tiles, provider pipeline, live agent activity feed.",
  },
  {
    ts: "2:20",
    title: "The thing nobody else does",
    detail:
      "Specialty workflow depth — pre-licensed supervision tracking against state board rules. One example of dozens.",
  },
  {
    ts: "4:00",
    title: "The back end your CVO partner uses",
    detail:
      "Operations queue, structured result capture, hash-chained audit log, per-integration margin reporting.",
  },
  {
    ts: "5:30",
    title: "How we're different",
    detail:
      "vs. Modio, Symplr, Medallion — what each does, where they fall short, why our combination wins.",
  },
  {
    ts: "6:30",
    title: "Pricing and next steps",
    detail:
      "Three transparent tiers. Month-to-month with a 30-day out for the first 90 days.",
  },
];

function loomEmbedUrl(shareUrl: string): string {
  // Loom share URLs look like https://www.loom.com/share/<id>
  // Embed URLs are https://www.loom.com/embed/<id>
  const match = shareUrl.match(/\/share\/([^/?#]+)/);
  if (!match) return shareUrl;
  return `https://www.loom.com/embed/${match[1]}`;
}

export default function DemoVideoPage() {
  const haveVideo = LOOM_URL && LOOM_URL.length > 10;

  return (
    <div className="demo-video-page">
      <header className="compare-topnav">
        <Link href="/" className="compare-logo">
          <div className="logo-mark">C</div>
          <span>CredTek</span>
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/compare" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}>Compare</Link>
          <Link href="/dashboard" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}>Live demo</Link>
          <Link href="/help" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}>Help</Link>
          <Link
            href="https://calendly.com/mike-fusion-advisory/30min"
            target="_blank"
            rel="noopener"
            className="topnav-cta"
          >
            Book a demo →
          </Link>
        </div>
      </header>

      <section className="dv-hero">
        <div className="container container-narrow">
          <span className="section-eyebrow">7-minute walkthrough</span>
          <h1>
            See CredTek in <em>seven minutes.</em>
          </h1>
          <p className="dv-lead">
            What your team sees Monday morning. The specialty workflows
            other tools force you to spreadsheet. The back end your CVO
            partner works in. The whole product, narrated, no slides.
          </p>
        </div>
      </section>

      <section className="dv-video-wrap">
        <div className="container container-narrow">
          <div className="dv-video">
            {haveVideo ? (
              <iframe
                src={loomEmbedUrl(LOOM_URL)}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title="CredTek 7-minute demo"
              />
            ) : (
              <div className="dv-placeholder">
                <div className="dv-placeholder-icon">▶</div>
                <h3>Recording uploads here shortly</h3>
                <p>
                  Mike is recording the walkthrough this week. In the
                  meantime, the fastest 7 minutes you&apos;ll spend on
                  CredTek is a live walkthrough — same content, but you
                  can ask questions in real time.
                </p>
                <Link
                  href="https://calendly.com/mike-fusion-advisory/30min"
                  target="_blank"
                  rel="noopener"
                  className="btn-primary"
                  style={{ display: "inline-flex", marginTop: 14 }}
                >
                  Book a live walkthrough →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="dv-chapters">
        <div className="container container-narrow">
          <h2 className="dv-section-title">Chapters</h2>
          <ol className="dv-chapter-list">
            {CHAPTERS.map((c) => (
              <li key={c.ts} className="dv-chapter">
                <span className="dv-chapter-ts">{c.ts}</span>
                <div>
                  <strong>{c.title}</strong>
                  <p>{c.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="dv-cta">
        <div className="container container-narrow center">
          <h2>
            Worth 20 minutes to see <em>your own roster</em> running through it?
          </h2>
          <p>
            We pull a sample of your providers, run them through CredTek
            live, and show you the ROI specifically for your group.
          </p>
          <Link
            href="https://calendly.com/mike-fusion-advisory/30min"
            target="_blank"
            rel="noopener"
            className="btn-primary"
            style={{ display: "inline-flex", marginTop: 14 }}
          >
            Book a 20-min live walkthrough →
          </Link>
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
            <div className="logo-mark" style={{ background: "white", color: "var(--ink)" }}>C</div>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 22 }}>
              CredTek
            </span>
          </Link>
          <div className="footer-meta">
            US medical credentialing platform · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
