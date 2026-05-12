"use client";

// Tiny client component so the parent /onepager page stays server-
// rendered. Clicking just invokes the browser's print dialog —
// the @media print CSS rules handle the layout.

export function PrintButton() {
  return (
    <button
      className="op-print-btn"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      type="button"
    >
      Save as PDF
    </button>
  );
}
