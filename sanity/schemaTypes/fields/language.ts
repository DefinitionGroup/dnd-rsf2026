import { defineField } from "sanity";
import { LOCALES } from "@/lib/i18n";

/**
 * Language field required by @sanity/document-internationalization.
 * `options.list` makes TypeGen emit a literal union instead of `string`.
 */
export const languageField = defineField({
  name: "language",
  title: "Language",
  type: "string",
  readOnly: true,
  hidden: true,
  options: { list: LOCALES.map((l) => ({ title: l.title, value: l.id })) },
  validation: (Rule) => Rule.required(),
});
