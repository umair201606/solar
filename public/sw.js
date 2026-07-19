/* Solarkon price-alert service worker: shows web-push notifications and
   focuses/opens the store when one is clicked. */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data && event.data.text() };
  }

  const title = data.title || 'Solarkon';
  const options = {
    body: data.body || '',
    icon: data.icon || '/brand-logos/android-chrome-192x192.png',
    badge: data.badge || '/favicon.ico',
    tag: data.tag || 'solarkon',
    renotify: true,
    data: { url: data.url || '/store' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/store';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(target) && 'focus' in client) return client.focus();
      }
      return self.clients.openWindow(target);
    })
  );
});
