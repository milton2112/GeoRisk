import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { runCommand } from '../lib/npm-runner.js';
import { assertReleaseBudget } from '../lib/critical-browser-evidence.js';

assert.equal(process.argv.length, 2, 'No filters or quality/deadline overrides accepted');
for (const name of ['GEORISK_E2E_SHARD', 'GEORISK_E2E_REPORTS_DIR', 'GEORISK_E2E_TIMEOUT_MS', 'GEORISK_PRESENTATION_COMPATIBILITY', 'npm_lifecycle_event']) {
  assert.ok(!process.env[name], `Incompatible environment: ${name}`);
}
const out = 'reports/presentation-prototype';
await fs.mkdir(out, { recursive: true });
const identity = { status: 'running', scope: 'isolated-presentation-compatibility', startedAt: new Date().toISOString() };
for (const name of ['compatibility.json', 'compatibility-failure.json']) {
  await fs.writeFile(`${out}/${name}`, JSON.stringify(identity) + '\n');
}
const hash = async () => createHash('sha256').update(await fs.readFile('vendor/cesium/engine.js')).digest('hex');
const productionHash = await hash();
try {
  if (process.env.GEORISK_RELEASE_STARTED_AT) assertReleaseBudget(process.env.GEORISK_RELEASE_STARTED_AT);
  await runCommand('build enabled isolated prototype', process.execPath,
    ['scripts/diagnostics/buildPresentationPrototype.js', '--compatibility'], { timeoutMs: 30000 });
  process.env.GEORISK_PRESENTATION_COMPATIBILITY = '1';
  await runCommand('all 27 browser flows with isolated prototype', process.execPath,
    ['scripts/tests/critical-browser-e2e.test.js'], { timeoutMs: 20 * 60_000 });
  const report = JSON.parse(await fs.readFile(`${out}/compatibility.json`, 'utf8'));
  assert.equal(report.status, 'passed');
  assert.equal(report.scope, 'full');
  assert.equal(report.flows.length, 27);
  assert.ok((await fs.stat(`${out}/compatibility.json`)).size <= 256 * 1024);
  for (const name of ['desktop', 'mobile']) {
    assert.ok((await fs.stat(`tmp/map-labels-${name}.png`)).size <= 2 * 1024 ** 2, 'bounded existing label capture');
  }
  if (process.env.GEORISK_RELEASE_STARTED_AT) assertReleaseBudget(process.env.GEORISK_RELEASE_STARTED_AT);
  assert.equal(await hash(), productionHash, 'production engine must remain unchanged');
  await fs.writeFile(`${out}/compatibility-failure.json`, JSON.stringify({ ...identity, status: 'none',
    completedAt: new Date().toISOString(), productionEngineSha256: productionHash }) + '\n');
} catch (error) {
  await fs.writeFile(`${out}/compatibility-failure.json`, JSON.stringify({ ...identity, status: 'failed',
    completedAt: new Date().toISOString(), productionEngineUnchanged: await hash() === productionHash,
    message: String(error.message).slice(0, 2000) }) + '\n');
  throw error;
}
