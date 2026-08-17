import { img, key, link } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function heroDemo(input: {
  brand?: string;
  headline: string;
  summary?: string;
  image: string;
  imageAlt: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}): BlockOf<"heroBlock"> {
  return {
    _key: key("hero"),
    _type: "heroBlock",
    brand: input.brand,
    headline: input.headline,
    summary: input.summary,
    image: img(input.image),
    video: null,
    imageAlt: input.imageAlt,
    primaryCta: input.primaryCta ? link(input.primaryCta.label, input.primaryCta.href) : undefined,
    secondaryCta: input.secondaryCta ? link(input.secondaryCta.label, input.secondaryCta.href) : undefined,
  };
}
