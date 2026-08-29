"use client";

import { useRef, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { threeGallery } from "../lib/images";

if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock: This module has been deprecated")) return;
    originalWarn(...args);
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SCENE_Y = 46;               // total Y band photos travel through
const HALF_Y = SCENE_Y / 2;
const ROSE = new THREE.Color("#D44A68");
// parallax multiplier per depth layer (far → near)
const PARALLAX_X = [0.35, 0.85, 1.6] as const;
const PARALLAX_Y = [0.15, 0.35, 0.7] as const;

// ─── Seeded PRNG — keeps useMemo stable across HMR ───────────────────────────

function makePrng(seed: number) {
  let s = seed;
  return () => {
    s = Math.imul(s, 1664525) + 1013904223 | 0;
    return (s >>> 0) / 0x100000000;
  };
}

// ─── Photo config generated once per texture count ───────────────────────────

interface PhotoCfg {
  initialY: number;
  x: number;
  z: number;
  speed: number;      // upward drift rate
  bobAmp: number;      // sine amplitude
  bobFreq: number;      // sine frequency
  phase: number;      // sine phase offset
  rotX0: number;      // initial Euler X
  rotY0: number;
  rotZ0: number;
  rotZSpeed: number;      // slow axial spin
  opacity: number;      // base opacity
  scale: number;
  layer: 0 | 1 | 2;  // 0=far 1=mid 2=near
}

function buildPhotoCfg(count: number): PhotoCfg[] {
  const r = makePrng(0xdead_beef);
  return Array.from({ length: count }, (_, i) => {
    const layer = (i % 3) as 0 | 1 | 2;
    // Layer-specific base values
    const [zBase, zSpan, opBase, spBase, scBase] =
      layer === 0 ? [-9, 3, 0.28, 0.22, 0.60] :
        layer === 1 ? [-4.5, 2.5, 0.50, 0.48, 0.92] :
          [0, 2, 0.75, 0.80, 1.30];
    return {
      initialY: (r() - 0.5) * SCENE_Y,
      x: (r() - 0.5) * 24,
      z: zBase + r() * zSpan,
      speed: spBase + r() * 0.22,
      bobAmp: 0.12 + r() * 0.28,
      bobFreq: 0.35 + r() * 0.55,
      phase: r() * Math.PI * 2,
      rotX0: (r() - 0.5) * 0.4,
      rotY0: (r() - 0.5) * 0.4,
      rotZ0: (r() - 0.5) * 0.3,
      rotZSpeed: (r() - 0.5) * 0.0035,
      opacity: opBase + r() * 0.1,
      scale: scBase + r() * 0.28,
      layer,
    };
  });
}


const VERT_SRC = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv        = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG_SRC = /* glsl */`
  uniform sampler2D map;
  uniform float     uOpacity;
  uniform float     uTintStrength;
  uniform vec3      uTint;
  varying vec2      vUv;

  void main() {
    vec4 tex = texture2D(map, vUv);
    if (tex.a < 0.01) discard;

    // Per-axis edge fade — fades within outer 22 % of width & height
    float fx = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);
    float fy = smoothstep(0.0, 0.22, vUv.y) * smoothstep(1.0, 0.78, vUv.y);
    float edge = fx * fy;
    // Raise to power for tighter centre-safe area
    float mask = pow(edge, 1.6);

    // Rose tint — stronger in highlights so darks stay dark
    float luma = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3  tinted = mix(tex.rgb, tex.rgb * (1.0 - uTintStrength) + uTint * uTintStrength, luma * 0.35);

    gl_FragColor = vec4(tinted, tex.a * uOpacity * mask);
  }
`;

function makeUniforms(tex: THREE.Texture, opacity: number) {
  return {
    map: { value: tex },
    uOpacity: { value: opacity },
    uTintStrength: { value: 0.14 },
    uTint: { value: ROSE },
  };
}

// ─── Scene inner component ────────────────────────────────────────────────────

function FloatingPhotos() {
  const { clock } = useThree();
  const textures = useTexture(threeGallery.map(img => `/images/${img.src}`));
  const cfgs = useMemo(() => buildPhotoCfg(textures.length), [textures.length]);

  // Stable uniforms array — one set per photo
  const uniforms = useMemo(
    () => textures.map((tex, i) => makeUniforms(tex, cfgs[i]?.opacity ?? 0.6)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [textures.length]
  );

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const layerGrps = useRef<(THREE.Group | null)[]>([null, null, null]);

  // Smooth mouse target (r() in normalized ‑1…1 space)
  const mouse = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    const t = clock.getElapsedTime();
    const m = mouse.current;

    // Lerp mouse toward target
    m.cx += (m.tx - m.cx) * 0.055;
    m.cy += (m.ty - m.cy) * 0.055;

    // Layer-level parallax — deeper layers shift less
    layerGrps.current.forEach((grp, layer) => {
      if (!grp) return;
      grp.position.x = m.cx * PARALLAX_X[layer as 0 | 1 | 2];
      grp.position.y = m.cy * -PARALLAX_Y[layer as 0 | 1 | 2];
    });

    // Per-photo motion
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const cfg = cfgs[i];
      if (!cfg) return;

      // Deterministic Y: modulo-wrapped drift + sinusoidal bob → no accumulation bug
      const drift = ((cfg.initialY + t * cfg.speed * 2.4 + HALF_Y) % SCENE_Y) - HALF_Y;
      const bob = Math.sin(t * cfg.bobFreq + cfg.phase) * cfg.bobAmp;
      mesh.position.y = drift + bob;

      // Gentle rotation — oscillates, not continuous spin (feels more organic)
      mesh.rotation.x = cfg.rotX0 + Math.sin(t * cfg.bobFreq * 0.6 + cfg.phase) * 0.045;
      mesh.rotation.y = cfg.rotY0 + Math.sin(t * cfg.bobFreq * 0.45 + cfg.phase + 1) * 0.07;
      mesh.rotation.z = cfg.rotZ0 + t * cfg.rotZSpeed;

      // Opacity dissolve near wrap point — no pop-in/pop-out
      const norm = Math.abs(drift) / HALF_Y;         // 0=centre, 1=edge
      const edgeFade = 1 - Math.pow(Math.max(0, norm - 0.72) / 0.28, 2);
      uniforms[i].uOpacity.value = cfg.opacity * edgeFade;
    });
  });

  // Group photos by layer — far renders first (correct painter's order)
  const byLayer = useMemo(
    () => ([0, 1, 2] as const).map(layer =>
      textures.map((tex, i) => ({ tex, i, cfg: cfgs[i] }))
        .filter(({ cfg }) => cfg?.layer === layer)
    ),
    [textures, cfgs]
  );

  return (
    <>
      {([0, 1, 2] as const).map(layer => (
        <group key={layer} ref={el => { layerGrps.current[layer] = el; }}>
          {byLayer[layer].map(({ tex, i, cfg }) => {
            if (!cfg) return null;

            // Aspect-ratio-correct plane dimensions
            const img = tex.image as HTMLImageElement | null | undefined;
            const aspect =
              (img?.naturalWidth ?? img?.width ?? 1) /
              (img?.naturalHeight ?? img?.height ?? 1);
            const w = 3 * cfg.scale * aspect;
            const h = 3 * cfg.scale;

            return (
              <mesh
                key={i}
                ref={el => { meshRefs.current[i] = el; }}
                position={[cfg.x, cfg.initialY, cfg.z]}
                rotation={[cfg.rotX0, cfg.rotY0, cfg.rotZ0]}
              >
                <planeGeometry args={[w, h]} />
                <shaderMaterial
                  vertexShader={VERT_SRC}
                  fragmentShader={FRAG_SRC}
                  uniforms={uniforms[i]}
                  transparent
                  depthWrite={false}      // transparent objects — no z-fighting
                  side={THREE.DoubleSide}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </>
  );
}


function PostFX() {
  return (
    <EffectComposer multisampling={0} /* we don't need MSAA; bloom softens anyway */>
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.42}
        luminanceSmoothing={0.88}
        blendFunction={BlendFunction.ADD}
      />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ChromaticAberration {...({
        offset: [0.0006, 0.0006],
        radialModulation: false,
        modulationOffset: 0,
      } as any)} />
    </EffectComposer>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function ThreeFloatingGallery() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}                        // cap pixel ratio for GPU budget
        camera={{ position: [0, 0, 15], fov: 58 }}
        gl={{
          antialias: false,                   // postprocessing handles smoothing
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <FloatingPhotos />
          <PostFX />
        </Suspense>
      </Canvas>

      {/*
       * Two-layer vignette:
       *   1. Radial gradient — punches a soft hole in the centre
       *   2. inset box-shadow — hard-kills bleeds on all four sides
       * Using var(--deep-base) so it inherits whatever the page's bg is.
       */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 20%, var(--deep-base, #0a0408) 88%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 140px 70px var(--deep-base, #0a0408)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}