// 0–6s · "You run credentialing. Your providers should be billing. Not waiting."
// Burned-in transcript that reads cleanly with sound off.

import { AbsoluteFill } from "remotion";
import { COLORS, SCENES } from "../constants";
import { KineticLine } from "../components/KineticLine";
import { Backdrop } from "../components/Backdrop";

const S = SCENES.hook.start;

export function Scene1_Hook() {
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill
        style={{
          padding: "0 160px",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <KineticLine
          startFrame={S + 6}
          segments={[
            { text: "You run " },
            { text: "credentialing.", emphasis: true },
          ]}
          fontSize={88}
          fontWeight={800}
          align="left"
        />
        <div style={{ height: 38 }} />
        <KineticLine
          startFrame={S + 36}
          segments={[
            { text: "Your providers should be " },
            { text: "billing.", emphasis: true },
          ]}
          fontSize={104}
          fontWeight={900}
          align="left"
          serif={false}
          style={{ maxWidth: 1500 }}
        />
        <div style={{ height: 20 }} />
        <KineticLine
          startFrame={S + 90}
          segments={[{ text: "Not waiting." }]}
          fontSize={64}
          fontWeight={500}
          color={COLORS.accentSoft}
          serif
          style={{ fontStyle: "italic", opacity: 0.92 }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
