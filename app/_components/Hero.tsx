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

// Real booking link — the hero's primary CTA now books a call directly
// (no form), so the button verb matches what actually happens.
const CAL_LINK = "https://calendly.com/mike-fusion-advisory/30min";

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
            CredTek gets your medical providers credentialed and billing 40–60% faster.
          </h1>

          {/* Eyebrow — qualifies the audience above the video */}
          <div className="hero-eyebrow hero-eyebrow-centered">
            → For credentialing leaders at US medical groups &amp; health systems
          </div>

          {/* The video carries the message */}
          <HeroVideo />

          {/* Below the video — a confident, no-noise action path */}
          <div className="hero-below">
            <p className="hero-below-line">
              Our trained team plugs into your credentialing in <em>48 hours</em> — and gets your providers billing <em>40–60% faster</em>.
            </p>

            <div className="hero-cta hero-cta-centered">
              {/* Three-action hero. Primary = the real, high-commitment
                  ask: book time with a credentialing veteran (Calendly,
                  no form — the verb finally matches the outcome).
                  Secondary = the zero-pressure guided product tour, which
                  also captures the lead via /api/leads so we can follow up
                  even if they don't book. Tertiary = run the ROI math. The
                  full live portal lives in the top nav ("See it live"). */}
              <div className="hero-cta-buttons">
                <a
                  className="btn-primary btn-primary-lg"
                  href={CAL_LINK}
                  target="_blank"
                  rel="noopener"
                >
                  Book a demo
                  <span className="arrow">→</span>
                </a>
                <button
                  type="button"
                  className="btn-secondary btn-secondary-lg"
                  onClick={() => setModalOpen(true)}
                >
                  Take a guided tour
                  <span className="arrow">→</span>
                </button>
              </div>
              <a className="hero-cta-tertiary" href="#calc">
                or just run your ROI numbers first →
              </a>
            </div>

            <div className="hero-trust hero-trust-centered">
              <span className="dot">●</span> <strong>Decades</strong> of credentialing experience &nbsp;·&nbsp;{" "}
              <span className="dot">●</span> <strong>Working your roster in 48 hours</strong> &nbsp;·&nbsp;{" "}
              <span className="dot">●</span> <strong>HIPAA + BAA</strong> on day one
            </div>
          </div>
        </div>
      </section>

      <EmailDemoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
