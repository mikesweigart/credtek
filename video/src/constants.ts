// Brand + timing constants. Pulled from cred-tek.com globals.css so the
// video stays pixel-aligned with the live site.

export const COLORS = {
  ink: "#0B1F2E",
  inkDeep: "#061421",
  inkSoft: "#1A3344",
  accent: "#0467DE",       // brand blue (--gold legacy var)
  accentDeep: "#0053A0",
  accentSoft: "#5B9FF5",
  accentTint: "#E8F2FE",
  paper: "#F7FAFD",
  cream: "#F0F4FA",
  line: "#DCE4ED",
  muted: "#6B7B85",
  positive: "#2F7A4F",
  warn: "#DFA84A",
  danger: "#B8553F",
  white: "#FFFFFF",
} as const;

// Composition geometry
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_SECONDS = 60;
export const TOTAL_FRAMES = FPS * TOTAL_SECONDS; // 1800

// Scene start frames (each beat enters with a 6-frame cross-fade)
export const SCENES = {
  hook:     { start:    0, end:  180, label: "1 · Hook" },
  problem:  { start:  180, end:  480, label: "2 · Problem · The Portal Grind" },
  stakes:   { start:  480, end:  720, label: "3 · Stakes · $6M" },
  guide:    { start:  720, end:  960, label: "4 · Guide · CredTek" },
  product:  { start:  960, end: 1260, label: "5 · What we do" },
  plan:     { start: 1260, end: 1560, label: "6 · The 3-step plan" },
  success:  { start: 1560, end: 1680, label: "7 · Success" },
  cta:      { start: 1680, end: 1800, label: "8 · CTA" },
} as const;

export type SceneKey = keyof typeof SCENES;
