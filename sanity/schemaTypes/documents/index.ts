import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../fields/language";
import { product } from "./product";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    languageField,
    defineField({ name: "quote", title: "Quote", type: "text", rows: 5, validation: (Rule) => Rule.required() }),
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "company", title: "Company / shop / tank", type: "string" }),
    defineField({ name: "approved", title: "Approved for publication", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", subtitle: "company", language: "language" }, prepare: ({ title, subtitle, language }) => ({ title, subtitle: [language?.toUpperCase(), subtitle].filter(Boolean).join(" · ") }) },
});

export const menu = defineType({
  name: "menu",
  title: "Navigation",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [defineArrayMember({ type: "linkField" })],
    }),
    defineField({ name: "cta", title: "Primary CTA", type: "linkField" }),
    defineField({ name: "footerLinks", title: "Footer links", type: "array", of: [defineArrayMember({ type: "linkField" })] }),
  ],
  preview: { select: { language: "language" }, prepare: ({ language }) => ({ title: `${language?.toUpperCase() || ""} navigation` }) },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "brandName", title: "Brand name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "internationalizedArrayText" }),
    defineField({ name: "email", title: "Contact email(s)", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "phone", title: "Phone number(s)", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "legacySiteUrl", title: "Main website URL", type: "url", initialValue: "https://www.theaquariumsolution.com" }),
    defineField({ name: "dealerLocatorUrl", title: "Dealer locator URL", type: "url", initialValue: "https://www.theaquariumsolution.com/stockists" }),
    defineField({ name: "socialLinks", title: "Social links", type: "array", of: [defineArrayMember({ type: "linkField" })] }),
    defineField({ name: "defaultMetadata", title: "Default metadata", type: "metadata" }),
  ],
  preview: { select: { title: "brandName" } },
});

export const documentTypes = [product, testimonial, menu, siteSettings];
