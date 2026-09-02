type LogContext = Record<string, unknown>;

// Single place to log errors so we can later wire up a real error-reporting
// service instead of scattering bare console calls (and losing context)
// throughout the app.
export function logError(
  message: string,
  error: unknown,
  context?: LogContext
): void {
  console.error(message, {
    error: error instanceof Error ? (error.stack ?? error.message) : error,
    ...context,
  });
}
