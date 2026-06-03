// Next.js 16 instrumentation hook — runs once per runtime boot.
// Wires Sentry's server + edge configs at the appropriate time.
// Each config file is a no-op if NEXT_PUBLIC_SENTRY_DSN isn't set,
// so this stays safe even without keys.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
