import { defineArrayMember, defineField, defineType } from "sanity";

/** FAQ accordion + product spec table. Specs come from the referenced product unless overridden. */
export const schema = defineType({
  name: "faqSpecBlock",
  title: "FAQ + specifications",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "product", title: "Product (for specs)", type: "reference", to: [{ type: "product" }] }),
    defineField({ name: "specsHeadline", title: "Specs headline", type: "string", initialValue: "Technical specifications" }),
    defineField({ name: "showSpecs", title: "Show spec table", type: "boolean", initialValue: true }),
    defineField({ name: "faqHeadline", title: "FAQ headline", type: "string", initialValue: "Frequently asked questions" }),
    defineField({
      name: "faqs",
      title: "Questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "answer", title: "Answer", type: "richText", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
    defineField({ name: "downloads", title: "Downloads (manuals, datasheets)", type: "array", of: [defineArrayMember({ type: "linkField" })] }),
  ],
  preview: {
    select: { headline: "headline" },
    prepare: ({ headline }) => ({ title: "FAQ + specs", subtitle: headline || "Questions & specifications" }),
  },
});
