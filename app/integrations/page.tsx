// /integrations — public marketing page listing EHR/PMS integrations
// plus the Tier-1 federal and clearinghouse partners. Tier rollout is
// honest: native integrations are Enterprise-tier (day-2 roadmap);
// Tier-1 federal sources are always-on for every customer.

import Link from "next/link";
import { NavIcon } from "../_components/NavIcon";

export const metadata = {
  title: "Integrations · CredTek",
  description:
    "CredTek integrates with major EHRs, practice management systems, federal sources, and payor networks across the US medical credentialing stack.",
};

// Direction of data flow relative to CredTek:
//   in   — we read/verify FROM this source (federal, state boards)
//   out  — we submit/send TO this destination (payor portals, email)
//   sync — data moves both ways (EHRs, CAQH, SSO, two-way messaging)
type FlowDirection = "in" | "out" | "sync";

type Integration = {
  name: string;
  category: string;
  status: "live" | "beta" | "roadmap";
  /** One-line plain-English description. */
  note: string;
  /** Override the category default when this tool's flow differs. */
  direction?: FlowDirection;
};

// Most tools' flow follows their category; per-tool overrides handle the
// exceptions (e.g. CAQH and two-way messaging sync both directions).
const CATEGORY_DIRECTION: Record<string, FlowDirection> = {
  ehr: "sync",
  federal: "in",
  state: "in",
  payor: "out",
  bh: "out",
  medicaid: "out",
  aux: "out",
  sso: "sync",
};

const DIR_META: Record<FlowDirection, { icon: string; label: string }> = {
  in: { icon: "flowIn", label: "Inbound" },
  out: { icon: "flowOut", label: "Outbound" },
  sync: { icon: "flowSync", label: "Two-way" },
};

function directionOf(i: Integration): FlowDirection {
  return i.direction ?? CATEGORY_DIRECTION[i.category] ?? "in";
}

const INTEGRATIONS: Integration[] = [
  // ---- EHRs ----
  { name: "Epic", category: "ehr", status: "roadmap", note: "Two-way provider data sync via Epic's app orchard. Bulk roster export + per-provider write-back." },
  { name: "athenahealth", category: "ehr", status: "roadmap", note: "Provider directory sync, payor enrollment status write-back, NPI updates." },
  { name: "Oracle Cerner", category: "ehr", status: "roadmap", note: "Provider data + credentials sync for enterprise health systems." },
  { name: "eClinicalWorks", category: "ehr", status: "roadmap", note: "Provider roster sync, expirations dashboard write-back." },
  { name: "NextGen Healthcare", category: "ehr", status: "roadmap", note: "Provider roster and credentials sync for ambulatory groups." },
  { name: "AdvancedMD", category: "ehr", status: "roadmap", note: "Provider data sync; enrollment status surfaced in scheduling." },
  { name: "Kareo · Tebra", category: "ehr", status: "roadmap", note: "Roster sync for SMB practices." },
  { name: "DrChrono", category: "ehr", status: "roadmap", note: "Provider data + enrollment status sync." },
  { name: "Practice Fusion", category: "ehr", status: "roadmap", note: "Roster sync, expirations dashboard surfaced inside Practice Fusion." },

  // ---- Federal / regulatory sources ----
  { name: "NPPES (NPI Registry)", category: "federal", status: "live", note: "Direct API. Provider NPI lookups and validations on every onboarding." },
  { name: "OIG LEIE", category: "federal", status: "live", note: "Monthly bulk screen + on-demand checks for federal program exclusions." },
  { name: "SAM.gov", category: "federal", status: "live", note: "Federal sanctions screening — bulk and on-demand." },
  { name: "DEA", category: "federal", status: "live", note: "DEA registration verification and expiration tracking." },
  { name: "NPDB", category: "federal", status: "live", note: "Queries via our NCQA-certified CVO partner; results flow into CredTek." },
  { name: "CAQH ProView", category: "federal", status: "live", direction: "sync", note: "Provider data sync, attestation automation, re-attestation every 120 days with provider SMS approval." },

  // ---- State boards ----
  { name: "50-state medical boards", category: "state", status: "live", note: "Primary-source verification for MD, DO, NP, PA, RN, pharmacy, psychology, social work, counseling, MFT, BCBA, dental — every state, every specialty." },
  { name: "Interstate compacts", category: "state", status: "live", note: "IMLC · NLC · PSYPACT · Counseling Compact · SW Compact eligibility tracking and registration." },

  // ---- Commercial payors ----
  { name: "Aetna", category: "payor", status: "live", note: "Auto-enrollment agent with human approval gate. Full provider data + documents." },
  { name: "Anthem", category: "payor", status: "live", note: "Auto-enrollment + revalidation. State-by-state agent variants." },
  { name: "Cigna · Evernorth", category: "payor", status: "live", note: "Commercial + behavioral health network enrollment." },
  { name: "UnitedHealthcare", category: "payor", status: "live", note: "Auto-enrollment + Optum integration for BH lines." },
  { name: "Optum · United Behavioral Health", category: "payor", status: "live", note: "Provider Express portal automation." },
  { name: "Humana", category: "payor", status: "live", note: "Medicare Advantage strong; full commercial coverage." },
  { name: "BCBS (multi-state)", category: "payor", status: "live", note: "State BCBS plans — agent variants per state." },
  { name: "Tricare (East · West)", category: "payor", status: "live", note: "Federal payor enrollment for both regions." },

  // ---- BH-specialty networks ----
  { name: "Carelon Behavioral Health", category: "bh", status: "live", note: "BH-network enrollment (formerly Beacon)." },
  { name: "Magellan Healthcare", category: "bh", status: "live", note: "Multi-state BH network." },
  { name: "Anthem Behavioral Health", category: "bh", status: "live", note: "BH-network credentialing." },

  // ---- State Medicaid MCOs ----
  { name: "Texas Medicaid MCOs", category: "medicaid", status: "live", note: "Superior, Molina, Aetna Better Health, Amerigroup." },
  { name: "California Medi-Cal MCOs", category: "medicaid", status: "live", note: "L.A. Care, Anthem Medi-Cal, Health Net, Molina." },
  { name: "New York Medicaid MCOs", category: "medicaid", status: "live", note: "Healthfirst, MetroPlus, Amida Care, Fidelis Care." },
  { name: "Florida Medicaid MCOs", category: "medicaid", status: "live", note: "Sunshine, Simply, Aetna Better Health, Molina." },

  // ---- Background check + auxiliary ----
  { name: "Checkr (background checks)", category: "aux", status: "live", direction: "sync", note: "API-driven background checks with webhook results." },
  { name: "NotaryCam", category: "aux", status: "live", note: "Scheduled-notary workflow for documents requiring notarization." },
  { name: "Twilio (SMS)", category: "aux", status: "live", direction: "sync", note: "Provider SMS for CAQH attestation approvals, supervision cosignatures." },
  { name: "Resend (email)", category: "aux", status: "live", note: "Transactional emails — intake invites, expirations, audit trails." },

  // ---- Single sign-on (Enterprise) ----
  { name: "SAML / SSO", category: "sso", status: "roadmap", note: "Okta · Azure AD · Google Workspace — Enterprise tier." },
  { name: "SCIM provisioning", category: "sso", status: "roadmap", note: "Automatic user provisioning from your IdP — Enterprise tier." },
];

const CATEGORIES: { id: string; label: string; intro: string }[] = [
  {
    id: "ehr",
    label: "EHRs & Practice Management",
    intro:
      "Two-way provider data sync between CredTek and the system your providers see patients in. Roadmap (day 2) — Enterprise tier.",
  },
  {
    id: "federal",
    label: "Federal & Regulatory Sources",
    intro:
      "Always-on for every customer. Direct APIs to the federal sources that gate provider credentialing in the US.",
  },
  {
    id: "state",
    label: "State Boards & Compacts",
    intro:
      "Primary-source verification across 50 states for every medical specialty + interstate compact tracking.",
  },
  {
    id: "payor",
    label: "Commercial Payors",
    intro:
      "Auto-enrollment agents with mandatory human approval gates. Coverage across the major commercial payors.",
  },
  {
    id: "bh",
    label: "Behavioral Health Networks",
    intro:
      "BH-specific networks where credentialing has its own depth requirements (specialty payor matrices, supervision documentation).",
  },
  {
    id: "medicaid",
    label: "State Medicaid MCOs",
    intro:
      "Per-state Medicaid Managed Care Organization enrollment. Adding states as customer demand drives.",
  },
  {
    id: "aux",
    label: "Background Checks & Communications",
    intro:
      "Tier-1 API partners that round out the credentialing stack.",
  },
  {
    id: "sso",
    label: "Identity & SSO",
    intro:
      "Enterprise SSO and user-provisioning. Roadmap (day 2) — Enterprise tier.",
  },
];

export default function IntegrationsPage() {
  const flow = {
    in: INTEGRATIONS.filter((i) => directionOf(i) === "in").length,
    out: INTEGRATIONS.filter((i) => directionOf(i) === "out").length,
    sync: INTEGRATIONS.filter((i) => directionOf(i) === "sync").length,
  };
  return (
    <div className="integ-page">
      <header className="compare-topnav">
        <Link href="/" className="compare-logo">
          <div className="logo-mark">C</div>
          <span>CredTek</span>
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/api-docs" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}>API</Link>
          <Link href="/compare" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}>Compare</Link>
          <Link href="/help" style={{ color: "var(--ink-soft)", textDecoration: "none", fontSize: 13 }}>Help</Link>
          <Link
            href="https://calendly.com/mike-fusion-advisory/30min"
            target="_blank"
            rel="noopener"
            className="topnav-cta"
          >
            Book a demo →
          </Link>
        </div>
      </header>

      <section className="integ-hero">
        <div className="container container-narrow">
          <span className="section-eyebrow">Integrations</span>
          <h1>
            What CredTek talks to <em>on your behalf.</em>
          </h1>
          <p className="integ-lead">
            Credentialing only works if the data flows. CredTek integrates
            with the federal sources, state boards, payor portals,
            background-check vendors, and (on the Enterprise tier) the EHR
            and practice-management systems your providers actually use.
            <strong style={{ color: "var(--ink)" }}>
              {" "}
              {INTEGRATIONS.filter((i) => i.status === "live").length} integrations
              live today
            </strong>
            .
          </p>
          <div className="integ-legend">
            <span>
              <span className="integ-dot live"></span> Live · day-one access for every customer
            </span>
            <span>
              <span className="integ-dot beta"></span> Beta · available to design partners
            </span>
            <span>
              <span className="integ-dot roadmap"></span> Day-2 roadmap · Enterprise tier first
            </span>
          </div>

          <div className="integ-flow-legend">
            <span className="integ-flow-title">How the data moves</span>
            <span className="integ-dir integ-dir-in">
              <NavIcon name="flowIn" size={12} /> Inbound · we verify from the source · {flow.in}
            </span>
            <span className="integ-dir integ-dir-out">
              <NavIcon name="flowOut" size={12} /> Outbound · we submit on your behalf · {flow.out}
            </span>
            <span className="integ-dir integ-dir-sync">
              <NavIcon name="flowSync" size={12} /> Two-way · syncs both directions · {flow.sync}
            </span>
          </div>
        </div>
      </section>

      <section className="integ-list">
        <div className="container container-narrow">
          {CATEGORIES.map((cat) => {
            const items = INTEGRATIONS.filter((i) => i.category === cat.id);
            if (items.length === 0) return null;
            return (
              <div key={cat.id} className="integ-cat">
                <h2 className="integ-cat-label">
                  {cat.label}
                  <span className="integ-cat-count">
                    {items.filter((i) => i.status === "live").length} live ·{" "}
                    {items.filter((i) => i.status === "roadmap").length} roadmap
                  </span>
                </h2>
                <p className="integ-cat-intro">{cat.intro}</p>
                <div className="integ-grid">
                  {items.map((i) => {
                    const dir = directionOf(i);
                    const dm = DIR_META[dir];
                    return (
                      <div className="integ-card" key={i.name}>
                        <div className="integ-card-head">
                          <span className={`integ-dot ${i.status}`}></span>
                          <span className="integ-card-name">{i.name}</span>
                          <span className={`integ-status integ-status-${i.status}`}>
                            {i.status === "live"
                              ? "Live"
                              : i.status === "beta"
                                ? "Beta"
                                : "Roadmap"}
                          </span>
                        </div>
                        <p className="integ-card-note">{i.note}</p>
                        <div className="integ-card-flow">
                          <span className={`integ-dir integ-dir-${dir}`}>
                            <NavIcon name={dm.icon} size={12} /> {dm.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="integ-cta">
        <div className="container container-narrow center">
          <h2>
            Need an integration we haven&apos;t listed?
          </h2>
          <p>
            Custom integrations are part of Enterprise. Tell us what you
            need and we&apos;ll quote it with your tier — most integrations
            ship in 4–8 weeks.
          </p>
          <Link
            href="https://calendly.com/mike-fusion-advisory/30min"
            target="_blank"
            rel="noopener"
            className="btn-primary"
            style={{ display: "inline-flex", marginTop: 16 }}
          >
            Talk to founders →
          </Link>
        </div>
      </section>

      <footer
        style={{
          background: "var(--ink-deep)",
          color: "rgba(255,255,255,0.6)",
          padding: "32px 0",
          marginTop: 32,
        }}
      >
        <div className="footer-inner">
          <Link href="/" className="logo">
            <div
              className="logo-mark"
              style={{ background: "white", color: "var(--ink)" }}
            >
              C
            </div>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontStyle: "normal",
                fontSize: 22,
              }}
            >
              CredTek
            </span>
          </Link>
          <div className="footer-meta">
            US medical credentialing platform · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
