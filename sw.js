const CACHE_VERSION = "2026-07-11-release-1";
const APP_CACHE = `geo-risk-app-${CACHE_VERSION}`;
const TILE_CACHE = `geo-risk-tiles-${CACHE_VERSION}`;
const RUNTIME_CACHE = `geo-risk-runtime-${CACHE_VERSION}`;
const APP_SHELL = [
  "./index.html",
  "./style.css",
  "./script.js",
  "./app-runtime.js",
  "./app-boot-scheduler.js",
  "./app-map.js",
  "./app-map-styles.js",
  "./app-map-interactions.js",
  "./app-store.js",
  "./favicon.ico",
  "./favicon.svg",
  "./data/countries_index.json",
  "./data/geo_aliases.json"
];

const HEAVY_RUNTIME_PATHS = [
  "/data/countries_full.json",
  "/data/conflict_details.generated.json",
  "/data/conflict_dyadic_summary.json"
];

const RUNTIME_CACHEABLE_PATHS = [
  "/data/countries/",
  "/data/world_countries_simplified.geo.json",
  "/assets/flags/",
  "/assets/coats/",
  "/app-",
  "/style-polish.css",
  "/reports/",
  "/USER_GUIDE.md",
  "/TECHNICAL.md",
  "/BACKEND_PLAN.md",
  "/CHANGELOG.md"
];

const RUNTIME_CACHEABLE_EXTENSIONS = [".svg", ".json", ".geojson", ".md", ".js", ".css"];
const MAX_RUNTIME_CACHE_ENTRIES = 80;
const MAX_TILE_CACHE_ENTRIES = 140;

function normalizePathname(url) {
  return url.pathname.replace(/\/+$/, "") || "/";
}

function isHeavyRuntimeRequest(url) {
  return HEAVY_RUNTIME_PATHS.some(path => normalizePathname(url).endsWith(path));
}

function isAppShellRequest(url) {
  const path = normalizePathname(url);
  return APP_SHELL.some(resource => {
    const normalized = resource.replace(/^\./, "").replace(/\/+$/, "") || "/";
    return path === normalized;
  });
}

function isRuntimeCacheableRequest(url) {
  const path = normalizePathname(url);
  return RUNTIME_CACHEABLE_PATHS.some(prefix => path.startsWith(prefix)) &&
    RUNTIME_CACHEABLE_EXTENSIONS.some(ext => path.endsWith(ext));
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) {
    return;
  }
  await Promise.all(keys.slice(0, keys.length - maxEntries).map(request => cache.delete(request)));
}

async function putIfOk(cacheName, request, response, maxEntries) {
  if (!response || !response.ok) {
    return response;
  }
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  trimCache(cacheName, maxEntries).catch(() => null);
  return response;
}

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(APP_CACHE).then(cache =>
      Promise.allSettled(
        APP_SHELL.map(resource =>
          cache.add(resource).catch(error => {
            console.warn("GeoRisk cache inicial omitido:", resource, error);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith("geo-risk-") && ![APP_CACHE, TILE_CACHE, RUNTIME_CACHE].includes(key))
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  if (url.origin === self.location.origin) {
    const isNavigation = event.request.mode === "navigate" || url.pathname === "/" || url.pathname.endsWith("/index.html");

    if (isHeavyRuntimeRequest(url)) {
      event.respondWith(fetch(event.request));
      return;
    }

    if (isNavigation || isAppShellRequest(url)) {
      event.respondWith(
        fetch(event.request)
          .then(response => putIfOk(APP_CACHE, event.request, response, APP_SHELL.length + 8))
          .catch(async () => {
            const cached = await caches.match(event.request, { ignoreSearch: true });
            if (cached) {
              return cached;
            }
            if (isNavigation) {
              return caches.match("./index.html", { ignoreSearch: true });
            }
            return Response.error();
          })
      );
      return;
    }

    if (isRuntimeCacheableRequest(url)) {
      event.respondWith(
        caches.match(event.request).then(cached =>
          cached ||
          fetch(event.request).then(response => putIfOk(RUNTIME_CACHE, event.request, response, MAX_RUNTIME_CACHE_ENTRIES))
        )
      );
    }
    return;
  }

  if (url.hostname === "tile.openstreetmap.org") {
    event.respondWith(
      caches.open(TILE_CACHE).then(async cache => {
        const cached = await cache.match(event.request);
        const networkFetch = fetch(event.request)
          .then(response => putIfOk(TILE_CACHE, event.request, response, MAX_TILE_CACHE_ENTRIES))
          .catch(() => cached);

        return cached || networkFetch;
      })
    );
    return;
  }

  if (url.hostname === "cesium.com") {
    event.respondWith(fetch(event.request));
  }
});
