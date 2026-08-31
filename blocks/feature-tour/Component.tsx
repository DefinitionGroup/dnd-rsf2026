"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { stegaClean } from "next-sanity";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import { EASE_PRESENCE } from "@/lib/motion";
import type { BlockOf, BlockProps } from "@/blocks/types";

type Step = NonNullable<BlockOf<"featureTourBlock">["steps"]>[number];

/** Nav bar + product bar: the chrome the sticky column has to clear. */
const CHROME = "calc(var(--header-h) + var(--productbar-h))";

/** The film pushes: the incoming frame slides in from the direction of travel and
 *  shoves the outgoing one off the opposite edge (`.media` clips both). */
const FRAME: Variants = {
  enter: (direction: number) => ({ y: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { y: "0%", opacity: 1 },
  exit: (direction: number) => ({ y: direction > 0 ? "-100%" : "100%", opacity: 0 }),
};

/** Copy lines wake one after another when their step takes over. */
const COPY_GROUP: Variants = {
  idle: {},
  active: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
};
const COPY_LINE: Variants = {
  idle: { opacity: 0.3, y: 8, transition: { duration: 0.4, ease: EASE_PRESENCE } },
  active: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_PRESENCE } },
};

/* ------------------------------------------------------------------ */
/* Block                                                               */
/* ------------------------------------------------------------------ */

/**
 * Apple feature tour: white canvas (film-dark for tone "ink"), centered header,
 * a `.media` frame held at the vertical centre of the viewport on the left, a
 * 1px hairline rail with a carbon active segment, and steps as h3 28/600
 * (active carbon, idle ash) with 17px ash body.
 *
 * A step takes over the moment its box crosses the middle of the viewport —
 * one hard threshold, so the frame swap always reads as deliberate. On the swap
 * the new frame slides in and pushes the old one out, and the step's copy fades
 * up line by line.
 */
export default function FeatureTourBlock({ block }: BlockProps<"featureTourBlock">) {
  const steps = (block.steps ?? []).filter((s) => s?.image?.asset);
  const tone = stegaClean(block.tone) === "paper" ? "paper" : "ink";
  const dark = tone === "ink";
  // `direction` is +1 scrolling down the tour, -1 back up — it aims the slide.
  const [{ index: active, direction }, setActive] = useState({ index: 0, direction: 1 });
  const reduceMotion = useReducedMotion() ?? false;

  const onActivate = useCallback((i: number) => {
    setActive((prev) => (prev.index === i ? prev : { index: i, direction: i > prev.index ? 1 : -1 }));
  }, []);

  if (steps.length === 0) return null;

  const activeStep = steps[Math.min(active, steps.length - 1)];
  const segment = 100 / steps.length;

  return (
    <section className={`section-space page-gutter ${dark ? "canvas-dark" : "canvas-white"}`}>
      <div className="container-site">
        {(block.headline || block.intro) && (
          <SectionHeader eyebrow={block.eyebrow} headline={block.headline} intro={block.intro} align="center" className="mb-14 md:mb-20" />
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

        {/* ---------- Desktop: centred media + scrolling steps ---------- */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] lg:gap-x-8 xl:gap-x-12">
          {/* Media, parked at the middle of the space below the chrome rather than
              pinned to its top edge — the frame reads as the centre of the section. */}
          <div className="relative">
            <div className="sticky flex items-center" style={{ top: CHROME, height: `calc(100svh - ${CHROME})` }}>
              <div className="media relative aspect-[4/5] max-h-[86%] w-full">
                <AnimatePresence initial={false} mode="sync" custom={direction}>
                  <motion.div
                    key={activeStep._key}
                    className="absolute inset-0"
                    custom={direction}
                    variants={FRAME}
                    initial={reduceMotion ? false : "enter"}
                    animate="center"
                    exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : "exit"}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.62, ease: EASE_PRESENCE }}
                    style={{ willChange: reduceMotion ? undefined : "transform, opacity" }}
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
            <div className="sticky" style={{ top: CHROME, height: `calc(100svh - ${CHROME})` }}>
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
  // Collapsing the root to a line at the viewport's middle turns "in view" into a
  // single threshold: the step whose box straddles the centre owns the frame, and
  // since the steps tile the column without gaps, exactly one ever does.
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (inView) onActivate(index);
  }, [inView, index, onActivate]);

  return (
    <li ref={ref} className="flex min-h-[70svh] flex-col justify-center py-10" aria-current={active ? "step" : undefined}>
      <StepBody step={step} index={index} total={total} dark={dark} active={active} stagger />
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
  stagger = false,
  className = "",
}: {
  step: Step;
  index: number;
  total: number;
  dark: boolean;
  active: boolean;
  /** Desktop only: fade the lines up one after another as the step takes over. */
  stagger?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const titleColor = active ? (dark ? "text-white" : "text-fg") : "text-fg-muted";
  const figureColor = dark ? "text-white" : "text-fg";
  const animated = stagger && !reduceMotion;

  const counter = (
    <span className="sr-only">
      Step {index + 1} of {total}.
    </span>
  );
  const title = <h3 className={`transition-colors duration-500 ${titleColor}`}>{step.title}</h3>;
  const body = step.body ? <p className="body mt-3 max-w-[52ch] text-fg-muted">{step.body}</p> : null;
  const stat = step.stat ? (
    <div className="hairline mt-8 inline-flex items-baseline gap-3 border-t pt-5">
      <span className={`figure text-[40px] ${figureColor}`}>{step.stat}</span>
      {step.statLabel && <span className="label">{step.statLabel}</span>}
    </div>
  ) : null;

  if (!animated) {
    return (
      <div className={`transition-colors duration-500 ${className}`}>
        {counter}
        {title}
        {body}
        {stat}
      </div>
    );
  }

  return (
    <motion.div className={className} variants={COPY_GROUP} initial={false} animate={active ? "active" : "idle"}>
      {counter}
      <motion.div variants={COPY_LINE}>{title}</motion.div>
      {body && <motion.div variants={COPY_LINE}>{body}</motion.div>}
      {stat && <motion.div variants={COPY_LINE}>{stat}</motion.div>}
    </motion.div>
  );
}
