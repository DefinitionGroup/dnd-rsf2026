import { img, key, link } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function cinematicHeroDemo(input: {
  brand?: string;
  headline: string;
  summary?: string;
  /** Local file under /public (default: ClariSea proxy clip). */
  video?: string;
  mimeType?: string;
  poster?: string;
  videoAlt: string;
  /** WebGL film treatment (grain, edge feather, lens fringe). Default on. */
  shader?: boolean;
  /** Entrance mode: grid-raster flicker reveal or film rise from below. Default grid. */
  entrance?: "grid" | "rise";
  /** Persistent grid loop after the grid entrance (breathing cells + hairlines). Default on in demos. */
  gridLoop?: boolean;
  /** Swap the two CTA pills for one button that opens the film in an overlay. */
  videoButton?: boolean;
  videoButtonLabel?: string;
  /** Overlay player source. Defaults to the uploaded file (falling back to the background video). */
  overlaySource?: "file" | "external";
  overlayVideo?: { url: string; mimeType?: string };
  overlayVideoUrl?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}): BlockOf<"cinematicHeroBlock"> {
  const videoUrl = input.video ?? "/videos/clarisea-proxy.mp4";
  const videoName = videoUrl.replace(/^\/videos\//, "").replace(/\.[a-z0-9]+$/i, "");

  return {
    _key: key("cinehero"),
    _type: "cinematicHeroBlock",
    brand: input.brand,
    headline: input.headline,
    summary: input.summary,
    video: {
      asset: {
        _id: `demo-video-${videoName}`,
        url: videoUrl,
        mimeType: input.mimeType ?? "video/mp4",
      },
    },
    poster: img(input.poster ?? "clarisea-video-poster.jpg", { width: 1920, height: 1080 }),
    videoAlt: input.videoAlt,
    shader: input.shader ?? true,
    entrance: input.entrance ?? "grid",
    gridLoop: input.gridLoop ?? true,
    videoButton: input.videoButton,
    videoButtonLabel: input.videoButtonLabel,
    overlaySource: input.overlaySource,
    overlayVideo: input.overlayVideo
      ? {
          asset: {
            _id: `demo-video-${input.overlayVideo.url.replace(/^\/videos\//, "").replace(/\.[a-z0-9]+$/i, "")}`,
            url: input.overlayVideo.url,
            mimeType: input.overlayVideo.mimeType ?? "video/mp4",
          },
        }
      : null,
    overlayVideoUrl: input.overlayVideoUrl,
    primaryCta: input.primaryCta ? link(input.primaryCta.label, input.primaryCta.href) : undefined,
    secondaryCta: input.secondaryCta ? link(input.secondaryCta.label, input.secondaryCta.href) : undefined,
  };
}
