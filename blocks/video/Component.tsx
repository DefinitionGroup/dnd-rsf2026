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

  const hasHeader = Boolean(block.headline || block.intro);
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
    <section className={`canvas-dark section-space ${bleed ? "" : "page-gutter"}`}>
      {hasHeader && (
        <div className={`container-site ${bleed ? "page-gutter" : ""}`}>
          <SectionHeader headline={block.headline} intro={block.intro} align="center" className="mb-10 md:mb-14" />
        </div>
      )}
      <figure className={bleed ? "" : "container-site"}>
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
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
    <div className="absolute inset-0 text-white">
      {poster?.asset ? (
        <SanityImage image={poster} alt="" fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
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
