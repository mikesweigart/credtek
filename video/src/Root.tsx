// Remotion root — registers the composition the CLI renders against.

import { Composition } from "remotion";
import { CredTekVideo } from "./Composition";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CredTek60"
        component={CredTekVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {/* 9:16 vertical cut — reflows in a follow-up; keeping the
          composition slot here so we can render with -c CredTek60_9x16 later. */}
      <Composition
        id="CredTek60-vertical"
        component={CredTekVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CredTek60-square"
        component={CredTekVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1080}
      />
    </>
  );
};
