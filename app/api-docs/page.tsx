// /api-docs — public reference for the IAL HTTP API. Shows endpoints
// with example requests + responses, status codes, and schema notes.
// Strong demo asset for engineer-buyers ("we have an API; here it is").

import Link from "next/link";

export const metadata = {
  title: "API · CredTek",
  description: "CredTek Integration Abstraction Layer HTTP API reference.",
};

type Endpoint = {
  method: "GET" | "POST" | "DELETE";
  path: string;
  title: string;
  desc: string;
  body?: string;
  response?: string;
  statuses: { code: number; meaning: string }[];
  params?: { name: string; type: string; description: string }[];
};

const ENDPOINTS: Endpoint[] = [
  {
    method: "POST",
    path: "/api/integrations/submit",
    title: "Create an IntegrationJob",
    desc: "Creates a new job in `drafted` state. Tier 3 jobs are auto-routed to `awaiting_approval` (human-in-the-loop gate per IAL §4). Tier 1/4 jobs can opt into immediate submission with `auto_submit: true`.",
    body: `{
  "tenant_id": "mindscape",
  "integration_type": "optum_enrollment",
  "tier": "tier_3_browser",
  "provider_id": "james-mitchell",
  "payload": {
    "providerName": "James Mitchell",
    "credential": "LCSW",
    "state": "CA",
    "npi": "2109834567"
  },
  "auto_submit": false
}`,
    response: `{
  "job": {
    "id": "job_01HZX7000000041F",
    "tenant_id": "mindscape",
    "integration_type": "optum_enrollment",
    "tier": "tier_3_browser",
    "provider_id": "james-mitchell",
    "status": "awaiting_approval",
    "payload": { ... },
    "result": null,
    "eta": "2026-05-12T15:30:00.000Z",
    "submitted_at": null,
    "completed_at": null,
    "created_by": "api_demo_user",
    "cost_cents": 0,
    "metadata": { "attempts": 0 },
    "audit_log_id": "audit_01HZX700000000",
    "created_at": "2026-04-29T15:30:00.000Z",
    "updated_at": "2026-04-29T15:30:00.000Z"
  }
}`,
    statuses: [
      { code: 201, meaning: "Created" },
      { code: 400, meaning: "missing_fields / invalid_tier / invalid_json" },
    ],
  },
  {
    method: "GET",
    path: "/api/integrations/list",
    title: "List IntegrationJobs",
    desc: "Returns jobs filtered by query params. Newest first.",
    params: [
      { name: "tenant_id", type: "string", description: "Filter by customer org" },
      { name: "provider_id", type: "string", description: "Filter by provider slug" },
      { name: "status", type: "IntegrationStatus", description: "drafted | awaiting_approval | submitted | in_progress | awaiting_info | completed | failed | cancelled" },
      { name: "limit", type: "number", description: "Max rows. Default 50, capped 200." },
    ],
    response: `{
  "total": 5,
  "returned": 5,
  "limit": 50,
  "jobs": [
    { "id": "job_01HZX700000000A5", "status": "awaiting_info", ... },
    ...
  ]
}`,
    statuses: [
      { code: 200, meaning: "OK" },
      { code: 400, meaning: "invalid_status" },
    ],
  },
  {
    method: "GET",
    path: "/api/integrations/[id]",
    title: "Fetch a single IntegrationJob",
    desc: "Returns the full job by ID.",
    response: `{
  "job": { "id": "job_01HZX700000000A1", "status": "drafted", ... }
}`,
    statuses: [
      { code: 200, meaning: "OK" },
      { code: 404, meaning: "not_found" },
    ],
  },
  {
    method: "POST",
    path: "/api/integrations/[id]",
    title: "Apply a state transition",
    desc: "Drives the IAL state machine (§4). Validates the transition is legal for the current state and the actor type. Optional `patch` lets you update `result`, `eta`, `cost_cents`, or merge into `metadata` in the same call.",
    body: `{
  "to_status": "submitted",
  "actor_type": "user",
  "patch": {
    "metadata": { "external_reference": "OPT-2026-04-CR-99812" }
  }
}`,
    response: `{
  "job": { "id": "...", "status": "submitted", "submitted_at": "2026-04-29T15:31:00.000Z", ... }
}`,
    statuses: [
      { code: 200, meaning: "OK" },
      { code: 400, meaning: "missing_field / invalid_to_status / invalid_actor_type" },
      { code: 404, meaning: "job not found" },
      { code: 409, meaning: "job is in terminal state" },
      { code: 422, meaning: "transition_rejected (state machine refused)" },
    ],
  },
];

export default function ApiDocsPage() {
  return (
    <div className="docs-shell">
      <header className="docs-topbar">
        <Link href="/" className="docs-logo">
          <div className="logo-mark">C</div>
          <span>CredTek</span>
          <span className="docs-logo-suffix">/ API</span>
        </Link>
        <nav className="docs-topnav">
          <Link href="/compare">vs. Competitors</Link>
          <Link href="/dashboard">Live demo</Link>
          <a
            href="https://github.com/mikesweigart/credtek"
            target="_blank"
            rel="noopener"
          >
            GitHub →
          </a>
        </nav>
      </header>

      <div className="docs-main">
        <aside className="docs-sidebar">
          <div className="docs-sidebar-eyebrow">Reference</div>
          <ul className="docs-sidebar-list">
            <li>
              <a href="#overview">Overview</a>
            </li>
            <li>
              <a href="#auth">Authentication</a>
            </li>
            <li>
              <a href="#tiers">Integration tiers</a>
            </li>
            <li>
              <a href="#states">Lifecycle states</a>
            </li>
            <li className="docs-sidebar-section">Endpoints</li>
            {ENDPOINTS.map((e) => (
              <li key={e.path}>
                <a href={`#${slug(e)}`}>
                  <code>
                    <span className={`docs-method method-${e.method.toLowerCase()}`}>
                      {e.method}
                    </span>{" "}
                    {e.path}
                  </code>
                </a>
              </li>
            ))}
            <li className="docs-sidebar-section">Status codes</li>
            <li>
              <a href="#errors">Error shapes</a>
            </li>
          </ul>
        </aside>

        <main className="docs-content">
          <section id="overview">
            <span className="section-eyebrow">CredTek API · v0</span>
            <h1>Integration Abstraction Layer · HTTP API</h1>
            <p className="docs-lead">
              The IAL exposes one uniform interface for every external action
              CredTek triggers — whether the underlying work is an HTTP API
              call, a browser agent, or a human credentialing specialist.
              You call <code>integrations.submit()</code>, you get back an{" "}
              <code>IntegrationJob</code> with a stable ID, status, and ETA.
              You poll or subscribe. You don&apos;t care which tier the
              integration falls into.
            </p>
            <p className="docs-lead">
              Base URL:{" "}
              <code>https://www.cred-tek.com/api</code>. All requests and
              responses are JSON. Demo endpoints use an in-memory store and
              are open (no auth). Production wires per-tenant JWT auth via
              Supabase + RLS.
            </p>
          </section>

          <section id="auth">
            <h2>Authentication</h2>
            <p>
              Production: <code>Authorization: Bearer &lt;jwt&gt;</code>{" "}
              header. JWTs are issued by Supabase Auth. Every request is
              tenant-scoped via the JWT claims; cross-tenant access returns
              404 (not 403, to avoid resource-existence leaks).
            </p>
            <p>
              Demo: no auth required. The mock store seeds 5 sample jobs
              under <code>tenant_id=&quot;mindscape&quot;</code>.
            </p>
          </section>

          <section id="tiers">
            <h2>Integration tiers</h2>
            <p>
              Every external system CredTek interacts with falls into one of
              four tiers. From the API&apos;s perspective they look
              identical — same shape in, same shape out. The tier governs
              the lifecycle behavior under the hood.
            </p>
            <ul className="docs-tier-list">
              <li>
                <strong>tier_1_api</strong> — direct REST/GraphQL APIs
                (NPPES, OIG, SAM.gov, Checkr, Twilio, Resend). Synchronous
                or webhook-based.
              </li>
              <li>
                <strong>tier_2_partner</strong> — gated APIs we access via
                an NCQA-certified CVO partner (CAQH ProView Credentialing
                API, NPDB queries).
              </li>
              <li>
                <strong>tier_3_browser</strong> — web portals with no API.
                Playwright + LLM-assisted form fill. <em>Always</em> requires
                a human approval gate before submission.
              </li>
              <li>
                <strong>tier_4_human</strong> — work that can&apos;t be
                automated in v1. Creates an Operations Queue ticket with an
                SLA-based ETA.
              </li>
            </ul>
          </section>

          <section id="states">
            <h2>Lifecycle states</h2>
            <p>
              An IntegrationJob moves through a deterministic state machine
              (IAL §4). Transitions are the only place <code>status</code>{" "}
              changes; production enforces this with a database trigger.
            </p>
            <div className="docs-states-grid">
              {[
                {
                  s: "drafted",
                  d: "Created, not yet submitted. Editable by the coordinator.",
                },
                {
                  s: "awaiting_approval",
                  d: "Tier 3 only — agent has prepared submission, waiting on coordinator click.",
                },
                {
                  s: "submitted",
                  d: "Sent to external system or queued for ops specialist.",
                },
                {
                  s: "in_progress",
                  d: "External system or specialist is actively working it.",
                },
                {
                  s: "awaiting_info",
                  d: "Blocked, waiting on provider or coordinator to supply additional info.",
                },
                {
                  s: "completed",
                  d: "Successfully completed with structured result. Terminal.",
                },
                {
                  s: "failed",
                  d: "Permanent failure, manual review required. Terminal.",
                },
                {
                  s: "cancelled",
                  d: "Cancelled by coordinator or admin. Terminal.",
                },
              ].map((row) => (
                <div className="docs-state-row" key={row.s}>
                  <code className={`docs-state-pill state-${row.s}`}>{row.s}</code>
                  <span>{row.d}</span>
                </div>
              ))}
            </div>
          </section>

          {ENDPOINTS.map((e) => (
            <EndpointBlock key={`${e.method} ${e.path}`} e={e} />
          ))}

          <section id="errors">
            <h2>Error response shape</h2>
            <p>All errors return a structured JSON body:</p>
            <pre className="docs-pre">{`{
  "error": "transition_rejected",
  "reason": "no rule allows submitted → drafted",
  "message": "(optional human-readable hint)"
}`}</pre>
            <p>
              The <code>error</code> field is a stable machine-readable code;
              the <code>reason</code> / <code>message</code> are for humans
              and may change copy without breaking compatibility.
            </p>
          </section>

          <section className="docs-cta">
            <h2>Ready to wire CredTek into your stack?</h2>
            <p>
              The same API your engineers see here is what runs in
              production. Tenant isolation via Supabase RLS, audit logging
              via the IAL §9 hash chain, and human-in-the-loop gates on
              every Tier 3 submission.
            </p>
            <Link
              href="https://cal.com/mikesweigart"
              target="_blank"
              rel="noopener"
              className="btn-primary"
              style={{ display: "inline-flex", marginTop: 12 }}
            >
              Book a 20-min demo →
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

function slug(e: Endpoint): string {
  return `${e.method.toLowerCase()}-${e.path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;
}

function EndpointBlock({ e }: { e: Endpoint }) {
  return (
    <section id={slug(e)} className="docs-endpoint">
      <div className="docs-endpoint-head">
        <span className={`docs-method method-${e.method.toLowerCase()}`}>
          {e.method}
        </span>
        <code className="docs-endpoint-path">{e.path}</code>
      </div>
      <h3>{e.title}</h3>
      <p>{e.desc}</p>

      {e.params ? (
        <>
          <div className="docs-section-label">Query parameters</div>
          <table className="docs-params">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {e.params.map((p) => (
                <tr key={p.name}>
                  <td>
                    <code>{p.name}</code>
                  </td>
                  <td>
                    <code className="docs-type">{p.type}</code>
                  </td>
                  <td>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      {e.body ? (
        <>
          <div className="docs-section-label">Request body</div>
          <pre className="docs-pre">{e.body}</pre>
        </>
      ) : null}

      {e.response ? (
        <>
          <div className="docs-section-label">Response</div>
          <pre className="docs-pre">{e.response}</pre>
        </>
      ) : null}

      <div className="docs-section-label">Status codes</div>
      <table className="docs-statuses">
        <tbody>
          {e.statuses.map((s) => (
            <tr key={s.code}>
              <td>
                <code
                  className={`docs-status-code ${s.code < 400 ? "ok" : "err"}`}
                >
                  {s.code}
                </code>
              </td>
              <td>{s.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
