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

  function createFpsQualityMonitor() {
    let signature = null;
    let startedAt = 0;
    let frames = 0;
    let rollingFps = null;
    let lowWindows = 0;
    let highWindows = 0;
    let criticalWindows = 0;
    const eligible = context => context.visible && context.navigating && !context.transitioning;
    const key = context => [eligible(context), context.mode, context.qualityPreset,
      context.targetFrameRate, context.isMobile, context.tier].join(":");

    function reset(context, now) {
      signature = key(context);
      startedAt = now;
      frames = 0;
      rollingFps = null;
      lowWindows = highWindows = criticalWindows = 0;
    }

    function sync(context, now) {
      if (signature !== key(context)) reset(context, now);
      return eligible(context);
    }

    function recordFrame(context, now) {
      if (sync(context, now)) frames += 1;
    }

    function sample(context, now) {
      if (!sync(context, now)) return null;
      const elapsed = now - startedAt;
      // Only uninterrupted motion is comparable to the renderer's FPS limit.
      if (elapsed < 2000) return null;
      if (elapsed > 5000) {
        reset(context, now);
        return null;
      }
      const fps = frames * 1000 / elapsed;
      frames = 0;
      startedAt = now;
      rollingFps = rollingFps === null ? fps : rollingFps * 0.62 + fps * 0.38;
      const target = context.targetFrameRate;
      const low = Math.min(target * 0.8, context.isMobile ? 18 : context.tier === "low" ? 15 : context.tier === "medium" ? 18 : 20);
      const critical = Math.min(target * 0.3, context.isMobile || context.tier === "low" ? 7 : 9);
      lowWindows = rollingFps < low ? lowWindows + 1 : 0;
      highWindows = rollingFps >= target * 0.9 ? highWindows + 1 : 0;
      criticalWindows = context.mode === "3d" && rollingFps < critical ? criticalWindows + 1 : 0;
      let action = null;
      if (context.qualityPreset === "auto") {
        if (criticalWindows >= 3) {
          action = "fallback";
          criticalWindows = lowWindows = 0;
        } else if (lowWindows >= 2) {
          action = "reduce";
          lowWindows = 0;
        } else if (highWindows >= 3) {
          action = "recover";
          highWindows = 0;
        }
      }
      return { fps, rollingFps, action };
    }

    return { reset, recordFrame, sample };
  }

  window.GeoRiskMapInteractions = {
    createFpsQualityMonitor,
    getHoverSampleWindow,
    getNavigationTuning,
    shouldDisableLabelsForFps,
    shouldEnableHover
  };
})();
