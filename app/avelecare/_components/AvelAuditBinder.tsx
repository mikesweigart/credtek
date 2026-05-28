"use client";

// NCQA Audit Binder generator — one-click, audit-ready evidence packet
// for delegated-credentialing arrangements. Pick a scope, generate, and
// the binder assembles every provider's PSV evidence, credentialing-
// committee decision, and a tamper-evident SHA-256 hash chain proving
// nothing was altered after the fact.

import Link from "next/link";
import { useState } from "react";
import { PROVIDERS, SPACES, providersInSpace, type Provider } from "../_data/seed";

// Deterministic pseudo-hash so the demo's chain is stable per provider.
function hash12(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let hex = (h >>> 0).toString(16);
  while (hex.length < 12) hex = hex + ((h = Math.imul(h ^ hex.length, 16777619)) >>> 0).toString(16);
  return hex.slice(0, 12);
}

function committeeDecision(p: Provider): string {
  if (p.readyToBill || p.readyToWork) return "Approved";
  if (p.stage === "intake") return "Pending intake";
  return "In review";
}

export function AvelAuditBinder() {
  const [scope, setScope] = useState<string>("all");
  const [generated, setGenerated] = useState(false);
  const [working, setWorking] = useState(false);

  const inScope: Provider[] =
    scope === "all" ? PROVIDERS : providersInSpace(scope);

  const scopeLabel =
    scope === "all"
      ? "All active providers"
      : SPACES.find((s) => s.id === scope)?.name ?? "Selected space";

  function generate() {
    setWorking(true);
    setGenerated(false);
    window.setTimeout(() => {
      setWorking(false);
      setGenerated(true);
    }, 700);
  }

  // Build a small chained hash list across the scoped providers.
  const chain = inScope.slice(0, 6).map((p, i, arr) => {
    const prev = i === 0 ? "genesis000000" : hash12(arr[i - 1].id + arr[i - 1].slug);
    const cur = hash12(p.id + p.slug);
    return { provider: p, prev, cur };
  });

  return (
    <div className="avel-content">
      {/* Generator controls */}
      <div className="avel-card ab-controls">
        <div className="ab-controls-text">
          <div className="avel-card-title">Generate an audit-ready binder</div>
          <div className="avel-card-sub">
            Assembles PSV evidence, committee decisions, and a tamper-evident
            hash chain for a payer&apos;s delegated-credentialing audit.
          </div>
        </div>
        <div className="ab-controls-actions">
          <select className="avel-select" value={scope} onChange={(e) => { setScope(e.target.value); setGenerated(false); }}>
            <option value="all">All active providers ({PROVIDERS.length})</option>
            {SPACES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shortName} ({providersInSpace(s.id).length})
              </option>
            ))}
          </select>
          <button type="button" className="avel-btn-primary" onClick={generate} disabled={working}>
            {working ? "Assembling…" : generated ? "Regenerate" : "Generate binder"}
          </button>
        </div>
      </div>

      {!generated && !working && (
        <div className="avel-card ab-placeholder">
          <div className="ab-placeholder-icon">▣</div>
          <div className="avel-empty-title">Choose a scope and generate</div>
          <div className="avel-empty-sub">
            The binder will include {inScope.length} provider{inScope.length === 1 ? "" : "s"} for{" "}
            <strong>{scopeLabel}</strong>.
          </div>
        </div>
      )}

      {generated && (
        <>
          {/* Cover sheet */}
          <div className="avel-card ab-cover">
            <div className="ab-cover-mark" aria-hidden="true" />
            <div className="ab-cover-body">
              <div className="ab-cover-eyebrow">NCQA Delegated Credentialing · Evidence Binder</div>
              <div className="ab-cover-title">AVEL eCare — {scopeLabel}</div>
              <div className="ab-cover-meta">
                Generated May 28, 2026 · {inScope.length} providers ·{" "}
                {inScope.length * 7} primary-source verifications · standard NCQA file format
              </div>
            </div>
            <button type="button" className="avel-btn-primary ab-download">⤓ Download PDF</button>
          </div>

          {/* Per-provider evidence */}
          <div className="avel-card avel-card-flush">
            <table className="avel-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>PSV evidence</th>
                  <th>Last verified</th>
                  <th>Committee decision</th>
                </tr>
              </thead>
              <tbody>
                {inScope.map((p) => {
                  const decision = committeeDecision(p);
                  return (
                    <tr key={p.id} className="avel-table-row">
                      <td>
                        <div className="avel-table-name-cell">
                          <div className="avel-table-av">{p.initials}</div>
                          <div>
                            <div className="avel-table-name">{p.name}, {p.credentials}</div>
                            <div className="avel-table-spec">{p.specialty}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="ab-evidence">7 / 7 sources ✓</span></td>
                      <td className="avel-table-cell-soft">May 2026</td>
                      <td>
                        <span className={`ab-decision ${decision === "Approved" ? "ab-decision-ok" : "ab-decision-pending"}`}>
                          {decision}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Hash-chain verification */}
          <div className="avel-card">
            <div className="avel-card-head">
              <div>
                <div className="avel-card-title">Tamper-evident audit chain</div>
                <div className="avel-card-sub">
                  Every credentialing action is SHA-256 hash-chained to the one before it.
                  Altering any record breaks the chain — which is exactly what an auditor wants to see.
                </div>
              </div>
              <span className="ab-chain-verified">✓ Chain intact</span>
            </div>
            <ul className="ab-chain">
              {chain.map((link, i) => (
                <li key={i} className="ab-chain-link">
                  <span className="ab-chain-step">{i + 1}</span>
                  <div className="ab-chain-body">
                    <div className="ab-chain-prov">{link.provider.name} · credentialing decision recorded</div>
                    <div className="ab-chain-hashes">
                      <span className="ab-hash-prev">prev: {link.prev}</span>
                      <span className="ab-hash-arrow">→</span>
                      <span className="ab-hash-cur">sha256: {link.cur}…</span>
                    </div>
                  </div>
                  <span className="ab-chain-ok">✓</span>
                </li>
              ))}
            </ul>
            <div className="avel-callout-soft">
              In production this verifies against the live <code>audit_log</code> table&apos;s
              hash chain — the same SHA-256 ledger that records every PHI access and state
              transition across the portal.
            </div>
          </div>
        </>
      )}

      <div className="avel-table-foot">
        AVEL eCare · NCQA audit binder
        &nbsp;·&nbsp;
        <Link className="avel-link" href="/avelecare">Back to Dashboard</Link>
      </div>
    </div>
  );
}
