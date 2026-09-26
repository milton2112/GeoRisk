import "./map-performance.test.js";
import "./map-render-recovery.test.js";
import "./map-lifecycle.test.js";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { PUBLIC_FILES } from "../lib/public-assets.js";

const read = file => fs.readFile(new URL("../../" + file, import.meta.url), "utf8");
const script = await read("script.js");
assert.ok(!script.includes("scheduleGeoJsonWarmup"), "sin precalculo especulativo del modo alternativo");
const state = { window: {} };
vm.runInNewContext(await read("app-map.js"), state);
const map = state.window.GeoRiskMap;
for (const mode of ["2d", "3d"]) for (const isMobile of [false, true]) {
  assert.match(map.getGeoJsonPathForMode({ mode, isMobile, near: true, saveData: true }), /simplified/);
  assert.equal(map.shouldDeferDetailedGeometry({ mode, isMobile, zoomBucket: "near", saveData: true }), true);
}
for (const file of ["AGENTS.md", "GREEN_CODING.md", "CONTRIBUTING_INTERNAL.md", ".github/pull_request_template.md"]) {
  assert.ok((await read(file)).length > 0, "politica de contribucion presente: " + file);
  assert.equal(PUBLIC_FILES.includes(file), false, "documentacion interna fuera del build: " + file);
}
assert.match(await read("AGENTS.md"), /GREEN_CODING\.md/);
assert.match(await read("scripts/tests/startup-data.test.js"), /import "\.\/green-coding\.test\.js"/);
console.log("green-coding.test.js ok: Save-Data, no speculative geometry, idle/hidden polling lifecycle");
