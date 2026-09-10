import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const script = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const mapSource = await fs.readFile(new URL("../../app-map.js", import.meta.url), "utf8");
const SIMPLE = "./data/world_countries_simplified.geo.json";
const DETAIL = "./data/world_countries.geo.json";
const block = (start, end) => script.slice(script.indexOf(start), script.indexOf(end, script.indexOf(start)));
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const flush = async () => { for (let i = 0; i < 12; i += 1) await Promise.resolve(); };

function createHarness() {
  const calls = { fits: 0, loads: 0, removed: [], prepared: [], timers: new Map() };
  const sources = new Set();
  class Layer {
    constructor(code, entities) { this.code = code; this.entities = entities; }
    setStyle(style) { this.style = style; }
  }
  class Handler {
    constructor() { this.actions = new Map(); this.destroyed = false; }
    setInputAction(fn, type) { this.actions.set(type, fn); }
    destroy() { this.destroyed = true; }
  }
  const source = () => ({ show: true, entities: { values: ["ARG", "ESP"].map(id => ({ id, properties: {}, polygon: {} })) } });
  const old = source();
  sources.add(old);
  const oldLayer = new Layer("ARG", old.entities.values);
  const state = {
    window: {}, console, Map, Set,
    currentMapMode: "3d", zoom: "near", mobile: false, currentTheme: "default", currentLanguage: "es",
    isMobileLayout: () => state.mobile, get3DZoomBucket: () => state.zoom,
    getCurrentOverlayBucket: () => state.currentMapMode === "2d" ? "2d" : `3d-${state.zoom}`,
    activeGeoJsonDataSource: old, activeGeoJsonPath: SIMPLE, activeGeoJsonMode: "3d",
    activeClickHandler: new Handler(), countryLayers: new Map([["ARG", oldLayer]]),
    countryClickTargets: new Map(), selectedLayers: [oldLayer], selectedLayer: oldLayer,
    selectionMode: "country", continentBoundsLayer: null, createLayerGroup: layers => ({ layers }),
    loadMapPromise: null, loadMapMode: "3d", loadMapPath: SIMPLE, mapOverlayLoadToken: 0,
    countryAreaCache: {}, lastStyleRefreshSignature: "old", lastOverlayBucket: "3d-near",
    countriesData: { ARG: { name: "Argentina" }, ESP: { name: "Espana" } },
    initializeViewer() {}, trimDataCaches() {}, markBootStepStart() {}, markBootStepEnd() {},
    measureBootStep: (_name, fn) => fn(),
    getPreparedGeoJson: async path => { calls.prepared.push(path); return {}; },
    Cesium: {
      GeoJsonDataSource: { load: async () => { calls.loads += 1; return source(); } },
      ArcType: { GEODESIC: 1 }, Math: { RADIANS_PER_DEGREE: 0.017 },
      ScreenSpaceEventHandler: Handler, ScreenSpaceEventType: { LEFT_CLICK: 1, MOUSE_MOVE: 2 }
    },
    viewer: {
      scene: { canvas: {}, requestRender() {} },
      dataSources: {
        async add(value) { sources.add(value); return value; },
        remove(value, destroy) { calls.removed.push({ value, destroy }); return sources.delete(value); },
        contains: value => sources.has(value)
      }
    },
    CesiumCountryLayer: Layer, resolveCountryCode: code => code,
    registerCountryAlias() {}, registerFeatureNameAliases() {}, getCountryThemeStyle: () => "base",
    refreshCountryStyles() {
      state.countryLayers.forEach(layer => layer.setStyle("base"));
      state.selectedLayers.forEach(layer => layer.setStyle(state.selectionMode));
    },
    fitWorldView() { calls.fits += 1; }, applyImageryForMode() {}, renderMapLabels() {}, scheduleGeoJsonWarmup() {},
    requestSceneRender() {}, detailedOverlayUpgradeTimer: null, lastInteractionAt: 0, isCameraNavigating: false,
    setTimeout(fn) { const id = calls.timers.size + 1; calls.timers.set(id, fn); return id; },
    clearTimeout(id) { calls.timers.delete(id); }
  };
  vm.createContext(state);
  vm.runInContext(mapSource, state);
  state.mapCore = state.window.GeoRiskMap;
  vm.runInContext(block("function getGeoJsonPathForCurrentMode", "async function selectSearchResult"), state);
  vm.runInContext(block("async function loadMap(", "async function waitForMapBootReady"), state);
  vm.runInContext(block("function scheduleDetailedOverlayUpgrade", "async function handleCountryPanelInteraction"), state);
  return { state, calls, sources, old, oldLayer, source };
}

{
  const { state } = createHarness();
  assert.equal(state.getGeoJsonPathForCurrentMode(), DETAIL, "zoom 3d-near debe resolver el GeoJSON detallado");
  assert.equal(state.getGeoJsonPathForCurrentMode(true), SIMPLE, "arranque siempre liviano");
  state.mobile = true;
  assert.equal(state.getGeoJsonPathForCurrentMode(), SIMPLE);
  state.mobile = false;
  state.currentMapMode = "2d";
  assert.equal(state.getGeoJsonPathForCurrentMode(), SIMPLE);
}

for (const mode of ["country", "religion", "continent"]) {
  const { state, calls, sources, old, oldLayer } = createHarness();
  const held = deferred();
  state.getPreparedGeoJson = () => held.promise;
  state.selectionMode = mode;
  state.continentBoundsLayer = mode === "country" ? null : { layers: [oldLayer] };
  const oldHandler = state.activeClickHandler;
  const pending = state.loadMap(false, { preserveView: true });
  await flush();
  assert.equal(state.activeGeoJsonDataSource, old, "la descarga no debe retirar el mapa usable");
  assert.equal(state.countryLayers.get("ARG"), oldLayer);
  assert.equal(oldHandler.destroyed, false, "el mapa debe seguir recibiendo clics durante la descarga");
  // The user changes their selection while the network request is in flight.
  state.selectedLayers = [{ code: "ESP" }];
  held.resolve({});
  await pending;
  assert.equal(calls.fits, 0, "upgrade no debe cambiar camara ni zoom");
  assert.equal(sources.size, 1, "no deben acumularse capas GeoJSON");
  assert.equal(calls.removed[0].destroy, true);
  assert.equal(oldHandler.destroyed, true);
  assert.equal(state.selectedLayers[0], state.countryLayers.get("ESP"));
  assert.equal(state.selectedLayers[0].style, mode, "se conserva el resaltado actual");
  assert.equal(state.selectedLayer, mode === "country" ? state.selectedLayers[0] : null);
  if (mode !== "country") assert.equal(state.continentBoundsLayer.layers[0], state.selectedLayers[0]);
  assert.equal(state.activeGeoJsonPath, DETAIL);
  await state.loadMap(false, { preserveView: true });
  assert.equal(calls.loads, 1, "una capa ya activa no debe volver a construirse");
}

{
  const { state } = createHarness();
  await state.loadMap(false);
  let loading = true;
  let picks = 0;
  state.document = { body: { classList: { contains: () => loading } } };
  state.emitMapEvent = () => {};
  state.getPickedCountryEntityAt = () => { picks += 1; return null; };
  state.clearSelection = () => {};
  const click = state.activeClickHandler.actions.get(state.Cesium.ScreenSpaceEventType.LEFT_CLICK);
  await click({ position: {} });
  assert.equal(picks, 0, "no abrir fichas antes de conectar sus controles");
  loading = false;
  await click({ position: {} });
  assert.equal(picks, 1, "los clics deben activarse al completar la interfaz");
}

for (const phase of ["prepare", "parse", "add", "index"]) {
  const { state, old, oldLayer, sources } = createHarness();
  const fail = () => { throw new Error(`failure-${phase}`); };
  if (phase === "prepare") state.getPreparedGeoJson = fail;
  if (phase === "parse") state.Cesium.GeoJsonDataSource.load = fail;
  if (phase === "add") state.viewer.dataSources.add = fail;
  if (phase === "index") state.CesiumCountryLayer = class { constructor() { fail(); } };
  await assert.rejects(state.loadMap(false, { preserveView: true }), new RegExp(`failure-${phase}`));
  assert.equal(state.activeGeoJsonDataSource, old, `${phase}: conservar fuente anterior`);
  assert.equal(state.countryLayers.get("ARG"), oldLayer);
  assert.equal(sources.size, 1);
  assert.equal(state.loadMapPromise, null, "un fallo debe permitir reintentar");
}

for (const phase of ["prepare", "parse", "add"]) {
  const { state, old, sources, source } = createHarness();
  const held = deferred();
  if (phase === "prepare") state.getPreparedGeoJson = () => held.promise;
  if (phase === "parse") state.Cesium.GeoJsonDataSource.load = () => held.promise;
  if (phase === "add") state.viewer.dataSources.add = async value => { sources.add(value); await held.promise; return value; };
  const pending = state.loadMap(false, { preserveView: true });
  await flush();
  state.zoom = "far";
  held.resolve(phase === "parse" ? source() : {});
  await pending;
  assert.equal(state.activeGeoJsonDataSource, old, `${phase}: descartar detalle si el usuario se alejo`);
  assert.equal(sources.size, 1, "una respuesta obsoleta no debe dejar capas ocultas");
}

{
  const { state, old, sources } = createHarness();
  const held = deferred();
  state.getPreparedGeoJson = () => held.promise;
  const first = state.loadMap(false);
  state.zoom = "far";
  await state.loadMap(false);
  held.resolve({});
  await first;
  assert.equal(state.activeGeoJsonDataSource, old, "reutilizar la capa activa cancela una carga incompatible");
  assert.equal(sources.size, 1);
}

{
  const { state, source } = createHarness();
  const firstReady = deferred();
  const secondReady = deferred();
  let requests = 0;
  state.getPreparedGeoJson = () => (++requests === 1 ? firstReady : secondReady).promise;
  const first = state.loadMap(false);
  state.currentMapMode = "2d";
  const second = state.loadMap(false);
  const currentPromise = state.loadMapPromise;
  firstReady.resolve({});
  await first;
  assert.equal(state.loadMapPromise, currentPromise, "una finalizacion obsoleta no limpia la nueva solicitud");
  secondReady.resolve(source());
  await second;
  assert.equal(state.activeGeoJsonMode, "2d");
  assert.equal(state.loadMapPromise, null);
}

{
  const state = { geoJsonCache: new Map(), APP_VERSION: "test" };
  let requests = 0;
  state.fetchResourceCached = async () => {
    requests += 1;
    if (requests === 1) throw new Error("offline");
    return { type: "FeatureCollection" };
  };
  vm.createContext(state);
  vm.runInContext(block("async function getCachedGeoJson", "function roundCoordinateValue"), state);
  await assert.rejects(state.getCachedGeoJson(DETAIL), /offline/);
  assert.equal(state.geoJsonCache.has(DETAIL), false, "no cachear un fallo de red para siempre");
  const value = await state.getCachedGeoJson(DETAIL);
  assert.equal(await state.getCachedGeoJson(DETAIL), value);
  assert.equal(requests, 2, "reintentar despues de fallar y reutilizar despues de exito");
}

{
  const { state, old, oldLayer } = createHarness();
  state.Cesium.GeoJsonDataSource.load = async () => ({ entities: { values: [] } });
  await assert.rejects(state.loadMap(false, { preserveView: true }), /limites de paises/);
  assert.equal(state.activeGeoJsonDataSource, old, "un detalle vacio no reemplaza la geografia util");
  assert.equal(state.selectedLayer, oldLayer);
  assert.equal(state.loadMapPromise, null);
}

for (const stop of ["far", "mobile", "moving", "2d", "loaded"]) {
  const { state, calls } = createHarness();
  let upgrades = 0;
  state.loadMap = async (_boot, options) => { assert.equal(options.preserveView, true); upgrades += 1; };
  state.scheduleDetailedOverlayUpgrade();
  assert.equal(calls.timers.size, 1, "el zoom cercano debe programar detalle");
  if (stop === "far") state.zoom = "far";
  if (stop === "mobile") state.mobile = true;
  if (stop === "moving") state.isCameraNavigating = true;
  if (stop === "2d") state.currentMapMode = "2d";
  if (stop === "loaded") state.activeGeoJsonPath = DETAIL;
  await [...calls.timers.values()][0]();
  await flush();
  assert.equal(upgrades, 0, "no aplicar detalle obsoleto: " + stop);
}

{
  const { state, calls } = createHarness();
  let upgrades = 0;
  state.loadMap = async (_boot, options) => { assert.equal(options.preserveView, true); upgrades += 1; };
  state.scheduleDetailedOverlayUpgrade();
  await [...calls.timers.values()][0]();
  await flush();
  assert.equal(upgrades, 1);
}

for (const mode of ["2d", "3d"]) {
  let restore;
  const preset = { resolutionScale: 1.05, maximumScreenSpaceError: 2, tileCacheSize: 200, loadingDescendantLimit: 12 };
  const state = {
    viewer: { resolutionScale: 0.8, scene: { globe: { ...preset }, requestRender() {} } },
    currentMapMode: mode, qualityPreset: "auto", isMobileLayout: () => false,
    getPerformancePreset: () => preset, navigationQualityRestoreTimer: null,
    setTimeout: fn => { restore = fn; return 1; }, clearTimeout() {}
  };
  vm.createContext(state);
  vm.runInContext(block("function setNavigationQualityState", "let viewer = null"), state);
  state.setNavigationQualityState(true);
  assert.equal(state.viewer.resolutionScale, 0.8, "navegar no debe redimensionar el framebuffer ni el frustum");
  assert.ok(state.viewer.scene.globe.maximumScreenSpaceError > preset.maximumScreenSpaceError, "reducir detalle durante navegacion");
  state.setNavigationQualityState(false);
  restore();
  assert.equal(state.viewer.resolutionScale, 0.8, "terminar un movimiento debe conservar la resolucion adaptativa actual");
  assert.equal(state.viewer.scene.globe.maximumScreenSpaceError, preset.maximumScreenSpaceError);
}

function createImageryHarness() {
  const layers = [];
  const removed = [];
  const state = {
    console: { error() {} }, currentMapMode: "3d", activeImagerySignature: "", activeBaseImageryLayer: null,
    createSatelliteImageryProvider: maximumLevel => ({ kind: "satellite", maximumLevel }),
    createOsmImageryProvider: () => ({ kind: "osm" }),
    viewer: { imageryLayers: {
      get length() { return layers.length; },
      contains: layer => layers.includes(layer),
      addImageryProvider(provider, index = layers.length) {
        const layer = { provider, destroyed: false };
        layers.splice(index, 0, layer);
        return layer;
      },
      remove(layer, destroy) {
        const index = layers.indexOf(layer);
        if (index < 0) return false;
        layers.splice(index, 1);
        if (destroy) layer.destroyed = true;
        removed.push(layer);
        return true;
      },
      removeAll(destroy) { for (const layer of [...layers]) this.remove(layer, destroy); }
    } }
  };
  vm.createContext(state);
  vm.runInContext(block("function applyImageryForMode(", "async function getCachedGeoJson("), state);
  return { state, layers, removed };
}

{
  const { state, layers, removed } = createImageryHarness();
  state.applyImageryForMode(true);
  const bootLayer = layers[0];
  state.applyImageryForMode(false);
  assert.equal(bootLayer.destroyed, true, "reemplazar imagen debe liberar los recursos de la capa anterior");
  const overlay = { custom: true };
  layers.push(overlay);
  for (let i = 0; i < 20; i += 1) {
    state.currentMapMode = i % 2 ? "3d" : "2d";
    state.applyImageryForMode(false);
    state.applyImageryForMode(false);
    assert.equal(layers.length, 2, "cambiar de modo no debe acumular capas ni borrar overlays ajenos");
    assert.equal(layers[1], overlay);
    assert.equal(state.activeBaseImageryLayer, layers[0]);
  }
  assert.equal(removed.length, 21, "llamadas repetidas no deben reemplazar una capa compatible");
  assert.ok(removed.every(layer => layer.destroyed));
  state.viewer.imageryLayers.remove(state.activeBaseImageryLayer, true);
  state.applyImageryForMode(false);
  assert.equal(layers.length, 2, "restaurar una capa retirada externamente aunque la firma coincida");
}

for (const phase of ["provider", "attach"]) {
  const { state, layers } = createImageryHarness();
  state.applyImageryForMode(true);
  const original = layers[0];
  const originalFactory = state.createSatelliteImageryProvider;
  const originalAdd = state.viewer.imageryLayers.addImageryProvider;
  if (phase === "provider") {
    state.createSatelliteImageryProvider = () => { throw new Error("satellite unavailable"); };
    state.createOsmImageryProvider = () => { throw new Error("fallback unavailable"); };
  } else {
    state.viewer.imageryLayers.addImageryProvider = () => { throw new Error("cannot attach"); };
  }
  state.applyImageryForMode(false);
  assert.equal(layers[0], original, "si ambos proveedores fallan, conservar la imagen anterior: " + phase);
  assert.equal(original.destroyed, false);
  assert.equal(state.activeImagerySignature, "3d:boot", "un fallo no debe marcar el reemplazo como completado");
  state.createSatelliteImageryProvider = originalFactory;
  state.viewer.imageryLayers.addImageryProvider = originalAdd;
  state.applyImageryForMode(false);
  assert.equal(state.activeImagerySignature, "3d:full", "se debe poder reintentar sin recargar la app");
  assert.equal(original.destroyed, true);
}

{
  const { state, layers } = createImageryHarness();
  state.applyImageryForMode(true);
  const original = layers[0];
  state.createSatelliteImageryProvider = () => { throw new Error("satellite unavailable"); };
  state.applyImageryForMode(false);
  assert.equal(layers.length, 1);
  assert.equal(layers[0].provider.kind, "osm");
  assert.equal(original.destroyed, true);
  assert.equal(state.activeImagerySignature, "3d:osm");
}

console.log("map-lifecycle.test.js ok");
