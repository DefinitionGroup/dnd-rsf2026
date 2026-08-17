import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Product finder / calculator. Editors describe inputs and an ordered rules
 * table; the component picks the first rule whose limits fit the visitor's
 * answers and shows its result (model, roll life, note).
 */
export const schema = defineType({
  name: "productFinderBlock",
  title: "Product finder (calculator)",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 2 }),
    defineField({ name: "volumeLabel", title: "Volume input label", type: "string", initialValue: "Aquarium volume" }),
    defineField({ name: "volumeMin", title: "Volume min (litres)", type: "number", initialValue: 50 }),
    defineField({ name: "volumeMax", title: "Volume max (litres)", type: "number", initialValue: 1500 }),
    defineField({ name: "volumeDefault", title: "Volume default (litres)", type: "number", initialValue: 400 }),
    defineField({ name: "loadLabel", title: "Bioload input label", type: "string", initialValue: "Stocking / feeding" }),
    defineField({
      name: "loadOptions",
      title: "Bioload options",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "loadOption",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "factor", title: "Volume multiplier", type: "number", description: "1 = as is; 1.3 = treat the tank as 30 % larger (heavy feeding).", initialValue: 1, validation: (Rule) => Rule.required().min(0.1) }),
            defineField({ name: "rollFactor", title: "Roll-life multiplier", type: "number", description: "1 = base roll life; 0.7 = rolls last 30 % less.", initialValue: 1, validation: (Rule) => Rule.required().min(0.1) }),
          ],
          preview: { select: { title: "label", factor: "factor" }, prepare: ({ title, factor }) => ({ title, subtitle: `×${factor}` }) },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "rules",
      title: "Rules (checked in order; first match wins)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "finderRule",
          fields: [
            defineField({ name: "maxEffectiveVolume", title: "Up to effective volume (litres)", type: "number", description: "Leave empty for 'anything larger'." }),
            defineField({ name: "resultTitle", title: "Result title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "resultBody", title: "Result body", type: "text", rows: 2 }),
            defineField({ name: "flowLph", title: "Flow (l/h)", type: "number" }),
            defineField({ name: "rollWeeks", title: "Base roll life (weeks)", type: "number" }),
            defineField({ name: "product", title: "Product", type: "reference", to: [{ type: "product" }] }),
            defineField({ name: "cta", title: "CTA", type: "linkField" }),
          ],
          preview: { select: { title: "resultTitle", max: "maxEffectiveVolume" }, prepare: ({ title, max }) => ({ title, subtitle: max ? `≤ ${max} l` : "larger" }) },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({ name: "resultLabel", title: "Result label", type: "string", initialValue: "Our recommendation" }),
    defineField({ name: "rollLifeLabel", title: "Roll-life label", type: "string", initialValue: "Expected roll life" }),
    defineField({ name: "footnote", title: "Footnote", type: "text", rows: 2 }),
  ],
  preview: { select: { headline: "headline" }, prepare: ({ headline }) => ({ title: "Product finder", subtitle: headline || "Calculator" }) },
});
