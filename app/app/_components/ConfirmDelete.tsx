"use client";

// Confirm dialog for destructive actions. Wraps any server-action form
// so submission only fires after the user clicks the dangerous button
// in the modal. Keyboard-friendly: Esc closes, focus traps inside.

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Server action to call when confirmed. */
  action: (formData: FormData) => void;
  /** Hidden inputs the server action needs (e.g. providerId). */
  hidden?: Record<string, string>;
  /** Label of the trigger button (visible on the page). */
  triggerLabel: string;
  /** Optional className on the trigger. Defaults to the danger button. */
  triggerClassName?: string;
  /** Headline of the modal. */
  title: string;
  /** Description shown above the confirm input. */
  description: string;
  /** Phrase the user must type to enable Confirm (case-insensitive). Defaults to "DELETE". */
  confirmPhrase?: string;
  /** Label of the confirm button. */
  confirmLabel?: string;
};

export function ConfirmDelete({
  action,
  hidden = {},
  triggerLabel,
  triggerClassName = "portal-danger-btn",
  title,
  description,
  confirmPhrase = "DELETE",
  confirmLabel = "Delete permanently",
}: Props) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Focus the typing input on open, clear it on close.
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setTyped("");
    }
  }, [open]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const confirmed = typed.trim().toUpperCase() === confirmPhrase.toUpperCase();

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>

      {open && (
        <div
          className="cd-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cd-title"
          onClick={(e) => {
            // Click on backdrop closes; clicks on the panel do not.
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="cd-panel">
            <div className="cd-icon">⚠</div>
            <h2 id="cd-title" className="cd-title">{title}</h2>
            <p className="cd-desc">{description}</p>

            <form
              ref={formRef}
              action={action}
              className="cd-form"
              onSubmit={(e) => {
                if (!confirmed) e.preventDefault();
              }}
            >
              {Object.entries(hidden).map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))}
              <label className="cd-label">
                Type <strong>{confirmPhrase}</strong> to confirm
                <input
                  ref={inputRef}
                  type="text"
                  className="portal-input cd-input"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>

              <div className="cd-actions">
                <button
                  type="button"
                  className="acct-btn-secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cd-danger"
                  disabled={!confirmed}
                  aria-disabled={!confirmed}
                >
                  {confirmLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
