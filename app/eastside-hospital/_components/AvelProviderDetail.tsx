"use client";

// Provider detail — 5-tab drill-down (Summary, Credentialing, Payer
// Enrollment, Documents, Activity). Data is derived deterministically
// from the seeded provider + its documents so every tab stays coherent
// with the dashboard (e.g. Alex Johnson's pending MN Medicaid shows up
// as the blocker on both the dashboard alert and his enrollment tab).

import Link from "next/link";
import { useState } from "react";
import {
  SPACES,
  STAGE_LABEL,
  type Provider,
} from "../_data/seed";
import {
  documentsForProvider,
  docStatusClass,
  type DocRow,
} from "../_data/documents";

type Tab = "summary" | "credentialing" | "enrollment" | "documents" | "activity";

const TABS: { id: Tab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "credentialing", label: "Credentialing" },
  { id: "enrollment", label: "Payer Enrollment" },
  { id: "documents", label: "Documents" },
  { id: "activity", label: "Activity" },
];

type EnrollStatus = "Active" | "Submitted" | "Pending" | "Queued" | "Not started";
type Enrollment = { payer: string; state: string; status: EnrollStatus };

const COMMERCIAL = ["Aetna", "UnitedHealthcare", "Cigna", "Humana"];
const BH_PAYERS = ["Optum BH", "Carelon", "Magellan"];

function enrollmentStatusClass(s: EnrollStatus): string {
  switch (s) {
    case "Active": return "enr-active";
    case "Submitted": return "enr-submitted";
    case "Pending": return "enr-pending";
    case "Queued": return "enr-queued";
    case "Not started": return "enr-none";
  }
}

// Deterministic enrollment synthesis from the provider's stage, flags,
// service lines, and states.
function synthEnrollments(p: Provider): Enrollment[] {
  const isBH = p.serviceLines.some((s) => /Behavioral|Crisis/.test(s));
  const payers = isBH ? [...BH_PAYERS, "Aetna", "Cigna"] : [...COMMERCIAL];
  const state = p.statesLicensed[0] ?? "—";
  const out: Enrollment[] = [];

  payers.forEach((payer, i) => {
    let status: EnrollStatus;
    if (p.readyToBill) status = "Active";
    else if (p.stage === "enrollment") status = i < 2 ? "Active" : i === 2 ? "Submitted" : "Pending";
    else if (p.stage === "privileges" || p.stage === "compliance") status = i < 1 ? "Submitted" : "Queued";
    else status = "Not started";
    out.push({ payer, state, status });
  });

  // Medicaid row — tied to any flag mentioning Medicaid pending.
  const medicaidPending = p.flags.some((f) => /medicaid/i.test(f));
  out.push({
    payer: `${state} Medicaid`,
    state,
    status: p.readyToBill ? "Active" : medicaidPending ? "Pending" : p.stage === "ready" ? "Active" : "Queued",
  });

  return out;
}

// Credentialing checklist — from documents + always-on monitoring items.
type CheckItem = { label: string; status: string; cls: string; detail?: string };
function synthChecklist(p: Provider, docs: DocRow[]): CheckItem[] {
  const items: CheckItem[] = [];

  items.push({ label: "Identity & NPI (NPPES)", status: "Verified", cls: "doc-status-ok", detail: "Confirmed against NPPES" });

  // Licenses per state
  p.statesLicensed.forEach((st) => {
    const lic = docs.find((d) => d.type === "State License" && d.name.includes(st));
    items.push({
      label: `${st} license`,
      status: lic?.status ?? (p.stage === "intake" ? "Pending" : "Verified"),
      cls: lic ? docStatusClass(lic.status) : p.stage === "intake" ? "doc-status-pending" : "doc-status-ok",
    });
  });

  const board = docs.find((d) => d.type === "Board Certification");
  if (board) items.push({ label: "Board certification", status: board.status, cls: docStatusClass(board.status) });

  const dea = docs.find((d) => d.type === "DEA Registration");
  if (dea) items.push({ label: "DEA registration", status: dea.status, cls: docStatusClass(dea.status) });

  const coi = docs.find((d) => d.type === "Malpractice (COI)");
  if (coi) items.push({ label: "Malpractice (COI)", status: coi.status, cls: docStatusClass(coi.status) });

  const bg = docs.find((d) => d.type === "Background Check");
  items.push({
    label: "Background check",
    status: bg?.status ?? (p.stage === "ready" ? "Current" : "Pending"),
    cls: bg ? docStatusClass(bg.status) : p.stage === "ready" ? "doc-status-ok" : "doc-status-pending",
  });

  items.push({ label: "OIG / SAM exclusions", status: "Clear · monitored", cls: "doc-status-ok", detail: "Re-swept monthly" });
  items.push({ label: "NPDB query", status: "Clear", cls: "doc-status-ok" });

  return items;
}

function synthActivity(p: Provider): { date: string; text: string }[] {
  const base: { date: string; text: string }[] = [
    { date: "Intake", text: `Intake packet received · ${p.name} onboarded to Eastside Hospital` },
  ];
  if (["psv", "privileges", "compliance", "enrollment", "ready"].includes(p.stage))
    base.push({ date: "PSV", text: `Primary-source verification run across ${p.statesLicensed.length} state board(s)` });
  if (["privileges", "compliance", "enrollment", "ready"].includes(p.stage))
    base.push({ date: "Privileges", text: "Facility privileging packet submitted" });
  if (["enrollment", "ready"].includes(p.stage))
    base.push({ date: "Enrollment", text: "Payer enrollment applications filed" });
  if (p.stage === "ready")
    base.push({ date: "Go-live", text: "Marked ready to bill across assigned spaces" });
  p.flags.forEach((f) => base.push({ date: "Alert", text: f }));
  return base.reverse();
}

export function AvelProviderDetail({ provider }: { provider: Provider }) {
  const [tab, setTab] = useState<Tab>("summary");
  const docs = documentsForProvider(provider.slug);
  const enrollments = synthEnrollments(provider);
  const checklist = synthChecklist(provider, docs);
  const activity = synthActivity(provider);
  const spaces = SPACES.filter((s) => provider.spaceIds.includes(s.id));
  const activeEnroll = enrollments.filter((e) => e.status === "Active").length;

  return (
    <div className="avel-content">
      <div className="avel-breadcrumb">
        <Link href="/eastside-hospital/providers">Providers</Link>
        <span>›</span>
        <span>{provider.name}</span>
      </div>

      {/* Header */}
      <div className="avel-pd-head">
        <div className="avel-pd-av">{provider.initials}</div>
        <div className="avel-pd-id">
          <div className="avel-pd-name">{provider.name}, {provider.credentials}</div>
          <div className="avel-pd-meta">
            {provider.specialty} · {provider.statesLicensed.join(" · ")} · NPI on file
          </div>
          <div className="avel-pd-badges">
            <span className={`avel-stage-pill stage-${provider.stage}`}>{STAGE_LABEL[provider.stage]}</span>
            <span className={`avel-readiness ${provider.readyToWork ? "avel-readiness-yes" : "avel-readiness-no"}`}>
              {provider.readyToWork ? "Ready to work" : "Not ready to work"}
            </span>
            <span className={`avel-readiness ${provider.readyToBill ? "avel-readiness-yes" : "avel-readiness-no"}`}>
              {provider.readyToBill ? "Ready to bill" : "Not ready to bill"}
            </span>
          </div>
        </div>
        <div className="avel-pd-actions">
          <button type="button" className="avel-btn-ghost">Message</button>
          <button type="button" className="avel-btn-primary">Run PSV ↻</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="avel-pd-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`avel-pd-tab${tab === t.id ? " is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id === "documents" ? <span className="avel-pd-tab-count">{docs.length}</span> : null}
          </button>
        ))}
      </div>

      {/* ---------- SUMMARY ---------- */}
      {tab === "summary" && (
        <div className="avel-grid-2">
          <div className="avel-card">
            <div className="avel-card-head"><div className="avel-card-title">Overall readiness</div></div>
            <div className="avel-pd-readiness">
              <div className={`avel-pd-readiness-big ${provider.readyToBill ? "ok" : "warn"}`}>
                {provider.readyToBill ? "Billable" : provider.readyToWork ? "Working, not billable" : "In onboarding"}
              </div>
              <p className="avel-pd-readiness-sub">
                {activeEnroll} payer{activeEnroll === 1 ? "" : "s"} active ·{" "}
                {provider.readyToWork ? "credentialed & privileged" : `currently in ${STAGE_LABEL[provider.stage]}`}
              </p>
            </div>
            <div className="avel-pd-sub-label">Active spaces</div>
            <ul className="avel-pd-spaces">
              {spaces.map((s) => (
                <li key={s.id}>
                  <Link href={`/eastside-hospital/spaces/${s.slug}`}>{s.name}</Link>
                  <span>{s.region}</span>
                </li>
              ))}
              {spaces.length === 0 && <li className="avel-table-cell-soft">No spaces assigned yet</li>}
            </ul>
          </div>

          <div className="avel-card">
            <div className="avel-card-head"><div className="avel-card-title">Key risks</div></div>
            {provider.flags.length > 0 ? (
              <ul className="avel-pd-risks">
                {provider.flags.map((f, i) => (
                  <li key={i}><span className="avel-pd-risk-dot" />{f}</li>
                ))}
              </ul>
            ) : (
              <div className="avel-empty-inline">No active risks. This provider is clean.</div>
            )}
            <div className="avel-callout-soft">
              {provider.readyToBill
                ? "Fully billable — no blockers. Recommended: maintain expirables monitoring."
                : "Recommended next step: clear the items in Credentialing and Payer Enrollment to reach ready-to-bill."}
            </div>
          </div>
        </div>
      )}

      {/* ---------- CREDENTIALING ---------- */}
      {tab === "credentialing" && (
        <div className="avel-card">
          <div className="avel-card-head">
            <div>
              <div className="avel-card-title">Credentialing checklist</div>
              <div className="avel-card-sub">Primary-source verified items + continuous monitoring</div>
            </div>
          </div>
          <ul className="avel-check-list">
            {checklist.map((c, i) => (
              <li key={i} className="avel-check">
                <span className="avel-check-label">{c.label}</span>
                {c.detail ? <span className="avel-check-detail">{c.detail}</span> : <span />}
                <span className={`doc-status-pill ${c.cls}`}>{c.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------- PAYER ENROLLMENT ---------- */}
      {tab === "enrollment" && (
        <div className="avel-card avel-card-flush">
          <table className="avel-table">
            <thead>
              <tr><th>Payer</th><th>State</th><th>Status</th></tr>
            </thead>
            <tbody>
              {enrollments.map((e, i) => (
                <tr key={i} className="avel-table-row">
                  <td><strong>{e.payer}</strong></td>
                  <td className="avel-table-cell-soft">{e.state}</td>
                  <td><span className={`enr-pill ${enrollmentStatusClass(e.status)}`}>{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------- DOCUMENTS ---------- */}
      {tab === "documents" && (
        <div className="avel-card avel-card-flush">
          {docs.length > 0 ? (
            <table className="avel-table">
              <thead>
                <tr><th>Document</th><th>Type</th><th>Expires</th><th>Status</th></tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className="avel-table-row">
                    <td><div className="doc-name"><span className="doc-name-icon">📄</span>{d.name}</div></td>
                    <td><span className="doc-type-pill">{d.type}</span></td>
                    <td className="avel-table-cell-soft">{d.expires ?? "—"}</td>
                    <td><span className={`doc-status-pill ${docStatusClass(d.status)}`}>{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="avel-empty"><div className="avel-empty-title">No documents uploaded yet</div></div>
          )}
        </div>
      )}

      {/* ---------- ACTIVITY ---------- */}
      {tab === "activity" && (
        <div className="avel-card">
          <div className="avel-card-head"><div className="avel-card-title">Activity timeline</div></div>
          <ul className="avel-timeline">
            {activity.map((a, i) => (
              <li key={i} className="avel-timeline-item">
                <span className="avel-timeline-dot" />
                <div>
                  <div className="avel-timeline-stage">{a.date}</div>
                  <div className="avel-timeline-text">{a.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
