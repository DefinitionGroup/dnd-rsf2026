import { key, pt } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function faqDemo(input: {
  eyebrow?: string;
  headline?: string;
  /** Answers are plain paragraphs (see `pt()` prefixes for headings/bullets). */
  faqs: Array<{ question: string; answer: string[] }>;
}): BlockOf<"faqBlock"> {
  return {
    _key: key("faq"),
    _type: "faqBlock",
    eyebrow: input.eyebrow ?? undefined,
    headline: input.headline ?? "Frequently asked questions",
    faqs: input.faqs.map((faq) => ({
      _key: key("faq-item"),
      _type: "faqItem",
      question: faq.question,
      answer: pt(...faq.answer),
    })),
  };
}
