import { defineArrayMember, defineField, defineType } from "sanity";

export const schema = defineType({
  name: "testimonialBlock",
  title: "Testimonials",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "testimonial" }] })],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { headline: "headline", eyebrow: "eyebrow" },
    prepare: ({ headline, eyebrow }) => ({ title: "Testimonials", subtitle: headline || eyebrow || "Referenced testimonials" }),
  },
});
