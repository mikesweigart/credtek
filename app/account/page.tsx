// /account — protected. Proves the full auth stack end-to-end:
// real Supabase session → RLS-scoped read of the user's own profile +
// tenant. Redirects to /sign-in if not authenticated.
//
// (Auth-only milestone: this confirms login works and tenant isolation
// is live. Real data screens come next.)

import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../_lib/supabase/serverClient";
import { SignOutButton } from "./SignOutButton";

export const metadata = { title: "Your account · CredTek" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="acct-shell">
        <div className="acct-card">
          <h1>Auth not configured</h1>
          <p>Supabase environment variables aren&apos;t set in this environment.</p>
          <Link href="/" className="acct-link">← Back to site</Link>
        </div>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  // RLS-scoped: a user can read only their own profile + their tenant.
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, email, tenants ( name, slug )")
    .eq("id", user.id)
    .maybeSingle();

  const tenant = (profile?.tenants ?? null) as { name: string; slug: string } | null;

  return (
    <div className="acct-shell">
      <div className="acct-card">
        <div className="acct-badge">✓ Signed in</div>
        <h1 className="acct-h1">
          You&apos;re authenticated{profile?.full_name ? `, ${profile.full_name}` : ""}.
        </h1>
        <p className="acct-p">
          This page is RLS-protected — it loaded your profile and tenant
          directly from the live database, scoped to your account only.
        </p>

        <dl className="acct-grid">
          <div className="acct-row">
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="acct-row">
            <dt>Role</dt>
            <dd>{profile?.role ?? "—"}</dd>
          </div>
          <div className="acct-row">
            <dt>Workspace</dt>
            <dd>{tenant?.name ?? "Provisioning…"}</dd>
          </div>
          <div className="acct-row">
            <dt>Tenant slug</dt>
            <dd>{tenant?.slug ?? "—"}</dd>
          </div>
        </dl>

        {!profile && (
          <div className="acct-note">
            Your workspace is still provisioning. If this persists, the
            signup trigger (migration 0002) may not be installed yet.
          </div>
        )}

        <div className="acct-actions">
          <Link href="/dashboard" className="acct-btn-secondary">
            Open the demo dashboard →
          </Link>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
