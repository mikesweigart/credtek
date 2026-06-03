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
          {/* Screen-reader-only H1 — SEO signal stays, visual hierarchy
              belongs to the video. Search engines see the headline;
              visitors see the moving picture. */}
          <h1 className="visually-hidden">
            Your providers should be billing. Not waiting on credentialing.
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
              From signed contract to <em>providers billing</em> — in 14 days.
            </p>

            <div className="hero-cta hero-cta-centered">
              <button
                type="button"
                className="btn-primary btn-primary-lg"
                onClick={() => setModalOpen(true)}
              >
                Book a demo
                <span className="arrow">→</span>
              </button>
              <a className="hero-cta-tertiary" href="#calc">
                or see your ROI first →
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
