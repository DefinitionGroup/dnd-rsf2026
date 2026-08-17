import { stegaClean } from "next-sanity";
import ActionLink from "@/components/ActionLink";
import Reveal from "@/components/motion/Reveal";
import type { BlockProps } from "@/blocks/types";

type Tone = "lime" | "ink" | "paper";

const TONE_CLASSES: Record<
  Tone,
  { section: string; panel: string; eyebrow: string; headline: string; body: string; primary: "primary" | "secondary" }
> = {
  lime: {
    section: "bg-paper",
    panel: "bg-lime text-ink",
    eyebrow: "text-ink/70",
    headline: "text-ink",
    body: "text-ink/80",
    // On a lime panel the primary (lime) button would vanish — use the outlined variant.
    primary: "secondary",
  },
  ink: {
    section: "on-dark bg-paper",
    panel: "bg-ink text-paper",
    eyebrow: "text-lime",
    headline: "text-paper",
    body: "text-paper/80",
    primary: "primary",
  },
  paper: {
    section: "bg-paper",
    panel: "bg-sand text-text border border-line",
    eyebrow: "",
    headline: "",
    body: "text-muted",
    primary: "primary",
  },
};

export default function CtaBlock({ block }: BlockProps<"ctaBlock">) {
  const toneKey = stegaClean(block.tone ?? "lime");
  const tone: Tone = toneKey === "ink" || toneKey === "paper" ? toneKey : "lime";
  const classes = TONE_CLASSES[tone];

  return (
    <section className={`section-space page-gutter ${classes.section}`}>
      <div className="container-site">
        <Reveal
          className={`relative isolate overflow-hidden rounded-3xl px-6 py-14 text-center md:px-16 md:py-24 ${classes.panel}`}
        >
          {tone === "ink" && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-lime/20 blur-3xl"
            />
          )}
          <div className="mx-auto max-w-3xl">
            {block.eyebrow && <p className={`eyebrow mb-4 ${classes.eyebrow}`}>{block.eyebrow}</p>}
            <h2 className={`whitespace-pre-line ${classes.headline}`}>{block.headline}</h2>
            {block.body && <p className={`mx-auto mt-5 max-w-2xl text-lg leading-relaxed ${classes.body}`}>{block.body}</p>}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ActionLink link={block.primaryCta} variant={classes.primary} />
              <ActionLink link={block.secondaryCta} variant={tone === "lime" ? "text" : "secondary"} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
