import { defineField, type FieldsetDefinition } from "sanity";

/**
 * Optional phone versions of a block's image / video. Every one is additive:
 * left empty, the desktop asset shows on every screen, so live pages do not
 * shift when the fields appear. The site swaps below 768 px (see
 * `lib/mobile-media.ts`).
 *
 * The fields sit in one collapsed fieldset per block; a block declares it with
 * `mobileFieldset()` and its fields pass the same name.
 */
export function mobileFieldset(name = "mobile", title = "Mobile version"): FieldsetDefinition {
  return {
    name,
    title,
    description: "Optional. Shown on phones (below 768 px) instead of the desktop version — e.g. a portrait crop or a lighter film. Leave empty to use the desktop version everywhere.",
    options: { collapsible: true, collapsed: true },
  };
}

type Hidden = (context: { parent?: Record<string, unknown> }) => boolean;

export function mobileImageField(name: string, title: string, options: { fieldset?: string; hidden?: Hidden; description?: string } = {}) {
  return defineField({
    name,
    title,
    type: "image",
    fieldset: options.fieldset ?? "mobile",
    options: { hotspot: true },
    description: options.description ?? "Its own crop and hotspot for phones. Uses the same alternative text.",
    hidden: options.hidden,
  });
}

export function mobileVideoField(name: string, title: string, options: { fieldset?: string; hidden?: Hidden; description?: string } = {}) {
  return defineField({
    name,
    title,
    type: "file",
    fieldset: options.fieldset ?? "mobile",
    options: { accept: "video/mp4,video/webm,video/quicktime" },
    description: options.description ?? "Played on phones instead — e.g. a portrait 9:16 cut or a smaller file. MP4 (H.264) plays everywhere.",
    hidden: options.hidden,
  });
}
