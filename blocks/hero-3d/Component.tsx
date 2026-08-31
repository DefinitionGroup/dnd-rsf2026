"use client";

import dynamic from "next/dynamic";
import { useCallback, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import ActionLink from "@/components/ActionLink";
import { EASE_PRESENCE } from "@/lib/motion";
import { t } from "@/lib/i18n";
import type { BlockProps } from "@/blocks/types";

const AssemblyScene = dynamic(() => import("./AssemblyScene"), { ssr: false });

/** Scroll progress at which the machine is whole and the model becomes grabbable.
 *  The gate closes lower than it opens so a scrollbar resting on the edge can't flicker it. */
const GRAB_ON = 0.97;
const GRAB_OFF = 0.93;

/** One shape for both controls: same height, padding, icon gap and dark fill. */
const PILL = "body-sm inline-flex h-9 items-center gap-2 rounded-full bg-white/10 px-3.5 text-white";

function DragIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      {/* a turn arrow around the device's axis, with the drag direction on either side */}
      <path d="M3.4 6.2a5 5 0 0 1 9.2 0" />
      <path d="M3.4 3.6v2.6h2.6M12.6 3.6v2.6H10" />
      <path d="M1.5 11.5h13M4 9.5l-2.5 2 2.5 2M12 9.5l2.5 2-2.5 2" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M2.5 7a4.5 4.5 0 1 0 1.3-3.2M2.5 1.5v3h3" />
    </svg>
  );
}

/**
 * Scroll-pinned 3D hero: the ClariSea model hangs in an exploded view on the
 * black canvas and assembles itself as the visitor scrolls through a 350vh
 * runway — the scrollbar IS the timeline (progress is mapped 1:1 to scroll
 * distance, with only a frame-level damp for smoothness). Copy sits above the
 * device; the CTAs earn their entrance once the machine is whole — and so does
 * the model itself, which becomes drag-to-rotate at the end of the runway.
 */
export default function Hero3dBlock({ block, index, locale }: BlockProps<"hero3dBlock">) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const Heading = index === 0 ? "h1" : "h2";
  const reduceMotion = useReducedMotion() ?? false;
  const hintId = useId();

  const { scrollYProgress } = useScroll({ target: runwayRef, offset: ["start start", "end end"] });

  // Reduced motion skips the runway entirely: the model is already whole, so it
  // is grabbable from the start.
  const [grabbable, setGrabbable] = useState(reduceMotion);
  const [rotated, setRotated] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduceMotion) return;
    const next = grabbable ? v > GRAB_OFF : v >= GRAB_ON;
    if (next === grabbable) return;
    setGrabbable(next);
    // leaving the grab zone hands the model back to the scroll timeline, and the
    // scene unwinds any hand rotation — so nothing is left to reset
    if (!next) setRotated(false);
  });

  const onRotatedChange = useCallback((value: boolean) => setRotated(value), []);
  const resetView = useCallback(() => {
    setResetSignal((n) => n + 1);
    setRotated(false);
  }, []);

  // Function-form transforms on purpose: they stay on the main-thread MotionValue
  // path (Motion's scroll-timeline promotion of linear range maps mis-projects here).
  const ramp = (v: number, from: number, to: number) => Math.min(1, Math.max(0, (v - from) / (to - from)));
  const copyY = useTransform(scrollYProgress, (v) => ramp(v, 0, 0.5) * -18);
  const summaryOpacity = useTransform(scrollYProgress, (v) => (v < 0.5 ? 1 - 0.65 * ramp(v, 0, 0.28) : 0.35 + 0.65 * ramp(v, 0.75, 0.88)));
  const ctaOpacity = useTransform(scrollYProgress, (v) => ramp(v, 0.82, 0.96));
  const ctaPointerEvents = useTransform(ctaOpacity, (value) => (value > 0.5 ? ("auto" as const) : ("none" as const)));
  const hintOpacity = useTransform(scrollYProgress, (v) => 1 - ramp(v, 0, 0.08));

  const hasCtas = Boolean(block.primaryCta || block.secondaryCta);
  const presence = { duration: reduceMotion ? 0 : 0.32, ease: EASE_PRESENCE };

  return (
    <section className="canvas-dark on-dark">
      <div ref={runwayRef} className={reduceMotion ? "" : "h-[350vh]"}>
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
          {/* faint lime pool under the device — depth on the black canvas */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(42% 30% at 50% 68%, rgba(146,212,2,0.07), transparent 70%)" }}
          />

          <div className="absolute inset-0">
            <AssemblyScene
              progress={scrollYProgress}
              reduceMotion={reduceMotion}
              modelUrl={block.model?.asset?.url}
              label={block.modelAlt}
              interactive={grabbable}
              resetSignal={resetSignal}
              onRotatedChange={onRotatedChange}
              describedBy={hintId}
              roleDescription={t(locale, "dragToRotate")}
            />
          </div>

          <motion.div
            style={reduceMotion ? undefined : { y: copyY }}
            className="pointer-events-none relative z-10 mx-auto w-full max-w-[var(--container-text)] px-[var(--gutter)] pt-[clamp(4.5rem,10vh,7rem)] text-center"
          >
            {block.brand && <p className="eyebrow pointer-events-auto mb-4 inline-flex">{block.brand}</p>}
            <Heading className="display mx-auto max-w-[18ch] whitespace-pre-line">{block.headline}</Heading>
            {block.summary && (
              <motion.p style={reduceMotion ? undefined : { opacity: summaryOpacity }} className="whisper mx-auto mt-3 max-w-[40rem]">
                {block.summary}
              </motion.p>
            )}
          </motion.div>

          {/* Bottom stack: CTAs first, then the viewer controls that appear with the
              rotate affordance. Stacked (not absolutely placed) so they never collide. */}
          <div className="relative z-10 mt-auto flex flex-col items-center gap-4 pb-[clamp(3rem,8vh,5rem)]">
            {hasCtas && (
              <motion.div
                style={reduceMotion ? undefined : { opacity: ctaOpacity, pointerEvents: ctaPointerEvents }}
                className="flex flex-wrap items-center justify-center gap-3"
              >
                <ActionLink link={block.primaryCta} variant="primary" />
                <ActionLink link={block.secondaryCta} variant="secondary" />
              </motion.div>
            )}

            {/* Both controls share one pill shape. `popLayout` pulls the exiting hint
                out of flow immediately and `layout` lets the reset glide to its new
                centre instead of snapping there the moment a drag starts. */}
            <div className="pointer-events-none flex min-h-9 flex-wrap items-center justify-center gap-2">
              <AnimatePresence initial={false} mode="popLayout">
                {grabbable && !rotated && (
                  <motion.p
                    key="drag-hint"
                    id={hintId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                    transition={presence}
                    className={PILL}
                  >
                    <span className="text-lime motion-safe:animate-pulse">
                      <DragIcon />
                    </span>
                    {t(locale, "dragToRotate")}
                  </motion.p>
                )}
                {grabbable && (
                  <motion.button
                    key="reset-view"
                    type="button"
                    layout={reduceMotion ? false : "position"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                    transition={presence}
                    onClick={resetView}
                    className={`${PILL} pointer-events-auto transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime`}
                  >
                    <ResetIcon />
                    {t(locale, "resetView")}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="sr-only">{t(locale, "rotateKeys")}</p>

          {!reduceMotion && (
            <motion.div
              aria-hidden="true"
              style={{ opacity: hintOpacity }}
              className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
            >
              <span className="caption tracking-[0.14em] uppercase">{t(locale, "scrollHint")}</span>
              <span className="block h-8 w-px overflow-hidden bg-hairline">
                <motion.span
                  className="block h-3 w-px bg-lime"
                  animate={{ y: [-12, 32] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
