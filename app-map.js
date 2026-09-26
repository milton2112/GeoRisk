(() => {
  const MODE_2D = "2d";
  const MODE_3D = "3d";

  function normalizeMapMode(mode) {
    return mode === MODE_2D ? MODE_2D : MODE_3D;
  }

  function getGeoJsonPathForMode({ mode = MODE_3D, bootPhase = false, isMobile = false, near = false, saveData = false } = {}) {
    const normalizedMode = normalizeMapMode(mode);
    if (normalizedMode === MODE_2D || bootPhase || isMobile || saveData || !near) {
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

  function shouldDeferDetailedGeometry({ mode = MODE_3D, isMobile = false, zoomBucket = "far", bootPhase = false, saveData = false } = {}) {
    return normalizeMapMode(mode) === MODE_2D || isMobile || bootPhase || saveData || zoomBucket !== "near";
  }

  const dataSourceFrameWaits = new WeakMap();

  function waitForDataSourceFrame({ viewer, source, isCurrent = () => true, timeoutMs = 20000 }) {
    const scene = viewer?.scene;
    const display = viewer?.dataSourceDisplay;
    if (!source || typeof display?.update !== "function" || !scene?.postRender ||
        typeof scene.requestRender !== "function" || typeof viewer.dataSources?.contains !== "function") {
      return Promise.reject(new Error("Country renderer unavailable."));
    }
    const pending = dataSourceFrameWaits.get(display);
    if (pending) return pending.source === source ? pending.promise : Promise.reject(new Error("Another country renderer is pending."));
    const promise = new Promise((resolve, reject) => {
      const originalUpdate = display.update;
      const hadOwnUpdate = Object.hasOwn(display, "update");
      let ready = false;
      let settled = false;
      let timer;
      // Cesium's .ready stays true after an empty scene. Use the live update result.
      function trackUpdate(...args) {
        try {
          const result = originalUpdate.apply(this, args);
          if (this === display) ready = result === true;
          return result;
        } catch (error) {
          finish(error);
          throw error;
        }
      }
      function finish(error) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        scene.postRender.removeEventListener(onFrame);
        scene.renderError?.removeEventListener(onError);
        if (display.update === trackUpdate) {
          if (hadOwnUpdate) display.update = originalUpdate;
          else delete display.update;
        }
        if (error) reject(error);
        else resolve(source);
      }
      function onError(_scene, error) {
        finish(new Error("Country renderer failed.", { cause: error }));
      }
      function onFrame() {
        try {
          if (viewer.isDestroyed?.() || viewer.useDefaultRenderLoop === false || !isCurrent() ||
              source.show === false || !viewer.dataSources.contains(source)) {
            finish(new Error("Country renderer changed before the first complete frame."));
            return;
          }
          if (ready) finish();
          else scene.requestRender();
        } catch (error) {
          finish(error);
        }
      }
      display.update = trackUpdate;
      scene.postRender.addEventListener(onFrame);
      scene.renderError?.addEventListener(onError);
      timer = setTimeout(() => finish(new Error("Country rendering timed out.")), timeoutMs);
      try { scene.requestRender(); } catch (error) { finish(error); }
    });
    const tracked = promise.finally(() => dataSourceFrameWaits.delete(display));
    dataSourceFrameWaits.set(display, { source, promise: tracked });
    return tracked;
  }

  window.GeoRiskMap = {
    MODE_2D,
    MODE_3D,
    createDegradationLog,
    getGeoJsonPathForMode,
    getReducedPerformanceLabel,
    getTransitionPlan,
    normalizeMapMode,
    shouldDeferDetailedGeometry,
    waitForDataSourceFrame
  };
})();
