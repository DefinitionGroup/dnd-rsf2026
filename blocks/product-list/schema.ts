import { defineArrayMember, defineField, defineType } from "sanity";

export const schema = defineType({
  name: "productListBlock",
  title: "Product list",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
    defineField({
      name: "items",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "productListItem",
          fields: [
            defineField({ name: "product", title: "Product", type: "reference", to: [{ type: "product" }], validation: (Rule) => Rule.required() }),
            defineField({ name: "link", title: "Link target", type: "linkField", description: "Where the card links to: a landing page (/en/spektrum-150), an anchor, or the product page on the main site. Falls back to the product's legacy URL." }),
          ],
          preview: { select: { title: "product.name.0.value", media: "product.image" } },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { headline: "headline", eyebrow: "eyebrow" },
    prepare: ({ headline, eyebrow }) => ({ title: "Product list", subtitle: headline || eyebrow || "No headline yet" }),
  },
});
