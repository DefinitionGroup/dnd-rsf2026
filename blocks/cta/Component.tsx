import { stegaClean } from "next-sanity";
import ActionLink from "@/components/ActionLink";
import Reveal from "@/components/motion/Reveal";
import type { BlockProps } from "@/blocks/types";

type Tone = "lime" | "ink" | "paper";

/** No lime field in v3: paper/lime tones sit on frost, ink on the dark film canvas. */
const TONE_SECTION: Record<Tone, string> = {
  lime: "canvas-frost",
  paper: "canvas-frost",
  ink: "canvas-dark",
};

/** Centered statement: headline 40/600 + whisper body + paired pills. */
export default function CtaBlock({ block }: BlockProps<"ctaBlock">) {
  const toneKey = stegaClean(block.tone ?? "lime");
  const tone: Tone = toneKey === "ink" || toneKey === "paper" ? toneKey : "lime";

  return (
    <section className={`section-space page-gutter ${TONE_SECTION[tone]}`}>
      <Reveal className="container-text text-center">
        <h2 className="mx-auto max-w-[24ch] whitespace-pre-line">{block.headline}</h2>
        {block.body && <p className="whisper mx-auto mt-3 max-w-[42rem]">{block.body}</p>}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <ActionLink link={block.primaryCta} variant="primary" />
          <ActionLink link={block.secondaryCta} variant="secondary" />
        </div>
      </Reveal>
    </section>
  );
}
