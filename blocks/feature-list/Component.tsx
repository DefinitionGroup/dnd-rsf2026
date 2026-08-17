import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/SectionHeader";
import type { BlockProps } from "@/blocks/types";

/**
 * Apple tile grid: frost tiles (8px) on a white canvas, 2-up from md and 3-up
 * from lg when there are six or more items. Title 21/600 + small ash text.
 * No cards-with-borders, no icons, no numbers.
 */
export default function FeatureListBlock({ block }: BlockProps<"featureListBlock">) {
  const items = block.items ?? [];
  const cols = items.length >= 6 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2";

  return (
    <section className="canvas-white section-space page-gutter">
      <div className="container-site">
        <SectionHeader headline={block.headline} intro={block.intro} />

        {items.length > 0 && (
          <ul className={`grid gap-4 ${block.headline || block.intro ? "mt-12 md:mt-16" : ""} ${cols}`} role="list">
            {items.map((item, index) => (
              <Reveal key={item._key} as="li" delay={(index % 3) * 60} className="flex">
                <div className="tile h-full w-full">
                  <h4>{item.title}</h4>
                  {item.text && <p className="body-sm mt-3 text-fg-muted">{item.text}</p>}
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
