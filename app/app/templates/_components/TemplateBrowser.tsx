"use client";

// Two-pane template browser: category-grouped list on the left, preview
// of the selected template on the right. Filterable by audience and
// channel so a credentialing operator can find what they need fast.

import { useMemo, useState } from "react";
import {
  AUDIENCE_LABEL,
  CATEGORY_BLURB,
  CATEGORY_LABEL,
  CHANNEL_LABEL,
  TEMPLATES,
  type CredTemplate,
  type TemplateAudience,
  type TemplateChannel,
  type TemplateCategory,
  groupTemplates,
} from "../../../_lib/data/templates-catalog";

type AudienceFilter = "all" | TemplateAudience;
type ChannelFilter = "all" | TemplateChannel;

const CHANNEL_BADGE_CLS: Record<TemplateChannel, string> = {
  email: "tpl-chan-email",
  letter: "tpl-chan-letter",
  fax_letter: "tpl-chan-fax",
  esign: "tpl-chan-esign",
};

export function TemplateBrowser() {
  const [active, setActive] = useState<CredTemplate>(TEMPLATES[0]);
  const [audFilter, setAudFilter] = useState<AudienceFilter>("all");
  const [chanFilter, setChanFilter] = useState<ChannelFilter>("all");
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const all = groupTemplates();
    return all.map((g) => ({
      category: g.category as TemplateCategory,
      items: g.items.filter((t) => {
        if (audFilter !== "all" && t.audience !== audFilter) return false;
        if (chanFilter !== "all" && t.channel !== chanFilter) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          if (
            !t.name.toLowerCase().includes(q) &&
            !(t.subject ?? "").toLowerCase().includes(q) &&
            !t.preview.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        return true;
      }),
    })).filter((g) => g.items.length > 0);
  }, [audFilter, chanFilter, query]);

  return (
    <div className="tpl-wrap">
      {/* Filters */}
      <div className="tpl-filters portal-card">
        <input
          type="search"
          className="portal-input tpl-search"
          placeholder="Search templates…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search templates"
        />
        <div className="tpl-filter-row">
          <span className="tpl-filter-lbl">Audience</span>
          {[
            { v: "all", l: "All" },
            { v: "provider", l: "Provider" },
            { v: "facility", l: "Facility" },
            { v: "payer", l: "Payer" },
            { v: "committee", l: "Committee" },
            { v: "coordinator", l: "Coordinator" },
          ].map((f) => (
            <button
              key={f.v}
              type="button"
              className={`pg-topic${audFilter === f.v ? " pg-topic-on" : ""}`}
              onClick={() => setAudFilter(f.v as AudienceFilter)}
            >
              {f.l}
            </button>
          ))}
        </div>
        <div className="tpl-filter-row">
          <span className="tpl-filter-lbl">Channel</span>
          {[
            { v: "all", l: "All" },
            { v: "email", l: "Email" },
            { v: "letter", l: "Letter" },
            { v: "fax_letter", l: "Fax" },
            { v: "esign", l: "E-sign" },
          ].map((f) => (
            <button
              key={f.v}
              type="button"
              className={`pg-topic${chanFilter === f.v ? " pg-topic-on" : ""}`}
              onClick={() => setChanFilter(f.v as ChannelFilter)}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* Two-pane */}
      <div className="tpl-panes">
        {/* Left: list */}
        <div className="tpl-list">
          {groups.length === 0 && (
            <div className="portal-card portal-muted" style={{ textAlign: "center" }}>
              No templates match your filters.
            </div>
          )}
          {groups.map((g) => (
            <div key={g.category} className="tpl-group">
              <div className="tpl-group-head">
                <div className="tpl-group-title">{CATEGORY_LABEL[g.category]}</div>
                <div className="tpl-group-blurb">{CATEGORY_BLURB[g.category]}</div>
              </div>
              <ul className="tpl-group-list">
                {g.items.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      className={`tpl-card${active.id === t.id ? " tpl-card-on" : ""}`}
                      onClick={() => setActive(t)}
                    >
                      <div className="tpl-card-row1">
                        <span className="tpl-card-name">{t.name}</span>
                        <span className={`tpl-chan ${CHANNEL_BADGE_CLS[t.channel]}`}>
                          {CHANNEL_LABEL[t.channel]}
                        </span>
                      </div>
                      <div className="tpl-card-aud">to {AUDIENCE_LABEL[t.audience]}</div>
                      <div className="tpl-card-preview">{t.preview}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Right: preview */}
        <div className="tpl-preview-wrap">
          <div className="tpl-preview portal-card">
            <div className="tpl-preview-head">
              <div>
                <div className="tpl-preview-cat">{CATEGORY_LABEL[active.category]}</div>
                <div className="tpl-preview-name">{active.name}</div>
              </div>
              <span className={`tpl-chan ${CHANNEL_BADGE_CLS[active.channel]}`}>
                {CHANNEL_LABEL[active.channel]}
              </span>
            </div>

            <div className="tpl-meta-grid">
              <div>
                <dt>Audience</dt>
                <dd>{AUDIENCE_LABEL[active.audience]}</dd>
              </div>
              <div>
                <dt>Trigger</dt>
                <dd>{active.trigger}</dd>
              </div>
              {active.subject && (
                <div>
                  <dt>Subject line</dt>
                  <dd className="tpl-subject">{active.subject}</dd>
                </div>
              )}
            </div>

            <div className="tpl-body-lbl">Template body</div>
            <pre className="tpl-body">{active.body}</pre>

            <div className="tpl-vars">
              <div className="tpl-vars-lbl">Variables auto-filled from your data</div>
              <div className="tpl-vars-chips">
                {active.variables.map((v) => (
                  <code key={v} className="tpl-var">{v}</code>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
