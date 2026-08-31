import { img, key, link } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

/** Demo stand-in for a Sanity file asset, in the resolved query shape. */
function videoAsset(input: { url: string; mimeType?: string }) {
  const id = input.url.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "");
  return { asset: { _id: `demo-video-${id}`, url: input.url, mimeType: input.mimeType ?? "video/mp4" } };
}

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
  /** Swap the two CTA pills for one button that opens the film in an overlay. */
  videoButton?: boolean;
  videoButtonLabel?: string;
  /** Overlay player source. Defaults to the uploaded file (falling back to `video`). */
  overlaySource?: "file" | "external";
  overlayVideo?: { url: string; mimeType?: string };
  overlayVideoUrl?: string;
}): BlockOf<"heroBlock"> {
  return {
    _key: key("hero"),
    _type: "heroBlock",
    brand: input.brand,
    headline: input.headline,
    summary: input.summary,
    image: img(input.image),
    video: input.video ? videoAsset(input.video) : null,
    imageAlt: input.imageAlt,
    videoButton: input.videoButton,
    videoButtonLabel: input.videoButtonLabel,
    overlaySource: input.overlaySource,
    overlayVideo: input.overlayVideo ? videoAsset(input.overlayVideo) : null,
    overlayVideoUrl: input.overlayVideoUrl,
    primaryCta: input.primaryCta ? link(input.primaryCta.label, input.primaryCta.href) : undefined,
    secondaryCta: input.secondaryCta ? link(input.secondaryCta.label, input.secondaryCta.href) : undefined,
  };
}
