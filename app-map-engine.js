(() => {
  const loaderUrl = new URL(document.currentScript.src);
  const engineUrl = new URL("./vendor/cesium/engine.js", loaderUrl);
  engineUrl.search = loaderUrl.search;
  let pending = null;
  let phase = "idle";

  function language() {
    try {
      return localStorage.getItem("geo-risk-language") === "en" ? "en" : "es";
    } catch {
      return document.documentElement.lang === "en" ? "en" : "es";
    }
  }

  function load({
    importer = () => import(engineUrl.href),
    onSlow = () => {}, warningMs = 7000, timeoutMs = 30000
  } = {}) {
    if (pending) return pending;
    phase = "loading";
    pending = new Promise((resolve, reject) => {
      let settled = false;
      let warningTimer;
      let deadlineTimer;
      const finish = (engine, error) => {
        if (settled) return;
        settled = true;
        clearTimeout(warningTimer);
        clearTimeout(deadlineTimer);
        phase = error ? "failed" : "ready";
        if (error) reject(error);
        else {
          window.Cesium = engine;
          resolve(engine);
        }
      };
      warningTimer = setTimeout(() => {
        if (settled) return;
        phase = "slow";
        try { onSlow(); } catch (error) { console.warn("GeoRisk loading notice:", error); }
      }, warningMs);
      deadlineTimer = setTimeout(() => finish(null, new Error(language() === "en"
        ? "The map engine is taking too long. Check your connection and reload."
        : "El motor del mapa esta tardando demasiado. Revisa tu conexion y recarga.")), timeoutMs);
      // Import cannot be cancelled. A late settlement must not restart a failed page.
      Promise.resolve().then(importer).then(engine => {
        if (typeof engine?.Viewer !== "function" || !engine?.SceneMode || !engine?.GeoJsonDataSource) {
          finish(null, new Error(language() === "en"
            ? "The map engine is incomplete. Reload to try again."
            : "El motor del mapa esta incompleto. Recarga para reintentar."));
          return;
        }
        finish(engine);
      }, cause => finish(null, new Error(language() === "en"
        ? "The map engine could not be downloaded. Check your connection and reload."
        : "No se pudo descargar el motor del mapa. Revisa tu conexion y recarga.", { cause })));
    });
    return pending;
  }

  window.GeoRiskMapEngine = { load, language, url: engineUrl.href, getState: () => ({ phase }) };
})();
