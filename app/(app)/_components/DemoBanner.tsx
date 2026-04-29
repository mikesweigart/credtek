// Persistent thin banner across every app-shell page. Reassures partners
// that what they're seeing is sample data — not real PHI — and gives a
// constant CTA back to a real demo booking.

import Link from "next/link";

export function DemoBanner() {
  return (
    <div className="demo-banner">
      <span className="demo-banner-dot">●</span>
      <span>
        <strong>Demo workspace</strong> · sample providers, no real PHI
      </span>
      <Link href="/ops/queue" className="demo-banner-link">
        ↳ Switch to Ops view
      </Link>
      <Link href="/" className="demo-banner-cta">
        See the marketing site →
      </Link>
    </div>
  );
}
