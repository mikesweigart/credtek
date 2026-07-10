// Open Graph share card — shows up when the landing page is linked
// in Slack, LinkedIn, iMessage, etc. Without this the link preview
// is blank, which kills click-through from forwarded shares.
//
// Generated server-side at request time by Next's image-route.
// 1200x630 is the canonical OG dimension.

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CredTek — Get your providers credentialed and billing 40–60% faster.";
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
              fontFamily: "sans-serif",
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

        {/* Middle — headline. NOTE: Satori (next/og) requires every <div>
            with more than one child to set display:flex explicitly. So the
            headline is two stacked single-string lines and the subhead is a
            single string — no mixed text+inline children anywhere. */}
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
            Medical credentialing · done-for-you
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
            <div
              style={{
                fontSize: 66,
                lineHeight: 1.08,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#0B1F2E",
              }}
            >
              Your providers should be billing.
            </div>
            <div
              style={{
                fontSize: 66,
                lineHeight: 1.08,
                fontFamily: "sans-serif",
                fontStyle: "italic",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                color: "#0467DE",
              }}
            >
              Not waiting on credentialing.
            </div>
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#475569",
              lineHeight: 1.4,
              maxWidth: 940,
              marginTop: 8,
            }}
          >
            Credentialed and billing 40–60% faster. Built by operators with decades of enterprise medical credentialing experience.
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
