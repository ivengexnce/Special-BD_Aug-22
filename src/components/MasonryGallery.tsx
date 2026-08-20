"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shuffledGallery } from "../lib/images";

export default function MasonryGallery({
  title = "The Infinite Archive",
  subtitle = "Every moment, a masterpiece. Click to open.",
  images,
  startIndex = 0,
  onImageClick
}: {
  title?: string;
  subtitle?: string;
  images: string[];
  startIndex?: number;
  onImageClick?: (index: number) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [cols, setCols] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) setCols(1);
      else if (window.innerWidth < 1024) setCols(2);
      else setCols(3);
    };
    handleResize(); // set initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll(".masonry-item");

    gsap.fromTo(
      items,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%"
        }
      }
    );
  }, [images, cols]);

  // Distribute images into columns
  const columns = Array.from({ length: cols }, () => [] as { img: string; originalIndex: number }[]);
  images.forEach((img, i) => {
    columns[i % cols].push({ img, originalIndex: startIndex + i });
  });

  return (
    <section
      ref={sectionRef}
      className="breath-section masonry-section"
      style={{ minHeight: "100vh", background: "transparent", padding: "8rem 4rem" }}
    >
      <style>{`
        @media (max-width: 600px)  { .masonry-section { padding: 4rem 1.5rem !important; } }
        /* Polaroid shake on hover */
        @keyframes polaroid-shake {
          0%   { transform: translateY(-10px) scale(1.02) rotate(0deg); }
          25%  { transform: translateY(-10px) scale(1.02) rotate(-1.2deg); }
          50%  { transform: translateY(-10px) scale(1.02) rotate(1.5deg); }
          75%  { transform: translateY(-10px) scale(1.02) rotate(-0.5deg); }
          100% { transform: translateY(-10px) scale(1.02) rotate(0deg); }
        }
        .masonry-item:hover { animation: polaroid-shake 0.45s ease forwards; cursor: pointer; }
        /* Pink glow overlay on hover */
        .masonry-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(242, 196, 206, 0.06);
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .masonry-item:hover::after { opacity: 1; }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h2 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(2rem, 5vw, 4rem)",
          color: "var(--warm-ivory)",
          fontStyle: "italic"
        }}>
          {title}
        </h2>
        <p style={{ fontFamily: "var(--font-dm-sans)", color: "var(--primary-accent)", marginTop: "1rem", opacity: 0.8 }}>
          {subtitle}
        </p>
      </div>

      <div
        ref={gridRef}
        style={{
          display: "flex",
          gap: "1.5rem",
          maxWidth: "1400px",
          margin: "0 auto",
          alignItems: "flex-start"
        }}
      >
        {columns.map((col, colIndex) => (
          <div
            key={colIndex}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              flex: 1,
              minWidth: 0
            }}
          >
            {col.map((item, i) => (
              <div
                key={i}
                className="masonry-item archive-card"
                style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid rgba(242, 196, 206, 0.15)",
                  position: "relative",
                  transition: "box-shadow 0.5s ease",
                  cursor: "pointer",
                  width: "100%",
                  display: "block"
                }}
                onClick={() => onImageClick?.(item.originalIndex)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(242, 196, 206, 0.25)";
                  const media = e.currentTarget.querySelector("img, video") as HTMLElement;
                  if (media) media.style.filter = "grayscale(0%) sepia(0%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  const media = e.currentTarget.querySelector("img, video") as HTMLElement;
                  if (media) media.style.filter = "grayscale(20%) sepia(15%)";
                }}
              >
                {item.img.endsWith(".mp4") ? (
                  <video
                    src={`/images/${item.img}`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      display: "block",
                      objectFit: "cover",
                      filter: "grayscale(20%) sepia(15%)",
                      transition: "filter 0.5s ease",
                      transform: item.img.includes("videos1") ? "rotate(180deg) scale(1.5)" : "none",
                    }}
                  />
                ) : (
                  <img
                    src={`/images/${item.img}`}
                    alt="Memory"
                    style={{
                      width: "100%",
                      display: "block",
                      objectFit: "cover",
                      filter: "grayscale(20%) sepia(15%)",
                      transition: "filter 0.5s ease"
                    }}
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}