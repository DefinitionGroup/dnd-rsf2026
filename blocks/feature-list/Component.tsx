import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/SectionHeader";
import type { BlockProps } from "@/blocks/types";

/**
 * Two-column statement list: big statement + one line of support, items
 * separated by hairlines. No cards, no numbers, no icons.
 */
export default function FeatureListBlock({ block }: BlockProps<"featureListBlock">) {
  const items = block.items ?? [];

  return (
    <section className="section-space page-gutter stage-sand">
      <div className="container-site">
        <SectionHeader headline={block.headline} intro={block.intro} />

        {items.length > 0 && (
          <ul className="mt-12 grid gap-x-12 md:mt-16 md:grid-cols-2 lg:gap-x-20" role="list">
            {items.map((item, index) => (
              <Reveal
                key={item._key}
                as="li"
                delay={(index % 2) * 60}
                className="hairline border-t py-7 md:py-9"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                {item.text && <p className="mt-2 max-w-[44ch] text-muted">{item.text}</p>}
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
