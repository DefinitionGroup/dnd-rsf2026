import { defineField, defineType } from "sanity";
import { backgroundField } from "@/blocks/background-field";

/** Video: uploaded file (autoplay/loop capable) or external YouTube/Vimeo (privacy click-to-load). */
export const schema = defineType({
  name: "videoBlock",
  title: "Video",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 2 }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      initialValue: "file",
      options: { list: [{ title: "Uploaded file", value: "file" }, { title: "External URL (YouTube / Vimeo)", value: "external" }], layout: "radio" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "file", title: "Video file", type: "file", options: { accept: "video/mp4,video/webm,video/quicktime" }, hidden: ({ parent }) => parent?.source === "external" }),
    defineField({ name: "url", title: "Video URL", type: "url", description: "YouTube or Vimeo watch/share URL", hidden: ({ parent }) => parent?.source !== "external" }),
    defineField({ name: "poster", title: "Poster image", type: "image", options: { hotspot: true }, description: "Shown before play (required for external videos: nothing loads from YouTube until the visitor clicks)." }),
    defineField({ name: "alt", title: "Alt / description", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "layout", title: "Layout", type: "string", initialValue: "contained", options: { list: [{ title: "Contained (16:9 card)", value: "contained" }, { title: "Full-bleed", value: "bleed" }], layout: "radio" } }),
    defineField({ name: "autoplay", title: "Autoplay muted loop (uploaded files only)", type: "boolean", initialValue: false }),
    defineField({ name: "privacyNotice", title: "Privacy notice (external)", type: "string", initialValue: "The video is loaded from YouTube/Vimeo only after you click play." }),
    backgroundField(),
  ],
  preview: {
    select: { headline: "headline", media: "poster", source: "source" },
    prepare: ({ headline, media, source }) => ({ title: "Video", subtitle: headline || (source === "external" ? "External video" : "Uploaded video"), media }),
  },
});
