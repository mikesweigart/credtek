// KineticLine — the core typography primitive. A single line of copy
// that springs into place with controllable scale + slide. Supports
// inline <strong> emphasis via segments (plain | accent) so we can
// color the brand-emphasis words without parsing HTML.

import { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../constants";
import { useSpringIn } from "../utils/spring";

export type Segment = { text: string; emphasis?: boolean };

type Props = {
  startFrame: number;
  segments: Segment[];
  fontSize: number;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: string;
  serif?: boolean;
  align?: "left" | "center" | "right";
  color?: string;
  maxWidth?: number | string;
  style?: CSSProperties;
  emphasisColor?: string;
  shake?: boolean; // tiny shake on emphasis (used for "Grind")
};

export function KineticLine({
  startFrame,
  segments,
  fontSize,
  fontWeight = 700,
  lineHeight = 1.08,
  letterSpacing = "-0.02em",
  serif = false,
  align = "left",
  color = COLORS.white,
  maxWidth,
  style,
  emphasisColor = COLORS.accent,
  shake = false,
}: Props) {
  const frame = useCurrentFrame();
  const t = useSpringIn(startFrame, { damping: 16, stiffness: 130, mass: 0.55 });

  const opacity = t;
  const translateY = (1 - t) * 18;
  const scale = 0.96 + t * 0.04;

  // Tiny shake on the emphasized word(s) for the villain reveal.
  const shakePx = shake ? Math.sin((frame - startFrame) * 0.6) * (Math.max(0, 1 - (frame - startFrame) / 24)) * 4 : 0;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        fontFamily: serif ? "'Instrument Serif', Georgia, serif" : "'DM Sans', -apple-system, sans-serif",
        fontWeight,
        fontSize,
        lineHeight,
        letterSpacing,
        color,
        textAlign: align,
        maxWidth,
        ...style,
      }}
    >
      {segments.map((seg, i) => (
        <span
          key={i}
          style={
            seg.emphasis
              ? {
                  color: emphasisColor,
                  fontStyle: serif ? "italic" : "normal",
                  transform: `translateX(${shakePx}px)`,
                  display: "inline-block",
                }
              : undefined
          }
        >
          {seg.text}
        </span>
      ))}
    </div>
  );
}
