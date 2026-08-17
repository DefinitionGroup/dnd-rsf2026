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
  const rollRange = rollWeeks ? `≈ ${Math.max(1, rollWeeks - 1)}–${rollWeeks + 1} weeks` : null;
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
    <section className="on-dark section-space page-gutter bg-ink text-paper">
      <div className="container-site">
        {(block.eyebrow || block.headline || block.intro) && (
          <SectionHeader
            eyebrow={block.eyebrow}
            headline={block.headline}
            intro={block.intro}
            className="mb-10 md:mb-14 [&_.eyebrow]:text-lime [&_h2]:text-paper [&_p:not(.eyebrow)]:text-paper/70"
          />
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          {/* ---------- Inputs ---------- */}
          <div className="flex flex-col gap-10 rounded-[var(--radius-media,1rem)] border border-paper/10 bg-ink-soft p-6 md:p-8">
            {/* Volume */}
            <div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <label htmlFor={`${uid}-volume`} className="font-display text-xs uppercase tracking-[0.2em] text-lime">
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
                    className="w-24 rounded-md border border-paper/15 bg-ink px-3 py-1.5 text-right font-display text-2xl tabular-nums text-paper focus-visible:outline-2 focus-visible:outline-lime"
                  />
                  <span className="font-display text-sm uppercase tracking-wider text-paper/70">l</span>
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
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[linear-gradient(to_right,var(--color-lime)_var(--pct),rgb(255_255_255_/_0.15)_var(--pct))] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-lime [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-lime [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_var(--color-lime)]"
                />
                <div className="mt-2 flex justify-between font-display text-[11px] uppercase tracking-wider text-paper/50" aria-hidden="true">
                  <span>{min} l</span>
                  <span className="text-paper/70">≈ {gallons} US gal</span>
                  <span>{max} l</span>
                </div>
              </div>
            </div>

            {/* Bioload */}
            {options.length > 0 && (
              <div>
                <p id={`${uid}-load-label`} className="font-display text-xs uppercase tracking-[0.2em] text-lime">
                  {block.loadLabel ?? "Stocking / feeding"}
                </p>
                <div role="radiogroup" aria-labelledby={`${uid}-load-label`} className="mt-4 grid grid-cols-1 gap-2 rounded-lg border border-paper/10 bg-ink p-1 sm:grid-flow-col sm:auto-cols-fr">
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
                        className={`relative rounded-md px-4 py-2.5 font-display text-sm uppercase tracking-wider transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-lime ${
                          selected ? "bg-lime text-ink" : "text-paper/75 hover:bg-paper/5 hover:text-paper"
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="font-display text-[11px] uppercase tracking-wider text-paper/40" aria-hidden="true">
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
                className="flex h-full flex-col rounded-[var(--radius-media,1rem)] border border-lime/40 bg-gradient-to-br from-lime/10 to-transparent p-6 md:p-8"
              >
                <p className="eyebrow !text-lime">{block.resultLabel ?? "Our recommendation"}</p>

                <div className="mt-4 flex items-start gap-4">
                  {productImage?.asset && (
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-paper/10 bg-paper/5 md:size-24">
                      <SanityImage image={productImage} alt={productName ?? rule.resultTitle} fill sizes="96px" className="object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl uppercase leading-tight text-paper md:text-3xl">{rule.resultTitle}</h3>
                    {productName && stegaClean(productName) !== stegaClean(rule.resultTitle) &&<p className="mt-1 text-sm text-paper/60">{productName}</p>}
                  </div>
                </div>

                {rule.resultBody && <p className="mt-4 text-paper/75">{rule.resultBody}</p>}

                {(typeof rule.flowLph === "number" || rollRange) && (
                  <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-paper/10 pt-5">
                    {typeof rule.flowLph === "number" && (
                      <div>
                        <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-paper/50">Flow</dt>
                        <dd className="mt-1 font-display text-2xl tabular-nums text-lime">
                          {rule.flowLph.toLocaleString("en")} <span className="text-sm text-paper/70">l/h</span>
                        </dd>
                      </div>
                    )}
                    {rollRange && (
                      <div>
                        <dt className="font-display text-[11px] uppercase tracking-[0.2em] text-paper/50">{block.rollLifeLabel ?? "Expected roll life"}</dt>
                        <dd className="mt-1 font-display text-2xl tabular-nums text-lime">{rollRange}</dd>
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

        {block.footnote && <p className="mt-6 max-w-3xl text-sm text-paper/50">{block.footnote}</p>}
      </div>
    </section>
  );
}
