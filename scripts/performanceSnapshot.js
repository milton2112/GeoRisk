import { execFileSync } from "node:child_process";
import fs from "fs-extra";
import path from "node:path";
import vm from "node:vm";
import { readFileWithRetry, statWithRetry, writeJsonWithRetry } from "./lib/resilient-fs.js";

const projectRoot = path.resolve(process.cwd());
const reportsDir = path.join(projectRoot, "reports");
const snapshotPath = path.join(reportsDir, "performance-snapshot.json");
const startupReportPath = path.join(reportsDir, "startup-assets.json");
const manifestPath = path.join(projectRoot, "dist", "public", "asset-manifest.json");

function formatBytes(bytes = 0) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

async function statAsset(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!(await fs.pathExists(absolutePath))) {
    return { path: relativePath, exists: false, bytes: 0, human: "faltante" };
  }
  const stat = await statWithRetry(absolutePath);
  return { path: relativePath, exists: true, bytes: stat.size, human: formatBytes(stat.size) };
}

function runNodeScript(relativePath) {
  execFileSync(process.execPath, [relativePath], {
    cwd: projectRoot,
    stdio: "inherit"
  });
}

async function ensureStartupReport() {
  if (!(await fs.pathExists(startupReportPath))) {
    runNodeScript("scripts/measureStartupAssets.js");
  }
  return fs.readJson(startupReportPath);
}

async function ensureBuildManifest() {
  if (!(await fs.pathExists(manifestPath))) {
    runNodeScript("scripts/buildProduction.js");
  }
  return fs.readJson(manifestPath);
}

async function simulateLongTasksAndFps() {
  const bootScheduler = await readFileWithRetry(path.join(projectRoot, "app-boot-scheduler.js"), "utf8");
  const context = {
    window: {},
    document: { visibilityState: "visible" },
    Date,
    setTimeout,
    PerformanceObserver: class {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {
        this.callback({
          getEntries: () => [
            { name: "simulated-startup-work", startTime: 12, duration: 240 },
            { name: "simulated-ui-hydration", startTime: 96, duration: 118 },
            { name: "simulated-map-style", startTime: 310, duration: 64 }
          ]
        });
      }
    }
  };

  vm.runInNewContext(bootScheduler, context);
  context.window.GeoRiskBootScheduler.startLongTaskObserver();
  context.window.GeoRiskBootScheduler.recordStartupFps(58, 1000);
  context.window.GeoRiskBootScheduler.recordStartupFps(46, 18000);
  context.window.GeoRiskBootScheduler.recordStartupFps(61, 42000);
  context.window.GeoRiskBootScheduler.recordStartupFps(54, 60000);

  return {
    longTasks: context.window.GeoRiskBootScheduler.longTaskMetrics,
    fpsSmoke: context.window.GeoRiskBootScheduler.startupFpsMetrics
  };
}

const packageJson = await fs.readJson(path.join(projectRoot, "package.json"));
const scriptSource = await readFileWithRetry(path.join(projectRoot, "script.js"), "utf8");
const swSource = await readFileWithRetry(path.join(projectRoot, "sw.js"), "utf8");
const startupReport = await ensureStartupReport();
const manifest = await ensureBuildManifest();
const scriptJs = await statAsset("script.js");
const countriesIndex = await statAsset("data/countries_index.json");
const { longTasks, fpsSmoke } = await simulateLongTasksAndFps();
const appVersion = scriptSource.match(/const APP_VERSION = "([^"]+)"/)?.[1] || null;
const cacheVersion = swSource.match(/const CACHE_VERSION = "([^"]+)"/)?.[1] || null;

const thresholds = {
  scriptJsBytes: 700000,
  countriesIndexBytes: 240000,
  startupCriticalBytes: 1024 * 1024,
  longTaskBudgetMs: longTasks.budgetMs || 200
};

const snapshot = {
  generatedAt: new Date().toISOString(),
  packageVersion: packageJson.version,
  appVersion,
  cacheVersion,
  thresholds,
  assets: {
    scriptJs,
    countriesIndex,
    startupCritical: {
      bytes: startupReport.startupBytes || 0,
      human: startupReport.startupHuman || formatBytes(startupReport.startupBytes || 0)
    },
    buildTotal: {
      bytes: manifest.totalBytes || 0,
      human: formatBytes(manifest.totalBytes || 0),
      assetCount: manifest.assetCount || 0
    }
  },
  longTasks,
  fpsSmoke,
  status: {
    scriptJsWithinBudget: scriptJs.bytes < thresholds.scriptJsBytes,
    countriesIndexWithinBudget: countriesIndex.bytes < thresholds.countriesIndexBytes,
    startupWithinBudget: (startupReport.startupBytes || 0) < thresholds.startupCriticalBytes,
    simulatedLongTasksOverBudget: longTasks.overBudgetCount,
    fpsSmokeMin: fpsSmoke.min
  }
};

await fs.ensureDir(reportsDir);
await writeJsonWithRetry(snapshotPath, snapshot, { spaces: 2 });

console.log(`Snapshot performance: ${path.relative(projectRoot, snapshotPath)}`);
console.log(`script.js: ${scriptJs.human}`);
console.log(`arranque critico: ${snapshot.assets.startupCritical.human}`);
console.log(`countries_index: ${countriesIndex.human}`);
console.log(`build total: ${snapshot.assets.buildTotal.human}`);
console.log(`long tasks simuladas: ${longTasks.count} (${longTasks.overBudgetCount} sobre presupuesto)`);
console.log(`FPS smoke: avg ${Math.round(fpsSmoke.avg || 0)}, min ${Math.round(fpsSmoke.min || 0)}`);
