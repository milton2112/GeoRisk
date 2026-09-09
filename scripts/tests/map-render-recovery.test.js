import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../app-map-interactions.js", import.meta.url), "utf8");
function event() {
  const listeners = new Set();
  return {
    listeners,
    addEventListener(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    fire(...args) { [...listeners].forEach(fn => fn(...args)); }
  };
}
function harness() {
  const frames = new Map();
  const intervals = new Map();
  const canvasEvents = new Map();
  const changes = [];
  let id = 0;
  let running = true;
  let destroyed = false;
  let restarts = 0;
  let requests = 0;
  const document = { visibilityState: "visible" };
  const context = {
    window: { document }, console,
    requestAnimationFrame(fn) { const key = ++id; frames.set(key, fn); return key; },
    cancelAnimationFrame(key) { frames.delete(key); },
    setInterval(fn, delay) { assert.equal(delay, 1000); const key = ++id; intervals.set(key, fn); return key; },
    clearInterval(key) { intervals.delete(key); }
  };
  vm.runInNewContext(source, context);
  const scene = {
    renderError: event(), postRender: event(),
    canvas: {
      addEventListener(name, fn) { canvasEvents.set(name, fn); },
      removeEventListener(name) { canvasEvents.delete(name); }
    },
    requestRender() { requests += 1; },
    globe: { maximumScreenSpaceError: 10.8 }
  };
  const viewer = { scene, resolutionScale: 0.5, isDestroyed: () => destroyed };
  Object.defineProperty(viewer, "useDefaultRenderLoop", {
    get: () => running,
    set(value) { if (value && !running) restarts += 1; running = value; }
  });
  // Cesium's own listener stops its loop before the app receives the error.
  scene.renderError.addEventListener(() => { running = false; });
  const recovery = context.window.GeoRiskMapInteractions.installRenderRecovery({ viewer,
    onStateChange(change) { changes.push(change); } });
  return {
    viewer, scene, document, frames, intervals, canvasEvents, changes, recovery,
    get restarts() { return restarts; }, get requests() { return requests; },
    frame() { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn()); },
    tick() { [...intervals.values()].forEach(fn => fn()); },
    error(error = new Error("fixture render failure")) { scene.renderError.fire(scene, error); },
    destroy() { destroyed = true; }, queueFrame: context.requestAnimationFrame
  };
}

{
  const h = harness();
  for (let i = 0; i < 30; i += 1) h.tick();
  assert.deepEqual(h.changes, [], "el render a demanda quieto no implica un fallo");
  const failure = new Error("transient primitive failure");
  h.error(failure);
  assert.equal(h.changes[0].error, failure, "conservar el error real, no confundirlo con la escena");
  h.error(failure);
  assert.equal(h.frames.size, 1, "varios eventos del frame fallido no duplican intentos");
  h.scene.postRender.fire();
  assert.equal(h.recovery.getState().phase, "waiting", "Cesium puede emitir postRender desde el mismo frame fallido");
  let oldLoopRestarts = 0;
  h.queueFrame(() => { if (h.viewer.useDefaultRenderLoop) oldLoopRestarts += 1; });
  h.frame();
  assert.equal(h.restarts, 0, "primero debe drenarse el callback anterior");
  assert.equal(oldLoopRestarts, 0);
  h.frame();
  assert.equal(h.restarts, 1);
  assert.equal(h.requests, 1);
  assert.equal(h.recovery.getState().phase, "retrying");
  h.scene.postRender.fire();
  assert.equal(h.recovery.getState().phase, "recovered");
  assert.equal(h.viewer.resolutionScale, 0.5, "recuperar no puede aumentar la carga de GPU movil");
  assert.equal(h.scene.globe.maximumScreenSpaceError, 10.8, "conservar el detalle seleccionado");
  h.error();
  assert.equal(h.recovery.getState().phase, "failed", "un segundo fallo ofrece recarga, no otro reinicio");
  h.scene.postRender.fire();
  for (let i = 0; i < 20; i += 1) { h.tick(); h.frame(); }
  assert.equal(h.viewer.useDefaultRenderLoop, false);
  assert.equal(h.restarts, 1);
  assert.equal(h.changes.filter(change => change.phase === "failed").length, 1);
  assert.equal(h.intervals.size, 0, "un fallo terminal no debe dejar sondeos activos");
}

{
  const h = harness();
  h.error(); h.frame(); h.frame();
  h.error();
  h.scene.postRender.fire();
  assert.equal(h.recovery.getState().phase, "failed", "un frame fallido no confirma recuperacion");
  assert.ok(!h.changes.some(change => change.phase === "recovered"));
}

{
  const h = harness();
  h.viewer.useDefaultRenderLoop = false;
  h.document.visibilityState = "hidden";
  for (let i = 0; i < 20; i += 1) h.tick();
  assert.equal(h.changes.length, 0, "no iniciar una recuperacion por sondeo con pestana oculta");
  h.document.visibilityState = "visible";
  h.tick();
  assert.equal(h.changes[0].error.message, "Render loop stopped");
  h.frame(); h.frame();
  for (let i = 0; i < 4; i += 1) h.tick();
  h.document.visibilityState = "hidden";
  for (let i = 0; i < 20; i += 1) h.tick();
  assert.equal(h.recovery.getState().phase, "retrying");
  h.document.visibilityState = "visible";
  for (let i = 0; i < 4; i += 1) h.tick();
  assert.equal(h.recovery.getState().phase, "failed");
  assert.equal(h.changes.at(-1).error.message, "No rendered frame after retry");
}

for (const duringRetry of [false, true]) {
  const h = harness();
  if (duringRetry) h.error();
  h.canvasEvents.get("webglcontextlost")();
  h.frame(); h.tick();
  assert.equal(h.recovery.getState().phase, "failed");
  assert.equal(h.restarts, 0, "un contexto perdido necesita recarga, no reactivar buffers invalidos");
  assert.equal(h.frames.size, 0);
}

for (const disposedExplicitly of [false, true]) {
  const h = harness();
  h.error();
  if (disposedExplicitly) h.recovery.dispose();
  else { h.destroy(); h.tick(); }
  h.recovery.dispose();
  h.frame();
  assert.equal(h.restarts, 0);
  assert.equal(h.frames.size, 0);
  assert.equal(h.intervals.size, 0);
  assert.equal(h.canvasEvents.size, 0);
  assert.equal(h.scene.postRender.listeners.size, 0);
  assert.equal(h.scene.renderError.listeners.size, 1, "no retirar el listener propio de Cesium");
}

{
  const h = harness();
  h.error(); h.frame();
  h.scene.requestRender = () => { throw new Error("restart failed"); };
  h.frame();
  assert.equal(h.recovery.getState().phase, "failed");
  assert.equal(h.viewer.useDefaultRenderLoop, false);
}

console.log("map-render-recovery.test.js ok");
