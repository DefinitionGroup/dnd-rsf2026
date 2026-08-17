import { defineField, defineType } from "sanity";

export const schema = defineType({
  name: "introBlock",
  title: "Editorial intro",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "Body", type: "richText" }),
  ],
  preview: {
    select: { headline: "headline", eyebrow: "eyebrow" },
    prepare: ({ headline, eyebrow }) => ({ title: "Editorial intro", subtitle: headline || eyebrow || "No headline yet" }),
  },
});
