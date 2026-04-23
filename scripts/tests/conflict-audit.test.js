import assert from "node:assert/strict";
import { filterAuditConflicts, getConflictNameIssues, isConflictAuditFalsePositive } from "../lib/conflict-audit.js";

assert.equal(isConflictAuditFalsePositive("post2000", "1919 Soviet invasion de Ukraine"), true);
assert.equal(isConflictAuditFalsePositive("post2000", "Invasion de Irak de 2003"), false);
assert.deepEqual(
  filterAuditConflicts("latin_america", [
    "Guerra del Cenepa",
    "Expedición contra Quebec",
    "Levantamiento zapatista"
  ]),
  ["Guerra del Cenepa", "Levantamiento zapatista"]
);
assert.deepEqual(getConflictNameIssues("Battle of Mosul"), ["english"]);
assert.deepEqual(getConflictNameIssues("Guerra contra el narcotrÃ¡fico en MÃ©xico"), ["mojibake"]);
assert.deepEqual(getConflictNameIssues("2022 Invasion of Ukraine"), ["english", "leading_year"]);

console.log("conflict-audit.test.js ok");
