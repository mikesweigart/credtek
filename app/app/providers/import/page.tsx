// Bulk import — paste a CSV roster and create many providers at once.
// Native form + server action that parses and inserts, RLS-scoped to
// the tenant. Editor-only.

import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../../_lib/supabase/serverClient";
import { getSessionContext, canEdit } from "../../../_lib/data/workspace";
import { slugify } from "../../../_lib/data/providers";

export const dynamic = "force-dynamic";

async function importProviders(formData: FormData) {
  "use server";
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");
  if (!canEdit(ctx.role) || !ctx.tenantId) redirect("/app/providers");

  const raw = String(formData.get("csv") ?? "").trim();
  if (!raw) redirect("/app/providers/import?error=empty");

  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const rows: Record<string, unknown>[] = [];
  for (const line of lines) {
    const cols = line.split(",").map((c) => c.trim());
    // Skip a header row if present.
    if (rows.length === 0 && /name/i.test(cols[0]) && /credential|npi|specialty/i.test(line)) continue;
    const name = cols[0];
    if (!name) continue;
    const states = (cols[4] ?? "")
      .split(/[;|]/)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    rows.push({
      tenant_id: ctx.tenantId,
      slug: slugify(name),
      name,
      credential: cols[1] || null,
      npi: cols[2] || null,
      specialty: cols[3] || null,
      status: "enrolling",
      license_states: states,
    });
  }

  if (rows.length === 0) redirect("/app/providers/import?error=parse");

  const s = await createSupabaseServerClient();
  if (s) await s.from("providers").insert(rows);

  revalidatePath("/app/providers");
  revalidatePath("/app");
  redirect("/app/providers");
}

export default async function ImportPage(props: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await props.searchParams;
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");
  if (!canEdit(ctx.role)) redirect("/app/providers");

  return (
    <div className="portal-form-wrap">
      <div className="portal-head">
        <Link href="/app/providers" className="portal-back">← Providers</Link>
        <h1 className="portal-h1">Bulk import providers</h1>
        <p className="portal-sub">
          Paste your roster as CSV — one provider per line. They&apos;ll be created in your
          workspace at the Intake stage, ready to move through credentialing.
        </p>
      </div>

      <div className="portal-card portal-import-help">
        <div className="portal-import-help-title">Format — one provider per line</div>
        <code className="portal-import-code">name, credential, npi, specialty, states</code>
        <div className="portal-import-help-note">
          States are separated with <strong>;</strong> or <strong>|</strong> (so commas stay clean). A header
          row is optional — it&apos;s detected and skipped.
        </div>
        <div className="portal-import-example">
          <div className="portal-import-example-lbl">Example</div>
          <pre>{`Dr. Sarah Reyes, PsyD, 1487209456, Psychology, TX;FL;GA
James Mitchell, LCSW, 2109834567, Behavioral Health, CA;OR
Dr. Alex Johnson, MD, 1326004587, Emergency Medicine, WA;MN;ID`}</pre>
        </div>
      </div>

      <form action={importProviders} className="portal-form">
        {error === "empty" && <div className="portal-form-error">Paste at least one row.</div>}
        {error === "parse" && <div className="portal-form-error">Couldn&apos;t parse any provider rows — check the format above.</div>}
        <label className="portal-field">
          <span className="portal-label">Paste CSV</span>
          <textarea name="csv" rows={10} className="portal-input portal-textarea" placeholder={`Dr. Jane Smith, MD, 1234567890, Cardiology, WA;OR`} />
        </label>
        <div className="portal-form-actions">
          <Link href="/app/providers" className="acct-btn-secondary">Cancel</Link>
          <button type="submit" className="acct-btn-primary">Import providers</button>
        </div>
      </form>
    </div>
  );
}
