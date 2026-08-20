"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeFloatingGallery from "./ThreeFloatingGallery";
import ThreeConfetti from "./ThreeConfetti";

gsap.registerPlugin(ScrollTrigger);

export default function FinaleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || hasTriggered) return;

    gsap.set([titleRef.current, subtitleRef.current, messageRef.current, signatureRef.current], {
      opacity: 0,
      y: 30,
      filter: "blur(8px)"
    });
    gsap.set(line1Ref.current, { scaleX: 0, opacity: 0 });
    gsap.set(line2Ref.current, { scaleX: 0, opacity: 0 });
    gsap.set(finalRef.current, { opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top center",
      once: true,
      onEnter: () => {
        setHasTriggered(true);

        const tl = gsap.timeline();

        tl.to(titleRef.current, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 2.2, ease: "power3.out"
        });

        tl.to(line1Ref.current, {
          opacity: 1, scaleX: 1,
          duration: 1, ease: "power2.inOut",
          transformOrigin: "center"
        }, "-=1");

        tl.to(subtitleRef.current, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 1.5, ease: "power2.out"
        }, "-=0.4");

        tl.to(messageRef.current, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 1.8, ease: "power2.out"
        }, "+=0.2");

        tl.to(line2Ref.current, {
          opacity: 1, scaleX: 1,
          duration: 1, ease: "power2.inOut",
          transformOrigin: "center"
        }, "-=1");

        tl.to(signatureRef.current, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 1.4, ease: "power2.out"
        }, "+=0.3");

        // Final overlay after a long pause to let everything breathe
        tl.to(finalRef.current, {
          opacity: 1,
          duration: 3,
          ease: "power2.inOut"
        }, "+=6");
      }
    });

    return () => { trigger.kill(); };
  }, [hasTriggered]);

  return (
    <section ref={sectionRef} style={{ position: "relative", minHeight: "100vh" }}>
      <div style={{ position: "sticky", top: 0, left: 0, width: "100%", height: "100vh", overflow: "hidden" }}>

        {/* Ambient bloom */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "140vmax", height: "140vmax",
          background: "radial-gradient(circle, rgba(212,74,104,0.1) 0%, rgba(242,196,206,0.07) 30%, transparent 65%)",
          zIndex: 0, pointerEvents: "none"
        }} />

        {/* 3D floating gallery */}
        {hasTriggered && <ThreeFloatingGallery />}

        {/* Confetti */}
        {hasTriggered && (
          <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
            <ThreeConfetti />
          </div>
        )}

        {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          pointerEvents: "none"
        }}>

          {/* Date label */}
          <div style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "11px",
            letterSpacing: "0.35em",
            color: "rgba(242,196,206,0.35)",
            textTransform: "uppercase",
            marginBottom: "2.5rem"
          }}>
            22 · 08 · 2026
          </div>

          {/* THE MAIN TITLE — huge, glowing */}
          <h1
            ref={titleRef}
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2.6rem, 6.5vw, 78px)",
              color: "var(--primary-accent)",
              textShadow:
                "0 0 120px rgba(242,196,206,0.55), 0 0 50px rgba(242,196,206,0.3), 0 0 20px rgba(212,74,104,0.2)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: "0.2rem"
            }}
          >
            Happy Birthday,<br />
            <span style={{
              fontSize: "clamp(3.2rem, 8vw, 96px)",
              background: "linear-gradient(135deg, #F2C4CE 0%, #D44A68 50%, #F2C4CE 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
              textShadow: "none",
              filter: "drop-shadow(0 0 30px rgba(212,74,104,0.5))"
            }}>
              Aashu. ❤️
            </span>
          </h1>

          {/* Divider line */}
          <div
            ref={line1Ref}
            style={{
              width: "120px", height: "1px",
              background: "linear-gradient(to right, transparent, rgba(242,196,206,0.5), transparent)",
              margin: "1.8rem auto"
            }}
          />

          {/* Sub-headline */}
          <div
            ref={subtitleRef}
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 2.2vw, 1.45rem)",
              color: "var(--warm-ivory)",
              lineHeight: 1.75,
              marginBottom: "1.5rem",
              maxWidth: "680px",
              letterSpacing: "0.01em"
            }}
          >
            You are too loud, too honest, too <em style={{ color: "var(--primary-accent)" }}>you</em> —<br />
            and that&apos;s exactly why you&apos;re the best thing that happened to me.
          </div>

          {/* Core message — horizontal, flowing */}
          <div
            ref={messageRef}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "clamp(12px, 1.6vw, 14px)",
              color: "rgba(245,239,230,0.75)",
              lineHeight: 2.1,
              fontWeight: 300,
              maxWidth: "680px",
              letterSpacing: "0.02em"
            }}
          >
            <span style={{ color: "var(--gold-ember)" }}>September 13</span> — I found you. &nbsp;
            <span style={{ color: "var(--gold-ember)" }}>September 17</span> — you became mine. &nbsp;
            <span style={{ color: "var(--gold-ember)" }}>September 26</span> — I stopped imagining a life without you.
            <br />
            <span style={{ fontStyle: "italic", opacity: 0.5, fontSize: "13px" }}>I still haven&apos;t started.</span>
            <br /><br />
            You&apos;re the person I text at 2am with nothing to say, and you reply like it&apos;s the most normal thing.
            Because for us it <span style={{ color: "var(--primary-accent)" }}>is</span>.&nbsp;
            I don&apos;t need to explain myself or perform or be okay —
            you just <span style={{ color: "var(--primary-accent)" }}>get it</span>.
            And that is genuinely the rarest thing in the world.
            <br /><br />
            Today the <span style={{ color: "var(--gold-ember)" }}>world got a little better</span> — because you were born into it.
            Lucky doesn&apos;t even cover it.
          </div>

          {/* Divider line */}
          <div
            ref={line2Ref}
            style={{
              width: "120px", height: "1px",
              background: "linear-gradient(to right, transparent, rgba(242,196,206,0.4), transparent)",
              margin: "1.8rem auto"
            }}
          />

          {/* Signature */}
          <div
            ref={signatureRef}
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: "clamp(12px, 1.6vw, 15px)",
              color: "rgba(242,196,206,0.5)",
              letterSpacing: "0.05em"
            }}
          >
            — forever yours, Pookie Maru 🐱❤️
          </div>
        </div>

        {/* ── FINAL SCREEN OVERLAY ─────────────────────────────────────────── */}
        <div
          ref={finalRef}
          style={{
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            backgroundImage: "url('/images/us/us4.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 20,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem"
          }}
        >
          {/* Overlay gradient */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(5,4,10,0.85) 0%, rgba(5,4,10,0.55) 50%, rgba(5,4,10,0.9) 100%)",
            zIndex: -1
          }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: "680px" }}>

            <div style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "10px",
              letterSpacing: "0.4em",
              color: "rgba(242,196,206,0.3)",
              marginBottom: "2.5rem"
            }}>
              22 · 08 · 2026
            </div>

            <p style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: "clamp(16px, 2.5vw, 24px)",
              color: "var(--warm-ivory)",
              lineHeight: 2.1,
              marginBottom: "2rem",
              textShadow: "0 2px 30px rgba(0,0,0,0.8)"
            }}>
              &ldquo;I didn&apos;t have the right words &amp; I don&apos;t think words exist for this.<br />
              So I built something instead. Because that&apos;s what matters...&rdquo;
            </p>

            <p style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "clamp(10px, 1.6vw, 13px)",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "var(--gold-ember)",
              textShadow: "0 0 20px rgba(212,168,83,0.5), 0 0 8px rgba(212,168,83,0.3)",
              marginBottom: "2rem",
              marginTop: "-0.5rem",
              opacity: 0.95
            }}>
              effortss &gt; words
            </p>

            <div style={{
              width: "80px", height: "1px",
              background: "linear-gradient(to right, transparent, rgba(242,196,206,0.4), transparent)",
              margin: "0 auto 2rem"
            }} />

            <p style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: "clamp(22px, 4vw, 40px)",
              color: "var(--primary-accent)",
              textShadow: "0 0 50px rgba(242,196,206,0.5), 0 2px 20px rgba(0,0,0,0.8)",
              marginBottom: "2.5rem",
              lineHeight: 1.4
            }}>
              Happy Birthday,<br />My bestesst bestfriend Aashu ❤️
            </p>

            <p style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "13px",
              color: "rgba(242,196,206,0.5)",
              letterSpacing: "0.1em",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              marginBottom: "1.5rem"
            }}>
              — forever yours, Pookie Maru 🐱❤️
            </p>

            <p style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "12px",
              color: "rgba(242,196,206,0.28)",
              fontStyle: "italic",
              letterSpacing: "0.02em"
            }}>
              (if I forgot something — you know it&apos;s still in my heart, just not in my brain 🫶)
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}