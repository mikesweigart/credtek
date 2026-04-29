import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CredTek — Behavioral health credentialing in 45 days. Not 120.",
    template: "%s · CredTek",
  },
  description:
    "The AI-agent-native credentialing platform purpose-built for behavioral health groups. Get your providers in-network 67% faster. Or your subscription is free.",
  openGraph: {
    title: "CredTek · Behavioral health credentialing, 45 days not 120.",
    description:
      "The AI-agent-native credentialing platform purpose-built for behavioral health groups.",
    type: "website",
    siteName: "CredTek",
  },
  twitter: {
    card: "summary_large_image",
    title: "CredTek · Behavioral health credentialing, 45 days not 120.",
    description:
      "The AI-agent-native credentialing platform purpose-built for behavioral health groups.",
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
      <body>{children}</body>
    </html>
  );
}
