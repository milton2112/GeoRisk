import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { deferCesiumResolutionResize } from "../lib/cesium-resolution-resize.js";

const filename = "node_modules/@cesium/engine/Source/Widget/CesiumWidget.js";
const source = await fs.readFile(filename, "utf8");
assert.equal(deferCesiumResolutionResize(source, "other/CesiumWidget.js"), source);
for (const text of ["function startRenderLoop(widget) {", "widget.resize();", "        this._useDefaultRenderLoop = value;", "CesiumWidget.prototype.destroy = function () {", "  this._forceResize = false;\n\n  configureCanvasSize(this);"]) {
  assert.throws(() => deferCesiumResolutionResize(source.replace(text, "changed"), filename), /resize lifecycle changed/);
}
const patched = deferCesiumResolutionResize(source, filename);
assert.throws(() => deferCesiumResolutionResize(patched, filename), /resize lifecycle changed/);

function harness(newline = "\n") {
  const transformed = deferCesiumResolutionResize(source.replace(/\r?\n/g, newline), filename);
  const helpers = transformed.slice(transformed.indexOf("function releaseResolutionResizeFence"), transformed.indexOf("function configurePixelRatio"));
  const frames = [];
  const calls = { fences: 0, flushes: 0, polls: 0, deleted: [], resized: 0, rendered: 0 };
  const gl = { SYNC_GPU_COMMANDS_COMPLETE: 1, TIMEOUT_EXPIRED: 2, ALREADY_SIGNALED: 3, CONDITION_SATISFIED: 4, WAIT_FAILED: 5,
    status: 2, fence: {}, fenceSync(condition, flags) { assert.equal(condition, 1); assert.equal(flags, 0); calls.fences++; return this.fence; },
    flush() { calls.flushes++; }, clientWaitSync(sync, flags, timeout) { assert.equal(sync, this.fence); assert.equal(flags, 0); assert.equal(timeout, 0); calls.polls++; return this.status; },
    deleteSync(sync) { calls.deleted.push(sync); } };
  const widget = { _forceResize: true, _canvasClientWidth: 390, _canvasClientHeight: 844, _lastDevicePixelRatio: 1,
    _canvas: { clientWidth: 390, clientHeight: 844 }, _clock: { shouldAnimate: false },
    _scene: { _lastRenderTime: {}, _context: { webgl2: true, _gl: gl } },
    _useDefaultRenderLoop: true, _targetFrameRate: undefined, isDestroyed: () => false,
    resize() { calls.resized++; this._forceResize = false; }, render() { calls.rendered++; } };
  const scope = { window: { devicePixelRatio: 1 }, defined: value => value !== undefined && value !== null,
    requestAnimationFrame: callback => frames.push(callback) };
  vm.runInNewContext(helpers, scope);
  return { widget, gl, calls, scope, frames, ready: time => scope.resolutionResizeReady(widget, time),
    step(time) { assert.ok(frames.length); frames.shift()(time); } };
}

for (const newline of ["\n", "\r\n"]) {
  const test = harness(newline);
  assert.equal(test.ready(10), false);
  assert.equal(test.ready(30), false);
  assert.equal(test.calls.fences, 1, "one owned fence, no new fence for each poll");
  assert.equal(test.calls.flushes, 1);
  assert.equal(test.widget._forceResize, true, "pending resolution is not discarded");
  test.gl.status = test.gl.ALREADY_SIGNALED;
  assert.equal(test.ready(50), true);
  assert.deepEqual(test.calls.deleted, [test.gl.fence]);
  assert.equal(test.widget._geoRiskResizeFence, undefined);
}
for (const bypass of ["unchanged", "first-frame", "webgl1", "animation", "width", "height", "dpr"]) {
  const test = harness();
  if (bypass === "unchanged") test.widget._forceResize = false;
  if (bypass === "first-frame") test.widget._scene._lastRenderTime = undefined;
  if (bypass === "webgl1") test.widget._scene._context.webgl2 = false;
  if (bypass === "animation") test.widget._clock.shouldAnimate = true;
  if (bypass === "width") test.widget._canvas.clientWidth++;
  if (bypass === "height") test.widget._canvas.clientHeight++;
  if (bypass === "dpr") test.scope.window.devicePixelRatio = 2;
  assert.equal(test.ready(10), true, bypass);
  assert.equal(test.calls.fences, 0, bypass);
}
for (const fallback of ["timeout", "poll-bound", "clock-reversed", "wait-failed", "context-replaced", "layout-changed", "cancelled", "animation-started"]) {
  const test = harness();
  test.ready(10);
  if (fallback === "poll-bound") test.widget._geoRiskResizeFence.polls = 63;
  if (fallback === "wait-failed") test.gl.status = test.gl.WAIT_FAILED;
  if (fallback === "context-replaced") test.widget._scene._context._gl = {};
  if (fallback === "layout-changed") test.widget._canvas.clientHeight++;
  if (fallback === "cancelled") test.widget._forceResize = false;
  if (fallback === "animation-started") test.widget._clock.shouldAnimate = true;
  assert.equal(test.ready(fallback === "timeout" ? 1510 : fallback === "clock-reversed" ? 0 : 30), true, fallback);
  assert.equal(test.widget._geoRiskResizeFence, undefined);
  assert.equal(test.calls.deleted.length, 1, fallback);
  test.scope.releaseResolutionResizeFence(test.widget);
  assert.equal(test.calls.deleted.length, 1, "cleanup is idempotent");
}
{
  const test = harness();
  test.gl.fence = null;
  assert.equal(test.ready(10), true, "native fallback if no fence can be allocated");
  assert.equal(test.calls.flushes, 0);
}
for (const target of [undefined, 30]) {
  const test = harness();
  test.widget._targetFrameRate = target;
  test.scope.startRenderLoop(test.widget);
  test.step(40);
  test.step(80);
  assert.equal(test.calls.resized, 0, "default loop yields resize while fence is pending");
  assert.equal(test.calls.rendered, 0, "do not submit frames behind the fence");
  test.gl.status = test.gl.CONDITION_SATISFIED;
  test.step(120);
  assert.equal(test.calls.resized, 1);
  assert.equal(test.calls.rendered, 1);
  test.step(160);
  assert.equal(test.calls.fences, 1, "steady frames add no sync queries");
  assert.equal(test.calls.polls, 2);
}
{
  const test = harness();
  test.scope.startRenderLoop(test.widget);
  test.step(10);
  test.widget._useDefaultRenderLoop = false;
  test.step(30);
  assert.equal(test.widget._geoRiskResizeFence, undefined, "native render-error stop also releases its fence");
  assert.equal(test.calls.deleted.length, 1);
  assert.equal(test.frames.length, 0, "stop never schedules extra polling");
}
{
  const test = harness();
  test.gl.clientWaitSync = () => { throw new Error("driver failure"); };
  test.scope.startRenderLoop(test.widget);
  test.step(10); test.step(30);
  assert.equal(test.widget._useDefaultRenderLoop, false);
  assert.equal(test.widget._geoRiskResizeFence, undefined, "render-loop error releases its fence");
}
// Extract actual native public entry points: keep synchronous resize and teardown order.
{
  const test = harness();
  function CesiumWidget() {}
  const scope = { ...test.scope, CesiumWidget };
  const configureStart = source.indexOf("function configurePixelRatio");
  vm.runInNewContext(source.slice(configureStart, source.indexOf("\n/**", configureStart)), scope);
  const resizeStart = patched.indexOf("CesiumWidget.prototype.resize =");
  vm.runInNewContext(patched.slice(resizeStart, patched.indexOf("\n/**", resizeStart)), scope);
  const propertyStart = source.indexOf("  resolutionScale: {");
  const property = source.slice(propertyStart, source.indexOf("\n  },", propertyStart) + 6);
  const descriptor = vm.runInNewContext(`({ ${property} }).resolutionScale`, {});
  Object.defineProperty(test.widget, "resolutionScale", descriptor);
  Object.assign(test.widget, { _useBrowserRecommendedResolution: true, _resolutionScale: 0.5,
    resize: CesiumWidget.prototype.resize });
  Object.assign(test.widget._scene, { camera: { frustum: { aspectRatio: 1 } }, requestRender() {} });
  for (const dimension of ["width", "height"]) Object.defineProperty(test.widget._canvas, dimension, {
    get() { return this["_" + dimension]; }, set(value) { this["_" + dimension] = Math.trunc(value); }
  });
  test.widget.resolutionScale = 0.44;
  test.scope.startRenderLoop(test.widget);
  test.step(10);
  test.widget.resolutionScale = 0.46;
  test.gl.status = test.gl.ALREADY_SIGNALED;
  test.step(30);
  assert.equal(test.widget.resolutionScale, 0.46, "latest requested scale survives a pending fence");
  assert.equal(test.widget._canvas.width, 179);
  assert.equal(test.widget._canvas.height, 388);
  assert.equal(test.widget._scene.pixelRatio, 0.46);
  assert.equal(test.widget._scene.camera.frustum.aspectRatio, 179 / 388);
  assert.equal(test.widget._forceResize, false);
  assert.equal(test.calls.fences, 1, "coalesce changes without additional fences");
}
{
  const test = harness();
  function CesiumWidget() {}
  const scope = { CesiumWidget, releaseResolutionResizeFence: test.scope.releaseResolutionResizeFence,
    window: { devicePixelRatio: 1 }, configureCanvasSize: widget => { widget.sized = true; },
    configureCameraFrustum: widget => { assert.equal(widget.sized, true); widget.frustum = true; } };
  const start = patched.indexOf("CesiumWidget.prototype.resize =");
  vm.runInNewContext(patched.slice(start, patched.indexOf("\n/**", start)), scope);
  test.widget._scene.requestRender = () => { assert.equal(test.widget.frustum, true); };
  CesiumWidget.prototype.resize.call(test.widget);
  assert.equal(test.widget._forceResize, false);
  assert.equal(test.calls.fences, 0, "manual resize remains synchronous and creates no fence");
  assert.match(patched, /CesiumWidget\.prototype\.destroy = function \(\) \{\s+releaseResolutionResizeFence\(this\);\s+\/\/ Unsubscribe/);
  const propertyStart = patched.indexOf("  useDefaultRenderLoop: {");
  const property = patched.slice(propertyStart, patched.indexOf("\n  },", propertyStart) + 6);
  test.widget._forceResize = true;
  test.ready(10);
  vm.runInNewContext(`({ ${property} }).useDefaultRenderLoop.set.call(widget, false);`, { ...test.scope, widget: test.widget });
  assert.equal(test.widget._geoRiskResizeFence, undefined, "disabling default loop releases pending work immediately");
}
{
  const test = harness();
  test.ready(10);
  function CesiumWidget() {}
  const scope = { CesiumWidget, releaseResolutionResizeFence: test.scope.releaseResolutionResizeFence,
    defined: test.scope.defined, destroyObject: widget => { widget.destroyed = true; } };
  const start = patched.indexOf("CesiumWidget.prototype.destroy =");
  vm.runInNewContext(patched.slice(start, patched.indexOf("\n/**", start)), scope);
  Object.assign(test.widget, { dataSources: { length: 0 }, _dataSourceRemoved() {},
    _dataSourceDisplay: { defaultDataSource: {}, destroy() {} }, _onRenderError() {},
    _container: { removeChild() {} }, _creditContainer: { removeChild() {} }, _eventHelper: { removeAll() {} } });
  Object.assign(test.widget._scene, { renderError: { removeEventListener() {} }, destroy() {
    assert.equal(test.widget._geoRiskResizeFence, undefined, "fence must be deleted before its GL context is destroyed");
    assert.equal(test.calls.deleted.length, 1);
  } });
  CesiumWidget.prototype.destroy.call(test.widget);
  assert.equal(test.widget.destroyed, true);
}
console.log("cesium-resolution-resize.test.js ok: bounded default-loop yielding, native fallbacks/public resize and fence cleanup");
