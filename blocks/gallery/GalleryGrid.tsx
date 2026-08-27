"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { stegaClean } from "next-sanity";
import Reveal from "@/components/motion/Reveal";
import SanityImage from "@/components/SanityImage";
import { EASE_PRESENCE } from "@/lib/motion";
import type { BlockOf } from "@/blocks/types";

type GalleryImage = NonNullable<BlockOf<"galleryBlock">["images"]>[number];

/* Zoom-overlay choreography: backdrop fades, the image rises into place,
   the caption follows word by word, the close control arrives last. */
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.28, ease: "easeIn" } },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 28 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { delay: 0.14, duration: 0.8, ease: EASE_PRESENCE } },
};

const captionVariants: Variants = {
  visible: { transition: { delayChildren: 0.5, staggerChildren: 0.05 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.5em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.56, ease: EASE_PRESENCE } },
};

const closeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.72, duration: 0.4, ease: EASE_PRESENCE } },
};

export default function GalleryGrid({ images, className = "" }: { images: GalleryImage[]; className?: string }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<GalleryImage | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setActive(null);
    triggerRef.current?.focus({ preventScroll: true });
    triggerRef.current = null;
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [active, close]);

  const words = active?.caption ? stegaClean(active.caption).trim().split(/\s+/).filter(Boolean) : [];

  return (
    <>
      <ul className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`.trim()} role="list">
        {images.map((item, index) => {
          const wide = images.length % 3 === 1 && index === 0;
          return (
            <Reveal key={item._key} as="li" delay={(index % 3) * 60} className={wide ? "md:col-span-2" : ""}>
              <figure>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={`View larger: ${item.alt}`}
                  className="group block w-full cursor-zoom-in"
                  onClick={(event) => {
                    triggerRef.current = event.currentTarget;
                    setActive(item);
                  }}
                >
                  <span className={`media relative block overflow-hidden ${wide ? "aspect-square md:aspect-[2/1]" : "aspect-square"}`}>
                    <SanityImage
                      image={item.image}
                      alt={item.alt}
                      fill
                      sizes={wide ? "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                      className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  </span>
                </button>
                {item.caption && <figcaption className="caption mt-3 text-center">{item.caption}</figcaption>}
              </figure>
            </Reveal>
          );
        })}
      </ul>

      <AnimatePresence>
        {active && (
          <motion.div
            key={active._key}
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
            className="page-gutter fixed inset-0 z-50 flex flex-col items-center justify-center bg-onyx/95 backdrop-blur-md"
            variants={overlayVariants}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            exit="exit"
          >
            <button type="button" tabIndex={-1} aria-hidden="true" className="absolute inset-0 cursor-zoom-out" onClick={close} />

            <motion.figure variants={imageVariants} className="pointer-events-none flex w-full max-w-5xl flex-col items-center will-change-transform">
              <div className="relative h-[min(66vh,720px)] w-full">
                <SanityImage image={active.image} alt={active.alt} fill sizes="90vw" className="object-contain" />
              </div>

              {words.length > 0 && (
                <figcaption className="heading-lg mt-8 max-w-[28ch] text-balance text-center text-white">
                  <span className="sr-only">{words.join(" ")}</span>
                  <motion.span aria-hidden="true" variants={captionVariants} className="flex flex-wrap justify-center gap-x-[0.28em]">
                    {words.map((word, index) => (
                      <motion.span key={`${word}-${index}`} variants={wordVariants} className="inline-block will-change-transform">
                        {word}
                      </motion.span>
                    ))}
                  </motion.span>
                </figcaption>
              )}
            </motion.figure>

            <motion.button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              variants={closeVariants}
              className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-lime hover:text-lime md:right-8 md:top-8"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
