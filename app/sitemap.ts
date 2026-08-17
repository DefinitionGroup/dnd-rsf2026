import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { groupKey, pagePath, type PageRoute } from "@/lib/translations";
import { loadPageRoutes } from "@/sanity/lib/loaders";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = (await loadPageRoutes()) as (PageRoute & { _updatedAt?: string | null })[];
  const groups = new Map<string, PageRoute[]>();
  for (const r of routes) {
    const k = groupKey(r);
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }
  return routes.map((page) => {
    const siblings = groups.get(groupKey(page)) ?? [page];
    const languages: Record<string, string> = {};
    for (const s of siblings) languages[s.language] = absoluteUrl(pagePath(s));
    return {
      url: absoluteUrl(pagePath(page)),
      lastModified: page._updatedAt ? new Date(page._updatedAt) : undefined,
      changeFrequency: page.isHomepage ? "weekly" : "monthly",
      priority: page.isHomepage ? 1 : 0.7,
      alternates: siblings.length > 1 ? { languages } : undefined,
    };
  });
}
