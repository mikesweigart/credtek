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
      area="providers"
      title="We couldn’t load your provider roster."
      body="The roster query failed. Nothing has been changed or lost — your providers and their credentialing state are intact. Try again in a moment."
    />
  );
}
