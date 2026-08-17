"use client";

import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import ActionLink from "@/components/ActionLink";
import { DURATION_REVEAL, EASE_PRESENCE } from "@/lib/motion";
import { t } from "@/lib/i18n";
import type { BlockProps } from "@/blocks/types";

type SubmissionState = "idle" | "submitting" | "success" | "error";

const DEFAULT_STOCKIST_URL = "https://www.theaquariumsolution.com/stockists";

const inputClass = "field text-fg transition-colors duration-200 disabled:opacity-60";

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true" focusable="false">
      <path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false" className="shrink-0">
      <path d="M2.5 6h7M6 2.5 9.5 6 6 9.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SelectChevron() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-fg-muted"
    >
      <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactFormBlock({ block, locale }: BlockProps<"contactFormBlock">) {
  const reduceMotion = useReducedMotion();
  const fieldId = useId();
  const startedAt = useRef(0);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const labels = {
    name: block.nameLabel ?? "Name",
    company: block.companyLabel ?? "Company",
    email: block.emailLabel ?? "Email",
    phone: block.phoneLabel ?? "Phone",
    country: block.countryLabel ?? "Country",
    interest: block.interestLabel ?? "Interest",
    message: block.messageLabel ?? "Message",
    submit: block.submitLabel ?? "Send",
    successTitle: block.successTitle ?? "Thank you",
    successMessage: block.successMessage ?? null,
    errorMessage: block.errorMessage ?? "Error",
    privacyNotice: block.privacyNotice ?? null,
  };

  const dealerLocator = block.dealerLocatorCta?.href
    ? block.dealerLocatorCta
    : { label: t(locale, "findStockist"), href: DEFAULT_STOCKIST_URL };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmissionState("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          name: formData.get("name"),
          company: formData.get("company"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          country: formData.get("country"),
          interest: formData.get("interest"),
          message: formData.get("message"),
          website: formData.get("website"),
          startedAt: startedAt.current,
          pagePath: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });

      if (!response.ok) throw new Error("Contact request failed");

      form.reset();
      startedAt.current = Date.now();
      setSubmissionState("success");
    } catch {
      setSubmissionState("error");
    }
  }

  const revealTransition = reduceMotion ? { duration: 0 } : { duration: DURATION_REVEAL, ease: EASE_PRESENCE };

  return (
    <section id="contact" className="canvas-frost section-space page-gutter scroll-mt-24" aria-labelledby={`${fieldId}-heading`}>
      <div className="container-site">
        <motion.header
          className="container-text text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={revealTransition}
        >
          <h2 id={`${fieldId}-heading`} className="mx-auto max-w-[24ch] whitespace-pre-line">
            {block.headline}
          </h2>
          {block.intro ? <p className="whisper mx-auto mt-3 max-w-[42rem]">{block.intro}</p> : null}
        </motion.header>

        <motion.div
          className="mx-auto mt-12 w-full max-w-[640px] md:mt-16"
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.1 }}
        >
          {submissionState === "success" ? (
            <motion.div
              className="tile flex flex-col items-center gap-3 text-center"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={revealTransition}
              role="status"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-lime text-carbon" aria-hidden="true">
                <CheckIcon />
              </span>
              <h4>{labels.successTitle}</h4>
              {labels.successMessage ? <p className="body-sm text-fg-muted">{labels.successMessage}</p> : null}
              <button
                type="button"
                className="action-link action-link--text mt-2 cursor-pointer"
                onClick={() => setSubmissionState("idle")}
              >
                <span>{t(locale, "sendAnother")}</span>
                <ArrowIcon />
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="tile relative">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={labels.name} id={`${fieldId}-name`} required>
                  <input id={`${fieldId}-name`} name="name" type="text" autoComplete="name" maxLength={100} required className={inputClass} />
                </Field>
                <Field label={labels.company} id={`${fieldId}-company`}>
                  <input id={`${fieldId}-company`} name="company" type="text" autoComplete="organization" maxLength={120} className={inputClass} />
                </Field>
                <Field label={labels.email} id={`${fieldId}-email`} required>
                  <input
                    id={`${fieldId}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    maxLength={254}
                    required
                    className={inputClass}
                  />
                </Field>
                <Field label={labels.phone} id={`${fieldId}-phone`}>
                  <input id={`${fieldId}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={40} className={inputClass} />
                </Field>
                <Field label={labels.country} id={`${fieldId}-country`} required className={block.interestOptions?.length ? "" : "sm:col-span-2"}>
                  <input
                    id={`${fieldId}-country`}
                    name="country"
                    type="text"
                    autoComplete="country-name"
                    maxLength={80}
                    required
                    className={inputClass}
                  />
                </Field>
                {block.interestOptions?.length ? (
                  <Field label={labels.interest} id={`${fieldId}-interest`}>
                    <div className="relative">
                      <select id={`${fieldId}-interest`} name="interest" defaultValue="" className={`${inputClass} appearance-none pr-11`}>
                        <option value="">—</option>
                        {block.interestOptions.map((option) => (
                          <option value={option} key={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <SelectChevron />
                    </div>
                  </Field>
                ) : null}
                <Field label={labels.message} id={`${fieldId}-message`} required className="sm:col-span-2">
                  <textarea id={`${fieldId}-message`} name="message" rows={6} maxLength={5_000} required className={`${inputClass} resize-y`} />
                </Field>
              </div>

              {/* Honeypot: hidden from users and assistive tech; bots that fill it are rejected server-side. */}
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden opacity-0" aria-hidden="true" inert>
                <label htmlFor={`${fieldId}-website`}>Website</label>
                <input id={`${fieldId}-website`} name="website" type="text" autoComplete="off" tabIndex={-1} />
              </div>

              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                {labels.privacyNotice ? <p className="caption max-w-sm">{labels.privacyNotice}</p> : null}
                <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
                  <ActionLink link={dealerLocator} variant="secondary" />
                  <button
                    className="action-link action-link--primary cursor-pointer disabled:cursor-wait disabled:opacity-70"
                    type="submit"
                    disabled={submissionState === "submitting"}
                    aria-busy={submissionState === "submitting"}
                  >
                    <span>{labels.submit}</span>
                    <span aria-hidden="true" className={`inline-flex ${submissionState === "submitting" ? "motion-safe:animate-pulse" : ""}`}>
                      <ArrowIcon />
                    </span>
                  </button>
                </div>
              </div>

              <p className="body-sm mt-4 min-h-6 text-fg" role="status" aria-live="polite">
                {submissionState === "error" ? labels.errorMessage : ""}
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  children,
  className = "",
  id,
  label,
  required = false,
}: {
  children: React.ReactNode;
  className?: string;
  id: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="body-sm text-fg">
        {label}
        {required ? (
          <span className="text-fg-muted" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
    </div>
  );
}
