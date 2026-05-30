// Remotion build config. Pinned to high-quality h264 for the master
// render; web optimization happens in scripts/web-optimize.js with a
// separate ffmpeg pass tuned for embed file-size.

import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
