// /resources/[slug] — individual credentialing article. Mirrors the
// /help/[slug] pattern: HTML body rendered with dangerouslySetInnerHTML,
// statically generated for every published article.

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  RESOURCES,
  RESOURCE_CATEGORY_LABELS,
  findResource,
  publishedResources,
} from "../../_lib/resources";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const r = findResource(slug);
  if (!r) return { title: "Not found · Resources" };
  return {
    title: r.title,
    description: r.excerpt,
  };
}

export async function generateStaticParams() {
  // Only published articles get a route.
  return publishedResources().map((r) => ({ slug: r.slug }));
}

export default async function ResourceArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = findResource(slug);
  if (!article || !article.html) notFound();

  // Suggest 3 other published articles.
  const others = publishedResources()
    .filter((r) => r.slug !== slug)
    .slice(0, 3);

  return (
    <div className="rsc-page">
      <header className="compare-topnav">
        <Link href="/" className="compare-logo">
          <div className="logo-mark">C</div>
          <span>CredTek</span>
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/resources" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}>All resources</Link>
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

      <article className="rsc-article">
        <div className="container container-narrow">
          <Link href="/resources" className="rsc-back">← All credentialing resources</Link>
          <span className="rsc-article-cat">{RESOURCE_CATEGORY_LABELS[article.category]}</span>
          <h1 className="rsc-article-title">{article.title}</h1>
          <div className="rsc-article-meta">{article.readTime} · CredTek</div>

          <div
            className="rsc-article-body"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        </div>
      </article>

      {others.length > 0 && (
        <section className="rsc-more">
          <div className="container container-narrow">
            <h2 className="rsc-section-title">Keep reading</h2>
            <div className="rsc-more-grid">
              {others.map((r) => (
                <Link key={r.slug} href={`/resources/${r.slug}`} className="rsc-more-card">
                  <span className="rsc-card-cat">{RESOURCE_CATEGORY_LABELS[r.category]}</span>
                  <h3>{r.title}</h3>
                  <span className="rsc-card-meta">{r.readTime} · Read →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer
        style={{
          background: "var(--ink-deep)",
          color: "rgba(255,255,255,0.6)",
          padding: "32px 0",
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
