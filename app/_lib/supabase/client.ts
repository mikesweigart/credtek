import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser Supabase client using the ANON public key. Safe to ship to
// the client — RLS policies enforce per-tenant access. Used by the
// authenticated app surfaces (sign-in, the real dashboard) once env
// vars are set.
//
// Returns null when env vars aren't present so client components can
// branch on configuration without throwing.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let cached: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!cached) {
    cached = createClient(url, anonKey);
  }
  return cached;
}

/** True when the public client is wired (env vars present). */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}
