"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GalleryItem } from "../lib/images";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ColumnItem {
  src: string;
  originalIndex: number;
}

// ─── Responsive column count ──────────────────────────────────────────────────

function getColCount(width: number): number {
  if (width < 600) return 1;
  if (width < 1024) return 2;
  return 3;
}

// ─── Shortest-column-first distribution ──────────────────────────────────────
// Round-robin (i % n) assigns equal *count* per column but ignores image
// heights, so tall images clump in one column and leave others bare.
// This always picks the shortest column for each next image.

function distributeColumns(
  items: GalleryItem[],
  colCount: number,
  ratios: Map<string, number>,   // src → naturalHeight/naturalWidth
  startIndex: number
): ColumnItem[][] {
  const cols: ColumnItem[][] = Array.from({ length: colCount }, () => []);
  const heights: number[] = new Array(colCount).fill(0);

  items.forEach((item, i) => {
    const shortest = heights.indexOf(Math.min(...heights));
    cols[shortest].push({ src: item.src, originalIndex: startIndex + i });
    // Use real ratio if loaded, else estimate portrait (1.3) as safe default
    heights[shortest] += ratios.get(item.src) ?? 1.3;
  });

  return cols;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MasonryGallery({
  title = "The Infinite Archive",
  subtitle = "Every moment, a masterpiece. Click to open.",
  images,
  startIndex = 0,
  onImageClick,
}: {
  title?: string;
  subtitle?: string;
  images: GalleryItem[];
  startIndex?: number;
  onImageClick?: (index: number) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [cols, setCols] = useState(3);
  const [columns, setColumns] = useState<ColumnItem[][]>([]);

  // Real aspect ratios collected after images load
  const ratios = useRef<Map<string, number>>(new Map());
  // Track how many images have reported back so we know when to rebalance
  const loadedCount = useRef(0);

  // ── Responsive column count (window resize) ───────────────────────────────
  useEffect(() => {
    const handleResize = () => setCols(getColCount(window.innerWidth));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Redistribute whenever images or col count changes ────────────────────
  // First pass uses estimated ratios; second pass (after load) uses real ones.
  useEffect(() => {
    loadedCount.current = 0; // reset for new image set
    setColumns(distributeColumns(images, cols, ratios.current, startIndex));
  }, [images, cols, startIndex]);

  // ── Re-run GSAP after columns update ─────────────────────────────────────
  useEffect(() => {
    if (!gridRef.current || columns.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

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
          start: "top 80%",
        },
      }
    );
  }, [columns]);

  // ── Collect real image ratios and rebalance once all are known ────────────
  const handleImageLoad = useCallback(
    (src: string, e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (!img.naturalWidth || !img.naturalHeight) return;

      ratios.current.set(src, img.naturalHeight / img.naturalWidth);
      loadedCount.current += 1;

      if (loadedCount.current === images.length) {
        // Second pass — real heights, perfectly balanced columns
        setColumns(distributeColumns(images, cols, ratios.current, startIndex));
      }
    },
    [images, cols, startIndex]
  );

  const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

  return (
    <section
      ref={sectionRef}
      className="breath-section masonry-section"
      style={{ minHeight: "100vh", background: "transparent", padding: "8rem 4rem" }}
    >
      <style>{`
        @media (max-width: 600px) { .masonry-section { padding: 4rem 1.5rem !important; } }

        @keyframes polaroid-shake {
          0%   { transform: translateY(-10px) scale(1.02) rotate(0deg); }
          25%  { transform: translateY(-10px) scale(1.02) rotate(-1.2deg); }
          50%  { transform: translateY(-10px) scale(1.02) rotate(1.5deg); }
          75%  { transform: translateY(-10px) scale(1.02) rotate(-0.5deg); }
          100% { transform: translateY(-10px) scale(1.02) rotate(0deg); }
        }
        .masonry-item:hover { animation: polaroid-shake 0.45s ease forwards; cursor: pointer; }

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

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            color: "var(--warm-ivory)",
            fontStyle: "italic",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            color: "var(--primary-accent)",
            marginTop: "1rem",
            opacity: 0.8,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* ── Grid ───────────────────────────────────────────────────────────── */}
      <div
        ref={gridRef}
        style={{
          display: "flex",
          gap: "1.5rem",
          maxWidth: "1400px",
          margin: "0 auto",
          alignItems: "flex-start",
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
              minWidth: 0,   // prevents flex child overflow
            }}
          >
            {col.map((item) => (
              <div
                key={item.src}
                className="masonry-item archive-card"
                style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid rgba(242, 196, 206, 0.15)",
                  position: "relative",
                  transition: "box-shadow 0.5s ease",
                  cursor: "pointer",
                  width: "100%",
                  display: "block",
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
                {isVideo(item.src) ? (
                  <video
                    src={`/images/${item.src}`}
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
                      transform: item.src.includes("videos1")
                        ? "rotate(180deg) scale(1.5)"
                        : "none",
                    }}
                  />
                ) : (
                  <img
                    src={`/images/${item.src}`}
                    alt="Memory"
                    loading="lazy"
                    style={{
                      width: "100%",
                      display: "block",
                      objectFit: "cover",
                      filter: "grayscale(20%) sepia(15%)",
                      transition: "filter 0.5s ease",
                    }}
                    onLoad={(e) => handleImageLoad(item.src, e)}
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