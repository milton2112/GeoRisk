import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { resolveNpmInvocation } from "./lib/npm-runner.js";
import { summarizeDependencyAudit } from "./lib/dependency-audit.js";

const report = {
  generatedAt: new Date().toISOString(),
  lockSha256: createHash("sha256").update(await fs.readFile("package-lock.json")).digest("hex"),
  includes: ["production", "development", "optional"],
  status: "error"
};
try {
  const { command, argsPrefix } = resolveNpmInvocation();
  Object.assign(report, summarizeDependencyAudit(spawnSync(command, [
    ...argsPrefix, "audit", "--json", "--include=dev", "--include=optional", "--audit-level=low"
  ], { encoding: "utf8", timeout: 120_000, maxBuffer: 8 * 1024 * 1024, windowsHide: true, shell: false })));
  console.log(`Dependency audit: ${report.status}, ${report.counts.total} vulnerable packages.`);
} catch (error) {
  report.error = error.message;
  console.error(report.error);
}
await fs.mkdir("reports", { recursive: true });
await fs.writeFile("reports/dependency-audit.json", JSON.stringify(report, null, 2) + "\n");
if (report.status !== "passed") process.exitCode = 1;
