"use client";

// Step 1 of password recovery: request the reset email. Supabase mails a
// link back through /auth/callback, which exchanges the code for a
// session and lands the user on /reset-password to choose a new one.
//
// Note the deliberate non-answer below: we say the same thing whether or
// not the address has an account. Confirming which emails are registered
// is an account-enumeration leak, and this is healthcare software.

import Link from "next/link";
import { useState } from "react";
import { supabaseBrowser, isSupabaseConfigured } from "../_lib/supabase/client";

type Msg = { kind: "error" | "info"; text: string } | null;

export function ForgotPasswordForm() {
  const configured = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const supabase = supabaseBrowser();
    if (!supabase) {
      setMsg({ kind: "error", text: "Authentication isn't configured yet." });
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error && /rate|too many/i.test(error.message)) {
        setMsg({
          kind: "error",
          text: "Too many attempts just now. Wait a minute and try again.",
        });
      } else {
        setSent(true);
        setMsg({
          kind: "info",
          text: `If ${email} has a CredTek account, a reset link is on its way. The link is good for one hour.`,
        });
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
        <h1 className="signin-h1">Reset your password.</h1>
        <p className="signin-p">
          Enter the email you use for CredTek and we&apos;ll send you a link to
          set a new password.
        </p>

        <form className="signin-form" onSubmit={onSubmit}>
          <div className="signin-field">
            <label htmlFor="fp-email">Work email</label>
            <input
              id="fp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourgroup.com"
              autoComplete="email"
              required
            />
          </div>

          {msg && <div className={`signin-msg signin-msg-${msg.kind}`}>{msg.text}</div>}

          <button className="signin-submit" type="submit" disabled={busy}>
            {busy ? "Sending…" : sent ? "Resend the link →" : "Send reset link →"}
          </button>
        </form>

        <div className="signin-foot">
          Remembered it?{" "}
          <Link className="signin-link" href="/sign-in">
            Back to sign in →
          </Link>
        </div>

        {!configured && (
          <div className="signin-demo-note">
            ✦ Auth not configured in this environment yet.
          </div>
        )}
      </div>

      <div className="signin-aside">
        <div className="signin-aside-eyebrow">CredTek</div>
        <div className="signin-aside-quote">
          Locked out is not the same as losing your work. Your roster,
          verifications, and audit trail are exactly where you left them.
        </div>
        <div className="signin-aside-attr">— Your credentialing workspace</div>
      </div>
    </div>
  );
}
