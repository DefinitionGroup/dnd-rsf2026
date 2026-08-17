import { captioned, key } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function galleryDemo(input: {
  eyebrow?: string;
  headline: string;
  images: { file: string; alt: string; caption?: string }[];
}): BlockOf<"galleryBlock"> {
  return {
    _key: key("gallery"),
    _type: "galleryBlock",
    eyebrow: input.eyebrow,
    headline: input.headline,
    images: input.images.map((image) => captioned(image.file, image.alt, image.caption)),
  };
}
