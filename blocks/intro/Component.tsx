import Reveal from "@/components/motion/Reveal";
import RichText from "@/components/RichText";
import type { BlockProps } from "@/blocks/types";

export default function IntroBlock({ block }: BlockProps<"introBlock">) {
  return (
    <section className="section-space page-gutter bg-paper">
      <Reveal className="container-prose">
        <h2 className="display-md whitespace-pre-line">{block.headline}</h2>
        {block.body?.length ? (
          <RichText
            value={block.body}
            className="prose-site mt-8 [&>p:first-child]:text-lead [&>p:first-child]:leading-[1.45] [&>p:first-child]:text-muted"
          />
        ) : null}
      </Reveal>
    </section>
  );
}
