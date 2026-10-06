"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { stegaClean } from "next-sanity";
import { LOCALES, t, type Locale } from "@/lib/i18n";
import { alternatePath, type PageRoute } from "@/lib/translations";
import type { MenuDocument, ProductMenuDocument, SiteSettings } from "@/blocks/types";
import Logo from "./Logo";
import ProductsMenu, { MenuChevron, ProductsPanel } from "./ProductsMenu";

/**
 * Apple global nav: 44px, #1d1d1f, logo left, 12px links centered, language +
 * one small pill right. Static (not transparent) — the product bar below it
 * carries the page-level actions. The Products entry opens the mega menu; the
 * bar's blur sits on its own layer because a backdrop-filter on <header> would
 * stop the flyout's own blur from seeing the page.
 */
export default function SiteHeader({
  locale,
  menu,
  productMenu,
  settings,
  routes,
}: {
  locale: Locale;
  menu: MenuDocument | null;
  productMenu: ProductMenuDocument | null;
  settings: SiteSettings | null;
  routes: PageRoute[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setProductsOpen(false);
  }
  const onProductsChange = useCallback((next: boolean) => {
    setProductsOpen(next);
    if (next) setLangOpen(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeAll = () => {
    setOpen(false);
    setLangOpen(false);
    setProductsOpen(false);
  };
  const items = menu?.items ?? [];
  const hasProducts = Boolean(productMenu?.categories?.length);
  const brand = settings?.brandName ?? "The Aquarium Solution";

  return (
    <header className="dark sticky top-0 z-40 border-b border-transparent text-white">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -bottom-px -z-10 border-b border-white/10 bg-carbon/90 backdrop-blur-md" />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-lime focus:px-3 focus:py-1.5 focus:text-carbon">
        {t(locale, "skipToContent")}
      </a>
      <div className="container-page page-gutter flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href={`/${locale}`} aria-label={brand} onClick={closeAll} className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {productMenu && hasProducts && <ProductsMenu menu={productMenu} locale={locale} open={productsOpen} onOpenChange={onProductsChange} />}
          {items.map((item) => (
            <Link key={item._key} href={stegaClean(item.href)} className="text-[12px] tracking-[-0.01em] text-white/80 transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              className="rounded-full px-2 py-1 text-[12px] text-white/80 hover:text-white"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={t(locale, "language")}
              onClick={() => {
                setLangOpen((v) => !v);
                setProductsOpen(false);
              }}
            >
              {locale.toUpperCase()}
            </button>
            {langOpen && (
              <ul role="listbox" className="absolute right-0 mt-2 min-w-40 overflow-hidden rounded-lg bg-white py-1 text-carbon ring-1 ring-hairline">
                {LOCALES.map((l) => (
                  <li key={l.id} role="option" aria-selected={l.id === locale}>
                    <Link
                      href={alternatePath(pathname, l.id, routes)}
                      hrefLang={l.id}
                      lang={l.id}
                      className={`block px-4 py-2 text-[14px] hover:bg-frost ${l.id === locale ? "font-semibold" : ""}`}
                      onClick={closeAll}
                    >
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? t(locale, "close") : t(locale, "menu")}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`h-px w-[17px] bg-white transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`h-px w-[17px] bg-white transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`lg:hidden ${open ? "block" : "hidden"} max-h-[calc(100dvh-var(--header-h))] overflow-y-auto overscroll-contain border-t border-white/10 bg-carbon`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="container-page page-gutter flex flex-col py-3">
          {productMenu && hasProducts && (
            <div className="border-b border-white/10">
              <button
                type="button"
                className="flex w-full items-center justify-between py-3.5 text-left text-[17px] text-white/90"
                aria-expanded={mobileProductsOpen}
                aria-controls="mobile-products"
                onClick={() => setMobileProductsOpen((v) => !v)}
              >
                {productMenu.label}
                <MenuChevron className={`h-3 w-3 transition-transform duration-300 ${mobileProductsOpen ? "rotate-180" : ""}`} />
              </button>
              <div id="mobile-products" hidden={!mobileProductsOpen} className="pb-6">
                <ProductsPanel menu={productMenu} locale={locale} entrance="swap" orientation="horizontal" onNavigate={closeAll} />
              </div>
            </div>
          )}
          {items.map((item) => (
            <Link key={item._key} href={stegaClean(item.href)} className="border-b border-white/10 py-3.5 text-[17px] text-white/90 last:border-0" onClick={closeAll}>
              {item.label}
            </Link>
          ))}
          {menu?.cta && (
            <a href={stegaClean(menu.cta.href)} className="action-link action-link--primary mt-4 self-start" rel="noopener" onClick={closeAll}>
              {menu.cta.label}
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
