/**
 * Falls back to the current production URL (see wrangler.jsonc) until a
 * custom domain / NEXT_PUBLIC_SITE_URL env var is wired up.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://website.paszko-damian.workers.dev";
