import fs from "fs-extra";
import path from "node:path";
import { buildConflictAuditReport } from "./lib/conflict-audit.js";

const projectRoot = path.resolve(process.cwd());
const countriesPath = path.join(projectRoot, "data", "countries_full.json");
const detailsPath = path.join(projectRoot, "data", "conflict_details.generated.json");
const reportsDir = path.join(projectRoot, "reports");
const reportPath = path.join(reportsDir, "conflict-audit.json");
const fixesPath = path.join(reportsDir, "conflict-autofix-suggestions.json");

const countries = await fs.readJson(countriesPath);
const generatedDetails = await fs.pathExists(detailsPath)
  ? await fs.readJson(detailsPath)
  : {};

const report = buildConflictAuditReport({ countries, generatedDetails, maxItems: 300 });
const suggestions = {
  generatedAt: report.generatedAt,
  candidates: report.topIssues
    .filter(item => item.autoFixes.length)
    .map(item => ({
      current: item.name,
      aliases: item.names,
      suggested: item.autoFixes[0],
      issues: item.issues
    }))
};

await fs.ensureDir(reportsDir);
await fs.writeJson(reportPath, report, { spaces: 2 });
await fs.writeJson(fixesPath, suggestions, { spaces: 2 });

console.log(`Conflictos escaneados: ${report.scannedConflicts}`);
console.log(`Conflictos con alertas: ${report.issueCount}`);
console.log(`Reporte: ${path.relative(projectRoot, reportPath)}`);
console.log(`Sugerencias automaticas: ${path.relative(projectRoot, fixesPath)}`);
