import Link from "next/link";
import { stegaClean } from "next-sanity";
import type { MenuDocument, SiteSettings } from "@/blocks/types";
import { t, type Locale } from "@/lib/i18n";
import { LEGACY_SITE_ORIGIN, LEGACY_STOCKISTS_URL } from "@/lib/site";
import Logo from "./Logo";

/** Apple footer: frost canvas, 12px link columns, hairline dividers, typographic. */
export default function SiteFooter({ locale, menu, settings }: { locale: Locale; menu: MenuDocument | null; settings: SiteSettings | null }) {
  const year = new Date().getFullYear();
  const brand = settings?.brandName ?? "The Aquarium Solution";
  const dealerUrl = settings?.dealerLocatorUrl ?? LEGACY_STOCKISTS_URL;
  const mainSite = settings?.legacySiteUrl ?? LEGACY_SITE_ORIGIN;
  const head = "mb-2.5 text-[12px] font-semibold text-carbon";
  const col = "space-y-2 text-[12px] text-ash";
  const link = "hover:underline";

  return (
    <footer className="canvas-frost text-carbon">
      <div className="container-text page-gutter">
        <div className="grid gap-8 border-b border-hairline py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="dark" />
            {settings?.description && <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-ash">{settings.description}</p>}
          </div>
          <div>
            <p className={head}>Products</p>
            <ul className={col}>{(menu?.items ?? []).map((item) => <li key={item._key}><Link href={stegaClean(item.href)} className={link}>{item.label}</Link></li>)}</ul>
          </div>
          <div>
            <p className={head}>D-D</p>
            <ul className={col}>
              <li><a href={dealerUrl} className={link} rel="noopener">{t(locale, "findStockist")}</a></li>
              <li><a href={mainSite} className={link} rel="noopener">theaquariumsolution.com</a></li>
              {(menu?.footerLinks ?? []).map((item) => <li key={item._key}><Link href={stegaClean(item.href)} className={link}>{item.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className={head}>Contact</p>
            <ul className={col}>
              {(settings?.email ?? []).map((email) => <li key={email}><a href={`mailto:${email}`} className={link}>{email}</a></li>)}
              {(settings?.phone ?? []).map((phone) => <li key={phone}><a href={`tel:${phone.replace(/\s/g, "")}`} className={link}>{phone}</a></li>)}
              {(settings?.socialLinks ?? []).map((s) => <li key={s._key}><a href={stegaClean(s.href)} className={link} rel="noopener">{s.label}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 py-4 text-[12px] text-ash">
          <span>Copyright © {year} {brand}. All rights reserved.</span>
          <span>D-D The Aquarium Solution Ltd.</span>
        </div>
      </div>
    </footer>
  );
}
