import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { patchPresentationScene, patchPresentationWidget } from '../diagnostics/presentation-transform.js';
import { deferCesiumResolutionResize } from '../lib/cesium-resolution-resize.js';

const sceneSource = await fs.readFile('node_modules/@cesium/engine/Source/Scene/Scene.js', 'utf8');
const widgetFile = 'node_modules/@cesium/engine/Source/Widget/CesiumWidget.js';
const widgetSource = await fs.readFile(widgetFile, 'utf8');
const patched = patchPresentationScene(sceneSource);
const widgetPatched = patchPresentationWidget(deferCesiumResolutionResize(widgetSource, widgetFile));
assert.throws(() => patchPresentationScene(patched), /anchor|finalization/);
assert.throws(() => patchPresentationWidget(widgetPatched), /anchors/);
for (const anchor of ['    frameState.creditDisplay.beginFrame();', '    scene._renderError.raiseEvent(scene, error);']) {
  assert.throws(() => patchPresentationScene(sceneSource.replace(anchor, 'changed')), /anchor/);
}
const section = (source, start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const outerRender = section(patched, 'Scene.prototype.render = function (time)', '\n/**');
const helpers = section(patched, '// PROTOTYPE ONLY:', '// Explicit rendering,');
const wrappers = section(patched, '// Explicit rendering,', '\nexport default Scene;');
const nativeCatch = section(patched, 'function tryAndCatchError(', '\nfunction updateMostDetailedRayPicks');
const wrappedApis = ['initializeFrame', 'pick', 'drillPick', 'pickPosition', 'pickPositionWorldCoordinates',
  'pickVoxel', 'pickMetadata', 'pickMetadataSchema', 'pickFromRay', 'drillPickFromRay',
  'pickFromRayMostDetailed', 'drillPickFromRayMostDetailed', 'morphTo2D', 'morphTo3D', 'morphToColumbusView'];

// Execute the actual transformed entry points, frame finalizer and helpers with small GL doubles.
// No browser, downloads or copies of Cesium's lifecycle logic in these regressions.
function harness() {
  const calls = { created: 0, destroyed: 0, shaders: 0, deleted: 0, polled: 0, copied: 0,
    begin: 0, end: 0, pre: 0, post: 0, after: 0, errors: 0, nativeDestroy: 0, states: [], removed: [] };
  let now = 100;
  function Scene() {}
  for (const name of wrappedApis) {
    assert.ok(sceneSource.includes('Scene.prototype.' + name + ' = function'), 'native API exists: ' + name);
    Scene.prototype[name] = function (...args) {
      calls.apiEntry = { receiver: this, args, pending: this._geoRiskPendingPresentation, posts: calls.post };
      if (this.apiError) throw this.apiError;
      return this.apiResult || { receiver: this, args };
    };
  }
  Scene.prototype.destroy = () => { calls.nativeDestroy++; };
  const gl = { SYNC_GPU_COMMANDS_COMPLETE: 1, TIMEOUT_EXPIRED: 2, ALREADY_SIGNALED: 3, WAIT_FAILED: 4,
    renderer: 'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)', identityQueries: 0,
    getExtension(name) { assert.equal(name, 'WEBGL_debug_renderer_info'); this.identityQueries++; return { UNMASKED_RENDERER_WEBGL: 99 }; },
    getParameter(name) { assert.equal(name, 99); return this.renderer; },
    status: 2, lost: false, fence: {}, isContextLost() { return this.lost; },
    fenceSync: () => gl.fence, flush() {}, deleteSync(sync) { assert.equal(sync, gl.fence); calls.deleted++; },
    clientWaitSync(sync, flags, timeout) { assert.equal(sync, gl.fence); assert.equal(flags, 0); assert.equal(timeout, 0); calls.polled++; return gl.status; } };
  const context = { _gl: gl, webgl2: true, drawingBufferWidth: 171, drawingBufferHeight: 371, endFrame() {},
    createViewportQuadCommand: () => ({ shaderProgram: { destroy() { calls.shaders++; } },
      execute() { calls.copied++; if (context.copyError) throw new Error('copy failed'); } }) };
  class FramebufferManager {
    constructor() { calls.created++; this.framebuffer = {}; }
    update() {} getColorTexture() {} destroy() { calls.destroyed++; }
  }
  const scene = Object.assign(new Scene(), { context, _geoRiskPresentationEnabled: true,
    _renderRequested: true, requestRenderMode: true, _lastRenderTime: {}, mode: 2, primitives: { show: false },
    _frameState: { frameNumber: 1, time: {}, afterRender: [],
      creditDisplay: { beginFrame() { calls.begin++; }, endFrame() { calls.end++; } } },
    _preUpdate: { raiseEvent() {} }, _postUpdate: { raiseEvent() {} },
    _view: { checkForCameraUpdates: () => false },
    _preRender: { raiseEvent() { calls.pre++; } },
    _postRender: { raiseEvent() { calls.post++; if (scene.postError) throw new Error('post failed'); } },
    _renderError: { raiseEvent() { calls.errors++; } }, rethrowRenderErrors: false });
  const scope = { Scene, FramebufferManager, PassThrough: '', performance: { now: () => now },
    BoundingRectangle: class { constructor(x, y, width, height) { Object.assign(this, { x, y, width, height }); } },
    RenderState: { fromCache(descriptor) { calls.states.push(descriptor); return { cached: descriptor }; },
      removeFromCache(descriptor) { calls.removed.push(descriptor); } },
    JulianDate: { clone: time => time, now: () => ({}), secondsDifference: () => 0 },
    defined: value => value != null, CesiumMath: { incrementWrap: n => n + 1 },
    updateFrameNumber: (s, n, time) => Object.assign(s._frameState, { frameNumber: n, time }),
    prePassesUpdate() {}, updateDebugShowFramesPerSecond() {}, postPassesUpdate() {},
    callAfterRenderFunctions(s) { for (const fn of s._frameState.afterRender) fn(); s._frameState.afterRender.length = 0; },
    render(s) {
      if (s._geoRiskSubmitPresentation) scope.prototypeTarget(s);
      if (scene.renderError) throw new Error('render failed');
      if (s._geoRiskSubmitPresentation) scope.prototypeSubmit(s);
    } };
  const nativeForceRender = section(sceneSource, 'Scene.prototype.forceRender = function', '\n/**');
  vm.runInNewContext(helpers + nativeCatch + outerRender + nativeForceRender + wrappers, scope);
  return { scene, gl, context, calls, scope, setTime: value => { now = value; },
    stage() {
      scene._renderRequested = true;
      scene._geoRiskSubmitPresentation = true;
      scene._frameState.afterRender.push(() => { calls.after++; });
      try { scene.render({}); } finally { scene._geoRiskSubmitPresentation = false; }
    } };
}
for (const name of wrappedApis) {
  for (const behavior of ['return', 'promise', 'throw']) {
    const t = harness(); t.stage();
    const args = [{ point: 1 }, [2], 3, { result: true }];
    const value = behavior === 'promise' ? Promise.resolve(name) : { name };
    t.scene.apiResult = value;
    if (behavior === 'throw') t.scene.apiError = value;
    if (behavior === 'throw') assert.throws(() => t.scene[name](...args), error => error === value);
    else assert.equal(t.scene[name](...args), value, name + ': preserve exact return/promise identity');
    assert.equal(t.calls.apiEntry.receiver, t.scene);
    args.forEach((arg, index) => assert.equal(t.calls.apiEntry.args[index], arg));
    assert.equal(t.calls.apiEntry.pending, undefined, name + ': finish before entering native API');
    assert.equal(t.calls.apiEntry.posts, 1); assert.equal(t.calls.end, 1);
    assert.equal(t.calls.deleted, 1); assert.equal(t.scene._geoRiskPendingPresentation, undefined);
  }
}
{
  const t = harness(); t.stage();
  t.scene.forceRender({});
  assert.equal(t.calls.copied, 1, 'native forceRender delegates through the wrapped public render');
  assert.equal(t.calls.post, 2); assert.equal(t.calls.begin, 2); assert.equal(t.calls.end, 2);
  assert.equal(t.scene._geoRiskPendingPresentation, undefined);
  assert.equal(t.scene._geoRiskPresentationBuffer, undefined, 'explicit native rendering releases retained target');
}
{
  const t = harness(); t.stage();
  assert.equal(t.calls.begin, 1); assert.equal(t.calls.end, 0);
  assert.equal(t.calls.post, 0); assert.equal(t.calls.after, 0);
  assert.equal(t.scene._geoRiskPollPresentation(), false);
  assert.equal(t.calls.copied, 0);
  t.gl.status = t.gl.ALREADY_SIGNALED;
  assert.equal(t.scene._geoRiskPollPresentation(), true);
  assert.equal(t.calls.deleted, 1); assert.equal(t.calls.post, 1); assert.equal(t.calls.after, 1); assert.equal(t.calls.end, 1);
  for (let i = 0; i < 5; i++) { t.stage(); t.scene._geoRiskFlushPresentation(); }
  assert.equal(t.calls.states.length, 1, 'reuse the native cache entry at unchanged dimensions');
  t.context.drawingBufferWidth++; t.stage(); t.scene._geoRiskFlushPresentation();
  assert.equal(t.calls.states.length, 2);
  assert.equal(t.calls.removed[0], t.calls.states[0], 'release using the original partial descriptor');
  t.scene._geoRiskStopPresentation(); t.scene._geoRiskStopPresentation();
  assert.deepEqual(t.calls.removed, t.calls.states); assert.equal(t.calls.destroyed, 1); assert.equal(t.calls.shaders, 1);
  t.stage(); t.scene._geoRiskStopPresentation();
  assert.equal(t.calls.created, 2); assert.equal(t.scene._geoRiskPresentationStats.submitted, 8, 'bounded counters survive target recreation');
}
for (const fallback of ['null-sync', 'wait-failed', 'poll-bound', 'deadline', 'clock-reversed']) {
  const t = harness();
  if (fallback === 'null-sync') t.gl.fence = null;
  t.stage();
  if (fallback === 'wait-failed') t.gl.status = t.gl.WAIT_FAILED;
  if (fallback === 'poll-bound') t.scene._geoRiskPendingPresentation.polls = 63;
  if (fallback === 'deadline') t.setTime(1600);
  if (fallback === 'clock-reversed') t.setTime(0);
  assert.equal(t.scene._geoRiskPollPresentation(), true, fallback);
  assert.equal(t.calls.copied, 1); assert.equal(t.calls.post, 1); assert.equal(t.calls.end, 1);
}
for (const failure of ['lost', 'replaced', 'poll', 'copy', 'delete']) {
  const t = harness(); t.scene._geoRiskPresentationSupported(); t.stage();
  if (failure === 'lost') t.gl.lost = true;
  if (failure === 'replaced') t.context._gl = {};
  if (failure === 'poll') t.gl.clientWaitSync = () => { throw new Error('poll failed'); };
  if (failure === 'copy') { t.gl.status = t.gl.ALREADY_SIGNALED; t.context.copyError = true; }
  if (failure === 'delete') { t.gl.status = t.gl.ALREADY_SIGNALED; t.gl.deleteSync = () => { t.calls.deleted++; throw new Error('delete failed'); }; }
  assert.throws(() => t.scene._geoRiskPollPresentation(), /lost|replaced|failed/, failure);
  assert.equal(t.scene._geoRiskPendingPresentation, undefined);
  if (['lost', 'replaced'].includes(failure)) assert.equal(t.scene._geoRiskPresentationCapability, undefined);
  assert.equal(t.calls.post, 0); assert.equal(t.calls.after, 0); assert.equal(t.calls.end, 1);
  assert.equal(t.scene._frameState.afterRender.length, 1, 'do not discard public work on failed presentation');
  assert.equal(t.scene._renderRequested, true);
  assert.equal(t.calls.destroyed, 1); assert.equal(t.calls.shaders, 1);
  t.scene._geoRiskCancelPresentation();
  assert.ok(t.calls.deleted <= 1, 'release sync once, including a throwing driver');
  assert.equal(t.calls.end, 1); assert.equal(t.calls.destroyed, 1);
}
{
  const t = harness(); t.scene.renderError = true; t.stage();
  assert.equal(t.calls.errors, 1); assert.equal(t.calls.end, 1); assert.equal(t.calls.post, 0); assert.equal(t.calls.after, 0);
  assert.equal(t.calls.destroyed, 1); assert.equal(t.scene._renderRequested, true);
  t.scene.renderError = false; t.stage(); t.scene._geoRiskFlushPresentation();
  assert.equal(t.calls.after, 2, 'retained callbacks complete on the next successful frame');
}
{
  const t = harness(); t.stage(); t.scene.postError = true;
  assert.throws(() => t.scene._geoRiskFlushPresentation(), /post failed/);
  assert.equal(t.calls.end, 1, 'close credit even when a public callback throws');
  assert.equal(t.calls.destroyed, 1); t.scene._geoRiskCancelPresentation(); assert.equal(t.calls.end, 1);
}
{
  const t = harness(); t.stage();
  const picked = t.scene.pick('point', 1);
  assert.equal(picked.receiver, t.scene); assert.deepEqual(picked.args, ['point', 1]);
  assert.equal(t.calls.post, 1);
  t.stage(); t.scene.destroy();
  assert.equal(t.calls.end, 2); assert.equal(t.calls.post, 1, 'destroy cancels without a fictitious postRender');
  assert.equal(t.calls.nativeDestroy, 1); assert.equal(t.calls.destroyed, 1);
  assert.equal(t.scene._geoRiskPresentationCapability, undefined);
}
// Actual transformed widget loop, setter and native error callback.
function loopHarness() {
  const t = harness(), frames = [];
  let activePointers = false;
  const widget = { _scene: t.scene, _clock: { shouldAnimate: false }, _forceResize: false,
    _canvas: { clientWidth: 390, clientHeight: 844 }, _canvasClientWidth: 390, _canvasClientHeight: 844,
    _lastDevicePixelRatio: 1, _useDefaultRenderLoop: true, isDestroyed: () => false,
    resize() {}, render() { t.stage(); } };
  const scope = { ...t.scope, autoRotation: { hasActivePointers: () => activePointers },
    window: { devicePixelRatio: 1 }, document: { hidden: false }, SceneMode: { SCENE2D: 2 },
    requestAnimationFrame: fn => frames.push(fn), resolutionResizeReady: () => true, releaseResolutionResizeFence() {} };
  vm.runInNewContext(section(widgetPatched, 'function prototypeLoopFrame(', '\nfunction configurePixelRatio'), scope);
  return { ...t, widget, frames, scope, setActivePointers(value) { activePointers = value; },
    step() { frames.shift()(100); } };
}
for (const renderer of ['ANGLE (Intel, D3D11)', 'ANGLE (NVIDIA, Vulkan)', 'AMD Radeon', 'llvmpipe',
  'SwiftShaderX', '', null, 'SwiftShader'.repeat(52)]) {
  const t = loopHarness(); t.gl.renderer = renderer;
  t.widget.render = () => { assert.equal(t.scene._geoRiskSubmitPresentation, false, String(renderer)); };
  t.scope.prototypeLoopFrame(t.widget, 100); t.scope.prototypeLoopFrame(t.widget, 200);
  assert.equal(t.gl.identityQueries, 1, 'cache a negative result without retaining the string');
  assert.equal(t.scene._geoRiskPresentationBuffer, undefined, 'native hardware fallback allocates no target');
}
for (const unavailable of ['extension', 'exception', 'webgl1', 'disabled', 'lost', 'first-frame', 'hidden', 'mode', 'animation', 'pointer']) {
  const t = loopHarness();
  if (unavailable === 'extension') t.gl.getExtension = () => null;
  if (unavailable === 'exception') t.gl.getParameter = () => { throw new Error('privacy blocked'); };
  if (unavailable === 'webgl1') t.context.webgl2 = false;
  if (unavailable === 'disabled') t.scene._geoRiskPresentationEnabled = false;
  if (unavailable === 'lost') t.gl.lost = true;
  if (unavailable === 'first-frame') t.scene._lastRenderTime = undefined;
  if (unavailable === 'hidden') t.scope.document.hidden = true;
  if (unavailable === 'mode') t.scene.mode = 3;
  if (unavailable === 'animation') t.widget._clock.shouldAnimate = true;
  if (unavailable === 'pointer') t.setActivePointers(true);
  t.widget.render = () => { assert.equal(t.scene._geoRiskSubmitPresentation, false, unavailable); };
  t.scope.prototypeLoopFrame(t.widget, 100);
  assert.equal(t.scene._geoRiskPresentationBuffer, undefined);
  if (!['extension', 'exception'].includes(unavailable)) assert.equal(t.gl.identityQueries, 0);
}
{
  const t = loopHarness();
  assert.equal(t.scene._geoRiskPresentationSupported(), true);
  assert.equal(t.scene._geoRiskPresentationSupported(), true);
  assert.equal(t.gl.identityQueries, 1);
  assert.deepEqual(Object.keys(t.scene._geoRiskPresentationCapability).sort(), ['gl', 'supported']);
  t.gl.lost = true;
  assert.equal(t.scene._geoRiskPresentationSupported(), false);
  assert.equal(t.scene._geoRiskPresentationCapability, undefined, 'loss invalidates the cached decision');
  t.gl.lost = false; t.gl.renderer = 'ANGLE (Intel, D3D11)';
  assert.equal(t.scene._geoRiskPresentationSupported(), false);
  assert.equal(t.gl.identityQueries, 2, 'a resumed context needs a fresh identity');
  t.context._gl = { ...t.gl, renderer: 'ANGLE (SwiftShader Device)', identityQueries: 0 };
  assert.equal(t.scene._geoRiskPresentationSupported(), true);
  assert.equal(t.context._gl.identityQueries, 1, 'replacement context refreshes the bounded decision');
}
for (const resize of ['forced', 'width', 'height', 'dpr']) {
  const t = loopHarness(); t.stage();
  if (resize === 'forced') t.widget._forceResize = true;
  if (resize === 'width') t.widget._canvas.clientWidth++;
  if (resize === 'height') t.widget._canvas.clientHeight++;
  if (resize === 'dpr') t.scope.window.devicePixelRatio = 2;
  t.widget.resize = () => { assert.equal(t.scene._geoRiskPendingPresentation, undefined, resize); };
  t.widget.render = () => {};
  t.scope.prototypeLoopFrame(t.widget, 100);
  assert.equal(t.calls.post, 1); assert.equal(t.calls.deleted, 1);
  assert.equal(t.calls.polled, 0, 'finish the old size before changing canvas or pixel ratio');
}
for (const invalidation of ['disabled', 'hidden', 'animation', 'mode', 'webgl1', 'pointer']) {
  const t = loopHarness(); t.stage();
  if (invalidation === 'disabled') t.scene._geoRiskPresentationEnabled = false;
  if (invalidation === 'hidden') t.scope.document.hidden = true;
  if (invalidation === 'animation') t.widget._clock.shouldAnimate = true;
  if (invalidation === 'mode') t.scene.mode = 3;
  if (invalidation === 'webgl1') t.context.webgl2 = false;
  if (invalidation === 'pointer') t.setActivePointers(true);
  let rendered = 0;
  t.widget.render = () => { rendered++; assert.equal(t.scene._geoRiskSubmitPresentation, false); };
  t.scope.prototypeLoopFrame(t.widget, 100);
  assert.equal(t.scene._geoRiskPresentationBuffer, undefined, invalidation);
  assert.equal(t.calls.post, invalidation === 'hidden' ? 0 : 1); assert.equal(t.calls.destroyed, 1);
  assert.equal(rendered, invalidation === 'hidden' ? 0 : 1, 'hidden opt-in page does not issue native work either');
}
{
  const t = loopHarness(); t.stage();
  const submissions = [];
  t.widget.render = () => {
    submissions.push(t.scene._geoRiskSubmitPresentation);
    if (t.scene._geoRiskSubmitPresentation) t.stage();
  };
  t.setActivePointers(true);
  t.scope.prototypeLoopFrame(t.widget, 100);
  assert.deepEqual(submissions, [false], 'active map contact uses a native scene update');
  assert.equal(t.scene._geoRiskPendingPresentation, undefined);
  assert.equal(t.scene._geoRiskPresentationBuffer, undefined, 'release the staged target while contact remains active');
  t.setActivePointers(false);
  t.scope.prototypeLoopFrame(t.widget, 200);
  assert.deepEqual(submissions, [false, true], 'resume deferred frames after contact ends');
  assert.ok(t.scene._geoRiskPendingPresentation);
  t.scene._geoRiskCancelPresentation();
}
for (const stop of ['setter', 'error', 'native-error', 'direct-stop']) {
  const t = loopHarness(); t.stage();
  if (stop === 'setter') {
    const setter = section(widgetPatched, '  useDefaultRenderLoop: {', '\n  /**');
    const props = vm.runInNewContext('({' + setter + '})', t.scope);
    props.useDefaultRenderLoop.set.call(t.widget, false);
  } else if (stop === 'native-error') {
    // The callback is assigned to the VM global this, rather than the widget.
    t.scope.that = t.widget;
    vm.runInNewContext(section(widgetPatched, '    this._onRenderError = function', '    scene.renderError.addEventListener'), t.scope);
    t.scope._onRenderError(t.scene, new Error('native error'));
  } else {
    t.scope.startRenderLoop(t.widget);
    if (stop === 'error') t.gl.clientWaitSync = () => { throw new Error('poll failed'); };
    else t.widget._useDefaultRenderLoop = false;
    t.step();
  }
  assert.equal(t.widget._useDefaultRenderLoop, false, stop);
  assert.equal(t.scene._geoRiskPresentationBuffer, undefined, stop);
  assert.equal(t.calls.deleted, 1); assert.equal(t.calls.end, 1); assert.equal(t.calls.destroyed, 1);
  assert.equal(t.calls.post, 0, 'stopping the loop keeps the last presented frame, without forcing a new default-canvas copy');
  assert.equal(t.calls.after, 0);
  assert.equal(t.scene._frameState.afterRender.length, 1, 'resume or manual render retains pending public callbacks');
  assert.equal(t.scene._renderRequested, true);
  assert.equal(t.frames.length, 0, 'stopped loop schedules no polling');
  if (['setter', 'direct-stop'].includes(stop)) {
    t.stage(); t.scene._geoRiskFlushPresentation();
    assert.equal(t.calls.after, 2, 'retained and new callbacks complete on the next successful render');
    assert.equal(t.calls.post, 1); assert.equal(t.calls.end, 2);
  }
}
console.log('presentation-lifecycle.test.js ok: actual source entry points, bounded wait, cache ownership, stop/error/destroy and failed-context cleanup');
