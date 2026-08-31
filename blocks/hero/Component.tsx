import { stegaClean } from "next-sanity";
import ActionLink from "@/components/ActionLink";
import SanityImage from "@/components/SanityImage";
import VideoOverlayButton from "@/components/VideoOverlayButton";
import { resolveImageUrl } from "@/sanity/lib/image";
import { resolveOverlayVideo } from "@/lib/overlay-video";
import { resolveVideoUrl } from "@/sanity/lib/video";
import { t } from "@/lib/i18n";
import type { BlockProps } from "@/blocks/types";

/**
 * Apple product hero: full-bleed white canvas (renders sit on white); headline (display 56/600),
 * tagline in the 300-weight whisper voice, two centered pills, and the product
 * render below at full width — "the device IS the hero". A background video,
 * if present, is offered as a ghost link to the video section rather than
 * played behind text.
 *
 * `videoButton` swaps the two CTA pills for a single button that opens the film
 * in an overlay player (see VideoOverlayButton).
 */
export default function HeroBlock({ block, index, locale }: BlockProps<"heroBlock">) {
  const Heading = index === 0 ? "h1" : "h2";
  const videoUrl = resolveVideoUrl(block.video);
  const hasImage = Boolean(block.image?.asset);
  if (!videoUrl && !hasImage) return null;

  const overlay = block.videoButton
    ? resolveOverlayVideo(
        {
          overlaySource: stegaClean(block.overlaySource),
          overlayVideo: block.overlayVideo,
          overlayVideoUrl: stegaClean(block.overlayVideoUrl),
          fallbackVideo: block.video,
        },
        resolveImageUrl(block.image, { width: 1600 }),
      )
    : null;

  return (
    <section className="canvas-white overflow-hidden">
      <div className="rise-load container-page page-gutter pt-[clamp(3rem,7vw,5.5rem)] text-center">
        <Heading className="display mx-auto max-w-[18ch] whitespace-pre-line">{block.headline}</Heading>
        {block.summary && <p className="whisper mx-auto mt-3 max-w-[40rem]">{block.summary}</p>}
        {overlay ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <VideoOverlayButton
              label={block.videoButtonLabel || t(locale, "playVideo")}
              video={overlay}
              alt={block.imageAlt}
              locale={locale}
            />
          </div>
        ) : (
          (block.primaryCta || block.secondaryCta || videoUrl) && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <ActionLink link={block.primaryCta} variant="primary" />
              <ActionLink link={block.secondaryCta} variant="secondary" />
              {videoUrl && !block.secondaryCta && <ActionLink link={{ label: t(locale, "watchFilm"), href: "#videoBlock" }} variant="text" />}
            </div>
          )
        )}
      </div>
      {hasImage && (
        <div className="container-page page-gutter mt-[clamp(2rem,5vw,4rem)]">
          <div className="mx-auto w-full max-w-[880px]">
            <SanityImage image={block.image} alt={block.imageAlt} priority sizes="(min-width: 960px) 880px, 100vw" className="h-auto w-full object-contain" />
          </div>
        </div>
      )}
      {!hasImage && videoUrl && (
        <div className="container-page page-gutter mt-[clamp(2rem,5vw,4rem)] pb-[var(--section-y)]">
          <div className="media relative mx-auto aspect-video w-full max-w-[1100px] bg-carbon">
            <video className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline preload="metadata" aria-label={block.imageAlt}>
              <source src={videoUrl} type={block.video?.asset?.mimeType ?? undefined} />
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
