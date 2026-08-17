import Link from "next/link";
import { headers } from "next/headers";
import { isLocale, t, type Locale } from "@/lib/i18n";
import NavVariant from "@/components/layout/NavVariant";

export default async function NotFound() {
  // Locale is not available as a param in not-found; best-effort from the URL.
  const h = await headers();
  const referer = h.get("x-invoke-path") || h.get("referer") || "";
  const match = referer.match(/\/([a-z]{2})(\/|$)/);
  const locale: Locale = match && isLocale(match[1]) ? (match[1] as Locale) : "en";
  return (
    <>
      <NavVariant variant="dark" />
      <section className="section-space page-gutter">
        <div className="container-site max-w-2xl">
          <p className="label mb-3">404</p>
          <h1>{t(locale, "notFoundTitle")}</h1>
          <p className="mt-4 text-lg text-muted">{t(locale, "notFoundBody")}</p>
          <Link href={`/${locale}`} className="action-link action-link--primary mt-8">{t(locale, "backHome")}</Link>
        </div>
      </section>
    </>
  );
}
