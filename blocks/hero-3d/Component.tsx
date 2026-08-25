"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import ActionLink from "@/components/ActionLink";
import type { BlockProps } from "@/blocks/types";

const AssemblyScene = dynamic(() => import("./AssemblyScene"), { ssr: false });

/**
 * Scroll-pinned 3D hero: the ClariSea model hangs in an exploded view on the
 * black canvas and assembles itself as the visitor scrolls through a 350vh
 * runway — the scrollbar IS the timeline (progress is mapped 1:1 to scroll
 * distance, with only a frame-level damp for smoothness). Copy sits above the
 * device; the CTAs earn their entrance once the machine is whole.
 */
export default function Hero3dBlock({ block, index }: BlockProps<"hero3dBlock">) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const Heading = index === 0 ? "h1" : "h2";
  const reduceMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({ target: runwayRef, offset: ["start start", "end end"] });

  // Function-form transforms on purpose: they stay on the main-thread MotionValue
  // path (Motion's scroll-timeline promotion of linear range maps mis-projects here).
  const ramp = (v: number, from: number, to: number) => Math.min(1, Math.max(0, (v - from) / (to - from)));
  const copyY = useTransform(scrollYProgress, (v) => ramp(v, 0, 0.5) * -18);
  const summaryOpacity = useTransform(scrollYProgress, (v) => (v < 0.5 ? 1 - 0.65 * ramp(v, 0, 0.28) : 0.35 + 0.65 * ramp(v, 0.75, 0.88)));
  const ctaOpacity = useTransform(scrollYProgress, (v) => ramp(v, 0.82, 0.96));
  const ctaPointerEvents = useTransform(ctaOpacity, (value) => (value > 0.5 ? ("auto" as const) : ("none" as const)));
  const hintOpacity = useTransform(scrollYProgress, (v) => 1 - ramp(v, 0, 0.08));

  const hasCtas = Boolean(block.primaryCta || block.secondaryCta);

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
            <AssemblyScene progress={scrollYProgress} reduceMotion={reduceMotion} modelUrl={block.model?.asset?.url} label={block.modelAlt} />
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

          {hasCtas && (
            <motion.div
              style={reduceMotion ? undefined : { opacity: ctaOpacity, pointerEvents: ctaPointerEvents }}
              className="relative z-10 mt-auto flex flex-wrap items-center justify-center gap-3 pb-[clamp(3rem,8vh,5rem)]"
            >
              <ActionLink link={block.primaryCta} variant="primary" />
              <ActionLink link={block.secondaryCta} variant="secondary" />
            </motion.div>
          )}

          {!reduceMotion && (
            <motion.div
              aria-hidden="true"
              style={{ opacity: hintOpacity }}
              className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
            >
              <span className="caption tracking-[0.14em] uppercase">Scroll</span>
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
