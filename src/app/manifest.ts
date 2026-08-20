import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kitty 🐈',
    short_name: 'Kitty',
    description: 'A specially crafted cinematic birthday experience.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
