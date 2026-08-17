"use client";

import { useEffect, useState } from "react";
import ActionLink from "@/components/ActionLink";

export type ProductBarSection = { id: string; label: string };

/**
 * Sticky in-page bar under the header (the Apple "local nav" convention):
 * page title, jump links built from the page's blocks, one primary action.
 * The block `eyebrow` fields become these labels — that is where they live now.
 */
export default function ProductBar({
  title,
  sections,
  cta,
}: {
  title: string;
  sections: ProductBarSection[];
  cta?: { label: string; href: string } | null;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  if (!sections.length && !cta) return null;

  return (
    <nav
      aria-label={`${title} sections`}
      className={`sticky top-[var(--header-h)] z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md transition-shadow ${stuck ? "shadow-[0_1px_0_0_rgb(0_0_0/0.04)]" : ""}`}
    >
      <div className="container-site page-gutter flex h-[var(--productbar-h)] items-center gap-6">
        <span className="shrink-0 text-[1.05rem] font-semibold tracking-[-0.01em]">{title}</span>
        <ul className="hidden min-w-0 flex-1 items-center gap-5 overflow-x-auto md:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`text-[0.8rem] no-underline transition-colors ${active === s.id ? "text-ink font-medium" : "text-muted hover:text-ink"}`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        {cta && <ActionLink link={cta} variant="primary" className="ml-auto shrink-0 !px-4 !py-1.5 !text-[0.85rem]" />}
      </div>
    </nav>
  );
}
