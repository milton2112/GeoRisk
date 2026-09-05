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

async function createTestPage(browser, baseUrl, viewport) {
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
  await page.goto(baseUrl + "/index.html?critical-e2e=1", {
    waitUntil: "domcontentloaded",
    timeout: APP_TIMEOUT_MS
  });
  return { context, page, pageErrors };
}

async function waitForAppReady(page) {
  await page.waitForFunction(() => {
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
      fatal?.hidden !== false
    );
  }, undefined, { timeout: APP_TIMEOUT_MS });
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
  assert.equal(await page.evaluate(() => viewer.scene.mode === Cesium.SceneMode.SCENE3D), true, "desktop debe iniciar en una escena 3D real");
  await page.screenshot({ path: "tmp/map-desktop.png" });

  await setMapMode(page, "2d");
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
  await setMapMode(page, "2d");
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

const server = createLocalSmokeServer();
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));

let browser;
try {
  await fs.mkdir("tmp", { recursive: true });
  const { port } = server.address();
  const baseUrl = "http://127.0.0.1:" + port;
  browser = await launchCriticalBrowser();

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
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}

console.log("critical-browser-e2e.test.js ok");
