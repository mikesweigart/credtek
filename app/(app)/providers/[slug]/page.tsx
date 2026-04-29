// Provider detail. Pre-licensed providers (have `preLicensed` set) get the
// supervision tracker — the feature the landing page sells as the "thing
// nobody else does." Tabs (Overview / Licenses / Payors / Supervision /
// Documents) are URL-driven so partners can deep-link a tab during a demo.

import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoButton } from "../../_components/DemoButton";
import {
  findProvider,
  PAYOR_ENROLLMENTS,
  type SupervisionPlan,
} from "../../../_lib/mockProviders";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
};

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "licenses", label: "Licenses" },
  { id: "payors", label: "Payors" },
  { id: "supervision", label: "Supervision" },
  { id: "documents", label: "Documents" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const p = findProvider(slug);
  if (!p) return { title: "Provider not found" };
  return { title: `${p.name}, ${p.credential}` };
}

export default async function ProviderPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { tab: tabParam } = await searchParams;
  const p = findProvider(slug);
  if (!p) notFound();

  const isPreLicensed = !!p.preLicensed;
  // Pre-licensed providers default to the supervision tab — that's the
  // thing the coordinator most often opens this page for.
  const defaultTab: TabId = isPreLicensed ? "supervision" : "overview";
  const requested = (tabParam ?? defaultTab) as TabId;
  const activeTab = TABS.some((t) => t.id === requested)
    ? requested
    : defaultTab;

  const enrollments = PAYOR_ENROLLMENTS.filter(
    (e) => e.providerSlug === slug,
  );

  return (
    <div
      style={{ margin: "-32px -32px 0", display: "flex", flexDirection: "column" }}
    >
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
          <DemoButton
            className="prov-btn"
            demoMessage={`Demo — would open a thread with ${p.name} via SMS or email. They reply, you reply, audit-logged for HIPAA.`}
          >
            Message
          </DemoButton>
          <DemoButton
            className="prov-btn primary"
            demoMessage="Demo — would re-run primary-source verification across state boards, NPDB, OIG, SAM, and DEA. Typical run: 14 seconds."
          >
            Run PSV ↻
          </DemoButton>
        </div>
      </header>

      <nav className="prov-tabs">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/providers/${slug}?tab=${t.id}`}
            className={`prov-tab ${activeTab === t.id ? "active" : ""}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="prov-body">
        {activeTab === "overview" ? (
          <OverviewTab provider={p} />
        ) : null}
        {activeTab === "licenses" ? (
          <LicensesTab states={p.licenseStates} />
        ) : null}
        {activeTab === "payors" ? (
          <PayorsTab providerName={p.name} enrollments={enrollments} />
        ) : null}
        {activeTab === "supervision" ? (
          isPreLicensed && p.preLicensed ? (
            <SupervisionTab plan={p.preLicensed} />
          ) : (
            <NoSupervisionTab providerName={p.name} />
          )
        ) : null}
        {activeTab === "documents" ? <DocumentsTab /> : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function OverviewTab({
  provider,
}: {
  provider: ReturnType<typeof findProvider> & object;
}) {
  if (!provider) return null;
  return (
    <>
      <div className="prov-card span2">
        <h4>Current status</h4>
        <div className="prov-sup-row">
          <span className="l">Roster</span>
          <span className="v">Active · added Apr 03</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Active state licenses</span>
          <span className="v">
            {provider.licenseStates.length} (
            {provider.licenseStates.join(", ")})
          </span>
        </div>
        <div className="prov-sup-row">
          <span className="l">In-network payors</span>
          <span className="v success">2 active · 1 in progress</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">CAQH</span>
          <span className="v success">Attested · auto-renews May 24</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">PSV last refreshed</span>
          <span className="v">Apr 27 · 99.4% confidence</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Next action</span>
          <span className="v accent">
            Approve Optum draft submission (in your queue)
          </span>
        </div>
      </div>

      <div className="prov-card">
        <h4>Recent activity</h4>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 27 · 09:14 AM</div>
          <div className="prov-activity-text">
            PSV refreshed — all primary sources verified
          </div>
        </div>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 22 · 02:48 PM</div>
          <div className="prov-activity-text">
            Optum enrollment confirmed
          </div>
        </div>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 14 · 10:02 AM</div>
          <div className="prov-activity-text">
            CAQH attestation submitted
          </div>
        </div>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 03 · 04:30 PM</div>
          <div className="prov-activity-text">
            {provider.name} added to roster
          </div>
        </div>
      </div>

      <div className="prov-card">
        <h4>Compliance snapshot</h4>
        <div className="prov-sup-row">
          <span className="l">NCQA file</span>
          <span className="v success">✓ Complete</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">OIG / SAM</span>
          <span className="v success">✓ Clear</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">NPDB query</span>
          <span className="v success">✓ Clear · last queried Apr 27</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Audit-ready binder</span>
          <span className="v success">✓ Generated</span>
        </div>
      </div>
    </>
  );
}

function LicensesTab({ states }: { states: string[] }) {
  return (
    <>
      <div className="prov-card span2">
        <h4>State licenses</h4>
        <div className="prov-card-sub">
          {states.length} active · all primary-source verified
        </div>
        {states.map((s) => (
          <div key={s} className="prov-sup-row">
            <span className="l">{s} · License</span>
            <span className="v success">✓ Active · expires Q3 2027</span>
          </div>
        ))}
        {states.includes("TX") ? (
          <div
            className="prov-sup-row"
            style={{ marginTop: 8, paddingTop: 12 }}
          >
            <span className="l">Compact eligibility</span>
            <span className="v accent">
              Eligible to practice via PSYPACT in 39 states
            </span>
          </div>
        ) : null}
      </div>

      <div className="prov-card">
        <h4>Verification log</h4>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 27 · 09:14 AM</div>
          <div className="prov-activity-text">
            All licenses re-verified · 99.4% confidence
          </div>
        </div>
        <div className="prov-activity-row">
          <div className="prov-activity-time">APR 14 · 11:02 AM</div>
          <div className="prov-activity-text">
            Quarterly verification cycle completed
          </div>
        </div>
        <div className="prov-activity-row">
          <div className="prov-activity-time">JAN 14 · 11:00 AM</div>
          <div className="prov-activity-text">
            Initial PSV at onboarding
          </div>
        </div>
      </div>

      <div className="prov-card">
        <h4>Renewals</h4>
        <div className="prov-sup-row">
          <span className="l">Earliest expiration</span>
          <span className="v">Aug 12, 2027</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Renewal draft status</span>
          <span className="v">Will draft 180 days out</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">CE hours required</span>
          <span className="v">Tracked separately per state</span>
        </div>
      </div>
    </>
  );
}

function PayorsTab({
  providerName,
  enrollments,
}: {
  providerName: string;
  enrollments: typeof PAYOR_ENROLLMENTS;
}) {
  if (enrollments.length === 0) {
    return (
      <div className="prov-card span2">
        <h4>Payor enrollment</h4>
        <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>
          No enrollments yet for {providerName}. Use the{" "}
          <Link href="/payors" style={{ color: "var(--gold-deep)" }}>
            Payors pipeline
          </Link>{" "}
          to start one.
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="prov-card span2">
        <h4>Active &amp; in-progress enrollments</h4>
        <div className="prov-card-sub">
          {enrollments.length} record{enrollments.length === 1 ? "" : "s"}
        </div>
        {enrollments.map((e, i) => {
          const stageLabel =
            e.stage === "drafted"
              ? "Drafted · awaiting approval"
              : e.stage === "submitted"
                ? `Submitted · ${e.dayLabel}`
                : e.stage === "info_needed"
                  ? `Info needed · ${e.dayLabel}`
                  : `Active · ${e.dayLabel}`;
          const valueClass =
            e.stage === "in_network"
              ? "v success"
              : e.stage === "drafted"
                ? "v accent"
                : "v";
          return (
            <div key={i} className="prov-sup-row">
              <span className="l">
                {e.payor} · {e.context}
              </span>
              <span className={valueClass}>{stageLabel}</span>
            </div>
          );
        })}
      </div>

      <div className="prov-card">
        <h4>CAQH</h4>
        <div className="prov-sup-row">
          <span className="l">Status</span>
          <span className="v success">Attested · current</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Next attestation</span>
          <span className="v">May 24, 2026 (auto)</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Last submitted</span>
          <span className="v">Apr 14, 2026 · approved by provider via SMS</span>
        </div>
      </div>

      <div className="prov-card">
        <h4>Delegated credentialing</h4>
        <div className="prov-sup-row">
          <span className="l">Optum delegation</span>
          <span className="v accent">Eligible · awaiting NCQA file</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Carelon delegation</span>
          <span className="v">Not yet pursued</span>
        </div>
        <div className="prov-sup-row">
          <span className="l">Magellan delegation</span>
          <span className="v">Not yet pursued</span>
        </div>
      </div>
    </>
  );
}

function SupervisionTab({ plan }: { plan: SupervisionPlan }) {
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
            {fmt.format(plan.completedHours)} /{" "}
            {fmt.format(plan.requiredHours)} HRS
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
            {fmt.format(plan.completedGroup)} /{" "}
            {fmt.format(plan.requiredGroup)} hrs
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
          <div className="prov-activity-text">
            Quarterly evaluation completed
          </div>
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

function NoSupervisionTab({ providerName }: { providerName: string }) {
  return (
    <div className="prov-card span2">
      <h4>Supervision</h4>
      <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}>
        {providerName} is fully licensed — no supervision plan tracked here.
        See the{" "}
        <Link href="/supervision" style={{ color: "var(--gold-deep)" }}>
          Supervision page
        </Link>{" "}
        for the team's pre-licensed clinicians.
      </p>
    </div>
  );
}

function DocumentsTab() {
  const docs = [
    { name: "TX LPC license · front", uploaded: "Apr 03 · 4:31 PM", verified: true },
    { name: "DEA registration", uploaded: "Apr 03 · 4:32 PM", verified: true },
    { name: "Malpractice COI", uploaded: "Apr 03 · 4:32 PM", verified: true },
    { name: "Supervision agreement", uploaded: "Apr 03 · 4:33 PM", verified: true },
    { name: "Quarterly supervisor eval", uploaded: "Apr 19 · 4:08 PM", verified: true },
    { name: "CV", uploaded: "Apr 03 · 4:34 PM", verified: false },
  ];
  return (
    <>
      <div className="prov-card span2">
        <h4>Documents on file</h4>
        <div className="prov-card-sub">
          {docs.length} files · encrypted at rest · audit-logged on every access
        </div>
        {docs.map((d) => (
          <div key={d.name} className="prov-sup-row">
            <span className="l">{d.name}</span>
            <span className={d.verified ? "v success" : "v"}>
              {d.verified ? "✓ Verified" : "On file"} · {d.uploaded}
            </span>
          </div>
        ))}
      </div>

      <div className="prov-card span2">
        <h4>Generate audit binder</h4>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55, marginBottom: 12 }}>
          One-click NCQA-compliant evidence packet covering primary source
          verifications, attestations, sanctions monitoring, and supervision
          (where applicable).
        </p>
        <DemoButton
          className="prov-btn primary"
          demoMessage="Demo — would generate a PDF audit binder (typically 12-30 pages depending on tenure) and stage it for download or direct send to a payor delegated-credentialing reviewer."
        >
          Generate NCQA audit binder
        </DemoButton>
      </div>
    </>
  );
}
