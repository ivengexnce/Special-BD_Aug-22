"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { Howler } from "howler";

gsap.registerPlugin(TextPlugin);

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const [isDone, setIsDone] = useState(false);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isDone) return;

    gsap.set(subtitleRef.current, { opacity: 0, y: 16 });
    gsap.set(dateRef.current, { opacity: 0, y: 8 });
    gsap.set(bloomRef.current, { opacity: 0, scale: 0.6 });

    const tl = gsap.timeline();

    // Bloom pulse in background
    tl.to(bloomRef.current, {
      opacity: 1,
      scale: 1,
      duration: 2.5,
      ease: "power2.out"
    }, 0);

    // Typewriter — the core poem line
    // Note: use <br> not \n — TextPlugin sets innerHTML so only HTML tags work
    tl.to(textRef.current, {
      duration: 3.5,
      text: {
        value: "Some called it hell and left.<br>You called it <span style='color: var(--gold-ember); text-shadow: 0 0 20px rgba(212,168,83,0.6);'>home</span> and <span style='color: #D44A68; text-shadow: 0 0 20px rgba(212,74,104,0.6);'>stayed</span>.",
        delimiter: ""
      },
      ease: "none",
      delay: 0.8,
      onComplete: () => setTypingDone(true)
    });

    // Heartbeat pulse
    tl.add(() => {
      if (vignetteRef.current) {
        gsap.fromTo(vignetteRef.current,
          { opacity: 0 },
          { opacity: 0.9, duration: 0.08, yoyo: true, repeat: 3, ease: "power2.out" }
        );
      }
      try {
        if (Howler.ctx) {
          const osc = Howler.ctx.createOscillator();
          const gain = Howler.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(40, Howler.ctx.currentTime);
          gain.gain.setValueAtTime(0, Howler.ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.35, Howler.ctx.currentTime + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, Howler.ctx.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(Howler.ctx.destination);
          osc.start();
          osc.stop(Howler.ctx.currentTime + 0.6);
        }
      } catch (_) {}
    }, "+=0.4");

    // Date label
    tl.to(dateRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    }, "+=0.3");

    // Subtitle
    tl.to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power1.out"
    }, "+=0.4");

    // Hold
    tl.to({}, { duration: 2.2 });

    // Iris close
    tl.to(containerRef.current, {
      clipPath: "circle(0% at 50% 50%)",
      duration: 1.6,
      ease: "power3.inOut",
      onComplete: () => {
        setIsDone(true);
        onCompleteRef.current();
      }
    });

    return () => { tl.kill(); };
  }, [isDone]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        backgroundColor: "var(--deep-base)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        clipPath: "circle(100% at 50% 50%)",
        overflow: "hidden"
      }}
    >
      {/* Ambient bloom glow */}
      <div
        ref={bloomRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vmax",
          height: "70vmax",
          background: "radial-gradient(circle, rgba(212,74,104,0.09) 0%, rgba(242,196,206,0.06) 40%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Vignette — pulses on heartbeat */}
      <div
        ref={vignetteRef}
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.95) 100%)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Decorative top rule */}
      <div style={{
        position: "absolute",
        top: "10vh",
        left: "50%",
        transform: "translateX(-50%)",
        width: "1px",
        height: "60px",
        background: "linear-gradient(to bottom, transparent, rgba(242,196,206,0.3))",
        zIndex: 1
      }} />

      {/* Main poem text */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .typing-cursor::after {
          content: '|';
          display: inline;
          color: var(--primary-accent);
          animation: blink 1s step-end infinite;
          margin-left: 3px;
          font-style: normal;
          text-shadow: 0 0 8px rgba(242,196,206,0.6);
        }
        .typing-done::after { display: none; }
      `}</style>

      <div
        ref={textRef}
        className={typingDone ? "typing-done" : "typing-cursor"}
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(1.35rem, 3.5vw, 2.4rem)",
          color: "var(--warm-ivory)",
          lineHeight: 1.85,
          fontStyle: "italic",
          marginBottom: "0.5rem",
          minHeight: "5rem",
          zIndex: 1,
          position: "relative",
          textShadow: "0 0 40px rgba(245,239,230,0.08)",
          letterSpacing: "0.01em"
        }}
      />

      {/* Date label */}
      <div
        ref={dateRef}
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "11px",
          color: "rgba(242,196,206,0.35)",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          zIndex: 1,
          position: "relative",
          marginTop: "2.5rem",
          marginBottom: "1.2rem"
        }}
      >
        22 · 08 · 2026 &nbsp;·&nbsp; for aashu
      </div>

      {/* Subtitle */}
      <div
        ref={subtitleRef}
        style={{
          zIndex: 1,
          position: "relative"
        }}
      >
        <p style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "12px",
          color: "var(--primary-accent)",
          lineHeight: 2,
          letterSpacing: "0.08em",
          opacity: 0.85,
          marginBottom: "1.2rem"
        }}>
          "This website was not built with code.<br />
          It was built with every word I left unsaid."
        </p>
        <p style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontSize: "14px",
          color: "rgba(242,196,206,0.5)",
          letterSpacing: "0.05em"
        }}>
          — Pookie Maru ❤️
        </p>
      </div>

      {/* Decorative bottom rule */}
      <div style={{
        position: "absolute",
        bottom: "10vh",
        left: "50%",
        transform: "translateX(-50%)",
        width: "1px",
        height: "60px",
        background: "linear-gradient(to top, transparent, rgba(242,196,206,0.3))",
        zIndex: 1
      }} />
    </div>
  );
}