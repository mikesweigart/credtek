// Expirables — every license + credential across every provider that
// expires inside the rolling 90-day window. The bread-and-butter view
// credentialing managers live in.

import { createSupabaseServerClient } from "../supabase/serverClient";
import { currentTenantId } from "./workspace";

export type ExpirableRow = {
  id: string; // composite: kind:db_id
  kind: "license" | "credential";
  label: string;            // e.g. "TX state license · #PSY-44219" or "DEA · AJ1234567"
  what: string;             // shorter classification
  providerId: string;
  providerName: string;
  providerCredential: string | null;
  state: string | null;     // for licenses
  expiresOn: string | null; // ISO date string
  daysUntil: number | null; // negative = already expired
  bucket: "expired" | "30" | "60" | "90";
};

function daysFromNow(iso: string): number {
  const today = new Date(); today.setHours(0,0,0,0);
  const then = new Date(iso); then.setHours(0,0,0,0);
  return Math.round((then.getTime() - today.getTime()) / 86_400_000);
}
function bucket(d: number): ExpirableRow["bucket"] {
  if (d < 0) return "expired";
  if (d <= 30) return "30";
  if (d <= 60) return "60";
  return "90";
}

export async function listExpirables(): Promise<ExpirableRow[]> {
  const s = await createSupabaseServerClient();
  const tid = await currentTenantId();
  if (!s || !tid) return [];

  const ninetyOut = new Date(); ninetyOut.setHours(0,0,0,0);
  ninetyOut.setDate(ninetyOut.getDate() + 90);
  const cutoff = ninetyOut.toISOString().slice(0, 10);

  // Licenses (joined to provider).
  const { data: licData } = await s
    .from("provider_licenses")
    .select("id, state, license_number, expires_on, provider_id, providers ( name, credential )")
    .eq("tenant_id", tid)
    .not("expires_on", "is", null)
    .lte("expires_on", cutoff)
    .order("expires_on", { ascending: true });

  // Credentials (joined to provider).
  const { data: credData } = await s
    .from("provider_credentials")
    .select("id, kind, identifier, expires_on, provider_id, providers ( name, credential )")
    .eq("tenant_id", tid)
    .not("expires_on", "is", null)
    .lte("expires_on", cutoff)
    .order("expires_on", { ascending: true });

  const out: ExpirableRow[] = [];

  function provName(p: unknown): { name: string; cred: string | null; id: string } {
    if (Array.isArray(p) && p[0]) {
      return { name: (p[0] as { name?: string }).name ?? "—", cred: (p[0] as { credential?: string }).credential ?? null, id: "" };
    }
    if (p && typeof p === "object") {
      return { name: (p as { name?: string }).name ?? "—", cred: (p as { credential?: string }).credential ?? null, id: "" };
    }
    return { name: "—", cred: null, id: "" };
  }

  for (const r of licData ?? []) {
    if (!r.expires_on) continue;
    const d = daysFromNow(r.expires_on as string);
    const pn = provName((r as { providers: unknown }).providers);
    out.push({
      id: `license:${r.id}`,
      kind: "license",
      label: `${r.state} state license${r.license_number ? ` · #${r.license_number}` : ""}`,
      what: "State license",
      providerId: r.provider_id as string,
      providerName: pn.name,
      providerCredential: pn.cred,
      state: (r.state as string) ?? null,
      expiresOn: r.expires_on as string,
      daysUntil: d,
      bucket: bucket(d),
    });
  }

  for (const r of credData ?? []) {
    if (!r.expires_on) continue;
    const d = daysFromNow(r.expires_on as string);
    const pn = provName((r as { providers: unknown }).providers);
    out.push({
      id: `credential:${r.id}`,
      kind: "credential",
      label: `${labelFor(r.kind as string)}${r.identifier ? ` · ${r.identifier}` : ""}`,
      what: labelFor(r.kind as string),
      providerId: r.provider_id as string,
      providerName: pn.name,
      providerCredential: pn.cred,
      state: null,
      expiresOn: r.expires_on as string,
      daysUntil: d,
      bucket: bucket(d),
    });
  }

  // Soonest first (expired at top), then alpha.
  out.sort((a, b) => {
    const da = a.daysUntil ?? 0;
    const db = b.daysUntil ?? 0;
    if (da !== db) return da - db;
    return a.providerName.localeCompare(b.providerName);
  });

  return out;
}

function labelFor(kind: string): string {
  switch (kind) {
    case "state_license": return "State license";
    case "dea":           return "DEA registration";
    case "cds":           return "CDS registration";
    case "board_cert":    return "Board certification";
    case "coi_malpractice": return "Malpractice (COI)";
    case "caqh":          return "CAQH attestation";
    default:              return "Credential";
  }
}
