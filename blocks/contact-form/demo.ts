import { key, link } from "@/content/demo-helpers";
import type { BlockOf } from "@/blocks/types";

export function contactFormDemo(input: {
  eyebrow?: string;
  headline: string;
  intro?: string;
  dealerLocatorCta?: { label: string; href: string };
  nameLabel?: string;
  companyLabel?: string;
  emailLabel?: string;
  phoneLabel?: string;
  countryLabel?: string;
  interestLabel?: string;
  interestOptions?: string[];
  messageLabel?: string;
  submitLabel?: string;
  privacyNotice?: string;
  successTitle?: string;
  successMessage?: string;
  errorMessage?: string;
}): BlockOf<"contactFormBlock"> {
  return {
    _key: key("contact-form"),
    _type: "contactFormBlock",
    eyebrow: input.eyebrow ?? "Contact",
    headline: input.headline,
    intro: input.intro ?? undefined,
    dealerLocatorCta: input.dealerLocatorCta ? link(input.dealerLocatorCta.label, input.dealerLocatorCta.href) : undefined,
    nameLabel: input.nameLabel ?? "Name",
    companyLabel: input.companyLabel ?? "Company or shop (optional)",
    emailLabel: input.emailLabel ?? "Email",
    phoneLabel: input.phoneLabel ?? "Phone (optional)",
    countryLabel: input.countryLabel ?? "Country",
    interestLabel: input.interestLabel ?? "I am interested in",
    interestOptions: input.interestOptions ?? ["Spektrum 150", "Funktion Return Pump", "KH Manager", "Becoming a stockist", "Something else"],
    messageLabel: input.messageLabel ?? "Message",
    submitLabel: input.submitLabel ?? "Send enquiry",
    privacyNotice: input.privacyNotice ?? "We only use your details to answer this enquiry.",
    successTitle: input.successTitle ?? "Thank you — we have received your message.",
    successMessage: input.successMessage ?? "We will get back to you as soon as possible.",
    errorMessage: input.errorMessage ?? "We could not send your message. Please try again.",
  };
}
