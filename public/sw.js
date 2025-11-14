const CACHE_NAME = 'web-share-target-v6'
const urlsToCache = []

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      self.clients.claim(),
    ])
  )
})

// Handle Web Share Target POST to /share
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Debug logging
  console.log('SW fetch:', event.request.method, url.pathname)

  if (event.request.method === 'POST' && url.pathname === '/share') {
    console.log('SW intercepting POST to /share')
    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData()
          const title = formData.get('title') || ''
          const text = formData.get('text') || ''
          const sharedUrl = formData.get('url') || ''

          // Build redirect URL with query params
          const params = new URLSearchParams()
          if (title) params.set('title', title)
          if (text) params.set('text', text)
          if (sharedUrl) params.set('url', sharedUrl)

          const redirectUrl = `/shared?${params.toString()}`

          // Return a redirect response
          return Response.redirect(redirectUrl, 303)
        } catch (error) {
          console.error('Error processing share in service worker:', error)
          return Response.redirect('/shared?error=1', 303)
        }
      })()
    )
    return
  }

  // Default fetch behavior - serve from cache, fallback to network
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    })
  )
})
