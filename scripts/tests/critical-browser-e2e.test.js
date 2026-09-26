import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";
import { createLocalSmokeServer } from "../localSmokeServer.js";

const APP_TIMEOUT_MS = Number(process.env.GEORISK_E2E_TIMEOUT_MS || 45000);
const MAP_PICK_TIMEOUT_MS = Math.min(APP_TIMEOUT_MS, 8000);
const DESKTOP_VIEWPORT = { width: 1440, height: 920 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

async function launchCriticalBrowser() {
  const baseOptions = { headless: true };
  const localChannel = process.env.PLAYWRIGHT_CHANNEL || (process.env.CI ? "" : "chrome");
  const candidates = localChannel
    ? [{ ...baseOptions, channel: localChannel }, baseOptions]
    : [baseOptions, { ...baseOptions, channel: "chrome" }];
  let lastError = null;

  for (const options of candidates) {
    try {
      return await chromium.launch(options);
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    "No se pudo iniciar Chromium para la E2E critica. En CI se instala automaticamente; en local instala Chromium con Playwright o define PLAYWRIGHT_CHANNEL. " +
      (lastError?.message || "")
  );
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
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem("geo-risk-intro-seen", "true");
    window.__geoRiskCspViolations = [];
    document.addEventListener("securitypolicyviolation", event => {
      window.__geoRiskCspViolations.push({ directive: event.effectiveDirective, blockedURI: event.blockedURI });
    });
  });
  await beforeNavigate(page);
  await page.goto(baseUrl + "/index.html?critical-e2e=1", {
    waitUntil: "domcontentloaded",
    timeout: APP_TIMEOUT_MS
  });
  return { context, page, pageErrors };
}

async function waitForAppReady(page, { requireTiles = true } = {}) {
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
      const rectangle = layer?.computeRectangle?.();
      if (!layer || !rectangle || !viewer || !window.Cesium) {
        return null;
      }
      const center = Cesium.Rectangle.center(rectangle);
      const cartesian = Cesium.Cartesian3.fromRadians(center.longitude, center.latitude);
      const rawPoint = viewer.scene.cartesianToCanvasCoordinates(cartesian);
      const canvas = viewer.scene.canvas;
      const bounds = canvas.getBoundingClientRect();
      if (!rawPoint || !bounds.width || !bounds.height) {
        return null;
      }
      viewer.scene.requestRender();
      const picked = [
        viewer.scene.pick(rawPoint),
        ...(viewer.scene.drillPick(rawPoint, 8) || [])
      ].filter(Boolean);
      const pickedEntity = picked
        .map(item => item?.id || item?.primitive?.id || item?.collection?.owner || item?.primitive?._owner)
        .find(item => item?.countryCode === countryCode);
      if (!pickedEntity) {
        return null;
      }
      const x = bounds.left + rawPoint.x;
      const y = bounds.top + rawPoint.y;
      const withinCanvas = x > bounds.left + 2 &&
        x < bounds.right - 2 &&
        y > bounds.top + 2 &&
        y < bounds.bottom - 2;
      return withinCanvas ? { x, y } : null;
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
    const rectangle = layer?.computeRectangle?.();
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
  await setMapMode(page, "3d");
  await assertAntialiasingProfile(page);
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
      await setMapMode(page, "3d");
      await toolsToggle.click();
      await page.locator("#label-mode-select").selectOption("full");
      await toolsToggle.click();
      await page.evaluate(() => new Promise((resolve, reject) => {
        const remove = viewer.camera.moveEnd.addEventListener(() => { clearTimeout(timer); remove(); resolve(); });
        const timer = setTimeout(() => { remove(); reject(new Error("La camara no termino de enfocar Brasil")); }, 15000);
        focusRectangle(countryLayers.get("BRA").computeRectangle(), { instant: true });
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
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    const label = viewport === MOBILE_VIEWPORT ? "mobile" : "desktop";
    let releaseDetail;
    const pending = new Promise(resolve => { releaseDetail = resolve; });
    let markRequested;
    const requested = new Promise(resolve => { markRequested = resolve; });
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      await page.route(/\/data\/conflicts\/details\/batalla-del-cabo-de-gata-1815-/, async route => {
        markRequested();
        await pending;
        await route.continue();
      });
    });
    const { page } = test;
    try {
      await waitForAppReady(page, { requireTiles: false });
      await page.evaluate(async () => {
        await loadCountryDetail("USA");
        await loadCountryConflictDetail("USA");
        const names = ["Batalla del cabo de Gata (1815)", "Batalla naval frente a Halifax (1782)"];
        window.__curationKeys = names.map(name => registerConflictModal(countriesData.USA.military.conflicts.find(item => item.name === name), "Estados Unidos"));
        openConflictModal(window.__curationKeys[0]);
      });
      await Promise.race([requested, page.waitForTimeout(APP_TIMEOUT_MS).then(() => { throw new Error("No se solicito el detalle de Gata"); })]);
      await page.evaluate(() => openConflictModal(window.__curationKeys[1]));
      await page.waitForFunction(() => Boolean(CONFLICT_DETAIL_OVERRIDES["Batalla naval frente a Halifax (1782)"]));
      const body = page.locator("#conflict-modal-body");
      assert.match(await body.locator(".overview-card").first().innerText(), /Batalla/i);
      assert.match(await body.locator(".overview-card").nth(2).innerText(), /Local/);
      await body.locator(".conflict-curation-notes").waitFor();
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
      assertHealthyPage(test.pageErrors, label + " notas de curaduria y descarga tardia");
    } finally {
      releaseDetail();
      await test.context.close();
    }
  }
}

async function testControlsStartup(browser, baseUrl) {
  const context = await browser.newContext({ viewport: MOBILE_VIEWPORT, isMobile: true, hasTouch: true, serviceWorkers: "block" });
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
        focusRectangle(countryLayers.get("ESP").computeRectangle(), { onComplete: () => window.__motionCompletions++ });
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
    } finally {
      await test.context.close();
    }
  }
}

async function testGreenCoding(browser, baseUrl) {
  const { context, page, pageErrors } = await createTestPage(browser, baseUrl, DESKTOP_VIEWPORT, async page => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } });
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
    await page.evaluate(() => applyMapMode("3d", false));
    await waitForMapMode(page, "3d");
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
        await page.mouse.move(x + 25, y + 5, { steps: 6 });
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
        assert.equal(await page.evaluate(() => autoRotation.hasActivePointers()), true, "mantener el contacto nativo durante la pausa");
        assert.equal(await page.evaluate(() => window.__quietTaskRuns.length), 0, "un contacto sostenido no es quietud");
        for (let step = 1; step <= 6; step += 1) {
          await page.mouse.move(x + 25 + step * 12, y + 5 + step * 3, { steps: 4 });
          await page.waitForTimeout(70);
          assert.equal(await page.evaluate(() => window.__quietTaskRuns.length), 0, label + " no debe forzar trabajo durante un arrastre mayor al deadline");
        }
        await page.mouse.up();
        await page.waitForFunction(() => window.__quietTaskRuns.length === 1, undefined, { timeout: 8000 });
        const runs = await page.evaluate(() => window.__quietTaskRuns);
        assert.deepEqual(runs, [{ navigating: false, visibility: "visible", pointers: false }]);
        await page.waitForTimeout(250);
        assert.equal(await page.evaluate(() => window.__quietTaskRuns.length), 1);
      }
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
    let failArgentina = true;
    let failSpain = true;
    let failConflicts = true;
    let releaseBrazil;
    const heldBrazil = new Promise(resolve => { releaseBrazil = resolve; });
    const requests = [];
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      page.on("request", request => requests.push(request.url()));
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
        else await route.continue();
      });
    });
    const { page } = test;
    try {
      await waitForAppReady(page);
      await submitSearch(page, "Argentina");
      const retry = page.locator("[data-country-retry]");
      await retry.waitFor({ state: "visible" });
      assert.equal(await page.locator('#country-panel [aria-busy="true"]').count(), 0);
      assert.equal(await page.evaluate(() => countriesData.ARG.metadata.isIndex), true);
      assert.equal(await page.evaluate(() => selectedLayers.some(layer => layer.code === "ARG")), true);
      const error = page.locator("#country-panel .country-load-error");
      assert.equal(await error.evaluate(element => element.scrollWidth <= element.clientWidth), true);
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
      await retryConflicts.click();
      await page.waitForFunction(() => countriesData.AUS.military.conflictsComplete === true);
      await retryConflicts.waitFor({ state: "hidden" });
      assert.ok(await page.evaluate(count => countriesData.AUS.military.conflicts.length > count, preview));
      assert.ok(!requests.some(url => /countries_full|conflict_details\.generated/.test(url)));
      assertHealthyPage(test.pageErrors, label + " recuperacion de fichas y conflictos");
    } finally {
      releaseBrazil();
      await test.context.close();
    }
  }
}

async function testBackgroundPanels(browser, baseUrl) {
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    const label = viewport === MOBILE_VIEWPORT ? "mobile" : "desktop";
    const test = await createTestPage(browser, baseUrl, viewport);
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
      assertHealthyPage(test.pageErrors, label + " paneles en segundo plano");
    } finally {
      await test.context.close();
    }
  }
}

async function testSecureExports(browser, baseUrl) {
  for (const [label, viewport] of [["desktop", DESKTOP_VIEWPORT], ["mobile", MOBILE_VIEWPORT]]) {
    const requests = [];
    const test = await createTestPage(browser, baseUrl, viewport, async page => {
      page.on("request", request => requests.push(request.url()));
    });
    const { page } = test;
    try {
      await waitForAppReady(page, { requireTiles: false });
      assert.equal(requests.some(url => /vendor\/exports|html2canvas|jspdf/.test(url)), false, "no export libraries at startup");
      await page.locator(label === "mobile" ? "#toggle-left-panel" : "#rankings-summary").click();
      await page.waitForFunction(() => document.querySelectorAll("#top-population li").length > 0);
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
      const imageDownload = page.waitForEvent("download", { timeout: APP_TIMEOUT_MS });
      await page.locator('[data-export-target="left-panel"][data-export-format="png"]').click();
      const image = await imageDownload;
      const png = await fs.readFile(await image.path());
      assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
      assert.ok(png.length > 20000, label + " export image contains content");
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
      const pdfDownload = page.waitForEvent("download", { timeout: APP_TIMEOUT_MS });
      await pdfButton.click();
      const pdf = await pdfDownload;
      const pdfBytes = await fs.readFile(await pdf.path());
      assert.equal(pdfBytes.subarray(0, 5).toString(), "%PDF-");
      assert.ok(pdfBytes.length > 20000, label + " PDF includes captured image");
      assert.equal(await page.evaluate(() => window.jspdf.jsPDF.version), "4.2.1");
      assert.equal(await page.locator(".export-report-shell").count(), 0);
      assert.equal(await page.locator("script[data-export-library][integrity^='sha384-'][crossorigin='anonymous']").count(), 2);
      assert.equal(requests.some(url => /cdn.*(?:jspdf|html2canvas)/.test(url)), false);
      assert.equal(requests.filter(url => /vendor\/exports\/html2canvas.*\.js$/.test(url)).length, 1);
      assertHealthyPage(test.pageErrors, label + " verified exports");
    } finally {
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
      await page.locator("#country-section-history .timeline-item").first().click();
      await page.locator("#timeline-modal").waitFor({ state: "visible" });
      assertHealthyPage(test.pageErrors, "country text rendering " + viewport.width);
    } finally {
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
      await submitSearch(page, "Argentina");
      await waitForCountryPanel(page, "Argentina");
      await page.evaluate(async () => {
        await activateCountrySection("country-section-sources");
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
const nativeWorkerSource = await fs.readFile("sw.js", "utf8");
const server = createLocalSmokeServer();
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

let browser;
try {
  await fs.mkdir("tmp", { recursive: true });
  const { port } = server.address();
  const baseUrl = "http://127.0.0.1:" + port;
  browser = await launchCriticalBrowser();
  const focusedFlows = [
    ["--pages-only", testPagesBuild],
    ["--country-text-only", testCountryTextRendering],
    ["--csp-only", testContentSecurityPolicy],
    ["--input-security-only", testUntrustedInputs],
    ["--exports-only", testSecureExports],
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
    ["--scheduler-only", testDeferredWorkDuringDrag],
    ["--panels-only", testBackgroundPanels]
  ];
  const focused = focusedFlows.some(([flag]) => process.argv.includes(flag));
  const journeysOnly = process.argv.includes("--journeys-only");
  assert.ok(!journeysOnly || !focused, "--journeys-only no se combina con otros filtros");
  for (const [flag, run] of focusedFlows) {
    if (!journeysOnly && (!focused || process.argv.includes(flag))) {
      console.log("critical-browser-e2e: " + run.name);
      await run(browser, baseUrl);
    }
  }

  if (!focused) {
    console.log("critical-browser-e2e: desktop journey");
    const desktop = await createTestPage(browser, baseUrl, DESKTOP_VIEWPORT);
    try {
      await runDesktopCriticalFlow(desktop.page);
      assertHealthyPage(desktop.pageErrors, "desktop");
    } finally {
      await desktop.context.close();
    }

    console.log("critical-browser-e2e: mobile journey");
    const mobile = await createTestPage(browser, baseUrl, MOBILE_VIEWPORT);
    try {
      await runMobileCriticalFlow(mobile.page);
      assertHealthyPage(mobile.pageErrors, "mobile");
    } finally {
      await mobile.context.close();
    }
  }
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}

console.log("critical-browser-e2e.test.js ok");
