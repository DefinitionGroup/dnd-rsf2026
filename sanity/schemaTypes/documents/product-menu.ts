import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../fields/language";

/**
 * The "Products" flyout in the global nav: categories → groups → product lines.
 * One document per language (like `menu`), so links can point at localized
 * paths. Brands are shared documents; the own-brand flag drives the highlight
 * and the "D-D only" filter.
 */

export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "code",
      title: "Short label",
      type: "string",
      description: "Shown in the brand column of the Products menu, e.g. “AI” for AquaIllumination.",
      validation: (Rule) => Rule.required().max(10),
    }),
    defineField({
      name: "house",
      title: "Own brand",
      type: "boolean",
      description: "Own-brand product lines are highlighted in the Products menu and kept by its “only” filter.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", code: "code", house: "house" },
    prepare: ({ title, code, house }) => ({ title, subtitle: [code, house ? "Own brand" : null].filter(Boolean).join(" · ") }),
  },
});

export const productMenuItem = defineType({
  name: "productMenuItem",
  title: "Product line",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "brand", title: "Brand", type: "reference", to: [{ type: "brand" }], validation: (Rule) => Rule.required() }),
    defineField({
      name: "href",
      title: "URL or path",
      type: "string",
      description: "Landing page path (/en/fmr75) or the product page on theaquariumsolution.com. Leave empty to list it without a link.",
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      description: "Small pill after the name, e.g. “Ending” or “New”.",
      validation: (Rule) => Rule.max(14),
    }),
  ],
  preview: {
    select: { title: "name", brand: "brand.name", badge: "badge", href: "href" },
    prepare: ({ title, brand, badge, href }) => ({
      title,
      subtitle: [brand, badge, href ? null : "No link"].filter(Boolean).join(" · "),
    }),
  },
});

export const productMenuGroup = defineType({
  name: "productMenuGroup",
  title: "Group",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "items",
      title: "Product lines",
      type: "array",
      of: [defineArrayMember({ type: "productMenuItem" })],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "title", items: "items" },
    prepare: ({ title, items }) => ({ title, subtitle: lines(items?.length) }),
  },
});

export const productMenuCategory = defineType({
  name: "productMenuCategory",
  title: "Category",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "groups",
      title: "Groups",
      type: "array",
      description: "Columns inside the category, e.g. “Wave Pumps”. Shown in this order.",
      of: [defineArrayMember({ type: "productMenuGroup" })],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "title", groups: "groups" },
    prepare: ({ title, groups }) => ({
      title,
      subtitle: [groups?.length ? `${groups.length} ${groups.length === 1 ? "group" : "groups"}` : null, lines(countItems(groups))].filter(Boolean).join(" · "),
    }),
  },
});

export const productMenu = defineType({
  name: "productMenu",
  title: "Products menu",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "label",
      title: "Nav label",
      type: "string",
      description: "The global-nav entry that opens the menu.",
      initialValue: "Products",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      description: "The list down the left of the menu. The first one opens by default.",
      of: [defineArrayMember({ type: "productMenuCategory" })],
    }),
    defineField({ name: "allProductsLink", title: "Link under the categories", type: "linkField", description: "e.g. “All products”." }),
  ],
  preview: {
    select: { language: "language", label: "label" },
    prepare: ({ language, label }) => ({ title: `${language?.toUpperCase() || ""} ${label || "Products"} menu`.trim() }),
  },
});

function countItems(groups: { items?: unknown[] }[] | undefined) {
  return groups?.reduce((n, g) => n + (g.items?.length ?? 0), 0);
}

function lines(n: number | undefined) {
  return n ? `${n} product ${n === 1 ? "line" : "lines"}` : "Empty";
}

export const productMenuTypes = [brand, productMenuItem, productMenuGroup, productMenuCategory, productMenu];
