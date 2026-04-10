function getDeviceProfile({ isMobile, currentMapMode, deviceMemory = 4, hardwareConcurrency = 4 }) {
  const lowEnd = isMobile || deviceMemory <= 4 || hardwareConcurrency <= 4;
  const midRange = !lowEnd && (deviceMemory <= 8 || hardwareConcurrency <= 8);
  const mode2d = currentMapMode === "2d";

  if (lowEnd) {
    return {
      constrained: true,
      tier: "low",
      targetFrameRate: mode2d ? (isMobile ? 20 : 28) : (isMobile ? 18 : 24),
      resolutionScale: mode2d ? (isMobile ? 0.46 : 0.68) : (isMobile ? 0.8 : 0.94),
      maximumScreenSpaceError: mode2d ? (isMobile ? 11.4 : 7.2) : (isMobile ? 5.4 : 2.8),
      tileCacheSize: mode2d ? (isMobile ? 24 : 64) : (isMobile ? 90 : 180),
      loadingDescendantLimit: mode2d ? (isMobile ? 2 : 5) : (isMobile ? 8 : 14),
      enableFxaa: false,
      preloadAncestors: false,
      preloadSiblings: false
    };
  }

  if (midRange) {
    return {
      constrained: false,
      tier: "medium",
      targetFrameRate: mode2d ? 32 : 30,
      resolutionScale: mode2d ? 0.72 : 1.02,
      maximumScreenSpaceError: mode2d ? 5.8 : 2.2,
      tileCacheSize: mode2d ? 96 : 220,
      loadingDescendantLimit: mode2d ? 6 : 18,
      enableFxaa: !mode2d,
      preloadAncestors: !mode2d,
      preloadSiblings: !mode2d
    };
  }

  return {
    constrained: false,
    tier: "high",
    targetFrameRate: mode2d ? 34 : 32,
    resolutionScale: mode2d ? 0.78 : 1.1,
    maximumScreenSpaceError: mode2d ? 5.2 : 1.9,
    tileCacheSize: mode2d ? 104 : 280,
    loadingDescendantLimit: mode2d ? 7 : 22,
    enableFxaa: !mode2d,
    preloadAncestors: !mode2d,
    preloadSiblings: !mode2d
  };
}

function getRenderProfileText({ language = "es", isMobile, currentMapMode, resolutionScale }) {
  if (isMobile) {
    return language === "en"
      ? `Mobile ${currentMapMode.toUpperCase()} · optimized`
      : `Mobile ${currentMapMode.toUpperCase()} · optimizado`;
  }

  if (resolutionScale >= 0.9) {
    return language === "en"
      ? `${currentMapMode.toUpperCase()} · high quality`
      : `${currentMapMode.toUpperCase()} · alta calidad`;
  }

  if (resolutionScale >= 0.72) {
    return language === "en"
      ? `${currentMapMode.toUpperCase()} · balanced`
      : `${currentMapMode.toUpperCase()} · balanceado`;
  }

  return language === "en"
    ? `${currentMapMode.toUpperCase()} · performance`
    : `${currentMapMode.toUpperCase()} · rendimiento`;
}

window.GeoRiskRuntime = {
  getDeviceProfile,
  getRenderProfileText
};
