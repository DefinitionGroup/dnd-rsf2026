"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { stegaClean } from "next-sanity";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import { EASE_PRESENCE } from "@/lib/motion";
import type { BlockProps } from "@/blocks/types";

const DEFAULT_DURATION = 6;

/**
 * Apple "how it works": frost canvas (film-dark for tone "ink"); the steps list
 * lives in a white `.tile` (a real object), numbers `.body-sm text-fg-muted`, titles
 * h4 21/600, body `.body-sm text-fg-muted`, progress = hairline with a carbon fill.
 */
const TONES = {
  paper: {
    section: "canvas-frost",
    number: "text-fg-muted",
    titleActive: "text-fg",
    titleIdle: "text-fg-muted",
    body: "text-fg-muted",
    track: "bg-hairline",
    fill: "bg-carbon",
    titleHover: "group-hover:text-fg",
    badge: "bg-white text-carbon",
  },
  ink: {
    section: "canvas-dark",
    number: "text-fg-muted",
    titleActive: "text-white",
    titleIdle: "text-fg-muted",
    body: "text-fg-muted",
    track: "bg-line-dark",
    fill: "bg-white",
    titleHover: "group-hover:text-white",
    badge: "bg-white text-carbon",
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
        {(block.eyebrow || block.headline || block.intro) && <SectionHeader eyebrow={block.eyebrow} headline={block.headline} intro={block.intro} align="center" className="mb-12 md:mb-16" />}

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* Image of the active step */}
          <div className="lg:order-2 lg:col-span-7">
            <div className="media relative aspect-[4/3] lg:sticky lg:top-24" aria-live="polite" aria-atomic>
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
              <div className={`body-sm num pointer-events-none absolute left-4 top-4 rounded-full px-3 py-1 ${tone.badge}`}>
                Step {active + 1} of {count}
              </div>
            </div>
          </div>

          {/* Steps — a white tile on frost (carbon on dark) */}
          <div className="tile lg:order-1 lg:col-span-5">
            <ol ref={listRef} onKeyDown={onKeyDown} aria-label="Steps" className="flex flex-col">
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
        className="group flex w-full cursor-pointer gap-4 py-5 text-left"
      >
        <span className={`body-sm num w-6 shrink-0 pt-1 ${tone.number}`} aria-hidden>
          {index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-[1.3125rem] font-semibold leading-[1.24] tracking-[-0.005em] transition-colors duration-300 ${tone.titleHover} ${isActive ? tone.titleActive : tone.titleIdle}`}>
            {step.title}
          </span>
          <motion.span
            initial={false}
            animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.4, ease: EASE_PRESENCE }}
            className="block overflow-hidden"
          >
            {step.body && <span className={`body-sm block max-w-[46ch] pt-2 ${tone.body}`}>{step.body}</span>}
          </motion.span>
          <span className={`mt-4 block h-px w-full overflow-hidden ${tone.track}`} aria-hidden>
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
