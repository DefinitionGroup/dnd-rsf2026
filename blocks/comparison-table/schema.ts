import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Comparison table. v1: freeform columns + rows so it can compare products,
 * variants or competitors. (Ticket 09 may move columns to product references.)
 */
export const schema = defineType({
  name: "comparisonTableBlock",
  title: "Comparison table",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 2 }),
    defineField({ name: "rowHeader", title: "First column header", type: "string", initialValue: "Feature" }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "comparisonColumn",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
            defineField({ name: "product", title: "Product (optional)", type: "reference", to: [{ type: "product" }] }),
            defineField({ name: "highlight", title: "Highlight this column", type: "boolean", initialValue: false }),
            defineField({ name: "cta", title: "CTA", type: "linkField" }),
          ],
          preview: { select: { title: "title", subtitle: "subtitle" } },
        }),
      ],
      validation: (Rule) => Rule.min(2).max(4),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "comparisonRow",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "hint", title: "Hint / tooltip", type: "string" }),
            defineField({
              name: "cells",
              title: "Cells (one per column, in order)",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              description: "Use 'yes' / 'no' for check / cross icons, '—' for n/a, or any text.",
            }),
          ],
          preview: { select: { title: "label", cells: "cells" }, prepare: ({ title, cells }) => ({ title, subtitle: (cells ?? []).join(" · ") }) },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({ name: "footnote", title: "Footnote", type: "text", rows: 2 }),
  ],
  preview: {
    select: { headline: "headline" },
    prepare: ({ headline }) => ({ title: "Comparison table", subtitle: headline || "Compare" }),
  },
});
