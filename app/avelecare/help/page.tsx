// Help & Chat — landing page for guided support. The chat widget
// itself lives in AvelGuide and is mounted globally by the layout.
// This page is a way for users to launch tours or browse common
// flows without first opening the chat bubble.

import { AvelTopbar } from "../_components/AvelNav";

export const metadata = { title: "Help & Chat" };

const QUICK_GUIDES = [
  {
    title: "Add a new provider",
    detail: "3-step walkthrough — basic info, licensure, then assign service lines and spaces.",
    cta: "Walk me through it",
  },
  {
    title: "Summarize a provider's readiness",
    detail: "Ask Ava for any clinician — she'll roll up credentialing, privileging, and payer enrollment in one view.",
    cta: "Open the assistant",
  },
  {
    title: "Find providers ready to bill",
    detail: "Filter the Providers table by readiness or use the Dashboard ready-to-bill tile.",
    cta: "Show me how",
  },
  {
    title: "Set up a new space or program",
    detail: "Spaces represent facilities or programs. Each space gets its own workflow and credentialing requirements.",
    cta: "Open the guide",
  },
];

const FAQ = [
  {
    q: "What does \"Ready to Work\" mean?",
    a: "A provider is ready to work when credentialing and privileging are complete for at least one of their assigned Avel spaces. They can be clinically scheduled but may not yet be billable for every payer.",
  },
  {
    q: "What does \"Ready to Bill\" mean?",
    a: "A provider is ready to bill when they are credentialed, privileged, and enrolled with at least one active payer for the spaces they cover. Avel can both schedule and bill for their services.",
  },
  {
    q: "How are credentialing requirements customized per space?",
    a: "Each space inherits a default workflow based on its service line — Emergency, ICU, Behavioral Health, etc. Workflows can add facility-specific requirements (bylaws, training certifications, state attestations) as additional steps.",
  },
  {
    q: "How are expiring credentials surfaced?",
    a: "Avel scans every active credential against its expiration date and surfaces anything inside the 60-day window on the Dashboard alerts panel and on the provider's profile. Renewal can be auto-drafted for state license boards.",
  },
];

export default function AvelHelp() {
  return (
    <>
      <AvelTopbar
        title="Help & Chat"
        subtitle="Need help using the Avel eCare Credentialing Portal? Start a chat, browse common guides, or send feedback to your portal team."
      />

      <div className="avel-content">
        <div className="avel-card avel-help-launch">
          <div className="avel-help-launch-text">
            <div className="avel-help-launch-eyebrow">In-product assistant</div>
            <div className="avel-help-launch-title">
              Ava can answer almost anything in this portal.
            </div>
            <p>
              Ava lives in the bottom-right corner of every page. Ask her to
              explain what you&apos;re seeing, walk you through a task, or
              roll up a provider&apos;s credentialing status — she pulls
              directly from your data.
            </p>
          </div>
          <div className="avel-help-launch-card">
            <div className="avel-help-launch-card-av">A</div>
            <div className="avel-help-launch-card-name">Ava</div>
            <div className="avel-help-launch-card-status">
              <span className="avel-guide-status-dot" /> Online · Avel team
            </div>
          </div>
        </div>

        <div className="avel-card-head" style={{ marginTop: 18 }}>
          <div>
            <div className="avel-card-title">Quick guides</div>
            <div className="avel-card-sub">
              Tap any guide to launch a walkthrough with Ava.
            </div>
          </div>
        </div>

        <div className="avel-help-grid">
          {QUICK_GUIDES.map((g) => (
            <div key={g.title} className="avel-help-card">
              <div className="avel-help-card-title">{g.title}</div>
              <div className="avel-help-card-detail">{g.detail}</div>
              <div className="avel-help-card-cta">{g.cta} →</div>
            </div>
          ))}
        </div>

        <div className="avel-card-head" style={{ marginTop: 22 }}>
          <div>
            <div className="avel-card-title">Frequently asked</div>
            <div className="avel-card-sub">
              The questions your team asks most often, answered directly.
            </div>
          </div>
        </div>

        <div className="avel-faq">
          {FAQ.map((f) => (
            <div key={f.q} className="avel-faq-item">
              <div className="avel-faq-q">{f.q}</div>
              <div className="avel-faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
