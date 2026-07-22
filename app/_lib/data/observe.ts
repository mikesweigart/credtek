// Query-failure observability for the data layer.
//
// Every read in this app degrades to an empty result when its query
// fails. That's the right call for availability — one broken panel
// shouldn't blank a page — but it has a nasty property in a
// CREDENTIALING product: "the query failed" and "there is nothing here"
// render identically.
//
// "No sanctions found" and "we never actually checked" look the same on
// screen and mean opposite things to a compliance officer. So a swallowed
// error must at minimum be LOUD in our logs, and on compliance-critical
// surfaces it must be visible to the user too (see QueryResult below).
//
// This module is the "loud in our logs" half.

import * as Sentry from "@sentry/nextjs";

type SupabaseishError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
} | null;

/**
 * Record a query failure. Never throws — reporting a problem must not
 * become a second problem.
 *
 * @param where  Stable identifier, e.g. "listScreenings". Used for grouping.
 */
export function reportQueryError(where: string, error: SupabaseishError | unknown): void {
  if (!error) return;
  try {
    const e = error as SupabaseishError;
    const detail = {
      where,
      code: e?.code,
      message: e?.message ?? String(error),
      details: e?.details,
      hint: e?.hint,
    };
    // eslint-disable-next-line no-console
    console.error("[credtek-query-failed]", detail);
    Sentry.captureException(
      error instanceof Error ? error : new Error(`${where}: ${detail.message}`),
      { tags: { area: "data-layer", query: where }, extra: detail },
    );
  } catch {
    /* observability must never break the request */
  }
}

/**
 * For reads where an empty result is genuinely ambiguous and the
 * distinction matters to the user — sanctions/exclusion screening being
 * the obvious one.
 *
 * `failed: true` means we could not determine the answer. The UI is
 * expected to say so rather than render an innocent-looking empty state.
 */
export type QueryResult<T> = { rows: T[]; failed: boolean };

export const okResult = <T,>(rows: T[]): QueryResult<T> => ({ rows, failed: false });
export const failedResult = <T,>(): QueryResult<T> => ({ rows: [], failed: true });
