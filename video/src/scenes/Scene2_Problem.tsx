// 6–16s · The Portal Grind. Stacking pain bullets + an animated
// "Day 1 → Day 120" counter. Ends on the villain name in giant accent.

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, SCENES } from "../constants";
import { KineticLine } from "../components/KineticLine";
import { Backdrop } from "../components/Backdrop";
import { useSpringIn } from "../utils/spring";

const S = SCENES.problem.start;

const PAINS = [
  "CAQH attestations.",
  "30-payor re-entry.",
  "Aetna's portal changed last night.",
];

function PainBullets() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        maxWidth: 980,
      }}
    >
      {PAINS.map((line, i) => (
        <KineticLine
          key={i}
          startFrame={10 + i * 24}
          segments={[{ text: line }]}
          fontSize={48}
          fontWeight={500}
          color={COLORS.accentSoft}
          letterSpacing="-0.015em"
          style={{ opacity: 0.92 }}
        />
      ))}
    </div>
  );
}

function DayCounter() {
  const frame = useCurrentFrame();
  const enter = useSpringIn(110, { damping: 16, stiffness: 110 });
  // Count from 1 → 120 between frames 110 and 220 (≈3.6s)
  const day = interpolate(frame, [120, 230], [1, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 14}px)`,
        marginTop: 30,
      }}
    >
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: COLORS.muted,
          marginBottom: 12,
        }}
      >
        One new clinician
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontVariantNumeric: "tabular-nums",
          fontSize: 120,
          fontWeight: 900,
          color: COLORS.white,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        Day{" "}
        <span style={{ color: COLORS.accent }}>{Math.round(day)}</span>
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontStyle: "italic",
          fontSize: 36,
          color: COLORS.accentSoft,
          opacity: enter,
        }}
      >
        … still not billing.
      </div>
    </div>
  );
}

export function Scene2_Problem() {
  return (
    <AbsoluteFill>
      <Backdrop intensity={1.05} />

      {/* Left column: pain bullets + counter */}
      <AbsoluteFill style={{ padding: "120px 160px", justifyContent: "flex-start" }}>
        <KineticLine
          startFrame={0}
          segments={[{ text: "Every day:" }]}
          fontSize={28}
          fontWeight={700}
          letterSpacing="0.18em"
          color={COLORS.muted}
          style={{ textTransform: "uppercase", marginBottom: 28 }}
        />
        <PainBullets />
        <DayCounter />
      </AbsoluteFill>

      {/* Villain name lands in the last second */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          padding: "0 120px 100px 0",
        }}
      >
        <KineticLine
          startFrame={230}
          segments={[
            { text: "This is " },
            { text: "The Portal Grind", emphasis: true },
            { text: "." },
          ]}
          fontSize={72}
          fontWeight={900}
          align="right"
          shake
          style={{ maxWidth: 1100 }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
