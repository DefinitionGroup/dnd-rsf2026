import Link from "next/link";
import { stegaClean } from "next-sanity";
import Reveal from "@/components/motion/Reveal";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import type { BlockProps } from "@/blocks/types";

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12" className="shrink-0">
      <path d="M4.5 2.5 8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Store-grid product tiles: square-ish media on sand, name, tagline, text link. */
export default function ProductListBlock({ block }: BlockProps<"productListBlock">) {
  const items = (block.items ?? []).filter((item) => item.product);
  if (items.length === 0) return null;

  const cols =
    items.length <= 2 ? "sm:grid-cols-2" : items.length === 3 || items.length === 6 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  const sizes =
    items.length <= 2
      ? "(max-width: 640px) 100vw, 50vw"
      : items.length === 3 || items.length === 6
        ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";

  return (
    <section className="section-space page-gutter bg-paper">
      <div className="container-site">
        <SectionHeader headline={block.headline} intro={block.intro} />

        <ul className={`mt-12 grid gap-x-6 gap-y-12 md:mt-16 ${cols}`} role="list">
          {items.map((item, index) => {
            const product = item.product;
            const href = stegaClean(item.link?.href) || product.legacyUrl || null;
            const cardBody = (
              <>
                <span className="media relative block aspect-[5/4]">
                  {product.image?.asset ? (
                    <SanityImage
                      image={product.image}
                      alt={product.imageAlt ?? product.name ?? ""}
                      fill
                      sizes={sizes}
                      className="object-cover transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
                    />
                  ) : null}
                </span>
                <span className="flex flex-1 flex-col pt-5">
                  <span className="text-xl font-semibold text-ink">{product.name}</span>
                  {product.tagline ? <span className="mt-1 text-muted">{product.tagline}</span> : null}
                  {href ? (
                    <span className="mt-4 inline-flex items-center gap-1 text-[0.95rem] font-medium text-lime-deep group-hover:underline">
                      <span>{item.link?.label || "Learn more"}</span>
                      <Chevron />
                    </span>
                  ) : null}
                </span>
              </>
            );

            const cardClass = "group flex h-full flex-col no-underline";

            return (
              <Reveal as="li" key={item._key} delay={(index % 4) * 60} className="flex">
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
