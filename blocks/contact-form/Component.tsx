"use client";

import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import ActionLink from "@/components/ActionLink";
import { DURATION_REVEAL, EASE_PRESENCE } from "@/lib/motion";
import { t } from "@/lib/i18n";
import type { BlockProps } from "@/blocks/types";

type SubmissionState = "idle" | "submitting" | "success" | "error";

const DEFAULT_STOCKIST_URL = "https://www.theaquariumsolution.com/stockists";

const inputClass =
  "w-full rounded-lg border border-paper/15 bg-ink px-4 py-3 text-base text-paper placeholder:text-paper/30 transition focus:border-lime focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime disabled:opacity-60";

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
    <section
      id="contact"
      className="on-dark section-space page-gutter scroll-mt-24 bg-ink text-paper"
      aria-labelledby={`${fieldId}-heading`}
    >
      <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={revealTransition}
        >
          {block.eyebrow ? <p className="eyebrow mb-3 text-lime">{block.eyebrow}</p> : null}
          <h2 id={`${fieldId}-heading`} className="whitespace-pre-line text-paper">
            {block.headline}
          </h2>
          {block.intro ? <p className="mt-5 max-w-md text-lg leading-relaxed text-paper/75">{block.intro}</p> : null}
        </motion.div>

        <motion.div
          className="rounded-2xl border border-paper/10 bg-ink-soft p-6 md:p-10"
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.1 }}
        >
          {submissionState === "success" ? (
            <motion.div
              className="flex flex-col items-start gap-4 py-6"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={revealTransition}
              role="status"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-lime font-display text-xl text-ink"
                aria-hidden="true"
              >
                ✓
              </span>
              <h3 className="text-paper">{labels.successTitle}</h3>
              {labels.successMessage ? <p className="text-paper/75">{labels.successMessage}</p> : null}
              <button
                type="button"
                className="mt-2 font-display text-sm uppercase tracking-wider text-lime underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
                onClick={() => setSubmissionState("idle")}
              >
                {t(locale, "sendAnother")}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="relative">
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
                    <select id={`${fieldId}-interest`} name="interest" defaultValue="" className={`${inputClass} appearance-none`}>
                      <option value="">—</option>
                      {block.interestOptions.map((option) => (
                        <option value={option} key={option}>
                          {option}
                        </option>
                      ))}
                    </select>
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

              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                {labels.privacyNotice ? <p className="max-w-sm text-sm leading-relaxed text-paper/55">{labels.privacyNotice}</p> : null}
                <div className="flex flex-wrap items-center gap-3">
                  <ActionLink link={dealerLocator} variant="secondary" />
                  <button
                    className="action-link action-link--primary disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
                    type="submit"
                    disabled={submissionState === "submitting"}
                    aria-busy={submissionState === "submitting"}
                  >
                    <span>{labels.submit}</span>
                    <span aria-hidden="true" className={submissionState === "submitting" ? "motion-safe:animate-pulse" : ""}>
                      ↗
                    </span>
                  </button>
                </div>
              </div>

              <p className="mt-4 min-h-6 text-sm text-lime" role="status" aria-live="polite">
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
      <label htmlFor={id} className="font-display text-xs uppercase tracking-[0.2em] text-paper/70">
        {label}
        {required ? (
          <span className="text-lime" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
    </div>
  );
}
