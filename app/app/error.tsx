"use client";

// Root error boundary for the authenticated app. Segment-level
// boundaries below this one handle their own routes with scoped copy;
// this catches anything they do not.

import { SegmentError } from "./_components/SegmentError";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      error={error}
      reset={reset}
      area="root"
      title="Something went sideways."
      body="The workspace hit an unexpected error rendering this page. Your data is safe — nothing was lost. Try again, or head back to the dashboard."
    />
  );
}
