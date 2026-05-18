"use client";

// DemoGuide — scripted walkthrough chat agent that appears on
// /dashboard when the user arrives via the email demo modal
// (?demo=true). NOT a real LLM agent — this is a hand-authored
// step machine that gives the experience of "an agent walking
// me through the product" without the infra cost. Easy to swap
// for a real agent later: the step state machine is one place.
//
// Behavior:
// - Auto-opens 800ms after the dashboard renders
// - Greeting personalizes off the lead stored by EmailDemoModal
// - Each step has a message + one or more option buttons
// - The final step offers a calendly link (intent capture)
// - User can minimize ↕ at any time — bubble stays in the corner
// - Dismissed state persists for the session so refreshing doesn't
//   re-open it

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Step = {
  id: string;
  // The agent's message. {{name}} replaced with the lead name if present.
  message: string;
  options?: { label: string; nextId?: string; href?: string; external?: boolean }[];
};

const SCRIPT: Step[] = [
  {
    id: "intro",
    message:
      "Hi{{name}}, I'm Cred — your CredTek guide. I'll walk you through a 60-second tour of how your team would use this on day one. Sound good?",
    options: [
      { label: "Yes, show me", nextId: "dashboard" },
      { label: "I'll explore on my own", nextId: "exploring" },
    ],
  },
  {
    id: "dashboard",
    message:
      "This is your morning dashboard. The four tiles up top — active providers, pipeline, average days to enrollment, and expirations — are the only numbers most leaders want to see daily. The pipeline panel shows every provider currently being credentialed.",
    options: [
      { label: "Show me a provider record", nextId: "provider", href: "/providers/sarah-reyes" },
      { label: "What's the agents panel?", nextId: "agents" },
    ],
  },
  {
    id: "agents",
    message:
      "Live agent activity. Every PSV verification, payor submission, supervision hour logged, and expiration alert posts here. Anything that needs a human's eyes — like an Optum submission ready to go — surfaces as 'Approval needed' so your team reviews before it leaves.",
    options: [
      { label: "Show me a provider", nextId: "provider", href: "/providers/sarah-reyes" },
      { label: "What's special about supervision?", nextId: "supervision" },
    ],
  },
  {
    id: "supervision",
    message:
      "Pre-licensed supervision tracking — the workflow no one else does. State-specific rule engines for all 50 boards, weekly hours logging with supervisor cosignature, projected independent licensure date. If you have any LPC-A, LMFT-A, or LCSW-A staff, this alone is worth the switch.",
    options: [
      { label: "Open supervision tracker", href: "/supervision" },
      { label: "Back to dashboard", nextId: "dashboard" },
    ],
  },
  {
    id: "provider",
    message:
      "Click into any provider for the full record — licenses, payors, supervision (if pre-licensed), documents, and the audit trail. Every action is hash-chained for NCQA. Try opening Aisha Patel — she's the LPC-A with supervision tracking running.",
    options: [
      { label: "See the closer", nextId: "close" },
      { label: "Keep exploring", nextId: "exploring" },
    ],
  },
  {
    id: "exploring",
    message:
      "Take your time — I'll stay right here. When you've seen what you need, the fastest way to get pricing for your group is a 20-minute call with one of the founders. They've each spent 20+ years inside enterprise credentialing programs.",
    options: [
      { label: "Book a 20-min call", href: "https://calendly.com/mike-fusion-advisory/30min", external: true },
      { label: "See the pricing first", href: "/#pricing" },
    ],
  },
  {
    id: "close",
    message:
      "That's the tour. Ready to see what CredTek looks like with your actual roster? We'll pull a sample of your providers, run them through CredTek live, and show ROI for your group specifically. 20 minutes, no slides.",
    options: [
      { label: "Book a 20-min call", href: "https://calendly.com/mike-fusion-advisory/30min", external: true },
      { label: "See pricing first", href: "/#pricing" },
    ],
  },
];

type LeadInfo = { email?: string; facility?: string; bucket?: string };

export function DemoGuide() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true" || searchParams.get("welcome") === "true";

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [stepId, setStepId] = useState<string>("intro");
  const [lead, setLead] = useState<LeadInfo>({});

  // Hydrate the stored lead so we can personalize the greeting.
  useEffect(() => {
    if (!isDemo) return;
    try {
      const raw = localStorage.getItem("credtek_lead");
      if (raw) {
        const parsed = JSON.parse(raw);
        setLead({
          email: parsed.email,
          facility: parsed.facility,
          bucket: parsed.bucket,
        });
      }
    } catch {
      /* ignore */
    }
  }, [isDemo]);

  // Auto-open shortly after mount so the user actually sees it land.
  useEffect(() => {
    if (!isDemo) return;
    const dismissed = sessionStorage.getItem("credtek_guide_dismissed") === "1";
    if (dismissed) return;
    const t = window.setTimeout(() => setOpen(true), 800);
    return () => window.clearTimeout(t);
  }, [isDemo]);

  const step = useMemo(() => SCRIPT.find((s) => s.id === stepId) ?? SCRIPT[0], [stepId]);

  // Derive a first-name greeting from the email if no facility name is set.
  const nameGreeting = useMemo(() => {
    if (lead.facility) return `, ${lead.facility}`;
    if (lead.email) {
      const local = lead.email.split("@")[0].split(/[._-]/)[0];
      if (local && local.length > 1) {
        return ` ${local.charAt(0).toUpperCase()}${local.slice(1)}`;
      }
    }
    return "";
  }, [lead]);

  if (!isDemo) return null;

  function dismiss() {
    setOpen(false);
    sessionStorage.setItem("credtek_guide_dismissed", "1");
  }

  function selectOption(opt: NonNullable<Step["options"]>[number]) {
    if (opt.href && !opt.external) {
      // Internal route — fire the navigation but keep the bubble open
      // by advancing the step state so when the user returns the
      // conversation has moved forward.
      if (opt.nextId) setStepId(opt.nextId);
      window.location.href = opt.href;
      return;
    }
    if (opt.href && opt.external) {
      if (opt.nextId) setStepId(opt.nextId);
      window.open(opt.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (opt.nextId) setStepId(opt.nextId);
  }

  // Collapsed bubble — clickable, brings the conversation back.
  if (!open) {
    return (
      <button
        type="button"
        className="dg-launcher"
        onClick={() => setOpen(true)}
        aria-label="Open CredTek guide"
      >
        <span className="dg-launcher-icon">C</span>
        <span className="dg-launcher-label">Resume tour</span>
      </button>
    );
  }

  const message = step.message.replace("{{name}}", nameGreeting);

  return (
    <div className={`dg-panel${minimized ? " is-minimized" : ""}`} role="dialog" aria-label="CredTek guided demo">
      <div className="dg-header">
        <div className="dg-header-left">
          <span className="dg-avatar">C</span>
          <div>
            <div className="dg-name">Cred · CredTek guide</div>
            <div className="dg-status">
              <span className="dg-status-dot" /> Online
            </div>
          </div>
        </div>
        <div className="dg-header-actions">
          <button
            type="button"
            className="dg-minify"
            onClick={() => setMinimized((v) => !v)}
            aria-label={minimized ? "Expand" : "Minimize"}
          >
            {minimized ? "↕" : "—"}
          </button>
          <button
            type="button"
            className="dg-close"
            onClick={dismiss}
            aria-label="Dismiss guide"
          >
            ×
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="dg-body">
            <div className="dg-bubble">
              <p>{message}</p>
            </div>
          </div>
          <div className="dg-options">
            {step.options?.map((opt) => (
              <button
                key={opt.label}
                type="button"
                className="dg-option"
                onClick={() => selectOption(opt)}
              >
                {opt.label}
                <span className="dg-option-arrow">→</span>
              </button>
            ))}
          </div>
          <div className="dg-foot">
            Scripted tour · the real product talks back when wired
          </div>
        </>
      )}
    </div>
  );
}
