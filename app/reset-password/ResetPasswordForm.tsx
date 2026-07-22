"use client";

// Step 2 of password recovery. The user arrived from the emailed link, so
// /auth/callback has already exchanged the code for a session — setting
// the new password is just updateUser() against that session.
//
// We check for that session on mount rather than waiting for submit, so
// an expired or already-used link says so immediately instead of letting
// someone type a new password and then fail.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../_lib/supabase/client";

type Msg = { kind: "error" | "info"; text: string } | null;
type Ready = "checking" | "ok" | "no-session";

const MIN_LENGTH = 8;

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const [ready, setReady] = useState<Ready>("checking");

  useEffect(() => {
    const supabase = supabaseBrowser();
    if (!supabase) {
      setReady("no-session");
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      setReady(data.user ? "ok" : "no-session");
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (password.length < MIN_LENGTH) {
      setMsg({ kind: "error", text: `Use at least ${MIN_LENGTH} characters.` });
      return;
    }
    if (password !== confirm) {
      setMsg({ kind: "error", text: "Those two passwords don't match." });
      return;
    }

    const supabase = supabaseBrowser();
    if (!supabase) {
      setMsg({ kind: "error", text: "Authentication isn't configured yet." });
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMsg({ kind: "error", text: error.message });
      } else {
        setMsg({ kind: "info", text: "Password updated. Taking you to your workspace…" });
        router.push("/app");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="signin-shell">
      <div className="signin-card">
        <Link href="/" className="signin-logo" aria-label="CredTek home">
          <div className="signin-logo-mark">C</div>
          <div className="signin-logo-text">CredTek</div>
        </Link>

        {ready === "no-session" ? (
          <>
            <h1 className="signin-h1">That link has expired.</h1>
            <p className="signin-p">
              Reset links are good for one hour and can only be used once. Request
              a fresh one and it&apos;ll work.
            </p>
            <div className="signin-foot">
              <Link className="signin-link" href="/forgot-password">
                Send a new reset link →
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="signin-h1">Choose a new password.</h1>
            <p className="signin-p">
              Make it at least {MIN_LENGTH} characters. You&apos;ll go straight to
              your workspace once it&apos;s saved.
            </p>

            <form className="signin-form" onSubmit={onSubmit}>
              <div className="signin-field">
                <label htmlFor="rp-pw">New password</label>
                <input
                  id="rp-pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={MIN_LENGTH}
                  required
                  disabled={ready === "checking"}
                />
              </div>

              <div className="signin-field">
                <label htmlFor="rp-confirm">Confirm new password</label>
                <input
                  id="rp-confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  minLength={MIN_LENGTH}
                  required
                  disabled={ready === "checking"}
                />
              </div>

              {msg && <div className={`signin-msg signin-msg-${msg.kind}`}>{msg.text}</div>}

              <button
                className="signin-submit"
                type="submit"
                disabled={busy || ready === "checking"}
              >
                {busy ? "Saving…" : ready === "checking" ? "Checking your link…" : "Save password →"}
              </button>
            </form>

            <div className="signin-foot">
              <Link className="signin-link" href="/sign-in">
                Back to sign in →
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="signin-aside">
        <div className="signin-aside-eyebrow">CredTek</div>
        <div className="signin-aside-quote">
          Every credential, verification, and audit entry stays exactly as you
          left it. Only the password changes.
        </div>
        <div className="signin-aside-attr">— Your credentialing workspace</div>
      </div>
    </div>
  );
}
