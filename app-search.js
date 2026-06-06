(() => {
  const TYPE_ORDER = ["country", "continent", "ranking", "religion", "system", "organization", "bloc", "rival", "language", "conflict", "period"];
  const METRIC_ALIASES = [
    { metric: "conflicts", pattern: /(mas conflictos|more conflicts|conflictivos|guerras|wars)/ },
    { metric: "activeConflicts", pattern: /(conflictos activos|active conflicts|guerras activas)/ },
    { metric: "organizations", pattern: /(mas organizaciones|more organizations|organizaciones|organizations)/ },
    { metric: "population", pattern: /(mas poblacion|mayor poblacion|population|poblacion)/ },
    { metric: "gdp", pattern: /(mayor pbi|mayor pib|gdp|economia mas grande)/ },
    { metric: "gdpPerCapita", pattern: /(pbi per capita|pib per capita|gdp per capita|riqueza per capita)/ },
    { metric: "military", pattern: /(presion militar|militares|personal militar|military pressure|military)/ },
    { metric: "fragility", pattern: /(fragilidad|fragiles|fragile|fragility|riesgo)/ },
    { metric: "diplomacy", pattern: /(diplomatico|diplomacia|diplomatic|diplomacy)/ },
    { metric: "dataQuality", pattern: /(calidad de datos|data quality|mejor curados|curaduria)/ }
  ];

  function normalizeText(value = "") {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function scoreText(query, candidate) {
    const q = normalizeText(query);
    const c = normalizeText(candidate);
    if (!q || !c) return Number.POSITIVE_INFINITY;
    if (c === q) return 0;
    if (c.startsWith(q)) return 1;
    if (c.includes(q)) return 2 + Math.max(0, c.length - q.length) / 100;
    const tokens = q.split(" ").filter(Boolean);
    const matched = tokens.filter(token => c.includes(token)).length;
    return matched ? 5 + (tokens.length - matched) : Number.POSITIVE_INFINITY;
  }

  function buildAliasEntriesFromSearchIndex(index = []) {
    return index.flatMap(country => [
      { label: country.name, value: country.code, type: "country", subtitle: country.continent || "Pais", aliases: country.aliases || [] },
      ...(country.facets || []).map(facet => ({ label: facet, value: facet, type: "facet", subtitle: country.name, aliases: [country.name] }))
    ]);
  }

  function rankSuggestions(items = [], query = "", options = {}) {
    const limit = options.isMobile ? Math.min(options.limit || 6, 6) : (options.limit || 10);
    return items
      .map(item => {
        const scores = [
          scoreText(query, item.label),
          scoreText(query, item.subtitle),
          ...(item.normalizedAliases || item.aliases || []).map(alias => scoreText(query, alias))
        ];
        return { ...item, score: Math.min(...scores) };
      })
      .filter(item => Number.isFinite(item.score))
      .sort((a, b) => a.score - b.score || TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) || String(a.label).localeCompare(String(b.label), "es"))
      .slice(0, limit);
  }

  function groupSuggestions(items = [], language = "es") {
    const labels = {
      country: language === "en" ? "Countries" : "Paises",
      continent: language === "en" ? "Continents" : "Continentes",
      ranking: "Rankings",
      religion: language === "en" ? "Religions" : "Religiones",
      system: language === "en" ? "Political systems" : "Sistemas politicos",
      organization: language === "en" ? "Organizations" : "Organizaciones",
      bloc: language === "en" ? "Blocs" : "Bloques",
      rival: language === "en" ? "Rivalries" : "Rivalidades",
      language: language === "en" ? "Languages" : "Idiomas",
      conflict: language === "en" ? "Conflicts" : "Conflictos",
      period: language === "en" ? "Periods" : "Periodos"
    };
    return items.map(item => ({ ...item, groupLabel: labels[item.type] || labels[item.type === "facet" ? "country" : item.type] || item.type }));
  }

  function findAliasValue(normalized, aliasEntries = []) {
    for (const entry of aliasEntries) {
      for (const [alias, value] of entry.entries || []) {
        if (normalized.includes(normalizeText(alias))) return value;
      }
    }
    return "";
  }

  function parseNaturalQuery(rawQuery = "", context = {}) {
    const normalized = normalizeText(rawQuery);
    const metricMatch = METRIC_ALIASES.find(item => item.pattern.test(normalized));
    if (!metricMatch) return null;
    const filters = {
      continent: findAliasValue(normalized, [{ entries: context.continents || [] }]),
      religion: findAliasValue(normalized, [{ entries: context.religions || [] }]),
      system: findAliasValue(normalized, [{ entries: context.systems || [] }]),
      organization: findAliasValue(normalized, [{ entries: context.organizations || [] }]),
      bloc: findAliasValue(normalized, [{ entries: context.blocs || [] }]),
      rival: findAliasValue(normalized, [{ entries: context.rivals || [] }])
    };
    return {
      kind: "ranking",
      metric: metricMatch.metric,
      label: rawQuery,
      filters,
      chips: Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
    };
  }

  function createRecentSearchCache(maxEntries = 16) {
    const cache = new Map();
    return {
      get(key) {
        return cache.get(normalizeText(key));
      },
      set(key, value) {
        const normalized = normalizeText(key);
        if (!normalized) return value;
        cache.delete(normalized);
        cache.set(normalized, value);
        while (cache.size > maxEntries) {
          cache.delete(cache.keys().next().value);
        }
        return value;
      },
      clear() {
        cache.clear();
      },
      size() {
        return cache.size;
      }
    };
  }

  window.GeoRiskSearch = {
    normalizeText,
    buildAliasEntriesFromSearchIndex,
    rankSuggestions,
    groupSuggestions,
    parseNaturalQuery,
    createRecentSearchCache
  };
})();
