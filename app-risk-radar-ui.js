(() => {
  function renderRiskRadarPanelContent({
    language = "es",
    selected,
    selectedComponents,
    componentRows = "",
    scenarioCards = "",
    watchCards = ""
  }) {
    const isEnglish = language === "en";
    return `
      <div class="product-insight-strip">
        <span>${isEnglish
          ? "Explainable risk radar: conflict, military, economic, internal, territorial and diplomatic dimensions."
          : "Radar de riesgo explicable: dimensiones conflictiva, militar, economica, interna, territorial y diplomatica."}</span>
      </div>
      <div class="product-summary-grid">
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Model" : "Modelo"}</span><strong class="overview-value">${isEnglish ? "Multi-variable proxy" : "Proxy multiparametrico"}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Dimensions" : "Dimensiones"}</span><strong class="overview-value">6</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Output" : "Salida"}</span><strong class="overview-value">${isEnglish ? "Risk + explanation" : "Riesgo + explicacion"}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Use" : "Uso"}</span><strong class="overview-value">${isEnglish ? "Scenario analysis" : "Analisis de escenarios"}</strong></div>
      </div>
      ${selected ? `
        <div class="help-section">
          <h3>${selected.name} - ${Math.round(selectedComponents.risk || 0)}/100</h3>
          <ul class="health-progress-list">${componentRows}</ul>
        </div>
      ` : ""}
      <div class="help-section">
        <h3>${isEnglish ? "Scenario lenses" : "Lentes de escenario"}</h3>
        <div class="risk-watch-grid">${scenarioCards}</div>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Top risk watchlist" : "Watchlist de riesgo"}</h3>
        <div class="risk-watch-grid">${watchCards}</div>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Important caveat" : "Aclaracion importante"}</h3>
        <p>${isEnglish
          ? "This is not a prediction. It is an explainable prioritization lens for analysis and curation."
          : "No es una prediccion. Es una lente explicable de priorizacion para analisis y curaduria."}</p>
      </div>
    `;
  }

  window.GeoRiskRiskRadarUi = {
    renderRiskRadarPanelContent
  };
})();
