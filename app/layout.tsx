import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ScrollReveal } from "./_components/ScrollReveal";
import { CursorSpotlight } from "./_components/CursorSpotlight";
import { Analytics } from "./_components/Analytics";
import { ChatWidget } from "./_components/ChatWidget";

// Hardcoded canonical site URL — env-based resolution removed because
// Vercel's modifyConfig step was failing with an undefined-path error.
// If we ever need preview-deploy aware URLs again, wire NEXT_PUBLIC_SITE_URL
// after we've confirmed the rest of the build is stable.
// ONE repeatable promise, everywhere. The controlling one-liner —
// "CredTek gets your providers credentialed and billing 40–60% faster" —
// is mirrored across the page <title>, meta description, OG/Twitter
// cards, the hero's sr-only <h1>, and the hero outcome line.
// We lead with a RELATIVE claim ("40–60% faster") rather than an absolute
// timeframe: it's the exact number the ROI calculator and the
// cost-of-inaction section already model, so the headline can't be
// contradicted by our own stage SLAs (which sum to ~81 days). A
// credentialing operator trusts a defensible number, not a superlative.
// "Medical credentialing" stays an exact-match keyword and "billing"
// carries the North Star (speed-to-billable, not just credentialed).
export const metadata: Metadata = {
  metadataBase: new URL("https://cred-tek.com"),
  title: {
    default: "CredTek — Get providers credentialed & billing 40–60% faster.",
    template: "%s · CredTek",
  },
  description:
    "CredTek gets your providers credentialed and billing 40–60% faster. The done-for-you credentialing platform for US medical groups, MSOs & health systems — built by operators with decades of credentialing experience.",
  openGraph: {
    title: "CredTek — Get your providers credentialed and billing 40–60% faster.",
    description:
      "The done-for-you credentialing platform for US medical groups, MSOs & health systems. Built by operators with decades of enterprise medical credentialing experience.",
    type: "website",
    siteName: "CredTek",
    url: "https://cred-tek.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "CredTek — Providers credentialed and billing 40–60% faster.",
    description:
      "The done-for-you credentialing platform for US medical groups, MSOs & health systems — built by veteran credentialing operators.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F2E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ScrollReveal />
        <CursorSpotlight />
        {/* Site-wide support/sales assistant. Self-gates to public
            marketing pages (renders null on the demo portal, the real
            product, white-label, ops and auth routes — those have their
            own in-context guides), so a prospect never sees two bubbles. */}
        <ChatWidget />
        {/* PostHog page-view + autocapture. No-ops without
            NEXT_PUBLIC_POSTHOG_KEY so the build stays green. */}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
