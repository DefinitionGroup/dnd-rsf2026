"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { stegaClean } from "next-sanity";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import SanityImage from "@/components/SanityImage";
import { EASE_PRESENCE } from "@/lib/motion";
import type { BlockProps } from "@/blocks/types";

const DEFAULT_DURATION = 6;

const TONES = {
  paper: {
    section: "bg-paper text-ink",
    eyebrow: "text-lime-deep",
    headline: "text-ink",
    intro: "text-muted",
    number: "text-lime-deep",
    numberActive: "bg-lime text-ink",
    numberIdle: "border-line text-muted",
    title: "text-ink",
    body: "text-muted",
    track: "bg-line",
    fill: "bg-lime",
    hover: "hover:bg-sand",
    active: "bg-sand",
    frame: "bg-sand",
  },
  ink: {
    section: "on-dark bg-ink text-paper",
    eyebrow: "text-lime",
    headline: "text-paper",
    intro: "text-paper/70",
    number: "text-lime",
    numberActive: "bg-lime text-ink",
    numberIdle: "border-paper/25 text-paper/60",
    title: "text-paper",
    body: "text-paper/70",
    track: "bg-paper/15",
    fill: "bg-lime",
    hover: "hover:bg-paper/5",
    active: "bg-paper/8",
    frame: "bg-ink-soft",
  },
} as const;

type Step = NonNullable<BlockProps<"howItWorksBlock">["block"]["steps"]>[number];

export default function HowItWorksBlock({ block }: BlockProps<"howItWorksBlock">) {
  const steps = block.steps ?? [];
  const tone = TONES[stegaClean(block.tone) === "ink" ? "ink" : "paper"];
  const autoplay = block.autoplay !== false;
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const listRef = useRef<HTMLOListElement>(null);
  const baseId = useId();

  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);

  const progress = useMotionValue(0);
  const fillWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  const count = steps.length;
  const current = steps[Math.min(active, Math.max(count - 1, 0))];
  const shouldAutoAdvance = autoplay && !reduceMotion && count > 1;

  // Drive the active step's progress bar; advance when it completes.
  useEffect(() => {
    if (count === 0) return;
    progress.set(0);
    if (!shouldAutoAdvance) {
      progress.set(1);
      return;
    }
    if (!inView) return;
    const seconds = current?.durationSeconds && current.durationSeconds > 0 ? current.durationSeconds : DEFAULT_DURATION;
    const controls = animate(progress, 1, {
      duration: seconds,
      ease: "linear",
      onComplete: () => setActive((a) => (a + 1) % count),
    });
    if (pausedRef.current) controls.pause();
    controlsRef.current = controls;
    return () => {
      controls.stop();
      controlsRef.current = null;
    };
  }, [active, cycle, count, current, inView, progress, shouldAutoAdvance]);

  useEffect(() => {
    pausedRef.current = paused;
    const c = controlsRef.current;
    if (!c) return;
    if (paused) c.pause();
    else c.play();
  }, [paused]);

  const select = useCallback(
    (i: number) => {
      if (i === active) setCycle((c) => c + 1);
      else setActive(i);
    },
    [active],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLOListElement>) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    let next = active;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (active + 1) % count;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (active - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    select(next);
    listRef.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };

  if (count === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={`section-space page-gutter ${tone.section}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="container-site">
        {(block.eyebrow || block.headline || block.intro) && (
          <header className="mb-10 max-w-3xl md:mb-14">
            {block.eyebrow && <p className={`eyebrow mb-3 ${tone.eyebrow}`}>{block.eyebrow}</p>}
            {block.headline && <h2 className={`whitespace-pre-line ${tone.headline}`}>{block.headline}</h2>}
            {block.intro && <p className={`mt-4 text-lg leading-relaxed ${tone.intro}`}>{block.intro}</p>}
          </header>
        )}

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Image of the active step */}
          <div className="lg:order-2 lg:col-span-7">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${tone.frame} lg:sticky lg:top-24`} aria-live="polite" aria-atomic>
              <AnimatePresence initial={false}>
                {current?.image?.asset && (
                  <motion.div
                    key={current._key}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE_PRESENCE }}
                  >
                    <SanityImage
                      image={current.image}
                      alt={current.imageAlt ?? current.title}
                      fill
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1.5 font-display text-xs uppercase tracking-[0.2em] text-lime backdrop-blur">
                <span>Step {active + 1}</span>
                <span className="text-paper/50">/ {count}</span>
              </div>
            </div>
          </div>

          {/* Steps */}
          <ol
            ref={listRef}
            onKeyDown={onKeyDown}
            aria-label="Steps"
            className="flex flex-col gap-1 lg:order-1 lg:col-span-5"
          >
            {steps.map((step, i) => (
              <StepItem
                key={step._key}
                step={step}
                index={i}
                total={count}
                isActive={i === active}
                isDone={i < active}
                tone={tone}
                fillWidth={fillWidth}
                id={`${baseId}-step-${i}`}
                onSelect={() => select(i)}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StepItem({
  step,
  index,
  total,
  isActive,
  isDone,
  tone,
  fillWidth,
  id,
  onSelect,
}: {
  step: Step;
  index: number;
  total: number;
  isActive: boolean;
  isDone: boolean;
  tone: (typeof TONES)[keyof typeof TONES];
  fillWidth: MotionValue<string>;
  id: string;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        id={id}
        onClick={onSelect}
        aria-current={isActive ? "step" : undefined}
        aria-label={`Step ${index + 1} of ${total}: ${step.title}`}
        tabIndex={isActive ? 0 : -1}
        className={`group flex w-full cursor-pointer gap-4 rounded-xl px-4 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:px-5 ${
          isActive ? tone.active : tone.hover
        }`}
      >
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-display text-sm tabular-nums transition-colors ${
            isActive ? `border-transparent ${tone.numberActive}` : isDone ? `border-transparent bg-lime/25 ${tone.number}` : tone.numberIdle
          }`}
          aria-hidden
        >
          {index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block font-display text-lg uppercase leading-tight tracking-tight md:text-xl ${tone.title}`}>{step.title}</span>
          <motion.span
            initial={false}
            animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.4, ease: EASE_PRESENCE }}
            className="block overflow-hidden"
          >
            {step.body && <span className={`block pt-2 text-sm leading-relaxed md:text-base ${tone.body}`}>{step.body}</span>}
          </motion.span>
          <span className={`mt-3 block h-0.5 w-full overflow-hidden rounded-full ${tone.track}`} aria-hidden>
            {isActive ? (
              <motion.span className={`block h-full ${tone.fill}`} style={{ width: fillWidth }} />
            ) : (
              <span className={`block h-full ${tone.fill} ${isDone ? "w-full opacity-60" : "w-0"}`} />
            )}
          </span>
        </span>
      </button>
    </li>
  );
}
