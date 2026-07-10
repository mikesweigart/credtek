"use client";

// Hero — clarity-first (StoryBrand "grunt test"): a visitor must grasp
// WHAT we offer, HOW it helps, and WHAT to do next within ~5 seconds.
//
// So the fold leads with a real, visible headline + a one-line offer +
// the primary CTA + a trust strip. The 60-second explainer video is a
// SUPPORTING element below the action path — smaller and calmer — instead
// of a full-width autoplay that dominates the fold and competes with the
// message. (It used to be the "headline," with the real H1 hidden — which
// failed the grunt test.)

import { useState } from "react";
import Image from "next/image";
import { EmailDemoModal } from "./EmailDemoModal";

// Real booking link — the hero's primary CTA books a call directly (no
// form), so the button verb matches what actually happens.
const CAL_LINK = "https://calendly.com/mike-fusion-advisory/30min";

export function Hero() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="hero hero-cinematic hero-clarity">
        <div className="container">
          {/* Eyebrow — qualifies the audience */}
          <div className="hero-eyebrow hero-eyebrow-centered">
            → For credentialing leaders at US medical groups &amp; health systems
          </div>

          {/* Visible headline — the outcome the buyer wants (grunt test #1).
              Keyword-rich for SEO; the page <title> + meta mirror it. */}
          <h1 className="hero-headline">
            Get your providers credentialed and billing{" "}
            <em>40–60% faster.</em>
          </h1>

          {/* One-line offer — who we are + how we help (grunt test #2). */}
          <p className="hero-subhead">
            CredTek is the credentialing team that plugs into your medical group
            in <strong>48 hours</strong> and does the work — verification,
            licensing, CAQH, and payer enrollment — while you watch every
            provider move to billable.
          </p>

          {/* Action path (grunt test #3) — primary books a call; secondary is
              the zero-pressure guided tour (captures the lead via /api/leads);
              tertiary runs the ROI math. */}
          <div className="hero-cta hero-cta-centered">
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
              or run your ROI numbers first →
            </a>
          </div>

          {/* Trust strip — guide authority + the plug-in promise */}
          <div className="hero-trust hero-trust-centered">
            <span className="dot">●</span> <strong>Decades</strong> of credentialing experience &nbsp;·&nbsp;{" "}
            <span className="dot">●</span> <strong>Working your roster in 48 hours</strong> &nbsp;·&nbsp;{" "}
            <span className="dot">●</span> <strong>HIPAA + BAA</strong> on day one
          </div>

          {/* Supporting visual — a warm, human trust image. Calmer than an
              autoplay video, and it reinforces the promise: a real team that
              plugs into your group. (The 60s explainer moved to its own
              section just below.) */}
          <div className="hero-visual">
            <Image
              src="/office-handshake.png"
              alt="A CredTek credentialing specialist shaking hands with a physician in a hospital while clinical staff care for a patient"
              width={1536}
              height={1024}
              sizes="(max-width: 760px) 92vw, 720px"
              className="hero-visual-img"
            />
          </div>
        </div>
      </section>

      <EmailDemoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
