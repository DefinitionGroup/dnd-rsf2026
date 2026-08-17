import { stegaClean } from "next-sanity";
import ActionLink from "@/components/ActionLink";
import Reveal from "@/components/motion/Reveal";
import RichText from "@/components/RichText";
import SanityImage from "@/components/SanityImage";
import type { BlockProps } from "@/blocks/types";

type Tone = "paper" | "sand" | "ink";

const TONE_SECTION: Record<Tone, string> = {
  paper: "bg-paper",
  sand: "stage-sand",
  ink: "stage",
};

export default function SplitContentBlock({ block }: BlockProps<"splitContentBlock">) {
  if (!block.image?.asset) return null;
  const toneKey = stegaClean(block.tone ?? "paper");
  const tone: Tone = toneKey === "ink" || toneKey === "sand" ? toneKey : "paper";
  const reverse = Boolean(block.reverse);

  return (
    <section className={`section-space page-gutter ${TONE_SECTION[tone]}`}>
      <div className="container-site grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className={`lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}>
          <div className="media relative aspect-[4/3]">
            <SanityImage
              image={block.image}
              alt={block.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal className={`lg:col-span-5 ${reverse ? "lg:order-1" : ""}`} delay={80}>
          <h2 className="display-md whitespace-pre-line">{block.headline}</h2>
          {block.body?.length ? <RichText value={block.body} className="prose-site mt-5" /> : null}
          {block.cta && (
            <div className="mt-7">
              <ActionLink link={block.cta} variant="text" />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
