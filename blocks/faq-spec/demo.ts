import { key, link, pt } from "@/content/demo-helpers";
import type { BlockOf, ProductSummary } from "@/blocks/types";

export function faqSpecDemo(input: {
  eyebrow?: string;
  headline?: string;
  product?: ProductSummary;
  specsHeadline?: string;
  showSpecs?: boolean;
  faqHeadline?: string;
  /** Answers are plain paragraphs (see `pt()` prefixes for headings/bullets). */
  faqs: Array<{ question: string; answer: string[] }>;
  downloads?: Array<{ label: string; href: string }>;
}): BlockOf<"faqSpecBlock"> {
  return {
    _key: key("faq-spec"),
    _type: "faqSpecBlock",
    eyebrow: input.eyebrow ?? undefined,
    headline: input.headline ?? undefined,
    product: input.product ?? null,
    specsHeadline: input.specsHeadline ?? "Technical specifications",
    showSpecs: input.showSpecs ?? true,
    faqHeadline: input.faqHeadline ?? "Frequently asked questions",
    faqs: input.faqs.map((faq) => ({
      _key: key("faq"),
      _type: "faqItem",
      question: faq.question,
      answer: pt(...faq.answer),
    })),
    downloads: input.downloads?.map((download) => ({ _key: key("download"), ...link(download.label, download.href) })),
  };
}
