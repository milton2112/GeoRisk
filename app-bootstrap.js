(() => {
  window.CESIUM_BASE_URL = "https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/";
  window.GeoRiskMapEngineReady = window.GeoRiskMapEngine
    ? window.GeoRiskMapEngine.load({ onSlow() {
      const text = document.getElementById("startup-status-text");
      if (text) text.textContent = window.GeoRiskMapEngine.language() === "en"
        ? "The map engine is taking longer to download. Still waiting..."
        : "La descarga del motor del mapa esta tardando. Seguimos esperando...";
    } })
    : Promise.reject(new Error("No se pudo cargar el inicio del mapa. Revisa tu conexion y recarga."));
  // Handle early rejection while script.js is loading; init still receives the failure.
  window.GeoRiskMapEngineReady.catch(error => {
    const status = document.getElementById("startup-status");
    if (status) status.hidden = true;
    const banner = document.getElementById("fatal-error-banner");
    if (!banner) return;
    banner.hidden = false;
    banner.textContent = error.message;
    const reload = document.createElement("a");
    reload.href = window.location.href;
    reload.textContent = window.GeoRiskMapEngine?.language() === "en" ? "Reload" : "Recargar";
    banner.append(reload);
  });

  // Image errors do not bubble; capture also covers dynamically rendered profiles.
  document.addEventListener("error", event => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) return;
    if (image.classList.contains("flag-image")) {
      image.hidden = true;
      const fallback = image.nextElementSibling;
      if (fallback?.classList.contains("flag-fallback")) fallback.hidden = false;
    } else if (image.classList.contains("coat-image")) {
      const wrapper = image.closest(".coat-visual");
      if (wrapper) wrapper.hidden = true;
    }
  }, true);
})();
