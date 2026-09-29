import type { CSSProperties } from "react";
import { stegaClean } from "next-sanity";
import Reveal from "@/components/motion/Reveal";
import SanityImage from "@/components/SanityImage";
import { resolveImageUrl } from "@/sanity/lib/image";
import { backgroundClass } from "@/lib/section-background";
import { t } from "@/lib/i18n";
import type { BlockProps, ResolvedImage } from "@/blocks/types";
import MediaVideo from "./MediaVideo";

type Height = "auto" | "25" | "50" | "66" | "80" | "100";
type Fit = "natural" | "cover" | "contain";

/* Class maps are written out in full because Tailwind cannot generate class names from runtime values. */

const MAX_WIDTH_MOBILE: Record<string, string> = {
  "50": "max-w-[50%]",
  "66": "max-w-[66%]",
  "75": "max-w-[75%]",
  "90": "max-w-[90%]",
  "100": "max-w-full",
  full: "max-w-none",
};
const MAX_WIDTH_DESKTOP: Record<string, string> = {
  "480": "md:max-w-[480px]",
  "720": "md:max-w-[720px]",
  "980": "md:max-w-[980px]",
  "1200": "md:max-w-[1200px]",
  "1440": "md:max-w-[1440px]",
  full: "md:max-w-none",
};
const SIZES_MOBILE: Record<string, string> = { "50": "50vw", "66": "66vw", "75": "75vw", "90": "90vw", "100": "100vw", full: "100vw" };
const SIZES_DESKTOP: Record<string, string> = { "480": "480px", "720": "720px", "980": "980px", "1200": "1200px", "1440": "1440px", full: "100vw" };

/** Original proportions: as wide as the column allows, narrowed so the height never passes the cap. */
const NATURAL_MOBILE: Record<Height, string> = {
  auto: "w-full",
  "25": "w-[min(100%,calc(25svh*var(--media-ratio)))]",
  "50": "w-[min(100%,calc(50svh*var(--media-ratio)))]",
  "66": "w-[min(100%,calc(66svh*var(--media-ratio)))]",
  "80": "w-[min(100%,calc(80svh*var(--media-ratio)))]",
  "100": "w-[min(100%,calc(100svh*var(--media-ratio)))]",
};
const NATURAL_DESKTOP: Record<Height, string> = {
  auto: "md:w-full",
  "25": "md:w-[min(100%,calc(25svh*var(--media-ratio)))]",
  "50": "md:w-[min(100%,calc(50svh*var(--media-ratio)))]",
  "66": "md:w-[min(100%,calc(66svh*var(--media-ratio)))]",
  "80": "md:w-[min(100%,calc(80svh*var(--media-ratio)))]",
  "100": "md:w-[min(100%,calc(100svh*var(--media-ratio)))]",
};

/** Fill / fit: the frame takes the chosen screen height, or the chosen proportions when Auto. */
const FRAME_MOBILE: Record<Height, string> = {
  auto: "aspect-[var(--frame-ratio)]",
  "25": "h-[25svh]",
  "50": "h-[50svh]",
  "66": "h-[66svh]",
  "80": "h-[80svh]",
  "100": "h-[100svh]",
};
const FRAME_DESKTOP: Record<Height, string> = {
  auto: "md:h-auto md:aspect-[var(--frame-ratio)]",
  "25": "md:aspect-auto md:h-[25svh]",
  "50": "md:aspect-auto md:h-[50svh]",
  "66": "md:aspect-auto md:h-[66svh]",
  "80": "md:aspect-auto md:h-[80svh]",
  "100": "md:aspect-auto md:h-[100svh]",
};

const SPACING = { default: "section-space", small: "section-space-sm", none: "" };

/** A stega-cleaned option value when it is one of `options`, else the fallback. */
function option<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  const clean = stegaClean(value);
  return options.find((o) => o === clean) ?? fallback;
}

const HEIGHTS = ["auto", "25", "50", "66", "80", "100"] as const;

/** Width ÷ height of what the CDN actually serves — the editor's crop included. */
function croppedRatio(image: ResolvedImage | null): number | null {
  const dims = image?.asset?.dimensions;
  if (!dims?.width || !dims?.height) return null;
  const crop = image?.crop;
  const w = dims.width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0));
  const h = dims.height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0));
  return w > 0 && h > 0 ? w / h : null;
}

/** The hotspot as an object-position inside the cropped image, so "cover" keeps the subject in view. */
function hotspotPosition(image: ResolvedImage | null): string | undefined {
  const hotspot = image?.hotspot;
  if (hotspot?.x == null || hotspot?.y == null) return undefined;
  const crop = image?.crop;
  const left = crop?.left ?? 0;
  const top = crop?.top ?? 0;
  const x = (hotspot.x - left) / (1 - left - (crop?.right ?? 0));
  const y = (hotspot.y - top) / (1 - top - (crop?.bottom ?? 0));
  const pct = (v: number) => `${Math.round(Math.min(1, Math.max(0, v)) * 1000) / 10}%`;
  return `${pct(x)} ${pct(y)}`;
}

/**
 * One image or one uploaded video, always centred. Three fits: original
 * proportions (the frame hugs the media), cover (fills a frame, hotspot-aware) and
 * contain (the whole media inside a frame). Width is capped per breakpoint — a
 * percentage of the column on phones, a content width on desktop, or edge to
 * edge — and height in screen-height steps. Edge to edge drops the page margin
 * and the rounded corners at that breakpoint.
 */
export default function MediaBlock({ block, index, locale }: BlockProps<"mediaBlock">) {
  const isVideo = stegaClean(block.mediaType) === "video";
  const videoUrl = isVideo ? block.video?.asset?.url : undefined;
  if (isVideo ? !videoUrl : !block.image?.asset) return null;

  const fit = option<Fit>(block.fit, ["natural", "cover", "contain"], "natural");
  const widthDesktop = option(block.maxWidth, ["480", "720", "980", "1200", "1440", "full"], "1200");
  const widthMobile = option(block.maxWidthMobile, ["50", "66", "75", "90", "100", "full"], "100");
  const heightDesktop = option<Height>(block.height, HEIGHTS, "auto");
  const heightMobile = option<Height>(block.heightMobile, HEIGHTS, heightDesktop);
  const spacing = option(block.spacing, ["default", "small", "none"], "default");
  const bleedMobile = widthMobile === "full";
  const bleedDesktop = widthDesktop === "full";

  const gutter = `${bleedMobile ? "" : "px-[var(--gutter)]"} ${bleedDesktop ? "md:px-0" : "md:px-[var(--gutter)]"}`;
  const rounded = `${bleedMobile ? "" : "rounded-[var(--radius-media)]"} ${bleedDesktop ? "md:rounded-none" : "md:rounded-[var(--radius-media)]"}`;
  const sizes = `(min-width: 768px) ${SIZES_DESKTOP[widthDesktop]}, ${SIZES_MOBILE[widthMobile]}`;

  // Natural frames carry the media's own ratio; fill/fit frames carry the editor's.
  const poster = isVideo ? block.poster : block.image;
  const naturalRatio = croppedRatio(poster) ?? 16 / 9;
  const frameVars: Record<string, string | number> =
    fit === "natural"
      ? { "--media-ratio": naturalRatio, aspectRatio: "var(--media-ratio)" }
      : { "--frame-ratio": option(block.aspectRatio, ["21/9", "16/9", "3/2", "4/3", "1/1", "4/5", "9/16"], "16/9") };
  const frameStyle = frameVars as CSSProperties;
  const frameClassName = [
    "relative mx-auto overflow-hidden",
    rounded,
    fit === "natural"
      ? `${NATURAL_MOBILE[heightMobile]} ${NATURAL_DESKTOP[heightDesktop]}`
      : `w-full ${FRAME_MOBILE[heightMobile]} ${FRAME_DESKTOP[heightDesktop]}`,
  ].join(" ");
  const objectFit = fit === "contain" ? "contain" : "cover";

  const media =
    isVideo && videoUrl ? (
      <MediaVideo
        src={videoUrl}
        mimeType={block.video?.asset?.mimeType}
        poster={resolveImageUrl(block.poster, { width: 1920 })}
        alt={block.alt}
        autoplay={block.autoplay ?? true}
        loop={block.loop ?? true}
        objectFit={objectFit}
        followRatio={fit === "natural"}
        frameClassName={frameClassName}
        frameStyle={frameStyle}
        labels={{ play: t(locale, "playVideo"), pause: t(locale, "pauseVideo") }}
      />
    ) : (
      <div className={frameClassName} style={frameStyle}>
        <SanityImage
          image={block.image}
          alt={block.alt}
          fill
          sizes={sizes}
          priority={index === 0}
          className={objectFit === "contain" ? "object-contain" : "object-cover"}
          style={fit === "cover" ? { objectPosition: hotspotPosition(block.image) } : undefined}
        />
      </div>
    );
  const caption = block.caption && (
    <figcaption className={`caption mt-4 text-center ${bleedMobile ? "px-[var(--gutter)]" : ""} ${bleedDesktop ? "md:px-[var(--gutter)]" : "md:px-0"}`}>
      {block.caption}
    </figcaption>
  );
  const figureClassName = `mx-auto w-full ${MAX_WIDTH_MOBILE[widthMobile]} ${MAX_WIDTH_DESKTOP[widthDesktop]}`;

  return (
    <section className={`${backgroundClass(block.background, "canvas-white")} ${SPACING[spacing]} ${gutter}`}>
      {/* First on the page it may be the LCP element, so it is not held back by the rise-in. */}
      {index === 0 ? (
        <figure className={figureClassName}>
          {media}
          {caption}
        </figure>
      ) : (
        <Reveal as="figure" className={figureClassName}>
          {media}
          {caption}
        </Reveal>
      )}
    </section>
  );
}
