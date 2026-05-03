const CACHE_VERSION = "2026-05-02-boot-12";
const APP_CACHE = `geo-risk-app-${CACHE_VERSION}`;
const TILE_CACHE = `geo-risk-tiles-${CACHE_VERSION}`;
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./app-runtime.js",
  "./app-theme.js",
  "./app-text.js",
  "./app-country-panel.js",
  "./app-timeline-conflicts.js",
  "./README.md",
  "./CHANGELOG.md",
  "./TECHNICAL.md",
  "./USER_GUIDE.md",
  "./BACKEND_PLAN.md",
  "./favicon.ico",
  "./favicon.svg",
  "./data/countries_index.json",
  "./data/geo_aliases.json",
  "./data/world_countries_simplified.geo.json",
  "./assets/flags/ARG.svg",
  "./assets/flags/BRA.svg",
  "./assets/flags/USA.svg",
  "./assets/flags/CHN.svg",
  "./assets/flags/GBR.svg",
  "./assets/flags/FRA.svg",
  "./assets/flags/DEU.svg",
  "./assets/flags/IND.svg",
  "./assets/flags/BHS.svg",
  "./assets/flags/GRL.svg",
  "./assets/flags/MKD.svg",
  "./assets/flags/PSE.svg",
  "./assets/flags/SRB.svg",
  "./assets/flags/TWN.svg",
  "./assets/flags/TZA.svg",
  "./assets/coats/ARG.svg",
  "./assets/coats/BRA.svg",
  "./assets/coats/USA.svg",
  "./assets/coats/CHN.svg",
  "https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/Widgets/widgets.css",
  "https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/Cesium.js"
];

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
          .filter(key => ![APP_CACHE, TILE_CACHE].includes(key))
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
    const isNavigation = event.request.mode === "navigate";
    const isStaticAsset = [".html", ".css", ".js", ".json", ".geojson"].some(ext => url.pathname.endsWith(ext));

    if (isNavigation || isStaticAsset || url.pathname === "/" || url.pathname.endsWith("/index.html")) {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            const copy = response.clone();
            caches.open(APP_CACHE).then(cache => cache.put(event.request, copy));
            return response;
          })
          .catch(() => caches.match(event.request))
      );
      return;
    }

    event.respondWith(
      caches.match(event.request).then(cached =>
        cached ||
        fetch(event.request).then(response => {
          const copy = response.clone();
          caches.open(APP_CACHE).then(cache => cache.put(event.request, copy));
          return response;
        })
      )
    );
    return;
  }

  if (url.hostname === "tile.openstreetmap.org") {
    event.respondWith(
      caches.open(TILE_CACHE).then(async cache => {
        const cached = await cache.match(event.request);
        const networkFetch = fetch(event.request)
          .then(response => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cached);

        return cached || networkFetch;
      })
    );
    return;
  }

  if (url.hostname === "cesium.com") {
    event.respondWith(
      caches.open(APP_CACHE).then(async cache => {
        const cached = await cache.match(event.request);
        const networkFetch = fetch(event.request)
          .then(response => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cached);

        return cached || networkFetch;
      })
    );
  }
});
