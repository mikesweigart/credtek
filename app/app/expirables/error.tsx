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
      area="expirables"
      title="We couldn’t load expiring credentials."
      body="The 90-day expiry sweep failed. Treat this as unknown rather than clear — do not assume nothing is expiring. Try again, and tell us if it persists."
    />
  );
}
