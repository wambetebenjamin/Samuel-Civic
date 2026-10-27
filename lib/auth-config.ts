import "server-only";
export function authReady() {
  if (!process.env.NEXTAUTH_SECRET || !process.env.NEXTAUTH_URL) return false;
  try {
    const url = new URL(process.env.NEXTAUTH_URL);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    )
      return false;
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:")
      return false;
    const site = process.env.NEXT_PUBLIC_SITE_URL;
    if (site && new URL(site).origin !== url.origin) return false;
    return true;
  } catch {
    return false;
  }
}
