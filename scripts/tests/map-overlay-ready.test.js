import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const moduleSource = await fs.readFile(new URL("../../app-map.js", import.meta.url), "utf8");
function event() {
  const listeners = new Set();
  return { listeners, addEventListener: fn => listeners.add(fn), removeEventListener: fn => listeners.delete(fn),
    emit: (...args) => [...listeners].forEach(fn => fn(...args)) };
}
function harness(ownUpdate = false) {
  const timers = new Map();
  const calls = [];
  const source = { show: true };
  const state = { complete: false, current: true, attached: true };
  const original = function (...args) { calls.push({ receiver: this, args }); return state.complete; };
  const display = ownUpdate ? { update: original } : Object.create({ update: original });
  // DataSourceDisplay.ready is latched after an empty scene and cannot be trusted here.
  display.ready = true;
  const scene = { postRender: event(), renderError: event(), requestRender() {} };
  const viewer = { scene, dataSourceDisplay: display, dataSources: { contains: value => state.attached && value === source },
    isDestroyed: () => false, useDefaultRenderLoop: true };
  const context = { window: {}, setTimeout: (fn, delay) => { timers.set(1, { fn, delay }); return 1; }, clearTimeout: id => timers.delete(id) };
  vm.runInNewContext(moduleSource, context);
  const wait = (options = {}) => context.window.GeoRiskMap.waitForDataSourceFrame({ viewer, source, isCurrent: () => state.current, ...options });
  const assertClean = () => {
    assert.equal(scene.postRender.listeners.size, 0);
    assert.equal(scene.renderError.listeners.size, 0);
    assert.equal(timers.size, 0);
  };
  return { state, viewer, display, scene, source, calls, original, timers, wait, assertClean };
}

for (const ownUpdate of [true, false]) {
  const test = harness(ownUpdate);
  let resolved = false;
  const promise = test.wait().then(value => { resolved = true; return value; });
  test.scene.postRender.emit();
  await Promise.resolve();
  assert.equal(resolved, false, "un frame del fondo no habilita los controles");
  assert.equal(test.display.update("time", "extra"), false);
  test.scene.postRender.emit();
  await Promise.resolve();
  assert.equal(resolved, false, "ready latched no equivale a paises preparados");
  test.state.complete = true;
  assert.equal(test.display.update("next-time"), true);
  await Promise.resolve();
  assert.equal(resolved, false, "esperar tambien el frame posterior al update completo");
  test.scene.postRender.emit();
  assert.equal(await promise, test.source);
  assert.deepEqual(test.calls[0].args, ["time", "extra"]);
  assert.equal(test.calls[0].receiver, test.display);
  assert.equal(test.calls.length, 2, "no ejecutar updates adicionales para sondear Cesium");
  assert.equal(test.display.update, test.original);
  assert.equal(Object.hasOwn(test.display, "update"), ownUpdate);
  test.assertClean();
}

{
  const test = harness();
  const promise = test.wait();
  const trackedUpdate = test.display.update;
  assert.equal(test.wait(), promise, "compartir la espera inicial sin acumular wrappers");
  await assert.rejects(test.wait({ source: { show: true } }), /Another country renderer/);
  assert.equal(test.display.update, trackedUpdate);
  test.state.complete = true;
  test.display.update();
  test.scene.postRender.emit();
  await promise;
  assert.equal(test.display.update, test.original);
  const next = test.wait();
  assert.notEqual(next, promise, "no reutilizar una espera ya completada");
  test.display.update();
  test.scene.postRender.emit();
  await next;
  test.assertClean();
}

{
  const test = harness();
  const promise = test.wait();
  test.state.complete = true;
  test.display.update();
  test.state.complete = false;
  test.display.update();
  test.scene.postRender.emit();
  assert.equal(test.scene.postRender.listeners.size, 1, "usar el resultado mas reciente, no uno anterior");
  test.state.complete = true;
  test.display.update();
  test.scene.postRender.emit();
  await promise;
  test.assertClean();
}

for (const failure of ["timeout", "stopped", "destroyed", "hidden", "detached", "replaced", "render-error", "request-error", "update-error"]) {
  const test = harness();
  const error = new Error(failure);
  if (failure === "request-error") test.scene.requestRender = () => { throw error; };
  if (failure === "update-error") test.display.update = () => { throw error; };
  const updateBeforeWait = test.display.update;
  const promise = test.wait();
  const rejected = assert.rejects(promise);
  if (failure === "timeout") {
    assert.equal(test.timers.get(1).delay, 20000);
    test.timers.get(1).fn();
  } else if (failure === "render-error") test.scene.renderError.emit(test.scene, error);
  else if (failure === "update-error") assert.throws(() => test.display.update(), error);
  else if (failure !== "request-error") {
    test.state.complete = true;
    test.display.update();
    if (failure === "stopped") test.viewer.useDefaultRenderLoop = false;
    if (failure === "destroyed") test.viewer.isDestroyed = () => true;
    if (failure === "hidden") test.source.show = false;
    if (failure === "detached") test.state.attached = false;
    if (failure === "replaced") test.state.current = false;
    test.scene.postRender.emit();
  }
  await rejected;
  assert.equal(test.display.update, updateBeforeWait);
  test.assertClean();
}

{
  const test = harness();
  const promise = test.wait();
  const timeout = test.timers.get(1).fn;
  const anotherUpdate = () => true;
  test.display.update = anotherUpdate;
  const rejected = assert.rejects(promise);
  timeout();
  await rejected;
  assert.equal(test.display.update, anotherUpdate, "no sobrescribir un cambio ajeno durante la espera");
  test.assertClean();
}

for (const missing of ["viewer", "source", "display", "requestRender", "contains"]) {
  const test = harness();
  if (missing === "display") delete test.viewer.dataSourceDisplay;
  if (missing === "requestRender") delete test.scene.requestRender;
  if (missing === "contains") delete test.viewer.dataSources.contains;
  await assert.rejects(test.wait(missing === "viewer" ? { viewer: null } : missing === "source" ? { source: null } : {}), /unavailable/);
  assert.equal(test.display.update, test.original);
  test.assertClean();
}

const script = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const init = script.slice(script.indexOf("async function init()"));
assert.ok(init.indexOf("await measureBootStep(\"startupResources\"") < init.indexOf("mapCore.waitForDataSourceFrame"));
assert.ok(init.indexOf("mapCore.waitForDataSourceFrame") < init.indexOf('const bootDeferredUi'));
console.log("map-overlay-ready.test.js ok");
