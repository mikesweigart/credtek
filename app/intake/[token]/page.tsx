// Provider-side intake. Lives OUTSIDE the (app) shell — no coordinator
// sidebar, no demo banner — because in production a real clinician opens
// this on their phone with no context about the rest of CredTek.

import { IntakeForm } from "./IntakeForm";

type PageProps = {
  params: Promise<{ token: string }>;
};

export const metadata = {
  title: "Welcome to CredTek",
};

export default async function IntakePage({ params }: PageProps) {
  const { token } = await params;
  return <IntakeForm token={token} />;
}
