import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBuilder from "@/components/PageBuilder";
import NavVariant from "@/components/layout/NavVariant";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import { loadHomePage, loadSiteShell } from "@/sanity/lib/loaders";
import { stegaClean } from "next-sanity";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const [page, shell] = await Promise.all([loadHomePage(locale as Locale, { stega: false }), loadSiteShell(locale as Locale)]);
  if (!page) return {};
  return buildPageMetadata({ page, locale: locale as Locale, settings: shell.settings });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale = value as Locale;
  const page = await loadHomePage(locale);
  if (!page) notFound();

  return (
    <>
      <NavVariant variant={stegaClean(page.navbarVariant) === "dark" ? "dark" : "light"} />
      <ProductJsonLd page={page} locale={locale} />
      <PageBuilder page={page} locale={locale} />
    </>
  );
}
