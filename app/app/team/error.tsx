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
      area="team"
      title="We couldn’t load your team."
      body="The workspace member list failed to load. Nobody’s access or role has changed. Try again in a moment."
    />
  );
}
