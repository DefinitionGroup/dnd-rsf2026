import { insert, setIfMissing, type FormPatch } from "sanity";

/**
 * Pure helpers for "Import blocks from another page".
 * No React here: queries, cloning and patch building, so the logic stays testable
 * and the dialog only deals with UI state.
 */

export type PageSummary = {
  _id: string;
  title?: string;
  language?: string;
  slug?: string;
  blockCount: number;
};

export type PageBlock = { _key: string; _type: string; [field: string]: unknown };

/** "end", "start", or the `_key` of the block to insert after. */
export type InsertPosition = "end" | "start" | (string & {});

/**
 * Every page except the one being edited. Run with the `drafts` perspective:
 * `_id` is then always the published id, and unpublished edits are included.
 * Editors never see `adminOnly` pages as a source (same rule as the desk structure).
 */
export const PAGES_QUERY = `*[_type == "page" && _id != $currentId && ($admin || adminOnly != true)]{
  _id,
  title,
  language,
  "slug": slug.current,
  "blockCount": count(coalesce(content, []))
}`;

export const PAGE_BLOCKS_QUERY = `*[_type == "page" && _id == $id][0].content`;

/** Published id of a document, whatever prefix it carries (`drafts.`, `versions.<release>.`). */
export const publishedIdOf = (id: string | undefined) => id?.replace(/^(drafts\.|versions\.[^.]+\.)/, "") ?? "";

const freshKey = () => crypto.randomUUID().replace(/-/g, "").slice(0, 12);

/**
 * Deep copy with a new top-level `_key`, so importing the same block twice never
 * collides. Nested `_key`s stay as they are: they only have to be unique within
 * their own array, and Portable Text marks point at `markDefs[]._key`.
 */
export function cloneForImport(blocks: PageBlock[]): PageBlock[] {
  return blocks.map((block) => ({ ...structuredClone(block), _key: freshKey() }));
}

/** Patches relative to the page-builder array field. */
export function insertPatches(blocks: PageBlock[], position: InsertPosition): FormPatch[] {
  if (position === "start") return [setIfMissing([]), insert(blocks, "before", [0])];
  if (position === "end") return [setIfMissing([]), insert(blocks, "after", [-1])];
  return [setIfMissing([]), insert(blocks, "after", [{ _key: position }])];
}

/** Short plain-text label for a block, used where a rich preview does not fit (native <select>). */
export function blockLabel(block: PageBlock, typeTitle: string, index: number) {
  const text = ["headline", "title", "heading", "eyebrow", "brand"]
    .map((field) => block[field])
    .find((value): value is string => typeof value === "string" && value.trim() !== "");
  const short = text && text.length > 48 ? `${text.slice(0, 47)}…` : text;
  return `${index + 1}. ${typeTitle}${short ? ` · ${short}` : ""}`;
}
