import Reveal from "@/components/motion/Reveal";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import type { BlockProps } from "@/blocks/types";

export default function GalleryBlock({ block }: BlockProps<"galleryBlock">) {
  const images = (block.images ?? []).filter((item) => item.image?.asset);
  if (!images.length) return null;

  return (
    <section className="section-space page-gutter bg-paper">
      <div className="container-site">
        <Reveal>
          <SectionHeader eyebrow={block.eyebrow} headline={block.headline} />
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-16 md:gap-6">
          {images.map((item, index) => {
            const wide = images.length % 3 === 1 && index === 0;
            return (
              <Reveal
                key={item._key}
                as="li"
                delay={index * 0.06}
                className={wide ? "sm:col-span-2 lg:col-span-2" : ""}
              >
                <figure className="group">
                  <div className={`relative overflow-hidden rounded-2xl bg-ink-soft ${wide ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                    <SanityImage
                      image={item.image}
                      alt={item.alt}
                      fill
                      sizes={wide ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  {item.caption && (
                    <figcaption className="mt-3 flex items-baseline gap-3 text-sm text-muted">
                      <span aria-hidden="true" className="font-display text-xs tracking-[0.2em] text-lime-deep">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{item.caption}</span>
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
