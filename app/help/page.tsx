// /help — knowledge base index. Public-facing (no auth) so partners can
// browse during demos and prospects can read while evaluating.

import Link from "next/link";
import {
  CATEGORY_LABELS,
  HELP_ARTICLES,
  type HelpCategory,
} from "../_lib/helpArticles";

export const metadata = {
  title: "Help · CredTek",
  description:
    "How-to articles for credentialing coordinators using CredTek.",
};

const CATEGORY_ORDER: HelpCategory[] = [
  "getting_started",
  "providers",
  "supervision",
  "payors",
  "compliance",
  "operations",
];

export default function HelpIndexPage() {
  return (
    <div className="help-page">
      <header className="compare-topnav">
        <Link href="/" className="compare-logo">
          <div className="logo-mark">C</div>
          <span>CredTek</span>
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link
            href="/api-docs"
            style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}
          >
            API
          </Link>
          <Link
            href="/changelog"
            style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}
          >
            Changelog
          </Link>
          <Link
            href="/dashboard"
            style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}
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

      <section className="help-hero">
        <div className="container container-narrow">
          <span className="section-eyebrow">Knowledge base</span>
          <h1>
            How to use CredTek <em>day-to-day.</em>
          </h1>
          <p className="help-lead">
            Short, specific articles for credentialing coordinators. If
            something is missing, it&apos;s probably also missing from the
            product — drop the gap in your next demo and we&apos;ll fix
            both.
          </p>
        </div>
      </section>

      <section className="help-categories">
        <div className="container container-narrow">
          {CATEGORY_ORDER.map((cat) => {
            const articles = HELP_ARTICLES.filter((a) => a.category === cat);
            if (articles.length === 0) return null;
            return (
              <div key={cat} className="help-category">
                <h2 className="help-category-label">{CATEGORY_LABELS[cat]}</h2>
                <div className="help-category-list">
                  {articles.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/help/${a.slug}`}
                      className="help-article-card"
                    >
                      <div className="help-article-meta">
                        <span className="help-article-readtime">{a.readTime}</span>
                      </div>
                      <h3 className="help-article-title">{a.title}</h3>
                      <p className="help-article-excerpt">{a.excerpt}</p>
                      <span className="help-article-arrow">Read →</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
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
            Credentialing built for behavioral health · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
