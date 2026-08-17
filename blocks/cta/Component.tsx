import { stegaClean } from "next-sanity";
import ActionLink from "@/components/ActionLink";
import Reveal from "@/components/motion/Reveal";
import type { BlockProps } from "@/blocks/types";

type Tone = "lime" | "ink" | "paper";

const TONE_CLASSES: Record<
  Tone,
  { section: string; body: string; primary: "primary" | "secondary"; secondary: "secondary" | "text" }
> = {
  // Lime field: the primary (lime) pill would vanish — ink pill + text link instead.
  lime: { section: "bg-lime text-ink", body: "text-ink/75", primary: "secondary", secondary: "text" },
  ink: { section: "stage", body: "", primary: "primary", secondary: "secondary" },
  paper: { section: "stage-sand", body: "", primary: "primary", secondary: "secondary" },
};

/** Centred statement on a full-width field (ink stage / sand / lime). */
export default function CtaBlock({ block }: BlockProps<"ctaBlock">) {
  const toneKey = stegaClean(block.tone ?? "lime");
  const tone: Tone = toneKey === "ink" || toneKey === "paper" ? toneKey : "lime";
  const classes = TONE_CLASSES[tone];

  return (
    <section className={`section-space page-gutter ${classes.section}`}>
      <Reveal className="mx-auto max-w-[46rem] text-center">
        <h2 className="display-lg mx-auto max-w-[20ch] whitespace-pre-line">{block.headline}</h2>
        {block.body && <p className={`lead mx-auto mt-5 max-w-[36rem] ${classes.body}`}>{block.body}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ActionLink link={block.primaryCta} variant={classes.primary} />
          <ActionLink link={block.secondaryCta} variant={classes.secondary} className={tone === "lime" ? "text-ink" : ""} />
        </div>
      </Reveal>
    </section>
  );
}
