/**
 * Helpers to author demo content in the *resolved* shape the GROQ projections
 * return, so demo pages type-check against the generated query result types.
 * Demo image assets have `_id` starting with "demo-" and a local `url` under
 * /public/images — resolveImageUrl() serves them untouched.
 */
import type { RichText } from "@/sanity.types";
import type { ResolvedImage } from "@/blocks/types";

let keyCounter = 0;
export function key(prefix = "k") {
  keyCounter += 1;
  return `${prefix}-${keyCounter}`;
}

export function img(file: string, opts: { width?: number; height?: number; lqip?: string } = {}): ResolvedImage {
  const name = file.replace(/^\/images\//, "").replace(/\.[a-z]+$/i, "");
  return {
    _type: "image",
    asset: {
      _id: `demo-${name}`,
      url: file.startsWith("/") ? file : `/images/${file}`,
      lqip: opts.lqip ?? null,
      dimensions: { _type: "sanity.imageDimensions", width: opts.width ?? 1600, height: opts.height ?? 1000, aspectRatio: (opts.width ?? 1600) / (opts.height ?? 1000) },
    },
  };
}

export function captioned(file: string, alt: string, caption?: string) {
  return { _key: key("img"), alt, caption: caption ?? null, image: img(file) };
}

/** Portable Text from plain paragraphs. Use `h2:`/`h3:` prefixes for headings, `- ` for bullets. */
export function pt(...paragraphs: string[]): RichText {
  return paragraphs.map((text) => {
    let style: "normal" | "h2" | "h3" | "h4" | "blockquote" = "normal";
    let listItem: "bullet" | undefined;
    let body = text;
    if (body.startsWith("h2:")) { style = "h2"; body = body.slice(3).trim(); }
    else if (body.startsWith("h3:")) { style = "h3"; body = body.slice(3).trim(); }
    else if (body.startsWith("> ")) { style = "blockquote"; body = body.slice(2); }
    else if (body.startsWith("- ")) { listItem = "bullet"; body = body.slice(2); }
    return {
      _type: "block" as const,
      _key: key("b"),
      style,
      ...(listItem ? { listItem, level: 1 } : {}),
      markDefs: [],
      children: [{ _type: "span" as const, _key: key("s"), text: body, marks: [] }],
    };
  });
}

export function link(label: string, href: string) {
  return { _type: "linkField" as const, label, href };
}

export type BackdropInput = {
  /** Canvas override: "black" or "gray". Unset keeps the block's default. */
  background?: "black" | "gray";
  /** File under /public/images — laid behind the copy under a scrim. */
  backgroundImage?: string;
  /** File under /public/videos — loops over the background image. */
  backgroundVideo?: { url: string; mimeType?: string };
  /** Scrim strength, 0–100. Lower lets the media pop. */
  backgroundMuted?: number;
};

/** The background field group in the resolved query shape, for blocks that offer a backdrop. */
export function backdrop(input: BackdropInput) {
  return {
    background: input.background,
    backgroundImage: input.backgroundImage ? img(input.backgroundImage, { width: 1920, height: 1080 }) : null,
    backgroundVideo: input.backgroundVideo
      ? {
          asset: {
            _id: `demo-video-${input.backgroundVideo.url.replace(/^\/videos\//, "").replace(/\.[a-z0-9]+$/i, "")}`,
            url: input.backgroundVideo.url,
            mimeType: input.backgroundVideo.mimeType ?? "video/mp4",
          },
        }
      : null,
    backgroundMuted: input.backgroundMuted,
  };
}
