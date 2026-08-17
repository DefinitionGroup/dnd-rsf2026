import Link from "next/link";
import { stegaClean } from "next-sanity";
import Reveal from "@/components/motion/Reveal";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import type { BlockProps } from "@/blocks/types";

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

export default function ProductListBlock({ block }: BlockProps<"productListBlock">) {
  const items = (block.items ?? []).filter((item) => item.product);
  if (items.length === 0) return null;

  return (
    <section className="section-space page-gutter bg-paper">
      <div className="container-site">
        <Reveal>
          <SectionHeader eyebrow={block.eyebrow} headline={block.headline} intro={block.intro} />
        </Reveal>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {items.map((item, index) => {
            const product = item.product;
            const href = stegaClean(item.link?.href) || product.legacyUrl || null;
            const cardBody = (
              <>
                <span className="relative block aspect-[4/3] overflow-hidden bg-ink-soft">
                  {product.image?.asset ? (
                    <SanityImage
                      image={product.image}
                      alt={product.imageAlt ?? product.name ?? ""}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.62,0.05,0.01,0.99)] group-hover:scale-[1.04]"
                    />
                  ) : null}
                  <span
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute left-4 top-4 font-display text-xs uppercase tracking-[0.2em] text-lime">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className="flex flex-1 flex-col gap-3 p-6">
                  {product.category ? <span className="eyebrow text-lime">{product.category}</span> : null}
                  <span className="font-display text-2xl uppercase leading-none tracking-tight text-paper">{product.name}</span>
                  {product.tagline ? <span className="text-sm leading-relaxed text-paper/70">{product.tagline}</span> : null}
                  {href ? (
                    <span className="mt-auto inline-flex items-center gap-2 pt-3 font-display text-xs uppercase tracking-[0.2em] text-lime">
                      <span className="transition-[letter-spacing] group-hover:tracking-[0.3em]">{item.link?.label || product.name}</span>
                      <span aria-hidden="true">{href && isExternal(href) ? "↗" : "→"}</span>
                    </span>
                  ) : null}
                </span>
              </>
            );

            const cardClass =
              "group flex h-full flex-col overflow-hidden rounded-2xl bg-ink text-paper no-underline ring-1 ring-paper/10 transition hover:ring-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime";

            return (
              <Reveal as="li" key={item._key} delay={index * 0.06} className="on-dark flex">
                {href ? (
                  isExternal(href) ? (
                    <a href={href} target="_blank" rel="noopener" className={cardClass}>
                      {cardBody}
                    </a>
                  ) : (
                    <Link href={href} className={cardClass}>
                      {cardBody}
                    </Link>
                  )
                ) : (
                  <article className={cardClass}>{cardBody}</article>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
