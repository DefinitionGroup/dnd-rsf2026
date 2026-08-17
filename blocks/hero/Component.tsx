import ActionLink from "@/components/ActionLink";
import SanityImage from "@/components/SanityImage";
import { resolveVideoUrl } from "@/sanity/lib/video";
import type { BlockProps } from "@/blocks/types";

/**
 * Product stage hero: full-bleed media, headline top-left over a soft dark
 * gradient, one lead sentence, two pills. Visible by default (no entrance
 * animation) — the first viewport is the thesis, not a curtain.
 */
export default function HeroBlock({ block }: BlockProps<"heroBlock">) {
  const videoUrl = resolveVideoUrl(block.video);
  const hasImage = Boolean(block.image?.asset);
  if (!videoUrl && !hasImage) return null;

  return (
    <section className="stage relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {hasImage && (
          <SanityImage
            image={block.image}
            alt={block.imageAlt}
            fill
            priority
            sizes="100vw"
            className={`object-cover ${videoUrl ? "motion-safe:hidden" : ""}`}
          />
        )}
        {videoUrl && (
          <video
            className="hidden h-full w-full object-cover motion-safe:block"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={block.image?.asset?.url}
            aria-label={block.imageAlt}
          >
            <source src={videoUrl} type={block.video?.asset?.mimeType ?? undefined} />
          </video>
        )}
        {/* soft legibility gradient, bottom-left weighted */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(11_11_12/0.92)_0%,rgb(11_11_12/0.55)_38%,rgb(11_11_12/0.12)_70%,transparent_100%)]" aria-hidden />
      </div>

      <div className="container-wide page-gutter pb-[clamp(3rem,7vw,6rem)] pt-40">
        <h1 className="max-w-[13ch] whitespace-pre-line text-paper">{block.headline}</h1>
        {block.summary && <p className="lead mt-6 max-w-[34rem] !text-paper/85">{block.summary}</p>}
        {(block.primaryCta || block.secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink link={block.primaryCta} variant="primary" />
            <ActionLink link={block.secondaryCta} variant="secondary" />
          </div>
        )}
      </div>
    </section>
  );
}
