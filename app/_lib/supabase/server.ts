import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client using the SERVICE ROLE key.
//
// IMPORTANT: this bypasses Row-Level Security. It must ONLY ever run
// server-side (route handlers, server components, server actions). The
// `import "server-only"` above makes the build fail if this module is
// ever pulled into a client bundle.
//
// Returns null when env vars aren't set, so the app degrades gracefully
// to mock data instead of crashing before the backend is configured.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

/** True when the service-role backend is wired (env vars present). */
export function isBackendConfigured(): boolean {
  return Boolean(url && serviceKey);
}
