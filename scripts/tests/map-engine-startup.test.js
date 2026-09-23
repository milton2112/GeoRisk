import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const engineSource = await fs.readFile("app-map-engine.js", "utf8");
const script = await fs.readFile("script.js", "utf8");
const browserTests = await fs.readFile("scripts/tests/critical-browser-e2e.test.js", "utf8");
const capture = vm.runInNewContext(browserTests.slice(browserTests.indexOf("async function captureStartupState("),
  browserTests.indexOf("async function testMapEngineStartup(")) + "\ncaptureStartupState;", { console: { warn() {} } });
for (const failure of ["none", "transient", "persistent", "other", "closed"]) {
  let calls = 0;
  let waits = 0;
  let paintWaits = 0;
  const buffer = Buffer.from("captured");
  const page = {
    isClosed: () => failure === "closed",
    async waitForFunction(predicate, argument, options) {
      assert.equal(options.timeout, 10000);
      for (const painted of [false, true]) {
        assert.equal(vm.runInNewContext(`(${predicate})()`, { performance: {
          getEntriesByName(name) { assert.equal(name, "first-contentful-paint"); return painted ? [{}] : []; }
        } }), painted);
      }
      paintWaits++;
    },
    async waitForTimeout(ms) { assert.equal(ms, 250); waits++; },
    async screenshot(options) {
      calls++;
      assert.equal(options.path, "tmp/test.png");
      assert.equal(options.timeout, 10000);
      if (failure === "other") throw new Error("Page crashed");
      if (failure !== "none" && (failure !== "transient" || calls === 1)) {
        throw new Error("Protocol error (Page.captureScreenshot): Unable to capture screenshot");
      }
      return buffer;
    }
  };
  if (["none", "transient"].includes(failure)) assert.equal(await capture(page, "tmp/test.png"), buffer);
  else await assert.rejects(capture(page, "tmp/test.png"));
  assert.equal(calls, ["transient", "persistent"].includes(failure) ? 2 : 1);
  assert.equal(paintWaits, 1, "esperar un primer pintado real antes de capturar");
  assert.equal(waits, calls - 1, "no reintentar crashes, paginas cerradas ni fallos persistentes mas de una vez");
}
{
  const error = new Error("No hubo primer pintado");
  await assert.rejects(capture({
    async waitForFunction() { throw error; },
    screenshot() { assert.fail("no intentar capturar una pagina que no se dibujo"); }
  }, "tmp/test.png"), error);
}
const frameSource = script.slice(script.indexOf("async function waitForMapBootReady("), script.indexOf("function scheduleDetailedOverlayUpgrade("));
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const flush = async () => { for (let i = 0; i < 8; i += 1) await Promise.resolve(); };
function timers() {
  const tasks = new Map();
  let nextId = 0;
  return {
    tasks,
    setTimeout(fn, delay) { const id = ++nextId; tasks.set(id, { fn, delay }); return id; },
    clearTimeout(id) { tasks.delete(id); },
    fire(delay) { const [id, task] = [...tasks].find(([, item]) => item.delay === delay); tasks.delete(id); task.fn(); }
  };
}
function engineFixture(overrides = {}) {
  const clock = timers();
  const document = { currentScript: { src: "https://example.test/GeoRisk/app-map-engine.js?v=release-test" }, documentElement: { lang: "es" }, ...overrides.document };
  const context = { window: {}, console, URL, localStorage: { getItem: () => "es" }, ...clock, ...overrides, document };
  vm.runInNewContext(engineSource, context);
  return { api: context.window.GeoRiskMapEngine, context, clock };
}
const validEngine = { Viewer() {}, SceneMode: { SCENE2D: 2, SCENE3D: 3 }, GeoJsonDataSource: {} };
{
  const { api, context, clock } = engineFixture();
  assert.equal(api.url, "https://example.test/GeoRisk/vendor/cesium/engine.js?v=release-test", "motor local versionado dentro del deploy, incluso bajo subcarpeta");
  const held = deferred();
  let slow = 0, requests = 0;
  const promise = api.load({ importer: () => { requests += 1; return held.promise; }, onSlow: () => { slow += 1; } });
  assert.equal(api.load(), promise, "compartir un unico intento del motor");
  clock.fire(7000);
  assert.equal(api.getState().phase, "slow");
  assert.equal(slow, 1);
  held.resolve(validEngine);
  assert.equal(await promise, validEngine);
  assert.equal(context.window.Cesium, validEngine);
  assert.equal(requests, 1);
  assert.equal(api.getState().phase, "ready");
  assert.equal(clock.tasks.size, 0);
}
for (const settlesLate of ["resolve", "reject"]) {
  const { api, context, clock } = engineFixture();
  const held = deferred();
  const promise = api.load({ importer: () => held.promise });
  const rejected = assert.rejects(promise, /tardando demasiado/);
  clock.fire(30000);
  await rejected;
  assert.equal(clock.tasks.size, 0);
  held[settlesLate](settlesLate === "resolve" ? validEngine : new Error("late failure"));
  await flush();
  assert.equal(context.window.Cesium, undefined, "no publicar un motor llegado despues del timeout");
  assert.equal(api.getState().phase, "failed");
}
for (const importer of [() => { throw new Error("network"); }, async () => null, async () => ({})]) {
  const { api, clock } = engineFixture();
  await assert.rejects(api.load({ importer }), /motor del mapa/);
  assert.equal(api.getState().phase, "failed");
  assert.equal(clock.tasks.size, 0);
}
for (const localStorage of [{ getItem: () => "en" }, { getItem() { throw new Error("Storage blocked"); } }]) {
  const { api } = engineFixture({ localStorage, document: { documentElement: { lang: "en" } } });
  assert.equal(api.language(), "en");
  await assert.rejects(api.load({ importer: () => Promise.reject(new Error("network")) }), /could not be downloaded/);
}

function event() {
  const listeners = new Set();
  return {
    listeners, addEventListener: fn => listeners.add(fn), removeEventListener: fn => listeners.delete(fn),
    emit: value => [...listeners].forEach(fn => fn(value))
  };
}
function frameFixture() {
  const clock = timers();
  const scene = { postRender: event(), globe: { tilesLoaded: false, tileLoadProgressEvent: event() } };
  let phase = "healthy";
  const viewer = { scene, useDefaultRenderLoop: true, isDestroyed: () => false, __geoRiskRenderRecovery: { getState: () => ({ phase }) } };
  const context = { viewer, currentLanguage: "es", isMobileLayout: () => true, requestSceneRender() {}, ...clock };
  vm.createContext(context);
  vm.runInContext(frameSource, context);
  return { scene, viewer, context, clock, setPhase: value => { phase = value; } };
}
for (const mode of ["no-frame", "stopped", "failed-frame", "destroyed"]) {
  const { scene, viewer, context, clock, setPhase } = frameFixture();
  const promise = context.waitForMapBootReady(5200);
  const rejected = assert.rejects(promise, /mapa no pudo mostrarse/);
  if (mode === "stopped") viewer.useDefaultRenderLoop = false;
  if (mode === "failed-frame") setPhase("waiting");
  if (mode === "destroyed") viewer.isDestroyed = () => true;
  if (mode !== "no-frame") scene.postRender.emit();
  scene.globe.tileLoadProgressEvent.emit(0);
  clock.fire(5200);
  await rejected;
  assert.equal(clock.tasks.size, 0);
  assert.equal(scene.postRender.listeners.size, 0);
  assert.equal(scene.globe.tileLoadProgressEvent.listeners.size, 0);
}
{
  const { scene, context, clock } = frameFixture();
  const promise = context.waitForMapBootReady(5200);
  scene.postRender.emit();
  clock.fire(900);
  await promise;
  assert.equal(clock.tasks.size, 0, "un frame real basta aunque sigan pendientes los tiles");
}
{
  const { scene, context, clock, setPhase } = frameFixture();
  const promise = context.waitForMapBootReady(5200);
  setPhase("waiting");
  scene.postRender.emit();
  setPhase("recovered");
  scene.postRender.emit();
  scene.globe.tileLoadProgressEvent.emit(0);
  await promise;
  assert.equal(clock.tasks.size, 0);
}
{
  const { scene, viewer, context, clock } = frameFixture();
  const promise = context.waitForMapBootReady(5200);
  const rejected = assert.rejects(promise, /mapa no pudo mostrarse/);
  scene.postRender.emit();
  viewer.useDefaultRenderLoop = false;
  context.viewer = { scene: { postRender: event(), globe: { tileLoadProgressEvent: event() } } };
  clock.fire(900);
  await rejected;
  assert.equal(scene.postRender.listeners.size, 0, "limpiar los listeners del visor original");
  assert.equal(scene.globe.tileLoadProgressEvent.listeners.size, 0);
  assert.equal(clock.tasks.size, 0);
}
console.log("map-engine-startup.test.js ok");
