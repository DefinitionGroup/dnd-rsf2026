"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { stegaClean } from "next-sanity";
import { EASE_PRESENCE } from "@/lib/motion";
import type { BlockProps } from "@/blocks/types";

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "105%" },
  visible: { opacity: 1, y: "0%", transition: { duration: 0.76, ease: EASE_PRESENCE } },
};

/**
 * Word-mask headline: each word rises out of its own overflow-hidden mask.
 * Sentence case, display-lg, left aligned. The eyebrow field is not rendered.
 */
export default function AnimatedHeadlineBlock({ block }: BlockProps<"animatedHeadlineBlock">) {
  const reduceMotion = useReducedMotion();
  const words = block.headline.trim().split(/\s+/);
  const level = stegaClean(block.level) === "h1" ? "h1" : "h2";
  const Heading = level === "h1" ? motion.h1 : motion.h2;

  return (
    <motion.section
      className="section-space page-gutter bg-paper"
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ visible: { transition: { delayChildren: 0.04, staggerChildren: 0.055 } } }}
    >
      <div className="container-site">
        <Heading aria-label={block.headline} className="display-lg max-w-[24ch]">
          <span aria-hidden="true" className="flex flex-wrap gap-x-[0.28em] gap-y-1">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.08em]">
                <motion.span className="inline-block will-change-transform" variants={wordVariants}>
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        </Heading>
      </div>
    </motion.section>
  );
}
