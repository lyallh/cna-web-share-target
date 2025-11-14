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
    // Note (Sonnet 4.5): Using GET method because service workers cannot intercept
    // external POST navigation requests (security limitation).
    share_target: {
      // Three options (for demonstration purposes):
      // 1. POST request to /share (handled by server and forwards to /shared)
      //    - NB: Cannot intercept with service worker because it's an external navigation request.
      // 2. GET request to /share (handled at server and forwards to /shared)
      // 3. Direct GET to /shared (no server involvement)
      action: '/shared',
      method: 'GET',
      // enctype: 'application/x-www-form-urlencoded',    // POST only
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
      },
    },
  }
}
