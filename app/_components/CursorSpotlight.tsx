"use client";

// CursorSpotlight — tracks the mouse over any element with the
// `spotlight-group` class and writes the relative pointer position into
// CSS custom properties (--mx, --my). The cards inside use those to render
// a soft radial highlight that follows the cursor.
//
// Reduced-motion users get no effect (the gradient is anchored to 0,0 and
// the opacity ramp is disabled via the CSS guard).

import { useEffect } from "react";

export function CursorSpotlight() {
  useEffect(() => {
    const groups = document.querySelectorAll<HTMLElement>(".spotlight-group");
    if (groups.length === 0) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const handlers: Array<{
      group: HTMLElement;
      move: (e: PointerEvent) => void;
    }> = [];

    groups.forEach((group) => {
      const move = (e: PointerEvent) => {
        // Compute pointer position relative to each card in the group
        // so every card gets its own spotlight, not just the one under the
        // cursor. This is what makes the effect feel "alive" across the row.
        const cards = group.querySelectorAll<HTMLElement>(".spotlight-card");
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
          card.style.setProperty("--my", `${e.clientY - rect.top}px`);
        });
      };
      group.addEventListener("pointermove", move);
      handlers.push({ group, move });
    });

    return () => {
      handlers.forEach(({ group, move }) =>
        group.removeEventListener("pointermove", move)
      );
    };
  }, []);

  return null;
}
