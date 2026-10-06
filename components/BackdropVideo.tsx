"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Props = {
  src: string;
  mimeType?: string | null;
  poster?: string;
};

/** Input that counts as a user gesture, so a play() inside it is allowed where autoplay is not. */
const GESTURES = ["click", "touchend", "keydown"] as const;

/**
 * The looping film behind a section. `autoPlay` gets it going before hydration,
 * but browsers drop that one attempt in a background tab, in Low Power Mode or
 * under strict autoplay settings, and the poster then stays up for good. So the
 * film is also started by hand whenever it is on screen, and if the browser
 * still refuses, the visitor's first tap, click or key press starts it — those
 * policies allow playback from a gesture.
 *
 * Reduced motion hides the element in CSS (the still behind it carries the
 * section) and nothing here starts it.
 */
export default function BackdropVideo({ src, mimeType, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduceMotion) {
      video.pause();
      return;
    }
    video.muted = true;

    let onScreen = false;
    const play = () => {
      if (onScreen && video.paused && !document.hidden) video.play().catch(() => {});
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) play();
      else video.pause();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", play);

    // A play() inside a gesture lifts the block for this element; off screen it pauses again straight away.
    const unlock = () => {
      video.play().then(
        () => {
          if (!onScreen) video.pause();
        },
        () => {},
      );
    };
    const stopListening = () => GESTURES.forEach((type) => document.removeEventListener(type, unlock));
    // Once the film has played, the browser allows it and the gesture fallback is done.
    if (video.paused && !video.played.length) {
      GESTURES.forEach((type) => document.addEventListener(type, unlock, { passive: true }));
      video.addEventListener("playing", stopListening, { once: true });
    }

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", play);
      video.removeEventListener("playing", stopListening);
      stopListening();
    };
  }, [reduceMotion]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
    >
      <source src={src} type={mimeType ?? undefined} />
    </video>
  );
}
