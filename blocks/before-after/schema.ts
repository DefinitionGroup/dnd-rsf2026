import { defineField, defineType } from "sanity";

export const schema = defineType({
  name: "beforeAfterBlock",
  title: "Before / after slider",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 2 }),
    defineField({ name: "before", title: "Before image", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: "beforeLabel", title: "Before label", type: "string", initialValue: "Before" }),
    defineField({ name: "after", title: "After image", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: "afterLabel", title: "After label", type: "string", initialValue: "After" }),
    defineField({ name: "alt", title: "Alt text (describes the comparison)", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "startPosition", title: "Initial handle position (%)", type: "number", initialValue: 50, validation: (Rule) => Rule.min(0).max(100) }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
  preview: {
    select: { headline: "headline", media: "after" },
    prepare: ({ headline, media }) => ({ title: "Before / after", subtitle: headline || "Comparison slider", media }),
  },
});
