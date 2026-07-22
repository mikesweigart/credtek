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
      area="facilities"
      title="We couldn’t load your facilities."
      body="The facility list failed to load. No facility or credential records were modified. Try again in a moment."
    />
  );
}
