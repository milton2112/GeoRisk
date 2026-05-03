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
    <div class="help-section">
      <h3>${language === "en" ? "Current tuning" : "Ajuste actual"}</h3>
      <ul>${tuningRows}</ul>
    </div>
  `;
}

window.GeoRiskPerformanceUi = {
  renderPerformancePanelContent
};
