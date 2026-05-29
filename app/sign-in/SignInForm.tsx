"use client";

// Real Supabase auth — supports BOTH email+password and magic link.
// Cookie-based session via @supabase/ssr, so the server + middleware
// stay in sync. On success the user lands on /account.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser, isSupabaseConfigured } from "../_lib/supabase/client";

type Mode = "password" | "magic";
type Msg = { kind: "error" | "info"; text: string } | null;

export function SignInForm() {
  const router = useRouter();
  const configured = isSupabaseConfigured();

  const [mode, setMode] = useState<Mode>("password");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  function redirectTo() {
    return `${window.location.origin}/auth/callback?next=/app`;
  }

  async function onPassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const supabase = supabaseBrowser();
    if (!supabase) {
      setMsg({ kind: "error", text: "Authentication isn't configured yet." });
      return;
    }
    setBusy(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: orgName ? { org_name: orgName } : undefined,
            emailRedirectTo: redirectTo(),
          },
        });
        if (error) setMsg({ kind: "error", text: error.message });
        else if (data.session) {
          router.push("/app");
          router.refresh();
        } else {
          setMsg({
            kind: "info",
            text: "Account created. Check your email to confirm, then sign in.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMsg({ kind: "error", text: error.message });
        else {
          router.push("/app");
          router.refresh();
        }
      }
    } finally {
      setBusy(false);
    }
  }

  async function onMagic(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const supabase = supabaseBrowser();
    if (!supabase) {
      setMsg({ kind: "error", text: "Authentication isn't configured yet." });
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo(),
          data: orgName ? { org_name: orgName } : undefined,
        },
      });
      if (error) setMsg({ kind: "error", text: error.message });
      else
        setMsg({
          kind: "info",
          text: `Magic link sent to ${email}. Check your inbox and click the link to sign in.`,
        });
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
        <h1 className="signin-h1">
          {isSignUp ? "Create your workspace." : "Welcome back."}
        </h1>
        <p className="signin-p">
          {isSignUp
            ? "Set up your credentialing workspace in seconds."
            : "Sign in to continue managing your credentialing workspace."}
        </p>

        {/* Mode toggle */}
        <div className="signin-modes" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "password"}
            className={`signin-mode${mode === "password" ? " is-active" : ""}`}
            onClick={() => {
              setMode("password");
              setMsg(null);
            }}
          >
            Password
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "magic"}
            className={`signin-mode${mode === "magic" ? " is-active" : ""}`}
            onClick={() => {
              setMode("magic");
              setMsg(null);
            }}
          >
            Magic link
          </button>
        </div>

        <form className="signin-form" onSubmit={mode === "password" ? onPassword : onMagic}>
          {isSignUp && (
            <div className="signin-field">
              <label htmlFor="signin-org">Group / organization name</label>
              <input
                id="signin-org"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Cascade Medical Group"
              />
            </div>
          )}

          <div className="signin-field">
            <label htmlFor="signin-email">Work email</label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourgroup.com"
              autoComplete="email"
              required
            />
          </div>

          {mode === "password" && (
            <div className="signin-field">
              <label htmlFor="signin-pw">Password</label>
              <input
                id="signin-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                minLength={6}
                required
              />
            </div>
          )}

          {msg && (
            <div className={`signin-msg signin-msg-${msg.kind}`}>{msg.text}</div>
          )}

          <button className="signin-submit" type="submit" disabled={busy}>
            {busy
              ? "Working…"
              : mode === "magic"
              ? "Send magic link →"
              : isSignUp
              ? "Create workspace →"
              : "Sign in →"}
          </button>
        </form>

        {mode === "password" && (
          <div className="signin-foot">
            {isSignUp ? "Already have a workspace? " : "New to CredTek? "}
            <button
              type="button"
              className="signin-link"
              onClick={() => {
                setIsSignUp((v) => !v);
                setMsg(null);
              }}
            >
              {isSignUp ? "Sign in →" : "Create one →"}
            </button>
          </div>
        )}

        {!configured && (
          <div className="signin-demo-note">
            ✦ Auth not configured in this environment yet.
          </div>
        )}
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
