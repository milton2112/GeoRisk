import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const styles = await fs.readFile(new URL("../../app-map-styles.js", import.meta.url), "utf8");
const block = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const base = { color: "#123456", weight: 1.4, fillColor: "#101010", fillOpacity: 0.15 };
const highlights = {
  country: { color: "#ff0000", weight: 3, fillColor: "#ff0000", fillOpacity: 0.5 },
  continent: { color: "#00ff00", weight: 2, fillColor: "#00ff00", fillOpacity: 0.4 },
  religion: { color: "#0000ff", weight: 2.5, fillColor: "#0000ff", fillOpacity: 0.3 }
};

function fixture(mode = "3d", size = 3) {
  const calls = { themes: [], materialWrites: 0, renders: 0 };
  const state = {
    window: {}, currentMapMode: mode, currentTheme: "default", countriesDataRevision: 0, activeGeoJsonDataSource: null,
    selectedLayers: [], selectedLayer: null, selectionMode: "country", countryLayers: new Map(),
    lastStyleRefreshSignature: "", isCameraNavigating: false, bucket: "mid",
    getDynamicBorderScale: () => 1,
    cssColorToCesiumColor: (color, alpha) => `${color}:${alpha}`,
    Cesium: { JulianDate: { now: () => 0 } },
    COUNTRY_HIGHLIGHT_STYLE: highlights.country, CONTINENT_HIGHLIGHT_STYLE: highlights.continent,
    RELIGION_HIGHLIGHT_STYLE: highlights.religion,
    getCurrentOverlayBucket: () => state.bucket,
    getCountryThemeStyle: code => { calls.themes.push(code); return state.base || base; },
    viewer: { scene: { requestRender() { calls.renders += 1; } } }
  };
  vm.createContext(state);
  vm.runInContext(styles, state);
  state.mapStyleCore = state.window.GeoRiskMapStyles;
  vm.runInContext(block("class CesiumCountryLayer", "function createLayerGroup") +
    "\nglobalThis.Layer = CesiumCountryLayer;", state);
  vm.runInContext(block("function updateLayerSelection", "function getLinkedCodes"), state);
  vm.runInContext(block("function refreshCountryStyles", "function renderThemeLegend"), state);
  for (let i = 0; i < size; i += 1) {
    const polygon = { outline: false };
    let material;
    Object.defineProperty(polygon, "material", {
      get: () => material,
      set(value) { material = value; calls.materialWrites += 1; }
    });
    const layer = new state.Layer(String(i), [{ polygon, polyline: {} }]);
    layer.setStyle(base);
    state.countryLayers.set(layer.code, layer);
  }
  const reset = () => { calls.themes.length = 0; calls.materialWrites = calls.renders = 0; };
  reset();
  return { state, calls, layers: [...state.countryLayers.values()], reset };
}

for (const mode of ["2d", "3d"]) {
  for (const from of ["country", "continent", "religion"]) for (const to of ["country", "continent", "religion"]) {
    const { state, layers, calls, reset } = fixture(mode);
    const [overlap, removed, added] = layers;
    state.updateLayerSelection([overlap, removed], from, highlights[from]);
    reset();
    state.updateLayerSelection([overlap, added], to, highlights[to]);
    for (const layer of [overlap, added]) {
      assert.equal(layer.entities[0].polygon.material, `${highlights[to].fillColor}:${highlights[to].fillOpacity}`,
        `${mode} ${from}->${to}: overlap must use the current highlight`);
    }
    assert.equal(removed.entities[0].polygon.material, `${base.fillColor}:${base.fillOpacity}`);
    assert.deepEqual(calls.themes, [removed.code], "only removed selection needs a base style");
    assert.equal(state.selectedLayer, to === "country" ? overlap : null);
    assert.equal(state.selectionMode, to);
    reset();
    state.updateLayerSelection([overlap, added], to, highlights[to]);
    assert.equal(calls.materialWrites, 0, "repeated final highlights keep the existing material");
    assert.deepEqual(calls.themes, []);
    const changed = { ...highlights[to], fillColor: "#654321" };
    state.updateLayerSelection([overlap, added], to, changed);
    assert.equal(calls.materialWrites, 2, "same selection mode can still change its actual style");
  }

  for (const selectionMode of ["country", "continent", "religion"]) {
    const { state, layers, calls, reset } = fixture(mode, 120);
    state.updateLayerSelection(layers.slice(0, 80), selectionMode, highlights[selectionMode]);
    reset();
    state.refreshCountryStyles();
    assert.equal(calls.materialWrites, 0, "an unchanged refresh must not remove/reapply 80 highlights");
    assert.equal(calls.themes.length, 40, "selected countries do not prepare unused base styles");
    assert.equal(calls.renders, 1, "existing explicit render behavior remains intact");
    reset();
    state.refreshCountryStyles();
    assert.deepEqual(calls, { themes: [], materialWrites: 0, renders: 0 }, "same signature remains a no-op");
    state.countriesDataRevision += 1;
    state.base = { ...base, fillColor: "#303030" };
    state.refreshCountryStyles();
    assert.equal(calls.materialWrites, 40, "a new theme/data revision updates only unselected base fills");
    for (const layer of layers.slice(0, 80)) {
      assert.equal(layer.entities[0].polygon.material, `${highlights[selectionMode].fillColor}:${highlights[selectionMode].fillOpacity}`);
    }
    state.isCameraNavigating = true;
    state.lastStyleRefreshSignature = "";
    reset();
    state.refreshCountryStyles();
    assert.equal(calls.renders, mode === "3d" ? 0 : 1, "3D navigation still defers style work");
  }
}

{
  const { state, layers, calls } = fixture();
  state.updateLayerSelection([layers[0], null, layers[0]], "country", highlights.country);
  assert.equal(calls.materialWrites, 1, "duplicate references cannot duplicate material writes");
  state.updateLayerSelection([], "continent", highlights.continent);
  assert.equal(state.selectedLayers.length, 0);
  assert.equal(state.selectedLayer, null);
  assert.equal(layers[0].entities[0].polygon.material, `${base.fillColor}:${base.fillOpacity}`);
}
{
  const { state, layers } = fixture();
  const retired = new state.Layer("retired", [{ polygon: {}, polyline: {} }]);
  state.selectedLayers = [retired];
  state.refreshCountryStyles();
  assert.equal(retired.entities[0].polygon.material, `${highlights.country.fillColor}:${highlights.country.fillOpacity}`,
    "refresh preserves the existing contract for selection references outside the current map");
  assert.equal(layers[0].entities[0].polygon.material, `${base.fillColor}:${base.fillOpacity}`);
}
console.log("map-selection-styles.test.js ok: overlapping selections and single final-style refresh");
