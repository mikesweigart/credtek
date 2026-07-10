// /resources — credentialing knowledge hub. Educational articles for
// the credentialing buyer, organized by category. Published articles
// link through; roadmap entries show as "Coming soon."
//
// StoryBrand role: this is how the guide demonstrates competence and
// empathy before asking for the sale.

import Link from "next/link";
import {
  RESOURCES,
  RESOURCE_CATEGORY_LABELS,
  publishedResources,
  type ResourceCategory,
} from "../_lib/resources";

export const metadata = {
  title: "Credentialing Resources & Guides",
  description:
    "Practical guides on provider credentialing, payer enrollment, primary-source verification, NCQA delegation, multi-state licensure, and more — from operators with decades of enterprise credentialing experience.",
};

const CATEGORY_ORDER: ResourceCategory[] = [
  "foundations",
  "roi",
  "compliance",
  "multistate",
  "government",
  "specialty",
  "future",
];

export default function ResourcesIndex() {
  const published = publishedResources();
  const featured = published.slice(0, 3);

  return (
    <div className="rsc-page">
      <header className="compare-topnav">
        <Link href="/" className="compare-logo">
          <div className="logo-mark">C</div>
          <span>CredTek</span>
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/compare" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}>Compare</Link>
          <Link href="/dashboard" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}>Live demo</Link>
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

      <section className="rsc-hero">
        <div className="container container-narrow">
          <span className="section-eyebrow">Credentialing resources</span>
          <h1>
            The credentialing playbook, <em>written by operators.</em>
          </h1>
          <p className="rsc-lead">
            Practical, no-fluff guides on how provider credentialing and payer
            enrollment actually work in the United States — from the team that&apos;s
            spent decades inside enterprise credentialing programs. Everything
            here is built to save you time, money, and audit headaches.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="rsc-featured-wrap">
        <div className="container">
          <h2 className="rsc-section-title">Start here</h2>
          <div className="rsc-featured-grid">
            {featured.map((r) => (
              <Link key={r.slug} href={`/resources/${r.slug}`} className="rsc-featured-card">
                <span className="rsc-card-cat">{RESOURCE_CATEGORY_LABELS[r.category]}</span>
                <h3>{r.title}</h3>
                <p>{r.excerpt}</p>
                <span className="rsc-card-meta">{r.readTime} · Read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All by category */}
      <section className="rsc-all">
        <div className="container">
          {CATEGORY_ORDER.map((cat) => {
            const items = RESOURCES.filter((r) => r.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="rsc-cat-block">
                <h2 className="rsc-cat-title">{RESOURCE_CATEGORY_LABELS[cat]}</h2>
                <div className="rsc-list">
                  {items.map((r) =>
                    r.html ? (
                      <Link key={r.slug} href={`/resources/${r.slug}`} className="rsc-row">
                        <div className="rsc-row-body">
                          <div className="rsc-row-title">{r.title}</div>
                          <div className="rsc-row-excerpt">{r.excerpt}</div>
                        </div>
                        <div className="rsc-row-meta">
                          <span className="rsc-row-time">{r.readTime}</span>
                          <span className="rsc-row-arrow">→</span>
                        </div>
                      </Link>
                    ) : (
                      <div key={r.slug} className="rsc-row rsc-row-soon">
                        <div className="rsc-row-body">
                          <div className="rsc-row-title">{r.title}</div>
                          <div className="rsc-row-excerpt">{r.excerpt}</div>
                        </div>
                        <div className="rsc-row-meta">
                          <span className="rsc-soon-pill">Coming soon</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA band */}
      <section className="rsc-cta-band">
        <div className="container container-narrow center">
          <h2>
            Stop reading about faster credentialing. <em>See your own numbers.</em>
          </h2>
          <p>
            We&apos;ll run a sample of your providers through CredTek live and show
            the ROI for your group specifically.
          </p>
          <div className="rsc-cta-band-btns">
            <Link className="btn-primary" href="/#calc" style={{ display: "inline-flex" }}>
              Run the ROI calculator →
            </Link>
            <Link
              className="btn-secondary"
              href="https://calendly.com/mike-fusion-advisory/30min"
              target="_blank"
              rel="noopener"
            >
              Talk to a credentialing veteran
            </Link>
          </div>
        </div>
      </section>

      <footer
        style={{
          background: "var(--ink-deep)",
          color: "rgba(255,255,255,0.6)",
          padding: "32px 0",
          marginTop: 0,
        }}
      >
        <div className="footer-inner">
          <Link href="/" className="logo">
            <div className="logo-mark" style={{ background: "white", color: "var(--ink)" }}>C</div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "normal", fontSize: 22 }}>
              CredTek
            </span>
          </Link>
          <div className="footer-meta">US medical credentialing platform · 2026</div>
        </div>
      </footer>
    </div>
  );
}
