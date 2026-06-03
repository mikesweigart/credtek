"use client";

// EmailDemoModal — the new primary conversion path on the landing
// page. Captures email + facility size, POSTs the lead to /api/leads
// (which emails the team + best-effort persists it) AND stashes it
// locally so the guided demo can personalize, then hands the user a
// live, guided demo at /dashboard?demo=true.
//
// The guided demo itself is rendered by DemoGuide.tsx on the (app)
// route group — a scripted chat agent that walks the user through
// the dashboard.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ProviderBucket = "solo" | "2-49" | "50-99" | "100-499" | "500+";

const BUCKETS: { id: ProviderBucket; label: string }[] = [
  { id: "solo", label: "Solo" },
  { id: "2-49", label: "2–49" },
  { id: "50-99", label: "50–99" },
  { id: "100-499", label: "100–499" },
  { id: "500+", label: "500+" },
];

type Status = "idle" | "submitting" | "success" | "error";

export function EmailDemoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [facility, setFacility] = useState("");
  const [bucket, setBucket] = useState<ProviderBucket | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll while open, focus the first input, close on Esc.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Defer focus so the input is visible by the time we focus it.
    const t = window.setTimeout(() => firstInputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid work email.");
      return;
    }

    setStatus("submitting");

    // Stash the lead locally so the guided demo on /dashboard can
    // personalize the greeting.
    try {
      const payload = {
        email,
        facility: facility || null,
        bucket: bucket || null,
        ts: Date.now(),
      };
      localStorage.setItem("credtek_lead", JSON.stringify(payload));
    } catch {
      // localStorage can fail in private mode — fail open.
    }

    // Transmit the lead to the team. Fire-and-forget with keepalive so it
    // survives the imminent navigation to the demo and never delays it —
    // the demo loads regardless of whether this resolves, and the route
    // degrades to server-console logging until Resend is wired.
    try {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          email,
          facility: facility || null,
          bucket: bucket || null,
          source: "landing-demo-modal",
        }),
      }).catch(() => {});
    } catch {
      // Never let lead transmission block the user's path to the demo.
    }

    // Tiny delay so the success state is perceived as "we did
    // something" instead of an instant redirect. ~700ms feels right.
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        router.push("/dashboard?demo=true");
      }, 900);
    }, 700);
  }

  if (!open) return null;

  return (
    <div
      className="edm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edm-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="edm-modal" ref={dialogRef}>
        <button
          type="button"
          className="edm-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {status === "success" ? (
          <div className="edm-success">
            <div className="edm-success-icon">✓</div>
            <h3>Your interactive demo is ready</h3>
            <p>
              Loading your guided walkthrough… your CredTek agent will
              meet you on the next screen.
            </p>
          </div>
        ) : (
          <>
            <div className="edm-eyebrow">Free interactive demo · 2 min setup</div>
            <h2 id="edm-title" className="edm-title">
              See CredTek <em>running in your facility.</em>
            </h2>
            <p className="edm-lead">
              We&apos;ll spin up CredTek with sample providers sized to
              your group, then a guided AI walkthrough agent meets you on
              the dashboard. No call required — explore at your own pace.
            </p>

            <form className="edm-form" onSubmit={submit} noValidate>
              <label className="edm-field">
                <span className="edm-label">Work email *</span>
                <input
                  ref={firstInputRef}
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  className="edm-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@medicalgroup.com"
                />
              </label>

              <label className="edm-field">
                <span className="edm-label">Group or facility name</span>
                <input
                  type="text"
                  autoComplete="organization"
                  className="edm-input"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  placeholder="Cascade Behavioral Health, etc."
                />
              </label>

              <div className="edm-field">
                <span className="edm-label">Roughly how many providers?</span>
                <div className="edm-buckets" role="radiogroup" aria-label="Provider count">
                  {BUCKETS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      role="radio"
                      aria-checked={bucket === b.id}
                      className={`edm-bucket${bucket === b.id ? " is-active" : ""}`}
                      onClick={() => setBucket(b.id)}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="edm-error">{error}</div>}

              <button
                type="submit"
                className="edm-submit"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Setting up your demo…" : "Get my interactive demo →"}
              </button>

              <p className="edm-foot">
                Prefer to talk it through?{" "}
                <a
                  href="https://calendly.com/mike-fusion-advisory/30min"
                  target="_blank"
                  rel="noopener"
                >
                  Book a demo with a credentialing veteran →
                </a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
