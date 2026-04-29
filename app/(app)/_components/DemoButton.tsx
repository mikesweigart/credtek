"use client";

// A button that, instead of running the real action, briefly shows a
// "this would do X" tooltip. Lets every Run PSV / Message / Send / Approve
// button on the demo feel responsive instead of dead, while reinforcing
// "the real product does this" to a partner watching the demo.

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Text to show inside the button (children, basically). */
  children: React.ReactNode;
  /** What the toast says when clicked — describes what the real action would do. */
  demoMessage: string;
  /** Existing className so the button styles match its surroundings. */
  className?: string;
  /** Optional: visible style as a non-button element (e.g. a topbar search field). */
  asInput?: boolean;
  /** Optional: placeholder text when rendered as an input. */
  placeholder?: string;
};

export function DemoButton({
  children,
  demoMessage,
  className,
  asInput,
  placeholder,
}: Props) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const trigger = () => {
    setOpen(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 4500);
  };

  return (
    <span className="demo-btn-wrap">
      {asInput ? (
        <input
          className={className}
          placeholder={placeholder}
          onClick={trigger}
          onFocus={trigger}
          readOnly
        />
      ) : (
        <button className={className} onClick={trigger} type="button">
          {children}
        </button>
      )}
      {open ? (
        <div className="demo-toast" role="status">
          <span className="demo-toast-dot">✦</span>
          <span>{demoMessage}</span>
          <button
            className="demo-toast-x"
            onClick={() => setOpen(false)}
            aria-label="Dismiss"
            type="button"
          >
            ✕
          </button>
        </div>
      ) : null}
    </span>
  );
}
