"use client";

import { usePathname } from "next/navigation";
import { useIsPresentationTool } from "next-sanity/hooks";
import { t, type Locale } from "@/lib/i18n";

export default function DisableDraftMode({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const inPresentation = useIsPresentationTool();
  if (inPresentation) return null;
  return (
    <a
      href={`/api/draft-mode/disable?redirect=${encodeURIComponent(pathname)}`}
      className="elevated fixed bottom-4 right-4 z-50 rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper no-underline hover:bg-lime hover:text-ink"
    >
      {t(locale, "disableDraft")}
    </a>
  );
}
