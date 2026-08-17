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
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" className="text-fg">
      <path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" className="text-fg-muted">
      <path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" className="text-fg-muted">
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
  return <span className="body num text-fg">{value}</span>;
}

/* ------------------------------------------------------------------ */
/* Column header                                                       */
/* ------------------------------------------------------------------ */

function ColumnHeader({ column, highlight }: { column: Column; highlight: boolean }) {
  const product = column.product;
  const showProductName = product?.name && stegaClean(product.name) !== stegaClean(column.title);
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {product?.image?.asset ? (
        <span className="media relative mx-auto block aspect-square w-40 bg-transparent">
          <SanityImage image={product.image} alt={product.imageAlt ?? product.name ?? column.title ?? ""} fill sizes="160px" className="object-contain" />
        </span>
      ) : null}
      <div className="flex flex-col items-center gap-1">
        <h4 className="text-balance">{column.title}</h4>
        {(column.subtitle || highlight) && (
          <p className="body-sm text-fg-muted">
            {column.subtitle}
            {highlight && (column.subtitle ? " · Recommended" : "Recommended")}
          </p>
        )}
        {showProductName && <p className="body-sm text-fg-muted">{product.name}</p>}
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
    <section className="canvas-white section-space page-gutter">
      <div className="container-site">
        {(block.headline || block.intro) && <SectionHeader headline={block.headline} intro={block.intro} className="mb-12 md:mb-16" />}

        {/* Scroll container: horizontal scroll on narrow screens, natural width on ≥md */}
        <div
          className="relative -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] pb-2 md:mx-0 md:px-0 [scrollbar-width:thin]"
          tabIndex={0}
          role="region"
          aria-labelledby={captionId}
        >
          <table className="w-full min-w-[40rem] border-separate border-spacing-0">
            <caption id={captionId} className="sr-only">
              {block.headline ?? "Comparison table"}
            </caption>

            <thead>
              <tr className="align-bottom">
                <th scope="col" className="hairline sticky left-0 z-10 min-w-[10rem] border-b bg-canvas px-4 pb-6 pt-2 text-left md:min-w-[14rem] md:px-5">
                  <span className="sr-only">{block.rowHeader ?? "Feature"}</span>
                </th>
                {columns.map((col) => {
                  const highlight = Boolean(col.highlight);
                  return (
                    <th key={col._key} scope="col" className="hairline min-w-[11rem] border-b px-4 pb-6 pt-2 align-bottom font-normal md:px-5">
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
                      className={`hairline body-sm sticky left-0 z-10 bg-canvas px-4 py-4 text-left align-top font-normal text-fg-muted md:px-5 ${
                        last ? "" : "border-b"
                      }`}
                    >
                      <span className="block">{row.label}</span>
                      {row.hint && <span className="caption mt-1 block">{row.hint}</span>}
                    </th>
                    {columns.map((col, ci) => (
                      <td key={col._key} className={`hairline px-4 py-4 text-center align-top md:px-5 ${last ? "" : "border-b"}`}>
                        <CellValue value={row.cells?.[ci]} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>

            {hasCta && (
              <tfoot>
                <tr>
                  <td className="sticky left-0 z-10 bg-canvas px-4 py-6 md:px-5" aria-hidden="true" />
                  {columns.map((col) => (
                    <td key={col._key} className="px-4 py-6 text-center align-top md:px-5">
                      <ActionLink link={col.cta} variant="text" />
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {block.footnote && <p className="caption mx-auto mt-8 max-w-[68ch] text-center">{block.footnote}</p>}
      </div>
    </section>
  );
}
