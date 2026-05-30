// CredTek logomark + wordmark. The mark is a dark navy rounded square
// with an italic serif "C" in brand blue — pulled straight from the
// site's .logo-mark CSS. The wordmark uses DM Sans, weight 600.

import { CSSProperties } from "react";
import { COLORS } from "../constants";

type Props = {
  size?: number;
  showWord?: boolean;
  align?: "row" | "col";
  style?: CSSProperties;
  color?: string;
};

export function Logo({
  size = 64,
  showWord = true,
  align = "row",
  style,
  color = COLORS.white,
}: Props) {
  const markFontSize = size * 0.62;
  const wordFontSize = size * 0.55;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: align === "row" ? size * 0.32 : 0,
        flexDirection: align === "row" ? "row" : "column",
        ...style,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          background: COLORS.ink,
          borderRadius: size * 0.22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: markFontSize,
          fontStyle: "italic",
          color: COLORS.accent,
          boxShadow: `0 0 0 1px ${COLORS.accent}30, 0 8px 24px ${COLORS.ink}55`,
        }}
      >
        C
      </div>
      {showWord && (
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            fontSize: wordFontSize,
            color,
          }}
        >
          CredTek
        </span>
      )}
    </div>
  );
}
