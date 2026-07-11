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

function renderPanelSection(title, content, isOpen, sectionId, escapeHtml) {
  const safeId = sectionId ? ` id="${escapeHtml(sectionId)}"` : "";
  return `
    <details class="panel-section"${safeId}${isOpen ? " open" : ""}>
      <summary>${escapeHtml(title)}</summary>
      <div class="panel-content">${content}</div>
    </details>
  `;
}

function renderQuickNav(items, activeSection, escapeHtml) {
  const validItems = (items || []).filter(item => item?.id && item?.label);
  if (!validItems.length) {
    return "";
  }
  const activeId = activeSection || validItems[0].id;
  return `
    <div class="country-quick-nav">
      ${validItems.map(item => `<button type="button" class="country-nav-chip${item.id === activeId ? " is-active" : ""}" data-country-nav="${escapeHtml(item.id)}" aria-pressed="${item.id === activeId ? "true" : "false"}">${escapeHtml(item.label)}</button>`).join("")}
    </div>
  `;
}

function renderProfileOverview(options) {
  const { country, countryCode, overviewStats, escapeHtml, translateContinentName, noData } = options;
  return `
    <div class="country-meta-strip">
      <span class="country-code-badge">${escapeHtml(countryCode || "---")}</span>
      <span class="country-meta-pill">${escapeHtml(translateContinentName(country.continent || "Unknown"))}</span>
      <span class="country-meta-pill">${escapeHtml(country.politics?.system || noData)}</span>
    </div>
    <div class="country-overview-grid">
      ${(overviewStats || []).map(item => `
        <div class="overview-card">
          <span class="overview-label">${escapeHtml(item.label)}</span>
          <strong class="overview-value">${escapeHtml(item.value)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderProfileMetaRibbon(country, conflictCount, options) {
  const { language, formatNumber, escapeHtml, noData } = options;
  const chips = [
    { label: language === "en" ? "Population" : "Poblacion", value: formatNumber(country.general?.population || 0) },
    { label: language === "en" ? "System" : "Sistema", value: country.politics?.system || noData },
    { label: language === "en" ? "Main religion" : "Religion principal", value: country.religion?.summary || noData },
    { label: language === "en" ? "Conflicts" : "Conflictos", value: formatNumber(conflictCount || 0) },
    { label: language === "en" ? "Updated" : "Actualizado", value: country.metadata?.lastUpdated || country.metadata?.updatedAt || noData }
  ].filter(item => item.value && item.value !== noData);

  return `<div class="country-meta-ribbon">${chips.map(item => `<span class="country-meta-pill"><b>${escapeHtml(item.label)}:</b> ${escapeHtml(String(item.value))}</span>`).join("")}</div>`;
}

function renderCurationTodo(country, items, actions, options) {
  const { language, escapeHtml } = options;
  const qualityScore = Number.isFinite(country?.metadata?.quality?.score)
    ? Math.max(0, Math.round(country.metadata.quality.score))
    : null;
  const healthLabel = qualityScore === null
    ? (language === "en" ? "pending score" : "puntaje pendiente")
    : `${qualityScore}/100`;

  return `
    <aside class="curation-todo-card" aria-label="${language === "en" ? "Curation checklist" : "Checklist de curaduria"}">
      <div>
        <span class="curation-todo-kicker">${language === "en" ? "Curation status" : "Estado de curaduria"}</span>
        <h3>${language === "en" ? "What still needs curation" : "Que falta curar"}</h3>
      </div>
      <span class="curation-score-pill">${escapeHtml(healthLabel)}</span>
      ${(items || []).length
        ? `<ul class="curation-todo-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : `<p class="curation-todo-complete">${language === "en" ? "This profile is comparatively complete; keep validating sources and symbols." : "Esta ficha esta comparativamente completa; conviene seguir validando fuentes y simbolos."}</p>`}
      ${(actions || []).length ? `
        <div class="curation-action-grid">
          ${actions.map(item => `
            <div class="curation-action-card">
              <strong>${escapeHtml(item.section)}</strong>
              <span>${escapeHtml(item.action)}</span>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </aside>
  `;
}

function renderDeferredSectionPrompt(sectionId, options) {
  const { language, escapeHtml } = options;
  return `
    <div class="deferred-country-section">
      <p>${language === "en" ? "This section loads only when opened." : "Esta seccion se carga solo cuando la abris."}</p>
      <button type="button" class="panel-action-button" data-country-load-section="${escapeHtml(sectionId)}">${language === "en" ? "Load section" : "Cargar seccion"}</button>
    </div>
  `;
}

function renderQualityHighlights(country, options) {
  const { language, formatNumber, escapeHtml, noData } = options;
  const quality = country?.metadata?.quality || {};
  const provenance = country?.metadata?.provenance || {};
  const qualityScore = Number.isFinite(quality.score) ? Math.max(0, Math.round(quality.score)) : null;
  const statusEntries = Object.entries(quality.sectionStatus || {});
  const curatedSections = statusEntries.filter(([, value]) => value === "curated" || value === "confirmed").length;
  const estimatedFields = Array.isArray(quality.estimatedFields) ? quality.estimatedFields.length : 0;
  const missingFields = Array.isArray(quality.missingFields) ? quality.missingFields.length : 0;

  return `
    <div class="source-audit-grid">
      <div class="overview-card"><span class="overview-label">${language === "en" ? "Quality score" : "Calidad"}</span><strong class="overview-value">${qualityScore !== null ? `${qualityScore}/100` : noData}</strong></div>
      <div class="overview-card"><span class="overview-label">${language === "en" ? "Updated" : "Actualizado"}</span><strong class="overview-value">${escapeHtml(country?.metadata?.updatedAt || "2026-04-16")}</strong></div>
      <div class="overview-card"><span class="overview-label">${language === "en" ? "Curated sections" : "Secciones curadas"}</span><strong class="overview-value">${formatNumber(curatedSections)}</strong></div>
      <div class="overview-card"><span class="overview-label">${language === "en" ? "Estimated fields" : "Campos estimados"}</span><strong class="overview-value">${formatNumber(estimatedFields)}</strong></div>
      <div class="overview-card"><span class="overview-label">${language === "en" ? "Missing fields" : "Campos faltantes"}</span><strong class="overview-value">${formatNumber(missingFields)}</strong></div>
    </div>
    ${Object.keys(provenance).length ? `
      <div class="provenance-grid">
        ${Object.entries(provenance).map(([key, value]) => `
          <div class="provenance-card">
            <span class="overview-label">${escapeHtml(key)}</span>
            <strong class="overview-value">${escapeHtml(formatProvenanceValue(value, language) || noData)}</strong>
          </div>
        `).join("")}
      </div>
    ` : ""}
  `;
}

function renderLocalTools(countryCode, savedNotes, qualityItems, options) {
  if (!countryCode) {
    return "";
  }
  const { language, escapeHtml } = options;
  const qualityMarkup = (qualityItems || []).length
    ? `<div class="country-local-quality">${qualityItems.map(item => `
        <span class="country-meta-pill"><b>${escapeHtml(item.label)}:</b> ${escapeHtml(String(item.value || item.source || ""))}</span>
      `).join("")}</div>`
    : "";

  return `
    <div class="country-local-tools">
      <h4>${language === "en" ? "Local notes and provenance" : "Notas locales y procedencia"}</h4>
      ${qualityMarkup}
      <textarea class="country-notes-input" data-country-notes="${escapeHtml(countryCode)}" rows="4" placeholder="${language === "en" ? "Private notes saved on this device" : "Notas privadas guardadas en este dispositivo"}">${escapeHtml(savedNotes)}</textarea>
      <small class="country-notes-status" data-country-notes-status aria-live="polite">${savedNotes
        ? (language === "en" ? "Notes saved on this device." : "Notas guardadas en este dispositivo.")
        : (language === "en" ? "Saved automatically on this device." : "Se guardan automaticamente en este dispositivo.")}</small>
      <div class="panel-actions-row">
        <button class="panel-action-button" type="button" data-quick-compare="${escapeHtml(countryCode)}">${language === "en" ? "Quick compare" : "Comparacion rapida"}</button>
        <button class="panel-action-button" type="button" data-share-country="${escapeHtml(countryCode)}">${language === "en" ? "Share profile" : "Compartir ficha"}</button>
      </div>
    </div>
  `;
}

function renderProfile(options = {}) {
  const country = options.country || {};
  const countryCode = options.countryCode || "";
  const fallbackName = options.fallbackName || (options.language === "en" ? "Country" : "Pais");
  const language = options.language || "es";
  const escapeHtml = options.escapeHtml || (value => String(value ?? ""));
  const formatNumber = options.formatNumber || (value => String(value || 0));
  const translate = options.translate || (key => key);
  const noData = options.noData || translate("noData");
  const renderers = options.renderers || {};
  const call = (name, ...args) => typeof renderers[name] === "function" ? renderers[name](...args) : "";
  const normalizeList = typeof renderers.uniqueNormalizedList === "function"
    ? renderers.uniqueNormalizedList
    : items => [...new Set((items || []).filter(Boolean))];
  const getOrganizationDisplayName = typeof renderers.getOrganizationDisplayName === "function"
    ? renderers.getOrganizationDisplayName
    : item => item?.name || item || "";
  const translateContinentName = typeof renderers.translateContinentName === "function"
    ? renderers.translateContinentName
    : value => value;
  const general = country.general || {};
  const economy = country.economy || {};
  const military = country.military || {};
  const history = country.history || {};
  const politics = country.politics || {};
  const viewMode = options.viewMode || "full";
  const activeSection = options.activeSection || "country-section-general";
  const loadedSections = new Set(options.loadedSections || ["country-section-general"]);
  const compactMode = viewMode === "compact";
  const teachingMode = viewMode === "teaching";
  const profileName = country.name || fallbackName;
  const sharedOptions = { language, formatNumber, escapeHtml, noData };
  const deferredPrompt = sectionId => renderDeferredSectionPrompt(sectionId, sharedOptions);
  const section = (title, content, isOpen, sectionId) => renderPanelSection(title, content, isOpen, sectionId, escapeHtml);
  const relatedTerritories = options.relatedTerritories || [];
  const conflictGroups = options.conflictGroups || [];
  const conflicts = options.conflicts || [];
  const conflictLabel = history.year
    ? (language === "en" ? "Conflicts since the formation year:" : "Conflictos desde su ano de formacion:")
    : (language === "en" ? "Recorded conflicts:" : "Conflictos registrados:");
  const dataQualityHtml = loadedSections.has("country-section-sources")
    ? window.GeoRiskCountryPanel?.renderDataQuality?.(country, {
        currentLanguage: language,
        organizationCount: options.organizationCount || 0,
        conflictCount: options.qualityConflictCount || 0,
        formatNumber,
        escapeHtml,
        noData
      }) || ""
    : "";

  return `
    <div class="country-profile country-profile-mode-${escapeHtml(viewMode)}">
      <div class="country-title">
        ${call("renderFlagVisual", countryCode, profileName, "country-flag", options.symbolAssets?.flagSrc)}
        <div class="country-heading">
          <h2 id="country-panel-title">${escapeHtml(profileName)}</h2>
          <p class="country-official-name">${escapeHtml(general.officialName || profileName)}</p>
        </div>
        ${call("renderCoatVisual", countryCode, language === "en" ? `${profileName} coat of arms` : `${profileName} escudo`, options.symbolAssets?.coatSrc)}
      </div>
      <div class="panel-actions-row">
        <button id="add-to-compare-button" class="panel-action-button" type="button" ${countryCode ? "" : "disabled"}>${escapeHtml(translate("addToCompare"))}</button>
        <button class="panel-action-button" type="button" data-country-favorite="${escapeHtml(countryCode)}">${language === "en" ? "Favorite" : "Favorito"}</button>
        <button class="panel-action-button" type="button" data-export-target="country-panel" data-export-format="png">${language === "en" ? "Export image" : "Exportar imagen"}</button>
        <button class="panel-action-button" type="button" data-export-target="country-panel" data-export-format="pdf">${language === "en" ? "Export PDF" : "Exportar PDF"}</button>
        <button class="panel-action-button" type="button" data-share-country="${escapeHtml(countryCode)}">${language === "en" ? "Share" : "Compartir"}</button>
      </div>
      <div class="country-mode-switch" role="group" aria-label="${language === "en" ? "Country profile mode" : "Modo de ficha"}">
        ${(options.viewModes || []).map(mode => `<button type="button" class="timeline-filter${mode.key === viewMode ? " is-active" : ""}" data-country-view-mode="${escapeHtml(mode.key)}">${escapeHtml(mode.label)}</button>`).join("")}
      </div>
      <div class="country-executive-summary">
        <span>${language === "en" ? "Executive summary" : "Resumen ejecutivo"}</span>
        <p>${escapeHtml(options.executiveSummary || "")}</p>
      </div>
      ${renderProfileOverview({ country, countryCode, overviewStats: options.overviewStats, escapeHtml, translateContinentName, noData })}
      ${renderProfileMetaRibbon(country, options.conflictCount, sharedOptions)}
      ${renderCurationTodo(country, options.curationItems, options.curationActions, sharedOptions)}
      ${renderQuickNav(options.sectionDescriptors, activeSection, escapeHtml)}
      ${section(
        translate("general"),
        `
          <p><b>${escapeHtml(translate("population"))}:</b> ${formatNumber(general.population)}</p>
          <p><b>${escapeHtml(translate("continent"))}:</b> ${escapeHtml(translateContinentName(country.continent))}</p>
          <p><b>${language === "en" ? "Capitals" : "Capitales"}:</b></p>
          ${call("renderCapitalProfiles", general)}
          <p><b>${language === "en" ? "Official name" : "Nombre oficial"}:</b> ${escapeHtml(general.officialName || profileName || noData)}</p>
          <p><b>${language === "en" ? "Official and main languages" : "Idiomas oficiales y principales"}:</b></p>
          ${call("renderLanguages", general)}
          <p><b>${language === "en" ? "State structure" : "Estructura del Estado"}:</b> ${escapeHtml(general.stateStructure || noData)}</p>
          <p><b>${language === "en" ? "Primary subdivisions" : "Subdivisiones principales"}:</b> ${call("renderSubdivisionSummary", general)}</p>
          <p><b>${language === "en" ? "Historical names" : "Nombres historicos"}:</b></p>
          ${call("renderRelationChips", general.historicalNames)}
          <p><b>${language === "en" ? "Symbols" : "Simbolos"}:</b></p>
          ${call("renderSymbolShowcase", country, countryCode)}
          <p><b>${escapeHtml(translate("cities"))}:</b></p>
          ${call("renderCities", general)}
        `,
        true,
        "country-section-general"
      )}
      ${section(
        translate("history"),
        loadedSections.has("country-section-history") ? `
          <p><b>${escapeHtml(translate("origin"))}:</b> ${call("translateHistoryText", history.origin)}</p>
          <p><b>${escapeHtml(translate("type"))}:</b> ${call("translateHistoryText", history.type)}</p>
          <p><b>${escapeHtml(translate("formationYear"))}:</b> ${history.year || noData}</p>
          <p><b>${escapeHtml(translate("timeline"))}:</b></p>
          ${call("renderTimeline", country)}
        ` : deferredPrompt("country-section-history"),
        activeSection === "country-section-history",
        "country-section-history"
      )}
      ${section(
        translate("economy"),
        loadedSections.has("country-section-economy") ? `
          <p><b>${escapeHtml(translate("gdp"))}:</b> ${economy.gdp ? `US$ ${formatNumber(Math.round(economy.gdp))}` : noData}</p>
          <p><b>${escapeHtml(translate("gdpPerCapita"))}:</b> ${economy.gdpPerCapita ? `US$ ${formatNumber(Math.round(economy.gdpPerCapita))}` : noData}</p>
          <p><b>${escapeHtml(translate("inflation"))}:</b> ${call("formatInflation", economy.inflation)}</p>
          <p><b>${language === "en" ? "Economic snapshot" : "Pulso economico"}:</b></p>
          ${call("renderEconomyMiniMetrics", country)}
          <p><b>${language === "en" ? "Exports" : "Exportaciones"}:</b></p>
          ${call("renderList", economy.exports)}
          <p><b>${language === "en" ? "Industries" : "Industrias"}:</b></p>
          ${call("renderList", economy.industries)}
        ` : deferredPrompt("country-section-economy"),
        activeSection === "country-section-economy",
        "country-section-economy"
      )}
      ${compactMode ? "" : section(
        translate("military"),
        options.shouldRenderMilitaryDetail ? `
          <p><b>${escapeHtml(translate("activePersonnel"))}:</b> ${formatNumber(military.active)}</p>
          <p><b>${escapeHtml(translate("reserve"))}:</b> ${formatNumber(military.reserve)}</p>
          ${call("renderConflictOverview", conflictGroups, country)}
          ${call("renderRelatedConflictSummary", conflictGroups)}
          <p><b>${conflictLabel}</b></p>
          ${call("renderConflicts", conflicts, conflictGroups)}
        ` : `
          <div class="deferred-country-section">
            <p>${language === "en" ? "Conflict hierarchy and detailed filters load when this section is opened." : "La jerarquia y los filtros de conflictos se cargan al abrir esta seccion."}</p>
            <button type="button" class="panel-action-button" data-country-load-section="country-section-military">${language === "en" ? "Load military detail" : "Cargar detalle militar"}</button>
          </div>
        `,
        activeSection === "country-section-military",
        "country-section-military"
      )}
      ${compactMode ? "" : section(
        translate("politics"),
        loadedSections.has("country-section-politics") ? `
          <p><b>${escapeHtml(translate("politicalSystem"))}:</b> ${escapeHtml(politics.system || noData)}</p>
          <p><b>${escapeHtml(translate("organizations"))}:</b></p>
          ${call("renderOrganizations", politics.organizations)}
          <p><b>${language === "en" ? "Historical and current rivals" : "Rivales historicos y actuales"}:</b></p>
          ${call("renderRivals", politics.rivals)}
        ` : deferredPrompt("country-section-politics"),
        activeSection === "country-section-politics",
        "country-section-politics"
      )}
      ${compactMode || teachingMode ? "" : section(
        translate("relations"),
        loadedSections.has("country-section-relations") ? `
          ${call("renderRelationsSummary", country, countryCode)}
          ${call("renderRelationNetwork", country, countryCode)}
          <div class="relation-group"><p class="relation-title">${language === "en" ? "Former metropole" : "Ex metropoli"}</p>${call("renderRelationChips", country.politics?.relations?.exMetropole ? [country.politics.relations.exMetropole] : [])}</div>
          <div class="relation-group"><p class="relation-title">${language === "en" ? "Former colonies / linked territories" : "Ex colonias y territorios vinculados"}</p>${call("renderRelationChips", normalizeList([...(country.politics?.relations?.exColonies || []), ...(country.politics?.relations?.associatedTerritories || country.politics?.relations?.linkedTerritories || []), ...relatedTerritories]))}</div>
          <div class="relation-group"><p class="relation-title">${language === "en" ? "Military blocs" : "Bloques militares"}</p>${call("renderRelationChips", country.politics?.relations?.militaryBlocs)}</div>
          <div class="relation-group"><p class="relation-title">${language === "en" ? "Economic blocs" : "Bloques economicos"}</p>${call("renderRelationChips", country.politics?.relations?.economicBlocs)}</div>
          <div class="relation-group"><p class="relation-title">${language === "en" ? "Diplomatic blocs" : "Bloques diplomaticos"}</p>${call("renderRelationChips", country.politics?.relations?.diplomaticBlocs)}</div>
          <div class="relation-group"><p class="relation-title">${language === "en" ? "Military allies" : "Aliados militares"}</p>${call("renderRelationChips", country.politics?.relations?.militaryAllies)}</div>
          <div class="relation-group"><p class="relation-title">${language === "en" ? "Economic partners" : "Socios economicos"}</p>${call("renderRelationChips", country.politics?.relations?.economicPartners)}</div>
          <div class="relation-group"><p class="relation-title">${language === "en" ? "Diplomatic partners" : "Socios diplomaticos"}</p>${call("renderRelationChips", country.politics?.relations?.diplomaticPartners)}</div>
          <div class="relation-group"><p class="relation-title">${language === "en" ? "Disputes and contested spaces" : "Disputas y espacios disputados"}</p>${call("renderRelationChips", country.politics?.relations?.disputedTerritories || country.politics?.relations?.disputes)}</div>
          <div class="relation-group"><p class="relation-title">${language === "en" ? "Dependencies and protectorates" : "Dependencias y protectorados"}</p>${call("renderRelationChips", country.politics?.relations?.dependencies || country.politics?.relations?.protectorates)}</div>
          <div class="relation-group"><p class="relation-title">${escapeHtml(translate("organizations"))}</p>${call("renderRelationChips", (politics.organizations || []).slice(0, 8).map(getOrganizationDisplayName))}</div>
          <div class="relation-group"><p class="relation-title">${escapeHtml(translate("historicalRivals"))}</p>${call("renderRelationChips", normalizeList([...((politics.rivals || []).filter(rival => (rival.type || "historico") !== "actual").map(rival => rival.name || rival)), ...(country.politics?.relations?.historicalRivals || [])]))}</div>
          <div class="relation-group"><p class="relation-title">${escapeHtml(translate("currentRivals"))}</p>${call("renderRelationChips", normalizeList([...((politics.rivals || []).filter(rival => rival.type === "actual").map(rival => rival.name || rival)), ...(country.politics?.relations?.currentRivals || [])]))}</div>
        ` : deferredPrompt("country-section-relations"),
        activeSection === "country-section-relations",
        "country-section-relations"
      )}
      ${section(
        translate("religion"),
        loadedSections.has("country-section-religion")
          ? `${call("renderReligionMiniMetrics", country.religion)}${call("renderReligion", country.religion)}`
          : deferredPrompt("country-section-religion"),
        activeSection === "country-section-religion",
        "country-section-religion"
      )}
      ${section(
        language === "en" ? "Sources and quality" : "Fuentes y calidad",
        loadedSections.has("country-section-sources")
          ? `${renderQualityHighlights(country, sharedOptions)}${dataQualityHtml}${renderLocalTools(countryCode, options.savedNotes || "", options.sectionQualityItems, sharedOptions)}`
          : deferredPrompt("country-section-sources"),
        activeSection === "country-section-sources",
        "country-section-sources"
      )}
    </div>
  `;
}

window.GeoRiskCountryPanel = {
  formatProvenanceValue,
  handleInteraction,
  renderProfile,
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
