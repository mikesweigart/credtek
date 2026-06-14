// /onepager — print-optimized two-page leave-behind PDF.
// Open the page, hit Cmd+P (Ctrl+P on Windows), choose "Save as PDF" —
// browser produces a clean 2-page PDF with all the sales fundamentals,
// brand-consistent, attachable to any email.

import Link from "next/link";
import { PrintButton } from "./PrintButton";

export const metadata = {
  title: "CredTek · One-pager",
  description:
    "Print or download the CredTek one-pager — a two-page leave-behind for partners, prospects, and internal champions.",
};

export default function OnepagerPage() {
  return (
    <div className="op-page">
      {/* Screen-only header — hidden in print */}
      <header className="op-screen-header">
        <Link href="/" className="op-screen-logo">
          ← Back to site
        </Link>
        <div className="op-screen-actions">
          <span className="op-screen-meta">
            Hit <kbd>Ctrl/Cmd + P</kbd> → Save as PDF
          </span>
          <PrintButton />
        </div>
      </header>

      {/* ────────── PAGE 1 ────────── */}
      <article className="op-sheet">
        <header className="op-head">
          <div className="op-logo">
            <div className="op-logo-mark">C</div>
            <div className="op-logo-text">
              CredTek
              <span className="op-tagline">
                Medical credentialing, faster than anyone in healthcare.
              </span>
            </div>
          </div>
          <div className="op-meta">
            <div>cred-tek.com</div>
            <div>
              Book a demo —<br />
              calendly.com/mike-fusion-advisory/30min
            </div>
          </div>
        </header>

        <section className="op-hero">
          <h1>
            Old-school care.
            <br />
            New-school technology.
          </h1>
          <p>
            CredTek is the AI-agent-native credentialing platform for US
            medical practices, MSOs, and health systems. Built by
            operators with <strong>40+ years of enterprise medical
            credentialing experience</strong> — paired with modern AI
            agents that actually do the typing.
          </p>
        </section>

        <section className="op-diff-grid">
          <div className="op-diff">
            <div className="op-diff-icon">📚</div>
            <div className="op-diff-body">
              <h3>40+ years of experience built in</h3>
              <p>
                Two co-founders, each with 20+ years inside enterprise
                medical credentialing programs. The product is designed
                around their muscle memory.
              </p>
            </div>
          </div>
          <div className="op-diff">
            <div className="op-diff-icon">⚙</div>
            <div className="op-diff-body">
              <h3>Real agents that fill payor portals</h3>
              <p>
                Aetna, Anthem, Cigna, UnitedHealthcare, Humana, BCBS,
                Optum, Tricare + specialty networks. Human approval gate
                on every submission. No hallucinated data ever reaches a
                payor.
              </p>
            </div>
          </div>
          <div className="op-diff">
            <div className="op-diff-icon">⚡</div>
            <div className="op-diff-body">
              <h3>Faster than anyone in healthcare</h3>
              <p>
                Industry average is 90–120 days from hire to first
                in-network payor. CredTek customers typically beat that
                by 40–60% — without us needing perfect inputs to do it.
              </p>
            </div>
          </div>
          <div className="op-diff">
            <div className="op-diff-icon">❤</div>
            <div className="op-diff-body">
              <h3>Old-school care &amp; concern</h3>
              <p>
                Named CSM, weekly check-ins for 90 days, direct Slack
                access to the founders. When inputs are incomplete — and
                they always are — we work the problem with you, not
                around you.
              </p>
            </div>
          </div>
        </section>

        <section className="op-pricing">
          <h2>Three tiers · two posted publicly</h2>
          <table className="op-pricing-table">
            <thead>
              <tr>
                <th>Starter</th>
                <th>Growth · most common</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1–99 providers</td>
                <td>100–499 providers</td>
                <td>500+ providers</td>
              </tr>
              <tr>
                <td>
                  From <strong>$35</strong>/provider/mo
                  <br />
                  + from $199/action
                </td>
                <td>
                  From <strong>$35</strong>/provider/mo
                  <br />
                  + from $199/action · volume discounts at scale
                </td>
                <td>
                  <strong>Custom</strong>
                  <br />
                  EHR integrations, named CSM, custom SLAs
                </td>
              </tr>
              <tr>
                <td>
                  Solo practices, small groups, single-state
                </td>
                <td>
                  Multi-state groups, MSOs, PE rollups
                </td>
                <td>
                  Health systems, IPAs, payors
                </td>
              </tr>
            </tbody>
          </table>
          <p className="op-pricing-foot">
            Month-to-month with a 30-day out clause for the first 90 days
            · live in 14 days · HIPAA + BAA on day one
          </p>
        </section>

        <footer className="op-foot">
          <strong>Book a 20-min walkthrough:</strong>{" "}
          calendly.com/mike-fusion-advisory/30min &nbsp;·&nbsp;{" "}
          Explore the live demo: cred-tek.com/dashboard
        </footer>
      </article>

      {/* ────────── PAGE 2 ────────── */}
      <article className="op-sheet op-sheet-2">
        <header className="op-head op-head-2">
          <div className="op-logo">
            <div className="op-logo-mark">C</div>
            <div className="op-logo-text">
              CredTek
              <span className="op-tagline">vs. the alternatives</span>
            </div>
          </div>
          <div className="op-meta">page 2 of 2</div>
        </header>

        <section className="op-section">
          <h2>How CredTek compares</h2>
          <table className="op-compare">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="op-compare-credtek">CredTek</th>
                <th>Modio</th>
                <th>Symplr</th>
                <th>Medallion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Real payor-portal auto-fill (with human approval gate)</td>
                <td className="op-compare-credtek">✓</td>
                <td>✕</td>
                <td>✕</td>
                <td>◐</td>
              </tr>
              <tr>
                <td>Specialty workflow depth (supervision, locum, M&amp;A)</td>
                <td className="op-compare-credtek">✓</td>
                <td>✕</td>
                <td>✕</td>
                <td>✕</td>
              </tr>
              <tr>
                <td>Tamper-evident audit log (SHA-256 chain)</td>
                <td className="op-compare-credtek">✓</td>
                <td>✕</td>
                <td>✓</td>
                <td>◐</td>
              </tr>
              <tr>
                <td>One-click NCQA delegated-credentialing binder</td>
                <td className="op-compare-credtek">✓</td>
                <td>✕</td>
                <td>✓</td>
                <td>◐</td>
              </tr>
              <tr>
                <td>Mid-market focus (50–500 providers)</td>
                <td className="op-compare-credtek">✓</td>
                <td>✓</td>
                <td>✕</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Public, transparent pricing</td>
                <td className="op-compare-credtek">✓</td>
                <td>✕</td>
                <td>✕</td>
                <td>✕</td>
              </tr>
              <tr>
                <td>Time to live</td>
                <td className="op-compare-credtek">14 days</td>
                <td>14–21d</td>
                <td>9+ months</td>
                <td>21–45d</td>
              </tr>
              <tr>
                <td>40+ years of operator experience built into the product</td>
                <td className="op-compare-credtek">✓</td>
                <td>✕</td>
                <td>✕</td>
                <td>✕</td>
              </tr>
            </tbody>
          </table>
          <p className="op-legend">
            ✓ = supported · ◐ = partial · ✕ = not supported
          </p>
        </section>

        <section className="op-section">
          <h2>What CredTek handles for you</h2>
          <div className="op-uses">
            <div className="op-use">
              <strong>Provider intake</strong>
              <p>
                SMS / email link to the provider; agent extracts every
                field from license, DEA, COI, and CV with confidence
                scoring. Coordinator approves anomalies.
              </p>
            </div>
            <div className="op-use">
              <strong>Primary-source verification</strong>
              <p>
                50 state boards + NPPES + OIG + SAM + DEA + NPDB.
                Continuous re-screening for sanctions.
              </p>
            </div>
            <div className="op-use">
              <strong>Payor enrollment</strong>
              <p>
                Auto-fill for Aetna, Anthem, Cigna, UHC, Humana, BCBS,
                Optum, Tricare + state Medicaid MCOs + specialty
                networks. Real-time status tracking and auto-escalation.
              </p>
            </div>
            <div className="op-use">
              <strong>CAQH attestation</strong>
              <p>
                Auto-attest every 120 days with provider SMS approval.
                No more missed attestation windows.
              </p>
            </div>
            <div className="op-use">
              <strong>Specialty workflows</strong>
              <p>
                Pre-licensed BH supervision, locum-tenens credentialing
                windows, hospital privileging, NPI changes during M&amp;A
                — the workflows other tools force you to spreadsheet.
              </p>
            </div>
            <div className="op-use">
              <strong>NCQA audit binder</strong>
              <p>
                One-click audit-ready evidence packet for delegated
                credentialing arrangements with major payors.
              </p>
            </div>
          </div>
        </section>

        <footer className="op-foot op-foot-final">
          <div>
            <strong>CredTek</strong> · cred-tek.com · US medical credentialing platform
          </div>
          <div>
            Talk to founders — calendly.com/mike-fusion-advisory/30min
          </div>
        </footer>
      </article>
    </div>
  );
}

