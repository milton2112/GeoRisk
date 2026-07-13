(() => {
  const TYPE_ORDER = [
    "country",
    "continent",
    "ranking",
    "religion",
    "religion_denomination",
    "system",
    "organization",
    "bloc",
    "rival",
    "language",
    "metropole",
    "conflict",
    "period",
    "history_type",
    "origin",
    "facet"
  ];
  const ALIAS_RESULT_TYPES = [
    ["country", "countries"],
    ["continent", "continents"],
    ["religion", "religions"],
    ["religion_denomination", "religionDenominations"],
    ["system", "systems"],
    ["organization", "organizations"],
    ["language", "languages"],
    ["bloc", "blocs"],
    ["metropole", "metropoles"],
    ["conflict", "conflicts"],
    ["period", "periods"],
    ["history_type", "historyTypes"],
    ["origin", "origins"],
    ["rival", "rivals"]
  ];
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
  let publicConflictIndexPromise = null;

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
    const typeOrder = type => {
      const index = TYPE_ORDER.indexOf(type);
      return index >= 0 ? index : TYPE_ORDER.length;
    };
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
      .sort((a, b) => a.score - b.score || typeOrder(a.type) - typeOrder(b.type) || String(a.label).localeCompare(String(b.label), "es"))
      .slice(0, limit);
  }

  function groupSuggestions(items = [], language = "es") {
    const labels = {
      country: language === "en" ? "Countries" : "Paises",
      continent: language === "en" ? "Continents" : "Continentes",
      ranking: "Rankings",
      religion: language === "en" ? "Religions" : "Religiones",
      religion_denomination: language === "en" ? "Denominations" : "Denominaciones",
      system: language === "en" ? "Political systems" : "Sistemas politicos",
      organization: language === "en" ? "Organizations" : "Organizaciones",
      bloc: language === "en" ? "Blocs" : "Bloques",
      rival: language === "en" ? "Rivalries" : "Rivalidades",
      language: language === "en" ? "Languages" : "Idiomas",
      metropole: language === "en" ? "Former metropoles" : "Ex metropoli",
      conflict: language === "en" ? "Conflicts" : "Conflictos",
      period: language === "en" ? "Periods" : "Periodos",
      history_type: language === "en" ? "Historical formation" : "Formacion historica",
      origin: language === "en" ? "Historical origins" : "Origenes historicos"
    };
    return items.map(item => ({ ...item, groupLabel: labels[item.type === "facet" ? "country" : item.type] || item.type }));
  }

  function findAliasValue(normalized, aliasEntries = []) {
    for (const entry of aliasEntries) {
      for (const [alias, value] of entry.entries || []) {
        if (normalized.includes(normalizeText(alias))) return value;
      }
    }
    return "";
  }

  function getExactAliasValue(source, normalized) {
    if (!source || !normalized) return "";
    if (typeof source.get === "function") {
      return source.get(normalized) || "";
    }
    for (const [alias, value] of source) {
      if (normalizeText(alias) === normalized) return value;
    }
    return "";
  }

  function resolveAliasResult(rawQuery = "", context = {}, options = {}) {
    const normalized = normalizeText(rawQuery);
    if (!normalized) return null;
    const allowedTypes = Array.isArray(options.types) && options.types.length
      ? new Set(options.types)
      : null;

    for (const [type, contextKey] of ALIAS_RESULT_TYPES) {
      if (allowedTypes && !allowedTypes.has(type)) continue;
      const value = getExactAliasValue(context[contextKey], normalized);
      if (!value) continue;

      if (type === "country") {
        const country = context.countryNames?.[value];
        const label = typeof country === "string" ? country : country?.name;
        if (!label) continue;
        return { label, type, value };
      }

      const label = type === "continent" && typeof context.translateContinentName === "function"
        ? context.translateContinentName(value)
        : value;
      return { label, type, value };
    }

    return null;
  }

  function uniqueNormalizedValues(values = []) {
    const seen = new Set();
    return values
      .map(normalizeText)
      .filter(value => {
        if (!value || seen.has(value)) return false;
        seen.add(value);
        return true;
      });
  }

  function getPublicConflictSearchKeys(name = "", translateConflictName = value => value) {
    return uniqueNormalizedValues([name, translateConflictName(name)]);
  }

  function shouldSearchPublicConflictIndex(query = "") {
    const normalized = normalizeText(query);
    return normalized.length >= 4;
  }

  async function fetchPublicConflictsIndex(url, fetchResourceCached) {
    if (typeof fetchResourceCached === "function") {
      return fetchResourceCached(url, "json");
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`No se pudo cargar ${url}: ${response.status}`);
    }
    return response.json();
  }

  async function findPublicConflictIndexEntry(rawQuery = "", options = {}) {
    const translateConflictName = options.translateConflictName || (value => value);
    const queryKeys = getPublicConflictSearchKeys(rawQuery, translateConflictName);
    if (!queryKeys.length || !shouldSearchPublicConflictIndex(rawQuery)) {
      return null;
    }

    if (!publicConflictIndexPromise) {
      const version = options.appVersion || window.GeoRiskAppVersion || "";
      const url = `./data/conflicts_index.json${version ? `?v=${version}` : ""}`;
      publicConflictIndexPromise = fetchPublicConflictsIndex(url, options.fetchResourceCached)
        .then(index => (Array.isArray(index) ? index : []).map(entry => ({
          ...entry,
          searchKeys: getPublicConflictSearchKeys(entry?.name, translateConflictName)
        })))
        .catch(error => {
          console.warn("No se pudo cargar el indice publico de conflictos:", error);
          return [];
        });
    }

    const entries = await publicConflictIndexPromise;
    return entries.find(entry =>
      entry.searchKeys?.some(key => queryKeys.includes(key))
    ) || entries.find(entry =>
      entry.searchKeys?.some(key => queryKeys.some(query => key.includes(query) || query.includes(key)))
    ) || null;
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

  function parseSemanticFilters(rawQuery = "", context = {}) {
    const normalize = typeof context.normalizeText === "function" ? context.normalizeText : normalizeText;
    const normalized = normalize(rawQuery);
    const findContextValue = key => findAliasValue(normalized, [{ entries: context[key] || [] }]);
    const filters = {
      continent: findContextValue("continents"),
      religion: "",
      system: "",
      organization: "",
      language: "",
      bloc: "",
      metropole: "",
      conflict: "",
      period: "",
      historyType: "",
      origin: "",
      rival: "",
      minPopulation: 0
    };

    const hasIslam = /\bislam|\bmusulman/.test(normalized);
    const hasChristian = /\bcristian/.test(normalized);
    const hasConstitutionalMonarchy = /monarquias? constitucional(?:es)?|constitutional monarch(?:y|ies)?/.test(normalized);
    const hasPresidentialRepublic = /republicas? presidenciales?|presidential republic/.test(normalized);

    if (hasIslam) {
      filters.religion = "Islam";
    } else if (hasChristian) {
      filters.religion = "Cristianismo";
    }

    filters.religion = findContextValue("religions") || filters.religion;
    filters.system = findContextValue("systems");
    if (!filters.system) {
      if (hasConstitutionalMonarchy) {
        filters.system = "Monarquia constitucional";
      } else if (hasPresidentialRepublic) {
        filters.system = "Presidencialismo";
      } else if (/\bmonarquia|\bmonarquias/.test(normalized)) {
        filters.system = "__monarquia__";
      } else if (/federal|federales/.test(normalized)) {
        filters.system = "__federal__";
      } else if (/semipresid/.test(normalized)) {
        filters.system = "__semipresidencial__";
      } else if (/presidencial/.test(normalized)) {
        filters.system = "__presidencial__";
      } else if (/parlament/.test(normalized)) {
        filters.system = "__parlamentario__";
      }
    }

    filters.organization = findContextValue("organizations");
    filters.language = findContextValue("languages");
    filters.bloc = findContextValue("blocs");
    filters.metropole = findContextValue("metropoles");
    filters.conflict = findContextValue("conflicts");
    filters.period = findContextValue("periods");
    filters.historyType = findContextValue("historyTypes");
    filters.origin = findContextValue("origins");
    if (!filters.origin) {
      if (/ex colonias? britan|british colonies|imperio britan/.test(normalized)) {
        filters.origin = "__british__";
      } else if (/ex colonias? frances|french colonies/.test(normalized)) {
        filters.origin = "__french__";
      } else if (/ex colonias? espan|spanish colonies/.test(normalized)) {
        filters.origin = "__spanish__";
      } else if (/ex colonias? portugues|portuguese colonies/.test(normalized)) {
        filters.origin = "__portuguese__";
      }
    }

    filters.rival = findContextValue("rivals");
    if (!filters.organization && /\botan\b|nato/.test(normalized)) {
      filters.organization = "OTAN";
      filters.bloc = "OTAN";
    }
    if (!filters.rival && /\brusia\b|russia/.test(normalized)) {
      filters.rival = "Rusia";
    }
    if (!filters.organization && /(union europea|ue\b|european union)/.test(normalized)) {
      filters.organization = "Union Europea";
      filters.bloc = "Union Europea";
    }
    if (!filters.organization && /(mercosur|mercosul)/.test(normalized)) {
      filters.organization = "Mercosur";
      filters.bloc = "Mercosur";
    }
    if (!filters.organization && /\bbrics\b/.test(normalized)) {
      filters.organization = "BRICS";
      filters.bloc = "BRICS";
    }

    if (!filters.period && /(siglo xxi|21st century|siglo 21)/.test(normalized)) {
      filters.period = "Siglo XXI";
    } else if (!filters.period && /(siglo xx|20th century|siglo 20)/.test(normalized)) {
      filters.period = "Siglo XX";
    } else if (!filters.period && /(siglo xix|19th century|siglo 19)/.test(normalized)) {
      filters.period = "Siglo XIX";
    } else if (!filters.period && /(edad moderna|early modern)/.test(normalized)) {
      filters.period = "Edad Moderna";
    } else if (!filters.period && /(edad media|middle ages|medieval)/.test(normalized)) {
      filters.period = "Edad Media";
    }

    if (!filters.religion && /(judai|jewish)/.test(normalized)) {
      filters.religion = "Juda\u00edsmo";
    }
    if (!filters.religion && /(hindu|hinduism)/.test(normalized)) {
      filters.religion = "Hinduismo";
    }

    const populationMatchers = [
      { pattern: /mas de 100 millones|more than 100 million/, value: 100000000 },
      { pattern: /mas de 50 millones|more than 50 million/, value: 50000000 },
      { pattern: /mas de 20 millones|more than 20 million/, value: 20000000 },
      { pattern: /mas de 10 millones|more than 10 million/, value: 10000000 },
      { pattern: /mas de 1 millon|more than 1 million/, value: 1000000 }
    ];
    const populationMatch = populationMatchers.find(item => item.pattern.test(normalized));
    if (populationMatch) {
      filters.minPopulation = populationMatch.value;
    }

    const semanticPatterns = [
      /miembros? de /,
      /members? of /,
      /rivales? de /,
      /rivals? of /,
      /ex colonias? de /,
      /former colonies? of /,
      /paises? .*guerra civil/,
      /countries? .*civil war/,
      /con mas conflictos/,
      /with more conflicts/,
      /con mas organizaciones/,
      /with more organizations/,
      /idioma/,
      /language/,
      /guerra|batalla|war|battle/,
      /siglo|century/,
      /bloque|bloc|alliance|alianza/,
      /ex metropoli|former metropole/
    ];
    const score = Object.values(filters).filter(Boolean).length;
    return score >= 2 || (score >= 1 && semanticPatterns.some(pattern => pattern.test(normalized)))
      ? filters
      : null;
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
    resolveAliasResult,
    findPublicConflictIndexEntry,
    parseNaturalQuery,
    parseSemanticFilters,
    createRecentSearchCache
  };
})();
