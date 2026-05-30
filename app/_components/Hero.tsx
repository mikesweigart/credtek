"use client";

// Hero — the new conversion-optimized hero section.
//
// Two changes vs the prior HTML-only hero:
//
// 1. CTA hierarchy fixed. One primary button ("Get your free
//    interactive demo") opens EmailDemoModal. Calendly is demoted to
//    a tertiary text link below the trust strip. The old "Talk to us"
//    was equal-weight with "See your numbers" — two parallel CTAs of
//    equal weight is a classic conversion-killer.
//
// 2. Visual replaced with a single-workflow zoom (Option C from the
//    design call). Old screenshot was a busy full-dashboard mockup.
//    The new one shows one provider with all 12 payor enrollments at
//    different stages — the "look at this" moment. Buyers want to see
//    the tool they'd be using; the zoomed view delivers that without
//    fighting the headline.

import { useState } from "react";
import { EmailDemoModal } from "./EmailDemoModal";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="hero hero-with-video">
        <div className="container">
          {/* ============== 60-SECOND EXPLAINER VIDEO ============== */}
          {/* Full-width band at the top of the hero — the autoplay loop
              tells the full story arc. Display width ~1180px means the
              burned-in transcript reads at native legibility. */}
          <HeroVideo />

          <div className="hero-inner">
            <div>
              <div className="hero-eyebrow">
                → Credentialing for US medical groups, MSOs &amp; health systems
              </div>
              <h1>
                Your providers should be <em>billing.</em>
                <br />
                Not waiting on credentialing.
              </h1>
              <p className="hero-sub">
                Every day your new clinicians sit idle waiting on payor
                enrollment, you lose{" "}
                <strong>$2,000–$3,000</strong> in revenue per provider.
                CredTek gets them in-network in weeks, not months — built
                by credentialing veterans, run by modern AI agents.
              </p>

              <div className="hero-cta">
                <button
                  type="button"
                  className="btn-primary btn-primary-lg"
                  onClick={() => setModalOpen(true)}
                >
                  Get your free interactive demo
                  <span className="arrow">→</span>
                </button>
                <a className="hero-cta-tertiary" href="#calc">
                  Or see your ROI first →
                </a>
              </div>

              <div className="hero-trust">
                <span className="dot">●</span> <strong>40+ yrs</strong> combined credentialing experience &nbsp;·&nbsp;{" "}
                <span className="dot">●</span> <strong>HIPAA + BAA</strong> on day one &nbsp;·&nbsp;{" "}
                <span className="dot">●</span> <strong>NCQA-aligned</strong>
              </div>

              <div className="hero-soft-cta">
                Want a guided 20-minute walkthrough?{" "}
                <a
                  href="https://calendly.com/mike-fusion-advisory/30min"
                  target="_blank"
                  rel="noopener"
                >
                  Talk to a credentialing veteran →
                </a>
              </div>
            </div>

            {/* Right column intentionally empty — the video moved to a
                full-width band above this row so the burned-in
                transcript is fully readable on desktop. */}
          </div>
        </div>
      </section>

      <EmailDemoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
