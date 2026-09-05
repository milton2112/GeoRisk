export const BROWSER_MEASUREMENT_SOURCE = "chromium-performance-observer-and-cesium-post-render";
const MAX_REUSE_AGE_MS = 6 * 60 * 60 * 1000;
const REQUIRED_CHECKS = [
  "longTasksSupported", "fullWindowObserved", "noDroppedEntries", "activeSampleWithinWindow",
  "canvasRendered", "canvasChanged", "sceneModeMatches", "noPageErrors", "noMissingLocalResources", "noHeavyStartupRequests"
];

export function hasCompleteBrowserMeasurement(measurement) {
  return measurement?.source === BROWSER_MEASUREMENT_SOURCE && measurement.complete === true &&
    ["desktop", "mobile-emulated"].every(name => {
      const profile = measurement.profiles?.find(item => item.name === name);
      return profile?.status === "measured" && profile.observedWindowMs >= 60000 &&
        Number.isInteger(profile.longTasks?.count) && profile.longTasks.count >= 0 &&
        profile.activeRender?.frames > 0 && profile.activeRender.durationMs >= 6000 &&
        Number.isFinite(profile.activeRender.averageFps) &&
        REQUIRED_CHECKS.every(key => profile.checks?.[key] === true) &&
        Object.values(profile.checks).every(value => value === true);
    });
}

export function canReuseBrowserMeasurement(snapshot, key, now = Date.now()) {
  const age = now - Date.parse(snapshot?.browserPerformance?.measuredAt);
  return snapshot?.browserMeasurementKey === key && hasCompleteBrowserMeasurement(snapshot.browserPerformance) &&
    Number.isFinite(age) && age >= 0 && age <= MAX_REUSE_AGE_MS;
}

export function browserPerformanceWarnings(measurement) {
  return (measurement?.profiles || []).flatMap(profile => {
    const warnings = [];
    if (profile.longTasks?.overBudgetCount > 0) {
      warnings.push(`${profile.name}: ${profile.longTasks.overBudgetCount} tareas >200 ms; maxima ${Math.round(profile.longTasks.longestDurationMs)} ms.`);
    }
    const targetFps = profile.activeRender?.targetFps;
    const minimumFps = Number.isFinite(targetFps) && targetFps > 0 ? targetFps * 0.8 : 24;
    if (profile.activeRender?.averageFps != null && profile.activeRender.averageFps < minimumFps) {
      warnings.push(`${profile.name}: render activo ${profile.activeRender.averageFps.toFixed(1)} FPS, umbral ${minimumFps.toFixed(1)}${targetFps ? ` (objetivo ${targetFps})` : ""}.`);
    }
    if (profile.resourceErrors?.length) warnings.push(`${profile.name}: ${profile.resourceErrors.length} recursos con error de red/HTTP.`);
    return warnings;
  });
}
