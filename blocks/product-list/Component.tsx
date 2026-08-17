import Link from "next/link";
import { stegaClean } from "next-sanity";
import Reveal from "@/components/motion/Reveal";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import type { BlockProps } from "@/blocks/types";

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" width="11" height="11" className="shrink-0">
      <path d="M4.5 2.5 8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Apple product grid: white `.tile`s on a frost canvas; product cut-out in a
 * square white `.media` (object-contain), name 21/600, tagline 14px ash and a
 * ghost "Learn more ›" link. Whole tile clickable; hover only underlines the link.
 */
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
    <section className="canvas-frost section-space page-gutter">
      <div className="container-site">
        <SectionHeader headline={block.headline} intro={block.intro} />

        <ul className={`grid gap-4 ${block.headline || block.intro ? "mt-12 md:mt-16" : ""} ${cols}`} role="list">
          {items.map((item, index) => {
            const product = item.product;
            const href = stegaClean(item.link?.href) || product.legacyUrl || null;
            const cardBody = (
              <>
                <span className="media relative block aspect-square">
                  {product.image?.asset ? (
                    <SanityImage
                      image={product.image}
                      alt={product.imageAlt ?? product.name ?? ""}
                      fill
                      sizes={sizes}
                      className="object-contain"
                    />
                  ) : null}
                </span>
                <span className="flex flex-1 flex-col pt-3">
                  <h4 className="text-fg">{product.name}</h4>
                  {product.tagline ? <span className="body-sm mt-1 block text-fg-muted">{product.tagline}</span> : null}
                  {href ? (
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-lime-deep group-hover:underline">
                      <span>{item.link?.label || "Learn more"}</span>
                      <Chevron />
                    </span>
                  ) : null}
                </span>
              </>
            );

            const cardClass = "tile group flex h-full w-full flex-col no-underline";

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
