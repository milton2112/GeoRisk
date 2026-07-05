import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

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
    return JSON.parse(await readText(relativePath, ""));
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

function reportPackageVersion(report) {
  return report.packageVersion || report.summary?.packageVersion || null;
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
const scriptBytes = performanceSnapshot.assets?.scriptJs?.bytes || await fileBytes("script.js");
const countriesIndexBytes = performanceSnapshot.assets?.countriesIndex?.bytes || await fileBytes("data/countries_index.json");

const dataCounts = Object.fromEntries(
  Object.entries(dataAudit.summary || {}).map(([key, value]) => [key, value.count || 0])
);

const checks = {
  versionAligned: Boolean(appVersion && appVersion === cacheVersion),
  indexUsesActiveStamp: Boolean(appVersion && indexHtml.includes(`?v=${appVersion}`)),
  changelogHasPackageVersion: Boolean(packageVersion && changelog.includes(`## v${packageVersion}`)),
  expectedTagAtHead: Boolean(expectedTag && tagsAtHead.includes(expectedTag)),
  gitStatusAvailable,
  workingTreeClean: gitStatusAvailable && statusShort.trim().length === 0,
  startupWithinBudget: startupBytes > 0 && startupBytes < 1024 * 1024,
  scriptWithinBudget: scriptBytes > 0 && scriptBytes < 700000,
  countriesIndexWithinBudget: countriesIndexBytes > 0 && countriesIndexBytes < 240000,
  dataAuditClean: [
    "englishConflictNames",
    "mojibakeText",
    "sourceTextMojibake",
    "sameCountryDuplicateConflicts",
    "redundantReligions",
    "uppercaseCities"
  ].every(key => (dataCounts[key] || 0) === 0),
  featureHealthClean: !featureHealth.status || featureHealth.status === "operativo",
  doctorHasNoHighSeverity: !["critica", "alta"].some(severity => (doctorReport.summary?.bySeverity?.[severity] || 0) > 0),
  reportVersionsCurrent: [performanceSnapshot, doctorReport]
    .filter(report => Object.keys(report || {}).length)
    .every(report => reportPackageVersion(report) === packageVersion)
};

const blockers = [];
const warnings = [];
if (!checks.versionAligned) blockers.push("APP_VERSION y CACHE_VERSION no coinciden.");
if (!checks.indexUsesActiveStamp) blockers.push("index.html no usa el stamp activo en query strings.");
if (!checks.changelogHasPackageVersion) blockers.push("CHANGELOG.md no documenta la version actual.");
if (!checks.startupWithinBudget) blockers.push("El arranque critico esta fuera de presupuesto.");
if (!checks.scriptWithinBudget) blockers.push("script.js esta fuera de presupuesto.");
if (!checks.countriesIndexWithinBudget) blockers.push("countries_index.json esta fuera de presupuesto.");
if (!checks.dataAuditClean) blockers.push("La auditoria de datos conserva problemas visibles.");
if (!checks.featureHealthClean) blockers.push("La auditoria de salud funcional conserva fallas.");
if (!checks.doctorHasNoHighSeverity) blockers.push("El doctor de producto tiene hallazgos altos o criticos.");
if (!checks.expectedTagAtHead) warnings.push(`El tag ${expectedTag || "(sin version)"} todavia no apunta a HEAD.`);
if (!checks.gitStatusAvailable) warnings.push("No se pudo leer el estado de Git desde Node; verificar con git status --short.");
else if (!checks.workingTreeClean) warnings.push("Hay cambios locales pendientes.");
if (!checks.reportVersionsCurrent) warnings.push("Algunos reportes no corresponden a la version actual.");

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
  blockers,
  warnings,
  assets: {
    startupCritical: { bytes: startupBytes, human: formatBytes(startupBytes) },
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
