import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../app-map-interactions.js", import.meta.url), "utf8");
const state = vm.createContext({ window: {} });
vm.runInContext(source, state);
const { createAutoRotationController, bindAutoRotationInput } = state.window.GeoRiskMapInteractions;
const context = { now: 10000, enabled: true, mode: "3d", navigating: false, visible: true, blocked: false, interactionAt: 0 };

for (const fps of [22, 34, 60]) {
  const controller = createAutoRotationController();
  let angle = controller.step(context);
  for (let frame = 1; frame <= fps * 2; frame += 1) {
    angle += controller.step({ ...context, now: context.now + frame * 1000 / fps, navigating: frame > 1 });
  }
  assert.ok(Math.abs(angle + 0.09) < 1e-10, "la velocidad no depende de FPS ni se pausa por su propio moveStart");
  assert.equal(controller.isRotating(), true);
}
for (const pause of [{ enabled: false }, { mode: "2d" }, { visible: false }, { blocked: true }, { interactionAt: 10000 }]) {
  const controller = createAutoRotationController();
  controller.step(context);
  assert.ok(controller.step({ ...context, now: 10030 }) < 0);
  assert.equal(controller.step({ ...context, now: 10060, ...pause }), 0);
  assert.equal(controller.isRotating(), false);
  assert.equal(controller.step({ ...context, now: 15000 }), 0, "reanudar no recupera el tiempo de pausa");
  assert.ok(controller.step({ ...context, now: 15030 }) < 0);
  assert.ok(Math.abs(controller.step({ ...context, now: 30000 })) <= 0.05 * 0.045, "limitar saltos tras frames suspendidos");
}
{
  const controller = createAutoRotationController();
  assert.equal(controller.step({ ...context, navigating: true }), 0, "no tomar una camara movida por el usuario");
  assert.equal(controller.hasActivePointers(), false);
  controller.pointerDown(1);
  controller.pointerDown(2);
  assert.equal(controller.hasActivePointers(), true);
  controller.reset();
  assert.equal(controller.hasActivePointers(), true, "pausar la rotacion no libera contactos");
  assert.equal(controller.step({ ...context, now: 50000 }), 0, "un contacto sostenido no expira tras 3,2 segundos");
  assert.equal(controller.pointerUp(3), false);
  controller.pointerUp(1);
  assert.equal(controller.hasActivePointers(), true);
  assert.equal(controller.step({ ...context, now: 60000 }), 0, "el segundo dedo sigue activo");
  controller.releasePointers();
  assert.equal(controller.hasActivePointers(), false);
  assert.equal(controller.step({ ...context, now: 70000 }), 0);
  assert.ok(controller.step({ ...context, now: 70030 }) < 0);
}

function target() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(type, fn) { const list = listeners.get(type) || new Set(); list.add(fn); listeners.set(type, list); },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    emit(type, detail = {}) { for (const fn of listeners.get(type) || []) fn(detail); }
  };
}
{
  const canvas = target();
  const document = target();
  const host = target();
  const controller = createAutoRotationController();
  let interactions = 0;
  const dispose = bindAutoRotationInput({ canvas, document, host, controller, onInteraction: () => interactions++ });
  document.emit("pointerup", { pointerId: 7 });
  assert.equal(interactions, 0, "no pausar por punteros ajenos al mapa");
  canvas.emit("pointerdown", { pointerId: 1 });
  assert.equal(controller.hasActivePointers(), true);
  document.emit("pointercancel", { pointerId: 1 });
  assert.equal(controller.hasActivePointers(), false);
  canvas.emit("wheel");
  canvas.emit("keydown");
  assert.equal(interactions, 4);
  canvas.emit("pointerdown", { pointerId: 2 });
  host.emit("blur");
  assert.equal(controller.hasActivePointers(), false);
  assert.equal(controller.step(context), 0);
  assert.ok(controller.step({ ...context, now: 10030 }) < 0, "blur libera el contacto perdido fuera del canvas");
  canvas.emit("pointerdown", { pointerId: 3 });
  document.emit("visibilitychange");
  assert.equal(controller.hasActivePointers(), false);
  assert.equal(controller.isRotating(), false);
  canvas.emit("pointerdown", { pointerId: 4 });
  dispose();
  assert.equal(controller.hasActivePointers(), false);
  for (const item of [canvas, document, host]) {
    assert.ok([...item.listeners.values()].every(list => list.size === 0), "retirar listeners al disponer");
  }
}

const script = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const tick = script.slice(script.indexOf("function handleAutoRotateTick("), script.indexOf("function getInitialGlobeDistance("));
const runtime = {
  autoRotation: createAutoRotationController(), autoRotateEnabled: true, currentMapMode: "3d",
  isCameraNavigating: false, lastInteractionAt: 0, cancelPendingMapTransition: null, loadMapPromise: null,
  Date: { now: () => runtime.now }, now: 10000,
  document: { visibilityState: "visible", body: { classList: { contains: key => runtime.modal && key === "modal-open" } } },
  Cesium: { Cartesian3: { UNIT_Z: "axis" } }, angles: [], renders: 0,
  viewer: { useDefaultRenderLoop: true, camera: { rotate(axis, angle) { assert.equal(axis, "axis"); runtime.angles.push(angle); } },
    scene: { requestRender() { runtime.renders++; } } }
};
vm.createContext(runtime);
vm.runInContext(tick, runtime);
runtime.handleAutoRotateTick();
runtime.now += 30;
runtime.handleAutoRotateTick();
runtime.isCameraNavigating = true;
runtime.now += 30;
runtime.handleAutoRotateTick();
assert.equal(runtime.angles.length, 2);
assert.equal(runtime.renders, 2);
runtime.modal = true;
runtime.now += 30;
runtime.handleAutoRotateTick();
assert.equal(runtime.renders, 2, "un modal no solicita frames de rotacion");
assert.equal((script.match(/if \(!autoRotation\.isRotating\(\)\) lastInteractionAt = Date\.now\(\);/g) || []).length, 0,
  "los eventos sinteticos de Cesium no reinician la espera de interaccion");
assert.ok(tick.includes("camera: viewer.camera"), "la pausa debe observar la pose real");
{
  const controller = createAutoRotationController();
  const camera = {
    positionWC: { x: 20000000, y: 0, z: 0 },
    directionWC: { x: -1, y: 0, z: 0 }, upWC: { x: 0, y: 0, z: 1 }
  };
  controller.step({ ...context, camera });
  controller.step({ ...context, now: 10050, camera });
  controller.pointerDown(1);
  controller.step({ ...context, now: 11000, camera, interactionAt: 11000 });
  controller.pointerUp(1);
  let angle = 0;
  for (let frame = 0; frame <= 80; frame++) {
    camera.positionWC.x += 1e-8;
    camera.directionWC.y += 1e-15;
    angle += controller.step({ ...context, camera, now: 15000 + frame * 50, interactionAt: 15000, navigating: frame % 2 === 0 });
  }
  assert.ok(angle < 0, "reanuda tras 3,2 s aunque Cesium repita moveStart/moveEnd sin movimiento real");
  assert.equal(controller.isRotating(), true);
  controller.reset();
  camera.positionWC.x += 100;
  assert.equal(controller.step({ ...context, camera, now: 20000 }), 0, "respetar vuelos y movimiento real incluso sin moveStart");
  assert.equal(controller.step({ ...context, camera, now: 23100 }), 0);
  assert.equal(controller.step({ ...context, camera, now: 23200 }), 0);
  assert.ok(controller.step({ ...context, camera, now: 23250 }) < 0);
  controller.reset();
  camera.directionWC.y += 0.001;
  assert.equal(controller.step({ ...context, camera, now: 24000 }), 0, "tambien detectar cambios de orientacion");
  assert.equal(controller.step({ ...context, camera, now: 27100 }), 0);
}
console.log("map-auto-rotation.test.js ok");
