"use client";

// Follow-ups command center — turns "things you'd have to remember to
// chase" into one-click actions. Reads the user's connected email
// (set in Settings → Email & Integrations). When connected, actions
// send from their inbox; when not, they're nudged to connect first.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FOLLOWUPS,
  CHANNEL_LABEL,
  followupsByUrgency,
  countByUrgency,
  type Urgency,
} from "../_data/followups";
import { getProvider } from "../_data/seed";

const URGENCY_DOT: Record<Urgency, string> = {
  high: "fu-dot-high",
  medium: "fu-dot-med",
  low: "fu-dot-low",
};

export function AvelFollowups() {
  const router = useRouter();
  const [urgency, setUrgency] = useState<"" | Urgency>("");
  const [queued, setQueued] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      setEmail(localStorage.getItem("avel_email_connected"));
    } catch {
      /* ignore */
    }
  }, []);

  const rows = useMemo(
    () => followupsByUrgency().filter((f) => !urgency || f.urgency === urgency),
    [urgency]
  );

  function act(id: string) {
    if (!email) {
      router.push("/eastside-hospital/settings?tab=email");
      return;
    }
    setQueued((prev) => new Set(prev).add(id));
  }

  const remaining = FOLLOWUPS.length - queued.size;

  return (
    <div className="avel-content">
      {/* Connect-email banner */}
      {!email && (
        <div className="fu-connect-banner">
          <div>
            <strong>Connect your email to send follow-ups in one click.</strong>
            <span> Renewal reminders, document requests, and payer escalations go out from your inbox.</span>
          </div>
          <Link href="/eastside-hospital/settings?tab=email" className="avel-btn-primary">
            Connect email →
          </Link>
        </div>
      )}
      {email && (
        <div className="fu-connected-note">
          ✓ Connected as <strong>{email}</strong> — follow-ups send from your inbox.
        </div>
      )}

      {/* KPI tiles (filter on click) */}
      <div className="avel-kpis avel-kpis-4">
        <button
          type="button"
          className={`avel-kpi avel-kpi-btn${urgency === "high" ? " is-active" : ""}`}
          onClick={() => setUrgency(urgency === "high" ? "" : "high")}
        >
          <div className="avel-kpi-lbl">High priority</div>
          <div className="avel-kpi-val avel-kpi-val-warn">{countByUrgency("high")}</div>
          <div className="avel-kpi-delta">Act today</div>
        </button>
        <button
          type="button"
          className={`avel-kpi avel-kpi-btn${urgency === "medium" ? " is-active" : ""}`}
          onClick={() => setUrgency(urgency === "medium" ? "" : "medium")}
        >
          <div className="avel-kpi-lbl">Medium</div>
          <div className="avel-kpi-val">{countByUrgency("medium")}</div>
          <div className="avel-kpi-delta">This week</div>
        </button>
        <button
          type="button"
          className={`avel-kpi avel-kpi-btn${urgency === "low" ? " is-active" : ""}`}
          onClick={() => setUrgency(urgency === "low" ? "" : "low")}
        >
          <div className="avel-kpi-lbl">Low</div>
          <div className="avel-kpi-val">{countByUrgency("low")}</div>
          <div className="avel-kpi-delta">On track</div>
        </button>
        <div className="avel-kpi">
          <div className="avel-kpi-lbl">Open follow-ups</div>
          <div className="avel-kpi-val avel-kpi-val-pos">{remaining}</div>
          <div className="avel-kpi-delta">{queued.size} handled today</div>
        </div>
      </div>

      {/* The list */}
      <div className="avel-card">
        <div className="avel-card-head">
          <div>
            <div className="avel-card-title">What needs a nudge</div>
            <div className="avel-card-sub">
              Sorted by urgency. One click sends — or queues — the follow-up.
            </div>
          </div>
          {urgency && (
            <button type="button" className="avel-link" onClick={() => setUrgency("")}>
              Clear filter
            </button>
          )}
        </div>

        <ul className="fu-list">
          {rows.map((f) => {
            const provider = getProvider(f.providerSlug);
            const done = queued.has(f.id);
            return (
              <li key={f.id} className={`fu-item${done ? " is-done" : ""}`}>
                <span className={`fu-dot ${URGENCY_DOT[f.urgency]}`} aria-hidden="true" />
                <div className="fu-body">
                  <div className="fu-title">{f.title}</div>
                  <div className="fu-detail">{f.detail}</div>
                  <div className="fu-meta">
                    <Link
                      href={`/eastside-hospital/providers/${f.providerSlug}`}
                      className="fu-provider"
                    >
                      {provider?.name ?? f.providerSlug}
                    </Link>
                    <span className="fu-channel">{CHANNEL_LABEL[f.channel]}</span>
                  </div>
                </div>
                <div className="fu-action">
                  {done ? (
                    <span className="fu-queued">
                      ✓ {email ? "Sent" : "Queued"}
                    </span>
                  ) : (
                    <button type="button" className="fu-btn" onClick={() => act(f.id)}>
                      {f.action}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {rows.length === 0 && (
          <div className="avel-empty">
            <div className="avel-empty-icon">✓</div>
            <div className="avel-empty-title">All clear in this view</div>
          </div>
        )}
      </div>

      <div className="avel-table-foot">
        Eastside Hospital follow-ups · {remaining} open
        &nbsp;·&nbsp;
        <Link className="avel-link" href="/eastside-hospital">Back to Dashboard</Link>
      </div>
    </div>
  );
}
