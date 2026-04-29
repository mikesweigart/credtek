"use client";

// Topbar notification bell. Reuses the AGENT_FEED so a partner sees the
// same agent events from the dashboard surfaced everywhere they navigate
// — reinforcing "the agents are always working" message.

import { useEffect, useRef, useState } from "react";
import { AGENT_FEED } from "../../_lib/mockProviders";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const goldCount = AGENT_FEED.filter((e) => e.tone === "gold").length;
  const dangerCount = AGENT_FEED.filter((e) => e.tone === "danger").length;
  const total = goldCount + dangerCount;

  return (
    <div className="bell-wrap" ref={ref}>
      <button
        className="bell-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={`${total} pending notifications`}
        type="button"
      >
        <span className="bell-icon">⏰</span>
        {total > 0 ? <span className="bell-badge">{total}</span> : null}
      </button>
      {open ? (
        <div className="bell-pop" role="dialog">
          <div className="bell-pop-head">
            <strong>Agent activity</strong>
            <span className="bell-pop-meta">
              {goldCount} need approval · {dangerCount} urgent
            </span>
          </div>
          <div className="bell-pop-list">
            {AGENT_FEED.map((ev, i) => {
              const dotClass =
                ev.tone === "gold"
                  ? "dash-ev-dot gold"
                  : ev.tone === "danger"
                    ? "dash-ev-dot danger"
                    : "dash-ev-dot";
              return (
                <div key={i} className="bell-pop-row">
                  <div className={dotClass}></div>
                  <div>
                    <div
                      className="dash-ev-text"
                      dangerouslySetInnerHTML={{ __html: ev.text }}
                    />
                    <div className="dash-ev-time">{ev.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <a className="bell-pop-foot" href="/approvals">
            View all in approvals queue →
          </a>
        </div>
      ) : null}
    </div>
  );
}
