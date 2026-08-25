import { stegaClean } from "next-sanity";
import ActionLink from "@/components/ActionLink";
import Reveal from "@/components/motion/Reveal";
import RichText from "@/components/RichText";
import SanityImage from "@/components/SanityImage";
import type { BlockProps } from "@/blocks/types";

type Tone = "paper" | "sand" | "ink";

const TONE_SECTION: Record<Tone, string> = {
  paper: "canvas-white",
  sand: "canvas-frost",
  ink: "canvas-dark",
};

/**
 * Apple two-up product tile: image in `.media` 4:3 on one half, copy
 * vertically centered on the other (28/600 title, 17px ash body, ghost link).
 * `reverse` swaps the halves.
 */
export default function SplitContentBlock({ block }: BlockProps<"splitContentBlock">) {
  if (!block.image?.asset) return null;
  const toneKey = stegaClean(block.tone ?? "paper");
  const tone: Tone = toneKey === "ink" || toneKey === "sand" ? toneKey : "paper";
  const reverse = Boolean(block.reverse);
  const bodyColor = tone === "ink" ? "text-fg-muted" : "text-fg-muted";

  return (
    <section className={`section-space page-gutter ${TONE_SECTION[tone]}`}>
      <div className="container-site grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
        <Reveal className={reverse ? "md:order-2" : ""}>
          <div className="media relative aspect-[4/3]">
            <SanityImage
              image={block.image}
              alt={block.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal className={`max-w-[34rem] ${reverse ? "md:order-1" : ""}`} delay={80}>
          {block.eyebrow && <p className="eyebrow mb-4">{block.eyebrow}</p>}
          <h3 className="whitespace-pre-line">{block.headline}</h3>
          {block.body?.length ? <RichText value={block.body} className={`prose-site mt-4 ${bodyColor}`} /> : null}
          {block.cta && (
            <div className="mt-6">
              <ActionLink link={block.cta} variant="text" />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
