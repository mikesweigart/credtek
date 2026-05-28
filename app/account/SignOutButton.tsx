"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "../_lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    const supabase = supabaseBrowser();
    if (supabase) await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <button type="button" className="acct-btn-primary" onClick={signOut} disabled={busy}>
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
