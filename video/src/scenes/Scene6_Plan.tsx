// 42–52s · The 3-step plan. Cards slide in left-to-right, each
// numbered, the path looks easy.

import { AbsoluteFill } from "remotion";
import { COLORS, SCENES } from "../constants";
import { KineticLine } from "../components/KineticLine";
import { Backdrop } from "../components/Backdrop";
import { PlanCard } from "../components/PlanCard";

const S = SCENES.plan.start;

export function Scene6_Plan() {
  return (
    <AbsoluteFill>
      <Backdrop intensity={0.88} />

      <AbsoluteFill
        style={{
          padding: "70px 120px 0",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <KineticLine
          startFrame={0}
          segments={[{ text: "How we work together" }]}
          fontSize={22}
          fontWeight={700}
          color={COLORS.accentSoft}
          letterSpacing="0.18em"
          style={{ textTransform: "uppercase", marginBottom: 14 }}
        />
        <KineticLine
          startFrame={12}
          segments={[
            { text: "From signed contract to " },
            { text: "providers billing", emphasis: true },
            { text: "." },
          ]}
          fontSize={56}
          fontWeight={900}
          align="center"
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          padding: "260px 120px 120px",
          flexDirection: "row",
          gap: 32,
          alignItems: "stretch",
        }}
      >
        <PlanCard
          startFrame={36}
          number={1}
          title="See your numbers — today."
          detail="60-second ROI calculator. Know your savings before our first call."
        />
        <PlanCard
          startFrame={56}
          number={2}
          title="Talk to a veteran — this week."
          detail="20 minutes. No slides. Bring your hardest pain — we've seen every failure mode."
        />
        <PlanCard
          startFrame={76}
          number={3}
          title="Onboard your roster — in 14 days."
          detail="Your CSM does the lift. You keep running your practice."
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
