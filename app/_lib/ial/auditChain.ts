// Hash-chain helper for audit log entries (IAL §9). Each entry's
// log_hash is SHA-256(prev_log_hash || canonical_json(this_row)).
// Tampering with any historical row breaks every subsequent hash and is
// detectable in O(n) by recomputing the chain.
//
// Web Crypto SubtleCrypto is available in both Node 20+ and the Edge
// runtime, so this module is portable across server components, route
// handlers, and background jobs.

import type { AuditEntry } from "./types";

/**
 * Canonical JSON: sorted keys, no whitespace. Required so the same
 * logical row hashes identically across services. Pulled out as its own
 * function so we can swap in a faster implementation later if needed.
 */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(value, sortReplacer);
}

function sortReplacer(_key: string, value: unknown): unknown {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    value instanceof Date
  ) {
    return value;
  }
  const sorted: Record<string, unknown> = {};
  for (const k of Object.keys(value as Record<string, unknown>).sort()) {
    sorted[k] = (value as Record<string, unknown>)[k];
  }
  return sorted;
}

/** Lowercase hex string of SHA-256(input). */
export async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Compute the log_hash for a candidate audit entry. The entry's own
 * `logHash` field is excluded from the hash input — it's the output, not
 * an input.
 */
export async function computeLogHash(args: {
  prevLogHash: string | null;
  /** Everything that goes into the row except log_hash itself. */
  entry: Omit<AuditEntry, "logHash">;
}): Promise<string> {
  const canonical = canonicalJson(args.entry);
  return sha256Hex((args.prevLogHash ?? "") + canonical);
}

/**
 * Verify a chain of audit entries. Returns the index of the first
 * tampered (or out-of-order) row, or -1 if the chain is intact.
 */
export async function verifyChain(entries: AuditEntry[]): Promise<number> {
  let prev: string | null = null;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (e.prevLogHash !== prev) return i;
    const { logHash: _ignored, ...rest } = e;
    void _ignored;
    const expected = await computeLogHash({ prevLogHash: prev, entry: rest });
    if (expected !== e.logHash) return i;
    prev = e.logHash;
  }
  return -1;
}
