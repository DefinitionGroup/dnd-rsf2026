import RichText from "@/components/RichText";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import type { BlockProps } from "@/blocks/types";
import { backgroundClass } from "@/lib/section-background";

function PlusMinusIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
      className="shrink-0 text-fg-muted transition-transform duration-300 ease-[var(--ease-out-expo)] group-open:rotate-180"
    >
      <path d="M4 10h12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M10 4v12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="origin-center transition-transform duration-300 ease-[var(--ease-out-expo)] [transform-box:fill-box] group-open:rotate-90"
      />
    </svg>
  );
}

export default function FaqBlock({ block }: BlockProps<"faqBlock">) {
  const faqs = block.faqs ?? [];
  if (faqs.length === 0) return null;

  const accordionName = `faq-${block._key}`;

  return (
    <section className={`${backgroundClass(block.background, "canvas-white")} section-space page-gutter`}>
      <div className="container-site">
        {(block.eyebrow || block.headline) && <SectionHeader eyebrow={block.eyebrow} headline={block.headline} className="mb-12 md:mb-16" />}

        <Reveal as="div" className="mx-auto w-full max-w-[44rem]">
          <div>
            {faqs.map((faq) => (
              <details key={faq._key} name={accordionName} className="group hairline border-b first:border-t">
                <summary className="body flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-semibold text-fg [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span className="mt-0.5 flex shrink-0 items-center" aria-hidden="true">
                    <PlusMinusIcon />
                  </span>
                </summary>
                <div className="pb-6 pr-12">
                  <RichText value={faq.answer} className="prose-site text-fg-muted" />
                </div>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
