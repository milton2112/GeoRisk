import assert from "node:assert/strict";
import { buildConflictAuditReport, suggestConflictAutoFix } from "../lib/conflict-audit.js";

const countries = {
  AAA: {
    name: "Pais A",
    conflicts: [
      { name: "World War II", startYear: 1939, endYear: 1945 },
      { name: "Batalla de Prueba", type: "batalla" }
    ]
  },
  BBB: {
    name: "Pais B",
    military: {
      conflicts: [
        { name: "Segunda Guerra Mundial", startYear: 1939, endYear: 1945 }
      ]
    }
  }
};

const generatedDetails = {
  conflicts: {
    "Batalla de Prueba": {
      type: "batalla",
      cause: "Vease anexo &#8203;",
      participants: [{ side: "Bando 1", countries: ["Pais A"] }]
    }
  }
};

const report = buildConflictAuditReport({ countries, generatedDetails });

assert.ok(report.scannedConflicts >= 3);
assert.ok(report.issueCount >= 2);
assert.ok(report.summary.english >= 1);
assert.ok(report.summary.battle_without_parent >= 1);
assert.equal(suggestConflictAutoFix("World War II"), "Segunda Guerra Mundial");
assert.equal(suggestConflictAutoFix("2022 Invasion of Ukraine"), "Invasion de Ukraine (2022)");

console.log("conflict-audit-report.test.js ok");
