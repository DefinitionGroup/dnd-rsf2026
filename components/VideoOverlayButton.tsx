"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { EASE_OUT_EXPO, EASE_PRESENCE } from "@/lib/motion";
import { t, type Locale } from "@/lib/i18n";
import type { OverlayVideo } from "@/lib/overlay-video";

const FOCUSABLE = 'button, [href], video, iframe, [tabindex]:not([tabindex="-1"])';

/**
 * The opening: the room dims, then the frame irises open from a letterbox slit at
 * its centre line — a projector starting up rather than a box popping in — and the
 * close control arrives once the film is on screen. Closing runs it in reverse.
 */
function overlayVariants(still: boolean): { backdrop: Variants; dialog: Variants; frame: Variants; close: Variants } {
  const instant = { duration: 0 };
  if (still) {
    return {
      backdrop: { closed: { opacity: 0, transition: instant }, open: { opacity: 1, transition: instant } },
      dialog: { closed: {}, open: {} },
      frame: { closed: { opacity: 0, transition: instant }, open: { opacity: 1, transition: instant } },
      close: { closed: { opacity: 0, transition: instant }, open: { opacity: 1, transition: instant } },
    };
  }
  return {
    backdrop: {
      closed: { opacity: 0, transition: { duration: 0.24, ease: EASE_PRESENCE } },
      open: { opacity: 1, transition: { duration: 0.28, ease: EASE_PRESENCE } },
    },
    dialog: {
      closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
      open: { transition: { delayChildren: 0.08, staggerChildren: 0.14 } },
    },
    frame: {
      closed: { opacity: 0, scale: 0.97, clipPath: "inset(50% 0% 50% 0%)", transition: { duration: 0.3, ease: EASE_PRESENCE } },
      open: { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
    },
    close: {
      closed: { opacity: 0, y: 6, transition: { duration: 0.15 } },
      open: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE_PRESENCE } },
    },
  };
}

function PlayGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" className="shrink-0 fill-current">
      <path d="M8 5.5v13l10-6.5z" />
    </svg>
  );
}

/**
 * Hero CTA variant: one pill that opens the film in a modal player. Shared by
 * the hero blocks whose `videoButton` toggle replaces their CTA pills.
 *
 * The overlay is portalled to `<body>` so no ancestor's `overflow: hidden` or
 * animated transform can clip or contain it, and it only enters the tree after
 * the first open — which is always a click, so the portal never runs on the
 * server and the exit animation still has something to play out of.
 */
export default function VideoOverlayButton({
  label,
  video,
  alt,
  locale,
}: {
  label: string;
  video: OverlayVideo;
  alt: string;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openOverlay = () => {
    setEverOpened(true);
    setOpen(true);
  };

  const close = useCallback(() => {
    // stop the sound now rather than letting it bleed through the exit fade
    videoRef.current?.pause();
    setOpen(false);
  }, []);

  // Escape closes; the page underneath stops scrolling while the film is up.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Focus moves into the dialog on open and returns to the trigger on close.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    return () => trigger?.focus();
  }, [open]);

  const onDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const items = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!items?.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const variants = overlayVariants(reduceMotion);

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={openOverlay}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={{ duration: 0.12, ease: EASE_PRESENCE }}
        className="action-link action-link--primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
      >
        <PlayGlyph />
        <span>{label}</span>
      </motion.button>

      {everOpened &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="hero-video-overlay"
                variants={variants.backdrop}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={close}
                className="fixed inset-0 z-[120] flex items-center justify-center bg-black/92 p-[var(--gutter)] backdrop-blur-sm"
              >
                <motion.div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label={alt}
                  onKeyDown={onDialogKeyDown}
                  // the backdrop closes; the player itself must not
                  onClick={(event) => event.stopPropagation()}
                  variants={variants.dialog}
                  className="relative w-full max-w-[min(1200px,100%)]"
                >
                  <motion.div variants={variants.frame} className="media relative aspect-video w-full overflow-hidden bg-carbon">
                    {video.kind === "file" ? (
                      <video
                        ref={videoRef}
                        className="absolute inset-0 h-full w-full object-contain"
                        controls
                        autoPlay
                        playsInline
                        preload="auto"
                        poster={video.poster}
                        aria-label={alt}
                      >
                        <source src={video.src} type={video.mimeType ?? undefined} />
                      </video>
                    ) : (
                      <iframe
                        className="absolute inset-0 h-full w-full"
                        src={video.src}
                        title={alt}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    )}
                  </motion.div>

                  <motion.button
                    ref={closeRef}
                    type="button"
                    variants={variants.close}
                    onClick={close}
                    aria-label={t(locale, "close")}
                    className="absolute -top-12 right-0 grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
                  >
                    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
