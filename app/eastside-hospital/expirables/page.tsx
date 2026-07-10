// Expirables & Renewals — roster-wide countdown of every credential
// that will lapse if not renewed. Urgency-first command center.

import { AvelTopbar } from "../_components/AvelNav";
import { AvelExpirables } from "../_components/AvelExpirables";

export const metadata = { title: "Expirables & Renewals" };

export default function AvelExpirablesPage() {
  return (
    <>
      <AvelTopbar
        title="Expirables & Renewals"
        subtitle="Every license, DEA, board cert, COI, and CAQH attestation across the roster — sorted by what lapses soonest. Renewals auto-draft before the deadline."
      />
      <AvelExpirables />
    </>
  );
}
