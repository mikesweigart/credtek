// Re-encode the master render for web embed.
//   1920×1080 master  →  1280×720 H.264 + AAC, faststart
// Targets ~2 MB. CRF 26 is the right balance for motion-heavy 60s; the
// embed component shows a poster so the first paint is instant either
// way.

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { existsSync, statSync } from "node:fs";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inp = resolve(__dirname, "..", "out", "credtek-60s.mp4");
const out = resolve(__dirname, "..", "out", "credtek-60s.web.mp4");
const poster = resolve(__dirname, "..", "out", "poster.jpg");

if (!ffmpegPath) {
  console.error("ffmpeg-static did not provide a binary.");
  process.exit(1);
}
if (!existsSync(inp)) {
  console.error("Master render not found:", inp);
  console.error("Run `pnpm run render` first.");
  process.exit(1);
}

console.log("Web-optimize → 1280×720, H.264, faststart");
const r = spawnSync(
  ffmpegPath,
  [
    "-y",
    "-i", inp,
    "-vf", "scale=1280:720:flags=lanczos",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "26",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-c:a", "aac",
    "-b:a", "96k",
    "-ac", "2",
    out,
  ],
  { stdio: ["ignore", "inherit", "inherit"] }
);
if (r.status !== 0) process.exit(r.status ?? 1);

console.log("Extract poster (frame at 4s = the Hook moment)");
const p = spawnSync(
  ffmpegPath,
  [
    "-y",
    "-ss", "4",
    "-i", out,
    "-frames:v", "1",
    "-q:v", "2",
    poster,
  ],
  { stdio: ["ignore", "inherit", "inherit"] }
);
if (p.status !== 0) process.exit(p.status ?? 1);

const sizeMB = (statSync(out).size / 1024 / 1024).toFixed(2);
console.log(`✓ ${out}  (${sizeMB} MB)`);
console.log(`✓ ${poster}`);
