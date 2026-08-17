import "server-only";
import { isSanityConfigured } from "@/sanity/env";
import type { Locale } from "@/lib/i18n";
import { getDemoHome, getDemoPage, getDemoRoutes, getDemoShell } from "@/content/demo";
import { sanityFetch } from "./live";
import { HOME_PAGE_QUERY, PAGE_BY_SLUG_QUERY, PAGE_ROUTES_QUERY, SITE_SHELL_QUERY } from "./queries";
import type { HOME_PAGE_QUERY_RESULT, PAGE_BY_SLUG_QUERY_RESULT, PAGE_ROUTES_QUERY_RESULT, SITE_SHELL_QUERY_RESULT } from "@/sanity.types";

// sanityFetch brands strings as StegaString<…> when stega may be enabled; the
// runtime values are plain strings, so we widen back to the generated result types.

/**
 * Data loaders. Demo content is used ONLY when Sanity is not configured;
 * when configured, a null result is a real 404 (never masked by demo data).
 */

export async function loadHomePage(locale: Locale, opts: { stega?: boolean } = {}) {
  if (!isSanityConfigured) return getDemoHome(locale);
  const { data } = await sanityFetch({ query: HOME_PAGE_QUERY, params: { locale }, stega: opts.stega });
  return data as HOME_PAGE_QUERY_RESULT;
}

export async function loadPageBySlug(locale: Locale, slug: string, opts: { stega?: boolean } = {}) {
  if (!isSanityConfigured) return getDemoPage(locale, slug);
  const { data } = await sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { locale, slug }, stega: opts.stega });
  return data as PAGE_BY_SLUG_QUERY_RESULT;
}

export async function loadPageRoutes() {
  if (!isSanityConfigured) return getDemoRoutes();
  const { data } = await sanityFetch({ query: PAGE_ROUTES_QUERY, perspective: "published", stega: false });
  return data as PAGE_ROUTES_QUERY_RESULT;
}

export async function loadSiteShell(locale: Locale) {
  if (!isSanityConfigured) return getDemoShell(locale);
  const { data } = await sanityFetch({ query: SITE_SHELL_QUERY, params: { locale } });
  return data as SITE_SHELL_QUERY_RESULT;
}
