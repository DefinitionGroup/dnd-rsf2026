"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { stegaClean } from "next-sanity";
import ActionLink from "@/components/ActionLink";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
import SectionBackdrop, { hasBackdrop } from "@/components/SectionBackdrop";
import { backgroundClass } from "@/lib/section-background";
import { EASE_PRESENCE } from "@/lib/motion";
import type { BlockOf, BlockProps } from "@/blocks/types";

type LoadOption = NonNullable<BlockOf<"productFinderBlock">["loadOptions"]>[number];
type Rule = NonNullable<BlockOf<"productFinderBlock">["rules"]>[number];

const LITRES_PER_US_GAL = 3.785411784;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function num(value: number | undefined | null, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toGallons(litres: number) {
  return Math.round(litres / LITRES_PER_US_GAL);
}

/** Litres lead, US gallons sit underneath in grey — stacked, so the two ends of
 *  the scale can never crowd each other however long the numbers get. */
function Volume({ litres, align = "start" }: { litres: number; align?: "start" | "end" }) {
  return (
    <span className={`flex flex-col ${align === "end" ? "items-end text-right" : "items-start"}`}>
      <span className="whitespace-nowrap text-fg">
        {litres.toLocaleString("en")} <span className="figure-unit">L</span>
      </span>
      <span className="figure-unit whitespace-nowrap text-fg-muted">≈ {toGallons(litres).toLocaleString("en")} US gal</span>
    </span>
  );
}

/** First rule (in order) whose limit is empty or ≥ the effective volume. */
function pickRule(rules: Rule[], effective: number): number {
  const i = rules.findIndex((r) => {
    const max = num(r.maxEffectiveVolume, NaN);
    return !Number.isFinite(max) || effective <= max;
  });
  return i === -1 ? rules.length - 1 : i;
}

const RANGE_CLASS = [
  // The input sits transparent on top of a drawn track (see below). Vendor track
  // pseudo-elements stay invisible: a 1px gradient track rounds away to nothing on
  // some Android device pixel ratios, and if a browser ignores the pseudo-element
  // styling entirely we still fall back to a UA thumb on a track that is real DOM.
  "absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent",
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime",
  "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-transparent",
  "[&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-transparent",
  "[&::-moz-range-progress]:h-1 [&::-moz-range-progress]:bg-transparent",
  // thumb: white disc, centred on the 4px track ((4 - 20) / 2 = -8)
  "[&::-webkit-slider-thumb]:-mt-2 [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-hairline [&::-webkit-slider-thumb]:bg-white",
  "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-hairline [&::-moz-range-thumb]:bg-white",
].join(" ");

export default function ProductFinderBlock({ block }: BlockProps<"productFinderBlock">) {
  const rules = useMemo(() => (block.rules ?? []).filter((r) => r && r.resultTitle), [block.rules]);
  const options = useMemo(() => (block.loadOptions ?? []).filter((o) => o && o.label), [block.loadOptions]);

  const min = num(block.volumeMin, 50);
  const max = Math.max(min + 1, num(block.volumeMax, 1500));
  const step = max - min > 1000 ? 10 : max - min > 200 ? 5 : 1;
  const initial = clamp(num(block.volumeDefault, Math.round((min + max) / 2)), min, max);

  const [volume, setVolume] = useState(initial);
  const [volumeText, setVolumeText] = useState(String(initial));
  const [loadIndex, setLoadIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const uid = useId();

  if (rules.length === 0) return null;

  const option: LoadOption | undefined = options[Math.min(loadIndex, Math.max(0, options.length - 1))];
  const factor = num(option?.factor, 1);
  const rollFactor = num(option?.rollFactor, 1);
  const effective = volume * factor;
  const ruleIndex = pickRule(rules, effective);
  const rule = rules[ruleIndex];
  const gallons = toGallons(volume);
  const rollWeeks = typeof rule.rollWeeks === "number" ? Math.max(1, Math.round(rule.rollWeeks * rollFactor)) : null;
  const rollRange = rollWeeks ? `${Math.max(1, rollWeeks - 1)}–${rollWeeks + 1}` : null;
  const productName = rule.product?.name ?? null;
  const productImage = rule.product?.image ?? null;

  const commitVolume = (raw: number) => {
    if (!Number.isFinite(raw)) return;
    const next = clamp(Math.round(raw), min, max);
    setVolume(next);
    setVolumeText(String(next));
  };

  const pct = ((volume - min) / (max - min)) * 100;
  const media = { image: block.backgroundImage, video: block.backgroundVideo, muted: block.backgroundMuted };
  const backdrop = hasBackdrop(media);

  return (
    <section
      className={`${backgroundClass(block.background, "canvas-frost")} section-space page-gutter ${
        backdrop ? "relative isolate overflow-hidden on-dark" : ""
      }`}
    >
      <SectionBackdrop {...media} />
      <div className="container-site relative">
        {(block.headline || block.intro) && (
          <SectionHeader eyebrow={block.eyebrow} headline={block.headline} intro={block.intro} align="center" className="mb-12 md:mb-16" />
        )}

        {/* items-stretch (the grid default) keeps the input tile and the result card
            the same height instead of each sizing to its own content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ---------- Inputs ---------- */}
          <div className="tile flex h-full flex-col gap-8">
            {/* Bioload */}
            {options.length > 0 && (
              <div>
                <p id={`${uid}-load-label`} className="body-sm text-fg-muted">
                  {block.loadLabel ?? "Stocking / feeding"}
                </p>
                <div
                  role="radiogroup"
                  aria-labelledby={`${uid}-load-label`}
                  className="mt-3 grid grid-flow-col auto-cols-fr gap-1 rounded-[var(--radius-pill)] bg-pebble p-1"
                >
                  {options.map((o, i) => {
                    const selected = i === loadIndex;
                    return (
                      <button
                        key={o._key}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setLoadIndex(i)}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                            e.preventDefault();
                            setLoadIndex((loadIndex + 1) % options.length);
                          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                            e.preventDefault();
                            setLoadIndex((loadIndex - 1 + options.length) % options.length);
                          }
                        }}
                        className={`body-sm relative cursor-pointer rounded-[var(--radius-pill)] px-4 py-2 transition-colors duration-200 ${
                          selected ? "bg-lime text-carbon" : "text-fg-muted hover:text-fg"
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Volume */}
            <div>
              {/* Label sits over the readout, both centred on the tile. */}
              <div className="text-center">
                <label htmlFor={`${uid}-volume`} className="body-sm block text-fg-muted">
                  {block.volumeLabel ?? "Aquarium volume"}
                </label>
                <div className="mt-3 flex flex-wrap items-baseline justify-center gap-2">
                  <input
                    id={`${uid}-volume-number`}
                    type="number"
                    inputMode="numeric"
                    min={min}
                    max={max}
                    step={1}
                    value={volumeText}
                    aria-label={`${block.volumeLabel ?? "Aquarium volume"} in litres`}
                    onChange={(e) => {
                      setVolumeText(e.target.value);
                      const n = Number(e.target.value);
                      if (e.target.value !== "" && Number.isFinite(n)) setVolume(clamp(Math.round(n), min, max));
                    }}
                    onBlur={() => commitVolume(Number(volumeText))}
                    className="field num w-28 py-2 text-right text-[21px] font-semibold text-fg"
                  />
                  <span className="figure-unit text-[17px] text-fg">L</span>
                  <span className="figure-unit whitespace-nowrap text-[17px] text-fg-muted">≈ {gallons.toLocaleString("en")} US gal</span>
                </div>
              </div>

              <div className="relative mt-6 h-5">
                {/* Drawn track: plain elements at 4px, so it is visible at any device
                    pixel ratio and does not depend on vendor pseudo-element painting. */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-hairline">
                  <div className="h-full rounded-full bg-fg" style={{ width: `${pct}%` }} />
                </div>
                <input
                  id={`${uid}-volume`}
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={volume}
                  aria-valuemin={min}
                  aria-valuemax={max}
                  aria-valuenow={volume}
                  aria-valuetext={`${volume} litres, about ${gallons} US gallons`}
                  onChange={(e) => commitVolume(Number(e.target.value))}
                  className={RANGE_CLASS}
                />
              </div>

              <div className="caption num mt-3 flex items-start justify-between gap-4" aria-hidden="true">
                <Volume litres={min} align="start" />
                <Volume litres={max} align="end" />
              </div>
            </div>

            <p className="caption num" aria-hidden="true">
              Effective volume {Math.round(effective).toLocaleString("en")} L
            </p>
          </div>

          {/* ---------- Result ---------- */}
          <div className="relative min-h-[18rem]" role="region" aria-label={block.resultLabel ?? "Our recommendation"} aria-live="polite" aria-atomic="true">
            <AnimatePresence initial={false} mode="wait">
              <motion.article
                key={ruleIndex}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: EASE_PRESENCE }}
                className="tile flex h-full flex-col"
              >
                <div className="flex items-start gap-5">
                  {productImage?.asset && (
                    <div className="media relative size-24 shrink-0 bg-frost md:size-28">
                      <SanityImage image={productImage} alt={productName ?? rule.resultTitle} fill sizes="112px" className="object-contain" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-balance">{rule.resultTitle}</h4>
                    {productName && stegaClean(productName) !== stegaClean(rule.resultTitle) && <p className="body-sm mt-1 text-fg-muted">{productName}</p>}
                  </div>
                </div>

                {rule.resultBody && <p className="mt-3 text-fg-muted">{rule.resultBody}</p>}

                {(typeof rule.flowLph === "number" || rollRange) && (
                  <dl className="hairline mt-6 grid grid-cols-2 gap-6 border-t pt-6">
                    {typeof rule.flowLph === "number" && (
                      <div>
                        <dt className="body-sm text-fg-muted">Flow</dt>
                        <dd className="mt-2 flex items-baseline gap-1.5">
                          <span className="figure text-[clamp(1.625rem,7vw,2.5rem)] text-fg">{rule.flowLph.toLocaleString("en")}</span>
                          <span className="figure-unit text-[17px] text-fg-muted">L/h</span>
                        </dd>
                      </div>
                    )}
                    {rollRange && (
                      <div>
                        <dt className="body-sm text-fg-muted">{block.rollLifeLabel ?? "Expected roll life"}</dt>
                        <dd className="mt-2 flex items-baseline gap-1.5">
                          <span className="figure-unit text-[17px] text-fg-muted">≈</span>
                          <span className="figure text-[clamp(1.625rem,7vw,2.5rem)] text-fg">{rollRange}</span>
                          <span className="figure-unit text-[17px] text-fg-muted">weeks</span>
                        </dd>
                      </div>
                    )}
                  </dl>
                )}

                {rule.cta?.href && rule.cta.label && (
                  <div className="mt-auto pt-6">
                    <ActionLink link={rule.cta} variant="primary" />
                  </div>
                )}
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {block.footnote && <p className="caption mx-auto mt-8 max-w-[68ch] text-center">{block.footnote}</p>}
      </div>
    </section>
  );
}
