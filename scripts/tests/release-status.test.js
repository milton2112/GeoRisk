import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_FILES } from "../lib/public-assets.js";
import { getPerformanceInputHash, PERFORMANCE_INPUT_FILES } from "../lib/performance-inputs.js";
import { BROWSER_MEASUREMENT_SOURCE } from "../lib/performance-evidence.js";

const script = fileURLToPath(new URL("../releaseStatus.js", import.meta.url));
const root = await fs.mkdtemp(path.join(os.tmpdir(), "georisk-release-status-"));
async function write(file, value) {
  await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true });
  await fs.writeFile(path.join(root, file), typeof value === "string" ? value : JSON.stringify(value));
}
async function run(expectedCode) {
  const result = spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8", timeout: 30000 });
  assert.ifError(result.error);
  assert.equal(result.status, expectedCode, result.stdout + result.stderr);
  return JSON.parse(await fs.readFile(path.join(root, "reports/release-status.json"), "utf8"));
}
try {
  await write("package.json", { version: "0.0.1" });
  const report = await run(1);
  assert.ok(report.blockers.length > 0);
  assert.equal(report.checks.dataAuditClean, false, "sin auditoria no se pueden declarar datos limpios");
  assert.equal(report.checks.featureHealthClean, false, "sin reporte no se pueden declarar funciones operativas");
  assert.equal(report.checks.doctorHasNoHighSeverity, false, "sin doctor no se puede declarar ausencia de problemas graves");

  for (const file of new Set([...PUBLIC_FILES, ...PERFORMANCE_INPUT_FILES])) await write(file, "fixture");
  const version = "0.0.1";
  const stamp = "2026-09-25-release-test";
  await write("package.json", { version });
  await write("script.js", `const APP_VERSION = "${stamp}";`);
  await write("sw.js", `const CACHE_VERSION = "${stamp}";`);
  await write("index.html", `<script src="script.js?v=${stamp}"></script>`);
  await write("CHANGELOG.md", `## v${version}`);
  const checks = Object.fromEntries([
    "longTasksSupported", "fullWindowObserved", "noDroppedEntries", "activeSampleWithinWindow",
    "canvasRendered", "canvasChanged", "canvasVerificationOutsideWindow", "sceneModeMatches",
    "noPageErrors", "noMissingLocalResources", "noHeavyStartupRequests", "renderLoopHealthy"
  ].map(key => [key, true]));
  const performance = {
    packageVersion: version, appVersion: stamp, cacheVersion: stamp,
    performanceInputHash: await getPerformanceInputHash(root),
    assets: { startupCritical: { bytes: 800000 }, mapEngine: { bytes: 3000000 },
      appCoreAndEngine: { bytes: 3800000 }, scriptJs: { bytes: 600000 }, countriesIndex: { bytes: 200000 } },
    browserPerformance: { source: BROWSER_MEASUREMENT_SOURCE, complete: true,
      profiles: ["desktop", "mobile-emulated"].map(name => ({ name, status: "measured", observedWindowMs: 60000,
        longTasks: { count: 2, overBudgetCount: 1, longestDurationMs: 210 },
        activeRender: { frames: 180, durationMs: 6000, averageFps: 30, targetFps: 30 }, checks })) }
  };
  const data = { summary: Object.fromEntries([
    "englishConflictNames", "mojibakeText", "sourceTextMojibake", "sameCountryDuplicateConflicts",
    "redundantReligions", "uppercaseCities"
  ].map(key => [key, { count: 0 }])) };
  const doctor = { packageVersion: version, status: "operativo", summary: { totalFindings: 0, bySeverity: {} } };
  const features = { packageVersion: version, status: "operativo", summary: { totalFeatures: 10, failedFeatures: 0, failedChecks: 0 } };
  const reports = { "performance-snapshot": performance, "data-automation-audit": data, "doctor-report": doctor, "feature-health": features };
  const restoreReports = async () => {
    for (const [name, value] of Object.entries(reports)) await write(`reports/${name}.json`, value);
  };
  await restoreReports();
  const valid = await run(0);
  assert.deepEqual(valid.blockers, []);
  assert.equal(valid.checks.performanceInputsCurrent, true);
  assert.equal(valid.checks.reportVersionsCurrent, true);
  assert.ok(valid.warnings.some(warning => warning.includes("tareas >200 ms")), "advertencias de hardware no bloquean por si solas");
  await write("reports/doctor-report.json", { ...doctor, status: "observacion", summary: { totalFindings: 1, bySeverity: { media: 1 } } });
  await run(0);
  await restoreReports();
  await write("reports/performance-snapshot.json", { ...performance, browserPerformance: { ...performance.browserPerformance, profiles: {} } });
  assert.equal((await run(1)).checks.browserPerformanceMeasured, false);
  await restoreReports();

  for (const name of Object.keys(reports)) {
    for (const malformed of ["", "{broken", "null", "[]", "{}"]) {
      await write(`reports/${name}.json`, malformed);
      await run(1);
      await restoreReports();
    }
    await fs.unlink(path.join(root, `reports/${name}.json`));
    await run(1);
    await restoreReports();
  }
  for (const key of ["packageVersion", "appVersion", "cacheVersion"]) {
    await write("reports/performance-snapshot.json", { ...performance, [key]: "old-version" });
    assert.equal((await run(1)).checks.reportVersionsCurrent, false, `version antigua: ${key}`);
  }
  await restoreReports();
  for (const name of ["doctor-report", "feature-health"]) {
    await write(`reports/${name}.json`, { ...reports[name], packageVersion: "old-version" });
    assert.equal((await run(1)).checks.reportVersionsCurrent, false);
    await restoreReports();
  }
  for (const performanceInputHash of [undefined, "outdated-hash"]) {
    await write("reports/performance-snapshot.json", { ...performance, performanceInputHash });
    assert.equal((await run(1)).checks.performanceInputsCurrent, false);
  }
  await restoreReports();
  for (const file of ["app-map.js", "style.css", "data/countries_index.json", "scripts/lib/browser-performance.js", "package-lock.json"]) {
    await write(file, "changed"); // Same byte count: size/mtime alone cannot identify the measured sources.
    const stale = await run(1);
    assert.equal(stale.checks.performanceInputsCurrent, false, file);
    assert.ok(!stale.warnings.some(warning => warning.includes("tareas >200 ms")), "no presentar metricas antiguas como actuales");
    await write(file, "fixture");
  }
  await write("data/countries/NEW.json", "new country");
  assert.equal((await run(1)).checks.performanceInputsCurrent, false, "un asset nuevo invalida la medicion");
  await fs.unlink(path.join(root, "data/countries/NEW.json"));
  await fs.unlink(path.join(root, "app-map.js"));
  assert.ok((await run(1)).performanceEvidence.inputError, "un archivo ausente produce diagnostico, no un falso verde");
  await write("app-map.js", "fixture");
  assert.equal(await getPerformanceInputHash(root), performance.performanceInputHash, "reportes y dist no alteran la huella de fuentes");
  await write("dist/public/asset-manifest.json", "stale manifest");
  await run(0);

  const highSeverity = { ...doctor, status: "requiere_atencion", summary: { totalFindings: 1, bySeverity: { alta: 1 } } };
  await write("reports/doctor-report.json", highSeverity);
  assert.equal((await run(1)).checks.doctorHasNoHighSeverity, false);
  await restoreReports();
  await write("reports/data-automation-audit.json", { summary: { ...data.summary, redundantReligions: { count: 1 } } });
  assert.equal((await run(1)).checks.dataAuditClean, false);
  await restoreReports();
  await write("reports/feature-health.json", { ...features, summary: { ...features.summary, failedChecks: 1 } });
  assert.equal((await run(1)).checks.featureHealthClean, false);
} finally {
  await fs.rm(root, { recursive: true, force: true });
}
console.log("release-status.test.js ok");
