import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { performanceEnvironment } from "./lib/browser-performance.js";

const ref = process.argv.find(arg => arg.startsWith("--baseline="))?.slice("--baseline=".length);
if (!ref) throw new Error("Pass --baseline=<commit> after npm run build:prod.");
const baselineRef = execFileSync("git", ["rev-parse", "--verify", "--end-of-options", `${ref}^{commit}`], { encoding: "utf8" }).trim();
const hash = value => createHash("sha256").update(value).digest("hex");
const baselineSha256 = hash(execFileSync("git", ["show", `${baselineRef}:style.css`]));
const candidateSha256 = hash(await fs.readFile("style.css"));
const manifest = JSON.parse(await fs.readFile("dist/public/asset-manifest.json", "utf8"));
if (manifest.assets.find(asset => asset.path === "style.css")?.sha256 !== candidateSha256) {
  throw new Error("Build is stale. Run npm run build:prod before benchmarking.");
}
const report = {
  generatedAt: null,
  methodology: "Six sequential ABBAAB samples, fresh browser/context, disabled HTTP cache, CPU x4 and mobile emulation. Observe 35 seconds after map readiness with trace-only (no CPU sampling or DOM observer). Only style.css changes; JavaScript and all other build assets are identical. Post-ready layout is diagnostic, not total startup, FPS or a physical phone measurement. Run without competing browser tests. Release budgets use the separate 60-second snapshot.",
  baselineRef, baselineSha256, candidateSha256,
  buildAssetsSha256: hash(JSON.stringify(manifest.assets)),
  profilerSha256: hash(await fs.readFile("scripts/profileStartup.js")),
  environment: performanceEnvironment(), samples: []
};
for (const variant of ["baseline", "candidate", "candidate", "baseline", "baseline", "candidate"]) {
  const args = ["scripts/profileStartup.js", "--trace-only", "--observe-ms=35000"];
  if (variant === "baseline") args.push(`--baseline-style=${baselineRef}`);
  execFileSync(process.execPath, args, { stdio: "pipe", timeout: 120000 });
  const trace = JSON.parse(await fs.readFile("reports/startup-profile.json", "utf8"));
  if (trace.baselineStyleRef !== (variant === "baseline" ? baselineRef : null) ||
      !Number.isFinite(trace.layout.afterReady.maximumMs) ||
      (variant === "baseline" && trace.layout.afterReady.count < 1)) {
    throw new Error("Incomplete or mismatched layout sample.");
  }
  const sample = {
    variant, measuredAt: trace.generatedAt, browserVersion: trace.browserVersion,
    profile: trace.profile, runtime: trace.runtime, layout: trace.layout,
    observedLongTasks: trace.work.filter(event => event.name === "RunTask" && event.afterReadyMs >= 0)
      .map(({ durationMs, afterReadyMs }) => ({ durationMs, afterReadyMs }))
  };
  report.samples.push(sample);
  console.log(JSON.stringify(sample));
  // Preserve completed samples if a later browser run is interrupted.
  await fs.writeFile("reports/closed-panels-benchmark.json", JSON.stringify(report, null, 2) + "\n");
}
const median = values => values.slice().sort((a, b) => a - b)[Math.floor(values.length / 2)];
report.medianPostReadyLayoutMs = Object.fromEntries(["baseline", "candidate"].map(variant => [variant,
  median(report.samples.filter(sample => sample.variant === variant).map(sample => sample.layout.afterReady.maximumMs))
]));
report.generatedAt = new Date().toISOString();
await fs.writeFile("reports/closed-panels-benchmark.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report.medianPostReadyLayoutMs));
