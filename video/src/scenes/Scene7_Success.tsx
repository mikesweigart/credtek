// 52–56s · Transformation. Day counter spins DOWN from 120 → 21.
// Coordinators become strategists.

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, SCENES } from "../constants";
import { KineticLine } from "../components/KineticLine";
import { Backdrop } from "../components/Backdrop";

const S = SCENES.success.start;

export function Scene7_Success() {
  const frame = useCurrentFrame();
  const day = interpolate(frame, [0, 50], [120, 21], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Backdrop intensity={1.0} />

      <AbsoluteFill
        style={{
          padding: "70px 120px 0",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <KineticLine
          startFrame={0}
          segments={[
            { text: "Providers billing in " },
            { text: "weeks", emphasis: true },
            { text: ", not months." },
          ]}
          fontSize={64}
          fontWeight={900}
          align="center"
          style={{ marginTop: 0 }}
        />
      </AbsoluteFill>

      {/* Day counter spinning down */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 100px 0",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontVariantNumeric: "tabular-nums",
            fontSize: 180,
            fontWeight: 900,
            color: COLORS.white,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          Day{" "}
          <span style={{ color: COLORS.accent }}>{Math.round(day)}</span>
        </div>
        <KineticLine
          startFrame={30}
          segments={[
            { text: "Coordinators become " },
            { text: "strategists", emphasis: true },
            { text: ", not firefighters." },
          ]}
          fontSize={36}
          fontWeight={600}
          align="center"
          color={COLORS.accentSoft}
          serif
          style={{ marginTop: 36, fontStyle: "italic" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 120px 70px",
        }}
      >
        <KineticLine
          startFrame={72}
          segments={[
            { text: "$2M+ recovered  ·  20× return  ·  $35 / provider / month  ·  live in 14 days" },
          ]}
          fontSize={22}
          fontWeight={600}
          color={COLORS.muted}
          align="center"
          letterSpacing="0.02em"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
