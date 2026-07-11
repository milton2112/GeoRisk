const COUNTRY_PANEL_DATA_SOURCE_SUMMARY = {
  es: [
    "Dataset geopolitico local curado del proyecto",
    "Banco Mundial para inflacion",
    "GeoJSON politico y curaduria historica/manual propia"
  ],
  en: [
    "Local curated geopolitical project dataset",
    "World Bank for inflation",
    "Political GeoJSON plus in-project historical/manual curation"
  ]
};

const COUNTRY_FAVORITES_STORAGE_KEY = "geo-risk-country-favorites";

function formatProvenanceValue(value, language = "es", depth = 0) {
  if (value === null || value === undefined || value === "") {
    return language === "en" ? "No data" : "Sin datos";
  }
  if (typeof value !== "object") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.slice(0, 8).map(item => formatProvenanceValue(item, language, depth + 1)).join(", ");
  }
  if (value.status && typeof value.status !== "object") {
    return String(value.status);
  }
  if (depth >= 2) {
    return Object.keys(value).slice(0, 8).join(", ");
  }
  return Object.entries(value)
    .slice(0, 8)
    .map(([key, nested]) => `${key}: ${formatProvenanceValue(nested, language, depth + 1)}`)
    .join(" | ");
}

function getInteractionTrigger(event, selector) {
  return typeof event?.target?.closest === "function"
    ? event.target.closest(selector)
    : null;
}

function readFavoriteCodes(storage) {
  try {
    const value = JSON.parse(storage?.getItem(COUNTRY_FAVORITES_STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter(code => typeof code === "string") : [];
  } catch {
    return [];
  }
}

async function handleInteraction(event, options = {}) {
  const state = options.getState?.() || {};
  const language = options.getLanguage?.() || "es";
  const getTrigger = selector => getInteractionTrigger(event, selector);

  const openCountryTrigger = getTrigger("[data-open-country]");
  if (openCountryTrigger) {
    await options.openCountryByCode?.(
      openCountryTrigger.dataset.openCountry,
      openCountryTrigger.textContent?.trim() || ""
    );
    return true;
  }

  const deferredSectionTrigger = getTrigger("[data-country-load-section]");
  if (deferredSectionTrigger) {
    await options.activateCountrySection?.(deferredSectionTrigger.dataset.countryLoadSection);
    return true;
  }

  const countryNavTrigger = getTrigger("[data-country-nav]");
  if (countryNavTrigger) {
    await options.activateCountrySection?.(countryNavTrigger.dataset.countryNav);
    return true;
  }

  const countryViewModeButton = getTrigger("[data-country-view-mode]");
  if (countryViewModeButton) {
    state.countryViewMode = countryViewModeButton.dataset.countryViewMode || "full";
    state.timelineMode = state.countryViewMode === "teaching" ? "teaching" : "full";
    options.rerenderCurrentPanel?.();
    return true;
  }

  const countryFavoriteButton = getTrigger("[data-country-favorite]");
  if (countryFavoriteButton) {
    const code = countryFavoriteButton.dataset.countryFavorite;
    const country = options.getCountriesData?.()?.[code];
    if (country) {
      const favorites = readFavoriteCodes(options.storage);
      const nextFavorites = [code, ...favorites.filter(item => item !== code)].slice(0, 24);
      try {
        options.storage?.setItem(COUNTRY_FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
      } catch {
        // Private browsing or a full quota must not block the country profile.
      }
      options.showToast?.(language === "en" ? "Country saved as favorite." : "Pais guardado como favorito.");
    }
    return true;
  }

  const quickCompareButton = getTrigger("[data-quick-compare]");
  if (quickCompareButton) {
    options.addCountryToCompare?.(quickCompareButton.dataset.quickCompare);
    if ((options.getCompareSelection?.() || []).length >= 2) {
      options.openCompareModal?.();
    } else {
      options.renderComparePanel?.();
      options.showToast?.(language === "en" ? "Add one more country to compare." : "Agrega otro pais para comparar.");
    }
    return true;
  }

  const stateActions = [
    ["[data-timeline-filter]", "timelineFilter", "timelineFilter", "all"],
    ["[data-timeline-century]", "timelineCentury", "timelineCentury", "all"],
    ["[data-timeline-intensity]", "timelineIntensity", "timelineIntensity", "all"],
    ["[data-timeline-relevance]", "timelineRelevance", "timelineRelevance", "all"],
    ["[data-timeline-mode]", "timelineMode", "timelineMode", "full"]
  ];
  for (const [selector, stateKey, dataKey, fallback] of stateActions) {
    const trigger = getTrigger(selector);
    if (trigger) {
      state[stateKey] = trigger.dataset[dataKey] || fallback;
      options.rerenderCurrentPanel?.();
      return true;
    }
  }

  const timelineTrigger = getTrigger("[data-timeline-key]");
  if (timelineTrigger) {
    options.openTimelineModal?.(timelineTrigger.dataset.timelineKey);
    return true;
  }

  const conflictStateActions = [
    ["[data-conflict-filter]", "conflictFilter", "conflictFilter"],
    ["[data-conflict-region]", "conflictRegion", "conflictRegion"],
    ["[data-conflict-outcome]", "conflictOutcome", "conflictOutcome"],
    ["[data-conflict-side]", "conflictSide", "conflictSide"]
  ];
  for (const [selector, stateKey, dataKey] of conflictStateActions) {
    const trigger = getTrigger(selector);
    if (trigger) {
      state[stateKey] = trigger.dataset[dataKey] || "all";
      state.conflictVisibleLimit = 0;
      options.rerenderCurrentPanel?.();
      return true;
    }
  }

  if (getTrigger("[data-conflict-load-more]")) {
    const step = options.isMobileLayout?.() ? 8 : 16;
    state.conflictVisibleLimit = (Number(state.conflictVisibleLimit) || step) + step;
    options.rerenderCurrentPanel?.();
    return true;
  }

  const conflictChildMoreButton = getTrigger("[data-conflict-expand-children]");
  if (conflictChildMoreButton) {
    const groupKey = conflictChildMoreButton.dataset.conflictExpandChildren;
    const step = options.isMobileLayout?.() ? 3 : 5;
    state.conflictChildLimits = {
      ...(state.conflictChildLimits || {}),
      [groupKey]: (Number(state.conflictChildLimits?.[groupKey]) || step) + step
    };
    options.rerenderCurrentPanel?.();
    return true;
  }

  const conflictTrigger = getTrigger("[data-conflict-key]");
  if (conflictTrigger) {
    options.openConflictModal?.(conflictTrigger.dataset.conflictKey);
    return true;
  }

  const exportTrigger = getTrigger("[data-export-target]");
  if (exportTrigger) {
    const target = options.document?.getElementById(exportTrigger.dataset.exportTarget);
    if (target) {
      if (exportTrigger.dataset.exportFormat === "pdf") {
        await options.exportNodeAsPdf?.(target, `${exportTrigger.dataset.exportTarget}.pdf`);
      } else {
        await options.exportNodeAsImage?.(target, `${exportTrigger.dataset.exportTarget}.png`);
      }
    }
    return true;
  }

  const shareCountryTrigger = getTrigger("[data-share-country]");
  if (shareCountryTrigger) {
    const country = options.getCountriesData?.()?.[shareCountryTrigger.dataset.shareCountry];
    if (country) {
      const noData = options.getNoDataLabel?.() || (language === "en" ? "No data" : "Sin datos");
      await options.shareText?.(
        country.name,
        `${country.name}\n${language === "en" ? "Official name" : "Nombre oficial"}: ${country.general?.officialName || country.name}\n${language === "en" ? "Population" : "Poblacion"}: ${options.formatNumber?.(country.general?.population || 0) || country.general?.population || 0}\n${language === "en" ? "Political system" : "Sistema politico"}: ${country.politics?.system || noData}`
      );
    }
    return true;
  }

  const shareTrigger = getTrigger("[data-share-target]");
  if (shareTrigger) {
    const target = options.document?.getElementById(shareTrigger.dataset.shareTarget);
    if (target) {
      await options.shareText?.(
        language === "en" ? "GeoRisk comparison" : "Comparacion GeoRisk",
        target.innerText?.trim() || ""
      );
    }
    return true;
  }

  const searchTrigger = getTrigger("[data-search-query]");
  if (searchTrigger) {
    await options.searchByQuery?.(searchTrigger.dataset.searchQuery);
    return true;
  }

  return false;
}

window.GeoRiskCountryPanel = {
  formatProvenanceValue,
  handleInteraction,
  getSectionDescriptors(language = "es") {
    return [
      { id: "country-section-general", label: language === "en" ? "General" : "General" },
      { id: "country-section-history", label: language === "en" ? "History" : "Historia" },
      { id: "country-section-economy", label: language === "en" ? "Economy" : "Economia" },
      { id: "country-section-military", label: language === "en" ? "Military" : "Militar" },
      { id: "country-section-politics", label: language === "en" ? "Politics" : "Politica" },
      { id: "country-section-relations", label: language === "en" ? "Relations" : "Relaciones" },
      { id: "country-section-religion", label: language === "en" ? "Religion" : "Religion" },
      { id: "country-section-sources", label: language === "en" ? "Sources" : "Fuentes" }
    ];
  },
  getViewModes(language = "es") {
    return [
      { key: "full", label: language === "en" ? "Full" : "Completa" },
      { key: "teaching", label: language === "en" ? "Class" : "Docente" },
      { key: "compact", label: language === "en" ? "Compact" : "Compacta" }
    ];
  },
  buildExecutiveSummary(country = {}, options = {}) {
    const language = options.language || "es";
    const population = country.general?.population
      ? options.formatNumber?.(country.general.population) || String(country.general.population)
      : null;
    const economy = country.economy?.gdpPerCapita
      ? `${language === "en" ? "GDP pc" : "PBI pc"} US$ ${options.formatNumber?.(Math.round(country.economy.gdpPerCapita)) || Math.round(country.economy.gdpPerCapita)}`
      : null;
    const system = country.politics?.system || null;
    const bloc = country.politics?.relations?.economicBlocs?.[0]
      || country.politics?.relations?.diplomaticBlocs?.[0]
      || country.politics?.organizations?.[0]?.name
      || country.politics?.organizations?.[0]
      || "";
    const name = country.name || (language === "en" ? "This country" : "Este pais");
    const parts = [
      population ? `${name}: ${population} ${language === "en" ? "inhabitants" : "habitantes"}` : name,
      system,
      economy
    ].filter(Boolean);
    if (bloc) parts.push(`${language === "en" ? "Primary international anchor" : "Principal anclaje internacional"}: ${bloc}`);
    return `${parts.join(". ")}.`;
  },
  buildSectionQuality(country = {}, language = "es") {
    const metadata = country.metadata || {};
    const sections = metadata.sections || metadata.qualityBySection || {};
    return Object.entries(sections).slice(0, 8).map(([key, value]) => ({
      key,
      label: key.replace(/[-_]/g, " "),
      value: typeof value === "object" ? (value.quality || value.status || value.source || "") : value,
      source: typeof value === "object" ? (value.source || value.provenance || "") : "",
      language
    })).filter(item => item.value || item.source);
  },
  buildCurationChecklist(country = {}, conflictGroups = [], language = "es") {
    const items = [];
    const population = Number(country.general?.population || 0);
    const expectedPlaces = population >= 20000000 ? 5 : population >= 1000000 ? 4 : 3;
    const placeNames = new Set([
      ...(country.general?.cities || []).map(city => city?.name || city),
      ...(country.general?.capitals || []).map(city => city?.name || city),
      country.general?.capital?.name
    ].filter(Boolean).map(value => String(value).toLocaleLowerCase("es")));
    if (placeNames.size < expectedPlaces) items.push(language === "en" ? "Complete the main cities and capital." : "Completar ciudades principales y capital.");
    if (!country.history?.events?.length) items.push(language === "en" ? "Add a stronger political timeline." : "Agregar una cronologia politica mas fuerte.");
    if (!country.economy?.exports?.length) items.push(language === "en" ? "Complete exports and productive sectors." : "Completar exportaciones y sectores productivos.");
    if (!country.military?.active) items.push(language === "en" ? "Review military personnel figures." : "Revisar cifras de personal militar.");
    if (!country.politics?.relations || Object.keys(country.politics.relations).length < 3) items.push(language === "en" ? "Deepen international relations." : "Profundizar relaciones internacionales.");
    if (!conflictGroups.length) items.push(language === "en" ? "Connect related conflicts." : "Conectar conflictos relacionados.");
    return items.slice(0, 6);
  },
  getNotesStorageKey(countryCode) {
    return `geo-risk-country-notes:${countryCode || "unknown"}`;
  },
  getFavoriteStorageKey() {
    return COUNTRY_FAVORITES_STORAGE_KEY;
  },
  renderSkeleton(country = {}, language = "es") {
    const name = country.name || (language === "en" ? "Country profile" : "Ficha pais");
    return `
      <div class="country-skeleton" aria-busy="true">
        <div class="country-skeleton-title">${name}</div>
        <div class="country-skeleton-line"></div>
        <div class="country-skeleton-grid">
          <span></span><span></span><span></span><span></span>
        </div>
        <p>${language === "en" ? "Loading detailed sections..." : "Cargando secciones detalladas..."}</p>
      </div>
    `;
  },
  renderDataQuality(country = {}, options = {}) {
    const currentLanguage = options.currentLanguage || "es";
    const escapeHtml = options.escapeHtml || (value => String(value || ""));
    const formatNumber = options.formatNumber || (value => String(value || 0));
    const organizationCount = Number(options.organizationCount || 0);
    const conflictCount = Number(options.conflictCount || 0);
    const religionCount = Array.isArray(country.religion?.composition) ? country.religion.composition.length : 0;
    const cityCount = Array.isArray(country.general?.cities) ? country.general.cities.length : 0;
    const sources = country.metadata?.sources || {};
    const genericSources = COUNTRY_PANEL_DATA_SOURCE_SUMMARY[currentLanguage] || COUNTRY_PANEL_DATA_SOURCE_SUMMARY.es;
    const estimatedFields = Array.isArray(country.metadata?.quality?.estimatedFields) ? country.metadata.quality.estimatedFields : [];
    const curatedFields = Array.isArray(country.metadata?.quality?.curatedFields) ? country.metadata.quality.curatedFields : [];
    const confirmedFields = Array.isArray(country.metadata?.quality?.confirmedFields) ? country.metadata.quality.confirmedFields : [];
    const missingFields = Array.isArray(country.metadata?.quality?.missingFields) ? country.metadata.quality.missingFields : [];
    const sectionStatus = country.metadata?.quality?.sectionStatus || {};
    const provenance = country.metadata?.provenance || {};
    const qualityScore = Number.isFinite(country.metadata?.quality?.score)
      ? Math.max(0, Math.round(country.metadata.quality.score))
      : null;
    const sourceSections = [
      { key: "general", label: "General" },
      { key: "history", label: currentLanguage === "en" ? "History" : "Historia" },
      { key: "economy", label: currentLanguage === "en" ? "Economy" : "Economia" },
      { key: "military", label: currentLanguage === "en" ? "Military" : "Militar" },
      { key: "politics", label: currentLanguage === "en" ? "Politics" : "Politica" },
      { key: "religion", label: "Religion" },
      { key: "symbols", label: currentLanguage === "en" ? "Symbols" : "Simbolos" },
      { key: "relations", label: currentLanguage === "en" ? "Relations" : "Relaciones" }
    ];

    return `
      <div class="data-quality-grid">
        ${[
          [currentLanguage === "en" ? "Organizations" : "Organizaciones", organizationCount],
          [currentLanguage === "en" ? "Conflicts" : "Conflictos", conflictCount],
          [currentLanguage === "en" ? "Religious branches" : "Ramas religiosas", religionCount],
          [currentLanguage === "en" ? "Cities loaded" : "Ciudades cargadas", cityCount],
          [currentLanguage === "en" ? "Estimated fields" : "Campos estimados", estimatedFields.length],
          [currentLanguage === "en" ? "Curated fields" : "Campos curados", curatedFields.length],
          [currentLanguage === "en" ? "Confirmed fields" : "Campos confirmados", confirmedFields.length]
        ].map(([label, value]) => `
          <div class="data-quality-card">
            <span class="data-quality-label">${label}</span>
            <strong class="data-quality-value">${formatNumber(value)}</strong>
          </div>
        `).join("")}
        <div class="data-quality-card">
          <span class="data-quality-label">${currentLanguage === "en" ? "Quality score" : "Puntaje de calidad"}</span>
          <strong class="data-quality-value">${qualityScore !== null ? `${qualityScore}/100` : escapeHtml(options.noData || "Sin datos")}</strong>
        </div>
      </div>
      <p class="data-source-note"><b>${currentLanguage === "en" ? "Validation" : "Validacion"}:</b> ${currentLanguage === "en" ? "local dataset checks currently pass without reported issues" : "los chequeos locales del dataset estan pasando sin incidencias reportadas"}</p>
      <p class="data-source-note"><b>${currentLanguage === "en" ? "Dataset updated" : "Dataset actualizado"}:</b> ${escapeHtml(country.metadata?.updatedAt || "2026-04-06")}</p>
      ${Object.keys(provenance).length ? `<p class="data-source-note"><b>${currentLanguage === "en" ? "Provenance" : "Procedencia"}:</b> ${escapeHtml(Object.entries(provenance).map(([key, value]) => `${key}: ${formatProvenanceValue(value, currentLanguage)}`).join(" | "))}</p>` : ""}
      <p><b>${currentLanguage === "en" ? "Section sources" : "Fuentes por seccion"}:</b></p>
      <ul class="data-source-list">
        ${sourceSections.map(section => {
          const items = Array.isArray(sources[section.key]) && sources[section.key].length ? sources[section.key] : genericSources;
          const statusLabel = sectionStatus[section.key] ? ` - ${escapeHtml(sectionStatus[section.key])}` : "";
          return `<li><b>${escapeHtml(section.label)}</b>${statusLabel}: ${items.map(item => escapeHtml(item)).join(", ")}</li>`;
        }).join("")}
      </ul>
      <p><b>${currentLanguage === "en" ? "Missing fields" : "Campos faltantes"}:</b> ${missingFields.length ? escapeHtml(missingFields.join(", ")) : (currentLanguage === "en" ? "none" : "ninguno")}</p>
      <p><b>${currentLanguage === "en" ? "Estimated fields" : "Campos estimados"}:</b> ${estimatedFields.length ? escapeHtml(estimatedFields.join(", ")) : (currentLanguage === "en" ? "none" : "ninguno")}</p>
      <p><b>${currentLanguage === "en" ? "Confirmed fields" : "Campos confirmados"}:</b> ${confirmedFields.length ? escapeHtml(confirmedFields.join(", ")) : (currentLanguage === "en" ? "none" : "ninguno")}</p>
      <p><b>${currentLanguage === "en" ? "Curated fields" : "Campos curados"}:</b> ${curatedFields.length ? escapeHtml(curatedFields.join(", ")) : (currentLanguage === "en" ? "none" : "ninguno")}</p>
    `;
  },
  buildFallbackSummary(country) {
    const population = country?.general?.population || 0;
    const organizations = Array.isArray(country?.politics?.organizations) ? country.politics.organizations.length : 0;
    const conflicts = Array.isArray(country?.military?.conflicts) ? country.military.conflicts.length : 0;
    return {
      population,
      organizations,
      conflicts
    };
  }
};
