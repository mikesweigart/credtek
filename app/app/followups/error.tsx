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
      area="followups"
      title="We couldn’t load follow-ups."
      body="The follow-up queue failed to load. No messages were sent or cancelled as a result. Try again in a moment."
    />
  );
}
