import { img, key } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function beforeAfterDemo(input: {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  before?: string;
  beforeLabel?: string;
  after?: string;
  afterLabel?: string;
  alt: string;
  startPosition?: number;
  caption?: string;
} = { alt: "Reef tank under standard lighting compared with the same tank under Spektrum 150" }): BlockOf<"beforeAfterBlock"> {
  return {
    _key: key("before-after"),
    _type: "beforeAfterBlock",
    eyebrow: input.eyebrow,
    headline: input.headline,
    intro: input.intro,
    before: img(input.before ?? "reef-before.jpg"),
    beforeLabel: input.beforeLabel ?? "Before",
    after: img(input.after ?? "reef-after.jpg"),
    afterLabel: input.afterLabel ?? "After",
    alt: input.alt,
    startPosition: input.startPosition ?? 50,
    caption: input.caption,
  };
}
