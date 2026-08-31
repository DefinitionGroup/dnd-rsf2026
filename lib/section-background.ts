import { stegaClean } from "next-sanity";

/** The two neutral canvases an editor can move a section onto. */
export type SectionBackground = "black" | "gray";

/**
 * Resolve a block's `background` field to a canvas class.
 *
 * Unset falls back to the canvas the block was designed with, so adding the field
 * to a block leaves every existing page exactly as it was until an editor opts in.
 */
export function backgroundClass(value: unknown, fallback: string): string {
  switch (stegaClean(value)) {
    case "black":
      return "canvas-dark";
    case "gray":
      return "canvas-frost";
    default:
      return fallback;
  }
}
