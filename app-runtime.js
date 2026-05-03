function getDeviceProfile({ isMobile, currentMapMode, deviceMemory = 4, hardwareConcurrency = 4 }) {
  const lowEnd = isMobile || deviceMemory <= 4 || hardwareConcurrency <= 4;
  const midRange = !lowEnd && (deviceMemory <= 8 || hardwareConcurrency <= 8);
  const mode2d = currentMapMode === "2d";

  if (lowEnd) {
    return {
      constrained: true,
      tier: "low",
      targetFrameRate: mode2d ? (isMobile ? 22 : 30) : (isMobile ? 20 : 26),
      resolutionScale: mode2d ? (isMobile ? 0.5 : 0.72) : (isMobile ? 0.82 : 0.98),
      maximumScreenSpaceError: mode2d ? (isMobile ? 10.8 : 6.8) : (isMobile ? 4.9 : 2.6),
      tileCacheSize: mode2d ? (isMobile ? 24 : 64) : (isMobile ? 90 : 180),
      loadingDescendantLimit: mode2d ? (isMobile ? 2 : 5) : (isMobile ? 8 : 14),
      enableFxaa: false,
      preloadAncestors: false,
      preloadSiblings: false,
      hoverEnabled: false,
      geoJsonPrecision: mode2d ? 2 : 4,
      geoJsonCoordinateStep: mode2d ? (isMobile ? 4 : 3) : (isMobile ? 2 : 1),
      maxPreparedGeoJsonEntries: mode2d ? 1 : 2
    };
  }

  if (midRange) {
    return {
      constrained: false,
      tier: "medium",
      targetFrameRate: mode2d ? 34 : 31,
      resolutionScale: mode2d ? 0.76 : 1.05,
      maximumScreenSpaceError: mode2d ? 5.4 : 2.05,
      tileCacheSize: mode2d ? 108 : 236,
      loadingDescendantLimit: mode2d ? 7 : 19,
      enableFxaa: !mode2d,
      preloadAncestors: !mode2d,
      preloadSiblings: !mode2d,
      hoverEnabled: !mode2d,
      geoJsonPrecision: mode2d ? 3 : 5,
      geoJsonCoordinateStep: mode2d ? 2 : 1,
      maxPreparedGeoJsonEntries: 3
    };
  }

  return {
    constrained: false,
    tier: "high",
    targetFrameRate: mode2d ? 36 : 34,
    resolutionScale: mode2d ? 0.82 : 1.12,
    maximumScreenSpaceError: mode2d ? 4.9 : 1.75,
    tileCacheSize: mode2d ? 120 : 320,
    loadingDescendantLimit: mode2d ? 8 : 24,
    enableFxaa: !mode2d,
    preloadAncestors: !mode2d,
    preloadSiblings: !mode2d,
    hoverEnabled: !mode2d,
    geoJsonPrecision: mode2d ? 3 : 6,
    geoJsonCoordinateStep: 1,
    maxPreparedGeoJsonEntries: 4
  };
}

function getRenderProfileText({ language = "es", isMobile, currentMapMode, resolutionScale }) {
  if (isMobile) {
    return language === "en"
      ? `Mobile ${currentMapMode.toUpperCase()} - optimized`
      : `Mobile ${currentMapMode.toUpperCase()} - optimizado`;
  }

  if (resolutionScale >= 0.9) {
    return language === "en"
      ? `${currentMapMode.toUpperCase()} - high quality`
      : `${currentMapMode.toUpperCase()} - alta calidad`;
  }

  if (resolutionScale >= 0.72) {
    return language === "en"
      ? `${currentMapMode.toUpperCase()} - balanced`
      : `${currentMapMode.toUpperCase()} - balanceado`;
  }

  return language === "en"
    ? `${currentMapMode.toUpperCase()} - performance`
    : `${currentMapMode.toUpperCase()} - rendimiento`;
}

window.GeoRiskRuntime = {
  getDeviceProfile,
  getRenderProfileText
};
