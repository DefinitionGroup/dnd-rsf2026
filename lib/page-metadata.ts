import type { Metadata } from "next";
import type { PageDocument, SiteSettings } from "@/blocks/types";
import { LOCALES, localeMeta, type Locale } from "@/lib/i18n";
import { absoluteUrl, SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import { pagePath, type PageRoute } from "@/lib/translations";
import { resolveImageUrl } from "@/sanity/lib/image";

/**
 * Per-page metadata: title cascade, canonical, hreflang for every existing
 * translation (x-default → en when present), OG/Twitter, content-language.
 */
export function buildPageMetadata({
  page,
  locale,
  settings,
}: {
  page: PageDocument;
  locale: Locale;
  settings: SiteSettings | null;
}): Metadata {
  const title = page.metadata?.title || page.title || settings?.defaultMetadata?.title || SITE_NAME;
  const description = page.metadata?.description || settings?.defaultMetadata?.description || undefined;
  const sourceImage = page.metadata?.image?.asset ? page.metadata.image : settings?.defaultMetadata?.image;
  const image = resolveImageUrl(sourceImage, { width: 1200, height: 630 });

  // The page itself + its translation siblings (from translation.metadata)
  const routes: PageRoute[] = [
    { language: page.language, slug: page.slug, isHomepage: page.isHomepage },
    ...(page.translations ?? [])
      .filter((tr): tr is { language: string; slug: string | null; isHomepage: boolean | null } & { slug: string } => Boolean(tr.slug))
      .map((tr) => ({ language: tr.language as Locale, slug: tr.slug, isHomepage: tr.isHomepage })),
  ];
  const localizedPaths: Partial<Record<Locale, string>> = {};
  for (const r of routes) localizedPaths[r.language] = pagePath(r);

  const isFallback = page.language !== locale;
  const canonicalPath = isFallback ? `/${locale}/${page.slug}` : pagePath({ language: locale, slug: page.slug, isHomepage: page.isHomepage });
  const canonical = absoluteUrl(isFallback ? pagePath(routes[0]) : canonicalPath);

  const languages: Record<string, string> = {};
  for (const [lang, path] of Object.entries(localizedPaths)) if (path) languages[lang] = absoluteUrl(path);
  if (localizedPaths.en) languages["x-default"] = absoluteUrl(localizedPaths.en);

  const og = localeMeta(locale).ogLocale;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical, languages: Object.keys(languages).length > 1 ? languages : undefined },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      locale: og,
      alternateLocale: LOCALES.filter((l) => l.id !== locale && localizedPaths[l.id]).map((l) => l.ogLocale),
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
    other: { "content-language": locale },
    robots: isFallback ? { index: false, follow: true } : undefined,
  };
}

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "Aquarium add-ons and reef equipment by D-D The Aquarium Solution.",
  applicationName: SITE_NAME,
};
