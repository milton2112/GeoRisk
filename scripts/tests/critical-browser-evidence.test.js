import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parse } from "yaml";
import { CRITICAL_BROWSER_FLOWS, criticalShardFlows, parseCriticalShard } from "../lib/critical-browser-plan.js";
import { assertFullReleaseEnvironment, assertReleaseBudget, externalCriticalEvidence, readCriticalShards,
  recordNativeTestCost, remainingTestBudget, TOTAL_TEST_BUDGET_MS, validateCriticalShards, writeCriticalEvidence } from "../lib/critical-browser-evidence.js";

assert.equal(CRITICAL_BROWSER_FLOWS.length, 27);
assert.deepEqual(parseCriticalShard("1/2"), { index: 1, total: 2 });
assert.deepEqual(parseCriticalShard("2/2"), { index: 2, total: 2 });
assert.equal(parseCriticalShard(), null);
for (const value of ["", "0/2", "3/2", "1/3", "1/1", "01/2", null]) assert.throws(() => parseCriticalShard(value));
assert.equal(criticalShardFlows(1).length, 14);
assert.equal(criticalShardFlows(2).length, 13);
assert.equal(new Set([...criticalShardFlows(1), ...criticalShardFlows(2)]).size, 27);
assert.ok(!criticalShardFlows(1).includes("desktop journey") && criticalShardFlows(2).includes("desktop journey"));
assert.ok(criticalShardFlows(1).includes("mobile journey"));
assert.throws(() => criticalShardFlows(3));
assertFullReleaseEnvironment({});
assert.throws(() => assertFullReleaseEnvironment({ GEORISK_E2E_SHARD: "1/2" }), /full suite/);
assert.equal(await externalCriticalEvidence({ env: {} }), null);
await assert.rejects(externalCriticalEvidence({ env: { GEORISK_E2E_REPORTS_DIR: "ignored" } }), /only.*CI/);

const base = 1_700_000_000_000;
const now = base + 180000;
const iso = value => new Date(value).toISOString();
const expected = { runId: "1234", attempt: "1", revision: "a".repeat(40), inputHash: "b".repeat(64) };
function shard(index) {
  const start = base + (index - 1) * 2000;
  return { schemaVersion: 1, scope: "shard", status: "passed", elapsedMs: 120000,
    startedAt: iso(start), completedAt: iso(start + 120000),
    metadata: { ciRunId: expected.runId, ciRunAttempt: expected.attempt, ciRevision: expected.revision,
      publicInputHash: expected.inputHash, platform: "linux", shard: { index, total: 2 }, releaseStartedAt: iso(base - 60000),
      browser: { requestedChannel: "chromium", actualChannel: "chromium", browserVersion: "151.0.7922.34" } },
    flows: criticalShardFlows(index).map(name => ({ name, status: "passed", durationMs: 1000 })) };
}
const good = () => [shard(1), shard(2)];
const merged = validateCriticalShards(good().reverse(), expected, now);
assert.equal(merged.report.scope, "full");
assert.equal(merged.report.status, "passed");
assert.deepEqual(merged.report.flows.map(flow => flow.name), [...CRITICAL_BROWSER_FLOWS]);
assert.equal(merged.criticalMs, 122000, "staggered starts and browser teardown count toward the parallel wall time");
assert.equal(merged.testTimeoutMs, TOTAL_TEST_BUDGET_MS - 122000);
for (const alter of [
  reports => reports.pop(), reports => { reports[1] = reports[0]; },
  reports => { reports[0].scope = "focused"; }, reports => { reports[0].status = "running"; },
  reports => { reports[0].status = "failed"; }, reports => { reports[0].error = { message: "failed" }; },
  reports => { reports[0].metadata.ciRunId = "previous"; }, reports => { reports[0].metadata.ciRunAttempt = "2"; },
  reports => { reports[0].metadata.ciRevision = "c".repeat(40); }, reports => { reports[0].metadata.publicInputHash = "d".repeat(64); },
  reports => { reports[0].metadata.shard.total = 3; }, reports => { reports[0].metadata.platform = "win32"; },
  reports => { reports[0].metadata.browser.actualChannel = "headless-shell"; },
  reports => { reports[0].metadata.browser.requestedChannel = "chrome"; },
  reports => { reports[0].metadata.browser.browserVersion = "152.0.0.1"; },
  reports => { reports[0].flows.pop(); }, reports => { reports[0].flows[0] = reports[0].flows[1]; },
  reports => { reports[0].flows.reverse(); }, reports => { reports[0].flows[0].status = "pending"; },
  reports => { reports[0].flows[0].durationMs = 0; }, reports => { reports[0].elapsedMs = 1; },
  reports => { reports[0].elapsedMs = "120000"; }, reports => { reports[0].completedAt = "invalid"; },
  reports => { reports[0].completedAt = iso(now + 1); },
  reports => { reports[0].metadata.releaseStartedAt = iso(base + 1); }
]) {
  const reports = good();
  alter(reports);
  assert.throws(() => validateCriticalShards(reports, expected, now));
}
assert.throws(() => validateCriticalShards(good(), expected, base + 33 * 60000), /stale/);
const over = good();
over[0].elapsedMs = TOTAL_TEST_BUDGET_MS;
over[0].completedAt = iso(base + TOTAL_TEST_BUDGET_MS);
over[1].elapsedMs = TOTAL_TEST_BUDGET_MS;
over[1].completedAt = iso(base + 2000 + TOTAL_TEST_BUDGET_MS);
assert.throws(() => validateCriticalShards(over, expected, base + 21 * 60000), /20-minute/);
for (const value of [TOTAL_TEST_BUDGET_MS, TOTAL_TEST_BUDGET_MS + 1, -1, NaN, Infinity]) assert.throws(() => remainingTestBudget(value));
assert.equal(remainingTestBudget(TOTAL_TEST_BUDGET_MS - 1), 1);
assert.throws(() => assertReleaseBudget(iso(base), base + 45 * 60000), /45-minute/);
assert.throws(() => assertReleaseBudget(iso(base + 1), base));

const temporaryBase = path.resolve(os.tmpdir());
const root = await fs.mkdtemp(path.join(temporaryBase, "geo-risk-critical-evidence-"));
try {
  await Promise.all(good().map(async (report, index) => {
    const folder = path.join(root, "geo-risk-critical-e2e-" + (index + 1) + "-attempt-1");
    await fs.mkdir(folder);
    await fs.writeFile(path.join(folder, "critical-browser-e2e.json"), JSON.stringify(report));
  }));
  assert.equal(validateCriticalShards(await readCriticalShards(root), expected, now).criticalMs, 122000);
  const output = path.join(root, "merged", "report.json");
  await writeCriticalEvidence(output, merged.report);
  await recordNativeTestCost(output, merged, 1000);
  const accounted = JSON.parse(await fs.readFile(output, "utf8"));
  assert.equal(accounted.metadata.aggregation.nativeMs, 1000);
  assert.equal(accounted.metadata.aggregation.totalTestMs, 123000);
  await assert.rejects(recordNativeTestCost(output, merged, TOTAL_TEST_BUDGET_MS), /20-minute/);
  accounted.metadata.ciRevision = "c".repeat(40);
  await writeCriticalEvidence(output, accounted);
  await assert.rejects(recordNativeTestCost(output, merged, 1000), /identity/);
  const mergedFolder = path.resolve(root, "merged");
  assert.equal(path.dirname(mergedFolder), path.resolve(root));
  await fs.rm(mergedFolder, { recursive: true });
  const file = path.join(root, "geo-risk-critical-e2e-1-attempt-1", "critical-browser-e2e.json");
  await fs.writeFile(file, Buffer.alloc(256 * 1024 + 1));
  await assert.rejects(readCriticalShards(root), /bounded/);
  await fs.writeFile(file, JSON.stringify(shard(1)));
  await fs.writeFile(path.join(root, "extra.json"), "{}");
  await assert.rejects(readCriticalShards(root), /exactly/);
} finally {
  assert.equal(path.dirname(path.resolve(root)), temporaryBase, "cleanup stays in the owned temporary base");
  assert.ok(path.basename(root).startsWith("geo-risk-critical-evidence-"));
  await fs.rm(root, { recursive: true, force: true });
}

const workflow = parse(await fs.readFile(".github/workflows/release-gate.yml", "utf8"));
const jobs = workflow.jobs;
assert.equal(jobs["critical-browser"].strategy["max-parallel"], 2);
assert.deepEqual(jobs["critical-browser"].strategy.matrix.shard, [1, 2]);
assert.equal(jobs["critical-browser"].strategy["fail-fast"], false);
assert.equal(jobs["critical-browser"].steps[0].name, "Record release start",
  "checkout and all subsequent setup must count toward the whole release budget");
for (const job of [jobs["critical-browser"], jobs["release-gate"], jobs["scheduled-data-audit"]]) {
  assert.ok(job.steps.some(step => step.run === "npm run audit:dependencies"));
  assert.ok(job.steps.some(step => step.run === "node scripts/checkSecurity.js --history"));
  assert.ok(job.steps.some(step => step.with?.["fetch-depth"] === 0));
}
assert.equal(jobs["release-gate"].needs, "critical-browser");
assert.ok(jobs["release-gate"].if.includes("always()"), "a failed dependency must produce a failed required gate, not a skipped success");
assert.ok(jobs["release-gate"].steps[0].run.includes('test "$CRITICAL_RESULT" = success'));
assert.ok(jobs["release-gate"].steps.some(step => step.run === "npm run release:check"));
assert.ok(jobs["release-gate"].steps.some(step => step.run === "node scripts/checkCriticalBudget.js"));
assert.equal(jobs["release-gate"].steps.find(step => step.name === "Download current critical shards").with["digest-mismatch"], "error");
console.log("critical-browser-evidence.test.js ok: exact full coverage, current identity, fail-closed artifacts and unchanged combined budgets");
