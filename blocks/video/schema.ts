import { defineField, defineType } from "sanity";
import { backgroundField } from "@/blocks/background-field";

/**
 * Image / video: one image, optionally with a film — an uploaded file (autoplay/loop
 * capable) or external YouTube/Vimeo (privacy click-to-load). Without a video the
 * image stands on its own. The type stays `videoBlock` so existing content keeps working.
 */
export const schema = defineType({
  name: "videoBlock",
  title: "Image / video",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 2 }),
    defineField({
      name: "source",
      title: "Video source",
      type: "string",
      initialValue: "file",
      options: { list: [{ title: "Uploaded file", value: "file" }, { title: "External URL (YouTube / Vimeo)", value: "external" }], layout: "radio" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "file",
      title: "Video file",
      type: "file",
      description: "Optional — leave empty to show the image on its own.",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
      hidden: ({ parent }) => parent?.source === "external",
    }),
    defineField({ name: "url", title: "Video URL", type: "url", description: "Optional. YouTube or Vimeo watch/share URL", hidden: ({ parent }) => parent?.source !== "external" }),
    defineField({
      name: "poster",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "On its own when there is no video; otherwise the frame shown before play (needed for external videos: nothing loads from YouTube until the visitor clicks).",
      validation: (Rule) =>
        Rule.custom((image, context) => {
          const parent = context.parent as { source?: string; file?: { asset?: unknown }; url?: string } | undefined;
          const hasVideo = parent?.source === "external" ? Boolean(parent?.url) : Boolean(parent?.file?.asset);
          return image || hasVideo ? true : "Add an image or a video.";
        }),
    }),
    defineField({ name: "alt", title: "Alt / description", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({
      name: "layout",
      title: "Size",
      type: "string",
      initialValue: "contained",
      options: {
        list: [
          { title: "Full width — edge to edge", value: "bleed" },
          { title: "Container width", value: "contained" },
          { title: "Small — 880 px", value: "small" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "autoplay",
      title: "Autoplay muted loop (uploaded files only)",
      type: "boolean",
      initialValue: false,
      hidden: ({ parent }) => parent?.source === "external" || !parent?.file?.asset,
    }),
    defineField({ name: "privacyNotice", title: "Privacy notice (external)", type: "string", initialValue: "The video is loaded from YouTube/Vimeo only after you click play." }),
    backgroundField(),
  ],
  preview: {
    select: { headline: "headline", media: "poster", source: "source", file: "file.asset", url: "url" },
    prepare: ({ headline, media, source, file, url }) => ({
      title: "Image / video",
      subtitle: headline || (source === "external" && url ? "External video" : source !== "external" && file ? "Uploaded video" : "Image"),
      media,
    }),
  },
});
