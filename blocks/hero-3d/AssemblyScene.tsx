"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { useMotionValue, type MotionValue } from "motion/react";

const DEFAULT_MODEL_URL = "/models/clarisea.glb";

/** How far the model may be tilted by hand, in radians (~26°). */
const MAX_PITCH = 0.45;
/** Cap on flick spin-down speed, rad/s. */
const MAX_SPIN = 6;
/** Beyond this much hand rotation the reset button has something to undo. */
const ROTATED_EPSILON = 0.03;
/** One arrow-key press. */
const KEY_STEP = Math.PI / 12;

/** Hand-driven orbit on top of the scroll-driven pose. MotionValues, not state:
 *  DOM pointer/key handlers write them, the frame loop reads them, React never
 *  re-renders for either. */
type Orbit = {
  /** where the hand wants the model, radians */
  targetYaw: MotionValue<number>;
  targetPitch: MotionValue<number>;
  /** yaw velocity carried over from a flick, rad/s */
  spin: MotionValue<number>;
  /** 1 while a pointer is down on the stage */
  dragging: MotionValue<number>;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Per-mesh assembly data: rest pose + exploded offset + stagger window. */
type PartTrack = {
  mesh: THREE.Mesh;
  basePosition: THREE.Vector3;
  explodedOffset: THREE.Vector3;
  /** progress window [start, end] in which this part travels home */
  window: [number, number];
};

const smoothstep = (t: number) => t * t * (3 - 2 * t);

function buildTracks(scene: THREE.Object3D): { tracks: PartTrack[]; center: THREE.Vector3; size: THREE.Vector3 } {
  scene.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(scene);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());

  const meshes: { mesh: THREE.Mesh; worldCenter: THREE.Vector3 }[] = [];
  scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      const worldCenter = new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3());
      meshes.push({ mesh: object as THREE.Mesh, worldCenter });
    }
  });

  // Lower parts settle first: the machine stacks itself as you scroll.
  const sorted = [...meshes].sort((a, b) => a.worldCenter.y - b.worldCenter.y);
  const rank = new Map(sorted.map((entry, index) => [entry.mesh.uuid, sorted.length > 1 ? index / (sorted.length - 1) : 0]));

  const inverseParent = new THREE.Matrix4();
  const origin = new THREE.Vector3();

  const tracks = meshes.map(({ mesh, worldCenter }) => {
    const heightNorm = rank.get(mesh.uuid) ?? 0;

    // Anisotropic explosion: mostly along the device's vertical axis, plus a radial
    // drift. Biased downward so the exploded cloud spreads away from the headline.
    const dirWorld = new THREE.Vector3();
    const dy = worldCenter.y - center.y;
    dirWorld.y = dy > 0 ? dy * 0.85 : dy * 1.9;
    const radial = new THREE.Vector3(worldCenter.x - center.x, 0, worldCenter.z - center.z);
    const radialLength = radial.length();
    if (radialLength > 1e-5) radial.divideScalar(radialLength);
    // deterministic per-part variation so co-axial parts don't overlap perfectly
    const seed = (mesh.name.length * 2654435761) % 97 / 97;
    dirWorld.addScaledVector(radial, size.y * (0.1 + 0.22 * radialLength / (size.x * 0.5 + 1e-5)) * (0.6 + 0.4 * seed));
    dirWorld.y += size.y * 0.06 * (seed - 0.5);

    // world-space offset → parent-local offset (handles any parent transforms)
    const parent = mesh.parent ?? scene;
    inverseParent.copy(parent.matrixWorld).invert();
    const explodedOffset = dirWorld.clone().applyMatrix4(inverseParent).sub(origin.set(0, 0, 0).applyMatrix4(inverseParent));

    // Staggered windows: every part is moving early on, finishing bottom-to-top.
    const start = 0.08 + 0.34 * heightNorm;
    const end = 0.55 + 0.42 * heightNorm;
    return { mesh, basePosition: mesh.position.clone(), explodedOffset, window: [start, end] as [number, number] };
  });

  return { tracks, center, size };
}

function ClariSeaModel({
  progress,
  reduceMotion,
  url,
  orbit,
  interactive,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
  url: string;
  orbit: Orbit;
  interactive: boolean;
}) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const damped = useRef(reduceMotion ? 1 : 0);
  /** damped, rendered orbit — chases the MotionValue targets */
  const pose = useRef({ yaw: 0, pitch: 0 });
  const scratch = useRef(new THREE.Vector3());

  const { tracks, center } = useMemo(() => buildTracks(scene), [scene]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const target = reduceMotion ? 1 : progress.get();
    // critically-damped chase: stays glued to the scroll, but never steps
    damped.current = THREE.MathUtils.damp(damped.current, target, 7, dt);
    const p = damped.current;

    for (const track of tracks) {
      const [start, end] = track.window;
      const local = smoothstep(THREE.MathUtils.clamp((p - start) / (end - start), 0, 1));
      const explode = 1 - local;
      track.mesh.position.copy(scratch.current.copy(track.explodedOffset).multiplyScalar(explode).add(track.basePosition));
    }

    // Hand orbit: chase the drag target. The targets are zeroed the moment
    // scrolling takes the timeline back, so the same chase unwinds it.
    const dragging = orbit.dragging.get() === 1;
    const spin = orbit.spin.get();
    if (interactive && !dragging && Math.abs(spin) > 1e-4) {
      orbit.targetYaw.set(orbit.targetYaw.get() + spin * dt);
      orbit.spin.set(spin * Math.pow(0.015, dt)); // exponential spin-down, frame-rate independent
    }
    const chase = interactive ? 14 : 8;
    pose.current.yaw = THREE.MathUtils.damp(pose.current.yaw, orbit.targetYaw.get(), chase, dt);
    pose.current.pitch = THREE.MathUtils.damp(pose.current.pitch, orbit.targetPitch.get(), chase, dt);

    const group = groupRef.current;
    if (group) {
      // half-turn sweep while assembling, then a calm idle drift; the end pose
      // (front of the device facing the camera) is fixed, the start sits 180° back
      const endY = 0.7 - Math.PI / 2;
      // the idle sway steps aside while a hand is on the model, so a drag reads as 1:1
      const idle = dragging ? 0 : Math.sin(state.clock.elapsedTime * 0.12) * 0.03;
      group.rotation.y = endY - Math.PI * (1 - p) + idle + pose.current.yaw;
      // Euler XYZ: yaw spins the device on its own axis, pitch then tilts the
      // whole thing toward the camera — orbit-controls feel without the camera rig
      group.rotation.x = pose.current.pitch;
      // the exploded cloud hangs a little lower, rising home as it assembles
      group.position.y = THREE.MathUtils.lerp(-0.1, 0, p) + (dragging ? 0 : Math.sin(state.clock.elapsedTime * 0.5) * 0.004);
    }

    // camera pulls in as the device comes together
    const cam = state.camera;
    cam.position.set(
      THREE.MathUtils.lerp(1.0, 0.5, p),
      THREE.MathUtils.lerp(0.42, 0.16, p),
      THREE.MathUtils.lerp(2.3, 1.55, p),
    );
    // aim slightly above center so the device sits low in the frame, clear of the headline
    cam.lookAt(0, 0.13, 0);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

/**
 * Full-bleed R3F canvas. `progress` is the raw scroll progress (0 = exploded,
 * 1 = assembled) driven by the pinned section in Component.tsx. Once the model
 * is whole, `interactive` hands it over: drag (or arrow keys) to rotate,
 * `resetSignal` to put it back.
 */
export default function AssemblyScene({
  progress,
  reduceMotion,
  modelUrl,
  label,
  interactive = false,
  resetSignal = 0,
  onRotatedChange,
  describedBy,
  roleDescription,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
  modelUrl?: string | null;
  label: string;
  interactive?: boolean;
  resetSignal?: number;
  onRotatedChange?: (rotated: boolean) => void;
  describedBy?: string;
  roleDescription?: string;
}) {
  const url = modelUrl || DEFAULT_MODEL_URL;
  const targetYaw = useMotionValue(0);
  const targetPitch = useMotionValue(0);
  const spin = useMotionValue(0);
  const draggingMv = useMotionValue(0);
  const orbit: Orbit = useMemo(
    () => ({ targetYaw, targetPitch, spin, dragging: draggingMv }),
    [targetYaw, targetPitch, spin, draggingMv],
  );
  const pointer = useRef<{ id: number; x: number; y: number; t: number } | null>(null);
  const rotated = useRef(false);
  const [dragging, setDragging] = useState(false);

  /** Tell the parent whether there is any hand rotation left to undo. */
  const syncRotated = useCallback(() => {
    const moved = Math.abs(targetYaw.get()) > ROTATED_EPSILON || Math.abs(targetPitch.get()) > ROTATED_EPSILON;
    if (moved !== rotated.current) {
      rotated.current = moved;
      onRotatedChange?.(moved);
    }
  }, [targetYaw, targetPitch, onRotatedChange]);

  const zeroOrbit = useCallback(() => {
    targetYaw.set(0);
    targetPitch.set(0);
    spin.set(0);
    rotated.current = false;
  }, [targetYaw, targetPitch, spin]);

  // Reset is a signal, not a command: the frame loop eases the model home.
  useEffect(() => {
    if (!resetSignal) return;
    zeroOrbit();
  }, [resetSignal, zeroOrbit]);

  // Scrolling back up takes the timeline over again — drop any hand rotation.
  // (The parent clears its own `rotated` flag off the same scroll threshold.)
  useEffect(() => {
    if (interactive) return;
    pointer.current = null;
    draggingMv.set(0);
    zeroOrbit();
  }, [interactive, draggingMv, zeroOrbit]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    // capture can throw for a pointer the browser has already released
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {}
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, t: event.timeStamp };
    draggingMv.set(1);
    spin.set(0);
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    if (!p || p.id !== event.pointerId) return;
    const el = event.currentTarget;
    const dx = event.clientX - p.x;
    const dy = event.clientY - p.y;
    const dt = Math.max(event.timeStamp - p.t, 1) / 1000;
    p.x = event.clientX;
    p.y = event.clientY;
    p.t = event.timeStamp;

    // dragging the full stage width ≈ one full turn
    const dYaw = (dx / Math.max(el.clientWidth, 1)) * Math.PI * 2;
    targetYaw.set(targetYaw.get() + dYaw);
    targetPitch.set(clamp(targetPitch.get() + (dy / Math.max(el.clientHeight, 1)) * Math.PI * 0.8, -MAX_PITCH, MAX_PITCH));
    spin.set(clamp(dYaw / dt, -MAX_SPIN, MAX_SPIN));
    syncRotated();
  };

  // Unconditional cleanup: a drag interrupted by scrolling out of the grab zone
  // still has to release capture and drop the grabbing cursor.
  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {}
    if (pointer.current?.id === event.pointerId) pointer.current = null;
    draggingMv.set(0);
    setDragging(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    let handled = true;
    switch (event.key) {
      case "ArrowLeft":
        targetYaw.set(targetYaw.get() - KEY_STEP);
        break;
      case "ArrowRight":
        targetYaw.set(targetYaw.get() + KEY_STEP);
        break;
      case "ArrowUp":
        targetPitch.set(clamp(targetPitch.get() - KEY_STEP * 0.5, -MAX_PITCH, MAX_PITCH));
        break;
      case "ArrowDown":
        targetPitch.set(clamp(targetPitch.get() + KEY_STEP * 0.5, -MAX_PITCH, MAX_PITCH));
        break;
      case "0":
      case "Home":
        targetYaw.set(0);
        targetPitch.set(0);
        break;
      default:
        handled = false;
    }
    if (handled) {
      event.preventDefault();
      spin.set(0);
      syncRotated();
    }
  };

  return (
    <Canvas
      aria-label={label}
      role={interactive ? "application" : "img"}
      aria-roledescription={interactive ? roleDescription : undefined}
      aria-describedby={interactive ? describedBy : undefined}
      tabIndex={interactive ? 0 : -1}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className={`select-none outline-none focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-lime ${
        interactive ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""
      }`}
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0.95, 0.42, 1.95], near: 0.05, far: 20 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
    >
      <Suspense fallback={null}>
        <ClariSeaModel progress={progress} reduceMotion={reduceMotion} url={url} orbit={orbit} interactive={interactive} />
        {/* studio-in-a-black-room: neutral strips + one lime accent, no network HDRIs */}
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={3.4} position={[0, 3, 4]} rotation-x={-Math.PI / 4} scale={[4, 2, 1]} />
          <Lightformer intensity={1.6} position={[-4, 1, -1]} rotation-y={Math.PI / 2} scale={[3, 3, 1]} />
          <Lightformer intensity={2.2} position={[4, 0.5, 0]} rotation-y={-Math.PI / 2} scale={[3, 3, 1]} />
          <Lightformer intensity={0.9} color="#92d402" position={[2.5, -1.5, 2.5]} scale={[1.5, 0.8, 1]} />
        </Environment>
        <ambientLight intensity={0.25} />
        <directionalLight position={[2, 3, 2]} intensity={1.1} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(DEFAULT_MODEL_URL);
