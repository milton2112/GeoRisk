import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { CRITICAL_BROWSER_FLOWS, criticalShardFlows } from "./critical-browser-plan.js";
import { getPerformanceInputHash } from "./performance-inputs.js";
import { retryFileOperation } from "./resilient-fs.js";

export const TOTAL_TEST_BUDGET_MS = 20 * 60_000;
export const TOTAL_RELEASE_BUDGET_MS = 45 * 60_000;
const MAX_EVIDENCE_AGE_MS = 30 * 60_000;
const artifactFolders = attempt => [1, 2].map(index => `geo-risk-critical-e2e-${index}-attempt-${attempt}`);
const ensure = (condition, message) => { if (!condition) throw new Error("Critical browser evidence: " + message); };
const timestamp = value => {
  ensure(typeof value === "string" && /Z$/.test(value) && Number.isFinite(Date.parse(value)), "invalid timestamp");
  return Date.parse(value);
};
const milliseconds = value => Number.isSafeInteger(value) && value >= 0;

export function remainingTestBudget(criticalMs) {
  ensure(milliseconds(criticalMs) && criticalMs < TOTAL_TEST_BUDGET_MS, "20-minute test budget exhausted");
  return TOTAL_TEST_BUDGET_MS - criticalMs;
}

export function assertFullReleaseEnvironment(env = process.env) {
  ensure(!env.GEORISK_E2E_SHARD, "release:check requires the full suite, never a single shard");
}

export function assertReleaseBudget(startedAt, now = Date.now()) {
  const started = timestamp(startedAt);
  ensure(now >= started && now - started < TOTAL_RELEASE_BUDGET_MS, "45-minute release budget exhausted");
  return TOTAL_RELEASE_BUDGET_MS - (now - started);
}

export function validateCriticalShards(reports, expected, now = Date.now()) {
  ensure(Array.isArray(reports) && reports.length === 2, "both shards are required");
  ensure(/^\d+$/.test(expected.runId) && /^\d+$/.test(expected.attempt) && /^[a-f0-9]{40}$/.test(expected.revision)
    && /^[a-f0-9]{64}$/.test(expected.inputHash), "invalid current CI identity");
  const byIndex = new Map();
  let browser;
  let firstStart = Infinity;
  let lastEnd = 0;
  let releaseStart = Infinity;
  for (const report of reports) {
    ensure(report?.schemaVersion === 1 && report.scope === "shard" && report.status === "passed" && !report.error,
      "a partial, failed or non-shard report cannot approve the full suite");
    const metadata = report.metadata;
    ensure(metadata?.ciRunId === expected.runId && metadata.ciRunAttempt === expected.attempt &&
      metadata.ciRevision === expected.revision && metadata.publicInputHash === expected.inputHash,
      "run, attempt, revision and public sources must match");
    const index = metadata.shard?.index;
    ensure((index === 1 || index === 2) && metadata.shard.total === 2 && !byIndex.has(index), "duplicate or invalid shard");
    const selection = metadata.browser;
    ensure(metadata.platform === "linux" && selection?.requestedChannel === "chromium" &&
      selection.actualChannel === "chromium" && /^\d+\.\d+\.\d+\.\d+$/.test(selection.browserVersion),
      "regular Chromium on Linux is required, without a browser-mode fallback");
    if (browser) ensure(selection.browserVersion === browser.browserVersion, "browser versions must match");
    browser = selection;
    const names = criticalShardFlows(index);
    ensure(Array.isArray(report.flows) && report.flows.length === names.length &&
      report.flows.every((flow, position) => flow.name === names[position] && flow.status === "passed" &&
        milliseconds(flow.durationMs) && flow.durationMs > 0), "missing, repeated, out-of-order or incomplete flows");
    const started = timestamp(report.startedAt);
    const completed = timestamp(report.completedAt);
    const pipelineStarted = timestamp(metadata.releaseStartedAt);
    ensure(pipelineStarted <= started && started <= completed && completed <= now &&
      now - completed <= MAX_EVIDENCE_AGE_MS, "stale or inconsistent execution times");
    ensure(milliseconds(report.elapsedMs) && report.elapsedMs > 0, "monotonic elapsed time is required");
    const sum = report.flows.reduce((total, flow) => total + flow.durationMs, 0);
    ensure(sum <= report.elapsedMs + names.length, "flows must have executed sequentially on each runner");
    const elapsed = Math.max(report.elapsedMs, sum, completed - started);
    firstStart = Math.min(firstStart, started);
    lastEnd = Math.max(lastEnd, started + elapsed);
    releaseStart = Math.min(releaseStart, pipelineStarted);
    byIndex.set(index, report);
  }
  const criticalMs = lastEnd - firstStart;
  const testTimeoutMs = remainingTestBudget(criticalMs);
  const releaseStartedAt = new Date(releaseStart).toISOString();
  assertReleaseBudget(releaseStartedAt, now);
  const merged = { schemaVersion: 1, scope: "full", status: "passed",
    startedAt: new Date(firstStart).toISOString(), completedAt: new Date(lastEnd).toISOString(),
    updatedAt: new Date(now).toISOString(), elapsedMs: criticalMs,
    metadata: { platform: "linux", ciRunId: expected.runId, ciRunAttempt: expected.attempt,
      ciRevision: expected.revision, publicInputHash: expected.inputHash, browser,
      aggregation: { shards: [1, 2], artifacts: artifactFolders(expected.attempt), releaseStartedAt, criticalMs, testTimeoutMs },
      shardExecutions: [...byIndex.values()].map(report => ({ index: report.metadata.shard.index,
        startedAt: report.startedAt, completedAt: report.completedAt, elapsedMs: report.elapsedMs,
        nodeVersion: report.metadata.nodeVersion, browser: report.metadata.browser })) },
    flows: CRITICAL_BROWSER_FLOWS.map(name => [...byIndex.values()].flatMap(report => report.flows).find(flow => flow.name === name)) };
  return { report: merged, criticalMs, testTimeoutMs, releaseStartedAt };
}

export async function readCriticalShards(directory, attempt = "1") {
  ensure(/^\d+$/.test(attempt), "invalid artifact attempt");
  const folders = artifactFolders(attempt);
  ensure((await fs.lstat(directory)).isDirectory(), "artifact directory must be regular");
  const entries = (await fs.readdir(directory)).sort();
  ensure(JSON.stringify(entries) === JSON.stringify(folders), "exactly the two named artifacts are required");
  return Promise.all(folders.map(async folder => {
    const parent = path.join(directory, folder);
    ensure((await fs.lstat(parent)).isDirectory(), "artifact folder must be regular");
    ensure(JSON.stringify(await fs.readdir(parent)) === JSON.stringify(["critical-browser-e2e.json"]), "unexpected artifact files");
    const file = path.join(parent, "critical-browser-e2e.json");
    const stat = await fs.lstat(file);
    ensure(stat.isFile() && stat.size <= 256 * 1024, "artifact must be a bounded regular JSON file");
    return JSON.parse(await fs.readFile(file, "utf8"));
  }));
}

export async function currentCriticalCI(root = process.cwd(), env = process.env) {
  ensure(env.CI === "true" && env.GITHUB_ACTIONS === "true" && /^\d+$/.test(env.GITHUB_RUN_ID || "") && /^\d+$/.test(env.GITHUB_RUN_ATTEMPT || ""),
    "external evidence is allowed only in the current CI run");
  const revision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", maxBuffer: 1024 }).trim();
  ensure(revision === env.GITHUB_SHA && /^[a-f0-9]{40}$/.test(revision), "checkout must match the current CI revision");
  return { runId: env.GITHUB_RUN_ID, attempt: env.GITHUB_RUN_ATTEMPT, revision,
    inputHash: await getPerformanceInputHash(root) };
}

export async function externalCriticalEvidence({ root = process.cwd(), env = process.env, now = Date.now() } = {}) {
  if (!env.GEORISK_E2E_REPORTS_DIR) return null;
  const expected = await currentCriticalCI(root, env);
  return validateCriticalShards(await readCriticalShards(env.GEORISK_E2E_REPORTS_DIR, expected.attempt), expected, now);
}

export async function writeCriticalEvidence(file, report) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file + ".tmp", JSON.stringify(report, null, 2) + "\n");
  await retryFileOperation(() => fs.rename(file + ".tmp", file), { attempts: 3, delayMs: 40 });
}

export async function recordNativeTestCost(file, evidence, nativeMs) {
  ensure(milliseconds(nativeMs), "invalid native test duration");
  const report = JSON.parse(await fs.readFile(file, "utf8"));
  ensure(report.scope === "full" && report.status === "passed" && report.metadata?.aggregation?.criticalMs === evidence.criticalMs,
    "full merged report is required after npm test");
  for (const key of ["ciRunId", "ciRunAttempt", "ciRevision", "publicInputHash"]) {
    ensure(report.metadata[key] === evidence.report.metadata[key], "merged identity changed during npm test");
  }
  const totalMs = evidence.criticalMs + nativeMs;
  ensure(totalMs <= TOTAL_TEST_BUDGET_MS, "combined tests exceeded their 20-minute budget");
  report.metadata.aggregation.nativeMs = nativeMs;
  report.metadata.aggregation.totalTestMs = totalMs;
  await writeCriticalEvidence(file, report);
}
