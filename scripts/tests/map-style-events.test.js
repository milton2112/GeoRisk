import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import Cartesian3 from "@cesium/engine/Source/Core/Cartesian3.js";
import Color from "@cesium/engine/Source/Core/Color.js";
import JulianDate from "@cesium/engine/Source/Core/JulianDate.js";
import PolygonHierarchy from "@cesium/engine/Source/Core/PolygonHierarchy.js";
import Rectangle from "@cesium/engine/Source/Core/Rectangle.js";
import EntityCollection from "@cesium/engine/Source/DataSources/EntityCollection.js";
import PolylineGraphics from "@cesium/engine/Source/DataSources/PolylineGraphics.js";

const script = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const styles = await fs.readFile(new URL("../../app-map-styles.js", import.meta.url), "utf8");
function block(start, end) {
  const offset = script.indexOf(start);
  assert.ok(offset >= 0 && script.indexOf(end, offset) > offset);
  return script.slice(offset, script.indexOf(end, offset));
}
const base = { color: "#123456", weight: 1.4, fillColor: "#102030", fillOpacity: 0.15 };
const highlight = { color: "#ff0000", weight: 3, fillColor: "#445566", fillOpacity: 0.5 };

function fixture(mode) {
  const collection = new EntityCollection();
  const events = [];
  const state = {
    window: {}, Cesium: { Color, JulianDate, Rectangle, PolylineGraphics }, currentMapMode: mode,
    activeGeoJsonDataSource: { entities: collection }, countryLayers: new Map(), selectedLayers: [], selectedLayer: null,
    selectionMode: "country", currentTheme: "default", countriesDataRevision: 0, lastStyleRefreshSignature: "",
    isCameraNavigating: false, getDynamicBorderScale: () => 1, getCurrentOverlayBucket: () => "mid",
    getCountryThemeStyle: () => base, COUNTRY_HIGHLIGHT_STYLE: highlight,
    CONTINENT_HIGHLIGHT_STYLE: highlight, RELIGION_HIGHLIGHT_STYLE: highlight,
    lastInteractionAt: 0, continentBoundsLayer: null, isMobileLayout: () => false,
    map: { removeLayer() {} }, closeMobilePanels() {}, requestMapRenderSafe() {},
    getLayersForCountries: entries => entries, createLayerGroup: entries => ({ layers: entries }), fitLayerBounds() {},
    viewer: { camera: { cancelFlight() {} }, scene: { requestRender() {} } }
  };
  vm.createContext(state);
  vm.runInContext(styles, state);
  state.mapStyleCore = state.window.GeoRiskMapStyles;
  vm.runInContext(block("function cssColorToCesiumColor", "function createLayerGroup") +
    "\nglobalThis.Layer = CesiumCountryLayer;", state);
  vm.runInContext(block("function clearSelection", "function getLinkedCodes"), state);
  vm.runInContext(block("function selectCountryGroupLayers", "function renderSelectableCountryGroup"), state);
  vm.runInContext(block("function refreshCountryStyles", "function renderThemeLegend"), state);
  for (let i = 0; i < 3; i++) {
    const entities = [0, 1].map(part => collection.add({
      id: `${i}-${part}`, polygon: { hierarchy: new PolygonHierarchy([
        Cartesian3.fromDegrees(i * 4, part), Cartesian3.fromDegrees(i * 4 + 1, part),
        Cartesian3.fromDegrees(i * 4, part + 1)
      ]) }
    }));
    const layer = new state.Layer(String(i), entities);
    layer.setStyle(base);
    state.countryLayers.set(layer.code, layer);
  }
  collection.collectionChanged.addEventListener((_owner, added, removed, changed) => {
    events.push({ added, removed, changed, mode: state.selectionMode, selected: [...state.selectedLayers] });
  });
  return { state, collection, events, layers: [...state.countryLayers.values()] };
}

for (const mode of ["2d", "3d"]) {
  const { state, collection, events, layers } = fixture(mode);
  state.updateLayerSelection(layers, "continent", highlight);
  assert.equal(events.length, 1, "one group selection must deliver one final Cesium collection event");
  assert.equal(events[0].changed.length, 6);
  assert.equal(events[0].mode, "continent", "observers must see final selection state");
  assert.deepEqual(events[0].selected, layers);
  assert.equal(events[0].added.length + events[0].removed.length, 0);
  for (const entity of collection.values) {
    assert.equal(entity.polygon.material.getValue().color.equals(Color.fromCssColorString(highlight.fillColor).withAlpha(highlight.fillOpacity)), true);
    assert.equal(entity.polyline.material.getValue().color.equals(Color.fromCssColorString(highlight.color)), true);
    assert.equal(entity.polyline.width.getValue(), highlight.weight);
  }
  events.length = 0;
  state.updateLayerSelection(layers, "continent", highlight);
  assert.equal(events.length, 0, "identical styles remain inert, including collection notifications");
  state.clearSelection();
  assert.equal(events.length, 1);
  assert.equal(events[0].selected.length, 0);
  events.length = 0;
  state.selectCountryGroupLayers(layers, { mode: "religion", focusMap: false });
  assert.equal(events.length, 1, "native religion selection, including its clear, is one final batch");
  assert.equal(events[0].mode, "religion");
  assert.deepEqual(events[0].selected, layers);
  state.clearSelection();
  events.length = 0;
  state.getCountryThemeStyle = () => ({ ...base, fillColor: "#abcdef" });
  state.refreshCountryStyles();
  assert.equal(events.length, 1, "a theme refresh must deliver one final collection event");
  assert.equal(events[0].changed.length, 6);
  events.length = 0;
  state.refreshCountryStyles();
  assert.equal(events.length, 0, "unchanged signature does not start another batch");
  collection.suspendEvents();
  state.updateLayerSelection(layers, "religion", highlight);
  assert.equal(events.length, 0, "a caller's outer event suspension must remain owned by that caller");
  collection.resumeEvents();
  assert.equal(events.length, 1);
  events.length = 0;
  const failure = new Error("style fixture failure");
  const apply = layers[0].setStyle.bind(layers[0]);
  layers[0].setStyle = value => { apply(value); throw failure; };
  assert.throws(() => state.updateLayerSelection([], "country", highlight), error => error === failure);
  assert.equal(events.length, 1, "an error must release this batch's event suspension");
  collection.values[0].name = "still observable";
  assert.equal(events.length, 2, "later real changes remain observable after a failed style update");
  assert.equal(state.mapStyleCore.withEntityEventsSuspended(null, () => 42), 42);
}

for (const mode of ["2d", "3d"]) {
  const { state, collection, events, layers } = fixture(mode);
  const materials = collection.values.map(entity => ({ fill: entity.polygon.material, border: entity.polyline.material }));
  const writes = [];
  for (const entity of collection.values) {
    entity.polygon.definitionChanged.addEventListener((_owner, property) => writes.push("polygon." + property));
    entity.polyline.definitionChanged.addEventListener((_owner, property) => writes.push("polyline." + property));
  }
  const apply = style => state.mapStyleCore.withEntityEventsSuspended(collection, () => {
    for (const layer of layers) layer.setStyle(style);
  });
  state.getDynamicBorderScale = () => 1.4;
  apply(base);
  assert.deepEqual(writes, Array(6).fill("polyline.width"), "zoom width changes must not replace unchanged fill/border materials");
  assert.equal(events.length, 1);
  assert.equal(events[0].changed.length, 6);
  for (let i = 0; i < collection.values.length; i++) {
    const entity = collection.values[i];
    assert.equal(entity.polygon.material, materials[i].fill);
    assert.equal(entity.polyline.material, materials[i].border);
    assert.equal(entity.polyline.width.getValue(), base.weight * 1.4);
  }
  writes.length = events.length = 0;
  apply({ ...base, color: "#abcdef" });
  assert.deepEqual(writes, Array(6).fill("polyline.material"), "a border color change only replaces border materials");
  for (let i = 0; i < collection.values.length; i++) {
    assert.equal(collection.values[i].polygon.material, materials[i].fill);
  }
  const borders = collection.values.map(entity => entity.polyline.material);
  writes.length = events.length = 0;
  const changedFill = { ...base, color: "#abcdef", fillOpacity: 0.7 };
  apply(changedFill);
  assert.deepEqual(writes, Array(6).fill("polygon.material"), "an opacity change only replaces fill materials");
  for (let i = 0; i < collection.values.length; i++) {
    assert.equal(collection.values[i].polyline.material, borders[i]);
    assert.equal(collection.values[i].polygon.material.getValue().color.alpha, 0.7);
  }
  writes.length = events.length = 0;
  apply(changedFill);
  assert.deepEqual(writes, []);
  assert.deepEqual(events, [], "an identical complete style still performs no writes");
  state.getDynamicBorderScale = () => 100;
  apply(changedFill);
  for (const entity of collection.values) assert.equal(entity.polyline.width.getValue(), mode === "3d" ? 4.8 : 3.6);
  writes.length = events.length = 0;
  state.getDynamicBorderScale = () => 200;
  apply(changedFill);
  assert.deepEqual(writes, [], "equivalent clamped widths stay inert");
  const first = collection.values[0];
  first.polyline = undefined;
  first.polygon.outline = true;
  state.getDynamicBorderScale = () => 1;
  apply(changedFill);
  assert.equal(first.polygon.outline.getValue(), false, "a changed style still disables an externally enabled outline");
  assert.equal(first.polyline.width.getValue(), changedFill.weight);
  assert.equal(first.polyline.material.getValue().color.equals(Color.fromCssColorString(changedFill.color)), true);
  assert.equal(first.polyline.positions.getValue().length, 4, "a missing border is recreated with the existing geometry");
}

{
  const { layers } = fixture("3d");
  const layer = layers[0];
  const failure = new Error("material listener failure");
  const remove = layer.entities[1].polygon.definitionChanged.addEventListener(() => { throw failure; });
  assert.throws(() => layer.setStyle(highlight), error => error === failure);
  remove();
  assert.equal(layer.currentStyleKey, "", "a failed partial update cannot retain a completed style signature");
  layer.setStyle(base);
  for (const entity of layer.entities) {
    assert.equal(entity.polygon.material.getValue().color.equals(Color.fromCssColorString(base.fillColor).withAlpha(base.fillOpacity)), true);
    assert.equal(entity.polyline.material.getValue().color.equals(Color.fromCssColorString(base.color)), true);
    assert.equal(entity.polyline.width.getValue(), base.weight);
  }
  let writes = 0;
  const stop = layer.entities[0].polygon.definitionChanged.addEventListener(() => { writes++; });
  layer.setStyle(base);
  stop();
  assert.equal(writes, 0, "successful repair restores the unchanged-style fast path");
}

{
  const { state, collection } = fixture("3d");
  const entity = collection.add({ id: "fresh", polygon: { hierarchy: new PolygonHierarchy([
    Cartesian3.fromDegrees(0, 0), Cartesian3.fromDegrees(1, 0), Cartesian3.fromDegrees(0, 1)
  ]) } });
  const layer = new state.Layer("fresh", [entity]);
  let borders = 0;
  entity.definitionChanged.addEventListener((_entity, property) => { if (property === "polyline") borders++; });
  layer.setStyle(base);
  assert.equal(borders, 1, "a new border receives its final material/width once, without intermediate rewrites");
  assert.equal(entity.polyline.material.getValue().color.alpha, 1);
  assert.equal(entity.polyline.width.getValue(), base.weight);
  assert.equal(entity.polyline.positions.getValue().length, 4);
}
console.log("map-style-events.test.js ok: final events, width-only material reuse, selective colors and partial-error repair");
