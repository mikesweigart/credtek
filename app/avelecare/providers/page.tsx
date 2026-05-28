// Providers — full AVEL eCare clinician roster. The table, filters,
// and row navigation are handled by the AvelProviderTable client
// component so the filters actually filter and rows open the detail.

import { AvelTopbar } from "../_components/AvelNav";
import { AvelProviderTable } from "../_components/AvelProviderTable";

export const metadata = { title: "Providers" };

export default function AvelProviders() {
  return (
    <>
      <AvelTopbar
        title="Providers"
        subtitle="Track credentialing and enrollment status for every AVEL eCare clinician in one place."
      />
      <div className="avel-content">
        <AvelProviderTable />
      </div>
    </>
  );
}
