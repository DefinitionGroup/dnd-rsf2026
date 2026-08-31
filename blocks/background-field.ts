import { defineField } from "sanity";

/**
 * Shared "Background" control. Kept apart from `lib/section-background.ts` on
 * purpose: this half imports `sanity` (Studio-only), the resolver half is
 * imported by rendered components and must stay out of the site bundle.
 *
 * Leaving it empty keeps the block on its designed canvas, so the field is
 * additive — existing pages do not shift when it appears.
 */
export function backgroundField() {
  return defineField({
    name: "background",
    title: "Background",
    type: "string",
    description: "Leave empty to keep this block's default canvas.",
    options: {
      list: [
        { title: "Black", value: "black" },
        { title: "Grey", value: "gray" },
      ],
      layout: "radio",
    },
  });
}

/**
 * Optional still / film behind a section, plus the scrim strength. Grouped so the
 * blocks that offer a backdrop all expose the same three controls.
 */
export function backgroundMediaFields() {
  return [
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "image",
      options: { hotspot: true },
      description: "Sits behind the copy under a scrim. Also the still frame for a background video.",
    }),
    defineField({
      name: "backgroundVideo",
      title: "Background video",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
      description: "Muted and looping. Plays over the background image; visitors who prefer reduced motion keep the still.",
    }),
    defineField({
      name: "backgroundMuted",
      title: "Background muting (%)",
      type: "number",
      initialValue: 60,
      description: "How far the scrim dims the media. Lower lets the image or video pop; 0 removes the scrim entirely. Raise it if the copy is hard to read.",
      validation: (Rule) => Rule.min(0).max(100),
      hidden: ({ parent }) => !parent?.backgroundImage && !parent?.backgroundVideo,
    }),
  ];
}
