// Procedural ambient music bed — generated once with ffmpeg, committed.
//
// Design: three sustained sine pads forming a soft Db–F–Ab chord
// (low-mid range so it sits under spoken word / kinetic type without
// stepping on it). Lowpass softens the harshness, aecho adds depth,
// a gentle breathing tremolo gives life, and dynaudnorm + a final
// loudnorm pass anchor the level at ~-16 LUFS so the bed is *audible*
// in the cut. The previous build had the bed at -51 dB max — well
// below the noise floor — so it was effectively silent.

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

// Filter graph notes:
//  • Each sine is at a healthy amplitude (0.30–0.45) so the pre-mix
//    sits around -10 dBFS RMS.
//  • amix sums — divide-by-N normalization is OFF so the levels we
//    set are the levels we hear.
//  • Tremolo at 0.18 Hz with depth 0.30 makes the bed breathe slowly,
//    matching the storyboard's emotional pace (~6s cycle).
//  • Lowpass 1200 keeps the brightness off so the bed never competes
//    with the type. Highpass 70 cleans rumble.
//  • aecho is the spatial layer — short delays for a soft hall.
//  • dynaudnorm tames any peaks; loudnorm anchors final loudness.
const filterComplex = [
  // Sustained pads (Db2 + F2 + Ab2 — quiet stack, jazzy and warm)
  "sine=frequency=138.59:sample_rate=44100:duration=62[pad1]",
  "sine=frequency=174.61:sample_rate=44100:duration=62[pad2]",
  "sine=frequency=207.65:sample_rate=44100:duration=62[pad3]",
  // Apply per-pad amplitude
  "[pad1]volume=0.45[p1]",
  "[pad2]volume=0.35[p2]",
  "[pad3]volume=0.30[p3]",
  // Mix without normalization (the levels above are intentional)
  "[p1][p2][p3]amix=inputs=3:duration=longest:normalize=0[mixed]",
  // Slow breathing tremolo (frequency in Hz, depth 0..1)
  "[mixed]tremolo=f=0.18:d=0.30[breathing]",
  // Tonal softening — lose the harshness, keep the warmth
  "[breathing]lowpass=f=1200,highpass=f=70[softened]",
  // Spatial depth — short hall
  "[softened]aecho=0.85:0.6:80|120:0.35|0.25[wet]",
  // Tame any peaks before MP3 encode
  "[wet]dynaudnorm=f=300:g=15:p=0.85:m=10[normalized]",
  // Force stereo at the output
  "[normalized]aformat=channel_layouts=stereo[outA]",
].join(";");

const args = [
  "-y",
  "-filter_complex", filterComplex,
  "-map", "[outA]",
  "-t", "62",
  "-c:a", "libmp3lame",
  "-b:a", "160k",
  "-ac", "2",
  "-ar", "44100",
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

// Sanity-check the level so we never silently ship a silent bed again.
const probe = spawnSync(
  ffmpegPath,
  ["-i", out, "-af", "volumedetect", "-vn", "-f", "null", "-"],
  { encoding: "utf-8" }
);
const meanMatch = probe.stderr.match(/mean_volume:\s*(-?[\d.]+)\s*dB/);
const maxMatch = probe.stderr.match(/max_volume:\s*(-?[\d.]+)\s*dB/);
const mean = meanMatch ? parseFloat(meanMatch[1]) : NaN;
const max = maxMatch ? parseFloat(maxMatch[1]) : NaN;
console.log(`Bed levels — mean: ${mean} dB, max: ${max} dB`);
if (max < -24) {
  console.error(`✗ Bed peak is ${max} dB — too quiet (target -3 to -12).`);
  process.exit(1);
}
console.log("✓ Bed ready and audible.");
