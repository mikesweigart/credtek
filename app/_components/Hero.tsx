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

type PayorState =
  | "active"
  | "filling"
  | "awaiting"
  | "documents"
  | "queued"
  | "not-started";

const PAYORS: { name: string; tag: string; pct: number; state: PayorState }[] = [
  { name: "Aetna", tag: "Active · in-network", pct: 100, state: "active" },
  { name: "UnitedHealthcare", tag: "Active · in-network", pct: 100, state: "active" },
  { name: "Cigna", tag: "Active · in-network", pct: 100, state: "active" },
  { name: "Anthem BCBS", tag: "Day 14 · awaiting reply", pct: 78, state: "awaiting" },
  { name: "Optum BH", tag: "⚙ Agent filling form (live)", pct: 52, state: "filling" },
  { name: "Tricare", tag: "Day 4 · documents queued", pct: 32, state: "documents" },
  { name: "Humana", tag: "Queued", pct: 18, state: "queued" },
  { name: "Magellan", tag: "Not started", pct: 6, state: "not-started" },
];

export function Hero() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="hero">
        <div className="container">
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

            {/* ============== SINGLE-WORKFLOW ZOOM ============== */}
            <div className="screenshot hero-zoom">
              <div className="screenshot-chrome">
                <div className="ss-dot"></div>
                <div className="ss-dot"></div>
                <div className="ss-dot"></div>
                <div className="ss-url">app.credtek.com / providers / sarah-reyes</div>
              </div>

              <div className="payor-zoom">
                <div className="payor-zoom-head">
                  <div className="payor-zoom-av">SR</div>
                  <div className="payor-zoom-id">
                    <div className="payor-zoom-name">Dr. Sarah Reyes, PsyD</div>
                    <div className="payor-zoom-meta">
                      PSYPACT · TX · FL · GA &nbsp;·&nbsp; <strong>8 / 12 payors active</strong>
                    </div>
                  </div>
                  <div className="payor-zoom-status">
                    <span className="payor-zoom-pulse" /> Live
                  </div>
                </div>

                <div className="payor-zoom-section-label">
                  12 PAYOR ENROLLMENTS
                </div>

                <ul className="payor-list">
                  {PAYORS.map((p) => (
                    <li key={p.name} className={`payor-row state-${p.state}`}>
                      <div className="payor-bar">
                        <span
                          className="payor-bar-fill"
                          style={{ width: `${p.pct}%` }}
                        />
                      </div>
                      <div className="payor-meta">
                        <span className="payor-name">{p.name}</span>
                        <span className="payor-tag">{p.tag}</span>
                      </div>
                    </li>
                  ))}
                  <li className="payor-row payor-row-more">
                    <span>+ 4 more payors · expand</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EmailDemoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
