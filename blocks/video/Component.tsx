"use client";

import { useState } from "react";
import { stegaClean } from "next-sanity";
import { useReducedMotion } from "motion/react";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import { resolveImageUrl } from "@/sanity/lib/image";
import type { BlockProps } from "@/blocks/types";

type Embed = { provider: "youtube" | "vimeo"; src: string };

/** Parse YouTube / Vimeo watch, share and short URLs into a privacy-friendly embed URL. */
export function parseEmbed(raw: string | undefined | null): Embed | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id ? youtube(id, url) : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "music.youtube.com") {
    const v = url.searchParams.get("v");
    if (v) return youtube(v, url);
    const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{6,})/);
    return m ? youtube(m[1], url) : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    // vimeo.com/123456, vimeo.com/123456/hash, vimeo.com/channels/x/123456, player.vimeo.com/video/123456
    const m = url.pathname.match(/\/(\d{6,})(?:\/([\da-f]+))?/i);
    if (!m) return null;
    const params = new URLSearchParams({ autoplay: "1", dnt: "1" });
    if (m[2]) params.set("h", m[2]);
    return { provider: "vimeo", src: `https://player.vimeo.com/video/${m[1]}?${params}` };
  }
  return null;
}

function youtube(id: string, url: URL): Embed {
  const params = new URLSearchParams({ autoplay: "1", rel: "0" });
  const t = url.searchParams.get("t") ?? url.searchParams.get("start");
  if (t) params.set("start", String(parseInt(t, 10) || 0));
  return { provider: "youtube", src: `https://www.youtube-nocookie.com/embed/${id}?${params}` };
}

export default function VideoBlock({ block }: BlockProps<"videoBlock">) {
  const source = stegaClean(block.source);
  const layout = stegaClean(block.layout) === "bleed" ? "bleed" : "contained";
  const embed = source === "external" ? parseEmbed(block.url) : null;
  const fileUrl = source === "file" ? block.file?.asset?.url : undefined;
  if (!fileUrl && !embed) return null;

  const hasHeader = Boolean(block.eyebrow || block.headline || block.intro);
  const bleed = layout === "bleed";

  const player =
    source === "file" && fileUrl ? (
      <FilePlayer
        src={fileUrl}
        mimeType={block.file?.asset?.mimeType}
        poster={resolveImageUrl(block.poster, { width: 1600 })}
        autoplay={Boolean(block.autoplay)}
        alt={block.alt}
      />
    ) : embed ? (
      <ExternalPlayer embed={embed} poster={block.poster} alt={block.alt} privacyNotice={block.privacyNotice} />
    ) : null;

  return (
    <section className={`section-space ${bleed ? "" : "page-gutter"}`}>
      {hasHeader && (
        <div className={`container-site ${bleed ? "page-gutter" : ""}`}>
          <SectionHeader eyebrow={block.eyebrow} headline={block.headline} intro={block.intro} className="mb-8 md:mb-12" />
        </div>
      )}
      <figure className={bleed ? "" : "container-site"}>
        <div
          className={`relative isolate aspect-video w-full overflow-hidden bg-ink ${
            bleed ? "" : "rounded-2xl shadow-[0_30px_80px_-30px_rgba(26,26,26,0.45)]"
          }`}
        >
          {player}
        </div>
        {block.caption && (
          <figcaption className={`mt-3 text-sm text-muted ${bleed ? "page-gutter container-site" : ""}`}>{block.caption}</figcaption>
        )}
      </figure>
    </section>
  );
}

function FilePlayer({
  src,
  mimeType,
  poster,
  autoplay,
  alt,
}: {
  src: string;
  mimeType?: string | null;
  poster?: string;
  autoplay: boolean;
  alt: string;
}) {
  const reduceMotion = useReducedMotion();
  const auto = autoplay && !reduceMotion;
  return (
    <video
      key={auto ? "auto" : "manual"}
      className="absolute inset-0 h-full w-full object-cover focus-visible:outline-2 focus-visible:outline-lime"
      controls
      autoPlay={auto}
      muted={auto}
      loop={auto}
      playsInline
      preload={auto ? "auto" : "metadata"}
      poster={poster}
      aria-label={alt}
    >
      <source src={src} type={mimeType ?? undefined} />
    </video>
  );
}

function ExternalPlayer({
  embed,
  poster,
  alt,
  privacyNotice,
}: {
  embed: Embed;
  poster: BlockProps<"videoBlock">["block"]["poster"];
  alt: string;
  privacyNotice?: string;
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
    <div className="on-dark absolute inset-0 text-paper">
      {poster?.asset ? (
        <SanityImage image={poster} alt="" fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ink-soft to-ink" aria-hidden />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" aria-hidden />

      <button
        type="button"
        onClick={() => setLoaded(true)}
        aria-label={`Play video: ${alt} (loads from ${providerLabel})`}
        className="group absolute inset-0 flex cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-lime"
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-lime text-ink shadow-[0_0_0_0_rgba(153,204,51,0.5)] transition-[transform,box-shadow,background-color] duration-300 group-hover:scale-105 group-hover:bg-lime-deep group-hover:shadow-[0_0_0_16px_rgba(153,204,51,0.18)] md:h-24 md:w-24">
          <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9 fill-current md:h-10 md:w-10" aria-hidden>
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
      </button>

      {privacyNotice && (
        <p className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-4 text-center text-xs text-paper/75 md:text-sm">
          {privacyNotice}
        </p>
      )}
    </div>
  );
}
