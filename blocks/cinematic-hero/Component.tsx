"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { stegaClean } from "next-sanity";
import ActionLink from "@/components/ActionLink";
import VideoOverlayButton from "@/components/VideoOverlayButton";
import { resolveImageUrl } from "@/sanity/lib/image";
import { resolveOverlayVideo } from "@/lib/overlay-video";
import { t } from "@/lib/i18n";
import { EASE_OUT_EXPO } from "@/lib/motion";
import type { BlockProps } from "@/blocks/types";
import GridReveal from "./GridReveal";
import GridLoop from "./GridLoop";

const FilmLayer = dynamic(() => import("./FilmLayer"), { ssr: false });

/**
 * Cinematic film hero: the background video owns the whole first viewport and
 * arrives through one of two entrances (schema toggle): the grid raster —
 * black cells flicker away in random order under faint hairlines while the
 * film settles from a slow 1.06→1 scale — or the film rise, where the frame
 * scales and fades up from the bottom third of the viewport.
 * Copy follows in a staggered cascade: brand pill, headline word by word
 * through clip masks, tagline out of a blur, then the pills. The optional
 * WebGL layer (schema toggle) re-projects the video with film grain, a hint of
 * lens fringing and a feathered edge into the black canvas; it degrades to the
 * plain video wherever WebGL is unavailable. Reduced motion gets the poster
 * and fully visible copy, no video, no flicker.
 */

/*
 * The entrance starts only once the page is actually visible — a page opened
 * in a background tab keeps the black cover and plays the full ceremony when
 * the visitor arrives, instead of burning it unseen. Latches once per load.
 */
let wasVisible = false;
const getVisibleOnce = () => {
  if (!wasVisible) wasVisible = document.visibilityState === "visible";
  return wasVisible;
};
const getServerSnapshot = () => false;
const subscribeVisibility = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};

/* Copy cascade starts as the last mask cells clear (grid runs 0–2.0s). */
const T_BRAND = 0.95;
const T_WORDS = 1.1;
const T_SUMMARY = 1.6;
const T_CTAS = 1.9;
const T_HINT = 2.6;

export default function CinematicHeroBlock({ block, index, locale }: BlockProps<"cinematicHeroBlock">) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion() ?? false;
  // false during SSR and while the tab is hidden — the SSR HTML keeps the black cover so the film never flashes unmasked
  const started = useSyncExternalStore(subscribeVisibility, getVisibleOnce, getServerSnapshot);
  const [revealDone, setRevealDone] = useState(false);

  // autoplay is blocked while a tab is hidden — nudge the film once the entrance starts
  useEffect(() => {
    if (started) videoRef.current?.play().catch(() => {});
  }, [started]);

  const Heading = index === 0 ? "h1" : "h2";
  const videoUrl = block.video?.asset?.url;
  const posterUrl = resolveImageUrl(block.poster, { width: 1920 });
  const showVideo = Boolean(videoUrl) && !reduce;
  const shaderOn = Boolean(block.shader) && showVideo;
  // Entrance mode: "grid" = flicker-mask raster reveal; "rise" = the film scales & fades up from below.
  const entrance = stegaClean(block.entrance) === "rise" ? "rise" : "grid";
  const gridLoopOn = Boolean(block.gridLoop) && entrance === "grid";
  const hasCtas = Boolean(block.primaryCta || block.secondaryCta);
  // `videoButton` swaps the CTA pills for one button that opens the full film in
  // an overlay — the looping background clip stays a background clip.
  const overlay = block.videoButton
    ? resolveOverlayVideo(
        {
          overlaySource: stegaClean(block.overlaySource),
          overlayVideo: block.overlayVideo,
          overlayVideoUrl: stegaClean(block.overlayVideoUrl),
          fallbackVideo: block.video,
        },
        posterUrl,
      )
    : null;

  const play = started || reduce;
  const enter = (delay: number, from: { y?: number; blur?: number } = {}) => {
    const hidden = { opacity: 0, y: from.y ?? 14, filter: `blur(${from.blur ?? 0}px)` };
    return {
      initial: reduce ? (false as const) : hidden,
      animate: play ? { opacity: 1, y: 0, filter: "blur(0px)" } : hidden,
      transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay },
    };
  };
  // Rise mode is the LCP-friendly entrance: plain 0.4s fades, 30ms stagger, no masks or blurs.
  const fade = (i: number) => ({
    initial: reduce ? (false as const) : { opacity: 0 },
    animate: { opacity: play ? 1 : 0 },
    transition: { duration: 0.4, ease: "easeOut" as const, delay: 0.1 + i * 0.03 },
  });
  const copy = (i: number, gridDelay: number, from?: { y?: number; blur?: number }) =>
    entrance === "rise" ? fade(i) : enter(gridDelay, from);

  return (
    <section className="canvas-dark on-dark">
      <div className="relative isolate h-[calc(100svh-var(--header-h)-var(--productbar-h))] min-h-[560px] overflow-hidden bg-black">
        {/* static poster underlay: painted straight from the SSR HTML at high fetch
            priority, so the hero has an LCP candidate before hydration and before
            any entrance animation — the film fades in over it. Same URL as the
            video's poster attribute, so the browser fetches it once. */}
        {posterUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt={showVideo ? "" : block.videoAlt}
            aria-hidden={showVideo || undefined}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* the film — grid mode settles from a slow overscale behind the mask;
            rise mode is a short plain fade (cheap, LCP-friendly) */}
        <motion.div
          aria-hidden={!showVideo}
          className="absolute inset-0"
          initial={reduce ? false : entrance === "rise" ? { opacity: 0 } : { scale: 1.06 }}
          animate={entrance === "rise" ? { opacity: play ? 1 : 0 } : { scale: play ? 1 : 1.06 }}
          transition={entrance === "rise" ? { duration: 0.8, ease: "easeOut" } : { duration: 2.8, ease: EASE_OUT_EXPO }}
        >
          {showVideo && (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={posterUrl}
              aria-label={block.videoAlt}
              crossOrigin="anonymous"
            >
              <source src={videoUrl} type={block.video?.asset?.mimeType ?? undefined} />
            </video>
          )}
          {shaderOn && <FilmLayer videoRef={videoRef} />}
        </motion.div>

        {/* legibility scrim — the room stays black behind the copy */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/25" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

        {/* grid-raster entrance: black cover until the page is visible, then the flickering grid
            (rise mode needs no cover — its film wrapper starts at opacity 0) */}
        {entrance === "grid" && !started && !reduce && <div aria-hidden="true" className="absolute inset-0 bg-black" />}
        {entrance === "grid" && started && !reduce && !revealDone && <GridReveal onDone={() => setRevealDone(true)} />}

        {/* optional persistent grid: the entrance texture stays alive in a quiet loop */}
        {gridLoopOn && (reduce ? <GridLoop animate={false} /> : revealDone && <GridLoop animate />)}

        {/* copy cascade */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-[var(--gutter)] pb-16 pt-8 text-center">
          {block.brand && (
            <motion.p {...copy(0, T_BRAND, { y: 10 })} className="eyebrow mb-5">
              {block.brand}
            </motion.p>
          )}
          <Heading className="display mx-auto max-w-[18ch]">
            {entrance === "rise" ? (
              <motion.span {...fade(1)} className="block whitespace-pre-line">
                {block.headline}
              </motion.span>
            ) : (
              /* stegaClean before splitting: draft-mode stega characters would otherwise
                 scatter invisible glyphs through the word masks and break lines mid-word */
              <MaskedWords text={stegaClean(block.headline)} startDelay={T_WORDS} reduce={reduce} play={play} />
            )}
          </Heading>
          {block.summary && (
            <motion.p {...copy(2, T_SUMMARY, { y: 16, blur: 8 })} className="whisper mx-auto mt-4 max-w-[40rem]">
              {block.summary}
            </motion.p>
          )}
          {overlay ? (
            <motion.div {...copy(3, T_CTAS)} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <VideoOverlayButton
                label={block.videoButtonLabel || t(locale, "playVideo")}
                video={overlay}
                alt={block.videoAlt}
                locale={locale}
              />
            </motion.div>
          ) : (
            hasCtas && (
              <motion.div {...copy(3, T_CTAS)} className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <ActionLink link={block.primaryCta} variant="primary" />
                <ActionLink link={block.secondaryCta} variant="secondary" />
              </motion.div>
            )
          )}
        </div>

        {!reduce && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: play ? 1 : 0 }}
            transition={{ duration: 1, delay: entrance === "rise" ? 0.8 : T_HINT }}
            className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
          >
            <span className="caption tracking-[0.14em] uppercase">{t(locale, "scrollHint")}</span>
            <span className="block h-8 w-px overflow-hidden bg-hairline">
              <motion.span
                className="block h-3 w-px bg-lime"
                animate={{ y: [-12, 32] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/** Headline words rise out of per-word clip masks, staggered left to right, line by line. */
function MaskedWords({ text, startDelay, reduce, play }: { text: string; startDelay: number; reduce: boolean; play: boolean }) {
  let wordIndex = 0;
  return (
    <>
      {text.split("\n").map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line
            .split(/\s+/)
            .filter(Boolean)
            .map((word, i) => {
              const delay = startDelay + wordIndex++ * 0.055;
              return (
                <span key={i}>
                  {i > 0 && " "}
                  <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={reduce ? false : { y: "115%" }}
                      animate={{ y: play ? "0%" : "115%" }}
                      transition={{ duration: 0.85, ease: EASE_OUT_EXPO, delay }}
                    >
                      {word}
                    </motion.span>
                  </span>
                </span>
              );
            })}
        </span>
      ))}
    </>
  );
}
