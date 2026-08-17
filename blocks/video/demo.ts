import { img, key } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function videoDemo(
  input: {
    eyebrow?: string;
    headline?: string;
    intro?: string;
    /** External YouTube/Vimeo URL — switches the block to `source: "external"`. */
    url?: string;
    /** Local file under /public (default: ClariSea proxy clip). */
    file?: string;
    mimeType?: string;
    poster?: string;
    alt?: string;
    caption?: string;
    layout?: "contained" | "bleed";
    autoplay?: boolean;
    privacyNotice?: string;
  } = {},
): BlockOf<"videoBlock"> {
  const external = Boolean(input.url);
  const fileUrl = input.file ?? "/videos/clarisea-proxy.mp4";
  const fileName = fileUrl.replace(/^\/videos\//, "").replace(/\.[a-z0-9]+$/i, "");

  return {
    _key: key("video"),
    _type: "videoBlock",
    eyebrow: input.eyebrow ?? "See it run",
    headline: input.headline ?? "ClariSea in motion",
    intro:
      input.intro ??
      "Watch the fleece advance, the float rise and the controller take over — the whole cycle in under a minute.",
    source: external ? "external" : "file",
    file: external
      ? null
      : {
          asset: {
            _id: `demo-video-${fileName}`,
            url: fileUrl,
            mimeType: input.mimeType ?? "video/mp4",
          },
        },
    url: input.url,
    poster: img(input.poster ?? "clarisea-video-poster.jpg", { width: 1920, height: 1080 }),
    alt: input.alt ?? "ClariSea Gen 3 fleece filter running in a reef sump",
    caption: input.caption ?? "ClariSea SK-5000 Gen 3 — automatic fleece advance in a running sump.",
    layout: input.layout ?? "contained",
    autoplay: input.autoplay ?? false,
    privacyNotice: input.privacyNotice ?? "The video is loaded from YouTube/Vimeo only after you click play.",
  };
}
