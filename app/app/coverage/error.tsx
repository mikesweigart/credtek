"use client";

import { SegmentError } from "../_components/SegmentError";

export default function Error({
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
      area="coverage"
      title="We couldn’t build the coverage matrix."
      body="The billable-coverage view failed to load. This is a display problem, not a change to any enrollment. Try again, or check an individual provider in the meantime."
    />
  );
}
