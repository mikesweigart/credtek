// Real authenticated application shell (/app/*). Auth-gated. Reuses the
// CredTek .shell-* styling. Resolves the user's workspace (self-healing)
// and renders the live product behind the login. Mounts the Cred guide
// so first-time users are greeted by name and walked through the app.

import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionContext, ROLE_LABEL } from "../_lib/data/workspace";
import { listProviders } from "../_lib/data/providers";
import {
  daysInStage,
  isOverdue,
} from "../_lib/data/credentialing-model";
import type { Stage } from "../_lib/data/credentialing";
import { SignOutButton } from "../account/SignOutButton";
import { PortalNav } from "./_components/PortalNav";
import { PortalGuide } from "./_components/PortalGuide";

export const metadata = { title: "Workspace · CredTek" };
export const dynamic = "force-dynamic";

function firstNameOf(fullName: string | null, email: string | null): string {
  if (fullName) {
    const f = fullName.trim().split(/\s+/)[0];
    if (f) return f;
  }
  if (email) {
    const local = email.split("@")[0] || "";
    const f = local.replace(/[._-]+/g, " ").trim().split(/\s+/)[0];
    if (f) return f.charAt(0).toUpperCase() + f.slice(1);
  }
  return "there";
}

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const ctx = await getSessionContext();

  if (!ctx.configured) {
    return (
      <div className="acct-shell">
        <div className="acct-card">
          <h1 className="acct-h1">Backend not configured</h1>
          <p className="acct-p">
            Supabase environment variables aren&apos;t set in this environment yet.
          </p>
          <Link href="/" className="acct-link">← Back to site</Link>
        </div>
      </div>
    );
  }
  if (!ctx.userId) redirect("/sign-in");

  // Workspace signals for the guide (cheap; cached by Next route segment).
  const providers = await listProviders();
  const flaggedCount = providers.reduce((n, p) => {
    const stage = (p.credentialing_stage as Stage) ?? "intake";
    const d = daysInStage(p.stage_entered_at, p.created_at);
    return n + (isOverdue(stage, d) ? 1 : 0);
  }, 0);

  const firstName = firstNameOf(ctx.fullName, ctx.email);

  return (
    <div className="shell">
      <aside className="shell-sb">
        <div className="shell-sb-logo">
          <div className="shell-sb-logo-mark">C</div>
          <div className="shell-sb-logo-text">CredTek</div>
        </div>

        <div className="shell-sb-section">Workspace</div>
        <PortalNav />

        <div className="shell-sb-foot">
          <div className="shell-sb-foot-meta">
            {ctx.tenantName ?? "Your workspace"}
          </div>
        </div>
      </aside>

      <div className="shell-main">
        <header className="shell-topbar">
          <div className="shell-search" style={{ pointerEvents: "none" }}>
            {ctx.tenantName ?? "Workspace"}
          </div>
          <div className="shell-topbar-actions">
            {ctx.role && (
              <span className={`portal-role-badge role-${ctx.role}`}>
                {ROLE_LABEL[ctx.role] ?? ctx.role}
              </span>
            )}
            <span className="shell-topbar-shortcut">{ctx.email}</span>
            <SignOutButton />
          </div>
        </header>
        <main className="shell-content">{children}</main>
      </div>

      <PortalGuide
        firstName={firstName}
        tenantName={ctx.tenantName ?? "your workspace"}
        role={ctx.role ?? "admin"}
        hasProviders={providers.length > 0}
        flaggedCount={flaggedCount}
      />
    </div>
  );
}
