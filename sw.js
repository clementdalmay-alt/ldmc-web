/* Service worker de l'appli web Le Mur des cœurs.
   Tout est gardé en cache à l'installation : le jeu marche hors-ligne. Une nouvelle version s'installe en arrière-plan
   et attend ; la page propose « Recharger » et envoie « activer » quand la joueuse accepte.
   La version et la liste des fichiers sont remplies par outils/web.py. */
const VERSION = "0.24.1-c90ba460", CACHE = 'mur-des-coeurs-' + VERSION, FICHIERS = ["./", "index.html", "manifest.webmanifest", "polices.css", "fonts/inter-latin-400-normal.woff2", "fonts/inter-latin-500-normal.woff2", "fonts/inter-latin-600-normal.woff2", "fonts/inter-latin-ext-400-normal.woff2", "fonts/inter-latin-ext-500-normal.woff2", "fonts/inter-latin-ext-600-normal.woff2", "fonts/playfair-display-latin-500-italic.woff2", "fonts/playfair-display-latin-600-normal.woff2", "fonts/playfair-display-latin-700-normal.woff2", "fonts/playfair-display-latin-ext-500-italic.woff2", "fonts/playfair-display-latin-ext-600-normal.woff2", "fonts/playfair-display-latin-ext-700-normal.woff2", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('mur-des-coeurs-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('message', e => { if (e.data === 'activer') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(m => m || fetch(r).catch(() => r.mode === 'navigate' ? caches.match('./') : Response.error())));
});
