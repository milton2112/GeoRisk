import assert from "node:assert/strict";
import { SAFE_CONFLICT_RENAMES, CURATED_CONFLICT_DETAIL_FIXES } from "../lib/conflict-autofix-rules.js";
import { WWII_1942_CONFLICT_DETAIL_FIXES, WWII_1942_SAFE_CONFLICT_RENAMES } from "../lib/conflict-curation-1942.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";

assert.equal(SAFE_CONFLICT_RENAMES["Adriatic Campaign de World War II"], "Campana del Adriatico en la Segunda Guerra Mundial");
assert.equal(CURATED_CONFLICT_DETAIL_FIXES["Batalla de Saigon"].parent, "Guerra de Vietnam");
assert.equal(WWII_1942_SAFE_CONFLICT_RENAMES["Batalla de la BahÃƒÂ­a de Milne"], "Batalla de la Bahia de Milne");
assert.equal(WWII_1942_CONFLICT_DETAIL_FIXES["Batalla de Midway"].parent, "Segunda Guerra Mundial");

const report = buildConflictAuditReport({
  countries: {
    USA: {
      name: "Estados Unidos",
      military: {
        conflicts: [
          { name: "Batalla de Saigon", startYear: 1955, endYear: 1955 },
          { name: "Batalla de Midway", startYear: 1942, endYear: 1942 },
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
assert.ok(!adriatic, "Los renombres seguros deben canonicalizarse antes de auditar duplicados");

const midway = report.topIssues.find(item => item.name === "Batalla de Midway");
assert.ok(!midway?.issues.includes("battle_without_parent"), "Batalla de Midway debe tener padre curado");

console.log("conflict-autofix.test.js ok");
