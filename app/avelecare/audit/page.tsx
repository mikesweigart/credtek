// NCQA Audit Binder — one-click audit-ready evidence packet generator
// for delegated-credentialing arrangements.

import { AvelTopbar } from "../_components/AvelNav";
import { AvelAuditBinder } from "../_components/AvelAuditBinder";

export const metadata = { title: "NCQA Audit Binder" };

export default function AvelAuditPage() {
  return (
    <>
      <AvelTopbar
        title="NCQA Audit Binder"
        subtitle="Generate an audit-ready evidence packet for delegated credentialing — PSV evidence, committee decisions, and a tamper-evident hash chain — in one click."
      />
      <AvelAuditBinder />
    </>
  );
}
