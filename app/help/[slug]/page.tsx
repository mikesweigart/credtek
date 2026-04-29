// /help/[slug] — individual knowledge-base article.

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_LABELS,
  HELP_ARTICLES,
  findArticle,
} from "../../_lib/helpArticles";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const a = findArticle(slug);
  if (!a) return { title: "Not found · Help" };
  return { title: `${a.title} · CredTek Help` };
}

export async function generateStaticParams() {
  return HELP_ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function HelpArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  // Show 3 other articles as suggestions (any except this one)
  const others = HELP_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="help-page">
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

      <article className="help-article">
        <div className="container container-narrow">
          <Link href="/help" className="help-back">
            ← All articles
          </Link>
          <div className="help-article-header">
            <span className="help-article-cat">
              {CATEGORY_LABELS[article.category]}
            </span>
            <h1>{article.title}</h1>
            <div className="help-article-readtime-big">{article.readTime}</div>
          </div>

          <div
            className="help-article-body"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          <div className="help-article-cta">
            <h3>Got a question this didn&apos;t answer?</h3>
            <p>
              The fastest path is a 20-min demo where we walk through your
              specific workflow.
            </p>
            <Link
              href="https://cal.com/mikesweigart"
              target="_blank"
              rel="noopener"
              className="btn-primary"
              style={{ display: "inline-flex" }}
            >
              Book a demo →
            </Link>
          </div>
        </div>
      </article>

      <section className="help-others">
        <div className="container container-narrow">
          <h3 className="help-others-label">More articles</h3>
          <div className="help-category-list">
            {others.map((a) => (
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
