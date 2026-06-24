// Team management — see who's in the workspace, manage roles, invite
// teammates. Admin-gated controls; everyone can see the roster.

import { redirect } from "next/navigation";
import { getSessionContext, ROLE_LABEL } from "../../_lib/data/workspace";
import { listTeamMembers } from "../../_lib/data/team";
import { inviteTeammate, changeRole } from "./actions";

export const dynamic = "force-dynamic";

const ASSIGNABLE = ["admin", "coordinator", "finance", "readonly", "client"];

const MSG: Record<string, { tone: "ok" | "fail"; text: string }> = {
  invited: { tone: "ok", text: "Teammate added to the workspace. If your Supabase email is configured, they'll get an invite; otherwise they can sign in and reset their password." },
  role_updated: { tone: "ok", text: "Role updated." },
  denied: { tone: "fail", text: "Only admins can manage the team." },
  email: { tone: "fail", text: "Enter a valid email address." },
  badrole: { tone: "fail", text: "Pick a valid role." },
  selfrole: { tone: "fail", text: "You can't change your own role here." },
  db: { tone: "fail", text: "Couldn't reach the database. Nothing changed — try again." },
  invite_failed: { tone: "fail", text: "Couldn't invite that email — they may already belong to another workspace." },
};

export default async function TeamPage(props: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await props.searchParams;
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");

  const isAdmin = !!ctx.role && ["super_admin", "admin"].includes(ctx.role);
  const members = await listTeamMembers();
  const toast = msg ? MSG[msg] : null;

  return (
    <div>
      <div className="portal-head">
        <h1 className="portal-h1">Team</h1>
        <p className="portal-sub">
          {members.length} member{members.length === 1 ? "" : "s"} in {ctx.tenantName ?? "your workspace"}
        </p>
      </div>

      {toast && (
        <div className={`portal-card fu-toast fu-toast-${toast.tone}`}>{toast.text}</div>
      )}

      {isAdmin && (
        <div className="portal-card">
          <h2 className="portal-card-h">Invite a teammate</h2>
          <form action={inviteTeammate} className="portal-inline-form">
            <input name="email" type="email" placeholder="teammate@yourgroup.com" className="portal-input" required />
            <select name="role" className="portal-input portal-input-sm" defaultValue="coordinator">
              {ASSIGNABLE.map((r) => (
                <option key={r} value={r}>{ROLE_LABEL[r] ?? r}</option>
              ))}
            </select>
            <button type="submit" className="acct-btn-primary">Send invite</button>
          </form>
          <p className="portal-help" style={{ marginTop: 8 }}>
            Coordinators can manage credentialing; finance &amp; read-only see status without edit controls; client is a
            read-only portal for the customer.
          </p>
        </div>
      )}

      <div className="portal-card portal-card-flush">
        <table className="portal-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>
                  {m.full_name ?? "—"}
                  {m.id === ctx.userId ? <span className="portal-muted"> (you)</span> : ""}
                </td>
                <td>{m.email ?? "—"}</td>
                <td>
                  {isAdmin && m.id !== ctx.userId ? (
                    <form action={changeRole} className="portal-role-form">
                      <input type="hidden" name="memberId" value={m.id} />
                      <select name="role" defaultValue={m.role ?? "coordinator"} className="portal-input portal-input-sm">
                        {ASSIGNABLE.map((r) => (
                          <option key={r} value={r}>{ROLE_LABEL[r] ?? r}</option>
                        ))}
                      </select>
                      <button type="submit" className="acct-btn-secondary">Save</button>
                    </form>
                  ) : (
                    <span className={`portal-role-badge role-${m.role}`}>
                      {ROLE_LABEL[m.role ?? ""] ?? m.role ?? "—"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
