"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import type { MotionValue } from "motion/react";

const DEFAULT_MODEL_URL = "/models/clarisea.glb";

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

function ClariSeaModel({ progress, reduceMotion, url }: { progress: MotionValue<number>; reduceMotion: boolean; url: string }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const damped = useRef(reduceMotion ? 1 : 0);
  const scratch = useRef(new THREE.Vector3());

  const { tracks, center } = useMemo(() => buildTracks(scene), [scene]);

  useFrame((state, delta) => {
    const target = reduceMotion ? 1 : progress.get();
    // critically-damped chase: stays glued to the scroll, but never steps
    damped.current = THREE.MathUtils.damp(damped.current, target, 7, Math.min(delta, 0.1));
    const p = damped.current;

    for (const track of tracks) {
      const [start, end] = track.window;
      const local = smoothstep(THREE.MathUtils.clamp((p - start) / (end - start), 0, 1));
      const explode = 1 - local;
      track.mesh.position.copy(scratch.current.copy(track.explodedOffset).multiplyScalar(explode).add(track.basePosition));
    }

    const group = groupRef.current;
    if (group) {
      // half-turn sweep while assembling, then a calm idle drift; the end pose
      // (front of the device facing the camera) is fixed, the start sits 180° back
      const endY = 0.7 - Math.PI / 2;
      group.rotation.y = endY - Math.PI * (1 - p) + Math.sin(state.clock.elapsedTime * 0.12) * 0.03;
      // the exploded cloud hangs a little lower, rising home as it assembles
      group.position.y = THREE.MathUtils.lerp(-0.1, 0, p) + Math.sin(state.clock.elapsedTime * 0.5) * 0.004;
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
 * 1 = assembled) driven by the pinned section in Component.tsx.
 */
export default function AssemblyScene({
  progress,
  reduceMotion,
  modelUrl,
  label,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
  modelUrl?: string | null;
  label: string;
}) {
  const url = modelUrl || DEFAULT_MODEL_URL;
  return (
    <Canvas
      aria-label={label}
      role="img"
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0.95, 0.42, 1.95], near: 0.05, far: 20 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
    >
      <Suspense fallback={null}>
        <ClariSeaModel progress={progress} reduceMotion={reduceMotion} url={url} />
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
