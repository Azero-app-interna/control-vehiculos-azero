/* AZERO — Service Worker (avisos de fichaje) */
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = { title: 'AZERO · Fichaje', body: 'Recuerda fichar.' };
  try { if (e.data) d = Object.assign(d, e.data.json()); }
  catch (_) { try { if (e.data) d.body = e.data.text(); } catch (__) {} }
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body,
    tag: d.tag || 'fichaje',
    renotify: true,
    requireInteraction: true,
    silent: false,
    vibrate: [400, 150, 400, 150, 400, 150, 400],
    data: { url: d.url || './' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const u = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
      for (const w of ws) { if ('focus' in w) return w.focus(); }
      return clients.openWindow(u);
    })
  );
});
