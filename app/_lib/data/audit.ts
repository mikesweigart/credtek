import "server-only";

// Tamper-evident audit trail.
//
// Credentialing is a regulated workflow: during an NCQA or payer audit the
// question is not "what does the record say now" but "who changed it, when,
// and can you prove the log wasn't edited afterwards". Until now only
// committee approvals were logged, so a provider could be advanced through
// every stage, edited, or deleted outright and leave no trace. That gap is
// the kind of thing that turns a routine audit into a finding.
//
// Design notes:
//
//  • Hash chain is PER TENANT. Each entry commits to the previous entry's
//    hash, so removing or altering a row breaks every hash after it. A
//    shared chain across tenants would be unverifiable (one customer's
//    entries would be needed to validate another's) and would leak
//    activity timing between customers.
//
//  • SHA-256, not the previous 32-bit FNV-1a. A 32-bit digest has ~65k
//    collision resistance by birthday bound — trivially forgeable, which
//    defeats the entire point of calling the log tamper-evident. This
//    changes the algorithm, so entries written before this commit do not
//    chain-verify against later ones. That is acceptable precisely because
//    we are pre-launch: there is no real audit history to preserve yet,
//    and this is the last moment where switching is free.
//
//  • Best-effort by design. A failure to write the audit row must not fail
//    the user's action — but it IS reported, never silently swallowed.

import { createHash } from "crypto";
import { createSupabaseServerClient } from "../supabase/serverClient";
import { getSessionContext } from "./workspace";
import { reportQueryError } from "./observe";

/** Mirrors the audit_action enum in migration 0001. */
export type AuditAction =
  | "view"
  | "edit"
  | "submit"
  | "approve"
  | "reject"
  | "auth"
  | "transition"
  | "external_call"
  | "create"
  | "delete";

export type AuditEntry = {
  action: AuditAction;
  /** e.g. "provider", "facility", "screening", "profile" */
  resourceType: string;
  resourceId: string;
  /** State before the change, where cheaply available. */
  before?: unknown;
  /** State after the change. */
  after?: unknown;
  metadata?: Record<string, unknown>;
};

export async function recordAudit(entry: AuditEntry): Promise<void> {
  try {
    const ctx = await getSessionContext();
    if (!ctx.userId || !ctx.tenantId) return;
    const s = await createSupabaseServerClient();
    if (!s) return;

    // Previous link in THIS tenant's chain.
    const { data: last } = await s
      .from("audit_log")
      .select("log_hash")
      .eq("tenant_id", ctx.tenantId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const prev = (last?.log_hash as string) ?? null;

    const at = new Date().toISOString();
    // The digest commits to the previous hash AND the full content of this
    // entry, so neither the order nor the contents can be altered without
    // detection.
    const payload = JSON.stringify({
      prev: prev ?? "genesis",
      tenant: ctx.tenantId,
      actor: ctx.userId,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      before: entry.before ?? null,
      after: entry.after ?? null,
      at,
    });
    const logHash = createHash("sha256").update(payload).digest("hex");

    const { error } = await s.from("audit_log").insert({
      tenant_id: ctx.tenantId,
      actor_id: ctx.userId,
      actor_type: "user",
      resource_type: entry.resourceType,
      resource_id: entry.resourceId,
      action: entry.action,
      before_state: entry.before ?? null,
      after_state: entry.after ?? null,
      metadata: { ...(entry.metadata ?? {}), hashed_at: at },
      prev_log_hash: prev,
      log_hash: logHash,
    });
    if (error) reportQueryError("recordAudit", error);
  } catch (e) {
    // Never let auditing break the action it is describing.
    reportQueryError("recordAudit", e);
  }
}
