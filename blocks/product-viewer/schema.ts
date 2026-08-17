import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * 360° / zoom product viewer. v1: an ordered image sequence (drag/scroll to
 * rotate) with pinch/wheel zoom. With a single frame it degrades to zoom-only.
 * (Ticket 07 may refine: frame count, 3D/GLB variant, hotspots.)
 */
export const schema = defineType({
  name: "productViewerBlock",
  title: "360° / zoom viewer",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 2 }),
    defineField({ name: "product", title: "Product", type: "reference", to: [{ type: "product" }], description: "Optional; frames below override the product gallery." }),
    defineField({
      name: "frames",
      title: "Frames (in rotation order)",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: false } })],
      description: "12–36 evenly spaced frames for a smooth spin. One frame = zoom-only viewer.",
      options: { layout: "grid" },
    }),
    defineField({ name: "alt", title: "Alt text", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "hint", title: "Interaction hint", type: "string", initialValue: "Drag to rotate · scroll to zoom" }),
    defineField({ name: "autoRotate", title: "Auto-rotate until interaction", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { headline: "headline", media: "frames.0" },
    prepare: ({ headline, media }) => ({ title: "360° / zoom viewer", subtitle: headline || "Product viewer", media }),
  },
});
