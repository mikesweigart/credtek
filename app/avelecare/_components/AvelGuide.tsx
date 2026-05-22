"use client";

// AvelGuide ("Ava") — Avel-branded in-product assistant.
//
// Visible on every Avel portal page. Purpose: explain pages
// contextually, walk users through tasks, summarize provider
// status, capture feedback. Pure-product behavior — no sales
// CTAs. From the visitor's perspective this is a feature of
// their working credentialing portal.
//
// State model: a step machine like the CredTek DemoGuide, but
// branded for Avel and with Avel-specific flows. Easy to swap
// for a real LLM later — the SCRIPT array is one place.

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type StepId =
  | "intro"
  | "menu"
  | "explain"
  | "add-provider-1"
  | "add-provider-2"
  | "add-provider-3"
  | "status-prompt"
  | "status-result"
  | "status-blocking"
  | "feedback-prompt"
  | "feedback-thanks"
  | "tour-1"
  | "tour-2"
  | "tour-3"
  | "tour-4"
  | "tour-5"
  | "tour-done";

type Option = { label: string; next?: StepId; href?: string };
type Step = { message: string | ((ctx: Ctx) => string); options?: Option[]; input?: "feedback" | "providerName" };

type Ctx = { pathname: string; lastInput: string };

// Contextual help text by path — short and product-flavored.
function explainPage(pathname: string): string {
  if (pathname.startsWith("/avelecare/providers")) {
    return "You're on the Providers page. This is every Avel clinician currently in credentialing or active across our service lines. The table shows their role, service lines, states licensed, current credentialing stage, and whether they're ready to work and ready to bill. Use the filters to slice by service line, space, or readiness state.";
  }
  if (pathname.startsWith("/avelecare/spaces")) {
    return "Spaces & Programs is how Avel organizes credentialing by facility and program — East Adams, the Minnesota Rural Hospital network, Kansas RHTP, the New York Crisis Care program, our National School Health Network, and the Senior Care Network. Each space shows its own ready-to-bill count, onboarding pipeline, and credential risks.";
  }
  if (pathname.startsWith("/avelecare/workflows")) {
    return "Workflows are the standardized credentialing templates Avel uses across service lines — Emergency, ICU, Hospitalist, Behavioral Health, School Health, Rural. Each workflow defines stages, SLA targets, and ownership so new providers always follow the same path.";
  }
  if (pathname.startsWith("/avelecare/help")) {
    return "This is the Help page — your guided tours and product assistance live here. You can also chat with me from any page using the bubble in the bottom-right.";
  }
  // Default: dashboard.
  return "You're on the Avel eCare Credentialing Command Center. The KPI tiles at the top show pipeline volume, ready-to-work and ready-to-bill counts, and time-to-credential. The pipeline visual underneath breaks every active provider into their current stage — Intake, PSV, Privileges, Compliance, Payer Enrollment, or Ready to Bill. The alerts panel on the right surfaces anything that needs human attention.";
}

const SCRIPT: Record<StepId, Step> = {
  intro: {
    message:
      "Hi, I'm Ava — your Avel eCare Credentialing assistant. I can explain what you're seeing on any page, walk you through tasks, summarize a provider's readiness, or capture feedback for your portal team. What would you like?",
    options: [
      { label: "Explain this page", next: "explain" },
      { label: "Walk me through adding a provider", next: "add-provider-1" },
      { label: "Show me a provider's status", next: "status-prompt" },
      { label: "Give feedback", next: "feedback-prompt" },
    ],
  },
  menu: {
    message: "Anything else I can help with?",
    options: [
      { label: "Explain this page", next: "explain" },
      { label: "Walk me through adding a provider", next: "add-provider-1" },
      { label: "Show me a provider's status", next: "status-prompt" },
      { label: "Give feedback", next: "feedback-prompt" },
    ],
  },
  explain: {
    message: (ctx) => explainPage(ctx.pathname),
    options: [
      { label: "Got it — what else can you do?", next: "menu" },
      { label: "Walk me through adding a provider", next: "add-provider-1" },
    ],
  },
  "add-provider-1": {
    message:
      "Let's add a new Avel clinician. Step 1 — go to the Providers page using the left navigation, then click the 'Add Provider' button in the top right. Let me know when you see the Step 1 form titled 'Basic Information'.",
    options: [
      { label: "Open the Providers page", href: "/avelecare/providers", next: "add-provider-2" },
      { label: "I'm there — what's next?", next: "add-provider-2" },
    ],
  },
  "add-provider-2": {
    message:
      "Step 2 — enter the provider's legal first and last name, NPI if you have it, role (Physician, NP, RN, Pharmacist, Social Worker, etc.), and primary specialty. Example: Alex Johnson · MD · Emergency Medicine. Click Next.",
    options: [
      { label: "Done — what's next?", next: "add-provider-3" },
      { label: "Show me an example", next: "add-provider-3" },
    ],
  },
  "add-provider-3": {
    message:
      "Step 3 — assign their service lines (e.g. Emergency, ICU), the states where they're licensed, and the Avel spaces they'll cover. Pick the default workflow template that matches their service line. Click Create — credentialing starts automatically and the provider appears on the Dashboard pipeline.",
    options: [
      { label: "Back to menu", next: "menu" },
      { label: "Show me a real provider", href: "/avelecare/providers", next: "menu" },
    ],
  },
  "status-prompt": {
    message:
      "Sure — type the provider's last name or initials. Try one of these: Johnson, Chen, Kim, Patel, Lopez.",
    input: "providerName",
  },
  "status-result": {
    message: (ctx) => readinessSummary(ctx.lastInput),
    options: [
      { label: "What's blocking them?", next: "status-blocking" },
      { label: "Back to menu", next: "menu" },
    ],
  },
  "status-blocking": {
    message: (ctx) => blockerExplanation(ctx.lastInput),
    options: [
      { label: "Got it — back to menu", next: "menu" },
    ],
  },
  "feedback-prompt": {
    message:
      "I'd love your feedback. I'll attach the page you're currently on so your portal team can see the context. What would you like to share?",
    input: "feedback",
  },
  "feedback-thanks": {
    message:
      "Thank you — your feedback is logged with the page you were on. Your Avel portal team reviews these weekly.",
    options: [
      { label: "Back to menu", next: "menu" },
    ],
  },
  "tour-1": {
    message:
      "Welcome to the Avel eCare Credentialing Portal. I can give you a 5-step tour in about 90 seconds. Step 1 — the Dashboard. This is your real-time pipeline. KPI tiles show pipeline volume, ready-to-work, ready-to-bill, and average days to credential. The pipeline visual breaks every provider into their current stage.",
    options: [
      { label: "Next — Providers", next: "tour-2" },
      { label: "Skip the tour", next: "menu" },
    ],
  },
  "tour-2": {
    message:
      "Step 2 — Providers. Click 'Providers' in the left nav. This is the full Avel clinician roster — Emergency, ICU, Hospitalist, Behavioral Health, EMS, Pharmacy, Senior Care, School Health, and Specialty Clinic. Filter by service line, by space, by readiness state.",
    options: [
      { label: "Next — Spaces", next: "tour-3" },
    ],
  },
  "tour-3": {
    message:
      "Step 3 — Spaces & Programs. Avel organizes credentialing by facility and program — East Adams Rural Healthcare, the Minnesota Rural Hospital Network, Kansas RHTP, NY Crisis Care, the National School Health Network, and Senior Care. Each space tells you how many clinicians are ready to bill there.",
    options: [
      { label: "Next — Workflows", next: "tour-4" },
    ],
  },
  "tour-4": {
    message:
      "Step 4 — Workflows. The credentialing templates Avel uses across service lines. Emergency, ICU, Hospitalist, Behavioral Health, School Health, Rural Health — each has its own stages, SLA targets, and ownership. Assigning the right workflow keeps every new clinician on the same path.",
    options: [
      { label: "Next — Help & Chat", next: "tour-5" },
    ],
  },
  "tour-5": {
    message:
      "Step 5 — Help & Chat. That's me — Ava. I'm here on every page. Tap the bubble bottom-right anytime to ask a question, walk through a task, or summarize a provider's readiness.",
    options: [
      { label: "Finish tour", next: "tour-done" },
    ],
  },
  "tour-done": {
    message:
      "That's the tour. The portal is built around two questions you'll keep asking — 'who is ready to work?' and 'who is ready to bill?' Everything else exists to answer those two faster. Welcome to Avel eCare Credentialing.",
    options: [
      { label: "Back to menu", next: "menu" },
    ],
  },
};

// ──────────────────────────────────────────────────────────────
// Lookup helpers — keyed off the seeded provider data so the chat
// agent's answers stay consistent with what the user sees on screen.
// ──────────────────────────────────────────────────────────────
import { PROVIDERS, type Provider } from "../_data/seed";

function findProvider(query: string): Provider | undefined {
  const q = query.trim().toLowerCase();
  return PROVIDERS.find(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.initials.toLowerCase() === q
  );
}

function readinessSummary(query: string): string {
  const p = findProvider(query);
  if (!p) {
    return `I couldn't find a provider matching "${query}". Try a last name like Johnson, Chen, Kim, Patel, or Lopez.`;
  }
  const work = p.readyToWork ? "Yes" : "No";
  const bill = p.readyToBill ? "Yes" : "No";
  const lines = [
    `${p.name}, ${p.credentials} — ${p.specialty}`,
    `Service lines: ${p.serviceLines.join(", ")}`,
    `States licensed: ${p.statesLicensed.join(", ")}`,
    `Current stage: ${p.stage.toUpperCase()}`,
    `Ready to Work: ${work}`,
    `Ready to Bill: ${bill}`,
  ];
  return lines.join("\n");
}

function blockerExplanation(query: string): string {
  const p = findProvider(query);
  if (!p) {
    return "No provider context — pick one from the Providers page first.";
  }
  if (p.readyToBill) {
    return `${p.name} is fully ready to bill — no blockers. They're billable for all assigned Avel spaces.`;
  }
  if (p.flags.length === 0) {
    return `${p.name} is still in the ${p.stage.toUpperCase()} stage (${p.daysInStage} days). No specific risk flags yet.`;
  }
  return `${p.name} is blocked by: ${p.flags.join("; ")}. Recommended next step: review the provider's profile and confirm all required documents are uploaded, then escalate to the payer if applicable.`;
}

export function AvelGuide() {
  const pathname = usePathname() ?? "/avelecare";

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [stepId, setStepId] = useState<StepId>("intro");
  const [inputValue, setInputValue] = useState("");
  const [lastInput, setLastInput] = useState("");

  // First-visit auto-open. Session-scoped so it doesn't pester on
  // every page change.
  useEffect(() => {
    const dismissed = sessionStorage.getItem("avel_guide_seen") === "1";
    if (dismissed) return;
    const t = window.setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("avel_guide_seen", "1");
    }, 900);
    return () => window.clearTimeout(t);
  }, []);

  const step = SCRIPT[stepId];
  const ctx: Ctx = useMemo(() => ({ pathname, lastInput }), [pathname, lastInput]);
  const message =
    typeof step.message === "function" ? step.message(ctx) : step.message;

  function selectOption(opt: Option) {
    if (opt.href) {
      if (opt.next) setStepId(opt.next);
      window.location.href = opt.href;
      return;
    }
    if (opt.next) setStepId(opt.next);
  }

  function submitInput(e: React.FormEvent) {
    e.preventDefault();
    const v = inputValue.trim();
    if (!v) return;
    setLastInput(v);
    setInputValue("");
    if (step.input === "providerName") {
      setStepId("status-result");
    } else if (step.input === "feedback") {
      // Log locally for now. In production this would POST to a feedback endpoint
      // along with the page path so the portal team has context.
      try {
        const existing = JSON.parse(localStorage.getItem("avel_feedback") ?? "[]");
        existing.push({ page: pathname, message: v, ts: Date.now() });
        localStorage.setItem("avel_feedback", JSON.stringify(existing));
      } catch {
        /* ignore */
      }
      setStepId("feedback-thanks");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="avel-guide-launcher"
        onClick={() => setOpen(true)}
        aria-label="Open Ava — credentialing assistant"
      >
        <span className="avel-guide-launcher-icon">A</span>
        <span className="avel-guide-launcher-label">Ask Ava</span>
      </button>
    );
  }

  return (
    <div className={`avel-guide${minimized ? " is-minimized" : ""}`} role="dialog" aria-label="Ava — Avel credentialing assistant">
      <div className="avel-guide-header">
        <div className="avel-guide-header-left">
          <span className="avel-guide-av">A</span>
          <div>
            <div className="avel-guide-name">Ava · Credentialing assistant</div>
            <div className="avel-guide-status">
              <span className="avel-guide-status-dot" /> Online
            </div>
          </div>
        </div>
        <div className="avel-guide-header-actions">
          <button
            type="button"
            className="avel-guide-iconbtn"
            onClick={() => setMinimized((v) => !v)}
            aria-label={minimized ? "Expand" : "Minimize"}
          >
            {minimized ? "↕" : "—"}
          </button>
          <button
            type="button"
            className="avel-guide-iconbtn"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="avel-guide-body">
            <div className="avel-guide-bubble">
              {message.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          {step.input ? (
            <form className="avel-guide-input-form" onSubmit={submitInput}>
              <input
                type="text"
                className="avel-guide-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={step.input === "providerName" ? "Provider name…" : "What would you like to share?"}
                autoFocus
              />
              <button type="submit" className="avel-guide-submit">
                Send →
              </button>
            </form>
          ) : (
            <div className="avel-guide-options">
              {step.options?.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  className="avel-guide-option"
                  onClick={() => selectOption(opt)}
                >
                  <span>{opt.label}</span>
                  <span className="avel-guide-arrow">→</span>
                </button>
              ))}
            </div>
          )}

          <div className="avel-guide-foot">
            Avel eCare · in-product assistant
          </div>
        </>
      )}
    </div>
  );
}
