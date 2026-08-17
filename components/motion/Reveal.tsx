"use client";

import { motion, useReducedMotion } from "motion/react";
import { DURATION_REVEAL, EASE_PRESENCE, REVEAL_VIEWPORT } from "@/lib/motion";

export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={reduceMotion ? { duration: 0, delay: 0 } : { duration: DURATION_REVEAL, delay, ease: EASE_PRESENCE }}
    >
      {children}
    </Tag>
  );
}
