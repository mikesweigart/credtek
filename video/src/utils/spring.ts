// Spring + interpolation helpers used across scenes. Centralizing the
// "feel" here keeps every scene tonally consistent — same overshoot,
// same damping, same easing curves.

import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Standard CredTek spring — tight, slight overshoot. Used everywhere. */
export function useSpringIn(
  startFrame: number,
  opts: { damping?: number; mass?: number; stiffness?: number } = {}
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: opts.damping ?? 14, mass: opts.mass ?? 0.6, stiffness: opts.stiffness ?? 110 },
  });
}

/** Stagger helper — n = index of item, base = first item start frame, delay = per-item delay */
export function stagger(n: number, base: number, delay = 10): number {
  return base + n * delay;
}

/** Fade-in for a scene: 0→1 over `frames`, starting at `start`. */
export function useFade(start: number, frames = 18) {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Symmetric fade in + out around a window. */
export function useWindowFade(
  enterStart: number,
  exitStart: number,
  fadeFrames = 12
) {
  const frame = useCurrentFrame();
  if (frame < enterStart - fadeFrames) return 0;
  if (frame > exitStart + fadeFrames) return 0;
  const inAlpha = interpolate(frame, [enterStart - fadeFrames, enterStart], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outAlpha = interpolate(frame, [exitStart, exitStart + fadeFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(inAlpha, outAlpha);
}

/** Map a frame to a 0→1 ratio inside a window. */
export function progress(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
