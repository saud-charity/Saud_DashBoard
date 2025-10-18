const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/script.js',
  '/icons/logo.png'
];

// 📦 تثبيت Service Worker وتخزين الملفات
self.addEventListener('install', (event) => {
  console.log('🟢 Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 🔁 تفعيل Service Worker وحذف الكاش القديم
self.addEventListener('activate', (event) => {
  console.log('⚙️ Activating service worker...');
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// 🌐 التعامل مع الطلبات (جلب من الكاش أولًا ثم من الإنترنت)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
