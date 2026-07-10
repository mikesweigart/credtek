"use client";

// ChatWidget — the site-wide support/sales assistant on every PUBLIC
// marketing page (the links a prospect gets sent). Designed to "stand on
// its own" in a live presentation: it answers the full buyer Q&A —
// speed, pricing, agents, payors, PSV, security, onboarding, ROI — and
// always routes to a demo or a human, never a dead end.
//
// The brain is deterministic (chatKnowledge.ts), grounded verbatim in the
// landing-page copy, so it cannot hallucinate a price or a compliance
// claim. See chatKnowledge.ts for the AI-upgrade path.
//
// MOUNTED ONCE in app/layout.tsx. It route-gates itself: it renders
// nothing on the demo portal, the real product, white-label, ops, and
// auth routes (those have their own in-context guides), so a prospect
// never sees two chat bubbles.

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CAL_LINK,
  FALLBACK,
  KNOWLEDGE,
  STARTER_CHIPS,
  matchTopic,
  topicById,
  type ChatAction,
  type ChatBlock,
} from "./chatKnowledge";
import { EmailDemoModal } from "./EmailDemoModal";
import { track } from "./Analytics";

// Routes that already have their own in-context assistant (DemoGuide,
// PortalGuide, AvelGuide) or are functional/auth surfaces. Segment-aware
// so "/api-docs" is NOT caught by an "/app"-style prefix.
const EXCLUDE_PREFIXES = [
  // Demo portal (rendered at root via the (app) route group) — DemoGuide
  "/dashboard",
  "/providers",
  "/payors",
  "/licenses",
  "/settings",
  "/supervision",
  "/notifications",
  "/approvals",
  "/invite",
  // Real product (PortalGuide), white-label (AvelGuide), internal ops
  "/app",
  "/eastside-hospital",
  "/ops",
  // Auth / account / onboarding flows
  "/account",
  "/auth",
  "/get-started",
  "/intake",
  "/sign-in",
  "/welcome",
];

function isExcluded(pathname: string): boolean {
  return EXCLUDE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

const STORE_KEY = "credtek_chat";

type Msg =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; blocks: ChatBlock[]; followups?: string[] };

let _seq = 0;
function uid(): string {
  _seq += 1;
  return `m${Date.now().toString(36)}_${_seq}`;
}

// Render **bold** inline without dangerouslySetInnerHTML.
function renderRich(text: string): ReactNode {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i}>{part}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function ChatWidget() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const excluded = isExcluded(pathname);
  const onLanding = pathname === "/";

  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);

  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<number | null>(null);
  const prevOpen = useRef(false);

  // Restore prior conversation (within the tab) so context survives
  // client-side navigation and reloads.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.messages)) setMessages(data.messages as Msg[]);
        if (data.nudgeDismissed) setNudgeDismissed(true);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist conversation + nudge state.
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        STORE_KEY,
        JSON.stringify({ messages, nudgeDismissed }),
      );
    } catch {
      /* ignore */
    }
  }, [messages, nudgeDismissed, hydrated]);

  // Surface the greeting nudge a few seconds in, if not opened/dismissed.
  useEffect(() => {
    if (excluded || !hydrated) return;
    if (nudgeDismissed || open) return;
    const t = window.setTimeout(() => setNudgeVisible(true), 3500);
    return () => window.clearTimeout(t);
  }, [excluded, hydrated, nudgeDismissed, open]);

  // Focus the composer when the panel opens; Esc closes.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Return focus to the launcher when the panel closes (soft, not a trap).
  useEffect(() => {
    if (prevOpen.current && !open) launcherRef.current?.focus();
    prevOpen.current = open;
  }, [open]);

  // Keep the latest message in view.
  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, open]);

  // Clean up any pending reply timer on unmount.
  useEffect(
    () => () => {
      if (replyTimer.current) window.clearTimeout(replyTimer.current);
    },
    [],
  );

  function openPanel() {
    setOpen(true);
    setNudgeVisible(false);
    setNudgeDismissed(true);
    track("chat_opened", { path: pathname });
  }

  function dismissNudge() {
    setNudgeVisible(false);
    setNudgeDismissed(true);
  }

  // Push an assistant reply after a short, human-feeling typing delay.
  function respondWith(blocks: ChatBlock[], followups?: string[]) {
    setTyping(true);
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    const delay = 420 + Math.random() * 460;
    replyTimer.current = window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: uid(), role: "assistant", blocks, followups },
      ]);
    }, delay);
  }

  function sendText(raw: string) {
    const text = raw.trim();
    if (!text) return;
    track("chat_message_sent", { via: "text", len: text.length });
    setMessages((m) => [...m, { id: uid(), role: "user", text }]);
    setInput("");
    const topic = matchTopic(text, KNOWLEDGE);
    if (topic) {
      track("chat_topic_matched", { topicId: topic.id, via: "text" });
      respondWith(topic.answer, topic.followups);
    } else {
      track("chat_fallback", { query: text.slice(0, 120) });
      respondWith(FALLBACK);
    }
  }

  function askTopic(topicId: string, echo: string) {
    track("chat_message_sent", { via: "chip", topicId });
    setMessages((m) => [...m, { id: uid(), role: "user", text: echo }]);
    const topic = topicById(topicId);
    if (topic) {
      track("chat_topic_matched", { topicId: topic.id, via: "chip" });
      respondWith(topic.answer, topic.followups);
    } else {
      respondWith(FALLBACK);
    }
  }

  function handleAction(a: ChatAction) {
    track("chat_cta_clicked", { kind: a.kind, label: a.label, path: pathname });
    if (a.kind === "calendly") {
      window.open(CAL_LINK, "_blank", "noopener,noreferrer");
      return;
    }
    if (a.kind === "tour") {
      setOpen(false);
      setDemoOpen(true);
      return;
    }
    if (a.kind === "link") {
      setOpen(false);
      router.push(a.href);
      return;
    }
    // topic
    askTopic(a.topicId, a.label);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendText(input);
  }

  // All hooks are above this line — safe to bail out now.
  if (excluded) return null;

  const rootClass = `cw-root${onLanding ? " cw-on-landing" : ""}${
    open ? " cw-open" : ""
  }`;

  return (
    <div className={rootClass}>
      {/* Greeting nudge — a small prompt that invites a click. */}
      {nudgeVisible && !open && (
        <div className="cw-nudge" role="status">
          <button
            type="button"
            className="cw-nudge-body"
            onClick={openPanel}
            aria-label="Open the CredTek assistant"
          >
            <span className="cw-nudge-title">Questions about credentialing?</span>
            <span className="cw-nudge-sub">
              Ask me anything — pricing, speed, security, or see a demo.
            </span>
          </button>
          <button
            type="button"
            className="cw-nudge-close"
            onClick={dismissNudge}
            aria-label="Dismiss"
          >
            <CloseIcon />
          </button>
        </div>
      )}

      {/* Launcher */}
      <button
        ref={launcherRef}
        type="button"
        className="cw-launcher"
        aria-label={open ? "Close the CredTek assistant" : "Open the CredTek assistant"}
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openPanel())}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
        {!open && messages.length === 0 && <span className="cw-launcher-dot" aria-hidden="true" />}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="cw-panel"
          role="dialog"
          aria-modal="false"
          aria-label="CredTek assistant"
        >
          <header className="cw-header">
            <div className="cw-header-id">
              <span className="cw-avatar" aria-hidden="true">
                <ChatIcon />
              </span>
              <div className="cw-header-text">
                <div className="cw-header-title">CredTek Assistant</div>
                <div className="cw-header-status">
                  <span className="cw-status-dot" aria-hidden="true" />
                  Online · answers instantly
                </div>
              </div>
            </div>
            <button
              type="button"
              className="cw-header-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </header>

          <div className="cw-thread" role="log" aria-live="polite" aria-relevant="additions">
            {/* Persistent welcome — the panel is never empty. */}
            <div className="cw-msg cw-msg-assistant">
              <div className="cw-bubble">
                <p className="cw-p">
                  {renderRich(
                    "Hi — I'm the **CredTek assistant**. I can explain how we get providers credentialed and **billing 40–60% faster**, walk through pricing or security, or set you up with a demo.",
                  )}
                </p>
              </div>
            </div>

            {messages.length === 0 && (
              <div className="cw-starter">
                <div className="cw-starter-label">Popular questions</div>
                <div className="cw-chips">
                  {STARTER_CHIPS.map((c) => (
                    <button
                      key={c.topicId}
                      type="button"
                      className="cw-chip"
                      onClick={() => askTopic(c.topicId, c.label)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="cw-msg cw-msg-user">
                  <div className="cw-bubble">{m.text}</div>
                </div>
              ) : (
                <div key={m.id} className="cw-msg cw-msg-assistant">
                  <div className="cw-bubble">
                    {m.blocks.map((b, i) => (
                      <Block key={i} block={b} onAction={handleAction} />
                    ))}
                  </div>
                  {m.followups && m.followups.length > 0 && (
                    <div className="cw-followups">
                      {m.followups.map((fid) => {
                        const t = topicById(fid);
                        if (!t) return null;
                        const label = t.chip || t.id;
                        return (
                          <button
                            key={fid}
                            type="button"
                            className="cw-chip cw-chip-ghost"
                            onClick={() => askTopic(fid, label)}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ),
            )}

            {typing && (
              <div className="cw-msg cw-msg-assistant" aria-hidden="true">
                <div className="cw-bubble cw-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <form className="cw-composer" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="cw-input"
              placeholder="Ask about pricing, speed, security…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Type your question"
              autoComplete="off"
            />
            <button
              type="submit"
              className="cw-send"
              disabled={!input.trim()}
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </form>

          <div className="cw-foot">
            <button
              type="button"
              className="cw-foot-link"
              onClick={() => handleAction({ kind: "tour", label: "See the demo" })}
            >
              See the interactive demo
            </button>
            <span className="cw-foot-sep">·</span>
            <button
              type="button"
              className="cw-foot-link"
              onClick={() =>
                handleAction({ kind: "calendly", label: "Book a live demo" })
              }
            >
              Talk to a human
            </button>
          </div>
        </div>
      )}

      {/* The interactive-demo capture flow — its overlay sits above the
          chat panel (z-index), so opening it from a CTA reads cleanly. */}
      <EmailDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}

// ---- Message block renderer ---------------------------------------------

function Block({
  block,
  onAction,
}: {
  block: ChatBlock;
  onAction: (a: ChatAction) => void;
}) {
  if (block.t === "p") return <p className="cw-p">{renderRich(block.text)}</p>;
  if (block.t === "ul") {
    return (
      <ul className="cw-ul">
        {block.items.map((it, i) => (
          <li key={i}>{renderRich(it)}</li>
        ))}
      </ul>
    );
  }
  return (
    <div className="cw-actions">
      {block.items.map((a, i) => (
        <button
          key={i}
          type="button"
          className={`cw-action cw-action-${a.kind}`}
          onClick={() => onAction(a)}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

// ---- Icons (SVG only — no emoji, matching the site's icon system) -------

function ChatIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
