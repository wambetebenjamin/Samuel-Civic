/** Restrict post-login redirects to local paths, never another origin. */
export function safeCallbackPath(
  value: string | undefined,
  fallback = "/requests",
) {
  if (!value || !value.startsWith("/") || value.includes("\\")) return fallback;
  try {
    const parsed = new URL(value, "https://same-origin.invalid");
    return parsed.origin === "https://same-origin.invalid"
      ? parsed.pathname + parsed.search + parsed.hash
      : fallback;
  } catch {
    return fallback;
  }
}
