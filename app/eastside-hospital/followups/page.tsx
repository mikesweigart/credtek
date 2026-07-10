// Follow-ups — proactive command center. What needs a human nudge,
// sorted by urgency, with one-click actions that send from the user's
// connected email.

import { Suspense } from "react";
import { AvelTopbar } from "../_components/AvelNav";
import { AvelFollowups } from "../_components/AvelFollowups";

export const metadata = { title: "Follow-ups" };

export default function AvelFollowupsPage() {
  return (
    <>
      <AvelTopbar
        title="Follow-ups"
        subtitle="Everything that needs a nudge — renewals, missing documents, stalled enrollments, attestations — in one prioritized queue you can action in a click."
      />
      <Suspense fallback={null}>
        <AvelFollowups />
      </Suspense>
    </>
  );
}
