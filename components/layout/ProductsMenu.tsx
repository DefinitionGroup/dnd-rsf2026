"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { stegaClean } from "next-sanity";
import type { ProductMenuCategory, ProductMenuDocument, ProductMenuItem } from "@/blocks/types";
import { t, type Locale } from "@/lib/i18n";

/**
 * Products mega menu (Sanity `productMenu`). Desktop: the nav entry opens a
 * flyout under the 44px nav while a curtain dims the page. Categories are a
 * tablist on the left; the selected one's product lines sit in group columns
 * on the right; one pill filters to the own brand. The panel is reused inside
 * the mobile menu sheet, where the categories scroll sideways.
 * Styles: `.mm-*` in app/globals.css.
 */

const isHouse = (item: ProductMenuItem) => item.brand?.house === true;

function visibleGroups(category: ProductMenuCategory | undefined, houseOnly: boolean) {
  return (category?.groups ?? [])
    .map((group) => ({ ...group, items: (group.items ?? []).filter((item) => !houseOnly || isHouse(item)) }))
    .filter((group) => group.items.length > 0);
}

const countLines = (category: ProductMenuCategory | undefined, houseOnly: boolean) =>
  visibleGroups(category, houseOnly).reduce((n, group) => n + group.items.length, 0);

export function MenuChevron({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 4.5L6 8.5l4-4" />
    </svg>
  );
}

export default function ProductsMenu({
  menu,
  locale,
  open,
  onOpenChange,
}: {
  menu: ProductMenuDocument;
  locale: Locale;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  // Escape returns focus to the trigger; a press anywhere outside (curtain included) closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onOpenChange(false);
      triggerRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || flyoutRef.current?.contains(target)) return;
      onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, onOpenChange]);

  return (
    <div className={open ? "mm mm-open" : "mm"}>
      <button
        ref={triggerRef}
        type="button"
        className="mm-trigger"
        aria-expanded={open}
        aria-controls={`${id}-flyout`}
        onClick={() => onOpenChange(!open)}
      >
        {menu.label}
        <MenuChevron className="mm-chev" />
      </button>
      <div className="mm-curtain" aria-hidden="true" />
      <div ref={flyoutRef} id={`${id}-flyout`} className="mm-flyout" role="region" aria-label={stegaClean(menu.label)} inert={!open}>
        <div className="mm-flyout-in container-site page-gutter">
          <ProductsPanel menu={menu} locale={locale} entrance="rise" open={open} onNavigate={() => onOpenChange(false)} />
        </div>
      </div>
    </div>
  );
}

/**
 * Categories + product lines. `entrance="rise"` staggers the columns in each time
 * `open` turns true (desktop flyout); after that, and always with "swap", a
 * category change replays a short rise on the columns only.
 */
export function ProductsPanel({
  menu,
  locale,
  entrance,
  open = true,
  orientation = "vertical",
  onNavigate,
}: {
  menu: ProductMenuDocument;
  locale: Locale;
  entrance: "rise" | "swap";
  open?: boolean;
  orientation?: "vertical" | "horizontal";
  onNavigate?: () => void;
}) {
  const id = useId();
  const tabs = useRef(new Map<string, HTMLButtonElement>());
  const categories = useMemo(() => menu.categories ?? [], [menu.categories]);
  const [selected, setSelected] = useState<string | null>(null);
  const [houseOnly, setHouseOnly] = useState(false);
  const [swapped, setSwapped] = useState(entrance === "swap");
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open && entrance === "rise") setSwapped(false);
  }

  const house = useMemo(
    () => categories.flatMap((c) => c.groups ?? []).flatMap((g) => g.items ?? []).find(isHouse)?.brand ?? null,
    [categories],
  );
  const counts = useMemo(() => new Map(categories.map((c) => [c._key, countLines(c, houseOnly)])), [categories, houseOnly]);
  const live = categories.filter((c) => counts.get(c._key));
  const current = live.find((c) => c._key === selected) ?? live[0];
  if (!current) return null;

  const groups = visibleGroups(current, houseOnly);
  const houseHere = countLines(current, true);
  const track = groups.length >= 4 ? "repeat(auto-fill, minmax(204px, 1fr))" : `repeat(${groups.length}, minmax(204px, 312px))`;
  const rise = entrance === "rise" ? "mm-rise" : "";

  const select = (key: string) => {
    if (key === current._key) return;
    setSelected(key);
    setSwapped(true);
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const at = live.indexOf(current);
    const moves: Record<string, ProductMenuCategory | undefined> = {
      ArrowDown: live[at + 1],
      ArrowRight: live[at + 1],
      ArrowUp: live[at - 1],
      ArrowLeft: live[at - 1],
      Home: live[0],
      End: live[live.length - 1],
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = moves[event.key];
    if (!next) return;
    select(next._key);
    tabs.current.get(next._key)?.focus();
  };

  const toggleHouse = () => {
    const next = !houseOnly;
    setHouseOnly(next);
    setSwapped(true);
    if (!countLines(current, next)) setSelected(categories.find((c) => countLines(c, next))?._key ?? null);
  };

  return (
    <div className="mm-panel">
      <div className={rise} data-i="0">
        <p className="mm-label mm-head">{t(locale, "categories")}</p>
        <div className="mm-cats" role="tablist" aria-orientation={orientation} aria-label={t(locale, "categories")}>
          {categories.map((category) => {
            const empty = !counts.get(category._key);
            const isSelected = category._key === current._key;
            return (
              <button
                key={category._key}
                ref={(el) => {
                  if (el) tabs.current.set(category._key, el);
                  else tabs.current.delete(category._key);
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${category._key}`}
                className="mm-cat"
                aria-selected={isSelected}
                aria-controls={`${id}-lines`}
                aria-disabled={empty || undefined}
                data-empty={empty || undefined}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => !empty && select(category._key)}
                onKeyDown={onTabKey}
              >
                {category.title}
              </button>
            );
          })}
        </div>
        {menu.allProductsLink?.href && (
          <MenuLink href={menu.allProductsLink.href} className="mm-all" onNavigate={onNavigate}>
            {menu.allProductsLink.label}
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4.5 2l4 4-4 4" />
            </svg>
          </MenuLink>
        )}
      </div>

      <div className="mm-main">
        <div className={`mm-prod-head ${rise}`} data-i="1">
          {house && (
            <button type="button" className="mm-only" aria-pressed={houseOnly} disabled={!houseHere && !houseOnly} onClick={toggleHouse}>
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 6.3l2.6 2.6L10 3.5" />
              </svg>
              {t(locale, "brandOnly").replace("{brand}", house.name)} <span className="mm-only-n">{houseHere}</span>
            </button>
          )}
        </div>
        {/* re-keyed on every change so the swap animation replays */}
        <div
          key={swapped ? `${current._key}-${houseOnly}` : "entrance"}
          id={`${id}-lines`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${current._key}`}
          className="mm-groups"
          data-house={houseOnly || undefined}
          style={{ "--mm-track": track } as CSSProperties}
        >
          {groups.map((group, gi) => (
            <div
              key={group._key}
              className={swapped ? "mm-group mm-swap" : `mm-group ${rise}`}
              data-i={swapped ? undefined : Math.min(gi + 2, 8)}
              style={swapped ? { animationDelay: `${gi * 40}ms` } : undefined}
            >
              <h3 className="mm-group-title">{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item._key}>
                    <ProductLine item={item} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductLine({ item, onNavigate }: { item: ProductMenuItem; onNavigate?: () => void }) {
  const body = (
    <>
      <span className="mm-code">{item.brand?.code}</span>
      <span className="mm-name">{item.name}</span>
      {item.badge && <span className="mm-chip">{item.badge}</span>}
    </>
  );
  const house = isHouse(item) || undefined;
  if (!item.href) {
    return (
      <span className="mm-item" data-house={house}>
        {body}
      </span>
    );
  }
  return (
    <MenuLink href={item.href} className="mm-item" data-house={house} onNavigate={onNavigate}>
      {body}
    </MenuLink>
  );
}

/** Site paths go through next/link; everything else (the old site) is a plain same-tab link. */
function MenuLink({
  href,
  className,
  onNavigate,
  children,
  ...rest
}: {
  href: string;
  className: string;
  onNavigate?: () => void;
  children: ReactNode;
  "data-house"?: true;
}) {
  const clean = stegaClean(href);
  if (clean.startsWith("/")) {
    return (
      <Link href={clean} className={className} onClick={onNavigate} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={clean} className={className} onClick={onNavigate} rel="noopener" {...rest}>
      {children}
    </a>
  );
}
