"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";

type Props = {
  src: string;
  mimeType?: string | null;
  poster?: string;
  alt: string;
  /** Muted, plays while on screen, small pause control. Off: poster + play button, then sound and native controls. */
  autoplay: boolean;
  loop: boolean;
  objectFit: "cover" | "contain";
  /** Original proportions: once the file's metadata is in, the frame takes the video's own ratio. */
  followRatio: boolean;
  frameClassName: string;
  frameStyle: CSSProperties;
  labels: { play: string; pause: string };
};

export default function MediaVideo({ src, mimeType, poster, alt, autoplay, loop, objectFit, followRatio, frameClassName, frameStyle, labels }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const ambient = autoplay && !reduceMotion;
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null);
  // Once a visitor pauses, scrolling back into view must not restart the loop.
  const pausedByVisitor = useRef(false);

  const readRatio = (video: HTMLVideoElement) => {
    if (followRatio && video.videoWidth && video.videoHeight) setRatio(video.videoWidth / video.videoHeight);
  };

  // Metadata can arrive before hydration attaches onLoadedMetadata.
  useEffect(() => {
    const video = ref.current;
    if (followRatio && video && video.readyState >= 1 && video.videoWidth && video.videoHeight) setRatio(video.videoWidth / video.videoHeight);
  }, [followRatio]);

  // Ambient loops only run while at least a quarter of the frame is on screen.
  useEffect(() => {
    const video = ref.current;
    if (!video || !ambient) return;
    video.muted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!pausedByVisitor.current) video.play().catch(() => setPlaying(false));
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [ambient]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      pausedByVisitor.current = false;
      video.muted = true;
      video.play().catch(() => setPlaying(false));
    } else {
      pausedByVisitor.current = true;
      video.pause();
    }
  };

  const start = () => {
    const video = ref.current;
    setStarted(true);
    if (!video) return;
    video.muted = false;
    video.play().catch(() => setPlaying(false));
  };

  const style = followRatio && ratio ? ({ ...frameStyle, "--media-ratio": ratio } as CSSProperties) : frameStyle;

  return (
    <div className={frameClassName} style={style}>
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full ${objectFit === "contain" ? "object-contain" : "object-cover"}`}
        poster={poster}
        muted={autoplay}
        loop={loop}
        playsInline
        preload="metadata"
        controls={!autoplay && started}
        aria-label={alt}
        onLoadedMetadata={(e) => readRatio(e.currentTarget)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        <source src={src} type={mimeType ?? undefined} />
      </video>

      {autoplay ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? labels.pause : labels.play}
          className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-carbon/70 text-white transition-colors duration-200 hover:bg-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:bottom-4 md:right-4"
        >
          {playing ? (
            <svg aria-hidden viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg aria-hidden viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="translate-x-px">
              <path d="M7 4.5v15l12-7.5z" />
            </svg>
          )}
        </button>
      ) : (
        !started && (
          <button
            type="button"
            onClick={start}
            aria-label={`${labels.play}: ${alt}`}
            className="group absolute inset-0 grid h-full w-full place-items-center focus-visible:outline-offset-[-4px]"
          >
            <span className="grid size-[72px] place-items-center rounded-full bg-white text-carbon transition-transform duration-300 ease-out-expo group-hover:scale-105">
              <svg aria-hidden viewBox="0 0 24 24" width="26" height="26" fill="currentColor" className="translate-x-[2px]">
                <path d="M8 5.5v13l10-6.5z" />
              </svg>
            </span>
          </button>
        )
      )}
    </div>
  );
}
