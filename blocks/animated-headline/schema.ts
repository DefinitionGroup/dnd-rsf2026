import { defineField, defineType } from "sanity";

export const schema = defineType({
  name: "animatedHeadlineBlock",
  title: "Animated headline",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({
      name: "level",
      title: "Heading level",
      type: "string",
      initialValue: "h2",
      description: "Use H1 only when this is the main page heading.",
      options: { list: [{ title: "H1 — page heading", value: "h1" }, { title: "H2 — section heading", value: "h2" }], layout: "radio" },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { headline: "headline" },
    prepare: ({ headline }) => ({ title: "Animated headline", subtitle: headline || "No headline yet" }),
  },
});
