import assert from "node:assert/strict";
import { hasMojibake, hasValue, isTerritoryLike, normalizeArray } from "../lib/dataset-shared.js";
import { clampQualityScore, shouldThrottleHover } from "../lib/render-logic.js";
import { buildRuntimeSupplemental } from "../lib/runtime-supplemental.js";

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

const populationCsv = [
  '"Data Source","World Development Indicators",', '',
  '"Country Name","Country Code","Indicator Code","2022","2023","2024","2025"',
  '"Country, quoted","AAA","SP.POP.TOTL","100","110","121",""',
  '"Missing year","BBB","SP.POP.TOTL","100","","121",""',
  '"Zero baseline","CCC","SP.POP.TOTL","100","0","121",""',
  '"Aggregate","ALL","SP.POP.TOTL","100","110","121",""',
  '"Declining","DDD","SP.POP.TOTL","100","100","90",""',
  '"Other metric","EEE","OTHER","100","100","120",""'
].join("\n");
const supplement = await buildRuntimeSupplemental({ AAA: {}, BBB: {}, CCC: {}, DDD: {}, EEE: {} }, populationCsv);
assert.deepEqual(supplement.populationGrowth, { AAA: 10, DDD: -10 });
assert.deepEqual(supplement.populationPeriods.AAA, [2023, 2024]);
assert.deepEqual(supplement.countryNames[0], ["Country, quoted", "AAA"]);
assert.ok(!supplement.countryNames.some(([, code]) => code === "ALL"));
await assert.rejects(buildRuntimeSupplemental({}, "invalid"), /cabecera/);
console.log("logic.test.js ok");
