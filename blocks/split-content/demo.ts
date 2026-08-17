import { img, key, link, pt } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function splitContentDemo(input: {
  eyebrow?: string;
  headline: string;
  /** Plain paragraphs, converted to Portable Text (see `pt`). */
  body?: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
  tone?: "paper" | "sand" | "ink";
  cta?: { label: string; href: string };
}): BlockOf<"splitContentBlock"> {
  return {
    _key: key("split-content"),
    _type: "splitContentBlock",
    eyebrow: input.eyebrow,
    headline: input.headline,
    body: input.body?.length ? pt(...input.body) : undefined,
    image: img(input.image),
    imageAlt: input.imageAlt,
    reverse: input.reverse ?? false,
    tone: input.tone ?? "paper",
    cta: input.cta ? link(input.cta.label, input.cta.href) : undefined,
  };
}
