import fs from "fs-extra";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const reportPath = path.join(projectRoot, "reports", "startup-assets.json");

const LOCAL_ASSETS = [
  "index.html",
  "script.js",
  "style.css",
  "app-runtime.js",
  "app-theme.js",
  "app-text.js",
  "app-country-panel.js",
  "app-timeline-conflicts.js",
  "app-news-ui.js",
  "app-compare-ui.js",
  "app-quiz-ui.js",
  "app-performance-ui.js",
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

const assets = [];
for (const relativePath of LOCAL_ASSETS) {
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
    startupCritical: [
      "index.html",
      "script.js",
      "style.css",
      "app-runtime.js",
      "app-theme.js",
      "app-text.js",
      "app-country-panel.js",
      "app-timeline-conflicts.js",
      "data/countries_index.json",
      "data/geo_aliases.json",
      "data/countries_index.json"
    ].includes(relativePath)
  });
}

const startupBytes = assets
  .filter(asset => asset.exists && asset.startupCritical)
  .reduce((sum, asset) => sum + asset.bytes, 0);
const deferredBytes = assets
  .filter(asset => asset.exists && !asset.startupCritical)
  .reduce((sum, asset) => sum + asset.bytes, 0);

const report = {
  generatedAt: new Date().toISOString(),
  startupBytes,
  startupHuman: formatBytes(startupBytes),
  deferredBytes,
  deferredHuman: formatBytes(deferredBytes),
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
