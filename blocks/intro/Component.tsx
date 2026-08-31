import Reveal from "@/components/motion/Reveal";
import RichText from "@/components/RichText";
import { stegaClean } from "next-sanity";
import SectionBackdrop, { hasBackdrop } from "@/components/SectionBackdrop";
import { backgroundClass } from "@/lib/section-background";
import type { BlockProps } from "@/blocks/types";

/** Written out in full because Tailwind cannot generate class names from runtime values. */
const MIN_HEIGHT: Record<string, string> = {
  "50": "min-h-[50svh]",
  "75": "min-h-[75svh]",
  "100": "min-h-[100svh]",
};

/**
 * Apple intro: centered headline (40/600), first paragraph in the 300-weight
 * whisper voice, remaining paragraphs 17px ash.
 *
 * The canvas is editor-chosen (black or grey), and the section can be laid over a
 * still or a looping film. With media behind it the copy switches to the on-dark
 * register and a scrim carries the contrast, so the text stays legible whatever
 * the footage does.
 */
export default function IntroBlock({ block }: BlockProps<"introBlock">) {
  const media = { image: block.backgroundImage, video: block.backgroundVideo, muted: block.backgroundMuted };
  const backdrop = hasBackdrop(media);
  const canvas = backgroundClass(block.background, "canvas-white");
  // A taller section centres its copy; the default stays as tall as the content.
  const minHeight = MIN_HEIGHT[stegaClean(block.minHeight) ?? ""] ?? "";

  return (
    <section
      className={`${canvas} section-space page-gutter ${backdrop ? "relative isolate overflow-hidden on-dark" : ""} ${
        minHeight ? `${minHeight} flex flex-col justify-center` : ""
      }`}
    >
      <SectionBackdrop {...media} />

      <Reveal className="container-text relative text-center">
        {block.eyebrow && <p className="eyebrow mb-4">{block.eyebrow}</p>}
        <h2 className={`mx-auto whitespace-pre-line ${block.wideHeadline ? "max-w-[40ch]" : "max-w-[24ch]"}`}>{block.headline}</h2>
        {block.body?.length ? (
          <RichText
            value={block.body}
            className={`prose-site mx-auto mt-3 max-w-[42rem] text-center ${backdrop ? "text-fg" : "text-fg-muted"} [&>p:first-child]:text-[clamp(1.3125rem,1.9vw,1.625rem)] [&>p:first-child]:font-light [&>p:first-child]:leading-[1.24] [&>p:first-child]:tracking-[0.004em] [&>p:first-child]:text-fg`}
          />
        ) : null}
      </Reveal>
    </section>
  );
}
