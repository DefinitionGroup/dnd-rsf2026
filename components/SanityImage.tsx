import Image, { getImageProps, type ImageProps } from "next/image";
import { imageDimensions, imagePlaceholder, resolveImageUrl, type ImageLike } from "@/sanity/lib/image";
import { MOBILE_MEDIA } from "@/lib/mobile-media";

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  image: ImageLike;
  alt: string;
  width?: number;
  height?: number;
  /** Optional phone version (own crop, own hotspot) — swapped in below 768 px via <picture>. */
  mobileImage?: ImageLike;
};

/** next/image over a projected Sanity image (or a demo placeholder). Returns null without an asset. */
export default function SanityImage({ image, alt, width, height, fill, sizes, mobileImage, ...rest }: Props) {
  const src = resolveImageUrl(image, { width, height });
  if (!src) return null;
  const dims = fill ? {} : width && height ? { width, height } : imageDimensions(image);
  const mobileSrc = resolveImageUrl(mobileImage, { width, height });
  if (mobileSrc) return <ArtDirected src={src} mobileSrc={mobileSrc} mobileImage={mobileImage} alt={alt} width={width} height={height} fill={fill} sizes={sizes} dims={dims} rest={rest} />;

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

/**
 * Desktop and mobile image in one <picture>: the browser downloads only the one
 * whose media query matches. next/image cannot preload two candidates, so
 * `priority` becomes eager loading at high fetch priority instead of a preload
 * (which would fetch the desktop file on phones too), and there is no blur
 * placeholder — it would show the wrong picture at one of the two sizes.
 */
function ArtDirected({
  src,
  mobileSrc,
  mobileImage,
  alt,
  width,
  height,
  fill,
  sizes,
  dims,
  rest,
}: {
  src: string;
  mobileSrc: string;
  mobileImage: ImageLike;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  dims: { width?: number; height?: number };
  rest: Omit<ImageProps, "src" | "alt" | "width" | "height" | "fill" | "sizes">;
}) {
  const { priority, preload, loading, fetchPriority, ...imgRest } = rest;
  const eager = Boolean(priority || preload);
  const common = { alt, fill, sizes: sizes ?? (fill ? "100vw" : undefined), ...imgRest };
  const mobileDims = fill ? {} : width && height ? { width, height } : imageDimensions(mobileImage);

  const { props: desktop } = getImageProps({ ...common, src, ...dims });
  const {
    props: { srcSet: mobileSrcSet, src: mobileFallback },
  } = getImageProps({ ...common, src: mobileSrc, ...mobileDims });

  return (
    <picture>
      <source media={MOBILE_MEDIA} srcSet={mobileSrcSet ?? mobileFallback} sizes={common.sizes} {...mobileDims} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
      <img
        {...desktop}
        loading={eager ? "eager" : (loading ?? desktop.loading)}
        fetchPriority={eager ? "high" : (fetchPriority ?? desktop.fetchPriority)}
      />
    </picture>
  );
}
