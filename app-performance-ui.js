function renderPerformancePanelContent({
  language = "es",
  summary = {},
  stepRows = "",
  renderLabel = "",
  presetLabel = "",
  exportStatus = "",
  tuningRows = ""
} = {}) {
  const noMetrics = language === "en" ? "No boot metrics yet" : "Sin metricas de arranque todavia";
  const total = Math.round(summary.total || 0);
  const imagery = Math.round(summary.imagery || 0);
  const data = Math.round(summary.data || 0);
  const overlay = Math.round(summary.overlay || 0);
  const recommendation = total > 8000
    ? (language === "en" ? "Startup is heavy: keep advanced panels deferred and prefer automatic/mobile render presets." : "Arranque pesado: mantener paneles avanzados diferidos y preferir presets automaticos/mobile.")
    : imagery > data && imagery > overlay
      ? (language === "en" ? "Imagery/Cesium dominates: satellite texture and globe initialization are the next optimization target." : "Domina Imagery/Cesium: textura satelital e inicializacion del globo son el proximo foco.")
      : data > overlay
        ? (language === "en" ? "Data dominates: keep datasets lazy and avoid adding startup-critical JSON." : "Dominan los datos: mantener datasets diferidos y evitar JSON critico de arranque.")
        : (language === "en" ? "Startup is balanced: keep watching script.js and visual layers." : "Arranque equilibrado: seguir vigilando script.js y capas visuales.");
  return `
    <div class="product-summary-grid">
      <div class="overview-card"><span class="overview-label">Total boot</span><strong class="overview-value">${Math.round(summary.total || 0)} ms</strong></div>
      <div class="overview-card"><span class="overview-label">Imagery/Cesium</span><strong class="overview-value">${Math.round(summary.imagery || 0)} ms</strong></div>
      <div class="overview-card"><span class="overview-label">Datos</span><strong class="overview-value">${Math.round(summary.data || 0)} ms</strong></div>
      <div class="overview-card"><span class="overview-label">Fronteras</span><strong class="overview-value">${Math.round(summary.overlay || 0)} ms</strong></div>
      <div class="overview-card"><span class="overview-label">UI diferida</span><strong class="overview-value">${Math.round(summary.ui || 0)} ms</strong></div>
      <div class="overview-card"><span class="overview-label">Render</span><strong class="overview-value">${renderLabel}</strong></div>
      <div class="overview-card"><span class="overview-label">Preset</span><strong class="overview-value">${presetLabel}</strong></div>
      <div class="overview-card"><span class="overview-label">Export</span><strong class="overview-value">${exportStatus}</strong></div>
    </div>
    <div class="help-section">
      <h3>${language === "en" ? "Boot steps" : "Pasos de arranque"}</h3>
      <ul class="health-progress-list">${stepRows || `<li><span>${noMetrics}</span><div class="health-progress-track"><i style="width:0%"></i></div><b>0 ms</b></li>`}</ul>
    </div>
    <div class="performance-recommendation-card">
      <strong>${language === "en" ? "Automatic recommendation" : "Recomendacion automatica"}</strong>
      <span>${recommendation}</span>
    </div>
    <div class="help-section">
      <h3>${language === "en" ? "Current tuning" : "Ajuste actual"}</h3>
      <ul>${tuningRows}</ul>
    </div>
  `;
}

window.GeoRiskPerformanceUi = {
  renderPerformancePanelContent
};
