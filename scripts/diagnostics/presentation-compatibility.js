// Test-only server substitution. No production asset, browser flag or quality override.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { createLocalSmokeServer } from '../localSmokeServer.js';
import { BROWSER_SECURITY_HEADERS } from '../lib/browser-security-policy.js';
import { getPerformanceInputHash } from '../lib/performance-inputs.js';

export function servePresentationEngine(server, engine, metadata) {
  const native = server.listeners('request')[0];
  server.removeListener('request', native);
  server.on('request', (request, response) => {
    let pathname;
    try { pathname = new URL(request.url, 'http://127.0.0.1').pathname; }
    catch { void native(request, response); return; }
    if (['GET', 'HEAD'].includes(request.method) && pathname === '/vendor/cesium/engine.js') {
      if (request.method === 'GET') metadata.engineLoads++;
      response.writeHead(200, { ...BROWSER_SECURITY_HEADERS, 'Cache-Control': 'no-store',
        'Cross-Origin-Resource-Policy': 'cross-origin', 'Content-Type': 'text/javascript; charset=utf-8',
        'Content-Length': engine.length });
      response.end(request.method === 'HEAD' ? undefined : engine);
    } else void native(request, response);
  });
  return server;
}

export async function createPresentationCompatibility() {
  const out = 'reports/presentation-prototype';
  for (const [name, limit] of [['engine-prototype.js', 4 * 1024 ** 2], ['build.json', 32768]]) {
    const stat = await fs.lstat(`${out}/${name}`);
    assert.ok(stat.isFile() && !stat.isSymbolicLink() && stat.size <= limit, 'bounded prototype input');
  }
  const engine = await fs.readFile(`${out}/engine-prototype.js`);
  const build = JSON.parse(await fs.readFile(`${out}/build.json`, 'utf8'));
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', timeout: 3000 }).trim();
  assert.equal(build.prototype, true);
  assert.equal(build.enabledByDefault, true);
  assert.equal(build.head, revision);
  assert.equal(build.bytes, engine.length);
  assert.equal(build.sha256, createHash('sha256').update(engine).digest('hex'));
  if (process.env.CI) assert.equal(revision, process.env.GITHUB_SHA, 'exact CI checkout required');
  const metadata = { name: 'isolated-presentation-compatibility', revision, engineSha256: build.sha256,
    engineBytes: build.bytes, enabledByDefault: true, publicInputHash: await getPerformanceInputHash(process.cwd()),
    engineLoads: 0, observedDeferred: false, nativeFallbackSamples: 0, samples: [],
    limitation: 'Full browser compatibility only; separate evidence, not release approval or a causal performance measurement.' };
  return {
    metadata,
    createServer(options) {
      return servePresentationEngine(createLocalSmokeServer(options), engine, metadata);
    },
    async ready(page) {
      const read = () => page.evaluate(() => {
        const scene = viewer.scene;
        return { width: window.innerWidth, mode: currentMapMode, enabled: scene._geoRiskPresentationEnabled,
          supported: scene._geoRiskPresentationSupported?.() === true, animated: viewer.clock.shouldAnimate,
          hidden: document.hidden, stats: scene._geoRiskPresentationStats ? { ...scene._geoRiskPresentationStats } : null };
      });
      let sample = await read();
      assert.equal(sample.enabled, true, 'every ready page must use the enabled alternate engine');
      if (!metadata.observedDeferred && sample.supported && sample.mode === '2d' && !sample.animated && !sample.hidden) {
        // Once per run, prove that the opt-in took the actual path, not just a loaded bundle.
        await page.waitForFunction(() => viewer.scene._geoRiskPresentationStats?.presented > 0,
          undefined, { timeout: 8000 });
        sample = await read();
      }
      assert.ok(metadata.samples.length < 128, 'bounded page activation evidence');
      metadata.samples.push(sample);
      if (sample.stats?.presented > 0) metadata.observedDeferred = true;
      if (!sample.supported || sample.mode !== '2d') metadata.nativeFallbackSamples++;
    },
    verify() {
      assert.ok(metadata.engineLoads > 0 && metadata.samples.length > 0, 'alternate engine must actually load');
      assert.ok(metadata.nativeFallbackSamples > 0, 'full suite must retain native fallback coverage');
      if (process.env.CI) assert.equal(metadata.observedDeferred, true, 'CI must prove real deferred frames');
      assert.ok(Buffer.byteLength(JSON.stringify(metadata)) <= 128 * 1024, 'bounded compatibility metadata');
    }
  };
}
