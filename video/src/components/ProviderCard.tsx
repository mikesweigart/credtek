// Recreated CredTek provider dashboard card — pixel-aligned to the
// real /app/providers/[id] page. Animates in as panels: header, then
// speed-to-billable hero, then progress bar.

import { CSSProperties } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants";
import { useSpringIn } from "../utils/spring";

type Props = {
  startFrame: number;
  style?: CSSProperties;
  daysToBillable: number; // animated value
  pct: number;            // 0–100, animated value
};

export function ProviderCard({ startFrame, style, daysToBillable, pct }: Props) {
  const frame = useCurrentFrame();
  const headerT = useSpringIn(startFrame, { damping: 16, stiffness: 120 });
  const heroT = useSpringIn(startFrame + 8, { damping: 16, stiffness: 120 });
  const progT = useSpringIn(startFrame + 16, { damping: 16, stiffness: 120 });
  const liveBlink = (Math.sin(frame * 0.4) + 1) / 2;

  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 22,
        boxShadow: `0 30px 80px ${COLORS.ink}25, 0 10px 30px ${COLORS.ink}15`,
        overflow: "hidden",
        opacity: headerT,
        transform: `translateY(${(1 - headerT) * 30}px)`,
        ...style,
      }}
    >
      {/* Header row */}
      <div
        style={{
          padding: "26px 32px",
          borderBottom: `1px solid ${COLORS.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 30,
              fontWeight: 800,
              color: COLORS.ink,
              letterSpacing: "-0.015em",
            }}
          >
            Dr. Sarah Reyes, PsyD
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 16,
              color: COLORS.muted,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Psychology · TX · FL · GA ·{" "}
            <span style={{ color: COLORS.accent, fontWeight: 700 }}>
              Enrollment
            </span>
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            background: `${COLORS.accent}12`,
            border: `1.5px solid ${COLORS.accent}50`,
            borderRadius: 999,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            color: COLORS.accent,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: COLORS.accent,
              opacity: liveBlink,
            }}
          />
          Agent: filling form (live)
        </div>
      </div>

      {/* Speed-to-billable hero */}
      <div
        style={{
          padding: "28px 32px 24px",
          background: `linear-gradient(135deg, ${COLORS.inkDeep} 0%, ${COLORS.ink} 60%, ${COLORS.accentDeep} 100%)`,
          color: COLORS.white,
          opacity: heroT,
          transform: `translateY(${(1 - heroT) * 12}px)`,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.78,
            marginBottom: 6,
          }}
        >
          Projected days to billable
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            fontFamily: "'DM Sans', sans-serif",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(daysToBillable)}
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              marginLeft: 12,
              color: COLORS.accentSoft,
            }}
          >
            days
          </span>
        </div>
        <div style={{ marginTop: 10, fontSize: 16, opacity: 0.85 }}>
          8 / 12 payors active · 4 in flight · industry avg ~120 days
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "20px 32px 28px", opacity: progT }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            fontWeight: 700,
            color: COLORS.muted,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          <span>Intake</span>
          <span>PSV</span>
          <span>Privileging</span>
          <span>Committee</span>
          <span style={{ color: COLORS.accent }}>Enrollment ●</span>
          <span>Approved</span>
        </div>
        <div
          style={{
            position: "relative",
            height: 10,
            borderRadius: 6,
            background: COLORS.cream,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.positive})`,
              borderRadius: 6,
            }}
          />
        </div>
      </div>
    </div>
  );
}
