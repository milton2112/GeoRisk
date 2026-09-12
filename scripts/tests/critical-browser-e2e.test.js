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
  });
  await beforeNavigate(page);
  await page.goto(baseUrl + "/index.html?critical-e2e=1", {
    waitUntil: "domcontentloaded",
    timeout: APP_TIMEOUT_MS
  });
  return { context, page, pageErrors };
}

async function waitForAppReady(page, { requireTiles = true } = {}) {
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

async function testMapEngineStartup(browser, baseUrl) {
  for (const scenario of ["slow", "failure", "early-failure", "timeout", "loader-missing", "no-frame"]) {
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
      await page.route("**/Build/Cesium/index.js", async route => {
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
        await page.screenshot({ path: "tmp/startup-engine-slow-mobile.png" });
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
          await page.evaluate(() => import(window.CESIUM_BASE_URL + "index.js").then(() => true));
          assert.equal(await page.evaluate(() => viewer), null, "la respuesta tardia no construye el visor");
          assert.equal(await page.evaluate(() => typeof window.Cesium), "undefined");
        }
        if (scenario === "no-frame") assert.match(await page.locator("#fatal-error-banner").innerText(), /mapa no pudo mostrarse/);
        assert.equal(engineRequests, scenario === "loader-missing" ? 0 : 1, "un intento no duplica la descarga");
        await page.screenshot({ path: "tmp/startup-engine-" + scenario + "-mobile.png" });
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
    await page.screenshot({ path: "tmp/startup-before-runtime-mobile.png" });
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
    await page.screenshot({ path: "tmp/startup-deferred-mobile.png" });
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
    await page.screenshot({ path: "tmp/intro-mobile.png" });
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
      await page.screenshot({ path: "tmp/startup-failed-" + moduleName + "-mobile.png" });
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

async function testIdleMapPerformance(browser, baseUrl) {
  let releaseTiles;
  let requests = 0;
  const held = new Promise(resolve => { releaseTiles = resolve; });
  const { context, page, pageErrors } = await createTestPage(browser, baseUrl, DESKTOP_VIEWPORT, async page => {
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
    let releaseIndex;
    const heldIndex = new Promise(resolve => { releaseIndex = resolve; });
    const slow = await createTestPage(browser, baseUrl, MOBILE_VIEWPORT, async page => {
      await page.route(pattern, async route => { await heldIndex; await route.continue(); });
    });
    try {
      await slow.page.waitForFunction(() => typeof bootMetrics !== "undefined" && bootMetrics.steps.mapBootReady?.end);
      await slow.page.waitForTimeout(650);
      await slow.page.screenshot({ path: "tmp/startup-" + name + "-pending-mobile.png" });
      assert.equal(await slow.page.locator("#map-search-input").isVisible(), false, "no habilitar controles mientras faltan los paises");
      assert.equal(await slow.page.locator("#startup-status").isVisible(), true);
      assert.equal(await slow.page.evaluate(() => bootMetrics.completedAt), 0);
      await slow.page.evaluate(() => { window.__pendingCamera = Cesium.Cartesian3.clone(viewer.camera.position); });
      await slow.page.mouse.move(150, 420);
      await slow.page.mouse.down();
      await slow.page.mouse.move(240, 420, { steps: 8 });
      await slow.page.mouse.up();
      await slow.page.waitForFunction(() => Cesium.Cartesian3.distance(viewer.camera.position, window.__pendingCamera) > 10);
      releaseIndex();
      await waitForAppReady(slow.page);
      await submitSearch(slow.page, "Argentina");
      await waitForCountryPanel(slow.page, "Argentina");
      assertHealthyPage(slow.pageErrors, name + " inicial lento");
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
        await page.evaluate(supported => {
          window.requestIdleCallback = supported ? window.__originalIdleCallback : undefined;
          window.__quietTaskRuns = [];
        }, idleSupported);
        const x = viewport.width * 0.52;
        const y = viewport.height * 0.52;
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 25, y + 5, { steps: 6 });
        await page.waitForFunction(() => isCameraNavigating, undefined, { timeout: 3000 });
        await page.evaluate(() => {
          window.__cancelQuietProbe = scheduleWhenGlobeIsQuiet(() => {
            window.__quietTaskRuns.push({ navigating: isCameraNavigating, visibility: document.visibilityState });
          }, { delay: 0, quietFor: 100, timeout: 100 });
        });
        for (let step = 1; step <= 6; step += 1) {
          await page.mouse.move(x + 25 + step * 12, y + 5 + step * 3, { steps: 4 });
          await page.waitForTimeout(70);
          assert.equal(await page.evaluate(() => window.__quietTaskRuns.length), 0, label + " no debe forzar trabajo durante un arrastre mayor al deadline");
        }
        await page.mouse.up();
        await page.waitForFunction(() => window.__quietTaskRuns.length === 1, undefined, { timeout: 8000 });
        const runs = await page.evaluate(() => window.__quietTaskRuns);
        assert.deepEqual(runs, [{ navigating: false, visibility: "visible" }]);
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
    ["--performance-only", testIdleMapPerformance],
    ["--startup-only", testMapEngineStartup],
    ["--startup-only", testControlsStartup],
    ["--detail-only", testDetailedMapUpgrade],
    ["--recovery-only", testRenderRecovery],
    ["--offline-only", testFirstWorkerActivation],
    ["--data-only", testRequiredStartupData],
    ["--country-data-only", testCountryDataRecovery],
    ["--scheduler-only", testDeferredWorkDuringDrag]
  ];
  const focused = focusedFlows.some(([flag]) => process.argv.includes(flag));
  for (const [flag, run] of focusedFlows) {
    if (!focused || process.argv.includes(flag)) await run(browser, baseUrl);
  }

  if (!focused) {
    const desktop = await createTestPage(browser, baseUrl, DESKTOP_VIEWPORT);
    try {
      await runDesktopCriticalFlow(desktop.page);
      assertHealthyPage(desktop.pageErrors, "desktop");
    } finally {
      await desktop.context.close();
    }

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
