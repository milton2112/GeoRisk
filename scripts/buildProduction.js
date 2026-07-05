import crypto from "node:crypto";
import fs from "fs-extra";
import path from "node:path";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "dist", "public");

const PUBLIC_FILES = [
  "index.html",
  "style.css",
  "style-polish.css",
  "script.js",
  "sw.js",
  "favicon.ico",
  "favicon.svg",
  "app-runtime.js",
  "app-theme.js",
  "app-text.js",
  "app-country-panel.js",
  "app-timeline-conflicts.js",
  "app-search.js",
  "app-search-worker.js",
  "app-rankings.js",
  "app-rankings-worker.js",
  "app-boot-scheduler.js",
  "app-map.js",
  "app-map-styles.js",
  "app-map-interactions.js",
  "app-store.js",
  "app-ui-polish.js",
  "app-export-share.js",
  "app-news-ui.js",
  "app-compare-ui.js",
  "app-quiz-ui.js",
  "app-performance-ui.js",
  "app-risk-radar-ui.js",
  "app-conflict-audit-ui.js",
  "app-project-audit-ui.js",
  "app-curation.js",
  "CHANGELOG.md",
  "USER_GUIDE.md",
  "TECHNICAL.md",
  "BACKEND_PLAN.md",
  "data/countries_index.json",
  "data/geo_aliases.json",
  "data/conflicts_index.json",
  "data/timeline_index.json",
  "data/search_index.json",
  "data/country_weights.json",
  "data/data_manifest.json",
  "data/world_countries.geo.json",
  "data/world_countries_simplified.geo.json"
];

const PUBLIC_DIRS = [
  "assets",
  "data/countries",
  "data/conflicts"
];

const FORBIDDEN_OUTPUT_PREFIXES = [
  "reports/",
  "scripts/",
  ".git/",
  "node_modules/",
  "dist/"
];

const FORBIDDEN_OUTPUT_FILES = new Set([
  "ARCHITECTURE.md",
  "CONTRIBUTING_INTERNAL.md",
  "DATA_SOURCES.md",
  "README.md",
  "ROADMAP.md",
  "RELEASE_NOTES_v1.4.0.md"
]);

function normalize(relativePath) {
  return relativePath.replace(/\\/g, "/");
}

async function copyFile(relativePath) {
  const source = path.join(projectRoot, relativePath);
  if (!(await fs.pathExists(source))) {
    throw new Error(`Falta archivo publico: ${relativePath}`);
  }
  await fs.copy(source, path.join(outputRoot, relativePath));
}

async function listFiles(root) {
  const result = [];
  async function walk(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else {
        result.push(normalize(path.relative(root, absolute)));
      }
    }
  }
  await walk(root);
  return result.sort((a, b) => a.localeCompare(b));
}

async function createManifest() {
  const files = await listFiles(outputRoot);
  const assets = [];
  for (const file of files) {
    const absolute = path.join(outputRoot, file);
    const buffer = await fs.readFile(absolute);
    assets.push({
      path: file,
      bytes: buffer.length,
      sha256: crypto.createHash("sha256").update(buffer).digest("hex")
    });
  }
  const manifest = {
    generatedAt: new Date().toISOString(),
    assetCount: assets.length,
    totalBytes: assets.reduce((sum, asset) => sum + asset.bytes, 0),
    excludes: {
      prefixes: FORBIDDEN_OUTPUT_PREFIXES,
      files: [...FORBIDDEN_OUTPUT_FILES].sort()
    },
    assets
  };
  await fs.writeJson(path.join(outputRoot, "asset-manifest.json"), manifest, { spaces: 2 });
  return manifest;
}

function assertPublicOutput(manifest) {
  const offenders = manifest.assets
    .map(asset => asset.path)
    .filter(file =>
      FORBIDDEN_OUTPUT_PREFIXES.some(prefix => file.startsWith(prefix)) ||
      FORBIDDEN_OUTPUT_FILES.has(file)
    );
  if (offenders.length) {
    throw new Error(`Build publico contiene archivos internos: ${offenders.join(", ")}`);
  }
}

await fs.remove(outputRoot);
await fs.ensureDir(outputRoot);

for (const file of PUBLIC_FILES) {
  await copyFile(file);
}

for (const directory of PUBLIC_DIRS) {
  const source = path.join(projectRoot, directory);
  if (await fs.pathExists(source)) {
    await fs.copy(source, path.join(outputRoot, directory));
  }
}

const manifest = await createManifest();
assertPublicOutput(manifest);

console.log(`Build produccion: ${path.relative(projectRoot, outputRoot)}`);
console.log(`Assets: ${manifest.assetCount}`);
console.log(`Total: ${manifest.totalBytes} bytes`);
