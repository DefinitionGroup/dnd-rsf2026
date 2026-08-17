import type { PageDocument } from "@/blocks/types";
import type { Locale } from "@/lib/i18n";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { pagePath } from "@/lib/translations";
import { resolveImageUrl } from "@/sanity/lib/image";

/** Product JSON-LD when the page references a product; Organization otherwise. */
export default function ProductJsonLd({ page, locale }: { page: PageDocument; locale: Locale }) {
  const product = page.product;
  const data = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.tagline ?? page.metadata?.description,
        sku: product.sku ?? undefined,
        category: product.category ?? undefined,
        image: [product.image, ...(product.gallery ?? []).map((g) => g.image)].map((i) => resolveImageUrl(i, { width: 1200 })).filter(Boolean),
        brand: { "@type": "Brand", name: "D-D The Aquarium Solution" },
        url: absoluteUrl(pagePath({ language: locale, slug: page.slug, isHomepage: page.isHomepage })),
        inLanguage: locale,
      }
    : {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteUrl("/"),
        sameAs: ["https://www.theaquariumsolution.com/"],
      };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
