import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { VisualEditing } from "next-sanity/visual-editing";
import { fontClassNames } from "@/app/fonts";
import DisableDraftMode from "@/components/DisableDraftMode";
import SiteShell from "@/components/layout/SiteShell";
import { isLocale, localeMeta, locales, type Locale } from "@/lib/i18n";
import { baseMetadata } from "@/lib/page-metadata";
import { isSanityConfigured } from "@/sanity/env";
import { SanityLive } from "@/sanity/lib/live";
import { loadPageRoutes, loadSiteShell } from "@/sanity/lib/loaders";
import type { PageRoute } from "@/lib/translations";
import DirectionContract from "@/components/DirectionContract";
import RiseObserver from "@/components/motion/RiseObserver";
import "../../globals.css";

export const metadata = baseMetadata;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: requested } = await params;
  if (!isLocale(requested)) notFound();
  const locale = requested as Locale;

  const [shell, routes, { isEnabled: isDraft }] = await Promise.all([loadSiteShell(locale), loadPageRoutes(), draftMode()]);

  return (
    <html lang={localeMeta(locale).htmlLang} className={fontClassNames}>
      <body>
        {/* impeccable direction contract — kept in the emitted HTML so the finish review can audit it */}
        <DirectionContract />
        <RiseObserver />
        <SiteShell locale={locale} data={shell} routes={routes as PageRoute[]}>
          {children}
        </SiteShell>
        {isSanityConfigured && <SanityLive />}
        {isSanityConfigured && isDraft && (
          <>
            <VisualEditing />
            <DisableDraftMode locale={locale} />
          </>
        )}
      </body>
    </html>
  );
}
