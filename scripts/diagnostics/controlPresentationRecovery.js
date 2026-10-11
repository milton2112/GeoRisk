// Finite native error/context-loss control. Never used by the published engine.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { launchPerformanceBrowser, performanceEnvironment } from '../lib/browser-performance.js';
import { getBrowserSelection } from '../lib/browser-launch.js';
import { getPerformanceInputHash } from '../lib/performance-inputs.js';
import { collectBrowserGpuInfo } from '../lib/profile-gpu.js';
import { createLocalSmokeServer } from '../localSmokeServer.js';
import { testRenderRecovery, waitForAppReady, closeCriticalTileCache } from '../tests/critical-browser-e2e.test.js';

assert.equal(process.argv.length, 2, 'No quality, browser or deadline overrides accepted');
const root = process.cwd(), out = 'reports/presentation-prototype';
const engine = await fs.readFile(`${out}/engine-prototype.js`);
const result = { status: 'running', scope: 'isolated-presentation-recovery',
  revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  ciRunId: process.env.GITHUB_RUN_ID || null, ciRunAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
  prototype: JSON.parse(await fs.readFile(`${out}/build.json`, 'utf8')),
  environment: performanceEnvironment(), publicInputHash: await getPerformanceInputHash(root),
  browserFlags: [], startedAt: new Date().toISOString(), checkpoints: [],
  profiles: [{ width: 1440, height: 920, cpuSlowdown: 1 }, { width: 390, height: 844, cpuSlowdown: 4 }],
  timingIsDiagnosticOnly: true };
const save = () => {
  const json = JSON.stringify(result, null, 2) + '\n';
  assert.ok(Buffer.byteLength(json) <= 256 * 1024, 'bounded recovery report');
  return fs.writeFile(`${out}/recovery.json`, json);
};
const server = createLocalSmokeServer({ root: `${root}/dist/public` });
let browser;
await save();
async function state(page) {
  return page.evaluate(() => {
    const scene = viewer.scene;
    return { recovery: viewer.__geoRiskRenderRecovery.getState(), loop: viewer.useDefaultRenderLoop,
      mode: currentMapMode, scale: viewer.resolutionScale, canvas: [scene.canvas.width, scene.canvas.height],
      supported: scene._geoRiskPresentationSupported(), pending: !!scene._geoRiskPendingPresentation,
      target: !!scene._geoRiskPresentationBuffer, shader: !!scene._geoRiskPresentationCopy,
      renderState: !!scene._geoRiskPresentationState, creditOpen: !!scene._geoRiskPresentationFrameOpen,
      stats: { ...scene._geoRiskPresentationStats }, retainedCallbacks: scene._frameState.afterRender.length,
      selected: selectedLayers.map(layer => layer.code),
      probe: window.__presentationRecoveryProbe,
      log: mapDegradationLog.list().filter(entry => entry.reason === 'render-recovery') };
  });
}
async function checkpoint(page, info) {
  assert.ok(result.checkpoints.length < 32, 'bounded recovery checkpoints');
  const evidence = await state(page);
  result.checkpoints.push({ ...info, at: new Date().toISOString(), evidence });
  await save();
  console.log('presentation-recovery: ' + info.label + ' ' + info.stage);
  return evidence;
}
function assertReleased(evidence) {
  for (const key of ['pending', 'target', 'shader', 'renderState', 'creditOpen', 'loop']) {
    assert.equal(evidence[key], false, 'stopped recovery must release ' + key);
  }
}
async function ready(page, info) {
  await page.evaluate(() => {
    const scene = viewer.scene;
    scene._geoRiskPresentationEnabled = true;
    const probe = window.__presentationRecoveryProbe = { cancellations: [], cancellationCount: 0,
      errors: [], errorCount: 0, failedPolls: 0, afterQueued: 0, afterCompleted: 0 };
    const cancel = scene._geoRiskCancelPresentation;
    scene._geoRiskCancelPresentation = function (...args) {
      const value = cancel.apply(this, args);
      probe.cancellationCount++;
      if (probe.cancellations.length < 24) probe.cancellations.push({ pending: !!this._geoRiskPendingPresentation,
        target: !!this._geoRiskPresentationBuffer, shader: !!this._geoRiskPresentationCopy,
        renderState: !!this._geoRiskPresentationState, creditOpen: !!this._geoRiskPresentationFrameOpen });
      return value;
    };
    scene.renderError.addEventListener((_scene, error) => {
      probe.errorCount++;
      if (probe.errors.length < 8) probe.errors.push({ message: error.message, running: viewer.useDefaultRenderLoop,
        pending: !!scene._geoRiskPendingPresentation, target: !!scene._geoRiskPresentationBuffer });
    });
    scene.requestRender();
  });
  const supported = await page.evaluate(() => viewer.scene._geoRiskPresentationSupported() && currentMapMode === '2d');
  if (supported) await page.waitForFunction(() => viewer.scene._geoRiskPresentationStats?.presented > 0,
    undefined, { timeout: 8000 });
  return checkpoint(page, info);
}

async function pollFailure(page, persistent) {
  const before = await state(page);
  await page.evaluate(persistent => {
    const scene = viewer.scene, gl = scene.context._gl, original = gl.clientWaitSync;
    gl.clientWaitSync = function (sync, ...args) {
      if (sync === scene._geoRiskPendingPresentation?.sync) {
        if (!persistent) this.clientWaitSync = original;
        const probe = window.__presentationRecoveryProbe;
        probe.failedPolls++; probe.afterQueued++;
        scene._frameState.afterRender.push(() => { probe.afterCompleted++; });
        throw new Error('GeoRisk presentation poll fixture');
      }
      return original.call(this, sync, ...args);
    };
    scene.requestRender();
  }, persistent);
  await page.waitForFunction(phase => viewer.__geoRiskRenderRecovery.getState().phase === phase,
    persistent ? 'failed' : 'recovered', { timeout: 8000 });
  const after = await checkpoint(page, { label: 'mobile', stage: persistent ? 'poll-persistent-failed' : 'poll-recovered' });
  assert.equal(after.recovery.attempts, 1);
  assert.equal(after.probe.failedPolls, persistent ? 2 : 1);
  assert.equal(after.probe.afterQueued, persistent ? 2 : 1);
  assert.equal(after.probe.afterCompleted, 1, 'only the successful retry completes the retained public callback');
  assert.equal(after.probe.errorCount, 0, 'native outer catch does not invent a scene renderError');
  assert.ok(after.stats.aborted > before.stats.aborted, 'a real pending frame must be cancelled');
  assert.equal(after.probe.cancellationCount, after.probe.cancellations.length, 'cancellation evidence overflow');
  assert.ok(after.probe.cancellations.every(entry => Object.values(entry).every(value => value === false)));
  if (persistent) { assertReleased(after); assert.ok(after.retainedCallbacks >= 1); }
  else {
    assert.ok(after.stats.presented > before.stats.presented, 'retry must actually present a new deferred frame');
    assert.equal(after.loop, true);
  }
}
try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  browser = await launchPerformanceBrowser();
  result.browser = getBrowserSelection(browser);
  let overrides = 0;
  await testRenderRecovery(browser, `http://127.0.0.1:${server.address().port}`, {
    async beforeNavigate(page) {
      page.setDefaultTimeout(8000);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.route(/\/vendor\/cesium\/engine\.js\?/, route => {
        overrides++; return route.fulfill({ contentType: 'text/javascript', body: engine });
      });
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: page.viewportSize().width <= 820 ? 4 : 1 });
      await cdp.detach();
    },
    onReady: ready,
    async loseContext(page) {
      return page.evaluate(async () => {
        const scene = viewer.scene, gl = scene.context._gl;
        const extension = gl.getExtension('WEBGL_lose_context');
        if (!extension) return false;
        const deferred = scene._geoRiskPresentationSupported() && currentMapMode === '2d';
        if (deferred) {
          scene.requestRender();
          await new Promise((resolve, reject) => {
            let callbacks = 0;
            const wait = () => {
              if (scene._geoRiskPendingPresentation) return resolve();
              if (++callbacks >= 64) return reject(new Error('No real pending frame for context loss'));
              requestAnimationFrame(wait);
            };
            wait();
          });
        }
        window.__presentationRecoveryProbe.beforeLoss = { pending: !!scene._geoRiskPendingPresentation,
          target: !!scene._geoRiskPresentationBuffer, deferred };
        extension.loseContext();
        return true;
      });
    },
    async onCheckpoint(page, info) {
      const evidence = await checkpoint(page, info);
      if (['recovered', 'widget-recovered', 'camera-rendered'].includes(info.stage)) {
        assert.equal(evidence.recovery.phase, 'recovered'); assert.equal(evidence.recovery.attempts, 1);
        if (evidence.supported && evidence.mode === '2d') assert.ok(evidence.stats.presented > 1);
        if (info.stage === 'camera-rendered') {
          assert.notEqual(info.cameraFrame.afterFrameNumber, info.cameraFrame.beforeFrameNumber);
          assert.ok(info.cameraFrame.framesAfter > info.cameraFrame.framesBefore);
          assert.ok(info.cameraFrame.cameraDistance > 0); assert.equal(info.pixelsChanged, true);
        }
      } else {
        assertReleased(evidence); assert.equal(evidence.recovery.phase, 'failed');
      }
      if (info.stage !== 'context-lost') return;
      assert.equal(evidence.supported, false, 'lost context invalidates eligibility');
      if (evidence.probe.beforeLoss.deferred) assert.equal(evidence.probe.beforeLoss.pending, true);
      await page.locator('#fatal-error-banner a').click();
      await waitForAppReady(page);
      const fresh = await ready(page, { ...info, stage: 'context-reloaded' });
      assert.equal(fresh.recovery.attempts, 0); assert.equal(fresh.recovery.phase, 'healthy');
      if (info.label === 'mobile' && fresh.supported) {
        await pollFailure(page, false);
        await pollFailure(page, true);
        await page.locator('#fatal-error-banner a').click();
        await waitForAppReady(page);
        const final = await ready(page, { ...info, stage: 'poll-reloaded' });
        assert.equal(final.recovery.attempts, 0); assert.equal(final.recovery.phase, 'healthy');
      }
      if (info.label === 'mobile') {
        const png = await page.screenshot({ animations: 'disabled', timeout: 8000 });
        assert.ok(png.length <= 2 * 1024 ** 2, 'bounded recovery screenshot');
        await fs.writeFile(`${out}/recovery.png`, png);
        result.screenshot = { bytes: png.length, sha256: createHash('sha256').update(png).digest('hex') };
      }
    }
  });
  assert.ok(overrides >= 6 && overrides <= 7, 'each fresh page must load the alternate engine once');
  result.engineLoads = overrides;
  result.gpu = await collectBrowserGpuInfo(browser);
  result.status = 'passed';
} catch (error) {
  result.status = 'failed'; result.error = error.message.slice(0, 2048);
  throw error;
} finally {
  try { await browser?.close(); }
  catch (error) { result.status = 'failed'; result.teardownError = error.message.slice(0, 2048); throw error; }
  finally {
    closeCriticalTileCache();
    if (server.listening) await new Promise(resolve => server.close(resolve));
    result.finishedAt = new Date().toISOString(); await save();
  }
}
