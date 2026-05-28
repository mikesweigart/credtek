// Re-credentialing — the 3-year cycle forecast + worklist. Plans the
// recurring committee re-approval workload distinct from short-term
// document expirables.

import { AvelTopbar } from "../_components/AvelNav";
import { AvelRecred } from "../_components/AvelRecred";

export const metadata = { title: "Re-credentialing" };

export default function AvelRecredPage() {
  return (
    <>
      <AvelTopbar
        title="Re-credentialing"
        subtitle="The 3-year re-verification cycle, forecast by quarter — so the full committee re-approval workload never sneaks up on your team."
      />
      <AvelRecred />
    </>
  );
}
