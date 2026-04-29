"use client";

// Mobile-first provider intake. Five steps: identity confirm, license
// upload (with mock OCR result), other credentials, CAQH consent, sign.
// Every "upload" is just a tap-to-mark-uploaded button — production
// swaps in a real file picker + Anthropic's vision model for OCR.

import { useState } from "react";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const SAMPLE_PROVIDER = {
  firstName: "Aisha",
  lastName: "Patel",
  credential: "LPC-A",
  state: "TX",
  group: "Mindscape Behavioral Health",
};

const STEP_LABELS: Record<Exclude<Step, 6>, string> = {
  1: "Identity",
  2: "License",
  3: "Credentials",
  4: "CAQH",
  5: "Sign",
};

export function IntakeForm({ token }: { token: string }) {
  const [step, setStep] = useState<Step>(1);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseUploaded, setLicenseUploaded] = useState(false);
  const [credentialsUploaded, setCredentialsUploaded] = useState({
    dea: false,
    coi: false,
    boardCert: false,
    cv: false,
  });
  const [caqhConsent, setCaqhConsent] = useState(true);
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState({ a: false, b: false, c: false });

  const next = () => setStep((s) => (s < 5 ? ((s + 1) as Step) : 6));
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : 1));

  const canAdvance =
    step === 1
      ? licenseNumber.trim().length >= 4
      : step === 2
        ? licenseUploaded
        : step === 3
          ? credentialsUploaded.dea && credentialsUploaded.coi
          : step === 4
            ? true
            : step === 5
              ? signature.trim().length >= 4 &&
                agreed.a &&
                agreed.b &&
                agreed.c
              : true;

  if (step === 6) {
    return (
      <div className="intake-shell">
        <Header />
        <div className="intake-card intake-done">
          <div className="intake-done-mark">✓</div>
          <h1 className="intake-h1">You're all set, {SAMPLE_PROVIDER.firstName}.</h1>
          <p className="intake-p">
            <strong>{SAMPLE_PROVIDER.group}</strong> will reach out only if
            something needs your input. Until then, you can close this tab.
          </p>
          <div className="intake-done-list">
            <div className="intake-done-row">
              <span className="intake-done-dot success">●</span>
              <span>Identity confirmed</span>
            </div>
            <div className="intake-done-row">
              <span className="intake-done-dot success">●</span>
              <span>License extracted &amp; sent for primary-source verification</span>
            </div>
            <div className="intake-done-row">
              <span className="intake-done-dot success">●</span>
              <span>Credentials on file</span>
            </div>
            <div className="intake-done-row">
              <span className="intake-done-dot success">●</span>
              <span>
                {caqhConsent
                  ? "CAQH auto-attestation enabled — you'll get an SMS to approve every 120 days"
                  : "CAQH skipped — your coordinator will reach out about attestation"}
              </span>
            </div>
            <div className="intake-done-row">
              <span className="intake-done-dot success">●</span>
              <span>Attestations signed</span>
            </div>
          </div>
          <div className="intake-meta">
            Session token: <code>{token}</code>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="intake-shell">
      <Header />

      <div className="intake-stepper">
        {([1, 2, 3, 4, 5] as const).map((n) => (
          <div
            key={n}
            className={`intake-step ${
              n < step ? "done" : n === step ? "current" : ""
            }`}
          >
            <div className="intake-step-num">{n < step ? "✓" : n}</div>
            <div className="intake-step-label">{STEP_LABELS[n]}</div>
          </div>
        ))}
      </div>

      <div className="intake-card">
        {step === 1 ? (
          <Step1
            licenseNumber={licenseNumber}
            setLicenseNumber={setLicenseNumber}
          />
        ) : null}
        {step === 2 ? (
          <Step2
            uploaded={licenseUploaded}
            onUpload={() => setLicenseUploaded(true)}
            licenseNumber={licenseNumber}
          />
        ) : null}
        {step === 3 ? (
          <Step3
            uploaded={credentialsUploaded}
            setUploaded={setCredentialsUploaded}
          />
        ) : null}
        {step === 4 ? (
          <Step4 consent={caqhConsent} setConsent={setCaqhConsent} />
        ) : null}
        {step === 5 ? (
          <Step5
            signature={signature}
            setSignature={setSignature}
            agreed={agreed}
            setAgreed={setAgreed}
          />
        ) : null}

        <div className="intake-actions">
          {step > 1 ? (
            <button className="intake-btn-secondary" onClick={back}>
              ← Back
            </button>
          ) : (
            <span />
          )}
          <button
            className="intake-btn-primary"
            onClick={next}
            disabled={!canAdvance}
          >
            {step === 5 ? "Submit & finish" : "Continue →"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="intake-header">
      <div className="intake-logo">
        <div className="intake-logo-mark">C</div>
        <div className="intake-logo-text">CredTek</div>
      </div>
      <div className="intake-greeting">
        Hi {SAMPLE_PROVIDER.firstName} —{" "}
        <strong>{SAMPLE_PROVIDER.group}</strong> asked us to set up your
        credentialing profile. Should take ~10 minutes.
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="intake-footer">
      🔒 HIPAA-compliant. Your data is encrypted and only shared with{" "}
      <strong>{SAMPLE_PROVIDER.group}</strong> and the licensing/payor
      authorities you authorize below.
    </footer>
  );
}

function Step1({
  licenseNumber,
  setLicenseNumber,
}: {
  licenseNumber: string;
  setLicenseNumber: (v: string) => void;
}) {
  return (
    <>
      <div className="intake-eyebrow">Step 1 of 5</div>
      <h2 className="intake-h2">Confirm who you are.</h2>
      <p className="intake-p">
        We pre-filled this from your invite. Fix anything that's wrong.
      </p>
      <div className="intake-fields">
        <div className="intake-field">
          <label>First name</label>
          <input defaultValue={SAMPLE_PROVIDER.firstName} />
        </div>
        <div className="intake-field">
          <label>Last name</label>
          <input defaultValue={SAMPLE_PROVIDER.lastName} />
        </div>
        <div className="intake-field">
          <label>Credential</label>
          <select defaultValue={SAMPLE_PROVIDER.credential}>
            <option>LCSW</option>
            <option>LMSW</option>
            <option>LPC</option>
            <option>LPC-A</option>
            <option>LMFT</option>
            <option>LMFT-A</option>
            <option>PsyD</option>
            <option>PhD</option>
            <option>MD</option>
            <option>Psychiatric NP</option>
            <option>BCBA</option>
          </select>
        </div>
        <div className="intake-field">
          <label>Primary state</label>
          <select defaultValue={SAMPLE_PROVIDER.state}>
            <option>TX</option>
            <option>CA</option>
            <option>NY</option>
            <option>FL</option>
            <option>GA</option>
          </select>
        </div>
        <div className="intake-field intake-field-full">
          <label>License number</label>
          <input
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="e.g. 86421"
          />
        </div>
      </div>
    </>
  );
}

function Step2({
  uploaded,
  onUpload,
  licenseNumber,
}: {
  uploaded: boolean;
  onUpload: () => void;
  licenseNumber: string;
}) {
  return (
    <>
      <div className="intake-eyebrow">Step 2 of 5</div>
      <h2 className="intake-h2">Snap a photo of your license.</h2>
      <p className="intake-p">
        Front side. Make sure the license number, expiration, and your name
        are all visible. We'll auto-extract everything else.
      </p>

      {!uploaded ? (
        <button className="intake-upload" onClick={onUpload}>
          <div className="intake-upload-icon">📷</div>
          <div className="intake-upload-text">
            <strong>Tap to take a photo</strong>
            <span>or drag &amp; drop a JPG/PNG/PDF</span>
          </div>
        </button>
      ) : (
        <div className="intake-extracted">
          <div className="intake-extracted-head">
            <span className="intake-extracted-tag">✓ Extracted in 1.4s</span>
            <span className="intake-extracted-confidence">
              99.4% confidence
            </span>
          </div>
          <div className="intake-extracted-row">
            <span className="l">License number</span>
            <span className="v">
              {licenseNumber.length >= 4 ? licenseNumber : "TX-86421"}
            </span>
          </div>
          <div className="intake-extracted-row">
            <span className="l">Issuing state board</span>
            <span className="v">TX Board of LPCs</span>
          </div>
          <div className="intake-extracted-row">
            <span className="l">Issue date</span>
            <span className="v">April 15, 2024</span>
          </div>
          <div className="intake-extracted-row">
            <span className="l">Expiration</span>
            <span className="v">April 15, 2026</span>
          </div>
          <div className="intake-extracted-row">
            <span className="l">Status</span>
            <span className="v success">✓ Active · verified with state board</span>
          </div>
          <button
            className="intake-link"
            onClick={() => onUpload()}
          >
            Looks right — continue, or re-upload if anything's off
          </button>
        </div>
      )}
    </>
  );
}

function Step3({
  uploaded,
  setUploaded,
}: {
  uploaded: { dea: boolean; coi: boolean; boardCert: boolean; cv: boolean };
  setUploaded: (
    v: { dea: boolean; coi: boolean; boardCert: boolean; cv: boolean },
  ) => void;
}) {
  const docs: { key: keyof typeof uploaded; label: string; required: boolean; note: string }[] = [
    {
      key: "dea",
      label: "DEA registration",
      required: true,
      note: "If you prescribe — otherwise skip with the toggle below",
    },
    {
      key: "coi",
      label: "Certificate of Insurance (malpractice)",
      required: true,
      note: "Most recent COI from your carrier",
    },
    {
      key: "boardCert",
      label: "Board certification",
      required: false,
      note: "ABPP / ABPN / specialty cert if you have one",
    },
    {
      key: "cv",
      label: "CV / résumé",
      required: false,
      note: "PDF preferred",
    },
  ];

  return (
    <>
      <div className="intake-eyebrow">Step 3 of 5</div>
      <h2 className="intake-h2">Other credentials.</h2>
      <p className="intake-p">
        Quick photo or PDF for each. Tap to attach.
      </p>
      <div className="intake-docs">
        {docs.map((d) => (
          <div key={d.key} className="intake-doc">
            <div className="intake-doc-top">
              <div>
                <div className="intake-doc-label">
                  {d.label}
                  {d.required ? (
                    <span className="intake-doc-req">required</span>
                  ) : (
                    <span className="intake-doc-opt">optional</span>
                  )}
                </div>
                <div className="intake-doc-note">{d.note}</div>
              </div>
              <button
                className={
                  uploaded[d.key]
                    ? "intake-doc-btn done"
                    : "intake-doc-btn"
                }
                onClick={() =>
                  setUploaded({ ...uploaded, [d.key]: !uploaded[d.key] })
                }
              >
                {uploaded[d.key] ? "✓ Attached" : "Attach"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Step4({
  consent,
  setConsent,
}: {
  consent: boolean;
  setConsent: (v: boolean) => void;
}) {
  return (
    <>
      <div className="intake-eyebrow">Step 4 of 5</div>
      <h2 className="intake-h2">CAQH attestation, on autopilot.</h2>
      <p className="intake-p">
        Most insurance plans require you to re-attest your CAQH profile every
        120 days. We'll handle it for you — you just approve via SMS when
        the reminder lands.
      </p>

      <button
        className={
          consent
            ? "intake-toggle-card on"
            : "intake-toggle-card"
        }
        onClick={() => setConsent(!consent)}
      >
        <div className="intake-toggle-left">
          <strong>Auto-attest CAQH every 120 days</strong>
          <p>
            We pre-fill the attestation from your latest CredTek profile. You
            approve with one tap on your phone — average 11 seconds.
          </p>
        </div>
        <div
          className={
            consent ? "intake-toggle-knob on" : "intake-toggle-knob"
          }
        >
          <span></span>
        </div>
      </button>

      <div className="intake-fineprint">
        You can turn this off anytime from your provider settings. We never
        submit anything without your one-tap approval.
      </div>
    </>
  );
}

function Step5({
  signature,
  setSignature,
  agreed,
  setAgreed,
}: {
  signature: string;
  setSignature: (v: string) => void;
  agreed: { a: boolean; b: boolean; c: boolean };
  setAgreed: (v: { a: boolean; b: boolean; c: boolean }) => void;
}) {
  return (
    <>
      <div className="intake-eyebrow">Step 5 of 5</div>
      <h2 className="intake-h2">Sign &amp; submit.</h2>
      <p className="intake-p">
        Three quick attestations, then we hand off to your group's
        credentialing team.
      </p>

      <div className="intake-checks">
        <label className="intake-check">
          <input
            type="checkbox"
            checked={agreed.a}
            onChange={(e) => setAgreed({ ...agreed, a: e.target.checked })}
          />
          <span>
            I confirm everything I've entered above is accurate to the best of
            my knowledge.
          </span>
        </label>
        <label className="intake-check">
          <input
            type="checkbox"
            checked={agreed.b}
            onChange={(e) => setAgreed({ ...agreed, b: e.target.checked })}
          />
          <span>
            I authorize CredTek to verify my credentials with state boards,
            NPDB, OIG, SAM, DEA, and the payors my group enrolls me with.
          </span>
        </label>
        <label className="intake-check">
          <input
            type="checkbox"
            checked={agreed.c}
            onChange={(e) => setAgreed({ ...agreed, c: e.target.checked })}
          />
          <span>
            I've read &amp; agree to the{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>
              provider terms
            </a>{" "}
            and{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>
              HIPAA privacy notice
            </a>
            .
          </span>
        </label>
      </div>

      <div className="intake-sig-wrap">
        <label className="intake-label">Type your full name as signature</label>
        <input
          className="intake-sig"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder="Aisha Patel"
        />
        <div className="intake-sig-meta">
          Signed at{" "}
          {new Date().toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}{" "}
          · IP recorded for audit trail
        </div>
      </div>
    </>
  );
}
