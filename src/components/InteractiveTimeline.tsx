"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimelineEvent {
  date: string;
  chapter: string;
  text: string;
  image: string;
  isSpecial?: boolean;
  highlightPhrase?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const timelineEvents: TimelineEvent[] = [
  {
    date: "13 September 2024",
    chapter: "01",
    text: "I saw you for the first time.",
    image: "/images/us/us1.webp",
  },
  {
    date: "17 September 2024",
    chapter: "02",
    text: "The universe stopped pretending and introduced us properly.",
    image: "/images/everything/everything41.webp",
  },
  {
    date: "23 September 2024",
    chapter: "03",
    text: "You joined the group.",
    image: "/images/everything/everything38.webp",
  },
  {
    date: "25 September 2024",
    chapter: "04",
    text: "We started talking.",
    image: "/images/her/her24.webp",
  },
  {
    date: "26 September 2024",
    chapter: "05",
    text: "You walked past me. Something shifted. Something that had no name yet.",
    image: "/images/videos/videos1.mp4",
    isSpecial: true,
    highlightPhrase: "Something shifted.",
  },
];

// ─── Design Tokens ────────────────────────────────────────────────────────────

const T = {
  pink: "#F2C4CE",
  rose: "#D44A68",
  pinkAlpha: (a: number) => `rgba(242,196,206,${a})`,
  roseAlpha: (a: number) => `rgba(212,74,104,${a})`,
  cream: "rgba(245,237,232,0.85)",
  bg: "rgba(12,8,14,0.78)",
  bgDeep: "rgba(14,6,10,0.82)",
  fontMono: "var(--font-dm-mono, 'DM Mono', monospace)",
  fontSans: "var(--font-dm-sans, 'DM Sans', sans-serif)",
  ease: [0.16, 1, 0.3, 1] as const,
} as const;

// ─── Reduced-motion hook ──────────────────────────────────────────────────────

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ─── Spine Node ───────────────────────────────────────────────────────────────

function SpineNode({
  isOpen,
  isSpecial = false,
}: {
  isOpen: boolean;
  isSpecial?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const color = isSpecial ? T.rose : T.pink;
  const glow = isSpecial ? T.roseAlpha : T.pinkAlpha;

  return (
    <div
      style={{
        position: "relative",
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        zIndex: 2,
      }}
    >
      {/* Outer pulse ring */}
      {!reduced && (
        <motion.span
          animate={{ scale: [1, 2.4, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `1px solid ${color}`,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Inner pulse ring */}
      {!reduced && (
        <motion.span
          animate={{ scale: [1, 1.7, 1], opacity: [0.35, 0, 0.35] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{
            position: "absolute",
            inset: 4,
            borderRadius: "50%",
            border: `1px solid ${color}`,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Core dot */}
      <motion.span
        animate={{
          scale: isOpen ? 1.6 : 1,
          boxShadow: isOpen
            ? `0 0 20px ${color}, 0 0 40px ${glow(0.5)}`
            : `0 0 10px ${color}BB, 0 0 22px ${glow(0.35)}`,
        }}
        transition={{ duration: 0.45, ease: T.ease }}
        style={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: color,
          display: "block",
        }}
      />
    </div>
  );
}

// ─── Image Reveal Panel ───────────────────────────────────────────────────────
// Uses aspect-ratio so no hardcoded pixel heights

function ImageReveal({
  src,
  isSpecial,
}: {
  src: string;
  isSpecial?: boolean;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key="img-reveal"
        initial={{ opacity: 0, scaleY: 0, originY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        transition={{ duration: 0.55, ease: T.ease }}
        style={{
          borderRadius: isSpecial ? 14 : 12,
          overflow: "hidden",
          position: "relative",
          marginTop: isSpecial ? "2rem" : "1.5rem",
          aspectRatio: isSpecial ? "16/9" : "4/3",
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        {src.endsWith(".mp4") ? (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: "none",
            }}
          />
        ) : (
          <img
            src={src}
            alt="Memory"
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}
        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isSpecial
              ? `linear-gradient(to top, ${T.roseAlpha(0.22)} 0%, transparent 60%)`
              : "linear-gradient(to top, rgba(0,0,0,0.48) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Tap Hint ─────────────────────────────────────────────────────────────────

function TapHint({ isSpecial }: { isSpecial?: boolean }) {
  return (
    <AnimatePresence>
      <motion.div
        key="tap-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: "1.25rem",
          justifyContent: isSpecial ? "center" : "flex-start",
        }}
      >
        {!isSpecial && (
          <div
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(to right, transparent, ${T.pinkAlpha(0.22)})`,
            }}
          />
        )}
        <span
          style={{
            fontFamily: T.fontMono,
            fontSize: 9,
            color: isSpecial ? T.roseAlpha(0.38) : T.pinkAlpha(0.32),
            letterSpacing: "0.22em",
          }}
        >
          TAP TO RECALL
        </span>
        {isSpecial && (
          <>
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: T.roseAlpha(0.3),
                display: "inline-block",
              }}
            />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Regular Card ─────────────────────────────────────────────────────────────

function TimelineCard({
  item,
  index,
  isOpen,
  onToggle,
  side,
}: {
  item: TimelineEvent;
  index: number;
  isOpen: boolean;
  onToggle: (i: number) => void;
  side: "left" | "right";
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: side === "left" ? -48 : 48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, ease: T.ease, delay: 0.08 }}
      style={{
        display: "flex",
        justifyContent: side === "left" ? "flex-end" : "flex-start",
      }}
    >
      <motion.div
        onClick={() => onToggle(index)}
        whileHover={reduced ? undefined : { y: -5 }}
        transition={{ duration: 0.32, ease: T.ease }}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={(e) => e.key === "Enter" && onToggle(index)}
        style={{
          position: "relative",
          maxWidth: 340,
          width: "100%",
          cursor: "pointer",
          borderRadius: 18,
          padding: 1,
          background: isOpen
            ? `linear-gradient(135deg, ${T.pinkAlpha(0.48)}, ${T.roseAlpha(0.18)}, ${T.pinkAlpha(0.08)})`
            : `linear-gradient(135deg, ${T.pinkAlpha(0.18)}, ${T.pinkAlpha(0.04)})`,
          transition: "background 0.45s ease",
          boxShadow: isOpen
            ? `0 24px 64px rgba(0,0,0,0.58), 0 0 48px ${T.pinkAlpha(0.07)}`
            : "0 12px 40px rgba(0,0,0,0.42)",
          outline: "none",
        }}
      >
        {/* Focus ring — keyboard only */}
        <div
          className="focus-ring"
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: 20,
            border: `2px solid ${T.pinkAlpha(0)}`,
            transition: "border-color 0.2s",
            pointerEvents: "none",
          }}
        />

        {/* Card inner */}
        <div
          style={{
            borderRadius: 17,
            background: T.bg,
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            padding: "1.75rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Watermark chapter number */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: -20,
              [side === "left" ? "right" : "left"]: -14,
              fontFamily: T.fontMono,
              fontSize: 100,
              fontWeight: 700,
              lineHeight: 1,
              color: T.pinkAlpha(0.032),
              userSelect: "none",
              pointerEvents: "none",
              letterSpacing: "-0.04em",
            }}
          >
            {item.chapter}
          </div>

          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: T.fontMono,
                fontSize: 10,
                color: T.pink,
                background: T.pinkAlpha(0.08),
                border: `1px solid ${T.pinkAlpha(0.18)}`,
                padding: "3px 8px",
                borderRadius: 5,
                letterSpacing: "0.12em",
              }}
            >
              {item.chapter}
            </span>
            <span
              style={{
                fontFamily: T.fontMono,
                fontSize: 11,
                color: T.pinkAlpha(0.44),
                letterSpacing: "0.06em",
              }}
            >
              {item.date}
            </span>
          </div>

          {/* Text */}
          <p
            style={{
              fontFamily: T.fontSans,
              fontSize: 15,
              color: T.cream,
              fontStyle: "italic",
              lineHeight: 1.72,
              position: "relative",
              zIndex: 1,
              margin: 0,
            }}
          >
            &ldquo;{item.text}&rdquo;
          </p>

          {!isOpen && <TapHint />}
          {isOpen && <ImageReveal src={item.image} />}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Special Card (5th event) ─────────────────────────────────────────────────

function SpecialCard({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: TimelineEvent;
  index: number;
  isOpen: boolean;
  onToggle: (i: number) => void;
}) {
  const reduced = usePrefersReducedMotion();
  const phrase = item.highlightPhrase ?? "";
  const [before, after] = item.text.split(phrase);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 48, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, ease: T.ease, delay: 0.08 }}
      onClick={() => onToggle(index)}
      whileHover={reduced ? undefined : { y: -4 }}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onKeyDown={(e) => e.key === "Enter" && onToggle(index)}
      style={{
        maxWidth: 600,
        width: "100%",
        margin: "0 auto",
        cursor: "pointer",
        borderRadius: 22,
        padding: 1,
        background: isOpen
          ? `linear-gradient(135deg, ${T.roseAlpha(0.55)}, ${T.pinkAlpha(0.15)}, ${T.roseAlpha(0.1)})`
          : `linear-gradient(135deg, ${T.roseAlpha(0.28)}, ${T.roseAlpha(0.06)})`,
        transition: "background 0.5s ease",
        boxShadow: isOpen
          ? `0 32px 80px ${T.roseAlpha(0.2)}, 0 0 60px ${T.roseAlpha(0.08)}`
          : `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${T.roseAlpha(0.04)}`,
        outline: "none",
      }}
    >
      <div
        style={{
          borderRadius: 21,
          background: T.bgDeep,
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          padding: "2.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background radial bloom */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 320,
            height: 160,
            background: `radial-gradient(ellipse, ${T.roseAlpha(0.1)} 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Chapter + date row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "1.75rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(to right, transparent, ${T.roseAlpha(0.3)})`,
            }}
          />
          <span
            style={{
              fontFamily: T.fontMono,
              fontSize: 10,
              color: T.rose,
              letterSpacing: "0.18em",
            }}
          >
            {item.chapter}&nbsp;&nbsp;·&nbsp;&nbsp;{item.date}
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(to left, transparent, ${T.roseAlpha(0.3)})`,
            }}
          />
        </div>

        {/* Memory text with highlighted phrase */}
        <p
          style={{
            fontFamily: T.fontSans,
            fontSize: 20,
            fontStyle: "italic",
            lineHeight: 1.65,
            margin: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <span style={{ color: T.cream }}>&ldquo;{before}</span>
          <span
            style={{
              color: T.rose,
              textShadow: `0 0 28px ${T.roseAlpha(0.5)}`,
            }}
          >
            {phrase}
          </span>
          <span style={{ color: T.cream }}>{after}&rdquo;</span>
        </p>

        {!isOpen && <TapHint isSpecial />}
        {isOpen && <ImageReveal src={item.image} isSpecial />}
      </div>
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function InteractiveTimeline() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const handleToggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <>
      {/* Focus-visible ring: injected so no external CSS file needed */}
      <style>{`
        [role="button"]:focus-visible .focus-ring {
          border-color: rgba(242,196,206,0.55) !important;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "100%",
          padding: "1rem 0 5rem",
        }}
      >
        {/* ── Animated Spine ──────────────────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 1,
            transform: "translateX(-50%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {/* Static gradient line */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to bottom,
                transparent 0%,
                ${T.pinkAlpha(0.22)} 6%,
                ${T.pinkAlpha(0.22)} 94%,
                transparent 100%)`,
            }}
          />

          {/* Traveling glow particle — suppressed for reduced-motion */}
          {!reduced && (
            <motion.div
              animate={{ top: ["-4%", "104%"] }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: 3,
                height: 120,
                background: `linear-gradient(to bottom,
                  transparent,
                  ${T.pinkAlpha(0.95)} 50%,
                  transparent)`,
                borderRadius: 2,
                filter: "blur(1.5px)",
              }}
            />
          )}
        </div>

        {/* ── Event Rows ──────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {timelineEvents.map((item, i) => {
            const isOpen = openIndex === i;

            /**
             * ALL rows — including the special card — use the same 3-column
             * grid so SpineNode always sits exactly on the spine line.
             *
             * Special card: spans `gridColumn: "1 / -1"` as a second row
             * beneath the node, so the node still anchors on the line.
             */
            if (item.isSpecial) {
              return (
                <motion.div
                  key={i}
                  initial={reduced ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 28px 1fr",
                    gridTemplateRows: "auto auto",
                    alignItems: "start",
                    gap: "0 2.5rem",
                    rowGap: "1.75rem",
                  }}
                >
                  {/* Row 1: empty | SpineNode | empty — node stays on line */}
                  <div /> {/* col 1 */}
                  <div
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <SpineNode isOpen={isOpen} isSpecial />
                  </div>
                  <div /> {/* col 3 */}

                  {/* Row 2: SpecialCard spans all 3 columns */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <SpecialCard
                      item={item}
                      index={i}
                      isOpen={isOpen}
                      onToggle={handleToggle}
                    />
                  </div>
                </motion.div>
              );
            }

            // ── Regular alternating rows ──────────────────────────────────
            // Index 0 → left card (isRight = false)
            // Index 1 → right card (isRight = true)  etc.
            const isRight = i % 2 !== 0;

            return (
              <motion.div
                key={i}
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 28px 1fr",
                  alignItems: "center",
                  gap: "2.5rem",
                }}
              >
                {/* Left slot */}
                {isRight ? (
                  <div />
                ) : (
                  <TimelineCard
                    item={item}
                    index={i}
                    isOpen={isOpen}
                    onToggle={handleToggle}
                    side="left"
                  />
                )}

                {/* Center node — always in column 2 */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <SpineNode isOpen={isOpen} />
                </div>

                {/* Right slot */}
                {isRight ? (
                  <TimelineCard
                    item={item}
                    index={i}
                    isOpen={isOpen}
                    onToggle={handleToggle}
                    side="right"
                  />
                ) : (
                  <div />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}