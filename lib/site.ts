import { defaultLocale } from "@/lib/i18n";

export const SITE_NAME = "The Aquarium Solution";
export const SITE_SHORT_NAME = "D-D";
export const DEFAULT_LOCALE_PATH = `/${defaultLocale}`;

const FALLBACK_ORIGIN = "https://www.theaquariumsolution.com";

function readOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return FALLBACK_ORIGIN;
  try {
    return new URL(configured).origin;
  } catch {
    return FALLBACK_ORIGIN;
  }
}

/** Derived from NEXT_PUBLIC_SITE_URL, never throws (final domain undecided). */
export const SITE_ORIGIN = readOrigin();

/** Links to the legacy website (dealer locator etc.). Overridable per-locale in siteSettings. */
export const LEGACY_SITE_ORIGIN = "https://www.theaquariumsolution.com";
export const LEGACY_STOCKISTS_URL = `${LEGACY_SITE_ORIGIN}/stockists`;

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_ORIGIN}/`).href.replace(/\/$/, path === "/" ? "/" : "");
}
