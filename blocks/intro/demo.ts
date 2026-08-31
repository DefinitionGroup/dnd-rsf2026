import { backdrop, key, pt, type BackdropInput } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function introDemo(input: {
  eyebrow?: string;
  headline: string;
  /** Plain paragraphs, converted to Portable Text (see `pt`). */
  body?: string[];
  /** Let the headline run to a 40ch measure instead of the tight 24ch default. */
  wideHeadline?: boolean;
  /** Floor for the section height: "none" (default), "50", "75" or "100" vh. */
  minHeight?: "none" | "50" | "75" | "100";
} & BackdropInput): BlockOf<"introBlock"> {
  return {
    _key: key("intro"),
    _type: "introBlock",
    eyebrow: input.eyebrow,
    headline: input.headline,
    wideHeadline: input.wideHeadline,
    minHeight: input.minHeight,
    ...backdrop(input),
    body: input.body?.length ? pt(...input.body) : undefined,
  };
}
