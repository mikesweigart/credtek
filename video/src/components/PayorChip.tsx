// Animated payor enrollment chip — starts gray + outline, then flips
// green with a spring at its scheduled flip frame. Used in the
// product beat to make the platform feel alive.

import { CSSProperties } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants";
import { useSpringIn } from "../utils/spring";

type Props = {
  appearFrame: number;
  flipFrame: number;
  name: string;
  style?: CSSProperties;
};

export function PayorChip({ appearFrame, flipFrame, name, style }: Props) {
  const frame = useCurrentFrame();
  const appearT = useSpringIn(appearFrame, { damping: 16, stiffness: 130 });
  const flipT = interpolate(frame, [flipFrame, flipFrame + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bg = flipT > 0.5 ? COLORS.positive : COLORS.cream;
  const border = flipT > 0.5 ? COLORS.positive : COLORS.line;
  const fg = flipT > 0.5 ? COLORS.white : COLORS.inkSoft;

  // Subtle scale pop on flip
  const popScale = 1 + flipT * 0.06 - Math.pow(flipT - 0.5, 2) * 0.2;
  return (
    <div
      style={{
        opacity: appearT,
        transform: `translateY(${(1 - appearT) * 8}px) scale(${appearT * popScale})`,
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 18px",
        borderRadius: 999,
        background: bg,
        border: `1.5px solid ${border}`,
        color: fg,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: "-0.01em",
        boxShadow: flipT > 0.5 ? `0 6px 20px ${COLORS.positive}40` : "none",
        transition: "none",
        ...style,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: flipT > 0.5 ? COLORS.white : COLORS.muted,
          opacity: 0.9,
        }}
      />
      <span style={{ fontWeight: 700 }}>{name}</span>
      {flipT > 0.5 && (
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            opacity: 0.85,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          · in-network · active
        </span>
      )}
    </div>
  );
}
