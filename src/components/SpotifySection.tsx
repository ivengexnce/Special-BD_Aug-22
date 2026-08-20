"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Song {
  id: string;
  title: string;
  artist: string;
  note: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SONGS: Song[] = [
  {
    id: "5orNEFkFG4RP24goF02AuD",
    title: "Kashmir Main Tu Kanyakumari",
    artist: "Sunidhi Chauhan",
    note: "Polar opposites, but somehow we just work perfectly together. ✨",
  },
  {
    id: "71TviT2jdZnp2758ljwREX",
    title: "Soniyo",
    artist: "Sonu Nigam",
    note: "Just one of those songs that always brings me back. ❤️",
  },
  {
    id: "7BKLCZ1jbUBVqRi2FVlTVw",
    title: "Closer",
    artist: "The Chainsmokers",
    note: "We can never outgrow this one. Absolute classic vibes.",
  },
  {
    id: "0TK2YIli7K1leLovkQiNik",
    title: "Señorita",
    artist: "Shawn Mendes, Camila Cabello",
    note: "Because obviously... you know exactly why.",
  },
  {
    id: "2ceeTJAzKy295Fm0VsaXtE",
    title: "Tum Se",
    artist: "Sachin-Jigar",
    note: "Tum se hi toh saari baatein hain. Everything starts here. 🔵",
  },
  {
    id: "0IBb4UQMbRfoVdHJpmrRn4",
    title: "Kabhi Kabhi Aditi",
    artist: "Rashid Ali",
    note: "Kabhi kabhi Aditi zindagi me... Just a reminder that your smile is everything. Always here to make you laugh.",
  },
];

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  pink: "#F2C4CE",
  rose: "#D44A68",
  ivory: "var(--warm-ivory, #F5EFE6)",
  pinkA: (a: number) => `rgba(242,196,206,${a})`,
  roseA: (a: number) => `rgba(212,74,104,${a})`,
  ease: [0.16, 1, 0.3, 1] as const,
  mono: "var(--font-dm-mono, 'DM Mono', monospace)",
  serif: "var(--font-playfair, 'Playfair Display', serif)",
  sans: "var(--font-dm-sans, 'DM Sans', sans-serif)",
};

// ─── Animated waveform ────────────────────────────────────────────────────────

function Waveform({ reduced }: { reduced: boolean }) {
  const bars = [0.55, 1, 0.7, 0.85, 0.6, 0.9, 0.5];
  const delays = [0, 0.18, 0.06, 0.24, 0.12, 0.3, 0.08];

  return (
    <div
      aria-hidden
      style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}
    >
      {bars.map((amp, i) =>
        reduced ? (
          <div
            key={i}
            style={{ width: 3, height: 14, borderRadius: 2, background: T.rose, opacity: 0.5 }}
          />
        ) : (
          <motion.div
            key={i}
            animate={{
              scaleY: [amp * 0.4, amp, amp * 0.55, amp * 0.85, amp * 0.4],
              opacity: [0.5, 1, 0.65, 0.9, 0.5],
            }}
            transition={{
              duration: 1.6 + i * 0.12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delays[i],
            }}
            style={{
              width: 3,
              height: 28,
              borderRadius: 2,
              background: `linear-gradient(to top, ${T.rose}, ${T.pink})`,
              transformOrigin: "bottom",
              originY: 1,
            }}
          />
        )
      )}
    </div>
  );
}

// ─── Spotify Embed ────────────────────────────────────────────────────────────

function SpotifyEmbed({ id, title }: { id: string; title: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", height: 152 }}>
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 12,
            background: `linear-gradient(90deg, rgba(30,18,24,0.8) 0%, rgba(50,28,38,0.9) 50%, rgba(30,18,24,0.8) 100%)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 1.6s infinite",
          }}
        />
      )}
      <iframe
        src={`https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        title={`Listen to ${title} on Spotify`}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          border: "none",
          borderRadius: 12,
          display: "block",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </div>
  );
}

// ─── Song card ────────────────────────────────────────────────────────────────

function SongCard({ song, index, reduced }: { song: Song; index: number; reduced: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "100px" });

  return (
    <motion.article
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, ease: T.ease, delay: index * 0.14 }}
      whileHover={reduced ? undefined : { y: -6 }}
      style={{
        width: "100%",
        maxWidth: 360,
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Artist label */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingLeft: 2 }}>
        <div style={{ width: 16, height: 1, background: T.rose, opacity: 0.6 }} />
        <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.18em", color: T.pinkA(0.55) }}>
          {song.artist.toUpperCase()}
        </span>
      </div>

      {/* Card frame */}
      <div
        style={{
          padding: 1,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${T.pinkA(0.3)} 0%, ${T.roseA(0.12)} 50%, ${T.pinkA(0.06)} 100%)`,
          boxShadow: `0 24px 56px rgba(0,0,0,0.65), 0 0 32px ${T.roseA(0.06)}`,
          transition: "box-shadow 0.35s ease",
        }}
        className="song-card-frame"
      >
        <div
          style={{
            borderRadius: 15,
            overflow: "hidden",
            background: "rgba(10,6,12,0.92)",
            backdropFilter: "blur(20px)",
            height: 152,
          }}
        >
          {isInView && <SpotifyEmbed id={song.id} title={song.title} />}
        </div>
      </div>

      {/* Personal note below the card */}
      <p style={{
        fontFamily: T.sans,
        fontSize: 12,
        color: T.pinkA(0.5),
        marginTop: 10,
        paddingLeft: 4,
        fontStyle: "italic",
        lineHeight: 1.5,
      }}>
        {song.note}
      </p>
    </motion.article>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function SpotifySection() {
  const reduced = useReducedMotion() ?? false;

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .song-card-frame:hover {
          box-shadow:
            0 28px 64px rgba(0,0,0,0.7),
            0  0  48px rgba(212,74,104,0.12) !important;
        }
      `}</style>

      <section
        aria-label="Songs for my Best Friend"
        style={{
          width: "100%",
          padding: "4rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: T.ease }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            width: "100%",
            maxWidth: 1200,
          }}
        >
          {/* Waveform eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <Waveform reduced={reduced} />
            <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.26em", color: T.pinkA(0.45) }}>
              SONGS FOR MY BEST FRIEND
            </span>
            <Waveform reduced={reduced} />
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: T.serif,
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontStyle: "italic",
              fontWeight: 400,
              color: T.ivory,
              textAlign: "center",
              lineHeight: 1.15,
              margin: 0,
              marginBottom: 18,
              textShadow: `0 0 48px ${T.roseA(0.12)}`,
            }}
          >
            Our Soundtrack
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: T.sans,
              fontSize: "1.05rem",
              fontWeight: 400,
              lineHeight: 1.65,
              color: T.pinkA(0.62),
              textAlign: "center",
              maxWidth: 500,
              margin: 0,
              marginBottom: 52,
              letterSpacing: "0.01em",
            }}
          >
            Every song that ever made me think of you — which is, honestly, a lot of them.
          </p>

          {/* Divider */}
          <div
            aria-hidden
            style={{
              width: 120,
              height: 1,
              marginBottom: 52,
              background: `linear-gradient(to right, transparent, ${T.roseA(0.45)} 30%, ${T.roseA(0.45)} 70%, transparent)`,
            }}
          />

          {/* Cards grid — 2 per row on wide screens */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "2rem 2.5rem",
              width: "100%",
            }}
          >
            {SONGS.map((song, i) => (
              <SongCard key={song.id} song={song} index={i} reduced={reduced} />
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}