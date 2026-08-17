import { createDataAttribute } from "next-sanity";
import { stegaClean } from "next-sanity";
import { blockComponents } from "@/blocks/registry";
import type { BlockType, PageBlock, PageDocument } from "@/blocks/types";
import type { Locale } from "@/lib/i18n";
import { dataset, isSanityConfigured, studioProjectId } from "@/sanity/env";

/**
 * Renders a page's content array through the block registry.
 * - H1 discipline: hero / animatedHeadline(h1) own the H1; otherwise the first
 *   h2 of the first rich-text block is promoted (see PortableTextBlock).
 * - Presentation: each block gets a data-sanity attribute for click-to-select
 *   and drag-to-reorder overlays.
 */
export default function PageBuilder({ page, locale }: { page: PageDocument; locale: Locale }) {
  const content = page.content ?? [];
  if (!content.length) return null;

  const alreadyHasH1 = content.some(
    (block) =>
      block._type === "heroBlock" || (block._type === "animatedHeadlineBlock" && stegaClean(block.level) === "h1"),
  );
  let promotedPortableTextHeading = false;
  const seenTypes = new Set<string>(); // first block of each type gets id=<_type> for in-page anchors

  const attr = isSanityConfigured
    ? createDataAttribute({ id: page._id, type: "page", path: "content", projectId: studioProjectId, dataset, baseUrl: "/studio" })
    : null;

  return (
    <>
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

        const anchorId = seenTypes.has(block._type) ? undefined : block._type;
        seenTypes.add(block._type);

        return (
          <div key={block._key} id={anchorId} data-sanity={attr ? attr(`[_key=="${block._key}"]`).toString() : undefined} data-block={block._type}>
            <Component block={block} locale={locale} pageId={page._id} index={index} promoteFirstHeading={promoteFirstHeading} />
          </div>
        );
      })}
    </>
  );
}
