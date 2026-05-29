// Workspace/session context for the real authenticated app (/app).
// Resolves the signed-in user + their tenant, and SELF-HEALS the
// tenant/profile if the signup trigger (migration 0002) wasn't
// installed — so the app works regardless of DB setup state.

import { createSupabaseServerClient } from "../supabase/serverClient";
import { supabaseAdmin } from "../supabase/server";

export type SessionCtx = {
  configured: boolean;
  userId: string | null;
  email: string | null;
  fullName: string | null;
  tenantId: string | null;
  tenantName: string | null;
  role: string | null;
};

export const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  coordinator: "Coordinator",
  client: "Client",
  finance: "Finance",
  readonly: "Read-only",
};

const EDIT_ROLES = ["super_admin", "admin", "coordinator"];

/** Can this role create/edit/approve, or is it a read-only portal? */
export function canEdit(role: string | null): boolean {
  if (!role) return true; // default workspace owner is admin
  return EDIT_ROLES.includes(role);
}

const EMPTY: SessionCtx = {
  configured: false,
  userId: null,
  email: null,
  fullName: null,
  tenantId: null,
  tenantName: null,
  role: null,
};

function tenantNameFrom(tenants: unknown): string | null {
  if (!tenants) return null;
  if (Array.isArray(tenants)) return (tenants[0] as { name?: string })?.name ?? null;
  return (tenants as { name?: string }).name ?? null;
}

export async function getSessionContext(): Promise<SessionCtx> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return EMPTY;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ...EMPTY, configured: true };

  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id, full_name, role, tenants ( name )")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.tenant_id) {
    return {
      configured: true,
      userId: user.id,
      email: user.email ?? null,
      fullName: (profile.full_name as string | null) ?? null,
      tenantId: profile.tenant_id as string,
      tenantName: tenantNameFrom(profile.tenants),
      role: (profile.role as string) ?? "admin",
    };
  }

  // No profile/tenant → self-heal with the service-role client.
  const healed = await ensureWorkspace(
    user.id,
    user.email ?? "",
    (user.user_metadata as { org_name?: string } | null)?.org_name,
    (user.user_metadata as { full_name?: string } | null)?.full_name
  );
  return {
    configured: true,
    userId: user.id,
    email: user.email ?? null,
    fullName: healed?.fullName ?? null,
    tenantId: healed?.tenantId ?? null,
    tenantName: healed?.tenantName ?? null,
    role: "admin",
  };
}

async function ensureWorkspace(
  userId: string,
  email: string,
  orgName?: string,
  fullName?: string
): Promise<{ tenantId: string; tenantName: string; fullName: string | null } | null> {
  const admin = supabaseAdmin();
  if (!admin) return null;

  // Re-check under the admin client (covers a race with the trigger).
  const { data: existing } = await admin
    .from("profiles")
    .select("tenant_id, full_name, tenants ( name )")
    .eq("id", userId)
    .maybeSingle();
  if (existing?.tenant_id) {
    return {
      tenantId: existing.tenant_id as string,
      tenantName: tenantNameFrom(existing.tenants) ?? "Workspace",
      fullName: (existing.full_name as string | null) ?? null,
    };
  }

  const name =
    (orgName && orgName.trim()) ||
    `${email.split("@")[0] || "New"}'s Workspace`;
  const slug = "org-" + userId.replace(/-/g, "").slice(0, 12);

  const { data: tenant, error: tErr } = await admin
    .from("tenants")
    .insert({ name, slug })
    .select("id, name")
    .single();
  if (tErr || !tenant) return null;

  await admin.from("profiles").insert({
    id: userId,
    tenant_id: tenant.id,
    email,
    full_name: fullName ?? null,
    role: "admin",
  });

  return {
    tenantId: tenant.id as string,
    tenantName: tenant.name as string,
    fullName: fullName ?? null,
  };
}
