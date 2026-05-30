"use client";

// HeroVideo — muted autoplay loop for the cred-tek.com landing page.
//
// Why this is more than a <video> tag:
//   • Forces `muted` via ref BEFORE calling play() — Safari + Chrome
//     gate autoplay on muted state, and the attribute alone has races
//     against React hydration.
//   • Retries play() on loadedmetadata / loadeddata / canplay so a
//     slow initial load doesn't permanently fail autoplay.
//   • Shows a tap-to-play ▶ overlay only when play() rejects with a
//     real NotAllowedError (some mobile browsers still block even
//     muted autoplay in low-power mode).
//   • playsInline so iOS doesn't go fullscreen.
//   • Poster image for instant first paint while the MP4 loads.
//
// The video lives in /public/credtek-hero.mp4 (self-hosted, no
// third-party player or tracking). Middleware matcher already
// excludes media extensions, so the auth proxy never touches this
// request.

import { useEffect, useRef, useState } from "react";

type Props = {
  src?: string;
  poster?: string;
  ariaLabel?: string;
};

export function HeroVideo({
  src = "/credtek-hero.mp4",
  poster = "/credtek-hero-poster.jpg",
  ariaLabel = "What CredTek does — 60-second explainer",
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);
  // The video autoplays muted (browser policy). The unmute button
  // lets a curious viewer turn on the ambient music bed without
  // hijacking the autoplay flow.
  const [muted, setMuted] = useState(true);

  // Belt-and-suspenders autoplay. attribute + property + retry on
  // every relevant ready event.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;

    let cancelled = false;
    const tryPlay = () => {
      if (cancelled || !el) return;
      const p = el.play();
      if (p && typeof p.then === "function") {
        p.catch((err: unknown) => {
          // Only show the tap overlay on a real NotAllowedError;
          // other errors (AbortError on hot-reload, etc.) shouldn't
          // bother the user.
          if (
            err instanceof DOMException &&
            (err.name === "NotAllowedError" || err.name === "SecurityError")
          ) {
            if (!cancelled) setNeedsTap(true);
          }
        });
      }
    };

    tryPlay();
    el.addEventListener("loadedmetadata", tryPlay);
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);

    return () => {
      cancelled = true;
      el.removeEventListener("loadedmetadata", tryPlay);
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
    };
  }, []);

  function handleTapPlay() {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.play().then(() => setNeedsTap(false)).catch(() => {});
  }

  function toggleSound() {
    const el = ref.current;
    if (!el) return;
    const next = !muted;
    el.muted = next;
    setMuted(next);
    // If we're unmuting, also make sure we're playing.
    if (!next) {
      el.play().catch(() => {});
    }
  }

  return (
    <div className="hero-video-frame" aria-label={ariaLabel}>
      <div className="hero-video-window">
        <video
          ref={ref}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={ariaLabel}
          className="hero-video-el"
        />
        {needsTap && (
          <button
            type="button"
            onClick={handleTapPlay}
            className="hero-video-tap"
            aria-label="Play the CredTek explainer video"
          >
            <span className="hero-video-tap-circle">▶</span>
            <span className="hero-video-tap-text">Play the 60-second explainer</span>
          </button>
        )}
        {!needsTap && (
          <button
            type="button"
            onClick={toggleSound}
            className="hero-video-sound"
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={!muted}
          >
            <span className="hero-video-sound-icon" aria-hidden>
              {muted ? "🔇" : "🔊"}
            </span>
            {muted ? "Turn sound on" : "Mute"}
          </button>
        )}
      </div>
    </div>
  );
}
