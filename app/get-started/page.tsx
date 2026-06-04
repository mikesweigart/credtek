import type { Metadata } from "next";
import { IntakeWizard } from "../_components/IntakeWizard";

// Public, no-auth onboarding front door. A practice administrator, MSO ops
// lead, or credentialing manager starts here to onboard their providers —
// either by filling out the guided form or uploading a roster for our team
// to enter. The wizard is a client component; this server wrapper just sets
// metadata and renders it.

export const metadata: Metadata = {
  title: "Provider onboarding",
  description:
    "Onboard your providers with CredTek in minutes. Add each provider with live NPI validation, pick the states and payors you need, or upload your roster and we'll enter it for you.",
  alternates: { canonical: "/get-started" },
  openGraph: {
    title: "Onboard your providers — CredTek",
    description:
      "Start credentialing in minutes. Guided intake with live NPI validation, or upload a roster and we'll do the data entry.",
    url: "https://cred-tek.com/get-started",
    type: "website",
  },
};

export default function GetStartedPage() {
  return <IntakeWizard />;
}
