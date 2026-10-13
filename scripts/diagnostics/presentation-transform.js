// Isolated source-scoped experiment; never imported by the production build.
const once = (s, a, b) => {
  if (s.split(a).length !== 2) throw new Error(`Prototype anchor changed: ${a.slice(0, 90)}`);
  return s.replace(a, b);
};
const sceneHelpers = `
// PROTOTYPE ONLY: one retained RGBA8/depth-stencil target, one sync, no timers.
function prototypeSupported(scene) {
  const context = scene.context, gl = context._gl;
  if (!context.webgl2) return false;
  if (gl.isContextLost()) {
    scene._geoRiskPresentationCapability = undefined;
    return false;
  }
  let capability = scene._geoRiskPresentationCapability;
  if (!capability || capability.gl !== gl) {
    let supported = false;
    try {
      const extension = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = extension && gl.getParameter(extension.UNMASKED_RENDERER_WEBGL);
      supported = typeof renderer === 'string' && renderer.length <= 512 && /\\bSwiftShader\\b/i.test(renderer);
    } catch { /* Optional identity can be unavailable under privacy restrictions. */ }
    capability = scene._geoRiskPresentationCapability = { gl, supported };
  }
  return capability.supported;
}
function prototypeTarget(scene) {
  const context = scene.context;
  scene._geoRiskPresentationStats ||= { submitted: 0, presented: 0, polls: 0, forced: 0, expired: 0, aborted: 0 };
  if (!scene._geoRiskPresentationBuffer) {
    scene._geoRiskPresentationBuffer = new FramebufferManager({ depthStencil: true });
    scene._geoRiskPresentationCopy = context.createViewportQuadCommand(PassThrough, {
      uniformMap: { colorTexture: () => scene._geoRiskPresentationBuffer.getColorTexture(0) }, owner: scene
    });
  }
  scene._geoRiskPresentationBuffer.update(context, context.drawingBufferWidth, context.drawingBufferHeight);
  return scene._geoRiskPresentationBuffer.framebuffer;
}
function prototypeRelease(scene) {
  const copy = scene._geoRiskPresentationCopy, buffer = scene._geoRiskPresentationBuffer;
  const state = scene._geoRiskPresentationState;
  scene._geoRiskPresentationCopy = scene._geoRiskPresentationBuffer = scene._geoRiskPresentationState = undefined;
  try { if (state) RenderState.removeFromCache(state); }
  finally { try { copy?.shaderProgram?.destroy(); } finally { buffer?.destroy(); } }
}
function prototypeAbort(scene) {
  const pending = scene._geoRiskPendingPresentation, open = scene._geoRiskPresentationFrameOpen;
  scene._geoRiskPendingPresentation = undefined;
  scene._geoRiskPresentationFrameOpen = false;
  if (pending || open) {
    if (scene._geoRiskPresentationStats) scene._geoRiskPresentationStats.aborted++;
    scene._geoRiskPresentationAborted = true;
    scene._renderRequested = true;
  }
  try { if (pending?.sync) pending.gl.deleteSync(pending.sync); }
  finally { if (open) scene._frameState.creditDisplay.endFrame(); }
}
function prototypeCancel(scene) {
  try { prototypeAbort(scene); } finally { prototypeRelease(scene); }
}
function prototypeSubmit(scene) {
  const gl = scene.context._gl;
  const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  scene._geoRiskPresentationStats.submitted++;
  scene._geoRiskPendingPresentation = { gl, sync, startedAt: performance.now(), polls: 0,
    time: JulianDate.clone(scene._frameState.time) };
  gl.flush();
}
function prototypePresent(scene, force) {
  const pending = scene._geoRiskPendingPresentation;
  if (!pending) return true;
  try {
  if (pending.gl !== scene.context._gl || pending.gl.isContextLost()) {
    scene._geoRiskPresentationCapability = undefined;
    throw new Error('Prototype presentation context lost or replaced');
  }
  const stats = scene._geoRiskPresentationStats;
  if (!force && pending.sync) {
    const status = pending.gl.clientWaitSync(pending.sync, 0, 0);
    pending.polls++; stats.polls++;
    if (status === pending.gl.TIMEOUT_EXPIRED) {
      const elapsed = performance.now() - pending.startedAt;
      if (elapsed >= 0 && elapsed < 1500 && pending.polls < 64) return false;
      stats.expired++;
    }
  }
  if (force) stats.forced++;
  // Clear ownership before deleting; a throwing driver must not delete the same sync twice.
  const sync = pending.sync;
  pending.sync = undefined;
  if (sync) pending.gl.deleteSync(sync);
  const command = scene._geoRiskPresentationCopy;
  const width = scene.context.drawingBufferWidth, height = scene.context.drawingBufferHeight;
  const state = scene._geoRiskPresentationState;
  if (!state || state.viewport.width !== width || state.viewport.height !== height) {
    scene._geoRiskPresentationState = undefined;
    if (state) RenderState.removeFromCache(state);
    const descriptor = { viewport: new BoundingRectangle(0, 0, width, height) };
    command.renderState = RenderState.fromCache(descriptor);
    scene._geoRiskPresentationState = descriptor;
  }
  command.execute(scene.context);
  scene.context.endFrame();
  scene._geoRiskPendingPresentation = undefined;
  stats.presented++;
  prototypeFinishFrame(scene, pending.time, true);
  return true;
  } catch (error) { prototypeCancel(scene); throw error; }
}
Scene.prototype._geoRiskPollPresentation = function () { return prototypePresent(this, false); };
Scene.prototype._geoRiskPresentationSupported = function () { return prototypeSupported(this); };
Scene.prototype._geoRiskFlushPresentation = function () { return prototypePresent(this, true); };
Scene.prototype._geoRiskCancelPresentation = function () { prototypeCancel(this); };
Scene.prototype._geoRiskStopPresentation = function () {
  try { prototypePresent(this, true); } finally { prototypeRelease(this); }
};
`;
export function patchPresentationScene(s, { enabledByDefault = false } = {}) {
  s = once(s, 'import Context from "../Renderer/Context.js";', 'import Context from "../Renderer/Context.js";\nimport FramebufferManager from "../Renderer/FramebufferManager.js";\nimport PassThrough from "../Shaders/PostProcessStages/PassThrough.js";');
  s = once(s, '  passState.framebuffer = undefined;\n  passState.blendingEnabled = undefined;', '  passState.framebuffer = scene._geoRiskSubmitPresentation ? prototypeTarget(scene) : undefined;\n  passState.blendingEnabled = undefined;');
  s = once(s, '  passState.framebuffer = undefined;\n  executeOverlayCommands(scene, passState);', '  passState.framebuffer = scene._geoRiskSubmitPresentation ? scene._geoRiskPresentationBuffer.framebuffer : undefined;\n  executeOverlayCommands(scene, passState);');
  s = once(s, '  context.endFrame();\n}\n\nfunction tryAndCatchError', '  context.endFrame();\n  if (scene._geoRiskSubmitPresentation) prototypeSubmit(scene);\n}\n\nfunction tryAndCatchError');
  s = once(s, '    scene._renderError.raiseEvent(scene, error);', '    if (scene._geoRiskPresentationFrameOpen) prototypeCancel(scene);\n    scene._renderError.raiseEvent(scene, error);');
  s = once(s, '    frameState.creditDisplay.beginFrame();', '    frameState.creditDisplay.beginFrame();\n    this._geoRiskPresentationFrameOpen = !!this._geoRiskSubmitPresentation;');
  const start = '  /**\n   * Post passes update. Execute any pass invariant code that should run after the passes here.\n   */\n  updateDebugShowFramesPerSecond(this, shouldRender);';
  const end = '    frameState.creditDisplay.endFrame();\n  }\n};';
  const startAt = s.indexOf(start), endAt = s.indexOf(end, startAt) + end.length;
  if (startAt < 0 || endAt < startAt) throw new Error('Missing frame finalization');
  const tail = s.slice(startAt, endAt - 3).replaceAll('this', 'scene').replace('    frameState.creditDisplay.endFrame();\n', '');
  s = s.slice(0, startAt) + '  if (this._geoRiskPendingPresentation || this._geoRiskPresentationAborted) return;\n  prototypeFinishFrame(this, time, shouldRender);\n};\n\nfunction prototypeFinishFrame(scene, time, shouldRender) {\n  scene._geoRiskPresentationFrameOpen = false;\n  try {\n' + tail + '\n  } finally {\n    if (shouldRender) scene._frameState.creditDisplay.endFrame();\n  }\n}\n' + s.slice(endAt);
  const wrappers = `
// Explicit rendering, picking and mode/lifecycle changes synchronously finish the prior frame.
for (const name of ["initializeFrame", "render", "pick", "drillPick", "pickPosition", "pickPositionWorldCoordinates",
  "pickVoxel", "pickMetadata", "pickMetadataSchema", "pickFromRay", "drillPickFromRay",
  "pickFromRayMostDetailed", "drillPickFromRayMostDetailed", "morphTo2D", "morphTo3D", "morphToColumbusView"]) {
  const original = Scene.prototype[name];
  Scene.prototype[name] = function (...args) {
    prototypePresent(this, true);
    if (name === "render" && !this._geoRiskSubmitPresentation) prototypeRelease(this);
    this._geoRiskPresentationAborted = false;
    return original.apply(this, args);
  };
}
const prototypeDestroyScene = Scene.prototype.destroy;
Scene.prototype.destroy = function () {
  this._geoRiskPresentationCapability = undefined;
  try { prototypeCancel(this); } finally { prototypeDestroyScene.call(this); }
};
`;
  return once(s, 'export default Scene;', sceneHelpers + wrappers +
    (enabledByDefault ? '\nScene.prototype._geoRiskPresentationEnabled = true;\n' : '') + '\nexport default Scene;');
}
export function patchPresentationWidget(s) {
  const helpers = `function prototypeLoopFrame(widget, frameTime) {
  const scene = widget._scene;
  if (document.hidden && (scene._geoRiskPresentationEnabled || scene._geoRiskPresentationBuffer)) {
    scene._geoRiskCancelPresentation();
    return;
  }
  // Cesium applies queued camera input inside render, so active contact must use the native loop.
  const pointerActive = typeof autoRotation !== 'undefined' && autoRotation.hasActivePointers();
  const eligible = !!scene._geoRiskPresentationEnabled &&
    !widget._clock.shouldAnimate && scene.mode === SceneMode.SCENE2D && !document.hidden &&
    !pointerActive && !!scene._lastRenderTime && scene._geoRiskPresentationSupported();
  if (!eligible && scene._geoRiskPresentationBuffer) scene._geoRiskStopPresentation();
  if (scene._geoRiskPendingPresentation) {
    if (widget._forceResize || widget._clock.shouldAnimate ||
        widget._canvas.clientWidth !== widget._canvasClientWidth ||
        widget._canvas.clientHeight !== widget._canvasClientHeight ||
        widget._lastDevicePixelRatio !== window.devicePixelRatio) scene._geoRiskFlushPresentation();
    else { scene._geoRiskPollPresentation(); return; }
  }
  if (!resolutionResizeReady(widget, frameTime)) return;
  widget.resize();
  scene._geoRiskSubmitPresentation = eligible;
  try { widget.render(); } finally { scene._geoRiskSubmitPresentation = false; }
}
`;
  const frames = /^( +)if \(resolutionResizeReady\(widget, frameTime\)\) \{\n\1  widget.resize\(\);\n\1  widget.render\(\);\n\1\}/gm;
  if ([...s.matchAll(frames)].length !== 2) throw new Error('Default loop anchors changed');
  s = s.replace(frames, (_, indent) => indent + 'prototypeLoopFrame(widget, frameTime);');
  s = once(s, 'function startRenderLoop(widget) {', helpers + '\nfunction startRenderLoop(widget) {');
  s = once(s, '        this._useDefaultRenderLoop = value;', '        this._useDefaultRenderLoop = value;\n        if (!value) this._scene?._geoRiskCancelPresentation?.();');
  s = once(s, '        widget._useDefaultRenderLoop = false;', '        widget._scene?._geoRiskCancelPresentation?.();\n        widget._useDefaultRenderLoop = false;');
  s = once(s, '      that._useDefaultRenderLoop = false;', '      that._scene?._geoRiskCancelPresentation?.();\n      that._useDefaultRenderLoop = false;');
  s = once(s, '      widget._renderLoopRunning = false;\n    }', '      widget._scene?._geoRiskCancelPresentation?.();\n      widget._renderLoopRunning = false;\n    }');
  s = once(s, '  this._forceResize = false;\n\n  configureCanvasSize(this);', '  this._scene._geoRiskFlushPresentation();\n  this._forceResize = false;\n\n  configureCanvasSize(this);');
  return s;
}
