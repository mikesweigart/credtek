import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

// Cookie-based Supabase client for Server Components, Server Actions,
// and Route Handlers. Respects the signed-in user's session (and RLS)
// by reading/writing the auth cookies. Returns null if env not set.
//
// Distinct from server.ts: that one is the service-role admin client
// (bypasses RLS, for trusted server tasks). This one acts AS the user.
export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component (read-only cookies). Safe to
          // ignore — the middleware refreshes the session cookie instead.
        }
      },
    },
  });
}

/** Convenience: the current authenticated user, or null. */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
