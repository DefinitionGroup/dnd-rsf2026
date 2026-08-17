import { img, key } from "@/content/demo-helpers";
import { spektrum150 } from "@/content/demo-products";
import type { BlockOf } from "@/blocks/types";

/** 12 evenly spaced spin frames of the Spektrum 150 (public/images/spektrum-spin-01…12.jpg). */
export const SPEKTRUM_SPIN_FRAMES = Array.from({ length: 12 }, (_, i) => `spektrum-spin-${String(i + 1).padStart(2, "0")}.jpg`);

export function productViewerDemo(input: {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  /** Frame file names in rotation order; defaults to the 12 Spektrum spin frames. */
  frames?: string[];
  /** Product shown below the viewer (also the frame fallback); defaults to spektrum150. Pass `null` for none. */
  product?: BlockOf<"productViewerBlock">["product"];
  alt: string;
  hint?: string | null;
  autoRotate?: boolean;
} = { alt: "Spektrum 150 reef LED, rotating 360 degrees" }): BlockOf<"productViewerBlock"> {
  const frames = input.frames ?? SPEKTRUM_SPIN_FRAMES;
  return {
    _key: key("viewer"),
    _type: "productViewerBlock",
    eyebrow: input.eyebrow,
    headline: input.headline,
    intro: input.intro,
    product: input.product === undefined ? spektrum150 : input.product,
    frames: frames.map((file, i) => ({ ...img(file, { width: 1200, height: 1200 }), _key: key(`frame-${i + 1}`) })),
    alt: input.alt,
    hint: input.hint === null ? undefined : (input.hint ?? "Drag to rotate · scroll to zoom"),
    autoRotate: input.autoRotate ?? true,
  };
}
