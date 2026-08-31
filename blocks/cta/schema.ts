import { defineField, defineType } from "sanity";
import { backgroundField } from "@/blocks/background-field";

export const schema = defineType({
  name: "ctaBlock",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
    defineField({ name: "primaryCta", title: "Primary CTA", type: "linkField", validation: (Rule) => Rule.required() }),
    defineField({ name: "secondaryCta", title: "Secondary CTA", type: "linkField" }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      initialValue: "lime",
      options: { list: [{ title: "Lime", value: "lime" }, { title: "Ink (dark)", value: "ink" }, { title: "Paper", value: "paper" }], layout: "radio" },
    }),
    backgroundField(),
  ],
  preview: {
    select: { headline: "headline", eyebrow: "eyebrow" },
    prepare: ({ headline, eyebrow }) => ({ title: "Call to action", subtitle: headline || eyebrow || "No headline yet" }),
  },
});
