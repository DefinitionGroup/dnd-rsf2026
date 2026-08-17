import { defineArrayMember, defineField, defineType } from "sanity";

export const schema = defineType({
  name: "featureListBlock",
  title: "Feature list",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "featureItem",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 2 }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { headline: "headline", eyebrow: "eyebrow" },
    prepare: ({ headline, eyebrow }) => ({ title: "Feature list", subtitle: headline || eyebrow || "No headline yet" }),
  },
});
