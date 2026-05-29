"use server";

// Server actions for the provider credentialing workspace. Every
// mutation is RLS-scoped to the tenant AND gated by role — read-only
// roles (client/finance/readonly) get a silent no-op (UI also hides the
// controls). Native <form action> handlers — progressive enhancement.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  revalidatePath(`/app/providers/${providerId}`);
}

export async function deleteSubRecord(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const table = str(formData, "table");
  const id = str(formData, "id");
  const allowed = ["provider_licenses", "provider_credentials", "documents", "enrollments"];
  const s = await createSupabaseServerClient();
  if (!s || !providerId || !id || !allowed.includes(table)) return;
  await s.from(table).delete().eq("id", id);
  revalidatePath(`/app/providers/${providerId}`);
}

const STAGE_SEQ = ["intake", "psv", "privileging", "committee", "enrollment", "approved"];

export async function advanceStage(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const current = str(formData, "current") || "intake";
  const s = await createSupabaseServerClient();
  if (!s || !providerId) return;
  const idx = STAGE_SEQ.indexOf(current);
  const next = STAGE_SEQ[Math.min(idx + 1, STAGE_SEQ.length - 1)];
  // stage_entered_at resets the SLA clock; both columns exist post-0003/0004.
  await s.from("providers").update({ credentialing_stage: next }).eq("id", providerId);
  await s.from("providers").update({ stage_entered_at: new Date().toISOString() }).eq("id", providerId);
  revalidatePath(`/app/providers/${providerId}`);
  revalidatePath("/app");
}

export async function approveProvider(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const s = await createSupabaseServerClient();
  if (!s || !ctx.tenantId || !providerId) return;

  await s.from("providers").update({ status: "active" }).eq("id", providerId);
  await s.from("providers").update({ credentialing_stage: "approved" }).eq("id", providerId);
  await s.from("providers").update({ stage_entered_at: new Date().toISOString() }).eq("id", providerId);

  // Tamper-evident audit entry for the committee approval (best-effort).
  try {
    const { data: last } = await s
      .from("audit_log")
      .select("log_hash")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const prev = (last?.log_hash as string) ?? null;
    const payload = `${prev ?? "genesis"}|provider:${providerId}|approve|${Date.now()}`;
    let h = 2166136261;
    for (let i = 0; i < payload.length; i++) {
      h ^= payload.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const logHash = (h >>> 0).toString(16).padStart(8, "0") + Date.now().toString(16);
    await s.from("audit_log").insert({
      tenant_id: ctx.tenantId,
      actor_id: ctx.userId,
      actor_type: "user",
      resource_type: "provider",
      resource_id: providerId,
      action: "approve",
      after_state: { status: "active", stage: "approved" },
      metadata: { event: "credentialing_committee_approval" },
      prev_log_hash: prev,
      log_hash: logHash,
    });
  } catch {
    /* audit is best-effort; approval still succeeds */
  }

  revalidatePath(`/app/providers/${providerId}`);
  revalidatePath("/app");
}

export async function updateProvider(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const s = await createSupabaseServerClient();
  if (!s || !providerId) return;
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
    .eq("id", providerId);
  revalidatePath(`/app/providers/${providerId}`);
  redirect(`/app/providers/${providerId}`);
}

export async function deleteProvider(formData: FormData) {
  const ctx = await editorCtx();
  if (!ctx) return;
  const providerId = str(formData, "providerId");
  const s = await createSupabaseServerClient();
  if (!s || !providerId) return;
  await s.from("providers").delete().eq("id", providerId);
  revalidatePath("/app/providers");
  redirect("/app/providers");
}
