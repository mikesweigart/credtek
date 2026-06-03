"use client";

// HeroVideo — muted autoplay, plays ONCE, then holds on the CTA frame
// with a Replay button. Looping a 60s explainer competes with the
// reader after the first pass, so we let it land, then stop.
//
// Architecture notes:
//   • Forces `muted` via ref BEFORE calling play() — Safari + Chrome
//     gate autoplay on muted state, and the attribute alone has races
//     against React hydration.
//   • Retries play() on loadedmetadata / loadeddata / canplay so a
//     slow initial load doesn't permanently fail autoplay.
//   • Shows a tap-to-play ▶ overlay only when play() rejects with a
//     real NotAllowedError.
//   • playsInline so iOS doesn't go fullscreen.
//   • Poster image for instant first paint.
//   • onEnded → freezes on the final frame (the CTA), shows a small
//     Replay button. The last frames of the video already burn in
//     "Book a demo →" + cred-tek.com so the frozen end-frame stays
//     promotional rather than going blank.

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
  const [muted, setMuted] = useState(true);
  // Tracks whether the cut has played through. When true, the video
  // is paused at the final frame and we show a Replay button.
  const [hasEnded, setHasEnded] = useState(false);

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
          if (
            err instanceof DOMException &&
            (err.name === "NotAllowedError" || err.name === "SecurityError")
          ) {
            if (!cancelled) setNeedsTap(true);
          }
        });
      }
    };

    const onEnded = () => setHasEnded(true);

    tryPlay();
    el.addEventListener("loadedmetadata", tryPlay);
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);
    el.addEventListener("ended", onEnded);

    return () => {
      cancelled = true;
      el.removeEventListener("loadedmetadata", tryPlay);
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      el.removeEventListener("ended", onEnded);
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
    if (!next) {
      el.play().catch(() => {});
    }
  }

  function replay() {
    const el = ref.current;
    if (!el) return;
    el.currentTime = 0;
    setHasEnded(false);
    el.play().catch(() => {});
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
          /* No `loop` — the cut plays once, then holds on the CTA
             frame with a Replay button. Loops compete with reading. */
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
        {!needsTap && hasEnded && (
          <button
            type="button"
            onClick={replay}
            className="hero-video-replay"
            aria-label="Replay the explainer video"
          >
            <span className="hero-video-replay-icon" aria-hidden>↻</span>
            <span className="hero-video-replay-text">Replay</span>
          </button>
        )}
        {!needsTap && !hasEnded && (
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
