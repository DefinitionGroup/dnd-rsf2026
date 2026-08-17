import { key } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function testimonialDemo(input: {
  eyebrow?: string;
  headline?: string;
  testimonials: Array<{ quote: string; name: string; role?: string; company?: string }>;
}): BlockOf<"testimonialBlock"> {
  return {
    _key: key("testimonial"),
    _type: "testimonialBlock",
    eyebrow: input.eyebrow ?? undefined,
    headline: input.headline ?? undefined,
    testimonials: input.testimonials.map((item) => ({
      _id: key("demo-testimonial"),
      quote: item.quote,
      name: item.name,
      role: item.role ?? null,
      company: item.company ?? null,
    })),
  };
}
