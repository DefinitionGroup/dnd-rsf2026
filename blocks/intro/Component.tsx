import Reveal from "@/components/motion/Reveal";
import RichText from "@/components/RichText";
import type { BlockProps } from "@/blocks/types";

export default function IntroBlock({ block }: BlockProps<"introBlock">) {
  return (
    <section className="section-space page-gutter bg-paper">
      <Reveal className="container-site grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          {block.eyebrow && <p className="eyebrow mb-4">{block.eyebrow}</p>}
          <h2 className="whitespace-pre-line">{block.headline}</h2>
        </div>
        {block.body?.length ? (
          <div className="md:col-span-5 md:pt-2 lg:col-span-4 lg:col-start-9">
            <RichText value={block.body} className="prose-site text-lg leading-relaxed text-text" />
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}
