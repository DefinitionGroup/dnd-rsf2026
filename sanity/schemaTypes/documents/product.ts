import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Product = the "thing" landing pages are about. Field-level i18n
 * (internationalizedArray*) so gallery/specs/links are shared across locales.
 * Blocks reference products; queries coalesce name/tagline/body to the
 * requested locale with an `en` fallback.
 */
export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "specs", title: "Specs" },
    { name: "links", title: "Links" },
  ],
  fields: [
    defineField({ name: "name", title: "Name", type: "internationalizedArrayString", group: "content", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description: "Shared across locales (used for anchors and ids, not routing).",
      options: { source: (doc) => (doc.name as { value?: string }[] | undefined)?.[0]?.value ?? "" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "tagline", title: "Tagline", type: "internationalizedArrayString", group: "content" }),
    defineField({ name: "body", title: "Description", type: "internationalizedArrayRichText", group: "content" }),
    defineField({ name: "category", title: "Category", type: "string", group: "content", description: "e.g. Lighting, Pumps, Water chemistry" }),
    defineField({ name: "sku", title: "SKU / model", type: "string", group: "content" }),
    defineField({ name: "image", title: "Primary image", type: "image", group: "media", options: { hotspot: true } }),
    defineField({ name: "imageAlt", title: "Primary image alt", type: "string", group: "media" }),
    defineField({ name: "gallery", title: "Gallery", type: "array", group: "media", of: [defineArrayMember({ type: "captionedImage" })] }),
    defineField({ name: "specs", title: "Specifications", type: "array", group: "specs", of: [defineArrayMember({ type: "specRow" })] }),
    defineField({ name: "legacyUrl", title: "Product page on theaquariumsolution.com", type: "url", group: "links" }),
    defineField({ name: "manualUrl", title: "Manual / datasheet URL", type: "url", group: "links" }),
    defineField({ name: "videoUrl", title: "Video URL (YouTube etc.)", type: "url", group: "links" }),
  ],
  preview: {
    select: { name: "name", category: "category", media: "image" },
    prepare: ({ name, category, media }) => ({
      title: name?.find?.((n: { language?: string }) => n.language === "en")?.value ?? name?.[0]?.value ?? "Product",
      subtitle: category,
      media,
    }),
  },
});
