"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { stegaClean } from "next-sanity";
import { LOCALES, t, type Locale } from "@/lib/i18n";
import { alternatePath, type PageRoute } from "@/lib/translations";
import type { MenuDocument, SiteSettings } from "@/blocks/types";
import ActionLink from "@/components/ActionLink";
import Logo from "./Logo";

export default function SiteHeader({
  locale,
  menu,
  settings,
  routes,
  variant = "light",
}: {
  locale: Locale;
  menu: MenuDocument | null;
  settings: SiteSettings | null;
  routes: PageRoute[];
  variant?: "light" | "dark";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
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
  const onDark = variant === "light" && !scrolled && !open;
  // data-nav="dark" on <html> (set by NavVariant from the page) forces dark text over light pages
  const tone = onDark ? "text-paper [[data-nav=dark]_&]:text-ink" : "text-ink";
  const brand = settings?.brandName ?? "The Aquarium Solution";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${scrolled || open ? "bg-paper/95 shadow-sm backdrop-blur" : "bg-transparent"} ${tone}`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-lime focus:px-3 focus:py-2 focus:text-ink">
        {t(locale, "skipToContent")}
      </a>
      <div className="container-site page-gutter flex h-20 items-center justify-between gap-6">
        <Link href={`/${locale}`} className="flex items-center gap-3 no-underline" aria-label={brand} onClick={closeAll}>
          <Logo className="h-9 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {items.map((item) => (
            <Link key={item._key} href={stegaClean(item.href)} className="font-display text-sm uppercase tracking-wider no-underline hover:text-lime-deep">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              className="rounded-full border border-current px-3 py-1.5 font-display text-xs uppercase tracking-wider"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={t(locale, "language")}
              onClick={() => setLangOpen((v) => !v)}
            >
              {locale.toUpperCase()}
            </button>
            {langOpen && (
              <ul role="listbox" className="absolute right-0 mt-2 min-w-40 overflow-hidden rounded-xl bg-paper text-ink shadow-lg ring-1 ring-line">
                {LOCALES.map((l) => (
                  <li key={l.id} role="option" aria-selected={l.id === locale}>
                    <Link
                      href={alternatePath(pathname, l.id, routes)}
                      hrefLang={l.id}
                      lang={l.id}
                      className={`block px-4 py-2 text-sm no-underline hover:bg-sand ${l.id === locale ? "font-bold" : ""}`}
                      onClick={closeAll}
                    >
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {menu?.cta && <ActionLink link={menu.cta} variant="primary" className="hidden md:inline-flex" />}
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? t(locale, "close") : t(locale, "menu")}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`h-0.5 w-6 bg-current transition ${open ? "translate-y-1 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-current transition ${open ? "-translate-y-1 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <div id="mobile-navigation" className={`lg:hidden ${open ? "block" : "hidden"} border-t border-line bg-paper text-ink`} aria-hidden={!open}>
        <nav aria-label="Mobile" className="container-site page-gutter flex flex-col gap-2 py-6">
          {items.map((item, index) => (
            <Link key={item._key} href={stegaClean(item.href)} className="flex items-baseline gap-4 py-2 font-display text-2xl uppercase no-underline" onClick={closeAll}>
              <span className="text-xs text-lime-deep">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
          {menu?.cta && <ActionLink link={menu.cta} variant="primary" className="mt-4 self-start" />}
        </nav>
      </div>
    </header>
  );
}
