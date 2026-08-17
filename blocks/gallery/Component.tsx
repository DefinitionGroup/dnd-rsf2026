import Reveal from "@/components/motion/Reveal";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import type { BlockProps } from "@/blocks/types";

/**
 * Apple gallery: 3-col grid (2-col on md) of square `.media` frames on a white
 * canvas; the first frame spans two columns when count % 3 === 1. Centered
 * caption under each.
 */
export default function GalleryBlock({ block }: BlockProps<"galleryBlock">) {
  const images = (block.images ?? []).filter((item) => item.image?.asset);
  if (!images.length) return null;

  return (
    <section className="canvas-white section-space page-gutter">
      <div className="container-site">
        <SectionHeader headline={block.headline} />

        <ul className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ${block.headline ? "mt-12 md:mt-16" : ""}`} role="list">
          {images.map((item, index) => {
            const wide = images.length % 3 === 1 && index === 0;
            return (
              <Reveal key={item._key} as="li" delay={(index % 3) * 60} className={wide ? "md:col-span-2" : ""}>
                <figure>
                  <div className={`media relative ${wide ? "aspect-square md:aspect-[2/1]" : "aspect-square"}`}>
                    <SanityImage
                      image={item.image}
                      alt={item.alt}
                      fill
                      sizes={wide ? "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                      className="object-cover"
                    />
                  </div>
                  {item.caption && <figcaption className="caption mt-3 text-center">{item.caption}</figcaption>}
                </figure>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
