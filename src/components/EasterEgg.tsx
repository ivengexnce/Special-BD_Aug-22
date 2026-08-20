"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Easter egg: press K then A within 1.2s to reveal the toast.
// (K + A = first letters of the birthday person's name)

export default function EasterEgg() {
  const [showToast, setShowToast] = useState(false);
  const kPressedRef = useRef(false);
  // Use ReturnType<typeof setTimeout> instead of `any`
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "k") {
        kPressedRef.current = true;

        // Clear any previous reset timer
        if (timerRef.current) clearTimeout(timerRef.current);

        // Reset the K-pressed flag after 1.2s if A isn't pressed
        timerRef.current = setTimeout(() => {
          kPressedRef.current = false;
        }, 1200);
      }

      if (key === "a" && kPressedRef.current) {
        kPressedRef.current = false;
        if (timerRef.current) clearTimeout(timerRef.current);

        setShowToast(true);

        // Clear any previous dismiss timer before setting a new one
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = setTimeout(() => {
          setShowToast(false);
        }, 3500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Cancel any pending timers on unmount to prevent state updates on unmounted component
      if (timerRef.current) clearTimeout(timerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--primary-accent)",
            color: "var(--deep-base)",
            padding: "12px 28px",
            borderRadius: "30px",
            fontFamily: "var(--font-dm-sans)",
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            boxShadow: "0 10px 40px rgba(242, 196, 206, 0.45)",
            zIndex: 10000,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          🐱❤️ Kitty was here.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
