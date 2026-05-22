import type { Metadata } from "next";
import { Suspense } from "react";
import { AvelNav } from "./_components/AvelNav";
import { AvelGuide } from "./_components/AvelGuide";

// Avel-branded portal — fully scoped under /avelecare. Maps to
// avelecare.cred-tek.com via subdomain rewrite (configured in
// next.config or Vercel project settings; DNS handled separately).
//
// The .avelecare-shell wrapper applies Avel's color palette by
// overriding the global CSS variables, so existing utility classes
// inherit Avel's tone without duplicate stylesheets.

export const metadata: Metadata = {
  title: {
    default: "Avel eCare Credentialing Portal",
    template: "%s · Avel eCare Credentialing",
  },
  description:
    "Track every Avel eCare clinician from intake through ready-to-bill — across all service lines, partner facilities, and states.",
  robots: { index: false, follow: false }, // demo portal — keep out of search
};

export default function AvelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="avelecare-shell">
      <AvelNav />
      <div className="avel-main">
        {children}
      </div>
      <Suspense fallback={null}>
        <AvelGuide />
      </Suspense>
    </div>
  );
}
