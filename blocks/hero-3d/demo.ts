import { key, link } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function hero3dDemo(input: {
  brand?: string;
  headline: string;
  summary?: string;
  modelAlt: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}): BlockOf<"hero3dBlock"> {
  return {
    _key: key("hero3d"),
    _type: "hero3dBlock",
    brand: input.brand,
    headline: input.headline,
    summary: input.summary,
    model: null,
    modelAlt: input.modelAlt,
    primaryCta: input.primaryCta ? link(input.primaryCta.label, input.primaryCta.href) : undefined,
    secondaryCta: input.secondaryCta ? link(input.secondaryCta.label, input.secondaryCta.href) : undefined,
  };
}
