import type { Locale } from "@/lib/i18n";
import type { PAGE_BY_SLUG_QUERY_RESULT, PRODUCTS_QUERY_RESULT, SITE_SHELL_QUERY_RESULT } from "@/sanity.types";

/** A resolved landing page as returned by the page queries (also the shape of demo pages). */
export type PageDocument = NonNullable<PAGE_BY_SLUG_QUERY_RESULT>;
export type PageBlock = NonNullable<PageDocument["content"]>[number];
export type BlockType = PageBlock["_type"];
export type BlockOf<T extends BlockType> = Extract<PageBlock, { _type: T }>;

export type ProductSummary = PRODUCTS_QUERY_RESULT[number];
export type SiteShell = SITE_SHELL_QUERY_RESULT;
export type SiteSettings = NonNullable<SiteShell["settings"]>;
export type MenuDocument = NonNullable<SiteShell["menu"]>;

/** Image as projected by `imageFragment` (asset resolved). */
export type ResolvedImage = NonNullable<BlockOf<"heroBlock">["image"]>;
export type ResolvedVideo = NonNullable<BlockOf<"heroBlock">["video"]>;

export type BlockProps<T extends BlockType> = {
  block: BlockOf<T>;
  locale: Locale;
  /** Sanity document id + block key so Presentation overlays can target the array item. */
  pageId?: string;
  index: number;
};

export type BlockComponent<T extends BlockType> = (props: BlockProps<T>) => React.ReactNode | Promise<React.ReactNode>;
