import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const reportsDir = path.join(projectRoot, "reports");
const reportPath = path.join(reportsDir, "release-artifacts.json");

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

function includesLine(source, expectedLine) {
  return source.split(/\r?\n/).some(line => line.trim() === expectedLine);
}

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return null;
  }
}

function addCheck(checks, key, ok, detail, action = null) {
  checks.push({ key, ok: Boolean(ok), detail, action });
}

const [
  packageJson,
  gitignore,
  releaseChecklist,
  maintenanceQuick,
  releaseWorkflow,
  releaseStatusSource,
  releaseGatesTest
] = await Promise.all([
  readJson("package.json"),
  readText(".gitignore"),
  readText("scripts/releaseChecklist.js"),
  readText("scripts/maintenanceQuick.js"),
  readText(".github/workflows/release-gate.yml"),
  readText("scripts/releaseStatus.js"),
  readText("scripts/tests/release-gates.test.js")
]);

const scripts = packageJson.scripts || {};
const checks = [];
const trackedReleaseStatus = git(["ls-files", "reports/release-status.json"]);
const gitAvailable = trackedReleaseStatus !== null;

addCheck(
  checks,
  "release_status_ignored",
  includesLine(gitignore, "reports/release-status.json"),
  "reports/release-status.json debe ser artefacto local/CI, no archivo versionado.",
  "Agregar reports/release-status.json a .gitignore y quitarlo del indice Git."
);
addCheck(
  checks,
  "release_status_not_tracked",
  !gitAvailable || !trackedReleaseStatus,
  gitAvailable
    ? "reports/release-status.json no debe estar trackeado por Git."
    : "No se pudo consultar Git; este check se valida en CI o terminal normal.",
  "git rm --cached reports/release-status.json"
);
addCheck(
  checks,
  "release_status_script",
  scripts["release:status"] === "node scripts/releaseStatus.js",
  "Debe existir npm run release:status."
);
addCheck(
  checks,
  "release_artifacts_script",
  scripts["audit:release-artifacts"] === "node scripts/auditReleaseArtifacts.js",
  "Debe existir npm run audit:release-artifacts."
);
addCheck(
  checks,
  "release_check_runs_artifact_audit",
  releaseChecklist.includes("audit:release-artifacts"),
  "release:check debe auditar artefactos antes de publicar estado de release."
);
addCheck(
  checks,
  "maintain_runs_artifact_audit",
  maintenanceQuick.includes("audit:release-artifacts"),
  "maintain:quick debe dejar auditados los artefactos de release."
);
addCheck(
  checks,
  "workflow_runs_artifact_audit",
  releaseWorkflow.includes("npm run audit:release-artifacts"),
  "GitHub Actions debe correr audit:release-artifacts."
);
addCheck(
  checks,
  "workflow_uploads_reports",
  releaseWorkflow.includes("actions/upload-artifact") && releaseWorkflow.includes("reports/*.json"),
  "GitHub Actions debe subir reportes JSON como artifacts."
);
addCheck(
  checks,
  "release_status_has_policy",
  releaseStatusSource.includes("artifactPolicy") && releaseStatusSource.includes("ephemeral"),
  "release:status debe declarar que su reporte es efimero."
);
addCheck(
  checks,
  "release_gates_cover_artifacts",
  releaseGatesTest.includes("release-status.json") && releaseGatesTest.includes("audit:release-artifacts"),
  "test:release-gates debe bloquear regresiones del flujo de artefactos."
);

const failed = checks.filter(check => !check.ok);
const report = {
  generatedAt: new Date().toISOString(),
  packageVersion: packageJson.version || null,
  status: failed.length ? "requiere_atencion" : "operativo",
  summary: {
    totalChecks: checks.length,
    failedChecks: failed.length
  },
  checks,
  actions: failed.map(check => ({
    key: check.key,
    detail: check.detail,
    action: check.action
  })).filter(action => action.action)
};

await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Auditoria de artefactos de release: ${path.relative(projectRoot, reportPath)}`);
console.log(`Estado: ${report.status}`);
console.log(`Checks: ${checks.length}`);
console.log(`Fallos: ${failed.length}`);

if (failed.length) {
  process.exitCode = 1;
}
