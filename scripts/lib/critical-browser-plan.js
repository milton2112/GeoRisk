export const CRITICAL_BROWSER_FLOWS = Object.freeze([
  "testPagesBuild", "testCountryTextRendering", "testContentSecurityPolicy", "testUntrustedInputs",
  "testStorageFailures", "testSecureExports", "testShareLifecycle", "testDeferredUiRecovery",
  "testIdleMapPerformance", "testGreenCoding", "testReducedMapMotion", "testAutoRotation",
  "testMapLabels", "testMapEngineStartup", "testControlsStartup", "testCountryOverlayReadiness",
  "testConflictCurationAndLateResponse", "testDetailedMapUpgrade", "testRenderRecovery",
  "testFirstWorkerActivation", "testRequiredStartupData", "testCountryDataRecovery", "testNewsLifecycle",
  "testDeferredWorkDuringDrag", "testBackgroundPanels", "desktop journey", "mobile journey"
]);

export function parseCriticalShard(value) {
  if (value === undefined) return null;
  if (!/^[12]\/2$/.test(value)) throw new Error("Critical shard must be 1/2 or 2/2.");
  return { index: Number(value[0]), total: 2 };
}

export function criticalShardFlows(index) {
  if (index !== 1 && index !== 2) throw new Error("Invalid critical shard index.");
  return CRITICAL_BROWSER_FLOWS.filter((_name, position) => position % 2 === index - 1);
}
