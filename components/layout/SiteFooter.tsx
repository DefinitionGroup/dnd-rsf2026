import Link from "next/link";
import { stegaClean } from "next-sanity";
import type { MenuDocument, SiteSettings } from "@/blocks/types";
import { t, type Locale } from "@/lib/i18n";
import { LEGACY_SITE_ORIGIN, LEGACY_STOCKISTS_URL } from "@/lib/site";
import Logo from "./Logo";

/** Quiet footer on sand: link columns in small type, legal line. */
export default function SiteFooter({ locale, menu, settings }: { locale: Locale; menu: MenuDocument | null; settings: SiteSettings | null }) {
  const year = new Date().getFullYear();
  const brand = settings?.brandName ?? "The Aquarium Solution";
  const dealerUrl = settings?.dealerLocatorUrl ?? LEGACY_STOCKISTS_URL;
  const mainSite = settings?.legacySiteUrl ?? LEGACY_SITE_ORIGIN;
  const col = "space-y-2.5 text-[0.8rem] text-muted";
  const link = "no-underline hover:text-ink transition-colors";

  return (
    <footer className="bg-sand text-ink">
      <div className="container-site page-gutter grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          {settings?.description && <p className="mt-5 max-w-xs text-[0.85rem] leading-relaxed text-muted">{settings.description}</p>}
        </div>
        <div>
          <p className="mb-3 text-[0.8rem] font-semibold">Products</p>
          <ul className={col}>
            {(menu?.items ?? []).map((item) => (
              <li key={item._key}><Link href={stegaClean(item.href)} className={link}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-[0.8rem] font-semibold">D-D</p>
          <ul className={col}>
            <li><a href={dealerUrl} className={link} rel="noopener">{t(locale, "findStockist")}</a></li>
            <li><a href={mainSite} className={link} rel="noopener">theaquariumsolution.com</a></li>
            {(menu?.footerLinks ?? []).map((item) => (
              <li key={item._key}><Link href={stegaClean(item.href)} className={link}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-[0.8rem] font-semibold">Contact</p>
          <ul className={col}>
            {(settings?.email ?? []).map((email) => <li key={email}><a href={`mailto:${email}`} className={link}>{email}</a></li>)}
            {(settings?.phone ?? []).map((phone) => <li key={phone}><a href={`tel:${phone.replace(/\s/g, "")}`} className={link}>{phone}</a></li>)}
            {(settings?.socialLinks ?? []).map((s) => <li key={s._key}><a href={stegaClean(s.href)} className={link} rel="noopener">{s.label}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-line/70">
        <div className="container-site page-gutter flex flex-wrap items-center justify-between gap-3 py-4 text-[0.75rem] text-muted">
          <span>© {year} {brand}</span>
          <span>D-D The Aquarium Solution Ltd.</span>
        </div>
      </div>
    </footer>
  );
}
