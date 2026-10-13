"use client";

import { useSyncExternalStore } from "react";
import { MOBILE_MEDIA } from "@/lib/mobile-media";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(MOBILE_MEDIA);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getSnapshot = () => window.matchMedia(MOBILE_MEDIA).matches;
const getServerSnapshot = () => null;

/** True below 768 px, false above, null during SSR / before hydration. */
export function useIsMobile(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * A video's `poster` URL. `poster` cannot follow a media query, so with a mobile
 * still it is chosen after hydration — the SSR HTML carries none rather than
 * making phones fetch the desktop frame first. Without one, nothing changes.
 */
export function usePoster(desktop?: string, mobile?: string): string | undefined {
  const isMobile = useIsMobile();
  if (!mobile) return desktop;
  if (isMobile === null) return undefined;
  return isMobile ? mobile : desktop;
}
