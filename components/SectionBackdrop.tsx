import BackdropVideo from "@/components/BackdropVideo";
import SanityImage from "@/components/SanityImage";
import { resolveImageUrl } from "@/sanity/lib/image";
import type { ResolvedImage, ResolvedVideo } from "@/blocks/types";

export type BackdropMedia = {
  image?: ResolvedImage | null;
  video?: ResolvedVideo | null;
  /** Optional phone versions, swapped in below 768 px. */
  imageMobile?: ResolvedImage | null;
  videoMobile?: ResolvedVideo | null;
  /** 0–100. How far the scrim dims the media; the default matches the old fixed 60%. */
  muted?: number | null;
};

const DEFAULT_MUTED = 60;

/** True when a block has anything to put behind its copy. */
export function hasBackdrop({ image, video }: BackdropMedia) {
  return Boolean(video?.asset?.url || image?.asset);
}

/**
 * Full-bleed still and/or looping film behind a section's copy, under a scrim the
 * editor controls: drop the muting towards 0 to let the media carry the section,
 * raise it when the copy needs the contrast.
 *
 * The still is its own layer rather than just the video's `poster`, so
 * `motion-reduce` can hide the film and leave a real frame behind.
 *
 * Expects a `relative isolate overflow-hidden` parent; sits on -z-10 so the
 * section's own canvas colour still paints behind it.
 */
export default function SectionBackdrop({ image, video, imageMobile, videoMobile, muted }: BackdropMedia) {
  const videoUrl = video?.asset?.url;
  const hasImage = Boolean(image?.asset);
  if (!videoUrl && !hasImage) return null;

  const dim = Math.min(100, Math.max(0, typeof muted === "number" ? muted : DEFAULT_MUTED)) / 100;

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      {hasImage && <SanityImage image={image} mobileImage={imageMobile} alt="" fill sizes="100vw" className="object-cover" />}
      {videoUrl && (
        <BackdropVideo
          src={videoUrl}
          mimeType={video?.asset?.mimeType}
          mobileSrc={videoMobile?.asset?.url}
          mobileMimeType={videoMobile?.asset?.mimeType}
          poster={resolveImageUrl(image, { width: 1920 })}
          mobilePoster={resolveImageUrl(imageMobile, { width: 1080 })}
        />
      )}
      {dim > 0 && <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${dim})` }} />}
    </div>
  );
}
