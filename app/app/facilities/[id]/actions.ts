"use server";

// Server actions for the facility credentialing file. RLS-scoped to the
// tenant and gated by role — same discipline as the provider workspace.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../_lib/supabase/serverClient";
import { getSessionContext, canEdit } from "../../../_lib/data/workspace";
import { recordAudit } from "../../../_lib/data/audit";

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

export async function addFacilityCredential(formData: FormData) {
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");
  if (!canEdit(ctx.role)) return;
  const facilityId = str(formData, "facilityId");
  const s = await createSupabaseServerClient();
  if (!s || !ctx.tenantId || !facilityId) return;
  await s.from("facility_credentials").insert({
    tenant_id: ctx.tenantId,
    facility_id: facilityId,
    kind: str(formData, "kind") || "other",
    identifier: str(formData, "identifier") || null,
    issuer: str(formData, "issuer") || null,
    status: str(formData, "status") || "active",
    expires_on: str(formData, "expires_on") || null,
  });
  await recordAudit({ action: "create", resourceType: "facility_credential", resourceId: facilityId,
    after: { kind: str(formData, "kind") || "other", identifier: str(formData, "identifier") || null,
             issuer: str(formData, "issuer") || null, expires_on: str(formData, "expires_on") || null } });
  revalidatePath(`/app/facilities/${facilityId}`);
}

export async function deleteFacilityCredential(formData: FormData) {
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");
  if (!canEdit(ctx.role)) return;
  const facilityId = str(formData, "facilityId");
  const id = str(formData, "id");
  const s = await createSupabaseServerClient();
  if (!s || !facilityId || !id || !ctx.tenantId) return;
  await s.from("facility_credentials").delete().eq("id", id).eq("tenant_id", ctx.tenantId);
  await recordAudit({ action: "delete", resourceType: "facility_credential", resourceId: id,
    metadata: { facility_id: facilityId } });
  revalidatePath(`/app/facilities/${facilityId}`);
}
