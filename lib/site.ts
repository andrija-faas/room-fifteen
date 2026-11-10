type SiteEnv = Record<string, string | undefined>;

/** Absolute base URL for metadata (OG/Twitter image links). */
export function siteUrl(env: SiteEnv = process.env): URL {
  if (env.NEXT_PUBLIC_SITE_URL) return new URL(env.NEXT_PUBLIC_SITE_URL);
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return new URL(`https://${env.VERCEL_PROJECT_PRODUCTION_URL}`);
  return new URL("http://localhost:3000");
}
