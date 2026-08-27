import { key, link } from "@/content/demo-helpers";
import type { BlockOf, ProductSummary } from "@/blocks/types";

export function specsDemo(input: {
  eyebrow?: string;
  headline?: string;
  product?: ProductSummary;
  downloads?: Array<{ label: string; href: string }>;
}): BlockOf<"specsBlock"> {
  return {
    _key: key("specs"),
    _type: "specsBlock",
    eyebrow: input.eyebrow ?? undefined,
    headline: input.headline ?? "Technical specifications",
    product: input.product ?? null,
    downloads: input.downloads?.map((download) => ({ _key: key("download"), ...link(download.label, download.href) })),
  };
}
