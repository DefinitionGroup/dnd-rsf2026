import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, isSanityConfigured, studioProjectId } from "@/sanity/env";
import type { ResolvedImage } from "@/blocks/types";

const builder = createImageUrlBuilder({ projectId: studioProjectId, dataset });

export type ImageLike = ResolvedImage | { asset?: { _id?: string; url?: string } | null } | null | undefined;

/**
 * Build a CDN URL for a projected image (asset resolved to `{_id, url}`).
 * Demo mode (no Sanity env) or demo assets (`_id` starts with "demo-") return the
 * asset's local `url` unchanged so /public placeholders work without a CDN.
 */
export function resolveImageUrl(
  source: ImageLike,
  options: { width?: number; height?: number; quality?: number } = {},
) {
  const asset = source?.asset;
  if (!asset?._id && !asset?.url) return undefined;
  if (!isSanityConfigured || asset._id?.startsWith("demo-")) return asset.url ?? undefined;

  let b = builder.image(source as SanityImageSource).auto("format");
  if (options.width) b = b.width(options.width);
  if (options.height) b = b.height(options.height).fit("crop");
  if (options.quality) b = b.quality(options.quality);
  return b.url();
}

export function imageDimensions(source: ImageLike): { width: number; height: number } {
  const dims = (source as ResolvedImage | null | undefined)?.asset?.dimensions;
  return dims?.width && dims?.height ? { width: dims.width, height: dims.height } : { width: 1600, height: 1000 };
}

export function imagePlaceholder(source: ImageLike) {
  return (source as ResolvedImage | null | undefined)?.asset?.lqip ?? undefined;
}
