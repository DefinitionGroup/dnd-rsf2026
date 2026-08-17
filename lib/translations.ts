import type { Locale } from "@/lib/i18n";

/** Minimal shape every page-like record shares (Sanity results and demo). */
export type PageRoute = {
  language: Locale;
  slug: string;
  isHomepage?: boolean | null;
  /** translation.metadata _id from @sanity/document-internationalization (or a demo group id) */
  groupId?: string | null;
};

export function pagePath(page: PageRoute) {
  return page.isHomepage ? `/${page.language}` : `/${page.language}/${page.slug}`;
}

/** Translation-group key: plugin metadata id, else the page stands alone. */
export function groupKey(page: PageRoute & { _id?: string }) {
  return page.groupId ?? (page.isHomepage ? "home" : `${page.language}:${page.slug}`);
}

/** Map locale → localized path for a page's translation group. */
export function localizedPathsForPage(page: PageRoute, pages: PageRoute[]) {
  const key = groupKey(page);
  const paths: Partial<Record<Locale, string>> = {};
  for (const candidate of pages) {
    if (groupKey(candidate) === key) paths[candidate.language] = pagePath(candidate);
  }
  paths[page.language] = pagePath(page);
  return paths;
}

/** Given the current pathname, return the equivalent path in `targetLocale` (or the locale home). */
export function alternatePath(pathname: string, targetLocale: Locale, pages: PageRoute[]) {
  const current = pages.find((page) => pagePath(page) === pathname);
  if (!current) return `/${targetLocale}`;
  const key = groupKey(current);
  const target = pages.find((page) => page.language === targetLocale && groupKey(page) === key);
  return target ? pagePath(target) : `/${targetLocale}`;
}
