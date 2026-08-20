"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Two-column layout: letter text on the left, floating photo on the right.

const LINES = [
  { text: "Dear Aashu,", style: { color: "var(--primary-accent)", marginBottom: "2rem" } },
  { text: "I don't really know how to do this." },
  { text: "Write to someone who already knows everything." },
  { text: "" },
  { text: "So let me just say what I actually mean —" },
  { text: "you are one of the best things that's ever happened to me." },
  { text: "" },
  { text: "You make every boring day feel like something worth remembering.", style: { color: "var(--warm-ivory)" } },
  { text: "You somehow always know what to say.", style: { color: "var(--warm-ivory)" } },
  { text: "And when you don't, you just stay.", style: { color: "var(--warm-ivory)" } },
  { text: "That means more than I can explain." },
  { text: "" },
  { text: "I built you a whole universe.", style: { color: "var(--primary-accent)", fontStyle: "italic" } },
  { text: "In code. In light. In every song at midnight.", style: { color: "var(--primary-accent)", fontStyle: "italic" } },
  { text: "Because that's the only thing I know how", style: { color: "var(--primary-accent)", fontStyle: "italic" } },
  { text: "to say: you matter.", style: { color: "#D44A68", fontStyle: "italic", fontSize: "1.25em" } },
  { text: "" },
  { text: "Happy Birthday, Aashu. ❤️", style: { color: "var(--gold-ember)", marginTop: "1.5rem" } },
  { text: "— Your Pookie Maru 🐱", style: { color: "rgba(245,239,230,0.4)", fontSize: "0.82em", marginTop: "0.4rem" } },
];

export default function LetterSection() {
  const linesRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || linesRef.current.length === 0) return;

    const gsapModule = import("gsap").then(({ default: gsap }) => {
      return import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const lines = linesRef.current.filter(Boolean) as HTMLParagraphElement[];
        gsap.fromTo(
          lines,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: lines[0], start: "top 78%", once: true },
          }
        );
      });
    });
    return () => { gsapModule.catch(() => {}); };
  }, [reduced]);

  return (
    <section
      className="breath-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)",
        zIndex: 1,
      }}
    >
      {/* Scoped layout styles */}
      <style>{`
        .letter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          max-width: 1080px;
          width: 100%;
        }
        @media (max-width: 820px) {
          .letter-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .letter-photo-col { display: flex; justify-content: center; }
        }
        @keyframes float-letter-photo {
          0%, 100% { transform: rotate(1.8deg) translateY(0px); }
          50%       { transform: rotate(0.4deg) translateY(-10px); }
        }
        .letter-photo-frame {
          animation: float-letter-photo 8s ease-in-out infinite;
        }
      `}</style>

      {/* Soft glow behind section */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60vw", height: "60vh",
          background: "radial-gradient(ellipse, rgba(212,74,104,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="letter-grid" style={{ position: "relative", zIndex: 1 }}>

        {/* LEFT — Letter card (grid-column: 1) */}
        <div
          style={{
            gridColumn: 1,
            padding: "clamp(1.8rem, 4vw, 3rem) clamp(1.4rem, 3.5vw, 3rem)",
            borderRadius: 22,
            background: "rgba(10, 6, 14, 0.52)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(242,196,206,0.1)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
          }}
        >
          {/* "A Letter" label */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2.5rem" }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(242,196,206,0.2))" }} />
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: 9, letterSpacing: "0.26em", color: "rgba(242,196,206,0.3)" }}>
              A LETTER
            </span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(242,196,206,0.2))" }} />
          </div>

          {/* Letter lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {LINES.map((line, i) => (
              <p
                key={i}
                ref={(el) => { linesRef.current[i] = el; }}
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                  lineHeight: 1.7,
                  color: "rgba(245,239,230,0.68)",
                  fontStyle: "italic",
                  opacity: reduced ? 1 : 0,
                  minHeight: line.text === "" ? "0.7rem" : undefined,
                  ...line.style,
                }}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>

        {/* RIGHT — Circular halo photo (grid-column: 2) */}
        <div
          className="letter-photo-col"
          style={{ gridColumn: 2, display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {/* Scoped letter frame styles */}
          <style>{`
            @keyframes letter-ring-pulse {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50%       { opacity: 0.6; transform: scale(1.04); }
            }
            @keyframes letter-ring-slow {
              0%, 100% { opacity: 0.15; transform: scale(1); }
              50%       { opacity: 0.35; transform: scale(1.07); }
            }
            @keyframes letter-heart {
              0%, 100% { transform: scale(1) rotate(10deg); opacity: 0.8; }
              50%       { transform: scale(1.25) rotate(10deg); opacity: 1; }
            }
            @keyframes letter-sparkle {
              0%, 100% { transform: scale(0.7) rotate(0deg); opacity: 0.5; }
              50%       { transform: scale(1.1) rotate(180deg); opacity: 1; }
            }
            @keyframes float-letter {
              0%, 100% { transform: translateY(0px); }
              50%       { transform: translateY(-12px); }
            }
            .letter-frame-wrap { animation: float-letter 7s ease-in-out infinite; }
          `}</style>

          <div className="letter-frame-wrap" style={{ position: "relative", width: "min(360px, 90%)", aspectRatio: "1/1" }}>

            {/* Outermost halo ring */}
            <div style={{
              position: "absolute", inset: "-32px", borderRadius: "50%",
              border: "1px solid rgba(212,74,104,0.18)",
              animation: "letter-ring-slow 4.5s ease-in-out infinite",
              pointerEvents: "none",
            }} />

            {/* Second ring */}
            <div style={{
              position: "absolute", inset: "-16px", borderRadius: "50%",
              border: "1.5px solid rgba(212,74,104,0.32)",
              animation: "letter-ring-pulse 3.8s ease-in-out infinite",
              pointerEvents: "none",
            }} />

            {/* Inner glow ring */}
            <div style={{
              position: "absolute", inset: "-5px", borderRadius: "50%",
              border: "2px solid rgba(212,74,104,0.5)",
              boxShadow: "0 0 20px rgba(212,74,104,0.2), inset 0 0 20px rgba(212,74,104,0.08)",
              animation: "letter-ring-pulse 3s ease-in-out infinite 0.5s",
              pointerEvents: "none",
            }} />

            {/* Radial glow bloom */}
            <div style={{
              position: "absolute", inset: "-40px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,74,104,0.12) 0%, rgba(242,196,206,0.05) 50%, transparent 75%)",
              filter: "blur(14px)", pointerEvents: "none",
            }} />

            {/* Circular image */}
            <img
              src="/images/us/us2.webp"
              alt="Us"
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
                display: "block",
                position: "relative",
                zIndex: 1,
              }}
            />

            {/* Heart — top-right */}
            <div style={{
              position: "absolute", top: "-8px", right: "12px",
              fontSize: "20px",
              animation: "letter-heart 2.4s ease-in-out infinite",
              zIndex: 3, filter: "drop-shadow(0 0 6px rgba(212,74,104,0.7))",
            }}>❤️</div>

            {/* Heart — bottom-left */}
            <div style={{
              position: "absolute", bottom: "-8px", left: "12px",
              fontSize: "16px",
              animation: "letter-heart 2.4s ease-in-out infinite 0.8s",
              zIndex: 3, filter: "drop-shadow(0 0 6px rgba(212,74,104,0.7))",
            }}>🩷</div>

            {/* Sparkle — top-left */}
            <div style={{
              position: "absolute", top: "10px", left: "-12px",
              fontSize: "15px",
              animation: "letter-sparkle 3.2s ease-in-out infinite 0.4s",
              zIndex: 3, filter: "drop-shadow(0 0 5px rgba(212,168,83,0.8))",
            }}>✨</div>

            {/* Sparkle — bottom-right */}
            <div style={{
              position: "absolute", bottom: "10px", right: "-12px",
              fontSize: "13px",
              animation: "letter-sparkle 3.2s ease-in-out infinite 1.5s",
              zIndex: 3, filter: "drop-shadow(0 0 5px rgba(212,168,83,0.8))",
            }}>⭐</div>

            {/* Caption */}
            <p style={{
              position: "absolute", bottom: "-36px", left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-dm-mono)", fontSize: "10px",
              color: "rgba(212,74,104,0.5)",
              whiteSpace: "nowrap", letterSpacing: "0.18em", zIndex: 2,
            }}>POOKIE MARU &amp; AASHU ❤️</p>

          </div>
        </div>

      </div>
    </section>
  );
}
