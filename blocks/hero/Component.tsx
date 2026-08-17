import ActionLink from "@/components/ActionLink";
import SanityImage from "@/components/SanityImage";
import { resolveVideoUrl } from "@/sanity/lib/video";
import type { BlockProps } from "@/blocks/types";

export default function HeroBlock({ block }: BlockProps<"heroBlock">) {
  const videoUrl = resolveVideoUrl(block.video);
  const hasImage = Boolean(block.image?.asset);
  if (!videoUrl && !hasImage) return null;

  return (
    <section className="on-dark relative isolate flex min-h-[88svh] items-end overflow-hidden bg-ink text-paper">
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
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" aria-hidden />
      </div>

      <div className="container-site page-gutter pb-16 pt-40 md:pb-24">
        <div className="max-w-4xl hero-enter">
          {block.brand && <p className="eyebrow mb-4 text-lime">{block.brand}</p>}
          <h1 className="whitespace-pre-line text-paper">{block.headline}</h1>
          {block.summary && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85 md:text-xl">{block.summary}</p>}
          {(block.primaryCta || block.secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-3">
              <ActionLink link={block.primaryCta} variant="primary" />
              <ActionLink link={block.secondaryCta} variant="secondary" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
