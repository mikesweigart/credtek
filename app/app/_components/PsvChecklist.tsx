// PSV checklist — the seven sources every credentialing manager
// recognizes, each with a per-source status, last-checked timestamp,
// and a re-run handle. Status is derived deterministically from the
// provider's stage + days-in-stage, so the demo behaves predictably
// without a live verification runner behind it.
//
// When the real PSV runner ships, it'll write per-source results to a
// psv_checks table and this component will read that. The data model
// here mirrors the eventual table shape.

import {
  STAGE_SEQUENCE,
  daysInStage,
} from "../../_lib/data/credentialing-model";
import type { Stage } from "../../_lib/data/credentialing";

type Props = {
  stage: Stage;
  stageEnteredAt?: string | null;
  createdAt: string;
  providerId: string;
};

type SourceStatus = "verified" | "clean" | "pending" | "in_progress" | "queued" | "needs_review";

type Source = {
  key: string;
  name: string;
  full: string;
  what: string;
  status: SourceStatus;
  lastChecked: string | null; // ISO timestamp
};

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const STATUS_PILL: Record<SourceStatus, { label: string; cls: string }> = {
  verified:     { label: "Verified",      cls: "psv-pill-ok" },
  clean:        { label: "Clean",         cls: "psv-pill-ok" },
  pending:      { label: "Pending",       cls: "psv-pill-pending" },
  in_progress:  { label: "In progress",   cls: "psv-pill-progress" },
  queued:       { label: "Queued",        cls: "psv-pill-queued" },
  needs_review: { label: "Needs review",  cls: "psv-pill-warn" },
};

function lastCheckedAgo(d: Date): string {
  const ms = Date.now() - d.getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function PsvChecklist({ stage, stageEnteredAt, createdAt, providerId }: Props) {
  const stageIdx = STAGE_SEQUENCE.indexOf(stage);
  const psvIdx = STAGE_SEQUENCE.indexOf("psv");
  const past = stageIdx > psvIdx;
  const here = stageIdx === psvIdx;
  const currentDays = daysInStage(stageEnteredAt, createdAt);
  const seed = hashSeed(providerId);

  const SOURCES_BASE: Omit<Source, "status" | "lastChecked">[] = [
    { key: "nppes",  name: "NPPES",        full: "National Plan & Provider Enumeration",   what: "NPI active + taxonomy match" },
    { key: "oig",    name: "OIG LEIE",     full: "Office of Inspector General — exclusions", what: "Federal exclusion check" },
    { key: "sam",    name: "SAM.gov",      full: "System for Award Management",            what: "Federal debarment check" },
    { key: "state",  name: "State board",  full: "State licensure board(s)",               what: "License active + no actions" },
    { key: "npdb",   name: "NPDB",         full: "National Practitioner Data Bank",        what: "Adverse actions, malpractice" },
    { key: "dea",    name: "DEA",          full: "DEA registration verification",          what: "Active + correct schedules" },
    { key: "caqh",   name: "CAQH",         full: "CAQH ProView attestation",               what: "Re-attestation < 120 days old" },
  ];

  const sources: Source[] = SOURCES_BASE.map((s, idx) => {
    let status: SourceStatus;
    let lastChecked: string | null = null;

    if (past) {
      // All complete; mix verified vs clean for realism.
      const cleanKeys = ["oig", "sam", "npdb"];
      status = cleanKeys.includes(s.key) ? "clean" : "verified";
      lastChecked = new Date(Date.now() - ((seed + idx * 31) % 36) * 3_600_000).toISOString();
    } else if (here) {
      // Spread sources across in_progress, pending, verified, clean
      // deterministically. The longer in PSV, the more are done.
      const cycle = (seed + idx * 17) % 100;
      const progress = Math.min(100, currentDays * 12); // 0d → 0%, 8d → 96%
      if (cycle < progress * 0.55) {
        status = idx % 2 === 0 ? "verified" : "clean";
        lastChecked = new Date(Date.now() - ((seed + idx) % 24) * 3_600_000).toISOString();
      } else if (cycle < progress * 0.8) {
        status = "in_progress";
        lastChecked = new Date(Date.now() - ((seed + idx) % 6) * 3_600_000).toISOString();
      } else if (cycle < progress * 0.95) {
        status = "pending";
        lastChecked = null;
      } else {
        status = "queued";
        lastChecked = null;
      }
      // CAQH re-attest > 110 days flags Needs review occasionally
      if (s.key === "caqh" && (seed % 7 === 0)) {
        status = "needs_review";
        lastChecked = new Date(Date.now() - 110 * 86_400_000).toISOString();
      }
    } else {
      status = "queued";
    }
    return { ...s, status, lastChecked };
  });

  const completed = sources.filter((s) => s.status === "verified" || s.status === "clean").length;
  const total = sources.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="portal-card psv-card">
      <div className="portal-card-head">
        <div>
          <h2>Primary source verification</h2>
          <div className="psv-sub">
            {past
              ? "Verified across all seven sources — file is past PSV."
              : here
              ? `${completed} of ${total} sources verified · ${pct}% complete`
              : "Queued — will run automatically when this provider enters PSV."}
          </div>
        </div>
        <div className="psv-progress-wrap" aria-hidden>
          <div className="psv-progress" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ul className="psv-list">
        {sources.map((s) => {
          const pill = STATUS_PILL[s.status];
          return (
            <li key={s.key} className="psv-row">
              <div className="psv-row-l">
                <div className="psv-row-name">
                  {s.name}
                  <span className="psv-row-full">{s.full}</span>
                </div>
                <div className="psv-row-what">{s.what}</div>
              </div>
              <div className="psv-row-r">
                <span className={`psv-pill ${pill.cls}`}>{pill.label}</span>
                <span className="psv-row-when">
                  {s.lastChecked ? `Checked ${lastCheckedAgo(new Date(s.lastChecked))}` : "—"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="psv-foot portal-muted">
        Sources run automatically on a 24-hour cycle and on demand. Live re-run wires to your{" "}
        <strong>RESEND_API_KEY</strong> + verification credentials when ready.
      </div>
    </div>
  );
}
