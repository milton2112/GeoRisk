const CACHE_VERSION = "2026-09-05-release-2";
const APP_CACHE = `geo-risk-app-${CACHE_VERSION}`;
const TILE_CACHE = `geo-risk-tiles-${CACHE_VERSION}`;
const RUNTIME_CACHE = `geo-risk-runtime-${CACHE_VERSION}`;
const APP_BASE_URL = new URL("./", self.location.href);
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
  "/data/runtime_supplemental.json",
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
  if (!url.pathname.startsWith(APP_BASE_URL.pathname)) return "";
  return "/" + url.pathname.slice(APP_BASE_URL.pathname.length).replace(/\/+$/, "");
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
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
    await trimCache(cacheName, maxEntries);
  } catch (error) {
    console.warn("GeoRisk no pudo guardar cache offline:", error);
  }
  return response;
}

async function matchCached(cacheName, request) {
  try {
    return await (await caches.open(cacheName)).match(request);
  } catch {
    return null;
  }
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
    ).then(() => self.clients.claim())
  );
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
    const path = normalizePathname(url);
    if (!path) return;
    const isNavigation = event.request.mode === "navigate" || path === "/" || path === "/index.html";
    const isShell = path === "/" || isAppShellRequest(url);

    if (isHeavyRuntimeRequest(url)) {
      event.respondWith(fetch(event.request).catch(() => Response.error()));
      return;
    }

    if (isNavigation || isShell) {
      // Version/query variants must not evict the installed offline shell.
      const cacheKey = new URL(path === "/" ? "./index.html" : "." + path, APP_BASE_URL).href;
      event.respondWith(
        fetch(event.request)
          .then(response => isShell ? putIfOk(APP_CACHE, cacheKey, response, APP_SHELL.length) : response)
          .catch(async () => {
            const fallbackKey = isNavigation ? new URL("./index.html", APP_BASE_URL).href : cacheKey;
            return await matchCached(APP_CACHE, fallbackKey) || Response.error();
          })
      );
      return;
    }

    if (isRuntimeCacheableRequest(url)) {
      event.respondWith(
        matchCached(RUNTIME_CACHE, event.request).then(cached =>
          cached ||
          fetch(event.request).then(response => putIfOk(RUNTIME_CACHE, event.request, response, MAX_RUNTIME_CACHE_ENTRIES))
        ).catch(() => Response.error())
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
          .catch(() => cached || Response.error());

        event.waitUntil(networkFetch);
        return cached || networkFetch;
      }).catch(() => fetch(event.request).catch(() => Response.error()))
    );
    return;
  }

  if (url.hostname === "cesium.com") {
    event.respondWith(fetch(event.request).catch(() => Response.error()));
  }
});
