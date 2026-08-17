import { defineField, defineType } from "sanity";

export const schema = defineType({
  name: "heroBlock",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "brand", title: "Brand signal", type: "string", description: "Small line above the headline, e.g. product family." }),
    defineField({ name: "headline", title: "Headline", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({ name: "summary", title: "Supporting sentence", type: "text", rows: 3 }),
    defineField({
      name: "image",
      title: "Fallback / poster image",
      type: "image",
      description: "Hero background when no video is selected; also the video poster and reduced-motion fallback.",
      options: { hotspot: true },
      validation: (Rule) =>
        Rule.custom((image, context) => {
          const parent = context.parent as { video?: unknown } | undefined;
          return image || parent?.video ? true : "Add an image or a background video.";
        }),
    }),
    defineField({
      name: "video",
      title: "Background video",
      type: "file",
      description: "Optional full-bleed video. MP4 or WebM; muted, looping, inline.",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
    }),
    defineField({ name: "imageAlt", title: "Media alternative text", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "primaryCta", title: "Primary CTA", type: "linkField" }),
    defineField({ name: "secondaryCta", title: "Secondary CTA", type: "linkField" }),
  ],
  preview: {
    select: { headline: "headline", media: "image" },
    prepare: ({ headline, media }) => ({ title: "Hero", subtitle: headline || "No headline yet", media }),
  },
});
