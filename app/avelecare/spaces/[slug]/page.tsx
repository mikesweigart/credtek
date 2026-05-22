// Space detail — readiness, providers, and requirements for one
// facility or program. Dynamic param ↔ space slug from seed.ts.

import Link from "next/link";
import { notFound } from "next/navigation";
import { AvelTopbar } from "../../_components/AvelNav";
import {
  getSpace,
  providersInSpace,
  spaceStats,
  STAGE_LABEL,
  SPACES,
} from "../../_data/seed";

export function generateStaticParams() {
  return SPACES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const space = getSpace(params.slug);
  return { title: space ? space.name : "Space" };
}

export default async function AvelSpaceDetail(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const space = getSpace(params.slug);
  if (!space) return notFound();

  const stats = spaceStats(space.id);
  const provs = providersInSpace(space.id);
  const pct = stats.total > 0 ? Math.round((stats.ready / stats.total) * 100) : 0;

  return (
    <>
      <AvelTopbar title={space.name} subtitle={space.description} />

      <div className="avel-content">
        <div className="avel-breadcrumb">
          <Link href="/avelecare/spaces">Spaces &amp; Programs</Link>
          <span>›</span>
          <span>{space.shortName}</span>
        </div>

        {/* ────────── Headline stats ────────── */}
        <div className="avel-kpis avel-kpis-4">
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Active providers</div>
            <div className="avel-kpi-val">{stats.total}</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">In onboarding</div>
            <div className="avel-kpi-val">{stats.onboarding}</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">Ready to bill</div>
            <div className="avel-kpi-val avel-kpi-val-pos">{stats.ready}</div>
            <div className="avel-kpi-delta">{pct}% of space</div>
          </div>
          <div className="avel-kpi">
            <div className="avel-kpi-lbl">At-risk providers</div>
            <div className={`avel-kpi-val ${stats.atRisk > 0 ? "avel-kpi-val-warn" : ""}`}>
              {stats.atRisk}
            </div>
          </div>
        </div>

        <div className="avel-grid-2">
          {/* ────────── Provider list ────────── */}
          <div className="avel-card">
            <div className="avel-card-head">
              <div>
                <div className="avel-card-title">Providers in this space</div>
                <div className="avel-card-sub">
                  Clinicians currently assigned to {space.shortName}
                </div>
              </div>
            </div>
            <ul className="avel-prov-list">
              {provs.map((p) => (
                <li key={p.id} className="avel-prov-row">
                  <div className="avel-prov-av">{p.initials}</div>
                  <div className="avel-prov-id">
                    <div className="avel-prov-name">
                      {p.name}, {p.credentials}
                    </div>
                    <div className="avel-prov-meta">
                      {p.specialty} · {p.statesLicensed.join(" · ")}
                    </div>
                  </div>
                  <div className="avel-prov-stage">
                    <span className={`avel-stage-pill stage-${p.stage}`}>
                      {STAGE_LABEL[p.stage]}
                    </span>
                  </div>
                  <div className="avel-prov-ready">
                    {p.readyToBill ? (
                      <span className="avel-readiness avel-readiness-yes">Bill</span>
                    ) : p.readyToWork ? (
                      <span className="avel-readiness avel-readiness-partial">Work</span>
                    ) : (
                      <span className="avel-readiness avel-readiness-no">Onboarding</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ────────── Space requirements ────────── */}
          <div className="avel-card">
            <div className="avel-card-head">
              <div>
                <div className="avel-card-title">Credentialing requirements</div>
                <div className="avel-card-sub">
                  Specific items every provider in {space.shortName} must complete
                </div>
              </div>
            </div>
            <ul className="avel-req-list">
              {space.requirements.map((r, i) => (
                <li key={i} className="avel-req">
                  <span className="avel-req-num">{i + 1}</span>
                  <span className="avel-req-text">{r}</span>
                </li>
              ))}
            </ul>

            <div className="avel-callout-soft">
              These requirements are the Avel workflow template for
              <strong> {space.serviceLine}</strong>. They can be customized
              per facility under Workflows.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
