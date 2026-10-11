import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import vm from 'node:vm';
import { parse } from 'yaml';
import { servePresentationEngine } from '../diagnostics/presentation-compatibility.js';
import { patchPresentationScene } from '../diagnostics/presentation-transform.js';

const source = await fs.readFile('node_modules/@cesium/engine/Source/Scene/Scene.js', 'utf8');
const nativeOptIn = patchPresentationScene(source);
const enabled = patchPresentationScene(source, { enabledByDefault: true });
const optIn = '\nScene.prototype._geoRiskPresentationEnabled = true;\n';
assert.equal(enabled.replace(optIn, ''), nativeOptIn, 'compatibility changes only the alternate default opt-in');
function Scene() {}
vm.runInNewContext(optIn, { Scene });
assert.equal(new Scene()._geoRiskPresentationEnabled, true);

const metadata = { engineLoads: 0 };
const engine = Buffer.from('/* exact prototype fixture */');
let nativeRequests = 0;
const server = servePresentationEngine(http.createServer((req, res) => {
  nativeRequests++;
  res.writeHead(req.method === 'POST' ? 405 : 404);
  res.end('native');
}), engine, metadata);
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const request = (path, method = 'GET') => new Promise((resolve, reject) => {
  const req = http.request({ hostname: '127.0.0.1', port: server.address().port, path, method }, res => {
    const chunks = [];
    res.on('data', chunk => chunks.push(chunk));
    res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
  });
  req.on('error', reject); req.end();
});
try {
  const actual = await request('/vendor/cesium/engine.js?version=unchanged');
  assert.equal(actual.status, 200); assert.deepEqual(actual.body, engine);
  assert.equal(actual.headers['cache-control'], 'no-store');
  assert.equal(actual.headers['x-content-type-options'], 'nosniff');
  assert.match(actual.headers['content-security-policy'], /default-src/);
  const head = await request('/vendor/cesium/engine.js', 'HEAD');
  assert.equal(head.body.length, 0); assert.equal(Number(head.headers['content-length']), engine.length);
  for (const path of ['/index.html', '/vendor/cesium/%65ngine.js', '/vendor/cesium/engine.js/extra', '/reports/engine-prototype.js']) {
    assert.equal((await request(path)).status, 404, 'unrelated paths retain native handling');
  }
  assert.equal((await request('/vendor/cesium/engine.js', 'POST')).status, 405);
  assert.equal(nativeRequests, 5); assert.equal(metadata.engineLoads, 1);
} finally { await new Promise(resolve => server.close(resolve)); }

const workflow = parse(await fs.readFile('.github/workflows/presentation-compatibility.yml', 'utf8'));
assert.deepEqual(Object.keys(workflow.on).sort(), ['push', 'workflow_dispatch']);
assert.deepEqual(workflow.on.push.branches, ['codex/experiment/map-presentation-*']);
assert.ok(workflow.on.push.paths.includes('scripts/tests/critical-browser-e2e.test.js'));
assert.deepEqual(workflow.permissions, { contents: 'read' });
const job = workflow.jobs['presentation-compatibility'];
assert.equal(job['timeout-minutes'], 45);
assert.ok(job.steps.every(step => !/pages|deploy/.test(step.uses || '')));
assert.ok(job.steps.some(step => step.run === 'npx playwright install --with-deps --no-shell chromium'));
const upload = job.steps.find(step => step.uses?.startsWith('actions/upload-artifact@'));
assert.equal(upload.with['retention-days'], 7);
assert.ok(!upload.with.path.includes('engine-prototype'));
assert.ok(upload.with.path.includes('compatibility.json'));
console.log('presentation-compatibility.test.js ok: exact alternate bytes, native security handling, unchanged opt-in source and bounded opt-in workflow');
