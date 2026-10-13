import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root = process.cwd(), out = path.join(root, 'reports/presentation-prototype');
const { launchPerformanceBrowser, performanceEnvironment } = await import(pathToFileURL(path.join(root, 'scripts/lib/browser-performance.js')));
const { getBrowserSelection } = await import(pathToFileURL(path.join(root, 'scripts/lib/browser-launch.js')));
const { getPerformanceInputHash } = await import(pathToFileURL(path.join(root, 'scripts/lib/performance-inputs.js')));
const { createLocalSmokeServer } = await import(pathToFileURL(path.join(root, 'scripts/localSmokeServer.js')));
const { collectBrowserGpuInfo } = await import(pathToFileURL(path.join(root, 'scripts/lib/profile-gpu.js')));
assert.equal(process.argv.length, 2, 'No quality, browser or deadline overrides accepted');
const name = 'ci-1';
const engine = await fs.readFile(path.join(out, 'engine-prototype.js'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const server = createLocalSmokeServer({ root: path.join(root, 'dist/public') });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser, cdp, traceStarted = false;
const events = [];
let traceBytes = 0, traceOverflow = false;
const result = { status: 'running', prototype: JSON.parse(await fs.readFile(path.join(out, 'build.json'), 'utf8')),
  revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  ciRunId: process.env.GITHUB_RUN_ID || null, ciRunAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
  environment: performanceEnvironment(), publicInputHash: await getPerformanceInputHash(root), browserFlags: [],
  pixelCases: [], errors: [], startedAt: new Date().toISOString(), timingIsDiagnosticOnly: true };
const save = () => fs.writeFile(path.join(out, `control-${name}.json`), JSON.stringify(result, null, 2) + '\n');
async function stopTrace() {
  if (!traceStarted) return;
  const completed = new Promise(resolve => cdp.once('Tracing.tracingComplete', resolve));
  await cdp.send('Tracing.end');
  await completed;
  traceStarted = false;
  await fs.writeFile(path.join(out, `trace-${name}.json`), JSON.stringify({ revision: result.revision,
    ciRunId: result.ciRunId, ciRunAttempt: result.ciRunAttempt, truncated: traceOverflow, events }));
  result.trace = { events: events.length, selectedEventBytes: traceBytes, truncated: traceOverflow,
    maximumEvents: 5000, maximumBytes: 2 * 1024 ** 2,
    selection: 'Original metadata, prototype window marks and Commit/DoUpdateLayers/ReadPixels/WaitForCmd/Finish/GetOffset events only; not an exhaustive trace. Inclusive spans are not additive CPU/GPU utilization.' };
}
await save();
try {
  browser = await launchPerformanceBrowser();
  result.browser = browser.version();
  result.selection = getBrowserSelection(browser);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1,
    isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => {
    result.errorCount = (result.errorCount || 0) + 1;
    if (result.errors.length < 30) result.errors.push(error.message.slice(0, 1000));
  });
  let overrides = 0;
  await page.route(/\/vendor\/cesium\/engine\.js\?/, route => { overrides++; return route.fulfill({ contentType: 'text/javascript', body: engine }); });
  cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.addInitScript(() => { localStorage.setItem('geo-risk-intro-seen', 'true'); });
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(() => typeof countryLayers !== 'undefined' && countryLayers.has('ARG') && !document.body.classList.contains('globe-loading'), undefined, { timeout: 45000 });
  await page.waitForFunction(() => viewer.scene.globe.tilesLoaded && viewer.scene._frameState.frameNumber >= 4, undefined, { timeout: 20000 });
  assert.equal(overrides, 1);
  result.configuration = await page.evaluate(() => {
    const scene = viewer.scene, gl = scene.context._gl, ext = gl.getExtension('WEBGL_debug_renderer_info');
    scene.rethrowRenderErrors = true;
    const recoveryState = viewer.__geoRiskRenderRecovery?.getState();
    if (recoveryState?.phase !== 'healthy') throw new Error('Render recovery is not healthy before controlled timing');
    // This diagnostic intentionally stops/restarts the Cesium loop between windows.
    // Recovery is covered separately; its watchdog must not mistake test pauses for a product failure.
    viewer.__geoRiskRenderRecovery.dispose();
    // Equal-size experiment only. Record every ignored adaptive scale request, bounded to 32 values.
    viewer.resolutionScale = 0.44;
    viewer.cesiumWidget.resize();
    window.__prototypeScaleRequests = { count: 0, values: [] };
    Object.defineProperty(viewer, 'resolutionScale', { configurable: true, get: () => 0.44, set(value) {
      window.__prototypeScaleRequests.count++;
      if (window.__prototypeScaleRequests.values.length < 32) window.__prototypeScaleRequests.values.push(value);
    } });
    return { renderer: ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL), scale: viewer.resolutionScale,
      canvas: [scene.canvas.width, scene.canvas.height], mode: scene.mode, msaa: scene.msaaSamples,
      fxaa: scene.postProcessStages.fxaa.enabled, oit: scene._environmentState.useOIT, webgl2: scene.context.webgl2,
      presentationSupported: scene._geoRiskPresentationSupported(), renderRecoveryDisposedForDiagnostic: true };
  });
  assert.equal(result.configuration.webgl2, true);
  assert.equal(result.configuration.renderRecoveryDisposedForDiagnostic, true);
  console.log('Ready: ' + JSON.stringify(result.configuration));
  // One page, alternating A/B/A. Reads happen only after presentation, outside timings.
  for (const variant of ['initial', 'shifted', 'fxaa']) {
    const captures = await page.evaluate(async variant => {
      const widget = viewer.cesiumWidget, scene = viewer.scene, gl = scene.context._gl;
      widget.useDefaultRenderLoop = false;
      // Let queued native loop callbacks observe suspension before handing ownership to manual B.
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (variant === 'shifted') viewer.camera.moveRight(6000000);
      if (variant === 'fxaa') scene.postProcessStages.fxaa.enabled = true;
      const samples = [];
      async function render(staged) {
        const before = { ...scene._geoRiskPresentationStats };
        // The app batches requestRender on its next rAF; this manual control forces the native flag.
        scene._renderRequested = true;
        scene._geoRiskSubmitPresentation = staged;
        try { widget.render(); } finally { scene._geoRiskSubmitPresentation = false; }
        if (staged) {
          if (!scene._geoRiskPendingPresentation) throw new Error('No staged frame: ' + JSON.stringify({
            stats: scene._geoRiskPresentationStats, requested: scene._renderRequested, canRender: widget._canRender,
            frame: scene._frameState.frameNumber, time: scene._lastRenderTime, samples: samples.length }));
          await new Promise((resolve, reject) => {
            let callbacks = 0;
            const poll = () => {
              try {
                if (scene._geoRiskPollPresentation()) resolve();
                else if (++callbacks > 65) reject(new Error('Prototype did not complete'));
                else requestAnimationFrame(poll);
              } catch (error) { reject(error); }
            };
            requestAnimationFrame(poll);
          });
          if (scene._geoRiskPresentationStats.presented !== (before.presented || 0) + 1 ||
              scene._geoRiskPresentationStats.aborted !== (before.aborted || 0)) {
            throw new Error('Staged frame did not present exactly once: ' + JSON.stringify({ before, after: scene._geoRiskPresentationStats }));
          }
        }
      }
      for (const staged of [false, true, false]) {
        await render(staged);
        const pixels = new Uint8Array(scene.canvas.width * scene.canvas.height * 4);
        gl.readPixels(0, 0, scene.canvas.width, scene.canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        samples.push({ staged, pixels: Array.from(pixels), error: gl.getError(),
          oit: scene._environmentState.useOIT, fxaa: scene._environmentState.usePostProcess,
          pending: !!scene._geoRiskPendingPresentation, stats: { ...scene._geoRiskPresentationStats } });
      }
      return samples;
    }, variant);
    for (let i = 0; i < captures.length; i++) {
      const capture = captures[i];
      const rgba = Buffer.from(capture.pixels);
      await fs.writeFile(path.join(out, `${name}-${variant}-${i}.rgba`), rgba);
      capture.bytes = rgba.length; capture.sha256 = hash(rgba); delete capture.pixels;
      assert.equal(capture.error, 0);
      assert.equal(capture.pending, false);
    }
    const valid = captures.every(c => c.sha256 === captures[0].sha256);
    result.pixelCases.push({ variant, valid, captures });
    await save();
    console.log(`RGBA ${variant}: ${valid ? 'identical' : 'DIFFERENT'}`);
    assert.equal(valid, true, `RGBA differs for ${variant}`);
  }
  result.apiControls = await page.evaluate(async () => {
    const widget = viewer.cesiumWidget, scene = viewer.scene;
    scene.postProcessStages.fxaa.enabled = false;
    viewer.camera.setView({ destination: countryLayers.get('ARG').getBounds() });
    for (let i = 0; i < 3; i++) { scene._renderRequested = true; widget.render(); }
    const point = scene.cartesianToCanvasCoordinates(Cesium.Cartesian3.fromDegrees(-64, -34));
    const originalHit = scene.pick(point);
    if (!originalHit?.id || !countryLayers.get('ARG').entities.includes(originalHit.id)) throw new Error('Baseline pick did not hit Argentina');
    const counts = { pre: 0, post: 0, after: 0 };
    const removers = [scene.preRender.addEventListener(() => counts.pre++), scene.postRender.addEventListener(() => counts.post++)];
    function stage() {
      scene._renderRequested = true;
      scene._frameState.afterRender.push(() => { counts.after++; });
      scene._geoRiskSubmitPresentation = true;
      try { widget.render(); } finally { scene._geoRiskSubmitPresentation = false; }
      if (!scene._geoRiskPendingPresentation) throw new Error('Missing pending frame');
    }
    stage();
    const before = { ...counts };
    const hit = scene.pick(point);
    const pick = { flushed: !scene._geoRiskPendingPresentation, counts: { ...counts },
      id: hit?.id?.id || null, sameEntity: hit?.id === originalHit.id };
    stage();
    widget.render();
    const manual = { flushed: !scene._geoRiskPendingPresentation, counts: { ...counts } };
    stage();
    scene.morphTo3D(0);
    const mode = { flushed: !scene._geoRiskPendingPresentation, mode: scene.mode, counts: { ...counts } };
    scene.morphTo2D(0);
    // A real pending old-size frame must complete before the public resize changes the canvas.
    stage();
    const oldCanvas = [scene.canvas.width, scene.canvas.height];
    widget.resolutionScale = 0.5;
    widget.resize();
    const resize = { flushed: !scene._geoRiskPendingPresentation, oldCanvas,
      newCanvas: [scene.canvas.width, scene.canvas.height], scale: widget.resolutionScale };
    scene._renderRequested = true;
    widget.render();
    const gl = scene.context._gl;
    const read = () => {
      const bytes = new Uint8Array(scene.canvas.width * scene.canvas.height * 4);
      gl.readPixels(0, 0, scene.canvas.width, scene.canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
      return bytes;
    };
    const nativeResized = read();
    stage(); scene._geoRiskFlushPresentation();
    const stagedResized = read();
    resize.pixelsMatch = nativeResized.length === stagedResized.length && nativeResized.every((byte, i) => byte === stagedResized[i]);
    resize.glError = gl.getError();
    widget.resolutionScale = 0.44;
    widget.resize();
    resize.restoredCanvas = [scene.canvas.width, scene.canvas.height];
    // Stopping is suspension: retain the last visible frame, not a forced copy of unfinished work.
    widget.useDefaultRenderLoop = true;
    stage();
    const stopBefore = { ...counts }, forcedBefore = scene._geoRiskPresentationStats.forced;
    widget.useDefaultRenderLoop = false;
    const stop = { pending: !!scene._geoRiskPendingPresentation, before: stopBefore, after: { ...counts },
      forcedCopy: scene._geoRiskPresentationStats.forced !== forcedBefore,
      released: !scene._geoRiskPresentationBuffer && !scene._geoRiskPresentationCopy && !scene._geoRiskPresentationState };
    scene._renderRequested = true;
    widget.render();
    stop.afterManualRender = { ...counts };
    const png = scene.canvas.toDataURL('image/png');
    const rgba = new Uint8Array(scene.canvas.width * scene.canvas.height * 4);
    gl.readPixels(0, 0, scene.canvas.width, scene.canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
    const blob = new Blob([Uint8Array.from(atob(png.split(',')[1]), c => c.charCodeAt(0))], { type: 'image/png' });
    const bitmap = await createImageBitmap(blob);
    const decoded = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = decoded.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(bitmap, 0, 0); bitmap.close();
    const bytes = ctx.getImageData(0, 0, decoded.width, decoded.height).data;
    let matches = true, nonblank = false;
    const stride = decoded.width * 4;
    for (let y = 0; y < decoded.height; y++) for (let x = 0; x < stride; x++) {
      if (bytes[y * stride + x] !== rgba[(decoded.height - 1 - y) * stride + x]) matches = false;
      if (x % 4 !== 3 && bytes[y * stride + x] !== bytes[x % 4]) nonblank = true;
    }
    removers.forEach(remove => remove());
    return { before, pick, manual, mode, resize, stop, export: { png: png.startsWith('data:image/png;base64,'), bytes: png.length, matches, nonblank },
      glError: scene.context._gl.getError(), stats: { ...scene._geoRiskPresentationStats } };
  });
  assert.equal(result.apiControls.before.pre, 1);
  assert.equal(result.apiControls.before.post, 0);
  assert.equal(result.apiControls.before.after, 0);
  assert.equal(result.apiControls.pick.counts.post, 1);
  assert.equal(result.apiControls.pick.counts.after, 1);
  assert.equal(result.apiControls.pick.flushed, true);
  assert.equal(result.apiControls.pick.sameEntity, true);
  assert.equal(result.apiControls.manual.flushed, true);
  assert.equal(result.apiControls.mode.flushed, true);
  assert.equal(result.apiControls.mode.mode, 3);
  assert.equal(result.apiControls.resize.flushed, true);
  assert.deepEqual(result.apiControls.resize.oldCanvas, [171, 371]);
  assert.deepEqual(result.apiControls.resize.newCanvas, [195, 422]);
  assert.equal(result.apiControls.resize.scale, 0.5);
  assert.deepEqual(result.apiControls.resize.restoredCanvas, [171, 371]);
  assert.equal(result.apiControls.resize.pixelsMatch, true);
  assert.equal(result.apiControls.resize.glError, 0);
  assert.equal(result.apiControls.stop.pending, false);
  assert.equal(result.apiControls.stop.forcedCopy, false);
  assert.equal(result.apiControls.stop.released, true);
  for (const count of ['post', 'after']) {
    assert.equal(result.apiControls.stop.after[count], result.apiControls.stop.before[count]);
    assert.equal(result.apiControls.stop.afterManualRender[count], result.apiControls.stop.before[count] + 1);
  }
  assert.equal(result.apiControls.export.png, true);
  assert.equal(result.apiControls.export.matches, true);
  assert.equal(result.apiControls.export.nonblank, true);
  assert.equal(result.apiControls.glError, 0);
  await save();
  // Default loop active movement with the same quality, A/B/A, no readbacks in windows.
  result.windows = [];
  cdp.on('Tracing.dataCollected', ({ value }) => {
    if (traceOverflow) return;
    const selected = value.filter(e => e.ph === 'M' || e.name?.startsWith('georisk-prototype-window-') ||
      /^(?:Commit|LayerTreeHost::DoUpdateLayers|GLES2::ReadPixels|ImplementationBase::WaitForCmd|CommandBufferHelper::Finish|CommandBufferProxyImpl::WaitForGetOffset)$/.test(e.name));
    const bytes = Buffer.byteLength(JSON.stringify(selected));
    if (events.length + selected.length > 5000 || traceBytes + bytes > 2 * 1024 ** 2 - 16384) { traceOverflow = true; return; }
    events.push(...selected); traceBytes += bytes;
  });
  await cdp.send('Tracing.start', { categories: 'cc,gpu,viz,toplevel,blink.user_timing', transferMode: 'ReportEvents' });
  traceStarted = true;
  for (const enabled of [false, true, false]) {
    const preparation = await page.evaluate(async index => {
      const widget = viewer.cesiumWidget, scene = viewer.scene;
      const start = performance.now();
      performance.mark('georisk-prototype-window-' + index + '-prepare-start');
      // Finish and compose the native reset frame before starting any measured window.
      widget.useDefaultRenderLoop = false;
      scene._geoRiskPresentationEnabled = false;
      viewer.camera.setView({ destination: countryLayers.get('ARG').getBounds() });
      scene._renderRequested = true;
      widget.render();
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      performance.mark('georisk-prototype-window-' + index + '-prepare-end');
      return { elapsed: performance.now() - start, callbacks: 2 };
    }, result.windows.length);
    const fatalBanner = page.locator('#fatal-error-banner');
    if (await fatalBanner.isVisible()) {
      result.fatalError = (await fatalBanner.innerText()).slice(0, 1000);
      await save();
      throw new Error('Application fatal banner appeared before the measured window: ' + result.fatalError);
    }
    const toggleBounds = await page.locator('#toggle-tools-panel').boundingBox();
    assert.ok(toggleBounds, 'mobile control must have a visible hit target');
    const inputPoint = { x: toggleBounds.x + toggleBounds.width / 2, y: toggleBounds.y + toggleBounds.height / 2 };
    const inputTarget = await page.evaluate(point => document.elementFromPoint(point.x, point.y)?.closest('#toggle-tools-panel')?.id || null,
      inputPoint);
    assert.equal(inputTarget, 'toggle-tools-panel', 'mobile control must not be covered before measurement');
    const measuredPromise = page.evaluate(({ enabled, index }) => new Promise(resolve => {
      const widget = viewer.cesiumWidget, scene = viewer.scene;
      // Same start and time-based path for A/B/A; faster callbacks must not move farther.
      scene._geoRiskPresentationEnabled = enabled;
      const frameTimes = [], rafTimes = [], tasks = [], trustedInputs = [], eventTimings = [];
      const eventTimingSupported = PerformanceObserver.supportedEntryTypes?.includes('event') === true;
      const start = performance.now();
      const captureInput = event => {
        if (event.target?.id === 'toggle-tools-panel' && trustedInputs.length < 16) {
          trustedInputs.push({ type: event.type, trusted: event.isTrusted, pointerType: event.pointerType || null,
            at: event.timeStamp });
        }
      };
      for (const type of ['pointerdown', 'pointerup', 'click']) document.addEventListener(type, captureInput, true);
      const eventObserver = eventTimingSupported ? new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.startTime >= start && entry.startTime < start + 6000 &&
              entry.name === 'click' && entry.target?.id === 'toggle-tools-panel' && eventTimings.length < 16) {
            eventTimings.push({ name: entry.name, startTime: entry.startTime, duration: entry.duration,
              processingStart: entry.processingStart, processingEnd: entry.processingEnd,
              interactionId: entry.interactionId || 0 });
          }
        }
      }) : null;
      eventObserver?.observe({ type: 'event', buffered: true, durationThreshold: 16 });
      const observer = new PerformanceObserver(list => { for (const e of list.getEntries()) if (tasks.length < 200) tasks.push({ at: e.startTime, duration: e.duration }); });
      observer.observe({ type: 'longtask' });
      let previousElapsed = 0;
      window.__geoRiskMeasuredWindow = { index, active: true };
      performance.mark('georisk-prototype-window-' + index + '-start');
      const before = { ...scene._geoRiskPresentationStats };
      const remove = scene.postRender.addEventListener(() => { if (frameTimes.length < 1000) frameTimes.push(performance.now() - start); });
      widget.useDefaultRenderLoop = true;
      const move = () => {
        const elapsed = performance.now() - start;
        if (elapsed >= 6000) {
          performance.mark('georisk-prototype-window-' + index + '-end');
          remove(); observer.disconnect();
          if (eventObserver) {
            const remaining = eventObserver.takeRecords();
            for (const entry of remaining) {
              if (entry.startTime >= start && entry.startTime < start + 6000 &&
                  entry.name === 'click' && entry.target?.id === 'toggle-tools-panel' && eventTimings.length < 16) {
                eventTimings.push({ name: entry.name, startTime: entry.startTime, duration: entry.duration,
                  processingStart: entry.processingStart, processingEnd: entry.processingEnd,
                  interactionId: entry.interactionId || 0 });
              }
            }
            eventObserver.disconnect();
          }
          for (const type of ['pointerdown', 'pointerup', 'click']) document.removeEventListener(type, captureInput, true);
          window.__geoRiskMeasuredWindow = { index, active: false };
          const teardownStart = performance.now();
          widget.useDefaultRenderLoop = false;
          const teardownMs = performance.now() - teardownStart;
          performance.mark('georisk-prototype-window-' + index + '-cleanup-end');
          resolve({ enabled, elapsed, teardownMs, frameTimes, rafTimes, tasks,
            userInput: { target: 'toggle-tools-panel', actions: 1,
              inputMethod: 'Playwright trusted mouse pointer at mobile control center', eventTimingEvent: 'click',
              eventTimingSupported, eventTimingThresholdMs: 16,
              trustedInputs, eventTimings }, before, after: { ...scene._geoRiskPresentationStats },
            presentationSupported: scene._geoRiskPresentationCapability?.supported === true,
            resourcesReleased: { pending: !scene._geoRiskPendingPresentation, target: !scene._geoRiskPresentationBuffer,
              copy: !scene._geoRiskPresentationCopy, state: !scene._geoRiskPresentationState },
            scale: viewer.resolutionScale, canvas: [scene.canvas.width, scene.canvas.height], msaa: scene.msaaSamples,
            fxaa: scene.postProcessStages.fxaa.enabled });
          return;
        }
        if (rafTimes.length < 1000) rafTimes.push(elapsed);
        viewer.camera.moveRight((elapsed - previousElapsed) * 3600);
        previousElapsed = elapsed;
        scene.requestRender(); requestAnimationFrame(move);
      };
      requestAnimationFrame(move);
    }), { enabled, index: result.windows.length });
    await page.waitForFunction(index => window.__geoRiskMeasuredWindow?.index === index && window.__geoRiskMeasuredWindow.active,
      result.windows.length, { timeout: 3000 });
    const inputPromise = page.mouse.click(inputPoint.x, inputPoint.y);
    const [measured] = await Promise.all([measuredPromise, inputPromise]);
    measured.preparation = preparation;
    assert.equal(measured.userInput.trustedInputs.length, 3, 'one real pointer click must emit trusted pointer and click events');
    assert.ok(measured.userInput.trustedInputs.every(event => event.trusted));
    assert.ok(measured.userInput.trustedInputs.filter(event => event.type.startsWith('pointer')).every(event => event.pointerType === 'mouse'));
    assert.ok(measured.userInput.eventTimings.every(event => event.name === 'click'));
    assert.ok(measured.userInput.eventTimings.length <= 16, 'Event Timing evidence must remain bounded');
    await page.mouse.click(inputPoint.x, inputPoint.y);
    await page.waitForTimeout(300);
    result.windows.push(measured); await save();
    console.log('Window: ' + JSON.stringify({ enabled, frames: measured.frameTimes.length, callbacks: measured.rafTimes.length,
      maxLongTask: Math.max(0, ...measured.tasks.map(t => t.duration)), userInput: measured.userInput,
      before: measured.before, after: measured.after }));
  }
  await stopTrace();
  assert.equal(traceOverflow, false, 'Selected trace exceeded the existing finite proof cap');
  for (const w of result.windows) {
    assert.equal(w.scale, 0.44);
    assert.deepEqual(w.canvas, [171, 371]);
    assert.equal(w.msaa, 4);
    assert.equal(w.fxaa, false);
    assert.equal(w.presentationSupported, result.configuration.presentationSupported);
    assert.ok(Object.values(w.resourcesReleased).every(Boolean), 'stop releases every owned presentation resource');
    assert.equal(w.after.forced, w.before.forced, 'default loop suspension never forces unfinished work onto the canvas');
    if (w.enabled && w.presentationSupported) assert.ok(w.after.submitted > w.before.submitted, 'SwiftShader takes the deferred path');
    else assert.equal(w.after.submitted, w.before.submitted, 'hardware/unknown and disabled windows stay native');
  }
  result.scaleRequests = await page.evaluate(() => window.__prototypeScaleRequests);
  result.browserGpu = await collectBrowserGpuInfo(browser);
  assert.deepEqual(result.errors, []);
  result.status = 'passed';
} catch (error) {
  result.status = 'failed'; result.failure = error.stack; process.exitCode = 1;
  console.error(error.stack);
} finally {
  await stopTrace().catch(error => { result.traceFailure = error.message; result.status = 'failed'; process.exitCode = 1; });
  result.finishedAt = new Date().toISOString();
  await save();
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
