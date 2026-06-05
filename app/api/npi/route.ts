// NPPES NPI lookup proxy.
//
// The NPPES registry (https://npiregistry.cms.hhs.gov) is the federal primary
// source for NPIs. The /get-started wizard calls this on a valid NPI to
// pre-fill the provider card with the verified legal name, credential, and
// primary practice state — less typing, fewer errors, data that already
// matches the source of truth.
//
// We proxy server-side rather than calling NPPES from the browser because the
// registry's CORS posture is unreliable and a proxy lets us validate, rate
// limit, cache, and time out cleanly. No PHI is involved — NPI + the public
// registry record only.

import { NextResponse } from "next/server";
import { isValidNpi, mapNppesCredential, type NppesResult } from "../../_components/intakeData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NPPES_URL = "https://npiregistry.cms.hhs.gov/api/";
const LOOKUP_TIMEOUT_MS = 6000;

// Per-IP token bucket — a lookup is cheap, so allow a healthy burst while a
// user fills a roster, but cap abuse.
const BUCKET_MAX = 40;
const BUCKET_WINDOW_MS = 60 * 1000;
const buckets = new Map<string, number[]>();

// Tiny in-memory cache so re-typing or revisiting the same NPI doesn't re-hit
// NPPES. Bounded; entries expire after an hour.
const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_MAX = 500;
const cache = new Map<string, { at: number; data: NppesResult }>();

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anon";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = (buckets.get(ip) ?? []).filter((t) => now - t < BUCKET_WINDOW_MS);
  if (bucket.length >= BUCKET_MAX) {
    buckets.set(ip, bucket);
    return true;
  }
  bucket.push(now);
  buckets.set(ip, bucket);
  return false;
}

/** NPPES returns ALL-CAPS names — title-case them while respecting hyphens/apostrophes. */
function titleCase(s: string): string {
  return String(s || "")
    .toLowerCase()
    .replace(/(^|[\s'’-])([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase());
}

type NppesAddress = { address_purpose?: string; state?: string };
type NppesTaxonomy = { desc?: string; state?: string; primary?: boolean };
type NppesBasic = {
  first_name?: string;
  last_name?: string;
  credential?: string;
  organization_name?: string;
};
type NppesRecord = {
  enumeration_type?: string;
  number?: number | string;
  basic?: NppesBasic;
  addresses?: NppesAddress[];
  taxonomies?: NppesTaxonomy[];
};

function normalize(rec: NppesRecord, npi: string): NppesResult {
  const basic = rec.basic ?? {};
  const taxonomies = Array.isArray(rec.taxonomies) ? rec.taxonomies : [];
  const primaryTax = taxonomies.find((t) => t.primary) ?? taxonomies[0];
  const addresses = Array.isArray(rec.addresses) ? rec.addresses : [];
  const location = addresses.find((a) => a.address_purpose === "LOCATION") ?? addresses[0];
  const primaryState = (location?.state || primaryTax?.state || "").toUpperCase().slice(0, 2);
  const specialty = primaryTax?.desc || "";
  const isOrg = rec.enumeration_type === "NPI-2";

  if (isOrg) {
    const organizationName = titleCaseOrg(basic.organization_name || "");
    return {
      ok: true,
      found: true,
      npi,
      enumerationType: "NPI-2",
      organizationName,
      specialty,
      primaryState,
      displayName: organizationName || "Organization",
    };
  }

  const firstName = titleCase(basic.first_name || "");
  const lastName = titleCase(basic.last_name || "");
  const credentialRaw = (basic.credential || "").trim();
  const credentialMapped = mapNppesCredential(credentialRaw, specialty);
  const namePart = `${firstName} ${lastName}`.trim();
  const displayName = credentialRaw ? `${namePart}, ${credentialRaw}` : namePart;

  return {
    ok: true,
    found: true,
    npi,
    enumerationType: "NPI-1",
    firstName,
    lastName,
    credentialRaw,
    credentialMapped,
    specialty,
    primaryState,
    displayName,
  };
}

/** Orgs are often legitimately all-caps acronyms — only title-case word-y names. */
function titleCaseOrg(s: string): string {
  const v = String(s || "").trim();
  if (!v) return "";
  // If it has lowercase already, leave as-is; if it's a long all-caps phrase, soften it.
  if (/[a-z]/.test(v)) return v;
  return v.length > 5 ? titleCase(v) : v;
}

export async function GET(req: Request) {
  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, found: false, error: "rate-limited" } satisfies NppesResult,
      { status: 429, headers: { "Retry-After": "30" } },
    );
  }

  const url = new URL(req.url);
  const raw = url.searchParams.get("number") || "";
  const npi = raw.replace(/\D/g, "");
  if (!isValidNpi(npi)) {
    return NextResponse.json(
      { ok: false, found: false, error: "invalid-npi" } satisfies NppesResult,
      { status: 400 },
    );
  }

  // Cache hit?
  const cached = cache.get(npi);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), LOOKUP_TIMEOUT_MS);
  try {
    const qs = new URLSearchParams({ version: "2.1", number: npi });
    const res = await fetch(`${NPPES_URL}?${qs.toString()}`, {
      signal: ctrl.signal,
      headers: { accept: "application/json" },
    });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, found: false, error: "lookup-failed" } satisfies NppesResult,
        { status: 502 },
      );
    }
    const json = (await res.json()) as { result_count?: number; results?: NppesRecord[] };
    const rec = (json.results && json.results[0]) || null;
    const data: NppesResult =
      !rec || !json.result_count
        ? { ok: true, found: false, npi }
        : normalize(rec, npi);

    // Cache (bounded — drop the oldest when full).
    if (cache.size >= CACHE_MAX) {
      const oldest = cache.keys().next().value;
      if (oldest) cache.delete(oldest);
    }
    cache.set(npi, { at: Date.now(), data });

    return NextResponse.json(data);
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      { ok: false, found: false, error: aborted ? "timeout" : "lookup-failed" } satisfies NppesResult,
      { status: aborted ? 504 : 502 },
    );
  } finally {
    clearTimeout(timer);
  }
}
