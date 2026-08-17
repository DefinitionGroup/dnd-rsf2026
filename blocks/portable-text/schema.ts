import { defineField, defineType } from "sanity";

export const schema = defineType({
  name: "portableTextBlock",
  title: "Rich text",
  type: "object",
  fields: [defineField({ name: "body", title: "Text", type: "richText", validation: (Rule) => Rule.required() })],
  preview: {
    select: { text: "body.0.children.0.text" },
    prepare: ({ text }) => ({ title: "Rich text", subtitle: text || "No text yet" }),
  },
});
