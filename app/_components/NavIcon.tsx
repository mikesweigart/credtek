// Shared stroke-style SVG icon set for app navigation shells.
//
// One small, dependency-free component so every shell (the (app) portal rail,
// the avelecare demo, ops) draws from the SAME crisp icon vocabulary instead
// of unicode glyphs. 24x24 viewBox, 1.75 stroke, round joins — matches the
// landing/intake icon aesthetic.

import type { ReactElement } from "react";

const ICONS: Record<string, ReactElement> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  approvals: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="m8 12 3 3 5-5.5" />
    </>
  ),
  providers: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  supervision: (
    <>
      <path d="M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="2.5" width="6" height="4" rx="1" />
      <path d="m8.5 13.5 2 2 4-4" />
    </>
  ),
  payors: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V10l7-4.5 7 4.5v11" />
      <path d="M9.5 21v-4.5h5V21" />
      <path d="M9 11h.01M15 11h.01" />
    </>
  ),
  licenses: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14 -1.5 7 5-3 5 3-1.5-7" />
      <path d="m9.5 9 1.8 1.8L15 7" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  invite: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  followup: (
    <>
      <path d="M15 14l5-5-5-5" />
      <path d="M20 9H9a4 4 0 0 0-4 4v7" />
    </>
  ),
  spaces: (
    <>
      <path d="m12 2 10 5-10 5L2 7l10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </>
  ),
  expirables: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 6.5V12l4 2" />
    </>
  ),
  recred: (
    <>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </>
  ),
  workflows: (
    <>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="6" cy="18" r="2.4" />
      <circle cx="18" cy="9" r="2.4" />
      <path d="M6 8.4v7.2M8.4 6H14a2.5 2.5 0 0 1 0 5H8.4" />
    </>
  ),
  documents: (
    <>
      <path d="M14 3v5h5" />
      <path d="M7 3h8l5 5v13H7z" />
      <path d="M9.5 13h5M9.5 17h5" />
    </>
  ),
  audit: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      <path d="m9.5 9 1.5 1.5L14 7.5" />
    </>
  ),
  reports: (
    <>
      <path d="M3 21h18" />
      <path d="M7 21V11M12 21V5M17 21v-7" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.2 9.2a3 3 0 0 1 5.7 1c0 2-3 2.6-3 2.6" />
      <path d="M12 17h.01" />
    </>
  ),
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9Z" />,
  alert: (
    <>
      <path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  trendUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  trendDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  chevron: <path d="m9 18 6-6-6-6" />,
};

export function NavIcon({ name, size = 18 }: { name: string; size?: number }) {
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
      {ICONS[name] ?? null}
    </svg>
  );
}
