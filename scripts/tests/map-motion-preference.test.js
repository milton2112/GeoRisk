import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const read = file => fs.readFile(new URL("../../" + file, import.meta.url), "utf8");
const script = await read("script.js");
const mapSource = await read("app-map.js");
const interactions = await read("app-map-interactions.js");
const block = (start, end) => {
  const offset = script.indexOf(start);
  assert.ok(offset >= 0, start);
  const limit = script.indexOf(end, offset);
  assert.ok(limit > offset, end);
  return script.slice(offset, limit);
};

function harness(reduced = false, saved = "true") {
  const calls = { flights: [], morphs: [], writes: [], listeners: [], completed: 0, loads: 0, fits: 0, timers: new Map() };
  const media = {
    matches: reduced,
    addEventListener(event, fn) { assert.equal(event, "change"); calls.listeners.push(fn); }
  };
  const button = { classList: { toggle() {} }, setAttribute(key, value) { this[key] = value; } };
  const morphListeners = new Set();
  let flight;
  const state = {
    window: { matchMedia: query => { assert.equal(query, "(prefers-reduced-motion: reduce)"); return media; } },
    readLocalPreference: () => saved,
    localStorage: { setItem: (...args) => calls.writes.push(args) },
    STORAGE_KEYS: { autoRotate: "geo-risk-auto-rotate" },
    document: { getElementById: () => button }, console,
    currentLanguage: "es", currentMapMode: "3d", mobile: false,
    isMobileLayout: () => state.mobile, activeFocusToken: 0, appStore: null,
    cancelPendingMapTransition: null, detailedOverlayUpgradeTimer: null,
    Cesium: { SceneMode: { SCENE2D: 2, SCENE3D: 3 } },
    applyImageryForMode() {}, updateMapInteractionTuning() {}, updateMapModeToggle() {},
    updateAppStatusPanel() {}, renderMapLabels() {}, getCurrentOverlayBucket: () => "far",
    lastOverlayBucket: "", loadMap: async () => { calls.loads++; }, fitWorldView: () => { calls.fits++; },
    setTimeout(fn) { const id = calls.timers.size + 1; calls.timers.set(id, fn); return id; },
    clearTimeout(id) { calls.timers.delete(id); },
    viewer: {
      camera: {
        cancelFlight() { flight = null; },
        flyTo(options) { calls.flights.push(options); flight = options; if (!options.duration) this.completeFlight(); },
        completeFlight() { if (flight) { const pending = flight; flight = null; pending.complete(); calls.completed++; } }
      },
      scene: {
        mode: 3, requestRender() {},
        morphComplete: { addEventListener(fn) { morphListeners.add(fn); return () => morphListeners.delete(fn); } },
        morphTo2D(duration) { calls.morphs.push({ mode: "2d", duration }); if (!duration) this.completeMorph(); },
        morphTo3D(duration) { calls.morphs.push({ mode: "3d", duration }); if (!duration) this.completeMorph(); },
        completeMorph() {
          this.mode = state.currentMapMode === "2d" ? 2 : 3;
          for (const fn of morphListeners) fn();
        }
      }
    }
  };
  vm.createContext(state);
  vm.runInContext(mapSource + interactions, state);
  state.mapCore = state.window.GeoRiskMap;
  state.mapInteractionCore = state.window.GeoRiskMapInteractions;
  vm.runInContext(block("function setAutoRotateState(", "function handleAutoRotateTick("), state);
  vm.runInContext(block("const mapMotionPreference", "let lastInteractionAt"), state);
  vm.runInContext(block("function focusRectangle(", "function update3DPresentationState("), state);
  vm.runInContext(block("function applyMapMode(", "function toggleMapMode("), state);
  const setPreference = value => { media.matches = value; calls.listeners.forEach(fn => fn({ matches: value })); };
  return { state, calls, media, button, setPreference, enabled: () => vm.runInContext("autoRotateEnabled", state) };
}

for (const reduced of [false, true]) for (const saved of ["true", "false", null]) {
  const { state, calls, enabled, button } = harness(reduced, saved);
  assert.equal(enabled(), !reduced && saved === "true", "rotacion guardada no arranca con movimiento reducido");
  state.setAutoRotateState(enabled(), false);
  assert.equal(button["aria-pressed"], String(enabled()));
  assert.equal(calls.writes.length, 0, "inicializar no modifica la preferencia guardada");
  assert.equal(calls.listeners.length, 1, "un unico listener de preferencia por pagina");
  state.setAutoRotateState(true);
  assert.equal(enabled(), true, "la rotacion explicita sigue disponible");
  assert.equal(calls.writes.at(-1)[1], "true");
}

for (const reduced of [false, true]) for (const mobile of [false, true]) for (const mode of ["2d", "3d"]) {
  const { state, calls } = harness(reduced);
  state.mobile = mobile;
  state.currentMapMode = mode;
  const bounds = { west: 0, east: 0.1, south: 0, north: 0.1 };
  let completed = 0;
  state.focusRectangle(bounds, { onComplete: () => completed++ });
  assert.equal(calls.flights[0].destination, bounds, "conservar el destino seleccionado");
  assert.equal(calls.flights[0].duration === 0, reduced);
  state.viewer.camera.completeFlight();
  assert.equal(completed, 1, "conservar callback una sola vez, incluso instantaneo");
  state.focusRectangle(bounds, { instant: true });
  assert.equal(calls.flights.at(-1).duration, 0);
  for (const fallback of [false, true]) {
    if (fallback) state.mapCore = {};
    state.applyMapMode(mode === "2d" ? "3d" : "2d");
    assert.equal(calls.morphs.at(-1).duration === 0, reduced, "transicion respeta preferencia, incluido fallback");
    state.viewer.scene.completeMorph();
    for (let i = 0; i < 4; i++) await Promise.resolve();
    assert.equal(state.cancelPendingMapTransition, null);
    assert.equal(calls.timers.size, 0, "la transicion terminada no deja timers");
  }
  assert.equal(calls.loads, 2);
  assert.equal(calls.fits, 2);
}

{
  const { state, calls, enabled, setPreference } = harness();
  let completed = 0;
  state.focusRectangle({ west: 0, east: 1, south: 0, north: 1 }, { onComplete: () => completed++ });
  state.applyMapMode("2d");
  setPreference(true);
  for (let i = 0; i < 4; i++) await Promise.resolve();
  assert.equal(enabled(), false, "cambiar la preferencia detiene rotacion activa");
  assert.equal(completed, 1, "termina el vuelo en vez de perder la seleccion");
  assert.equal(state.cancelPendingMapTransition, null, "termina el morph pendiente");
  assert.equal(calls.writes.length, 0, "el sistema no borra la eleccion persistida");
  setPreference(false);
  assert.equal(enabled(), false, "no reinicia rotacion sin una nueva accion");
  assert.equal(completed, 1);
  state.viewer = null;
  setPreference(true);
}

assert.match(script, /setAutoRotateState\(autoRotateEnabled, false\)/, "montar controles no persiste estado temporal");
console.log("map-motion-preference.test.js ok: initial/live preference, flights, morphs and explicit rotation");
