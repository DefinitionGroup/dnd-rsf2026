import { key, link } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function ctaDemo(input: {
  eyebrow?: string;
  headline: string;
  body?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  tone?: "lime" | "ink" | "paper";
}): BlockOf<"ctaBlock"> {
  return {
    _key: key("cta"),
    _type: "ctaBlock",
    eyebrow: input.eyebrow,
    headline: input.headline,
    body: input.body,
    primaryCta: link(input.primaryCta.label, input.primaryCta.href),
    secondaryCta: input.secondaryCta ? link(input.secondaryCta.label, input.secondaryCta.href) : undefined,
    tone: input.tone ?? "lime",
  };
}
