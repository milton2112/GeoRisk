import fs from "node:fs/promises";
import { assertReleaseBudget, currentCriticalCI, TOTAL_TEST_BUDGET_MS } from "./lib/critical-browser-evidence.js";
import { CRITICAL_BROWSER_FLOWS } from "./lib/critical-browser-plan.js";

const expected = await currentCriticalCI();
const report = JSON.parse(await fs.readFile("reports/critical-browser-e2e.json", "utf8"));
const metadata = report.metadata;
if (report.scope !== "full" || report.status !== "passed" || metadata?.ciRunId !== expected.runId ||
    metadata.ciRunAttempt !== expected.attempt || metadata.ciRevision !== expected.revision ||
    metadata.publicInputHash !== expected.inputHash || !Number.isSafeInteger(metadata.aggregation?.totalTestMs) ||
    metadata.aggregation.totalTestMs < 0 || metadata.aggregation.totalTestMs > TOTAL_TEST_BUDGET_MS ||
    !Number.isSafeInteger(metadata.aggregation.nativeMs) || metadata.aggregation.nativeMs < 0 ||
    !Number.isSafeInteger(metadata.aggregation.criticalMs) || metadata.aggregation.criticalMs <= 0 ||
    report.elapsedMs !== metadata.aggregation.criticalMs ||
    metadata.aggregation.totalTestMs !== metadata.aggregation.criticalMs + metadata.aggregation.nativeMs ||
    JSON.stringify(metadata.aggregation.shards) !== JSON.stringify([1, 2]) ||
    report.flows?.length !== CRITICAL_BROWSER_FLOWS.length || report.flows.some((flow, index) =>
      flow.name !== CRITICAL_BROWSER_FLOWS[index] || flow.status !== "passed")) throw new Error("Current combined test evidence is required.");
assertReleaseBudget(metadata.aggregation.releaseStartedAt);
console.log("Critical suite complete; combined tests <=20 min, whole CI release <=45 min.");
