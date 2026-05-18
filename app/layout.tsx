import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ScrollReveal } from "./_components/ScrollReveal";
import { CursorSpotlight } from "./_components/CursorSpotlight";

// Canonical site URL — drives absolute resolution for OG/Twitter images.
// Read from env so a Vercel preview deploy resolves against its own URL
// instead of production.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://cred-tek.com");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CredTek — Medical credentialing, faster than anyone in healthcare.",
    template: "%s · CredTek",
  },
  description:
    "The AI-agent-native credentialing platform for US medical practices, MSOs, and health systems. Built by operators with 40+ years of enterprise medical credentialing experience.",
  openGraph: {
    title: "CredTek · Medical credentialing, faster than anyone in healthcare.",
    description:
      "The AI-agent-native credentialing platform for US medical practices, MSOs, and health systems. Built by operators with 40+ years of enterprise medical credentialing experience.",
    type: "website",
    siteName: "CredTek",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "CredTek · Medical credentialing, faster than anyone in healthcare.",
    description:
      "The AI-agent-native credentialing platform for US medical practices, MSOs, and health systems.",
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
      </body>
    </html>
  );
}
