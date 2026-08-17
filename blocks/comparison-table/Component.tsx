import { stegaClean } from "next-sanity";
import ActionLink from "@/components/ActionLink";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import type { BlockOf, BlockProps } from "@/blocks/types";

type Column = NonNullable<BlockOf<"comparisonTableBlock">["columns"]>[number];

/* ------------------------------------------------------------------ */
/* Cell rendering                                                      */
/* ------------------------------------------------------------------ */

const YES = new Set(["yes", "true", "✓", "✔"]);
const NO = new Set(["no", "false", "✗", "✕", "×"]);
const NA = new Set(["—", "-", "–", "n/a", "na", ""]);

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="9" className="fill-lime/20" />
      <path d="M5.5 10.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-deep" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true" focusable="false">
      <path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-muted/70" />
    </svg>
  );
}

function CellValue({ value }: { value: string | undefined }) {
  const clean = stegaClean(value ?? "").trim().toLowerCase();
  if (YES.has(clean)) {
    return (
      <span className="inline-flex items-center justify-center">
        <CheckIcon />
        <span className="sr-only">Yes</span>
      </span>
    );
  }
  if (NO.has(clean)) {
    return (
      <span className="inline-flex items-center justify-center">
        <CrossIcon />
        <span className="sr-only">No</span>
      </span>
    );
  }
  if (NA.has(clean)) {
    return (
      <span className="text-muted/60">
        <span aria-hidden="true">—</span>
        <span className="sr-only">Not applicable</span>
      </span>
    );
  }
  return <span className="text-text">{value}</span>;
}

/* ------------------------------------------------------------------ */
/* Column header                                                       */
/* ------------------------------------------------------------------ */

function ColumnHeader({ column, highlight }: { column: Column; highlight: boolean }) {
  const product = column.product;
  return (
    <div className="flex flex-col gap-3">
      {highlight && (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-lime px-2.5 py-1 font-display text-[0.65rem] uppercase tracking-[0.18em] text-ink">
          <span aria-hidden="true">★</span> Recommended
        </span>
      )}
      <div>
        <p className="font-display text-lg uppercase leading-tight tracking-tight text-ink md:text-xl">{column.title}</p>
        {column.subtitle && <p className="mt-1 text-sm font-normal normal-case tracking-normal text-muted">{column.subtitle}</p>}
      </div>
      {product && (product.image?.asset || product.name) && (
        <div className="flex items-center gap-3">
          {product.image?.asset && (
            <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-sand">
              <SanityImage image={product.image} alt={product.imageAlt ?? product.name ?? ""} fill sizes="48px" className="object-cover" />
            </span>
          )}
          {product.name && <span className="text-sm font-normal normal-case tracking-normal text-muted">{product.name}</span>}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Block                                                               */
/* ------------------------------------------------------------------ */

export default function ComparisonTableBlock({ block }: BlockProps<"comparisonTableBlock">) {
  const columns = block.columns ?? [];
  const rows = block.rows ?? [];
  if (columns.length === 0 || rows.length === 0) return null;

  const hasCta = columns.some((c) => c.cta?.href && c.cta?.label);
  const captionId = `comparison-${block._key}-caption`;

  return (
    <section className="section-space page-gutter bg-paper text-text">
      <div className="container-site">
        {(block.eyebrow || block.headline || block.intro) && (
          <SectionHeader eyebrow={block.eyebrow} headline={block.headline} intro={block.intro} className="mb-10 md:mb-14" />
        )}

        {/* Scroll container: horizontal scroll on narrow screens, natural width on ≥md */}
        <div
          className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] pb-2 md:mx-0 md:px-0 [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-lime"
          tabIndex={0}
          role="region"
          aria-labelledby={captionId}
        >
          <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-left text-sm md:text-base">
            <caption id={captionId} className="sr-only">
              {block.headline ?? "Comparison table"}
            </caption>

            <thead>
              <tr className="align-bottom">
                <th
                  scope="col"
                  className="sticky left-0 z-10 min-w-[10rem] border-b-2 border-ink bg-paper px-4 pb-4 pt-6 font-display text-xs uppercase tracking-[0.2em] text-muted md:min-w-[14rem] md:px-5"
                >
                  {block.rowHeader ?? "Feature"}
                </th>
                {columns.map((col) => {
                  const highlight = Boolean(col.highlight);
                  return (
                    <th
                      key={col._key}
                      scope="col"
                      className={`min-w-[10rem] px-4 pb-4 pt-6 align-bottom md:px-5 ${
                        highlight ? "rounded-t-2xl border-t-4 border-t-lime bg-sand border-b-2 border-b-ink" : "border-b-2 border-ink"
                      }`}
                    >
                      <ColumnHeader column={col} highlight={highlight} />
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, ri) => {
                const last = ri === rows.length - 1 && !hasCta;
                return (
                  <tr key={row._key} className="group">
                    <th
                      scope="row"
                      className={`sticky left-0 z-10 bg-paper px-4 py-4 text-left shadow-[inset_-1px_0_0_var(--color-line)] md:shadow-none align-top font-medium text-ink md:px-5 ${last ? "" : "border-b border-line"}`}
                    >
                      <span className="block">{row.label}</span>
                      {row.hint && <span className="mt-1 block text-xs font-normal leading-snug text-muted">{row.hint}</span>}
                    </th>
                    {columns.map((col, ci) => {
                      const highlight = Boolean(col.highlight);
                      return (
                        <td
                          key={col._key}
                          className={`px-4 py-4 align-top md:px-5 ${highlight ? "bg-sand" : ""} ${last ? "" : "border-b border-line"}`}
                        >
                          <CellValue value={row.cells?.[ci]} />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>

            {hasCta && (
              <tfoot>
                <tr>
                  <td className="sticky left-0 z-10 bg-paper px-4 py-5 md:px-5" aria-hidden="true" />
                  {columns.map((col) => {
                    const highlight = Boolean(col.highlight);
                    return (
                      <td key={col._key} className={`px-4 py-5 align-top md:px-5 ${highlight ? "rounded-b-2xl bg-sand" : ""}`}>
                        <ActionLink link={col.cta} variant={highlight ? "primary" : "secondary"} className="text-xs" />
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {block.footnote && <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">{block.footnote}</p>}
      </div>
    </section>
  );
}
