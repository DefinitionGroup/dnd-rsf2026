import { defineArrayMember, defineField, defineType } from "sanity";

/** Scroll-driven feature tour: pinned media, steps animate in as you scroll. */
export const schema = defineType({
  name: "featureTourBlock",
  title: "Feature tour (scroll)",
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
          name: "featureTourStep",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
            defineField({ name: "image", title: "Image for this step", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() }),
            defineField({ name: "imageAlt", title: "Image alt", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "stat", title: "Stat (optional)", type: "string", description: "e.g. 150 W" }),
            defineField({ name: "statLabel", title: "Stat label", type: "string" }),
          ],
          preview: { select: { title: "title", media: "image" } },
        }),
      ],
      validation: (Rule) => Rule.min(2),
    }),
    defineField({ name: "tone", title: "Tone", type: "string", initialValue: "ink", options: { list: [{ title: "Ink (dark)", value: "ink" }, { title: "Paper", value: "paper" }], layout: "radio" } }),
  ],
  preview: {
    select: { headline: "headline", media: "steps.0.image" },
    prepare: ({ headline, media }) => ({ title: "Feature tour", subtitle: headline || "Scroll-driven tour", media }),
  },
});
