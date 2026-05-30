// Copy the web-optimized MP4 + poster into the app's public/ folder so
// the embed component can self-host them.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fromVideo = resolve(__dirname, "..", "out", "credtek-60s.web.mp4");
const fromPoster = resolve(__dirname, "..", "out", "poster.jpg");
const appPublic = resolve(__dirname, "..", "..", "public");

if (!existsSync(appPublic)) mkdirSync(appPublic, { recursive: true });
if (!existsSync(fromVideo)) {
  console.error("Web-optimized MP4 not found:", fromVideo);
  console.error("Run `pnpm run web` first.");
  process.exit(1);
}

const toVideo = resolve(appPublic, "credtek-hero.mp4");
const toPoster = resolve(appPublic, "credtek-hero-poster.jpg");

copyFileSync(fromVideo, toVideo);
copyFileSync(fromPoster, toPoster);
console.log("Published:");
console.log("  →", toVideo);
console.log("  →", toPoster);
