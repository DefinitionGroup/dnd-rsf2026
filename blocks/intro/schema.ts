import { defineField, defineType } from "sanity";
import { backgroundField, backgroundMediaFields } from "@/blocks/background-field";

export const schema = defineType({
  name: "introBlock",
  title: "Editorial intro",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({
      name: "wideHeadline",
      title: "Wide headline",
      type: "boolean",
      description: "Off: the headline wraps at a tight 24-character measure (Apple intro rhythm). On: it runs to 40 characters — for longer sentences that read better on fewer lines.",
      initialValue: false,
    }),
    defineField({ name: "body", title: "Body", type: "richText" }),
    backgroundField(),
    ...backgroundMediaFields(),
    defineField({
      name: "minHeight",
      title: "Minimum height",
      type: "string",
      initialValue: "none",
      description: "Give the section room to breathe — useful when it carries a background image or video. The copy centres in whatever height you pick.",
      options: {
        list: [
          { title: "Normal — as tall as the content", value: "none" },
          { title: "Half viewport (50vh)", value: "50" },
          { title: "Three-quarter viewport (75vh)", value: "75" },
          { title: "Full viewport (100vh)", value: "100" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: { headline: "headline", eyebrow: "eyebrow" },
    prepare: ({ headline, eyebrow }) => ({ title: "Editorial intro", subtitle: headline || eyebrow || "No headline yet" }),
  },
});
