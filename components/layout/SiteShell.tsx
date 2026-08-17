import type { SiteShell as SiteShellData } from "@/blocks/types";
import type { Locale } from "@/lib/i18n";
import type { PageRoute } from "@/lib/translations";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function SiteShell({
  children,
  locale,
  data,
  routes,
}: {
  children: React.ReactNode;
  locale: Locale;
  data: SiteShellData;
  routes: PageRoute[];
}) {
  return (
    <>
      <SiteHeader locale={locale} menu={data.menu} settings={data.settings} routes={routes} />
      <main id="main" className="[[data-nav=dark]_&]:pt-20">{children}</main>
      <SiteFooter locale={locale} menu={data.menu} settings={data.settings} />
    </>
  );
}
