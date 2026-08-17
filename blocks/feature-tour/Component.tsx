"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { stegaClean } from "next-sanity";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import { EASE_PRESENCE } from "@/lib/motion";
import type { BlockOf, BlockProps } from "@/blocks/types";

type Step = NonNullable<BlockOf<"featureTourBlock">["steps"]>[number];

/* ------------------------------------------------------------------ */
/* Block                                                               */
/* ------------------------------------------------------------------ */

/**
 * Apple feature tour: white canvas (film-dark for tone "ink"), centered header,
 * sticky `.media` on the left, a 1px hairline rail with a carbon active segment,
 * and steps as h3 28/600 (active carbon, idle ash) with 17px ash body.
 */
export default function FeatureTourBlock({ block }: BlockProps<"featureTourBlock">) {
  const steps = (block.steps ?? []).filter((s) => s?.image?.asset);
  const tone = stegaClean(block.tone) === "paper" ? "paper" : "ink";
  const dark = tone === "ink";
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  const onActivate = useCallback((i: number) => setActive(i), []);

  if (steps.length === 0) return null;

  const activeStep = steps[Math.min(active, steps.length - 1)];
  const segment = 100 / steps.length;

  return (
    <section className={`section-space page-gutter ${dark ? "canvas-dark" : "canvas-white"}`}>
      <div className="container-site">
        {(block.headline || block.intro) && (
          <SectionHeader headline={block.headline} intro={block.intro} align="center" className="mb-14 md:mb-20" />
        )}

        {/* ---------- Mobile / tablet: image + copy stacked per step ---------- */}
        <ol className="flex flex-col gap-14 lg:hidden" aria-label="Feature tour steps">
          {steps.map((step, i) => (
            <Reveal key={step._key} as="li" delay={Math.min(i, 3) * 60}>
              <div className="media relative aspect-[4/3]">
                <SanityImage image={step.image} alt={step.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <StepBody step={step} index={i} total={steps.length} dark={dark} active className="mt-6" />
            </Reveal>
          ))}
        </ol>

        {/* ---------- Desktop: sticky media + scrolling steps ---------- */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] lg:gap-x-8 xl:gap-x-12">
          {/* Sticky media */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="media relative aspect-[4/3]">
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
              </div>
            </div>
          </div>

          {/* Progress rail: 1px hairline, one carbon (white on dark) segment per active step */}
          <div className="relative" aria-hidden="true">
            <div className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 ${dark ? "bg-line-dark" : "bg-hairline"}`} />
            <div className="sticky top-24 h-[calc(100svh-8rem)]">
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2">
                <span
                  className={`absolute left-0 w-full transition-[top] duration-500 ease-out-expo motion-reduce:transition-none ${dark ? "bg-white" : "bg-carbon"}`}
                  style={{ top: `${active * segment}%`, height: `${segment}%` }}
                />
              </div>
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
    <li ref={ref} className="flex min-h-[70svh] flex-col justify-center py-10" aria-current={active ? "step" : undefined}>
      <StepBody step={step} index={index} total={total} dark={dark} active={active} />
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Shared step copy                                                    */
/* ------------------------------------------------------------------ */

function StepBody({
  step,
  index,
  total,
  dark,
  active,
  className = "",
}: {
  step: Step;
  index: number;
  total: number;
  dark: boolean;
  active: boolean;
  className?: string;
}) {
  const titleColor = active ? (dark ? "text-white" : "text-carbon") : dark ? "text-mist" : "text-ash";
  const bodyColor = active ? (dark ? "text-mist" : "text-ash") : dark ? "text-mist/60" : "text-ash/60";
  const figureColor = dark ? "text-white" : "text-carbon";

  return (
    <div className={`transition-colors duration-500 ${className}`}>
      <span className="sr-only">
        Step {index + 1} of {total}.
      </span>
      <h3 className={`transition-colors duration-500 ${titleColor}`}>{step.title}</h3>
      {step.body && <p className={`body mt-3 max-w-[52ch] transition-colors duration-500 ${bodyColor}`}>{step.body}</p>}
      {step.stat && (
        <div className="hairline mt-8 inline-flex items-baseline gap-3 border-t pt-5">
          <span className={`figure text-[40px] ${figureColor}`}>{step.stat}</span>
          {step.statLabel && <span className="label">{step.statLabel}</span>}
        </div>
      )}
    </div>
  );
}
