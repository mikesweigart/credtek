// Provider detail. Pre-licensed providers (have `preLicensed` set) get the
// supervision tracker — the feature the landing page sells as the "thing
// nobody else does." Everyone else gets the standard licenses + payors view.
//
// Route is `/providers/[slug]`. Next.js 16 makes `params` async, so we
// `await` it before reading the slug.

import { notFound } from "next/navigation";
import { findProvider, type SupervisionPlan } from "../../../_lib/mockProviders";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const p = findProvider(slug);
  if (!p) return { title: "Provider not found" };
  return { title: `${p.name}, ${p.credential}` };
}

export default async function ProviderPage({ params }: PageProps) {
  const { slug } = await params;
  const p = findProvider(slug);
  if (!p) notFound();

  const isPreLicensed = !!p.preLicensed;
  const activeTab = isPreLicensed ? "supervision" : "overview";

  return (
    <div style={{ margin: "-32px -32px 0", display: "flex", flexDirection: "column" }}>
      {/* Provider header (dark band) */}
      <header className="prov-head">
        <div className="prov-av">{p.initials}</div>
        <div>
          <div className="prov-name">
            {p.name}, {p.credential}
          </div>
          <div className="prov-meta">
            {isPreLicensed ? "PRE-LICENSED · " : ""}
            {p.licenseStates.join(" · ")} · NPI {p.npi}
          </div>
        </div>
        <div className="prov-actions">
          <button className="prov-btn">Message</button>
          <button className="prov-btn primary">Run PSV ↻</button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="prov-tabs">
        <span className={`prov-tab ${activeTab === "overview" ? "active" : ""}`}>
          Overview
        </span>
        <span className="prov-tab">Licenses</span>
        <span className="prov-tab">Payors</span>
        <span className={`prov-tab ${activeTab === "supervision" ? "active" : ""}`}>
          Supervision
        </span>
        <span className="prov-tab">Documents</span>
      </nav>

      {/* Body */}
      <div className="prov-body">
        {isPreLicensed && p.preLicensed ? (
          <SupervisionView plan={p.preLicensed} />
        ) : (
          <RegularView providerName={p.name} licenseStates={p.licenseStates} />
        )}
      </div>
    </div>
  );
}

function SupervisionView({ plan }: { plan: SupervisionPlan }) {
  const pct = Math.round((plan.completedHours / plan.requiredHours) * 100);
  const fmt = new Intl.NumberFormat("en-US");
  return (
    <>
      <div className="prov-card span2">
        <h4>
          Supervision toward {plan.targetCredential} · {plan.state}
        </h4>
        <div className="prov-card-sub">
          Tracking against {plan.state} state board requirements (
          {fmt.format(plan.requiredHours)} hours,{" "}
          {fmt.format(plan.requiredDirectClient)} direct client contact)
        </div>
        <div className="prov-sup-bar">
          <div className="prov-sup-fill" style={{ width: `${pct}%` }}></div>
        </div>
        <div className="prov-sup-meta">
          <span>
            {fmt.format(plan.completedHours)} / {fmt.format(plan.requiredHours)} HRS
          </span>
          <span>{pct}% COMPLETE</span>
        </div>

        <div className="prov-sup-row">
          <span className="l">Supervisor</span>
          <span className="v">{plan.supervisor}</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">This week</span>
          <span className="v">{plan.weeklyHours} hrs · cosigned ✓</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Direct client contact</span>
          <span className="v">
            {fmt.format(plan.completedDirectClient)} /{" "}
            {fmt.format(plan.requiredDirectClient)} hrs
          </span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Group hours</span>
          <span className="v">
            {fmt.format(plan.completedGroup)} / {fmt.format(plan.requiredGroup)} hrs
          </span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Projected independent licensure</span>
          <span className="v accent">{plan.projectedLicensure}</span>
        </div>
      </div>

      <div className="prov-card">
        <h4>Recent activity</h4>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 26 · 11:42 AM</div>
          <div className="prov-activity-text">
            24 hrs logged · {plan.supervisor} cosigned
          </div>
        </div>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 19 · 04:08 PM</div>
          <div className="prov-activity-text">Quarterly evaluation completed</div>
        </div>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 12 · 02:30 PM</div>
          <div className="prov-activity-text">22 hrs logged · cosigned ✓</div>
        </div>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 05 · 03:15 PM</div>
          <div className="prov-activity-text">25 hrs logged · cosigned ✓</div>
        </div>
      </div>

      <div className="prov-card">
        <h4>Compliance check</h4>
        <div className="prov-sup-row">
          <span className="l">{plan.state} board rules</span>
          <span className="v success">✓ On track</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Cosignature current</span>
          <span className="v success">✓ Verified</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Supervisor active</span>
          <span className="v success">✓ Licensed</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Audit ready</span>
          <span className="v success">✓ Yes</span>
        </div>
      </div>
    </>
  );
}

function RegularView({
  providerName,
  licenseStates,
}: {
  providerName: string;
  licenseStates: string[];
}) {
  return (
    <>
      <div className="prov-card span2">
        <h4>Active licenses</h4>
        <div className="prov-card-sub">
          {licenseStates.length} state{licenseStates.length === 1 ? "" : "s"} · all
          current
        </div>
        {licenseStates.map((state) => (
          <div key={state} className="prov-sup-row">
            <span className="l">{state}</span>
            <span className="v success">✓ Active · expires Q3 2027</span>
          </div>
        ))}
      </div>

      <div className="prov-card">
        <h4>Payor enrollment</h4>
        <div className="prov-sup-row">
          <span className="l">Optum / UBH</span>
          <span className="v success">✓ In-network · 38 days</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Carelon</span>
          <span className="v">Submitted · day 12</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Magellan</span>
          <span className="v accent">Drafted · awaiting approval</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Anthem BH</span>
          <span className="v success">✓ In-network · 31 days</span>
        </div>
      </div>

      <div className="prov-card">
        <h4>Recent activity</h4>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 27 · 09:14 AM</div>
          <div className="prov-activity-text">
            PSV refreshed · all licenses verified
          </div>
        </div>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 22 · 02:48 PM</div>
          <div className="prov-activity-text">Optum enrollment confirmed</div>
        </div>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 14 · 10:02 AM</div>
          <div className="prov-activity-text">CAQH attestation submitted</div>
        </div>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 03 · 04:30 PM</div>
          <div className="prov-activity-text">
            {providerName} added to roster
          </div>
        </div>
      </div>
    </>
  );
}
