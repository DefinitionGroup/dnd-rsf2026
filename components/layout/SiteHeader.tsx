"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { stegaClean } from "next-sanity";
import { LOCALES, t, type Locale } from "@/lib/i18n";
import { alternatePath, type PageRoute } from "@/lib/translations";
import type { MenuDocument, SiteSettings } from "@/blocks/types";
import Logo from "./Logo";

/**
 * Compact global bar (48px): brand, primary nav, language, one CTA.
 * Sits over the hero (light text via data-nav="light") and turns opaque on scroll.
 */
export default function SiteHeader({
  locale,
  menu,
  settings,
  routes,
}: {
  locale: Locale;
  menu: MenuDocument | null;
  settings: SiteSettings | null;
  routes: PageRoute[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
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
  };

  const items = menu?.items ?? [];
  const brand = settings?.brandName ?? "The Aquarium Solution";
  const solid = scrolled || open;
  // over a dark hero (data-nav=light) the bar is transparent with light text until scrolled
  const tone = solid ? "bg-paper/85 text-ink backdrop-blur-md" : "bg-transparent text-paper [[data-nav=dark]_&]:text-ink";

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,color] duration-300 ${tone}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-lime focus:px-3 focus:py-1.5 focus:text-ink">
        {t(locale, "skipToContent")}
      </a>
      <div className="container-wide page-gutter flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href={`/${locale}`} className="no-underline" aria-label={brand} onClick={closeAll}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {items.map((item) => (
            <Link key={item._key} href={stegaClean(item.href)} className="text-[0.8rem] font-medium no-underline opacity-90 transition-opacity hover:opacity-100">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              className="rounded-full px-2.5 py-1 text-[0.75rem] font-medium tracking-wide opacity-90 hover:opacity-100"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={t(locale, "language")}
              onClick={() => setLangOpen((v) => !v)}
            >
              {locale.toUpperCase()}
            </button>
            {langOpen && (
              <ul role="listbox" className="elevated absolute right-0 mt-2 min-w-40 overflow-hidden rounded-xl bg-paper py-1 text-ink ring-1 ring-line/60">
                {LOCALES.map((l) => (
                  <li key={l.id} role="option" aria-selected={l.id === locale}>
                    <Link
                      href={alternatePath(pathname, l.id, routes)}
                      hrefLang={l.id}
                      lang={l.id}
                      className={`block px-4 py-2 text-sm no-underline hover:bg-sand ${l.id === locale ? "font-semibold" : ""}`}
                      onClick={closeAll}
                    >
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {menu?.cta && (
            <a
              href={stegaClean(menu.cta.href)}
              className="hidden rounded-full bg-lime px-3.5 py-1.5 text-[0.8rem] font-medium text-ink no-underline transition-colors hover:bg-[#a6d63f] md:inline-flex"
              rel="noopener"
              target={menu.cta.href.startsWith("http") ? "_blank" : undefined}
            >
              {menu.cta.label}
            </a>
          )}
          <button
            type="button"
            className="ml-1 flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? t(locale, "close") : t(locale, "menu")}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`h-[1.5px] w-[18px] bg-current transition-transform ${open ? "translate-y-[3.25px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-[18px] bg-current transition-transform ${open ? "-translate-y-[3.25px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <div id="mobile-navigation" className={`lg:hidden ${open ? "block" : "hidden"} border-t border-line/60 bg-paper text-ink`} aria-hidden={!open}>
        <nav aria-label="Mobile" className="container-site page-gutter flex flex-col py-4">
          {items.map((item) => (
            <Link key={item._key} href={stegaClean(item.href)} className="border-b border-line/60 py-3.5 text-lg font-medium no-underline last:border-0" onClick={closeAll}>
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
