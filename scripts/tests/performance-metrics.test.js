import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs/promises";
import { verifyCanvasMotion } from "../lib/browser-performance.js";
import { summarizeLongTasks, summarizeRenderFrames } from "../lib/performance-metrics.js";
import { BROWSER_MEASUREMENT_SOURCE, hasCompleteBrowserMeasurement, canReuseBrowserMeasurement, browserPerformanceWarnings } from "../lib/performance-evidence.js";

const tasks = summarizeLongTasks([{ duration: 50 }, { duration: 200 }, { duration: 240 }, { duration: NaN }]);
assert.equal(tasks.count, 3);
assert.equal(tasks.overBudgetCount, 1);
assert.equal(tasks.totalBlockingTimeMs, 340);
assert.equal(tasks.longestDurationMs, 240);
assert.equal(summarizeLongTasks([]).longestDurationMs, 0);

const active = summarizeRenderFrames([90, 100, 200, 300, 900, 1200], 100, 1100);
assert.equal(active.frames, 4);
assert.equal(active.averageFps, 4);
assert.equal(active.longestFrameGapMs, 600);
assert.equal(summarizeRenderFrames([], 0, 1000).longestFrameGapMs, 1000);
assert.equal(summarizeRenderFrames([], 0, 0).averageFps, null);

const measuredAt = "2026-09-05T12:00:00.000Z";
const measurement = {
  source: BROWSER_MEASUREMENT_SOURCE, complete: true, measuredAt,
  profiles: ["desktop", "mobile-emulated"].map(name => ({
    name, status: "measured", observedWindowMs: 60001,
    longTasks: tasks, activeRender: { durationMs: 6000, frames: 60, averageFps: 10 },
    checks: {
      longTasksSupported: true, fullWindowObserved: true, noDroppedEntries: true, activeSampleWithinWindow: true,
      canvasRendered: true, canvasChanged: true, canvasVerificationOutsideWindow: true, sceneModeMatches: true, noPageErrors: true, noMissingLocalResources: true, noHeavyStartupRequests: true
    }
  }))
};
assert.equal(hasCompleteBrowserMeasurement(measurement), true);
assert.equal(hasCompleteBrowserMeasurement({ ...measurement, source: "simulated" }), false);
assert.equal(hasCompleteBrowserMeasurement({ ...measurement, profiles: measurement.profiles.slice(0, 1) }), false);
const failed = structuredClone(measurement);
failed.profiles[0].checks.noHeavyStartupRequests = false;
assert.equal(hasCompleteBrowserMeasurement(failed), false);
const incomplete = structuredClone(measurement);
delete incomplete.profiles[0].checks.noPageErrors;
assert.equal(hasCompleteBrowserMeasurement(incomplete), false);
incomplete.profiles[0].checks.noPageErrors = true;
incomplete.profiles[0].observedWindowMs = 59999.9;
assert.equal(hasCompleteBrowserMeasurement(incomplete), false);
incomplete.profiles[0].observedWindowMs = 60000;
incomplete.profiles[0].activeRender.durationMs = 5999;
assert.equal(hasCompleteBrowserMeasurement(incomplete), false);
assert.equal(hasCompleteBrowserMeasurement(null), false);
const snapshot = { browserMeasurementKey: "build-a", browserPerformance: measurement };
const now = Date.parse(measuredAt);
assert.equal(canReuseBrowserMeasurement(snapshot, "build-a", now + 60000), true);
assert.equal(canReuseBrowserMeasurement(snapshot, "build-b", now), false);
assert.equal(canReuseBrowserMeasurement(snapshot, "build-a", now + 7 * 3600000), false);
assert.equal(canReuseBrowserMeasurement(snapshot, "build-a", now - 1), false);
assert.equal(canReuseBrowserMeasurement(null, "build-a", now), false);
assert.equal(browserPerformanceWarnings(measurement).length, 4);
const capped = { profiles: [{ name: "mobile-emulated", activeRender: { averageFps: 22, targetFps: 22 } }] };
assert.equal(browserPerformanceWarnings(capped).length, 0, "respetar un limite intencional de FPS no es degradacion");
capped.profiles[0].activeRender.averageFps = 15;
assert.equal(browserPerformanceWarnings(capped).length, 1, "caer por debajo del objetivo debe advertirse");
const wrongMode = structuredClone(measurement);
wrongMode.profiles[1].checks.sceneModeMatches = false;
assert.equal(hasCompleteBrowserMeasurement(wrongMode), false, "un modo declarado incorrecto invalida la muestra");
const contaminated = structuredClone(measurement);
contaminated.profiles[0].checks.canvasVerificationOutsideWindow = false;
assert.equal(hasCompleteBrowserMeasurement(contaminated), false, "la lectura GPU no puede contaminar la medicion");
const meterSource = await fs.readFile(new URL("../lib/browser-performance.js", import.meta.url), "utf8");
const timingSource = meterSource.slice(meterSource.indexOf("async function measureProfile"), meterSource.indexOf("const canvasVerification ="));
assert.ok(!timingSource.includes("readPixels"), "el muestreo de FPS y long tasks no debe leer la GPU");

async function testCanvasProbe({ endedAt = 60000, activeEnd = 7000, blank = false, frozen = false, rendering = true } = {}) {
  let listener;
  let moves = 0;
  let reads = 0;
  let removed = 0;
  let now = 60001;
  const gl = { RGBA: 1, UNSIGNED_BYTE: 1, readPixels(x, y, w, h, format, type, pixel) {
    reads += 1;
    pixel.set(blank ? [0, 0, 0, 255] : [x % 255, y % 255, frozen ? 0 : moves, 255]);
  } };
  const scene = {
    mode: 2, canvas: { width: 390, height: 844, getContext: () => gl },
    postRender: { addEventListener(callback) { listener = callback; return () => { removed += 1; listener = null; }; } },
    requestRender() { if (rendering) setTimeout(() => { now += 16; listener?.(); }, 0); }
  };
  const context = vm.createContext({
    window: { __geoRiskPerformanceProbe: { endedAt, activeEnd } },
    viewer: { scene, camera: { moveRight: () => moves++, rotateRight: () => moves++ } },
    Cesium: { SceneMode: { SCENE2D: 2 } }, performance: { now: () => now }, setTimeout, clearTimeout, Uint8Array
  });
  const result = await vm.runInContext(`(${verifyCanvasMotion.toString()})({ windowMs: 60000, timeoutMs: 80 })`, context);
  assert.equal(removed, 1, "la verificacion debe retirar el listener incluso sin renders");
  return { result, reads };
}
await assert.rejects(testCanvasProbe({ endedAt: null }), /after the timing window/);
await assert.rejects(testCanvasProbe({ activeEnd: 60001 }), /after the timing window/);
const canvas = await testCanvasProbe();
assert.equal(canvas.result.nonblankCanvas, true);
assert.equal(canvas.result.changingCanvas, true);
assert.equal(canvas.result.samples, 2);
assert.equal(canvas.reads, 30);
assert.ok(canvas.result.startedAt >= 60000);
assert.equal((await testCanvasProbe({ frozen: true })).result.changingCanvas, false);
assert.equal((await testCanvasProbe({ blank: true })).result.nonblankCanvas, false);
assert.equal((await testCanvasProbe({ rendering: false })).result.samples, 0);
console.log("performance-metrics.test.js ok");
