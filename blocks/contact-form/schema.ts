import { defineArrayMember, defineField, defineType } from "sanity";

export const schema = defineType({
  name: "contactFormBlock",
  title: "Contact form",
  type: "object",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "labels", title: "Field labels" },
    { name: "feedback", title: "Feedback" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "content", initialValue: "Contact" }),
    defineField({ name: "headline", title: "Headline", type: "text", rows: 2, group: "content", validation: (Rule) => Rule.required() }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 3, group: "content" }),
    defineField({ name: "dealerLocatorCta", title: "Dealer locator link", type: "linkField", group: "content", description: "Shown next to the form; defaults to the stockists page on the main site." }),
    defineField({ name: "nameLabel", title: "Name", type: "string", group: "labels", initialValue: "Name" }),
    defineField({ name: "companyLabel", title: "Company / shop", type: "string", group: "labels", initialValue: "Company or shop (optional)" }),
    defineField({ name: "emailLabel", title: "Email", type: "string", group: "labels", initialValue: "Email" }),
    defineField({ name: "phoneLabel", title: "Phone", type: "string", group: "labels", initialValue: "Phone (optional)" }),
    defineField({ name: "countryLabel", title: "Country", type: "string", group: "labels", initialValue: "Country" }),
    defineField({ name: "interestLabel", title: "Interest", type: "string", group: "labels", initialValue: "I am interested in" }),
    defineField({ name: "interestOptions", title: "Interest options", type: "array", group: "labels", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
    defineField({ name: "messageLabel", title: "Message", type: "string", group: "labels", initialValue: "Message" }),
    defineField({ name: "submitLabel", title: "Submit button", type: "string", group: "labels", initialValue: "Send enquiry" }),
    defineField({ name: "privacyNotice", title: "Privacy note", type: "text", rows: 2, group: "feedback", initialValue: "We only use your details to answer this enquiry." }),
    defineField({ name: "successTitle", title: "Success title", type: "string", group: "feedback", initialValue: "Thank you — we have received your message." }),
    defineField({ name: "successMessage", title: "Success message", type: "text", rows: 2, group: "feedback", initialValue: "We will get back to you as soon as possible." }),
    defineField({ name: "errorMessage", title: "Error message", type: "text", rows: 2, group: "feedback", initialValue: "We could not send your message. Please try again." }),
  ],
  preview: {
    select: { headline: "headline" },
    prepare: ({ headline }) => ({ title: "Contact form", subtitle: headline || "No headline yet" }),
  },
});
