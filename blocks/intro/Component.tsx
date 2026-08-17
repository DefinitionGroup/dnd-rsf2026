import Reveal from "@/components/motion/Reveal";
import RichText from "@/components/RichText";
import type { BlockProps } from "@/blocks/types";

/**
 * Apple intro: centered headline (40/600), first paragraph in the 300-weight
 * whisper voice, remaining paragraphs 17px ash — all on a white canvas.
 */
export default function IntroBlock({ block }: BlockProps<"introBlock">) {
  return (
    <section className="canvas-white section-space page-gutter">
      <Reveal className="container-text text-center">
        <h2 className="mx-auto max-w-[24ch] whitespace-pre-line">{block.headline}</h2>
        {block.body?.length ? (
          <RichText
            value={block.body}
            className="prose-site mx-auto mt-3 max-w-[42rem] text-center text-fg-muted [&>p:first-child]:text-[clamp(1.3125rem,1.9vw,1.625rem)] [&>p:first-child]:font-light [&>p:first-child]:leading-[1.24] [&>p:first-child]:tracking-[0.004em] [&>p:first-child]:text-fg"
          />
        ) : null}
      </Reveal>
    </section>
  );
}
