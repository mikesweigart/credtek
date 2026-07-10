import type { Metadata } from "next";
import { Suspense } from "react";
import { AvelNav, AvelShellProvider } from "./_components/AvelNav";
import { AvelGuide } from "./_components/AvelGuide";
import { AvelCommandPalette } from "./_components/AvelCommandPalette";

// Eastside Hospital-branded portal — fully scoped under /eastside-hospital. Maps to
// avelecare.cred-tek.com via subdomain rewrite (configured in
// next.config or Vercel project settings; DNS handled separately).
//
// The .avelecare-shell wrapper applies Eastside Hospital's color palette by
// overriding the global CSS variables, so existing utility classes
// inherit Eastside Hospital's tone without duplicate stylesheets.

export const metadata: Metadata = {
  title: {
    default: "Eastside Hospital Credentialing Portal",
    template: "%s · Eastside Hospital Credentialing",
  },
  description:
    "Track every Eastside Hospital clinician from intake through ready-to-bill — across all service lines, partner facilities, and states.",
  robots: { index: false, follow: false }, // demo portal — keep out of search
};

export default function AvelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="avelecare-shell">
      <AvelShellProvider>
        <AvelNav />
        <div className="avel-main">
          {children}
        </div>
        <Suspense fallback={null}>
          <AvelGuide />
        </Suspense>
        <AvelCommandPalette />
      </AvelShellProvider>
    </div>
  );
}
