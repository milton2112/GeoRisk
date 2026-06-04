(() => {
  function getHoverSampleWindow({ isMobile = false, mode = "3d", reducedMotion = false } = {}) {
    if (isMobile) {
      return reducedMotion ? 140 : 96;
    }
    return mode === "2d" ? 64 : 34;
  }

  function shouldEnableHover({ isMobile = false, mode = "3d", preset = {}, isNavigating = false, qualityPreset = "auto", suppressedUntil = 0, now = Date.now() } = {}) {
    if (isMobile || mode === "2d" || isNavigating || qualityPreset === "performance") {
      return false;
    }
    return Boolean(preset.hoverEnabled) && now >= suppressedUntil;
  }

  function getNavigationTuning({ mode = "3d", isMobile = false } = {}) {
    return {
      inertiaSpin: isMobile ? 0.52 : 0.76,
      inertiaTranslate: mode === "2d" ? (isMobile ? 0.055 : 0.1) : (isMobile ? 0.44 : 0.7),
      inertiaZoom: mode === "2d" ? (isMobile ? 0.055 : 0.1) : (isMobile ? 0.4 : 0.58),
      maximumMovementRatio: mode === "2d" ? (isMobile ? 0.055 : 0.095) : (isMobile ? 0.13 : 0.16)
    };
  }

  function shouldDisableLabelsForFps({ fps = 60, isMobile = false, tier = "medium", mode = "3d" } = {}) {
    if (mode !== "3d") {
      return false;
    }
    const threshold = isMobile ? 18 : tier === "low" ? 16 : tier === "medium" ? 18 : 20;
    return fps < threshold;
  }

  window.GeoRiskMapInteractions = {
    getHoverSampleWindow,
    getNavigationTuning,
    shouldDisableLabelsForFps,
    shouldEnableHover
  };
})();
