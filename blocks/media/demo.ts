import { img, key } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

type MediaBlock = BlockOf<"mediaBlock">;

export function mediaDemo(input: {
  /** File under /public/images. */
  image?: string;
  /** Pixel size of `image` — sets the frame's proportions for "natural". */
  imageSize?: { width: number; height: number };
  /** Local file under /public — switches the block to video. */
  video?: string;
  mimeType?: string;
  poster?: string;
  posterSize?: { width: number; height: number };
  autoplay?: boolean;
  loop?: boolean;
  alt: string;
  caption?: string;
  fit?: MediaBlock["fit"];
  aspectRatio?: MediaBlock["aspectRatio"];
  maxWidth?: MediaBlock["maxWidth"];
  maxWidthMobile?: MediaBlock["maxWidthMobile"];
  height?: MediaBlock["height"];
  heightMobile?: MediaBlock["heightMobile"];
  spacing?: MediaBlock["spacing"];
  background?: MediaBlock["background"];
}): MediaBlock {
  const isVideo = Boolean(input.video);
  const videoName = input.video?.replace(/^\/videos\//, "").replace(/\.[a-z0-9]+$/i, "");

  return {
    _key: key("media"),
    _type: "mediaBlock",
    mediaType: isVideo ? "video" : "image",
    image: !isVideo && input.image ? img(input.image, input.imageSize) : null,
    video: isVideo ? { asset: { _id: `demo-video-${videoName}`, url: input.video!, mimeType: input.mimeType ?? "video/mp4" } } : null,
    poster: isVideo && input.poster ? img(input.poster, input.posterSize) : null,
    autoplay: input.autoplay ?? true,
    loop: input.loop ?? true,
    alt: input.alt,
    caption: input.caption,
    fit: input.fit ?? "natural",
    aspectRatio: input.aspectRatio ?? "16/9",
    maxWidth: input.maxWidth ?? "1200",
    maxWidthMobile: input.maxWidthMobile ?? "100",
    height: input.height ?? "auto",
    heightMobile: input.heightMobile ?? "same",
    spacing: input.spacing ?? "default",
    background: input.background,
  };
}
