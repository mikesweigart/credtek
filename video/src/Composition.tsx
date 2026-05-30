// Top-level composition. Each scene is wrapped in a <Sequence> so it
// only renders during its window, and the windows overlap by ~10 frames
// for a clean crossfade-style transition.
//
// All 8 beats compose against the same Backdrop layer, so the visual
// thread (gradient + grid) is continuous even though the content cuts.

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { COLORS, SCENES, TOTAL_FRAMES } from "./constants";
import { Scene1_Hook } from "./scenes/Scene1_Hook";
import { Scene2_Problem } from "./scenes/Scene2_Problem";
import { Scene3_Stakes } from "./scenes/Scene3_Stakes";
import { Scene4_Guide } from "./scenes/Scene4_Guide";
import { Scene5_Product } from "./scenes/Scene5_Product";
import { Scene6_Plan } from "./scenes/Scene6_Plan";
import { Scene7_Success } from "./scenes/Scene7_Success";
import { Scene8_CTA } from "./scenes/Scene8_CTA";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadInstrument } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

// Load brand fonts so the rendered frames are deterministic. Restrict
// weights/subsets to what the scenes actually use — full-set loading
// fetches ~100 network requests per font and slows the render.
loadDMSans("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
loadInstrument("normal", { weights: ["400"], subsets: ["latin"] });
loadMono("normal", { weights: ["600", "700"], subsets: ["latin"] });

const CROSSFADE = 12;

export const CredTekVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.inkDeep }}>
      {/* Each scene runs in its own Sequence window. The window is
          slightly wider than the cut to allow content to enter/exit
          cleanly without popping. */}
      <Sequence from={SCENES.hook.start} durationInFrames={SCENES.hook.end - SCENES.hook.start + CROSSFADE}>
        <Scene1_Hook />
      </Sequence>
      <Sequence from={SCENES.problem.start} durationInFrames={SCENES.problem.end - SCENES.problem.start + CROSSFADE}>
        <Scene2_Problem />
      </Sequence>
      <Sequence from={SCENES.stakes.start} durationInFrames={SCENES.stakes.end - SCENES.stakes.start + CROSSFADE}>
        <Scene3_Stakes />
      </Sequence>
      <Sequence from={SCENES.guide.start} durationInFrames={SCENES.guide.end - SCENES.guide.start + CROSSFADE}>
        <Scene4_Guide />
      </Sequence>
      <Sequence from={SCENES.product.start} durationInFrames={SCENES.product.end - SCENES.product.start + CROSSFADE}>
        <Scene5_Product />
      </Sequence>
      <Sequence from={SCENES.plan.start} durationInFrames={SCENES.plan.end - SCENES.plan.start + CROSSFADE}>
        <Scene6_Plan />
      </Sequence>
      <Sequence from={SCENES.success.start} durationInFrames={SCENES.success.end - SCENES.success.start + CROSSFADE}>
        <Scene7_Success />
      </Sequence>
      <Sequence from={SCENES.cta.start} durationInFrames={SCENES.cta.end - SCENES.cta.start}>
        <Scene8_CTA />
      </Sequence>

      {/* Procedurally-generated synth bed. Falls back gracefully if
          the file isn't there. */}
      <Audio src={staticFile("bed.mp3")} volume={0.18} />
    </AbsoluteFill>
  );
};
