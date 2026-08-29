"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const memories = [
  {
    id: 1,
    date: "August 31, 2025",
    spotifyId: "4iLMuGacSurMAKeQyIwFeJ",
    imgSrc: "/images/her/her8.webp",
    caption: `Heart-shaped flowers. Made from canteen blooms... When God wants to bless someone they sends bestfriends.. You are the One❤️ \n\n"सगळ्या फुलांमध्ये तूच सर्वात खास. 🔵❤️"`,
  },
  {
    id: 2,
    date: "November 5, 2024",
    spotifyId: "3uL1IBFhg52VcQqOwAG01E",
    imgSrc: "/images/her/her12.webp",
    caption: `Sheesh Mahal vibes. Every time I look at this, I'm reminded of why you are so special.`,
  },
  {
    id: 3,
    date: "June 21, 2024",
    spotifyId: "6G8vN5EUtcDxOXOXadF6kp",
    imgSrc: "/images/her/her11.webp",
    caption: `The day I saw you for the first time I didn't know yet that this person would become so special to me. The universe did something right that day. 🍂`,
  },
  {
    id: 4,
    date: "Some Date",
    spotifyId: "3hoXhwP0ub9LdSJV4olDIc",
    imgSrc: "/images/videos/videos2.mp4",
    caption: `Tere Naina. Eyes that speak a thousand words without saying a single one. 👀✨`,
  },
  {
    id: 5,
    date: "Golden Evenings",
    spotifyId: "5PUXKVVVQ74C3gl5vKy9Li",
    imgSrc: "/images/her/her29.webp",
    caption: `Golden hour with my golden girl. Every moment with you feels like a dream. ✨`,
  },
  {
    id: 6,
    date: "January 7, 2025",
    spotifyId: "5ovFyjaU2COYanwL81OUVE",
    imgSrc: "/images/everything/everything25.webp",
    caption: `Tai Tai Phis! Just having fun and making memories that will last a lifetime.\n\n"i will always remember urs वेडेपणा😂❤️"`,
  },
  {
    id: 7,
    date: "Featured",
    spotifyId: "1QE0I8VnYKlKKfgPeoXU4n",
    imgSrc: "/images/her/her25.webp",
    caption: `Doubtwa! I love that we can go from deep midnight talks to just being absolute dorks together. Never change. 😂❤️"`,
  },
  {
    id: 8,
    date: "Unfiltered",
    spotifyId: "0tgVpDi06FyKpA1z0VMD4v",
    imgSrc: "/images/her/her30.webp",
    caption: `Just you being you. The most genuine, fun, and amazing person I know. ✨`,
  },
  {
    id: 9,
    date: "Always",
    spotifyId: "2Z6HgNji9cNlFLNORw6wDQ",
    imgSrc: "/images/her/her26.webp",
    caption: `And somehow, every new picture is just another reason to adore you. 💖\n\n"आपली मैत्री अशीच आयुष्यभर राहो. 💖"`,
  },
  {
    id: 10,
    date: "Archive",
    spotifyId: "5lrA2NzUxmBjKr2tCZfMtl",
    imgSrc: "/images/her/her5.webp",
    caption: `Another beautiful memory frozen in time. ✨`,
  },
  {
    id: 11,
    date: "Archive",
    spotifyId: "5pAo2q7eVt65OSkwYgqhHl",
    imgSrc: "/images/her/her19.webp",
    caption: `Because some moments are just too good not to capture. 📸\n\n"असेच हसत राहा, नेहमी. 🌸"`,
  },
  {
    id: 13,
    date: "Archive",
    spotifyId: "7BCp5hEiiDSmXsxsXkvYff",
    imgSrc: "/images/her/her27.webp",
    caption: `The main character energy is always unmatched. ✨\n\n"तुझा हा आत्मविश्वास मला खूप आवडतो. 🌸"`,
  },
  {
    id: 14,
    date: "Archive",
    spotifyId: "5vGiuYFSGekGLgbxhV1rD5",
    imgSrc: "/images/everything/everything1.webp",
    caption: `When everything else fades away, these are the moments that matter. ❤️\n\n"ह्या आठवणी कायम जपेन. 💖"`,
  },
  {
    id: 15,
    date: "Archive",
    spotifyId: "3x55c9UVpbURc2T02DLfEM",
    imgSrc: "/images/everything/everything22.webp",
    caption: `And we keep adding to the story... ✨\n\n"आपला हा प्रवास असाच सुरू राहो. 🌸"`,
  },
];
const TOTAL = memories.length;

export default function MemoryGallery() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressGlowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animatedCards = useRef<Set<number>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);

  // ─── Scroll + Card-entrance + Progress ───────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !scrollWrapperRef.current) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    // Cards start invisible and shifted down
    gsap.set(cards, { opacity: 0, y: 48, scale: 0.95, transformPerspective: 1000 });

    const getScrollDist = () =>
      scrollWrapperRef.current!.scrollWidth - window.innerWidth;

    const revealVisibleCards = () => {
      let closestI = 0;
      let closestDist = Infinity;

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;

        // Reveal when card front edge crosses 90% of viewport width
        if (!animatedCards.current.has(i) && rect.left < window.innerWidth * 0.9) {
          animatedCards.current.add(i);
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            delay: 0.04,
          });
        }

        // Track card closest to viewport center
        const dist = Math.abs(midX - window.innerWidth / 2);
        if (dist < closestDist) {
          closestDist = dist;
          closestI = i;
        }
      });

      setActiveIndex(closestI);
    };

    const tween = gsap.to(scrollWrapperRef.current, {
      x: () => -getScrollDist(),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${getScrollDist()}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Progress bar
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${self.progress * 100}%`;
          }
          if (progressGlowRef.current) {
            progressGlowRef.current.style.left = `${self.progress * 100}%`;
          }
          revealVisibleCards();
        },
      },
    });

    // Reveal immediately visible cards (first ~2 on mount)
    const t = setTimeout(revealVisibleCards, 120);

    return () => {
      clearTimeout(t);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  // ─── 3-D Tilt + Ambient Glow + Image Parallax ────────────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, i: number) => {
      const card = cardRefs.current[i];
      if (!card) return;

      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const cx = width / 2;
      const cy = height / 2;

      // Card 3D tilt removed because it disables Spotify iframe playback due to anti-clickjacking
      // (We keep the ambient glow and image parallax below for interactivity)

      // Ambient glow follows cursor
      const glow = card.querySelector<HTMLElement>(".mem-glow");
      if (glow) {
        glow.style.opacity = "1";
        glow.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(242,196,206,0.13) 0%, transparent 70%)`;
      }

      // Image counter-parallax — moves opposite direction for depth illusion
      const media = card.querySelector<HTMLElement>(".mem-media");
      if (media) {
        gsap.to(media, {
          x: ((x - cx) / cx) * -7,
          y: ((y - cy) / cy) * -6,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    },
    []
  );

  const handleMouseEnter = useCallback((i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    gsap.to(card, {
      y: -14,
      scale: 1.025,
      boxShadow:
        "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(242,196,206,0.22), 0 0 40px rgba(242,196,206,0.06)",
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  const handleMouseLeave = useCallback((i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;

    // Elastic snap-back for tilt
    gsap.to(card, {
      y: 0,
      scale: 1,
      boxShadow: "none",
      duration: 0.75,
      ease: "elastic.out(1, 0.55)",
      overwrite: "auto",
    });

    const glow = card.querySelector<HTMLElement>(".mem-glow");
    if (glow) glow.style.opacity = "0";

    const media = card.querySelector<HTMLElement>(".mem-media");
    if (media) {
      gsap.to(media, { x: 0, y: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
    }
  }, []);

  return (
    <>
      {/* ── Global styles for this section ─────────────────────────────── */}
      <style>{`
        /* Animated film grain */
        @keyframes _grain {
          0%,100% { transform: translate(0,0) }
          10%      { transform: translate(-3%,-4%) }
          30%      { transform: translate(3%,1%)  }
          50%      { transform: translate(-1%,3%)  }
          70%      { transform: translate(4%,-2%) }
          90%      { transform: translate(-2%,4%)  }
        }
        .mem-card {
          will-change: transform;
        }
        .mem-card::after {
          content: '';
          position: absolute;
          inset: -60%;
          width: 220%;
          height: 220%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.038;
          animation: _grain 0.7s steps(1) infinite;
          pointer-events: none;
          border-radius: inherit;
          z-index: 10;
        }
        .mem-glow {
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        /* Dot nav pill transition */
        .mem-dot { transition: width 0.35s cubic-bezier(0.34,1.56,0.64,1), background-color 0.3s ease; }
      `}</style>

      <section
        ref={containerRef}
        style={{
          height: "100vh",
          backgroundColor: "var(--deep-base)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* ── Scroll progress bar ──────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "rgba(242,196,206,0.07)",
            zIndex: 30,
          }}
        >
          {/* Filled portion */}
          <div
            ref={progressBarRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "0%",
              background:
                "linear-gradient(90deg, rgba(242,196,206,0.35) 0%, rgba(242,196,206,0.85) 100%)",
            }}
          />
          {/* Traveling glow dot */}
          <div
            ref={progressGlowRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "0%",
              transform: "translate(-50%, -50%)",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "rgba(242,196,206,0.95)",
              boxShadow: "0 0 10px 3px rgba(242,196,206,0.5)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ── Dot navigation ───────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            zIndex: 30,
          }}
        >
          {memories.map((_, i) => (
            <div
              key={i}
              className="mem-dot"
              style={{
                height: "6px",
                width: activeIndex === i ? "22px" : "6px",
                borderRadius: "3px",
                backgroundColor:
                  activeIndex === i
                    ? "rgba(242,196,206,0.85)"
                    : "rgba(242,196,206,0.2)",
              }}
            />
          ))}
        </div>

        {/* ── Horizontal scroll wrapper ────────────────────────────────── */}
        <div
          ref={scrollWrapperRef}
          style={{
            display: "flex",
            gap: "5rem",
            padding: "0 50vw 0 10vw",
            alignItems: "stretch",
          }}
        >
          {/* Title block */}
          <div style={{ flexShrink: 0, paddingRight: "1rem", alignSelf: "center" }}>
            {/* Eyebrow */}
            <p
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "10px",
                color: "var(--primary-accent)",
                letterSpacing: "0.32em",
                opacity: 0.55,
                marginBottom: "1.1rem",
                textTransform: "uppercase",
              }}
            >
              ◈ Memory Archive
            </p>

            {/* Headline */}
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
                color: "var(--warm-ivory)",
                fontStyle: "italic",
                fontWeight: 400,
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              The Archive
            </h2>

            {/* Divider + scroll hint */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginTop: "1.4rem",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "1px",
                  background: "rgba(242,196,206,0.28)",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "10px",
                  color: "rgba(242,196,206,0.35)",
                  letterSpacing: "0.22em",
                }}
              >
                SCROLL TO REMEMBER
              </p>
            </div>

            {/* Count */}
            <p
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "11px",
                color: "rgba(242,196,206,0.2)",
                marginTop: "0.6rem",
                letterSpacing: "0.05em",
              }}
            >
              {TOTAL} moments
            </p>
          </div>

          {/* ── Cards ─────────────────────────────────────────────────── */}
          {memories.map((memory, index) => (
            <div
              key={memory.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="mem-card"
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              style={{
                flexShrink: 0,
                width: "min(85vw, 375px)",
                backgroundColor: "#0D0A0B",
                border: "1px solid rgba(242,196,206,0.1)",
                borderRadius: "18px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
                position: "relative",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {/* Ambient cursor glow */}
              <div
                className="mem-glow"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "18px",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              {/* Top-right index counter */}
              <div
                style={{
                  position: "absolute",
                  top: "1.35rem",
                  right: "1.4rem",
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "10px",
                  color: "rgba(242,196,206,0.22)",
                  letterSpacing: "0.08em",
                  zIndex: 5,
                  pointerEvents: "none",
                }}
              >
                {String(index + 1).padStart(2, "0")}&thinsp;/&thinsp;{String(TOTAL).padStart(2, "0")}
              </div>

              {/* ── Media (image / video) ──────────────────────────────── */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  overflow: "hidden",
                  borderRadius: "11px",
                  aspectRatio: "3 / 4",
                  height: "auto",
                  border: "1px solid rgba(255,255,255,0.04)",
                  background: "#080507",
                }}
              >
                {memory.imgSrc.endsWith(".mp4") ? (
                  <video
                    className="mem-media"
                    src={memory.imgSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      willChange: "transform",
                      transform: memory.imgSrc.includes("videos1")
                        ? "rotate(180deg)"
                        : "none",
                    }}
                  />
                ) : (
                  <img
                    className="mem-media"
                    src={memory.imgSrc}
                    alt="Memory"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      willChange: "transform",
                      display: "block",
                    }}
                  />
                )}

                {/* Photo vignette — dark radial edge to frame the image */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(ellipse at center, transparent 55%, rgba(13,10,11,0.65) 100%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* ── Date ──────────────────────────────────────────────── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "var(--primary-accent)",
                    opacity: 0.55,
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "10px",
                    color: "var(--primary-accent)",
                    opacity: 0.62,
                    letterSpacing: "0.12em",
                  }}
                >
                  {memory.date}
                </p>
              </div>

              {/* ── Spotify embed ─────────────────────────────────────── */}
              <div style={{ position: "relative", zIndex: 2, height: 80, borderRadius: 10, background: "rgba(30,18,24,0.3)" }}>
                {Math.abs(activeIndex - index) <= 2 && (
                  <iframe
                    src={`https://open.spotify.com/embed/track/${memory.spotifyId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="80"
                    allowFullScreen={false}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    style={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.55)",
                      display: "block",
                    }}
                  />
                )}
              </div>

              {/* ── Caption ───────────────────────────────────────────── */}
              <div
                style={{
                  flexGrow: 1,
                  position: "relative",
                  zIndex: 2,
                  paddingBottom: "0.25rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "14.5px",
                    color: "var(--warm-ivory)",
                    lineHeight: 1.76,
                    whiteSpace: "pre-wrap",
                    fontStyle: "italic",
                    opacity: 0.78,
                    letterSpacing: "0.01em",
                  }}
                >
                  {memory.caption}
                </p>
              </div>

              {/* Bottom edge accent — fades in on hover via card glow */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "18%",
                  right: "18%",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(242,196,206,0.18), transparent)",
                  pointerEvents: "none",
                  zIndex: 3,
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}