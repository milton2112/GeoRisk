import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import Cartesian3 from "@cesium/engine/Source/Core/Cartesian3.js";
import Ellipsoid from "@cesium/engine/Source/Core/Ellipsoid.js";
import SceneMode from "@cesium/engine/Source/Scene/SceneMode.js";

const browserSource = await fs.readFile(new URL("./critical-browser-e2e.test.js", import.meta.url), "utf8");
const appSource = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
function block(source, start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, "the regression must exercise the actual helper");
  return source.slice(from, to);
}

function fixture({ mode = SceneMode.SCENE3D, position = Cartesian3.fromDegrees(0, 0) } = {}) {
  const calls = { geometry: 0, picks: 0, renders: 0, waits: [], destinations: [] };
  const rectangle = { longitude: 0, latitude: 0 };
  const layer = {
    getBounds: () => rectangle,
    computeRectangle() { calls.geometry += 1; return rectangle; }
  };
  const canvas = { clientWidth: 800, clientHeight: 600,
    getBoundingClientRect: () => ({ left: 40, top: 60, right: 840, bottom: 660, width: 800, height: 600 }) };
  const state = {
    countryLayers: new Map([["ARG", layer]]), rawPoint: { x: 400, y: 300 }, pickedCode: "ARG",
    Cesium: { Cartesian3, SceneMode, Rectangle: { center: value => value } }, window: {},
    viewer: { camera: { positionWC: Cartesian3.fromDegrees(0, 0, 10_000_000),
      setView: ({ destination }) => calls.destinations.push(destination) },
    scene: { mode, canvas, globe: { show: true, ellipsoid: Ellipsoid.WGS84 },
      cartesianToCanvasCoordinates: () => state.rawPoint,
      requestRender: () => { calls.renders += 1; } } },
    getPickedCountryEntityAt() { calls.picks += 1; return { countryCode: state.pickedCode }; }
  };
  state.Cesium.Cartesian3 = Object.assign(function (...args) { return new Cartesian3(...args); }, {
    ...Cartesian3, fromRadians: () => position
  });
  state.window.Cesium = state.Cesium;
  vm.createContext(state);
  vm.runInContext(block(appSource, "function isMapLabelVisible", "function getMapLabelFont"), state);
  vm.runInContext(block(browserSource, "async function getCountryScreenPoint", "async function clickMapPoint"), state);
  const page = {
    evaluate: (read, code) => vm.runInContext("(" + read.toString() + ")(" + JSON.stringify(code) + ")", state),
    waitForTimeout: async ms => { calls.waits.push(ms); }
  };
  return { calls, state, page, rectangle, canvas, layer };
}

for (const mode of [SceneMode.SCENE2D, SceneMode.SCENE3D]) {
  const valid = fixture({ mode });
  assert.deepEqual({ ...await valid.state.getCountryScreenPoint(valid.page, "ARG") }, { x: 440, y: 360 });
  assert.equal(valid.calls.geometry, 0, "cached bounds must not rescan polygon geometry");
  assert.equal(valid.calls.picks, 1, "visible candidates still require a real country pick");
  assert.equal(valid.calls.renders, 1);
  assert.deepEqual(valid.calls.waits, []);
  valid.state.countryLayers.set("ARG", { getBounds: () => ({ longitude: 1, latitude: 2 }) });
  await valid.state.focusCountryFor3dPick(valid.page, "ARG");
  assert.deepEqual(valid.calls.destinations, [{ longitude: 1, latitude: 2 }], "replacement layers use their current bounds");
  assert.deepEqual(valid.calls.waits, [420], "focusing retains the existing settling wait");

  for (const rawPoint of [null, { x: 1, y: 300 }, { x: 400, y: 599 }, { x: -100, y: 300 },
    { x: 900, y: 300 }, { x: NaN, y: 300 }, { x: 400, y: Infinity }]) {
    const invalid = fixture({ mode });
    invalid.state.rawPoint = rawPoint;
    assert.equal(await invalid.state.getCountryScreenPoint(invalid.page, "ARG"), null);
    assert.equal(invalid.calls.picks, 0, "out-of-canvas points must not issue GPU picks");
    assert.equal(invalid.calls.renders, 0, "out-of-canvas points must not request unused renders");
    assert.equal(invalid.calls.geometry, 0);
    assert.deepEqual(invalid.calls.waits, Array(20).fill(250), "the existing bounded retries are unchanged");
  }

  const wrongCountry = fixture({ mode });
  wrongCountry.state.pickedCode = "ESP";
  assert.equal(await wrongCountry.state.getCountryScreenPoint(wrongCountry.page, "ARG", 3), null);
  assert.equal(wrongCountry.calls.picks, 3, "preflight cannot accept an unverified country");
  assert.deepEqual(wrongCountry.calls.waits, [250, 250, 250]);
  const absent = fixture({ mode });
  assert.equal(await absent.state.getCountryScreenPoint(absent.page, "MISSING", 1), null);
  assert.equal(absent.calls.picks, 0);
  absent.state.countryLayers.set("ARG", { getBounds: () => null });
  assert.equal(await absent.state.getCountryScreenPoint(absent.page, "ARG", 1), null);
  assert.equal(await absent.state.focusCountryFor3dPick(absent.page, "ARG"), false);
  assert.equal(absent.calls.destinations.length, 0);
  const emptyCanvas = fixture({ mode });
  emptyCanvas.canvas.clientWidth = 0;
  emptyCanvas.canvas.getBoundingClientRect = () => ({ left: 0, top: 0, right: 0, bottom: 600, width: 0, height: 600 });
  assert.equal(await emptyCanvas.state.getCountryScreenPoint(emptyCanvas.page, "ARG", 1), null);
  assert.equal(emptyCanvas.calls.picks, 0);
  assert.equal(emptyCanvas.calls.renders, 0);
}

const hidden = fixture({ position: Cartesian3.fromDegrees(180, 0) });
assert.equal(await hidden.state.getCountryScreenPoint(hidden.page, "ARG"), null);
assert.equal(hidden.calls.picks, 0, "points behind the globe do not need GPU picks");
assert.equal(hidden.calls.renders, 0);
hidden.state.viewer.scene.globe.show = false;
assert.ok(await hidden.state.getCountryScreenPoint(hidden.page, "ARG"), "a hidden globe is not an occluder");
assert.equal(hidden.calls.picks, 1);
const flat = fixture({ mode: SceneMode.SCENE2D, position: Cartesian3.fromDegrees(180, 0) });
assert.ok(await flat.state.getCountryScreenPoint(flat.page, "ARG"), "3D horizon rejection must not run in 2D");
assert.equal(flat.calls.picks, 1);

console.log("browser-map-pick.test.js OK: cached bounds and zero picks/renders for invalid candidates");
