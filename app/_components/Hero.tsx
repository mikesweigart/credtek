"use client";

// Hero — cinematic video-led layout.
//
// Design thinking:
//   • The 60s video is the headline. Frame 1 of the poster reads
//     "Your providers should be billing. Not waiting." — there is no
//     reason to repeat that as an <h1> below it. We keep the <h1> in
//     the DOM for SEO (sr-only) but the visual headline is the video.
//   • Eyebrow above the video qualifies the audience ("you, the
//     credentialing operator"). Everything else flows below.
//   • Below the video: ONE outcome line, ONE primary CTA, the soft
//     ROI link, the trust strip. Centered alignment so the video is
//     the visual focal point and the page below it is the action path.
//   • Removed the duplicated $2,000/day stat — the video counts that
//     up at frame 480 with motion. Flat copy can't beat motion at the
//     same idea, so we don't compete with the video.
//
// The result is a confident, uncrowded above-the-fold that respects
// the visitor's attention.

import { useState } from "react";
import { EmailDemoModal } from "./EmailDemoModal";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="hero hero-cinematic">
        <div className="container">
          {/* Screen-reader-only H1 — carries the controlling one-liner for
              SEO (keywords: medical providers, credentialed, billing). The
              visual/emotional headline lives in the video (frame 1: "Your
              providers should be billing. Not waiting."), so the H1 and the
              video reinforce the same idea without visually repeating it.
              This same one-liner is mirrored in the page <title>, the meta
              description, and the OG/Twitter cards — one message, everywhere. */}
          <h1 className="visually-hidden">
            CredTek gets your medical providers credentialed and billing in weeks, not months.
          </h1>

          {/* Eyebrow — qualifies the audience above the video */}
          <div className="hero-eyebrow hero-eyebrow-centered">
            → For credentialing teams at US medical groups, MSOs &amp; health systems
          </div>

          {/* The video carries the message */}
          <HeroVideo />

          {/* Below the video — a confident, no-noise action path */}
          <div className="hero-below">
            <p className="hero-below-line">
              From signed contract to <em>providers billing</em> — in weeks, not months.
            </p>

            <div className="hero-cta hero-cta-centered">
              {/* Two-action hero: a high-commitment primary (book) and a
                  zero-friction secondary (explore the real product, no
                  form). The live demo opens in a new tab so this page —
                  and the "Book a demo" button — stays one tab away for
                  the moment the prospect is convinced. */}
              <div className="hero-cta-buttons">
                <button
                  type="button"
                  className="btn-primary btn-primary-lg"
                  onClick={() => setModalOpen(true)}
                >
                  Book a demo
                  <span className="arrow">→</span>
                </button>
                <a
                  className="btn-secondary btn-secondary-lg"
                  href="/avelecare"
                  target="_blank"
                  rel="noopener"
                >
                  See it live
                  <span className="arrow">→</span>
                </a>
              </div>
              <a className="hero-cta-tertiary" href="#calc">
                or just run your ROI numbers first →
              </a>
            </div>

            <div className="hero-trust hero-trust-centered">
              <span className="dot">●</span> <strong>40+ yrs</strong> combined credentialing experience &nbsp;·&nbsp;{" "}
              <span className="dot">●</span> <strong>HIPAA + BAA</strong> on day one &nbsp;·&nbsp;{" "}
              <span className="dot">●</span> <strong>NCQA-aligned</strong>
            </div>

            <div className="hero-soft-cta">
              Prefer to skip the form?{" "}
              <a
                href="https://calendly.com/mike-fusion-advisory/30min"
                target="_blank"
                rel="noopener"
              >
                Book directly on Calendly →
              </a>
            </div>
          </div>
        </div>
      </section>

      <EmailDemoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
