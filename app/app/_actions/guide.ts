"use server";

// Onboarding: stamp profiles.guide_seen_at the first time a user
// dismisses or finishes the Cred welcome tour. Called fire-and-forget
// from the client (PortalGuide) inside a transition.
//
// Safety:
//  • Never throws — the UI must not break if this fails.
//  • No-ops gracefully when migration 0005 hasn't run yet (the column
//    is missing → PostgREST errors → we swallow it). Until then the
//    client's localStorage fallback carries the "seen" state.
//  • RLS profile_update_self lets a user write only their own row, so
//    the plain (non-admin) server client is the correct, least-privilege
//    choice here.

import { createSupabaseServerClient } from "../../_lib/supabase/serverClient";
import { getSessionContext } from "../../_lib/data/workspace";

export async function markGuideSeen(): Promise<{ ok: boolean }> {
  try {
    const ctx = await getSessionContext();
    if (!ctx.userId) return { ok: false };
    // Already stamped — nothing to do (idempotent, avoids a write).
    if (ctx.guideSeenAt) return { ok: true };

    const s = await createSupabaseServerClient();
    if (!s) return { ok: false };

    const { error } = await s
      .from("profiles")
      .update({ guide_seen_at: new Date().toISOString() })
      .eq("id", ctx.userId)
      .is("guide_seen_at", null);

    return { ok: !error };
  } catch {
    // Column missing (pre-0005) or any transient failure — degrade to the
    // client's localStorage fallback. Onboarding still behaves correctly.
    return { ok: false };
  }
}
