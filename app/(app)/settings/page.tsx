// Settings — workspace, team, integrations, billing, notifications.
// Single-scroll layout for the demo so partners see the full surface area
// without clicking through tabs. Production split into tabs when sections
// outgrow this page.

import Link from "next/link";
import { DemoButton } from "../_components/DemoButton";

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">Workspace administration</span>
        <h1>Settings</h1>
        <p>
          Workspace, team, integrations, and billing for{" "}
          <strong style={{ color: "var(--ink)" }}>
            Mindscape Behavioral Health
          </strong>
          .
        </p>
      </section>

      {/* ---------- Workspace ---------- */}
      <section className="settings-block">
        <SectionHeader
          title="Workspace"
          subtitle="What appears on emails to providers, on the audit binder, and in your team's CredTek workspace."
        />
        <div className="settings-grid">
          <Field label="Workspace name" value="Mindscape Behavioral Health" />
          <Field
            label="Workspace slug"
            value="mindscape"
            note="Used in provider invite links: cred-tek.com/intake/[slug]/[token]"
          />
          <Field label="Time zone" value="America/Chicago (UTC −05:00)" />
          <Field label="Primary contact" value="Mike Sweigart · Director of Operations" />
          <Field
            label="Brand color"
            value="#0B1F2E"
            visual={
              <span
                className="settings-swatch"
                style={{ background: "#0B1F2E" }}
              ></span>
            }
          />
          <Field
            label="Logo on provider invites"
            value="Uploaded · mindscape-logo.svg"
          />
        </div>
        <SaveRow label="workspace settings" />
      </section>

      <hr className="settings-divider" />

      {/* ---------- Operating states ---------- */}
      <section className="settings-block">
        <SectionHeader
          title="Operating states"
          subtitle="Which states your group practices in. Drives the License Matrix and which payor agents we keep warm."
        />
        <div className="settings-states">
          {[
            "TX",
            "CA",
            "FL",
            "NY",
            "GA",
            "CO",
            "WA",
            "AZ",
            "PA",
            "IL",
          ].map((s) => (
            <span key={s} className="settings-state-chip on">
              {s} ✓
            </span>
          ))}
          <span className="settings-state-chip">+ Add state</span>
        </div>
      </section>

      <hr className="settings-divider" />

      {/* ---------- Team ---------- */}
      <section className="settings-block">
        <SectionHeader
          title="Team"
          subtitle="Who has access to this workspace and what they can do."
          action={
            <DemoButton
              className="prov-btn primary"
              demoMessage="Demo — would email an invite to the new team member with a link to set their password and join the workspace."
            >
              + Invite team member
            </DemoButton>
          }
        />
        <div className="dash-panel" style={{ marginTop: 14 }}>
          {[
            {
              name: "Marisol Diaz",
              email: "marisol@mindscape.health",
              role: "Director of Credentialing",
              status: "Owner",
              tone: "active" as const,
            },
            {
              name: "Jordan Reyes",
              email: "jordan@mindscape.health",
              role: "Credentialing Coordinator",
              status: "Admin",
              tone: "active" as const,
            },
            {
              name: "Avery Chen",
              email: "avery@mindscape.health",
              role: "Credentialing Coordinator",
              status: "Admin",
              tone: "active" as const,
            },
            {
              name: "Rachel Bennett",
              email: "rachel@mindscape.health",
              role: "Clinical Supervisor",
              status: "Supervisor",
              tone: "pending" as const,
            },
            {
              name: "Mike Sweigart",
              email: "mike@mindscape.health",
              role: "Director of Operations",
              status: "Read-only",
              tone: "pending" as const,
            },
          ].map((m) => (
            <div key={m.email} className="dash-row" style={{ cursor: "default" }}>
              <div className="dash-row-av">
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="dash-row-name">{m.name}</div>
                <div className="dash-row-meta">
                  {m.role} · {m.email}
                </div>
              </div>
              <div></div>
              <div
                className={
                  m.tone === "active" ? "pstat s-active" : "pstat s-pending"
                }
              >
                {m.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="settings-divider" />

      {/* ---------- Integrations ---------- */}
      <section className="settings-block">
        <SectionHeader
          title="Integrations"
          subtitle="What CredTek talks to on your behalf. All credentials encrypted with workspace-scoped keys."
        />
        <div className="settings-integrations">
          <IntegrationCard
            name="CAQH ProView"
            note="Stored credentials let CredTek auto-attest every 120 days with provider SMS approval."
            status="Connected"
            tone="ok"
            updated="Apr 14, 2026"
          />
          <IntegrationCard
            name="Optum / UBH"
            note="Provider credentialing portal. Agent fills enrollments end-to-end."
            status="Connected"
            tone="ok"
            updated="Apr 22, 2026"
          />
          <IntegrationCard
            name="Carelon"
            note="Provider credentialing portal."
            status="Connected"
            tone="ok"
            updated="Apr 18, 2026"
          />
          <IntegrationCard
            name="Magellan"
            note="Provider credentialing portal."
            status="Connected"
            tone="ok"
            updated="Apr 11, 2026"
          />
          <IntegrationCard
            name="Evernorth Behavioral Health"
            note="Provider credentialing portal."
            status="Connected"
            tone="ok"
            updated="Apr 27, 2026"
          />
          <IntegrationCard
            name="Anthem BH"
            note="Provider credentialing portal."
            status="Setup needed"
            tone="warn"
            updated=""
          />
          <IntegrationCard
            name="Texas Medicaid (Superior, Molina, Aetna Better Health)"
            note="State Medicaid MCO enrollment."
            status="Connected"
            tone="ok"
            updated="Apr 09, 2026"
          />
          <IntegrationCard
            name="Modio Import"
            note="One-time bulk import from your Modio export. Re-runs available."
            status="Last imported Apr 03"
            tone="ok"
            updated="Apr 03, 2026"
          />
          <IntegrationCard
            name="NPDB · OIG · SAM · DEA"
            note="Continuous sanctions monitoring across federal sources."
            status="Active"
            tone="ok"
            updated="continuous"
          />
          <IntegrationCard
            name="Outlook calendar"
            note="Coordinator + supervisor calendar holds for evaluations and CE deadlines."
            status="Not connected"
            tone="off"
            updated=""
          />
        </div>
      </section>

      <hr className="settings-divider" />

      {/* ---------- Notifications ---------- */}
      <section className="settings-block">
        <SectionHeader
          title="Notifications"
          subtitle="When CredTek pings you, your team, or your providers."
        />
        <div className="settings-notif-list">
          <NotifRow
            label="Approvals waiting more than 1 hour"
            channels={["Email", "Slack"]}
          />
          <NotifRow
            label="Provider PSV anomaly"
            channels={["Email", "Slack"]}
          />
          <NotifRow
            label="Supervisor cosignature overdue (provider-side)"
            channels={["SMS to supervisor"]}
          />
          <NotifRow
            label="License expiring in 60/30/14 days"
            channels={["Email", "SMS to provider"]}
          />
          <NotifRow
            label="CAQH attestation due"
            channels={["SMS to provider"]}
          />
          <NotifRow
            label="Weekly digest"
            channels={["Email · Mondays 8 AM CT"]}
          />
        </div>
      </section>

      <hr className="settings-divider" />

      {/* ---------- Billing ---------- */}
      <section className="settings-block">
        <SectionHeader
          title="Billing"
          subtitle="Your plan, payment method, and invoices."
        />
        <div className="settings-grid">
          <Field
            label="Plan"
            value="Per-provider · $35/provider/month + $300/enrollment"
          />
          <Field label="Active providers (this cycle)" value="214" />
          <Field label="Enrollment actions (this cycle)" value="11" />
          <Field
            label="Estimated next invoice"
            value="$10,790 · due May 15, 2026"
          />
          <Field label="Payment method" value="Visa ending 4427 · expires 09/28" />
          <Field
            label="Invoicing email"
            value="ap@mindscape.health"
          />
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <DemoButton
            className="prov-btn"
            demoMessage="Demo — would download a CSV of all monthly invoices for the workspace."
          >
            Download invoices
          </DemoButton>
          <DemoButton
            className="prov-btn"
            demoMessage="Demo — would open Stripe's hosted billing portal so you can swap card or change billing email."
          >
            Update payment method
          </DemoButton>
          <Link href="/" className="approval-link">
            View pricing details →
          </Link>
        </div>
      </section>

      <hr className="settings-divider" />

      {/* ---------- Danger zone ---------- */}
      <section className="settings-block">
        <SectionHeader
          title="Danger zone"
          subtitle="Self-explanatory. Get a coffee before you click anything down here."
        />
        <div className="settings-danger">
          <DemoButton
            className="prov-btn"
            demoMessage="Demo — would export every provider, every document, every audit log entry as a HIPAA-compliant ZIP. Available for 24 hours via signed URL."
          >
            Export all workspace data
          </DemoButton>
          <DemoButton
            className="prov-btn"
            demoMessage="Demo — would schedule workspace deletion for 30 days from now (data retained in case you change your mind), revoke all integrations, and email a compliance officer for offboarding."
          >
            Delete workspace
          </DemoButton>
        </div>
      </section>
    </>
  );
}

// ----- Helpers -----

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="settings-section-head">
      <div>
        <h3 className="settings-section-title">{title}</h3>
        <p className="settings-section-sub">{subtitle}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

function Field({
  label,
  value,
  note,
  visual,
}: {
  label: string;
  value: string;
  note?: string;
  visual?: React.ReactNode;
}) {
  return (
    <div className="settings-field">
      <div className="settings-field-label">{label}</div>
      <div className="settings-field-value">
        {visual}
        <span>{value}</span>
      </div>
      {note ? <div className="settings-field-note">{note}</div> : null}
    </div>
  );
}

function SaveRow({ label }: { label: string }) {
  return (
    <div style={{ marginTop: 16 }}>
      <DemoButton
        className="prov-btn primary"
        demoMessage={`Demo — would persist the ${label} and emit a changelog entry to the audit log.`}
      >
        Save changes
      </DemoButton>
    </div>
  );
}

function IntegrationCard({
  name,
  note,
  status,
  tone,
  updated,
}: {
  name: string;
  note: string;
  status: string;
  tone: "ok" | "warn" | "off";
  updated: string;
}) {
  const dotClass =
    tone === "ok"
      ? "settings-int-dot ok"
      : tone === "warn"
        ? "settings-int-dot warn"
        : "settings-int-dot off";
  return (
    <div className="settings-int-card">
      <div className="settings-int-top">
        <span className={dotClass}></span>
        <span className="settings-int-name">{name}</span>
        <span className="settings-int-status">{status}</span>
      </div>
      <p className="settings-int-note">{note}</p>
      {updated ? (
        <div className="settings-int-meta">UPDATED {updated.toUpperCase()}</div>
      ) : null}
    </div>
  );
}

function NotifRow({
  label,
  channels,
}: {
  label: string;
  channels: string[];
}) {
  return (
    <div className="settings-notif-row">
      <span className="settings-notif-label">{label}</span>
      <div className="settings-notif-channels">
        {channels.map((c) => (
          <span key={c} className="settings-notif-channel">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
