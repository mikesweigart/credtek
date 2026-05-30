// 32–42s · What CredTek does. Live provider card assembles, payor
// chips flip green one at a time, the human-approval trust line lands.

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, SCENES } from "../constants";
import { KineticLine } from "../components/KineticLine";
import { Backdrop } from "../components/Backdrop";
import { PayorChip } from "../components/PayorChip";
import { ProviderCard } from "../components/ProviderCard";

const S = SCENES.product.start;

const PAYORS = [
  { name: "Aetna",    appear: 30, flip: 80 },
  { name: "UHC",      appear: 40, flip: 100 },
  { name: "Cigna",    appear: 50, flip: 120 },
  { name: "Humana",   appear: 60, flip: 140 },
  { name: "Medicare", appear: 70, flip: 160 },
  { name: "Optum",    appear: 80, flip: 180 },
];

export function Scene5_Product() {
  const frame = useCurrentFrame();

  // The "days to billable" number on the dashboard counts down 60 → 22
  // as the payor chips flip green — the metric drops because more
  // payors are active.
  const days = interpolate(frame, [16, 200], [60, 22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pct = interpolate(frame, [16, 200], [38, 72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Backdrop intensity={0.85} />

      {/* Headline */}
      <AbsoluteFill
        style={{
          padding: "60px 120px 0",
          justifyContent: "flex-start",
        }}
      >
        <KineticLine
          startFrame={0}
          segments={[
            { text: "AI agents that " },
            { text: "file the work.", emphasis: true },
          ]}
          fontSize={62}
          fontWeight={900}
          align="left"
        />
      </AbsoluteFill>

      {/* Two-column: dashboard left, payor chips right */}
      <AbsoluteFill
        style={{
          padding: "180px 100px 200px",
          flexDirection: "row",
          gap: 50,
          alignItems: "center",
        }}
      >
        <ProviderCard
          startFrame={14}
          daysToBillable={days}
          pct={pct}
          style={{ flex: "1.15 1 0", maxWidth: 980 }}
        />

        <div
          style={{
            flex: "1 1 0",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            alignItems: "flex-start",
          }}
        >
          <KineticLine
            startFrame={24}
            segments={[{ text: "Payor enrollment — end to end" }]}
            fontSize={22}
            fontWeight={700}
            color={COLORS.accentSoft}
            letterSpacing="0.10em"
            style={{ textTransform: "uppercase", marginBottom: 6 }}
          />
          {PAYORS.map((p) => (
            <PayorChip key={p.name} appearFrame={p.appear} flipFrame={p.flip} name={p.name} />
          ))}
        </div>
      </AbsoluteFill>

      {/* Bottom: 50-state PSV · CAQH · audit binder + trust line */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 100px 60px",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <KineticLine
          startFrame={200}
          segments={[
            { text: "50-state PSV  ·  CAQH auto-attestation  ·  NCQA audit binder" },
          ]}
          fontSize={26}
          fontWeight={600}
          color={COLORS.accentSoft}
          align="center"
          letterSpacing="-0.005em"
          style={{ opacity: 0.95 }}
        />
        <KineticLine
          startFrame={224}
          segments={[
            { text: "Every submission clears a " },
            { text: "coordinator", emphasis: true },
            { text: " before it leaves CredTek." },
          ]}
          fontSize={32}
          fontWeight={700}
          align="center"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
