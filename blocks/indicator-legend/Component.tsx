"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { stegaClean } from "next-sanity";
import SectionHeader from "@/components/SectionHeader";
import { EASE_PRESENCE } from "@/lib/motion";
import type { BlockOf, BlockProps } from "@/blocks/types";

type Signal = NonNullable<BlockOf<"indicatorLegendBlock">["signals"]>[number];
type LedColor = "blue" | "red" | "blueRed" | "off";
type Pattern = "solid" | "flash" | "pulse";
type Severity = "info" | "warning" | "alarm";

const BLUE = "#3b82f6";
const RED = "#ef4444";
const OFF = "#3a3a3a";

function ledColor(v: string | undefined): LedColor {
  const c = stegaClean(v);
  return c === "red" || c === "blueRed" || c === "off" ? c : "blue";
}
function pattern(v: string | undefined): Pattern {
  const p = stegaClean(v);
  return p === "flash" || p === "pulse" ? p : "solid";
}
function severity(v: string | undefined): Severity {
  const s = stegaClean(v);
  return s === "warning" || s === "alarm" ? s : "info";
}
function hasSound(v: string | undefined) {
  const s = stegaClean(v)?.trim().toLowerCase();
  return Boolean(s) && s !== "none" && s !== "no" && s !== "-" && s !== "–" && s !== "—";
}

const SEVERITY_CHIP: Record<Severity, string> = {
  info: "bg-pebble text-carbon",
  warning: "bg-pebble text-carbon",
  alarm: "bg-[#fde8e6] text-danger",
};
const SEVERITY_LABEL: Record<Severity, string> = { info: "Normal", warning: "Warning", alarm: "Alarm" };
const PATTERN_LABEL: Record<Pattern, string> = { solid: "solid", flash: "flashing", pulse: "slow pulse" };
const COLOR_LABEL: Record<LedColor, string> = { blue: "Blue", red: "Red", blueRed: "Blue / red", off: "Off" };

function SeverityChip({ severity: sev }: { severity: Severity }) {
  return <span className={`caption shrink-0 rounded-[var(--radius-pill)] px-2.5 py-1 ${SEVERITY_CHIP[sev]}`}>{SEVERITY_LABEL[sev]}</span>;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 text-ash transition-transform duration-300 ease-[var(--ease-out-expo)] ${open ? "rotate-180" : ""}`}
    >
      <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Block                                                               */
/* ------------------------------------------------------------------ */

export default function IndicatorLegendBlock({ block }: BlockProps<"indicatorLegendBlock">) {
  const signals = (block.signals ?? []).filter((s) => s && s.name);
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const uid = useId();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (signals.length === 0) return null;

  const active = signals[Math.min(selected, signals.length - 1)];

  const focusAndSelect = (i: number) => {
    const next = (i + signals.length) % signals.length;
    setSelected(next);
    buttonRefs.current[next]?.focus();
  };

  return (
    <section className="canvas-white section-space page-gutter">
      <div className="container-site">
        {(block.headline || block.intro) && <SectionHeader headline={block.headline} intro={block.intro} className="mb-12 md:mb-16" />}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* ---------- Device ---------- */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Device signal={active} label={block.deviceLabel} reduceMotion={Boolean(reduceMotion)} />
          </div>

          {/* ---------- Signal list ---------- */}
          <ul className="hairline flex flex-col border-t" aria-label={block.headline ?? "Indicator states"}>
            {signals.map((s, i) => {
              const isActive = i === selected;
              const sev = severity(s.severity);
              const panelId = `${uid}-panel-${i}`;
              return (
                <li key={s._key} className="hairline border-b">
                  <button
                    ref={(el) => {
                      buttonRefs.current[i] = el;
                    }}
                    type="button"
                    aria-pressed={isActive}
                    aria-controls={panelId}
                    onClick={() => setSelected(i)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        focusAndSelect(i + 1);
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        focusAndSelect(i - 1);
                      } else if (e.key === "Home") {
                        e.preventDefault();
                        focusAndSelect(0);
                      } else if (e.key === "End") {
                        e.preventDefault();
                        focusAndSelect(signals.length - 1);
                      }
                    }}
                    className={`flex w-full cursor-pointer items-center gap-4 py-5 text-left transition-colors duration-200 ${
                      isActive ? "text-carbon" : "text-carbon hover:text-ash"
                    }`}
                  >
                    <MiniLed color={ledColor(s.ledColor)} />
                    <span className="body min-w-0 flex-1 font-semibold">{s.name}</span>
                    <SeverityChip severity={sev} />
                    <ChevronIcon open={isActive} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        id={panelId}
                        key="panel"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: EASE_PRESENCE }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-5 pb-6 pl-7 pr-2 sm:grid-cols-2">
                          <dl className="contents">
                            <div>
                              <dt className="body-sm text-ash">Signal</dt>
                              <dd className="mt-1 text-carbon">
                                LED {COLOR_LABEL[ledColor(s.ledColor)].toLowerCase()}, {PATTERN_LABEL[pattern(s.pattern)]}
                                {s.sound ? ` · ${s.sound}` : ""}
                              </dd>
                            </div>
                            {s.meaning && (
                              <div>
                                <dt className="body-sm text-ash">What it means</dt>
                                <dd className="mt-1 text-carbon">{s.meaning}</dd>
                              </div>
                            )}
                            {s.action && (
                              <div className="sm:col-span-2">
                                <dt className="body-sm text-ash">What to do</dt>
                                <dd className="mt-1 font-semibold text-carbon">{s.action}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Device panel                                                        */
/* ------------------------------------------------------------------ */

function Device({ signal, label, reduceMotion }: { signal: Signal; label: string | undefined; reduceMotion: boolean }) {
  const color = ledColor(signal.ledColor);
  const pat = pattern(signal.pattern);
  const sound = hasSound(signal.sound);
  const sev = severity(signal.severity);

  return (
    <div
      className="tile flex flex-col gap-3"
      role="img"
      aria-label={`${label ?? "Smart controller"}: LED ${COLOR_LABEL[color].toLowerCase()} ${PATTERN_LABEL[pat]}${signal.sound ? `, ${signal.sound}` : ""}`}
    >
      <span className="body-sm text-ash">{label ?? "Smart controller"}</span>

      {/* LED + speaker on the tile itself (no mock device screen) */}
      <div className="flex items-center justify-between gap-6 border-b border-hairline px-1 py-6">
        <Led color={color} pattern={pat} reduceMotion={reduceMotion} />
        <span className="caption">{sound ? "Sound: on" : "Sound: silent"}</span>
      </div>

      {/* Readout */}
      <div className="mt-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={signal._key}
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -4 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: EASE_PRESENCE }}
              className="body font-semibold text-carbon"
            >
              {signal.name}
            </motion.span>
          </AnimatePresence>
          <SeverityChip severity={sev} />
        </div>
        <p className="caption">
          {COLOR_LABEL[color]} · {PATTERN_LABEL[pat]}
          {sound ? ` · ${signal.sound}` : " · silent"}
        </p>
        {signal.meaning && <p className="caption">{signal.meaning}</p>}
        {signal.action && <p className="caption text-carbon">{signal.action}</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LED                                                                 */
/* ------------------------------------------------------------------ */

function ledAnimation(color: LedColor, pat: Pattern) {
  const on = color === "red" ? RED : color === "off" ? OFF : BLUE;
  const glowOn = color === "off" ? "0 0 0 0 transparent" : `0 0 18px 4px ${on}`;
  const glowOff = "0 0 0 0 transparent";
  const glowRed = `0 0 18px 4px ${RED}`;

  if (color === "off") return { animate: { backgroundColor: OFF, boxShadow: glowOff }, transition: { duration: 0.3 } };

  if (color === "blueRed") {
    if (pat === "pulse") {
      return {
        animate: { backgroundColor: [BLUE, RED, BLUE], boxShadow: [`0 0 18px 4px ${BLUE}`, glowRed, `0 0 18px 4px ${BLUE}`] },
        transition: { duration: 2, ease: "easeInOut" as const, repeat: Infinity },
      };
    }
    // flash (or solid → treat as alternate)
    return {
      animate: { backgroundColor: [BLUE, BLUE, RED, RED, BLUE], boxShadow: [`0 0 18px 4px ${BLUE}`, `0 0 18px 4px ${BLUE}`, glowRed, glowRed, `0 0 18px 4px ${BLUE}`] },
      transition: { duration: 1, ease: "linear" as const, times: [0, 0.499, 0.5, 0.999, 1], repeat: Infinity },
    };
  }

  if (pat === "flash") {
    return {
      animate: { opacity: [1, 1, 0.12, 0.12, 1], boxShadow: [glowOn, glowOn, glowOff, glowOff, glowOn], backgroundColor: on },
      transition: { duration: 1, ease: "linear" as const, times: [0, 0.499, 0.5, 0.999, 1], repeat: Infinity },
    };
  }
  if (pat === "pulse") {
    return {
      animate: { opacity: [1, 0.25, 1], boxShadow: [glowOn, glowOff, glowOn], backgroundColor: on },
      transition: { duration: 2, ease: "easeInOut" as const, repeat: Infinity },
    };
  }
  return { animate: { opacity: 1, boxShadow: glowOn, backgroundColor: on }, transition: { duration: 0.3 } };
}

function Led({ color, pattern: pat, reduceMotion }: { color: LedColor; pattern: Pattern; reduceMotion: boolean }) {
  const staticColor = color === "red" ? RED : color === "off" ? OFF : BLUE;
  return (
    <div className="flex items-center gap-4">
      <div className="relative grid size-16 place-items-center rounded-full bg-onyx">
        {reduceMotion ? (
          <span
            className="block size-7 rounded-full"
            style={{
              background: color === "blueRed" ? `linear-gradient(135deg, ${BLUE} 50%, ${RED} 50%)` : staticColor,
              boxShadow: color === "off" ? "none" : `0 0 18px 4px ${color === "blueRed" ? BLUE : staticColor}`,
            }}
          />
        ) : (
          <motion.span key={`${color}-${pat}`} className="block size-7 rounded-full" initial={false} {...ledAnimation(color, pat)} style={{ willChange: "opacity, background-color, box-shadow" }} />
        )}
      </div>
      <div className="body-sm leading-relaxed">
        <span className="block text-mist">LED</span>
        <span className="block text-white">{COLOR_LABEL[color]}</span>
        <span className="block text-mist">{PATTERN_LABEL[pat]}</span>
      </div>
    </div>
  );
}

function MiniLed({ color }: { color: LedColor }) {
  const c = color === "red" ? RED : color === "off" ? OFF : BLUE;
  return (
    <span
      aria-hidden="true"
      className="block size-3 shrink-0 rounded-full"
      style={{ background: color === "blueRed" ? `linear-gradient(135deg, ${BLUE} 50%, ${RED} 50%)` : c, boxShadow: color === "off" ? "none" : `0 0 8px 1px ${c}` }}
    />
  );
}
