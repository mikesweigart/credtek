// Provider reads/writes for the real app. Scoped to the signed-in user's
// tenant TWICE, on purpose: by RLS on the cookie-bound Supabase client,
// and again by an explicit tenant_id filter on every read. RLS remains the
// primary control — the explicit filter is defence in depth, so that one
// mis-configured policy can't become a cross-customer data leak. Reads
// fail CLOSED (empty/null) when there's no tenant in session.

import { createSupabaseServerClient } from "../supabase/serverClient";
import { currentTenantId } from "./workspace";
import { reportQueryError } from "./observe";

export type DbProvider = {
  id: string;
  slug: string;
  name: string;
  credential: string | null;
  npi: string | null;
  status: "active" | "enrolling" | "supervision" | "flag";
  status_label: string | null;
  specialty: string | null;
  license_states: string[];
  meta: string | null;
  created_at: string;
  // Present once migration 0003 has run; read defensively otherwise.
  credentialing_stage?:
    | "intake"
    | "psv"
    | "privileging"
    | "committee"
    | "enrollment"
    | "approved";
  // Present once migration 0004 has run; falls back to created_at.
  stage_entered_at?: string | null;
};

// Explicit column projections — we never `select("*")` for the list.
// Two reasons: (1) "*" over-fetches and means every column we add later
// silently bloats every list payload; (2) we want a stable, reviewed set.
// Two projections because the app must work BEFORE and AFTER the stage
// migrations: 0003 adds `credentialing_stage`, 0004 adds `stage_entered_at`.
// Try the full set first; if PostgREST reports the column doesn't exist
// yet (code 42703), fall back to the base set.
const BASE_PROVIDER_COLS =
  "id, slug, name, credential, npi, status, status_label, specialty, license_states, meta, created_at";
const FULL_PROVIDER_COLS = `${BASE_PROVIDER_COLS}, credentialing_stage, stage_entered_at`;

// Hard ceiling on a single fetch so one tenant's growth can't OOM a
// render or blow the response size. The paginated list view passes a
// smaller explicit limit; aggregate callers (dashboard, follow-ups) take
// the default. TODO(scale): once any tenant realistically approaches this
// many active providers, move those aggregates to SQL count()/avg() rather
// than pulling every row into the Node process.
const MAX_PROVIDERS_FETCH = 1000;

function isMissingColumn(error: { code?: string } | null | undefined): boolean {
  return error?.code === "42703";
}

export type ListProvidersOptions = {
  /** Max rows to return. Clamped to [1, MAX_PROVIDERS_FETCH]. */
  limit?: number;
  /** Rows to skip (for pagination). */
  offset?: number;
};

export async function listProviders(
  opts: ListProvidersOptions = {},
): Promise<DbProvider[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const tid = await currentTenantId();
  if (!tid) return [];

  const limit = Math.min(
    Math.max(opts.limit ?? MAX_PROVIDERS_FETCH, 1),
    MAX_PROVIDERS_FETCH,
  );
  const offset = Math.max(opts.offset ?? 0, 0);

  // Full projection first; fall back to base columns only if the stage
  // columns don't exist yet. Any OTHER error is real → return empty.
  for (const cols of [FULL_PROVIDER_COLS, BASE_PROVIDER_COLS]) {
    const { data, error } = await supabase
      .from("providers")
      .select(cols)
      .eq("tenant_id", tid)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (!error && data) return data as unknown as DbProvider[];
    if (!isMissingColumn(error)) break;
  }
  return [];
}

/**
 * Exact count of providers visible to the signed-in tenant (RLS-scoped).
 * Uses a HEAD request so no rows travel over the wire — it's purely for
 * pagination totals. Returns 0 when the backend isn't configured.
 */
export async function countProviders(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return 0;
  const tid = await currentTenantId();
  if (!tid) return 0;
  const { count, error } = await supabase
    .from("providers")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tid);
  if (error) reportQueryError("countProviders", error);
  if (error || count == null) return 0;
  return count;
}

export async function getProviderById(id: string): Promise<DbProvider | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const tid = await currentTenantId();
  if (!tid) return null;
  // The tenant filter is what stops a guessed/leaked provider UUID from
  // resolving across customers if RLS is ever mis-configured.
  const { data } = await supabase
    .from("providers")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tid)
    .maybeSingle();
  return (data as DbProvider) ?? null;
}

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}
