import { defineField, defineType } from "sanity";

/** Cinematic film hero: full-viewport background video revealed through a staggered grid mask. */
export const schema = defineType({
  name: "cinematicHeroBlock",
  title: "Hero — cinematic film",
  type: "object",
  description:
    "Full-viewport film hero: the background video is revealed through a flickering grid mask, then headline, tagline and pills enter word by word.",
  fields: [
    defineField({ name: "brand", title: "Brand signal", type: "string", description: "Small pill above the headline, e.g. product family." }),
    defineField({ name: "headline", title: "Headline", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({ name: "summary", title: "Supporting sentence", type: "text", rows: 3 }),
    defineField({
      name: "video",
      title: "Background video",
      type: "file",
      description: "Short, loopable clip (muted). H.264 MP4 or WebM, ideally under 10 MB.",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      type: "image",
      options: { hotspot: true },
      description: "First frame stand-in — shown while the video loads and for visitors who prefer reduced motion.",
    }),
    defineField({
      name: "videoAlt",
      title: "Video description",
      type: "string",
      description: "Describes the footage for assistive technology.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shader",
      title: "WebGL film treatment",
      type: "boolean",
      initialValue: true,
      description:
        "Renders the video through a WebGL shader — fine film grain, a feathered edge into the black canvas and a touch of lens fringing. Turn off to play the plain video.",
    }),
    defineField({ name: "primaryCta", title: "Primary CTA", type: "linkField" }),
    defineField({ name: "secondaryCta", title: "Secondary CTA", type: "linkField" }),
  ],
  preview: {
    select: { headline: "headline", media: "poster" },
    prepare: ({ headline, media }) => ({ title: "Hero — cinematic film", subtitle: headline || "No headline yet", media }),
  },
});
