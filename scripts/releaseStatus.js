import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { hasCompleteBrowserMeasurement, browserPerformanceWarnings } from "./lib/performance-evidence.js";
import { getPerformanceInputHash } from "./lib/performance-inputs.js";

const projectRoot = path.resolve(process.cwd());
const reportsDir = path.join(projectRoot, "reports");
const reportPath = path.join(reportsDir, "release-status.json");
const gitFailures = [];

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch (error) {
    gitFailures.push({ command: `git ${args.join(" ")}`, code: error?.code || null });
    return null;
  }
}

async function readText(relativePath, fallback = "") {
  try {
    return await fs.readFile(path.join(projectRoot, relativePath), "utf8");
  } catch {
    return fallback;
  }
}

async function readJson(relativePath, fallback = {}) {
  try {
    const value = JSON.parse(await readText(relativePath, ""));
    return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

async function fileBytes(relativePath) {
  try {
    return (await fs.stat(path.join(projectRoot, relativePath))).size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes = 0) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function extractVersion(source, constantName) {
  return source.match(new RegExp(`const ${constantName} = "([^"]+)"`))?.[1] || null;
}

const packageJson = await readJson("package.json");
const indexHtml = await readText("index.html");
const scriptSource = await readText("script.js");
const swSource = await readText("sw.js");
const changelog = await readText("CHANGELOG.md");
const performanceSnapshot = await readJson("reports/performance-snapshot.json");
const dataAudit = await readJson("reports/data-automation-audit.json");
const doctorReport = await readJson("reports/doctor-report.json");
const featureHealth = await readJson("reports/feature-health.json");

const packageVersion = packageJson.version || null;
const appVersion = extractVersion(scriptSource, "APP_VERSION");
const cacheVersion = extractVersion(swSource, "CACHE_VERSION");
const expectedTag = packageVersion ? `v${packageVersion}` : null;
const tagsAtHead = (git(["tag", "--points-at", "HEAD"]) || "").split(/\s+/).filter(Boolean);
const statusShortRaw = git(["status", "--short"]);
const gitStatusAvailable = statusShortRaw !== null;
const statusShort = statusShortRaw || "";
const dirtyFiles = statusShort.split(/\r?\n/).filter(Boolean);
const startupBytes = performanceSnapshot.assets?.startupCritical?.bytes || 0;
const mapEngineBytes = performanceSnapshot.assets?.mapEngine?.bytes || 0;
const appCoreAndEngineBytes = performanceSnapshot.assets?.appCoreAndEngine?.bytes || 0;
const scriptBytes = performanceSnapshot.assets?.scriptJs?.bytes || await fileBytes("script.js");
const countriesIndexBytes = performanceSnapshot.assets?.countriesIndex?.bytes || await fileBytes("data/countries_index.json");
let performanceInputHash = null;
let performanceInputError = null;
try {
  performanceInputHash = await getPerformanceInputHash(projectRoot);
} catch (error) {
  performanceInputError = error.message;
}
const dataCheckKeys = [
  "englishConflictNames", "mojibakeText", "sourceTextMojibake",
  "sameCountryDuplicateConflicts", "redundantReligions", "uppercaseCities"
];
const validCount = value => Number.isInteger(value) && value >= 0;
const dataAuditAvailable = dataCheckKeys.every(key => validCount(dataAudit.summary?.[key]?.count));
const featureHealthAvailable = ["operativo", "requiere_atencion"].includes(featureHealth.status) &&
  validCount(featureHealth.summary?.failedFeatures) && validCount(featureHealth.summary?.failedChecks) &&
  featureHealth.summary?.totalFeatures > 0;
const doctorAvailable = ["operativo", "observacion", "requiere_atencion"].includes(doctorReport.status) &&
  validCount(doctorReport.summary?.totalFindings) && doctorReport.summary?.bySeverity != null &&
  typeof doctorReport.summary.bySeverity === "object" && !Array.isArray(doctorReport.summary.bySeverity) &&
  Object.values(doctorReport.summary.bySeverity).every(validCount);

const dataCounts = Object.fromEntries(
  Object.entries(dataAudit.summary || {}).map(([key, value]) => [key, validCount(value?.count) ? value.count : null])
);

const checks = {
  versionAligned: Boolean(appVersion && appVersion === cacheVersion),
  indexUsesActiveStamp: Boolean(appVersion && indexHtml.includes(`?v=${appVersion}`)),
  changelogHasPackageVersion: Boolean(packageVersion && changelog.includes(`## v${packageVersion}`)),
  expectedTagAtHead: Boolean(expectedTag && tagsAtHead.includes(expectedTag)),
  gitStatusAvailable,
  workingTreeClean: gitStatusAvailable && statusShort.trim().length === 0,
  startupWithinBudget: startupBytes > 0 && startupBytes < 1024 * 1024,
  mapEngineWithinBudget: mapEngineBytes > 0 && mapEngineBytes < 3500000,
  appCoreAndEngineWithinBudget: appCoreAndEngineBytes === startupBytes + mapEngineBytes && appCoreAndEngineBytes < 4500000,
  scriptWithinBudget: scriptBytes > 0 && scriptBytes < 700000,
  countriesIndexWithinBudget: countriesIndexBytes > 0 && countriesIndexBytes < 240000,
  browserPerformanceMeasured: hasCompleteBrowserMeasurement(performanceSnapshot.browserPerformance),
  performanceInputsCurrent: Boolean(performanceInputHash && performanceSnapshot.performanceInputHash === performanceInputHash),
  dataAuditClean: dataAuditAvailable && dataCheckKeys.every(key => dataCounts[key] === 0),
  featureHealthClean: featureHealthAvailable && featureHealth.status === "operativo" &&
    featureHealth.summary.failedFeatures === 0 && featureHealth.summary.failedChecks === 0,
  doctorHasNoHighSeverity: doctorAvailable && doctorReport.status !== "requiere_atencion" &&
    !["critica", "alta"].some(severity => (doctorReport.summary.bySeverity[severity] || 0) > 0),
  reportVersionsCurrent: Boolean(packageVersion && appVersion && cacheVersion) &&
    [performanceSnapshot, doctorReport, featureHealth].every(report => report.packageVersion === packageVersion) &&
    performanceSnapshot.appVersion === appVersion && performanceSnapshot.cacheVersion === cacheVersion
};

const blockers = [];
const warnings = [];
if (!checks.versionAligned) blockers.push("APP_VERSION y CACHE_VERSION no coinciden.");
if (!checks.indexUsesActiveStamp) blockers.push("index.html no usa el stamp activo en query strings.");
if (!checks.changelogHasPackageVersion) blockers.push("CHANGELOG.md no documenta la version actual.");
if (!checks.startupWithinBudget) blockers.push("El nucleo de app, sin motor, esta fuera de presupuesto.");
if (!checks.mapEngineWithinBudget || !checks.appCoreAndEngineWithinBudget) blockers.push("Falta medir el motor o nucleo mas motor excede su presupuesto.");
if (!checks.scriptWithinBudget) blockers.push("script.js esta fuera de presupuesto.");
if (!checks.countriesIndexWithinBudget) blockers.push("countries_index.json esta fuera de presupuesto.");
if (!checks.browserPerformanceMeasured) blockers.push("Falta medicion real completa de rendimiento en navegador.");
if (!checks.performanceInputsCurrent) blockers.push("La medicion no corresponde a los archivos actuales. Ejecutar npm run performance:snapshot.");
if (!checks.reportVersionsCurrent) blockers.push("Faltan reportes de la version/cache actual. Ejecutar npm run release:check.");
if (checks.performanceInputsCurrent && checks.reportVersionsCurrent) warnings.push(...browserPerformanceWarnings(performanceSnapshot.browserPerformance));
if (!checks.dataAuditClean) blockers.push(dataAuditAvailable ? "La auditoria de datos conserva problemas visibles." : "Falta una auditoria de datos valida. Ejecutar npm run audit:data.");
if (!checks.featureHealthClean) blockers.push(featureHealthAvailable ? "La auditoria de salud funcional conserva fallas." : "Falta un reporte de salud funcional valido. Ejecutar npm run audit:features.");
if (!checks.doctorHasNoHighSeverity) blockers.push(doctorAvailable ? "El doctor de producto tiene hallazgos altos o criticos." : "Falta un reporte valido del doctor. Ejecutar npm run audit:doctor.");
if (!checks.expectedTagAtHead) warnings.push(`El tag ${expectedTag || "(sin version)"} todavia no apunta a HEAD.`);
if (!checks.gitStatusAvailable) warnings.push("No se pudo leer el estado de Git desde Node; verificar con git status --short.");
else if (!checks.workingTreeClean) warnings.push("Hay cambios locales pendientes.");

const report = {
  generatedAt: new Date().toISOString(),
  packageVersion,
  appVersion,
  cacheVersion,
  artifactPolicy: {
    kind: "ephemeral",
    tracked: false,
    reason: "Incluye estado vivo de Git; se genera localmente y en CI, pero no debe versionarse."
  },
  status: blockers.length ? "requiere_atencion" : warnings.length ? "observacion" : "listo",
  git: {
    branch: git(["branch", "--show-current"]),
    head: git(["rev-parse", "--short", "HEAD"]),
    expectedTag,
    tagsAtHead,
    gitAvailable: gitFailures.length === 0,
    failures: gitFailures,
    dirtyFileCount: gitStatusAvailable ? dirtyFiles.length : null,
    dirtySample: gitStatusAvailable ? dirtyFiles.slice(0, 25) : null
  },
  checks,
  performanceEvidence: {
    measuredAt: performanceSnapshot.browserPerformance?.measuredAt || null,
    currentInputHash: performanceInputHash,
    measuredInputHash: performanceSnapshot.performanceInputHash || null,
    inputError: performanceInputError
  },
  blockers,
  warnings,
  assets: {
    startupCritical: { bytes: startupBytes, human: formatBytes(startupBytes), scope: performanceSnapshot.assets?.startupCritical?.scope || null },
    mapEngine: performanceSnapshot.assets?.mapEngine || null,
    appCoreAndEngine: performanceSnapshot.assets?.appCoreAndEngine || null,
    scriptJs: { bytes: scriptBytes, human: formatBytes(scriptBytes) },
    countriesIndex: { bytes: countriesIndexBytes, human: formatBytes(countriesIndexBytes) },
    buildTotal: performanceSnapshot.assets?.buildTotal || null
  },
  dataCounts,
  featureHealth: {
    status: featureHealth.status || null,
    summary: featureHealth.summary || null
  },
  doctor: {
    status: doctorReport.status || null,
    findings: doctorReport.summary?.totalFindings || 0,
    bySeverity: doctorReport.summary?.bySeverity || {}
  }
};

await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Estado de release: ${path.relative(projectRoot, reportPath)}`);
console.log(`Version: ${packageVersion} / ${appVersion}`);
console.log(`Estado: ${report.status}`);
console.log(`Bloqueos: ${blockers.length}`);
console.log(`Observaciones: ${warnings.length}`);
for (const blocker of blockers) console.error(`BLOQUEO: ${blocker}`);
for (const warning of warnings) console.warn(`AVISO: ${warning}`);
if (blockers.length) process.exitCode = 1;
