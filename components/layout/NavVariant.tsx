"use client";

import { useLayoutEffect } from "react";

/** Sets <html data-nav="light|dark"> so the fixed header can invert per page (page data lives below the layout). */
export default function NavVariant({ variant }: { variant: "light" | "dark" }) {
  useLayoutEffect(() => {
    document.documentElement.dataset.nav = variant;
    return () => {
      delete document.documentElement.dataset.nav;
    };
  }, [variant]);
  return null;
}
