import { key, link } from "@/content/demo-helpers";
import type { BlockOf, ProductSummary } from "@/blocks/types";

export function productListDemo(input: {
  eyebrow?: string;
  headline: string;
  intro?: string;
  items: Array<{ product: ProductSummary; link?: { label: string; href: string } }>;
}): BlockOf<"productListBlock"> {
  return {
    _key: key("product-list"),
    _type: "productListBlock",
    eyebrow: input.eyebrow ?? undefined,
    headline: input.headline,
    intro: input.intro ?? undefined,
    items: input.items.map((item) => ({
      _key: key("product-item"),
      product: item.product,
      link: item.link ? link(item.link.label, item.link.href) : null,
    })),
  };
}
