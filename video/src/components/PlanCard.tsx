// One of the three "How it works" plan cards. Each card springs in
// independently with a slight stagger; the active one (currentIndex)
// is elevated.

import { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../constants";
import { useSpringIn } from "../utils/spring";

type Props = {
  startFrame: number;
  number: number;
  title: string;
  detail: string;
  style?: CSSProperties;
};

export function PlanCard({ startFrame, number, title, detail, style }: Props) {
  const frame = useCurrentFrame();
  const t = useSpringIn(startFrame, { damping: 15, stiffness: 110 });
  const elapsed = Math.max(0, frame - startFrame);
  const pulse = 1 + Math.max(0, Math.sin(elapsed * 0.06)) * 0.01;

  return (
    <div
      style={{
        flex: "1 1 0",
        background: COLORS.white,
        borderRadius: 22,
        padding: "32px 28px",
        boxShadow: `0 24px 60px ${COLORS.ink}28, 0 6px 16px ${COLORS.ink}15`,
        border: `1px solid ${COLORS.line}`,
        opacity: t,
        transform: `translateY(${(1 - t) * 30}px) scale(${t * pulse})`,
        ...style,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${COLORS.accentDeep}, ${COLORS.accent})`,
          color: COLORS.white,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 800,
          fontSize: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "-0.02em",
          marginBottom: 22,
          boxShadow: `0 10px 24px ${COLORS.accent}55`,
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 26,
          fontWeight: 800,
          color: COLORS.ink,
          letterSpacing: "-0.015em",
          lineHeight: 1.18,
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 18,
          color: COLORS.muted,
          lineHeight: 1.45,
        }}
      >
        {detail}
      </div>
    </div>
  );
}
