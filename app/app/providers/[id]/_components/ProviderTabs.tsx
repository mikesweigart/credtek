"use client";

// Client tab shell for the provider workspace. Server-rendered section
// content (with its forms + live data) is passed in as slots; this just
// toggles which is visible — keeping the forms as server actions.

import { useState, type ReactNode } from "react";

type Props = {
  counts: { licenses: number; credentials: number; documents: number; enrollment: number };
  summary: ReactNode;
  licenses: ReactNode;
  credentials: ReactNode;
  documents: ReactNode;
  enrollment: ReactNode;
};

type TabId = "summary" | "licenses" | "credentials" | "documents" | "enrollment";

export function ProviderTabs({ counts, summary, licenses, credentials, documents, enrollment }: Props) {
  const [tab, setTab] = useState<TabId>("summary");

  const TABS: { id: TabId; label: string; count?: number }[] = [
    { id: "summary", label: "Summary" },
    { id: "licenses", label: "Licenses", count: counts.licenses },
    { id: "credentials", label: "Credentials", count: counts.credentials },
    { id: "documents", label: "Documents", count: counts.documents },
    { id: "enrollment", label: "Payer Enrollment", count: counts.enrollment },
  ];

  return (
    <>
      <div className="portal-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`portal-tab${tab === t.id ? " is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {typeof t.count === "number" && <span className="portal-tab-count">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === "summary" && summary}
      {tab === "licenses" && licenses}
      {tab === "credentials" && credentials}
      {tab === "documents" && documents}
      {tab === "enrollment" && enrollment}
    </>
  );
}
