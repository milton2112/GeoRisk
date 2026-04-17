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
      formationYear: "AÃ±o de formacion",
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
      compareYear: "AÃ±o de formacion",
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

  function repairMojibake(value) {
    const raw = String(value || "");
    if (!raw || !/[ÃƒÃ‚Ã¢â‚¬Å“Ã¢â‚¬\uFFFD]/.test(raw)) {
      return raw;
    }
    return raw
      .replace(/ÃƒÂ¡/g, "Ã¡")
      .replace(/ÃƒÂ©/g, "Ã©")
      .replace(/ÃƒÂ­/g, "Ã­")
      .replace(/ÃƒÂ³/g, "Ã³")
      .replace(/ÃƒÂº/g, "Ãº")
      .replace(/ÃƒÂ±/g, "Ã±")
      .replace(/ÃƒÂ¼/g, "Ã¼")
      .replace(/ÃƒÂ/g, "Ã")
      .replace(/Ãƒâ€°/g, "Ã‰")
      .replace(/ÃƒÂ/g, "Ã")
      .replace(/Ãƒâ€œ/g, "Ã“")
      .replace(/ÃƒÅ¡/g, "Ãš")
      .replace(/Ãƒâ€˜/g, "Ã‘")
      .replace(/ÃƒÅ“/g, "Ãœ")
      .replace(/Ã¢â‚¬â€œ/g, "-")
      .replace(/Ã¢â‚¬â€/g, "-")
      .replace(/Ã¢â‚¬Ëœ|Ã¢â‚¬â„¢/g, "'")
      .replace(/Ã¢â‚¬Å“|Ã¢â‚¬ï¿½/g, "\"")
      .replace(/Ã‚/g, "");
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
    const cleaned = String(value)
      .replace(/[%~â‰ˆ]/g, "")
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
    return String(value || "")
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
      return UI_STRINGS[language]?.[key] || UI_STRINGS.es[key] || key;
    };
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
    createTranslator
  };
})();
