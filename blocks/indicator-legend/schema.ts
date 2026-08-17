import { defineArrayMember, defineField, defineType } from "sanity";

/** Interactive legend for a device's LED / sound signals: pick a state, see the LED animate + what to do. */
export const schema = defineType({
  name: "indicatorLegendBlock",
  title: "Indicator / alarm legend",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 2 }),
    defineField({
      name: "signals",
      title: "Signals",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "signal",
          fields: [
            defineField({ name: "name", title: "State", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "ledColor", title: "LED colour", type: "string", initialValue: "blue", options: { list: [{ title: "Blue", value: "blue" }, { title: "Red", value: "red" }, { title: "Blue / red alternating", value: "blueRed" }, { title: "Off", value: "off" }] } }),
            defineField({ name: "pattern", title: "Pattern", type: "string", initialValue: "solid", options: { list: [{ title: "Solid", value: "solid" }, { title: "Flash", value: "flash" }, { title: "Slow pulse", value: "pulse" }] } }),
            defineField({ name: "sound", title: "Sound", type: "string", description: "e.g. 'Beep every 5 s' or 'None'" }),
            defineField({ name: "meaning", title: "What it means", type: "text", rows: 2 }),
            defineField({ name: "action", title: "What to do", type: "text", rows: 2 }),
            defineField({ name: "severity", title: "Severity", type: "string", initialValue: "info", options: { list: [{ title: "Normal", value: "info" }, { title: "Warning", value: "warning" }, { title: "Alarm", value: "alarm" }] } }),
          ],
          preview: { select: { title: "name", subtitle: "meaning" } },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({ name: "deviceLabel", title: "Device label", type: "string", initialValue: "Smart controller" }),
  ],
  preview: { select: { headline: "headline" }, prepare: ({ headline }) => ({ title: "Indicator legend", subtitle: headline || "LED & alarm states" }) },
});
