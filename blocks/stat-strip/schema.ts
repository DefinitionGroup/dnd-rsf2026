import { defineArrayMember, defineField, defineType } from "sanity";

export const schema = defineType({
  name: "statStripBlock",
  title: "Stat strip",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", description: "Numbers count up on scroll (e.g. 5000, 8–10, 40).", validation: (Rule) => Rule.required() }),
            defineField({ name: "prefix", title: "Prefix", type: "string" }),
            defineField({ name: "suffix", title: "Suffix / unit", type: "string", description: "e.g. l/h, m, weeks" }),
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (Rule) => Rule.min(2).max(6),
    }),
    defineField({ name: "tone", title: "Tone", type: "string", initialValue: "lime", options: { list: [{ title: "Lime", value: "lime" }, { title: "Ink (dark)", value: "ink" }, { title: "Paper", value: "paper" }], layout: "radio" } }),
  ],
  preview: { select: { headline: "headline" }, prepare: ({ headline }) => ({ title: "Stat strip", subtitle: headline || "Key numbers" }) },
});
