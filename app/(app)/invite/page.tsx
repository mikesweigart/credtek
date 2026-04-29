// Coordinator-side: invite a new provider. Coordinator pastes name + email
// + phone + license context, hits Send, and (in production) the provider
// gets an SMS + email with a link to /intake/[token]. Demo mode just shows
// the link inline so partners can click through to the provider side.

import Link from "next/link";
import { DemoButton } from "../_components/DemoButton";

export const metadata = {
  title: "Invite a provider",
};

const RECENT_INVITES = [
  {
    name: "Aisha Patel",
    credential: "LPC-A",
    sent: "today · 10:42 AM",
    status: "Started",
    statusTone: "pending" as const,
    token: "demo-aisha",
  },
  {
    name: "Marcus Singh",
    credential: "LCSW",
    sent: "yesterday · 2:15 PM",
    status: "Submitted",
    statusTone: "active" as const,
    token: "demo-marcus",
  },
  {
    name: "Rachel Bennett",
    credential: "LMFT",
    sent: "Apr 26 · 9:08 AM",
    status: "Verified",
    statusTone: "active" as const,
    token: "demo-rachel",
  },
  {
    name: "James Mitchell",
    credential: "LCSW",
    sent: "Apr 24 · 4:30 PM",
    status: "Awaiting provider",
    statusTone: "flag" as const,
    token: "demo-james",
  },
];

export default function InvitePage() {
  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">The magic moment</span>
        <h1>Invite a provider.</h1>
        <p>
          Send an SMS + email with a secure intake link. Provider snaps photos
          of their license, DEA, COI, and CV. Our agent extracts everything,
          validates against primary sources, and pre-fills CAQH. Average
          time-to-completed: <strong style={{ color: "var(--ink)" }}>11 minutes</strong>.
        </p>
      </section>

      <div className="invite-grid">
        <div className="dash-panel" style={{ padding: "20px 22px" }}>
          <div className="invite-form">
            <div className="invite-row">
              <label className="invite-label">First name</label>
              <input
                className="invite-input"
                placeholder="Aisha"
                defaultValue="Aisha"
              />
            </div>
            <div className="invite-row">
              <label className="invite-label">Last name</label>
              <input
                className="invite-input"
                placeholder="Patel"
                defaultValue="Patel"
              />
            </div>
            <div className="invite-row">
              <label className="invite-label">Email</label>
              <input
                className="invite-input"
                type="email"
                placeholder="aisha@example.com"
                defaultValue="aisha.patel@example.com"
              />
            </div>
            <div className="invite-row">
              <label className="invite-label">Phone (for SMS)</label>
              <input
                className="invite-input"
                type="tel"
                placeholder="(555) 010-2034"
                defaultValue="(555) 010-2034"
              />
            </div>
            <div className="invite-row-2col">
              <div>
                <label className="invite-label">Credential</label>
                <select className="invite-input" defaultValue="LPC-A">
                  <option>LCSW</option>
                  <option>LMSW</option>
                  <option>LPC</option>
                  <option>LPC-A</option>
                  <option>LMFT</option>
                  <option>LMFT-A</option>
                  <option>PsyD</option>
                  <option>PhD</option>
                  <option>MD</option>
                  <option>Psychiatric NP</option>
                  <option>BCBA</option>
                </select>
              </div>
              <div>
                <label className="invite-label">Primary state</label>
                <select className="invite-input" defaultValue="TX">
                  <option>TX</option>
                  <option>CA</option>
                  <option>FL</option>
                  <option>NY</option>
                  <option>GA</option>
                  <option>CO</option>
                </select>
              </div>
            </div>
            <div className="invite-row">
              <label className="invite-label">Pre-licensed (under supervision)?</label>
              <select className="invite-input" defaultValue="yes">
                <option value="yes">Yes — assign supervisor on next step</option>
                <option value="no">No — fully licensed</option>
              </select>
            </div>

            <div className="invite-actions">
              <DemoButton
                className="btn-primary"
                demoMessage="Demo — in production this sends an SMS to the provider's phone and an email with a secure intake link. The provider opens it on their phone and the rest is automated."
              >
                Send intake link →
              </DemoButton>
              <span className="invite-meta">
                ✦ Provider's phone receives the link in &lt;3 seconds
              </span>
            </div>
          </div>
        </div>

        <div className="dash-panel" style={{ padding: "20px 22px" }}>
          <h3
            style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 14,
              color: "var(--ink)",
            }}
          >
            What happens after Send
          </h3>
          <ol className="invite-flow">
            <li>
              <span className="invite-flow-num">1</span>
              <div>
                <strong>SMS + email out</strong>
                <p>
                  Provider gets a link to a mobile-friendly intake page.
                  Average open: <strong>under 5 minutes</strong>.
                </p>
              </div>
            </li>
            <li>
              <span className="invite-flow-num">2</span>
              <div>
                <strong>Provider snaps photos</strong>
                <p>
                  License, DEA, malpractice, board cert, CV. Camera-friendly,
                  iPhone-shaped.
                </p>
              </div>
            </li>
            <li>
              <span className="invite-flow-num">3</span>
              <div>
                <strong>Agent extracts + validates</strong>
                <p>
                  OCR + LLM pulls every field. State board PSV runs in
                  parallel. Anomalies flag for your review.
                </p>
              </div>
            </li>
            <li>
              <span className="invite-flow-num">4</span>
              <div>
                <strong>CAQH pre-fill</strong>
                <p>
                  Provider approves with one tap. Re-attestation continues
                  automatically every 120 days via SMS.
                </p>
              </div>
            </li>
            <li>
              <span className="invite-flow-num">5</span>
              <div>
                <strong>Provider profile created</strong>
                <p>
                  Full provider appears in your dashboard. Payor enrollment
                  agents start drafting submissions.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      <div className="dash-panel" style={{ marginTop: 20 }}>
        <div className="dash-panel-head">
          <h3>Recent invites</h3>
          <span className="filt">CLICK TO PREVIEW PROVIDER VIEW →</span>
        </div>
        {RECENT_INVITES.map((inv) => {
          const pillClass =
            inv.statusTone === "active"
              ? "pstat s-active"
              : inv.statusTone === "flag"
                ? "pstat s-flag"
                : "pstat s-pending";
          return (
            <Link
              key={inv.token}
              href={`/intake/${inv.token}`}
              className="dash-row"
              target="_blank"
            >
              <div className="dash-row-av">
                {inv.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="dash-row-name">
                  {inv.name}, {inv.credential}
                </div>
                <div className="dash-row-meta">Sent {inv.sent}</div>
              </div>
              <div
                className="dash-row-states"
                style={{ fontSize: 10 }}
              >
                cred-tek.com/intake/{inv.token}
              </div>
              <div className={pillClass}>{inv.status}</div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
