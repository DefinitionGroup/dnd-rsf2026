"use client";

import { useState } from "react";
import { stegaClean } from "next-sanity";
import { useReducedMotion } from "motion/react";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import { resolveImageUrl } from "@/sanity/lib/image";
import { parseEmbed, type Embed } from "@/lib/video-embed";
import { MOBILE_MEDIA } from "@/lib/mobile-media";
import { usePoster } from "@/lib/use-mobile-media";
import type { BlockProps } from "@/blocks/types";
import { backgroundClass } from "@/lib/section-background";

/** `layout` keeps its stored values: "contained" is the container width (default), "bleed" edge to edge. */
const SIZE = {
  bleed: { figure: "", sizes: "100vw" },
  contained: { figure: "container-site", sizes: "(min-width: 1280px) 1200px, 100vw" },
  small: { figure: "mx-auto w-full max-w-[880px]", sizes: "(min-width: 960px) 880px, 100vw" },
} as const;

type Size = keyof typeof SIZE;

/**
 * One 16:9 frame: a film (uploaded or YouTube/Vimeo) behind its image, or — with no
 * video — the image on its own. Sized edge to edge, to the container (default) or small.
 */
export default function VideoBlock({ block }: BlockProps<"videoBlock">) {
  const source = stegaClean(block.source);
  const layout = stegaClean(block.layout);
  const size: Size = layout && layout in SIZE ? (layout as Size) : "contained";
  const embed = source === "external" ? parseEmbed(block.url) : null;
  const fileUrl = source === "file" ? block.file?.asset?.url : undefined;
  const hasImage = Boolean(block.poster?.asset);
  if (!fileUrl && !embed && !hasImage) return null;

  const hasHeader = Boolean(block.headline || block.intro);
  const bleed = size === "bleed";

  const player =
    source === "file" && fileUrl ? (
      <FilePlayer
        src={fileUrl}
        mimeType={block.file?.asset?.mimeType}
        poster={resolveImageUrl(block.poster, { width: 1600 })}
        mobileSrc={block.fileMobile?.asset?.url}
        mobileMimeType={block.fileMobile?.asset?.mimeType}
        mobilePoster={resolveImageUrl(block.posterMobile, { width: 1080 })}
        autoplay={Boolean(block.autoplay)}
        alt={block.alt}
      />
    ) : embed ? (
      <ExternalPlayer embed={embed} poster={block.poster} posterMobile={block.posterMobile} alt={block.alt} privacyNotice={block.privacyNotice} sizes={SIZE[size].sizes} />
    ) : (
      <SanityImage image={block.poster} mobileImage={block.posterMobile} alt={block.alt} fill sizes={SIZE[size].sizes} className="object-cover" />
    );

  return (
    <section className={`${backgroundClass(block.background, "canvas-dark")} section-space ${bleed ? "" : "page-gutter"}`}>
      {hasHeader && (
        <div className={`container-site ${bleed ? "page-gutter" : ""}`}>
          <SectionHeader eyebrow={block.eyebrow} headline={block.headline} intro={block.intro} align="center" className="mb-10 md:mb-14" />
        </div>
      )}
      <figure className={SIZE[size].figure}>
        <div className={`relative isolate aspect-video w-full overflow-hidden bg-carbon ${bleed ? "" : "media"}`}>{player}</div>
        {block.caption && (
          <figcaption className={`caption mt-4 text-center ${bleed ? "page-gutter container-site" : ""}`}>{block.caption}</figcaption>
        )}
      </figure>
    </section>
  );
}

function FilePlayer({
  src,
  mimeType,
  poster,
  mobileSrc,
  mobileMimeType,
  mobilePoster,
  autoplay,
  alt,
}: {
  src: string;
  mimeType?: string | null;
  poster?: string;
  /** Optional phone cut and still, used below 768 px. */
  mobileSrc?: string;
  mobileMimeType?: string | null;
  mobilePoster?: string;
  autoplay: boolean;
  alt: string;
}) {
  const reduceMotion = useReducedMotion();
  const posterUrl = usePoster(poster, mobilePoster);
  const auto = autoplay && !reduceMotion;
  const [playing, setPlaying] = useState(auto);
  // Manual videos show the poster + one drawn play control; native controls appear only once playing.
  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group absolute inset-0 h-full w-full text-left"
        aria-label={`Play video: ${alt}`}
      >
        {poster ? (
          <picture>
            {mobilePoster && <source media={MOBILE_MEDIA} srcSet={mobilePoster} />}
            <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </picture>
        ) : (
          <span className="absolute inset-0 bg-carbon" aria-hidden />
        )}
        <span className="absolute left-1/2 top-1/2 grid size-[72px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-carbon transition-transform duration-300 group-hover:scale-105">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="26" height="26" className="translate-x-[2px]">
            <path d="M8 5.5v13l10-6.5z" fill="currentColor" />
          </svg>
        </span>
      </button>
    );
  }
  return (
    <video
      key={auto ? "auto" : "manual"}
      className="absolute inset-0 h-full w-full object-cover"
      controls={!auto}
      autoPlay
      muted={auto}
      loop={auto}
      playsInline
      preload="auto"
      poster={posterUrl}
      aria-label={alt}
    >
      {mobileSrc && <source src={mobileSrc} type={mobileMimeType ?? undefined} media={MOBILE_MEDIA} />}
      <source src={src} type={mimeType ?? undefined} />
    </video>
  );
}

function ExternalPlayer({
  embed,
  poster,
  posterMobile,
  alt,
  privacyNotice,
  sizes,
}: {
  embed: Embed;
  poster: BlockProps<"videoBlock">["block"]["poster"];
  posterMobile: BlockProps<"videoBlock">["block"]["posterMobile"];
  alt: string;
  privacyNotice?: string;
  sizes: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const providerLabel = embed.provider === "youtube" ? "YouTube" : "Vimeo";

  if (loaded) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={embed.src}
        title={alt}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <div className="absolute inset-0 text-white">
      {poster?.asset ? (
        <SanityImage image={poster} mobileImage={posterMobile} alt="" fill sizes={sizes} className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-carbon" aria-hidden />
      )}
      <button
        type="button"
        onClick={() => setLoaded(true)}
        aria-label={`Play video: ${alt} (loads from ${providerLabel})`}
        className="group absolute inset-0 flex cursor-pointer items-center justify-center focus-visible:outline-offset-[-4px]"
      >
        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white text-carbon transition-transform duration-300 ease-out-expo group-hover:scale-105">
          <svg viewBox="0 0 24 24" width="28" height="28" className="ml-1 fill-current" aria-hidden>
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
      </button>

      {privacyNotice && (
        <p className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-5">
          <span className="caption rounded-full bg-white/10 px-3 py-1 text-white">{privacyNotice}</span>
        </p>
      )}
    </div>
  );
}
