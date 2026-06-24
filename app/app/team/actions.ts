"use server";

// Team management — admin-only. Inviting/role changes touch OTHER users'
// rows, so they run through the service-role client (bypasses RLS) and are
// gated to admins in app code, then scoped to the caller's tenant.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionContext } from "../../_lib/data/workspace";
import { supabaseAdmin } from "../../_lib/supabase/server";

const VALID_ROLES = ["admin", "coordinator", "finance", "readonly", "client"];
const ADMIN_ROLES = ["super_admin", "admin"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(fd: FormData, k: string): string {
  return String(fd.get(k) ?? "").trim();
}

export async function changeRole(formData: FormData) {
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");
  if (!ctx.role || !ADMIN_ROLES.includes(ctx.role)) redirect("/app/team?msg=denied");

  const memberId = str(formData, "memberId");
  const role = str(formData, "role");
  if (!memberId || !VALID_ROLES.includes(role)) redirect("/app/team?msg=badrole");
  if (memberId === ctx.userId) redirect("/app/team?msg=selfrole");

  const admin = supabaseAdmin();
  if (!admin || !ctx.tenantId) redirect("/app/team?msg=db");

  // Scoped to THIS tenant — an admin can never reach another workspace's rows.
  await admin
    .from("profiles")
    .update({ role })
    .eq("id", memberId)
    .eq("tenant_id", ctx.tenantId);

  revalidatePath("/app/team");
  redirect("/app/team?msg=role_updated");
}

export async function inviteTeammate(formData: FormData) {
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");
  if (!ctx.role || !ADMIN_ROLES.includes(ctx.role) || !ctx.tenantId) redirect("/app/team?msg=denied");

  const email = str(formData, "email").toLowerCase();
  const role = VALID_ROLES.includes(str(formData, "role")) ? str(formData, "role") : "coordinator";
  if (!EMAIL_RE.test(email)) redirect("/app/team?msg=email");

  const admin = supabaseAdmin();
  if (!admin) redirect("/app/team?msg=db");

  let userId: string | null = null;
  try {
    // Sends a Supabase invite email when SMTP is configured; either way it
    // provisions the auth user so we can attach them to the workspace.
    const inv = await admin.auth.admin.inviteUserByEmail(email);
    userId = inv.data?.user?.id ?? null;
    if (!userId) {
      // Likely already registered — find them and just add to this workspace.
      const list = await admin.auth.admin.listUsers();
      const existing = list.data?.users?.find(
        (u) => (u.email ?? "").toLowerCase() === email,
      );
      userId = existing?.id ?? null;
    }
  } catch {
    redirect("/app/team?msg=invite_failed");
  }
  if (!userId) redirect("/app/team?msg=invite_failed");

  await admin
    .from("profiles")
    .upsert({ id: userId, tenant_id: ctx.tenantId, email, role }, { onConflict: "id" });

  revalidatePath("/app/team");
  redirect("/app/team?msg=invited");
}
