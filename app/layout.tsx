import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ScrollReveal } from "./_components/ScrollReveal";
import { CursorSpotlight } from "./_components/CursorSpotlight";
import { Analytics } from "./_components/Analytics";

// Hardcoded canonical site URL — env-based resolution removed because
// Vercel's modifyConfig step was failing with an undefined-path error.
// If we ever need preview-deploy aware URLs again, wire NEXT_PUBLIC_SITE_URL
// after we've confirmed the rest of the build is stable.
// ONE repeatable promise, everywhere. The controlling one-liner —
// "CredTek gets your providers credentialed and billing in weeks, not
// months" — is mirrored across the page <title>, meta description,
// OG/Twitter cards, the hero's sr-only <h1>, and the hero outcome line.
// We lead with "weeks, not months" (the concrete, provable promise that
// already anchors the body's stakes + why-us sections) instead of the
// old "faster than anyone in healthcare" brag — a credentialing operator
// trusts a specific timeframe, not a superlative. "Medical credentialing"
// stays as an exact-match keyword and "billing" carries the North Star
// (speed-to-billable, not just credentialed).
export const metadata: Metadata = {
  metadataBase: new URL("https://cred-tek.com"),
  title: {
    default: "CredTek — Medical credentialing & billing in weeks, not months.",
    template: "%s · CredTek",
  },
  description:
    "CredTek gets your providers credentialed and billing in weeks, not months. The AI-agent-native credentialing platform for US medical groups, MSOs & health systems — built by operators with 40+ years of credentialing experience.",
  openGraph: {
    title: "CredTek — Get your providers credentialed and billing in weeks, not months.",
    description:
      "The AI-agent-native credentialing platform for US medical groups, MSOs & health systems. Built by operators with 40+ years of enterprise medical credentialing experience.",
    type: "website",
    siteName: "CredTek",
    url: "https://cred-tek.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "CredTek — Providers credentialed and billing in weeks, not months.",
    description:
      "The AI-agent-native credentialing platform for US medical groups, MSOs & health systems — built by 40-year credentialing operators.",
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
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ScrollReveal />
        <CursorSpotlight />
        {/* PostHog page-view + autocapture. No-ops without
            NEXT_PUBLIC_POSTHOG_KEY so the build stays green. */}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
