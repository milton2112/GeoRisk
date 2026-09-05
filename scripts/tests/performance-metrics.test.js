import assert from "node:assert/strict";
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
      canvasRendered: true, canvasChanged: true, sceneModeMatches: true, noPageErrors: true, noMissingLocalResources: true, noHeavyStartupRequests: true
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
console.log("performance-metrics.test.js ok");
