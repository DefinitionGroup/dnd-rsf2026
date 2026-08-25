"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useMotionTemplate, useReducedMotion } from "motion/react";
import SectionHeader from "@/components/SectionHeader";
import { resolveImageUrl } from "@/sanity/lib/image";
import { EASE_PRESENCE } from "@/lib/motion";
import type { BlockProps } from "@/blocks/types";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;
/** ms per frame while auto-rotating (12 frames ≈ one turn per second). */
const AUTO_ROTATE_MS = 90;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function ProductViewerBlock({ block }: BlockProps<"productViewerBlock">) {
  const reduceMotion = useReducedMotion();

  const frames = useMemo(() => {
    const own = (block.frames ?? []).filter((f) => f?.asset);
    const source = own.length > 0 ? own : (block.product?.gallery ?? []).map((g) => g.image).filter((i) => i?.asset);
    return source.map((image) => resolveImageUrl(image, { width: 1200 })).filter((u): u is string => Boolean(u));
  }, [block.frames, block.product?.gallery]);

  const frameCount = frames.length;
  const canRotate = frameCount > 1;

  const stageRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [interacted, setInteracted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loadedSet, setLoadedSet] = useState<ReadonlySet<number>>(() => new Set());
  const loaded = loadedSet.size;
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const hintId = useId();
  const markLoaded = useCallback((i: number) => {
    setLoadedSet((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  }, []);
  // Images cached before hydration never fire onLoad — sweep them once on mount.
  useEffect(() => {
    imgRefs.current.forEach((el, i) => {
      if (el?.complete) markLoaded(i);
    });
  }, [markLoaded, frameCount]);

  // Zoom / pan run through spring-smoothed motion values so wheel ticks and
  // +/- buttons glide instead of stepping, while drag-to-pan stays direct.
  const springConfig = reduceMotion ? { duration: 0 } : { stiffness: 420, damping: 42, mass: 0.6 };
  const scaleMv = useMotionValue(1);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const scaleS = useSpring(scaleMv, springConfig);
  const panXS = useSpring(panX, springConfig);
  const panYS = useSpring(panY, springConfig);
  const transform = useMotionTemplate`translate3d(${panXS}px, ${panYS}px, 0) scale(${scaleS})`;

  const zoomRef = useRef(1);
  const frameRef = useRef(0);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ startX: number; startY: number; startFrame: number; startPanX: number; startPanY: number; pinchDist: number; pinchZoom: number } | null>(null);
  const dragAccum = useRef(0);

  const markInteracted = useCallback(() => setInteracted(true), []);

  const clampPan = useCallback((z: number) => {
    const el = stageRef.current;
    if (!el) return;
    const maxX = ((z - 1) * el.clientWidth) / 2;
    const maxY = ((z - 1) * el.clientHeight) / 2;
    panX.set(clamp(panX.get(), -maxX, maxX));
    panY.set(clamp(panY.get(), -maxY, maxY));
  }, [panX, panY]);

  const applyZoom = useCallback(
    (next: number) => {
      const z = Math.round(clamp(next, MIN_ZOOM, MAX_ZOOM) * 100) / 100;
      zoomRef.current = z;
      scaleMv.set(z);
      if (z === 1) {
        panX.set(0);
        panY.set(0);
      } else {
        clampPan(z);
      }
      setZoom(z);
    },
    [scaleMv, panX, panY, clampPan],
  );

  const stepFrame = useCallback(
    (delta: number) => {
      if (!canRotate) return;
      const next = (((frameRef.current + delta) % frameCount) + frameCount) % frameCount;
      frameRef.current = next;
      setFrame(next);
    },
    [canRotate, frameCount],
  );

  const reset = useCallback(() => {
    applyZoom(1);
    frameRef.current = 0;
    setFrame(0);
  }, [applyZoom]);

  // Auto-rotate until the first interaction (skipped for reduced motion).
  const autoRotate = Boolean(block.autoRotate) && canRotate && !interacted && !reduceMotion && loaded >= frameCount;
  useEffect(() => {
    if (!autoRotate) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last >= AUTO_ROTATE_MS) {
        last = now;
        stepFrame(1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotate, stepFrame]);

  // Wheel: vertical → zoom, horizontal → rotate. Needs a non-passive listener to preventDefault.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setInteracted(true);
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && zoomRef.current === 1) {
        dragAccum.current += e.deltaX;
        const px = el.clientWidth / Math.max(frameCount, 1);
        const steps = Math.trunc(dragAccum.current / (px * 0.5));
        if (steps !== 0) {
          dragAccum.current -= steps * px * 0.5;
          stepFrame(steps);
        }
        return;
      }
      const factor = e.deltaMode === 1 ? 0.05 : 0.0025;
      applyZoom(zoomRef.current - e.deltaY * factor);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [applyZoom, stepFrame, frameCount]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    markInteracted();
    setDragging(true);
    dragAccum.current = 0;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { startX: 0, startY: 0, startFrame: frameRef.current, startPanX: panX.get(), startPanY: panY.get(), pinchDist: Math.hypot(a.x - b.x, a.y - b.y), pinchZoom: zoomRef.current };
    } else {
      gesture.current = { startX: e.clientX, startY: e.clientY, startFrame: frameRef.current, startPanX: panX.get(), startPanY: panY.get(), pinchDist: 0, pinchZoom: zoomRef.current };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (g.pinchDist > 0) applyZoom(g.pinchZoom * (dist / g.pinchDist));
      return;
    }

    const el = stageRef.current;
    if (!el) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    const z = zoomRef.current;
    if (z > 1) {
      const maxX = ((z - 1) * el.clientWidth) / 2;
      const maxY = ((z - 1) * el.clientHeight) / 2;
      panX.set(clamp(g.startPanX + dx, -maxX, maxX));
      panY.set(clamp(g.startPanY + dy, -maxY, maxY));
      return;
    }
    if (!canRotate) return;
    // One full stage width = one full revolution.
    const pxPerFrame = el.clientWidth / frameCount;
    const next = (((g.startFrame + Math.round(dx / pxPerFrame)) % frameCount) + frameCount) % frameCount;
    if (next !== frameRef.current) {
      frameRef.current = next;
      setFrame(next);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (pointers.current.size === 0) {
      gesture.current = null;
      setDragging(false);
    } else if (pointers.current.size === 1) {
      // Pinch ended with one finger still down: restart a plain drag from its position.
      const [p] = [...pointers.current.values()];
      gesture.current = { startX: p.x, startY: p.y, startFrame: frameRef.current, startPanX: panX.get(), startPanY: panY.get(), pinchDist: 0, pinchZoom: zoomRef.current };
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let handled = true;
    switch (e.key) {
      case "ArrowLeft":
        stepFrame(-1);
        break;
      case "ArrowRight":
        stepFrame(1);
        break;
      case "+":
      case "=":
        applyZoom(zoomRef.current + ZOOM_STEP);
        break;
      case "-":
      case "_":
        applyZoom(zoomRef.current - ZOOM_STEP);
        break;
      case "0":
      case "Home":
        reset();
        break;
      default:
        handled = false;
    }
    if (handled) {
      e.preventDefault();
      markInteracted();
    }
  };

  if (frameCount === 0) return null;

  const progress = canRotate ? frame / frameCount : 0;
  const ringR = 15;
  const ringC = 2 * Math.PI * ringR;
  const isLoading = loaded < frameCount;
  const showHint = Boolean(block.hint) && !interacted && !isLoading;

  return (
    <section className="canvas-dark section-space page-gutter">
      <div className="container-site">
        <SectionHeader eyebrow={block.eyebrow} headline={block.headline} intro={block.intro} align="center" />

        <div className={`mx-auto max-w-4xl ${block.headline || block.intro ? "mt-12 md:mt-16" : ""}`}>
          {/* Stage */}
          <div
            ref={stageRef}
            role="application"
            aria-roledescription={canRotate ? "360 degree product viewer" : "zoomable product image"}
            aria-label={block.alt}
            aria-describedby={showHint ? hintId : undefined}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onFocus={markInteracted}
            className={`media group relative isolate aspect-square w-full touch-none select-none bg-onyx md:aspect-[4/3] ${
              zoom > 1 ? (dragging ? "cursor-grabbing" : "cursor-move") : canRotate ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
            }`}
          >
            <motion.div className="absolute inset-0" style={{ transform, willChange: zoom > 1 || dragging ? "transform" : undefined }}>
              {frames.map((src, i) => (
                // Plain <img> stacked and pre-decoded so frame switches are instant.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src + i}
                  src={src}
                  alt={i === frame ? block.alt : ""}
                  aria-hidden={i !== frame}
                  draggable={false}
                  decoding="async"
                  loading="eager"
                  fetchPriority={i === 0 ? "high" : "auto"}
                  ref={(el) => {
                    imgRefs.current[i] = el;
                  }}
                  onLoad={() => markLoaded(i)}
                  onError={() => markLoaded(i)}
                  className={`absolute inset-0 h-full w-full object-contain ${i === frame ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </motion.div>

            {/* Loading veil */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  key="loading"
                  aria-live="polite"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE_PRESENCE }}
                  className="absolute inset-0 flex items-center justify-center bg-carbon/80"
                >
                  <span className="label num">
                    Loading {Math.min(loaded, frameCount)}/{frameCount}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint */}
            <AnimatePresence>
              {showHint && (
                <motion.p
                  key="hint"
                  id={hintId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_PRESENCE }}
                  className="body-sm pointer-events-none absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-white"
                >
                  <svg aria-hidden width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-muted motion-safe:animate-pulse">
                    <path d="M1 6h14M4 3 1 6l3 3M12 3l3 3-3 3" />
                  </svg>
                  {block.hint}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Frame position ring */}
            {canRotate && (
              <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2" aria-hidden>
                <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
                  <circle cx="18" cy="18" r={ringR} fill="none" stroke="var(--color-line-dark)" strokeWidth="1.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r={ringR}
                    fill="none"
                    stroke="var(--color-white)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={ringC}
                    strokeDashoffset={ringC * (1 - progress)}
                    className="transition-[stroke-dashoffset] duration-150 ease-out motion-reduce:transition-none"
                  />
                </svg>
                <span className="caption num">
                  {String(frame + 1).padStart(2, "0")}/{String(frameCount).padStart(2, "0")}
                </span>
              </div>
            )}

            {/* Zoom controls */}
            <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-full bg-white text-carbon" onPointerDown={(e) => e.stopPropagation()}>
              <button
                type="button"
                aria-label="Zoom in"
                disabled={zoom >= MAX_ZOOM}
                onClick={() => {
                  markInteracted();
                  applyZoom(zoomRef.current + ZOOM_STEP);
                }}
                className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-frost disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M8 3v10M3 8h10" />
                </svg>
              </button>
              <span className="mx-2.5 border-t border-hairline" aria-hidden />
              <button
                type="button"
                aria-label="Zoom out"
                disabled={zoom <= MIN_ZOOM}
                onClick={() => {
                  markInteracted();
                  applyZoom(zoomRef.current - ZOOM_STEP);
                }}
                className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-frost disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 8h10" />
                </svg>
              </button>
            </div>

            <AnimatePresence>
              {(zoom > 1 || (canRotate && frame !== 0 && interacted)) && (
                <motion.button
                  key="reset"
                  type="button"
                  aria-label="Reset view"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={reset}
                  className="body-sm absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-carbon transition-colors hover:bg-frost"
                >
                  <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 7a4.5 4.5 0 1 0 1.3-3.2M2.5 1.5v3h3" />
                  </svg>
                  Reset {zoom > 1 && <span className="num text-fg-muted">{zoom.toFixed(1)}×</span>}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Screen-reader status */}
            <span className="sr-only" aria-live="polite">
              {canRotate ? `Frame ${frame + 1} of ${frameCount}. ` : ""}Zoom {zoom.toFixed(1)} times.
            </span>
          </div>

          {/* Frame dots (mobile-friendly indicator) */}
          {canRotate && frameCount <= 36 && (
            <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
              {frames.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-150 motion-reduce:transition-none ${i === frame ? "w-5 bg-white" : "w-1 bg-ash"}`}
                />
              ))}
            </div>
          )}

          <p className="sr-only">
            Keyboard: left and right arrows rotate, plus and minus zoom, zero resets.
          </p>

          {block.product && (block.product.name || block.product.tagline) && (
            <div className="mt-10 text-center">
              {block.product.name && <h4 className="text-white">{block.product.name}</h4>}
              {block.product.tagline && <p className="body-sm mx-auto mt-2 max-w-[52ch] text-fg-muted">{block.product.tagline}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
