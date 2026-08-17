import { defineArrayMember, defineField, defineType } from "sanity";

export const schema = defineType({
  name: "galleryBlock",
  title: "Gallery",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "images", title: "Images", type: "array", of: [defineArrayMember({ type: "captionedImage" })], validation: (Rule) => Rule.min(1) }),
  ],
  preview: {
    select: { headline: "headline", eyebrow: "eyebrow" },
    prepare: ({ headline, eyebrow }) => ({ title: "Gallery", subtitle: headline || eyebrow || "No headline yet" }),
  },
});
