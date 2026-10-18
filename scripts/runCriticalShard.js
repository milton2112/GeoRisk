import { runCommand } from "./lib/npm-runner.js";
import { parseCriticalShard } from "./lib/critical-browser-plan.js";
import { TOTAL_TEST_BUDGET_MS } from "./lib/critical-browser-evidence.js";

if (!parseCriticalShard(process.env.GEORISK_E2E_SHARD)) throw new Error("An explicit critical shard is required.");
await runCommand("critical browser shard " + process.env.GEORISK_E2E_SHARD, process.execPath,
  ["scripts/tests/critical-browser-e2e.test.js"], { timeoutMs: TOTAL_TEST_BUDGET_MS });
