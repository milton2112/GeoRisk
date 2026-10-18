import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
function block(from, to) {
  const start = source.indexOf(from);
  const end = source.indexOf(to, start);
  assert.ok(start >= 0 && end > start, from);
  return source.slice(start, end);
}

for (const open of [false, true]) {
  const calls = { index: 0, aliases: 0, supplemental: 0, scheduled: 0, writes: 0 };
  let release;
  const held = new Promise(resolve => { release = resolve; });
  const state = vm.createContext({
    console,
    loadDeferredDataEnhancementsPromise: null, deferredGlobalStatsReady: true,
    ensureSearchIndexReady() { calls.index++; },
    scheduleConflictAliasesLoad() { calls.aliases++; },
    isRankingsPanelOpen: () => open,
    runCriticalGlobalStats() { if (open) calls.writes++; },
    scheduleDeferredGlobalStats(force) { assert.equal(force, true); calls.scheduled++; },
    async loadSupplementalData() { calls.supplemental++; await held; state.refreshGlobalStats(); }
  });
  vm.runInContext(block("function refreshGlobalStats()", "function loadScriptOnce("), state);
  vm.runInContext(block("async function loadDeferredDataEnhancements()", "async function loadConflictDetailsIndex("), state);
  const first = state.loadDeferredDataEnhancements();
  const concurrent = state.loadDeferredDataEnhancements();
  release();
  await Promise.all([first, concurrent]);
  await state.loadDeferredDataEnhancements();
  assert.equal(calls.index, 0, "background supplementation must not build an unrequested advanced index");
  assert.equal(calls.aliases, 0, "background supplementation must not request conflict aliases");
  assert.equal(calls.supplemental, 1, "concurrent and completed supplementation is reused");
  assert.equal(calls.scheduled, open ? 1 : 0, "only an open ranking panel needs post-data batches");
  assert.equal(calls.writes, open ? 1 : 0);
  if (!open) assert.equal(state.deferredGlobalStatsReady, false, "closed rankings must be refreshed on their next open");
}

{
  let open = false;
  let schedules = 0;
  let writes = 0;
  const state = vm.createContext({
    deferredGlobalStatsReady: true, isRankingsPanelOpen: () => open,
    runCriticalGlobalStats() { if (open) writes++; },
    scheduleDeferredGlobalStats(force) { assert.equal(force, true); schedules++; }
  });
  vm.runInContext(block("function refreshGlobalStats()", "function loadScriptOnce("), state);
  state.refreshGlobalStats(); state.refreshGlobalStats();
  assert.equal(schedules, 0, "closed data refreshes do not schedule idle work");
  assert.equal(writes, 0);
  assert.equal(state.deferredGlobalStatsReady, false);
  open = true;
  state.refreshGlobalStats();
  assert.equal(schedules, 1, "open panels retain their refresh path");
  assert.equal(writes, 1);
}

const military = block("const shouldRenderMilitaryDetail =", "const conflictGroups =");
assert.match(military, /if \(shouldRenderMilitaryDetail\) \{\s*await ensureConflictAliasesLoaded\(\);\s*if \(renderToken !== countryPanelRenderToken\) return;/,
  "military detail still loads aliases explicitly and preserves ownership");
assert.match(block("async function loadWikipediaConflictDetails(", "function validateStartupCountryIndex("), /await ensureConflictAliasesLoaded\(\)/,
  "individual conflict detail retains its alias dependency");
console.log("startup-on-demand.test.js ok: no speculative indexes/aliases or closed ranking schedules, explicit consumers retained");
