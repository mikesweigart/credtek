// Follow-ups queue — live nudges derived from every provider's stage +
// SLA + cadence. Editors can fire any email right now; clients see the
// queue read-only. Demo-mode-safe: if RESEND_API_KEY isn't set, the
// send action falls back to console logging so the UI flow still works.

import Link from "next/link";
import { listFollowUps } from "../../_lib/data/followups";
import { getSessionContext, canEdit } from "../../_lib/data/workspace";
import { emailIsLive } from "../../_lib/email/send";
import { sendFollowUp } from "./actions";

export const dynamic = "force-dynamic";

function dueLabel(dueIn: number, overdue: boolean): { text: string; cls: string } {
  if (overdue) return { text: `${-dueIn}d overdue`, cls: "fu-due fu-due-over" };
  if (dueIn === 0) return { text: "due today", cls: "fu-due fu-due-now" };
  if (dueIn === 1) return { text: "due tomorrow", cls: "fu-due fu-due-soon" };
  return { text: `in ${dueIn}d`, cls: "fu-due fu-due-ok" };
}

export default async function FollowUpsPage(props: {
  searchParams: Promise<{ status?: string; who?: string; error?: string }>;
}) {
  const { status, who, error } = await props.searchParams;
  const [items, ctx] = await Promise.all([listFollowUps(), getSessionContext()]);
  const editor = canEdit(ctx.role);
  const live = emailIsLive();

  const overdueCount = items.filter((i) => i.overdue).length;
  const dueSoon = items.filter((i) => !i.overdue && i.dueIn <= 2).length;

  return (
    <div>
      <div className="portal-head portal-head-row">
        <div>
          <h1 className="portal-h1">Follow-ups</h1>
          <p className="portal-sub">
            Every email CredTek is about to send — derived live from your provider data.
            {editor
              ? " You can fire any one of them right now, or wait for the cadence to run automatically."
              : " This is a read-only view of what's queued and what's been sent."}
          </p>
        </div>
      </div>

      <div className="portal-kpis">
        <div className={`portal-kpi${overdueCount ? " portal-kpi-flagcard" : ""}`}>
          <div className="portal-kpi-lbl">Overdue</div>
          <div className={`portal-kpi-val ${overdueCount ? "portal-kpi-flag" : "portal-kpi-pos"}`}>
            {overdueCount}
          </div>
          <div className="portal-kpi-sub">past stage SLA</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">Due soon</div>
          <div className="portal-kpi-val">{dueSoon}</div>
          <div className="portal-kpi-sub">in the next 2 days</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">In queue</div>
          <div className="portal-kpi-val">{items.length}</div>
          <div className="portal-kpi-sub">across all providers</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">Email delivery</div>
          <div className={`portal-kpi-val ${live ? "portal-kpi-pos" : "portal-kpi-auto"}`}>
            {live ? "Live" : "Demo"}
          </div>
          <div className="portal-kpi-sub">{live ? "Resend connected" : "logs to server"}</div>
        </div>
      </div>

      {!live && (
        <div className="portal-card fu-banner">
          <strong>Demo email mode.</strong> Set <code>RESEND_API_KEY</code> in your environment
          to send real emails. While disabled, sending will log to the server console and
          show up here as <em>logged</em> so the workflow still works end-to-end.
        </div>
      )}

      {status === "sent" && (
        <div className="portal-card fu-toast fu-toast-ok">
          ✓ Email sent to <strong>{who ?? "provider"}</strong> via Resend.
        </div>
      )}
      {status === "logged" && (
        <div className="portal-card fu-toast fu-toast-ok">
          ✓ Email logged for <strong>{who ?? "provider"}</strong> (demo mode — set
          <code>RESEND_API_KEY</code> to send for real).
        </div>
      )}
      {status === "fail" && (
        <div className="portal-card fu-toast fu-toast-fail">
          ✗ Send failed for <strong>{who ?? "provider"}</strong>. Check Resend logs / env vars.
        </div>
      )}
      {error === "noemail" && (
        <div className="portal-card fu-toast fu-toast-fail">
          ✗ No email on file for that provider — add one in <code>meta</code> JSON or supply a
          To: override.
        </div>
      )}
      {error === "role" && (
        <div className="portal-card fu-toast fu-toast-fail">
          ✗ Your role can&apos;t send follow-ups.
        </div>
      )}

      {items.length === 0 ? (
        <div className="portal-empty">
          <div className="portal-empty-icon">✉</div>
          <h2>Nothing queued</h2>
          <p>
            Once providers are in any stage other than Approved, CredTek queues their next
            follow-up here on the cadence each stage expects.
          </p>
          <Link href="/app/providers" className="acct-btn-primary" style={{ marginTop: 8 }}>
            Go to providers
          </Link>
        </div>
      ) : (
        <div className="portal-card portal-card-flush">
          <ul className="fu-list">
            {items.map((i) => {
              const d = dueLabel(i.dueIn, i.overdue);
              return (
                <li key={i.id} className={`fu-row${i.overdue ? " fu-row-over" : ""}`}>
                  <div className="fu-row-l">
                    <Link href={`/app/providers/${i.providerId}`} className="fu-row-name">
                      {i.providerName}
                      {i.credential ? `, ${i.credential}` : ""}
                    </Link>
                    <div className="fu-row-meta">
                      <span className="fu-stage">{i.stageLabel}</span>
                      <span className={d.cls}>{d.text}</span>
                      <span className="fu-cadence">cadence every {i.cadenceDays}d</span>
                    </div>
                    <div className="fu-subject">{i.subject}</div>
                  </div>
                  <div className="fu-row-r">
                    {editor && (
                      <form action={sendFollowUp} className="fu-send-form">
                        <input type="hidden" name="id" value={i.id} />
                        <input
                          type="email"
                          name="to"
                          placeholder={i.providerEmail ?? "to: provider@example.com"}
                          className="portal-input portal-input-sm fu-send-to"
                          defaultValue={i.providerEmail ?? ""}
                          required
                        />
                        <button type="submit" className="acct-btn-primary fu-send-btn">
                          Send now →
                        </button>
                      </form>
                    )}
                    {!editor && (
                      <span className="portal-muted" style={{ fontSize: 12 }}>
                        Read-only view
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="portal-card portal-card-auto" style={{ marginTop: 18 }}>
        <div className="portal-card-head">
          <h2>⚡ How the automation runs</h2>
        </div>
        <ul className="portal-auto-list">
          <li><strong>Intake:</strong> reminder every 2 days until documents arrive.</li>
          <li><strong>PSV:</strong> escalation to a credentialing specialist after 5 silent days.</li>
          <li><strong>Privileging:</strong> reminder to the facility medical-staff office every 7 days.</li>
          <li><strong>Committee:</strong> reminder to the committee chair 2 days before the meeting.</li>
          <li><strong>Enrollment:</strong> payer status-check + escalation every 7 days.</li>
        </ul>
      </div>
    </div>
  );
}
