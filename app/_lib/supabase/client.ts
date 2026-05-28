import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Browser Supabase client (anon key). Uses @supabase/ssr's
// createBrowserClient so the session is stored in cookies that the
// server client + middleware can read — keeping SSR and the browser
// in sync. RLS enforces per-tenant access. Returns null if unconfigured.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let cached: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!cached) {
    cached = createBrowserClient(url, anonKey);
  }
  return cached;
}

/** True when the public client is wired (env vars present). */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}
