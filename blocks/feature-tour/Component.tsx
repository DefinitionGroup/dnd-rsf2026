"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { stegaClean } from "next-sanity";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import { EASE_PRESENCE } from "@/lib/motion";
import type { BlockOf, BlockProps } from "@/blocks/types";

type Step = NonNullable<BlockOf<"featureTourBlock">["steps"]>[number];

/* ------------------------------------------------------------------ */
/* Block                                                               */
/* ------------------------------------------------------------------ */

export default function FeatureTourBlock({ block }: BlockProps<"featureTourBlock">) {
  const steps = (block.steps ?? []).filter((s) => s?.image?.asset);
  const tone = stegaClean(block.tone) === "paper" ? "paper" : "ink";
  const dark = tone === "ink";
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  const onActivate = useCallback((i: number) => setActive(i), []);

  if (steps.length === 0) return null;

  const activeStep = steps[Math.min(active, steps.length - 1)];

  return (
    <section className={`section-space page-gutter ${dark ? "on-dark bg-ink text-paper" : "bg-paper text-text"}`}>
      <div className="container-site">
        {(block.eyebrow || block.headline || block.intro) && (
          <SectionHeader
            eyebrow={block.eyebrow}
            headline={block.headline}
            intro={block.intro}
            className={`mb-12 md:mb-16 ${dark ? "[&_h2]:text-paper [&_p:not(.eyebrow)]:text-paper/70 [&_.eyebrow]:text-lime" : ""}`}
          />
        )}

        {/* ---------- Mobile / tablet: stacked cards ---------- */}
        <ol className="flex flex-col gap-10 lg:hidden" aria-label="Feature tour steps">
          {steps.map((step, i) => (
            <li key={step._key} className={`overflow-hidden rounded-[var(--radius-media)] border ${dark ? "border-paper/10 bg-ink-soft" : "border-line bg-sand"}`}>
              <div className="relative aspect-[4/3]">
                <SanityImage image={step.image} alt={step.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <StepBody step={step} index={i} total={steps.length} dark={dark} active />
            </li>
          ))}
        </ol>

        {/* ---------- Desktop: sticky media + scrolling steps ---------- */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] lg:gap-x-8 xl:gap-x-12">
          {/* Sticky media */}
          <div className="relative">
            <div className="sticky top-24">
              <div className={`relative aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] border ${dark ? "border-paper/10 bg-ink-soft" : "border-line bg-sand"}`}>
                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={activeStep._key}
                    className="absolute inset-0"
                    initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE_PRESENCE }}
                    style={{ willChange: reduceMotion ? undefined : "opacity, transform" }}
                  >
                    <SanityImage image={activeStep.image} alt={activeStep.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
                {/* Step counter chip */}
                <div className={`pointer-events-none absolute left-4 top-4 rounded-full px-3 py-1 font-display text-xs uppercase tracking-[0.2em] ${dark ? "bg-ink/70 text-lime backdrop-blur" : "bg-paper/80 text-ink backdrop-blur"}`} aria-hidden="true">
                  {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>

          {/* Progress rail */}
          <div className="relative" aria-hidden="true">
            <div className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 ${dark ? "bg-paper/15" : "bg-line"}`} />
            <div className="sticky top-24 flex h-[calc(100svh-8rem)] flex-col items-center justify-center gap-3">
              {steps.map((step, i) => (
                <span
                  key={step._key}
                  className={`block w-1 rounded-full transition-[height,background-color] duration-500 ${i === active ? "h-10 bg-lime" : dark ? "h-2 bg-paper/30" : "h-2 bg-ink/25"}`}
                />
              ))}
            </div>
          </div>

          {/* Steps */}
          <ol className="flex flex-col" aria-label="Feature tour steps">
            {steps.map((step, i) => (
              <TourStep key={step._key} step={step} index={i} total={steps.length} dark={dark} active={i === active} onActivate={onActivate} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop step (observed)                                             */
/* ------------------------------------------------------------------ */

function TourStep({
  step,
  index,
  total,
  dark,
  active,
  onActivate,
}: {
  step: Step;
  index: number;
  total: number;
  dark: boolean;
  active: boolean;
  onActivate: (i: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { amount: 0.5, margin: "-10% 0px -10% 0px" });

  useEffect(() => {
    if (inView) onActivate(index);
  }, [inView, index, onActivate]);

  return (
    <li
      ref={ref}
      className={`flex min-h-[70svh] flex-col justify-center py-10 transition-opacity duration-500 ${active ? "opacity-100" : dark ? "opacity-40" : "opacity-45"}`}
      aria-current={active ? "step" : undefined}
    >
      <StepBody step={step} index={index} total={total} dark={dark} active={active} />
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Shared step copy                                                    */
/* ------------------------------------------------------------------ */

function StepBody({ step, index, total, dark, active }: { step: Step; index: number; total: number; dark: boolean; active: boolean }) {
  return (
    <div className="p-6 lg:p-0">
      <p className={`eyebrow ${active ? "text-lime" : dark ? "text-paper/60" : "text-muted"}`}>
        <span className="sr-only">Step </span>
        {String(index + 1).padStart(2, "0")}
        <span aria-hidden="true"> / {String(total).padStart(2, "0")}</span>
      </p>
      <h3 className={`mt-3 text-2xl md:text-3xl ${dark ? "text-paper" : "text-ink"}`}>{step.title}</h3>
      {step.body && <p className={`mt-4 max-w-prose text-base leading-relaxed md:text-lg ${dark ? "text-paper/75" : "text-muted"}`}>{step.body}</p>}
      {step.stat && (
        <div className={`mt-6 inline-flex items-baseline gap-3 border-t pt-4 ${dark ? "border-paper/15" : "border-line"}`}>
          <span className="font-display text-4xl uppercase leading-none tracking-tight text-lime md:text-5xl">{step.stat}</span>
          {step.statLabel && <span className={`font-display text-xs uppercase tracking-[0.2em] ${dark ? "text-paper/60" : "text-muted"}`}>{step.statLabel}</span>}
        </div>
      )}
    </div>
  );
}
