"use client";

import { useCallback, useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

export default function ParticleBackground() {
  // useCallback prevents initParticles from being recreated on every render,
  // which would cause ParticlesProvider to re-init the engine unnecessarily.
  const initParticles = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // useMemo keeps the options object reference stable — without this, Particles
  // sees a "new" options object on every render and re-applies everything.
  const options = useMemo<ISourceOptions>(() => ({
    background: {
      color: { value: "transparent" },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        repulse: {
          distance: 120,
          duration: 0.5,
          factor: 1.5,
          speed: 1,
        },
      },
    },
    particles: {
      color: {
        // Silver starlight, gold, and deep crimson embers — matches site palette
        value: ["#EAEAEA", "#F0E6D2", "#D4AF37", "#9B2948"],
      },
      move: {
        direction: "top",
        enable: true,
        outModes: { default: "out" },
        random: true,
        speed: 0.28,    // Slow, cinematic drift
        straight: false,
      },
      number: {
        density: { enable: true },
        value: 55,      // Sparse — elegant, not chaotic
      },
      opacity: {
        value: { min: 0.08, max: 0.5 },
        animation: {
          enable: true,
          speed: 0.25,
          sync: false,
        },
      },
      shape: { type: "circle" },
      size: {
        // Reduced max from 5 to 2.5 — larger particles look like dust, not stars
        value: { min: 0.8, max: 2.5 },
        animation: {
          enable: true,
          speed: 1.2,
          sync: false,
        },
      },
    },
    detectRetina: true,
    // Respects prefers-reduced-motion — disables all motion if user has it enabled
    motion: {
      disable: {
        value: true,
        media: "(prefers-reduced-motion: reduce)",
      },
    },
  }), []);

  return (
    <ParticlesProvider init={initParticles}>
      <Particles
        id="tsparticles"
        options={options}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
    </ParticlesProvider>
  );
}
