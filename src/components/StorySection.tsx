"use client";

import { motion } from "framer-motion";

// StorySection is a generic section wrapper used across multiple parts of the page.
// mood="garba" adds a warm gold border (top and bottom) for the Garba chapter.
// mood="raw" disables all animations for sections requiring pure static text.
//
// IMPORTANT: This component deliberately does NOT set any backgroundColor.
// The global blurred d1.webp background (layout.tsx) must show through every section.
// Only glassmorphism card children may set their own background.

export default function StorySection({
  children,
  mood = "dark",
  minHeight = "100vh"
}: {
  children: React.ReactNode,
  mood?: "dark" | "garba" | "raw",
  minHeight?: string
}) {
  const isGarba = mood === "garba";
  const isRaw = mood === "raw";

  if (isRaw) {
    return (
      <section style={{
        minHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        textAlign: "center",
        width: "100%",
        position: "relative",
        zIndex: 10,
        // Transparent — the cinematic background shows through
        background: "transparent",
      }}>
        {children}
      </section>
    );
  }

  return (
    <section
      style={{
        minHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 2rem",
        textAlign: "center",
        width: "100%",
        position: "relative",
        zIndex: 10,
        // Transparent base — only the Garba mood adds decorative borders.
        // Previously this set backgroundColor for garba, which created an opaque
        // block that interrupted the unified continuous background. Removed.
        background: "transparent",
        borderTop: isGarba ? "1px solid rgba(212, 175, 55, 0.2)" : "none",
        borderBottom: isGarba ? "1px solid rgba(212, 175, 55, 0.2)" : "none",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ maxWidth: "800px", width: "100%" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
