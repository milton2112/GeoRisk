function renderPerformancePanelContent({
  language = "es",
  summary = {},
  longTaskMetrics = {},
  startupFpsMetrics = {},
  stepRows = "",
  renderLabel = "",
  presetLabel = "",
  exportStatus = "",
  tuningRows = "",
  degradationRows = ""
} = {}) {
  const escapeLocal = value => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  const noMetrics = language === "en" ? "No boot metrics yet" : "Sin metricas de arranque todavia";
  const total = Math.round(summary.total || 0);
  const imagery = Math.round(summary.imagery || 0);
  const data = Math.round(summary.data || 0);
  const overlay = Math.round(summary.overlay || 0);
  const longTaskRows = (longTaskMetrics.recent || [])
    .map(item => `<li><span>${escapeLocal(item.name)} @ ${escapeLocal(item.startTime)} ms</span><div class="health-progress-track"><i style="width:${Math.min(100, Math.max(4, Math.round((item.duration / Math.max(longTaskMetrics.longestDuration || 1, 1)) * 100)))}%"></i></div><b>${escapeLocal(item.duration)} ms</b></li>`)
    .join("");
  const recommendation = total > 8000
    ? (language === "en" ? "Startup is heavy: keep advanced panels deferred and prefer automatic/mobile render presets." : "Arranque pesado: mantener paneles avanzados diferidos y preferir presets automaticos/mobile.")
    : imagery > data && imagery > overlay
      ? (language === "en" ? "Imagery/Cesium dominates: satellite texture and globe initialization are the next optimization target." : "Domina Imagery/Cesium: textura satelital e inicializacion del globo son el proximo foco.")
      : data > overlay
        ? (language === "en" ? "Data dominates: keep datasets lazy and avoid adding startup-critical JSON." : "Dominan los datos: mantener datasets diferidos y evitar JSON critico de arranque.")
        : (language === "en" ? "Startup is balanced: keep watching script.js and visual layers." : "Arranque equilibrado: seguir vigilando script.js y capas visuales.");
  const bootState = total > 8000
    ? { className: "heavy", label: language === "en" ? "Heavy boot" : "Arranque pesado" }
    : total > 4000
      ? { className: "watch", label: language === "en" ? "Watch closely" : "En observacion" }
      : { className: "healthy", label: language === "en" ? "Healthy boot" : "Arranque sano" };
  return `
    <div class="performance-status-banner ${bootState.className}">
      <strong>${bootState.label}</strong>
      <span>${language === "en" ? "Measured from the local boot profile." : "Medido desde el perfil local de arranque."}</span>
    </div>
    <div class="product-summary-grid">
      <div class="overview-card"><span class="overview-label">Total boot</span><strong class="overview-value">${Math.round(summary.total || 0)} ms</strong></div>
      <div class="overview-card"><span class="overview-label">Imagery/Cesium</span><strong class="overview-value">${Math.round(summary.imagery || 0)} ms</strong></div>
      <div class="overview-card"><span class="overview-label">Datos</span><strong class="overview-value">${Math.round(summary.data || 0)} ms</strong></div>
      <div class="overview-card"><span class="overview-label">Fronteras</span><strong class="overview-value">${Math.round(summary.overlay || 0)} ms</strong></div>
      <div class="overview-card"><span class="overview-label">UI diferida</span><strong class="overview-value">${Math.round(summary.ui || 0)} ms</strong></div>
      <div class="overview-card"><span class="overview-label">Render</span><strong class="overview-value">${renderLabel}</strong></div>
      <div class="overview-card"><span class="overview-label">Preset</span><strong class="overview-value">${presetLabel}</strong></div>
      <div class="overview-card"><span class="overview-label">Export</span><strong class="overview-value">${exportStatus}</strong></div>
      <div class="overview-card"><span class="overview-label">Long tasks</span><strong class="overview-value">${longTaskMetrics.supported ? `${longTaskMetrics.count || 0} / ${Math.round(longTaskMetrics.longestDuration || 0)} ms` : "N/D"}</strong></div>
      <div class="overview-card"><span class="overview-label">Budget &gt;${Math.round(longTaskMetrics.budgetMs || 200)} ms</span><strong class="overview-value">${longTaskMetrics.supported ? `${longTaskMetrics.overBudgetCount || 0}` : "N/D"}</strong></div>
      <div class="overview-card"><span class="overview-label">FPS 60s</span><strong class="overview-value">${startupFpsMetrics.samples ? `${Math.round(startupFpsMetrics.avg || 0)} avg / ${Math.round(startupFpsMetrics.min || 0)} min` : "Midiendo"}</strong></div>
    </div>
    <div class="help-section">
      <h3>${language === "en" ? "Boot steps" : "Pasos de arranque"}</h3>
      <ul class="health-progress-list">${stepRows || `<li><span>${noMetrics}</span><div class="health-progress-track"><i style="width:0%"></i></div><b>0 ms</b></li>`}</ul>
    </div>
    <div class="help-section">
      <h3>${language === "en" ? "Main-thread blocks" : "Bloqueos del hilo principal"}</h3>
      <ul class="health-progress-list">${longTaskRows || `<li><span>${language === "en" ? "No long tasks observed" : "Sin bloqueos largos observados"}</span><div class="health-progress-track"><i style="width:0%"></i></div><b>0 ms</b></li>`}</ul>
    </div>
    <div class="help-section">
      <h3>${language === "en" ? "Automatic render degradations" : "Degradaciones automaticas de render"}</h3>
      <ul>${degradationRows || `<li>${language === "en" ? "No automatic degradations recorded." : "Sin degradaciones automaticas registradas."}</li>`}</ul>
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
