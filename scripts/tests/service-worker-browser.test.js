import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";
import { createLocalSmokeServer } from "../localSmokeServer.js";

const staticHandler = createLocalSmokeServer().listeners("request")[0];
const shellHtml = '<!doctype html><title>GeoRisk offline fixture</title><main>Offline shell</main>';
const heavyPaths = ["countries_full.json", "conflict_details.generated.json", "conflict_dyadic_summary.json"];
const workerSource = await fs.readFile("sw.js", "utf8");
const appSource = await fs.readFile("script.js", "utf8");
const lifecycleSource = appSource.slice(appSource.indexOf("let offlineRegistrationEpoch ="), appSource.indexOf("async function init()"));
const indexHtml = await fs.readFile("index.html", "utf8");
const noticeHtml = indexHtml.match(/<aside id="offline-update-notice"[\s\S]*?<\/aside>/)[0];
let workerRevision = null;
let failInstallPath = null;

// Real worker and local assets, with a minimal document to isolate CacheStorage from map/CDN loading.
const server = http.createServer((request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  const pathname = url.pathname.replace(/^\/GeoRisk\//, "/");
  response.setHeader("X-Test-Probe", url.searchParams.get("probe") || "initial");
  if (pathname === failInstallPath) {
    response.writeHead(503, { "Cache-Control": "no-store" });
    response.end("Test incomplete release");
  } else if (pathname === "/sw.js" && workerRevision) {
    response.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-store" });
    response.end(workerSource.replace(/const CACHE_VERSION = "[^"]+"/, `const CACHE_VERSION = "${workerRevision}"`));
  } else if (["/", "/index.html", "/sw-client.html"].includes(pathname)) {
    response.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-store" });
    response.end(shellHtml);
  } else if (heavyPaths.some(name => pathname === `/data/${name}`) || pathname === "/outside-app/data/countries/ARG.json") {
    response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    response.end('{"fixture":true}');
  } else {
    request.url = pathname + url.search;
    void staticHandler(request, response);
  }
});

async function launchBrowser() {
  const channel = process.env.PLAYWRIGHT_CHANNEL || (process.env.CI ? "" : "chrome");
  const options = channel ? [{ channel }, {}] : [{}, { channel: "chrome" }];
  let lastError;
  for (const option of options) {
    try {
      return await chromium.launch({ headless: true, ...option });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function readResource(page, url) {
  return page.evaluate(async target => {
    try {
      const response = await fetch(target);
      return { status: response.status, text: await response.text(), probe: response.headers.get("X-Test-Probe") };
    } catch {
      return { status: 0 };
    }
  }, url);
}

async function cacheInventory(page) {
  return page.evaluate(async () => {
    const inventory = {};
    for (const name of await caches.keys()) {
      inventory[name] = (await (await caches.open(name)).keys()).map(request => request.url);
    }
    return inventory;
  });
}

async function checkOfflineCache(browser, origin, basePath) {
  const context = await browser.newContext({ serviceWorkers: "allow" });
  context.setDefaultTimeout(15000);
  try {
    const page = await context.newPage();
    const baseUrl = origin + basePath;
    await page.goto(baseUrl + "sw-client.html");
    await page.evaluate(async () => {
      await caches.open("geo-risk-obsolete-test");
      await caches.open("unrelated-application-test");
      await navigator.serviceWorker.register("./sw.js");
      await navigator.serviceWorker.ready;
    });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    const worker = context.serviceWorkers()[0];
    assert.ok(worker, "debe existir un service worker real");
    await worker.evaluate(() => {
      self.testUnhandledRejections = [];
      self.addEventListener("unhandledrejection", event => {
        self.testUnhandledRejections.push(String(event.reason));
      });
    });

    let inventory = await cacheInventory(page);
    assert.ok(!inventory["geo-risk-obsolete-test"], "activar debe retirar versiones viejas de GeoRisk");
    assert.ok(inventory["unrelated-application-test"], "activar debe conservar caches ajenas");
    const shellCache = Object.keys(inventory).find(name => name.startsWith("geo-risk-app-"));
    assert.ok(shellCache);
    const installedShell = inventory[shellCache].sort();
    assert.ok(installedShell.includes(baseUrl + "index.html"));
    assert.ok(!Object.values(inventory).flat().some(url => /app-country-panel|\/data\/countries\/ARG/.test(url)), "fichas y modulos diferidos no deben precargarse");

    const runtimePaths = [
      "app-country-panel.js?v=offline-test",
      "style-polish.css?v=offline-test",
      "data/countries/ARG.json?v=offline-test",
      "data/runtime_supplemental.json?v=offline-test",
      "data/world_countries_simplified.geo.json?v=offline-test",
      "assets/flags/ARG.svg",
      "assets/coats/ARG.svg"
    ];
    const expectedBodies = new Map();
    for (const resource of runtimePaths) {
      const result = await readResource(page, baseUrl + resource);
      assert.equal(result.status, 200, resource);
      expectedBodies.set(resource, result.text);
    }
    inventory = await cacheInventory(page);
    const runtimeCache = Object.keys(inventory).find(name => name.startsWith("geo-risk-runtime-"));
    assert.ok(runtimeCache, basePath + " debe cachear modulos y fichas bajo demanda");
    for (const resource of runtimePaths) {
      assert.ok(inventory[runtimeCache].includes(baseUrl + resource), resource + " debe estar en cache");
    }

    const countryUrl = baseUrl + "data/countries/ARG.json?v=offline-test";
    await page.evaluate(async ({ cacheName, url }) => {
      await (await caches.open(cacheName)).put(url, new Response("{}", { headers: { "Content-Type": "application/json" } }));
    }, { cacheName: runtimeCache, url: countryUrl });
    assert.equal((await readResource(page, countryUrl)).text, "{}", "simula una respuesta corrupta guardada anteriormente");
    const recoveredBody = await page.evaluate(async url => (await fetch(url, { cache: "reload" })).text(), countryUrl);
    assert.equal(recoveredBody, expectedBodies.get("data/countries/ARG.json?v=offline-test"));
    assert.equal((await readResource(page, countryUrl)).text, recoveredBody, "reintentar reemplaza el cache corrupto y conserva el modo offline");

    for (let i = 0; i < 25; i += 1) {
      assert.equal((await readResource(page, baseUrl + "script.js?v=query-" + i)).status, 200);
    }
    assert.equal((await readResource(page, baseUrl + "?probe=root")).status, 200);
    inventory = await cacheInventory(page);
    assert.deepEqual(inventory[shellCache].sort(), installedShell, "variar parametros no debe duplicar ni expulsar el shell");

    for (const resource of heavyPaths) {
      assert.equal((await readResource(page, baseUrl + "data/" + resource)).status, 200);
    }
    assert.equal((await readResource(page, baseUrl + "vendor/cesium/engine.js?v=test-release")).status, 200);
    assert.equal((await readResource(page, baseUrl + "data/countries/NOT_A_COUNTRY.json")).status, 404);
    if (basePath !== "/") {
      assert.equal((await readResource(page, origin + "/outside-app/data/countries/ARG.json")).status, 200);
    }
    inventory = await cacheInventory(page);
    assert.ok(!Object.values(inventory).flat().some(url => /countries_full|conflict_details\.generated|conflict_dyadic_summary|vendor\/cesium|NOT_A_COUNTRY|outside-app/.test(url)), "motor, datos pesados, errores y rutas ajenas no deben cachearse");

    // Simulate full storage without filling the user's disk.
    await worker.evaluate(() => {
      self.testOriginalCachePut = Cache.prototype.put;
      Cache.prototype.put = async () => { throw new DOMException("Test quota", "QuotaExceededError"); };
    });
    try {
      for (const resource of ["data/countries/BRA.json?probe=quota", "script.js?probe=quota"]) {
        const result = await readResource(page, baseUrl + resource);
        assert.equal(result.status, 200, "falta de espacio no debe romper una respuesta disponible");
        assert.equal(result.probe, "quota", "debe devolver la respuesta de red aunque no pueda guardarla");
      }
    } finally {
      await worker.evaluate(() => { Cache.prototype.put = self.testOriginalCachePut; });
    }

    await context.setOffline(true);
    for (const resource of runtimePaths) {
      const result = await readResource(page, baseUrl + resource);
      assert.equal(result.status, 200, basePath + resource + " debe abrir sin red");
      assert.equal(result.text, expectedBodies.get(resource));
    }
    for (const resource of ["script.js?v=offline-query", "style.css?v=offline-query", "data/countries_index.json?v=offline-query"]) {
      assert.equal((await readResource(page, baseUrl + resource)).status, 200, "el shell debe tolerar parametros offline");
    }
    assert.equal((await readResource(page, baseUrl + "data/countries/BRA.json?probe=quota")).status, 0, "la escritura fallida no debe simular disponibilidad offline");
    for (const resource of heavyPaths) {
      assert.equal((await readResource(page, baseUrl + "data/" + resource)).status, 0, "dataset pesado debe seguir necesitando red");
    }
    const navigation = await page.goto(baseUrl + "?offline-reload=1");
    assert.equal(navigation.status(), 200);
    assert.equal(await page.title(), "GeoRisk offline fixture");
    assert.deepEqual(await worker.evaluate(() => self.testUnhandledRejections), [], "el worker no debe dejar rechazos sin manejar");
    console.log("service-worker-browser: " + basePath + " ok");
  } finally {
    await context.close();
  }
}

async function checkWorkerUpdates(browser, origin, basePath) {
  const context = await browser.newContext({ serviceWorkers: "allow", viewport: { width: 390, height: 844 } });
  context.setDefaultTimeout(15000);
  workerRevision = "fixture-initial";
  try {
    const page = await context.newPage();
    await page.goto(origin + basePath + "sw-client.html");
    await page.addStyleTag({ url: "./style.css" });
    await page.evaluate(html => document.body.insertAdjacentHTML("beforeend", html), noticeHtml);
    await page.evaluate(async source => {
      const lifecycle = new Function("APP_VERSION", "currentLanguage", "updateAppStatusPanel", "updateOfflineCacheSizeLabel",
        source + "; return { watchServiceWorkerRegistration };"
      )("base", "es", () => {}, async () => {});
      window.testRegistration = await navigator.serviceWorker.register("./sw.js?v=base", { updateViaCache: "none" });
      window.testStopWatch = lifecycle.watchServiceWorkerRegistration(window.testRegistration);
      window.testWatch = lifecycle.watchServiceWorkerRegistration;
      await navigator.serviceWorker.ready;
    }, lifecycleSource);
    await page.waitForFunction(() => navigator.serviceWorker.controller);
    await page.evaluate(() => { window.testInitialController = navigator.serviceWorker.controller; });
    const originalCache = "geo-risk-app-fixture-initial";

    workerRevision = "fixture-incomplete";
    failInstallPath = "/style.css";
    const failedState = await page.evaluate(async () => {
      const registration = window.testRegistration;
      const terminal = new Promise(resolve => registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        installing.addEventListener("statechange", () => {
          if (["redundant", "installed"].includes(installing.state)) resolve(installing.state);
        });
      }, { once: true }));
      await registration.update();
      return terminal;
    });
    assert.equal(failedState, "redundant", "una descarga esencial fallida debe rechazar la instalacion");
    assert.equal(await page.evaluate(() => navigator.serviceWorker.controller === window.testInitialController), true);
    let inventory = await cacheInventory(page);
    assert.ok(inventory[originalCache].includes(origin + basePath + "style.css"), "el fallo no debe borrar el shell anterior");
    assert.equal(await page.locator("#offline-update-notice").isVisible(), false);

    workerRevision = "fixture-ready";
    failInstallPath = null;
    await page.evaluate(() => window.testRegistration.update());
    await page.waitForFunction(() => Boolean(window.testRegistration.waiting));
    await page.locator("#offline-update-notice").waitFor({ state: "visible" });
    assert.equal(await page.evaluate(() => navigator.serviceWorker.controller === window.testInitialController), true, "la nueva version debe esperar");
    inventory = await cacheInventory(page);
    assert.ok(inventory[originalCache], "la version en espera no limpia caches anteriores");
    const bounds = await page.locator("#offline-update-notice").boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390 && bounds.y + bounds.height <= 844);
    assert.equal(await page.locator("#offline-update-notice").evaluate(element => element.scrollWidth <= element.clientWidth), true);
    await fs.mkdir("tmp", { recursive: true });
    await page.screenshot({ path: "tmp/offline-update-mobile.png" });
    await page.locator("#offline-update-dismiss").click();
    assert.equal(await page.locator("#offline-update-notice").isVisible(), false);
    assert.equal(await page.evaluate(() => navigator.serviceWorker.controller === window.testInitialController), true);
    await page.evaluate(() => { window.testStopWatch(); window.testStopWatch = window.testWatch(window.testRegistration); });
    await Promise.all([
      page.waitForEvent("domcontentloaded"),
      page.locator("#offline-update-apply").click()
    ]);
    inventory = await cacheInventory(page);
    assert.ok(inventory["geo-risk-app-fixture-ready"]);
    assert.ok(!inventory[originalCache], "solo la activacion confirmada retira el cache anterior");
    assert.ok(!inventory["geo-risk-app-fixture-incomplete"], "la siguiente activacion limpia descargas incompletas");
    console.log("service-worker-updates: " + basePath + " ok");
  } finally {
    workerRevision = null;
    failInstallPath = null;
    await context.close();
  }
}

let browser;
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
try {
  browser = await launchBrowser();
  const origin = "http://127.0.0.1:" + server.address().port;
  for (const basePath of ["/GeoRisk/", "/"]) {
    await checkOfflineCache(browser, origin, basePath);
    await checkWorkerUpdates(browser, origin, basePath);
  }
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}

console.log("service-worker-browser.test.js ok");
