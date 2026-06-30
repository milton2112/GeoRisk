import fs from "fs-extra";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const reportsDir = path.join(projectRoot, "reports");
const reportPath = path.join(reportsDir, "project-audit.json");

const SOURCE_FILES = [
  "index.html",
  "script.js",
  "style.css",
  "style-polish.css",
  "app-runtime.js",
  "app-boot-scheduler.js",
  "app-map.js",
  "app-map-styles.js",
  "app-map-interactions.js",
  "app-text.js",
  "app-risk-radar-ui.js",
  "app-conflict-audit-ui.js",
  "app-project-audit-ui.js",
  "app-news-ui.js",
  "app-compare-ui.js",
  "app-quiz-ui.js",
  "app-performance-ui.js",
  "app-ui-polish.js",
  "app-rankings-worker.js",
  "app-search-worker.js",
  "package.json",
  "CHANGELOG.md",
  "TECHNICAL.md",
  "USER_GUIDE.md"
];

function formatBytes(bytes = 0) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${bytes} B`;
}

async function readJsonSafe(relativePath, fallback = null) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!(await fs.pathExists(absolutePath))) {
    return fallback;
  }
  return fs.readJson(absolutePath).catch(() => fallback);
}

async function getFileInfo(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!(await fs.pathExists(absolutePath))) {
    return { path: relativePath, exists: false, bytes: 0, human: "faltante" };
  }
  const stat = await fs.stat(absolutePath);
  return { path: relativePath, exists: true, bytes: stat.size, human: formatBytes(stat.size) };
}

async function countTextMatches(relativePath, patterns) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!(await fs.pathExists(absolutePath))) {
    return {};
  }
  const text = await fs.readFile(absolutePath, "utf8");
  return Object.fromEntries(
    Object.entries(patterns).map(([key, pattern]) => [key, (text.match(pattern) || []).length])
  );
}

const startup = await readJsonSafe("reports/startup-assets.json", {});
const conflictAudit = await readJsonSafe("reports/conflict-audit.json", {});
const countryWeights = await readJsonSafe("data/country_weights.json", {});
const dataManifest = await readJsonSafe("data/data_manifest.json", {});
const dataCurationAudit = await readJsonSafe("reports/data-curation-audit.json", {});
const countriesFull = await readJsonSafe("data/countries_full.json", {});
const generatedConflictDetails = await readJsonSafe("data/conflict_details.generated.json", {});
const sourceFiles = await Promise.all(SOURCE_FILES.map(getFileInfo));
const dataIndexFiles = await Promise.all([
  "data/countries_index.json",
  "data/conflicts_index.json",
  "data/timeline_index.json",
  "data/search_index.json",
  "data/country_weights.json",
  "data/conflicts/details_index.json"
].map(getFileInfo));
const packageJson = await readJsonSafe("package.json", {});
const scriptMetrics = await countTextMatches("script.js", {
  functions: /function\s+[a-zA-Z0-9_]+/g,
  asyncFunctions: /async function\s+[a-zA-Z0-9_]+/g,
  consoleWarnings: /console\.warn/g,
  consoleErrors: /console\.error/g
});
const visualMetrics = Object.fromEntries(
  await Promise.all(
    ["index.html", "style.css", "app-risk-radar-ui.js", "app-conflict-audit-ui.js", "app-project-audit-ui.js"].map(async file => [
      file,
      await countTextMatches(file, {
        bootChips: /boot-(?:floating|profile)-chip/g,
        mojibakeHints: /Ãƒ|Ã‚|Â¿|Â¡|â–|�/g
      })
    ])
  )
);

const criticalIssues = [];
const warnings = [];
const nextActions = [];
const currentYear = new Date().getFullYear();

function collectConflictDataConsistency(countries = {}, details = {}) {
  const rows = [];
  const add = (scope, country, conflict = {}) => {
    if (!conflict || typeof conflict !== "object") return;
    rows.push({
      scope,
      country,
      name: conflict.name,
      startYear: conflict.startYear,
      endYear: conflict.endYear,
      ongoing: conflict.ongoing,
      active: conflict.active,
      status: conflict.status,
      region: conflict.normalizedRegion || conflict.region,
      cause: conflict.cause,
      outcome: conflict.outcome
    });
  };

  for (const [code, country] of Object.entries(countries || {})) {
    for (const conflict of country.military?.conflicts || []) {
      add("country", code, conflict);
    }
  }

  for (const [name, detail] of Object.entries(details.conflicts || {})) {
    add("detail", "DETAIL", { name, ...detail });
  }

  const closedMarkedActive = rows.filter(row =>
    Number.isFinite(row.endYear) &&
    row.endYear < currentYear &&
    (row.ongoing === true || row.active === true || String(row.status).toLowerCase() === "activo")
  );
  const inactiveMarkedActive = rows.filter(row =>
    row.ongoing === false && (row.active === true || String(row.status).toLowerCase() === "activo")
  );
  const nullNarrativeText = rows.filter(row =>
    ["cause", "outcome"].some(field => String(row[field] || "").trim().toLowerCase() === "null")
  );
  const suspectRegions = rows.filter(row =>
    /Afganist|Irak|Estado Isl|Siria|Kivu|Kosovo|Vietnam|Corea/i.test(row.name || "") &&
    /Oceania|America del Sur|Europa occidental|Africa occidental/i.test(row.region || "")
  );

  return {
    checked: rows.length,
    closedMarkedActiveCount: closedMarkedActive.length,
    inactiveMarkedActiveCount: inactiveMarkedActive.length,
    nullNarrativeTextCount: nullNarrativeText.length,
    suspectRegionCount: suspectRegions.length,
    samples: {
      closedMarkedActive: closedMarkedActive.slice(0, 10),
      inactiveMarkedActive: inactiveMarkedActive.slice(0, 10),
      nullNarrativeText: nullNarrativeText.slice(0, 10),
      suspectRegions: suspectRegions.slice(0, 10)
    }
  };
}

const conflictDataConsistency = collectConflictDataConsistency(countriesFull, generatedConflictDetails);
const conflictEraBuckets = [
  { label: "Antes de 1850", min: -Infinity, max: 1849 },
  { label: "1850-1899", min: 1850, max: 1899 },
  { label: "1900-1918", min: 1900, max: 1918 },
  { label: "1919-1945", min: 1919, max: 1945 },
  { label: "Pos-1945", min: 1946, max: Infinity }
].map(bucket => ({
  label: bucket.label,
  count: (conflictAudit.topIssues || []).filter(issue => {
    const year = Number(issue.startYear);
    return Number.isFinite(year) && year >= bucket.min && year <= bucket.max;
  }).length
})).filter(bucket => bucket.count > 0);

if ((startup.startupBytes || 0) > 1024 * 1024) {
  criticalIssues.push("El arranque critico supera 1 MB.");
  nextActions.push("Seguir sacando logica de script.js y compactar mas data/countries_index.json.");
} else {
  nextActions.push("Mantener el arranque critico por debajo de 1 MB en cada release.");
}

if ((sourceFiles.find(file => file.path === "script.js")?.bytes || 0) > 600 * 1024) {
  warnings.push("script.js sigue siendo el mayor bloque de mantenimiento.");
  nextActions.push("Extraer mas render de ficha, comparador, quiz y auditorias a modulos diferidos.");
}

if ((conflictAudit.issueCount || 0) > 0) {
  warnings.push(`La auditoria de conflictos conserva ${conflictAudit.issueCount} alertas.`);
  nextActions.push("Limpiar conflictos por tandas desde reports/conflict-audit.json.");
}

if (
  conflictDataConsistency.closedMarkedActiveCount ||
  conflictDataConsistency.inactiveMarkedActiveCount ||
  conflictDataConsistency.nullNarrativeTextCount ||
  conflictDataConsistency.suspectRegionCount
) {
  warnings.push("La consistencia semantica de conflictos conserva estados, textos o regiones sospechosas.");
  nextActions.push("Ejecutar npm run build:data y revisar report.data.conflictDataConsistency.");
}

if ((countryWeights.summary?.tooLargeCount || 0) > 0) {
  warnings.push(`${countryWeights.summary.tooLargeCount} fichas de pais superan el umbral de peso.`);
  nextActions.push("Dividir fichas grandes por seccion, empezando por conflictos de USA, GBR, FRA y AUS.");
}

if (!dataManifest.prodExcludes?.includes("reports/*.json")) {
  criticalIssues.push("El manifiesto de datos no excluye reports/*.json de produccion.");
}

if (Object.values(visualMetrics).some(metrics => metrics.bootChips || metrics.mojibakeHints)) {
  criticalIssues.push("Hay posibles residuos visuales en archivos de UI.");
  nextActions.push("Ejecutar npm run test:visual-hygiene y corregir tokens visibles.");
}

const report = {
  generatedAt: new Date().toISOString(),
  status: criticalIssues.length ? "requiere_atencion" : "operativo",
  startup: {
    critical: startup.startupHuman || "sin medir",
    criticalBytes: startup.startupBytes || 0,
    deferred: startup.deferredHuman || "sin medir",
    estimatedRuntimeMemory: startup.estimatedRuntimeMemory || null,
    largestAssets: startup.largestAssets || []
  },
  conflicts: {
    scanned: conflictAudit.scannedConflicts || 0,
    issueCount: conflictAudit.issueCount || 0,
    summary: conflictAudit.summary || {},
    eraFocus: conflictEraBuckets
  },
  data: {
    indexes: dataIndexFiles.sort((a, b) => b.bytes - a.bytes),
    countryWeights: countryWeights.summary || null,
    manifest: {
      productionPublic: dataManifest.productionPublic?.files || [],
      prodExcludes: dataManifest.prodExcludes || []
    },
    curationGaps: dataCurationAudit.gapsByType || {},
    conflictDataConsistency
  },
  sourceFiles: sourceFiles.sort((a, b) => b.bytes - a.bytes),
  scriptMetrics,
  visualMetrics,
  scripts: Object.keys(packageJson.scripts || {}).sort(),
  criticalIssues,
  warnings,
  nextActions: [...new Set(nextActions)]
};

await fs.ensureDir(reportsDir);
await fs.writeJson(reportPath, report, { spaces: 2 });

console.log(`Auditoria del proyecto: ${report.status}`);
console.log(`Arranque critico: ${report.startup.critical}`);
console.log(`Alertas de conflictos: ${report.conflicts.issueCount}`);
console.log(`Reporte: ${path.relative(projectRoot, reportPath)}`);
