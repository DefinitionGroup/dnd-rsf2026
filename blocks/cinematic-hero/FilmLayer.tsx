"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Optional WebGL treatment over the background film: the video is sampled as a
 * texture and re-projected with fine animated grain, a slight radial lens
 * fringe and a feathered edge that marries the footage to the black canvas.
 * Renders on top of the <video>; on any failure (no WebGL, context loss) it
 * removes itself and the plain video underneath simply shows.
 */
export default function FilmLayer({ videoRef }: { videoRef: RefObject<HTMLVideoElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) {
      setFailed(true);
      return;
    }
    // A remount reuses the canvas's existing context (StrictMode dev double-mount) — revive it if lost.
    if (gl.isContextLost()) gl.getExtension("WEBGL_lose_context")?.restoreContext();

    const VERT = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }`;

    const FRAG = `
      precision mediump float;
      uniform sampler2D uTex;
      uniform vec2 uRes;
      uniform vec2 uTexRes;
      uniform float uTime;
      varying vec2 vUv;

      vec2 coverUv(vec2 uv) {
        float ca = uRes.x / uRes.y;
        float va = uTexRes.x / uTexRes.y;
        vec2 s = ca > va ? vec2(1.0, va / ca) : vec2(ca / va, 1.0);
        return (uv - 0.5) * s + 0.5;
      }

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      void main() {
        vec2 c = vUv - 0.5;
        float r = length(c);
        vec2 dir = c / max(r, 1e-4);
        float ca = 0.0035 * smoothstep(0.2, 0.72, r);

        vec3 col;
        col.r = texture2D(uTex, coverUv(vUv + dir * ca)).r;
        col.g = texture2D(uTex, coverUv(vUv)).g;
        col.b = texture2D(uTex, coverUv(vUv - dir * ca)).b;

        // crush the blacks a hair so the footage sits in the black room
        col = pow(col, vec3(1.06)) * 0.95;

        // fine animated grain, weighted into the shadows
        float g = hash(vUv * uRes * 0.5 + fract(uTime * 0.7) * vec2(17.0, 23.0)) - 0.5;
        float lum = dot(col, vec3(0.299, 0.587, 0.114));
        col += g * 0.045 * (0.35 + 0.65 * (1.0 - lum));

        // feather the frame's corners into the canvas
        col *= 1.0 - 0.38 * smoothstep(0.48, 0.85, r);

        gl_FragColor = vec4(col, 1.0);
      }`;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      setFailed(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    // fullscreen triangle
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTexRes = gl.getUniformLocation(program, "uTexRes");
    const uTime = gl.getUniformLocation(program, "uTime");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    let raf = 0;
    let hasFrame = false;
    const start = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || video.readyState < 2 || !video.videoWidth) return;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uTexRes, video.videoWidth, video.videoHeight);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!hasFrame) {
        hasFrame = true;
        canvas.style.opacity = "1";
      }
    };
    raf = requestAnimationFrame(frame);

    const onLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, [videoRef]);

  if (failed) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500"
    />
  );
}
