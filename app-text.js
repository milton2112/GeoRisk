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
