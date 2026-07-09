(() => {
  function escapeLocal(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatLocal(value, formatter) {
    const number = Number(value) || 0;
    if (typeof formatter === "function") {
      return formatter(number);
    }
    return new Intl.NumberFormat("es-AR").format(number);
  }

  function flagLocal(code, flagResolver) {
    if (typeof flagResolver === "function") {
      return flagResolver(code);
    }
    return "";
  }

  function getRiskMainDriverLabel(components = {}, isEnglish = false) {
    const labels = {
      conflictExposure: isEnglish ? "conflict exposure" : "exposicion conflictiva",
      militaryPressure: isEnglish ? "military pressure" : "presion militar",
      rivalryPressure: isEnglish ? "territorial/rival pressure" : "presion territorial/rival",
      economicStress: isEnglish ? "economic stress" : "estres economico",
      governanceStress: isEnglish ? "internal stress" : "estres interno"
    };
    const [key] = Object.entries(labels)
      .sort((a, b) => (components[b[0]] || 0) - (components[a[0]] || 0))[0] || ["conflictExposure"];
    return labels[key] || labels.conflictExposure;
  }

  function buildComponentRows({ isEnglish, selectedComponents, formatNumber }) {
    if (!selectedComponents) {
      return "";
    }
    const labels = {
      conflictExposure: isEnglish ? "Conflict exposure" : "Exposicion a conflicto",
      militaryPressure: isEnglish ? "Military pressure" : "Presion militar",
      rivalryPressure: isEnglish ? "Rivals/disputes" : "Rivales y disputas",
      economicStress: isEnglish ? "Economic stress" : "Estres economico",
      governanceStress: isEnglish ? "Governance stress" : "Estres de gobernanza",
      diplomaticBuffer: isEnglish ? "Diplomatic buffer" : "Amortiguador diplomatico"
    };
    return Object.entries(labels).map(([key, label]) => {
      const score = Math.round(selectedComponents[key] || 0);
      return `
        <li>
          <span>${escapeLocal(label)}</span>
          <div class="health-progress-track"><i style="width:${score}%"></i></div>
          <b>${formatLocal(score, formatNumber)}/100</b>
        </li>
      `;
    }).join("");
  }

  function buildScenarioCards({ isEnglish, allRiskCountries = [], formatNumber, getFlagEmoji }) {
    const scenarioDefinitions = [
      {
        title: isEnglish ? "Military escalation" : "Escalada militar",
        description: isEnglish ? "High armed capacity plus conflict exposure." : "Alta capacidad armada combinada con exposicion conflictiva.",
        score: item => (item.components.militaryPressure * 0.55) + (item.components.conflictExposure * 0.45)
      },
      {
        title: isEnglish ? "Economic stress" : "Estres economico",
        description: isEnglish ? "Inflation, low income buffer and structural fragility." : "Inflacion, bajo amortiguador de ingreso y fragilidad estructural.",
        score: item => item.components.economicStress
      },
      {
        title: isEnglish ? "Territorial friction" : "Friccion territorial",
        description: isEnglish ? "Rivals, disputes and contested sovereignty." : "Rivales, disputas y soberania contestada.",
        score: item => item.components.rivalryPressure
      },
      {
        title: isEnglish ? "Low diplomatic buffer" : "Bajo amortiguador diplomatico",
        description: isEnglish ? "Few institutional buffers relative to pressure." : "Pocos amortiguadores institucionales frente a presion.",
        score: item => Math.max(0, item.components.risk - item.components.diplomaticBuffer)
      }
    ];
    return scenarioDefinitions.map(definition => {
      const leaders = allRiskCountries
        .map(item => ({ ...item, scenarioScore: definition.score(item) }))
        .sort((a, b) => b.scenarioScore - a.scenarioScore)
        .slice(0, 3);
      return `
        <article class="risk-watch-card risk-scenario-card">
          <strong>${escapeLocal(definition.title)}</strong>
          <span>${escapeLocal(definition.description)}</span>
          <ol>
            ${leaders.map(item => `<li><button type="button" data-open-country="${escapeLocal(item.code)}">${flagLocal(item.code, getFlagEmoji)} ${escapeLocal(item.name)} - ${formatLocal(Math.round(item.scenarioScore), formatNumber)}/100</button></li>`).join("")}
          </ol>
        </article>
      `;
    }).join("");
  }

  function buildWatchCards({ isEnglish, topRiskCountries = [], formatNumber, getFlagEmoji }) {
    return topRiskCountries.map(({ code, name, continent, components }) => `
      <button type="button" class="risk-watch-card" data-open-country="${escapeLocal(code)}">
        <strong>${flagLocal(code, getFlagEmoji)} ${escapeLocal(name)}</strong>
        <span>${formatLocal(Math.round(components.risk), formatNumber)}/100 - ${escapeLocal(continent || "")}</span>
        <small>${isEnglish ? "Main driver" : "Factor principal"}: ${escapeLocal(getRiskMainDriverLabel(components, isEnglish))}</small>
      </button>
    `).join("");
  }

  function renderRiskRadarPanelContent({
    language = "es",
    selected,
    selectedComponents,
    topRiskCountries = [],
    allRiskCountries = [],
    formatNumber,
    getFlagEmoji,
    componentRows = "",
    scenarioCards = "",
    watchCards = ""
  }) {
    const isEnglish = language === "en";
    const selectedRows = componentRows || buildComponentRows({ isEnglish, selectedComponents, formatNumber });
    const scenarioMarkup = scenarioCards || buildScenarioCards({ isEnglish, allRiskCountries, formatNumber, getFlagEmoji });
    const watchMarkup = watchCards || buildWatchCards({ isEnglish, topRiskCountries, formatNumber, getFlagEmoji });
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
          <h3>${escapeLocal(selected.name)} - ${Math.round(selectedComponents.risk || 0)}/100</h3>
          <ul class="health-progress-list">${selectedRows}</ul>
        </div>
      ` : ""}
      <div class="help-section">
        <h3>${isEnglish ? "Scenario lenses" : "Lentes de escenario"}</h3>
        <div class="risk-watch-grid">${scenarioMarkup}</div>
      </div>
      <div class="risk-method-strip">
        <article>
          <strong>${isEnglish ? "Best use" : "Mejor uso"}</strong>
          <span>${isEnglish ? "Compare countries, detect weak dimensions and decide where to curate deeper." : "Comparar paises, detectar dimensiones flojas y decidir donde curar mas profundo."}</span>
        </article>
        <article>
          <strong>${isEnglish ? "Not a forecast" : "No es pronostico"}</strong>
          <span>${isEnglish ? "Scores are transparent signals, not future certainty." : "Los puntajes son senales transparentes, no certeza futura."}</span>
        </article>
        <article>
          <strong>${isEnglish ? "Next upgrade" : "Proxima mejora"}</strong>
          <span>${isEnglish ? "Add time series and source confidence per variable." : "Sumar evolucion temporal y confianza de fuente por variable."}</span>
        </article>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Dimension guide" : "Guia de dimensiones"}</h3>
        <div class="risk-dimension-grid">
          <article><strong>${isEnglish ? "Military" : "Militar"}</strong><span>${isEnglish ? "Armed capacity plus recent conflict exposure." : "Capacidad armada combinada con exposicion conflictiva reciente."}</span></article>
          <article><strong>${isEnglish ? "Economic" : "Economica"}</strong><span>${isEnglish ? "Inflation, income buffer and structural stress." : "Inflacion, amortiguador de ingreso y estres estructural."}</span></article>
          <article><strong>${isEnglish ? "Diplomatic" : "Diplomatica"}</strong><span>${isEnglish ? "Institutional buffers, blocs and external ties." : "Amortiguadores institucionales, bloques y vinculos externos."}</span></article>
          <article><strong>${isEnglish ? "Internal" : "Interna"}</strong><span>${isEnglish ? "Governance and domestic fragility signals." : "Senales de gobernanza y fragilidad domestica."}</span></article>
          <article><strong>${isEnglish ? "Territorial" : "Territorial"}</strong><span>${isEnglish ? "Rivals, disputes and contested sovereignty." : "Rivales, disputas y soberania contestada."}</span></article>
        </div>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Top risk watchlist" : "Watchlist de riesgo"}</h3>
        <div class="risk-watch-grid">${watchMarkup}</div>
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
    getRiskMainDriverLabel,
    renderRiskRadarPanelContent
  };
})();
