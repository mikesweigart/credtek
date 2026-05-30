// Spring-driven number count-up. Formats currency or plain numbers,
// renders in big bold type by default. The number itself springs from
// 0 to the target value; the surrounding label springs in alongside.

import { CSSProperties } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants";
import { useSpringIn } from "../utils/spring";

type Props = {
  startFrame: number;
  durationFrames?: number;
  to: number;
  prefix?: string;
  suffix?: string;
  format?: "plain" | "currency" | "money-thousands";
  fontSize: number;
  color?: string;
  fontWeight?: number;
  letterSpacing?: string;
  style?: CSSProperties;
};

function fmt(n: number, format: NonNullable<Props["format"]>): string {
  switch (format) {
    case "currency":
      return Math.round(n).toLocaleString("en-US");
    case "money-thousands":
      return Math.round(n).toLocaleString("en-US");
    default:
      return Math.round(n).toLocaleString("en-US");
  }
}

export function CountUp({
  startFrame,
  durationFrames = 38,
  to,
  prefix = "",
  suffix = "",
  format = "plain",
  fontSize,
  color = COLORS.white,
  fontWeight = 900,
  letterSpacing = "-0.04em",
  style,
}: Props) {
  const frame = useCurrentFrame();
  const springAlpha = useSpringIn(startFrame, { damping: 18, stiffness: 90, mass: 0.7 });
  // Slow ease for the number itself so it lands satisfyingly.
  const numAlpha = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Ease-out cubic for the count
  const eased = 1 - Math.pow(1 - numAlpha, 3);
  const current = to * eased;

  return (
    <div
      style={{
        opacity: springAlpha,
        transform: `scale(${0.94 + springAlpha * 0.06})`,
        fontFamily: "'DM Sans', sans-serif",
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {prefix}{fmt(current, format)}{suffix}
    </div>
  );
}
