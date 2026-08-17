import { key } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function featureListDemo(input: {
  eyebrow?: string;
  headline: string;
  intro?: string;
  items: { title: string; text?: string }[];
}): BlockOf<"featureListBlock"> {
  return {
    _key: key("feature-list"),
    _type: "featureListBlock",
    eyebrow: input.eyebrow,
    headline: input.headline,
    intro: input.intro,
    items: input.items.map((item) => ({
      _key: key("feature"),
      _type: "featureItem",
      title: item.title,
      text: item.text,
    })),
  };
}
