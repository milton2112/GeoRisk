// Finite UI control. Adaptive policy, clock, quality, native input and renderer eligibility remain real.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { launchPerformanceBrowser, performanceEnvironment } from '../lib/browser-performance.js';
import { getBrowserSelection } from '../lib/browser-launch.js';
import { getPerformanceInputHash } from '../lib/performance-inputs.js';
import { collectBrowserGpuInfo } from '../lib/profile-gpu.js';
import { createLocalSmokeServer } from '../localSmokeServer.js';
import { createTestPage, waitForAppReady, clickCountryOnMap, waitForCountryPanel, closeCountryPanel,
  setMapMode, focusCountryInstantly, assertThematicLabelOrder, assertHealthyPage,
  assertAntialiasingProfile, closeCriticalTileCache } from '../tests/critical-browser-e2e.test.js';

assert.equal(process.argv.length, 2, 'No quality, browser or deadline overrides accepted');
const root = process.cwd(), out = 'reports/presentation-prototype';
const engine = await fs.readFile(`${out}/engine-prototype.js`);
const result = { status: 'running', scope: 'isolated-presentation-interactions',
  revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  ciRunId: process.env.GITHUB_RUN_ID || null, ciRunAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
  prototype: JSON.parse(await fs.readFile(`${out}/build.json`, 'utf8')),
  environment: performanceEnvironment(), publicInputHash: await getPerformanceInputHash(root),
  viewport: { width: 390, height: 844 }, cpuSlowdown: 4, browserFlags: [],
  startedAt: new Date().toISOString(), phases: [], timingIsDiagnosticOnly: true };
const save = () => {
  const json = JSON.stringify(result, null, 2) + '\n';
  assert.ok(Buffer.byteLength(json) <= 256 * 1024, 'bounded interaction report');
  return fs.writeFile(`${out}/interactions.json`, json);
};
const server = createLocalSmokeServer({ root: `${root}/dist/public` });
let browser, test;
await save();

async function snapshot(page) {
  return page.evaluate(() => {
    const scene = viewer.scene, canvas = scene.canvas, widget = viewer.cesiumWidget;
    return { scale: viewer.resolutionScale, presetScale: getPerformancePreset().resolutionScale,
      qualityPreset, mode: currentMapMode, nativeMode: scene.mode, canvas: [canvas.width, canvas.height],
      client: [canvas.clientWidth, canvas.clientHeight], dpr: window.devicePixelRatio,
      recommendedResolution: viewer.useBrowserRecommendedResolution,
      msaa: scene.msaaSamples, fxaa: scene.postProcessStages.fxaa.enabled,
      globe: { maximumScreenSpaceError: scene.globe.maximumScreenSpaceError,
        tileCacheSize: scene.globe.tileCacheSize, loadingDescendantLimit: scene.globe.loadingDescendantLimit },
      stats: { ...scene._geoRiskPresentationStats }, pending: !!scene._geoRiskPendingPresentation,
      target: !!scene._geoRiskPresentationBuffer, resizeFence: !!widget._geoRiskResizeFence,
      forceResize: !!widget._forceResize, navigating: isCameraNavigating,
      restorePending: navigationQualityRestoreTimer !== null,
      loop: widget.useDefaultRenderLoop, posts: window.__interactionProbe.posts,
      position: { x: viewer.camera.position.x, y: viewer.camera.position.y, z: viewer.camera.position.z },
      magnitude: viewer.camera.getMagnitude(), selected: selectedLayers.map(layer => layer.code),
      reduced: reducedPerformanceMode, reason: reducedPerformanceReason };
  });
}
async function phase(name, run) {
  const record = { name, status: 'running', startedAt: new Date().toISOString() };
  result.phases.push(record);
  await save();
  console.log('presentation-interactions: ' + name);
  record.evidence = await run();
  record.status = 'passed'; record.finishedAt = new Date().toISOString();
  await save();
}
async function stableCanvas(page) {
  await page.waitForFunction(() => {
    const canvas = viewer.scene.canvas, widget = viewer.cesiumWidget;
    const ratio = viewer.resolutionScale * (viewer.useBrowserRecommendedResolution ? 1 : devicePixelRatio);
    return !isCameraNavigating && navigationQualityRestoreTimer === null && !widget._forceResize &&
      !widget._geoRiskResizeFence && !viewer.scene._geoRiskPendingPresentation &&
      canvas.width === Math.floor(canvas.clientWidth * ratio) &&
      canvas.height === Math.floor(canvas.clientHeight * ratio);
  }, undefined, { timeout: 8000 });
}
try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  browser = await launchPerformanceBrowser();
  result.browser = getBrowserSelection(browser);
  let overrides = 0;
  test = await createTestPage(browser, `http://127.0.0.1:${server.address().port}`, result.viewport, async page => {
    page.setDefaultTimeout(8000);
    await page.route(/\/vendor\/cesium\/engine\.js\?/, route => {
      overrides++; return route.fulfill({ contentType: 'text/javascript', body: engine });
    });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await cdp.detach();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      // Observe the actual monitor without replacing samples, times, policy or actions.
      window.__interactionProbe = { samples: [], sampleCount: 0, posts: 0 };
      let interactions;
      Object.defineProperty(window, 'GeoRiskMapInteractions', { configurable: true,
        get: () => interactions, set(value) {
          interactions = value;
          const create = value.createFpsQualityMonitor;
          value.createFpsQualityMonitor = function (...args) {
            const monitor = create.apply(this, args), sample = monitor.sample;
            monitor.sample = function (...sampleArgs) {
              const sampled = sample.apply(this, sampleArgs);
              if (sampled) {
                window.__interactionProbe.sampleCount++;
                if (window.__interactionProbe.samples.length < 32) {
                  window.__interactionProbe.samples.push({ at: sampleArgs[1], context: { ...sampleArgs[0] }, ...sampled });
                }
              }
              return sampled;
            };
            return monitor;
          };
        } });
    });
  });
  const { page } = test;
  await waitForAppReady(page);
  assert.equal(overrides, 1);
  result.configuration = await page.evaluate(() => {
    const scene = viewer.scene;
    scene.rethrowRenderErrors = true;
    scene._geoRiskPresentationEnabled = true;
    window.__interactionProbe.removePost = scene.postRender.addEventListener(() => window.__interactionProbe.posts++);
    window.__interactionProbe.motionDurations = [];
    window.__interactionProbe.motionCount = 0;
    const restoreMotion = [];
    for (const [target, name] of [[viewer.camera, 'flyTo'], [scene, 'morphTo2D'], [scene, 'morphTo3D']]) {
      const original = target[name];
      target[name] = function (...args) {
        const probe = window.__interactionProbe;
        probe.motionCount++;
        if (probe.motionDurations.length < 16) probe.motionDurations.push({ name,
          duration: name === 'flyTo' ? args[0].duration : args[0] });
        return original.apply(this, args);
      };
      restoreMotion.push(() => { target[name] = original; });
    }
    window.__interactionProbe.restoreMotion = () => restoreMotion.forEach(restore => restore());
    scene.requestRender();
    return { supported: scene._geoRiskPresentationSupported(), webgl2: scene.context.webgl2,
      mode: scene.mode, clockAnimating: viewer.clock.shouldAnimate,
      scaleIsNativeProperty: !Object.hasOwn(viewer, 'resolutionScale'),
      monitorActive: performanceMonitorId !== null, reducedMotion: mapMotionPreference.matches };
  });
  assert.equal(result.configuration.scaleIsNativeProperty, true);
  assert.equal(result.configuration.monitorActive, true);
  assert.equal(result.configuration.reducedMotion, true);
  assert.equal(result.configuration.clockAnimating, false);
  if (result.configuration.supported) {
    await page.waitForFunction(() => viewer.scene._geoRiskPresentationStats?.presented > 0, undefined, { timeout: 8000 });
  }

  await phase('native canvas selection', async () => {
    await assertThematicLabelOrder(page);
    await clickCountryOnMap(page, 'ARG');
    await waitForCountryPanel(page, 'Argentina');
    const state = await snapshot(page);
    assert.deepEqual(state.selected, ['ARG']);
    await closeCountryPanel(page);
    return state;
  });
  await phase('continuous native drag and real adaptive policy', async () => {
    await stableCanvas(page);
    const before = await snapshot(page), x = 195, y = 422;
    await page.mouse.move(x, y); await page.mouse.down();
    await page.mouse.move(x + 25, y + 5);
    await page.waitForFunction(() => autoRotation.hasActivePointers() && isCameraNavigating);
    await page.evaluate(() => {
      window.__quietInteractionRuns = [];
      window.__cancelInteractionQuiet = scheduleWhenGlobeIsQuiet(() => {
        window.__quietInteractionRuns.push({ navigating: isCameraNavigating,
          pointers: autoRotation.hasActivePointers(), visibility: document.visibilityState });
      }, { delay: 0, quietFor: 100, timeout: 100 });
    });
    for (let i = 0; i < 120; i++) {
      await page.mouse.move(x + 25 + Math.sin(i / 12) * 65, y + 5 + Math.sin(i / 17) * 25);
      await page.waitForTimeout(100);
    }
    const held = await snapshot(page);
    assert.equal(await page.evaluate(() => window.__quietInteractionRuns.length), 0);
    assert.notDeepEqual(held.position, before.position, 'real input must change the camera');
    await page.mouse.up();
    await page.waitForFunction(() => window.__quietInteractionRuns.length === 1);
    await stableCanvas(page);
    const after = await snapshot(page);
    const samples = await page.evaluate(() => ({ count: window.__interactionProbe.sampleCount,
      samples: window.__interactionProbe.samples, quiet: window.__quietInteractionRuns }));
    assert.equal(samples.count, samples.samples.length, 'bounded monitor evidence must not overflow');
    assert.deepEqual(samples.quiet, [{ navigating: false, pointers: false, visibility: 'visible' }]);
    if (samples.samples.some(sample => sample.action === 'reduce')) {
      assert.ok(after.scale < before.scale, 'real adaptive reduction must resize the canvas');
      assert.deepEqual(after.canvas, held.canvas, 'releasing drag must preserve adaptive pixel dimensions');
      assert.equal(after.scale, held.scale, 'releasing drag must preserve adaptive resolution');
      assert.ok(after.globe.maximumScreenSpaceError > before.globe.maximumScreenSpaceError,
        'releasing drag must preserve the adapted globe detail');
    }
    if (result.configuration.supported) {
      assert.ok(samples.samples.some(sample => sample.action === 'reduce'), 'SwiftShader must exercise the real adaptive reduction');
      assert.ok(after.scale < before.scale, 'adaptive resolution must resize the real canvas');
      assert.ok(after.stats.presented > before.stats.presented, 'native drag must actually present deferred frames');
    } else assert.equal(after.stats.submitted || 0, 0, 'hardware must retain native rendering');
    return { before, held, after, ...samples };
  });
  await phase('wheel zoom', async () => {
    const before = await snapshot(page);
    await page.mouse.move(195, 422); await page.mouse.wheel(0, -180);
    await page.waitForFunction(magnitude => viewer.camera.getMagnitude() < magnitude * 0.99,
      before.magnitude, { timeout: 8000 });
    await stableCanvas(page);
    return { before, after: await snapshot(page) };
  });
  await phase('user quality changes and native resize', async () => {
    await page.locator('#toggle-tools-panel').click();
    const changes = [];
    for (const quality of ['high', 'performance', 'auto']) {
      await page.locator('#quality-preset-select').selectOption(quality);
      await page.waitForFunction(() => viewer.resolutionScale === getPerformancePreset().resolutionScale);
      await stableCanvas(page);
      const state = await snapshot(page);
      assert.equal(state.qualityPreset, quality);
      assert.equal(state.reduced, false); assert.equal(state.reason, '');
      await assertAntialiasingProfile(page);
      assert.equal(await page.locator('#quality-preset-select').isVisible(), true);
      changes.push(state);
    }
    assert.notDeepEqual(changes[0].canvas, changes[1].canvas, 'quality must change actual pixel dimensions');
    await page.locator('#toggle-tools-panel').click();
    return changes;
  });
  await phase('3D native fallback and return to 2D', async () => {
    const before = await snapshot(page);
    await setMapMode(page, '3d');
    await assertAntialiasingProfile(page);
    const entered = await snapshot(page);
    await focusCountryInstantly(page, 'ESP');
    await clickCountryOnMap(page, 'ESP');
    await waitForCountryPanel(page, 'Espa');
    const threeD = await snapshot(page);
    assert.deepEqual(threeD.selected, ['ESP']);
    assert.equal(threeD.target, false); assert.equal(threeD.pending, false);
    assert.equal(threeD.stats.submitted || 0, entered.stats.submitted || 0);
    await closeCountryPanel(page);
    await setMapMode(page, '2d');
    await assertAntialiasingProfile(page);
    if (result.configuration.supported) {
      await page.waitForFunction(count => viewer.scene._geoRiskPresentationStats.presented > count,
        threeD.stats.presented, { timeout: 8000 });
    }
    await stableCanvas(page);
    await assertThematicLabelOrder(page);
    return { before, entered, threeD, twoD: await snapshot(page) };
  });
  await phase('idle suspension and resume', async () => {
    await stableCanvas(page);
    await page.waitForTimeout(1000);
    const before = await snapshot(page);
    await page.waitForTimeout(1500);
    const idle = await snapshot(page);
    assert.equal(idle.posts, before.posts, 'quiet visible map must not submit more rendered frames');
    const stopped = await page.evaluate(() => {
      const scene = viewer.scene;
      viewer.cesiumWidget.useDefaultRenderLoop = false;
      return { pending: !!scene._geoRiskPendingPresentation, target: !!scene._geoRiskPresentationBuffer,
        shader: !!scene._geoRiskPresentationCopy, state: !!scene._geoRiskPresentationState };
    });
    assert.deepEqual(stopped, { pending: false, target: false, shader: false, state: false });
    await page.evaluate(() => { viewer.cesiumWidget.useDefaultRenderLoop = true; viewer.scene.requestRender(); });
    await page.waitForFunction(posts => window.__interactionProbe.posts > posts, idle.posts, { timeout: 8000 });
    return { before, idle, stopped, resumed: await snapshot(page) };
  });
  result.motion = await page.evaluate(() => ({ count: window.__interactionProbe.motionCount,
    durations: window.__interactionProbe.motionDurations }));
  assert.equal(result.motion.count, result.motion.durations.length, 'bounded motion evidence must not overflow');
  assert.ok(result.motion.durations.some(item => item.name === 'morphTo2D'));
  assert.ok(result.motion.durations.some(item => item.name === 'morphTo3D'));
  assert.ok(result.motion.durations.every(item => item.duration === 0), 'reduced motion must reach native zero-duration operations');
  assertHealthyPage(test.pageErrors, 'prototype real interactions');
  result.errors = test.pageErrors;
  result.gpu = await collectBrowserGpuInfo(browser);
  const png = await page.screenshot({ animations: 'disabled', timeout: 8000 });
  assert.ok(png.length <= 2 * 1024 ** 2, 'bounded screenshot');
  await fs.writeFile(`${out}/interactions.png`, png);
  result.screenshot = { bytes: png.length, sha256: createHash('sha256').update(png).digest('hex') };
  result.status = 'passed';
} catch (error) {
  result.status = 'failed'; result.error = error.message.slice(0, 2048);
  result.errors = test?.pageErrors?.slice(0, 30).map(message => message.slice(0, 1000));
  if (test) result.lastState = await snapshot(test.page).catch(() => null);
  throw error;
} finally {
  try {
    await test?.page.mouse.up().catch(() => {});
    await test?.page.evaluate(() => {
      window.__cancelInteractionQuiet?.(); window.__interactionProbe.removePost?.();
      window.__interactionProbe.restoreMotion?.();
      viewer.cesiumWidget.useDefaultRenderLoop = false;
    }).catch(() => {});
    await browser?.close();
  } catch (error) {
    result.status = 'failed'; result.teardownError = error.message.slice(0, 2048);
    throw error;
  } finally {
    closeCriticalTileCache();
    if (server.listening) await new Promise(resolve => server.close(resolve));
    result.finishedAt = new Date().toISOString(); await save();
  }
}
