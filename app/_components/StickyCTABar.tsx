"use client";

// StickyCTABar — appears at the bottom of the viewport once the user
// has scrolled past the hero. Captures intent from anywhere on the
// page without forcing them back to the top. Dismissible (per session)
// so it never feels nagging.
//
// Wired ONLY on the landing page via app/page.tsx — the dashboard,
// docs, compare etc. don't need it. Sharing the EmailDemoModal so the
// flow is identical whether the user clicks the hero CTA or this bar.

import { useEffect, useState } from "react";
import { EmailDemoModal } from "./EmailDemoModal";

const DISMISS_KEY = "credtek_sticky_dismissed";
const SHOW_THRESHOLD = 0.25; // 25% scroll

export function StickyCTABar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Hydrate the dismissed flag once on mount.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") {
        setDismissed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Track scroll. Show after threshold, hide near the footer so the
  // bar doesn't double up with the final CTA section.
  useEffect(() => {
    if (dismissed) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;

      const pct = scrollTop / max;
      // Hide near the footer (last 12% of the page) — the final CTA
      // is doing the same job there, the sticky bar would compete.
      const nearFooter = pct > 0.88;

      setVisible(pct > SHOW_THRESHOLD && !nearFooter);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [dismissed]);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (dismissed) return null;

  return (
    <>
      <div
        className={`sticky-cta-bar${visible ? " is-visible" : ""}`}
        role="region"
        aria-label="Demo offer"
      >
        <div className="sticky-cta-inner">
          <div className="sticky-cta-text">
            <strong>See CredTek running in your facility.</strong>
            <span className="sticky-cta-sub">
              Interactive demo · no call required · sized to your group
            </span>
          </div>
          <div className="sticky-cta-actions">
            <button
              type="button"
              className="sticky-cta-btn"
              onClick={() => setModalOpen(true)}
            >
              Take a guided tour →
            </button>
            <button
              type="button"
              className="sticky-cta-close"
              onClick={dismiss}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <EmailDemoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
