import { key, pt } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function introDemo(input: {
  eyebrow?: string;
  headline: string;
  /** Plain paragraphs, converted to Portable Text (see `pt`). */
  body?: string[];
}): BlockOf<"introBlock"> {
  return {
    _key: key("intro"),
    _type: "introBlock",
    eyebrow: input.eyebrow,
    headline: input.headline,
    body: input.body?.length ? pt(...input.body) : undefined,
  };
}
