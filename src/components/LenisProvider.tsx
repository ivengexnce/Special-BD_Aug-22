"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Connect Lenis to GSAP ticker so ScrollTrigger and Lenis stay in sync.
    // This is the recommended pattern from both the Lenis and GSAP docs.
    // It also avoids the unbounded RAF recursion of the previous implementation:
    // the old `function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }`
    // continued firing even after `lenis.destroy()` on unmount because the last
    // pending requestAnimationFrame callback had already been queued.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // gsap ticker uses seconds; lenis.raf expects ms
    });

    // Tell GSAP ticker not to use its own RAF — Lenis drives the loop
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger in sync with Lenis scroll position
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <>{children}</>;
}
