"use client";

// Customer onboarding wizard — what a new BH group sees on Day 1 after
// signing the contract. Five steps: workspace, operating states, payor
// connections, Modio import, team. Lives outside the (app) shell because
// the (app) sidebar assumes you're already onboarded.
//
// Mock-only: no real persistence, no auth gate. The demo value is showing
// partners the white-glove kickoff experience the landing page promises.

import Link from "next/link";
import { useState } from "react";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_LABELS: Record<Exclude<Step, 6>, string> = {
  1: "Workspace",
  2: "States",
  3: "Payors",
  4: "Import",
  5: "Team",
};

// 50 US states in display order, grouped by census region for visual scan.
const ALL_STATES = [
  // West
  "WA",
  "OR",
  "CA",
  "ID",
  "NV",
  "UT",
  "AZ",
  "MT",
  "WY",
  "CO",
  "NM",
  "AK",
  "HI",
  // Midwest
  "ND",
  "SD",
  "NE",
  "KS",
  "MN",
  "IA",
  "MO",
  "WI",
  "IL",
  "MI",
  "IN",
  "OH",
  // South
  "TX",
  "OK",
  "AR",
  "LA",
  "MS",
  "AL",
  "TN",
  "KY",
  "WV",
  "VA",
  "NC",
  "SC",
  "GA",
  "FL",
  "MD",
  "DE",
  "DC",
  // Northeast
  "PA",
  "NJ",
  "NY",
  "CT",
  "RI",
  "MA",
  "VT",
  "NH",
  "ME",
];

const PAYORS = [
  { id: "optum", name: "Optum / UBH", desc: "Behavioral health network", essential: true },
  { id: "carelon", name: "Carelon Behavioral Health", desc: "Formerly Beacon", essential: true },
  { id: "magellan", name: "Magellan Healthcare", desc: "Multi-state BH", essential: true },
  { id: "evernorth", name: "Evernorth Behavioral Health", desc: "Cigna's BH arm", essential: true },
  { id: "anthem", name: "Anthem Behavioral Health", desc: "Major commercial", essential: true },
  { id: "aetna", name: "Aetna Behavioral Health", desc: "Major commercial", essential: false },
  { id: "humana", name: "Humana Behavioral Health", desc: "Medicare Advantage strong", essential: false },
  { id: "bcbs", name: "Blue Cross Blue Shield", desc: "Multi-state, varies by region", essential: false },
  { id: "tx_medicaid", name: "Texas Medicaid MCOs", desc: "Superior, Molina, Aetna BH", essential: false },
  { id: "ca_medicaid", name: "California Medi-Cal MCOs", desc: "L.A. Care, Anthem Medi-Cal, etc.", essential: false },
  { id: "ny_medicaid", name: "New York Medicaid MCOs", desc: "Healthfirst, MetroPlus, etc.", essential: false },
  { id: "fl_medicaid", name: "Florida Medicaid MCOs", desc: "Sunshine, Simply, Aetna Better Health", essential: false },
];

const SAMPLE_CSV_PROVIDERS = [
  { name: "Dr. Sarah Reyes", credential: "PsyD", state: "TX", status: "matched" },
  { name: "James Mitchell", credential: "LCSW", state: "CA", status: "matched" },
  { name: "Aisha Patel", credential: "LPC-A", state: "TX", status: "new" },
  { name: "Dr. Daniel Kim", credential: "MD", state: "CA", status: "matched" },
  { name: "Rachel Bennett", credential: "LMFT", state: "CO", status: "new" },
  { name: "Marcus Singh", credential: "LCSW", state: "GA", status: "matched" },
  { name: "Maya Chen", credential: "LMSW", state: "CA", status: "new" },
  { name: "Tyler Brooks", credential: "LPC-A", state: "NY", status: "anomaly" },
  { name: "Jordan Williams", credential: "LMFT-A", state: "FL", status: "new" },
  { name: "Priya Shah", credential: "LPC-A", state: "TX", status: "new" },
  { name: "Eduardo Hernandez", credential: "PsyD", state: "FL", status: "matched" },
  { name: "Nova Tanaka", credential: "LCSW", state: "CA", status: "new" },
];

export function WelcomeWizard() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 state
  const [workspaceName, setWorkspaceName] = useState("Mindscape Behavioral Health");
  const [timezone, setTimezone] = useState("America/Chicago");
  const [contactName, setContactName] = useState("Marisol Diaz");
  const [contactRole, setContactRole] = useState("Director of Credentialing");

  // Step 2: states
  const [activeStates, setActiveStates] = useState<Set<string>>(
    new Set(["TX", "CA", "FL", "NY", "GA", "CO"]),
  );
  const toggleState = (s: string) => {
    setActiveStates((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  // Step 3: payors
  const [activePayors, setActivePayors] = useState<Set<string>>(
    new Set(PAYORS.filter((p) => p.essential).map((p) => p.id)),
  );
  const togglePayor = (id: string) => {
    setActivePayors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Step 4: import
  const [csvUploaded, setCsvUploaded] = useState(false);

  // Step 5: team
  const [team, setTeam] = useState<{ email: string; role: string }[]>([
    { email: "marisol@mindscape.health", role: "Owner" },
    { email: "jordan@mindscape.health", role: "Coordinator" },
    { email: "avery@mindscape.health", role: "Coordinator" },
  ]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Coordinator");
  const addTeam = () => {
    if (newEmail.trim().length < 5) return;
    setTeam([...team, { email: newEmail.trim(), role: newRole }]);
    setNewEmail("");
  };
  const removeTeam = (i: number) => {
    setTeam(team.filter((_, ix) => ix !== i));
  };

  const next = () => setStep((s) => (s < 5 ? ((s + 1) as Step) : 6));
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : 1));

  const canAdvance =
    step === 1
      ? workspaceName.trim().length >= 3
      : step === 2
        ? activeStates.size > 0
        : step === 3
          ? activePayors.size > 0
          : step === 4
            ? true // can skip import
            : step === 5
              ? team.length > 0
              : true;

  // -----------------------------------------------------------------
  // Step 6 — Done
  // -----------------------------------------------------------------
  if (step === 6) {
    return (
      <div className="welcome-shell">
        <Header />
        <div className="welcome-card welcome-done">
          <div className="welcome-done-mark">✓</div>
          <h1 className="welcome-h1">
            <strong>{workspaceName}</strong> is ready to credential.
          </h1>
          <p className="welcome-p">
            White-glove onboarding complete. Your dedicated CSM is on weekly
            check-ins for the first 90 days. Here&apos;s what we just set up:
          </p>
          <div className="welcome-done-list">
            <DoneRow label="Workspace" value={workspaceName} />
            <DoneRow label="Time zone" value={timezone} />
            <DoneRow label="Operating states" value={`${activeStates.size} states · ${[...activeStates].slice(0, 6).join(", ")}${activeStates.size > 6 ? "…" : ""}`} />
            <DoneRow label="Payor portals connected" value={`${activePayors.size} payors · CAQH attestation auto-renew on`} />
            <DoneRow label="Providers imported" value={csvUploaded ? `${SAMPLE_CSV_PROVIDERS.length} from Modio · 9 matched · 3 new` : "Skipped — invite providers individually"} />
            <DoneRow label="Team invited" value={`${team.length} member${team.length === 1 ? "" : "s"} · invite emails sent`} />
          </div>
          <div className="welcome-actions" style={{ justifyContent: "center", marginTop: 28 }}>
            <Link href="/dashboard" className="welcome-btn-primary">
              Open the dashboard →
            </Link>
          </div>
          <p className="welcome-fineprint">
            ✦ The first 5 payor enrollments and the supervision tracker are
            already running. Your CSM will reach out within 24 hours with
            the first batch of approval items.
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // Steps 1–5
  // -----------------------------------------------------------------
  return (
    <div className="welcome-shell">
      <Header />

      <div className="welcome-stepper">
        {([1, 2, 3, 4, 5] as const).map((n) => (
          <div
            key={n}
            className={`welcome-step ${
              n < step ? "done" : n === step ? "current" : ""
            }`}
          >
            <div className="welcome-step-num">{n < step ? "✓" : n}</div>
            <div className="welcome-step-label">{STEP_LABELS[n]}</div>
          </div>
        ))}
      </div>

      <div className="welcome-card">
        {step === 1 ? (
          <Step1
            workspaceName={workspaceName}
            setWorkspaceName={setWorkspaceName}
            timezone={timezone}
            setTimezone={setTimezone}
            contactName={contactName}
            setContactName={setContactName}
            contactRole={contactRole}
            setContactRole={setContactRole}
          />
        ) : null}
        {step === 2 ? (
          <Step2 activeStates={activeStates} toggleState={toggleState} />
        ) : null}
        {step === 3 ? (
          <Step3 activePayors={activePayors} togglePayor={togglePayor} activeStates={activeStates} />
        ) : null}
        {step === 4 ? (
          <Step4
            uploaded={csvUploaded}
            onUpload={() => setCsvUploaded(true)}
            onSkip={() => setCsvUploaded(false)}
          />
        ) : null}
        {step === 5 ? (
          <Step5
            team={team}
            newEmail={newEmail}
            setNewEmail={setNewEmail}
            newRole={newRole}
            setNewRole={setNewRole}
            addTeam={addTeam}
            removeTeam={removeTeam}
          />
        ) : null}

        <div className="welcome-actions">
          {step > 1 ? (
            <button className="welcome-btn-secondary" onClick={back}>
              ← Back
            </button>
          ) : (
            <Link href="/" className="welcome-btn-secondary">
              ← Cancel
            </Link>
          )}
          <button
            className="welcome-btn-primary"
            onClick={next}
            disabled={!canAdvance}
          >
            {step === 5 ? "Finish setup →" : "Continue →"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------

function Header() {
  return (
    <header className="welcome-header">
      <div className="welcome-logo">
        <div className="welcome-logo-mark">C</div>
        <div className="welcome-logo-text">CredTek</div>
      </div>
      <div className="welcome-greeting">
        <strong>White-glove onboarding</strong> · ~12 minutes · Your CSM is
        copied on every step and joins for a live walkthrough at the end.
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="welcome-footer">
      🔒 HIPAA-compliant · BAA on file · all credentials stored with
      tenant-scoped encryption keys
    </footer>
  );
}

function DoneRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="welcome-done-row">
      <span className="welcome-done-dot success">●</span>
      <div>
        <div className="welcome-done-label">{label}</div>
        <div className="welcome-done-value">{value}</div>
      </div>
    </div>
  );
}

function Step1({
  workspaceName,
  setWorkspaceName,
  timezone,
  setTimezone,
  contactName,
  setContactName,
  contactRole,
  setContactRole,
}: {
  workspaceName: string;
  setWorkspaceName: (v: string) => void;
  timezone: string;
  setTimezone: (v: string) => void;
  contactName: string;
  setContactName: (v: string) => void;
  contactRole: string;
  setContactRole: (v: string) => void;
}) {
  return (
    <>
      <div className="welcome-eyebrow">Step 1 of 5 · ~2 min</div>
      <h2 className="welcome-h2">Tell us about your group.</h2>
      <p className="welcome-p">
        This shows on emails to providers, on your audit binder, and in
        every CredTek workspace your team uses.
      </p>
      <div className="welcome-fields">
        <div className="welcome-field welcome-field-full">
          <label>Group / workspace name</label>
          <input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Mindscape Behavioral Health"
          />
        </div>
        <div className="welcome-field">
          <label>Time zone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option>America/Chicago</option>
            <option>America/Los_Angeles</option>
            <option>America/Denver</option>
            <option>America/New_York</option>
            <option>America/Phoenix</option>
          </select>
        </div>
        <div className="welcome-field">
          <label>Brand color (for provider invites)</label>
          <input type="text" defaultValue="#0B1F2E (CredTek default)" readOnly />
        </div>
        <div className="welcome-field">
          <label>Primary contact</label>
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="welcome-field">
          <label>Title / role</label>
          <input
            value={contactRole}
            onChange={(e) => setContactRole(e.target.value)}
            placeholder="Director of Credentialing"
          />
        </div>
      </div>
    </>
  );
}

function Step2({
  activeStates,
  toggleState,
}: {
  activeStates: Set<string>;
  toggleState: (s: string) => void;
}) {
  return (
    <>
      <div className="welcome-eyebrow">Step 2 of 5 · ~1 min</div>
      <h2 className="welcome-h2">Which states do you practice in?</h2>
      <p className="welcome-p">
        Drives the License Matrix and tells our state-board PSV agents
        which jurisdictions to keep warm. Toggle anytime in Settings.
      </p>
      <div className="welcome-state-summary">
        <strong>{activeStates.size}</strong> selected ·{" "}
        <span className="welcome-state-summary-meta">
          PSYPACT eligible: psychologists practice in 39 states with one
          PSYPACT registration. Counseling Compact + SW Compact handled
          automatically.
        </span>
      </div>
      <div className="welcome-state-grid">
        {ALL_STATES.map((s) => (
          <button
            key={s}
            className={
              activeStates.has(s)
                ? "welcome-state-chip on"
                : "welcome-state-chip"
            }
            onClick={() => toggleState(s)}
            type="button"
          >
            {s}
            {activeStates.has(s) ? <span className="welcome-state-check">✓</span> : null}
          </button>
        ))}
      </div>
    </>
  );
}

function Step3({
  activePayors,
  togglePayor,
  activeStates,
}: {
  activePayors: Set<string>;
  togglePayor: (id: string) => void;
  activeStates: Set<string>;
}) {
  const essentials = PAYORS.filter((p) => p.essential);
  const optional = PAYORS.filter(
    (p) =>
      !p.essential && (!p.id.includes("medicaid") || matchesMedicaidState(p.id, activeStates)),
  );

  return (
    <>
      <div className="welcome-eyebrow">Step 3 of 5 · ~3 min</div>
      <h2 className="welcome-h2">Connect your payor portals.</h2>
      <p className="welcome-p">
        We auto-fill these payors on every new enrollment. You provide the
        portal credentials once; we keep them encrypted with a
        tenant-scoped key and you approve every submission before it leaves
        CredTek.
      </p>

      <div className="welcome-payor-section">
        <div className="welcome-payor-section-head">
          <strong>Commercial · BH-essential</strong>
          <span>Recommended for every BH group</span>
        </div>
        {essentials.map((p) => (
          <PayorRow
            key={p.id}
            payor={p}
            on={activePayors.has(p.id)}
            toggle={() => togglePayor(p.id)}
          />
        ))}
      </div>

      <div className="welcome-payor-section">
        <div className="welcome-payor-section-head">
          <strong>Optional · State Medicaid &amp; commercial</strong>
          <span>Showing payors relevant to your operating states</span>
        </div>
        {optional.map((p) => (
          <PayorRow
            key={p.id}
            payor={p}
            on={activePayors.has(p.id)}
            toggle={() => togglePayor(p.id)}
          />
        ))}
      </div>

      <div className="welcome-fineprint">
        ✦ Don&apos;t have credentials handy? Connect later from Settings →
        Integrations. We&apos;ll skip enrollment automation for that payor
        until you do.
      </div>
    </>
  );
}

function matchesMedicaidState(payorId: string, activeStates: Set<string>) {
  if (payorId === "tx_medicaid") return activeStates.has("TX");
  if (payorId === "ca_medicaid") return activeStates.has("CA");
  if (payorId === "ny_medicaid") return activeStates.has("NY");
  if (payorId === "fl_medicaid") return activeStates.has("FL");
  return true;
}

function PayorRow({
  payor,
  on,
  toggle,
}: {
  payor: { id: string; name: string; desc: string };
  on: boolean;
  toggle: () => void;
}) {
  return (
    <button
      className={on ? "welcome-payor-row on" : "welcome-payor-row"}
      onClick={toggle}
      type="button"
    >
      <div className={on ? "welcome-payor-toggle on" : "welcome-payor-toggle"}>
        <span></span>
      </div>
      <div className="welcome-payor-info">
        <div className="welcome-payor-name">{payor.name}</div>
        <div className="welcome-payor-desc">{payor.desc}</div>
      </div>
      <div className="welcome-payor-status">
        {on ? "Connected" : "Skip"}
      </div>
    </button>
  );
}

function Step4({
  uploaded,
  onUpload,
  onSkip,
}: {
  uploaded: boolean;
  onUpload: () => void;
  onSkip: () => void;
}) {
  return (
    <>
      <div className="welcome-eyebrow">Step 4 of 5 · ~3 min</div>
      <h2 className="welcome-h2">Bring your existing roster.</h2>
      <p className="welcome-p">
        Drop a Modio export, CAQH roster, or any messy spreadsheet — our
        intake agent matches existing CredTek records, flags anomalies for
        your review, and creates new provider profiles for the rest.
      </p>

      {!uploaded ? (
        <>
          <button className="welcome-upload" onClick={onUpload} type="button">
            <div className="welcome-upload-icon">📁</div>
            <div className="welcome-upload-text">
              <strong>Drop your roster CSV here</strong>
              <span>
                Modio, Symplr, CAQH bulk export, or your team&apos;s
                spreadsheet — we handle all of them
              </span>
            </div>
          </button>
          <div className="welcome-upload-skip">
            <button onClick={onSkip} type="button" className="welcome-link">
              Or skip — invite providers individually with /invite
            </button>
          </div>
        </>
      ) : (
        <div className="welcome-import">
          <div className="welcome-import-head">
            <span className="welcome-import-tag">✓ Parsed in 0.8s</span>
            <span className="welcome-import-meta">
              {SAMPLE_CSV_PROVIDERS.length} providers · 9 matched ·{" "}
              {SAMPLE_CSV_PROVIDERS.filter((p) => p.status === "new").length}{" "}
              new ·{" "}
              {SAMPLE_CSV_PROVIDERS.filter((p) => p.status === "anomaly").length}{" "}
              anomaly
            </span>
          </div>
          <div className="welcome-import-table">
            <div className="welcome-import-thead">
              <span>Name</span>
              <span>Credential</span>
              <span>State</span>
              <span>Status</span>
            </div>
            {SAMPLE_CSV_PROVIDERS.map((p, i) => (
              <div key={i} className="welcome-import-row">
                <span>{p.name}</span>
                <span className="welcome-import-mono">{p.credential}</span>
                <span className="welcome-import-mono">{p.state}</span>
                <span className={`welcome-import-status status-${p.status}`}>
                  {p.status === "matched"
                    ? "✓ Matched"
                    : p.status === "new"
                      ? "+ Will create"
                      : "⚐ Anomaly · review"}
                </span>
              </div>
            ))}
          </div>
          <div className="welcome-fineprint">
            ✦ Anomalies (1 here): a license number formatted differently
            than CredTek expects. Your CSM resolves these in the kickoff
            call so no provider gets onboarded with wrong data.
          </div>
        </div>
      )}
    </>
  );
}

function Step5({
  team,
  newEmail,
  setNewEmail,
  newRole,
  setNewRole,
  addTeam,
  removeTeam,
}: {
  team: { email: string; role: string }[];
  newEmail: string;
  setNewEmail: (v: string) => void;
  newRole: string;
  setNewRole: (v: string) => void;
  addTeam: () => void;
  removeTeam: (i: number) => void;
}) {
  return (
    <>
      <div className="welcome-eyebrow">Step 5 of 5 · ~2 min</div>
      <h2 className="welcome-h2">Invite your team.</h2>
      <p className="welcome-p">
        Add the rest of your credentialing team. Each gets an invite email
        with a link to set their password.
      </p>

      <div className="welcome-team-list">
        {team.map((m, i) => (
          <div key={i} className="welcome-team-row">
            <div className="welcome-team-av">
              {m.email.split("@")[0].slice(0, 2).toUpperCase()}
            </div>
            <div className="welcome-team-info">
              <div className="welcome-team-email">{m.email}</div>
              <div className="welcome-team-role">{m.role}</div>
            </div>
            {i === 0 ? (
              <span className="welcome-team-tag">You</span>
            ) : (
              <button
                className="welcome-team-remove"
                onClick={() => removeTeam(i)}
                type="button"
                aria-label="Remove"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="welcome-team-add">
        <input
          className="welcome-team-input"
          type="email"
          placeholder="teammate@example.com"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTeam();
          }}
        />
        <select
          className="welcome-team-select"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        >
          <option>Coordinator</option>
          <option>Admin</option>
          <option>Read-only</option>
          <option>Supervisor</option>
        </select>
        <button
          className="welcome-team-add-btn"
          onClick={addTeam}
          type="button"
        >
          + Add
        </button>
      </div>

      <div className="welcome-fineprint">
        ✦ You can change roles, add/remove members, or set up SSO anytime
        in Settings → Team. We send invites the moment you click Finish.
      </div>
    </>
  );
}
