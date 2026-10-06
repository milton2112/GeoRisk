import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";
import { getBrowserSelection, launchProjectBrowser } from "../lib/browser-launch.js";
import { createLocalSmokeServer } from "../localSmokeServer.js";
import { captureLiveElement, captureTransientNotice } from "../lib/browser-screenshot.js";
import { createBrowserTileCache } from "../lib/browser-tile-cache.js";
import { createBrowserRunReport } from "../lib/browser-run-report.js";

const APP_TIMEOUT_MS = Number(process.env.GEORISK_E2E_TIMEOUT_MS || 45000);
const MAP_PICK_TIMEOUT_MS = Math.min(APP_TIMEOUT_MS, 8000);
const DESKTOP_VIEWPORT = { width: 1440, height: 920 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const tileCache = createBrowserTileCache();

async function launchCriticalBrowser() {
  return launchProjectBrowser(chromium);
}

function getRelevantPageErrors(errors) {
  return errors.filter(message => !/ResizeObserver loop limit exceeded/i.test(message));
}

async function createTestPage(browser, baseUrl, viewport, beforeNavigate = async () => {}) {
  const isMobile = viewport.width <= 820;
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile,
    hasTouch: isMobile,
    serviceWorkers: "block"
  });
  await tileCache.attach(context);
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.addInitScript(() => {
    try { localStorage.setItem("geo-risk-intro-seen", "true"); } catch { /* Storage failure fixtures. */ }
    window.__geoRiskCspViolations = [];
    document.addEventListener("securitypolicyviolation", event => {
      window.__geoRiskCspViolations.push({ directive: event.effectiveDirective, blockedURI: event.blockedURI });
    });
  });
  await beforeNavigate(page);
  const navigationStarted = performance.now();
  await page.goto(baseUrl + "/index.html?critical-e2e=1", {
    waitUntil: "domcontentloaded",
    timeout: APP_TIMEOUT_MS
  });
  console.log("critical-browser-e2e: navigation " + viewport.width + " in " +
    Math.round(performance.now() - navigationStarted) + " ms");
  return { context, page, pageErrors };
}

async function waitForAppReady(page, { requireTiles = true } = {}) {
  const readinessStarted = performance.now();
  try {
    await page.waitForFunction(needsTiles => {
      const fatal = document.getElementById("fatal-error-banner");
      return (
        typeof viewer !== "undefined" &&
        Boolean(viewer) &&
        typeof countryLayers !== "undefined" &&
        countryLayers.has("ARG") &&
        countryLayers.has("ESP") &&
        typeof countriesData !== "undefined" &&
        Object.keys(countriesData).length >= 180 &&
        Boolean(window.GeoRiskUiPolish) &&
        !document.body.classList.contains("globe-loading") &&
        (!needsTiles || viewer.scene.globe.tilesLoaded) &&
        fatal?.hidden !== false
      );
    }, requireTiles, { timeout: APP_TIMEOUT_MS });
  } catch (error) {
    console.error("App readiness failed:", await page.evaluate(() => ({
      fatal: document.getElementById("fatal-error-banner")?.textContent,
      engine: window.GeoRiskMapEngine?.getState(), csp: window.__geoRiskCspViolations,
      boot: typeof bootMetrics !== "undefined" ? bootMetrics.steps : null,
      countryIndex: typeof deferredDataStatus !== "undefined" ? deferredDataStatus.countryIndex : null,
      countries: typeof countriesData !== "undefined" ? Object.keys(countriesData).length : null,
      layers: typeof countryLayers !== "undefined" ? countryLayers.size : null
    })).catch(() => null));
    throw error;
  }
  await page.locator("#map canvas").waitFor({ state: "visible", timeout: APP_TIMEOUT_MS });
  console.log("critical-browser-e2e: readiness wait " + page.viewportSize().width +
    " (tiles=" + requireTiles + ") in " + Math.round(performance.now() - readinessStarted) + " ms");
}

async function waitForMapMode(page, expectedMode) {
  await page.waitForFunction(mode => {
    return currentMapMode === mode &&
      viewer.scene.mode === (mode === "2d" ? Cesium.SceneMode.SCENE2D : Cesium.SceneMode.SCENE3D) &&
      loadMapMode === mode &&
      !loadMapPromise &&
      countryLayers.has("ARG") &&
      countryLayers.has("ESP");
  }, expectedMode, { timeout: APP_TIMEOUT_MS });
  await page.evaluate(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
  await page.waitForTimeout(800);
}

async function setMapMode(page, expectedMode) {
  const currentMode = await page.evaluate(() => currentMapMode);
  if (currentMode !== expectedMode) {
    await page.locator("#map-mode-toggle").click();
  }
  await waitForMapMode(page, expectedMode);
}

async function getCountryScreenPoint(page, code, attempts = 20) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const point = await page.evaluate(countryCode => {
      const layer = countryLayers.get(countryCode);
      const rectangle = layer?.getBounds?.();
      if (!layer || !rectangle || !viewer || !window.Cesium) {
        return null;
      }
      const center = Cesium.Rectangle.center(rectangle);
      const cartesian = Cesium.Cartesian3.fromRadians(center.longitude, center.latitude);
      if (viewer.scene.mode === Cesium.SceneMode.SCENE3D && viewer.scene.globe.show &&
          !isMapLabelVisible(cartesian, Infinity)) {
        return null;
      }
      const rawPoint = viewer.scene.cartesianToCanvasCoordinates(cartesian);
      const canvas = viewer.scene.canvas;
      const bounds = canvas.getBoundingClientRect();
      if (!rawPoint || !bounds.width || !bounds.height) {
        return null;
      }
      const x = bounds.left + rawPoint.x;
      const y = bounds.top + rawPoint.y;
      const withinCanvas = x > bounds.left + 2 &&
        x < bounds.right - 2 &&
        y > bounds.top + 2 &&
        y < bounds.bottom - 2;
      if (!withinCanvas) {
        return null;
      }
      viewer.scene.requestRender();
      const pickedEntity = getPickedCountryEntityAt(rawPoint);
      return pickedEntity?.countryCode === countryCode ? { x, y } : null;
    }, code);
    if (point) {
      return point;
    }
    await page.waitForTimeout(250);
  }
  return null;
}

async function focusCountryFor3dPick(page, code) {
  const focused = await page.evaluate(countryCode => {
    const layer = countryLayers.get(countryCode);
    const rectangle = layer?.getBounds?.();
    if (!layer || !rectangle || !viewer || !window.Cesium) {
      return false;
    }
    viewer.camera.setView({ destination: rectangle });
    viewer.scene.requestRender();
    return true;
  }, code);
  if (focused) {
    await page.waitForTimeout(420);
  }
  return focused;
}

async function clickMapPoint(page, point) {
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await page.waitForTimeout(70);
  await page.mouse.up();
}

async function waitForStable3dMap(page) {
  await page.waitForFunction(() => {
    return Boolean(viewer?.scene?.canvas) && !isCameraNavigating && !loadMapPromise;
  }, undefined, { timeout: APP_TIMEOUT_MS });
}

async function clickCountryOnMap(page, code) {
  let point = await getCountryScreenPoint(page, code);
  assert.ok(point, "el pais " + code + " debe estar visible y ser clickeable en el canvas");
  for (let attempt = 0; attempt < 2; attempt += 1) {
    await page.evaluate(() => {
      viewer?.scene?.requestRender?.();
    });
    await page.waitForTimeout(120);
    point = await getCountryScreenPoint(page, code, 8) || point;
    await clickMapPoint(page, point);
    try {
      await page.waitForFunction(countryCode => {
        return selectedLayers.some(layer => layer.code === countryCode);
      }, code, { timeout: MAP_PICK_TIMEOUT_MS });
      return;
    } catch {
      if (attempt === 0) {
        await page.waitForTimeout(260);
      }
    }
  }
  assert.fail("el clic 2D debe seleccionar el pais " + code + " despues de estabilizar el render");
}

async function clickFirstVisibleCountryOnMap(page, codes) {
  await waitForStable3dMap(page);
  for (const code of codes) {
    let point = await getCountryScreenPoint(page, code, 12);
    if (!point && await focusCountryFor3dPick(page, code)) {
      point = await getCountryScreenPoint(page, code, 16);
    }
    if (!point) {
      continue;
    }
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await waitForStable3dMap(page);
      await clickMapPoint(page, point);
      try {
        await page.waitForFunction(countryCode => {
          return selectedLayers.some(layer => layer.code === countryCode);
        }, code, { timeout: MAP_PICK_TIMEOUT_MS });
        return code;
      } catch {
        if (attempt === 0) {
          await page.waitForTimeout(260);
          point = await getCountryScreenPoint(page, code, 10) || point;
        }
      }
    }
  }
  assert.fail("la vista global 3D debe exponer al menos un pais clickeable");
}

async function settle3dWorldView(page) {
  await page.evaluate(async () => {
    viewer?.scene?.requestRender?.();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    viewer?.scene?.requestRender?.();
  });
  await page.waitForTimeout(280);
}

async function waitForCountryPanel(page, countryName) {
  await page.waitForFunction(name => {
    const modal = document.getElementById("country-modal");
    const title = document.getElementById("country-panel-title");
    return modal && !modal.hidden && title?.textContent?.includes(name);
  }, countryName, { timeout: APP_TIMEOUT_MS });
}

async function closeCountryPanel(page) {
  const modal = page.locator("#country-modal");
  if (!(await modal.evaluate(element => element.hidden))) {
    await page.locator("#country-modal-close").click();
    await modal.waitFor({ state: "hidden", timeout: APP_TIMEOUT_MS });
  }
}

async function submitSearch(page, query) {
  await page.locator("#map-search-input").fill(query);
  await page.locator("#map-search-button").click();
}

async function assertMobileLayersWorkspace(page) {
  await page.locator("#toggle-tools-panel").click();
  await page.waitForFunction(() => {
    const toolbar = document.getElementById("map-toolbar");
    return document.body.classList.contains("mobile-tools-open") && toolbar?.open;
  }, undefined, { timeout: APP_TIMEOUT_MS });
  await page.waitForFunction(() => {
    const mapMode = document.getElementById("map-mode-toggle");
    const style = getComputedStyle(mapMode);
    return style.pointerEvents === "none" && Number(style.opacity) < 0.01;
  }, undefined, { timeout: APP_TIMEOUT_MS });

  const geometry = await page.evaluate(() => {
    const rect = id => {
      const element = document.getElementById(id);
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width };
    };
    const mapMode = document.getElementById("map-mode-toggle");
    const mapModeStyle = getComputedStyle(mapMode);
    return {
      toolbar: rect("map-toolbar"),
      controls: rect("mobile-panel-controls"),
      mapModeHidden: mapModeStyle.pointerEvents === "none" && Number(mapModeStyle.opacity) === 0
    };
  });

  assert.ok(geometry.toolbar.width >= 350, "capas mobile debe aprovechar el ancho disponible");
  assert.ok(geometry.toolbar.bottom <= geometry.controls.top - 6, "capas mobile no debe invadir la navegacion inferior");
  assert.ok(geometry.mapModeHidden, "el cambio 2D/3D no debe competir con las capas abiertas");

  await page.locator("#toggle-tools-panel").click();
  await page.waitForFunction(() => !document.body.classList.contains("mobile-tools-open"), undefined, { timeout: APP_TIMEOUT_MS });
}

async function runDesktopCriticalFlow(page) {
  await waitForAppReady(page);
  await page.evaluate(() => openIntroModal());
  await assertModalFrame(page, "intro-modal");
  await page.screenshot({ path: "tmp/intro-desktop.png" });
  await page.keyboard.press("Escape");
  await page.locator("#intro-modal").waitFor({ state: "hidden" });
  await page.evaluate(() => renderPerformancePanel());
  await assertModalFrame(page, "product-modal");
  await page.locator("#product-modal-close").click();
  assert.equal(await page.evaluate(() => viewer.scene.mode === Cesium.SceneMode.SCENE3D), true, "desktop debe iniciar en una escena 3D real");
  await waitForMapMode(page, "3d");
  await assertAntialiasingProfile(page);
  await page.locator("#map-toolbar > summary").click();
  for (const quality of ["high", "balanced", "performance", "auto"]) {
    await page.locator("#quality-preset-select").selectOption(quality);
    await assertAntialiasingProfile(page);
  }
  await page.locator("#map-toolbar > summary").click();
  await page.screenshot({ path: "tmp/map-desktop.png" });

  await page.evaluate(() => { window.__previousBaseImagery = activeBaseImageryLayer; });
  await setMapMode(page, "2d");
  await assertAntialiasingProfile(page);
  assert.equal(await page.evaluate(() => window.__previousBaseImagery.isDestroyed() &&
    viewer.imageryLayers.length === 1 && viewer.imageryLayers.contains(activeBaseImageryLayer)), true,
  "cambiar de modo debe destruir la imagen anterior y dejar una sola capa base");
  await clickCountryOnMap(page, "ARG");
  await waitForCountryPanel(page, "Argentina");
  assert.deepEqual(await page.evaluate(() => selectedLayers.map(layer => layer.code)), ["ARG"]);
  await closeCountryPanel(page);

  await setMapMode(page, "3d");
  await page.locator("#map-toolbar > summary").click();
  await page.locator("#world-view-button").click();
  await page.locator("#map-toolbar > summary").click();
  await page.waitForTimeout(220);
  await settle3dWorldView(page);
  const clicked3dCode = await clickFirstVisibleCountryOnMap(page, ["ESP", "ARG", "BRA", "USA", "CHN", "ZAF", "AUS"]);
  const clicked3dName = await page.evaluate(code => countriesData[code]?.name || code, clicked3dCode);
  await waitForCountryPanel(page, clicked3dName);
  assert.deepEqual(await page.evaluate(() => selectedLayers.map(layer => layer.code)), [clicked3dCode]);
  await closeCountryPanel(page);

  await page.locator("#rankings-summary").click();
  const rankingItem = page.locator("#top-population .rank-link").first();
  await rankingItem.waitFor({ state: "visible", timeout: APP_TIMEOUT_MS });
  await rankingItem.click();
  await page.locator("#top-population .rank-link.is-active").waitFor({ state: "visible", timeout: APP_TIMEOUT_MS });
  await page.waitForFunction(() => !document.getElementById("country-modal")?.hidden, undefined, { timeout: APP_TIMEOUT_MS });
  assert.ok((await page.evaluate(() => selectedLayers.length)) > 0, "un top debe seleccionar al menos un pais en el mapa");
  await closeCountryPanel(page);

  await submitSearch(page, "Argentina");
  await waitForCountryPanel(page, "Argentina");
  assert.deepEqual(await page.evaluate(() => selectedLayers.map(layer => layer.code)), ["ARG"]);
  await closeCountryPanel(page);

  await submitSearch(page, "Asia");
  await page.waitForFunction(() => {
    return currentPanelState?.type === "continent" && selectedLayers.length > 20;
  }, undefined, { timeout: APP_TIMEOUT_MS });
  await closeCountryPanel(page);

  await submitSearch(page, "Cristianismo");
  await page.waitForFunction(() => {
    return currentPanelState?.type === "religion" && selectedLayers.length > 1;
  }, undefined, { timeout: APP_TIMEOUT_MS });
}

async function runMobileCriticalFlow(page) {
  await waitForAppReady(page);
  await assertThematicLabelOrder(page);
  assert.equal(await page.evaluate(() => viewer.scene.mode === Cesium.SceneMode.SCENE2D), true, "mobile debe iniciar en una escena 2D real, no solo declarar el modo");
  await waitForMapMode(page, "2d");
  await assertAntialiasingProfile(page);
  await page.screenshot({ path: "tmp/map-mobile.png" });
  const worldWidthRatio = await page.evaluate(() => {
    const frustum = viewer.camera.frustum;
    return Cesium.Math.TWO_PI * Cesium.Ellipsoid.WGS84.maximumRadius / (frustum.right - frustum.left);
  });
  assert.ok(worldWidthRatio > 0.85 && worldWidthRatio < 1.01, "el mapa 2D debe aprovechar el ancho del movil sin recortar el mundo");
  await clickCountryOnMap(page, "ARG");
  await waitForCountryPanel(page, "Argentina");
  await closeCountryPanel(page);
  await assertMapSelectionStyles(page, "ARG", "ESP");
  await setMapMode(page, "3d");
  await assertAntialiasingProfile(page);
  await assertMapSelectionStyles(page, "ARG", "ESP");
  await page.evaluate(() => { window.__previousBaseImagery = activeBaseImageryLayer; });
  await setMapMode(page, "2d");
  assert.equal(await page.evaluate(() => window.__previousBaseImagery.isDestroyed() && viewer.imageryLayers.length === 1), true,
    "el cambio de modo mobile debe liberar la imagen retirada");
  await page.evaluate(() => { applyMapMode("3d"); applyMapMode("2d"); });
  await waitForMapMode(page, "2d");
  assert.equal(await page.evaluate(() => cancelPendingMapTransition), null, "los cambios rapidos deben limpiar la transicion pendiente");
  await assertMobileLayersWorkspace(page);
  await page.locator("#toggle-left-panel").click();
  const rankingItem = page.locator("#top-population .rank-link").first();
  await rankingItem.waitFor({ state: "visible", timeout: APP_TIMEOUT_MS });
  await rankingItem.click();
  await page.waitForFunction(() => !document.getElementById("country-modal")?.hidden, undefined, { timeout: APP_TIMEOUT_MS });
  assert.equal(await page.locator("#toggle-country-panel").isDisabled(), false, "mobile debe habilitar el acceso a la ficha seleccionada");
  assert.ok((await page.evaluate(() => selectedLayers.length)) > 0, "un top mobile debe marcar paises en el mapa");
  await closeCountryPanel(page);

  await submitSearch(page, "Argentina");
  await waitForCountryPanel(page, "Argentina");
  assert.deepEqual(await page.evaluate(() => selectedLayers.map(layer => layer.code)), ["ARG"]);
}

function assertHealthyPage(pageErrors, label) {
  assert.deepEqual(getRelevantPageErrors(pageErrors), [], label + " no debe emitir errores no controlados");
}

async function assertStartupControlsHaveNoLayout(page) {
  const state = await page.evaluate(() => {
    const ids = ["top-controls", "left-panel", "map-toolbar", "mobile-panel-controls", "map-mode-toggle", "compare-hub-panel", "quiz-hub-panel", "news-hub-panel"];
    return {
      loading: document.body.classList.contains("globe-loading"),
      missing: ids.filter(id => !document.getElementById(id)),
      layoutBoxes: ids.filter(id => document.getElementById(id)?.getClientRects().length > 0),
      mapHasLayout: document.getElementById("map").getBoundingClientRect().height > 0
    };
  });
  assert.equal(state.loading, true);
  assert.deepEqual(state.missing, []);
  assert.deepEqual(state.layoutBoxes, [], "los controles inactivos no deben generar cajas de layout");
  assert.equal(state.mapHasLayout, true, "el mapa debe conservar su espacio durante la carga");
}

async function captureStartupState(page, path) {
  // DOM visibility alone does not mean Chromium has a composited surface yet.
  await page.waitForFunction(() => performance.getEntriesByName("first-contentful-paint").length > 0,
    undefined, { timeout: 10000 });
  const options = { path, animations: "disabled", timeout: 10000 };
  try {
    return await page.screenshot(options);
  } catch (error) {
    if (page.isClosed() || !/Protocol error \(Page\.captureScreenshot\): Unable to capture screenshot/.test(error.message)) throw error;
    console.warn("Chromium no pudo capturar " + path + "; un unico reintento de captura.");
    await page.waitForTimeout(250);
    return page.screenshot(options);
  }
}

async function testMapEngineStartup(browser, baseUrl) {
  for (const scenario of ["slow", "failure", "early-failure", "timeout", "loader-missing", "no-frame"]) {
    console.log("map-engine-startup: " + scenario);
    const context = await browser.newContext({ viewport: MOBILE_VIEWPORT, isMobile: true, hasTouch: true, serviceWorkers: "block" });
    await tileCache.attach(context);
    let releaseEngine;
    const held = new Promise(resolve => { releaseEngine = resolve; });
    const pageErrors = [];
    let engineRequests = 0;
    let legacyRequests = 0;
    let recover = false;
    let releaseMain;
    const mainHeld = new Promise(resolve => { releaseMain = resolve; });
    try {
      const page = await context.newPage();
      page.on("pageerror", error => pageErrors.push(error.message));
      page.on("request", request => { if (request.url().endsWith("/Cesium/Cesium.js")) legacyRequests += 1; });
      if (scenario === "early-failure") {
        await page.route(/\/script\.js\?/, async route => { await mainHeld; await route.continue(); });
      }
      if (scenario === "loader-missing") {
        await page.route(/\/app-map-engine\.js\?/, route => recover ? route.continue() : route.abort("failed"));
      }
      await page.route(/\/vendor\/cesium\/engine\.js\?/, async route => {
        engineRequests += 1;
        await held;
        if (!recover && ["failure", "early-failure"].includes(scenario)) await route.abort("failed");
        else await route.continue();
      });
      await page.addInitScript(() => localStorage.setItem("geo-risk-intro-seen", "true"));
      await page.goto(baseUrl + "/index.html", { waitUntil: scenario === "early-failure" ? "commit" : "domcontentloaded", timeout: APP_TIMEOUT_MS });
      await page.waitForFunction(() => Boolean(window.GeoRiskMapEngineReady));
      if (scenario !== "early-failure") {
        await page.waitForFunction(() => typeof bootMetrics !== "undefined" && Boolean(bootMetrics.steps.mapEngine));
        assert.equal(await page.evaluate(() => viewer), null, "no construir el mapa mientras falta el motor");
      }
      await assertStartupControlsHaveNoLayout(page);
      if (scenario === "no-frame") {
        await page.evaluate(() => {
          const initialize = initializeViewer;
          initializeViewer = function () {
            const result = initialize();
            result.cesiumWidget.render = () => {};
            return result;
          };
        });
      }
      if (scenario === "slow") {
        await page.waitForFunction(() => window.GeoRiskMapEngine.getState().phase === "slow");
        assert.equal(await page.locator("#fatal-error-banner").isVisible(), false, "descargar lento no es un error fatal");
        assert.equal(await page.locator("#startup-status").isVisible(), true);
        await captureStartupState(page, "tmp/startup-engine-slow-mobile.png");
      }
      if (scenario !== "timeout") releaseEngine();
      if (scenario !== "slow") {
        await page.locator("#fatal-error-banner").waitFor({ state: "visible", timeout: APP_TIMEOUT_MS });
        assert.equal(await page.locator("#startup-status").isVisible(), false);
        assert.equal(await page.locator("#fatal-error-banner a").isVisible(), true);
        assert.equal(await page.locator("#map-search-input").isVisible(), false);
        if (scenario === "early-failure") {
          assert.equal(await page.evaluate(() => typeof init), "undefined", "la recuperacion no debe depender de script.js");
          releaseMain();
          await page.waitForFunction(() => typeof bootMetrics !== "undefined" && Boolean(bootMetrics.steps.mapEngine?.error));
        }
        assert.equal(await page.evaluate(() => bootMetrics.completedAt), 0);
        if (scenario === "timeout") {
          assert.match(await page.locator("#fatal-error-banner").innerText(), /motor del mapa esta tardando demasiado/);
          releaseEngine();
          await page.evaluate(() => import(window.GeoRiskMapEngine.url).then(() => true));
          assert.equal(await page.evaluate(() => viewer), null, "la respuesta tardia no construye el visor");
          assert.equal(await page.evaluate(() => typeof window.Cesium), "undefined");
        }
        if (scenario === "no-frame") assert.match(await page.locator("#fatal-error-banner").innerText(), /mapa no pudo mostrarse/);
        assert.equal(engineRequests, scenario === "loader-missing" ? 0 : 1, "un intento no duplica la descarga");
        await captureStartupState(page, "tmp/startup-engine-" + scenario + "-mobile.png");
        recover = true;
        await page.locator("#fatal-error-banner a").click();
        await waitForAppReady(page);
        await submitSearch(page, "Argentina");
        await waitForCountryPanel(page, "Argentina");
      } else {
        await waitForAppReady(page);
        assert.equal(await page.evaluate(() => viewer.scene.mode), await page.evaluate(() => Cesium.SceneMode.SCENE2D));
        assert.equal(engineRequests, 1, "el motor no debe descargarse dos veces");
      }
      assert.equal(legacyRequests, 0, "el paquete anterior no debe cargarse de respaldo silencioso");
      assertHealthyPage(pageErrors, "motor " + scenario);
    } finally {
      releaseEngine();
      releaseMain();
      await context.close();
    }
  }
}

async function testCountryOverlayReadiness(browser, baseUrl) {
  for (const [viewport, scenario] of [[DESKTOP_VIEWPORT, "release"], [MOBILE_VIEWPORT, "release"], [MOBILE_VIEWPORT, "timeout"]]) {
    const label = viewport === MOBILE_VIEWPORT ? "mobile" : "desktop";
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      await page.addInitScript(expire => {
        window.__holdCountryFrame = !sessionStorage.getItem("overlay-recovered");
        window.__expireCountryFrame = expire && window.__holdCountryFrame;
        Object.defineProperty(window, "GeoRiskMap", {
          configurable: true,
          set(api) {
            Object.defineProperty(window, "GeoRiskMap", { value: api, configurable: true, writable: true });
            const wait = api.waitForDataSourceFrame;
            if (typeof wait !== "function") return;
            api.waitForDataSourceFrame = options => {
              const display = options.viewer.dataSourceDisplay;
              const update = display.update;
              const controlledUpdate = function (...args) {
                const ready = update.apply(this, args);
                window.__countryUpdates = (window.__countryUpdates || 0) + 1;
                return window.__holdCountryFrame ? false : ready;
              };
              display.update = controlledUpdate;
              window.__countryFrameWaitStarted = true;
              return wait({ ...options, timeoutMs: window.__expireCountryFrame ? 250 : options.timeoutMs }).finally(() => {
                if (display.update === controlledUpdate) delete display.update;
                window.__countryFrameWaitFinished = true;
              });
            };
          }
        });
      }, scenario === "timeout");
    });
    const { page } = test;
    try {
      if (scenario === "timeout") {
        await page.locator("#fatal-error-banner").waitFor({ state: "visible" });
        assert.match(await page.locator("#fatal-error-banner").innerText(), /No se pudieron dibujar los limites/);
        assert.equal(await page.evaluate(() => Object.hasOwn(viewer.dataSourceDisplay, "update")), false);
        await page.evaluate(() => { window.__holdCountryFrame = false; viewer.scene.requestRender(); });
        await page.waitForTimeout(350);
        assert.equal(await page.evaluate(() => document.body.classList.contains("globe-loading")), true, "un resultado tardio no habilita una sesion fallida");
        await page.screenshot({ path: "tmp/country-overlay-timeout-mobile.png" });
        await page.evaluate(() => sessionStorage.setItem("overlay-recovered", "true"));
        await page.locator("#fatal-error-banner a").click();
      } else {
        await page.waitForFunction(() => window.__countryFrameWaitStarted && window.__countryUpdates > 3);
        assert.equal(await page.evaluate(() => document.body.classList.contains("globe-loading")), true);
        assert.equal(await page.locator("#map-search-input").isVisible(), false, label + " no habilita busqueda con geometria pendiente");
        assert.equal(await page.locator("#intro-modal").isVisible(), false);
        await page.screenshot({ path: "tmp/country-overlay-pending-" + label + ".png" });
        await page.evaluate(() => { window.__holdCountryFrame = false; viewer.scene.requestRender(); });
      }
      await waitForAppReady(page, { requireTiles: false });
      assert.equal(await page.evaluate(() => window.__countryFrameWaitFinished), true);
      assert.equal(await page.evaluate(() => Object.hasOwn(viewer.dataSourceDisplay, "update")), false);
      const code = label === "mobile" ? "ARG" : "ESP";
      const point = await page.evaluate(countryCode => {
        const rect = countryLayers.get(countryCode).getBounds();
        const center = Cesium.Rectangle.center(rect);
        const position = Cesium.Cartesian3.fromRadians(center.longitude, center.latitude);
        const pixel = viewer.scene.cartesianToCanvasCoordinates(position);
        const canvas = viewer.scene.canvas.getBoundingClientRect();
        return { x: canvas.left + pixel.x, y: canvas.top + pixel.y };
      }, code);
      // One actual click, without pre-picking or retrying to warm the renderer.
      if (label === "mobile") await page.touchscreen.tap(point.x, point.y);
      else await page.mouse.click(point.x, point.y);
      await page.waitForFunction(expected => selectedLayers.some(layer => layer.code === expected), code, { timeout: MAP_PICK_TIMEOUT_MS });
      await page.locator("#country-panel .country-profile").waitFor();
      await page.screenshot({ path: "tmp/country-first-click-" + label + ".png" });
      assertHealthyPage(test.pageErrors, label + " primer frame completo y primer clic");
    } finally {
      await test.context.close();
    }
  }
}

async function testMapLabels(browser, baseUrl) {
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    const mobile = viewport === MOBILE_VIEWPORT;
    const label = mobile ? "mobile" : "desktop";
    let releaseIndex;
    const indexGate = new Promise(resolve => { releaseIndex = resolve; });
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      await page.addInitScript(isMobile => {
        Object.defineProperty(navigator, "deviceMemory", { configurable: true, get: () => 4 });
        Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, get: () => 4 });
        // Label rendering must not depend on the runner's hardware defaults or FPS fallback.
        localStorage.setItem("geo-risk-quality-preset", "performance");
        if (!isMobile) localStorage.setItem("geo-risk-label-mode", "countries");
      }, mobile);
      if (!mobile) await page.route(/\/data\/countries_index\.json(?:\?|$)/, async route => {
        await indexGate;
        await route.continue();
      });
    });
    const { page } = test;
    const toolsToggle = page.locator(mobile ? "#toggle-tools-panel" : "#map-toolbar > summary");
    const inspect = async () => page.evaluate(() => {
      const time = viewer.clock.currentTime;
      return labelEntities.map(entity => {
        const position = entity.position.getValue(time);
        const delta = Cesium.Cartesian3.subtract(viewer.camera.positionWC, position, new Cesium.Cartesian3());
        const normal = viewer.scene.globe.ellipsoid.geodeticSurfaceNormal(position, new Cesium.Cartesian3());
        const screen = viewer.scene.cartesianToCanvasCoordinates(position);
        return { id: entity.id, text: entity.label.text.getValue(time), facing: Cesium.Cartesian3.dot(normal, delta) > 0,
          inRange: Cesium.Cartesian3.magnitude(delta) <= entity.label.distanceDisplayCondition.getValue(time).far,
          onCanvas: Boolean(screen && screen.x >= 0 && screen.y >= 0 && screen.x <= viewer.scene.canvas.clientWidth && screen.y <= viewer.scene.canvas.clientHeight) };
      });
    });
    const assertVisible = async () => {
      const labels = await inspect();
      assert.ok(labels.length > 0, label + ": debe haber nombres en la vista cercana");
      assert.ok(labels.every(item => item.facing && item.inRange && item.onCanvas), label + ": solo preparar nombres visibles");
      assert.equal(new Set(labels.map(item => item.id)).size, labels.length);
      return labels;
    };
    try {
      let preliminary = [];
      if (!mobile) {
        await page.waitForFunction(() => typeof labelEntities !== "undefined" && labelEntities.length > 0 && !isCameraNavigating);
        preliminary = await inspect();
      }
      releaseIndex();
      await waitForAppReady(page);
      if (mobile) assert.equal(await page.evaluate(() => labelEntities.length), 0, "mobile conserva el inicio sin etiquetas");
      else {
        await page.waitForFunction(() => !isCameraNavigating && labelEntities.length > 0);
        const initial = await assertVisible();
        assert.ok(initial.length < 88, "no preparar los 88 nombres globales en la vista inicial");
        const names = await page.evaluate(() => Object.fromEntries(Object.entries(countriesData).map(([code, country]) => ["country-label-" + code, country.name])));
        assert.ok(preliminary.some(item => names[item.id] && item.text !== names[item.id]), "la prueba debe partir de nombres de la geometria sin traducir");
        assert.ok(initial.every(item => !names[item.id] || item.text === names[item.id]), "los datos tardios actualizan los nombres sin mover la camara");
        console.log("map-labels: desktop inicial " + initial.length + " etiquetas");
      }
      assert.equal(await page.evaluate(() => {
        const previous = labelEntities.slice();
        let changed = 0;
        const remove = previous.map(entity => entity.definitionChanged.addEventListener(() => changed++));
        try {
          renderMapLabels();
          renderMapLabels();
          return changed === 0 && labelEntities.length === previous.length &&
            labelEntities.every((entity, index) => entity === previous[index]) && hiddenLabelEntities.length === 0;
        } finally { remove.forEach(dispose => dispose()); }
      }), true, "stationary labels retain identity without property rewrites");
      await setMapMode(page, "3d");
      await toolsToggle.click();
      await page.locator("#label-mode-select").selectOption("full");
      await toolsToggle.click();
      await page.evaluate(() => new Promise((resolve, reject) => {
        const remove = viewer.camera.moveEnd.addEventListener(() => { clearTimeout(timer); remove(); resolve(); });
        const timer = setTimeout(() => { remove(); reject(new Error("La camara no termino de enfocar Brasil")); }, 15000);
        focusRectangle(countryLayers.get("BRA").getBounds(), { instant: true });
      }));
      await page.waitForFunction(() => !isCameraNavigating && labelEntities.some(entity => entity.id === "country-label-BRA"));
      const brazil = await assertVisible();
      const pixels = await page.evaluate(async () => {
        const scene = viewer.scene;
        const source = activeGeoJsonDataSource;
        const globeShow = scene.globe.show;
        const sourceShow = source.show;
        const gl = scene.canvas.getContext("webgl2") || scene.canvas.getContext("webgl");
        let entity;
        let originalShow;
        const waitForStableLabel = () => new Promise((resolve, reject) => {
          let frames = 0;
          let previous;
          const remove = scene.postRender.addEventListener(() => {
            const current = viewer.entities.getById("country-label-BRA");
            frames = current && current === previous && !isCameraNavigating ? frames + 1 : 0;
            previous = current;
            if (frames < 3) { scene.requestRender(); return; }
            clearTimeout(timer);
            remove();
            resolve(current);
          });
          const timer = setTimeout(() => { remove(); reject(new Error("La etiqueta no se estabilizo")); }, 15000);
          scene.requestRender();
        });
        // Hiding the globe can change the frustum and recreate labels on the next frames.
        scene.globe.show = false;
        source.show = false;
        let diagnostics;
        try {
          for (let attempt = 0; attempt < 8; attempt++) {
            entity = await waitForStableLabel();
            originalShow = entity.label.show;
            const point = scene.cartesianToCanvasCoordinates(entity.position.getValue(viewer.clock.currentTime));
            const scale = scene.canvas.width / scene.canvas.clientWidth;
            const width = Math.ceil(90 * scale);
            const height = Math.ceil(30 * scale);
            const x = Math.floor(point.x * scale - width / 2);
            const y = Math.floor(scene.canvas.height - point.y * scale - height / 2);
            const sample = show => new Promise((resolve, reject) => {
              entity.label.show = show;
              let frames = 0;
              const remove = scene.postRender.addEventListener(() => {
                if (++frames < 3) { scene.requestRender(); return; }
                clearTimeout(timer);
                remove();
                const result = new Uint8Array(width * height * 4);
                gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, result);
                resolve(result);
              });
              const timer = setTimeout(() => { remove(); reject(new Error("No se dibujo la etiqueta de prueba")); }, 5000);
              scene.requestRender();
            });
            const hidden = await sample(false);
            const visible = await sample(true);
            entity.label.show = originalShow;
            let changed = 0;
            let brighter = 0;
            let maxChannel = 0;
            for (let i = 0; i < visible.length; i += 4) {
              if (visible[i] !== hidden[i] || visible[i + 1] !== hidden[i + 1] || visible[i + 2] !== hidden[i + 2]) changed++;
              if (visible[i] - hidden[i] > 20 && visible[i + 1] - hidden[i + 1] > 20 && visible[i + 2] - hidden[i + 2] > 20) brighter++;
              maxChannel = Math.max(maxChannel, visible[i], visible[i + 1], visible[i + 2]);
            }
            diagnostics = { changed, brighter, maxChannel, sameEntity: viewer.entities.getById(entity.id) === entity, x, y, width, height, error: gl.getError() };
            if (changed > 2 && brighter > 2 && diagnostics.sameEntity) return diagnostics;
          }
          return diagnostics;
        } finally {
          scene.globe.show = globeShow;
          source.show = sourceShow;
          if (entity) entity.label.show = originalShow;
          scene.requestRender();
        }
      });
      assert.ok(pixels.changed > 2 && pixels.brighter > 2 && pixels.sameEntity && pixels.error === 0,
        label + ": el nombre debe producir pixeles de texto, no solo una entidad: " + JSON.stringify(pixels));
      await page.waitForTimeout(3500);
      await page.waitForFunction(() => viewer.scene.globe.tilesLoaded && !loadMapPromise && !isCameraNavigating);
      await page.screenshot({ path: "tmp/map-labels-" + label + ".png" });
      const before = await page.locator("#map canvas").screenshot();
      await page.evaluate(() => viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(110, 30, 4500000), duration: 1.5 }));
      await page.waitForFunction(() => isCameraNavigating);
      await page.evaluate(() => renderMapLabels());
      assert.equal(await page.evaluate(() => labelEntities.length), 0, "no reconstruir nombres durante el movimiento");
      assert.equal(await page.evaluate(() => hiddenLabelEntities.length > 0 && hiddenLabelEntities.every(entity => !entity.show)), true,
        "temporarily retain only hidden labels from the previous view during navigation");
      await page.waitForFunction(() => !isCameraNavigating && labelEntities.length > 0);
      const asia = await assertVisible();
      assert.notDeepEqual(asia.map(item => item.id), brazil.map(item => item.id), "el nuevo hemisferio recupera sus nombres");
      assert.equal(before.equals(await page.locator("#map canvas").screenshot()), false);
      await page.setViewportSize(mobile ? { width: 412, height: 915 } : { width: 1200, height: 800 });
      await page.waitForTimeout(800);
      await assertVisible();
      await toolsToggle.click();
      await page.locator("#label-mode-select").selectOption("none");
      await toolsToggle.click();
      assert.equal(await page.evaluate(() => labelEntities.length), 0);
      assert.equal(await page.evaluate(() => hiddenLabelEntities.length), 0);
      await setMapMode(page, "2d");
      assert.equal(await page.evaluate(() => labelEntities.length), 0);
      assertHealthyPage(test.pageErrors, label + " etiquetas de mapa");
    } catch (error) {
      console.error("Map labels failed:", await page.evaluate(() => ({
        mode: currentMapMode, labelMode, labels: labelEntities.length, navigating: isCameraNavigating,
        deviceMemory: navigator.deviceMemory, cores: navigator.hardwareConcurrency,
        countries: Object.keys(countriesData).length, layers: countryLayers.size,
        boot: bootMetrics.steps, degradations: mapDegradationLog.list()
      })).catch(() => null));
      throw error;
    } finally {
      releaseIndex();
      await test.context.close();
    }
  }
}

async function testAutoRotation(browser, baseUrl) {
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    const mobile = viewport === MOBILE_VIEWPORT;
    const label = mobile ? "mobile" : "desktop";
    // Test rotation independently of the automatic low-FPS switch to 2D.
    const test = await createTestPage(browser, baseUrl, viewport, page => page.addInitScript(() => {
      localStorage.setItem("geo-risk-quality-preset", "performance");
    }));
    const { page } = test;
    const toolsToggle = page.locator(mobile ? "#toggle-tools-panel" : "#map-toolbar > summary");
    try {
      await waitForAppReady(page);
      await page.evaluate(() => {
        window.__rotationTrace = [];
        window.__rotationInputTrace = [];
        for (const event of ["blur", "focus", "visibilitychange", "pointerdown", "pointerup", "pointercancel", "keydown", "wheel", "resize", "contextmenu"]) {
          window.addEventListener(event, value => window.__rotationInputTrace.push({
            event, now: Date.now(), target: value.target?.id || value.target?.nodeName
          }), true);
        }
        const step = autoRotation.step;
        autoRotation.step = options => {
          const angle = step(options);
          const { camera: _camera, ...entry } = options;
          entry.rotating = autoRotation.isRotating();
          const last = window.__rotationTrace.at(-1);
          if (!last || ["interactionAt", "navigating", "blocked", "visible", "rotating"].some(key => last[key] !== entry[key])) {
            window.__rotationTrace.push(entry);
          }
          return angle;
        };
      });
      await toolsToggle.click();
      await page.locator("#auto-rotate-button").click();
      assert.equal(await page.locator("#auto-rotate-button").getAttribute("aria-pressed"), "true");
      await toolsToggle.click();
      await waitForMapMode(page, "3d");
      await page.waitForFunction(() => autoRotation.isRotating(), undefined, { timeout: 12000 });
      const before = await page.locator("#map canvas").screenshot();
      const motion = await page.evaluate(() => new Promise((resolve, reject) => {
        const positions = [];
        // GPU speed varies on CI; every rendered frame must advance the camera.
        const timer = setTimeout(() => { remove(); reject(new Error("La rotacion no produjo diez frames")); }, 20000);
        const remove = viewer.scene.postRender.addEventListener(() => {
          positions.push(Cesium.Cartesian3.clone(viewer.camera.positionWC));
          if (positions.length < 10) return;
          clearTimeout(timer);
          remove();
          resolve({ frames: positions.length, changes: positions.slice(1).filter((position, index) => Cesium.Cartesian3.distance(position, positions[index]) > 10).length });
        });
      }));
      assert.ok(motion.changes >= 8 && motion.frames >= 10, label + ": rotacion continua por frame, no saltos espaciados: " + JSON.stringify(motion));
      const after = await page.locator("#map canvas").screenshot();
      assert.equal(before.equals(after), false, "el canvas cambia durante la rotacion");
      await page.screenshot({ path: "tmp/auto-rotation-" + label + ".png" });

      const canvas = await page.locator("#map canvas").boundingBox();
      const point = { x: canvas.x + canvas.width * 0.65, y: canvas.y + canvas.height * 0.55 };
      const touch = mobile ? await test.context.newCDPSession(page) : null;
      if (touch) await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...point, id: 1 }] });
      else { await page.mouse.move(point.x, point.y); await page.mouse.down(); }
      // Cesium also emits move events for frustum updates; verify the real pose below.
      await page.waitForFunction(() => !autoRotation.isRotating());
      const held = await page.evaluate(() => Cesium.Cartesian3.clone(viewer.camera.positionWC));
      await page.waitForTimeout(3400);
      assert.equal(await page.evaluate(position => Cesium.Cartesian3.distance(position, viewer.camera.positionWC) < 0.01, held), true,
        "el contacto sostenido no debe reiniciar la rotacion");
      if (touch) {
        await touch.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] });
        await touch.detach();
      } else {
        await page.mouse.move(10, 10);
        await page.mouse.up();
      }
      await page.waitForFunction(() => autoRotation.isRotating(), undefined, { timeout: 12000 });

      await page.evaluate(() => openIntroModal());
      await page.waitForFunction(() => !autoRotation.isRotating());
      const paused = await page.evaluate(() => Cesium.Cartesian3.clone(viewer.camera.positionWC));
      await page.waitForTimeout(500);
      assert.equal(await page.evaluate(position => Cesium.Cartesian3.distance(position, viewer.camera.positionWC) < 0.01, paused), true);
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => autoRotation.isRotating(), undefined, { timeout: 12000 });
      await toolsToggle.click();
      await page.locator("#auto-rotate-button").click();
      assert.equal(await page.locator("#auto-rotate-button").getAttribute("aria-pressed"), "false");
      await toolsToggle.click();
      await page.waitForFunction(() => !autoRotation.isRotating());
      const stopped = await page.evaluate(() => Cesium.Cartesian3.clone(viewer.camera.positionWC));
      await page.waitForTimeout(500);
      assert.equal(await page.evaluate(position => Cesium.Cartesian3.distance(position, viewer.camera.positionWC) < 0.01, stopped), true);
      assertHealthyPage(test.pageErrors, label + " rotacion automatica");
    } catch (error) {
      console.error("auto-rotation diagnostic", label, await page.evaluate(() => ({
        mode: currentMapMode, enabled: autoRotateEnabled, rotating: autoRotation.isRotating(),
        navigating: isCameraNavigating, sinceInteraction: Date.now() - lastInteractionAt,
        visible: document.visibilityState, classes: document.body.className,
        rendering: viewer.useDefaultRenderLoop, transition: Boolean(cancelPendingMapTransition), loading: Boolean(loadMapPromise),
        modals: MODAL_IDS.filter(id => document.getElementById(id)?.hidden === false),
        degradations: mapDegradationLog.list(),
        activeElement: document.activeElement?.id, trace: window.__rotationTrace, inputs: window.__rotationInputTrace
      })).catch(() => null));
      throw error;
    } finally {
      await test.context.close();
    }
  }
}

async function testConflictCurationAndLateResponse(browser, baseUrl) {
  const partialEvidence = JSON.parse(await fs.readFile("data/conflict_details.generated.json", "utf8")).conflicts["Batalla de Francia"];
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    const label = viewport === MOBILE_VIEWPORT ? "mobile" : "desktop";
    const scriptAttempts = { "app-curation": 0, "app-conflict-rules": 0 };
    let datuDetailRequests = 0;
    let focaDetailRequests = 0;
    let nogalesDetailRequests = 0;
    let santoriniDetailRequests = 0;
    let capeRocaDetailRequests = 0;
    let releaseDetail;
    const pending = new Promise(resolve => { releaseDetail = resolve; });
    let releaseScript;
    const stalledScript = new Promise(resolve => { releaseScript = resolve; });
    let markRequested;
    const requested = new Promise(resolve => { markRequested = resolve; });
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      await page.addInitScript(() => {
        window.__curationDeadlines = new Map();
        const start = window.setTimeout.bind(window);
        const stop = window.clearTimeout.bind(window);
        window.setTimeout = (action, delay, ...args) => {
          const id = start(action, delay, ...args);
          if (delay === 20000 && action?.name === "onError") window.__curationDeadlines.set(id, action);
          return id;
        };
        window.clearTimeout = id => {
          window.__curationDeadlines.delete(id);
          stop(id);
        };
      });
      page.on("request", request => {
        if (request.url().includes("/data/conflicts/details/combate-contra-datu-ali-1905-")) datuDetailRequests++;
        if (request.url().includes("/data/conflicts/details/combate-de-caleta-foca-1982-")) focaDetailRequests++;
        if (request.url().includes("/data/conflicts/details/batalla-de-ambos-nogales-1918-")) nogalesDetailRequests++;
        if (request.url().includes("/data/conflicts/details/incursion-sobre-santorini-1944-")) santoriniDetailRequests++;
        if (request.url().includes("/data/conflicts/details/batalla-del-cabo-de-la-roca-1703-")) capeRocaDetailRequests++;
      });
      await page.route(/\/app-(curation|conflict-rules)\.js\?/, async route => {
        const name = route.request().url().match(/\/(app-(?:curation|conflict-rules))\.js/)[1];
        scriptAttempts[name] += 1;
        if (name === "app-curation" && scriptAttempts[name] === 1) {
          if (viewport === MOBILE_VIEWPORT) await stalledScript;
          await route.abort("internetdisconnected");
        }
        else await route.continue();
      });
      await page.route(/\/data\/conflicts\/details\/batalla-del-cabo-de-gata-1815-/, async route => {
        markRequested();
        await pending;
        await route.continue();
      });
    });
    const { page } = test;
    try {
      await waitForAppReady(page, { requireTiles: false });
      assert.deepEqual(scriptAttempts, { "app-curation": 0, "app-conflict-rules": 0 }, "historical curation is not downloaded at startup");
      await page.evaluate(() => {
        window.__originalConflictModalBuilder = getConflictModalContent;
        window.__conflictModelBuilds = 0;
        getConflictModalContent = (...args) => {
          window.__conflictModelBuilds += 1;
          return window.__originalConflictModalBuilder(...args);
        };
      });
      await submitSearch(page, "Argentina");
      await waitForCountryPanel(page, "Argentina");
      const history = page.locator('[data-country-nav="country-section-history"]');
      await history.click();
      if (viewport === MOBILE_VIEWPORT) {
        await page.waitForFunction(() => Boolean(window.GeoRiskConflictRules) && window.__curationDeadlines.size === 1);
        assert.equal(scriptAttempts["app-curation"], 1);
        // Exercise the real deadline callback without adding a 20-second sleep.
        await page.evaluate(() => [...window.__curationDeadlines.values()][0]());
        releaseScript();
      }
      const notice = page.locator("#app-toast");
      await notice.filter({ hasText: "datos historicos adicionales" }).waitFor({ state: "visible" });
      await captureTransientNotice(page, notice, { path: `tmp/curation-load-recovery-${label}.png` });
      assert.equal(await page.evaluate(() => deferredDataStatus.runtimeCuration), false);
      assert.equal(await page.evaluate(() => loadRuntimeCurationPromise), null);
      assert.equal(await page.locator('script[data-dynamic-src*="app-curation.js"]').count(), 0);
      assert.equal(await page.evaluate(() => window.__curationDeadlines.size), 0, "failure clears both classic-script deadlines");
      assert.equal(scriptAttempts["app-curation"], 1, "no automatic retry after a network failure");
      await history.focus();
      const focusAfterRefresh = await page.evaluate(async () => {
        const previous = document.activeElement;
        await renderCountry(countriesData.ARG, "Argentina");
        return { replaced: !previous.isConnected, section: document.activeElement?.dataset.countryNav };
      });
      assert.equal(focusAfterRefresh.replaced, true, "la prueba actualiza realmente los botones de la ficha");
      assert.equal(focusAfterRefresh.section, "country-section-history", "actualizar datos no debe perder el foco del reintento por teclado");
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => deferredDataStatus.runtimeCuration === true);
      assert.deepEqual(scriptAttempts, { "app-curation": 2, "app-conflict-rules": 1 }, "explicit reopening only retries the failed script");
      assert.equal(await page.locator('script[data-dynamic-src*="app-curation.js"]').count(), 1);
      assert.equal(await page.evaluate(() => window.__curationDeadlines.size), 0, "retry success leaves no classic-script deadline");
      await page.locator("#country-section-history").waitFor({ state: "visible" });
      await page.locator('[data-country-nav="country-section-military"]').click();
      await page.waitForFunction(() => document.querySelectorAll('#country-section-military [data-conflict-key]').length > 0);
      const registeredModels = await page.evaluate(() => ({
        visibleLinks: document.querySelectorAll('#country-section-military [data-conflict-key]').length,
        preparedModels: window.__conflictModelBuilds
      }));
      assert.equal(registeredModels.preparedModels, 0, "military links are rendered without constructing unopened modal models");
      console.log("conflict-models: " + label + " " + registeredModels.visibleLinks + " visible links; 0 prepared models");
      await closeCountryPanel(page);
      await page.evaluate(async () => {
        await loadCountryDetail("USA");
        await loadCountryConflictDetail("USA");
        const names = ["Batalla del cabo de Gata (1815)", "Batalla naval frente a Halifax (1782)"];
        window.__curationKeys = names.map(name => registerConflictModal(countriesData.USA.military.conflicts.find(item => item.name === name), "Estados Unidos"));
        openConflictModal(window.__curationKeys[0]);
      });
      await Promise.race([requested, page.waitForTimeout(APP_TIMEOUT_MS).then(() => { throw new Error("No se solicito el detalle de Gata"); })]);
      assert.equal(await page.evaluate(() => window.__conflictModelBuilds), 1, "only the opened Gata profile is prepared, not its unopened Halifax link");
      await page.evaluate(() => openConflictModal(window.__curationKeys[1]));
      await page.waitForFunction(() => Boolean(CONFLICT_DETAIL_OVERRIDES["Batalla naval frente a Halifax (1782)"]));
      const body = page.locator("#conflict-modal-body");
      assert.match(await body.locator(".overview-card").first().innerText(), /Batalla/i);
      assert.match(await body.locator(".overview-card").nth(2).innerText(), /Local/);
      await body.locator(".conflict-curation-notes").waitFor();
      await page.waitForFunction(() => window.__conflictModelBuilds >= 3);
      assert.equal(await page.evaluate(() => window.__conflictModelBuilds), 3, "initial render plus owned loaded render, without a duplicate preparation in the callback");
      assert.match(await body.locator(".conflict-curation-notes").innerText(), /28 al 29 de mayo de 1782/);
      assert.match(await body.locator(".conflict-curation-notes").innerText(), /no un buque de la Marina Continental/);
      assert.equal(await body.locator(".conflict-treaties").count(), 0);
      const chronology = body.locator(".conflict-modal-section").filter({ has: page.getByRole("heading", { name: "Cronologia interna", exact: true }) });
      const items = await chronology.locator("li").allTextContents();
      assert.match(items[0], /28 de mayo/);
      assert.match(items[1], /29 de mayo/);
      releaseDetail();
      await page.waitForFunction(() => Boolean(CONFLICT_DETAIL_OVERRIDES["Batalla del cabo de Gata (1815)"]));
      await page.waitForTimeout(150);
      assert.equal(await page.evaluate(() => window.__conflictModelBuilds), 3, "a late response for another episode does not build a discarded model");
      const title = await page.locator("#conflict-modal-title").innerText();
      assert.match(title, /Halifax/i);
      assert.equal((title.match(/1782/g) || []).length, 1, "no duplicar el periodo del titulo");
      await page.screenshot({ path: "tmp/conflict-curation-" + label + ".png" });
      assert.equal(await body.evaluate(element => element.scrollWidth <= element.clientWidth), true);
      await body.locator(".conflict-curation-notes").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "tmp/conflict-curation-notes-" + label + ".png" });
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(() => openConflictModal(window.__curationKeys[0]));
      assert.match(await body.locator(".conflict-treaties").innerText(), /30 de junio de 1815/);
      assert.match(await body.locator(".conflict-curation-notes").innerText(), /no como bando/);
      assert.ok(await body.locator(".conflict-hierarchy-sources a").count() >= 4);
      assert.equal(datuDetailRequests, 0, "deep historical references are not loaded before opening the episode");
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(() => {
        const entry = countriesData.USA.military.conflicts.find(item => item.name === "Combate contra Datu Ali (1905)");
        window.__datuAliKey = registerConflictModal(entry, "Estados Unidos");
        openConflictModal(window.__datuAliKey);
      });
      await page.waitForFunction(() => Boolean(CONFLICT_DETAIL_OVERRIDES["Combate contra Datu Ali (1905)"]));
      const datuTitle = await page.locator("#conflict-modal-title").innerText();
      assert.match(datuTitle, /Datu Ali/i);
      assert.equal((datuTitle.match(/1905/g) || []).length, 1);
      assert.match(await body.innerText(), /Mindanao, Filipinas/);
      assert.match(await body.innerText(), /Rebeli\u00f3n moro/);
      assert.match(await body.innerText(), /1 muerto en el acto y 2 heridos/);
      assert.match(await body.innerText(), /Malala\/Malola/);
      assert.match(await body.locator(".conflict-curation-notes").innerText(), /22 de octubre de 1905/);
      assert.match(await body.locator(".conflict-curation-notes").innerText(), /no un gobierno independiente beligerante/);
      assert.deepEqual(await body.locator(".conflict-hierarchy-sources a").evaluateAll(links => links.map(link => link.href)), [
        "https://www.1-22infantry.org/history3/ali.htm", "https://www.army.mil/article/47711/battle_of_san_jacinto"
      ]);
      assert.equal(await body.locator(".conflict-treaties").count(), 0);
      assert.equal(await body.evaluate(element => element.scrollWidth <= element.clientWidth), true);
      await captureLiveElement(page, body.locator(".conflict-curation-notes"), { path: `tmp/datu-ali-${label}.png`, timeout: 10000 });
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(() => openConflictModal(window.__datuAliKey));
      assert.equal(datuDetailRequests, 1, "reopening reuses the existing detail cache");
      assert.equal(focaDetailRequests, 0, "Caleta Foca sources stay unloaded until the episode opens");
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(async () => {
        await loadCountryConflictDetail("ARG");
        const entry = countriesData.ARG.military.conflicts.find(item => item.name === "Combate de Caleta Foca (1982)");
        window.__caletaFocaKey = registerConflictModal(entry, "Argentina");
        openConflictModal(window.__caletaFocaKey);
      });
      await page.waitForFunction(() => Boolean(CONFLICT_DETAIL_OVERRIDES["Combate de Caleta Foca (1982)"]));
      const focaTitle = await page.locator("#conflict-modal-title").innerText();
      assert.match(focaTitle, /Caleta Foca/i);
      assert.equal((focaTitle.match(/1982/g) || []).length, 1);
      assert.match(await body.innerText(), /Guerra de las Malvinas/);
      assert.match(await body.innerText(), /Malvinas\/Falkland, Atl\u00e1ntico Sur/);
      assert.match(await body.innerText(), /algunos heridos leves/);
      const focaNotes = body.locator(".conflict-curation-notes");
      assert.match(await focaNotes.innerText(), /23 de mayo de 1982/);
      assert.match(await focaNotes.innerText(), /proyecto de resoluci\u00f3n, no una norma aprobada/);
      assert.match(await focaNotes.innerText(), /no confirma un derribo/);
      assert.deepEqual(await body.locator(".conflict-hierarchy-sources a").evaluateAll(links => links.map(link => link.href)), [
        "https://www.argentina.gob.ar/sites/default/files/ar-ara-coac-7b5.pdf",
        "https://rest.hcdn.gob.ar/web/tramites-parlamentarios/render/adjunto/69d3b9b78c1e4.pdf"
      ]);
      assert.equal(await body.locator(".conflict-treaties").count(), 0);
      assert.equal(await body.evaluate(element => element.scrollWidth <= element.clientWidth), true);
      await captureLiveElement(page, focaNotes, { path: `tmp/caleta-foca-${label}.png`, timeout: 10000 });
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(() => openConflictModal(window.__caletaFocaKey));
      assert.equal(focaDetailRequests, 1, "reopening only reuses one on-demand detail request");
      assert.equal(nogalesDetailRequests, 0, "Nogales evidence is not prefetched with other episodes");
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(async () => {
        await loadCountryConflictDetail("USA");
        const entry = countriesData.USA.military.conflicts.find(item => item.name === "Batalla de Ambos Nogales (1918)");
        window.__nogalesKey = registerConflictModal(entry, "Estados Unidos");
        openConflictModal(window.__nogalesKey);
      });
      await page.waitForFunction(() => Boolean(CONFLICT_DETAIL_OVERRIDES["Batalla de Ambos Nogales (1918)"]));
      const nogalesTitle = await page.locator("#conflict-modal-title").innerText();
      assert.match(nogalesTitle, /Ambos Nogales/i);
      assert.equal((nogalesTitle.match(/1918/g) || []).length, 1);
      const nogalesNotes = body.locator(".conflict-curation-notes");
      assert.match(await nogalesNotes.innerText(), /27 de agosto de 1918/);
      assert.match(await nogalesNotes.innerText(), /no se contabilizan como dos batallas/);
      assert.match(await nogalesNotes.innerText(), /asesores alemanes/);
      assert.match(await nogalesNotes.innerText(), /no permiten confirmar/);
      assert.equal(await body.locator('.conflict-hierarchy-sources a[href^="https://heroicanogales.gob.mx/"]').count(), 1);
      assert.equal(await body.locator(".conflict-treaties").count(), 0);
      assert.equal(await body.evaluate(element => element.scrollWidth <= element.clientWidth), true);
      await captureLiveElement(page, nogalesNotes, { path: `tmp/nogales-alias-${label}.png`, timeout: 10000 });
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(() => openConflictModal(window.__nogalesKey));
      assert.equal(nogalesDetailRequests, 1, "the merged episode still reuses one on-demand detail request");
      assert.equal(santoriniDetailRequests, 0, "Santorini references are not prefetched with other episodes");
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(async () => {
        await loadCountryConflictDetail("GBR");
        const entry = countriesData.GBR.military.conflicts.find(item => item.name === "Incursion sobre Santorini (1944)");
        window.__santoriniKey = registerConflictModal(entry, "Reino Unido");
        openConflictModal(window.__santoriniKey);
      });
      await page.waitForFunction(() => Boolean(CONFLICT_DETAIL_OVERRIDES["Incursion sobre Santorini (1944)"]));
      const santoriniTitle = await page.locator("#conflict-modal-title").innerText();
      assert.match(santoriniTitle, /Santorini/i);
      assert.equal((santoriniTitle.match(/1944/g) || []).length, 1);
      assert.match(await body.innerText(), /Segunda Guerra Mundial/);
      assert.match(await body.innerText(), /Santorini \(Thera\).*Grecia/);
      assert.match(await body.innerText(), /Sin total exclusivo.*no equivale a cero/);
      const santoriniNotes = body.locator(".conflict-curation-notes");
      assert.match(await santoriniNotes.innerText(), /abril de 1944 sin un d\u00eda definitivo/);
      assert.match(await santoriniNotes.innerText(), /22 de abril/);
      assert.match(await santoriniNotes.innerText(), /24 de abril/);
      assert.match(await santoriniNotes.innerText(), /Grecia vincula el territorio, no una unidad griega confirmada/);
      assert.match(await santoriniNotes.innerText(), /PDF institucional no pudo descargarse/);
      assert.deepEqual(await body.locator(".conflict-hierarchy-sources a").evaluateAll(links => links.map(link => new URL(link.href).hostname)), [
        "www.nam.ac.uk", "hdl.handle.net", "studyres.com", "en.wikipedia.org"
      ]);
      assert.match(await body.locator('.conflict-hierarchy-sources a[href^="https://studyres.com/"]').innerText(), /copia consultada, no fuente independiente/);
      assert.equal(await body.locator(".conflict-treaties").count(), 0);
      assert.equal(await body.evaluate(element => element.scrollWidth <= element.clientWidth), true);
      await captureLiveElement(page, santoriniNotes, { path: `tmp/santorini-curation-${label}.png`, timeout: 10000 });
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(() => openConflictModal(window.__santoriniKey));
      assert.equal(santoriniDetailRequests, 1, "reopening Santorini reuses one on-demand detail request");
      assert.equal(capeRocaDetailRequests, 0, "Cape Roca source notes are not prefetched with other episodes");
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(async () => {
        await loadCountryDetail("FRA");
        await loadCountryConflictDetail("FRA");
        const entry = countriesData.FRA.military.conflicts.find(item => item.name === "Batalla del cabo de la Roca (1703)");
        window.__capeRocaKey = registerConflictModal(entry, "Francia");
        openConflictModal(window.__capeRocaKey);
      });
      await page.waitForFunction(() => Boolean(CONFLICT_DETAIL_OVERRIDES["Batalla del cabo de la Roca (1703)"]));
      const capeRocaTitle = await page.locator("#conflict-modal-title").innerText();
      assert.match(capeRocaTitle, /cabo de la Roca/i);
      assert.equal((capeRocaTitle.match(/1703/g) || []).length, 1);
      assert.match(await body.innerText(), /Guerra de Sucesi\u00f3n Espa\u00f1ola/);
      assert.match(await body.innerText(), /Portugal, Atl\u00e1ntico nororiental/);
      assert.match(await body.innerText(), /Roemer Vlacq/);
      assert.match(await body.innerText(), /Sin total de bajas humanas.*no equivale a cero/);
      const capeRocaNotes = body.locator(".conflict-curation-notes");
      assert.match(await capeRocaNotes.innerText(), /22 de mayo de 1703/);
      assert.match(await capeRocaNotes.innerText(), /parte franc\u00e9s, no un recuento independiente/);
      assert.match(await capeRocaNotes.innerText(), /no acredita una escolta brit\u00e1nica/);
      assert.match(await capeRocaNotes.innerText(), /Portugal es la referencia geogr\u00e1fica, no un beligerante/);
      assert.deepEqual(await body.locator(".conflict-hierarchy-sources a").evaluateAll(links => links.map(link => new URL(link.href).hostname)), [
        "m.shabretagne.com", "www.servicehistorique.sga.defense.gouv.fr", "en.wikipedia.org"
      ]);
      assert.match(await body.locator('.conflict-hierarchy-sources a[href^="https://m.shabretagne.com/"]').innerText(), /PDF consultado/);
      assert.equal(await body.locator(".conflict-treaties").count(), 0);
      assert.equal(await body.evaluate(element => element.scrollWidth <= element.clientWidth), true);
      await captureLiveElement(page, capeRocaNotes, { path: `tmp/cape-roca-curation-${label}.png`, timeout: 10000 });
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(() => openConflictModal(window.__capeRocaKey));
      assert.equal(capeRocaDetailRequests, 1, "reopening Cape Roca reuses one on-demand detail request");
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(() => {
        window.__pendingConflictKey = registerConflictModal({ name: "Prueba sin detalle", startYear: 1900, endYear: 1920 }, "Estados Unidos");
        openConflictModal(window.__pendingConflictKey, { enhance: false });
      });
      assert.equal(await body.locator(".compare-note").count(), 5, "missing causes, sides, chronology, outcome and consequences are explicit");
      assert.match(await body.innerText(), /Sin detalle documentado en esta ficha/);
      assert.doesNotMatch(await body.innerText(), /1910|Corea del Sur|muy elevadas|fase.*decisiva/i);
      assert.equal(await body.locator(".conflict-modal-side").count(), 0, "selected profile does not create a military side");
      assert.equal(await body.evaluate(element => element.scrollWidth <= element.clientWidth), true);
      await captureLiveElement(page, body, { path: `tmp/conflict-pending-${label}.png`, timeout: 10000 });
      await page.evaluate(() => {
        window.__curationLanguage = currentLanguage;
        currentLanguage = "en";
        openConflictModal(window.__pendingConflictKey, { enhance: false });
      });
      assert.match(await body.innerText(), /No documented detail in this profile/);
      assert.doesNotMatch(await body.innerText(), /Sin detalle documentado/);
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(() => {
        currentLanguage = window.__curationLanguage;
        window.__recordedConflictKey = registerConflictModal({
          name: "Prueba de detalle registrado", cause: "Causa registrada", outcome: "<b>Resultado registrado</b>",
          participants: [{ side: "Bando 1", members: ["Estados Unidos"] }],
          chronology: [{ year: null, text: "Evento sin fecha" }, { year: 1901, text: "Evento registrado" }]
        }, "Estados Unidos");
        openConflictModal(window.__recordedConflictKey, { enhance: false });
      });
      assert.match(await body.innerText(), /Causa registrada/);
      assert.match(await body.innerText(), /<b>Resultado registrado<\/b>/);
      assert.equal(await body.locator(".conflict-modal-side strong").innerText(), "Estados Unidos");
      assert.doesNotMatch(await body.innerText(), /Corea del Sur|ONU/);
      const recordedChronology = body.locator(".conflict-modal-section").filter({ has: page.locator("h4", { hasText: "Cronologia interna" }) });
      assert.deepEqual(await recordedChronology.locator("li b").allTextContents(), ["1901"], "null chronology year never becomes year zero");
      assert.equal(await body.evaluate(element => element.scrollWidth <= element.clientWidth), true);
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(evidence => {
        window.__partialEvidenceKey = registerConflictModal({ ...evidence, name: "Prueba estructural documentada" });
        openConflictModal(window.__partialEvidenceKey, { enhance: false });
      }, partialEvidence);
      assert.match(await body.innerText(), /Declaraci\u00f3n de guerra a Alemania/);
      assert.match(await body.innerText(), /Victoria decisiva del Eje/);
      const recordedSides = body.locator(".conflict-modal-section").filter({ has: page.locator("h4", { hasText: "Participantes y bandos" }) });
      assert.deepEqual(await recordedSides.locator(".conflict-modal-side strong").allTextContents(), ["Eje", "Aliados"]);
      assert.doesNotMatch(await body.innerText(), /lectura territorial o militar/);
      assert.equal(await body.locator(".conflict-modal-section").filter({ has: page.locator("h4", { hasText: "Que cambio despues" }) }).locator(".compare-note").count(), 1);
      await page.locator("#conflict-modal-close").click();
      await page.evaluate(() => {
        conflictModalRegistry.delete(window.__pendingConflictKey);
        conflictModalRegistry.delete(window.__recordedConflictKey);
        conflictModalRegistry.delete(window.__partialEvidenceKey);
      });
      assertHealthyPage(test.pageErrors, label + " notas de curaduria y descarga tardia");
    } catch (error) {
      console.error("curation recovery diagnostic", label, await page.evaluate(() => ({
        country: currentPanelState.code, section: currentPanelState.countryActiveSection,
        loaded: deferredDataStatus.runtimeCuration, pending: Boolean(loadRuntimeCurationPromise),
        focusedSection: document.activeElement?.dataset.countryNav, focusedId: document.activeElement?.id,
        scripts: [...document.querySelectorAll("script[data-dynamic-src]")].map(element => ({
          src: element.dataset.dynamicSrc, loaded: element.dataset.loaded
        }))
      })).catch(() => null), { scriptAttempts, pageErrors: test.pageErrors });
      throw error;
    } finally {
      releaseDetail();
      releaseScript();
      await page.evaluate(() => {
        if (window.__originalConflictModalBuilder) getConflictModalContent = window.__originalConflictModalBuilder;
      }).catch(() => {});
      await test.context.close();
    }
  }
}

async function testControlsStartup(browser, baseUrl) {
  const context = await browser.newContext({ viewport: MOBILE_VIEWPORT, isMobile: true, hasTouch: true, serviceWorkers: "block" });
  await tileCache.attach(context);
  let releaseMain;
  let releaseUi;
  let releaseStyles;
  const mainHeld = new Promise(resolve => { releaseMain = resolve; });
  const uiHeld = new Promise(resolve => { releaseUi = resolve; });
  const stylesHeld = new Promise(resolve => { releaseStyles = resolve; });
  const pageErrors = [];
  try {
    const page = await context.newPage();
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.route(/\/script\.js\?/, async route => { await mainHeld; await route.continue(); });
    await page.route(/\/app-ui-polish\.js\?/, async route => { await uiHeld; await route.continue(); });
    await page.route(/\/style-polish\.css\?/, async route => { await stylesHeld; await route.continue(); });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "serviceWorker", { configurable: true, value: {
        register() { window.__offlineSetupPending = true; return new Promise(() => {}); }
      } });
    });
    await page.goto(baseUrl + "/index.html", { waitUntil: "commit", timeout: APP_TIMEOUT_MS });
    await page.waitForFunction(() => {
      const status = document.getElementById("startup-status");
      return status && getComputedStyle(status).opacity === "1";
    });
    assert.equal(await page.evaluate(() => typeof init), "undefined", "la prueba debe retener el runtime principal");
    await assertStartupControlsHaveNoLayout(page);
    assert.equal(await page.locator("#map-search-input").isVisible(), false, "no mostrar controles sin handlers antes de script.js");
    await captureStartupState(page, "tmp/startup-before-runtime-mobile.png");
    releaseMain();
    await page.waitForFunction(() => typeof bootMetrics !== "undefined" && bootMetrics.steps.mapBootReady?.end && bootMetrics.steps.deferredUi?.start);
    await page.waitForTimeout(350);
    assert.equal(await page.locator("#startup-status").isVisible(), true);
    assert.equal(await page.locator("#map-search-input").isVisible(), false, "el mapa listo no implica controles listos");
    assert.equal(await page.locator("#intro-modal").isVisible(), false, "la bienvenida debe esperar sus acciones");
    assert.equal(await page.evaluate(() => bootMetrics.completedAt), 0);
    await assertStartupControlsHaveNoLayout(page);
    await page.evaluate(() => { window.__startupCameraPosition = Cesium.Cartesian3.clone(viewer.camera.position); });
    await page.mouse.move(190, 420);
    await page.mouse.down();
    await page.mouse.move(270, 420, { steps: 8 });
    await page.mouse.up();
    await page.waitForFunction(() => Cesium.Cartesian3.distance(viewer.camera.position, window.__startupCameraPosition) > 10);
    await captureStartupState(page, "tmp/startup-deferred-mobile.png");
    releaseUi();
    await waitForAppReady(page, { requireTiles: false });
    await page.waitForFunction(() => window.__offlineSetupPending === true);
    assert.equal(await page.locator("#intro-modal").isVisible(), true, JSON.stringify(await page.evaluate(() => ({
      seen: localStorage.getItem(STORAGE_KEYS.introSeen), hidden: document.getElementById("intro-modal").hidden,
      classes: document.body.className, active: activeModalElement?.id, boot: bootMetrics.errors
    }))));
    assert.equal(await page.locator("#startup-status").isVisible(), false);
    assert.equal(await page.evaluate(() => bootMetrics.completedAt >= bootMetrics.steps.deferredUi.end), true);
    await assertModalFrame(page, "intro-modal");
    assert.equal(await page.locator(".product-start-card").first().evaluate(element => {
      const channels = color => color.match(/[\d.]+/g).slice(0, 3).map(Number);
      return channels(getComputedStyle(element).backgroundColor).every(value => value < 80) &&
        channels(getComputedStyle(element.querySelector("strong")).color).every(value => value > 200);
    }), true, "la bienvenida no debe depender del CSS diferido para tener texto claro sobre fondo oscuro");
    await captureStartupState(page, "tmp/intro-mobile.png");
    releaseStyles();
    await page.locator('[data-intro-action="search"]').click();
    await page.waitForFunction(() => document.activeElement?.id === "map-search-input");
    await submitSearch(page, "Argentina");
    await waitForCountryPanel(page, "Argentina");
    assertHealthyPage(pageErrors, "runtime/interfaz lentos y offline pendiente");
  } finally {
    releaseMain();
    releaseUi();
    releaseStyles();
    await context.close();
  }

  for (const moduleName of ["app-text", "app-ui-polish"]) {
    const pattern = new RegExp("/" + moduleName + "\\.js\\?");
    const { context, page, pageErrors } = await createTestPage(browser, baseUrl, MOBILE_VIEWPORT,
      page => page.route(pattern, route => route.abort("failed")));
    try {
      await page.locator("#fatal-error-banner").waitFor({ state: "visible" });
      assert.match(await page.locator("#fatal-error-banner").innerText(), /No se pudieron cargar los controles/);
      assert.equal(await page.locator("#map-search-input").isVisible(), false);
      assert.equal(await page.locator("#startup-status").isVisible(), false);
      assert.equal(await page.evaluate(() => bootMetrics.completedAt), 0);
      assert.match(await page.evaluate(() => bootMetrics.steps.deferredUi.error), /module unavailable/);
      await captureStartupState(page, "tmp/startup-failed-" + moduleName + "-mobile.png");
      await page.unroute(pattern);
      await page.locator("#fatal-error-banner a").click();
      await waitForAppReady(page, { requireTiles: false });
      await submitSearch(page, "Argentina");
      await waitForCountryPanel(page, "Argentina");
      assertHealthyPage(pageErrors, moduleName + " ausente y recuperado");
    } finally {
      await context.close();
    }
  }
}

async function assertModalFrame(page, id) {
  await page.locator("#" + id).waitFor({ state: "visible" });
  const state = await page.evaluate(modalId => {
    const modal = document.getElementById(modalId);
    const dialog = modal.querySelector('[role="dialog"]');
    const box = dialog.getBoundingClientRect();
    const frame = modal.getBoundingClientRect();
    const topElement = document.elementFromPoint(box.left + box.width / 2, box.top + 20);
    return {
      fullViewport: frame.width === innerWidth && frame.height === innerHeight,
      fits: box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight,
      onTop: modal.contains(topElement), focused: modal.contains(document.activeElement)
    };
  }, id);
  for (const [key, value] of Object.entries(state)) assert.equal(value, true, id + ": " + key);
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(modalId => document.getElementById(modalId).contains(document.activeElement), id), true);
}

async function testDetailedMapUpgrade(browser, baseUrl) {
  const { context, page, pageErrors } = await createTestPage(browser, baseUrl, DESKTOP_VIEWPORT);
  let releaseGeometry;
  const held = new Promise(resolve => { releaseGeometry = resolve; });
  let detailRequests = 0;
  try {
    await waitForAppReady(page);
    await waitForMapMode(page, "3d");
    assert.match(await page.evaluate(() => activeGeoJsonPath), /simplified/, "el arranque no necesita geometria detallada");
    // Isolate geometry replacement from the independently tested automatic 2D fallback.
    await page.locator("#map-toolbar > summary").click();
    await page.locator("#quality-preset-select").selectOption("balanced");
    await page.locator("#map-toolbar > summary").click();
    await page.route("**/data/world_countries.geo.json*", async route => {
      detailRequests += 1;
      await held;
      await route.continue();
    });
    await page.evaluate(() => {
      setCountrySelection(countryLayers.get("ESP"));
      window.__overlayBefore = { source: activeGeoJsonDataSource, handler: activeClickHandler, layer: selectedLayer };
      window.__cameraMoves = [];
      for (const eventName of ["moveStart", "moveEnd"]) viewer.camera[eventName].addEventListener(() => {
        window.__cameraMoves.push({ eventName, at: performance.now(), position: Cesium.Cartesian3.clone(viewer.camera.positionWC), scale: viewer.resolutionScale });
        window.__cameraMoves = window.__cameraMoves.slice(-12);
      });
    });
    await focusCountryFor3dPick(page, "ESP");
    await page.waitForFunction(() => Boolean(loadMapPromise) && loadMapPath.endsWith("/world_countries.geo.json"), undefined, { timeout: APP_TIMEOUT_MS });
    assert.equal(await page.evaluate(() => activeGeoJsonDataSource === window.__overlayBefore.source &&
      activeClickHandler === window.__overlayBefore.handler && selectedLayer === window.__overlayBefore.layer), true,
    "la capa anterior y la seleccion deben seguir activas mientras llega el detalle");
    await page.evaluate(() => {
      window.__overlayBefore.position = Cesium.Cartesian3.clone(viewer.camera.positionWC);
      window.__overlayBefore.direction = Cesium.Cartesian3.clone(viewer.camera.directionWC);
      window.__overlayBefore.sources = viewer.dataSources.length;
    });
    releaseGeometry();
    await page.waitForFunction(() => !loadMapPromise && activeGeoJsonPath.endsWith("/world_countries.geo.json"), undefined, { timeout: APP_TIMEOUT_MS });
    const result = await page.evaluate(() => ({
      moved: Cesium.Cartesian3.distance(viewer.camera.positionWC, window.__overlayBefore.position),
      turned: Cesium.Cartesian3.distance(viewer.camera.directionWC, window.__overlayBefore.direction),
      selected: selectedLayer === countryLayers.get("ESP") && selectedLayer !== window.__overlayBefore.layer,
      highlighted: selectedLayer.currentStyleKey.includes(COUNTRY_HIGHLIGHT_STYLE.fillColor),
      oldRemoved: !viewer.dataSources.contains(window.__overlayBefore.source),
      oldHandlerDestroyed: window.__overlayBefore.handler.isDestroyed(),
      sameCount: viewer.dataSources.length === window.__overlayBefore.sources
    }));
    assert.ok(result.moved < 1 && result.turned < 0.000001, "la mejora de detalle no debe cambiar encuadre ni orientacion");
    for (const key of ["selected", "highlighted", "oldRemoved", "oldHandlerDestroyed", "sameCount"]) assert.equal(result[key], true, key);
    assert.equal(detailRequests, 1, "el detalle debe solicitarse una sola vez y bajo demanda");
    await page.evaluate(() => { clearSelection(); requestSceneRender(); });
    await clickCountryOnMap(page, "ESP");
    await page.waitForFunction(() => currentPanelState?.code === "ESP" && !document.getElementById("country-modal").hidden);
    await closeCountryPanel(page);
    await page.screenshot({ path: "tmp/map-detail-desktop.png" });
    assertHealthyPage(pageErrors, "detalle progresivo");
  } catch (error) {
    console.error("Estado de detalle:", await page.evaluate(() => ({
      mode: currentMapMode, zoom: get3DZoomBucket(), height: viewer?.camera.positionCartographic.height,
      moving: isCameraNavigating, timer: detailedOverlayUpgradeTimer, path: loadMapPath,
      activePath: activeGeoJsonPath, loading: Boolean(loadMapPromise), idleMs: Date.now() - lastInteractionAt, moves: window.__cameraMoves
    })).catch(() => null));
    throw error;
  } finally {
    releaseGeometry();
    await context.close();
  }
}

async function assertAntialiasingProfile(page) {
  const state = await page.evaluate(() => {
    const preset = getPerformancePreset();
    return { mode: currentMapMode, quality: qualityPreset, actualMsaa: viewer.scene.msaaSamples,
      expectedMsaa: preset.msaaSamples, actualFxaa: viewer.scene.postProcessStages.fxaa.enabled,
      expectedFxaa: preset.enableFxaa };
  });
  assert.equal(state.actualMsaa, state.expectedMsaa, `MSAA: ${state.mode}/${state.quality}`);
  assert.equal(state.actualFxaa, state.expectedFxaa, `FXAA: ${state.mode}/${state.quality}`);
  if (["auto", "balanced"].includes(state.quality) && state.actualFxaa) {
    assert.equal(state.actualMsaa, 1, "el perfil automatico/balanceado no duplica suavizado");
  }
}

async function testReducedMapMotion(browser, baseUrl) {
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    const mobile = viewport === MOBILE_VIEWPORT;
    const label = mobile ? "mobile" : "desktop";
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(() => {
        localStorage.setItem("geo-risk-auto-rotate", "true");
        localStorage.setItem("geo-risk-quality-preset", "performance");
      });
    });
    const { page } = test;
    try {
      await waitForAppReady(page);
      assert.equal(await page.evaluate(() => autoRotateEnabled), false);
      assert.equal(await page.locator("#auto-rotate-button").getAttribute("aria-pressed"), "false");
      assert.equal(await page.evaluate(() => localStorage.getItem("geo-risk-auto-rotate")), "true",
        "el sistema no borra la preferencia de rotacion guardada");
      await page.evaluate(() => {
        window.__motionDurations = [];
        for (const [target, method] of [[viewer.camera, "flyTo"], [viewer.scene, "morphTo2D"], [viewer.scene, "morphTo3D"]]) {
          const original = target[method];
          target[method] = function (...args) {
            window.__motionDurations.push({ method, duration: method === "flyTo" ? args[0].duration : args[0] });
            return original.apply(this, args);
          };
        }
      });
      const initialMode = mobile ? "2d" : "3d";
      const alternateMode = mobile ? "3d" : "2d";
      await setMapMode(page, alternateMode);
      await setMapMode(page, initialMode);
      const before = await page.locator("#map canvas").screenshot();
      await page.evaluate(() => {
        window.__motionCompletions = 0;
        focusRectangle(countryLayers.get("ESP").getBounds(), { onComplete: () => window.__motionCompletions++ });
      });
      await page.waitForFunction(() => window.__motionCompletions === 1);
      const durations = await page.evaluate(() => window.__motionDurations);
      assert.ok(durations.some(item => item.method === "flyTo"));
      assert.ok(durations.some(item => item.method === "morphTo2D"));
      assert.ok(durations.some(item => item.method === "morphTo3D"));
      assert.ok(durations.every(item => item.duration === 0), "sin animaciones de camara con movimiento reducido");
      await clickCountryOnMap(page, "ESP");
      await waitForCountryPanel(page, "Espa");
      assert.equal(before.equals(await page.locator("#map canvas").screenshot()), false, "el canvas cambia y permite abrir ficha");
      await page.screenshot({ path: `tmp/reduced-motion-${label}.png` });
      await closeCountryPanel(page);

      const toggle = page.locator(mobile ? "#toggle-tools-panel" : "#map-toolbar > summary");
      await toggle.click();
      await page.locator("#auto-rotate-button").click();
      await toggle.click();
      await waitForMapMode(page, "3d");
      await page.waitForFunction(() => autoRotation.isRotating(), undefined, { timeout: 12000 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.waitForFunction(() => !mapMotionPreference.matches);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForFunction(() => !autoRotateEnabled && !autoRotation.isRotating());
      assert.equal(await page.locator("#auto-rotate-button").getAttribute("aria-pressed"), "false");
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.waitForFunction(() => !mapMotionPreference.matches);
      assert.equal(await page.evaluate(() => autoRotateEnabled), false, "no reanudar sin un clic nuevo");
      // Use a long flight so changing the OS preference catches an active tween even on CI.
      await page.evaluate(() => viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(110, 30, 4500000),
        duration: 10, complete: () => window.__motionCompletions++ }));
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForFunction(() => window.__motionCompletions === 2);
      assert.equal(await page.evaluate(() => viewer.camera._currentFlight == null), true);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.waitForFunction(() => !mapMotionPreference.matches);
      await page.evaluate(() => {
        const morph = viewer.scene.morphTo2D;
        viewer.scene.morphTo2D = function () { return morph.call(this, 10); };
        applyMapMode("2d");
        viewer.scene.morphTo2D = morph;
      });
      assert.equal(await page.evaluate(() => viewer.scene.mode === Cesium.SceneMode.MORPHING), true);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await waitForMapMode(page, "2d");
      assert.equal(await page.evaluate(() => cancelPendingMapTransition), null);
      assertHealthyPage(test.pageErrors, label + " movimiento reducido");
    } catch (error) {
      console.error("Reduced motion failed:", label, await page.evaluate(() => {
        const button = document.getElementById("map-mode-toggle");
        const style = getComputedStyle(button);
        return { visibility: document.visibilityState, classes: document.body.className,
          button: { display: style.display, visibility: style.visibility, disabled: button.disabled, rect: button.getBoundingClientRect().toJSON() },
          mode: currentMapMode, navigating: isCameraNavigating, labels: labelEntities.length,
          hiddenLabels: hiddenLabelEntities.length, recovery: viewer.__geoRiskRenderRecovery.getState(), errors: window.__geoRiskCspViolations };
      }).catch(() => null));
      throw error;
    } finally {
      await test.context.close();
    }
  }
}

async function assertMapSelectionStyles(page, code = "ESP", peerCode = "ARG") {
  await waitForStable3dMap(page);
  const result = await page.evaluate(({ code, peerCode }) => {
    const layer = countryLayers.get(code);
    const peer = countryLayers.get(peerCode);
    const entity = layer.entities.find(entity => entity.polygon && entity.polyline);
    const matches = style => {
      const time = Cesium.JulianDate.now();
      return entity.polygon.material.getValue(time).color.equals(cssColorToCesiumColor(style.fillColor, style.fillOpacity)) &&
        entity.polyline.material.getValue(time).color.equals(cssColorToCesiumColor(style.color, 1));
    };
    const refreshes = [];
    const unchangedRefresh = () => {
      const material = entity.polygon.material;
      let notifications = 0;
      const removeListener = entity.polygon.definitionChanged.addEventListener(() => { notifications += 1; });
      try {
        lastStyleRefreshSignature = "";
        refreshCountryStyles();
        refreshes.push({ mode: selectionMode, performed: Boolean(lastStyleRefreshSignature), notifications,
          sameMaterial: material === entity.polygon.material });
      } finally { removeListener(); }
    };
    setCountrySelection([layer]);
    setContinentSelection([layer, peer]);
    const countryToContinent = matches(CONTINENT_HIGHLIGHT_STYLE);
    unchangedRefresh();
    setCountrySelection([layer]);
    const continentToCountry = matches(COUNTRY_HIGHLIGHT_STYLE);
    unchangedRefresh();
    selectCountryGroupLayers([countriesData[code], countriesData[peerCode]], { mode: "religion", focusMap: false });
    unchangedRefresh();
    setContinentSelection([layer, peer]);
    const religionToContinent = matches(CONTINENT_HIGHLIGHT_STYLE);
    clearSelection();
    const cleared = matches(getCountryThemeStyle(code));
    setCountrySelection([layer]);
    return { countryToContinent, continentToCountry, religionToContinent, cleared, refreshes, mode: currentMapMode };
  }, { code, peerCode });
  for (const field of ["countryToContinent", "continentToCountry", "religionToContinent", "cleared"]) {
    assert.equal(result[field], true, "real Cesium " + result.mode + " preserves current selection style: " + field);
  }
  for (const refresh of result.refreshes) {
    assert.equal(refresh.performed, true, "style refresh must really run, not hide behind the navigation guard");
    assert.equal(refresh.notifications, 0, "unchanged selected " + refresh.mode + " does not notify Cesium again");
    assert.equal(refresh.sameMaterial, true, "unchanged selected fills keep their material identity");
  }
  console.log("selection-styles: " + page.viewportSize().width + " " + result.mode + " current highlights; 0 redundant notifications");
  if ((page.viewportSize().width === 390 && result.mode === "2d") ||
      (page.viewportSize().width === 1440 && result.mode === "3d")) {
    await page.screenshot({ path: "tmp/selection-styles-" + page.viewportSize().width + "-" + result.mode + ".png" });
  }
}

async function assertThematicLabelOrder(page) {
  const result = await page.evaluate(() => {
    const ordered = ["religion", "system", "organization", "history-type", "origin", "rival"].every(name => {
      const labels = [...document.getElementById("filter-" + name + "-select").options].slice(1).map(option => option.textContent);
      return labels.every((label, index) => !index || labels[index - 1].localeCompare(label, "es") <= 0) &&
        new Set(labels.map(normalizeText)).size === labels.length;
    });
    const repeated = getUniqueDisplayLabels(["Islam", "islam", "Cristianismo", "Budismo"]);
    return { ordered, repeated, collators: window.__spanishCollators ?? null };
  });
  assert.equal(result.ordered, true, "the six rendered thematic lists keep Spanish order without normalized duplicates");
  assert.deepEqual(result.repeated, ["Budismo", "Cristianismo", "Islam"]);
  if (result.collators !== null) assert.equal(result.collators, 1, "rendered lists and later label sorting reuse one collator");
}

async function testGreenCoding(browser, baseUrl) {
  const { context, page, pageErrors } = await createTestPage(browser, baseUrl, DESKTOP_VIEWPORT, async page => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } });
      window.__spanishCollators = 0;
      const NativeCollator = Intl.Collator;
      Intl.Collator = class extends NativeCollator {
        constructor(...args) {
          super(...args);
          if (args[0] === "es") window.__spanishCollators += 1;
        }
      };
      window.__greenIntervals = new Map();
      const start = window.setInterval.bind(window);
      const stop = window.clearInterval.bind(window);
      window.setInterval = (callback, delay, ...args) => {
        const id = start(callback, delay, ...args);
        window.__greenIntervals.set(id, { name: callback.name, delay });
        return id;
      };
      window.clearInterval = id => { window.__greenIntervals.delete(id); stop(id); };
    });
  });
  let detailRequests = 0;
  page.on("request", request => { if (/\/world_countries\.geo\.json/.test(request.url())) detailRequests += 1; });
  try {
    await waitForAppReady(page);
    await assertThematicLabelOrder(page);
    await waitForStable3dMap(page);
    await page.waitForFunction(() => !isCameraNavigating);
    const polls = name => page.evaluate(name => [...window.__greenIntervals.values()].filter(item => item.name === name).length, name);
    assert.equal(await polls("sample"), 0, "FPS en reposo no tiene intervalo activo");
    assert.equal(await polls("checkLoop"), 1, "el watchdog visible conserva deteccion de fallos");
    const prepared = await page.evaluate(() => [...preparedGeoJsonCache.keys()]);
    assert.ok(prepared.length > 0);
    assert.ok(prepared.every(key => key.endsWith("::3d")), "no preparar el modo alternativo no solicitado");
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    assert.equal(await polls("sample"), 0);
    assert.equal(await polls("checkLoop"), 0, "segundo plano simulado cancela el watchdog");
    await page.evaluate(() => {
      delete document.visibilityState;
      document.dispatchEvent(new Event("visibilitychange"));
      document.dispatchEvent(new Event("visibilitychange"));
    });
    assert.equal(await polls("checkLoop"), 1, "reanudar no duplica el watchdog");
    await focusCountryFor3dPick(page, "ESP");
    await page.waitForFunction(() => get3DZoomBucket() === "near" && !isCameraNavigating);
    await page.evaluate(() => scheduleDetailedOverlayUpgrade());
    assert.equal(await page.evaluate(() => detailedOverlayUpgradeTimer), null);
    assert.match(await page.evaluate(() => activeGeoJsonPath), /simplified/);
    assert.equal(detailRequests, 0, "Save-Data evita descargar geometria detallada al acercarse");
    await clickCountryOnMap(page, "ESP");
    await waitForCountryPanel(page, "Espa");
    await closeCountryPanel(page);
    await page.evaluate(() => applyMapMode("2d", false));
    await waitForMapMode(page, "2d");
    await assertMapSelectionStyles(page);
    const idleHover = await page.evaluate(() => {
      const originalRender = requestSceneRender;
      const originalPick = viewer.scene.pick;
      const result = { enabled: shouldUseHoverHighlights(), renders: 0, picks: 0 };
      try {
        requestSceneRender = () => { result.renders += 1; };
        viewer.scene.pick = () => { result.picks += 1; };
        const move = activeClickHandler.getInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        for (let i = 0; i < 100; i++) move({ endPosition: new Cesium.Cartesian2(i, i) });
        return result;
      } finally {
        requestSceneRender = originalRender;
        viewer.scene.pick = originalPick;
      }
    });
    assert.deepEqual(idleHover, { enabled: false, renders: 0, picks: 0 }, "real 2D hover handler stays idle without highlights");
    await page.evaluate(() => applyMapMode("3d", false));
    await waitForMapMode(page, "3d");
    await assertMapSelectionStyles(page);
    assert.equal(detailRequests, 0);
    assertHealthyPage(pageErrors, "green coding y ahorro de datos");
  } finally {
    await context.close();
  }
}

async function testIdleMapPerformance(browser, baseUrl) {
  let releaseTiles;
  let requests = 0;
  const held = new Promise(resolve => { releaseTiles = resolve; });
  const { context, page, pageErrors } = await createTestPage(browser, baseUrl, DESKTOP_VIEWPORT, async page => {
    await page.addInitScript(() => {
      const postTask = scheduler.postTask.bind(scheduler);
      scheduler.postTask = (callback, options) => options?.priority === "background"
        ? new Promise(() => {}) : postTask(callback, options);
    });
    await page.route("https://services.arcgisonline.com/**/tile/**", async route => {
      requests += 1;
      await held;
      await route.continue();
    });
  });
  try {
    await waitForAppReady(page, { requireTiles: false });
    await waitForStable3dMap(page);
    const snapshot = () => page.evaluate(() => ({
      mode: currentMapMode, samples: startupFpsMetrics.samples,
      pending: !viewer.scene.globe.tilesLoaded, navigating: isCameraNavigating,
      degradations: mapDegradationLog.list().filter(item => /FPS/i.test(item.reason)).length
    }));
    const before = await snapshot();
    assert.equal(before.mode, "3d");
    assert.equal(before.pending, true);
    await page.waitForTimeout(15000);
    const after = await snapshot();
    assert.ok(requests > 0, "la prueba debe retener imagenes reales de Cesium");
    assert.equal(after.pending, true);
    assert.equal(after.navigating, false);
    assert.equal(after.mode, "3d", "esperar imagenes no debe cambiar a 2D");
    assert.equal(after.samples, before.samples, "un mapa quieto no produce muestras de FPS activos");
    assert.equal(after.degradations, before.degradations, "la red lenta no reduce calidad por FPS");
    releaseTiles();
    await page.waitForFunction(() => viewer.scene.globe.tilesLoaded, undefined, { timeout: APP_TIMEOUT_MS });
    assertHealthyPage(pageErrors, "mapa quieto con imagenes demoradas");
  } finally {
    releaseTiles();
    await context.close();
  }
}

async function testRenderRecovery(browser, baseUrl) {
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    const label = viewport.width > 820 ? "desktop" : "mobile";
    const { context, page, pageErrors } = await createTestPage(browser, baseUrl, viewport);
    try {
      await waitForAppReady(page);
      await page.waitForFunction(() => !isCameraNavigating);
      await page.evaluate(() => {
        setCountrySelection(countryLayers.get("ESP"));
        window.__renderFixture = {
          remaining: 1, frames: 0, errors: [],
          scale: viewer.resolutionScale, detail: viewer.scene.globe.maximumScreenSpaceError,
          mode: currentMapMode, selection: selectedLayer,
          position: Cesium.Cartesian3.clone(viewer.camera.position),
          direction: Cesium.Cartesian3.clone(viewer.camera.direction)
        };
        const fixture = window.__renderFixture;
        viewer.scene.renderError.addEventListener((_scene, error) => {
          fixture.errors.push({ message: error.message, running: viewer.useDefaultRenderLoop });
        });
        viewer.scene.postRender.addEventListener(() => { fixture.frames += 1; });
        viewer.scene.primitives.add({
          update() {
            if (fixture.remaining > 0) {
              fixture.remaining -= 1;
              throw new Error("GeoRisk fixture primitive failure");
            }
          },
          isDestroyed() { return false; }, destroy() {}
        });
        viewer.scene.requestRender();
      });
      await page.waitForFunction(() => viewer.__geoRiskRenderRecovery.getState().phase === "recovered");
      const result = await page.evaluate(() => ({
        errors: window.__renderFixture.errors,
        sameScale: viewer.resolutionScale === window.__renderFixture.scale,
        sameDetail: viewer.scene.globe.maximumScreenSpaceError === window.__renderFixture.detail,
        sameMode: currentMapMode === window.__renderFixture.mode,
        sameSelection: selectedLayer === window.__renderFixture.selection,
        samePosition: Cesium.Cartesian3.equalsEpsilon(viewer.camera.position, window.__renderFixture.position, 0, 0.01),
        sameDirection: Cesium.Cartesian3.equalsEpsilon(viewer.camera.direction, window.__renderFixture.direction, 0, 0.00001),
        state: viewer.__geoRiskRenderRecovery.getState(),
        log: mapDegradationLog.list().filter(entry => entry.reason === "render-recovery")
      }));
      assert.deepEqual(result.errors, [{ message: "GeoRisk fixture primitive failure", running: false }]);
      assert.equal(result.state.attempts, 1);
      for (const key of ["sameScale", "sameDetail", "sameMode", "sameSelection", "samePosition", "sameDirection"]) {
        assert.equal(result[key], true, label + " " + key);
      }
      assert.ok(result.log.some(entry => entry.phase === "recovered" && entry.error === "GeoRisk fixture primitive failure"));
      assert.equal(await page.locator(".cesium-widget-errorPanel").count(), 0);
      const before = await page.locator("#map canvas").screenshot();
      const previousFrames = await page.evaluate(() => {
        const frames = window.__renderFixture.frames;
        if (currentMapMode === "2d") viewer.camera.moveRight(600000);
        else viewer.camera.rotateRight(0.2);
        viewer.scene.requestRender();
        return frames;
      });
      await page.waitForFunction(frames => window.__renderFixture.frames > frames, previousFrames);
      const after = await page.locator("#map canvas").screenshot({ path: "tmp/map-recovered-" + label + ".png" });
      assert.equal(before.equals(after), false, label + " debe producir pixeles distintos tras mover la camara recuperada");

      await page.evaluate(() => { window.__renderFixture.remaining = Infinity; viewer.scene.requestRender(); });
      await page.locator("#fatal-error-banner").waitFor({ state: "visible" });
      assert.match(await page.locator("#fatal-error-banner").innerText(), /El mapa dejo de dibujarse/);
      assert.equal(await page.evaluate(() => viewer.__geoRiskRenderRecovery.getState().phase), "failed");
      const stoppedFrames = await page.evaluate(() => window.__renderFixture.frames);
      await page.waitForTimeout(1100);
      assert.equal(await page.evaluate(() => window.__renderFixture.frames), stoppedFrames, "no reintentar indefinidamente un error persistente");
      assert.equal(await page.evaluate(() => viewer.useDefaultRenderLoop), false);
      await page.screenshot({ path: "tmp/map-render-failed-" + label + ".png" });
      await page.locator("#fatal-error-banner a").click();
      await waitForAppReady(page);
      assert.equal(await page.evaluate(() => viewer.__geoRiskRenderRecovery.getState().attempts), 0);

      // Exercise the widget's outer catch, which does not emit scene.renderError.
      await page.evaluate(() => {
        const widget = viewer.cesiumWidget;
        const render = widget.render;
        widget.render = function () { this.render = render; throw new Error("GeoRisk fixture widget failure"); };
        viewer.scene.requestRender();
      });
      await page.waitForFunction(() => viewer.__geoRiskRenderRecovery.getState().phase === "recovered");
      assert.equal(await page.evaluate(() => mapDegradationLog.list().some(entry => entry.error === "Render loop stopped")), true);
      await submitSearch(page, "Argentina");
      await waitForCountryPanel(page, "Argentina");
      await closeCountryPanel(page);
      const contextLossSupported = await page.evaluate(() => {
        const canvas = viewer.scene.canvas;
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        const extension = gl?.getExtension("WEBGL_lose_context");
        if (!extension) return false;
        extension.loseContext();
        return true;
      });
      assert.ok(contextLossSupported, "Chromium de prueba debe permitir simular la perdida de contexto");
      await page.waitForFunction(() => viewer.__geoRiskRenderRecovery.getState().phase === "failed");
      assert.equal(await page.evaluate(() => viewer.useDefaultRenderLoop), false);
      assert.equal(await page.locator("#fatal-error-banner a").isVisible(), true);
      assertHealthyPage(pageErrors, "recuperacion " + label);
    } finally {
      await context.close();
    }
  }
}

async function testRequiredStartupData(browser, baseUrl) {
  for (const [name, pattern] of [
    ["index", /\/data\/countries_index\.json\?/],
    ["geometry", /\/data\/world_countries_simplified\.geo\.json\?/]
  ]) {
    const startedAt = Date.now();
    const trace = phase => console.log("required-startup-data: " + name + " " + phase + " " + (Date.now() - startedAt) + "ms");
    let releaseIndex;
    const heldIndex = new Promise(resolve => { releaseIndex = resolve; });
    const slow = await createTestPage(browser, baseUrl, MOBILE_VIEWPORT, async page => {
      await page.route(pattern, async route => { await heldIndex; await route.continue(); });
    });
    try {
      trace("domcontentloaded");
      await slow.page.waitForFunction(() => typeof bootMetrics !== "undefined" && bootMetrics.steps.mapBootReady?.end,
        undefined, { timeout: 10000 });
      trace("map-ready");
      assert.equal(await slow.page.locator("#map-search-input").isVisible(), false, "no habilitar controles mientras faltan los paises");
      assert.equal(await slow.page.locator("#startup-status").isVisible(), true);
      assert.equal(await slow.page.evaluate(() => bootMetrics.completedAt), 0);
      await slow.page.evaluate(() => { window.__pendingCamera = Cesium.Cartesian3.clone(viewer.camera.position); });
      await slow.page.mouse.move(150, 420);
      await slow.page.mouse.down();
      await slow.page.mouse.move(240, 420);
      await slow.page.mouse.up();
      await slow.page.waitForFunction(() => Cesium.Cartesian3.distance(viewer.camera.position, window.__pendingCamera) > 10,
        undefined, { timeout: 5000 });
      trace("dragged");
      assert.equal(await slow.page.evaluate(() => bootMetrics.completedAt), 0);
      assert.equal(await slow.page.locator("#fatal-error-banner").isVisible(), false, "el caso lento no debe convertirse en el caso timeout");
      // Capturing WebGL can be slow in CI; do not include it in the held response.
      releaseIndex();
      await waitForAppReady(slow.page);
      trace("ready");
      await captureStartupState(slow.page, "tmp/startup-" + name + "-recovered-mobile.png");
      await submitSearch(slow.page, "Argentina");
      await waitForCountryPanel(slow.page, "Argentina");
      assertHealthyPage(slow.pageErrors, name + " inicial lento");
    } catch (error) {
      console.error("Required startup data failed:", name, await slow.page.evaluate(() => ({
        now: performance.now(), boot: typeof bootMetrics !== "undefined" ? bootMetrics.steps : null,
        fatal: document.getElementById("fatal-error-banner")?.textContent,
        engine: window.GeoRiskMapEngine?.getState()
      })).catch(() => null), slow.pageErrors);
      throw error;
    } finally {
      releaseIndex();
      await slow.context.close();
    }
  }

  const failures = [
    { name: "index-http", pattern: /\/data\/countries_index\.json\?/, status: 503, body: "{}" },
    { name: "index-empty", pattern: /\/data\/countries_index\.json\?/, status: 200, body: "{}" },
    { name: "aliases-http", pattern: /\/data\/geo_aliases\.json\?/, status: 503, body: "{}" },
    { name: "geometry-http", pattern: /\/data\/world_countries_simplified\.geo\.json\?/, status: 503, body: "{}" },
    { name: "geometry-empty", pattern: /\/data\/world_countries_simplified\.geo\.json\?/, status: 200, body: '{"type":"FeatureCollection","features":[]}' },
    { name: "index-timeout", pattern: /\/data\/countries_index\.json\?/, timeout: true }
  ];
  for (const fixture of failures) {
    console.log("required-startup-data: " + fixture.name);
    const requests = [];
    let releaseLate;
    const late = new Promise(resolve => { releaseLate = resolve; });
    const failed = await createTestPage(browser, baseUrl, MOBILE_VIEWPORT, async page => {
      page.on("request", request => requests.push(request.url()));
      await page.route(fixture.pattern, async route => {
        if (fixture.timeout) { await late; await route.continue(); }
        else await route.fulfill({ status: fixture.status, contentType: "application/json", body: fixture.body });
      });
    });
    try {
      await failed.page.locator("#fatal-error-banner").waitFor({ state: "visible", timeout: APP_TIMEOUT_MS });
      assert.equal(await failed.page.locator("#map-search-input").isVisible(), false, fixture.name);
      assert.equal(await failed.page.locator("#startup-status").isVisible(), false);
      assert.equal(await failed.page.evaluate(() => bootMetrics.completedAt), 0);
      assert.doesNotMatch(await failed.page.locator("#fatal-error-banner").innerText(), /\.json|\?v=/, "el aviso debe explicar el fallo sin mostrar rutas internas");
      assert.equal(await failed.page.locator("#fatal-error-banner").evaluate(element => element.scrollWidth <= element.clientWidth), true);
      assert.ok(!requests.some(url => /countries_full|conflict_details\.generated/.test(url)), "un fallo no habilita monolitos pesados");
      await failed.page.screenshot({ path: "tmp/startup-failed-" + fixture.name + "-mobile.png" });
      if (fixture.timeout) {
        assert.match(await failed.page.locator("#fatal-error-banner").innerText(), /tardando demasiado/);
        releaseLate();
        await failed.page.waitForFunction(() => bootMetrics.steps.loadData?.end);
        assert.equal(await failed.page.evaluate(() => bootMetrics.completedAt), 0, "una llegada tardia no habilita una interfaz ya fallida");
        assert.equal(await failed.page.locator("#map-search-input").isVisible(), false);
      }
      await failed.page.unroute(fixture.pattern);
      await failed.page.locator("#fatal-error-banner a").click();
      await waitForAppReady(failed.page);
      await submitSearch(failed.page, "Argentina");
      await waitForCountryPanel(failed.page, "Argentina");
      assertHealthyPage(failed.pageErrors, fixture.name + " y recarga");
    } finally {
      releaseLate();
      await failed.context.close();
    }
  }
}

async function testDeferredWorkDuringDrag(browser, baseUrl) {
  for (const [label, viewport] of [["desktop", DESKTOP_VIEWPORT], ["mobile", MOBILE_VIEWPORT]]) {
    const test = await createTestPage(browser, baseUrl, viewport);
    const { page } = test;
    try {
      await waitForAppReady(page);
      await page.waitForFunction(() => !isCameraNavigating && navigationQualityRestoreTimer === null);
      const adaptiveQuality = await page.evaluate(() => {
        const preset = getPerformancePreset();
        const stable = { maximumScreenSpaceError: preset.maximumScreenSpaceError + 2.3,
          tileCacheSize: Math.max(1, preset.tileCacheSize - 14),
          loadingDescendantLimit: Math.max(1, preset.loadingDescendantLimit - 1) };
        Object.assign(viewer.scene.globe, stable);
        reducedPerformanceMode = true;
        reducedPerformanceReason = "navigation-quality-fixture";
        viewer.scene.requestRender();
        return stable;
      });
      await page.evaluate(() => { window.__originalIdleCallback = window.requestIdleCallback; });
      for (const idleSupported of [true, false]) {
        console.log("deferred-drag: " + label + " idle=" + idleSupported);
        await page.evaluate(supported => {
          window.requestIdleCallback = supported ? window.__originalIdleCallback : undefined;
          window.__quietTaskRuns = [];
        }, idleSupported);
        const x = viewport.width * 0.52;
        const y = viewport.height * 0.52;
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.evaluate(() => { window.__dragStartPosition = Cesium.Cartesian3.clone(viewer.camera.position); });
        await page.mouse.move(x + 25, y + 5, { steps: 1 });
        await page.waitForFunction(() => autoRotation.hasActivePointers() &&
          Cesium.Cartesian3.distance(viewer.camera.position, window.__dragStartPosition) > 10,
        undefined, { timeout: 3000 });
        await page.evaluate(() => {
          window.__cancelQuietProbe = scheduleWhenGlobeIsQuiet(() => {
            window.__quietTaskRuns.push({ navigating: isCameraNavigating, visibility: document.visibilityState,
              pointers: autoRotation.hasActivePointers() });
          }, { delay: 0, quietFor: 100, timeout: 100 });
        });
        await page.waitForTimeout(1500);
        const heldDrag = await page.evaluate(() => ({
          pointers: autoRotation.hasActivePointers(),
          position: { x: viewer.camera.position.x, y: viewer.camera.position.y, z: viewer.camera.position.z }
        }));
        assert.equal(heldDrag.pointers, true, "mantener el contacto nativo durante la pausa");
        assert.equal(await page.evaluate(() => window.__quietTaskRuns.length), 0, "un contacto sostenido no es quietud");
        for (let step = 1; step <= 6; step += 1) {
          await page.mouse.move(x + 25 + step * 12, y + 5 + step * 3, { steps: 1 });
          await page.waitForTimeout(70);
          assert.equal(await page.evaluate(() => window.__quietTaskRuns.length), 0, label + " no debe forzar trabajo durante un arrastre mayor al deadline");
        }
        assert.equal(await page.evaluate(position => Cesium.Cartesian3.distance(viewer.camera.position, position) > 10,
          heldDrag.position), true, "los seis movimientos nativos deben seguir desplazando el globo durante el contacto");
        await page.mouse.up();
        await page.waitForFunction(() => window.__quietTaskRuns.length === 1, undefined, { timeout: 8000 });
        const runs = await page.evaluate(() => window.__quietTaskRuns);
        assert.deepEqual(runs, [{ navigating: false, visibility: "visible", pointers: false }]);
        await page.waitForTimeout(250);
        assert.equal(await page.evaluate(() => window.__quietTaskRuns.length), 1);
        await page.waitForFunction(() => navigationQualityRestoreTimer === null);
        assert.deepEqual(await page.evaluate(() => ({
          maximumScreenSpaceError: viewer.scene.globe.maximumScreenSpaceError,
          tileCacheSize: viewer.scene.globe.tileCacheSize,
          loadingDescendantLimit: viewer.scene.globe.loadingDescendantLimit
        })), adaptiveQuality, label + " arrastre real conserva las reducciones adaptativas");
      }
      const toolbarToggle = page.locator(viewport.width <= 820 ? "#toggle-tools-panel" : "#map-toolbar > summary");
      await toolbarToggle.click();
      await page.locator("#quality-preset-select").selectOption("high");
      assert.equal(await page.evaluate(() => reducedPerformanceMode), false, "calidad elegida no conserva el aviso adaptativo anterior");
      assert.equal(await page.evaluate(() => reducedPerformanceReason), "");
      await page.waitForFunction(() => {
        const preset = getPerformancePreset();
        return !isCameraNavigating && navigationQualityRestoreTimer === null &&
          viewer.resolutionScale === preset.resolutionScale &&
          viewer.scene.globe.maximumScreenSpaceError === preset.maximumScreenSpaceError &&
          viewer.scene.globe.tileCacheSize === preset.tileCacheSize &&
          viewer.scene.globe.loadingDescendantLimit === preset.loadingDescendantLimit;
      });
      await page.evaluate(() => {
        // Cesium can emit these events for internal frustum/resize changes too.
        viewer.camera.moveStart.raiseEvent();
        viewer.camera.moveEnd.raiseEvent();
      });
      if (!(await page.locator("#quality-preset-select").isVisible())) {
        console.error("quality-controls:", await page.evaluate(() => ({
          toolbarOpen: document.getElementById("map-toolbar").open,
          bodyClasses: document.body.className, navigating: isCameraNavigating,
          pointers: autoRotation.hasActivePointers()
        })));
        await page.screenshot({ path: "tmp/quality-controls-" + label + "-closed.png" });
      }
      assert.equal(await page.locator("#quality-preset-select").isVisible(), true,
        "cambiar calidad no debe cerrar los controles sin una interaccion del mapa");
      await page.locator("#quality-preset-select").selectOption("auto");
      if (viewport.width <= 820) {
        await page.mouse.move(3, viewport.height * 0.5);
        await page.mouse.down();
        await page.waitForFunction(() => !document.body.classList.contains("mobile-tools-open"));
        await page.mouse.up();
      } else await toolbarToggle.click();
      await page.screenshot({ path: "tmp/deferred-drag-" + label + ".png" });
      await submitSearch(page, "Argentina");
      await page.locator("#country-panel .country-profile").waitFor();
      assertHealthyPage(test.pageErrors, label + " scheduler con arrastre real");
    } finally {
      await page.mouse.up().catch(() => {});
      await page.evaluate(() => {
        window.__cancelQuietProbe?.();
        window.requestIdleCallback = window.__originalIdleCallback;
      }).catch(() => {});
      await test.context.close();
    }
  }
}

async function testCountryDataRecovery(browser, baseUrl) {
  for (const [label, viewport] of [["desktop", DESKTOP_VIEWPORT], ["mobile", MOBILE_VIEWPORT]]) {
    const failedModule = label === "desktop" ? "countryPanel" : "timelineConflicts";
    const failedModuleFile = label === "desktop" ? "app-country-panel.js" : "app-timeline-conflicts.js";
    const siblingFile = label === "desktop" ? "app-timeline-conflicts.js" : "app-country-panel.js";
    let moduleAttempts = 0;
    let failArgentina = true;
    let failSpain = true;
    let failConflicts = true;
    let releaseBrazil;
    const heldBrazil = new Promise(resolve => { releaseBrazil = resolve; });
    let releaseConflicts;
    const heldConflicts = new Promise(resolve => { releaseConflicts = resolve; });
    const requests = [];
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      page.on("request", request => requests.push(request.url()));
      await page.route(`**/${failedModuleFile}*`, async route => {
        moduleAttempts += 1;
        if (moduleAttempts === 1) await route.abort("internetdisconnected");
        else await route.continue();
      });
      await page.route(/\/data\/countries\/(ARG|ESP|BRA)\.json\?/, async route => {
        if (route.request().url().includes("/BRA.json")) await heldBrazil;
        if (failArgentina && route.request().url().includes("/ARG.json")) {
          await route.fulfill({ status: 503, contentType: "application/json", body: "{}" });
        } else if (failSpain && route.request().url().includes("/ESP.json")) {
          await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
        } else await route.continue();
      });
      await page.route(/\/data\/countries\/conflicts\/AUS\.json\?/, async route => {
        if (failConflicts) await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
        else {
          await heldConflicts;
          await route.continue();
        }
      });
    });
    const { page } = test;
    try {
      await waitForAppReady(page);
      const previousPanel = await page.evaluate(() => {
        const render = renderCountry;
        const probe = window.__countryModuleFailure = {
          pending: null, restore: () => { renderCountry = render; }
        };
        renderCountry = function (...args) {
          const pending = render.apply(this, args);
          probe.pending = pending;
          return pending;
        };
        return { state: JSON.stringify(currentPanelState), html: document.getElementById("country-panel").innerHTML,
          hidden: document.getElementById("country-modal").hidden };
      });
      await submitSearch(page, "Argentina");
      const moduleNotice = page.locator("#app-toast");
      await moduleNotice.filter({ hasText: "Revisa tu conexion" }).waitFor({ state: "visible" });
      await captureTransientNotice(page, moduleNotice, { path: `tmp/country-module-recovery-${label}.png` });
      const failedPanel = await page.evaluate(async () => {
        const probe = window.__countryModuleFailure;
        await probe.pending;
        probe.restore();
        delete window.__countryModuleFailure;
        return { state: JSON.stringify(currentPanelState), html: document.getElementById("country-panel").innerHTML,
          hidden: document.getElementById("country-modal").hidden };
      });
      assert.deepEqual(failedPanel, previousPanel, "failed modules preserve the previous panel and its visibility");
      assert.equal(requests.filter(url => /\/countries\/ARG\.json\?/.test(url)).length, 0,
        "a profile with unavailable interface modules must not fetch its detail");
      assert.equal(moduleAttempts, 1, "failed interface imports do not retry automatically");
      assert.equal(await page.evaluate(name => deferredUiModulePromises.has(name), failedModule), false);
      assert.equal(await page.evaluate(() => countriesData.ARG.metadata.isIndex), true);
      assert.equal(await page.evaluate(() => selectedLayers.some(layer => layer.code === "ARG")), true);
      await page.locator("#map-search-button").focus();
      await page.locator("#map-search-button").press("Enter");
      const retry = page.locator("[data-country-retry]");
      await retry.waitFor({ state: "visible" });
      assert.equal(moduleAttempts, 2, "one explicit action retries only the failed module");
      const failedModuleRequests = requests.filter(url => url.includes(`/${failedModuleFile}?`));
      assert.equal(failedModuleRequests.length, 2);
      assert.match(failedModuleRequests[1], /&retry=1$/);
      assert.equal(requests.filter(url => url.includes(`/${siblingFile}?`)).length, 1,
        "the successful sibling module must not be downloaded again");
      assert.equal(await page.locator('#country-panel [aria-busy="true"]').count(), 0);
      assert.equal(await page.evaluate(() => countriesData.ARG.metadata.isIndex), true);
      assert.equal(await page.evaluate(() => selectedLayers.some(layer => layer.code === "ARG")), true);
      const error = page.locator("#country-panel .country-load-error");
      assert.equal(await error.evaluate(element => element.scrollWidth <= element.clientWidth), true);
      const initialRetry = await retry.elementHandle();
      assert.ok(initialRetry);
      await retry.focus();
      const errorOwner = await page.evaluate(() => {
        const owner = countryPanelRenderToken;
        rerenderCurrentPanel();
        rerenderCurrentPanel();
        return owner;
      });
      await page.waitForFunction(() => rerenderCurrentPanelFrame === null);
      assert.equal(await page.evaluate(button => button.isConnected && document.activeElement === button, initialRetry), true,
        "a background refresh preserves the failed profile's retry button and keyboard focus");
      await initialRetry.dispose();
      assert.equal(await page.evaluate(() => countryPanelRenderToken), errorOwner);
      assert.equal(requests.filter(url => /\/countries\/ARG\.json\?/.test(url)).length, 1,
        "background refresh does not retry a failed profile");
      for (const language of ["en", "es"]) {
        await page.locator("#language-select").evaluate((select, language) => {
          select.value = language;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }, language);
        await page.waitForFunction(language => currentPanelState.countryLoadLanguage === language, language);
        assert.match(await error.innerText(), language === "en" ? /The profile could not be loaded/ : /No se pudo cargar la ficha/);
        assert.equal(await page.evaluate(() => countryPanelRenderToken), errorOwner);
        assert.equal(requests.filter(url => /\/countries\/ARG\.json\?/.test(url)).length, 1,
          "translating a failed profile does not download it");
      }
      const bounds = await retry.boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= viewport.width && bounds.y + bounds.height <= viewport.height);
      await page.screenshot({ path: "tmp/country-retry-" + label + ".png" });
      failArgentina = false;
      await retry.focus();
      await retry.press("Enter");
      await page.locator("#country-panel .country-profile").waitFor();
      await waitForCountryPanel(page, "Argentina");
      assert.equal(requests.filter(url => /\/countries\/ARG\.json\?/.test(url)).length, 2);
      await closeCountryPanel(page);

      await submitSearch(page, "Espana");
      await retry.waitFor({ state: "visible" });
      await closeCountryPanel(page);
      failSpain = false;
      await submitSearch(page, "Espana");
      await page.locator("#country-panel .country-profile").waitFor();
      assert.equal(await page.evaluate(() => countriesData.ESP.metadata.isIndex), false);
      await closeCountryPanel(page);

      await submitSearch(page, "Brasil");
      await page.locator('#country-panel [aria-busy="true"]').waitFor();
      const loadingOwner = await page.evaluate(() => {
        const owner = countryPanelRenderToken;
        rerenderCurrentPanel();
        return owner;
      });
      await page.waitForFunction(() => rerenderCurrentPanelFrame === null);
      assert.equal(await page.evaluate(() => countryPanelRenderToken), loadingOwner,
        "a background refresh does not replace an in-flight profile owner");
      assert.equal(requests.filter(url => /\/countries\/BRA\.json\?/.test(url)).length, 1);
      await closeCountryPanel(page);
      releaseBrazil();
      await page.waitForFunction(() => countriesData.BRA.metadata.isIndex === false);
      await page.waitForTimeout(400);
      assert.equal(await page.locator("#country-modal").isVisible(), false, "una respuesta tardia no reabre el modal cerrado");
      await submitSearch(page, "Brasil");
      await page.locator("#country-panel .country-profile").waitFor();
      assert.equal(requests.filter(url => /\/countries\/BRA\.json\?/.test(url)).length, 1, "la respuesta valida se reutiliza al volver a abrir");
      await closeCountryPanel(page);

      await submitSearch(page, "Australia");
      await page.locator("#country-panel .country-profile").waitFor();
      const preview = await page.evaluate(() => countriesData.AUS.military.conflicts.length);
      await page.locator('[data-country-nav="country-section-military"]').click();
      const retryConflicts = page.locator('.country-load-error [data-country-load-section="country-section-military"]');
      await retryConflicts.waitFor({ state: "visible", timeout: APP_TIMEOUT_MS });
      assert.equal(await page.evaluate(() => countriesData.AUS.military.conflicts.length), preview);
      assert.equal(await page.evaluate(() => countriesData.AUS.military.conflictsComplete), false);
      failConflicts = false;
      const retriedRequest = page.waitForRequest(/\/data\/countries\/conflicts\/AUS\.json\?/);
      await retryConflicts.click();
      await retriedRequest;
      // Replace the same profile while its valid retry is still in flight.
      const oldRetry = await retryConflicts.elementHandle();
      assert.ok(oldRetry);
      await page.evaluate(() => rerenderCurrentPanel());
      await page.waitForFunction(element => !element.isConnected, oldRetry);
      await oldRetry.dispose();
      releaseConflicts();
      await page.waitForFunction(() => countriesData.AUS.military.conflictsComplete === true);
      await retryConflicts.waitFor({ state: "hidden" });
      assert.equal(await page.locator("#country-modal").isVisible(), true);
      assert.equal(await page.evaluate(() => currentPanelState.code), "AUS");
      assert.equal(await page.locator("#country-section-military").evaluate(section => section.open), true);
      assert.ok(await page.locator("#country-section-military [data-conflict-key]").count() > 0);
      assert.equal(requests.filter(url => /\/countries\/conflicts\/AUS\.json\?/.test(url)).length, 2);
      assert.ok(await page.evaluate(count => countriesData.AUS.military.conflicts.length > count, preview));

      await closeCountryPanel(page);
      await page.evaluate(() => {
        const original = ensureDeferredUiModule;
        let release;
        const held = new Promise(resolve => { release = resolve; });
        const probe = window.__countryOwnerProbe = {
          release, restore: () => { ensureDeferredUiModule = original; }, entered: false
        };
        ensureDeferredUiModule = async name => {
          if (name === "countryPanel") { probe.entered = true; await held; }
          return original(name);
        };
        probe.pending = renderCountry(countriesData.ARG, "Argentina");
      });
      await page.waitForFunction(() => window.__countryOwnerProbe.entered);
      await submitSearch(page, "Europa");
      await page.waitForFunction(() => currentPanelState.type === "continent");
      const selectedCodes = await page.evaluate(() => selectedLayers.map(layer => layer.code).sort());
      assert.ok(selectedCodes.length > 0 && !selectedCodes.includes("ARG"));
      await page.evaluate(async () => {
        const probe = window.__countryOwnerProbe;
        probe.restore();
        probe.release();
        await probe.pending;
        delete window.__countryOwnerProbe;
      });
      assert.equal(await page.evaluate(() => currentPanelState.type), "continent", "late country modules preserve the latest continent selection");
      assert.match(await page.locator("#country-panel h2").first().innerText(), /Europa/);
      assert.equal(await page.locator("#country-panel .country-profile").count(), 0);
      assert.deepEqual(await page.evaluate(() => selectedLayers.map(layer => layer.code).sort()), selectedCodes);
      await page.screenshot({ path: "tmp/country-owner-" + label + ".png" });
      await closeCountryPanel(page);

      await submitSearch(page, "Australia");
      await page.locator("#country-panel .country-profile").waitFor();
      await page.locator('[data-country-nav="country-section-military"]').click();
      await page.waitForFunction(() => document.getElementById("country-section-military")?.open === true);
      await page.evaluate(() => {
        const original = ensureConflictAliasesLoaded;
        let release;
        const held = new Promise(resolve => { release = resolve; });
        const probe = window.__countryOwnerProbe = {
          release, restore: () => { ensureConflictAliasesLoaded = original; }, entered: false,
          counters: [conflictModalCounter, timelineModalCounter]
        };
        ensureConflictAliasesLoaded = async () => { probe.entered = true; await held; return original(); };
        probe.pending = renderCountry(countriesData.AUS, "Australia");
      });
      await page.waitForFunction(() => window.__countryOwnerProbe.entered);
      await closeCountryPanel(page);
      const staleCounters = await page.evaluate(async () => {
        const probe = window.__countryOwnerProbe;
        probe.restore();
        probe.release();
        await probe.pending;
        const result = { before: probe.counters, after: [conflictModalCounter, timelineModalCounter] };
        delete window.__countryOwnerProbe;
        return result;
      });
      assert.equal(await page.locator("#country-modal").isVisible(), false, "late aliases do not reopen a closed full profile");
      assert.deepEqual(staleCounters.after, staleCounters.before, "discard stale rendering before registering any timeline/conflict links");
      assert.equal(requests.filter(url => /\/countries\/ARG\.json\?/.test(url)).length, 2);
      assert.equal(requests.filter(url => /\/countries\/conflicts\/AUS\.json\?/.test(url)).length, 2, "ownership probes reuse already loaded data");
      assert.ok(!requests.some(url => /countries_full|conflict_details\.generated/.test(url)));
      assertHealthyPage(test.pageErrors, label + " recuperacion de fichas y conflictos");
    } finally {
      releaseBrazil();
      releaseConflicts();
      await page.evaluate(async () => {
        window.__countryModuleFailure?.restore();
        delete window.__countryModuleFailure;
        const probe = window.__countryOwnerProbe;
        probe?.restore();
        probe?.release();
        await probe?.pending;
        delete window.__countryOwnerProbe;
      }).catch(() => {});
      await test.context.close();
    }
  }
}

async function testNewsLifecycle(browser, baseUrl) {
  for (const [label, viewport] of [["desktop", DESKTOP_VIEWPORT], ["mobile", MOBILE_VIEWPORT]]) {
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      await page.addInitScript(() => {
        const nativeFetch = window.fetch.bind(window);
        const fixture = window.__newsFixture = { mode: "ok", calls: [] };
        window.fetch = (url, options = {}) => {
          if (!String(url).startsWith("https://api.gdeltproject.org/")) return nativeFetch(url, options);
          const id = fixture.calls.length;
          const response = () => new Response(JSON.stringify({ articles: fixture.mode === "empty" ? []
            : Array.from({ length: 4 }, (_, i) => ({
              title: `Titular de prueba ${id}-${i}`, sourceCommonName: "Fuente de prueba",
              seendate: "20261002T120000Z", url: `https://example.com/news/${id}/${i}`
            })) }), { headers: { "Content-Type": "application/json" } });
          const call = { url: String(url), signal: options.signal, release: null };
          fixture.calls.push(call);
          // A late provider deliberately ignores abort so the UI must reject stale results.
          return fixture.mode === "hold" ? new Promise(resolve => { call.release = () => resolve(response()); })
            : Promise.resolve(response());
        };
      });
    });
    const { page } = test;
    const openHub = async () => {
      if (label === "mobile") {
        await page.locator("#toggle-more-panel").click();
        await page.locator('[data-mobile-hub-target="news-hub-panel"]').click();
      } else {
        await page.locator("#news-hub-panel > summary").click();
      }
      await page.locator(".news-hub-content").waitFor({ state: "visible" });
    };
    const count = () => page.evaluate(() => window.__newsFixture.calls.length);
    const selectCountry = async (name, code) => {
      await page.locator("#news-country-filter").fill(name);
      const row = page.locator(`#news-hub-list [data-news-country="${code}"]`);
      await row.waitFor({ state: "visible" });
      await row.click();
    };
    try {
      await waitForAppReady(page, { requireTiles: false });
      assert.equal(await count(), 0, label + " no headlines at startup");
      await openHub();
      await page.waitForFunction(() => typeof newsUi.buildStateCard === "function");
      assert.equal(await count(), 0, "opening the hub does not download headlines");
      await page.evaluate(() => { window.__newsFixture.mode = "hold"; });
      await selectCountry("Argentina", "ARG");
      await page.waitForFunction(() => window.__newsFixture.calls.length === 1);
      await page.evaluate(() => { window.__newsFixture.mode = "ok"; });
      await selectCountry("Brasil", "BRA");
      await page.waitForFunction(() => document.getElementById("news-hub-article").textContent.includes("Titular de prueba 1-0"));
      await page.evaluate(() => window.__newsFixture.calls[0].release());
      assert.equal(await page.evaluate(() => window.__newsFixture.calls[0].signal.aborted), true);
      await page.evaluate(() => renderNewsHub("ARG"));
      assert.match(await page.locator("#news-hub-selected").textContent(), /Brasil/);
      assert.match(await page.locator("#news-hub-article").textContent(), /Titular de prueba 1-0/);
      assert.equal(await page.evaluate(() => newsCache.has("ARG:general")), false, "no late country cache entry");
      assert.equal(await count(), 2);

      await page.locator("#news-topic-select").selectOption("economy");
      await page.waitForFunction(() => document.getElementById("news-hub-article").textContent.includes("Titular de prueba 2-0"));
      assert.match(await page.locator("#news-hub-article").textContent(), /economia/i);
      await page.locator("#news-topic-select").selectOption("general");
      await page.waitForFunction(() => document.getElementById("news-hub-article").textContent.includes("Titular de prueba 1-0"));
      assert.equal(await count(), 3, "changing back reuses valid topic cache");

      await page.evaluate(() => { window.__newsFixture.mode = "hold"; });
      await page.locator("#news-topic-select").selectOption("diplomacy");
      await page.waitForFunction(() => window.__newsFixture.calls.length === 4);
      await page.locator("#news-hub-panel > summary").click();
      await page.waitForFunction(() => activeNewsRequest === null && window.__newsFixture.calls[3].signal.aborted);
      await openHub();
      await page.locator("#news-hub-article .news-state-card").waitFor({ state: "visible" });
      assert.equal(await page.locator('#news-hub-article [aria-busy="true"]').count(), 0);
      assert.equal(await count(), 4, "reopening never resumes a cancelled download");
      await page.evaluate(() => window.__newsFixture.calls[3].release());
      assert.ok(!(await page.locator("#news-hub-article").textContent()).includes("Titular de prueba 3-0"));

      await page.evaluate(() => { window.__newsFixture.mode = "empty"; });
      await page.locator("#news-topic-select").selectOption("conflict");
      const retry = page.locator('#news-hub-article [data-news-country="BRA"]');
      await retry.waitFor({ state: "visible" });
      assert.match(await page.locator("#news-hub-article").textContent(), /Titulares no disponibles/);
      const failedCount = await count();
      assert.equal(await page.evaluate(() => newsCache.has("BRA:conflict")), false);
      await page.evaluate(() => {
        Object.defineProperty(navigator.connection, "saveData", { configurable: true, value: true });
        navigator.connection.dispatchEvent(new Event("change"));
      });
      await page.locator("#news-topic-select").selectOption("politics");
      await page.waitForFunction(() => document.getElementById("news-hub-article").textContent.includes("Ahorro de datos activo"));
      assert.equal(await count(), failedCount);
      await page.locator("#news-topic-select").selectOption("general");
      await page.waitForFunction(() => document.getElementById("news-hub-article").textContent.includes("Titular de prueba 1-0"));
      assert.equal(await count(), failedCount, "Save-Data keeps cached headlines available");
      await page.locator("#news-topic-select").selectOption("politics");
      await page.evaluate(() => {
        Object.defineProperty(navigator.connection, "saveData", { configurable: true, value: false });
        navigator.connection.dispatchEvent(new Event("change"));
        window.__newsFixture.mode = "hold";
      });
      await retry.waitFor({ state: "visible" });
      assert.equal(await count(), failedCount, "restoring data availability does not fetch");
      await retry.focus();
      await retry.press("Enter");
      await page.waitForFunction(expected => window.__newsFixture.calls.length === expected + 1, failedCount);
      await page.evaluate(() => {
        Object.defineProperty(navigator, "onLine", { configurable: true, value: false });
        window.dispatchEvent(new Event("offline"));
      });
      await page.waitForFunction(() => activeNewsRequest === null && window.__newsFixture.calls.at(-1).signal.aborted);
      assert.match(await page.locator("#news-hub-article").textContent(), /Sin conexion/);
      await page.evaluate(() => {
        Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
        window.dispatchEvent(new Event("online"));
        window.__newsFixture.mode = "ok";
        window.__newsFixture.calls.at(-1).release();
      });
      await retry.waitFor({ state: "visible" });
      assert.equal(await count(), failedCount + 1, "online recovery does not fetch automatically");
      assert.equal(await page.locator('#news-hub-article [aria-busy="true"]').count(), 0);
      assert.equal(await page.locator('#news-hub-article [role="status"]').count(), 1);
      await retry.click();
      await page.waitForFunction(() => document.querySelector("#news-hub-article .news-headline-list"));
      const content = page.locator(".news-hub-content");
      assert.ok(await content.evaluate(element => element.scrollWidth <= element.clientWidth + 1), label + " news fits its panel");
      await content.screenshot({ path: `tmp/news-ready-${label}.png` });
      assertHealthyPage(test.pageErrors, label + " news lifecycle");
    } finally {
      await page.evaluate(() => {
        for (const call of window.__newsFixture.calls) call.release?.();
      }).catch(() => {});
      await test.context.close();
    }
  }
}

async function installQuizTimerProbe(page) {
  await page.addInitScript(() => {
    window.__quizTimers = new Map();
    const start = window.setInterval.bind(window);
    const stop = window.clearInterval.bind(window);
    window.setInterval = (action, delay, ...args) => {
      const id = start(action, delay, ...args);
      if (delay === 1000 && action?.name === "onQuizTick") window.__quizTimers.set(id, action);
      return id;
    };
    window.clearInterval = id => { window.__quizTimers.delete(id); stop(id); };
  });
}

async function openQuizHub(page, label) {
  if (label === "mobile") {
    await page.locator("#toggle-more-panel").click();
    await page.locator('[data-mobile-hub-target="quiz-hub-panel"]').click();
  } else await page.locator("#quiz-hub-panel > summary").click();
  await page.locator(".quiz-hub-content").waitFor({ state: "visible" });
}

async function testBackgroundPanels(browser, baseUrl) {
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    const label = viewport === MOBILE_VIEWPORT ? "mobile" : "desktop";
    const test = await createTestPage(browser, baseUrl, viewport, installQuizTimerProbe);
    const { page } = test;
    try {
      await waitForAppReady(page, { requireTiles: false });
      const panels = [
        ["map-toolbar", ".toolbar-content"], ["rankings-panel", ".left-panel-inner"],
        ["compare-hub-panel", ".compare-hub-content"], ["quiz-hub-panel", ".quiz-hub-content"],
        ["news-hub-panel", ".news-hub-content"]
      ];
      for (const [id, content] of panels) {
        const hidden = await page.locator(`#${id} > ${content}`).evaluate(element => ({
          display: getComputedStyle(element).display, rects: element.getClientRects().length
        }));
        assert.deepEqual(hidden, { display: "none", rects: 0 }, label + " contenido cerrado sin layout: " + id);
      }
      await page.locator(label === "mobile" ? "#toggle-left-panel" : "#rankings-summary").click();
      await page.waitForFunction(() => document.getElementById("world-population-total").textContent === formatNumber(worldPopulationTotal));
      assert.ok(await page.locator("#world-population-total").isVisible(), label + " total disponible al abrir Rankings");
      await page.waitForFunction(() => {
        const bounds = document.getElementById("rankings-panel").getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= innerWidth;
      });
      await page.screenshot({ path: "tmp/rankings-ready-" + label + ".png" });
      await page.locator(label === "mobile" ? "#toggle-left-panel" : "#rankings-summary").click();

      for (const [query, type] of [["Asia", "continent"], ["Cristianismo", "religion"]]) {
        await submitSearch(page, query);
        await page.waitForFunction(expected => currentPanelState.type === expected && !document.getElementById("country-modal").hidden, type);
        await closeCountryPanel(page);
        const before = await page.evaluate(() => ({ html: document.getElementById("country-panel").innerHTML, selection: selectedLayers.map(layer => layer.code) }));
        // Deliver the same refresh used by supplemental data after the user closed the card.
        await page.evaluate(async () => {
          await loadDeferredDataEnhancements();
          refreshGlobalStats();
          rerenderCurrentPanel();
          await new Promise(resolve => setTimeout(resolve, 50));
        });
        assert.equal(await page.locator("#country-modal").isVisible(), false, label + " no reabre " + type);
        assert.deepEqual(await page.evaluate(() => ({ html: document.getElementById("country-panel").innerHTML, selection: selectedLayers.map(layer => layer.code) })), before);
      }

      for (const [id, content] of panels) {
        // Native details state must still expose the existing workspace without CSS overrides.
        await page.locator(`#${id}`).evaluate(element => { element.open = true; });
        await page.locator(`#${id} > ${content}`).waitFor({ state: "visible" });
        assert.ok(await page.locator(`#${id} > ${content}`).evaluate(element => element.getBoundingClientRect().height > 0));
        await page.locator(`#${id}`).evaluate(element => { element.open = false; });
        await page.locator(`#${id} > ${content}`).waitFor({ state: "hidden" });
      }
      await openQuizHub(page, label);
      await page.waitForFunction(() => Boolean(window.GeoRiskQuizUI));
      await page.locator("#quiz-mode").selectOption("timed");
      const start = page.locator("#quiz-start-button");
      await start.focus();
      await start.press("Enter");
      await page.waitForFunction(() => quizState.current && window.__quizTimers.size === 1);
      await page.evaluate(() => {
        window.__previousQuizState = quizState;
        window.__previousQuizTick = [...window.__quizTimers.values()][0];
      });
      await start.click();
      await page.waitForFunction(() => quizState !== window.__previousQuizState && window.__quizTimers.size === 1);
      const ticks = await page.evaluate(() => {
        const before = quizState.timeLeft;
        window.__previousQuizTick();
        const afterStale = quizState.timeLeft;
        const tick = [...window.__quizTimers.values()][0];
        tick(); tick();
        window.__activeQuizTick = tick;
        return { before, afterStale, after: quizState.timeLeft, timers: window.__quizTimers.size };
      });
      assert.equal(ticks.afterStale, ticks.before, label + " stale ticks cannot change a new round");
      assert.equal(ticks.after, ticks.before - 2, label + " each current callback consumes one second");
      assert.equal(ticks.timers, 1);
      await page.locator("#quiz-hub-panel > summary").click();
      await page.waitForFunction(() => window.__quizTimers.size === 0);
      const paused = await page.evaluate(() => {
        const before = quizState.timeLeft;
        window.__activeQuizTick();
        return { before, after: quizState.timeLeft, code: quizState.current.code, total: quizState.total };
      });
      assert.equal(paused.after, paused.before, label + " closed quizzes do not consume remaining time");
      await openQuizHub(page, label);
      await page.waitForFunction(() => window.__quizTimers.size === 1);
      const resumed = await page.evaluate(() => ({ remaining: quizState.timeLeft, code: quizState.current.code, total: quizState.total }));
      assert.equal(resumed.code, paused.code);
      assert.equal(resumed.total, paused.total);
      assert.ok(resumed.remaining > 0 && resumed.remaining <= paused.after, "reopening must not renew the time budget");
      const visibility = await page.evaluate(() => {
        const descriptor = Object.getOwnPropertyDescriptor(document, "visibilityState");
        const tick = [...window.__quizTimers.values()][0];
        const before = quizState.timeLeft;
        Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
        document.dispatchEvent(new Event("visibilitychange"));
        const hiddenTimers = window.__quizTimers.size;
        tick();
        const afterHidden = quizState.timeLeft;
        if (descriptor) Object.defineProperty(document, "visibilityState", descriptor);
        else delete document.visibilityState;
        document.dispatchEvent(new Event("visibilitychange"));
        return { before, hiddenTimers, afterHidden, afterResume: quizState.timeLeft, timers: window.__quizTimers.size };
      });
      assert.equal(visibility.hiddenTimers, 0);
      assert.equal(visibility.afterHidden, visibility.before);
      assert.equal(visibility.afterResume, visibility.before);
      assert.equal(visibility.timers, 1, "restoring visibility resumes one countdown");
      await page.locator("#quiz-mode").selectOption("classic");
      assert.equal(await page.evaluate(() => window.__quizTimers.size), 0);
      const content = page.locator(".quiz-hub-content");
      assert.ok(await content.evaluate(element => element.scrollWidth <= element.clientWidth + 1));
      assert.equal(await page.locator("#quiz-status").textContent(), "Puntaje: 0/0");
      await content.screenshot({ path: `tmp/quiz-lifecycle-${label}.png` });
      const correct = await page.evaluate(() => quizState.current.correct);
      await page.getByRole("button", { name: correct, exact: true }).click();
      await page.locator("#quiz-hub-panel > summary").click();
      await openQuizHub(page, label);
      const review = await page.evaluate(() => ({
        score: quizState.score, total: quizState.total, timers: window.__quizTimers.size,
        disabled: [...document.querySelectorAll(".quiz-option")].every(button => button.disabled),
        correct: document.querySelectorAll(".quiz-option.is-correct").length,
        next: !document.getElementById("quiz-next-button").hidden
      }));
      assert.deepEqual(review, { score: 1, total: 1, timers: 0, disabled: true, correct: 1, next: true },
        label + " reopening keeps answered options locked, feedback and progression available");
      await page.locator("#quiz-reset-button").click();
      assert.equal(await page.evaluate(() => quizState.current === null && window.__quizTimers.size === 0), true);
      await page.locator("#quiz-hub-panel > summary").click();
      assertHealthyPage(test.pageErrors, label + " paneles en segundo plano");
    } finally {
      await test.context.close();
    }
  }
}

async function testDeferredUiRecovery(browser, baseUrl) {
  for (const [label, viewport] of [["desktop", DESKTOP_VIEWPORT], ["mobile", MOBILE_VIEWPORT]]) {
    let attempts = 0;
    let releaseModule;
    const stalledModule = new Promise(resolve => { releaseModule = resolve; });
    let quizAttempts = 0;
    let releaseQuiz;
    const stalledQuiz = new Promise(resolve => { releaseQuiz = resolve; });
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      await installQuizTimerProbe(page);
      await page.addInitScript(() => {
        window.__deferredCopies = [];
        window.__deferredDeadlines = new Map();
        const start = window.setTimeout.bind(window);
        const stop = window.clearTimeout.bind(window);
        window.setTimeout = (action, delay, ...args) => {
          const id = start(action, delay, ...args);
          if (delay === 20000 && action?.name === "onDeferredUiTimeout") window.__deferredDeadlines.set(id, action);
          return id;
        };
        window.clearTimeout = id => { window.__deferredDeadlines.delete(id); stop(id); };
        Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
          async writeText(text) { window.__deferredCopies.push(text); }
        } });
      });
      await page.route("**/app-export-share.js*", async route => {
        attempts += 1;
        if (attempts === 1) await route.abort("internetdisconnected");
        else { await stalledModule; await route.continue(); }
      });
      await page.route("**/app-quiz-ui.js*", async route => {
        quizAttempts += 1;
        if (quizAttempts === 1) await route.abort("internetdisconnected");
        else { await stalledQuiz; await route.continue(); }
      });
    });
    const { page } = test;
    try {
      await waitForAppReady(page, { requireTiles: false });
      assert.equal(attempts, 0, "deferred export/share module is not downloaded at startup");
      await page.locator(label === "mobile" ? "#toggle-left-panel" : "#rankings-summary").click();
      const button = page.locator('[data-share-target="left-panel"]');
      await button.click();
      const notice = page.locator("#app-toast");
      await notice.filter({ hasText: "Revisa tu conexion" }).waitFor({ state: "visible" });
      await captureTransientNotice(page, notice, { path: `tmp/deferred-recovery-${label}.png` });
      assert.equal(attempts, 1, "failed imports do not automatically retry");
      assert.equal(await page.evaluate(() => window.__deferredCopies.length), 0);
      assert.equal(await page.evaluate(() => deferredUiModulePromises.has("exportShare")), false);

      await button.focus();
      await button.press("Enter");
      await page.waitForFunction(() => window.__deferredDeadlines.size === 1 && deferredUiModuleLoads.has("exportShare"));
      // VM tests verify the exact 20-second boundary; here invoke the real callback on a held native import.
      await page.evaluate(() => [...window.__deferredDeadlines.values()][0]());
      await notice.filter({ hasText: "tarda demasiado" }).waitFor({ state: "visible" });
      await captureTransientNotice(page, notice, { path: `tmp/deferred-timeout-${label}.png` });
      assert.deepEqual(await page.evaluate(() => ({ copies: window.__deferredCopies.length,
        waits: window.__deferredDeadlines.size, pending: deferredUiModuleLoads.size,
        cached: deferredUiModulePromises.has("exportShare"), failures: deferredUiModuleFailures.get("exportShare") })),
        { copies: 0, waits: 0, pending: 1, cached: false, failures: 1 }, label + " expired wait retains only the native import");
      assert.equal(attempts, 2, "a waiting deadline neither retries nor consumes another failed-URL variant");
      if (label === "mobile") {
        await button.focus();
        await button.press("Enter");
        await page.waitForFunction(() => window.__deferredDeadlines.size === 1);
        assert.equal(attempts, 2, "explicit retry joins the same pending native import");
      }
      releaseModule();
      await page.waitForFunction(() => Boolean(window.GeoRiskExportShare) && deferredUiModuleLoads.size === 0);
      const recovered = await page.evaluate(async () => Boolean(await deferredUiModulePromises.get("exportShare")));
      assert.equal(recovered, true, label + " a real failed import can recover without reloading the page");
      if (label === "desktop") {
        assert.equal(await page.evaluate(() => window.__deferredCopies.length), 0, "late success must not replay an expired share action");
        await button.focus();
        await button.press("Enter");
      }
      await page.waitForFunction(() => window.__deferredCopies.length === 1);
      assert.equal(attempts, 2, "one explicit action makes one retry");
      assert.equal(await page.evaluate(() => window.__deferredDeadlines.size), 0, "settlement clears the wait timer");
      await button.click();
      await page.waitForFunction(() => window.__deferredCopies.length === 2);
      assert.equal(attempts, 2, "successful imports are reused");
      assert.equal(quizAttempts, 0, "quiz stays deferred until requested");
      await page.locator(label === "mobile" ? "#toggle-left-panel" : "#rankings-summary").click();
      await openQuizHub(page, label);
      await notice.filter({ hasText: "Revisa tu conexion" }).waitFor({ state: "visible" });
      assert.equal(quizAttempts, 1, "failed quiz imports do not automatically retry");
      await page.locator("#quiz-mode").selectOption("timed");
      await page.evaluate(() => {
        window.__initialQuizState = quizState;
        window.__originalQuizStart = startQuiz;
        startQuiz = (...args) => window.__pendingQuizStart = window.__originalQuizStart(...args);
      });
      await page.locator("#quiz-start-button").focus();
      await page.locator("#quiz-start-button").press("Enter");
      await page.waitForFunction(() => deferredUiModuleLoads.has("quiz"));
      await page.locator("#quiz-hub-panel > summary").click();
      await page.waitForFunction(() => !document.getElementById("quiz-hub-panel").open);
      releaseQuiz();
      const cancelled = await page.evaluate(async () => {
        const result = await window.__pendingQuizStart;
        startQuiz = window.__originalQuizStart;
        return { result, unchanged: quizState === window.__initialQuizState,
          question: quizState.current, bank: quizQuestionBank.length, timers: window.__quizTimers.size };
      });
      assert.deepEqual(cancelled, { result: false, unchanged: true, question: null, bank: 0, timers: 0 },
        label + " closing during a real held import cancels the round without building questions");
      await openQuizHub(page, label);
      await page.locator("#quiz-start-button").focus();
      await page.locator("#quiz-start-button").press("Enter");
      await page.waitForFunction(() => quizState.current && window.__quizTimers.size === 1);
      assert.equal(quizAttempts, 2, "explicit reopening reuses the late successful module");
      await page.locator("#quiz-hub-panel > summary").click();
      await page.waitForFunction(() => window.__quizTimers.size === 0);
      assertHealthyPage(test.pageErrors, label + " deferred recovery");
    } finally {
      releaseModule();
      releaseQuiz();
      await test.context.close();
    }
  }
}

async function testShareLifecycle(browser, baseUrl) {
  for (const [label, viewport] of [["desktop", DESKTOP_VIEWPORT], ["mobile", MOBILE_VIEWPORT]]) {
    const requests = [];
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      page.on("request", request => requests.push(request.url()));
      await page.addInitScript(() => {
        const fixture = window.__shareFixture = {
          nativeMode: "cancel", copyMode: "ok", shares: [], copies: [], clipboard: "keep", release: null
        };
        const share = async payload => {
          fixture.shares.push(payload);
          if (fixture.nativeMode === "cancel") throw new DOMException("User cancelled", "AbortError");
          if (fixture.nativeMode === "denied") throw new DOMException("Share denied", "NotAllowedError");
          if (fixture.nativeMode === "hold") await new Promise(resolve => { fixture.release = resolve; });
        };
        const clipboard = { async writeText(text) {
          fixture.copies.push(text);
          if (fixture.copyMode === "denied") throw new DOMException("Copy denied", "NotAllowedError");
          fixture.clipboard = text;
        } };
        Object.defineProperty(navigator, "share", { configurable: true, get: () => fixture.nativeMode === "absent" ? undefined : share });
        Object.defineProperty(navigator, "clipboard", { configurable: true, get: () => fixture.copyMode === "absent" ? undefined : clipboard });
      });
    });
    const { page } = test;
    try {
      await waitForAppReady(page, { requireTiles: false });
      assert.ok(!requests.some(url => /app-export-share\.js|vendor\/exports/.test(url)), "share/export tools are not loaded at startup");
      await page.evaluate(() => {
        window.__shareMessages = [];
        const showToast = uiPolish.showToast;
        uiPolish.showToast = message => { window.__shareMessages.push(message); return showToast(message); };
      });
      await page.locator(label === "mobile" ? "#toggle-left-panel" : "#rankings-summary").click();
      const button = page.locator('[data-share-target="left-panel"]');
      await button.focus();
      await button.press("Enter");
      await page.waitForFunction(() => window.__shareFixture.shares.length === 1);
      assert.deepEqual(await page.evaluate(() => ({ copies: window.__shareFixture.copies.length,
        clipboard: window.__shareFixture.clipboard, messages: window.__shareMessages })),
        { copies: 0, clipboard: "keep", messages: [] }, label + " cancellation preserves the clipboard");
      await page.evaluate(() => { window.__shareFixture.nativeMode = "ok"; });
      await button.click();
      await page.waitForFunction(() => window.__shareFixture.shares.length === 2);
      assert.equal(await page.evaluate(() => window.__shareFixture.copies.length), 0);
      assert.equal(await page.evaluate(() => window.__shareMessages.length), 0, "native handoff is not confirmed delivery");

      await page.evaluate(() => { window.__shareFixture.nativeMode = "absent"; window.__shareFixture.copyMode = "denied"; });
      await button.click();
      const notice = page.locator("#app-toast");
      await notice.filter({ hasText: "No se pudo compartir ni copiar" }).waitFor({ state: "visible" });
      await captureTransientNotice(page, notice, { path: `tmp/share-denied-${label}.png` });
      assert.equal(await page.evaluate(() => window.__shareFixture.clipboard), "keep");
      await page.evaluate(() => { window.__shareFixture.copyMode = "absent"; });
      await button.click();
      await page.waitForFunction(() => window.__shareMessages.length === 2);
      assert.equal(await page.evaluate(() => window.__shareFixture.copies.length), 1);
      await page.evaluate(() => { window.__shareFixture.copyMode = "ok"; });
      await button.click();
      await notice.filter({ hasText: "Copiado al portapapeles" }).waitFor({ state: "visible" });
      assert.match(await page.evaluate(() => window.__shareFixture.clipboard), /^Rankings GeoRisk\n/);
      assert.equal(await page.evaluate(() => window.__shareFixture.copies.length), 2);

      await page.evaluate(() => { window.__shareFixture.nativeMode = "hold"; });
      await button.click();
      await page.waitForFunction(() => window.__shareFixture.shares.length === 3);
      await button.click();
      assert.equal(await page.evaluate(() => window.__shareFixture.shares.length), 3, "pending sharing is not duplicated");
      assert.equal(await page.evaluate(() => window.__shareFixture.copies.length), 2);
      await page.evaluate(() => { window.__shareFixture.nativeMode = "ok"; window.__shareFixture.release(); });
      await button.click();
      await page.waitForFunction(() => window.__shareFixture.shares.length === 4);
      assert.ok(!requests.some(url => /vendor\/exports\/(?:html2canvas|jspdf)/.test(url)), "text sharing never loads canvas/PDF libraries");
      assert.equal(requests.filter(url => /vendor\/exports\/manifest\.js/.test(url)).length, 1, "only the shared module metadata is imported");
      assert.equal(requests.filter(url => /app-export-share\.js/.test(url)).length, 1, "sharing reuses its deferred module");
      assertHealthyPage(test.pageErrors, label + " share lifecycle");
    } finally {
      await page.evaluate(() => window.__shareFixture.release?.()).catch(() => {});
      await test.context.close();
    }
  }
}

async function testSecureExports(browser, baseUrl) {
  for (const [label, viewport] of [["desktop", DESKTOP_VIEWPORT], ["mobile", MOBILE_VIEWPORT]]) {
    const requests = [];
    const downloads = [];
    let releaseModule, releaseLibrary;
    const moduleHeld = new Promise(resolve => { releaseModule = resolve; });
    const libraryHeld = new Promise(resolve => { releaseLibrary = resolve; });
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      page.on("request", request => requests.push(request.url()));
      page.on("download", download => downloads.push(download));
      await page.route("**/app-export-share.js*", async route => { await moduleHeld; await route.continue(); });
      await page.route("**/vendor/exports/html2canvas-*.js", async route => { await libraryHeld; await route.continue(); });
    });
    const { page } = test;
    try {
      await waitForAppReady(page, { requireTiles: false });
      assert.equal(requests.some(url => /vendor\/exports|html2canvas|jspdf/.test(url)), false, "no export libraries at startup");
      await page.locator(label === "mobile" ? "#toggle-left-panel" : "#rankings-summary").click();
      await page.waitForFunction(() => document.querySelectorAll("#top-population li").length > 0);
      await page.evaluate(() => {
        window.__exportViewNotices = 0;
        window.__exportSizeNotices = 0;
        const original = uiPolish.showToast;
        uiPolish.showToast = message => {
          if (message.startsWith("La vista cambio")) window.__exportViewNotices += 1;
          if (message.startsWith("El informe es demasiado grande")) window.__exportSizeNotices += 1;
          return original(message);
        };
      });
      const pngButton = page.locator('[data-export-target="left-panel"][data-export-format="png"]');
      const filter = page.locator("#rankings-continent-filter");
      const filterValues = await filter.evaluate(element => [...element.options].map(option => option.value).filter(Boolean));
      assert.ok(filterValues.length >= 2);
      const moduleRequest = page.waitForRequest("**/app-export-share.js*", { timeout: APP_TIMEOUT_MS });
      await pngButton.focus();
      await pngButton.press("Enter");
      await moduleRequest;
      await filter.selectOption(filterValues[0]);
      releaseModule();
      await page.waitForFunction(() => window.__exportViewNotices === 1);
      assert.equal(requests.some(url => /vendor\/exports\/(?:html2canvas|jspdf)/.test(url)), false, "a view changed during module loading must not download capture libraries");
      assert.equal(await page.locator(".export-report-shell").count(), 0);
      assert.equal(downloads.length, 0);

      const libraryRequest = page.waitForRequest("**/vendor/exports/html2canvas-*.js", { timeout: APP_TIMEOUT_MS });
      await pngButton.click();
      await libraryRequest;
      await filter.selectOption(filterValues[1]);
      releaseLibrary();
      await page.waitForFunction(() => window.__exportViewNotices === 2);
      const staleNotice = page.locator("#app-toast").filter({ hasText: "La vista cambio" });
      await staleNotice.waitFor({ state: "visible" });
      await captureTransientNotice(page, staleNotice, { path: `tmp/export-view-changed-${label}.png` });
      assert.equal(await page.locator(".export-report-shell").count(), 0, "changed views allocate no report/canvas");
      assert.equal(downloads.length, 0);
      await filter.selectOption("");
      const layout = await page.evaluate(async () => {
        const tools = await getExportShareTools();
        const capture = tools.buildReportCaptureNode(document.getElementById("left-panel"), "fixture");
        const body = capture.querySelector(".export-report-body");
        const header = capture.querySelector(".export-report-header").getBoundingClientRect();
        const bounds = body.getBoundingClientRect();
        const result = {
          height: bounds.height, belowHeader: bounds.top >= header.bottom,
          inBounds: bounds.bottom <= capture.getBoundingClientRect().bottom,
          controls: body.querySelectorAll(".compare-toolbar").length
        };
        capture.remove();
        return result;
      });
      assert.ok(layout.height > 300 && layout.belowHeader && layout.inBounds, label + " report body is in flow and unclipped");
      assert.equal(layout.controls, 0);
      await page.evaluate(() => {
        window.__nativeBudgetCanvas = window.html2canvas;
        window.__budgetCaptureCalls = 0;
        window.html2canvas = (...args) => { window.__budgetCaptureCalls++; return window.__nativeBudgetCanvas(...args); };
        const spacer = document.createElement("div");
        spacer.id = "export-size-fixture";
        spacer.style.height = "24000px";
        document.getElementById("left-panel").appendChild(spacer);
      });
      await pngButton.focus();
      await pngButton.press("Enter");
      await page.waitForFunction(() => window.__exportSizeNotices === 1);
      const sizeNotice = page.locator("#app-toast").filter({ hasText: "El informe es demasiado grande" });
      await sizeNotice.waitFor({ state: "visible" });
      await captureTransientNotice(page, sizeNotice, { path: `tmp/export-size-limit-${label}.png` });
      assert.equal(await page.evaluate(() => window.__budgetCaptureCalls), 0, "preflight rejects before iframe/canvas capture");
      assert.equal(await page.locator(".export-report-shell, .html2canvas-container").count(), 0);
      assert.equal(downloads.length, 0);
      await page.evaluate(() => {
        document.getElementById("export-size-fixture").remove();
        window.html2canvas = (node, options) => {
          window.__budgetCaptureCalls++;
          return window.__nativeBudgetCanvas(node, { ...options, onclone(doc, clonedNode) {
            const spacer = doc.createElement("div");
            spacer.style.height = "24000px";
            clonedNode.appendChild(spacer);
            return options.onclone(doc, clonedNode);
          } });
        };
      });
      await pngButton.click();
      await page.waitForFunction(() => window.__exportSizeNotices === 2);
      assert.equal(await page.evaluate(() => window.__budgetCaptureCalls), 1, "cloned-layout growth is checked by the real library");
      assert.equal(await page.locator(".export-report-shell, .html2canvas-container").count(), 0, "rejected clone iframe is removed");
      assert.equal(downloads.length, 0);
      await page.evaluate(() => { window.html2canvas = window.__nativeBudgetCanvas; });
      const imageDownload = page.waitForEvent("download", { timeout: APP_TIMEOUT_MS });
      await page.locator('[data-export-target="left-panel"][data-export-format="png"]').click();
      const image = await imageDownload;
      const png = await fs.readFile(await image.path());
      assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
      assert.ok(png.length > 20000, label + " export image contains content");
      const pngWidth = png.readUInt32BE(16), pngHeight = png.readUInt32BE(20);
      assert.ok(pngWidth > 0 && pngHeight > 0 && pngWidth <= 8192 && pngHeight <= 8192 && pngWidth * pngHeight <= 4_000_000,
        label + " real PNG fits the capture budget");
      await image.saveAs("tmp/export-" + label + ".png");
      const colors = await page.evaluate(async data => {
        const bitmap = new Image();
        bitmap.src = data;
        await bitmap.decode();
        const canvas = document.createElement("canvas");
        canvas.width = 200; canvas.height = 200;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0, 200, 200);
        const pixels = ctx.getImageData(0, 0, 200, 200).data;
        const values = new Set();
        for (let i = 0; i < pixels.length; i += 4) values.add(`${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`);
        return values.size;
      }, "data:image/png;base64," + png.toString("base64"));
      assert.ok(colors > 100, label + " exported canvas is not blank");

      const pdfButton = page.locator('[data-export-target="left-panel"][data-export-format="pdf"]');
      if (label === "desktop") {
        await page.route("**/vendor/exports/jspdf-*.js", route => route.fulfill({
          contentType: "text/javascript", body: "window.unverifiedExportScriptExecuted = true;"
        }));
        await pdfButton.click();
        await page.locator(".app-toast").filter({ hasText: "No se pudieron cargar las herramientas de PDF" }).waitFor({ state: "visible" });
        assert.equal(await page.evaluate(() => window.unverifiedExportScriptExecuted), undefined, "SRI blocks altered JS before execution");
        assert.equal(await page.locator('script[data-export-library="jspdf"]').count(), 0, "failed script is removed for retry");
        await page.unroute("**/vendor/exports/jspdf-*.js");
      }
      await page.evaluate(() => {
        window.__originalExportCanvas = window.html2canvas;
        window.__pendingExportCaptures = 0;
        const held = new Promise(resolve => { window.__releaseExportCapture = resolve; });
        window.html2canvas = async (...args) => {
          window.__pendingExportCaptures += 1;
          await held;
          const canvas = await window.__originalExportCanvas(...args);
          window.__completedExportDimensions = { width: canvas.width, height: canvas.height };
          window.__completedExportCanvas = canvas;
          return canvas;
        };
      });
      const pdfDownload = page.waitForEvent("download", { timeout: APP_TIMEOUT_MS });
      await pdfButton.click();
      await page.waitForFunction(() => window.__pendingExportCaptures === 1);
      await page.locator('[data-export-target="left-panel"][data-export-format="png"]').click();
      const pendingNotice = page.locator("#app-toast").filter({ hasText: "Hay una exportacion en curso" });
      await pendingNotice.waitFor({ state: "visible" });
      await captureTransientNotice(page, pendingNotice, { path: `tmp/export-pending-${label}.png` });
      assert.equal(await page.evaluate(() => window.__pendingExportCaptures), 1, "cross-format taps do not duplicate canvas work");
      assert.equal(await page.locator(".export-report-shell").count(), 1, "only one export capture is retained");
      await page.evaluate(() => window.__releaseExportCapture());
      const pdf = await pdfDownload;
      const pdfBytes = await fs.readFile(await pdf.path());
      assert.equal(pdfBytes.subarray(0, 5).toString(), "%PDF-");
      assert.ok(pdfBytes.length > 20000, label + " PDF includes captured image");
      assert.equal(await page.evaluate(() => window.__completedExportCanvas.width === 0 && window.__completedExportCanvas.height === 0), true, "completed capture discards canvas pixel dimensions");
      const pdfDimensions = await page.evaluate(() => window.__completedExportDimensions);
      assert.ok(pdfDimensions.width <= 8192 && pdfDimensions.height <= 8192 && pdfDimensions.width * pdfDimensions.height <= 4_000_000,
        label + " PDF capture stays below both canvas and PDF page limits");
      assert.equal(await page.evaluate(() => window.jspdf.jsPDF.version), "4.2.1");
      assert.equal(await page.locator(".export-report-shell").count(), 0);
      assert.equal(await page.locator(".html2canvas-container").count(), 0);
      assert.equal(await page.locator("script[data-export-library][integrity^='sha384-'][crossorigin='anonymous']").count(), 2);
      assert.equal(requests.some(url => /cdn.*(?:jspdf|html2canvas)/.test(url)), false);
      assert.equal(requests.filter(url => /vendor\/exports\/html2canvas.*\.js$/.test(url)).length, 1);
      assert.equal(downloads.length, 2, "only the explicitly retried PNG and PDF produce downloads");
      assertHealthyPage(test.pageErrors, label + " verified exports");
    } finally {
      releaseModule();
      releaseLibrary();
      await page.evaluate(() => {
        window.__releaseExportCapture?.();
        document.getElementById("export-size-fixture")?.remove();
        if (window.__nativeBudgetCanvas) window.html2canvas = window.__nativeBudgetCanvas;
        if (window.__originalExportCanvas) window.html2canvas = window.__originalExportCanvas;
      }).catch(() => {});
      await test.context.close();
    }
  }
}

async function testContentSecurityPolicy(browser, baseUrl) {
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    const metaOnly = viewport === MOBILE_VIEWPORT;
    let headerRemoved = false;
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      if (!metaOnly) return;
      await page.route(url => url.pathname.endsWith("/index.html"), async route => {
        const response = await route.fetch();
        const headers = response.headers();
        assert.ok(headers["content-security-policy"]);
        delete headers["content-security-policy"];
        headerRemoved = true;
        await route.fulfill({ response, headers });
      });
    });
    try {
      const { page } = test;
      assert.equal(headerRemoved, metaOnly, "mobile must verify CSP supplied by HTML without its HTTP counterpart");
      await waitForAppReady(page);
      await submitSearch(page, "Argentina");
      await waitForCountryPanel(page, "Argentina");
      await closeCountryPanel(page);
      await setMapMode(page, "2d");
      await setMapMode(page, "3d");
      await page.route("**/csp-missing-image.svg", route => route.fulfill({ status: 404, body: "" }));
      await page.evaluate(() => {
        const fixture = document.createElement("div");
        fixture.id = "csp-image-fixture";
        fixture.innerHTML = renderFlagVisual("ARG", "Argentina", "country-flag", "./csp-missing-image.svg") +
          renderCoatVisual("ARG", "Argentina", "./csp-missing-image.svg");
        document.body.append(fixture);
      });
      await page.waitForFunction(() => {
        const fixture = document.getElementById("csp-image-fixture");
        return fixture.querySelector(".flag-image").hidden && !fixture.querySelector(".flag-fallback").hidden && fixture.querySelector(".coat-visual").hidden;
      });
      const workerResult = await page.evaluate(() => new Promise((resolve, reject) => {
        const worker = new Worker("./app-search-worker.js");
        const timer = setTimeout(() => { worker.terminate(); reject(new Error("Local worker timed out")); }, 5000);
        worker.onmessage = event => { clearTimeout(timer); worker.terminate(); resolve(event.data); };
        worker.onerror = () => { clearTimeout(timer); worker.terminate(); reject(new Error("Local worker blocked")); };
        worker.postMessage({ id: "csp", countries: [{ code: "ARG", name: "Argentina" }] });
      }));
      assert.equal(workerResult.id, "csp");
      assert.ok(workerResult.aliases.some(item => item.value === "ARG"));
      assert.deepEqual(await page.evaluate(() => window.__geoRiskCspViolations), [], "normal 2D/3D, profiles, workers and image fallback must not violate CSP");
      assertHealthyPage(test.pageErrors, "CSP normal flows");

      let forbiddenRequests = 0;
      await page.route("https://untrusted.example/**", route => {
        forbiddenRequests += 1;
        return route.fulfill({ contentType: "text/javascript", body: "window.cspExecuted = true;" });
      });
      // A real, same-origin script exercises eval under CSP, without DevTools' eval bypass.
      await page.route("**/csp-probe.js", route => route.fulfill({ contentType: "text/javascript", body: `
        window.cspProbe = {};
        for (const [name, execute] of [
          ["evalBlocked", () => eval("window.cspExecuted = true")],
          ["functionBlocked", () => new Function("window.cspExecuted = true")()]
        ]) { try { execute(); } catch (error) { cspProbe[name] = error instanceof EvalError; } }
        const inline = document.createElement("script");
        inline.textContent = "window.cspExecuted = true";
        document.body.append(inline);
        const button = document.createElement("button");
        button.setAttribute("onclick", "window.cspExecuted = true");
        document.body.append(button); button.click(); button.remove();
        const external = document.createElement("script");
        external.src = "https://untrusted.example/probe.js";
        external.onerror = () => { cspProbe.externalBlocked = true; };
        document.body.append(external);
        fetch("https://untrusted.example/data").catch(() => { cspProbe.connectBlocked = true; });
      ` }));
      await page.evaluate(() => new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "./csp-probe.js";
        script.onload = resolve; script.onerror = reject;
        document.body.append(script);
      }));
      await page.waitForFunction(() => window.cspProbe?.externalBlocked && window.cspProbe?.connectBlocked);
      assert.deepEqual(await page.evaluate(() => window.cspProbe), { evalBlocked: true, functionBlocked: true, externalBlocked: true, connectBlocked: true });
      assert.equal(await page.evaluate(() => window.cspExecuted), undefined);
      assert.equal(forbiddenRequests, 0, "forbidden origins must be blocked before network access");
      const violations = await page.evaluate(() => window.__geoRiskCspViolations);
      for (const directive of ["script-src", "script-src-elem", "script-src-attr", "connect-src"]) {
        assert.ok(violations.some(item => item.directive === directive), "missing enforced CSP check: " + directive);
      }
    } finally {
      await test.context.close();
    }
  }
}

async function testCountryTextRendering(browser, baseUrl) {
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    const test = await createTestPage(browser, baseUrl, viewport);
    try {
      const { page } = test;
      await waitForAppReady(page);
      await page.evaluate(() => {
        window.__originalTimelineBuilder = getTimelineDetailContent;
        window.__timelineModelBuilds = 0;
        getTimelineDetailContent = (...args) => {
          window.__timelineModelBuilds += 1;
          return window.__originalTimelineBuilder(...args);
        };
      });
      assert.deepEqual(await page.evaluate(() => [
        formatNumber(123456.789) === (123456.789).toLocaleString("es-AR"),
        formatPercentage(9.995) === `${(9.995).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
        formatInflation(12.35) === `${(12.35).toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`,
        compactNumber(1234567) === new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 }).format(1234567)
      ]), [true, true, true, true], "los formatos reutilizados conservan la salida nativa en este navegador");
      await submitSearch(page, "Argentina");
      await waitForCountryPanel(page, "Argentina");
      const payload = '<img data-security-probe src=x onerror="window.geoRiskInjected=true">';
      const capitalName = 'Port A & B <C> "D"';
      await page.evaluate(async ({ payload, capitalName }) => {
        const country = countriesData.ARG;
        window.__countryTextOriginal = structuredClone(country);
        country.history = { ...country.history, origin: payload, type: payload, year: payload };
        country.politics = { ...country.politics, organizations: [payload, { name: payload, abbreviation: payload, startYear: payload, endYear: payload }] };
        country.religion = { ...country.religion, summary: payload, composition: [{ name: payload, percentage: 100 }] };
        country.general = { ...country.general, capitals: [{ name: capitalName, role: "nacional" }], languages: [payload], cities: [{ name: payload }] };
        currentPanelState.countryLoadedSections = ["country-section-general", "country-section-history", "country-section-politics", "country-section-religion"];
        await renderCountry(country, country.name);
      }, { payload, capitalName });
      assert.equal(await page.locator("[data-security-probe]").count(), 0, "country data must not create HTML elements, even when CSP blocks execution");
      for (const id of ["history", "politics", "religion"]) {
        assert.ok((await page.locator("#country-section-" + id).textContent()).includes(payload), id + " must preserve literal text");
      }
      assert.ok((await page.locator("#country-section-general").textContent()).includes(capitalName), "capital punctuation must render without double encoding");
      assert.equal(await page.evaluate(() => window.geoRiskInjected), undefined);
      assert.deepEqual(await page.evaluate(() => window.__geoRiskCspViolations), [], "escaping must prevent injection before CSP is needed");
      await page.evaluate(async () => {
        countriesData.ARG = window.__countryTextOriginal;
        delete window.__countryTextOriginal;
        await renderCountry(countriesData.ARG, countriesData.ARG.name);
      });
      await page.locator('[data-country-nav="country-section-history"]').click();
      await page.waitForFunction(() => deferredDataStatus.runtimeCuration === true &&
        document.querySelectorAll("#country-section-history .timeline-item").length > 0);
      const timelineLinks = await page.locator("#country-section-history .timeline-item").count();
      assert.equal(await page.evaluate(() => window.__timelineModelBuilds), 0, "rendering country/history links does not prepare unopened timeline models");
      console.log("timeline-models: " + viewport.width + " " + timelineLinks + " visible links; 0 prepared models");
      const eventLink = page.locator("#country-section-history .timeline-item").filter({ hasText: /ruptura del orden virreinal/ }).first();
      await eventLink.click();
      await page.locator("#timeline-modal").waitFor({ state: "visible" });
      assert.equal(await page.evaluate(() => window.__timelineModelBuilds), 1);
      const curated = await page.evaluate(() => window.GeoRiskCuration.EXTRA_TIMELINE_DETAIL_OVERRIDES["Revolucion de Mayo"]);
      const timelineBody = page.locator("#timeline-modal-body");
      assert.equal(await page.locator("#timeline-modal-title").textContent(), curated.title);
      assert.ok((await timelineBody.innerText()).includes(curated.detail), "the real late-loaded historical detail must be visible");
      assert.ok((await timelineBody.innerText()).includes(curated.significance));
      assert.equal(await timelineBody.evaluate(element => element.scrollWidth <= element.clientWidth + 1), true, "timeline text must fit the modal width");
      await page.screenshot({ path: "tmp/timeline-curation-" + viewport.width + ".png" });
      await assertModalFrame(page, "timeline-modal");
      await page.locator("#timeline-modal-close").click();
      await page.evaluate(() => { currentLanguage = "en"; });
      await eventLink.click();
      assert.equal(await page.evaluate(() => window.__timelineModelBuilds), 2, "reopening constructs exactly one current model");
      assert.match(await timelineBody.innerText(), /Historical timeline event/);
      assert.match(await timelineBody.innerText(), /High impact/);
      assert.match(await timelineBody.innerText(), /19th c\./);
      assert.ok((await timelineBody.innerText()).includes(curated.detail), "existing source text is preserved, not invented by localization");
      assertHealthyPage(test.pageErrors, "country text rendering " + viewport.width);
    } finally {
      await test.page.evaluate(() => {
        if (window.__originalTimelineBuilder) getTimelineDetailContent = window.__originalTimelineBuilder;
        currentLanguage = "es";
      }).catch(() => {});
      await test.context.close();
    }
  }
}

async function testUntrustedInputs(browser, baseUrl) {
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      await page.addInitScript(() => {
        const payload = '</textarea><img src=x onerror="window.geoRiskInjected=true">';
        localStorage.setItem("geo-risk-language", "__proto__");
        localStorage.setItem("geo-risk-quality-preset", "constructor");
        localStorage.setItem("geo-risk-label-mode", "__proto__");
        localStorage.setItem("geo-risk-saved-filters", "[");
        localStorage.setItem("geo-risk-saved-views", "{}");
        localStorage.setItem("geo-risk-saved-searches", "null");
        localStorage.setItem("geo-risk-search-history", JSON.stringify([null, payload, 7]));
        localStorage.setItem("geo-risk-favorite-views", JSON.stringify([null, { name: payload, selectedCode: "ARG", mapMode: {} }]));
        localStorage.setItem("geo-risk-country-notes:ARG", payload);
      });
    });
    try {
      const { page } = test;
      await waitForAppReady(page);
      assert.deepEqual(await page.evaluate(() => ({
        views: savedViews.length, filters: savedFilters.length, favorites: favoriteViews.length,
        history: searchHistory.length, language: currentLanguage, quality: qualityPreset
      })), { views: 0, filters: 0, favorites: 1, history: 1, language: "es", quality: "auto" });
      assert.equal(await page.locator("#favorite-views-select option").last().textContent().then(text => text.includes("<img")), true);
      const savedControls = await page.evaluate(() => {
        const original = { views: savedViews, favorites: favoriteViews, filters: savedFilters };
        const restoreView = applySavedView;
        const restoreFilters = applyFilters;
        const calls = [];
        const filter = document.getElementById("filter-continent-select");
        const filterValue = filter.value;
        try {
          const view = { ...getCurrentViewState(), name: "Test view", selectedCode: "ARG" };
          savedViews = [view];
          favoriteViews = [view];
          savedFilters = [{ name: "Asia", filters: { continent: "Asia" } }];
          renderSavedViews();
          renderFavoriteViews();
          renderSavedFilters();
          applySavedView = () => calls.push("view");
          applyFilters = () => calls.push("filters");
          for (const id of ["saved-views-select", "favorite-views-select", "saved-filters-select"]) {
            const control = document.getElementById(id);
            control.value = "";
            control.dispatchEvent(new Event("change", { bubbles: true }));
          }
          const emptyCalls = calls.length;
          const unchanged = filter.value === filterValue;
          for (const id of ["saved-views-select", "favorite-views-select", "saved-filters-select"]) {
            const control = document.getElementById(id);
            control.value = "0";
            control.dispatchEvent(new Event("change", { bubbles: true }));
          }
          return { emptyCalls, calls, unchanged };
        } finally {
          applySavedView = restoreView;
          applyFilters = restoreFilters;
          savedViews = original.views;
          favoriteViews = original.favorites;
          savedFilters = original.filters;
          filter.value = filterValue;
          renderSavedViews();
          renderFavoriteViews();
          renderSavedFilters();
        }
      });
      assert.equal(savedControls.emptyCalls, 0, "empty placeholders must not restore any saved configuration");
      assert.equal(savedControls.unchanged, true, "an empty saved filter must not change the filter inputs");
      assert.deepEqual(savedControls.calls, ["view", "view", "filters"], "real first options retain their event wiring");
      await submitSearch(page, "Argentina");
      await waitForCountryPanel(page, "Argentina");
      const savedViewPayload = await page.evaluate(() => {
        const panel = currentPanelState;
        try {
          currentPanelState = { type: "continent", continent: "Asia", countries: [{ name: "Fixture", summary: "x".repeat(100000) }] };
          document.getElementById("save-view-button").click();
          document.getElementById("save-favorite-button").click();
          const views = localStorage.getItem(STORAGE_KEYS.views);
          const favorites = localStorage.getItem(STORAGE_KEYS.favorites);
          const loaded = window.GeoRiskStore.readPreferences(readLocalPreference, STORAGE_KEYS, Object.keys(THEME_STYLES));
          return { viewsBytes: new TextEncoder().encode(views).length,
            favoritesBytes: new TextEncoder().encode(favorites).length,
            hasPanel: Object.hasOwn(JSON.parse(views)[0], "panelState") || Object.hasOwn(JSON.parse(favorites)[0], "panelState"),
            restored: [loaded.savedViews[0].mapMode, loaded.favoriteViews[0].mapMode] };
        } finally { currentPanelState = panel; }
      });
      assert.equal(savedViewPayload.hasPanel, false, "real save controls must not serialize irrelevant country datasets");
      assert.ok(savedViewPayload.viewsBytes < 2000 && savedViewPayload.favoritesBytes < 3000);
      assert.ok(savedViewPayload.restored.every(mode => mode === (viewport.width <= 820 ? "2d" : "3d")));
      // Reuse this page to hold the real overlay load until each saved selector is checked.
      for (const [control, code] of [["saved-views-select", "ESP"], ["favorite-views-select", "ARG"]]) {
        const targetMode = await page.evaluate(({ control, code }) => {
          const original = { load: loadMap, select: selectSearchResult, views: savedViews, favorites: favoriteViews };
          let release;
          const gate = new Promise(resolve => { release = resolve; });
          const probe = { release, loads: 0, selections: [], original, fail: control === "favorite-views-select" };
          window.__savedMapTransition = probe;
          loadMap = async (...args) => {
            probe.loads++;
            await gate;
            if (probe.fail) { probe.fail = false; throw new Error("saved-view overlay failure fixture"); }
            return original.load(...args);
          };
          selectSearchResult = async result => { probe.selections.push(result.value); return original.select(result); };
          const mode = currentMapMode === "2d" ? "3d" : "2d";
          const view = { ...getCurrentViewState(), name: "Map readiness", selectedCode: code, mapMode: mode };
          if (control === "saved-views-select") { savedViews = [view]; renderSavedViews(); }
          else { favoriteViews = [view]; renderFavoriteViews(); }
          const select = document.getElementById(control);
          select.value = "0";
          select.dispatchEvent(new Event("change", { bubbles: true }));
          return mode;
        }, { control, code });
        try {
          await page.waitForFunction(() => window.__savedMapTransition.loads === 1);
          assert.deepEqual(await page.evaluate(() => window.__savedMapTransition.selections), [],
            "a saved selector must not open its country before the held overlay finishes");
          assert.equal(await page.evaluate(() => Boolean(pendingMapModeChange)), true);
          await page.evaluate(() => window.__savedMapTransition.release());
          if (control === "favorite-views-select") {
            await page.waitForFunction(() => pendingMapModeChange === null);
            assert.deepEqual(await page.evaluate(() => window.__savedMapTransition.selections), [],
              "a failed overlay must not apply its country");
            assert.notEqual(await page.evaluate(() => activeGeoJsonMode), targetMode);
            await page.evaluate(() => document.getElementById("favorite-views-select").dispatchEvent(new Event("change", { bubbles: true })));
          }
          await waitForMapMode(page, targetMode);
          await waitForCountryPanel(page, code === "ESP" ? "Espa" : "Argentina");
          await page.waitForFunction(code => selectedLayers.length === 1 && selectedLayers[0].code === code, code);
          assert.deepEqual(await page.evaluate(() => window.__savedMapTransition.selections), [code]);
          assert.equal(await page.evaluate(() => window.__savedMapTransition.loads), control === "favorite-views-select" ? 2 : 1);
          assert.equal(await page.evaluate(() => pendingMapModeChange), null);
          assert.equal(await page.evaluate(() => cancelPendingMapTransition), null);
          assert.equal(await page.evaluate(() => viewer.useDefaultRenderLoop), true);
        } finally {
          await page.evaluate(() => {
            const probe = window.__savedMapTransition;
            probe.release();
            loadMap = probe.original.load;
            selectSearchResult = probe.original.select;
            savedViews = probe.original.views;
            favoriteViews = probe.original.favorites;
            renderSavedViews();
            renderFavoriteViews();
            delete window.__savedMapTransition;
          });
        }
      }
      await page.evaluate(async () => {
        await activateCountrySection("country-section-sources");
        window.__sourceMetadataOriginal = countriesData.ARG.metadata;
        countriesData.ARG.metadata = {
          sources: { general: ["population.csv", " population.csv ", '<img src=x onerror="window.geoRiskInjected=true">'] },
          quality: { score: 999, sectionStatus: { general: "confirmed", history: "base", politics: "curated", economy: "mixed" } },
          provenance: { sections: { symbols: { status: "fallback" } } }
        };
        await renderCountry(countriesData.ARG, countriesData.ARG.name);
      });
      const sources = page.locator("#country-section-sources");
      try {
        assert.equal(await sources.locator("[data-source-section]").count(), 8);
        assert.equal(await sources.locator("img, script").count(), 0);
        assert.equal(await sources.locator('[data-source-section="general"] [data-section-sources]').textContent(),
          'population.csv, <img src=x onerror="window.geoRiskInjected=true">');
        assert.match(await sources.locator('[data-source-section="general"]').textContent(), /Declarado confirmado/);
        assert.match(await sources.locator('[data-source-section="history"]').textContent(), /Revision pendiente: Sin fuentes de seccion registradas/);
        assert.match(await sources.locator('[data-source-section="politics"]').textContent(), /Revisado internamente/);
        assert.match(await sources.locator('[data-source-section="economy"]').textContent(), /Mixto: incluye estimaciones/);
        assert.match(await sources.locator('[data-source-section="symbols"]').textContent(), /Dato de respaldo/);
        const text = await sources.textContent();
        assert.match(text, /Dataset actualizado:\s*Sin datos/);
        assert.match(text, /Campos faltantes:\s*Sin evaluacion registrada/);
        assert.match(text, /100\/100/);
        assert.ok(!/999\/100|2026-04-(06|16)|chequeos locales.*pasando/.test(text));
        await page.evaluate(() => {
          const select = document.getElementById("language-select");
          select.value = "en";
          select.dispatchEvent(new Event("change", { bubbles: true }));
        });
        await page.waitForFunction(() => document.querySelector('[data-source-section="history"]')?.textContent.includes("Review pending"));
        assert.match(await sources.textContent(), /Dataset updated:\s*No data/);
        assert.match(await sources.textContent(), /Missing fields:\s*No assessment recorded/);
        assert.match(await sources.locator('[data-source-section="history"]').textContent(), /No section sources recorded/);
        assert.match(await sources.locator('[data-source-section="symbols"]').textContent(), /Fallback data/);
      } finally {
        await page.evaluate(async () => {
          countriesData.ARG.metadata = window.__sourceMetadataOriginal;
          delete window.__sourceMetadataOriginal;
          const select = document.getElementById("language-select");
          select.value = "es";
          select.dispatchEvent(new Event("change", { bubbles: true }));
        });
        await page.waitForFunction(() => {
          const text = document.getElementById("country-section-sources")?.textContent || "";
          const sourceText = document.querySelector("#country-section-sources .data-source-list")?.textContent || "";
          return text.includes("Fuentes y trazabilidad por seccion") && sourceText && !sourceText.includes("window.geoRiskInjected=true");
        });
      }
      assert.match(await sources.textContent(), /no certifica exactitud ni vigencia/);
      assert.match(await sources.textContent(), /trazabilidad interna, no verificacion externa/);
      assert.equal(await sources.locator(".data-source-list").evaluate(element => element.scrollWidth <= element.clientWidth), true,
        "source lineage and translated statuses must wrap on mobile");
      await captureLiveElement(page, sources.locator(".data-source-list"), {
        path: `tmp/country-sources-${viewport.width}.png`, timeout: 10000
      });
      await page.evaluate(async () => {
        await ensureDeferredUiModule("news");
        const text = '<img src=x onerror="window.geoRiskInjected=true">';
        renderNewsArticle({ title: text, summary: text, source: text, url: "javascript:window.geoRiskInjected=true" }, countriesData.ARG, [
          { title: text, summary: text, source: text, url: "javascript:window.geoRiskInjected=true" },
          { title: text, source: text, date: text, url: "data:text/html,<script>window.geoRiskInjected=true</script>" }
        ]);
      });
      await page.locator('[data-country-notes="ARG"]').waitFor({ state: "attached" });
      assert.equal(await page.locator('[data-country-notes="ARG"]').inputValue(), '</textarea><img src=x onerror="window.geoRiskInjected=true">');
      assert.equal(await page.locator("#news-hub-article img, #news-hub-article script, #search-memory img, .country-local-tools img").count(), 0);
      for (const href of await page.locator("#news-hub-article a").evaluateAll(links => links.map(link => link.href))) {
        assert.match(href, /^https?:\/\//, "news must reject active URL schemes");
      }
      const externalLinks = await page.evaluate(() => {
        const probe = document.createElement("div");
        probe.innerHTML = renderConflictHierarchySources([
          "Referencia bibliografica sin URL", { label: "Sin URL", url: " " },
          { label: "Ruta relativa", url: "/ruta" },
          { label: "Credenciales", url: "https://editorial.example@destino.example/" },
          { label: '<img src=x onerror="window.geoRiskInjected=true">', url: "https://fuente.example/nota?a=1&b=2" }
        ]);
        const sourceLinks = [...probe.querySelectorAll("a")].map(link => link.href);
        const sourceImages = probe.querySelectorAll("img").length;
        const text = probe.textContent;
        const fallback = getCountryNewsUrl(countriesData.ARG);
        const newsLinks = [];
        for (const url of ["", " ", "/ruta", "//fuente.example/", "https://editorial.example@destino.example/"]) {
          const item = { title: "Noticia de prueba", summary: "Resumen", source: "Fuente", url };
          renderNewsArticle(item, countriesData.ARG, [item, item]);
          newsLinks.push(...[...document.querySelectorAll("#news-hub-article a")].map(link => link.href));
        }
        return { sourceLinks, sourceImages, text, fallback, newsLinks };
      });
      assert.deepEqual(externalLinks.sourceLinks, ["https://fuente.example/nota?a=1&b=2"]);
      assert.equal(externalLinks.sourceImages, 0);
      assert.match(externalLinks.text, /Referencia bibliografica sin URL/);
      assert.equal(externalLinks.newsLinks.length, 10);
      assert.ok(externalLinks.newsLinks.every(url => url === externalLinks.fallback), "invalid news links must use the curated search URL");
      await page.evaluate(() => {
        compareSelection = ["ARG", "BRA"];
        const name = countriesData.ARG.name;
        try {
          countriesData.ARG.name = '<img src=x onerror="window.geoRiskInjected=true">';
          openCompareModal();
        } finally {
          countriesData.ARG.name = name;
        }
      });
      assert.equal(await page.locator(".compare-modal-header-summary img").count(), 0, "country names in comparison headers must be text");
      assert.match(await page.locator(".compare-modal-header-summary").textContent(), /<img/);
      await page.waitForTimeout(200);
      assert.equal(await page.evaluate(() => window.geoRiskInjected), undefined);
      assertHealthyPage(test.pageErrors, "untrusted inputs " + viewport.width);
    } finally {
      await test.context.close();
    }
  }
}

async function testStorageFailures(browser, baseUrl) {
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    for (const failure of ["quota", "denied"]) {
      const test = await createTestPage(browser, baseUrl, viewport, page => page.addInitScript(mode => {
        const storage = window.localStorage;
        storage.setItem("geo-risk-intro-seen", "true");
        storage.setItem("geo-risk-country-notes:ARG", "Nota anterior");
        const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
        const originalSet = Storage.prototype.setItem;
        if (mode === "denied") {
          Object.defineProperty(window, "localStorage", { configurable: true, get() { throw new DOMException("Blocked", "SecurityError"); } });
        } else {
          Storage.prototype.setItem = function () { throw new DOMException("Full", "QuotaExceededError"); };
        }
        window.__restoreTestStorage = () => {
          Object.defineProperty(window, "localStorage", descriptor);
          Storage.prototype.setItem = originalSet;
        };
      }, failure));
      try {
        const { page } = test;
        await waitForAppReady(page, { requireTiles: false });
        if (await page.locator("#intro-modal").isVisible()) {
          await page.locator("#intro-modal-close").click();
        }
        await submitSearch(page, "Argentina");
        await waitForCountryPanel(page, "Argentina");
        await page.locator('[data-country-nav="country-section-sources"]').click();
        const notes = page.locator('[data-country-notes="ARG"]');
        await notes.waitFor({ state: "visible" });
        if (failure === "quota") assert.equal(await notes.inputValue(), "Nota anterior");
        await notes.fill("Borrador no persistido");
        assert.match(await page.locator("[data-country-notes-status]").textContent(), /No se guardaron/);
        for (const section of ["country-section-general", "country-section-sources"]) {
          const previousInput = await notes.elementHandle();
          try {
            await page.locator(`[data-country-nav="${section}"]`).click();
            await page.waitForFunction(element => !element.isConnected, previousInput);
          } finally {
            await previousInput.dispose();
          }
        }
        assert.equal(await notes.inputValue(), "Borrador no persistido", "a section rerender must keep the unsaved draft");
        assert.match(await page.locator("[data-country-notes-status]").textContent(), /No se guardaron/);
        assert.equal(await page.locator("[data-country-notes-status]").evaluate(element => element.scrollWidth <= element.clientWidth), true, "the failure notice must wrap on mobile");
        await captureLiveElement(page, page.locator(".country-local-tools"), {
          path: `tmp/storage-${failure}-${viewport.width}-unsaved.png`, timeout: 10000
        });
        assert.equal(await notes.inputValue(), "Borrador no persistido", "capture must not hide a lost draft during a deferred render");
        assert.match(await page.locator("[data-country-notes-status]").textContent(), /No se guardaron/);
        assert.equal(await page.locator("[data-country-notes-status]").evaluate(element => element.scrollWidth <= element.clientWidth), true);
        await page.locator('[data-country-favorite="ARG"]').click();
        assert.match(await page.locator("#app-toast").textContent(), /No se pudo guardar/);
        await page.evaluate(() => {
          setAutoRotateState(true);
          if (!document.getElementById("auto-rotate-button").classList.contains("is-active")) throw new Error("rotation control did not update");
          setAutoRotateState(false);
          saveCurrentSearch("Argentina");
          renderQuizPanel();
        });
        await page.evaluate(() => window.__restoreTestStorage());
        assert.equal(await page.evaluate(() => localStorage.getItem("geo-risk-country-notes:ARG")), "Nota anterior", "failed writes must not erase the stored note");
        await notes.fill("Nota recuperada");
        assert.match(await page.locator("[data-country-notes-status]").textContent(), /Notas guardadas/);
        assert.equal(await page.evaluate(() => localStorage.getItem("geo-risk-country-notes:ARG")), "Nota recuperada");
        await page.screenshot({ path: `tmp/storage-${failure}-${viewport.width}.png` });
        assertHealthyPage(test.pageErrors, `storage ${failure} ${viewport.width}`);
      } finally {
        await test.context.close();
      }
    }
  }
}

async function testFirstWorkerActivation(browser, baseUrl) {
  const context = await browser.newContext({ viewport: MOBILE_VIEWPORT, isMobile: true, hasTouch: true, serviceWorkers: "allow" });
  let releaseWorker;
  heldWorkerRequest = new Promise(resolve => { releaseWorker = resolve; });
  const errors = [];
  try {
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => {
      localStorage.setItem("geo-risk-intro-seen", "true");
      sessionStorage.setItem("test-boot-count", String(Number(sessionStorage.getItem("test-boot-count") || 0) + 1));
    });
    await page.goto(baseUrl + "/index.html", { waitUntil: "domcontentloaded" });
    await waitForAppReady(page);
    await submitSearch(page, "Argentina");
    await waitForCountryPanel(page, "Argentina");
    assert.equal(await page.evaluate(() => navigator.serviceWorker.controller), null);
    releaseWorker();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await page.waitForTimeout(1000);
    await waitForCountryPanel(page, "Argentina");
    assert.equal(await page.evaluate(() => sessionStorage.getItem("test-boot-count")), "1", "el worker real no debe reiniciar el mapa ni perder la ficha");
    assert.equal(await page.locator("#offline-update-notice").isVisible(), false);
    await closeCountryPanel(page);
    testWorkerRevision = "fixture-ui-update";
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
    await page.locator("#offline-update-notice").waitFor({ state: "visible" });
    for (const [label, viewport] of [["mobile", MOBILE_VIEWPORT], ["desktop", DESKTOP_VIEWPORT]]) {
      await page.setViewportSize(viewport);
      const notice = page.locator("#offline-update-notice");
      const bounds = await notice.boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= viewport.width && bounds.y + bounds.height <= viewport.height);
      assert.equal(await notice.evaluate(element => element.scrollWidth <= element.clientWidth), true);
      for (const selector of ["#map-mode-toggle", "#mobile-panel-controls"]) {
        const control = page.locator(selector);
        if (!await control.isVisible()) continue;
        const target = await control.boundingBox();
        assert.ok(bounds.x + bounds.width <= target.x || bounds.x >= target.x + target.width ||
          bounds.y + bounds.height <= target.y || bounds.y >= target.y + target.height,
          label + " el aviso no debe tapar " + selector);
      }
      await page.screenshot({ path: "tmp/offline-update-app-" + label + ".png" });
    }
    await page.locator("#offline-update-dismiss").click();
    assert.equal(await page.locator("#offline-update-notice").isVisible(), false);
    assert.equal(await page.evaluate(() => sessionStorage.getItem("test-boot-count")), "1");
    await submitSearch(page, "Argentina");
    await waitForCountryPanel(page, "Argentina");
    assertHealthyPage(errors, "primera activacion con service worker real");
  } finally {
    releaseWorker();
    heldWorkerRequest = null;
    testWorkerRevision = null;
    await context.close();
  }
}

async function testPagesBuild(browser) {
  const publicServer = createLocalSmokeServer({ root: "dist/public" });
  const serve = publicServer.listeners("request")[0];
  publicServer.removeListener("request", serve);
  publicServer.on("request", (request, response) => {
    if (!request.url.startsWith("/GeoRisk/")) {
      response.writeHead(404);
      response.end();
      return;
    }
    request.url = request.url.slice("/GeoRisk".length);
    void serve(request, response);
  });
  await new Promise(resolve => publicServer.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${publicServer.address().port}/GeoRisk`;
  try {
    for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
      const failures = [];
      const test = await createTestPage(browser, base, viewport, async page => {
        page.on("response", response => {
          if (response.url().startsWith(base) && response.status() >= 400) failures.push(response.url());
        });
      });
      try {
        await waitForAppReady(test.page, { requireTiles: false });
        await submitSearch(test.page, "Argentina");
        await waitForCountryPanel(test.page, "Argentina");
        await test.page.waitForFunction(() => countriesData.ARG.metadata.isIndex !== true);
        assert.deepEqual(await test.page.evaluate(() => selectedLayers.map(layer => layer.code)), ["ARG"]);
        assert.deepEqual(failures, [], "El build bajo /GeoRisk/ no debe pedir archivos ausentes");
        assertHealthyPage(test.pageErrors, "Pages build");
        await test.page.screenshot({ path: `tmp/pages-${viewport.width}.png` });
      } finally {
        await test.context.close();
      }
    }
  } finally {
    await new Promise(resolve => publicServer.close(resolve));
  }
}

let heldWorkerRequest = null;
let testWorkerRevision = null;
const focusedFlows = [
  ["--pages-only", testPagesBuild],
  ["--country-text-only", testCountryTextRendering],
  ["--csp-only", testContentSecurityPolicy],
  ["--input-security-only", testUntrustedInputs],
  ["--storage-only", testStorageFailures],
  ["--exports-only", testSecureExports],
  ["--share-only", testShareLifecycle],
  ["--deferred-only", testDeferredUiRecovery],
  ["--performance-only", testIdleMapPerformance],
  ["--green-only", testGreenCoding],
  ["--motion-only", testReducedMapMotion],
  ["--auto-rotation-only", testAutoRotation],
  ["--map-labels-only", testMapLabels],
  ["--startup-only", testMapEngineStartup],
  ["--startup-only", testControlsStartup],
  ["--overlay-ready-only", testCountryOverlayReadiness],
  ["--conflict-curation-only", testConflictCurationAndLateResponse],
  ["--detail-only", testDetailedMapUpgrade],
  ["--recovery-only", testRenderRecovery],
  ["--offline-only", testFirstWorkerActivation],
  ["--data-only", testRequiredStartupData],
  ["--country-data-only", testCountryDataRecovery],
  ["--news-only", testNewsLifecycle],
  ["--scheduler-only", testDeferredWorkDuringDrag],
  ["--panels-only", testBackgroundPanels]
];
const focused = focusedFlows.some(([flag]) => process.argv.includes(flag));
const journeysOnly = process.argv.includes("--journeys-only");
const selectedFlows = focusedFlows.filter(([flag]) => !journeysOnly && (!focused || process.argv.includes(flag)));
const runReport = await createBrowserRunReport({
  file: "reports/critical-browser-e2e.json",
  flows: [...selectedFlows.map(([_flag, run]) => run.name), ...(!focused ? ["desktop journey", "mobile journey"] : [])],
  scope: focused ? "focused" : journeysOnly ? "journeys" : "full",
  metadata: { platform: process.platform, nodeVersion: process.version,
    ciRunId: process.env.GITHUB_RUN_ID || null, ciRevision: process.env.GITHUB_SHA || null }
});

let browser;
let server;
try {
  assert.ok(!journeysOnly || !focused, "--journeys-only no se combina con otros filtros");
  const nativeWorkerSource = await fs.readFile("sw.js", "utf8");
  server = createLocalSmokeServer();
  const staticRequest = server.listeners("request")[0];
  server.removeListener("request", staticRequest);
  server.on("request", async (request, response) => {
    if (heldWorkerRequest && request.url.startsWith("/sw.js")) await heldWorkerRequest;
    if (testWorkerRevision && request.url.startsWith("/sw.js")) {
      response.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-store" });
      response.end(nativeWorkerSource.replace(/const CACHE_VERSION = "[^"]+"/, `const CACHE_VERSION = "${testWorkerRevision}"`));
      return;
    }
    void staticRequest(request, response);
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  await fs.mkdir("tmp", { recursive: true });
  const { port } = server.address();
  const baseUrl = "http://127.0.0.1:" + port;
  browser = await launchCriticalBrowser();
  await runReport.setBrowser(getBrowserSelection(browser));
  for (const [_flag, run] of selectedFlows) {
    console.log("critical-browser-e2e: " + run.name);
    const started = performance.now();
    await runReport.run(run.name, () => run(browser, baseUrl));
    console.log("critical-browser-e2e: " + run.name + " completed in " + Math.round(performance.now() - started) + " ms");
  }

  if (!focused) {
    console.log("critical-browser-e2e: desktop journey");
    const desktopStarted = performance.now();
    await runReport.run("desktop journey", async () => {
      const desktop = await createTestPage(browser, baseUrl, DESKTOP_VIEWPORT);
      try {
        await runDesktopCriticalFlow(desktop.page);
        assertHealthyPage(desktop.pageErrors, "desktop");
      } finally {
        await desktop.context.close();
      }
    });
    console.log("critical-browser-e2e: desktop journey completed in " + Math.round(performance.now() - desktopStarted) + " ms");

    console.log("critical-browser-e2e: mobile journey");
    const mobileStarted = performance.now();
    await runReport.run("mobile journey", async () => {
      const mobile = await createTestPage(browser, baseUrl, MOBILE_VIEWPORT);
      try {
        await runMobileCriticalFlow(mobile.page);
        assertHealthyPage(mobile.pageErrors, "mobile");
      } finally {
        await mobile.context.close();
      }
    });
    console.log("critical-browser-e2e: mobile journey completed in " + Math.round(performance.now() - mobileStarted) + " ms");
  }
} catch (error) {
  await runReport.fail(error);
  throw error;
} finally {
  try {
    try {
      await browser?.close();
    } finally {
      console.log("critical-browser-e2e: tile cache " + JSON.stringify(tileCache.stats()));
      tileCache.close();
      if (server?.listening) await new Promise(resolve => server.close(resolve));
    }
  } catch (error) {
    await runReport.fail(error);
    throw error;
  }
}
await runReport.finish();

console.log("critical-browser-e2e.test.js ok");
