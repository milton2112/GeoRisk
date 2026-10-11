import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { runCommand } from '../lib/npm-runner.js';
const identity = { status: 'running', scope: 'isolated-presentation-experiment',
  revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  ciRunId: process.env.GITHUB_RUN_ID || null, ciRunAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
  startedAt: new Date().toISOString() };
await fs.mkdir('reports/presentation-prototype', { recursive: true });
for (const name of ['build.json', 'control-ci-1.json', 'trace-ci-1.json']) {
  await fs.writeFile(`reports/presentation-prototype/${name}`, JSON.stringify(identity) + '\n');
}
try {
  await runCommand('build isolated presentation prototype', process.execPath,
    ['scripts/diagnostics/buildPresentationPrototype.js'], { timeoutMs: 30000 });
  await runCommand('bounded presentation controls', process.execPath,
    ['scripts/diagnostics/controlPresentationPrototype.js'], { timeoutMs: 90000 });
} catch (error) {
  // Preserve any completed/partial originals; a separate marker records cancellation.
  await fs.writeFile('reports/presentation-prototype/failure.json', JSON.stringify({ ...identity,
    status: 'failed', finishedAt: new Date().toISOString(), error: error.message.slice(0, 2048) }) + '\n');
  throw error;
}
