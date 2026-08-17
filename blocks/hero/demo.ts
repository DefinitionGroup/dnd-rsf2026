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
  /** Local video url under /public (demo) — becomes a Sanity file asset when seeded. */
  video?: { url: string; mimeType?: string };
}): BlockOf<"heroBlock"> {
  return {
    _key: key("hero"),
    _type: "heroBlock",
    brand: input.brand,
    headline: input.headline,
    summary: input.summary,
    image: img(input.image),
    video: input.video
      ? { asset: { _id: `demo-video-${input.video.url.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "")}`, url: input.video.url, mimeType: input.video.mimeType ?? "video/mp4" } }
      : null,
    imageAlt: input.imageAlt,
    primaryCta: input.primaryCta ? link(input.primaryCta.label, input.primaryCta.href) : undefined,
    secondaryCta: input.secondaryCta ? link(input.secondaryCta.label, input.secondaryCta.href) : undefined,
  };
}
