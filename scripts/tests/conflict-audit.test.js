import assert from "node:assert/strict";
import { filterAuditConflicts, getConflictDetailIssues, getConflictNameIssues, hasUsefulDetail, isConflictAuditFalsePositive } from "../lib/conflict-audit.js";

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
assert.deepEqual(getConflictNameIssues("6000-Mark War"), ["english"]);
assert.deepEqual(getConflictNameIssues("Q31199061"), ["technical_identifier"]);
assert.deepEqual(getConflictNameIssues("Guerra contra el narcotrÃ¡fico en MÃ©xico"), ["mojibake"]);
assert.deepEqual(getConflictNameIssues("2022 Invasion of Ukraine"), ["english", "leading_year"]);
assert.deepEqual(
  getConflictDetailIssues({
    type: "batalla",
    cause: "Vease anexo &#8203;",
    participants: [{ side: "Bando 1" }]
  }),
  ["generic_side", "wiki_residue", "parse_residue", "battle_without_parent"]
);
assert.equal(hasUsefulDetail({ cause: "Pendiente de curaduria y ampliacion historiografica" }), false);
assert.equal(hasUsefulDetail({
  cause: "La disputa por el control del corredor fronterizo escalo tras varios incidentes diplomaticos.",
  outcome: "Acuerdo de alto el fuego supervisado por observadores regionales."
}), true);

console.log("conflict-audit.test.js ok");
