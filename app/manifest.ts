import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Web Share Target PWA',
    short_name: 'Share Target',
    description: 'PWA app to investigate Web Share Target API',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    // Web Share Target API configuration
    share_target: {
      // Three options (for demonstration purposes):
      // 1. POST request to /share (handled by service worker and forwards to /shared)
      // 2. GET request to /share (sends to server and forwards to /shared)
      // 3. Direct GET to /shared (no server involvement)
      action: '/share',
      method: 'GET',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
      },
    },
  }
}
