"use client";

import { useEffect, useRef } from "react";

/**
 * Persistent grid texture (schema toggle): after the entrance hands off, the
 * grid stays faintly alive over the film — hairlines at 5% white while every
 * cell breathes a dark wash at its own period and phase, with a rare two-step
 * flicker echoing the entrance stutter. One canvas, ~30 fps, paused offscreen.
 * With `animate` false (reduced motion) it draws the hairlines once and stops.
 */
export default function GridLoop({ animate }: { animate: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let cells: { period: number; phase: number; depth: number; nextFlicker: number }[] = [];

    const layout = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.min(18, Math.max(8, Math.round(w / 130)));
      rows = Math.min(12, Math.max(5, Math.round(h / 130)));
      cells = Array.from({ length: cols * rows }, () => ({
        period: 3 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2,
        depth: 0.04 + Math.random() * 0.07,
        nextFlicker: 6 + Math.random() * 18,
      }));
    };

    const drawLines = (alpha: number) => {
      const cw = w / cols;
      const ch = h / rows;
      ctx.strokeStyle = `rgba(255,255,255,${0.05 * alpha})`;
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
    };

    layout();

    if (!animate) {
      drawLines(1);
      const observer = new ResizeObserver(() => {
        layout();
        drawLines(1);
      });
      observer.observe(canvas);
      return () => observer.disconnect();
    }

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    const observer = new ResizeObserver(layout);
    observer.observe(canvas);

    let raf = 0;
    let last = 0;
    const start = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || now - last < 33) return; // ~30 fps is plenty for a breathing texture
      last = now;
      const t = (now - start) / 1000;
      const fade = Math.min(1, t / 0.8); // ease in as the entrance mask hands off
      const cw = w / cols;
      const ch = h / rows;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#000000";
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const cell = cells[j * cols + i];
          let a = cell.depth * (0.5 + 0.5 * Math.sin((t / cell.period) * Math.PI * 2 + cell.phase));
          const f = t - cell.nextFlicker;
          if (f >= 0) {
            if (f < 0.3) {
              // two-step stutter: dark blip, brief clear, then back to breathing
              a = f < 0.1 ? 0.22 : f < 0.18 ? 0.02 : 0.14;
            } else {
              cell.nextFlicker = t + 6 + Math.random() * 18;
            }
          }
          if (a <= 0.004) continue;
          ctx.globalAlpha = a * fade;
          ctx.fillRect(i * cw - 0.5, j * ch - 0.5, cw + 1, ch + 1);
        }
      }
      ctx.globalAlpha = 1;
      drawLines(fade);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      observer.disconnect();
    };
  }, [animate]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
