import { key, pt } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function portableTextDemo(input: {
  /** Plain paragraphs; prefix with `h2:`/`h3:` for headings, `- ` for bullets (see `pt`). */
  body: string[];
}): BlockOf<"portableTextBlock"> {
  return {
    _key: key("portable-text"),
    _type: "portableTextBlock",
    body: pt(...input.body),
  };
}
