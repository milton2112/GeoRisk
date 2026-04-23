import assert from "node:assert/strict";
import {
  canonicalizeConflictNameWithRules,
  cleanConflictLabel,
  inferConflictYearsFromText,
  mergeConflictEntries,
  normalizeConflictKey
} from "../lib/conflict-cleaning.js";

const rules = [
  [/^World War II$/i, "Segunda Guerra Mundial"],
  [/^Battle of /i, "Batalla de "],
  [/^War in /i, "Guerra en "]
];

assert.equal(canonicalizeConflictNameWithRules("World War II", rules), "Segunda Guerra Mundial");
assert.equal(canonicalizeConflictNameWithRules("Battle of Mosul", rules), "Batalla de Mosul");
assert.equal(cleanConflictLabel("Operación Black Buck"), "Operacion Black Buck");
assert.equal(cleanConflictLabel("México y Perú"), "Mexico y Peru");
assert.equal(normalizeConflictKey("Segunda Guerra Mundial"), "segunda guerra mundial");
assert.deepEqual(
  inferConflictYearsFromText("6 de junio-30 de agosto de 1944"),
  { startYear: 1944, endYear: 1944, ongoing: false }
);
assert.deepEqual(
  inferConflictYearsFromText("25 de junio de 1950 - presente"),
  { startYear: 1950, endYear: 1950, ongoing: true }
);

const merged = mergeConflictEntries([
  { name: "Guerra de Vietnam", startYear: 1955, endYear: 1975, ongoing: false },
  { name: "Guerra de Vietnam", startYear: null, endYear: null, ongoing: false },
  { name: "Guerra de Vietnam", startYear: 1955, endYear: null, ongoing: false }
]);

assert.equal(merged.length, 1);
assert.equal(merged[0].startYear, 1955);
assert.equal(merged[0].endYear, 1975);

console.log("conflict-cleaning.test.js ok");
