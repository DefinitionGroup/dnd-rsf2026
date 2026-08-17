import Link from "next/link";
import { stegaClean } from "next-sanity";
import type { MenuDocument, SiteSettings } from "@/blocks/types";
import { t, type Locale } from "@/lib/i18n";
import { LEGACY_SITE_ORIGIN, LEGACY_STOCKISTS_URL } from "@/lib/site";
import Logo from "./Logo";

export default function SiteFooter({ locale, menu, settings }: { locale: Locale; menu: MenuDocument | null; settings: SiteSettings | null }) {
  const year = new Date().getFullYear();
  const brand = settings?.brandName ?? "The Aquarium Solution";
  const dealerUrl = settings?.dealerLocatorUrl ?? LEGACY_STOCKISTS_URL;
  const mainSite = settings?.legacySiteUrl ?? LEGACY_SITE_ORIGIN;

  return (
    <footer className="on-dark bg-ink text-paper">
      <div className="container-site page-gutter grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo className="h-9" />
          {settings?.description && <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/70">{settings.description}</p>}
        </div>
        <div>
          <p className="eyebrow mb-4">Products</p>
          <ul className="space-y-2 text-sm">
            {(menu?.items ?? []).map((item) => (
              <li key={item._key}>
                <Link href={stegaClean(item.href)} className="no-underline hover:text-lime">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">D-D</p>
          <ul className="space-y-2 text-sm">
            <li><a href={dealerUrl} className="no-underline hover:text-lime" rel="noopener">{t(locale, "findStockist")} ↗</a></li>
            <li><a href={mainSite} className="no-underline hover:text-lime" rel="noopener">theaquariumsolution.com ↗</a></li>
            {(menu?.footerLinks ?? []).map((item) => (
              <li key={item._key}><Link href={stegaClean(item.href)} className="no-underline hover:text-lime">{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-2 text-sm">
            {(settings?.email ?? []).map((email) => <li key={email}><a href={`mailto:${email}`} className="no-underline hover:text-lime">{email}</a></li>)}
            {(settings?.phone ?? []).map((phone) => <li key={phone}><a href={`tel:${phone.replace(/\s/g, "")}`} className="no-underline hover:text-lime">{phone}</a></li>)}
            {(settings?.socialLinks ?? []).map((s) => <li key={s._key}><a href={stegaClean(s.href)} className="no-underline hover:text-lime" rel="noopener">{s.label}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="container-site page-gutter flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-paper/60">
          <span>© {year} {brand}</span>
          <span>D-D The Aquarium Solution Ltd.</span>
        </div>
      </div>
    </footer>
  );
}
