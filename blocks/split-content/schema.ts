import { defineField, defineType } from "sanity";

export const schema = defineType({
  name: "splitContentBlock",
  title: "Split content",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "Body", type: "richText" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: "imageAlt", title: "Image alt text", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "reverse", title: "Place image first", type: "boolean", initialValue: false }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      initialValue: "paper",
      options: { list: [{ title: "Paper (white)", value: "paper" }, { title: "Sand (light grey)", value: "sand" }, { title: "Ink (dark)", value: "ink" }], layout: "radio" },
    }),
    defineField({ name: "cta", title: "Optional CTA", type: "linkField" }),
  ],
  preview: {
    select: { headline: "headline", eyebrow: "eyebrow", media: "image" },
    prepare: ({ headline, eyebrow, media }) => ({ title: "Split content", subtitle: headline || eyebrow || "No headline yet", media }),
  },
});
