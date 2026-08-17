"use client";

import { useEffect, useState } from "react";
import ActionLink from "@/components/ActionLink";

export type ProductBarSection = { id: string; label: string };

/**
 * Apple "local nav": white 52px bar under the global nav — product name (21/600)
 * left, 12px section links right, one small filled pill. Sticky.
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
    return () => io.disconnect();
  }, [sections]);

  if (!sections.length && !cta) return null;

  return (
    <nav aria-label={`${title} sections`} className="sticky top-[var(--header-h)] z-30 border-b border-hairline bg-white/90 backdrop-blur-md">
      <div className="container-page page-gutter flex h-[var(--productbar-h)] items-center gap-6">
        <span className="shrink-0 text-[21px] font-semibold tracking-[-0.005em]">{title}</span>
        <ul className="ml-auto hidden items-center gap-6 overflow-x-auto md:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`text-[12px] tracking-[-0.01em] transition-colors ${active === s.id ? "text-carbon" : "text-graphite hover:text-carbon"}`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        {cta && <ActionLink link={cta} variant="primary" size="sm" className="ml-auto shrink-0 md:ml-0" />}
      </div>
    </nav>
  );
}
