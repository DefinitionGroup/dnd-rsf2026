"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { stegaClean } from "next-sanity";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { EASE_PRESENCE } from "@/lib/motion";
import Reveal from "@/components/motion/Reveal";
import type { BlockProps } from "@/blocks/types";

type Parsed = { target: number; decimals: number; group: "" | "," | "."; decimal: "." | "," };

/**
 * Parse a stat value into a single number we can count towards, preserving the
 * author's grouping/decimal characters ("5,000", "5.000", "12.5", "40").
 * Ranges ("8–10"), fractions ("32/40") and anything else return null → static.
 */
export function parseNumeric(raw: string): Parsed | null {
  const v = raw.trim();
  let m: RegExpMatchArray | null;
  if ((m = v.match(/^(\d{1,3}(?:,\d{3})+)$/))) return { target: Number(m[1].replace(/,/g, "")), decimals: 0, group: ",", decimal: "." };
  if ((m = v.match(/^(\d{1,3}(?:\.\d{3})+)$/))) return { target: Number(m[1].replace(/\./g, "")), decimals: 0, group: ".", decimal: "," };
  if ((m = v.match(/^(\d+)([.,])(\d+)$/))) {
    return { target: Number(`${m[1]}.${m[3]}`), decimals: m[3].length, group: "", decimal: m[2] as "." | "," };
  }
  if (/^\d+$/.test(v)) return { target: Number(v), decimals: 0, group: "", decimal: "." };
  return null;
}

export function formatNumeric(n: number, p: Parsed) {
  const [int, frac] = n.toFixed(p.decimals).split(".");
  const grouped = p.group ? int.replace(/\B(?=(\d{3})+(?!\d))/g, p.group) : int;
  return frac ? `${grouped}${p.decimal}${frac}` : grouped;
}

const TONES = {
  // lime = the accent lives on the figures, never the ground (OWN-WORLD lime discipline)
  lime: { section: "bg-paper text-ink", value: "text-lime-deep", label: "", rule: "hairline" },
  ink: { section: "stage", value: "text-lime", label: "", rule: "hairline" },
  paper: { section: "stage-sand text-ink", value: "text-ink", label: "", rule: "hairline" },
} as const;

type Tone = (typeof TONES)[keyof typeof TONES];
type StatItem = NonNullable<BlockProps<"statStripBlock">["block"]["stats"]>[number];

export default function StatStripBlock({ block }: BlockProps<"statStripBlock">) {
  const stats = block.stats ?? [];
  if (stats.length === 0) return null;
  const toneKey = stegaClean(block.tone);
  const tone = TONES[toneKey === "ink" || toneKey === "paper" ? toneKey : "lime"];
  const cols =
    stats.length <= 2
      ? "sm:grid-cols-2"
      : stats.length === 3
        ? "sm:grid-cols-3"
        : stats.length === 4
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : stats.length === 5
            ? "sm:grid-cols-3 lg:grid-cols-5"
            : "sm:grid-cols-3 lg:grid-cols-6";

  return (
    <section className={`section-space page-gutter ${tone.section}`}>
      <div className="container-site">
        {block.headline && (
          <Reveal className="mx-auto mb-12 max-w-[34ch] text-center md:mb-16">
            <h2 className="display-lg whitespace-pre-line">{block.headline}</h2>
          </Reveal>
        )}
        <dl className={`hairline grid grid-cols-2 gap-x-6 gap-y-10 border-y py-10 md:py-12 ${cols}`}>
          {stats.map((stat, i) => (
            <Stat key={stat._key} stat={stat} index={i} tone={tone} />
          ))}
        </dl>
      </div>
    </section>
  );
}

function Stat({ stat, index, tone }: { stat: StatItem; index: number; tone: Tone }) {
  const parsed = parseNumeric(stat.value);
  return (
    <div className="flex flex-col items-start text-left">
      <dd className={`figure order-1 text-display-xl ${tone.value}`}>
        {stat.prefix && <span className="figure-unit mr-1 align-top text-[0.4em]">{stat.prefix}</span>}
        {parsed ? <CountUp parsed={parsed} raw={stat.value} delay={index * 0.08} /> : <span>{stat.value}</span>}
        {stat.suffix && <span className="figure-unit ml-1.5 text-[0.4em]">{stat.suffix}</span>}
      </dd>
      <dt className={`label order-2 mt-4 ${tone.label}`}>{stat.label}</dt>
    </div>
  );
}

const subscribeNoop = () => () => {};

function CountUp({ parsed, raw, delay }: { parsed: Parsed; raw: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  // SSR / pre-hydration renders the author's exact string (SEO, no-JS); the count-up only starts on the client.
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const mv = useMotionValue(0);
  const text = useTransform(() => formatNumeric(mv.get(), parsed));

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      mv.set(parsed.target);
      return;
    }
    const controls = animate(mv, parsed.target, { duration: 1.6, delay, ease: EASE_PRESENCE });
    return () => controls.stop();
  }, [inView, reduceMotion, mv, parsed, delay]);

  // Reduced motion / no JS: the author's exact string. Otherwise a MotionValue
  // drives textContent directly (no re-render per frame).
  if (reduceMotion || !hydrated) return <span ref={ref}>{raw}</span>;
  return (
    <motion.span ref={ref} aria-label={raw}>
      {text}
    </motion.span>
  );
}
