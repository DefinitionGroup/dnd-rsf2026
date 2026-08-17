"use client";

import { useEffect } from "react";

/**
 * Global driver for the one authored scroll motion: any element with `.rise`
 * gets `.is-in` when it enters the viewport (SectionHeader, Reveal, ad-hoc).
 * Adds `html.js` so CSS knows JS is present; no-JS stays visible.
 */
export default function RiseObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>(".rise").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    const observe = (scope: ParentNode) => scope.querySelectorAll<HTMLElement>(".rise:not(.is-in)").forEach((el) => io.observe(el));
    observe(document);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach((n) => n instanceof HTMLElement && (n.matches(".rise") ? io.observe(n) : observe(n)));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
