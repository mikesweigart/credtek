"use client";

// ScrollReveal — observes elements with the `reveal` class and toggles
// `is-visible` as they enter the viewport. CSS handles the actual animation
// (12px lift + opacity fade) so this stays trivial and reduced-motion-safe.
//
// Mounted globally in app/layout.tsx so every page picks it up.

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    // Respect the user's reduced-motion preference — just reveal everything.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = document.querySelectorAll<HTMLElement>(".reveal");

    if (reduced || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    targets.forEach((el) => observer.observe(el));

    // Re-scan once after a short delay to catch any client-rendered children.
    const rescan = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
        .forEach((el) => observer.observe(el));
    }, 400);

    return () => {
      window.clearTimeout(rescan);
      observer.disconnect();
    };
  }, []);

  return null;
}
