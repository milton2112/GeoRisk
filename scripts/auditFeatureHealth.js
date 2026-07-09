import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const reportsDir = path.join(projectRoot, "reports");
const reportPath = path.join(reportsDir, "feature-health.json");

async function readText(relativePath, fallback = "") {
  try {
    return await fs.readFile(path.join(projectRoot, relativePath), "utf8");
  } catch {
    return fallback;
  }
}

async function readJson(relativePath, fallback = {}) {
  try {
    return JSON.parse(await readText(relativePath));
  } catch {
    return fallback;
  }
}

async function exists(relativePath) {
  try {
    await fs.access(path.join(projectRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

function hasToken(source, token) {
  return source.includes(token);
}

function check(ok, type, target, detail, action = null) {
  return { ok: Boolean(ok), type, target, detail, action };
}

const [packageJson, indexHtml, scriptSource] = await Promise.all([
  readJson("package.json"),
  readText("index.html"),
  readText("script.js")
]);

const scripts = packageJson.scripts || {};
const sourceCache = new Map([
  ["index.html", indexHtml],
  ["script.js", scriptSource]
]);

async function readCached(relativePath) {
  if (!sourceCache.has(relativePath)) {
    sourceCache.set(relativePath, await readText(relativePath));
  }
  return sourceCache.get(relativePath);
}

const features = [
  {
    key: "map",
    label: "Mapa 2D/3D",
    files: ["app-map.js", "app-map-styles.js", "app-map-interactions.js"],
    runtimeTokens: ["ensureCountryLayersReady", "selectCountryLayersWhenReady", "scheduleDetailedOverlayUpgrade"],
    htmlTokens: ['id="map"', 'id="theme-select"', 'id="quality-preset-select"'],
    testScripts: ["test:map-coverage", "test:country-matching", "test:critical-flows"],
    dataFiles: ["data/world_countries_simplified.geo.json"]
  },
  {
    key: "country_profile",
    label: "Ficha pais",
    files: ["app-country-panel.js"],
    moduleTokens: { "app-country-panel.js": ["GeoRiskCountryPanel", "renderSkeleton", "buildExecutiveSummary"] },
    runtimeTokens: ["openCountryByCode", "openCountryModal", "loadCountryDetail"],
    htmlTokens: ['id="country-modal"', 'id="toggle-country-panel"'],
    testScripts: ["test:modal-render", "test:startup", "test:critical-flows"]
  },
  {
    key: "search",
    label: "Busqueda",
    files: ["app-search.js", "app-search-worker.js"],
    moduleTokens: { "app-search.js": ["GeoRiskSearch", "parseNaturalQuery", "groupSuggestions"] },
    runtimeTokens: ['ensureDeferredUiModule("search")', "openCountryByCode(countryCode"],
    htmlTokens: ['id="map-search-input"', 'id="search-suggestions"', 'id="search-memory"'],
    testScripts: ["test:search", "test:startup", "test:critical-flows"],
    dataFiles: ["data/search_index.json"]
  },
  {
    key: "rankings",
    label: "Rankings y radar",
    files: ["app-rankings.js", "app-rankings-worker.js", "app-risk-radar-ui.js"],
    moduleTokens: { "app-rankings.js": ["GeoRiskRankings", "getRiskComponents", "proxyFields"] },
    runtimeTokens: ["setupRankingsPanel", "selectRankedCountry", "getCachedRanking", "isRankingsPanelOpen"],
    htmlTokens: ['id="rankings-panel"', 'id="open-risk-radar-button"'],
    testScripts: ["test:rankings", "test:visual-hygiene", "test:startup", "test:critical-flows"]
  },
  {
    key: "timeline_conflicts",
    label: "Timeline y conflictos",
    files: ["app-timeline-conflicts.js"],
    moduleTokens: { "app-timeline-conflicts.js": ["GeoRiskTimelineConflicts", "filterTimelineEvents", "groupRepeatedEvents"] },
    runtimeTokens: ["openTimelineModal", "maybeEnhanceOpenConflictModal"],
    htmlTokens: ['id="timeline-modal"', 'id="conflict-modal"'],
    testScripts: ["test:conflicts", "test:conflict-audit", "test:startup"],
    dataFiles: ["data/timeline_index.json", "data/conflicts_index.json", "data/conflicts/details_index.json"]
  },
  {
    key: "compare",
    label: "Comparador",
    files: ["app-compare-ui.js"],
    moduleTokens: { "app-compare-ui.js": ["GeoRiskCompareUI", "buildComparisonModel", "buildProfessionalSections"] },
    runtimeTokens: ["setupCompareControls", "addCountryToCompare", "renderComparePanel"],
    htmlTokens: ['id="compare-hub-panel"', 'id="compare-modal"', 'id="compare-country-search"'],
    testScripts: ["test:compare-quiz"]
  },
  {
    key: "quiz",
    label: "Quiz",
    files: ["app-quiz-ui.js"],
    moduleTokens: { "app-quiz-ui.js": ["GeoRiskQuizUI", "buildQuestionBank", "buildQuestionFromBank"] },
    runtimeTokens: ["setupQuizControls", "buildQuizQuestion", "quizUi.buildQuestionBank"],
    htmlTokens: ['id="quiz-hub-panel"', 'id="quiz-start-button"'],
    testScripts: ["test:compare-quiz"]
  },
  {
    key: "news",
    label: "Noticias",
    files: ["app-news-ui.js"],
    moduleTokens: { "app-news-ui.js": ["GeoRiskNewsUI", "buildNewsList", "buildArticleCard"] },
    runtimeTokens: ['ensureDeferredUiModule("news")', "setupNewsHubPanel", "getCountryNewsUrl"],
    htmlTokens: ['id="news-hub-panel"', 'id="news-topic-select"'],
    testScripts: ["test:news"]
  },
  {
    key: "exports_share",
    label: "Exportar y compartir",
    files: ["app-export-share.js"],
    moduleTokens: { "app-export-share.js": ["GeoRiskExportShare", "exportNodeAsImage", "exportNodeAsPdf", "shareText"] },
    runtimeTokens: ['ensureDeferredUiModule("exportShare")', "ensureExportLibraries", "exportNodeAsImage", "exportNodeAsPdf", "shareText"],
    htmlTokens: ["data-export-target", "data-share-target"],
    testScripts: ["test:release-gates"]
  },
  {
    key: "offline",
    label: "Offline/cache",
    files: ["sw.js"],
    moduleTokens: { "sw.js": ["APP_SHELL", "HEAVY_RUNTIME_PATHS", "RUNTIME_CACHEABLE_PATHS"] },
    htmlTokens: ['id="clear-local-cache-button"', 'id="offline-cache-size"', 'id="offline-status"'],
    testScripts: ["test:startup", "test:release-gates"]
  }
];

const featureReports = [];

for (const feature of features) {
  const checks = [];

  for (const file of feature.files || []) {
    checks.push(check(await exists(file), "file", file, `${file} debe existir para ${feature.label}.`));
  }

  for (const [file, tokens] of Object.entries(feature.moduleTokens || {})) {
    const source = await readCached(file);
    for (const token of tokens) {
      checks.push(check(hasToken(source, token), "module-token", `${file}:${token}`, `${feature.label} debe exponer ${token}.`));
    }
  }

  for (const token of feature.runtimeTokens || []) {
    checks.push(check(hasToken(scriptSource, token), "runtime-token", token, `${feature.label} debe estar conectado en runtime.`));
  }

  for (const token of feature.htmlTokens || []) {
    checks.push(check(hasToken(indexHtml, token), "html-token", token, `${feature.label} debe tener contrato HTML visible.`));
  }

  for (const scriptName of feature.testScripts || []) {
    checks.push(check(Boolean(scripts[scriptName]), "test-script", scriptName, `${feature.label} debe tener ${scriptName}.`));
  }

  for (const dataFile of feature.dataFiles || []) {
    checks.push(check(await exists(dataFile), "data-file", dataFile, `${feature.label} necesita ${dataFile}.`));
  }

  const failed = checks.filter(item => !item.ok);
  featureReports.push({
    key: feature.key,
    label: feature.label,
    status: failed.length ? "requiere_atencion" : "operativo",
    summary: {
      totalChecks: checks.length,
      failedChecks: failed.length
    },
    checks
  });
}

const failedFeatures = featureReports.filter(feature => feature.status !== "operativo");
const report = {
  generatedAt: new Date().toISOString(),
  packageVersion: packageJson.version || null,
  status: failedFeatures.length ? "requiere_atencion" : "operativo",
  summary: {
    totalFeatures: featureReports.length,
    healthyFeatures: featureReports.length - failedFeatures.length,
    failedFeatures: failedFeatures.length,
    failedChecks: featureReports.reduce((sum, feature) => sum + feature.summary.failedChecks, 0)
  },
  features: featureReports,
  actions: failedFeatures.flatMap(feature =>
    feature.checks
      .filter(item => !item.ok)
      .map(item => ({
        feature: feature.key,
        type: item.type,
        target: item.target,
        detail: item.detail,
        action: item.action
      }))
  )
};

await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Auditoria de salud funcional: ${path.relative(projectRoot, reportPath)}`);
console.log(`Estado: ${report.status}`);
console.log(`Funciones: ${report.summary.healthyFeatures}/${report.summary.totalFeatures} operativas`);
console.log(`Checks fallidos: ${report.summary.failedChecks}`);

if (failedFeatures.length) {
  process.exitCode = 1;
}
