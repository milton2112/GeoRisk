import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { runCommand } from "./lib/npm-runner.js";

const profile = process.env.GEORISK_DIAGNOSTIC_PROFILE || "mobile";
if (!["mobile", "desktop"].includes(profile)) throw new Error("Diagnostic profile must be mobile or desktop.");
const identity = { generatedAt: new Date().toISOString(), scope: "diagnostic", status: "running",
  revision: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  ciRunId: process.env.GITHUB_RUN_ID || null, ciRunAttempt: process.env.GITHUB_RUN_ATTEMPT || null, profile };
await fs.mkdir("reports", { recursive: true });
for (const file of ["startup-profile.json", "map-diagnostic-cpu.json"]) {
  await fs.writeFile(`reports/${file}`, JSON.stringify(identity, null, 2) + "\n");
}
try {
  await runCommand("bounded map diagnostic", process.execPath,
    ["scripts/profileStartup.js", "--bounded", "--active-map", ...(profile === "desktop" ? ["--desktop"] : [])],
    { timeoutMs: 90000 });
} catch (error) {
  await fs.writeFile("reports/startup-profile.json", JSON.stringify({ ...identity, status: "failed",
    finishedAt: new Date().toISOString(), error: error.message.slice(0, 2048) }, null, 2) + "\n");
  throw error;
}
