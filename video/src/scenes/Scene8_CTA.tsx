// 56–60s · CTA. Big primary button "Book a demo →", transitional CTA,
// URL. Hold on this frame.

import { AbsoluteFill } from "remotion";
import { COLORS, SCENES } from "../constants";
import { KineticLine } from "../components/KineticLine";
import { Backdrop } from "../components/Backdrop";
import { Logo } from "../components/Logo";
import { useSpringIn } from "../utils/spring";
import { useCurrentFrame } from "remotion";

const S = SCENES.cta.start;

function CTAButton() {
  const t = useSpringIn(18, { damping: 14, stiffness: 110 });
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin((frame - 30) * 0.12) * 0.012;
  return (
    <div
      style={{
        opacity: t,
        transform: `scale(${t * pulse})`,
        background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDeep})`,
        color: COLORS.white,
        padding: "28px 60px",
        borderRadius: 18,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 800,
        fontSize: 56,
        letterSpacing: "-0.02em",
        boxShadow: `0 24px 60px ${COLORS.accent}80, 0 8px 24px ${COLORS.accent}55`,
      }}
    >
      Book a demo &nbsp;→
    </div>
  );
}

export function Scene8_CTA() {
  const logoT = useSpringIn(0, { damping: 14, stiffness: 120 });
  return (
    <AbsoluteFill>
      <Backdrop intensity={1.0} />

      {/* Logo */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 90 }}>
        <div style={{ opacity: logoT, transform: `scale(${0.9 + logoT * 0.1})` }}>
          <Logo size={88} showWord />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <CTAButton />

        <KineticLine
          startFrame={40}
          segments={[{ text: "or see your ROI first." }]}
          fontSize={30}
          fontWeight={500}
          color={COLORS.accentSoft}
          align="center"
          serif
          style={{ fontStyle: "italic" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 80,
        }}
      >
        <KineticLine
          startFrame={60}
          segments={[{ text: "cred-tek.com", emphasis: true }]}
          fontSize={48}
          fontWeight={800}
          align="center"
          letterSpacing="-0.02em"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
