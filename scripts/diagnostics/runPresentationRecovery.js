import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { runCommand } from '../lib/npm-runner.js';
assert.equal(process.argv.length, 2, 'No deadline or browser overrides accepted');
const identity = { status: 'running', scope: 'isolated-presentation-recovery',
  revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  ciRunId: process.env.GITHUB_RUN_ID || null, ciRunAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
  startedAt: new Date().toISOString() };
await fs.mkdir('reports/presentation-prototype', { recursive: true });
for (const file of ['build.json', 'recovery.json']) {
  await fs.writeFile(`reports/presentation-prototype/${file}`, JSON.stringify(identity) + '\n');
}
try {
  await runCommand('build isolated presentation prototype', process.execPath,
    ['scripts/diagnostics/buildPresentationPrototype.js'], { timeoutMs: 30000 });
  await runCommand('real presentation recovery', process.execPath,
    ['scripts/diagnostics/controlPresentationRecovery.js'], { timeoutMs: 90000 });
} catch (error) {
  await fs.writeFile('reports/presentation-prototype/recovery-failure.json', JSON.stringify({ ...identity,
    status: 'failed', finishedAt: new Date().toISOString(), error: error.message.slice(0, 2048) }) + '\n');
  throw error;
}
