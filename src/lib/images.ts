// ─── src/lib/gallery.config.ts ───────────────────────────────────────────────

export type MediaType = "image" | "video";

export interface GalleryItem {
  src: string;
  type: MediaType;
}

type RawKey = "three" | "best" | "her" | "randoms";

// ─── Core Utilities ───────────────────────────────────────────────────────────

function mediaType(src: string): MediaType {
  return /\.(mp4|webm|mov)$/i.test(src) ? "video" : "image";
}

function toItems(paths: string[]): GalleryItem[] {
  return paths.map((src) => ({ src, type: mediaType(src) }));
}

export function toSrcs(gallery: GalleryItem[]): string[] {
  return gallery.map((i) => i.src);
}

function merge(...keys: RawKey[]): string[] {
  return keys.flatMap((k) => RAW[k]);
}

// ─── Shuffle Utilities ────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function seededShuffle<T>(
  arr: T[],
  seed: number = new Date().setHours(0, 0, 0, 0)
): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Bresenham-style even spread — one decision per slot, no splice drift.
 *
 * Old approach: pre-calculated gap then splice() → each insertion shifts
 * the array so every subsequent position was wrong, causing clumping.
 *
 * New approach: walks every slot 0…total-1 and asks
 * "how many videos should have appeared by now?" If we're behind, place
 * a video; otherwise place an image. Guarantees perfectly even distribution
 * regardless of counts.
 */
function spreadVideos(items: GalleryItem[]): GalleryItem[] {
  const videos = shuffle(items.filter((i) => i.type === "video"));
  const images = shuffle(items.filter((i) => i.type === "image"));

  if (videos.length === 0) return images;
  if (images.length === 0) return videos;

  const total = videos.length + images.length;
  const result: GalleryItem[] = [];
  let vIdx = 0;
  let iIdx = 0;

  for (let slot = 0; slot < total; slot++) {
    // How many videos should ideally be placed by this slot (Bresenham rounding)
    const videosExpected = Math.round(((slot + 1) * videos.length) / total);

    if (videosExpected > vIdx && vIdx < videos.length) {
      result.push(videos[vIdx++]);
    } else if (iIdx < images.length) {
      result.push(images[iIdx++]);
    } else {
      // Exhaused images — flush remaining videos
      result.push(videos[vIdx++]);
    }
  }

  return result;
}

/**
 * Splits a gallery into n roughly equal chunks.
 * Useful when you render multiple columns or paginated sections
 * and want each section to have a balanced item count.
 *
 * e.g. balanceChunks(shuffledGallery, 3) → [col1, col2, col3]
 */
export function balanceChunks(
  gallery: GalleryItem[],
  n: number
): GalleryItem[][] {
  const chunks: GalleryItem[][] = Array.from({ length: n }, () => []);
  gallery.forEach((item, i) => chunks[i % n].push(item));
  return chunks;
}

/**
 * Pads a gallery to a target length by repeating items from the start.
 * Useful when two side-by-side sections must have the same item count.
 */
export function padToLength(
  gallery: GalleryItem[],
  targetLength: number
): GalleryItem[] {
  if (gallery.length >= targetLength) return gallery.slice(0, targetLength);
  const out = [...gallery];
  let i = 0;
  while (out.length < targetLength) {
    out.push(gallery[i++ % gallery.length]);
  }
  return out;
}

/**
 * Normalises two galleries to the same length by trimming the longer one.
 * Keeps the video spread intact on both sides.
 */
export function normalise(
  a: GalleryItem[],
  b: GalleryItem[]
): [GalleryItem[], GalleryItem[]] {
  const len = Math.min(a.length, b.length);
  return [a.slice(0, len), b.slice(0, len)];
}

// ─── Raw Asset Paths ──────────────────────────────────────────────────────────

const RAW: Record<RawKey, string[]> = {
  three: [
    "her/her2.webp",
    "her/her3.webp",
    "her/her4.webp",
    "her/her9.webp",
    "her/her10.webp",
    "her/her13.webp",
    "everything/everything9.webp",
    "everything/everything10.webp",
  ],

  best: [
    "best/best1.webp",
    "best/best2.webp",
    "best/best3.webp",
    "best/best4.webp",
    "best/best5.webp",
  ],

  her: [
    "videos/videos4.mp4",
    "her/her16.webp",
    "videos/videos3.mp4",
    "her/her34.webp",
    "her/her15.webp",
    "her/her21.webp",
    "her/her14.webp",
    "her/her22.webp",
    "her/her18.webp",
    "her/her28.webp",
    "her/her31.webp",
    "her/her32.webp",
    "her/her7.webp",
    "videos/videos5.mp4",
    "her/her23.webp",
    "her/her1.webp",
    "her/her6.webp",
    "her/her20.webp",
  ],

  randoms: [
    "everything/everything2.webp",
    "everything/everything3.webp",
    "everything/everything4.webp",
    "everything/everything45.webp",
    "everything/everything5.webp",
    "everything/everything6.webp",
    "everything/everything7.webp",
    "everything/everything33.webp",
    "everything/everything35.webp",
    "everything/everything8.webp",
    "everything/everything12.webp",
    "everything/everything20.webp",
    "everything/everything21.webp",
    "everything/everything23.webp",
    "everything/everything24.webp",
    "everything/everything26.webp",
    "everything/everything19.webp",
    "everything/everything27.webp",
    "everything/everything28.webp",
    "everything/everything29.webp",
    "everything/everything17.webp",
    "everything/everything31.webp",
    "everything/everything32.webp",
    "everything/everything34.webp",
    "everything/everything44.webp",
    "everything/everything46.webp",
    "everything/everything13.webp",
    "everything/everything11.webp",
    "everything/everything16.webp",
    "everything/everything14.webp",
    "everything/everything36.webp",
    "everything/everything37.webp",
    "everything/everything39.webp",
    "everything/everything18.webp",
    "everything/everything47.webp",
    "everything/everything40.webp",
    "everything/everything42.webp",
    "everything/everything43.webp",
    "everything/everything15.webp",
  ],
};

// ─── GalleryItem exports ──────────────────────────────────────────────────────

/** Fixed order — 3D layout depends on specific positions */
export const threeGallery: GalleryItem[] = toItems(RAW.three);

/** Fixed order — best-of is curated, not shuffled */
export const bestGallery: GalleryItem[] = toItems(RAW.best);

/** Her gallery — videos evenly spread, images shuffled */
export const herGallery: GalleryItem[] = spreadVideos(toItems(RAW.her));

/** Randoms — fully shuffled, no videos so no spread needed */
export const randomsGallery: GalleryItem[] = shuffle(toItems(RAW.randoms));

/** Combined her + randoms — even video spread, fresh every load */
export const shuffledGallery: GalleryItem[] = spreadVideos(
  toItems(merge("her", "randoms"))
);

/** Same-day stable order — safe for SSR, no hydration flash */
export const seededGallery: GalleryItem[] = seededShuffle(
  toItems(merge("her", "randoms"))
);

// ─── Legacy string[] exports (components typed as images: string[]) ───────────

export const threeGalleryPaths: string[] = toSrcs(threeGallery);
export const bestGalleryPaths: string[] = toSrcs(bestGallery);
export const herGalleryPaths: string[] = toSrcs(herGallery);
export const randomsGalleryPaths: string[] = toSrcs(randomsGallery);
export const shuffledGalleryPaths: string[] = toSrcs(shuffledGallery);
export const seededGalleryPaths: string[] = toSrcs(seededGallery);

// ─── On-demand helpers ────────────────────────────────────────────────────────

/** Re-shuffle any gallery (e.g. shuffle button click) */
export const reshuffled = (gallery: GalleryItem[]): GalleryItem[] =>
  spreadVideos(gallery);

/** Images only from any gallery */
export const imagesOnly = (gallery: GalleryItem[]): GalleryItem[] =>
  gallery.filter((i) => i.type === "image");

/** Videos only from any gallery */
export const videosOnly = (gallery: GalleryItem[]): GalleryItem[] =>
  gallery.filter((i) => i.type === "video");

/** Raw item count for one or more buckets — useful for debug/assertions */
export const rawCount = (...keys: RawKey[]): number =>
  keys.reduce((acc, k) => acc + RAW[k].length, 0);