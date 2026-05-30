// Shared dark backdrop with a slow gradient pan + faint grid pattern.
// One layer, every scene, so transitions cross-fade against a stable
// surface.

import { CSSProperties } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, TOTAL_FRAMES } from "../constants";

type Props = { intensity?: number; style?: CSSProperties };

export function Backdrop({ intensity = 1, style }: Props) {
  const frame = useCurrentFrame();
  // Slow pan across 60s
  const pan = interpolate(frame, [0, TOTAL_FRAMES], [0, 30]);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(
          1400px 800px at ${50 + pan}% ${30 - pan / 2}%,
          ${COLORS.accentDeep}55,
          transparent 60%
        ), linear-gradient(135deg, ${COLORS.inkDeep} 0%, ${COLORS.ink} 60%, ${COLORS.inkSoft} 100%)`,
        opacity: intensity,
        ...style,
      }}
    >
      {/* faint grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${COLORS.accent}08 1px, transparent 1px), linear-gradient(90deg, ${COLORS.accent}08 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 80%)",
        }}
      />
    </div>
  );
}
