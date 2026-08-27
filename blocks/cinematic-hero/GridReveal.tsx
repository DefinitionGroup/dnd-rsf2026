"use client";

import { useEffect, useRef } from "react";

/**
 * Entrance mask: a grid of black cells covering the film. Each cell flickers
 * (a two-blink stutter, some flashing to the carbon lift tone) in random order
 * before clearing, while faint hairlines trace the grid and dissolve last.
 * Pure canvas 2D — one paint layer, no DOM churn — and self-unmounts via onDone.
 */
export default function GridReveal({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      doneRef.current();
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.scale(dpr, dpr);

    const cols = Math.min(18, Math.max(8, Math.round(w / 130)));
    const rows = Math.min(12, Math.max(5, Math.round(h / 130)));
    const cw = w / cols;
    const ch = h / rows;
    const cells = Array.from({ length: cols * rows }, () => ({
      delay: Math.random() * 0.85,
      carbon: Math.random() < 0.14,
    }));

    const FLICKER = 0.55; // per-cell flicker length (s)
    const TOTAL = 2.0;

    /** Two quick blinks, then a decaying clear. u in [0,1] across the cell's flicker. */
    const cellAlpha = (u: number) => {
      if (u <= 0) return 1;
      if (u >= 1) return 0;
      if (u < 0.14) return 1;
      if (u < 0.22) return 0.15;
      if (u < 0.34) return 0.92;
      if (u < 0.44) return 0.3;
      return 0.9 * (1 - (u - 0.44) / 0.56);
    };

    const lineAlpha = (t: number) => {
      const rise = Math.min(1, t / 0.3);
      const fall = t < 1.25 ? 1 : Math.max(0, 1 - (t - 1.25) / 0.7);
      return 0.09 * rise * fall;
    };

    let raf = 0;
    const start = performance.now();

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const cell = cells[j * cols + i];
          const u = (t - cell.delay) / FLICKER;
          const a = cellAlpha(u);
          if (a <= 0.01) continue;
          ctx.globalAlpha = a;
          // Carbon cells lift to #1d1d1f during the open blink — a stutter of the lift tone.
          ctx.fillStyle = cell.carbon && u > 0.14 && u < 0.44 ? "#1d1d1f" : "#000000";
          ctx.fillRect(i * cw - 0.5, j * ch - 0.5, cw + 1, ch + 1);
        }
      }

      const la = lineAlpha(t);
      if (la > 0.003) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = `rgba(255,255,255,${la})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 1; i < cols; i++) {
          ctx.moveTo(Math.round(i * cw) + 0.5, 0);
          ctx.lineTo(Math.round(i * cw) + 0.5, h);
        }
        for (let j = 1; j < rows; j++) {
          ctx.moveTo(0, Math.round(j * ch) + 0.5);
          ctx.lineTo(w, Math.round(j * ch) + 0.5);
        }
        ctx.stroke();
      }

      if (t >= TOTAL) {
        doneRef.current();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
