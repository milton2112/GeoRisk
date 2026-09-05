import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "fs-extra";
import path from "node:path";
import { readFileWithRetry, statWithRetry, writeJsonWithRetry } from "./lib/resilient-fs.js";
import { measureBrowserPerformance, performanceEnvironment } from "./lib/browser-performance.js";
import { canReuseBrowserMeasurement, hasCompleteBrowserMeasurement, browserPerformanceWarnings } from "./lib/performance-evidence.js";

const projectRoot = path.resolve(process.cwd());
const reportsDir = path.join(projectRoot, "reports");
const snapshotPath = path.join(reportsDir, "performance-snapshot.json");
const publicRoot = path.join(projectRoot, "dist", "public");

function formatBytes(bytes = 0) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

async function statAsset(relativePath) {
  const stat = await statWithRetry(path.join(projectRoot, relativePath));
  return { path: relativePath, exists: true, bytes: stat.size, human: formatBytes(stat.size) };
}

function runNodeScript(relativePath) {
  execFileSync(process.execPath, [relativePath], { cwd: projectRoot, stdio: "inherit" });
}

// Rebuild before fingerprinting: an existing manifest can describe stale files.
runNodeScript("scripts/measureStartupAssets.js");
runNodeScript("scripts/buildProduction.js");
const packageJson = await fs.readJson(path.join(projectRoot, "package.json"));
const scriptSource = await readFileWithRetry(path.join(projectRoot, "script.js"), "utf8");
const swSource = await readFileWithRetry(path.join(projectRoot, "sw.js"), "utf8");
const startupReport = await fs.readJson(path.join(reportsDir, "startup-assets.json"));
const manifest = await fs.readJson(path.join(publicRoot, "asset-manifest.json"));
const scriptJs = await statAsset("script.js");
const countriesIndex = await statAsset("data/countries_index.json");
const appVersion = scriptSource.match(/const APP_VERSION = "([^"]+)"/)?.[1] || null;
const cacheVersion = swSource.match(/const CACHE_VERSION = "([^"]+)"/)?.[1] || null;
const measurementHash = createHash("sha256");
measurementHash.update(JSON.stringify({
  assets: manifest.assets, packageVersion: packageJson.version,
  environment: performanceEnvironment()
}));
for (const file of ["scripts/lib/browser-performance.js", "scripts/lib/performance-metrics.js", "scripts/lib/performance-evidence.js", "scripts/localSmokeServer.js", "scripts/performanceSnapshot.js"]) {
  measurementHash.update(await readFileWithRetry(path.join(projectRoot, file), "utf8"));
}
const browserMeasurementKey = measurementHash.digest("hex");
const previous = await fs.readJson(snapshotPath).catch(() => null);
const reuse = process.argv.includes("--reuse-browser") && !process.argv.includes("--fresh") &&
  canReuseBrowserMeasurement(previous, browserMeasurementKey);
let browserPerformance;
if (reuse) {
  browserPerformance = previous.browserPerformance;
  console.log(`Reutilizando medicion real de ${browserPerformance.measuredAt}: mismo build, medidor y equipo (maximo 6 h).`);
} else {
  try {
    browserPerformance = await measureBrowserPerformance(publicRoot);
  } catch (error) {
    browserPerformance = { complete: false, error: error.message, profiles: [] };
  }
}
const thresholds = { scriptJsBytes: 700000, countriesIndexBytes: 240000, startupCriticalBytes: 1024 * 1024, longTaskBudgetMs: 200 };
const snapshot = {
  generatedAt: new Date().toISOString(),
  packageVersion: packageJson.version,
  appVersion,
  cacheVersion,
  thresholds,
  assets: {
    scriptJs,
    countriesIndex,
    startupCritical: { bytes: startupReport.startupBytes, human: formatBytes(startupReport.startupBytes) },
    buildTotal: { bytes: manifest.totalBytes, human: formatBytes(manifest.totalBytes), assetCount: manifest.assetCount }
  },
  browserMeasurementKey,
  browserMeasurementReused: reuse,
  browserPerformance,
  warnings: browserPerformanceWarnings(browserPerformance),
  status: {
    scriptJsWithinBudget: scriptJs.bytes < thresholds.scriptJsBytes,
    countriesIndexWithinBudget: countriesIndex.bytes < thresholds.countriesIndexBytes,
    startupWithinBudget: startupReport.startupBytes < thresholds.startupCriticalBytes,
    browserMeasurementComplete: hasCompleteBrowserMeasurement(browserPerformance)
  }
};
await fs.ensureDir(reportsDir);
await writeJsonWithRetry(snapshotPath, snapshot, { spaces: 2 });
console.log(`Snapshot performance: ${path.relative(projectRoot, snapshotPath)}`);
console.log(`script.js: ${scriptJs.human}; arranque: ${snapshot.assets.startupCritical.human}; countries_index: ${countriesIndex.human}; build: ${snapshot.assets.buildTotal.human}`);
for (const warning of snapshot.warnings) console.warn(warning);
if (!Object.values(snapshot.status).every(Boolean)) {
  console.error("Snapshot incompleto o fuera de presupuesto. Revisar status y browserPerformance en el reporte.");
  process.exitCode = 1;
}
