import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const read = name => fs.readFile(new URL(`../../${name}`, import.meta.url), "utf8");
const source = await read("script.js");
const interactions = await read("app-map-interactions.js");
const scheduler = await read("app-boot-scheduler.js");
const runtimeSource = await read("app-runtime.js");
const sandbox = vm.createContext({ window: {} });
vm.runInContext(interactions, sandbox);
const { createFpsQualityMonitor } = sandbox.window.GeoRiskMapInteractions;

{
  const state = { window: {}, navigator: {}, qualityPreset: "auto", currentMapMode: "3d", mobile: false };
  state.isMobileLayout = () => state.mobile;
  vm.createContext(state);
  vm.runInContext(runtimeSource, state);
  state.runtimeGetDeviceProfile = state.window.GeoRiskRuntime.getDeviceProfile;
  vm.runInContext(source.slice(source.indexOf("const QUALITY_PRESET_OVERRIDES"), source.indexOf("const MAP_LABEL_SETS")), state);
  vm.runInContext(source.slice(source.indexOf("function getPerformancePreset"), source.indexOf("function getDeviceTier")), state);
  for (const memory of [4, 8, 16]) for (const mobile of [false, true]) for (const mode of ["2d", "3d"]) {
    Object.assign(state, { mobile, currentMapMode: mode });
    Object.assign(state.navigator, { deviceMemory: memory, hardwareConcurrency: 12 });
    for (const quality of ["auto", "high", "balanced", "performance"]) {
      state.qualityPreset = quality;
      const preset = state.getPerformancePreset();
      assert.ok([1, 4].includes(preset.msaaSamples));
      if (quality === "high") {
        assert.equal(preset.msaaSamples, 4, "alta calidad conserva MSAA");
        assert.equal(preset.enableFxaa, true);
      } else if (quality === "performance") {
        assert.equal(preset.msaaSamples, 1);
        assert.equal(preset.enableFxaa, false);
      } else if (preset.enableFxaa) {
        assert.equal(preset.msaaSamples, 1, "auto/balanceado no duplican el suavizado FXAA con MSAA");
      } else {
        assert.equal(preset.msaaSamples, 4, "conservar suavizado si el perfil no usa FXAA");
      }
      if (quality === "auto" && mobile) assert.equal(preset.resolutionScale, mode === "2d" ? 0.5 : 0.82);
      if (quality === "auto" && !mobile && memory === 16 && mode === "3d") assert.equal(preset.resolutionScale, 1.12);
    }
  }
  vm.runInContext(source.slice(0, source.indexOf("const fallbackGetRenderProfileText")), state);
  for (const mobile of [false, true]) {
    const fallback = vm.runInContext(`fallbackGetDeviceProfile({ isMobile: ${mobile}, currentMapMode: "3d", deviceMemory: 16, hardwareConcurrency: 12 })`, state);
    assert.equal(fallback.msaaSamples, fallback.enableFxaa ? 1 : 4, "fallback conserva la politica de suavizado");
  }
  const constructor = source.slice(source.indexOf("function initializeViewer()"), source.indexOf("function fitWorldView()"));
  assert.match(constructor, /msaaSamples: preset\.msaaSamples/, "configurar MSAA antes del primer frame, no despues de crear buffers");
  const tuning = source.slice(source.indexOf("function updateMapInteractionTuning()"), source.indexOf("function updateMapModeToggle()"));
  assert.match(tuning, /viewer\.scene\.msaaSamples = preset\.msaaSamples/, "cambios de perfil/modo actualizan MSAA");
}

function controller(overrides = {}) {
  const monitor = createFpsQualityMonitor();
  const context = { visible: true, navigating: true, transitioning: false, mode: "3d",
    qualityPreset: "auto", targetFrameRate: 34, isMobile: false, tier: "high", ...overrides };
  let now = 0;
  monitor.reset(context, now);
  return {
    context,
    reset() { monitor.reset(context, now); },
    tick(fps, duration = 2500) {
      const count = Math.round(fps * duration / 1000);
      for (let i = 0; i < count; i += 1) monitor.recordFrame(context, now + i * duration / count);
      now += duration;
      return monitor.sample(context, now);
    }
  };
}

{
  const monitor = controller();
  assert.equal(monitor.tick(4).action, null);
  assert.equal(monitor.tick(4).action, "reduce");
  assert.equal(monitor.tick(4).action, "fallback", "tres ventanas criticas consecutivas permiten 2D");
}
{
  const monitor = controller();
  assert.equal(monitor.tick(0).fps, 0, "una camara en movimiento sin render debe detectarse");
  assert.equal(monitor.tick(0).action, "reduce");
  assert.equal(monitor.tick(0).action, "fallback");
}
for (const overrides of [{ navigating: false }, { visible: false }, { transitioning: true }]) {
  const monitor = controller(overrides);
  for (let i = 0; i < 12; i += 1) assert.equal(monitor.tick(4), null, "espera, segundo plano y transiciones no son FPS activos");
}
for (const field of ["navigating", "visible"]) {
  const monitor = controller();
  monitor.tick(4);
  monitor.context[field] = false;
  assert.equal(monitor.tick(0), null);
  monitor.context[field] = true;
  monitor.reset();
  assert.equal(monitor.tick(4).action, null, "la pausa rompe la racha de FPS bajos");
  assert.equal(monitor.tick(4).action, "reduce");
  assert.equal(monitor.tick(4).action, "fallback");
}
for (const change of [{ mode: "2d" }, { qualityPreset: "balanced" }, { targetFrameRate: 20 }, { isMobile: true }, { tier: "low" }]) {
  const monitor = controller();
  monitor.tick(4);
  Object.assign(monitor.context, change);
  assert.equal(monitor.tick(4).action, null, "otra vista o perfil no debe heredar ventanas criticas");
}
{
  const monitor = controller();
  monitor.tick(4);
  monitor.reset();
  assert.equal(monitor.tick(4).action, null, "un arrastre nuevo reinicia la racha aunque ocurra entre dos muestras");
  assert.equal(monitor.tick(0, 6000), null, "un temporizador suspendido no equivale a movimiento sostenido");
  assert.equal(monitor.tick(4).action, null);
  monitor.reset();
  assert.equal(monitor.tick(4, 500), null, "no extrapolar un movimiento corto a una ventana completa");
}
for (const target of [20, 22, 26, 30, 31, 34, 36]) {
  const monitor = controller({ targetFrameRate: target, isMobile: target <= 22 });
  assert.equal(monitor.tick(target).action, null);
  assert.equal(monitor.tick(target).action, null);
  assert.equal(monitor.tick(target).action, "recover", `el limite intencional ${target} permite recuperar calidad`);
}
for (const qualityPreset of ["high", "balanced", "performance"]) {
  const monitor = controller({ qualityPreset });
  for (let i = 0; i < 6; i += 1) assert.equal(monitor.tick(0).action, null, "respetar la calidad elegida");
}
{
  const monitor = controller({ mode: "2d" });
  for (let i = 0; i < 6; i += 1) assert.notEqual(monitor.tick(0).action, "fallback");
}

function event() {
  const listeners = new Set();
  return { listeners, addEventListener(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    emit() { for (const fn of listeners) fn(); } };
}

function runtime({ mobile = false, mode = "3d" } = {}) {
  const calls = { now: 0, statuses: [], degradations: [], modes: [], timers: new Map(), interval: null };
  const postRender = event();
  const moveStart = event();
  const moveEnd = event();
  const visibility = event();
  const preset = { targetFrameRate: mobile ? 22 : 34, resolutionScale: mobile ? 0.5 : 1.12,
    maximumScreenSpaceError: mobile ? 10.8 : 1.75, loadingDescendantLimit: mobile ? 2 : 24,
    tileCacheSize: mobile ? 22 : 300 };
  const state = {
    window: {
      setInterval(fn) { calls.interval = fn; return 1; },
      clearInterval() { calls.interval = null; },
      setTimeout(fn) { calls.finish = fn; return 2; }
    },
    document: { visibilityState: "visible", addEventListener(_name, fn) { visibility.listeners.add(fn); },
      removeEventListener(_name, fn) { visibility.listeners.delete(fn); } },
    performance: { now: () => calls.now }, performanceMonitorId: null,
    isCameraNavigating: false, cancelPendingMapTransition: null, currentMapMode: mode,
    qualityPreset: "auto", currentLanguage: "es", reducedPerformanceMode: false, reducedPerformanceReason: "",
    viewer: { ...preset, scene: { postRender, globe: { ...preset, tilesLoaded: false }, requestRender() {} },
      camera: { moveStart, moveEnd } },
    getPerformancePreset: () => preset, getDeviceTier: () => mobile ? "low" : "high", isMobileLayout: () => mobile,
    labelEntities: [], hoverSuppressedUntil: 0, clearMapLabels() {}, lastInteractionAt: Date.now(),
    updateAppStatusPanel(data) { calls.statuses.push(data); },
    recordMapDegradation(reason, data) { calls.degradations.push({ reason, ...data }); },
    applyMapMode(next) { calls.modes.push(next); state.currentMapMode = next; },
    navigationQualityRestoreTimer: null,
    setTimeout(fn) { calls.timers.set(1, fn); return 1; }, clearTimeout(id) { calls.timers.delete(id); }
  };
  vm.createContext(state);
  vm.runInContext(interactions, state);
  vm.runInContext(scheduler, state);
  state.mapInteractionCore = state.window.GeoRiskMapInteractions;
  state.bootScheduler = state.window.GeoRiskBootScheduler;
  const block = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
  vm.runInContext(block("function startPerformanceMonitor()", "async function showNewsArticle"), state);
  vm.runInContext(block("function setNavigationQualityState", "let viewer = null"), state);
  state.startPerformanceMonitor();
  return {
    state, calls, preset, postRender, moveStart, moveEnd, visibility,
    tick(fps = 0) {
      const start = calls.now;
      const count = Math.round(fps * 2.5);
      for (let i = 0; i < count; i += 1) { calls.now = start + i * 2500 / count; postRender.emit(); }
      calls.now = start + 2500;
      calls.interval?.();
    },
    move(active) { state.isCameraNavigating = active; (active ? moveStart : moveEnd).emit(); }
  };
}

{
  const test = runtime();
  test.state.startPerformanceMonitor();
  assert.equal(test.postRender.listeners.size, 1, "iniciar dos veces no duplica el monitor");
  assert.ok(!test.calls.interval, "FPS sin sondeo cuando el mapa esta quieto");
  for (let i = 0; i < 24; i += 1) test.tick();
  assert.equal(test.state.bootScheduler.startupFpsMetrics.samples, 0, "teselas pendientes y contacto reciente no simulan movimiento");
  assert.equal(test.calls.degradations.length, 0);
  assert.equal(test.calls.modes.length, 0);
  test.calls.finish();
  const metrics = test.state.bootScheduler.startupFpsMetrics;
  assert.equal(metrics.active, false);
  assert.equal(metrics.completed, true, "la medicion cierra a los 60 segundos incluso sin muestras activas");
  assert.equal(metrics.min, null);
  assert.equal(test.state.performanceMonitorId, null);
  assert.equal(test.calls.interval, null);
  for (const key of ["postRender", "moveStart", "moveEnd", "visibility"]) assert.equal(test[key].listeners.size, 0, "retirar listeners: " + key);
  test.state.bootScheduler.recordStartupFps(20, 65000);
  assert.equal(metrics.samples, 0, "no registrar muestras posteriores al cierre");
}
{
  const test = runtime();
  test.move(true);
  assert.equal(typeof test.calls.interval, "function", "movimiento activa medicion incluso sin frames");
  test.tick(4);
  test.state.document.visibilityState = "hidden";
  test.visibility.emit();
  assert.equal(test.calls.interval, null, "FPS no despierta la pestana oculta");
  for (let i = 0; i < 4; i += 1) test.tick(0);
  test.state.document.visibilityState = "visible";
  test.visibility.emit();
  test.tick(4);
  assert.equal(test.calls.degradations.length, 0);
  test.move(false);
  test.move(true);
  test.tick(4);
  assert.equal(test.calls.degradations.length, 0, "movimientos separados no son una caida sostenida");
  test.tick(4);
  assert.equal(test.calls.degradations.length, 1);
  test.tick(4);
  assert.deepEqual(test.calls.modes, ["2d"]);
}
{
  const test = runtime({ mobile: true, mode: "2d" });
  test.move(true);
  test.tick(4);
  test.tick(4);
  assert.equal(test.state.viewer.scene.globe.tileCacheSize, 22, "degradar no aumenta el cache movil de 22 a 24");
  assert.ok(test.state.viewer.resolutionScale < test.preset.resolutionScale);
  test.move(false);
  test.move(true);
  for (let i = 0; i < 3; i += 1) test.tick(22);
  assert.ok(test.state.viewer.resolutionScale > 0.44, "recupera calidad al alcanzar 22 FPS sostenidos");
  Object.assign(test.state.viewer.scene.globe, { maximumScreenSpaceError: 15, tileCacheSize: 12, loadingDescendantLimit: 1 });
  test.state.viewer.resolutionScale = 0.3;
  test.move(false);
  test.move(true);
  test.tick(4);
  test.tick(4);
  assert.equal(test.state.viewer.resolutionScale, 0.3);
  assert.equal(test.state.viewer.scene.globe.maximumScreenSpaceError, 15);
  assert.equal(test.state.viewer.scene.globe.tileCacheSize, 12);
  assert.equal(test.state.viewer.scene.globe.loadingDescendantLimit, 1);
}
{
  const test = runtime({ mobile: true });
  test.preset.tileCacheSize = 76;
  test.preset.loadingDescendantLimit = 8;
  test.state.setNavigationQualityState(true);
  assert.ok(test.state.viewer.scene.globe.tileCacheSize <= 76, "arrastrar en 3D movil no aumenta cache a 120");
  assert.ok(test.state.viewer.scene.globe.loadingDescendantLimit <= 8);
  test.state.bootScheduler.recordStartupFps(NaN, 1);
  test.state.bootScheduler.recordStartupFps(-1, 1);
  test.state.bootScheduler.recordStartupFps(Infinity, 1);
  assert.equal(test.state.bootScheduler.startupFpsMetrics.samples, 0);
  test.state.bootScheduler.recordStartupFps(0, 60000);
  assert.equal(test.state.bootScheduler.startupFpsMetrics.completed, true);
}

{
  const test = runtime();
  test.move(true);
  test.tick(0);
  test.tick(0);
  assert.equal(test.calls.degradations.length, 1, "ahorrar sondeos no oculta un render detenido durante movimiento");
  test.move(false);
  assert.equal(test.calls.interval, null, "detener movimiento cancela sondeos");
  test.calls.finish();
  test.move(true);
  test.visibility.emit();
  assert.equal(test.calls.interval, null, "no reactivar el monitor al cerrar su ventana");
}

console.log("map-performance.test.js ok");
