import { defineField, defineType } from "sanity";
import { backgroundField } from "@/blocks/background-field";

const HEIGHTS = [
  { title: "Auto", value: "auto" },
  { title: "25% of the screen", value: "25" },
  { title: "50% of the screen", value: "50" },
  { title: "66% of the screen", value: "66" },
  { title: "80% of the screen", value: "80" },
  { title: "Full screen (100%)", value: "100" },
];

/**
 * Media: one image or one uploaded video, centred on the page. Editors pick how it
 * fills its frame, how wide it may grow (separately for phone and desktop) and how
 * tall it sits in screen-height steps.
 */
export const schema = defineType({
  name: "mediaBlock",
  title: "Media",
  type: "object",
  fieldsets: [
    { name: "video", title: "Video playback", options: { columns: 2 } },
    { name: "size", title: "Size", description: "The media always sits centred.", options: { columns: 2 } },
  ],
  fields: [
    defineField({
      name: "mediaType",
      title: "Type",
      type: "string",
      initialValue: "image",
      options: { list: [{ title: "Image", value: "image" }, { title: "Video", value: "video" }], layout: "radio", direction: "horizontal" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "With 'Fill the frame', the hotspot decides what stays in view.",
      hidden: ({ parent }) => parent?.mediaType === "video",
      validation: (Rule) =>
        Rule.custom((image, context) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          return parent?.mediaType === "video" || image ? true : "Add an image.";
        }),
    }),
    defineField({
      name: "video",
      title: "Video file",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
      description: "MP4 (H.264) plays everywhere. Keep loops short and small.",
      hidden: ({ parent }) => parent?.mediaType !== "video",
      validation: (Rule) =>
        Rule.custom((video, context) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          return parent?.mediaType !== "video" || video ? true : "Add a video file.";
        }),
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      type: "image",
      description: "Shown before the video plays and to visitors who prefer reduced motion. Use a still from the video.",
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
    defineField({
      name: "autoplay",
      title: "Autoplay",
      type: "boolean",
      fieldset: "video",
      initialValue: true,
      description: "Plays muted while on screen, with a small pause button. Off: visitors press play and get sound and controls.",
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
    defineField({
      name: "loop",
      title: "Loop",
      type: "boolean",
      fieldset: "video",
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
    defineField({ name: "alt", title: "Alternative text", type: "string", description: "What the image or video shows, for screen readers.", validation: (Rule) => Rule.required() }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({
      name: "fit",
      title: "Fit",
      type: "string",
      initialValue: "natural",
      options: {
        list: [
          { title: "Original proportions — nothing cropped", value: "natural" },
          { title: "Fill the frame (cover) — edges may be cropped", value: "cover" },
          { title: "Fit inside the frame (contain) — nothing cropped, space may show", value: "contain" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aspectRatio",
      title: "Frame proportions",
      type: "string",
      initialValue: "16/9",
      description: "Shape of the frame wherever the height is set to Auto.",
      options: {
        list: [
          { title: "21:9 — cinema", value: "21/9" },
          { title: "16:9 — widescreen", value: "16/9" },
          { title: "3:2", value: "3/2" },
          { title: "4:3", value: "4/3" },
          { title: "1:1 — square", value: "1/1" },
          { title: "4:5 — portrait", value: "4/5" },
          { title: "9:16 — tall", value: "9/16" },
        ],
      },
      hidden: ({ parent }) => !parent?.fit || parent.fit === "natural",
    }),
    defineField({
      name: "maxWidth",
      title: "Max width — desktop",
      type: "string",
      fieldset: "size",
      initialValue: "1200",
      options: {
        list: [
          { title: "Small — 480 px", value: "480" },
          { title: "Narrow — 720 px", value: "720" },
          { title: "Text column — 980 px", value: "980" },
          { title: "Content — 1200 px", value: "1200" },
          { title: "Wide — 1440 px", value: "1440" },
          { title: "Edge to edge", value: "full" },
        ],
      },
    }),
    defineField({
      name: "maxWidthMobile",
      title: "Max width — mobile",
      type: "string",
      fieldset: "size",
      initialValue: "100",
      options: {
        list: [
          { title: "50%", value: "50" },
          { title: "66%", value: "66" },
          { title: "75%", value: "75" },
          { title: "90%", value: "90" },
          { title: "100% (inside the margins)", value: "100" },
          { title: "Edge to edge", value: "full" },
        ],
      },
    }),
    defineField({
      name: "height",
      title: "Height — desktop",
      type: "string",
      fieldset: "size",
      initialValue: "auto",
      description: "Original proportions: the most it may take. Fill / Fit: the frame's height.",
      options: { list: HEIGHTS },
    }),
    defineField({
      name: "heightMobile",
      title: "Height — mobile",
      type: "string",
      fieldset: "size",
      initialValue: "same",
      options: { list: [{ title: "Same as desktop", value: "same" }, ...HEIGHTS] },
    }),
    defineField({
      name: "spacing",
      title: "Spacing above and below",
      type: "string",
      initialValue: "default",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Small", value: "small" },
          { title: "None — sits flush against its neighbours", value: "none" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    backgroundField(),
  ],
  preview: {
    select: { mediaType: "mediaType", image: "image", poster: "poster", alt: "alt", caption: "caption" },
    prepare: ({ mediaType, image, poster, alt, caption }) => ({
      title: mediaType === "video" ? "Media — video" : "Media — image",
      subtitle: caption || alt || "No media yet",
      media: mediaType === "video" ? poster : image,
    }),
  },
});
