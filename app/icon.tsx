// Favicon — generated at build time by Next's image-route convention.
// Renders a 32x32 PNG of the CredTek "C" mark. Matches the in-product
// logo so the browser tab is recognisable when prospects pile up tabs.

import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0B1F2E",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0467DE",
          fontSize: 22,
          fontFamily: "serif",
          fontStyle: "italic",
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          paddingBottom: 2,
        }}
      >
        C
      </div>
    ),
    { ...size }
  );
}
