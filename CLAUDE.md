# A's Universe — Claude/AI Agent Context

> This file is the entry point for any AI agent (Claude, Gemini, etc.) working on this codebase.
> The full specification lives in **[AGENTS.md](./AGENTS.md)** — read it completely before touching any file.

@AGENTS.md

---

## Quick Context (TL;DR for fast orientation)

- **What is this?** A cinematic birthday gift website for Aashu (best friend), built with Next.js + Three.js + GSAP.
- **Emotional tone:** Warm, poetic, intimate. Every decision should feel like a love letter.
- **Critical rule:** `page.tsx` main wrapper must be `background: transparent` — there is a fixed blurred photo (`/images/d1.jpg`) behind everything.
- **Image rule:** Never duplicate images. The sequence `d → cute → main → her → memory → us` is sacred.
- **Font rule:** Keep text small and elegant. The user explicitly asked for reduced font sizes.
- **Hindi text:** Always use `lang="hi"` + `var(--font-noto-devanagari)` for Devanagari.
- **Public paths:** Images are at `/images/filename.jpg` — never `/public/images/...`.

## When You Are About to Change Something

Ask yourself these three questions:

1. **Will this break the unified background?** (Is the wrapper still transparent?)
2. **Does this duplicate an image across sections?** (Check `src/lib/images.ts`)
3. **Does this make it feel more like love or less like love?**

If all three answers are safe — proceed.
