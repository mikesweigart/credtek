// Shared credentialing-document seed. Lives here (not inline in the
// documents page) so the provider-detail page can show a provider's
// own documents from the same source of truth.

export type DocStatus =
  | "Current"
  | "Expiring soon"
  | "Expired"
  | "Pending"
  | "Awaiting upload";

export type DocType =
  | "State License"
  | "DEA Registration"
  | "Board Certification"
  | "Malpractice (COI)"
  | "CV"
  | "Background Check"
  | "Reference"
  | "Hospital Privileging"
  | "Training Cert"
  | "NPDB Query";

export type DocRow = {
  id: string;
  name: string;
  type: DocType;
  providerSlug: string;
  spaceId?: string;
  expires?: string;
  status: DocStatus;
  size: string;
};

export const DOCS: DocRow[] = [
  { id: "d-001", name: "WA Medical License — A. Johnson", type: "State License", providerSlug: "alex-johnson", spaceId: "east-adams", expires: "Apr 14, 2027", status: "Current", size: "412 KB" },
  { id: "d-002", name: "MN Medical License — A. Johnson", type: "State License", providerSlug: "alex-johnson", spaceId: "mn-rural", expires: "Sep 30, 2026", status: "Current", size: "388 KB" },
  { id: "d-003", name: "DEA Registration — A. Johnson", type: "DEA Registration", providerSlug: "alex-johnson", expires: "Jul 2, 2027", status: "Current", size: "208 KB" },
  { id: "d-004", name: "Malpractice COI 2026 — A. Johnson", type: "Malpractice (COI)", providerSlug: "alex-johnson", expires: "Jan 1, 2027", status: "Current", size: "1.2 MB" },

  { id: "d-005", name: "WA Medical License — D. Kim", type: "State License", providerSlug: "daniel-kim", spaceId: "east-adams", expires: "Jun 12, 2026", status: "Expiring soon", size: "404 KB" },
  { id: "d-006", name: "OR Medical License — D. Kim", type: "State License", providerSlug: "daniel-kim", expires: "Mar 8, 2027", status: "Current", size: "401 KB" },
  { id: "d-007", name: "Malpractice COI 2026 — D. Kim", type: "Malpractice (COI)", providerSlug: "daniel-kim", expires: "Mar 1, 2027", status: "Current", size: "980 KB" },
  { id: "d-008", name: "Board Cert — Internal Medicine — D. Kim", type: "Board Certification", providerSlug: "daniel-kim", expires: "Dec 31, 2029", status: "Current", size: "612 KB" },

  { id: "d-009", name: "NY Medical License — S. Chen", type: "State License", providerSlug: "sarah-chen", spaceId: "ny-crisis", expires: "Aug 22, 2027", status: "Current", size: "395 KB" },
  { id: "d-010", name: "Board Cert — Psychiatry — S. Chen", type: "Board Certification", providerSlug: "sarah-chen", status: "Pending", size: "—" },
  { id: "d-011", name: "CV — S. Chen", type: "CV", providerSlug: "sarah-chen", status: "Current", size: "248 KB" },

  { id: "d-012", name: "NY LCSW License — J. Mitchell", type: "State License", providerSlug: "james-mitchell", spaceId: "ny-crisis", expires: "Oct 30, 2027", status: "Current", size: "302 KB" },
  { id: "d-013", name: "Malpractice COI — J. Mitchell", type: "Malpractice (COI)", providerSlug: "james-mitchell", expires: "Jan 1, 2027", status: "Current", size: "1.1 MB" },
  { id: "d-014", name: "Background Check — J. Mitchell", type: "Background Check", providerSlug: "james-mitchell", status: "Current", size: "184 KB" },

  { id: "d-015", name: "KS Medical License — R. Hayes", type: "State License", providerSlug: "robert-hayes", spaceId: "ks-rhtp", expires: "May 17, 2027", status: "Current", size: "421 KB" },
  { id: "d-016", name: "Board Cert — Emergency Medicine — R. Hayes", type: "Board Certification", providerSlug: "robert-hayes", expires: "Dec 31, 2028", status: "Current", size: "598 KB" },
  { id: "d-017", name: "DEA Registration — R. Hayes", type: "DEA Registration", providerSlug: "robert-hayes", expires: "Nov 4, 2027", status: "Current", size: "215 KB" },

  { id: "d-018", name: "TX LPC-A License — A. Patel", type: "State License", providerSlug: "aisha-patel", spaceId: "school-health", expires: "Jul 1, 2027", status: "Current", size: "291 KB" },
  { id: "d-019", name: "Supervision Plan — A. Patel", type: "Training Cert", providerSlug: "aisha-patel", status: "Current", size: "542 KB" },

  { id: "d-020", name: "SD Nursing License — O. Reed", type: "State License", providerSlug: "olivia-reed", spaceId: "school-health", expires: "Feb 28, 2028", status: "Current", size: "278 KB" },
  { id: "d-021", name: "CV — O. Reed", type: "CV", providerSlug: "olivia-reed", status: "Current", size: "201 KB" },
  { id: "d-022", name: "Background Check — O. Reed", type: "Background Check", providerSlug: "olivia-reed", status: "Awaiting upload", size: "—" },
  { id: "d-023", name: "Pediatric Care Attestation — O. Reed", type: "Training Cert", providerSlug: "olivia-reed", status: "Awaiting upload", size: "—" },

  { id: "d-024", name: "MN Pharmacist License — K. Park", type: "State License", providerSlug: "kevin-park", spaceId: "senior-care", expires: "Mar 20, 2027", status: "Current", size: "356 KB" },
  { id: "d-025", name: "DEA Registration — K. Park", type: "DEA Registration", providerSlug: "kevin-park", expires: "Aug 14, 2026", status: "Expiring soon", size: "210 KB" },
];

export function docStatusClass(s: DocStatus): string {
  switch (s) {
    case "Current":         return "doc-status-ok";
    case "Expiring soon":   return "doc-status-warn";
    case "Expired":         return "doc-status-bad";
    case "Pending":         return "doc-status-pending";
    case "Awaiting upload": return "doc-status-missing";
  }
}

export function documentsForProvider(slug: string): DocRow[] {
  return DOCS.filter((d) => d.providerSlug === slug);
}
