# A's Universe — Complete Agent Manual
**Version:** 2.0 · **Last Updated:** August 2026

---

## 🌸 The Project, In One Sentence

This is a **handcrafted cinematic website** — a birthday gift from one person to their best friend Aashu (Aasawari). Every component, poem, and interaction was designed to feel like a love letter rendered as code.

---

## 🎭 Emotional Tone — Read Before Writing Anything

> *"This website was not built with code. It was built with every poem I couldn't say out loud."*

This is the guiding philosophy. Treat it like one:

- **Warm, intimate, slightly melancholic** — like reading an old diary
- **Poetic, not corporate** — no generic UI patterns, no Material Design vibes
- **Layered and cinematic** — things reveal themselves slowly, the way memories do
- **Bilingual** — English poems & Hindi (Devanagari) quotes coexist naturally
- When in doubt: **choose warmth over cleanliness**

---

## 👤 The Subject

| Field | Value |
|---|---|
| Name | Aashu / Aasawari |
| Also called | "Pookie Maru" (in code signatures and captions) |
| Relationship | Best friend — the most important person |
| Occasion | Birthday surprise (August 22) |
| Personality | Loud, soft, chaotic, sensitive, brave, childish in the best ways |

**Do NOT** change the name "Aashu" to anything else. Do not remove "Pookie Maru" from any signature.

---

## 🏗️ Technology Stack

```
Framework:    Next.js 16.3.1 (App Router, Turbopack)
Language:     TypeScript / TSX
Styling:      Inline CSS-in-JS only — no Tailwind, no CSS modules (except page.module.css)
3D Engine:    @react-three/fiber + @react-three/drei + @react-three/postprocessing + postprocessing
Animation:    GSAP + ScrollTrigger (scroll-driven), Framer Motion (component-level)
Smooth Scroll: Lenis (wraps entire body via LenisProvider)
Audio:        Howler.js (heartbeat in LoadingScreen, ambient audio)
Music:        Spotify Embed iframes (dark theme, ?theme=0)
Fonts:        Playfair Display · DM Sans · DM Mono · Noto Serif Devanagari
```

**Installed but check if present before using:**
- `@react-three/postprocessing` — installed Aug 2026, required by `ThreeFloatingGallery.tsx`
- `postprocessing` — same

---

## 📁 File Map

```
aashu-universe/
├── public/
│   └── images/              ← ALL photos (41 total). Served at /images/filename.jpg
│       ├── d1.jpg–d5.jpg    ← "Before I knew your name" series
│       ├── cute.jpg, cute2–4 ← Cute/candid photos
│       ├── main.jpg, main2–3 ← Main portraits
│       ├── her.jpg, her1–7  ← Her close-ups / personal shots
│       ├── memory_1–9.jpg   ← Archive memories (used in MemoryGallery)
│       ├── us.jpg, us1      ← Photos together
│       ├── gallery1–11.jpg  ← General gallery fills
│       ├── funny.jpg, funny2 ← Candid fun shots
│       └── noise.svg        ← Film grain overlay texture
│
├── src/
│   ├── app/
│   │   ├── page.tsx         ← MAIN PAGE: assembles all sections in order
│   │   ├── layout.tsx       ← Global bg blur, fonts, LenisProvider, AudioController
│   │   ├── globals.css      ← CSS custom properties (design tokens only)
│   │   └── page.module.css  ← Minimal page-level overrides
│   │
│   ├── components/
│   │   ├── LoadingScreen.tsx        ← Cinematic intro typewriter + circle-bloom open
│   │   ├── InteractiveTimeline.tsx  ← Tap/hover timeline cards with photo reveals
│   │   ├── MemoryGallery.tsx        ← GSAP horizontal-pin scroll archive
│   │   ├── MasonryGallery.tsx       ← Full masonry photo grid
│   │   ├── SpotifySection.tsx       ← "Our Soundtrack" with animated waveform
│   │   ├── FinaleSection.tsx        ← Cinematic ending with floating photo galaxy
│   │   ├── ThreeCity.tsx            ← R3F 3D city skyline (Section 1 bg)
│   │   ├── ThreeMarigolds.tsx       ← R3F falling marigold petals (Section 3 bg)
│   │   ├── ThreeFloatingGallery.tsx ← R3F floating photos with Bloom + ChromAb
│   │   ├── ThreeConfetti.tsx        ← Birthday confetti (FinaleSection trigger)
│   │   ├── LenisProvider.tsx        ← Wraps children with Lenis smooth scroll
│   │   ├── AudioController.tsx      ← Floating audio mute/unmute control
│   │   ├── ParticleBackground.tsx   ← Tsparticles star field (fixed, z-index 3)
│   │   ├── StorySection.tsx         ← Generic section wrapper (dark/garba/raw mood)
│   │   └── EasterEgg.tsx            ← Hidden surprise (konami code or similar)
│   │
│   └── lib/
│       └── images.ts        ← Single source of truth for all image arrays
```

---

## 🖼️ The Image System — CRITICAL, READ CAREFULLY

### The Law: No Image Duplication
Every image must appear in **exactly one** gallery component. The file [`src/lib/images.ts`](src/lib/images.ts) enforces this.

### Image Exports

| Export | Consumer | Contents |
|---|---|---|
| `archiveImages` | `MemoryGallery` | 7 curated memory images, hardcoded with dates/captions |
| `threeGallery` | `ThreeFloatingGallery` | First half of sorted remaining images |
| `shuffledGallery` | `MasonryGallery` | Second half of sorted remaining images |

### The Sacred Sequence
All images sort by this prefix order:
```
d  →  cute  →  main  →  her  →  memory  →  us
```
This is chronological storytelling. **Never change the order.**

### Public Path Rule — Non-Negotiable
```
✅ CORRECT:   /images/d1.jpg
❌ WRONG:     /public/images/d1.jpg   ← will 404 in Next.js
```

---

## 📐 Page Section Architecture

Sections in `page.tsx` appear in this exact order:

| # | Name | Key Elements | Notes |
|---|---|---|---|
| 1 | Before I Knew Your Name | `ThreeCity` (bg), poem, dates "June 21 2024" | Font: Playfair italic, size reduced |
| 2 | The Timeline | `InteractiveTimeline` | Tap/hover reveals photo. Spine line + pulsing nodes |
| 3 | The Garba Chapter | `ThreeMarigolds` (bg), Hindi text | Gold borders, warm festive tone |
| 4 | Who Is Aashu | Glassmorphism card, LOUD/SOFT/BRAVE list | Character portrait section |
| 5 | The Archive | `MemoryGallery` | GSAP horizontal-pin scroll. 7 dated memory cards |
| 6+7 | Poems & Quotes | Horizontal swipe gallery (CSS snap) | All poems + Hindi quotes in `.thought-card` glass cards |
| 8 | The Gallery | `MasonryGallery` | Full masonry grid, auto-sized |
| 9 | The Finale | `FinaleSection` → `ThreeFloatingGallery` | Cinematic bloom reveal, floating photo galaxy |

---

## 🎨 Design System

### CSS Custom Properties (`globals.css`)

```css
--primary-accent: #F2C4CE   /* Nude blush pink — the emotional center */
--deep-base:      #0A0A0F   /* Near-black — the void everything lives in */
--warm-ivory:     #F5EFE6   /* Warm off-white for all body text */
--gold-ember:     #D4A853   /* Warm gold — Garba, warmth, special words */
--soft-lilac:     #C8B8DA   /* Lilac — poem sections, intimacy, softness */
--archive-rust:   #8B4513   /* Diary card borders — aged paper texture */
```

**Additional color used inline (not in CSS):**
```
#D44A68   ← Deep rose/crimson — intensity, love, "stayed", passion words
```

### The Global Background Layering (layout.tsx)

```
Layer  z-index   Element
────────────────────────────────────────────
  1      1       Fixed blurred d1.jpg (blur: 20px, opacity: 0.6, scale: 1.1)
  2      2       Dark overlay (rgba 5,5,5, 0.85) — cinematic contrast
  3      3       ParticleBackground (tsparticles stars)
 10     10       <main> — all page content
```

**The page wrapper in `page.tsx` MUST be `background: transparent`** to let layers 1–3 show through. Any section wrapper that sets a solid background will break the unified visual.

### Glassmorphism Card Recipe
Used for poems, timeline cards, and text blocks:
```css
background: rgba(20, 15, 20, 0.4)
backdrop-filter: blur(20px)
-webkit-backdrop-filter: blur(20px)
border: 1px solid rgba(242, 196, 206, 0.15)
border-radius: 30px
box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5)
```

### Typography Rules

| Font Variable | Use Case | Style |
|---|---|---|
| `--font-playfair` | Headings, poems, quotes | italic, weight 400–600 |
| `--font-dm-sans` | Body text, captions, Hindi contexts | normal, weight 300–500 |
| `--font-dm-mono` | Dates, labels, metadata, "TAP TO RECALL" | uppercase, tracked |
| `--font-noto-devanagari` | ALL Hindi/Devanagari text | always pair with `lang="hi"` |

**Font size philosophy:** Small, refined, and elegant. Never overwhelm. Target sizes:
- Section headings: `clamp(2rem, 4vw, 3rem)`
- Poem body: `clamp(1rem, 2.5vw, 1.4rem)` — the user explicitly asked for smaller fonts
- Labels/dates: `10–13px`, monospace

### Emotional Color Mapping
When marking up poem text with `<span>` colors:

| Word Type | Color |
|---|---|
| Gold / warmth / Garba words | `var(--gold-ember)` `#D4A853` |
| Pink / emotional / accent words | `var(--primary-accent)` `#F2C4CE` |
| Intensity / love / passion words | `#D44A68` (deep rose) |
| Hindi spiritual words | Same rules apply |

---

## 📖 Content Reference

### Loading Screen (LoadingScreen.tsx)
Typewriter text — **DO NOT CHANGE**:
```
"You called it home and stayed."
           ^^^^       ^^^^^
           gold       #D44A68
```
- Changed from "She" → "You" deliberately by the user
- Followed by subtitle: *"This website was not built with code..."*
- Signed: **— Pookie Maru ❤️** (was changed from "Pookie" — preserve "Maru")

### The MemoryGallery (7 Archive Cards)
Each card has a specific date, Spotify track, photo, and handwritten caption. These are **not generatable** — they are specific real memories:

| # | Date | Song | Memory |
|---|---|---|---|
| 1 | June 21 2024 | Lana Del Rey — Diet Mountain Dew (`3815bS2C4z4965gJv0a3w6`) | First sighting |
| 2 | July 13 2024 | *(no song)* | From the archive |
| 3 | Sept 14 2024 | *(no song)* | 3 days before everything |
| 4 | Feb 1 2025 | Cigarettes After Sex — Apocalypse (`0yc6Gst2xkRu0eMLeRMGCX`) | Heart-shaped flowers |
| 5 | May 8 2025 | Arijit Singh — Jaan Nisaar (`6a16w5a2zR3yY6z3i3w9b0`) | 11:40 PM |
| 6 | June 25 2025 | Philharmonia Orch — The Winner Takes It All (`3x18w9lJ9Z1a282f1lC5mP`) | Perfect poem |
| 7 | Nov 6 2025 | Kabhi Kabhie *(no embed)* | 1:23 AM |

### The Interactive Timeline (5 Dates, Section 2)
```
13 Sept 2024 → "I saw you for the first time."           → /images/d1.jpg
17 Sept 2024 → "The universe stopped pretending..."       → /images/d2.jpg
23 Sept 2024 → "You joined the group."                   → /images/d3.jpg
25 Sept 2024 → "We started talking."                     → /images/d4.jpg
26 Sept 2024 → "You walked past me. Something shifted."  → /images/d5.jpg
               ────────────────────────────── ↑ highlight in #D44A68
```

### SpotifySection ("Our Soundtrack", Section ~5.5)
Currently 2 songs:
- **Count On Me** — Bruno Mars (`1LjsLXCGFi8Z72x2v2tKjS`)
- **I'll Be There For You** — The Rembrandts (`7rglLriMNBPAyuJOMGlsSt`)

---

## 🧩 Component Behavior Reference

### InteractiveTimeline.tsx
- 3-column CSS grid layout: `[card] [28px spine node] [card]`
- Alternating left/right cards per index (even=left, odd=right)
- 5th event is "special" — full-width centered card with deep rose styling
- SpineNode has animated pulsing rings + traveling glow particle on the spine
- Cards have `whileInView` fade-in from sides
- Tap/click → `AnimatePresence` expands an image panel inside the card
- "TAP TO RECALL" hint disappears when card is open
- All animations respect `prefers-reduced-motion`

### ThreeFloatingGallery.tsx
- Uses custom GLSL ShaderMaterial (NOT meshBasicMaterial)
- 3 depth layers (far/mid/near) with independent parallax multipliers
- Mouse parallax: `layerGrps[layer].position.x = mouse.cx * PARALLAX_X[layer]`
- Photos dissolve at wrap-point (no hard pop via opacity fade)
- Post-processing: `Bloom(intensity: 0.6)` + `ChromaticAberration`
- Canvas: `dpr={[1, 1.5]}`, `alpha: true`, `antialias: false`
- Always guard: `if (!mesh || !cfg) return;` in useFrame

### MemoryGallery.tsx
- GSAP `pin: true` horizontal scroll — the section stays fixed while you scroll
- Scroll distance = `scrollWrapper.scrollWidth`
- Cards are `width: min(85vw, 400px)`, `height: 650px`
- Spotify iframes are `height: 80` (compact player, dark theme)
- The `backgroundColor: "var(--deep-base)"` on the section container is intentional here (needed for GSAP pin visual)

### LoadingScreen.tsx
- GSAP TextPlugin typewriter → heartbeat oscillator → `clipPath: circle(150%)` bloom
- After 4s hold: fades to opacity 0 → calls `onComplete()` → `setLoading(false)` in page
- The `<div ref={textRef}>` renders innerHTML (HTML spans in the text value work)

---

## ⚠️ The Seven Laws — Never Break These

1. **Section wrappers must be `background: transparent`** — only glassmorphism cards may have backgrounds. The blurred memory background must shine through everywhere.

2. **No image duplication** — each photo appears in exactly one section. Check `images.ts` before adding an image anywhere.

3. **The image sequence is sacred** — `d → cute → main → her → memory → us`. This is chronological storytelling. Never reorder.

4. **Font sizes must stay small and elegant** — never exceed `clamp(1.5rem, 3vw, 1.75rem)` for poem body text. The user explicitly asked for reduced font sizes.

5. **Hindi text always gets `lang="hi"` AND `fontFamily: "var(--font-noto-devanagari)"`** — never render it in DM Sans or Playfair.

6. **Preserve "Pookie Maru" and "You called it home"** — the loading screen text was edited deliberately. The "She → You" change and "Pookie → Pookie Maru" are intentional personal touches.

7. **Public image paths are `/images/...`** — never `/public/images/...`. Next.js serves `public/` at root.

---

## 🐛 Known Issues & Fixes

### `Expected '</', got 'ident'` in page.tsx
JSX comments `{/* ... */}` cannot be direct siblings of elements inside `{condition && (...)}`. Fix: move the comment inside the parent `<div>`.

```jsx
// ❌ WRONG — causes parser crash
{!loading && (
  {/* comment */}
  <div>...</div>
)}

// ✅ CORRECT
{!loading && (
  <div>
    {/* comment */}
    ...
  </div>
)}
```

### `Cannot read properties of undefined (reading 'speed')` in ThreeFloatingGallery
`meshRefs.current[i]` can be stale. Always guard:
```ts
const cfg = cfgs[i];
if (!mesh || !cfg) return;
```

### `Module not found: Can't resolve '@react-three/postprocessing'`
```bash
npm install @react-three/postprocessing postprocessing
```

### Background image not visible / page is solid black
`page.tsx` wrapper has `background: "radial-gradient(...)"` — change to `background: "transparent"`.

### Spotify iframes not playing
Ensure `allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"` is on every iframe. Track IDs must be valid Spotify track IDs (22-character alphanumeric string).

### THREE.Clock deprecation warning in console
Suppressed in `layout.tsx` via a `console.warn` patch. Do not remove it.

---

## 💡 The Philosophy (Keep This in Your Context)

> *When you make a change, ask: "Does this make the experience feel more like love?"*

If it makes things cleaner but colder — reconsider.
If it makes things warmer but slightly messier — lean towards warmth.

This is a birthday gift. The person who receives it should feel overwhelmed — in the best possible way.
