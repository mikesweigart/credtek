// 24–32s · The Guide enters. Logo assembles, empathy + authority,
// Mike's headshot, the health systems roll-cycle.

import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLORS, SCENES } from "../constants";
import { KineticLine } from "../components/KineticLine";
import { Backdrop } from "../components/Backdrop";
import { Logo } from "../components/Logo";
import { useSpringIn } from "../utils/spring";

const S = SCENES.guide.start;

function AuthorityChip({ start, label, value }: { start: number; label: string; value: string }) {
  const t = useSpringIn(start, { damping: 16, stiffness: 110 });
  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * 14}px) scale(${0.96 + t * 0.04})`,
        background: `${COLORS.white}10`,
        border: `1.5px solid ${COLORS.accent}50`,
        borderRadius: 16,
        padding: "22px 28px",
        minWidth: 240,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: COLORS.accentSoft,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 44,
          fontWeight: 900,
          color: COLORS.white,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function Scene4_Guide() {
  const logoT = useSpringIn(0, { damping: 14, stiffness: 120 });
  const headshotT = useSpringIn(40, { damping: 16, stiffness: 100 });

  return (
    <AbsoluteFill>
      <Backdrop intensity={0.92} />

      {/* Logo at top-center */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 90 }}>
        <div
          style={{
            opacity: logoT,
            transform: `scale(${0.85 + logoT * 0.15})`,
          }}
        >
          <Logo size={96} showWord />
        </div>
      </AbsoluteFill>

      {/* Empathy line */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 260,
          padding: "260px 200px 0",
        }}
      >
        <KineticLine
          startFrame={24}
          segments={[
            { text: "Built by operators who've fought every portal you have." },
          ]}
          fontSize={44}
          fontWeight={600}
          color={COLORS.accentSoft}
          align="center"
          letterSpacing="-0.015em"
        />
      </AbsoluteFill>

      {/* Mike headshot + authority chips */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 100,
          padding: "0 180px 100px",
          flexDirection: "row",
          gap: 60,
        }}
      >
        <div
          style={{
            opacity: headshotT,
            transform: `translateY(${(1 - headshotT) * 20}px) scale(${headshotT})`,
            width: 220,
            height: 220,
            borderRadius: "50%",
            overflow: "hidden",
            border: `4px solid ${COLORS.accent}`,
            boxShadow: `0 24px 60px ${COLORS.ink}aa`,
            flexShrink: 0,
          }}
        >
          <Img
            src={staticFile("mike-headshot.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div style={{ display: "flex", gap: 18, flex: 1 }}>
          <AuthorityChip start={56} label="Combined experience" value="40+ years" />
          <AuthorityChip start={72} label="Facilities" value="700+" />
          <AuthorityChip start={88} label="Beds" value="80,000+" />
        </div>
      </AbsoluteFill>

      {/* Bottom bar: health systems + compliance */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 36,
          padding: "0 120px 36px",
        }}
      >
        <KineticLine
          startFrame={130}
          segments={[
            { text: "Same tech inside " },
            { text: "HCA · UHS · Ascension · Encompass · Select Medical", emphasis: true },
            { text: "  ·  HIPAA + BAA, day one  ·  NCQA-aligned" },
          ]}
          fontSize={22}
          fontWeight={600}
          color={COLORS.muted}
          align="center"
          letterSpacing="0.02em"
          style={{ opacity: 0.95 }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
