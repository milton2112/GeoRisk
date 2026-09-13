import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { performanceEnvironment } from "./lib/browser-performance.js";

const baseline = process.argv.find(arg => arg.startsWith("--baseline="))?.slice("--baseline=".length);
if (!baseline) throw new Error("Pass --baseline=<local Cesium 1.127 index.js>. See TECHNICAL.md; no automatic downloads.");
const hash = value => createHash("sha256").update(value).digest("hex");
const baselineSha256 = hash(await fs.readFile(baseline));
if (baselineSha256 !== "4eee2ec98c0138f92e0d417c09c9db5f9120fdbc11e69a745739f30d2892771d") {
  throw new Error("Baseline is not the verified official Cesium 1.127 ESM distribution.");
}
const publicManifest = JSON.parse(await fs.readFile("dist/public/asset-manifest.json", "utf8"));
const candidate = "vendor/cesium/engine.js";
const candidateSha256 = hash(await fs.readFile(candidate));
if (publicManifest.assets.find(asset => asset.path === candidate)?.sha256 !== candidateSha256) {
  throw new Error("Build is stale. Run npm run build:prod before benchmarking.");
}
const report = {
  generatedAt: null,
  methodology: "Six sequential ABBAAB samples, fresh browser/context and disabled HTTP cache, CPU x4, mobile emulation, trace-only without CPU sampling. Both variants replace only the engine response on the same build. Largest main-thread module evaluation before readiness, not total startup, FPS, or a physical phone measurement. Instrumented timings are diagnostic; release budgets use performance-snapshot.json.",
  baselineSource: "https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/index.js",
  baselineSha256, candidateSha256,
  buildAssetsSha256: hash(JSON.stringify(publicManifest.assets)),
  profilerSha256: hash(await fs.readFile("scripts/profileStartup.js")),
  environment: performanceEnvironment(), samples: []
};
for (const variant of ["baseline", "candidate", "candidate", "baseline", "baseline", "candidate"]) {
  execFileSync(process.execPath, ["scripts/profileStartup.js", "--trace-only", "--observe-ms=1000", `--engine-bundle=${variant === "baseline" ? baseline : candidate}`], { stdio: "pipe", timeout: 90000 });
  const trace = JSON.parse(await fs.readFile("reports/startup-profile.json", "utf8"));
  const sample = {
    variant, measuredAt: trace.generatedAt, browserVersion: trace.browserVersion,
    profile: trace.profile, engine: trace.engineOverride,
    moduleEvaluationMs: Math.max(...trace.moduleEvaluations.filter(event => event.afterReadyMs < 0).map(event => event.durationMs)),
    maximumTaskMs: Math.max(...trace.work.filter(event => event.name === "RunTask").map(event => event.durationMs))
  };
  if (![sample.moduleEvaluationMs, sample.maximumTaskMs].every(Number.isFinite)) throw new Error("Incomplete trace sample.");
  report.samples.push(sample);
  console.log(JSON.stringify(sample));
}
const median = values => values.slice().sort((a, b) => a - b)[Math.floor(values.length / 2)];
report.medianModuleEvaluationMs = Object.fromEntries(["baseline", "candidate"].map(variant => [variant, median(report.samples.filter(sample => sample.variant === variant).map(sample => sample.moduleEvaluationMs))]));
report.generatedAt = new Date().toISOString();
await fs.writeFile("reports/startup-engine-benchmark.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report.medianModuleEvaluationMs));
