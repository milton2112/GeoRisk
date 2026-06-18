window.GeoRiskCountryPanel = {
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
    return "geo-risk-country-favorites";
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
