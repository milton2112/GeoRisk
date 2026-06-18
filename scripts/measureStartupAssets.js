import fs from "fs-extra";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const reportPath = path.join(projectRoot, "reports", "startup-assets.json");

const LOCAL_ASSETS = [
  "index.html",
  "script.js",
  "style.css",
  "style-polish.css",
  "app-runtime.js",
  "app-theme.js",
  "app-text.js",
  "app-country-panel.js",
  "app-timeline-conflicts.js",
  "app-search.js",
  "app-rankings.js",
  "app-boot-scheduler.js",
  "app-map.js",
  "app-map-styles.js",
  "app-map-interactions.js",
  "app-news-ui.js",
  "app-compare-ui.js",
  "app-quiz-ui.js",
  "app-performance-ui.js",
  "app-ui-polish.js",
  "app-rankings-worker.js",
  "app-search-worker.js",
  "data/countries_index.json",
  "data/geo_aliases.json",
  "data/world_countries.geo.json",
  "data/world_countries_simplified.geo.json",
  "data/conflict_details.generated.json"
];

const CESIUM_ASSETS = [
  "https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/Cesium.js",
  "https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/Widgets/widgets.css"
];

function formatBytes(bytes) {
  if (bytes > 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (bytes > 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${bytes} B`;
}

async function readServiceWorkerShell() {
  const swPath = path.join(projectRoot, "sw.js");
  if (!(await fs.pathExists(swPath))) {
    return new Set();
  }

  const source = await fs.readFile(swPath, "utf8");
  const match = source.match(/const APP_SHELL = \[([\s\S]*?)\];/);
  if (!match) {
    return new Set();
  }

  return new Set(
    [...match[1].matchAll(/"([^"]+)"/g)]
      .map(item => item[1])
      .filter(resource => resource.startsWith("./"))
      .map(resource => resource.replace(/^\.\//, ""))
      .filter(resource => resource && resource !== "/")
  );
}

async function readInitialLocalScripts() {
  const htmlPath = path.join(projectRoot, "index.html");
  if (!(await fs.pathExists(htmlPath))) {
    return new Set();
  }

  const source = await fs.readFile(htmlPath, "utf8");
  return new Set(
    [...source.matchAll(/<script\s+src="([^"]+)"/g)]
      .map(match => match[1].split("?")[0])
      .filter(src => src && !/^https?:\/\//i.test(src))
  );
}

const appShell = await readServiceWorkerShell();
const initialLocalScripts = await readInitialLocalScripts();
const startupCriticalAssets = new Set([...appShell, ...initialLocalScripts]);
const localAssetPaths = [...new Set([...LOCAL_ASSETS, ...startupCriticalAssets])];
const assets = [];
for (const relativePath of localAssetPaths) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!(await fs.pathExists(absolutePath))) {
    assets.push({ path: relativePath, exists: false, bytes: 0, human: "faltante" });
    continue;
  }
  const stat = await fs.stat(absolutePath);
  assets.push({
    path: relativePath,
    exists: true,
    bytes: stat.size,
    human: formatBytes(stat.size),
    startupCritical: startupCriticalAssets.has(relativePath)
  });
}

const startupBytes = assets
  .filter(asset => asset.exists && asset.startupCritical)
  .reduce((sum, asset) => sum + asset.bytes, 0);
const deferredBytes = assets
  .filter(asset => asset.exists && !asset.startupCritical)
  .reduce((sum, asset) => sum + asset.bytes, 0);
const fullCountriesAsset = assets.find(asset => asset.path === "data/countries_full.json") ||
  (await fs.pathExists(path.join(projectRoot, "data/countries_full.json"))
    ? {
        path: "data/countries_full.json",
        bytes: (await fs.stat(path.join(projectRoot, "data/countries_full.json"))).size
      }
    : null);

const report = {
  generatedAt: new Date().toISOString(),
  startupBytes,
  startupHuman: formatBytes(startupBytes),
  deferredBytes,
  deferredHuman: formatBytes(deferredBytes),
  estimatedRuntimeMemory: {
    countriesFullBytes: fullCountriesAsset?.bytes || 0,
    countriesFullHuman: formatBytes(fullCountriesAsset?.bytes || 0),
    estimatedParsedBytes: (fullCountriesAsset?.bytes || 0) * 3,
    estimatedParsedHuman: formatBytes((fullCountriesAsset?.bytes || 0) * 3),
    note: "Estimacion conservadora: JSON parseado puede ocupar alrededor de 3x el tamano del archivo en memoria."
  },
  largestAssets: assets
    .filter(asset => asset.exists)
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 12),
  assets,
  externalRuntimeAssets: CESIUM_ASSETS.map(url => ({ url, measuredLocally: false, note: "Se descarga/cachea desde Cesium en runtime." }))
};

await fs.ensureDir(path.dirname(reportPath));
await fs.writeJson(reportPath, report, { spaces: 2 });

console.log(`Startup critico local: ${report.startupHuman}`);
console.log(`Diferido/local auxiliar: ${report.deferredHuman}`);
console.log(`Reporte: ${path.relative(projectRoot, reportPath)}`);
