import { defineArrayMember, defineField, defineType } from "sanity";

/** Animated stepper: auto-advancing timeline of steps with image + copy; click to jump. */
export const schema = defineType({
  name: "howItWorksBlock",
  title: "How it works (stepper)",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 2 }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "howItWorksStep",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
            defineField({ name: "imageAlt", title: "Image alt", type: "string" }),
            defineField({ name: "durationSeconds", title: "Auto-advance after (s)", type: "number", initialValue: 6 }),
          ],
          preview: { select: { title: "title", media: "image" } },
        }),
      ],
      validation: (Rule) => Rule.min(2),
    }),
    defineField({ name: "autoplay", title: "Auto-advance", type: "boolean", initialValue: true }),
    defineField({ name: "tone", title: "Tone", type: "string", initialValue: "paper", options: { list: [{ title: "Paper", value: "paper" }, { title: "Ink (dark)", value: "ink" }], layout: "radio" } }),
  ],
  preview: {
    select: { headline: "headline", media: "steps.0.image" },
    prepare: ({ headline, media }) => ({ title: "How it works", subtitle: headline || "Stepper", media }),
  },
});
