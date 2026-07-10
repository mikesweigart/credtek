// Admin & Settings — branding, roles & permissions, notifications.
// Tabbed layout; all inputs are demo-only and don't persist.

"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AvelTopbar } from "../_components/AvelNav";

type Tab = "branding" | "email" | "roles" | "notifications";

const ROLES = [
  {
    id: "credentialing-admin",
    name: "Credentialing Admin",
    members: 3,
    description: "Full access to providers, workflows, configurations, and audit logs.",
    permissions: ["Manage providers", "Edit workflows", "Approve submissions", "Export reports", "Manage users"],
  },
  {
    id: "service-line-director",
    name: "Service Line Director",
    members: 6,
    description: "Manage providers and spaces for assigned service lines.",
    permissions: ["View all providers", "Manage assigned spaces", "Approve submissions in scope", "Export reports"],
  },
  {
    id: "provider",
    name: "Provider (Clinician)",
    members: 15,
    description: "Self-service: view personal status, upload documents, approve attestations.",
    permissions: ["View own profile", "Upload own documents", "Approve own attestations"],
  },
  {
    id: "exec-finance",
    name: "Executive / Finance",
    members: 4,
    description: "Read-only access to dashboards and aggregated reports.",
    permissions: ["View dashboards", "View reports", "Export financial summaries"],
  },
];

export default function AvelSettings() {
  return (
    <>
      <AvelTopbar
        title="Admin & Settings"
        subtitle="Configure portal branding, connect your email, control who can see and do what, and tune how alerts reach your team."
      />
      <Suspense fallback={null}>
        <SettingsTabs />
      </Suspense>
    </>
  );
}

function SettingsTabs() {
  const searchParams = useSearchParams();
  const initial = (searchParams.get("tab") as Tab) || "branding";
  const [tab, setTab] = useState<Tab>(
    ["branding", "email", "roles", "notifications"].includes(initial) ? initial : "branding"
  );

  const TABS: { id: Tab; label: string }[] = [
    { id: "branding", label: "Branding" },
    { id: "email", label: "Email & Integrations" },
    { id: "roles", label: "Roles & Permissions" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className="avel-content">
      <div className="set-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`set-tab${tab === t.id ? " is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "branding" && <BrandingTab />}
      {tab === "email" && <EmailTab />}
      {tab === "roles" && <RolesTab />}
      {tab === "notifications" && <NotificationsTab />}

      <div className="avel-table-foot">
        Eastside Hospital Credentialing Portal · Admin
        &nbsp;·&nbsp;
        <Link className="avel-link" href="/avelecare">Back to Dashboard</Link>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Email & Integrations tab — connect the user's inbox so the portal
// can send renewal reminders, document requests, and payer follow-ups
// from their own email.
// ──────────────────────────────────────────────────────────────
const EMAIL_PROVIDERS = [
  { id: "microsoft", name: "Microsoft 365 / Outlook", desc: "Connect via Microsoft Graph. Most common for health systems.", icon: "✦" },
  { id: "google", name: "Google Workspace / Gmail", desc: "Connect via Google OAuth.", icon: "✉" },
  { id: "smtp", name: "Custom SMTP / IMAP", desc: "Any provider — bring your own mail server.", icon: "⚙" },
];

const EMAIL_ENABLES = [
  "Automated renewal reminders before licenses, DEA, and COIs lapse",
  "Provider intake & missing-document requests sent from your inbox",
  "Payer enrollment follow-ups and escalations",
  "CAQH re-attestation nudges every 120 days",
  "Replies thread back into the provider's record automatically",
];

function EmailTab() {
  const [connected, setConnected] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    try {
      setConnected(localStorage.getItem("avel_email_connected"));
    } catch {
      /* ignore */
    }
  }, []);

  function connect(providerId: string) {
    setPending(providerId);
    // Demo: simulate an OAuth round-trip, then store the connected address.
    const address =
      providerId === "google" ? "m.koehler@avelecare.com" : "m.koehler@avelecare.com";
    window.setTimeout(() => {
      try {
        localStorage.setItem("avel_email_connected", address);
      } catch {
        /* ignore */
      }
      setConnected(address);
      setPending(null);
    }, 800);
  }

  function disconnect() {
    try {
      localStorage.removeItem("avel_email_connected");
    } catch {
      /* ignore */
    }
    setConnected(null);
  }

  return (
    <div className="avel-grid-2">
      <div className="avel-card">
        <div className="avel-card-head">
          <div>
            <div className="avel-card-title">Connect your email</div>
            <div className="avel-card-sub">
              Send follow-ups, reminders, and requests from your own inbox — and have replies thread back automatically.
            </div>
          </div>
        </div>

        {connected ? (
          <div className="email-connected">
            <div className="email-connected-row">
              <span className="email-connected-dot" />
              <div>
                <div className="email-connected-addr">{connected}</div>
                <div className="email-connected-sub">Connected · sending enabled</div>
              </div>
              <button type="button" className="avel-btn-ghost" onClick={disconnect}>
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="email-providers">
            {EMAIL_PROVIDERS.map((p) => (
              <div key={p.id} className="email-provider">
                <div className="email-provider-icon">{p.icon}</div>
                <div className="email-provider-body">
                  <div className="email-provider-name">{p.name}</div>
                  <div className="email-provider-desc">{p.desc}</div>
                </div>
                <button
                  type="button"
                  className="avel-btn-primary"
                  onClick={() => connect(p.id)}
                  disabled={pending !== null}
                >
                  {pending === p.id ? "Connecting…" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="avel-card">
        <div className="avel-card-head">
          <div>
            <div className="avel-card-title">What connecting unlocks</div>
            <div className="avel-card-sub">The portal goes from informing you to acting for you.</div>
          </div>
        </div>
        <ul className="email-enables">
          {EMAIL_ENABLES.map((e, i) => (
            <li key={i}><span className="email-enable-check">✓</span>{e}</li>
          ))}
        </ul>
        <div className="avel-callout-soft">
          Demo: connection is simulated. In production this uses Microsoft Graph or
          Google OAuth with least-privilege send/read scopes and a signed BAA.
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Branding tab
// ──────────────────────────────────────────────────────────────
function BrandingTab() {
  return (
    <div className="avel-grid-2">
      <div className="avel-card">
        <div className="avel-card-head">
          <div>
            <div className="avel-card-title">Portal identity</div>
            <div className="avel-card-sub">
              The name and logo your team sees across every page of the portal.
            </div>
          </div>
        </div>

        <div className="set-field">
          <label className="set-label">Portal name</label>
          <input
            type="text"
            className="set-input"
            defaultValue="Eastside Hospital Credentialing Portal"
          />
        </div>

        <div className="set-field">
          <label className="set-label">Tagline (sidebar caption)</label>
          <input
            type="text"
            className="set-input"
            defaultValue="Credentialing Portal"
          />
        </div>

        <div className="set-field">
          <label className="set-label">Logo (sidebar mark)</label>
          <div className="set-asset-row">
            <div className="set-asset-preview set-asset-preview-dark">
              <span className="avel-sb-mark" aria-hidden="true" />
            </div>
            <div className="set-asset-meta">
              <div className="set-asset-name">eastside-mark.svg</div>
              <div className="set-asset-sub">1.2 KB · 132×113 · vector</div>
              <button type="button" className="avel-btn-ghost">Replace</button>
            </div>
          </div>
        </div>

        <div className="set-field">
          <label className="set-label">Wordmark</label>
          <div className="set-asset-row">
            <div className="set-asset-preview set-asset-preview-dark">
              <span className="avel-sb-wordmark" aria-hidden="true" />
            </div>
            <div className="set-asset-meta">
              <div className="set-asset-name">eastside-wordmark.svg</div>
              <div className="set-asset-sub">4.5 KB · 305×137 · vector</div>
              <button type="button" className="avel-btn-ghost">Replace</button>
            </div>
          </div>
        </div>
      </div>

      <div className="avel-card">
        <div className="avel-card-head">
          <div>
            <div className="avel-card-title">Colors</div>
            <div className="avel-card-sub">
              Used for buttons, highlights, status pills, and brand surfaces.
            </div>
          </div>
        </div>

        <div className="set-color-grid">
          <div className="set-color">
            <span className="set-color-swatch" style={{ background: "#0E2E47" }} />
            <div>
              <div className="set-color-label">Primary navy</div>
              <code>#0E2E47</code>
            </div>
          </div>
          <div className="set-color">
            <span className="set-color-swatch" style={{ background: "#21A0AA" }} />
            <div>
              <div className="set-color-label">Accent teal</div>
              <code>#21A0AA</code>
            </div>
          </div>
          <div className="set-color">
            <span className="set-color-swatch" style={{ background: "#156A72" }} />
            <div>
              <div className="set-color-label">Teal deep</div>
              <code>#156A72</code>
            </div>
          </div>
          <div className="set-color">
            <span className="set-color-swatch" style={{ background: "#FFFFFF", border: "1px solid var(--avel-line)" }} />
            <div>
              <div className="set-color-label">Surface white</div>
              <code>#FFFFFF</code>
            </div>
          </div>
        </div>

        <div className="set-field" style={{ marginTop: 18 }}>
          <label className="set-label">Domain</label>
          <input
            type="text"
            className="set-input"
            defaultValue="avelecare.cred-tek.com"
            readOnly
          />
          <div className="set-help">
            Subdomain mapped to your Eastside Hospital credentialing portal. Managed by your account team.
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Roles & Permissions tab
// ──────────────────────────────────────────────────────────────
function RolesTab() {
  return (
    <div className="avel-card">
      <div className="avel-card-head">
        <div>
          <div className="avel-card-title">Roles &amp; permissions</div>
          <div className="avel-card-sub">
            Define which Eastside Hospital users can add providers, adjust workflows, view financial reports, and more.
          </div>
        </div>
        <button type="button" className="avel-btn-primary">+ New role</button>
      </div>

      <div className="set-role-grid">
        {ROLES.map((r) => (
          <div key={r.id} className="set-role-card">
            <div className="set-role-head">
              <div className="set-role-name">{r.name}</div>
              <div className="set-role-members">
                {r.members} member{r.members === 1 ? "" : "s"}
              </div>
            </div>
            <p className="set-role-desc">{r.description}</p>
            <div className="set-role-perms">
              {r.permissions.map((p) => (
                <span key={p} className="avel-mini-chip">{p}</span>
              ))}
            </div>
            <div className="set-role-actions">
              <button type="button" className="avel-btn-ghost">Manage members</button>
              <button type="button" className="avel-btn-ghost">Edit permissions</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Notifications tab
// ──────────────────────────────────────────────────────────────
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    expiring30: true,
    expiring60: true,
    readyToBill: true,
    stalledSla: true,
    weeklyDigest: false,
    payerAlerts: true,
  });

  function toggle(k: keyof typeof prefs) {
    setPrefs((p) => ({ ...p, [k]: !p[k] }));
  }

  return (
    <div className="avel-card">
      <div className="avel-card-head">
        <div>
          <div className="avel-card-title">Notifications</div>
          <div className="avel-card-sub">
            Control which credentialing events reach you by email and in the portal.
          </div>
        </div>
      </div>

      <ul className="set-pref-list">
        <li className="set-pref">
          <div className="set-pref-body">
            <div className="set-pref-title">Expiring credentials — 30-day window</div>
            <div className="set-pref-desc">
              Email me when a provider I own has a license, DEA, or COI expiring within 30 days.
            </div>
          </div>
          <Toggle on={prefs.expiring30} onClick={() => toggle("expiring30")} />
        </li>
        <li className="set-pref">
          <div className="set-pref-body">
            <div className="set-pref-title">Expiring credentials — 60-day window</div>
            <div className="set-pref-desc">
              In-portal alerts for renewals landing in the next 60 days.
            </div>
          </div>
          <Toggle on={prefs.expiring60} onClick={() => toggle("expiring60")} />
        </li>
        <li className="set-pref">
          <div className="set-pref-body">
            <div className="set-pref-title">Provider became ready-to-bill</div>
            <div className="set-pref-desc">
              Email + portal alert when a provider becomes billable for a new space or payer.
            </div>
          </div>
          <Toggle on={prefs.readyToBill} onClick={() => toggle("readyToBill")} />
        </li>
        <li className="set-pref">
          <div className="set-pref-body">
            <div className="set-pref-title">Stalled applications (over SLA)</div>
            <div className="set-pref-desc">
              Weekly digest of applications past their workflow SLA targets.
            </div>
          </div>
          <Toggle on={prefs.stalledSla} onClick={() => toggle("stalledSla")} />
        </li>
        <li className="set-pref">
          <div className="set-pref-body">
            <div className="set-pref-title">Payer enrollment status changes</div>
            <div className="set-pref-desc">
              Get notified whenever a payer responds (approval, info request, denial).
            </div>
          </div>
          <Toggle on={prefs.payerAlerts} onClick={() => toggle("payerAlerts")} />
        </li>
        <li className="set-pref">
          <div className="set-pref-body">
            <div className="set-pref-title">Weekly executive summary</div>
            <div className="set-pref-desc">
              Monday-morning digest of pipeline, ready-to-bill, and risks.
            </div>
          </div>
          <Toggle on={prefs.weeklyDigest} onClick={() => toggle("weeklyDigest")} />
        </li>
      </ul>

      <div className="avel-callout-soft">
        Email goes to <strong>m.koehler@avelecare.com</strong>. Add additional recipients under
        <strong> Roles &amp; Permissions</strong>.
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Toggle component
// ──────────────────────────────────────────────────────────────
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={`set-toggle${on ? " is-on" : ""}`}
      onClick={onClick}
    >
      <span className="set-toggle-knob" />
    </button>
  );
}
