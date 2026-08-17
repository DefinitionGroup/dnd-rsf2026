import { defineArrayMember, defineField, defineType } from "sanity";

export const linkField = defineType({
  name: "linkField",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "href",
      title: "URL or path",
      type: "string",
      description: "Internal path (/en/spektrum-150), anchor (#specs) or full URL (legacy site, dealer locator).",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const metadata = defineType({
  name: "metadata",
  title: "Metadata",
  type: "object",
  fields: [
    defineField({ name: "title", title: "SEO title", type: "string" }),
    defineField({ name: "description", title: "SEO description", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Social image", type: "image", options: { hotspot: true } }),
  ],
});

export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({ name: "href", title: "URL or path", type: "string", validation: (Rule) => Rule.required() }),
            ],
          },
        ],
      },
    }),
  ],
});

/** Image + alt + optional caption, reused by gallery / viewer / before-after */
export const captionedImage = defineType({
  name: "captionedImage",
  title: "Image",
  type: "object",
  fields: [
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: "alt", title: "Alt text", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
  preview: { select: { title: "alt", subtitle: "caption", media: "image" } },
});

/** One product specification row (label is localized, value/unit shared) */
export const specRow = defineType({
  name: "specRow",
  title: "Specification",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "internationalizedArrayString", validation: (Rule) => Rule.required() }),
    defineField({ name: "value", title: "Value", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "unit", title: "Unit", type: "string" }),
  ],
  preview: {
    select: { label: "label", value: "value", unit: "unit" },
    prepare: ({ label, value, unit }) => ({
      title: label?.find?.((l: { language?: string }) => l.language === "en")?.value ?? label?.[0]?.value ?? "Spec",
      subtitle: [value, unit].filter(Boolean).join(" "),
    }),
  },
});

export const objectTypes = [linkField, metadata, richText, captionedImage, specRow];
