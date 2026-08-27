import { defineArrayMember, defineField, defineType } from "sanity";

/** FAQ accordion. */
export const schema = defineType({
  name: "faqBlock",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string", initialValue: "Frequently asked questions" }),
    defineField({
      name: "faqs",
      title: "Questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "answer", title: "Answer", type: "richText", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { headline: "headline" },
    prepare: ({ headline }) => ({ title: "FAQ", subtitle: headline || "Questions" }),
  },
});
