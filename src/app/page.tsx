"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoadingScreen from "@/components/LoadingScreen";
import InteractiveTimeline from "@/components/InteractiveTimeline";
import MemoryGallery from "@/components/MemoryGallery";
import MasonryGallery from "@/components/MasonryGallery";
import FinaleSection from "@/components/FinaleSection";

import LetterSection from "@/components/LetterSection";
import PhotoLightbox from "@/components/PhotoLightbox";
import SpotifySection from "@/components/SpotifySection";
import { shuffledGallery, herGallery, randomsGallery, bestGallery } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const lightboxImages = shuffledGallery.map((img) => `/images/${img.src}`);

  useEffect(() => {
    if (!loading && containerRef.current) {
      let timer: NodeJS.Timeout;
      const ctx = gsap.context(() => {
        timer = setTimeout(() => ScrollTrigger.refresh(), 500);

        // Only animate top-level .breath-section elements.
        const sections = gsap.utils.toArray(".breath-section") as HTMLElement[];
        sections.forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            onEnter: () => {
              gsap.fromTo(section, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
            },
            once: true
          });
        });
      }, containerRef);

      return () => {
        clearTimeout(timer);
        ctx.revert();
      };
    }
  }, [loading]);

  return (
    <div ref={containerRef} style={{ background: "transparent", minHeight: "100vh" }}>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {!loading && (
        <div style={{ position: "relative", width: "100%", background: "transparent", zIndex: 1 }}>

          {/* Subtle noise/star overlay */}
          <div style={{
            position: "fixed",
            top: 0, left: 0, width: "100%", height: "100%",
            backgroundImage: "url('/images/noise.svg')",
            opacity: 0.15,
            pointerEvents: "none",
            zIndex: 0
          }} />

          {/* SECTION 1: Hero — Best Friend Tribute */}
          <section
            className="breath-section"
            style={{
              position: "relative",
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)",
              zIndex: 1
            }}
          >
            {/* Scoped hero styles */}
            <style>{`
              .hero-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 5rem;
                align-items: center;
                max-width: 1100px;
                width: 100%;
              }
              @media (max-width: 800px) {
                .hero-grid {
                  grid-template-columns: 1fr;
                  gap: 3rem;
                }
                .hero-photo-col {
                  order: -1;
                  display: flex;
                  justify-content: center;
                }
              }
              @keyframes float-photo {
                0%, 100% { transform: rotate(-2.5deg) translateY(0px); }
                50%       { transform: rotate(-1deg) translateY(-12px); }
              }
              .hero-photo-frame {
                animation: float-photo 7s ease-in-out infinite;
              }
            `}</style>

            <div className="hero-grid" style={{ position: "relative", zIndex: 10, color: "var(--warm-ivory)" }}>

              {/* LEFT — Text */}
              <div>
                {/* Eyebrow label */}
                <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "11px", color: "var(--primary-accent)", marginBottom: "2rem", letterSpacing: "0.22em", opacity: 0.7 }}>
                  AUG 22 — HAPPY BIRTHDAY 🎂
                </p>

                {/* Main headline */}
                <h1 style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.9rem)",
                  marginBottom: "2rem",
                  lineHeight: 1.28,
                  letterSpacing: "0.01em",
                  color: "var(--warm-ivory)"
                }}>
                  To the person who makes{" "}
                  <span style={{ color: "var(--primary-accent)", textShadow: "0 0 20px rgba(242,196,206,0.35)" }}>every room louder</span>,{" "}
                  every plan better,<br />
                  and every bad day{" "}
                  <span style={{ color: "var(--gold-ember)", textShadow: "0 0 16px rgba(212,168,83,0.4)" }}>somehow survivable</span>.
                </h1>

                {/* Subtitle block */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px", lineHeight: 1.8, color: "rgba(245,239,230,0.75)" }}>
                    You didn't just become my best friend.{" "}
                    <span style={{ color: "var(--primary-accent)" }}>You became my default person.</span>
                  </p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px", lineHeight: 1.8, color: "rgba(245,239,230,0.65)" }}>
                    The one I text when something's funny, when something's awful,
                    when absolutely nothing is happening and I just felt like talking.
                  </p>
                </div>

                {/* Scroll hint */}
                <div style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: 24, height: 1, background: "rgba(242,196,206,0.35)" }} />
                  <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "9px", letterSpacing: "0.22em", color: "rgba(242,196,206,0.35)" }}>
                    SCROLL TO EXPLORE
                  </span>
                </div>
              </div>

              {/* RIGHT — Floating Photo with Halo Frame */}
              <div className="hero-photo-col" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                {/* Scoped frame styles */}
                <style>{`
                  @keyframes ring-pulse {
                    0%, 100% { opacity: 0.35; transform: scale(1); }
                    50%       { opacity: 0.65; transform: scale(1.04); }
                  }
                  @keyframes ring-pulse-slow {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50%       { opacity: 0.4; transform: scale(1.07); }
                  }
                  @keyframes heart-beat {
                    0%, 100% { transform: scale(1) rotate(-10deg); opacity: 0.8; }
                    50%       { transform: scale(1.22) rotate(-10deg); opacity: 1; }
                  }
                  @keyframes sparkle {
                    0%, 100% { transform: scale(0.7) rotate(0deg); opacity: 0.5; }
                    50%       { transform: scale(1.1) rotate(180deg); opacity: 1; }
                  }
                  @keyframes float-hero {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-14px); }
                  }
                  .hero-frame-wrap { animation: float-hero 6s ease-in-out infinite; }
                `}</style>

                <div className="hero-frame-wrap" style={{ position: "relative", width: "min(420px, 90%)", aspectRatio: "1/1" }}>

                  {/* ── Outermost halo ring (slowest) */}
                  <div style={{
                    position: "absolute",
                    inset: "-32px",
                    borderRadius: "50%",
                    border: "1px solid rgba(242,196,206,0.18)",
                    animation: "ring-pulse-slow 4s ease-in-out infinite",
                    pointerEvents: "none",
                  }} />

                  {/* ── Second ring */}
                  <div style={{
                    position: "absolute",
                    inset: "-16px",
                    borderRadius: "50%",
                    border: "1.5px solid rgba(242,196,206,0.3)",
                    animation: "ring-pulse 3.5s ease-in-out infinite",
                    pointerEvents: "none",
                  }} />

                  {/* ── Inner glow ring (brightest) */}
                  <div style={{
                    position: "absolute",
                    inset: "-5px",
                    borderRadius: "50%",
                    border: "2px solid rgba(242,196,206,0.55)",
                    boxShadow: "0 0 20px rgba(242,196,206,0.25), inset 0 0 20px rgba(242,196,206,0.08)",
                    animation: "ring-pulse 2.8s ease-in-out infinite 0.4s",
                    pointerEvents: "none",
                  }} />

                  {/* ── Radial glow bloom behind */}
                  <div style={{
                    position: "absolute",
                    inset: "-40px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(242,196,206,0.14) 0%, rgba(212,74,104,0.06) 50%, transparent 75%)",
                    filter: "blur(12px)",
                    pointerEvents: "none",
                  }} />

                  {/* ── Circular image */}
                  <img
                    src="/images/us/us3.webp"
                    alt="Us"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                      display: "block",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />

                  {/* ── Heart ornament — top-left */}
                  <div style={{
                    position: "absolute",
                    top: "-10px",
                    left: "10px",
                    fontSize: "22px",
                    animation: "heart-beat 2.2s ease-in-out infinite",
                    zIndex: 3,
                    filter: "drop-shadow(0 0 6px rgba(212,74,104,0.7))",
                  }}>❤️</div>

                  {/* ── Heart ornament — bottom-right */}
                  <div style={{
                    position: "absolute",
                    bottom: "-10px",
                    right: "10px",
                    fontSize: "18px",
                    animation: "heart-beat 2.2s ease-in-out infinite 0.6s",
                    zIndex: 3,
                    filter: "drop-shadow(0 0 6px rgba(212,74,104,0.7))",
                  }}>🩷</div>

                  {/* ── Star sparkle — top-right */}
                  <div style={{
                    position: "absolute",
                    top: "8px",
                    right: "-14px",
                    fontSize: "16px",
                    animation: "sparkle 3s ease-in-out infinite",
                    zIndex: 3,
                    filter: "drop-shadow(0 0 5px rgba(212,168,83,0.8))",
                  }}>✨</div>

                  {/* ── Star sparkle — bottom-left */}
                  <div style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "-14px",
                    fontSize: "14px",
                    animation: "sparkle 3s ease-in-out infinite 1.2s",
                    zIndex: 3,
                    filter: "drop-shadow(0 0 5px rgba(212,168,83,0.8))",
                  }}>⭐</div>

                  {/* ── Caption below the circle */}
                  <p style={{
                    position: "absolute",
                    bottom: "-38px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "10px",
                    color: "rgba(242,196,206,0.5)",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.18em",
                    zIndex: 2,
                  }}>US. 🎂</p>

                </div>
              </div>

            </div>
          </section>

          {/* SECTION 2: The Timeline */}
          <section
            className="breath-section"
            style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(3rem, 6vw, 5rem) 1rem", zIndex: 1 }}
          >
            <div style={{ position: "relative", maxWidth: "800px", width: "100%" }}>
              <InteractiveTimeline />
            </div>
          </section>

          {/* SECTION 3: Our Soundtrack */}
          <SpotifySection />

          {/* SECTION 4: The Archive (Horizontal Scroll) */}
          <MemoryGallery />

          {/* SECTION 6: The Infinite Archive — clicking images opens lightbox */}
          <MasonryGallery
            title="Best Of"
            subtitle=""
            images={bestGallery}
            onImageClick={(index) => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
          />
          <MasonryGallery
            title="Just Her"
            subtitle="The main character."
            images={herGallery}
            onImageClick={(index) => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
          />

          <MasonryGallery
            title="Everything Else"
            subtitle="Us, randoms, and all that."
            images={randomsGallery}
            startIndex={herGallery.length}
            onImageClick={(index) => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
          />

          {/* SECTION 7: The Letter */}
          <LetterSection />

          {/* SECTION 8: The Finale */}
          <FinaleSection />

          {/* Photo Lightbox — portal-level overlay */}
          <PhotoLightbox
            images={lightboxImages}
            initialIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
          />

        </div>
      )}
    </div>
  );
}