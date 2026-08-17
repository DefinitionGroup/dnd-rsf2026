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
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" className="text-ink">
      <path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" className="text-ink">
      <path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" className="text-muted">
      <path d="M6 10h8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
      <span className="inline-flex items-center justify-center">
        <DashIcon />
        <span className="sr-only">Not applicable</span>
      </span>
    );
  }
  return <span className="num text-text">{value}</span>;
}

/* ------------------------------------------------------------------ */
/* Column header                                                       */
/* ------------------------------------------------------------------ */

function ColumnHeader({ column, highlight }: { column: Column; highlight: boolean }) {
  const product = column.product;
  const showProductName = product?.name && stegaClean(product.name) !== stegaClean(column.title);
  return (
    <div className="flex flex-col items-start gap-4">
      {product?.image?.asset ? (
        <span className="media relative block size-24">
          <SanityImage image={product.image} alt={product.imageAlt ?? product.name ?? column.title ?? ""} fill sizes="96px" className="object-cover" />
        </span>
      ) : null}
      <div className="flex min-h-7 flex-col gap-1">
        {highlight && (
          <span className="mb-1 inline-flex w-fit items-center rounded-full bg-lime px-2.5 py-0.5 text-xs font-medium text-ink">Recommended</span>
        )}
        <p className="text-xl font-semibold leading-tight text-ink">{column.title}</p>
        {column.subtitle && <p className="label">{column.subtitle}</p>}
        {showProductName && <p className="label">{product.name}</p>}
      </div>
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
        {(block.headline || block.intro) && <SectionHeader headline={block.headline} intro={block.intro} className="mb-12 md:mb-16" />}
      </div>

      <div className="container-wide">
        {/* Scroll container: horizontal scroll on narrow screens, natural width on ≥md */}
        <div
          className="relative -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] pb-2 md:mx-0 md:px-0 [scrollbar-width:thin]"
          tabIndex={0}
          role="region"
          aria-labelledby={captionId}
        >
          <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-left text-[0.95rem] md:text-base">
            <caption id={captionId} className="sr-only">
              {block.headline ?? "Comparison table"}
            </caption>

            <thead>
              <tr className="align-bottom">
                <th
                  scope="col"
                  className="hairline label sticky left-0 z-10 min-w-[10rem] border-b bg-paper px-4 pb-5 pt-6 text-left md:min-w-[14rem] md:px-5"
                >
                  <span className="sr-only">{block.rowHeader ?? "Feature"}</span>
                </th>
                {columns.map((col) => {
                  const highlight = Boolean(col.highlight);
                  return (
                    <th
                      key={col._key}
                      scope="col"
                      className={`hairline min-w-[11rem] border-b px-4 pb-5 pt-6 align-bottom font-normal md:px-5 ${
                        highlight ? "bg-sand" : ""
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
                  <tr key={row._key}>
                    <th
                      scope="row"
                      className={`hairline sticky left-0 z-10 bg-paper px-4 py-4 text-left align-top font-medium text-ink shadow-[inset_-1px_0_0_var(--color-line)] md:px-5 md:shadow-none ${
                        last ? "" : "border-b"
                      }`}
                    >
                      <span className="block">{row.label}</span>
                      {row.hint && <span className="caption mt-1 block font-normal leading-snug">{row.hint}</span>}
                    </th>
                    {columns.map((col, ci) => {
                      const highlight = Boolean(col.highlight);
                      return (
                        <td
                          key={col._key}
                          className={`hairline px-4 py-4 align-top md:px-5 ${highlight ? "bg-sand" : ""} ${last ? "" : "border-b"}`}
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
                      <td key={col._key} className={`px-4 py-5 align-top md:px-5 ${highlight ? "bg-sand" : ""}`}>
                        <ActionLink link={col.cta} variant="text" />
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {block.footnote && (
        <div className="container-site">
          <p className="caption mt-8 max-w-[68ch]">{block.footnote}</p>
        </div>
      )}
    </section>
  );
}
