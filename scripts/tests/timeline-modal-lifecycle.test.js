import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const script = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
function block(start, end) {
  const offset = script.indexOf(start);
  assert.ok(offset >= 0 && script.indexOf(end, offset) > offset);
  return script.slice(offset, script.indexOf(end, offset));
}

const modal = { hidden: true };
const body = { innerHTML: "" };
let builds = 0;
let syncs = 0;
const state = {
  timelineModalCounter: 0, timelineModalRegistry: new Map(), currentLanguage: "es",
  curatedTimelineDetailOverrides: {}, TIMELINE_DETAIL_OVERRIDES: {},
  document: { getElementById: id => id === "timeline-modal" ? modal : body },
  formatHistoricalYear: value => String(value),
  getTimelineCategoryLabel: key => state.currentLanguage + ":" + key,
  getTimelineCentury: () => state.currentLanguage + ":century",
  getTimelineIntensity: () => "alta", getTimelineRelevance: () => "media",
  getTimelineIntensityLabel: value => state.currentLanguage + ":" + value,
  getTimelineRelevanceLabel: value => state.currentLanguage + ":" + value,
  escapeHtml: value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"),
  renderRelationChips: values => values.map(value => state.escapeHtml(value)).join("|"),
  renderList: values => values.map(value => state.escapeHtml(value)).join("|"),
  syncModalOpenState: () => { syncs += 1; }
};
vm.createContext(state);
vm.runInContext(block("function getTimelineDetailContent", "function registerTimelineModal"), state);
const build = state.getTimelineDetailContent;
state.getTimelineDetailContent = (...args) => { builds += 1; return build(...args); };
vm.runInContext(block("function registerTimelineModal", "const MODAL_IDS"), state);

const item = { year: 1853, categoryKey: "constitution", reference: "Recorded event", text: "Recorded text", references: ["Source A"], relatedConflicts: ["Conflict A"] };
for (let i = 0; i < 1000; i += 1) state.registerTimelineModal(item, "Country context");
assert.equal(builds, 0, "registering timeline links must not construct unopened detail models");
assert.equal(state.timelineModalRegistry.size, 1000);
const entry = state.timelineModalRegistry.get("timeline-1");
assert.equal(entry.item, item);
assert.deepEqual(Object.keys(entry).sort(), ["contextLabel", "item"]);
state.openTimelineModal("timeline-1");
assert.equal(builds, 1);
assert.equal(modal.hidden, false);
assert.match(body.innerHTML, /Recorded text/);
assert.match(body.innerHTML, /Country context/);
assert.match(body.innerHTML, /es:constitution/);
assert.match(body.innerHTML, /Source A/);
assert.match(body.innerHTML, /Conflict A/);
state.closeTimelineModal();
assert.equal(body.innerHTML, "");

const payload = '<img src=x onerror="probe()">';
state.currentLanguage = "en";
state.curatedTimelineDetailOverrides = { "Recorded event": { title: "Updated event", detail: payload, significance: "Updated significance" } };
state.openTimelineModal("timeline-1");
assert.equal(builds, 2);
assert.match(body.innerHTML, /Updated event/);
assert.match(body.innerHTML, /Updated significance/);
assert.match(body.innerHTML, /en:constitution/);
assert.match(body.innerHTML, /Historical timeline event/);
assert.match(body.innerHTML, /&lt;img src=x onerror=&quot;probe\(\)&quot;&gt;/);
assert.ok(!body.innerHTML.includes(payload), "late curation remains escaped plain text");
assert.deepEqual(Object.keys(entry).sort(), ["contextLabel", "item"], "opening does not retain a display snapshot");

state.TIMELINE_DETAIL_OVERRIDES = { "Recorded event": { detail: "Base reference detail" }, "Recorded text": { detail: "Base text detail" } };
state.curatedTimelineDetailOverrides = { "Recorded text": { detail: "Curated text detail" } };
assert.equal(build(item).detail, "Base reference detail", "reference lookup keeps priority over text lookup");
delete state.TIMELINE_DETAIL_OVERRIDES["Recorded event"];
assert.equal(build(item).detail, "Curated text detail");
state.curatedTimelineDetailOverrides["Recorded event"] = { detail: "Curated reference detail" };
assert.equal(build(item).detail, "Curated reference detail");
state.curatedTimelineDetailOverrides = {};
assert.equal(build(item).detail, "Base text detail", "replacing the curation table does not leave copied overrides behind");
assert.equal(build({ ...item, contextLabel: "Event context" }, "Country context").region, "Event context");
state.curatedTimelineDetailOverrides = { "Revolucion de Mayo": { detail: "Recorded curated detail" } };
assert.equal(build({ ...item, reference: "Revoluci\u00f3n de Mayo" }).detail, "Recorded curated detail", "accented references resolve existing unaccented curation keys");
state.curatedTimelineDetailOverrides["Revoluci\u00f3n de Mayo"] = { detail: "Exact recorded detail" };
assert.equal(build({ ...item, reference: "Revoluci\u00f3n de Mayo" }).detail, "Exact recorded detail", "an exact key wins over its accent fallback");
assert.equal(build({ ...item, reference: "Unknown event", text: "Revoluci\u00f3n de Mayo" }).detail, "Exact recorded detail");
state.curatedTimelineDetailOverrides = {};

state.timelineModalRegistry.set("legacy", { title: "Legacy model", year: "1853", category: "Recorded category", intensity: "Recorded impact", relevance: "Recorded relevance", detail: "Legacy detail", significance: "Legacy significance" });
state.openTimelineModal("legacy");
assert.equal(builds, 2, "legacy direct models stay compatible without construction");
assert.match(body.innerHTML, /Legacy detail/);
const previousHtml = body.innerHTML;
const previousSyncs = syncs;
state.openTimelineModal("missing");
state.document.getElementById = () => null;
state.openTimelineModal("timeline-1");
assert.equal(builds, 2, "missing entries/DOM do not construct models");
assert.equal(body.innerHTML, previousHtml);
assert.equal(syncs, previousSyncs);

state.CURATED_TIMELINE_EXTRAS = { AAA: [{ year: 1800, category: "constitucion", text: "Base event" }] };
state.curatedTimelineExtras = {};
state.getCountryCodeByObject = country => country.code;
state.getConflictsSinceFormation = () => [];
state.normalizeConflictForDisplay = value => value;
state.normalizeText = value => String(value).toLowerCase();
state.toDisplayTitleCase = value => value;
state.timelineConflictUi = {};
vm.runInContext(block("function buildTimeline(country)", "function buildAggregateTimeline"), state);
assert.equal(state.buildTimeline({ code: "AAA", name: "Country" })[0].text, "Base event");
state.curatedTimelineExtras = { AAA: [{ year: 1900, category: "constitucion", text: "Late curated event" }] };
const lateItems = state.buildTimeline({ code: "AAA", name: "Country" });
assert.equal(lateItems.length, 1, "late curation replaces the base country extras rather than concatenating duplicates");
assert.equal(lateItems[0].text, "Late curated event");
assert.equal(lateItems[0].year, 1900);
state.curatedTimelineExtras.AAA = [];
assert.equal(state.buildTimeline({ code: "AAA", name: "Country" }).length, 0, "explicitly empty curated extras stay empty");
state.curatedTimelineExtras = {};
assert.equal(state.buildTimeline({ code: "AAA", name: "Country" })[0].text, "Base event");
assert.equal(state.buildTimeline({ code: "BBB", name: "Other country" }).length, 0);
assert.equal(builds, 2, "building the list never prepares event modal models");
assert.ok(!script.includes("Object.assign(CURATED_TIMELINE_EXTRAS, curatedTimelineExtras)"));
assert.ok(!script.includes("Object.assign(TIMELINE_DETAIL_OVERRIDES, curatedTimelineDetailOverrides)"));

console.log("timeline-modal-lifecycle.test.js ok: lazy models, current curation/language, lookup precedence, escaping and guards");
