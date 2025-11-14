# Web Share Target PWA

A Progressive Web App (PWA) that demonstrates the Web Share Target API. This app can be installed on Android devices and will appear as a share target option when sharing text from Chrome.

## Features

- Installable PWA with service worker support
- Web Share Target API integration
- Displays all received share data (title, text, URL)
- Shows metadata including timestamp, user agent, and referrer
- Built with Next.js 16 and Tailwind CSS v4

## Development

Run the development server:

```bash
pnpm dev:cna-share
```

The app will be available at `http://localhost:3500`

## Installation on Android

1. Open the app in Chrome on Android
2. Tap the menu (three dots) in the browser
3. Select "Add to Home screen" or "Install app"
4. Confirm the installation
5. The app will appear on your home screen

## Testing the Share Target

1. After installing, open Chrome on Android
2. Select some text on a webpage
3. Tap the share icon
4. Select "Share Target" from the share menu
5. The app will open and display all received data

## Project Structure

- `app/` - Next.js App Router pages
  - `layout.tsx` - Root layout with PWA metadata and service worker registration
  - `page.tsx` - Home page with installation instructions
  - `share/page.tsx` - Share target page that displays received data
  - `share/route.ts` - POST handler for share target requests
- `public/` - Static assets
  - `manifest.json` - PWA manifest with share_target configuration
  - `sw.js` - Service worker for offline support
  - `icon-192.png` / `icon-512.png` - PWA icons

## Notes

- The app uses `application/x-www-form-urlencoded` encoding for share data
- Placeholder icons are included - replace with proper 192x192 and 512x512 PNG icons for production
- The service worker caches resources for offline functionality
- Built with Tailwind CSS v4 using the `@import "tailwindcss"` syntax
