"use client";

// Cred — the in-app guide that greets new users by name, walks them
// through the platform on first login, and stays one click away after
// that. Context-aware: the panel reads the current pathname and tailors
// the suggested next-step plus the quick-answer FAQ.
//
// Design goals:
//  • Feels personal — first-name greeting, present tense, never robotic.
//  • Reduces fear — every stage's automation and follow-up cadence is
//    explained in plain English so first-time users feel in control.
//  • Quiet after onboarding — auto-opens once, then becomes a floating
//    launcher the user can re-open any time.
//  • Zero deps — pure client component, no SDKs, no analytics dark
//    patterns. Just a calm, smart shopping-assistant model.

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  firstName: string;        // "Chris", or "there" if we have no name
  tenantName: string;       // workspace label
  role: string;             // for tone (admin vs client read-only)
  hasProviders: boolean;    // empty-state vs settled-state
  flaggedCount: number;     // SLA red flags — surfaces in greeting if > 0
};

type TourStep = {
  title: string;
  body: string;             // can include light HTML
  cta?: { label: string; href: string };
};

type Topic = {
  q: string;                // user-facing question
  a: string;                // answer (light HTML allowed)
  cta?: { label: string; href: string };
};

const SEEN_KEY = "credtek_guide_seen_v2";
const OPEN_KEY = "credtek_guide_open_v2";

export function PortalGuide({
  firstName,
  tenantName,
  role,
  hasProviders,
  flaggedCount,
}: Props) {
  const pathname = usePathname() ?? "/app";
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [inTour, setInTour] = useState(false);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [glow, setGlow] = useState(false);

  // Auto-open once per browser. Persistent open state for the same
  // session so navigating around doesn't slam the panel closed.
  useEffect(() => {
    setMounted(true);
    try {
      const seen = window.localStorage.getItem(SEEN_KEY);
      const wasOpen = window.sessionStorage.getItem(OPEN_KEY) === "1";
      if (!seen) {
        setOpen(true);
        setInTour(true);
        window.localStorage.setItem(SEEN_KEY, new Date().toISOString());
        // Pulse the launcher the first time so the eye lands on it.
        setGlow(true);
        const t = setTimeout(() => setGlow(false), 5200);
        return () => clearTimeout(t);
      }
      if (wasOpen) setOpen(true);
    } catch {
      /* SSR / private mode */
    }
  }, []);

  // Persist open/closed across the SPA navigation, but not across full
  // browser restart.
  useEffect(() => {
    if (!mounted) return;
    try {
      if (open) window.sessionStorage.setItem(OPEN_KEY, "1");
      else window.sessionStorage.removeItem(OPEN_KEY);
    } catch {
      /* noop */
    }
  }, [open, mounted]);

  // Reset topic view whenever the user opens the panel fresh.
  useEffect(() => {
    if (!open) setActiveTopic(null);
  }, [open]);

  const readOnly = role === "client" || role === "readonly" || role === "finance";

  // ---------- 6-step guided tour ----------
  const tour: TourStep[] = useMemo(() => {
    const steps: TourStep[] = [
      {
        title: `Welcome to CredTek, ${firstName}.`,
        body: `I'm <strong>Cred</strong> — I'll help you get oriented. This is your <strong>${tenantName}</strong> workspace. Everything you see here is live: real providers, real stages, real timing. I'll walk you through the highlights in about 60 seconds.`,
      },
      {
        title: "The dashboard is your control tower.",
        body: `The top KPI strip tells you four things at a glance: <strong>how many providers</strong> you have, <strong>how many are ready to bill</strong>, <strong>how many are flagged</strong> (running over SLA), and <strong>how many stages are currently automated</strong> for you. If anything is red, it shows up first on the page.`,
        cta: { label: "Go to dashboard", href: "/app" },
      },
      {
        title: "Six stages, every provider.",
        body: `Every clinician moves through <strong>Intake → PSV → Privileging → Committee → Enrollment → Approved</strong>. Click any provider name to see exactly where they are, what's automated at that step, and when the next follow-up runs.`,
        cta: { label: "Browse providers", href: "/app/providers" },
      },
      {
        title: "Red flags = act now.",
        body: `Each stage has an SLA. The moment a provider sits in a stage longer than the target, you'll see a <strong>red badge</strong> — on the dashboard, on the provider page, and in the follow-ups queue. No more guessing what's stuck.`,
      },
      {
        title: "What's automated already.",
        body: `<strong>Intake</strong>: email document requests + OCR. <strong>PSV</strong>: NPPES, OIG, SAM, NPDB, DEA running continuously. <strong>Enrollment</strong>: payer apps auto-filled with your approval gate. You stay in the loop — CredTek does the grinding.`,
      },
      {
        title: readOnly
          ? "You're set, Chris."
          : "Add your first provider when you're ready.",
        body: readOnly
          ? `You're viewing this workspace as a <strong>read-only partner</strong> — you'll always see the same live status your team sees, without edit controls. I'll be here in the corner whenever you want context on a step.`
          : `Bring in one clinician to feel the flow, or paste a CSV to bulk-import a roster. I'm always one click away in the bottom-right if you have questions.`,
        cta: hasProviders
          ? { label: "Open follow-ups queue", href: "/app/followups" }
          : readOnly
          ? undefined
          : { label: "Add a provider", href: "/app/providers/new" },
      },
    ];
    return steps;
  }, [firstName, tenantName, hasProviders, readOnly]);

  // ---------- Context-aware tip per page ----------
  const pageTip = useMemo(() => {
    if (pathname === "/app") {
      return hasProviders
        ? flaggedCount > 0
          ? `You have <strong>${flaggedCount} red flag${
              flaggedCount === 1 ? "" : "s"
            }</strong> — those providers are over their stage SLA. Open them first.`
          : `Pipeline looks healthy. Use <em>Pipeline health</em> below to spot anyone slowing down before they flag.`
        : `You don't have any providers yet. Adding one is the fastest way to see the platform in motion.`;
    }
    if (pathname === "/app/providers") {
      return readOnly
        ? `You're seeing the full provider roster as your team sees it — click a name to open the credentialing workspace.`
        : `Click any provider to see the full credentialing workspace — licenses, credentials, documents, payer enrollments. Use <strong>+ Add provider</strong> for one, or <strong>⤓ Bulk import</strong> for a roster.`;
    }
    if (pathname === "/app/providers/new") {
      return `Just the basics here — name, credential, NPI, specialty, and the states they'll practice in. CredTek will start the intake automations the moment you save.`;
    }
    if (pathname === "/app/providers/import") {
      return `Paste your roster as CSV: <code>name, credential, npi, specialty, states</code>. States are separated with <strong>;</strong> or <strong>|</strong> so commas stay clean.`;
    }
    if (pathname.startsWith("/app/providers/")) {
      return readOnly
        ? `This is the live credentialing file. The progress bar at the top shows where this provider is, what's automated, and when the next follow-up fires.`
        : `Use the tabs to add licenses, credentials, documents, and payer enrollments. <strong>Advance stage →</strong> moves them forward and resets the SLA clock.`;
    }
    if (pathname.startsWith("/app/followups")) {
      return `Every row here is a real, ready-to-send email derived from your provider data. Click <strong>Send now</strong> to fire it, or open the provider to edit the file first.`;
    }
    return `Anything you want explained, ask me — I know every page in here.`;
  }, [pathname, hasProviders, flaggedCount, readOnly]);

  // ---------- FAQ shortcuts ----------
  const topics: Topic[] = useMemo(
    () => [
      {
        q: "What do the six stages mean?",
        a: `<strong>Intake</strong> — collect provider documents. <strong>PSV</strong> — primary source verification (NPPES, OIG, SAM, NPDB, DEA). <strong>Privileging</strong> — facility privileges. <strong>Committee</strong> — credentialing committee review. <strong>Enrollment</strong> — payer enrollment. <strong>Approved</strong> — ready to bill.`,
      },
      {
        q: "How do red flags work?",
        a: `Each stage has an SLA target. Intake 3 days, PSV 10, Privileging 21, Committee 7, Enrollment 40. If a provider sits past target, you'll see a red badge on the dashboard, the provider page, and the follow-up queue.`,
      },
      {
        q: "What's actually automated today?",
        a: `Intake document requests + OCR. PSV runs against NPPES, OIG LEIE, SAM.gov, state boards, NPDB, DEA continuously. Payer enrollment applications auto-fill from the golden profile, with your approval gate before submission.`,
      },
      {
        q: "How do follow-ups fire?",
        a: `Per stage: Intake reminds every 2 days, PSV escalates after 5 silent days, Privileging reminds the facility every 7 days, Enrollment status-checks every 7 days. The <strong>Follow-ups</strong> page shows what's queued and lets you send any of them right now.`,
        cta: { label: "Open follow-ups", href: "/app/followups" },
      },
      {
        q: "How do I credential one provider in multiple states?",
        a: `Add the provider once, then list every state they'll practice in on the <strong>States</strong> field. From the provider page, add a <strong>License</strong> per state under the Licenses tab and a <strong>Payer enrollment</strong> per state under Enrollment. CredTek tracks each state's expiration and renewal separately.`,
        cta: { label: "Add a provider", href: "/app/providers/new" },
      },
      {
        q: "What can my team see?",
        a: `Admins and coordinators have full edit. Clients see live read-only status — same dashboard, same red flags, same progress visualizations, no edit controls. Finance sees what's billable. Everyone sees truth.`,
      },
      {
        q: "How do I bulk-upload a roster?",
        a: `Paste a CSV on the Bulk import page. The format is <code>name, credential, npi, specialty, states</code> — one row per provider. Header row is optional, we detect and skip it.`,
        cta: { label: "Open bulk import", href: "/app/providers/import" },
      },
    ],
    []
  );

  function endTour() {
    setInTour(false);
    setTourIndex(0);
  }

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  // Greet with red-flag urgency when relevant.
  const greetSub =
    flaggedCount > 0
      ? `${flaggedCount} provider${flaggedCount === 1 ? " is" : "s are"} over SLA — I'll point you to them first.`
      : hasProviders
      ? `Your workspace is looking good. Ask me anything any time.`
      : `Let's get your first provider rolling.`;

  if (!mounted) return null;

  return (
    <>
      {/* Floating launcher — always visible bottom-right */}
      <button
        type="button"
        className={`pg-launcher${open ? " pg-launcher-open" : ""}${glow ? " pg-launcher-glow" : ""}`}
        aria-label={open ? "Close CredTek guide" : "Open CredTek guide"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="pg-launcher-avatar">C</span>
        <span className="pg-launcher-label">
          {open ? "Close" : `Ask Cred${firstName !== "there" ? `, ${firstName}` : ""}`}
        </span>
        {flaggedCount > 0 && !open && <span className="pg-launcher-dot" aria-hidden />}
      </button>

      {open && (
        <div className="pg-panel" role="dialog" aria-label="CredTek guide">
          {/* Header */}
          <div className="pg-head">
            <div className="pg-head-l">
              <div className="pg-head-avatar">C</div>
              <div className="pg-head-titles">
                <div className="pg-head-title">Cred</div>
                <div className="pg-head-sub">Your CredTek guide</div>
              </div>
            </div>
            <div className="pg-head-r">
              <button
                type="button"
                className="pg-head-btn"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="pg-body">
            {/* Bot greeting bubble — always visible at top */}
            <div className="pg-bubble pg-bubble-bot">
              <div className="pg-bubble-name">Cred</div>
              <p className="pg-bubble-text">
                {firstName !== "there" ? <>Hi <strong>{firstName}</strong> — </> : <>Hi there — </>}
                {greetSub}
              </p>
            </div>

            {/* Tour mode */}
            {inTour && (
              <>
                <div className="pg-bubble pg-bubble-bot pg-bubble-tour">
                  <div className="pg-tour-meter" aria-hidden>
                    {tour.map((_, i) => (
                      <span
                        key={i}
                        className={`pg-tour-dot${i === tourIndex ? " pg-tour-dot-on" : ""}${
                          i < tourIndex ? " pg-tour-dot-done" : ""
                        }`}
                      />
                    ))}
                  </div>
                  <div className="pg-tour-title">{tour[tourIndex].title}</div>
                  <p
                    className="pg-bubble-text"
                    dangerouslySetInnerHTML={{ __html: tour[tourIndex].body }}
                  />
                  <div className="pg-tour-actions">
                    {tourIndex > 0 && (
                      <button
                        type="button"
                        className="pg-btn pg-btn-ghost"
                        onClick={() => setTourIndex((i) => Math.max(0, i - 1))}
                      >
                        ← Back
                      </button>
                    )}
                    <button
                      type="button"
                      className="pg-btn pg-btn-ghost"
                      onClick={endTour}
                    >
                      Skip tour
                    </button>
                    {tour[tourIndex].cta && (
                      <button
                        type="button"
                        className="pg-btn pg-btn-secondary"
                        onClick={() => navigate(tour[tourIndex].cta!.href)}
                      >
                        {tour[tourIndex].cta!.label}
                      </button>
                    )}
                    {tourIndex < tour.length - 1 ? (
                      <button
                        type="button"
                        className="pg-btn pg-btn-primary"
                        onClick={() => setTourIndex((i) => i + 1)}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="pg-btn pg-btn-primary"
                        onClick={endTour}
                      >
                        Got it
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Settled mode (after / instead of tour) */}
            {!inTour && (
              <>
                {/* Context-aware tip for the current page */}
                <div className="pg-bubble pg-bubble-bot">
                  <div className="pg-bubble-name">On this page</div>
                  <p
                    className="pg-bubble-text"
                    dangerouslySetInnerHTML={{ __html: pageTip }}
                  />
                </div>

                {/* Active topic answer */}
                {activeTopic && (
                  <div className="pg-bubble pg-bubble-bot pg-bubble-answer">
                    <div className="pg-bubble-name">{activeTopic.q}</div>
                    <p
                      className="pg-bubble-text"
                      dangerouslySetInnerHTML={{ __html: activeTopic.a }}
                    />
                    {activeTopic.cta && (
                      <div className="pg-tour-actions" style={{ marginTop: 10 }}>
                        <button
                          type="button"
                          className="pg-btn pg-btn-primary"
                          onClick={() => navigate(activeTopic.cta!.href)}
                        >
                          {activeTopic.cta!.label}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* FAQ chips */}
                <div className="pg-topics-lbl">Quick answers</div>
                <div className="pg-topics">
                  {topics.map((t) => (
                    <button
                      key={t.q}
                      type="button"
                      className={`pg-topic${activeTopic?.q === t.q ? " pg-topic-on" : ""}`}
                      onClick={() => setActiveTopic(t)}
                    >
                      {t.q}
                    </button>
                  ))}
                </div>

                {/* Restart tour */}
                <div className="pg-tour-actions" style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className="pg-btn pg-btn-ghost"
                    onClick={() => {
                      setInTour(true);
                      setTourIndex(0);
                      setActiveTopic(null);
                    }}
                  >
                    🔁 Replay welcome tour
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="pg-foot">
            <span>
              Powered by <strong>CredTek</strong> · {readOnly ? "Read-only view" : "Live workspace"}
            </span>
            <a className="pg-foot-link" href="mailto:support@cred-tek.com">
              Email support
            </a>
          </div>
        </div>
      )}
    </>
  );
}
