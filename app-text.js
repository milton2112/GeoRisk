(() => {
  const UI_STRINGS = {
    es: {
      compareTitle: "Comparador",
      compareHint: "Agrega hasta 3 paises desde la ficha o el buscador.",
      addToCompare: "Agregar al comparador",
      general: "General",
      history: "Historia",
      economy: "Economia",
      military: "Militar",
      politics: "Politica",
      religion: "Religion",
      relations: "Relaciones",
      population: "Poblacion",
      continent: "Continente",
      geography: "Capital",
      cities: "Ciudades destacadas",
      origin: "Origen",
      type: "Tipo",
      formationYear: "Año de formacion",
      timeline: "Linea de tiempo",
      politicalSystem: "Sistema politico",
      organizations: "Organizaciones",
      historicalRivals: "Rivales historicos",
      currentRivals: "Rivales actuales",
      linkedTerritories: "Territorios vinculados",
      gdp: "PBI",
      gdpPerCapita: "PBI per capita",
      inflation: "Inflacion",
      activePersonnel: "Personal activo",
      reserve: "Reserva",
      comparePopulation: "Poblacion",
      compareGdp: "PBI",
      compareGdpPerCapita: "PBI per capita",
      compareInflation: "Inflacion",
      compareSystem: "Sistema politico",
      compareReligion: "Religion principal",
      compareYear: "Año de formacion",
      noData: "Sin datos",
      topGdp: "Top PBI",
      topInflation: "Top Inflacion",
      systems: "Sistemas politicos"
    },
    en: {
      compareTitle: "Comparer",
      compareHint: "Add up to 3 countries from the detail card or the search box.",
      addToCompare: "Add to comparer",
      general: "General",
      history: "History",
      economy: "Economy",
      military: "Military",
      politics: "Politics",
      religion: "Religion",
      relations: "Relations",
      population: "Population",
      continent: "Continent",
      geography: "Capital",
      cities: "Key cities",
      origin: "Origin",
      type: "Type",
      formationYear: "Formation year",
      timeline: "Timeline",
      politicalSystem: "Political system",
      organizations: "Organizations",
      historicalRivals: "Historical rivals",
      currentRivals: "Current rivals",
      linkedTerritories: "Linked territories",
      gdp: "GDP",
      gdpPerCapita: "GDP per capita",
      inflation: "Inflation",
      activePersonnel: "Active personnel",
      reserve: "Reserve",
      comparePopulation: "Population",
      compareGdp: "GDP",
      compareGdpPerCapita: "GDP per capita",
      compareInflation: "Inflation",
      compareSystem: "Political system",
      compareReligion: "Main religion",
      compareYear: "Formation year",
      noData: "No data",
      topGdp: "Top GDP",
      topInflation: "Top Inflation",
      systems: "Political systems"
    }
  };

  const directPairs = [
    ["ÃƒÂ¡", "á"], ["ÃƒÂ©", "é"], ["ÃƒÂ­", "í"], ["ÃƒÂ³", "ó"], ["ÃƒÂº", "ú"], ["ÃƒÂ±", "ñ"], ["ÃƒÂ¼", "ü"],
    ["ÃƒÂ", "Á"], ["Ãƒâ€°", "É"], ["ÃƒÂ", "Í"], ["Ãƒâ€œ", "Ó"], ["ÃƒÅ¡", "Ú"], ["Ãƒâ€˜", "Ñ"], ["ÃƒÅ“", "Ü"],
    ["Ã¡", "á"], ["Ã©", "é"], ["Ã­", "í"], ["Ã³", "ó"], ["Ãº", "ú"], ["Ã±", "ñ"], ["Ã¼", "ü"],
    ["Ã", "Á"], ["Ã‰", "É"], ["Ã", "Í"], ["Ã“", "Ó"], ["Ãš", "Ú"], ["Ã‘", "Ñ"], ["Ãœ", "Ü"],
    ["Ã¨", "è"], ["Ã ", "à"], ["Ã¬", "ì"], ["Ã²", "ò"], ["Ã¹", "ù"], ["Ã¢", "â"], ["Ãª", "ê"], ["Ã®", "î"],
    ["Ã´", "ô"], ["Ã»", "û"], ["Ã§", "ç"], ["Ãˆ", "È"], ["Ã€", "À"], ["ÃŒ", "Ì"], ["Ã’", "Ò"], ["Ã™", "Ù"],
    ["Ã‚", "Â"], ["ÃŠ", "Ê"], ["ÃŽ", "Î"], ["Ã”", "Ô"], ["Ã›", "Û"], ["Ã‡", "Ç"],
    ["ã¡", "á"], ["ã©", "é"], ["ã­", "í"], ["ã³", "ó"], ["ãº", "ú"], ["ã±", "ñ"],
    ["Â·", "·"], ["Â¿", "¿"], ["Â¡", "¡"], ["Â²", "²"], ["Â³", "³"],
    ["â€¢", "•"], ["â€“", "–"], ["â€”", "—"], ["â€˜", "‘"], ["â€™", "’"], ["â€œ", "“"], ["â€", "”"], ["â€¦", "…"],
    ["Ã‚Â·", "·"], ["Ã‚Â¿", "¿"], ["Ã‚Â¡", "¡"], ["Ã‚Â²", "²"], ["Ã‚Â³", "³"],
    ["Ã¢â‚¬Â¢", "•"], ["Ã¢â‚¬â€œ", "–"], ["Ã¢â‚¬â€", "—"], ["Ã¢â‚¬Ëœ", "‘"], ["Ã¢â‚¬â„¢", "’"], ["Ã¢â‚¬Å“", "“"], ["Ã¢â‚¬Â¦", "…"]
  ];

  function applyDirectPairs(raw) {
    return directPairs.reduce((text, [from, to]) => text.replaceAll(from, to), raw)
      .replaceAll("Ã‚", "")
      .replaceAll("Â", "");
  }

  function decodeLatin1InBrowser(raw) {
    try {
      return decodeURIComponent(
        Array.from(raw, char => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join("")
      );
    } catch {
      return raw;
    }
  }

  function repairMojibake(value) {
    const raw = String(value || "");
    if (!raw || !(/[ÃÂâãï¿½]/.test(raw) || /�/.test(raw))) {
      return raw;
    }

    let repaired = applyDirectPairs(raw);
    if (repaired !== raw && !repaired.includes("Ã")) {
      return repaired;
    }

    for (let index = 0; index < 2; index += 1) {
      const decoded = decodeLatin1InBrowser(repaired);
      if (!decoded || decoded === repaired) {
        break;
      }
      repaired = applyDirectPairs(decoded);
      if (!repaired.includes("Ã") && !repaired.includes("Â")) {
        break;
      }
    }

    return repaired;
  }

  function normalizeText(value) {
    return repairMojibake(String(value || ""))
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function formatNumber(value) {
    if (value === null || value === undefined || value === "") {
      return "Sin datos";
    }
    return Number(value).toLocaleString("es-AR");
  }

  function formatPercentage(value) {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return "0%";
    }
    return `${value.toLocaleString("es-AR", {
      minimumFractionDigits: value >= 10 ? 1 : 2,
      maximumFractionDigits: value >= 10 ? 1 : 2
    })}%`;
  }

  function parseInflationValue(value) {
    if (value === null || value === undefined || value === "") {
      return null;
    }
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : null;
    }
    const cleaned = repairMojibake(String(value))
      .replace(/[%~≈]/g, "")
      .replace(",", ".")
      .trim();
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function formatInflation(value, options = {}) {
    const parsed = parseInflationValue(value);
    if (!Number.isFinite(parsed)) {
      return options.noDataLabel || "Sin datos";
    }
    return `${parsed.toLocaleString("es-AR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    })}%`;
  }

  function escapeHtml(value) {
    return repairMojibake(String(value || ""))
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getInitialism(value) {
    return normalizeText(value)
      .split(" ")
      .filter(Boolean)
      .map(token => token[0])
      .join("");
  }

  function createTranslator(getLanguage) {
    return function translate(key) {
      const language = typeof getLanguage === "function" ? getLanguage() : "es";
      const rawValue = UI_STRINGS[language]?.[key] || UI_STRINGS.es[key] || key;
      return repairMojibake(rawValue)
        .replaceAll("AÃ±o", "Año")
        .replaceAll("AÃ±os", "Años")
        .replaceAll("Ano", "Año")
        .replaceAll("anos", "años")
        .replaceAll("Organizacion", "Organización")
        .replaceAll("Poblacion", "Población");
    };
  }

  function getThemeOptionLabels(language = "es") {
    const en = language === "en";
    return {
      default: en ? "Political view" : "Vista politica",
      continent: en ? "Continents" : "Continentes",
      religion: en ? "Main religion" : "Religion mayoritaria",
      politics: en ? "Political system" : "Sistema politico",
      population: en ? "Population" : "Poblacion",
      density: en ? "Population density" : "Densidad de poblacion",
      urbanization: en ? "Urbanization (est.)" : "Urbanizacion (est.)",
      lifeExpectancy: en ? "Life expectancy (est.)" : "Esperanza de vida (est.)",
      populationGrowth: en ? "Demographic growth" : "Crecimiento demografico",
      gdp: en ? "GDP" : "PBI",
      gdpPerCapita: en ? "GDP per capita" : "PBI per capita",
      gdpPpp: en ? "GDP PPP (est.)" : "PBI PPC (est.)",
      inflation: en ? "Inflation" : "Inflacion",
      inflationHistory: en ? "Inflation history (proxy)" : "Inflacion historica (proxy)",
      unemployment: en ? "Unemployment (est.)" : "Desempleo (est.)",
      debt: en ? "Debt (est.)" : "Deuda (est.)",
      militaryActive: en ? "Active military" : "Personal militar activo",
      militarySpending: en ? "Military spending (est.)" : "Gasto militar (est.)",
      formationYear: en ? "Formation year" : "A\u00f1o de formacion",
      religionBranch: en ? "Religious branch" : "Rama religiosa dominante",
      exMetropole: en ? "Former metropole" : "Ex metropoli",
      bloc: en ? "Blocs and alliances" : "Bloques y alianzas",
      conflicts: en ? "Conflicts" : "Conflictos",
      organizations: en ? "Organizations" : "Organizaciones",
      rivals: en ? "Rivals" : "Rivales",
      religionDiversity: en ? "Religious diversity" : "Diversidad religiosa",
      historyType: en ? "Historical type" : "Tipo historico",
      exportBreadth: en ? "Export diversity" : "Diversidad exportadora",
      exportVolume: en ? "Export volume (est.)" : "Volumen exportador (est.)",
      industryBreadth: en ? "Industrial diversity" : "Diversidad industrial",
      capitalShare: en ? "Capital population share" : "Peso demografico de la capital",
      naturalResources: en ? "Natural resources" : "Recursos naturales",
      geopoliticalIndex: en ? "Geopolitical index" : "Indice geopolitico",
      riskRadar: en ? "Multi-parameter risk radar" : "Radar de riesgo multiparametrico",
      riskMilitary: en ? "Military risk" : "Riesgo militar",
      riskEconomic: en ? "Economic risk" : "Riesgo economico",
      riskDiplomatic: en ? "Diplomatic risk" : "Riesgo diplomatico",
      riskInternal: en ? "Internal risk" : "Riesgo interno",
      riskTerritorial: en ? "Territorial risk" : "Riesgo territorial",
      qualityScore: en ? "Dataset quality" : "Calidad del dataset",
      languageDiversity: en ? "Language diversity" : "Diversidad linguistica",
      diplomaticReach: en ? "Diplomatic reach" : "Alcance diplomatico"
    };
  }

  function applyStaticText(options = {}) {
    const documentRef = options.document;
    if (!documentRef?.getElementById) return false;
    const language = options.currentLanguage || "es";
    const en = language === "en";
    const translate = options.translate || (key => key);
    const setText = (id, value) => {
      const element = documentRef.getElementById(id);
      if (element) element.textContent = value;
      return element;
    };
    const setOption = (id, index, value) => {
      const option = documentRef.getElementById(id)?.options?.[index];
      if (option) option.textContent = value;
    };
    const setLabel = (controlId, value) => {
      const label = documentRef.querySelector?.(`label[for='${controlId}']`);
      if (label) label.textContent = value;
    };

    setText("compare-title", translate("compareTitle"));
    setText("compare-empty", translate("compareHint"));
    setText("quiz-title", en ? "Learning mode" : "Modo educativo");
    setText("quiz-start-button", en ? "Start quiz" : "Iniciar quiz");
    setText("quiz-next-button", en ? "Next" : "Siguiente");
    setText("quiz-reset-button", en ? "Reset" : "Reiniciar");
    setOption("quiz-difficulty", 0, en ? "Easy" : "Facil");
    setOption("quiz-difficulty", 1, en ? "Medium" : "Media");
    setOption("quiz-difficulty", 2, en ? "Hard" : "Dificil");
    setText("compare-add-button", en ? "Add" : "Agregar");
    setOption("compare-country-select", 0, en ? "Select country" : "Seleccionar pais");
    setText("open-compare-modal-button", en ? "Open comparison" : "Ver comparacion");
    setText("clear-compare-button", en ? "Clear" : "Limpiar");
    setText("rankings-summary", en ? "Global rankings" : "Rankings globales");
    setText("compare-hub-label", en ? "Compare" : "Comparar");
    setText("quiz-hub-label", "Quiz");
    setText("news-hub-label", en ? "News" : "Noticias");

    const simpleText = {
      "world-population-title": en ? "World population" : "Poblacion mundial",
      "top-population-title": en ? "Top population" : "Top poblacion",
      "continents-title": en ? "Continents" : "Continentes",
      "religions-title": en ? "Religions" : "Religiones",
      "gdp-title": translate("topGdp"),
      "inflation-title": translate("topInflation"),
      "systems-title": translate("systems"),
      "gdp-per-capita-title": en ? "Top GDP per capita" : "Top PBI per capita",
      "organizations-top-title": en ? "Top organizations" : "Top organizaciones",
      "conflicts-top-title": en ? "Top conflicts" : "Top conflictos",
      "military-top-title": en ? "Top active military" : "Top personal militar",
      "diversity-top-title": en ? "Top religious diversity" : "Top diversidad religiosa",
      "organizations-reach-title": en ? "Most widespread organizations" : "Organizaciones mas extendidas",
      "rivalries-top-title": en ? "Most repeated rivalries" : "Rivalidades mas repetidas",
      "blocs-top-title": en ? "Most widespread blocs" : "Bloques mas extendidos",
      "metropoles-top-title": en ? "Former metropoles" : "Ex metropoles",
      "history-types-top-title": en ? "Historical types" : "Tipos historicos",
      "toggle-left-panel": "Rankings",
      "toggle-tools-panel": en ? "Layers" : "Capas",
      "toggle-country-panel": en ? "Profile" : "Ficha",
      "mobile-compare-label": en ? "Compare" : "Comparar",
      "mobile-quiz-label": "Quiz",
      "mobile-news-label": en ? "News" : "Noticias",
      "layers-summary-title": en ? "Thematic layers" : "Capas tematicas",
      "layers-panel-title": en ? "Thematic map" : "Mapa tematico",
      "apply-filters-button": en ? "Apply filters" : "Aplicar filtros",
      "save-filters-button": en ? "Save filters" : "Guardar filtros",
      "reset-view-button": en ? "Reset view" : "Resetear vista",
      "world-view-button": en ? "Back to world" : "Volver al mundo",
      "save-view-button": en ? "Save view" : "Guardar vista",
      "open-help-button": en ? "Guide" : "Guia"
    };
    Object.entries(simpleText).forEach(([id, value]) => setText(id, value));

    const searchInput = documentRef.getElementById("map-search-input");
    if (searchInput) searchInput.placeholder = en ? "Search country, conflict, region or organization" : "Buscar pais, conflicto, region u organizacion";
    setText("map-search-button", en ? "Search" : "Buscar");
    const saveSearchButton = documentRef.getElementById("save-search-button");
    if (saveSearchButton) {
      saveSearchButton.title = en ? "Save search" : "Guardar busqueda";
      saveSearchButton.setAttribute?.("aria-label", saveSearchButton.title);
    }

    const appModeSelect = documentRef.getElementById("app-mode-select");
    [["Explore", "Exploracion"], ["Geopolitical analysis", "Analisis geopolitico"], ["Encyclopedia", "Enciclopedia"], ["Presentation", "Presentacion"]]
      .forEach(([english, spanish], index) => setOption("app-mode-select", index, en ? english : spanish));
    if (appModeSelect) appModeSelect.value = options.appMode || "default";
    setOption("favorite-views-select", 0, en ? "Favorites" : "Favoritos");
    setText("save-favorite-button", en ? "Save favorite" : "Guardar favorito");
    setText("open-intro-button", en ? "Start" : "Inicio");
    setText("open-health-button", en ? "Dataset health" : "Salud dataset");
    setText("open-risk-radar-button", en ? "Risk radar" : "Radar riesgo");
    setText("open-conflict-audit-button", en ? "Conflict quality" : "Calidad conflictos");
    setText("open-project-audit-button", en ? "Project status" : "Estado proyecto");
    setText("open-changelog-button", "Changelog");
    setText("open-docs-button", en ? "Docs" : "Documentacion");
    setText("clear-local-cache-button", en ? "Clear offline cache" : "Limpiar cache offline");
    setText("search-history-title", en ? "Recent" : "Recientes");
    setText("saved-search-title", en ? "Saved" : "Guardadas");
    const mobileMoreButton = setText("toggle-more-panel", en ? "More" : "Mas");
    mobileMoreButton?.setAttribute?.("aria-label", en ? "Open quick tools" : "Abrir herramientas rapidas");
    documentRef.getElementById("mobile-more-menu")?.setAttribute?.("aria-label", en ? "Quick tools" : "Herramientas rapidas");
    options.syncMobilePanelControlState?.();

    const layersHint = documentRef.getElementById("layers-panel-hint");
    if (layersHint) layersHint.textContent = en
      ? "Choose which data colors the map. Estimated layers are marked as dataset proxies."
      : "Elegi que dato colorea el mapa. Las capas estimadas muestran proxies del dataset.";
    const themeFilterInput = documentRef.getElementById("theme-filter-input");
    if (themeFilterInput) themeFilterInput.placeholder = en ? "Filter layers" : "Filtrar capas";
    options.updateMapModeToggle?.();

    const themeSelect = documentRef.getElementById("theme-select");
    const themeLabels = getThemeOptionLabels(language);
    Array.from(themeSelect?.options || []).forEach(option => {
      option.textContent = themeLabels[option.value] || option.textContent;
    });
    options.renderThemePicker?.();
    options.syncThemeToolbarState?.();
    setLabel("theme-select", en ? "Layer" : "Capa");
    setLabel("language-select", en ? "Language" : "Idioma");
    setLabel("quality-preset-select", "Render");
    setLabel("label-mode-select", en ? "Labels" : "Etiquetas");
    setLabel("filter-continent-select", en ? "Filters" : "Filtros");
    setLabel("saved-views-select", en ? "Saved views" : "Vistas guardadas");

    [["Automatic", "Automatico"], ["High quality", "Alta calidad"], ["Balanced", "Balanceado"], ["Performance", "Rendimiento"]]
      .forEach(([english, spanish], index) => setOption("quality-preset-select", index, en ? english : spanish));
    const qualitySelect = documentRef.getElementById("quality-preset-select");
    if (qualitySelect) qualitySelect.value = options.qualityPreset || "auto";
    [["No labels", "Sin etiquetas"], ["Countries", "Paises"], ["Countries and world", "Paises y mundo"]]
      .forEach(([english, spanish], index) => setOption("label-mode-select", index, en ? english : spanish));
    const labelSelect = documentRef.getElementById("label-mode-select");
    if (labelSelect) labelSelect.value = options.labelMode || "none";

    setText("auto-rotate-button", options.autoRotateEnabled
      ? (en ? "Stop rotation" : "Detener rotacion")
      : (en ? "Auto rotation" : "Rotacion automatica"));
    setText("presentation-mode-button", documentRef.body?.classList?.contains?.("presentation-mode")
      ? (en ? "Exit presentation" : "Salir de presentacion")
      : (en ? "Presentation mode" : "Modo presentacion"));
    Array.from(documentRef.querySelectorAll?.("[data-export-target][data-export-format='png']") || []).forEach(button => { button.textContent = en ? "Export image" : "Exportar imagen"; });
    Array.from(documentRef.querySelectorAll?.("[data-export-target][data-export-format='pdf']") || []).forEach(button => { button.textContent = en ? "Export PDF" : "Exportar PDF"; });
    Array.from(documentRef.querySelectorAll?.("[data-share-target], [data-share-country]") || []).forEach(button => { button.textContent = en ? "Share" : "Compartir"; });

    const newsNote = documentRef.getElementById("news-hub-note");
    if (newsNote) newsNote.textContent = en
      ? "Country news hub. Select a country for a preview or open an external search."
      : "Hub de noticias por pais. Selecciona un pais para vista previa o abri una busqueda externa.";
    const getNewsTopicLabel = options.getNewsTopicLabel || (value => value);
    ["general", "politics", "economy", "conflict", "diplomacy"].forEach((topic, index) => setOption("news-topic-select", index, getNewsTopicLabel(topic)));
    const newsFilter = documentRef.getElementById("news-country-filter");
    if (newsFilter) newsFilter.placeholder = en ? "Filter country in news" : "Filtrar pais en noticias";

    options.updateAppStatusPanel?.();
    options.renderSavedFilters?.();
    options.renderSavedViews?.();
    options.renderSearchMemory?.({ reveal: documentRef.activeElement?.id === "map-search-input" });
    return true;
  }

  function applyExtendedStaticText(options = {}) {
    const documentRef = options.document;
    if (!documentRef?.getElementById) return false;
    const language = options.currentLanguage || "es";
    const en = language === "en";
    ["intro-modal-close", "product-modal-close", "conflict-modal-close", "timeline-modal-close"].forEach(id => {
      const button = documentRef.getElementById(id);
      if (button) button.innerHTML = "&times;";
    });
    const introBody = documentRef.getElementById("intro-modal-body");
    if (introBody) introBody.innerHTML = introBody.innerHTML.replace(/campa\u00c3\u00b1as/g, "campa\u00f1as");
    const semanticHelper = documentRef.getElementById("semantic-helper");
    if (semanticHelper) semanticHelper.textContent = en
      ? "Examples: constitutional monarchies in Asia with an Islamic majority; NATO countries rival to Russia; presidential republics in the Americas; Spanish-speaking countries in South America; Six-Day War; 20th century states."
      : "Ejemplos: monarquias constitucionales de Asia con islam mayoritario; paises de la OTAN rivales de Rusia; republicas presidenciales de America; paises hispanohablantes de America del Sur; Guerra de los Seis Dias; estados del siglo XX.";
    const compareSearch = documentRef.getElementById("compare-country-search");
    if (compareSearch) compareSearch.placeholder = en ? "Filter countries to compare" : "Filtrar paises para comparar";
    const setOption = (id, index, value) => {
      const option = documentRef.getElementById(id)?.options?.[index];
      if (option) option.textContent = value;
    };
    [["Classic", "Clasico"], ["Timed", "Contra reloj"], ["Practice", "Practica"], ["Exam", "Examen"], ["Teacher", "Docente"]]
      .forEach(([english, spanish], index) => setOption("quiz-mode", index, en ? english : spanish));
    [["General overview", "Panorama general"], ["Politics", "Politica"], ["Economy", "Economia"], ["War and security", "Guerra y seguridad"], ["Diplomacy", "Diplomacia"]]
      .forEach(([english, spanish], index) => setOption("news-topic-select", index, en ? english : spanish));
    options.updateIntroRuntimeStatus?.();
    options.updateIntroActionText?.();
    if (documentRef.getElementById("help-modal")?.hidden === false) {
      options.renderHelpModalContent?.({ force: true });
    }
    options.updateAppStatusPanel?.();
    return true;
  }

  window.GeoRiskText = {
    UI_STRINGS,
    formatNumber,
    formatPercentage,
    parseInflationValue,
    formatInflation,
    repairMojibake,
    normalizeText,
    escapeHtml,
    getInitialism,
    createTranslator,
    getThemeOptionLabels,
    applyStaticText,
    applyExtendedStaticText
  };
})();
