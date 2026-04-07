function getDeviceProfile({ isMobile, currentMapMode, deviceMemory = 4, hardwareConcurrency = 4 }) {
  const constrained = isMobile || deviceMemory <= 4 || hardwareConcurrency <= 4;
  const mode2d = currentMapMode === "2d";

  if (constrained) {
    return {
      constrained: true,
      targetFrameRate: mode2d ? (isMobile ? 18 : 26) : (isMobile ? 18 : 24),
      resolutionScale: mode2d ? (isMobile ? 0.52 : 0.74) : (isMobile ? 0.8 : 0.94),
      maximumScreenSpaceError: mode2d ? (isMobile ? 9.6 : 6.1) : (isMobile ? 5.4 : 2.8),
      tileCacheSize: mode2d ? (isMobile ? 36 : 88) : (isMobile ? 90 : 180),
      loadingDescendantLimit: mode2d ? (isMobile ? 3 : 7) : (isMobile ? 8 : 14),
      enableFxaa: false,
      preloadAncestors: false,
      preloadSiblings: false
    };
  }

  return {
    constrained: false,
    targetFrameRate: mode2d ? 32 : 32,
    resolutionScale: mode2d ? 0.86 : 1.1,
    maximumScreenSpaceError: mode2d ? 4.4 : 1.9,
    tileCacheSize: mode2d ? 132 : 280,
    loadingDescendantLimit: mode2d ? 9 : 22,
    enableFxaa: true,
    preloadAncestors: true,
    preloadSiblings: true
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
