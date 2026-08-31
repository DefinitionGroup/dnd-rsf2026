import { parseEmbed } from "./video-embed";
import { resolveVideoUrl } from "@/sanity/lib/video";
import type { ResolvedVideo } from "@/blocks/types";

/** What a hero's overlay player plays: an uploaded file, or a provider embed. */
export type OverlayVideo =
  | { kind: "file"; src: string; mimeType?: string | null; poster?: string }
  | { kind: "embed"; src: string };

/** The `videoButton` field group, shared by the hero blocks that offer it. */
export type OverlayFields = {
  overlaySource?: string | null;
  overlayVideo?: ResolvedVideo | null;
  overlayVideoUrl?: string | null;
  /** The block's own background video — used when no overlay file is assigned. */
  fallbackVideo?: ResolvedVideo | null;
};

/**
 * The film behind the button: an external embed, the dedicated overlay upload,
 * or — when neither is set — the hero's own background video.
 *
 * Lives outside any `"use client"` module so server-rendered blocks get the real
 * function rather than a client reference. Pass `source` values already cleaned
 * of stega characters.
 */
export function resolveOverlayVideo(fields: OverlayFields, posterUrl?: string): OverlayVideo | null {
  if (fields.overlaySource === "external") {
    const embed = parseEmbed(fields.overlayVideoUrl);
    return embed ? { kind: "embed", src: embed.src } : null;
  }
  const file = fields.overlayVideo?.asset ? fields.overlayVideo : fields.fallbackVideo;
  const src = resolveVideoUrl(file);
  if (!src) return null;
  return { kind: "file", src, mimeType: file?.asset?.mimeType, poster: posterUrl };
}
