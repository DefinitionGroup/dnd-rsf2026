import ActionLink from "@/components/ActionLink";
import RichText from "@/components/RichText";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import type { BlockProps } from "@/blocks/types";

export default function FaqSpecBlock({ block }: BlockProps<"faqSpecBlock">) {
  const specs = block.showSpecs !== false ? (block.product?.specs ?? []) : [];
  const downloads = block.downloads ?? [];
  const faqs = block.faqs ?? [];
  const showSpecs = specs.length > 0 || downloads.length > 0;
  const showFaq = faqs.length > 0;
  if (!showSpecs && !showFaq) return null;

  const accordionName = `faq-${block._key}`;

  return (
    <section className="section-space page-gutter bg-sand">
      <div className="container-site">
        {(block.eyebrow || block.headline) && (
          <Reveal>
            <SectionHeader eyebrow={block.eyebrow} headline={block.headline} className="mb-12" />
          </Reveal>
        )}

        <div className={`grid gap-12 ${showSpecs && showFaq ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16" : ""}`}>
          {showSpecs && (
            <Reveal as="div">
              <div className="on-dark rounded-2xl bg-ink p-6 text-paper md:p-8">
                {block.specsHeadline ? <h3 className="text-paper">{block.specsHeadline}</h3> : null}
                {block.product?.name ? (
                  <p className="eyebrow mt-2 text-lime">
                    {block.product.name}
                    {block.product.sku ? <span className="text-paper/40"> · {block.product.sku}</span> : null}
                  </p>
                ) : null}

                {specs.length > 0 && (
                  <table className="mt-6 w-full border-collapse text-sm">
                    <caption className="sr-only">{block.specsHeadline ?? block.product?.name ?? "Specifications"}</caption>
                    <tbody>
                      {specs.map((spec) => (
                        <tr key={spec._key} className="border-t border-paper/10 last:border-b">
                          <th scope="row" className="py-3 pr-4 text-left font-display text-xs font-normal uppercase tracking-[0.15em] text-paper/60">
                            {spec.label}
                          </th>
                          <td className="py-3 text-right font-medium tabular-nums text-paper">
                            {spec.value}
                            {spec.unit ? <span className="ml-1 text-paper/60">{spec.unit}</span> : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {downloads.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-3" role="list">
                    {downloads.map((download) => (
                      <li key={download._key}>
                        <ActionLink link={download} variant="secondary" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          )}

          {showFaq && (
            <Reveal as="div" delay={0.08}>
              {block.faqHeadline ? <h3 className="mb-6">{block.faqHeadline}</h3> : null}
              <div className="divide-y divide-line border-y border-line">
                {faqs.map((faq) => (
                  <details
                    key={faq._key}
                    name={accordionName}
                    className="group py-1"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 font-display text-lg uppercase tracking-tight text-ink transition-colors hover:text-lime-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime [&::-webkit-details-marker]:hidden">
                      <span>{faq.question}</span>
                      <span
                        className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-base leading-none transition-transform duration-300 group-open:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <div className="pb-6 pr-12">
                      <RichText value={faq.answer} className="prose-site text-text" />
                    </div>
                  </details>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
