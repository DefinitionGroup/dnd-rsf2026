import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { stegaClean } from "next-sanity";
import PageBuilder from "@/components/PageBuilder";
import NavVariant from "@/components/layout/NavVariant";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import { loadPageBySlug, loadPageRoutes, loadSiteShell } from "@/sanity/lib/loaders";

export const dynamicParams = true;

export async function generateStaticParams() {
  const routes = await loadPageRoutes();
  return routes.filter((r) => !r.isHomepage && r.slug).map((r) => ({ locale: r.language, slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const [page, shell] = await Promise.all([loadPageBySlug(locale as Locale, slug, { stega: false }), loadSiteShell(locale as Locale)]);
  if (!page) return {};
  return buildPageMetadata({ page, locale: locale as Locale, settings: shell.settings });
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) notFound();
  const locale = value as Locale;
  const page = await loadPageBySlug(locale, slug);
  if (!page) notFound();

  // `en` fallback: if a real translation exists under a localized slug, send the visitor there.
  if (page.language !== locale) {
    const translated = page.translations?.find((tr) => tr.language === locale && tr.slug);
    if (translated?.slug) redirect(translated.isHomepage ? `/${locale}` : `/${locale}/${translated.slug}`);
  }

  return (
    <>
      <NavVariant variant={stegaClean(page.navbarVariant) === "dark" ? "dark" : "light"} />
      <ProductJsonLd page={page} locale={locale} />
      <PageBuilder page={page} locale={locale} />
    </>
  );
}
