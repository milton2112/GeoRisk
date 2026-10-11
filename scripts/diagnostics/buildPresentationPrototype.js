// Isolated experiment. Never writes the production engine or changes its quality.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root = process.cwd();
const out = path.join(root, 'reports/presentation-prototype');
await fs.mkdir(out, { recursive: true });
const fromRoot = name => import(pathToFileURL(path.join(root, name)));
const { build } = await fromRoot('node_modules/esbuild/lib/main.js');
const transforms = await Promise.all([
  ['cesium-release-pragmas', 'stripCesiumDebugPragmas'], ['cesium-evaluation-token', 'removeCesiumEvaluationToken'],
  ['cesium-csp', 'replaceKnockoutGlobalLookup'], ['cesium-text-readback', 'enableCesiumTextReadback'],
  ['cesium-hidden-billboards', 'skipHiddenCesiumBillboards'], ['cesium-resolution-resize', 'deferCesiumResolutionResize']
].map(async ([file, name]) => (await fromRoot(`scripts/lib/${file}.js`))[name]));
const once = (s, a, b) => {
  if (s.split(a).length !== 2) throw new Error(`Prototype anchor changed: ${a.slice(0, 90)}`);
  return s.replace(a, b);
};
const sceneHelpers = `
// PROTOTYPE ONLY: one retained RGBA8/depth-stencil target, one sync, no timers.
function prototypeTarget(scene) {
  const context = scene.context;
  if (!scene._geoRiskPresentationBuffer) {
    scene._geoRiskPresentationBuffer = new FramebufferManager({ depthStencil: true });
    scene._geoRiskPresentationStats = { submitted: 0, presented: 0, polls: 0, forced: 0, expired: 0 };
    scene._geoRiskPresentationCopy = context.createViewportQuadCommand(PassThrough, {
      uniformMap: { colorTexture: () => scene._geoRiskPresentationBuffer.getColorTexture(0) }, owner: scene
    });
  }
  scene._geoRiskPresentationBuffer.update(context, context.drawingBufferWidth, context.drawingBufferHeight);
  return scene._geoRiskPresentationBuffer.framebuffer;
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
  const stats = scene._geoRiskPresentationStats;
  if (!force && pending.sync) {
    const status = pending.gl.clientWaitSync(pending.sync, 0, 0);
    pending.polls++; stats.polls++;
    if (status === pending.gl.TIMEOUT_EXPIRED) {
      if (performance.now() - pending.startedAt < 1500 && pending.polls < 64) return false;
      stats.expired++;
    }
  }
  if (force) stats.forced++;
  scene._geoRiskPendingPresentation = undefined;
  if (pending.sync) pending.gl.deleteSync(pending.sync);
  const command = scene._geoRiskPresentationCopy;
  command.renderState = RenderState.fromCache({ viewport: new BoundingRectangle(0, 0,
    scene.context.drawingBufferWidth, scene.context.drawingBufferHeight) });
  command.execute(scene.context);
  scene.context.endFrame();
  stats.presented++;
  prototypeFinishFrame(scene, pending.time, true);
  return true;
}
Scene.prototype._geoRiskPollPresentation = function () { return prototypePresent(this, false); };
Scene.prototype._geoRiskFlushPresentation = function () { return prototypePresent(this, true); };
`;
function patchScene(s) {
  s = once(s, 'import Context from "../Renderer/Context.js";', 'import Context from "../Renderer/Context.js";\nimport FramebufferManager from "../Renderer/FramebufferManager.js";\nimport PassThrough from "../Shaders/PostProcessStages/PassThrough.js";');
  s = once(s, '  passState.framebuffer = undefined;\n  passState.blendingEnabled = undefined;', '  passState.framebuffer = scene._geoRiskSubmitPresentation ? prototypeTarget(scene) : undefined;\n  passState.blendingEnabled = undefined;');
  s = once(s, '  passState.framebuffer = undefined;\n  executeOverlayCommands(scene, passState);', '  passState.framebuffer = scene._geoRiskSubmitPresentation ? scene._geoRiskPresentationBuffer.framebuffer : undefined;\n  executeOverlayCommands(scene, passState);');
  s = once(s, '  context.endFrame();\n}\n\nfunction tryAndCatchError', '  context.endFrame();\n  if (scene._geoRiskSubmitPresentation) prototypeSubmit(scene);\n}\n\nfunction tryAndCatchError');
  const start = '  /**\n   * Post passes update. Execute any pass invariant code that should run after the passes here.\n   */\n  updateDebugShowFramesPerSecond(this, shouldRender);';
  const end = '    frameState.creditDisplay.endFrame();\n  }\n};';
  const startAt = s.indexOf(start), endAt = s.indexOf(end, startAt) + end.length;
  if (startAt < 0 || endAt < startAt) throw new Error('Missing frame finalization');
  const tail = s.slice(startAt, endAt).replaceAll('this', 'scene').replace('frameState.creditDisplay.endFrame()', 'scene._frameState.creditDisplay.endFrame()').replace(/};$/, '}');
  s = s.slice(0, startAt) + '  if (this._geoRiskPendingPresentation) return;\n  prototypeFinishFrame(this, time, shouldRender);\n};\n\nfunction prototypeFinishFrame(scene, time, shouldRender) {\n' + tail + s.slice(endAt);
  const wrappers = `
// Explicit rendering, picking and mode/lifecycle changes synchronously finish the prior frame.
for (const name of ["initializeFrame", "render", "pick", "drillPick", "pickPosition", "pickPositionWorldCoordinates",
  "pickVoxel", "pickMetadata", "pickMetadataSchema", "pickFromRay", "drillPickFromRay",
  "pickFromRayMostDetailed", "drillPickFromRayMostDetailed", "morphTo2D", "morphTo3D", "morphToColumbusView"]) {
  const original = Scene.prototype[name];
  Scene.prototype[name] = function (...args) { prototypePresent(this, true); return original.apply(this, args); };
}
const prototypeDestroyScene = Scene.prototype.destroy;
Scene.prototype.destroy = function () {
  const pending = this._geoRiskPendingPresentation;
  this._geoRiskPendingPresentation = undefined;
  if (pending?.sync) pending.gl.deleteSync(pending.sync);
  this._geoRiskPresentationCopy?.shaderProgram?.destroy();
  this._geoRiskPresentationBuffer?.destroy();
  return prototypeDestroyScene.call(this);
};
`;
  return once(s, 'export default Scene;', sceneHelpers + wrappers + '\nexport default Scene;');
}
function patchWidget(s) {
  const helpers = `function prototypeLoopFrame(widget, frameTime) {
  const scene = widget._scene;
  if (scene._geoRiskPendingPresentation) {
    if (widget._forceResize || widget._clock.shouldAnimate ||
        widget._canvas.clientWidth !== widget._canvasClientWidth ||
        widget._canvas.clientHeight !== widget._canvasClientHeight ||
        widget._lastDevicePixelRatio !== window.devicePixelRatio) scene._geoRiskFlushPresentation();
    else { scene._geoRiskPollPresentation(); return; }
  }
  if (!resolutionResizeReady(widget, frameTime)) return;
  widget.resize();
  scene._geoRiskSubmitPresentation = !!scene._geoRiskPresentationEnabled && scene.context.webgl2 &&
    !widget._clock.shouldAnimate && scene.mode === SceneMode.SCENE2D && !document.hidden &&
    !!scene._lastRenderTime;
  try { widget.render(); } finally { scene._geoRiskSubmitPresentation = false; }
}
`;
  const frames = /^( +)if \(resolutionResizeReady\(widget, frameTime\)\) \{\n\1  widget.resize\(\);\n\1  widget.render\(\);\n\1\}/gm;
  if ([...s.matchAll(frames)].length !== 2) throw new Error('Default loop anchors changed');
  s = s.replace(frames, (_, indent) => indent + 'prototypeLoopFrame(widget, frameTime);');
  s = once(s, 'function startRenderLoop(widget) {', helpers + '\nfunction startRenderLoop(widget) {');
  s = once(s, '        this._useDefaultRenderLoop = value;', '        if (!value) this._scene?._geoRiskFlushPresentation?.();\n        this._useDefaultRenderLoop = value;');
  s = once(s, '  this._forceResize = false;\n\n  configureCanvasSize(this);', '  this._scene._geoRiskFlushPresentation();\n  this._forceResize = false;\n\n  configureCanvasSize(this);');
  return s;
}
const result = await build({
  absWorkingDir: root, entryPoints: ['scripts/map-engine-entry.js'], outfile: path.join(out, 'engine-prototype.js'),
  bundle: true, minify: true, format: 'esm', target: 'es2020', write: false, legalComments: 'eof',
  define: { CESIUM_VERSION: '"1.127"' },
  banner: { js: '/*! Isolated GeoRisk deferred-presentation prototype. CesiumJS 1.127, Apache-2.0; original LICENSES.txt applies. NOT a production build. */' },
  plugins: [{ name: 'isolated-presentation', setup(builder) {
    builder.onLoad({ filter: /[\\/]@cesium[\\/].*\.js$/ }, async ({ path: file }) => {
      let s = await fs.readFile(file, 'utf8');
      for (const transform of transforms) s = transform(s, file);
      s = s.replace(/\r\n/g, '\n');
      if (/[/\\]engine[/\\]Source[/\\]Scene[/\\]Scene\.js$/.test(file)) s = patchScene(s);
      if (/[/\\]engine[/\\]Source[/\\]Widget[/\\]CesiumWidget\.js$/.test(file)) s = patchWidget(s);
      return { contents: s, loader: 'js' };
    });
  }}]
});
const engine = result.outputFiles[0].contents;
await fs.writeFile(path.join(out, 'engine-prototype.js'), engine);
const metadata = { prototype: true, head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  bytes: engine.length, sha256: createHash('sha256').update(engine).digest('hex'),
  extraTarget: 'RGBA8 + depth-stencil, one pixel-sized target; estimated attachment storage 8 bytes/pixel, not measured GPU RAM',
  optIn: 'scene._geoRiskPresentationEnabled; stopped-clock native loop, WebGL2, 2D, after first frame only',
  bounds: { maximumFences: 1, maximumQueries: 64, timeoutMs: 1500 },
  limitations: ['Experiment only; no production gate or Linux proof', 'One additional target and final textured quad per eligible frame',
    'Native API state/lifecycle coverage incomplete; not safe for shipping'] };
await fs.writeFile(path.join(out, 'build.json'), JSON.stringify(metadata, null, 2) + '\n');
console.log(JSON.stringify(metadata));
