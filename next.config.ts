import type { NextConfig } from "next";

const COMMON_SECURITY_HEADERS = [
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
