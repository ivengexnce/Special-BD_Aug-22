import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import ParticleBackground from "@/components/ParticleBackground";
import EasterEgg from "@/components/EasterEgg";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

const notoDevanagari = Noto_Serif_Devanagari({
  weight: ["400", "500", "700"],
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-devanagari",
});

export const metadata: Metadata = {
  title: "Kitty 🐈",
  description: "A specially crafted cinematic universe for your birthday.",
  openGraph: {
    title: "Kitty 🐈",
    description: "A specially crafted cinematic birthday experience.",
    images: [{ url: "/images/main.webp", width: 1200, height: 630, alt: "A's Universe" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitty 🐈",
    description: "A specially crafted cinematic birthday experience.",
    images: ["/images/main.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} ${notoDevanagari.variable} antialiased`}>
        {/* Suppress THREE.Clock warning from R3F engine */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const originalWarn = console.warn;
              console.warn = function(...args) {
                if (typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) {
                  return;
                }
                originalWarn.apply(console, args);
              };
            `,
          }}
        />
        <div id="__next_body_wrapper" style={{ position: "relative", minHeight: "100vh", zIndex: 1, backgroundColor: "var(--bg-color)" }}>
          {/* Fixed Background Image with Heavy Cinematic Blur */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: "url('/images/us/us5.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 1,
              filter: "blur(12px)", // Moderate memory blur
              transform: "scale(1.1)",
              opacity: 0.85 // Brighter
            }}
          />

          {/* Heavy Dark Overlay for Cinematic Contrast */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(5, 5, 5, 0.7)", // Deep midnight overlay
              zIndex: 2,
            }}
          />

          <LenisProvider>
            {/* Particles above the background but behind the content */}
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 3 }}>
              <ParticleBackground />
            </div>

            {/* Main Content */}
            <main style={{ position: "relative", zIndex: 10 }}>
              {children}
            </main>

            {/* Fixed UI — outside Lenis, always on top */}
            <ScrollProgressBar />
            <EasterEgg />
          </LenisProvider>
        </div>
      </body>
    </html>
  );
}
