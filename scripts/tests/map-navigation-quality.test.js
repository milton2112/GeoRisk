import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const script = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const interactions = await fs.readFile(new URL("../../app-map-interactions.js", import.meta.url), "utf8");
const navigation = script.slice(script.indexOf("function setNavigationQualityState"), script.indexOf("let viewer = null"));
function harness(mode) {
  const timers = new Map();
  let id = 0;
  const preset = { maximumScreenSpaceError: mode === "2d" ? 10.8 : 4.9,
    tileCacheSize: mode === "2d" ? 22 : 76, loadingDescendantLimit: mode === "2d" ? 2 : 8 };
  const globe = { maximumScreenSpaceError: 15, tileCacheSize: 12, loadingDescendantLimit: 1 };
  const state = { window: {}, viewer: { resolutionScale: 0.42, scene: { globe, requestRender() {} } },
    currentMapMode: mode, getPerformancePreset: () => preset, navigationQualityRestoreTimer: null,
    setTimeout(fn) { timers.set(++id, fn); return id; }, clearTimeout(key) { timers.delete(key); } };
  vm.createContext(state);
  vm.runInContext(interactions, state);
  state.globeQuality = state.window.GeoRiskMapInteractions.createGlobeQualityController?.();
  vm.runInContext(navigation, state);
  return { state, preset, globe, timers,
    restore() { const [key, fn] = [...timers][0]; timers.delete(key); fn(); } };
}
for (const mode of ["2d", "3d"]) {
  const test = harness(mode);
  const initial = { ...test.globe };
  test.state.setNavigationQualityState(true);
  assert.ok(test.globe.maximumScreenSpaceError >= initial.maximumScreenSpaceError,
    "arrastrar no debe aumentar detalle adaptativo");
  assert.ok(test.globe.tileCacheSize <= initial.tileCacheSize, "arrastrar no aumenta el cache adaptativo");
  assert.ok(test.globe.loadingDescendantLimit <= initial.loadingDescendantLimit);
  test.state.setNavigationQualityState(false);
  test.restore();
  assert.deepEqual(test.globe, initial, "soltar restaura la calidad estable adaptativa, no el preset original");
  assert.equal(test.state.viewer.resolutionScale, 0.42, "navegacion no redimensiona el framebuffer");
  assert.equal(test.state.navigationQualityRestoreTimer, null);
}

for (const mode of ["2d", "3d"]) {
  const test = harness(mode);
  Object.assign(test.globe, test.preset);
  const controller = test.state.globeQuality;
  controller.begin(test.globe, test.preset, mode);
  const temporaryError = test.globe.maximumScreenSpaceError;
  const reduced = controller.adapt(test.globe, test.preset, mode, "reduce");
  assert.ok(Math.abs(reduced.maximumScreenSpaceError - test.preset.maximumScreenSpaceError - 0.45) < 1e-9,
    "reducir parte de la calidad estable, no de la relajacion temporal del arrastre");
  assert.ok(test.globe.maximumScreenSpaceError >= temporaryError);
  controller.begin(test.globe, test.preset, mode);
  assert.equal(controller.finish(test.globe), true);
  assert.deepEqual(test.globe, { ...reduced }, "movimientos repetidos no acumulan la relajacion temporal");
  assert.equal(controller.finish(test.globe), false, "restaurar una sola vez");
  controller.begin(test.globe, test.preset, mode);
  const recovered = controller.adapt(test.globe, test.preset, mode, "recover");
  assert.ok(recovered.maximumScreenSpaceError < reduced.maximumScreenSpaceError);
  controller.finish(test.globe);
  assert.deepEqual(test.globe, { ...recovered }, "recuperaciones durante el arrastre tambien persisten");
  for (let i = 0; i < 30; i++) controller.adapt(test.globe, test.preset, mode, "recover");
  assert.deepEqual(test.globe, test.preset, "la recuperacion no supera los limites elegidos");
  controller.begin(test.globe, test.preset, mode);
  controller.reset(test.globe);
  const manual = { maximumScreenSpaceError: 2, tileCacheSize: 150, loadingDescendantLimit: 12 };
  Object.assign(test.globe, manual);
  assert.equal(controller.finish(test.globe), false);
  assert.deepEqual(test.globe, manual, "un cambio de perfil invalida el snapshot anterior");
  assert.throws(() => controller.adapt(test.globe, test.preset, mode, "unknown"), /Unknown/);
}

for (const mode of ["2d", "3d"]) {
  const test = harness(mode);
  test.state.setNavigationQualityState(true);
  test.state.setNavigationQualityState(false);
  const obsolete = [...test.timers.values()][0];
  test.state.setNavigationQualityState(true);
  assert.equal(test.timers.size, 0);
  obsolete();
  assert.equal(test.state.navigationQualityRestoreTimer, null, "un callback cancelado no restaura un nuevo arrastre");
  test.state.setNavigationQualityState(false);
  const currentTimer = test.state.navigationQualityRestoreTimer;
  obsolete();
  assert.equal(test.state.navigationQualityRestoreTimer, currentTimer, "un callback viejo no limpia el timer nuevo");
  test.restore();
}
for (const invalidation of ["replaced", "destroyed"]) {
  const test = harness("3d");
  let renders = 0;
  test.state.viewer.scene.requestRender = () => { renders++; };
  test.state.setNavigationQualityState(true);
  test.state.setNavigationQualityState(false);
  if (invalidation === "replaced") test.state.viewer = null;
  else test.state.viewer.isDestroyed = () => true;
  test.restore();
  assert.equal(renders, 1, "una restauracion tardia no dibuja en un viewer retirado");
}
console.log("map-navigation-quality.test.js ok: navigation preserves adaptive quality");
