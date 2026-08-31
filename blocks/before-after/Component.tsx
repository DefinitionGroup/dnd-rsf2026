"use client";

import { useCallback, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import { EASE_PRESENCE } from "@/lib/motion";
import type { BlockProps } from "@/blocks/types";
import { backgroundClass } from "@/lib/section-background";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function BeforeAfterBlock({ block }: BlockProps<"beforeAfterBlock">) {
  const reduceMotion = useReducedMotion();
  const initial = clamp(block.startPosition ?? 50, 0, 100);
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();

  const beforeLabel = block.beforeLabel || "Before";
  const afterLabel = block.afterLabel || "After";

  const positionFromPointer = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setInteracted(true);
    positionFromPointer(e.clientX);
    handleRef.current?.focus({ preventScroll: true });
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    positionFromPointer(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 10 : 2;
    let next: number | null = null;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        next = position - step;
        break;
      case "ArrowRight":
      case "ArrowUp":
        next = position + step;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 100;
        break;
      case "PageDown":
        next = position - 10;
        break;
      case "PageUp":
        next = position + 10;
        break;
    }
    if (next === null) return;
    e.preventDefault();
    setInteracted(true);
    setPosition(clamp(next, 0, 100));
  };

  // Keep the handle in sync if the editor changes startPosition in Presentation.
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    if (!interacted) setPosition(initial);
  }

  if (!block.before?.asset || !block.after?.asset) return null;

  const rounded = Math.round(position);
  const hasHeader = Boolean(block.headline || block.intro);

  return (
    <section className={`${backgroundClass(block.background, "canvas-white")} section-space page-gutter`}>
      <div className="container-site">
        <SectionHeader eyebrow={block.eyebrow} headline={block.headline} intro={block.intro} align="center" />

        <figure className={`mx-auto max-w-5xl ${hasHeader ? "mt-12 md:mt-16" : ""}`}>
          <div
            ref={frameRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={`media group relative isolate aspect-[16/10] w-full touch-pan-y select-none ${dragging ? "cursor-ew-resize" : "cursor-col-resize"}`}
            role="group"
            aria-label={block.alt}
          >
            {/* After (bottom, fully visible) */}
            <SanityImage image={block.after} alt="" fill sizes="(min-width: 1024px) 1024px, 100vw" className="pointer-events-none object-cover" draggable={false} />

            {/* Before (top, clipped from the right of the divider) */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                clipPath: `inset(0 ${100 - position}% 0 0)`,
                willChange: dragging ? "clip-path" : undefined,
                transition: dragging || reduceMotion ? "none" : "clip-path 120ms ease-out",
              }}
            >
              <SanityImage image={block.before} alt="" fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" draggable={false} />
            </div>

            {/* Labels */}
            <span
              aria-hidden
              className={`body-sm hairline pointer-events-none absolute left-4 top-4 rounded-full border bg-white px-3 py-1 text-carbon transition-opacity duration-200 ${position < 12 ? "opacity-0" : "opacity-100"}`}
            >
              {beforeLabel}
            </span>
            <span
              aria-hidden
              className={`body-sm hairline pointer-events-none absolute right-4 top-4 rounded-full border bg-white px-3 py-1 text-carbon transition-opacity duration-200 ${position > 88 ? "opacity-0" : "opacity-100"}`}
            >
              {afterLabel}
            </span>

            {/* Divider */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-white"
              style={{ left: `${position}%`, transition: dragging || reduceMotion ? "none" : "left 120ms ease-out" }}
            />

            {/* Handle */}
            <button
              ref={handleRef}
              type="button"
              role="slider"
              aria-label={`${beforeLabel} / ${afterLabel} comparison`}
              aria-describedby={labelId}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={rounded}
              aria-valuetext={`${rounded}% ${beforeLabel}`}
              aria-orientation="horizontal"
              onKeyDown={onKeyDown}
              onFocus={() => setInteracted(true)}
              className={`hairline absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white text-carbon transition-[transform,left,background-color] duration-150 ease-out hover:bg-frost motion-reduce:transition-none ${dragging ? "scale-105 bg-frost" : ""} ${dragging ? "cursor-ew-resize" : "cursor-col-resize"}`}
              style={{ left: `${position}%`, transition: dragging || reduceMotion ? "none" : undefined }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M8 5 3 10l5 5M12 5l5 5-5 5" />
              </svg>
            </button>
            <span id={labelId} className="sr-only">
              Drag or use arrow keys to reveal more of {beforeLabel} or {afterLabel}.
            </span>

            {/* Nudge hint */}
            <AnimatePresence>
              {!interacted && (
                <motion.span
                  key="hint"
                  aria-hidden
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_PRESENCE, delay: 0.6 }}
                  className="body-sm hairline pointer-events-none absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-carbon"
                >
                  Drag to compare
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {block.caption && <figcaption className="caption mt-4 text-center">{block.caption}</figcaption>}
        </figure>
      </div>
    </section>
  );
}
