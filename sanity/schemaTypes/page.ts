import { defineArrayMember, defineField, defineType } from "sanity";
import { createElement } from "react";
import { apiVersion } from "@/sanity/env";
import { blockTypeNames } from "@/blocks/schemas";
import { languageField } from "./fields/language";

function HomepageIcon() {
  return createElement(
    "svg",
    { "aria-label": "Homepage", fill: "none", height: "1em", role: "img", viewBox: "0 0 25 25", width: "1em" },
    createElement("path", {
      d: "M14.5 18.5V12.5H10.5V18.5M5.5 11.5V18.5H19.5V11.5L12.5 5.5L5.5 11.5Z",
      stroke: "currentColor",
      strokeLinejoin: "round",
      strokeWidth: 1.2,
    }),
  );
}

export const page = defineType({
  name: "page",
  title: "Landing page",
  type: "document",
  groups: [
    { name: "basic", title: "Basic", default: true },
    { name: "content", title: "Content" },
    { name: "settings", title: "Settings" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "basic", validation: (Rule) => Rule.required() }),
    { ...languageField, group: "basic" },
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "basic",
      description: "Localized per language. Not copied when creating a translation — generate it from the translated title.",
      options: {
        source: "title",
        documentInternationalization: { exclude: true },
        isUnique: async (value, context) => {
          const document = context.document;
          const id = document?._id.replace(/^drafts\./, "");
          const client = context.getClient({ apiVersion });
          const count = await client.fetch<number>(
            `count(*[_type == "page" && language == $language && slug.current == $slug && !(_id in [$publishedId, $draftId])])`,
            { language: document?.language, slug: value, publishedId: id, draftId: `drafts.${id}` },
          );
          return count === 0;
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      group: "basic",
      description: "Optional: the product this landing page is about (used for JSON-LD and defaults).",
    }),
    defineField({
      name: "isHomepage",
      title: "Homepage",
      type: "boolean",
      group: "settings",
      initialValue: false,
      description: "One homepage per language.",
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value) return true;
          const document = context.document;
          const id = document?._id.replace(/^drafts\./, "");
          const client = context.getClient({ apiVersion });
          const count = await client.fetch<number>(
            `count(*[_type == "page" && language == $language && isHomepage == true && !(_id in [$publishedId, $draftId])])`,
            { language: document?.language, publishedId: id, draftId: `drafts.${id}` },
          );
          return count === 0 || "Another homepage already exists for this language.";
        }),
    }),
    defineField({
      name: "navbarVariant",
      title: "Navigation contrast",
      type: "string",
      group: "settings",
      initialValue: "light",
      options: { list: [{ title: "Light text (over dark hero)", value: "light" }, { title: "Dark text", value: "dark" }], layout: "radio" },
    }),
    defineField({ name: "metadata", title: "Metadata", type: "metadata", group: "seo" }),
    defineField({
      name: "content",
      title: "Page builder",
      type: "array",
      group: "content",
      of: blockTypeNames.map((type) => defineArrayMember({ type })),
      options: { insertMenu: { views: [{ name: "grid" }, { name: "list" }] } },
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "title", language: "language", homepage: "isHomepage", slug: "slug.current" },
    prepare: ({ title, language, homepage, slug }) => ({
      title,
      subtitle: `${language?.toUpperCase() || ""}${homepage ? " · Homepage" : slug ? ` · /${slug}` : ""}`,
      media: homepage ? HomepageIcon : undefined,
    }),
  },
});
