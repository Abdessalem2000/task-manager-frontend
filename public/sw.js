const CACHE_NAME = 'taskforce-mobile-v1.0.0'
const urlsToCache = [
  '/',
  '/working-app',
  '/sign-in',
  '/sign-up',
  '/manifest.json',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main-app.js'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching app shell')
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('✅ Service Worker: Activation complete')
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and external resources
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return
  }

  // For API routes, try network first, then cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Try to serve from cache if network fails
          return caches.match(request)
        })
    )
    return
  }

  // For other resources, try cache first, then network
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('📱 Serving from cache:', request.url)
          return response
        }

        // Network request
        return fetch(request).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone response for caching
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache)
            })

          return response
        })
      })
  )
})

// Background sync for offline operations
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag)
  
  if (event.tag === 'sync-offline-operations') {
    event.waitUntil(
      // Process queued offline operations
      processOfflineQueue()
    )
  }
})

// Process offline queue
async function processOfflineQueue() {
  try {
    // Get queued operations from IndexedDB or localStorage
    const queue = JSON.parse(localStorage.getItem('taskforce_sync_queue') || '[]')
    
    for (const operation of queue) {
      try {
        // Retry the operation
        const response = await fetch(`/api/${operation.tableName}`, {
          method: operation.operation === 'create' ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(operation.data)
        })

        if (response.ok) {
          // Remove from queue on success
          const updatedQueue = queue.filter((op) => op.id !== operation.id)
          localStorage.setItem('taskforce_sync_queue', JSON.stringify(updatedQueue))
          console.log('✅ Synced operation:', operation.id)
        }
      } catch (error) {
        console.error('❌ Failed to sync operation:', operation.id, error)
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error)
  }
}

// Push notifications (for future implementation)
self.addEventListener('push', (event) => {
  console.log('📬 Push notification received')
  
  const options = {
    body: 'Nouvelle visite client ajoutée',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'taskforce-notification',
    data: {
      url: '/working-app'
    }
  }

  event.waitUntil(
    self.registration.showNotification('TaskForce Mobile', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked')
  event.notification.close()

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})
