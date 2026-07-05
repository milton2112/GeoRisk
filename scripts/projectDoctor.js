import fs from "fs-extra";
import path from "node:path";
import { writeJsonWithRetry } from "./lib/resilient-fs.js";

const projectRoot = path.resolve(process.cwd());
const reportsDir = path.join(projectRoot, "reports");
const reportPath = path.join(reportsDir, "doctor-report.json");

async function readJson(relativePath, fallback = {}) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!(await fs.pathExists(absolutePath))) return fallback;
  return fs.readJson(absolutePath).catch(() => fallback);
}

async function readText(relativePath, fallback = "") {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!(await fs.pathExists(absolutePath))) return fallback;
  return fs.readFile(absolutePath, "utf8").catch(() => fallback);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function countBySeverity(items) {
  return items.reduce((acc, item) => {
    acc[item.severity] = (acc[item.severity] || 0) + 1;
    return acc;
  }, {});
}

function addFinding(findings, severity, area, title, detail, command = null) {
  findings.push({ severity, area, title, detail, command });
}

const [
  packageJson,
  projectAudit,
  dataAudit,
  performanceSnapshot,
  releaseArtifacts,
  featureHealth,
  conflictAudit,
  indexHtml,
  scriptSource,
  swSource,
  changelogSource,
  workflowSource
] = await Promise.all([
  readJson("package.json"),
  readJson("reports/project-audit.json"),
  readJson("reports/data-automation-audit.json"),
  readJson("reports/performance-snapshot.json"),
  readJson("reports/release-artifacts.json"),
  readJson("reports/feature-health.json"),
  readJson("reports/conflict-audit.json"),
  readText("index.html"),
  readText("script.js"),
  readText("sw.js"),
  readText("CHANGELOG.md"),
  readText(".github/workflows/release-gate.yml")
]);

const scripts = packageJson.scripts || {};
const findings = [];
const requiredScripts = [
  "prepush:check",
  "release:prepare",
  "release:check",
  "release:status",
  "fix:source-text",
  "audit:data",
  "audit:project",
  "audit:conflicts",
  "performance:snapshot",
  "audit:release-artifacts",
  "audit:features",
  "maintain:quick",
  "clean:storage"
];

for (const scriptName of requiredScripts) {
  if (!scripts[scriptName]) {
    addFinding(findings, "alta", "automatizacion", `Falta npm run ${scriptName}`, "El flujo publico pierde una puerta automatica.", "npm run release:check");
  }
}

const startupBytes = performanceSnapshot.assets?.startupCritical?.bytes || projectAudit.startup?.criticalBytes || 0;
const scriptBytes = performanceSnapshot.assets?.scriptJs?.bytes || 0;
const countriesIndexBytes = performanceSnapshot.assets?.countriesIndex?.bytes || 0;
const appVersion = scriptSource.match(/const APP_VERSION = "([^"]+)"/)?.[1] || null;
const cacheVersion = swSource.match(/const CACHE_VERSION = "([^"]+)"/)?.[1] || null;
if (!appVersion || appVersion !== cacheVersion) {
  addFinding(findings, "alta", "release", "Version de app/cache desalineada", `APP_VERSION=${appVersion || "faltante"}, CACHE_VERSION=${cacheVersion || "faltante"}`, "npm run release:prepare");
}
if (appVersion && !indexHtml.includes(`?v=${appVersion}`)) {
  addFinding(findings, "alta", "release", "index.html no usa el stamp activo", appVersion, "npm run release:prepare");
}
if (packageJson.version && !changelogSource.includes(`## v${packageJson.version}`)) {
  addFinding(findings, "media", "release", "CHANGELOG sin la version actual", `v${packageJson.version}`, "npm run release:prepare");
}
if (startupBytes > 1024 * 1024) {
  addFinding(findings, "critica", "performance", "Arranque critico sobre 1 MB", `${startupBytes} bytes`, "npm run measure:startup");
}
if (scriptBytes > 700000) {
  addFinding(findings, "critica", "performance", "script.js supera 700 KB", `${scriptBytes} bytes`, "npm run check:startup-budget");
} else if (scriptBytes > 660000) {
  addFinding(findings, "media", "performance", "script.js sigue al limite", `${scriptBytes} bytes`, "Extraer mas UI a modulos diferidos.");
}
if (countriesIndexBytes > 240000) {
  addFinding(findings, "critica", "performance", "countries_index supera 240 KB", `${countriesIndexBytes} bytes`, "npm run compact:index");
}

const dataSummary = dataAudit.summary || {};
const dataCounts = Object.fromEntries(Object.entries(dataSummary).map(([key, value]) => [key, value.count || 0]));
if (dataCounts.englishConflictNames > 0 || dataCounts.mojibakeText > 0 || dataCounts.sourceTextMojibake > 0 || dataCounts.uppercaseCities > 0) {
  addFinding(
    findings,
    "alta",
    "datos",
    "Datos visibles con texto sospechoso",
    `ingles=${dataCounts.englishConflictNames || 0}, mojibake=${dataCounts.mojibakeText || 0}, fuente=${dataCounts.sourceTextMojibake || 0}, mayusculas=${dataCounts.uppercaseCities || 0}`,
    "npm run fix:source-text && npm run fix:data-visible && npm run build:indexes && npm run audit:data"
  );
}
if ((dataCounts.undatedHighLevelConflicts || 0) > 0) {
  addFinding(
    findings,
    "media",
    "datos",
    "Conflictos relevantes sin fecha",
    `${dataCounts.undatedHighLevelConflicts} casos de prioridad mayor que batallas tacticas sin fecha.`,
    "npm run fix:conflicts:batches"
  );
}
if ((dataCounts.sameCountryDuplicateConflicts || 0) > 0) {
  addFinding(
    findings,
    "media",
    "datos",
    "Duplicados dentro del mismo pais",
    `${dataCounts.sameCountryDuplicateConflicts} nombres repetidos en la misma ficha.`,
    "npm run audit:data"
  );
}
if ((conflictAudit.issueCount || 0) > 0) {
  addFinding(findings, "alta", "conflictos", "Auditoria de conflictos con alertas", `${conflictAudit.issueCount} alertas`, "npm run fix:conflicts");
}
if (releaseArtifacts.status && releaseArtifacts.status !== "operativo") {
  addFinding(
    findings,
    "alta",
    "release",
    "Artefactos de release mal configurados",
    `${releaseArtifacts.summary?.failedChecks || 0} checks fallidos`,
    "npm run audit:release-artifacts"
  );
}
if (featureHealth.status && featureHealth.status !== "operativo") {
  addFinding(
    findings,
    "alta",
    "funciones",
    "Funciones principales con contratos incompletos",
    `${featureHealth.summary?.failedFeatures || 0} funciones con fallas`,
    "npm run audit:features"
  );
}

const deferredModuleMatches = [...scriptSource.matchAll(/([a-zA-Z0-9_]+): `\.\/([^`?]+)\?v=\$\{APP_VERSION\}`/g)]
  .map(match => ({ key: match[1], file: match[2] }));
for (const module of deferredModuleMatches) {
  if (!(await fs.pathExists(path.join(projectRoot, module.file)))) {
    addFinding(findings, "critica", "ui", `Modulo diferido faltante: ${module.key}`, module.file, "npm run test:startup");
  }
}

const dataAttributes = [...indexHtml.matchAll(/\s(data-[a-z0-9-]+)=/g)]
  .map(match => match[1])
  .filter((value, index, list) => list.indexOf(value) === index)
  .sort();
const unreferencedDataAttributes = dataAttributes.filter(attribute => !scriptSource.includes(attribute));
if (unreferencedDataAttributes.length) {
  addFinding(
    findings,
    "media",
    "ui",
    "Atributos data-* sin referencia directa",
    unreferencedDataAttributes.join(", "),
    "npm run test:ui-architecture"
  );
}

if (!workflowSource.includes("npm run release:check")) {
  addFinding(findings, "alta", "automatizacion", "GitHub Actions no corre release:check", "La puerta remota no cubre la release completa.", "npm run test:release-gates");
}
if (!workflowSource.includes("npm run release:status")) {
  addFinding(findings, "media", "automatizacion", "GitHub Actions no publica estado de release", "Falta el tablero resumido de version, datos y presupuestos.", "npm run test:release-gates");
}
if (!workflowSource.includes("schedule:")) {
  addFinding(findings, "media", "automatizacion", "GitHub Actions no tiene auditoria programada", "Conviene conservar una auditoria semanal de datos.", "npm run test:release-gates");
}

const report = {
  generatedAt: new Date().toISOString(),
  packageVersion: packageJson.version || null,
  status: findings.some(item => item.severity === "critica" || item.severity === "alta")
    ? "requiere_atencion"
    : findings.length
      ? "observacion"
      : "operativo",
  summary: {
    totalFindings: findings.length,
    bySeverity: countBySeverity(findings),
    startupBytes,
    scriptBytes,
    countriesIndexBytes,
    conflictAuditIssues: conflictAudit.issueCount || 0,
    dataCounts
  },
  topActions: findings
    .filter(item => item.command)
    .slice(0, 8)
    .map(item => ({ area: item.area, title: item.title, command: item.command })),
  findings,
  observedContracts: {
    deferredModules: deferredModuleMatches,
    htmlDataAttributes: dataAttributes
  },
  dataAuditActionPlan: asArray(dataAudit.actionPlan)
};

await fs.ensureDir(reportsDir);
await writeJsonWithRetry(reportPath, report, { spaces: 2 });

console.log(`Doctor GeoRisk: ${path.relative(projectRoot, reportPath)}`);
console.log(`Estado: ${report.status}`);
console.log(`Hallazgos: ${findings.length}`);
for (const [severity, count] of Object.entries(report.summary.bySeverity)) {
  console.log(`${severity}: ${count}`);
}
