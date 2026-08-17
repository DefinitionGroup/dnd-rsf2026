import Reveal from "@/components/motion/Reveal";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import type { BlockProps } from "@/blocks/types";

export default function GalleryBlock({ block }: BlockProps<"galleryBlock">) {
  const images = (block.images ?? []).filter((item) => item.image?.asset);
  if (!images.length) return null;

  return (
    <section className="section-space page-gutter bg-paper">
      <div className="container-wide">
        <SectionHeader headline={block.headline} />

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-16 md:gap-6" role="list">
          {images.map((item, index) => {
            const wide = images.length % 3 === 1 && index === 0;
            return (
              <Reveal
                key={item._key}
                as="li"
                delay={(index % 3) * 60}
                className={wide ? "sm:col-span-2 lg:col-span-2" : ""}
              >
                <figure>
                  <div className={`media relative ${wide ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                    <SanityImage
                      image={item.image}
                      alt={item.alt}
                      fill
                      sizes={wide ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                      className="object-cover"
                    />
                  </div>
                  {item.caption && <figcaption className="caption mt-3">{item.caption}</figcaption>}
                </figure>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
