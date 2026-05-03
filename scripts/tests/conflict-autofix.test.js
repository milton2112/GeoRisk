import assert from "node:assert/strict";
import { SAFE_CONFLICT_RENAMES, CURATED_CONFLICT_DETAIL_FIXES } from "../lib/conflict-autofix-rules.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";

assert.equal(SAFE_CONFLICT_RENAMES["Adriatic Campaign de World War II"], "Campana del Adriatico en la Segunda Guerra Mundial");
assert.equal(CURATED_CONFLICT_DETAIL_FIXES["Batalla de Saigon"].parent, "Guerra de Vietnam");

const report = buildConflictAuditReport({
  countries: {
    USA: {
      name: "Estados Unidos",
      military: {
        conflicts: [
          { name: "Batalla de Saigon", startYear: 1955, endYear: 1955 },
          { name: "Adriatic Campaign de World War II", startYear: 1939, endYear: 1945 }
        ]
      }
    }
  },
  generatedDetails: { conflicts: {} }
});

const saigon = report.topIssues.find(item => item.name === "Batalla de Saigon");
assert.ok(!saigon?.issues.includes("battle_without_parent"), "Batalla de Saigon debe tener padre curado");

const adriatic = report.topIssues.find(item => item.name === "Adriatic Campaign de World War II");
assert.ok(adriatic?.autoFixes.includes("Campana del Adriatico en la Segunda Guerra Mundial"));

console.log("conflict-autofix.test.js ok");
