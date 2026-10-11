import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs/promises";
import { installCountryRendererObserver } from "../lib/browser-country-renderer.js";
import { PUBLIC_FILES } from "../lib/public-assets.js";

function fixture({ own = false, installed = false, count = 2 } = {}) {
  let resolve, reject;
  const nativePromise = new Promise((yes, no) => { resolve = yes; reject = no; });
  const frames = new Set();
  const calls = [];
  const visualizers = Array.from({ length: count }, () => Object.create({ update(...args) {
    calls.push({ receiver: this, args }); return args[0];
  } }));
  const source = { show: true, _visualizers: visualizers };
  const update = function (...args) { calls.push({ receiver: this, args }); return args[0]; };
  const display = own ? { update } : Object.create({ update });
  display.defaultDataSource = { _visualizers: [] };
  display.ready = true; // Latched readiness must remain distinct from the live update result.
  const options = { viewer: { dataSourceDisplay: display, useDefaultRenderLoop: true,
    scene: { postRender: { addEventListener(fn) { frames.add(fn); return () => frames.delete(fn); } } },
    dataSources: { length: 1, get: () => source, contains: value => value === source } }, source, timeoutMs: 20000 };
  let passedOptions;
  const api = { waitForDataSourceFrame(value) { passedOptions = value; return nativePromise; } };
  const window = installed ? { GeoRiskMap: api } : {};
  vm.runInNewContext("(" + installCountryRendererObserver.toString() + ")()", { window });
  if (!installed) window.GeoRiskMap = api;
  const promise = api.waitForDataSourceFrame(options);
  const clean = () => {
    assert.equal(display.update, update);
    assert.equal(Object.hasOwn(display, "update"), own);
    assert.ok(visualizers.every(item => !Object.hasOwn(item, "update")));
    assert.equal(frames.size, 0);
  };
  return { window, api, options, display, visualizers, update, calls, frames, promise, resolve, reject, clean,
    get passedOptions() { return passedOptions; } };
}

for (const own of [false, true]) for (const installed of [false, true]) {
  const test = fixture({ own, installed });
  assert.equal(test.passedOptions, test.options, "forward the exact source/current guard/deadline options");
  const trackedUpdate = test.display.update;
  assert.equal(test.api.waitForDataSourceFrame(test.options), test.promise, "share the running wait without stacking wrappers");
  assert.equal(test.display.update, trackedUpdate);
  assert.equal(test.frames.size, 1);
  assert.equal(test.calls.length, 0, "observation cannot issue additional native updates");
  assert.equal(test.display.update(false, "time"), false);
  assert.equal(test.visualizers[0].update(false), false);
  for (const fn of test.frames) fn();
  const state = test.window.__countryRendererProbe;
  assert.equal(state.status, "waiting", "a frame and latched display.ready cannot approve readiness");
  assert.equal(state.frames, 1);
  assert.equal(state.lastReady, false);
  assert.equal(state.readyUpdates, 0);
  assert.equal(state.visualizers[0].lastReady, false);
  assert.equal(test.calls[0].receiver, test.display);
  assert.deepEqual(test.calls[0].args, [false, "time"]);
  assert.equal(test.display.update(true), true);
  test.resolve(test.options.source);
  assert.equal(await test.promise, test.options.source);
  assert.equal(state.status, "passed");
  assert.equal(state.updates, 2);
  assert.equal(state.readyUpdates, 1);
  assert.equal(state.sourceAttached, true);
  test.clean();
}
{
  const test = fixture();
  const error = new Error("Country rendering timed out.");
  test.reject(error);
  await assert.rejects(test.promise, value => value === error);
  assert.equal(test.window.__countryRendererProbe.status, "failed");
  assert.equal(test.window.__countryRendererProbe.error, error.message);
  test.clean();
}
{
  const test = fixture();
  const replacement = () => true;
  test.display.update = replacement;
  test.resolve(test.options.source);
  await test.promise;
  assert.equal(test.display.update, replacement, "cleanup must preserve a later owner");
  assert.equal(test.frames.size, 0);
}
{
  const test = fixture({ count: 40 });
  assert.equal(test.window.__countryRendererProbe.visualizers.length, 32, "retained detail has a fixed bound");
  assert.equal(Object.hasOwn(test.visualizers[32], "update"), false);
  test.resolve(test.options.source);
  await test.promise;
  test.clean();
}
assert.ok(!PUBLIC_FILES.includes("scripts/lib/browser-country-renderer.js"), "the observer is internal tooling");

// A terminal startup failure must fail promptly, rather than burn the remaining app deadline.
{
  const source = await fs.readFile(new URL("./critical-browser-e2e.test.js", import.meta.url), "utf8");
  const start = source.indexOf("async function waitForAppReady(");
  const end = source.indexOf("async function waitForMapMode(", start);
  assert.ok(start >= 0 && end > start);
  const diagnostics = [];
  const message = "No se pudieron dibujar los limites de paises.";
  const state = { APP_TIMEOUT_MS: 45000, performance: { now: () => 0 },
    document: { getElementById: () => ({ hidden: false, textContent: message }) },
    console: { error: (...args) => diagnostics.push(args) } };
  vm.createContext(state);
  vm.runInContext(source.slice(start, end), state);
  const page = {
    async waitForFunction(read, arg, options) {
      assert.equal(options.timeout, 45000, "the original healthy startup deadline is unchanged");
      const ready = vm.runInContext("(" + read.toString() + ")(false)", state);
      if (!ready) throw new Error("Would wait for timeout");
    },
    async evaluate() { return {}; },
    locator() { throw new Error("A failed boot must not proceed to the canvas"); }
  };
  await assert.rejects(state.waitForAppReady(page, { requireTiles: false }), error => error.message === message,
    "the real fatal message must win even before viewer/data are available");
  assert.equal(diagnostics.length, 1, "collect failure state only once");
}
console.log("browser-country-renderer.test.js OK: passive bounded observation, original deadlines and cleanup");
