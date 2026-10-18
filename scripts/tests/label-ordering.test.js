import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const read = file => fs.readFile(new URL("../../" + file, import.meta.url), "utf8");
const script = await read("script.js");
const runtime = await read("app-runtime.js");
const helpers = ["getUniqueDisplayLabels", "repairMojibake", "normalizeText"].map(name => {
  const match = script.match(new RegExp("function " + name + "\\([^]*?\\n\\}"));
  assert.ok(match, "real label helper: " + name);
  return match[0];
}).join("\n");

function fixture({ loadRuntime = true, collatorAvailable = true } = {}) {
  let constructions = 0;
  const state = vm.createContext({ window: {}, Intl: {
    Collator: collatorAvailable ? class extends Intl.Collator {
      constructor(...args) {
        assert.deepEqual(args, ["es"], "one fixed locale and unchanged default options");
        super(...args);
        constructions += 1;
      }
    } : undefined
  } });
  vm.runInContext(`
    let nativeComparisons = 0;
    const nativeCompare = String.prototype.localeCompare;
    String.prototype.localeCompare = function (...args) {
      nativeComparisons += 1;
      return nativeCompare.apply(this, args);
    };
    globalThis.comparisonCount = () => nativeComparisons;
  `, state);
  if (loadRuntime) vm.runInContext(runtime, state);
  vm.runInContext(helpers, state);
  return { state, constructions: () => constructions };
}

const baseline = fixture({ loadRuntime: false });
const optimized = fixture();
assert.equal(optimized.constructions(), 0, "runtime and helper loading must stay lazy");
for (const labels of [[], [null, undefined, ""], ["Islam"], ["Islam", "islam"]]) {
  assert.deepEqual(Array.from(optimized.state.getUniqueDisplayLabels(labels)),
    Array.from(baseline.state.getUniqueDisplayLabels(labels)));
}
assert.equal(optimized.constructions(), 0, "zero/one distinct label does not require a collator");

const countries = Object.values(JSON.parse(await read("data/countries_index.json")));
const groups = [
  ["nino", "Ni\u00f1o", "NI\u00d1O", "\u00c1frica", "africa", "Islam", "Uni\u00f3n", "union", "\u00e9xito", "exito", "e\u0301xito", "Estado 10", "Estado 2", "\ud83c\udf0d", null, false, 0, 42],
  countries.map(country => country.name),
  countries.map(country => country.politics?.system),
  countries.flatMap(country => country.politics?.organizations || []),
  countries.flatMap(country => country.politics?.rivals || []),
  countries.map(country => country.history?.origin),
  countries.map(country => country.religion?.summary)
];
for (const labels of groups) {
  assert.deepEqual(Array.from(optimized.state.getUniqueDisplayLabels(labels)),
    Array.from(baseline.state.getUniqueDisplayLabels(labels)), "label choice, duplicates and Spanish order stay identical");
}
const compared = baseline.state.comparisonCount();
assert.ok(compared > 500, "fixture exercises repeated native comparisons");
assert.equal(optimized.state.comparisonCount(), 0, "sorting uses the shared Collator instead of repeated localeCompare calls");
assert.equal(optimized.constructions(), 1, "all groups share one lazily created collator");
for (let iteration = 0; iteration < 25; iteration += 1) optimized.state.getUniqueDisplayLabels(groups[0]);
assert.equal(optimized.constructions(), 1, "no per-list/value/options cache or additional collator");

for (const options of [{ loadRuntime: false }, { collatorAvailable: false }]) {
  const fallback = fixture(options);
  for (const labels of groups) assert.deepEqual(Array.from(fallback.state.getUniqueDisplayLabels(labels)),
    Array.from(baseline.state.getUniqueDisplayLabels(labels)), "missing runtime/optional Intl API keeps the native fallback");
  assert.equal(fallback.constructions(), 0);
  assert.ok(fallback.state.comparisonCount() > 500);
}
console.log("label-ordering.test.js ok: Spanish output preserved, " + compared +
  " localeCompare calls replaced by one lazy shared collator");
