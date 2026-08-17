import { createDataAttribute, stegaClean } from "next-sanity";
import { blockComponents } from "@/blocks/registry";
import type { BlockType, PageBlock, PageDocument } from "@/blocks/types";
import ProductBar, { type ProductBarSection } from "@/components/layout/ProductBar";
import { t, type Locale } from "@/lib/i18n";
import { LEGACY_STOCKISTS_URL } from "@/lib/site";
import { dataset, isSanityConfigured, studioProjectId } from "@/sanity/env";

/**
 * Renders a page's content array through the block registry.
 * - H1 discipline: hero / animatedHeadline(h1) own the H1; otherwise the first
 *   h2 of the first rich-text block is promoted (see PortableTextBlock).
 * - Product bar (Apple local nav) sits directly under the global nav; every block with a headline/eyebrow
 *   becomes a jump link (its `eyebrow` is the label — eyebrows are not rendered
 *   above headings in this design system).
 * - Presentation: each block gets a data-sanity attribute for click-to-select
 *   and drag-to-reorder overlays.
 */
export default function PageBuilder({ page, locale, productBar = true }: { page: PageDocument; locale: Locale; productBar?: boolean }) {
  const content = page.content ?? [];
  if (!content.length) return null;

  const alreadyHasH1 = content.some(
    (block) => block._type === "heroBlock" || (block._type === "animatedHeadlineBlock" && stegaClean(block.level) === "h1"),
  );
  let promotedPortableTextHeading = false;

  const attr = isSanityConfigured
    ? createDataAttribute({ id: page._id, type: "page", path: "content", projectId: studioProjectId, dataset, baseUrl: "/studio" })
    : null;

  // one anchor id per block type (first occurrence)
  const ids = new Map<string, string>();
  const seen = new Set<string>();
  for (const b of content) {
    if (!seen.has(b._type)) {
      seen.add(b._type);
      ids.set(b._key, b._type);
    }
  }

  const sections: ProductBarSection[] = content.slice(0, 40).flatMap((b) => {
    const id = ids.get(b._key);
    if (!id || b._type === "heroBlock" || b._type === "ctaBlock") return [];
    const raw = ("eyebrow" in b && b.eyebrow) || ("headline" in b && b.headline) || "";
    const label = stegaClean(raw ?? "");
    return label ? [{ id, label: label.length > 24 ? `${label.slice(0, 23)}…` : label }] : [];
  }).slice(0, 8); // Apple local navs carry a handful of links, not a table of contents

  const cta = { label: t(locale, "findStockist"), href: LEGACY_STOCKISTS_URL };
  const bar = <ProductBar title={page.title} sections={sections} cta={cta} />;

  return (
    <>
      {productBar && bar}
      {content.map((block, index) => {
        const Component = blockComponents[block._type as BlockType] as
          | ((props: { block: PageBlock; locale: Locale; pageId?: string; index: number; promoteFirstHeading?: boolean }) => React.ReactNode)
          | undefined;
        if (!Component) return null;

        let promoteFirstHeading = false;
        if (block._type === "portableTextBlock") {
          promoteFirstHeading = !alreadyHasH1 && !promotedPortableTextHeading;
          promotedPortableTextHeading ||= promoteFirstHeading;
        }

        return (
          <div key={block._key} className="contents">
            <div
              id={ids.get(block._key)}
              className="scroll-mt-[calc(var(--header-h)+var(--productbar-h))]"
              data-sanity={attr ? attr(`[_key=="${block._key}"]`).toString() : undefined}
              data-block={block._type}
            >
              <Component block={block} locale={locale} pageId={page._id} index={index} promoteFirstHeading={promoteFirstHeading} />
            </div>
          </div>
        );
      })}
    </>
  );
}
