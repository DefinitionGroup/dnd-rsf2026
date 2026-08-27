import ActionLink from "@/components/ActionLink";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import type { BlockProps } from "@/blocks/types";

export default function SpecsBlock({ block }: BlockProps<"specsBlock">) {
  const specs = block.product?.specs ?? [];
  const downloads = block.downloads ?? [];
  if (specs.length === 0 && downloads.length === 0) return null;

  return (
    <section className="canvas-white section-space page-gutter">
      <div className="container-site">
        {(block.eyebrow || block.headline) && <SectionHeader eyebrow={block.eyebrow} headline={block.headline} className="mb-12 md:mb-16" />}

        <Reveal as="div" className="mx-auto w-full max-w-[44rem]">
          <div className="flex flex-col gap-3">
            {block.product?.name ? (
              <p className="body-sm text-fg-muted">
                {block.product.name}
                {block.product.sku ? <span> · {block.product.sku}</span> : null}
              </p>
            ) : null}

            {specs.length > 0 && (
              <table className="mt-3 w-full border-collapse">
                <caption className="sr-only">{block.headline ?? block.product?.name ?? "Specifications"}</caption>
                <tbody>
                  {specs.map((spec) => (
                    <tr key={spec._key} className="hairline border-t last:border-b">
                      <th scope="row" className="body-sm py-3.5 pr-4 text-left align-baseline font-normal text-fg-muted">
                        {spec.label}
                      </th>
                      <td className="body num py-3.5 text-right align-baseline text-fg">
                        {spec.value}
                        {spec.unit ? <span className="figure-unit ml-1 text-fg-muted">{spec.unit}</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {downloads.length > 0 && (
              <ul className="mt-3 flex flex-col items-start gap-2" role="list">
                {downloads.map((download) => (
                  <li key={download._key}>
                    <ActionLink link={download} variant="text" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
