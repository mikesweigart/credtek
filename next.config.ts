import type { NextConfig } from "next";

// Content-Security-Policy. We deliberately allow 'unsafe-inline' for
// script/style: Next's App Router injects inline bootstrap + RSC-payload
// scripts and we set inline style={{}} attributes, and the alternative —
// per-request nonces — forces every page to render dynamically, which
// would discard our static generation. Everything else is locked to 'self'
// plus the specific third parties we actually call:
//   • *.supabase.co + wss        — database REST + realtime
//   • *.posthog.com              — analytics SDK, ingestion, session recorder
//   • fonts.googleapis/gstatic   — web fonts
//   • www.loom.com               — the demo-video iframe embed
//   • calendly.com               — booking (links today, iframe-ready)
// Upgrade path when we need a strict policy: generate a per-request nonce
// in middleware and swap 'unsafe-inline' for 'nonce-<…>' 'strict-dynamic'.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://*.posthog.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.posthog.com",
  "frame-src 'self' https://www.loom.com https://calendly.com",
  "media-src 'self' blob: data:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const COMMON_SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: ["camera=()", "geolocation=()", "microphone=()", "payment=()", "usb=()", "interest-cohort=()"].join(", "),
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: COMMON_SECURITY_HEADERS },
    ];
  },
};

export default nextConfig;
