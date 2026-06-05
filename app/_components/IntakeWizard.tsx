"use client";

// Group onboarding / intake wizard — the client-facing front door.
//
// A practice administrator, MSO ops lead, or credentialing manager lands
// here to onboard their providers. Two honest paths:
//
//   1. Self-serve  — a guided, save-as-you-go form: their group, each
//                    provider (with live NPI validation), the states they
//                    need credentialing in, and the payors to enroll with.
//   2. Concierge   — "we'll do the data entry." They drop in an Excel/CSV/
//                    PDF roster; we key it in for a nominal fee.
//
// Everything persists to localStorage so a half-finished intake survives a
// refresh. On submit we POST a structured summary to /api/intake (which
// emails the team and best-effort persists) — no PHI files are uploaded
// from the browser; a coordinator sends a secure link for the roster file.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  US_STATES,
  STATE_NAME_BY_CODE,
  PAYORS,
  PAYOR_CATEGORIES,
  CREDENTIALS,
  PRIMARY_SPECIALTIES,
  SIZE_BUCKETS,
  ENGAGEMENT_TYPES,
  isValidNpi,
  mapRosterColumns,
  ROSTER_CSV_TEMPLATE,
  ROSTER_COLUMNS,
  CONCIERGE_FEE,
  INTAKE_TURNAROUND,
  newDraft,
  newProvider,
  type IntakeDraft,
  type IntakePath,
  type ProviderDraft,
  type NppesResult,
  type RosterColumnMatch,
} from "./intakeData";
import { parseSpreadsheet } from "./parseRoster";

const CAL_LINK = "https://calendly.com/mike-fusion-advisory/30min";
const STORE_KEY = "credtek_intake_v1";

// Regions for the "add a whole region" shortcuts in the state picker.
const REGIONS: { label: string; codes: string[] }[] = [
  { label: "West", codes: ["WA", "OR", "CA", "NV", "ID", "MT", "WY", "UT", "CO", "AZ", "NM", "AK", "HI"] },
  { label: "Midwest", codes: ["ND", "SD", "NE", "KS", "MN", "IA", "MO", "WI", "IL", "IN", "MI", "OH"] },
  { label: "South", codes: ["TX", "OK", "AR", "LA", "MS", "AL", "TN", "KY", "GA", "FL", "SC", "NC", "VA", "WV"] },
  { label: "Northeast", codes: ["PA", "NY", "NJ", "CT", "RI", "MA", "VT", "NH", "ME", "MD", "DE", "DC"] },
];

const STEP_LABEL: Record<string, string> = {
  group: "Your group",
  providers: "Providers",
  states: "States",
  payors: "Payors",
  review: "Review",
  upload: "Roster",
};

const SELF_STEPS = ["group", "providers", "states", "payors", "review"] as const;
const CONCIERGE_STEPS = ["upload", "group", "states", "payors", "review"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function track(event: string, props?: Record<string, unknown>) {
  try {
    (window as unknown as { posthog?: { capture?: (e: string, p?: unknown) => void } }).posthog?.capture?.(
      event,
      props,
    );
  } catch {
    /* analytics is best-effort */
  }
}

/* ------------------------------------------------------------------ *
 * Tiny inline icon set (camelCase SVG attrs — matches the site).
 * ------------------------------------------------------------------ */
function Icon({ path, size = 20 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <path d={path} />
    </svg>
  );
}
const I = {
  check: "M20 6 9 17l-5-5",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  close: "M18 6 6 18M6 6l12 12",
  trash: "M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14",
  upload: "M12 16V4M7 9l5-5 5 5M5 20h14",
  arrowR: "M5 12h14M13 5l7 7-7 7",
  arrowL: "M19 12H5M11 19l-7-7 7-7",
  lock: "M6 10V8a6 6 0 1 1 12 0v2M5 10h14v10H5z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
  file: "M14 3v5h5M7 3h8l5 5v13H7z",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8",
};

/* ================================================================== *
 * Root
 * ================================================================== */
export function IntakeWizard() {
  const [phase, setPhase] = useState<"choose" | "form" | "done">("choose");
  const [draft, setDraft] = useState<IntakeDraft | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "sent" | "error">("idle");

  // ---- Hydrate a saved draft: a ?resume=<token> link first (cross-device),
  //      then the on-device localStorage autosave. ----
  useEffect(() => {
    let cancelled = false;
    const resumeToken = (() => {
      try {
        return new URLSearchParams(window.location.search).get("resume");
      } catch {
        return null;
      }
    })();

    const hydrateLocal = () => {
      try {
        const raw = localStorage.getItem(STORE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw) as { draft?: IntakeDraft; stepIndex?: number };
        if (!cancelled && saved?.draft?.path) {
          setDraft(saved.draft);
          setStepIndex(Math.max(0, Math.min(saved.stepIndex ?? 0, 4)));
          setPhase("form");
          setResumed(true);
        }
      } catch {
        /* corrupt store — ignore */
      }
    };

    if (resumeToken) {
      (async () => {
        try {
          const r = await fetch(`/api/intake/save?token=${encodeURIComponent(resumeToken)}`);
          const data = (await r.json()) as { ok?: boolean; draft?: IntakeDraft; stepIndex?: number };
          if (!cancelled && data?.ok && data.draft?.path) {
            setDraft(data.draft);
            setStepIndex(Math.max(0, Math.min(data.stepIndex ?? 0, 4)));
            setSavedToken(resumeToken);
            setPhase("form");
            setResumed(true);
            track("intake_resumed_from_link");
            try {
              window.history.replaceState(null, "", window.location.pathname);
            } catch {
              /* ignore */
            }
            return;
          }
          hydrateLocal(); // token invalid/expired — fall back
        } catch {
          if (!cancelled) hydrateLocal();
        }
      })();
    } else {
      hydrateLocal();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Re-arm the "finish later" affordance whenever the user advances a step.
  useEffect(() => {
    setSaveState("idle");
  }, [stepIndex]);

  // ---- Persist on every change while filling the form ----
  useEffect(() => {
    if (phase !== "form" || !draft) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ draft, stepIndex }));
    } catch {
      /* quota / private mode — non-fatal */
    }
  }, [draft, stepIndex, phase]);

  const steps = useMemo(
    () => (draft?.path === "concierge" ? CONCIERGE_STEPS : SELF_STEPS),
    [draft?.path],
  );

  const choosePath = useCallback(
    (path: IntakePath) => {
      setDraft((prev) => {
        if (prev) {
          // Keep shared fields; just swap the path-specific bits.
          const next: IntakeDraft = { ...prev, path };
          if (path === "self" && next.providers.length === 0) next.providers = [newProvider()];
          return next;
        }
        return newDraft(path);
      });
      setStepIndex(0);
      setPhase("form");
      track("intake_path_chosen", { path });
    },
    [],
  );

  const update = useCallback((patch: Partial<IntakeDraft>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  }, []);

  const goNext = useCallback(() => {
    setStepIndex((i) => {
      const next = Math.min(i + 1, steps.length - 1);
      track("intake_step", { step: steps[next] });
      return next;
    });
  }, [steps]);

  const goBack = useCallback(() => {
    setStepIndex((i) => {
      if (i === 0) {
        setPhase("choose");
        return 0;
      }
      return i - 1;
    });
  }, []);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      /* ignore */
    }
    setDraft(null);
    setStepIndex(0);
    setResumed(false);
    setPhase("choose");
  }, []);

  const submit = useCallback(async () => {
    if (!draft) return;
    setSubmitting(true);
    track("intake_submitted", {
      path: draft.path,
      providers: draft.providers.length,
      states: draft.states.length,
      payors: draft.payors.length,
    });
    try {
      await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
        keepalive: true,
      });
    } catch {
      /* email is best-effort; the draft is safe in localStorage */
    }
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      /* ignore */
    }
    setSubmitting(false);
    setPhase("done");
  }, [draft]);

  const saveLater = useCallback(async () => {
    if (!draft || !EMAIL_RE.test(draft.contactEmail)) return;
    setSaveState("saving");
    try {
      const r = await fetch("/api/intake/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: savedToken, draft, stepIndex, email: draft.contactEmail }),
      });
      const data = (await r.json()) as { ok?: boolean; token?: string };
      if (data?.ok) {
        if (data.token) setSavedToken(data.token);
        setSaveState("sent");
        track("intake_saved_for_later", { step: stepIndex });
      } else {
        setSaveState("error");
      }
    } catch {
      setSaveState("error");
    }
  }, [draft, stepIndex, savedToken]);

  /* ---------------- Render ---------------- */
  if (phase === "done" && draft) {
    return <DoneScreen draft={draft} onReset={resetAll} />;
  }

  if (phase === "choose" || !draft) {
    return <Chooser onChoose={choosePath} resumed={resumed && !!draft} onResume={() => setPhase("form")} />;
  }

  const stepKey = steps[stepIndex];
  const valid = stepValid(stepKey, draft);
  const isLast = stepIndex === steps.length - 1;

  return (
    <div className="gi-shell">
      <ShellHeader />

      <ol className="gi-stepper" aria-label="Onboarding progress">
        {steps.map((s, idx) => (
          <li
            key={s}
            className={`gi-step ${idx < stepIndex ? "done" : idx === stepIndex ? "current" : ""}`}
            aria-current={idx === stepIndex ? "step" : undefined}
          >
            <span className="gi-step-num">{idx < stepIndex ? <Icon path={I.check} size={14} /> : idx + 1}</span>
            <span className="gi-step-label">{STEP_LABEL[s]}</span>
          </li>
        ))}
      </ol>

      <div className="gi-autosave">
        <Icon path={I.check} size={13} /> Progress saves automatically on this device
      </div>

      <div className="gi-card">
        <div className="gi-step-anim" key={stepKey}>
          {stepKey === "group" && <GroupStep draft={draft} update={update} />}
          {stepKey === "providers" && <ProvidersStep draft={draft} update={update} />}
          {stepKey === "states" && <StatesStep draft={draft} update={update} />}
          {stepKey === "payors" && <PayorsStep draft={draft} update={update} />}
          {stepKey === "upload" && <UploadStep draft={draft} update={update} />}
          {stepKey === "review" && <ReviewStep draft={draft} update={update} goto={setStepIndex} steps={steps} />}
        </div>

        <div className="gi-actions">
          <button type="button" className="gi-btn-secondary" onClick={goBack}>
            <Icon path={I.arrowL} size={16} />
            {stepIndex === 0 ? "Switch path" : "Back"}
          </button>
          {isLast ? (
            <button type="button" className="gi-btn-primary" onClick={submit} disabled={!valid || submitting}>
              {submitting ? (
                <>
                  <span className="gi-spinner" aria-hidden="true" /> Sending…
                </>
              ) : (
                <>
                  Submit onboarding <Icon path={I.arrowR} size={16} />
                </>
              )}
            </button>
          ) : (
            <button type="button" className="gi-btn-primary" onClick={goNext} disabled={!valid}>
              Continue <Icon path={I.arrowR} size={16} />
            </button>
          )}
        </div>

        {EMAIL_RE.test(draft.contactEmail) && (
          <div className="gi-save-later-row">
            {saveState === "sent" ? (
              <span className="gi-save-later-done">
                <Icon path={I.check} size={14} /> Link sent to {draft.contactEmail} — finish anytime, on any device.
              </span>
            ) : (
              <button
                type="button"
                className="gi-save-later"
                onClick={saveLater}
                disabled={saveState === "saving"}
              >
                <Icon path={I.file} size={14} />
                {saveState === "saving"
                  ? "Sending your link…"
                  : saveState === "error"
                    ? "Couldn't send — tap to retry"
                    : "Email me a link to finish later"}
              </button>
            )}
          </div>
        )}
      </div>

      <TrustBar />
    </div>
  );
}

/* ================================================================== *
 * Path chooser
 * ================================================================== */
function Chooser({
  onChoose,
  resumed,
  onResume,
}: {
  onChoose: (p: IntakePath) => void;
  resumed: boolean;
  onResume: () => void;
}) {
  return (
    <div className="gi-shell">
      <ShellHeader />
      <div className="gi-intro">
        <div className="gi-eyebrow">Two ways to start</div>
        <h1 className="gi-h1">Let&rsquo;s get your providers credentialed and billing.</h1>
        <p className="gi-lede">
          Fill out a guided form yourself, or hand us your roster and we&rsquo;ll do the data entry.
          Either way, you&rsquo;re scoped within one business day.
        </p>
      </div>

      {resumed && (
        <button type="button" className="gi-resume" onClick={onResume}>
          <span>
            <strong>Welcome back.</strong> You have an onboarding in progress.
          </span>
          <span className="gi-resume-cta">
            Resume <Icon path={I.arrowR} size={16} />
          </span>
        </button>
      )}

      <div className="gi-fork">
        <button type="button" className="gi-fork-card gi-fork-card--self" onClick={() => onChoose("self")}>
          <span className="gi-fork-icon">
            <Icon path={I.user} size={22} />
          </span>
          <span className="gi-fork-badge">Most popular</span>
          <span className="gi-fork-title">Use our form</span>
          <span className="gi-fork-desc">
            A guided, save-as-you-go intake. Add each provider, the states you need, and the payors to enroll with.
            Live NPI validation as you type.
          </span>
          <span className="gi-fork-meta">~3 min for a small group · save &amp; resume anytime</span>
          <span className="gi-fork-go">
            Start the form <Icon path={I.arrowR} size={16} />
          </span>
        </button>

        <button type="button" className="gi-fork-card gi-fork-card--concierge" onClick={() => onChoose("concierge")}>
          <span className="gi-fork-icon">
            <Icon path={I.upload} size={22} />
          </span>
          <span className="gi-fork-badge alt">Done for you</span>
          <span className="gi-fork-title">Send us your roster</span>
          <span className="gi-fork-desc">
            Already have a spreadsheet? Drop in an Excel, CSV, Google Sheet, or PDF. We review it, validate every NPI,
            and send you a flat quote to complete the credentialing forms for you.
          </span>
          <span className="gi-fork-meta">Reviewed &amp; quoted in 1 business day · no charge until you approve</span>
          <span className="gi-fork-go">
            Upload roster <Icon path={I.arrowR} size={16} />
          </span>
        </button>
      </div>

      <p className="gi-fork-note">
        Not sure which to pick? Start the form — you can switch to a roster upload anytime, and a coordinator reviews
        every submission before any verification begins.
      </p>

      <TrustBar />
    </div>
  );
}

/* ================================================================== *
 * Step: Your group
 * ================================================================== */
function GroupStep({ draft, update }: StepProps) {
  const emailBad = draft.contactEmail.length > 0 && !EMAIL_RE.test(draft.contactEmail);
  const gnpiClean = draft.groupNpi.replace(/\D/g, "");
  const gnpiState =
    gnpiClean.length === 0
      ? "empty"
      : gnpiClean.length < 10
        ? "typing"
        : isValidNpi(draft.groupNpi)
          ? "valid"
          : "invalid";
  const engNote = ENGAGEMENT_TYPES.find((t) => t.id === draft.engagementType)?.note;
  return (
    <>
      <StepHead
        eyebrow="About your group"
        title="Who are we onboarding for?"
        sub="The basics so your coordinator can reach you and right-size the plan."
      />
      <div className="gi-fields">
        <Field label="Organization / group name" full required>
          <input
            className="gi-input"
            value={draft.orgName}
            onChange={(e) => update({ orgName: e.target.value })}
            placeholder="e.g. Lakeshore Medical Group"
            autoComplete="organization"
          />
        </Field>
        <Field label="What do you need?" full required>
          <select
            className="gi-select"
            value={draft.engagementType}
            onChange={(e) => update({ engagementType: e.target.value })}
          >
            <option value="">Select…</option>
            {ENGAGEMENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          {engNote && <span className="gi-hint">{engNote}</span>}
        </Field>
        <Field label="Your name" required>
          <input
            className="gi-input"
            value={draft.contactName}
            onChange={(e) => update({ contactName: e.target.value })}
            placeholder="First & last"
            autoComplete="name"
          />
        </Field>
        <Field label="Work email" required error={emailBad ? "Enter a valid email" : undefined}>
          <input
            className="gi-input"
            type="email"
            value={draft.contactEmail}
            onChange={(e) => update({ contactEmail: e.target.value })}
            placeholder="you@yourgroup.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Mobile / phone">
          <input
            className="gi-input"
            type="tel"
            value={draft.contactPhone}
            onChange={(e) => update({ contactPhone: e.target.value })}
            placeholder="(555) 555-0142"
            autoComplete="tel"
          />
        </Field>
        <Field label="How many providers?" required>
          <select
            className="gi-select"
            value={draft.sizeBucket}
            onChange={(e) => update({ sizeBucket: e.target.value })}
          >
            <option value="">Select…</option>
            {SIZE_BUCKETS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Group NPI (Type 2)"
          full
          error={gnpiState === "invalid" ? "Check digit doesn't match — re-enter" : undefined}
        >
          <div className="gi-npi-wrap">
            <input
              className="gi-input"
              value={draft.groupNpi}
              inputMode="numeric"
              maxLength={12}
              onChange={(e) => update({ groupNpi: e.target.value })}
              placeholder="Optional — your organizational billing NPI"
              aria-invalid={gnpiState === "invalid"}
            />
            {gnpiState === "valid" && (
              <span className="gi-npi-badge ok">
                <Icon path={I.check} size={13} /> Valid
              </span>
            )}
            {gnpiState === "invalid" && <span className="gi-npi-badge bad">Invalid</span>}
          </div>
        </Field>
      </div>
      <p className="gi-secure-note">
        <Icon path={I.lock} size={13} /> Sensitive items (SSN, DOB, license &amp; malpractice documents) are
        collected later over an encrypted, BAA-backed link — never on this form.
      </p>
    </>
  );
}

/* ================================================================== *
 * Step: Providers (repeatable)
 * ================================================================== */
function ProvidersStep({ draft, update }: StepProps) {
  const addProvider = () => update({ providers: [...draft.providers, newProvider()] });
  const removeProvider = (id: string) =>
    update({ providers: draft.providers.filter((p) => p.id !== id) });
  const patchProvider = (id: string, patch: Partial<ProviderDraft>) =>
    update({ providers: draft.providers.map((p) => (p.id === id ? { ...p, ...patch } : p)) });

  return (
    <>
      <StepHead
        eyebrow={`Providers · ${draft.providers.length} added`}
        title="Add the providers you need credentialed."
        sub="Name, credential, and NPI are what kick off primary-source verification. We validate each NPI live."
      />
      <div className="gi-providers">
        {draft.providers.map((p, idx) => (
          <ProviderCard
            key={p.id}
            index={idx}
            provider={p}
            canRemove={draft.providers.length > 1}
            onChange={(patch) => patchProvider(p.id, patch)}
            onRemove={() => removeProvider(p.id)}
          />
        ))}
      </div>
      <button type="button" className="gi-add-provider" onClick={addProvider}>
        <Icon path={I.plus} size={18} /> Add another provider
      </button>
      <p className="gi-hint gi-hint-center">
        Onboarding more than a handful? You can upload a roster instead and we&rsquo;ll enter them all for you.
      </p>
      <datalist id="gi-specialties">
        {PRIMARY_SPECIALTIES.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </>
  );
}

type NpiLookup = {
  status: "idle" | "loading" | "found" | "notfound" | "error";
  name?: string;
  org?: boolean;
};

function ProviderCard({
  index,
  provider,
  canRemove,
  onChange,
  onRemove,
}: {
  index: number;
  provider: ProviderDraft;
  canRemove: boolean;
  onChange: (patch: Partial<ProviderDraft>) => void;
  onRemove: () => void;
}) {
  const npiClean = provider.npi.replace(/\D/g, "");
  const npiState =
    npiClean.length === 0 ? "empty" : npiClean.length < 10 ? "typing" : isValidNpi(provider.npi) ? "valid" : "invalid";
  const emailBad = provider.email.length > 0 && !EMAIL_RE.test(provider.email);
  const [showIds, setShowIds] = useState(Boolean(provider.caqhId || provider.dea));

  // ---- NPPES auto-fill ----
  // On a valid NPI, debounce-verify against the federal registry and pre-fill
  // any EMPTY fields (we never clobber what the user typed).
  const [lookup, setLookup] = useState<NpiLookup>({ status: "idle" });
  const latest = useRef(provider);
  latest.current = provider;
  const verifiedNpiRef = useRef("");

  useEffect(() => {
    const clean = provider.npi.replace(/\D/g, "");
    if (clean.length !== 10 || !isValidNpi(clean)) {
      setLookup({ status: "idle" });
      return;
    }
    if (verifiedNpiRef.current === clean) return; // already handled this NPI
    let cancelled = false;
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setLookup({ status: "loading" });
      try {
        const r = await fetch(`/api/npi?number=${clean}`, { signal: ctrl.signal });
        const data = (await r.json()) as NppesResult;
        if (cancelled) return;
        if (!data.ok) {
          setLookup({ status: "error" });
          return;
        }
        if (!data.found) {
          setLookup({ status: "notfound" });
          return;
        }
        verifiedNpiRef.current = clean;
        if (data.enumerationType === "NPI-2") {
          setLookup({ status: "found", name: data.organizationName, org: true });
          track("npi_verified", { type: "org" });
          return;
        }
        const cur = latest.current;
        const patch: Partial<ProviderDraft> = {};
        if (!cur.firstName.trim() && data.firstName) patch.firstName = data.firstName;
        if (!cur.lastName.trim() && data.lastName) patch.lastName = data.lastName;
        if (!cur.credential && data.credentialMapped) patch.credential = data.credentialMapped;
        if (!cur.primaryState && data.primaryState) patch.primaryState = data.primaryState;
        if (!cur.specialty.trim() && data.specialty) patch.specialty = data.specialty;
        if (Object.keys(patch).length) onChange(patch);
        setLookup({ status: "found", name: data.displayName });
        track("npi_verified", { type: "individual", filled: Object.keys(patch).length });
      } catch (e) {
        if (!cancelled && !(e instanceof DOMException && e.name === "AbortError")) {
          setLookup({ status: "error" });
        }
      }
    }, 600);
    return () => {
      cancelled = true;
      ctrl.abort();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider.npi]);

  return (
    <div className="gi-provider">
      <div className="gi-provider-head">
        <span className="gi-provider-title">
          <span className="gi-provider-idx">{index + 1}</span>
          {provider.firstName || provider.lastName
            ? `${provider.firstName} ${provider.lastName}`.trim()
            : "New provider"}
        </span>
        {canRemove && (
          <button type="button" className="gi-provider-remove" onClick={onRemove} aria-label="Remove provider">
            <Icon path={I.trash} size={16} />
          </button>
        )}
      </div>
      <div className="gi-provider-grid">
        <Field label="First name" required>
          <input
            className="gi-input"
            value={provider.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            autoComplete="off"
          />
        </Field>
        <Field label="Last name" required>
          <input
            className="gi-input"
            value={provider.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            autoComplete="off"
          />
        </Field>
        <Field label="Credential" required>
          <select
            className="gi-select"
            value={provider.credential}
            onChange={(e) => onChange({ credential: e.target.value })}
          >
            <option value="">Select…</option>
            {CREDENTIALS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="NPI"
          error={npiState === "invalid" ? "Check digit doesn't match — re-enter" : undefined}
        >
          <div className="gi-npi-wrap">
            <input
              className="gi-input"
              value={provider.npi}
              inputMode="numeric"
              maxLength={12}
              onChange={(e) => onChange({ npi: e.target.value })}
              placeholder="10-digit NPI — we'll verify it"
              aria-invalid={npiState === "invalid"}
            />
            {npiState === "invalid" && <span className="gi-npi-badge bad">Invalid</span>}
            {npiState === "valid" && lookup.status === "loading" && (
              <span className="gi-npi-badge load">
                <span className="gi-spinner gi-spinner-sm" aria-hidden="true" /> Checking…
              </span>
            )}
            {npiState === "valid" && lookup.status === "found" && (
              <span className="gi-npi-badge verified">
                <Icon path={I.check} size={13} /> NPPES
              </span>
            )}
            {npiState === "valid" && lookup.status !== "loading" && lookup.status !== "found" && (
              <span className="gi-npi-badge ok">
                <Icon path={I.check} size={13} /> Valid
              </span>
            )}
          </div>
          {lookup.status === "found" && !lookup.org && (
            <span className="gi-npi-note ok">
              <Icon path={I.check} size={13} /> Verified with NPPES — {lookup.name}. We filled in what we could.
            </span>
          )}
          {lookup.status === "found" && lookup.org && (
            <span className="gi-npi-note warn">
              That&rsquo;s an organization (Type 2) NPI — enter the individual provider&rsquo;s NPI here.
            </span>
          )}
          {lookup.status === "notfound" && (
            <span className="gi-npi-note">
              No match in the NPPES registry yet — double-check the number, or keep going and we&rsquo;ll verify it.
            </span>
          )}
        </Field>
        <Field label="Primary state" required>
          <select
            className="gi-select"
            value={provider.primaryState}
            onChange={(e) => onChange({ primaryState: e.target.value })}
          >
            <option value="">Select…</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code} — {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Specialty">
          <input
            className="gi-input"
            list="gi-specialties"
            value={provider.specialty}
            onChange={(e) => onChange({ specialty: e.target.value })}
            placeholder="e.g. Family Medicine"
          />
        </Field>
        <Field label="Provider email" full error={emailBad ? "Enter a valid email" : undefined}>
          <input
            className="gi-input"
            type="email"
            value={provider.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="Optional — we send them a 10-min profile link"
            autoComplete="off"
          />
        </Field>
      </div>

      <button
        type="button"
        className="gi-ids-toggle"
        onClick={() => setShowIds((v) => !v)}
        aria-expanded={showIds}
      >
        <Icon path={showIds ? I.minus : I.plus} size={14} />
        {showIds ? "Hide credentialing IDs" : "Add CAQH ID & DEA (optional)"}
      </button>
      {showIds && (
        <div className="gi-provider-grid gi-ids-grid">
          <Field label="CAQH ID">
            <input
              className="gi-input"
              value={provider.caqhId}
              inputMode="numeric"
              maxLength={16}
              onChange={(e) => onChange({ caqhId: e.target.value })}
              placeholder="CAQH ProView ID"
              autoComplete="off"
            />
          </Field>
          <Field label="DEA number">
            <input
              className="gi-input"
              value={provider.dea}
              maxLength={12}
              onChange={(e) => onChange({ dea: e.target.value.toUpperCase() })}
              placeholder="If a prescriber"
              autoComplete="off"
            />
          </Field>
        </div>
      )}
    </div>
  );
}

/* ================================================================== *
 * Step: States
 * ================================================================== */
function StatesStep({ draft, update }: StepProps) {
  const [query, setQuery] = useState("");
  const selected = new Set(draft.states);

  const toggle = (code: string) => {
    const next = new Set(selected);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    update({ states: [...next] });
  };
  const addRegion = (codes: string[]) => {
    const next = new Set(selected);
    const allOn = codes.every((c) => next.has(c));
    codes.forEach((c) => (allOn ? next.delete(c) : next.add(c)));
    update({ states: [...next] });
  };
  const clearAll = () => update({ states: [] });

  const filtered = query
    ? US_STATES.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.code.toLowerCase().includes(query.toLowerCase()),
      )
    : US_STATES;

  return (
    <>
      <StepHead
        eyebrow="Where you need to bill"
        title="Which states need credentialing?"
        sub="Pick every state your providers will see patients in. Credentialing and Medicaid are state-by-state, so this scopes the work."
      />
      <div className="gi-state-tools">
        <input
          className="gi-input gi-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a state…"
          aria-label="Search states"
        />
        <div className="gi-region-btns">
          {REGIONS.map((r) => (
            <button key={r.label} type="button" className="gi-region-btn" onClick={() => addRegion(r.codes)}>
              {r.label}
            </button>
          ))}
          {draft.states.length > 0 && (
            <button type="button" className="gi-region-btn ghost" onClick={clearAll}>
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="gi-selected-count" aria-live="polite">
        {draft.states.length === 0 ? "No states selected yet" : `${draft.states.length} state${draft.states.length === 1 ? "" : "s"} selected`}
      </div>
      {draft.states.length > 0 && (
        <div className="gi-selected-states" aria-label="Selected states — click to remove">
          {draft.states.map((code) => (
            <button
              key={code}
              type="button"
              className="gi-selected-state"
              onClick={() => toggle(code)}
              aria-label={`Remove ${STATE_NAME_BY_CODE[code] ?? code}`}
              title={`Remove ${STATE_NAME_BY_CODE[code] ?? code}`}
            >
              {code}
              <Icon path={I.close} size={11} />
            </button>
          ))}
        </div>
      )}
      <div className="gi-chip-grid">
        {filtered.map((s) => {
          const on = selected.has(s.code);
          return (
            <button
              key={s.code}
              type="button"
              className={`gi-state-chip ${on ? "on" : ""}`}
              onClick={() => toggle(s.code)}
              aria-pressed={on}
              title={s.name}
            >
              {on && <Icon path={I.check} size={12} />}
              {s.code}
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ================================================================== *
 * Step: Payors
 * ================================================================== */
function PayorsStep({ draft, update }: StepProps) {
  const selected = new Set(draft.payors);
  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    update({ payors: [...next] });
  };

  return (
    <>
      <StepHead
        eyebrow="Who you want to be in-network with"
        title="Which payors should we enroll with?"
        sub="Select every plan you want your providers paneled on. We map Blue Cross and Medicaid to the right plan for each state you chose."
      />
      <div className="gi-selected-count" aria-live="polite">
        {draft.payors.length === 0 ? "No payors selected yet" : `${draft.payors.length} payor${draft.payors.length === 1 ? "" : "s"} selected`}
      </div>
      {PAYOR_CATEGORIES.map((cat) => {
        const items = PAYORS.filter((p) => p.category === cat.id);
        if (items.length === 0) return null;
        return (
          <div key={cat.id} className="gi-payor-group">
            <div className="gi-payor-group-label">{cat.label}</div>
            <div className="gi-payor-chips">
              {items.map((p) => {
                const on = selected.has(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`gi-payor-chip ${on ? "on" : ""}`}
                    onClick={() => toggle(p.id)}
                    aria-pressed={on}
                  >
                    <span className="gi-payor-chip-box">{on && <Icon path={I.check} size={13} />}</span>
                    <span className="gi-payor-chip-text">
                      {p.name}
                      {p.note && <span className="gi-payor-note">{p.note}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ================================================================== *
 * Step: Upload (concierge)
 * ================================================================== */
function UploadStep({ draft, update }: StepProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string[][]>([]);
  const [matches, setMatches] = useState<RosterColumnMatch[]>([]);
  const [parsing, setParsing] = useState(false);
  const [parseNote, setParseNote] = useState<"" | "unsupported" | "unparsed">("");

  const handleFile = useCallback(
    async (file: File) => {
      update({ rosterFileName: file.name, rosterRowCount: null, rosterColumns: [] });
      setPreview([]);
      setMatches([]);
      setParseNote("");
      const parseable = /\.(csv|tsv|txt|xlsx|xlsm)$/i.test(file.name);
      if (!parseable) {
        // .xls / .pdf / .docx — a coordinator collects these securely.
        setParseNote("unsupported");
        return;
      }
      setParsing(true);
      try {
        const rows = await parseSpreadsheet(file);
        const nonEmpty = rows.filter((r) => r.some((c) => (c || "").trim().length > 0));
        if (nonEmpty.length < 1) {
          setParseNote("unparsed");
          return;
        }
        const header = nonEmpty[0];
        const dataRows = Math.max(0, nonEmpty.length - 1); // minus header
        update({ rosterRowCount: dataRows, rosterColumns: header.slice(0, 40) });
        setMatches(mapRosterColumns(header));
        setPreview(nonEmpty.slice(0, 6)); // header + up to 5
      } catch {
        // Best-effort — keep the filename; a coordinator maps it on our end.
        setParseNote("unparsed");
      } finally {
        setParsing(false);
      }
    },
    [update],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const recognized = matches.filter((m) => m.key).length;

  const downloadTemplate = () => {
    try {
      const blob = new Blob([ROSTER_CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "credtek-provider-roster-template.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      track("intake_template_downloaded");
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <StepHead
        eyebrow="Done-for-you · review & quote"
        title="Upload your roster — we'll quote it."
        sub="Excel, CSV, Google Sheet, or PDF — whatever you have. We review it, validate every NPI, and send a flat quote to complete the forms for you. No charge until you approve."
      />

      {!draft.rosterFileName ? (
        <div
          className={`gi-dropzone ${dragging ? "drag" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          <span className="gi-dropzone-icon">
            <Icon path={I.upload} size={28} />
          </span>
          <span className="gi-dropzone-strong">Drag &amp; drop your roster, or click to browse</span>
          <span className="gi-dropzone-sub">.xlsx · .csv · .pdf · .docx — up to 25 MB</span>
        </div>
      ) : (
        <div className="gi-file">
          <span className="gi-file-icon">
            <Icon path={I.file} size={20} />
          </span>
          <span className="gi-file-body">
            <span className="gi-file-name">{draft.rosterFileName}</span>
            <span className="gi-file-meta">
              {parsing
                ? "Reading…"
                : draft.rosterRowCount != null
                  ? `${draft.rosterRowCount} provider${draft.rosterRowCount === 1 ? "" : "s"} detected`
                  : "We'll confirm the count with you"}
            </span>
          </span>
          <button
            type="button"
            className="gi-file-remove"
            onClick={() => {
              update({ rosterFileName: "", rosterRowCount: null, rosterColumns: [] });
              setPreview([]);
              setMatches([]);
              setParseNote("");
            }}
            aria-label="Remove file"
          >
            <Icon path={I.trash} size={16} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.tsv,.txt,.xlsx,.xls,.pdf,.doc,.docx"
        className="gi-sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {parsing && (
        <div className="gi-roster-detect parsing">
          <span className="gi-spinner gi-spinner-sm" aria-hidden="true" /> Reading your roster in your browser…
        </div>
      )}

      {!parsing && matches.length > 0 && (
        <div className="gi-roster-detect">
          <div className="gi-roster-stat">
            <span className="gi-roster-stat-mark">
              <Icon path={I.check} size={16} />
            </span>
            <span>
              We detected{" "}
              <strong>
                {draft.rosterRowCount ?? 0} provider{draft.rosterRowCount === 1 ? "" : "s"}
              </strong>{" "}
              and recognized <strong>{recognized} of {matches.length}</strong> columns.
            </span>
          </div>
          <div className="gi-roster-map" aria-label="Columns we recognized">
            {matches.map((m) => (
              <span key={m.index} className={`gi-roster-col ${m.key ? "on" : "off"}`}>
                <span className="gi-roster-col-raw">{m.raw || `Column ${m.index + 1}`}</span>
                {m.key ? (
                  <>
                    <Icon path={I.arrowR} size={12} />
                    <span className="gi-roster-col-map">{m.label}</span>
                  </>
                ) : (
                  <span className="gi-roster-col-skip">we&rsquo;ll review</span>
                )}
              </span>
            ))}
          </div>
          <p className="gi-roster-privacy">
            <Icon path={I.lock} size={12} /> Parsed entirely in your browser — nothing is uploaded until a
            coordinator sends you a secure link.
          </p>
        </div>
      )}

      {!parsing && parseNote && (
        <div className="gi-roster-detect note">
          <Icon path={I.file} size={16} />
          <span>
            {parseNote === "unsupported"
              ? "Got it — we'll map and validate every column the moment your file lands. Want an instant on-screen preview? Save it as .csv or .xlsx, or use our template below."
              : "Saved your file. We couldn't preview this one here, but our team maps and validates every column on our end."}
          </span>
        </div>
      )}

      {preview.length > 1 && (
        <div className="gi-preview">
          <div className="gi-preview-head">Preview — first {preview.length - 1} of {draft.rosterRowCount}</div>
          <div className="gi-preview-scroll">
            <table className="gi-preview-table">
              <thead>
                <tr>
                  {preview[0].slice(0, 6).map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(1).map((row, ri) => (
                  <tr key={ri}>
                    {row.slice(0, 6).map((c, ci) => (
                      <td key={ci}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="gi-template">
        <div className="gi-template-text">
          <strong>Not sure of the format?</strong> Grab our template — fill it in and drop it back here.
        </div>
        <button type="button" className="gi-template-link" onClick={downloadTemplate}>
          Download CSV template
        </button>
      </div>

      <details className="gi-template-cols">
        <summary>What we need for each provider</summary>
        <ul>
          {ROSTER_COLUMNS.map((c) => (
            <li key={c.key}>
              <strong>{c.label}</strong> <span>e.g. {c.example}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="gi-fee">
        <div className="gi-fee-head">
          <Icon path={I.spark} size={18} /> {CONCIERGE_FEE.headline}
        </div>
        <p className="gi-fee-detail">{CONCIERGE_FEE.detail}</p>
        <ul className="gi-fee-bullets">
          {CONCIERGE_FEE.bullets.map((b) => (
            <li key={b}>
              <Icon path={I.check} size={14} /> {b}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* ================================================================== *
 * Step: Review & submit
 * ================================================================== */
function ReviewStep({
  draft,
  update,
  goto,
  steps,
}: StepProps & { goto: (i: number) => void; steps: readonly string[] }) {
  const jump = (key: string) => {
    const idx = steps.indexOf(key);
    if (idx >= 0) goto(idx);
  };
  const stateList =
    draft.states.length === 0
      ? "—"
      : draft.states.map((c) => STATE_NAME_BY_CODE[c] ?? c).join(", ");
  const payorList =
    draft.payors.length === 0
      ? "—"
      : draft.payors.map((id) => PAYORS.find((p) => p.id === id)?.name ?? id).join(", ");

  return (
    <>
      <StepHead
        eyebrow="Almost done"
        title="Review & submit."
        sub="Confirm the scope, authorize verification, and we'll take it from here."
      />

      <div className="gi-review">
        <ReviewRow label="Group" value={draft.orgName || "—"} onEdit={() => jump("group")} />
        <ReviewRow
          label="Needs"
          value={ENGAGEMENT_TYPES.find((t) => t.id === draft.engagementType)?.label || "—"}
          onEdit={() => jump("group")}
        />
        <ReviewRow
          label="Contact"
          value={`${draft.contactName || "—"}${draft.contactEmail ? ` · ${draft.contactEmail}` : ""}`}
          onEdit={() => jump("group")}
        />
        {draft.path === "self" ? (
          <ReviewRow
            label="Providers"
            value={`${draft.providers.length} added`}
            onEdit={() => jump("providers")}
          />
        ) : (
          <ReviewRow
            label="Roster"
            value={
              draft.rosterFileName
                ? `${draft.rosterFileName}${draft.rosterRowCount != null ? ` · ${draft.rosterRowCount} providers` : ""}`
                : "—"
            }
            onEdit={() => jump("upload")}
          />
        )}
        <ReviewRow label="States" value={stateList} onEdit={() => jump("states")} />
        <ReviewRow label="Payors" value={payorList} onEdit={() => jump("payors")} />
      </div>

      <Field label="Anything else we should know?" full>
        <textarea
          className="gi-textarea"
          value={draft.notes}
          onChange={(e) => update({ notes: e.target.value })}
          rows={3}
          placeholder="Re-credentialing deadlines, specific plan IDs, group NPI, a target go-live date…"
        />
      </Field>

      <div className="gi-auth">
        <label className="gi-check">
          <input
            type="checkbox"
            checked={draft.authPsv}
            onChange={(e) => update({ authPsv: e.target.checked })}
          />
          <span>
            I authorize CredTek to perform <strong>primary-source verification</strong>{" "}
            of these providers&rsquo; credentials (state boards, NPPES, OIG/LEIE, SAM.gov, NPDB, DEA) and to submit
            payer enrollments on our behalf.
          </span>
        </label>
        <label className="gi-check">
          <input
            type="checkbox"
            checked={draft.authBaa}
            onChange={(e) => update({ authBaa: e.target.checked })}
          />
          <span>
            I understand a <strong>Business Associate Agreement (BAA)</strong>{" "}
            governs this engagement and that data is handled under HIPAA. I&rsquo;m authorized to share this
            information for my group.
          </span>
        </label>
      </div>
    </>
  );
}

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="gi-review-row">
      <span className="gi-review-label">{label}</span>
      <span className="gi-review-value">{value}</span>
      <button type="button" className="gi-review-edit" onClick={onEdit}>
        Edit
      </button>
    </div>
  );
}

/* ================================================================== *
 * Success
 * ================================================================== */
function DoneScreen({ draft, onReset }: { draft: IntakeDraft; onReset: () => void }) {
  const isConcierge = draft.path === "concierge";
  return (
    <div className="gi-shell">
      <ShellHeader />
      <div className="gi-card gi-done">
        <div className="gi-done-mark">
          <Icon path={I.check} size={30} />
        </div>
        <h1 className="gi-h1">You&rsquo;re in, {draft.contactName ? draft.contactName.split(" ")[0] : "thanks"}.</h1>
        <p className="gi-lede">
          We&rsquo;ve got your onboarding for <strong>{draft.orgName || "your group"}</strong>. {INTAKE_TURNAROUND}
        </p>

        <ol className="gi-done-steps">
          <li className="gi-done-step">
            <span className="gi-done-num">1</span>
            <span className="gi-done-body">
              <span className="gi-done-when">Day 1</span>
              <span>
                <strong>A coordinator reaches out</strong> — we email {draft.contactEmail || "you"} to confirm scope
                {isConcierge ? ", send a secure link for your roster, and prep your flat quote" : ""}.
              </span>
            </span>
          </li>
          <li className="gi-done-step">
            <span className="gi-done-num">2</span>
            <span className="gi-done-body">
              <span className="gi-done-when">Days 2–3</span>
              <span>
                <strong>We sign a BAA</strong> and stand up your workspace —{" "}
                {isConcierge
                  ? "your roster is keyed in and every NPI validated"
                  : `your ${draft.providers.length} provider${draft.providers.length === 1 ? "" : "s"} loaded`}
                .
              </span>
            </span>
          </li>
          <li className="gi-done-step">
            <span className="gi-done-num">3</span>
            <span className="gi-done-body">
              <span className="gi-done-when">By day 14</span>
              <span>
                <strong>Verification &amp; enrollment begin</strong> — primary-source checks run and payer
                applications go out. You watch every stage move in real time.
              </span>
            </span>
          </li>
        </ol>

        <div className="gi-done-actions">
          <a className="gi-btn-primary" href={CAL_LINK} target="_blank" rel="noopener noreferrer">
            Book your kickoff call <Icon path={I.arrowR} size={16} />
          </a>
          <button type="button" className="gi-btn-ghost" onClick={onReset}>
            Onboard another group
          </button>
        </div>
      </div>
      <TrustBar />
    </div>
  );
}

/* ================================================================== *
 * Shared shell bits
 * ================================================================== */
function ShellHeader() {
  return (
    <header className="gi-header">
      <a className="gi-logo" href="/">
        <span className="gi-logo-mark">C</span>
        <span className="gi-logo-text">CredTek</span>
      </a>
      <span className="gi-header-tag">Provider onboarding</span>
    </header>
  );
}

function TrustBar() {
  return (
    <div className="gi-trust" role="note">
      <span className="gi-trust-item">
        <Icon path={I.lock} size={14} /> HIPAA-compliant
      </span>
      <span className="gi-trust-item">
        <Icon path={I.check} size={14} /> BAA on day one
      </span>
      <span className="gi-trust-item">
        <Icon path={I.lock} size={14} /> Encrypted in transit &amp; at rest
      </span>
      <span className="gi-trust-item">NCQA-aligned</span>
    </div>
  );
}

function StepHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="gi-step-head">
      <div className="gi-eyebrow">{eyebrow}</div>
      <h2 className="gi-h2">{title}</h2>
      <p className="gi-p">{sub}</p>
    </div>
  );
}

function Field({
  label,
  children,
  full,
  required,
  error,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className={`gi-field ${full ? "gi-field-full" : ""}`}>
      <span className="gi-label">
        {label}
        {required && <span className="gi-req"> *</span>}
      </span>
      {children}
      {error && <span className="gi-error">{error}</span>}
    </label>
  );
}

/* ================================================================== *
 * Validation + helpers
 * ================================================================== */
type StepProps = { draft: IntakeDraft; update: (patch: Partial<IntakeDraft>) => void };

function providerComplete(p: ProviderDraft): boolean {
  if (!p.firstName.trim() || !p.lastName.trim() || !p.credential || !p.primaryState) return false;
  if (p.npi.replace(/\D/g, "").length > 0 && !isValidNpi(p.npi)) return false;
  if (p.email.length > 0 && !EMAIL_RE.test(p.email)) return false;
  return true;
}

function stepValid(key: string, draft: IntakeDraft): boolean {
  switch (key) {
    case "group":
      return (
        draft.orgName.trim().length > 1 &&
        draft.contactName.trim().length > 1 &&
        EMAIL_RE.test(draft.contactEmail) &&
        draft.sizeBucket.length > 0 &&
        draft.engagementType.length > 0 &&
        (draft.groupNpi.replace(/\D/g, "").length === 0 || isValidNpi(draft.groupNpi))
      );
    case "providers":
      return draft.providers.length > 0 && draft.providers.every(providerComplete);
    case "states":
      // Required for self-serve; optional for concierge (it can be in the file).
      return draft.path === "concierge" ? true : draft.states.length > 0;
    case "payors":
      return draft.path === "concierge" ? true : draft.payors.length > 0;
    case "upload":
      return draft.rosterFileName.trim().length > 0;
    case "review":
      return draft.authPsv && draft.authBaa;
    default:
      return true;
  }
}
