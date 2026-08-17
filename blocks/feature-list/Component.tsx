import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/SectionHeader";
import type { BlockProps } from "@/blocks/types";

export default function FeatureListBlock({ block }: BlockProps<"featureListBlock">) {
  const items = block.items ?? [];

  return (
    <section className="section-space page-gutter bg-paper">
      <div className="container-site">
        <Reveal>
          <SectionHeader eyebrow={block.eyebrow} headline={block.headline} intro={block.intro} />
        </Reveal>

        {items.length > 0 && (
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
            {items.map((item, index) => (
              <Reveal
                key={item._key}
                as="li"
                delay={index * 0.05}
                className="group relative flex min-h-56 flex-col justify-end bg-paper p-6 transition-colors hover:bg-sand md:p-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute right-6 top-6 font-display text-sm tracking-[0.2em] text-lime-deep transition-colors group-hover:text-ink md:right-8 md:top-8"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mb-4 h-1 w-8 rounded-full bg-lime" aria-hidden="true" />
                <h3 className="text-xl md:text-2xl">{item.title}</h3>
                {item.text && <p className="mt-2 max-w-prose leading-relaxed text-muted">{item.text}</p>}
              </Reveal>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
