// 16–24s · Stakes. $2,000/day × scale = $6M/year. Big numbers, sober
// type, accent reserved for the dollar signs and the punchline.

import { AbsoluteFill } from "remotion";
import { COLORS, SCENES } from "../constants";
import { KineticLine } from "../components/KineticLine";
import { CountUp } from "../components/CountUp";
import { Backdrop } from "../components/Backdrop";

const S = SCENES.stakes.start;

export function Scene3_Stakes() {
  return (
    <AbsoluteFill>
      <Backdrop intensity={1.1} />
      <AbsoluteFill
        style={{
          padding: "0 160px",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <KineticLine
          startFrame={0}
          segments={[{ text: "Every idle provider:" }]}
          fontSize={42}
          fontWeight={600}
          color={COLORS.accentSoft}
          align="center"
          style={{ marginBottom: 28 }}
        />

        {/* $2,000/day */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 96,
              fontWeight: 900,
              color: COLORS.accent,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            $
          </span>
          <CountUp
            startFrame={18}
            to={2000}
            fontSize={156}
            color={COLORS.white}
            format="currency"
          />
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 48,
              fontWeight: 600,
              color: COLORS.muted,
              letterSpacing: "-0.02em",
            }}
          >
            / day · in lost revenue
          </span>
        </div>

        <div style={{ height: 60 }} />

        <KineticLine
          startFrame={80}
          segments={[
            { text: "200 providers · 10 new hires per quarter:" },
          ]}
          fontSize={32}
          fontWeight={500}
          color={COLORS.accentSoft}
          align="center"
          style={{ marginBottom: 20 }}
        />

        {/* $6,000,000 */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 130,
              fontWeight: 900,
              color: COLORS.accent,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            $
          </span>
          <CountUp
            startFrame={110}
            durationFrames={56}
            to={6_000_000}
            fontSize={210}
            color={COLORS.white}
            format="currency"
          />
        </div>

        <KineticLine
          startFrame={200}
          segments={[
            { text: "Every year. " },
            { text: "Quiet.", emphasis: true },
            { text: " " },
            { text: "Compounding.", emphasis: true },
          ]}
          fontSize={40}
          fontWeight={600}
          align="center"
          serif
          style={{ marginTop: 32, fontStyle: "italic" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
