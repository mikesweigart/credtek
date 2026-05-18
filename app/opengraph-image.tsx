// Open Graph share card — shows up when the landing page is linked
// in Slack, LinkedIn, iMessage, etc. Without this the link preview
// is blank, which kills click-through from forwarded shares.
//
// Generated server-side at request time by Next's image-route.
// 1200x630 is the canonical OG dimension.

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CredTek — Medical credentialing, faster than anyone in healthcare.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #F7FAFD 0%, #E8F2FE 100%)",
          padding: "72px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
          color: "#0B1F2E",
        }}
      >
        {/* Top — logo lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#0B1F2E",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0467DE",
              fontFamily: "serif",
              fontStyle: "italic",
              fontSize: 38,
              lineHeight: 1,
            }}
          >
            C
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#0B1F2E",
            }}
          >
            CredTek
          </div>
        </div>

        {/* Middle — headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0053A0",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Medical credentialing · AI-agent-native
          </div>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#0B1F2E",
              maxWidth: 980,
            }}
          >
            Your providers should be{" "}
            <span
              style={{
                fontFamily: "serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#0467DE",
              }}
            >
              billing.
            </span>{" "}
            Not waiting on credentialing.
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#475569",
              lineHeight: 1.4,
              maxWidth: 920,
              marginTop: 8,
            }}
          >
            Faster than anyone in healthcare. Built by operators with{" "}
            <b style={{ color: "#0B1F2E" }}>40+ years</b> of enterprise
            medical credentialing experience.
          </div>
        </div>

        {/* Bottom — proof line */}
        <div
          style={{
            display: "flex",
            gap: 22,
            fontSize: 18,
            color: "#0B1F2E",
            fontWeight: 600,
            opacity: 0.78,
          }}
        >
          <span>HCA Healthcare</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>UHS</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Encompass Health</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Select Medical</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Ascension</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
