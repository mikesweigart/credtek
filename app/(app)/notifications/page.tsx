// Full notification history. The topbar bell shows a 6-event preview;
// this is where coordinators come for the long tail. Filterable, with
// links into the relevant provider/payor/license context.

import Link from "next/link";
import { DemoButton } from "../_components/DemoButton";

export const metadata = {
  title: "Notifications",
};

type NotifKind =
  | "approval"
  | "expiration"
  | "psv"
  | "submission"
  | "provider"
  | "supervision"
  | "delegation";

type NotifTone = "default" | "gold" | "danger" | "success";

type Notif = {
  kind: NotifKind;
  tone: NotifTone;
  text: string;
  time: string;
  /** Link to drill into the relevant context. */
  href?: string;
  unread?: boolean;
};

const NOTIFICATIONS: Notif[] = [
  { kind: "approval", tone: "gold", text: "<strong>Approval needed</strong> — Optum submission for J. Mitchell", time: "2 min ago", href: "/approvals", unread: true },
  { kind: "psv", tone: "default", text: "<strong>PSV</strong> verified TX LPC license for A. Patel · 99.4% confidence", time: "14 min ago", href: "/providers/aisha-patel?tab=licenses", unread: true },
  { kind: "expiration", tone: "danger", text: "<strong>Expiring</strong> CA medical license for D. Kim · 21 days", time: "1 hr ago", href: "/providers/daniel-kim?tab=licenses", unread: true },
  { kind: "supervision", tone: "default", text: "<strong>Supervision</strong> 24 hrs logged · A. Patel · cosigned by Dr. Reyes", time: "3 hr ago", href: "/providers/aisha-patel?tab=supervision" },
  { kind: "approval", tone: "gold", text: "<strong>Approval needed</strong> — Carelon submission for A. Patel", time: "4 hr ago", href: "/approvals" },
  { kind: "submission", tone: "default", text: "<strong>CAQH</strong> attestation auto-completed for S. Reyes · awaiting provider sign-off via SMS", time: "6 hr ago", href: "/providers/sarah-reyes?tab=payors" },
  { kind: "psv", tone: "danger", text: "<strong>PSV anomaly</strong> NY OP returned different license-number format for T. Brooks · review required", time: "Apr 28 · 4:18 PM", href: "/providers/tyler-brooks" },
  { kind: "submission", tone: "default", text: "<strong>Anthem BH</strong> escalation submitted for M. Singh · stalled at day 47", time: "Apr 28 · 2:14 PM", href: "/payors?payor=anthem" },
  { kind: "delegation", tone: "success", text: "<strong>Optum delegation</strong> eligible — your last 6 NCQA files met all standards", time: "Apr 28 · 11:02 AM", href: "/providers/sarah-reyes" },
  { kind: "supervision", tone: "danger", text: "<strong>Supervision cosig</strong> overdue 6 days — P. Shah · auto-reminder sent to Dr. Reyes", time: "Apr 27 · 5:30 PM", href: "/providers/priya-shah" },
  { kind: "approval", tone: "success", text: "<strong>Optum committee</strong> approved S. Reyes credentialing · in-network May 7", time: "Apr 27 · 9:14 AM", href: "/providers/sarah-reyes?tab=payors" },
  { kind: "submission", tone: "default", text: "<strong>Magellan</strong> draft ready for R. Bennett · review in approvals queue", time: "Apr 27 · 8:42 AM", href: "/approvals" },
  { kind: "expiration", tone: "default", text: "<strong>License renewal</strong> auto-drafted for D. Kim CA · review and submit", time: "Apr 27 · 8:30 AM", href: "/providers/daniel-kim?tab=licenses" },
  { kind: "provider", tone: "success", text: "<strong>New provider</strong> Aisha Patel completed intake · agent verified TX LPC license", time: "Apr 27 · 8:14 AM", href: "/providers/aisha-patel" },
  { kind: "psv", tone: "default", text: "<strong>OIG monthly bulk</strong> screened — 0 hits across roster", time: "Apr 26 · 6:00 AM" },
  { kind: "psv", tone: "default", text: "<strong>SAM.gov</strong> screened — 0 hits across roster", time: "Apr 26 · 6:00 AM" },
  { kind: "submission", tone: "success", text: "<strong>Carelon</strong> in-network for M. Singh · 31 days from submission", time: "Apr 25 · 3:48 PM", href: "/providers/marcus-singh?tab=payors" },
  { kind: "supervision", tone: "default", text: "<strong>Quarterly evaluation</strong> completed for A. Patel by Dr. Reyes", time: "Apr 19 · 4:08 PM", href: "/providers/aisha-patel?tab=supervision" },
  { kind: "submission", tone: "default", text: "<strong>TX Medicaid Superior</strong> requested DEA refresh for D. Kim · agent attached + fax-confirmed", time: "Apr 22 · 3:47 PM", href: "/providers/daniel-kim?tab=payors" },
  { kind: "submission", tone: "success", text: "<strong>Optum</strong> in-network for A. Patel · 42 days", time: "Apr 20 · 11:14 AM", href: "/providers/aisha-patel?tab=payors" },
];

const FILTERS: { id: string; label: string; matches: (n: Notif) => boolean }[] = [
  { id: "all", label: "All", matches: () => true },
  { id: "unread", label: "Unread", matches: (n) => !!n.unread },
  { id: "approval", label: "Approvals", matches: (n) => n.kind === "approval" },
  { id: "expiration", label: "Expirations", matches: (n) => n.kind === "expiration" },
  { id: "psv", label: "PSV", matches: (n) => n.kind === "psv" },
  { id: "submission", label: "Submissions", matches: (n) => n.kind === "submission" },
  { id: "supervision", label: "Supervision", matches: (n) => n.kind === "supervision" },
  { id: "delegation", label: "Delegation", matches: (n) => n.kind === "delegation" },
];

type PageProps = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function NotificationsPage({ searchParams }: PageProps) {
  const { filter } = await searchParams;
  const active = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
  const visible = NOTIFICATIONS.filter(active.matches);
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">Activity stream</span>
        <h1>Notifications</h1>
        <p>
          Every agent action, every payor response, every license event.
          Filter by category, click into context, mark all read when you
          start your day.
        </p>
      </section>

      <div className="filter-row">
        <div className="filter-chips" style={{ width: "100%" }}>
          {FILTERS.map((f) => {
            const count = NOTIFICATIONS.filter(f.matches).length;
            const className =
              active.id === f.id ? "filter-chip active" : "filter-chip";
            return (
              <Link
                key={f.id}
                href={f.id === "all" ? "/notifications" : `/notifications?filter=${f.id}`}
                className={className}
              >
                {f.label} <span className="filter-chip-count">{count}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 18,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "var(--muted)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.04em",
          }}
        >
          {unreadCount} UNREAD · {NOTIFICATIONS.length} TOTAL
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <DemoButton
            className="prov-btn"
            demoMessage="Demo — would mark all visible notifications as read and update the bell badge."
          >
            Mark all as read
          </DemoButton>
          <DemoButton
            className="prov-btn"
            demoMessage="Demo — would download a CSV of all notifications for the selected filter range. Useful for quarterly compliance reviews."
          >
            Export
          </DemoButton>
        </div>
      </div>

      <div className="dash-panel">
        {visible.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">∅</div>
            <h4>No notifications match this filter</h4>
            <p>Try a different category.</p>
          </div>
        ) : (
          <div className="notif-stream">
            {visible.map((n, i) => (
              <NotifRow key={i} n={n} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function NotifRow({ n }: { n: Notif }) {
  const dotClass =
    n.tone === "gold"
      ? "dash-ev-dot gold"
      : n.tone === "danger"
        ? "dash-ev-dot danger"
        : n.tone === "success"
          ? "dash-ev-dot success"
          : "dash-ev-dot";

  const inner = (
    <>
      <div className={dotClass}></div>
      <div className="notif-row-body">
        <div
          className="dash-ev-text"
          dangerouslySetInnerHTML={{ __html: n.text }}
        />
        <div className="notif-row-foot">
          <span className="dash-ev-time">{n.time}</span>
          <span className="notif-kind">{n.kind}</span>
          {n.unread ? <span className="notif-unread">●</span> : null}
        </div>
      </div>
    </>
  );

  if (n.href) {
    return (
      <Link href={n.href} className="notif-row link">
        {inner}
      </Link>
    );
  }
  return <div className="notif-row">{inner}</div>;
}
