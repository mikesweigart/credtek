// Procedural ambient music bed — generated once with ffmpeg, committed.
// Two soft sine pads layered + a slow filtered pulse, mixed at a low
// level. 62 seconds long (covers the 60s cut + fade tails). No external
// samples; deterministic so the bed is reproducible.

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { existsSync } from "node:fs";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "..", "public", "bed.mp3");

if (!ffmpegPath) {
  console.error("ffmpeg-static did not provide a binary.");
  process.exit(1);
}

// Build the filter graph: two pad tones + a slow LFO-amplified bass.
// Levels stay deliberately quiet so the bed sits *under* the cut.
const filterComplex = [
  // Pad 1 — Db (~69 Hz fundamental) sine, low-pass softened
  "sine=frequency=138.59:duration=62[a1]",
  // Pad 2 — F (~87 Hz) for a major-third-ish color
  "sine=frequency=174.61:duration=62[a2]",
  // Pad 3 — Ab (208 Hz) sustained
  "sine=frequency=207.65:duration=62[a3]",
  // Slow rhythmic LFO so the bed breathes
  "sine=frequency=0.25:duration=62,aeval=val(0)*0.5+0.5[lfo]",
  // Mix the pads quiet
  "[a1]volume=0.10[p1]",
  "[a2]volume=0.07[p2]",
  "[a3]volume=0.05[p3]",
  "[p1][p2][p3]amix=inputs=3:duration=longest:normalize=0[pads]",
  // Modulate by the LFO
  "[pads][lfo]amultiply[pulsed]",
  // Final soft EQ + slight reverb-ish delay for depth
  "[pulsed]lowpass=f=800,highpass=f=70,aecho=0.6:0.5:60:0.3[outA]",
].join(";");

const args = [
  "-y",
  "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
  "-filter_complex", filterComplex,
  "-map", "[outA]",
  "-t", "62",
  "-c:a", "libmp3lame",
  "-b:a", "96k",
  "-ac", "2",
  out,
];

console.log("Generating bed:", out);
const result = spawnSync(ffmpegPath, args, { stdio: ["ignore", "inherit", "inherit"] });
if (result.status !== 0) {
  console.error("ffmpeg failed with code", result.status);
  process.exit(result.status ?? 1);
}
if (!existsSync(out)) {
  console.error("Bed file was not produced.");
  process.exit(1);
}
console.log("Bed ready.");
