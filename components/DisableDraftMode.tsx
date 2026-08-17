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
      className="fixed bottom-4 right-4 z-50 rounded-full bg-ink px-4 py-2 font-display text-xs uppercase tracking-wider text-paper shadow-lg hover:bg-lime hover:text-ink"
    >
      {t(locale, "disableDraft")}
    </a>
  );
}
