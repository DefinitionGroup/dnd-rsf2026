"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { stegaClean } from "next-sanity";
import ActionLink from "@/components/ActionLink";
import SanityImage from "@/components/SanityImage";
import SectionHeader from "@/components/SectionHeader";
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

/** First rule (in order) whose limit is empty or ≥ the effective volume. */
function pickRule(rules: Rule[], effective: number): number {
  const i = rules.findIndex((r) => {
    const max = num(r.maxEffectiveVolume, NaN);
    return !Number.isFinite(max) || effective <= max;
  });
  return i === -1 ? rules.length - 1 : i;
}

const RANGE_CLASS = [
  "h-5 w-full cursor-pointer appearance-none bg-transparent",
  // track: hairline with lime fill up to --pct
  "[&::-webkit-slider-runnable-track]:h-0.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--color-lime)_var(--pct),var(--color-line-dark)_var(--pct))]",
  "[&::-moz-range-track]:h-0.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[linear-gradient(to_right,var(--color-lime)_var(--pct),var(--color-line-dark)_var(--pct))]",
  // thumb: white disc
  "[&::-webkit-slider-thumb]:-mt-[9px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-paper [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgb(0_0_0/0.4)]",
  "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-paper [&::-moz-range-thumb]:shadow-[0_2px_6px_rgb(0_0_0/0.4)]",
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
  const gallons = Math.round(volume / LITRES_PER_US_GAL);
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

  return (
    <section className="stage section-space page-gutter">
      <div className="container-site">
        {(block.headline || block.intro) && (
          <SectionHeader headline={block.headline} intro={block.intro} align="center" className="mb-12 md:mb-16" />
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
          {/* ---------- Inputs ---------- */}
          <div className="card flex flex-col gap-10 p-7 md:p-8">
            {/* Volume */}
            <div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <label htmlFor={`${uid}-volume`} className="label">
                  {block.volumeLabel ?? "Aquarium volume"}
                </label>
                <div className="flex items-baseline gap-2">
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
                    className="hairline num w-28 rounded-xl border bg-transparent px-3 py-2 text-right text-2xl font-semibold text-paper"
                  />
                  <span className="figure-unit text-base text-muted-dark">l</span>
                </div>
              </div>

              <div className="relative mt-5">
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
                  style={{ ["--pct" as string]: `${pct}%` }}
                  className={RANGE_CLASS}
                />
                <div className="caption num mt-2 flex justify-between" aria-hidden="true">
                  <span>{min} l</span>
                  <span className="text-paper/80">≈ {gallons} US gal</span>
                  <span>{max} l</span>
                </div>
              </div>
            </div>

            {/* Bioload */}
            {options.length > 0 && (
              <div>
                <p id={`${uid}-load-label`} className="label">
                  {block.loadLabel ?? "Stocking / feeding"}
                </p>
                <div
                  role="radiogroup"
                  aria-labelledby={`${uid}-load-label`}
                  className="mt-4 grid grid-cols-1 gap-1 rounded-[var(--radius-pill)] bg-paper/10 p-1 sm:grid-flow-col sm:auto-cols-fr"
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
                        className={`relative rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                          selected ? "bg-paper text-ink" : "text-muted-dark hover:text-paper"
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="caption num" aria-hidden="true">
              Effective volume {Math.round(effective)} l
            </p>
          </div>

          {/* ---------- Result ---------- */}
          <div className="relative min-h-[18rem]" aria-live="polite" aria-atomic="true">
            <AnimatePresence initial={false} mode="wait">
              <motion.article
                key={ruleIndex}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: EASE_PRESENCE }}
                className="card flex h-full flex-col p-7 md:p-8"
              >
                <p className="label">{block.resultLabel ?? "Our recommendation"}</p>

                <div className="mt-4 flex items-start gap-5">
                  {productImage?.asset && (
                    <div className="media relative size-20 shrink-0 md:size-24">
                      <SanityImage image={productImage} alt={productName ?? rule.resultTitle} fill sizes="96px" className="object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-2xl font-semibold leading-tight text-paper">{rule.resultTitle}</h3>
                    {productName && stegaClean(productName) !== stegaClean(rule.resultTitle) && <p className="label mt-1">{productName}</p>}
                  </div>
                </div>

                {rule.resultBody && <p className="mt-4 text-muted-dark">{rule.resultBody}</p>}

                {(typeof rule.flowLph === "number" || rollRange) && (
                  <dl className="hairline mt-6 grid grid-cols-2 gap-6 border-t pt-6">
                    {typeof rule.flowLph === "number" && (
                      <div>
                        <dt className="label">Flow</dt>
                        <dd className="mt-2 flex items-baseline gap-1.5">
                          <span className="figure text-4xl text-lime md:text-5xl">{rule.flowLph.toLocaleString("en")}</span>
                          <span className="figure-unit text-base text-muted-dark">l/h</span>
                        </dd>
                      </div>
                    )}
                    {rollRange && (
                      <div>
                        <dt className="label">{block.rollLifeLabel ?? "Expected roll life"}</dt>
                        <dd className="mt-2 flex items-baseline gap-1.5">
                          <span className="figure-unit text-base text-muted-dark">≈</span>
                          <span className="figure text-4xl text-lime md:text-5xl">{rollRange}</span>
                          <span className="figure-unit text-base text-muted-dark">weeks</span>
                        </dd>
                      </div>
                    )}
                  </dl>
                )}

                {rule.cta?.href && rule.cta.label && (
                  <div className="mt-auto pt-8">
                    <ActionLink link={rule.cta} variant="primary" />
                  </div>
                )}
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {block.footnote && <p className="caption mt-8 max-w-[68ch]">{block.footnote}</p>}
      </div>
    </section>
  );
}
