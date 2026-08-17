import Image, { type ImageProps } from "next/image";
import { imageDimensions, imagePlaceholder, resolveImageUrl, type ImageLike } from "@/sanity/lib/image";

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  image: ImageLike;
  alt: string;
  width?: number;
  height?: number;
};

/** next/image over a projected Sanity image (or a demo placeholder). Returns null without an asset. */
export default function SanityImage({ image, alt, width, height, fill, sizes, ...rest }: Props) {
  const src = resolveImageUrl(image, { width, height });
  if (!src) return null;
  const dims = fill ? {} : width && height ? { width, height } : imageDimensions(image);
  const lqip = imagePlaceholder(image);
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes ?? (fill ? "100vw" : undefined)}
      placeholder={lqip ? "blur" : undefined}
      blurDataURL={lqip}
      {...dims}
      {...rest}
    />
  );
}
