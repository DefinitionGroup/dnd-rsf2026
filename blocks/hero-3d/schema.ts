import { defineField, defineType } from "sanity";

export const schema = defineType({
  name: "hero3dBlock",
  title: "Hero — 3D assembly",
  type: "object",
  description: "Scroll-pinned hero: the product model assembles from an exploded view as the visitor scrolls.",
  fields: [
    defineField({ name: "brand", title: "Brand signal", type: "string", description: "Small line above the headline, e.g. product family." }),
    defineField({ name: "headline", title: "Headline", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({ name: "summary", title: "Supporting sentence", type: "text", rows: 3 }),
    defineField({
      name: "model",
      title: "3D model (.glb)",
      type: "file",
      description: "Optional override. Compressed glTF binary (meshopt). Defaults to the bundled ClariSea model.",
      options: { accept: ".glb,model/gltf-binary" },
    }),
    defineField({
      name: "modelAlt",
      title: "Model alternative text",
      type: "string",
      description: "Describes the 3D scene for assistive technology.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "primaryCta", title: "Primary CTA", type: "linkField" }),
    defineField({ name: "secondaryCta", title: "Secondary CTA", type: "linkField" }),
  ],
  preview: {
    select: { headline: "headline" },
    prepare: ({ headline }) => ({ title: "Hero — 3D assembly", subtitle: headline || "No headline yet" }),
  },
});
