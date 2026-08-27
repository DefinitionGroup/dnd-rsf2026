import { defineArrayMember, defineField, defineType } from "sanity";

/** Product spec table. Specs come from the referenced product. */
export const schema = defineType({
  name: "specsBlock",
  title: "Specifications",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string", initialValue: "Technical specifications" }),
    defineField({ name: "product", title: "Product (for specs)", type: "reference", to: [{ type: "product" }] }),
    defineField({ name: "downloads", title: "Downloads (manuals, datasheets)", type: "array", of: [defineArrayMember({ type: "linkField" })] }),
  ],
  preview: {
    select: { headline: "headline" },
    prepare: ({ headline }) => ({ title: "Specifications", subtitle: headline || "Spec table" }),
  },
});
