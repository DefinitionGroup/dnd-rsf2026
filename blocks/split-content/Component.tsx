import { stegaClean } from "next-sanity";
import ActionLink from "@/components/ActionLink";
import Reveal from "@/components/motion/Reveal";
import RichText from "@/components/RichText";
import SanityImage from "@/components/SanityImage";
import type { BlockProps } from "@/blocks/types";

type Tone = "paper" | "sand" | "ink";

const TONE_CLASSES: Record<Tone, { section: string; eyebrow: string; headline: string; body: string }> = {
  paper: { section: "bg-paper text-text", eyebrow: "", headline: "", body: "" },
  sand: { section: "bg-sand text-text", eyebrow: "", headline: "", body: "" },
  ink: {
    section: "on-dark bg-ink text-paper/85",
    eyebrow: "text-lime",
    headline: "text-paper",
    body: "[&_a]:text-lime [&_blockquote]:border-lime [&_h2]:text-paper [&_h3]:text-paper [&_h4]:text-paper",
  },
};

export default function SplitContentBlock({ block }: BlockProps<"splitContentBlock">) {
  if (!block.image?.asset) return null;
  const toneKey = stegaClean(block.tone ?? "paper");
  const tone: Tone = toneKey === "ink" || toneKey === "sand" ? toneKey : "paper";
  const classes = TONE_CLASSES[tone];
  const reverse = Boolean(block.reverse);

  return (
    <section className={`section-space page-gutter ${classes.section}`}>
      <div className="container-site grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className={`lg:col-span-5 ${reverse ? "lg:order-2" : ""}`}>
          {block.eyebrow && <p className={`eyebrow mb-4 ${classes.eyebrow}`}>{block.eyebrow}</p>}
          <h2 className={`whitespace-pre-line ${classes.headline}`}>{block.headline}</h2>
          {block.body?.length ? (
            <RichText value={block.body} className={`prose-site mt-6 ${classes.body}`} />
          ) : null}
          {block.cta && (
            <div className="mt-8">
              <ActionLink link={block.cta} variant="text" />
            </div>
          )}
        </Reveal>

        <Reveal className={`lg:col-span-7 ${reverse ? "lg:order-1" : ""}`} delay={0.08}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-soft">
            <SanityImage
              image={block.image}
              alt={block.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
