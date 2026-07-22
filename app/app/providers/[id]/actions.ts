"use server";

// Server actions for the provider credentialing workspace. Every
// mutation is RLS-scoped to the tenant AND gated by role — read-only
// roles (client/finance/readonly) get a silent no-op (UI also hides the
// controls). Native <form action> handlers — progressive enhancement.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { recordAudit } from "../../../_lib/data/audit";
import { createSupabaseServerClient } from "../../../_lib/supabase/serverClient";
import { getSessionContext, canEdit } from "../../../_lib/data/workspace";
import type { SessionCtx } from "../../../_lib/data/workspace";

async function editorCtx(): Promise<SessionCtx | null> {
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");
  if (!canEdit(ctx.role)) return null; // read-only role → no-op
  return ctx;
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

export async function addLicense(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const s = await createSupabaseServerClient();
  if (!s || !ctx.tenantId || !providerId) return;
  await s.from("provider_licenses").insert({
    tenant_id: ctx.tenantId,
    provider_id: providerId,
    state: str(formData, "state").toUpperCase().slice(0, 2),
    license_number: str(formData, "license_number") || null,
    status: str(formData, "status") || "active",
    expires_on: str(formData, "expires_on") || null,
  });
  await recordAudit({ action: "create", resourceType: "provider_license", resourceId: providerId,
    after: { state: str(formData, "state").toUpperCase().slice(0, 2), expires_on: str(formData, "expires_on") || null } });
  revalidatePath(`/app/providers/${providerId}`);
}

export async function addCredential(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const s = await createSupabaseServerClient();
  if (!s || !ctx.tenantId || !providerId) return;
  await s.from("provider_credentials").insert({
    tenant_id: ctx.tenantId,
    provider_id: providerId,
    kind: str(formData, "kind") || "other",
    identifier: str(formData, "identifier") || null,
    status: str(formData, "status") || "active",
    expires_on: str(formData, "expires_on") || null,
  });
  await recordAudit({ action: "create", resourceType: "provider_credential", resourceId: providerId,
    after: { kind: str(formData, "kind"), identifier: str(formData, "identifier") || null } });
  revalidatePath(`/app/providers/${providerId}`);
}

export async function addDocument(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const s = await createSupabaseServerClient();
  if (!s || !ctx.tenantId || !providerId) return;
  await s.from("documents").insert({
    tenant_id: ctx.tenantId,
    provider_id: providerId,
    name: str(formData, "name") || "Untitled document",
    doc_type: str(formData, "doc_type") || "Other",
    status: str(formData, "status") || "current",
    expires_on: str(formData, "expires_on") || null,
  });
  await recordAudit({ action: "create", resourceType: "document", resourceId: providerId,
    after: { name: str(formData, "name"), doc_type: str(formData, "doc_type") } });
  revalidatePath(`/app/providers/${providerId}`);
}

export async function addEnrollment(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const s = await createSupabaseServerClient();
  if (!s || !ctx.tenantId || !providerId) return;
  const payerId = str(formData, "payer_id");
  if (!payerId) return;
  await s.from("enrollments").insert({
    tenant_id: ctx.tenantId,
    provider_id: providerId,
    payer_id: payerId,
    state: str(formData, "state").toUpperCase().slice(0, 2) || null,
    status: str(formData, "status") || "not_started",
    submitted_on: str(formData, "submitted_on") || null,
  });
  await recordAudit({ action: "submit", resourceType: "enrollment", resourceId: providerId,
    after: { payer_id: payerId, state: str(formData, "state").toUpperCase().slice(0, 2), status: str(formData, "status") || "not_started" } });
  revalidatePath(`/app/providers/${providerId}`);
}

export async function addScreening(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const s = await createSupabaseServerClient();
  if (!s || !ctx.tenantId || !providerId) return;
  await s.from("screenings").insert({
    tenant_id: ctx.tenantId,
    provider_id: providerId,
    source: str(formData, "source") || "other",
    result: str(formData, "result") || "not_run",
    checked_on: str(formData, "checked_on") || null,
    reference: str(formData, "reference") || null,
  });
  await recordAudit({ action: "create", resourceType: "screening", resourceId: providerId,
    after: { source: str(formData, "source") || "other", result: str(formData, "result") || "not_run",
             checked_on: str(formData, "checked_on") || null, reference: str(formData, "reference") || null } });
  revalidatePath(`/app/providers/${providerId}`);
}

export async function deleteSubRecord(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const table = str(formData, "table");
  const id = str(formData, "id");
  const allowed = ["provider_licenses", "provider_credentials", "documents", "enrollments", "screenings"];
  const s = await createSupabaseServerClient();
  if (!s || !providerId || !id || !ctx.tenantId || !allowed.includes(table)) return;
  // Tenant-scoped: the table name here is dynamic, which is exactly why
  // this delete slipped past a literal-table audit. Deleting a licence or
  // screening by bare id would otherwise cross workspaces.
  await s.from(table).delete().eq("id", id).eq("tenant_id", ctx.tenantId);
  await recordAudit({ action: "delete", resourceType: table, resourceId: id,
    metadata: { provider_id: providerId } });
  revalidatePath(`/app/providers/${providerId}`);
}

const STAGE_SEQ = ["intake", "psv", "privileging", "committee", "enrollment", "approved"];

export async function advanceStage(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const current = str(formData, "current") || "intake";
  const s = await createSupabaseServerClient();
  if (!s || !providerId || !ctx.tenantId) return;
  const idx = STAGE_SEQ.indexOf(current);
  const next = STAGE_SEQ[Math.min(idx + 1, STAGE_SEQ.length - 1)];
  // stage_entered_at resets the SLA clock; both columns exist post-0003/0004.
  await s.from("providers").update({ credentialing_stage: next }).eq("id", providerId).eq("tenant_id", ctx.tenantId);
  await s.from("providers").update({ stage_entered_at: new Date().toISOString() }).eq("id", providerId).eq("tenant_id", ctx.tenantId);
  await recordAudit({ action: "transition", resourceType: "provider", resourceId: providerId,
    before: { stage: current }, after: { stage: next } });
  revalidatePath(`/app/providers/${providerId}`);
  revalidatePath("/app");
}

export async function approveProvider(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const s = await createSupabaseServerClient();
  if (!s || !ctx.tenantId || !providerId) return;

  await s.from("providers").update({ status: "active" }).eq("id", providerId).eq("tenant_id", ctx.tenantId);
  await s.from("providers").update({ credentialing_stage: "approved" }).eq("id", providerId).eq("tenant_id", ctx.tenantId);
  await s.from("providers").update({ stage_entered_at: new Date().toISOString() }).eq("id", providerId).eq("tenant_id", ctx.tenantId);

  await recordAudit({
    action: "approve",
    resourceType: "provider",
    resourceId: providerId,
    after: { status: "active", stage: "approved" },
    metadata: { event: "credentialing_committee_approval" },
  });

  revalidatePath(`/app/providers/${providerId}`);
  revalidatePath("/app");
}

export async function updateProvider(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const s = await createSupabaseServerClient();
  if (!s || !providerId || !ctx.tenantId) return;
  await s
    .from("providers")
    .update({
      name: str(formData, "name") || "Unnamed",
      credential: str(formData, "credential") || null,
      npi: str(formData, "npi") || null,
      specialty: str(formData, "specialty") || null,
      status: str(formData, "status") || "enrolling",
      license_states: str(formData, "states")
        .split(",")
        .map((x) => x.trim().toUpperCase())
        .filter(Boolean),
    })
    .eq("id", providerId)
    .eq("tenant_id", ctx.tenantId);
  await recordAudit({ action: "edit", resourceType: "provider", resourceId: providerId,
    after: { name: str(formData, "name"), status: str(formData, "status"), npi: str(formData, "npi") || null } });
  revalidatePath(`/app/providers/${providerId}`);
  redirect(`/app/providers/${providerId}`);
}

export async function deleteProvider(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const s = await createSupabaseServerClient();
  if (!s || !providerId || !ctx.tenantId) return;
  await recordAudit({ action: "delete", resourceType: "provider", resourceId: providerId });
  await s.from("providers").delete().eq("id", providerId).eq("tenant_id", ctx.tenantId);
  revalidatePath("/app/providers");
  redirect("/app/providers");
}
