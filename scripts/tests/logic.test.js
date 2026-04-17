import assert from "node:assert/strict";
import { hasMojibake, hasValue, isTerritoryLike, normalizeArray } from "../lib/dataset-shared.js";
import { clampQualityScore, shouldThrottleHover } from "../lib/render-logic.js";

assert.deepEqual(normalizeArray([1, null, 2, "", 3]), [1, 2, 3]);
assert.equal(hasValue("Sin datos"), false);
assert.equal(hasValue("Argentina"), true);
assert.equal(hasMojibake(`Rep${"\u00C3\u00BA"}blica`), true);
assert.equal(
  isTerritoryLike({
    general: { officialName: "Territorio Britanico de Ultramar", stateStructure: "territorio" },
    politics: { system: "Dependencia" }
  }),
  true
);
assert.equal(
  isTerritoryLike({
    general: { officialName: "Republica Argentina", stateStructure: "estado federal" },
    politics: { system: "Presidencialismo" }
  }),
  false
);
assert.equal(clampQualityScore(121.6), 100);
assert.equal(clampQualityScore(-5), 0);
assert.equal(shouldThrottleHover({ is2d: true }), true);
assert.equal(shouldThrottleHover({}), false);

console.log("logic.test.js ok");
