import ActionLink from "@/components/ActionLink";
import RichText from "@/components/RichText";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import type { BlockProps } from "@/blocks/types";

function PlusMinusIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
      className="shrink-0 text-ink transition-transform duration-300 ease-[var(--ease-out-expo)] group-open:rotate-180"
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

export default function FaqSpecBlock({ block }: BlockProps<"faqSpecBlock">) {
  const specs = block.showSpecs !== false ? (block.product?.specs ?? []) : [];
  const downloads = block.downloads ?? [];
  const faqs = block.faqs ?? [];
  const showSpecs = specs.length > 0 || downloads.length > 0;
  const showFaq = faqs.length > 0;
  if (!showSpecs && !showFaq) return null;

  const accordionName = `faq-${block._key}`;

  return (
    <section className="section-space page-gutter bg-paper">
      <div className="container-site">
        {block.headline && <SectionHeader headline={block.headline} className="mb-12 md:mb-16" />}

        <div className={`grid gap-12 ${showSpecs && showFaq ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16" : ""}`}>
          {showSpecs && (
            <Reveal as="div">
              <div className="card p-7 md:p-8">
                {block.specsHeadline ? <h3 className="text-xl font-semibold">{block.specsHeadline}</h3> : null}
                {block.product?.name ? (
                  <p className="label mt-1">
                    {block.product.name}
                    {block.product.sku ? <span className="text-muted/70"> · {block.product.sku}</span> : null}
                  </p>
                ) : null}

                {specs.length > 0 && (
                  <table className="mt-6 w-full border-collapse">
                    <caption className="sr-only">{block.specsHeadline ?? block.product?.name ?? "Specifications"}</caption>
                    <tbody>
                      {specs.map((spec) => (
                        <tr key={spec._key} className="hairline border-t last:border-b">
                          <th scope="row" className="label py-3.5 pr-4 text-left align-baseline">
                            {spec.label}
                          </th>
                          <td className="num py-3.5 text-right align-baseline font-medium text-ink">
                            {spec.value}
                            {spec.unit ? <span className="ml-1 font-normal text-muted">{spec.unit}</span> : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {downloads.length > 0 && (
                  <ul className="mt-6 flex flex-col items-start gap-2" role="list">
                    {downloads.map((download) => (
                      <li key={download._key}>
                        <ActionLink link={download} variant="text" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          )}

          {showFaq && (
            <Reveal as="div" delay={80}>
              {block.faqHeadline ? <h3 className="mb-6 text-xl font-semibold">{block.faqHeadline}</h3> : null}
              <div className="hairline border-t">
                {faqs.map((faq) => (
                  <details key={faq._key} name={accordionName} className="group hairline border-b">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg font-medium text-ink transition-colors duration-200 hover:text-lime-deep [&::-webkit-details-marker]:hidden">
                      <span>{faq.question}</span>
                      <span className="mt-1 flex shrink-0 items-center" aria-hidden="true">
                        <PlusMinusIcon />
                      </span>
                    </summary>
                    <div className="pb-7 pr-12">
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
