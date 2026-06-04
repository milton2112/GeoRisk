(() => {
  const MODE_2D = "2d";
  const MODE_3D = "3d";

  function normalizeMapMode(mode) {
    return mode === MODE_2D ? MODE_2D : MODE_3D;
  }

  function getGeoJsonPathForMode({ mode = MODE_3D, bootPhase = false, isMobile = false, near = false } = {}) {
    const normalizedMode = normalizeMapMode(mode);
    if (normalizedMode === MODE_2D || bootPhase || isMobile || !near) {
      return "./data/world_countries_simplified.geo.json";
    }
    return "./data/world_countries.geo.json";
  }

  function getTransitionPlan({ from = MODE_3D, to = MODE_2D, animate = true, isMobile = false } = {}) {
    const target = normalizeMapMode(to);
    if (!animate) {
      return { mode: target, duration: 0, settleMs: 0 };
    }
    const duration = target === MODE_2D
      ? (isMobile ? 0.36 : 0.5)
      : (isMobile ? 0.52 : 0.72);
    return {
      mode: target,
      duration,
      settleMs: Math.round((duration * 1000) + (target === MODE_2D ? 90 : 130)),
      previousMode: normalizeMapMode(from)
    };
  }

  function createDegradationLog(limit = 24) {
    const entries = [];
    return {
      add(reason, details = {}) {
        const entry = {
          at: new Date().toISOString(),
          reason,
          ...details
        };
        entries.unshift(entry);
        entries.length = Math.min(entries.length, limit);
        return entry;
      },
      list() {
        return entries.slice();
      },
      count() {
        return entries.length;
      }
    };
  }

  function getReducedPerformanceLabel({ language = "es", active = false, reason = "" } = {}) {
    if (!active) {
      return language === "en" ? "Adaptive render" : "Render adaptativo";
    }
    const suffix = reason ? `: ${reason}` : "";
    return language === "en" ? `Reduced performance mode${suffix}` : `Modo rendimiento reducido${suffix}`;
  }

  function shouldDeferDetailedGeometry({ mode = MODE_3D, isMobile = false, zoomBucket = "far", bootPhase = false } = {}) {
    return normalizeMapMode(mode) === MODE_2D || isMobile || bootPhase || zoomBucket !== "near";
  }

  window.GeoRiskMap = {
    MODE_2D,
    MODE_3D,
    createDegradationLog,
    getGeoJsonPathForMode,
    getReducedPerformanceLabel,
    getTransitionPlan,
    normalizeMapMode,
    shouldDeferDetailedGeometry
  };
})();
