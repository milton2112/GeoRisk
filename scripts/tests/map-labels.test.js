import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import Cartesian3 from "@cesium/engine/Source/Core/Cartesian3.js";
import Cartesian2 from "@cesium/engine/Source/Core/Cartesian2.js";
import Ellipsoid from "@cesium/engine/Source/Core/Ellipsoid.js";
import Rectangle from "@cesium/engine/Source/Core/Rectangle.js";
import CesiumMath from "@cesium/engine/Source/Core/Math.js";
import NearFarScalar from "@cesium/engine/Source/Core/NearFarScalar.js";
import DistanceDisplayCondition from "@cesium/engine/Source/Core/DistanceDisplayCondition.js";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const radius = Ellipsoid.WGS84.maximumRadius;
const point = (lon, lat = 0) => Cartesian3.fromDegrees(lon, lat);
const state = {
  Cesium: { Cartesian3, Cartesian2, Ellipsoid, Rectangle, Math: CesiumMath, NearFarScalar, DistanceDisplayCondition,
    LabelStyle: { FILL_AND_OUTLINE: 2 }, HorizontalOrigin: { CENTER: 0 }, VerticalOrigin: { CENTER: 0 } },
  countriesData: {}, countryLayers: new Map(), labelEntities: [], labelMode: "countries", currentMapMode: "3d",
  isCameraNavigating: false, cancelPendingMapTransition: null, mobile: false, bucket: "near",
  isMobileLayout: () => state.mobile, get3DZoomBucket: () => state.bucket,
  cssColorToCesiumColor: (color, alpha) => ({ color, alpha }),
  MAP_LABEL_SETS: { continents: [], oceans: [] },
  projected: { x: 50, y: 50 }, created: [], removed: [], renders: 0,
  viewer: {
    camera: { positionWC: new Cartesian3(radius * 3, 0, 0) },
    entities: { add(entity) { state.created.push(entity); return entity; }, remove(entity) { state.removed.push(entity); } },
    scene: { globe: { ellipsoid: Ellipsoid.WGS84 }, canvas: { clientWidth: 100, clientHeight: 100 },
      cartesianToCanvasCoordinates: () => state.projected, requestRender() { state.renders++; } }
  }
};
vm.createContext(state);
vm.runInContext(source.slice(source.indexOf("function getCountryLabelData("), source.indexOf("function focusRectangle(")), state);
assert.equal(state.getMapLabelMaxDistance("country"), 18000000);
assert.equal(state.getMapLabelMaxDistance("context"), 30000000);
assert.equal(state.isMapLabelVisible(point(0), 18000000), true);
for (const longitude of [75, 90, 180, -90]) {
  assert.equal(state.isMapLabelVisible(point(longitude), 30000000), false, "no crear nombres detras del horizonte");
}
state.viewer.camera.positionWC = new Cartesian3(radius * 5, 0, 0);
assert.equal(state.isMapLabelVisible(point(0), 18000000), false);
assert.equal(state.isMapLabelVisible(point(0), 30000000), true);
state.viewer.camera.positionWC = new Cartesian3(radius * 3, 0, 0);
for (const projected of [undefined, { x: -1, y: 50 }, { x: 101, y: 50 }, { x: 50, y: -1 }, { x: 50, y: 101 }, { x: NaN, y: 0 }]) {
  state.projected = projected;
  assert.equal(state.isMapLabelVisible(point(0), 30000000), false, "no crear anclas fuera del canvas");
}
state.projected = { x: 50, y: 50 };

const dateline = Rectangle.fromDegrees(177, -20, -178, -10);
state.countryLayers.set("FJI", { code: "FJI", featureName: "Fiyi", getBounds: () => dateline });
const [fiji] = state.getCountryLabelData();
assert.ok(Math.abs(fiji.sizeScore - CesiumMath.toRadians(5) * CesiumMath.toRadians(10)) < 1e-12,
  "el ancho a traves del meridiano 180 es 5 grados, no 355");
assert.ok(Math.abs(fiji.lon) > 170);

state.getCountryLabelData = () => [
  { id: "front", text: "Visible", lon: 0, lat: 0 },
  { id: "back", text: "Oculto", lon: 180, lat: 0 }
];
state.renderMapLabels();
assert.deepEqual(state.created.map(entity => entity.id), ["front"]);
assert.equal(state.labelEntities.length, 1);
assert.equal(state.created[0].label.distanceDisplayCondition.far, 18000000);
assert.equal(Cartesian3.distance(state.created[0].position, point(0)), 0);
state.MAP_LABEL_SETS.oceans = [{ id: "ocean-back", text: "Oceano", lon: 180, lat: 0 }];
state.labelMode = "full";
state.renderMapLabels();
assert.equal(state.labelEntities.length, 1, "el horizonte tambien filtra etiquetas de contexto");
for (const guard of [{ labelMode: "none" }, { currentMapMode: "2d" }, { isCameraNavigating: true }, { cancelPendingMapTransition: () => {} }]) {
  Object.assign(state, { labelMode: "full", currentMapMode: "3d", isCameraNavigating: false, cancelPendingMapTransition: null }, guard);
  const count = state.created.length;
  state.renderMapLabels();
  assert.equal(state.labelEntities.length, 0);
  assert.equal(state.created.length, count, "no crear etiquetas en una vista inactiva o en movimiento");
}
Object.assign(state, { cancelPendingMapTransition: null });
state.viewer.camera.positionWC = new Cartesian3(-radius * 3, 0, 0);
state.renderMapLabels();
assert.deepEqual(Array.from(state.labelEntities, entity => entity.id), ["back", "ocean-back"], "volver a evaluar al cambiar de hemisferio");
console.log("map-labels.test.js ok");
