import SectionHeader from "@/components/SectionHeader";
import GalleryGrid from "@/blocks/gallery/GalleryGrid";
import type { BlockProps } from "@/blocks/types";
import { backgroundClass } from "@/lib/section-background";

/**
 * Apple gallery: 3-col grid (2-col on md) of square `.media` frames on a white
 * canvas; the first frame spans two columns when count % 3 === 1. Centered
 * caption under each. Each frame opens a full-screen zoom overlay.
 */
export default function GalleryBlock({ block }: BlockProps<"galleryBlock">) {
  const images = (block.images ?? []).filter((item) => item.image?.asset);
  if (!images.length) return null;

  return (
    <section className={`${backgroundClass(block.background, "canvas-frost")} section-space page-gutter`}>
      <div className="container-site">
        <SectionHeader eyebrow={block.eyebrow} headline={block.headline} />
        <GalleryGrid images={images} className={block.headline ? "mt-12 md:mt-16" : ""} />
      </div>
    </section>
  );
}
