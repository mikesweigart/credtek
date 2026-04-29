"use client";

// Mock sign-in. Visual surface only — no auth enforcement, no real
// session. When we wire Supabase Auth in the next session, this UI
// stays the same and we plug in a real signInWithPassword() call.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("marisol@mindscape.health");
  const [password, setPassword] = useState("••••••••");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // No real auth yet — go to dashboard after a tiny delay so the
    // submit feels real to a partner watching the demo.
    setTimeout(() => router.push("/dashboard"), 600);
  };

  return (
    <div className="signin-shell">
      <div className="signin-card">
        <div className="signin-logo">
          <div className="signin-logo-mark">C</div>
          <div className="signin-logo-text">CredTek</div>
        </div>
        <h1 className="signin-h1">Welcome back.</h1>
        <p className="signin-p">
          Sign in to continue managing your credentialing workspace.
        </p>

        <form className="signin-form" onSubmit={onSubmit}>
          <div className="signin-field">
            <label htmlFor="signin-email">Email</label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourgroup.com"
              required
            />
          </div>
          <div className="signin-field">
            <div className="signin-field-top">
              <label htmlFor="signin-pw">Password</label>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="signin-link-small"
              >
                Forgot?
              </a>
            </div>
            <input
              id="signin-pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="signin-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Signing in…" : "Sign in →"}
          </button>

          <div className="signin-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="signin-sso"
            onClick={(e) => {
              e.preventDefault();
              setSubmitting(true);
              setTimeout(() => router.push("/dashboard"), 600);
            }}
          >
            Continue with Microsoft 365
          </button>
        </form>

        <div className="signin-foot">
          New to CredTek?{" "}
          <Link href="/welcome" className="signin-link">
            Set up your workspace →
          </Link>
        </div>

        <div className="signin-demo-note">
          ✦ Demo mode — any email + password works. No data is stored.
        </div>
      </div>

      <div className="signin-aside">
        <div className="signin-aside-eyebrow">CredTek</div>
        <div className="signin-aside-quote">
          &ldquo;The supervision tracker alone gave us back two days a
          week. We added 40 providers last quarter and our credentialing
          team didn&apos;t grow.&rdquo;
        </div>
        <div className="signin-aside-attr">
          — Director of Credentialing, 200-provider BH rollup
        </div>
      </div>
    </div>
  );
}
