import assert from "node:assert/strict";
import { getCountrySectionDescriptors, getDefaultTimelineFilters, buildConflictSummary } from "../lib/ui-logic.js";

const sectionsEs = getCountrySectionDescriptors("es");
const sectionsEn = getCountrySectionDescriptors("en");
const defaults = getDefaultTimelineFilters();
const summary = buildConflictSummary([
  { ongoing: true, battles: [{}, {}] },
  { ongoing: false, battles: [{}] }
]);

assert.equal(sectionsEs.length, 8);
assert.equal(sectionsEs[1].label, "Historia");
assert.equal(sectionsEn[1].label, "History");
assert.deepEqual(defaults, {
  timelineFilter: "all",
  timelineCentury: "all",
  timelineIntensity: "all",
  timelineRelevance: "all",
  conflictFilter: "all"
});
assert.deepEqual(summary, { wars: 2, battles: 3, ongoing: 1 });

console.log("modal-render.test.js ok");
