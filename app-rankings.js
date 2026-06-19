(() => {
  function getConflicts(country = {}) {
    return [
      ...(Array.isArray(country.military?.conflicts) ? country.military.conflicts : []),
      ...(Array.isArray(country.conflicts) ? country.conflicts : [])
    ];
  }

  function getOrganizations(country = {}) {
    return Array.isArray(country.politics?.organizations) ? country.politics.organizations : [];
  }

  function getBlocs(country = {}) {
    const relations = country.politics?.relations || {};
    return [
      ...(relations.blocs || []),
      ...(relations.militaryBlocs || []),
      ...(relations.economicBlocs || []),
      ...(relations.diplomaticBlocs || [])
    ].filter(Boolean);
  }

  function getMilitaryActive(country = {}) {
    return Number(country.military?.active || country.military?.activePersonnel || 0) || 0;
  }

  function getDataQualityScore(country = {}) {
    const quality = country.metadata?.quality || {};
    if (Number.isFinite(quality.score)) return Math.max(0, Math.min(100, quality.score));
    const missing = Array.isArray(quality.missingFields) ? quality.missingFields.length : 0;
    const estimated = Array.isArray(quality.estimatedFields) ? quality.estimatedFields.length : 0;
    const sources = country.metadata?.sources || {};
    const sourceCount = Object.values(sources).flat().filter(Boolean).length;
    return Math.max(0, 100 - missing * 9 - estimated * 4 + Math.min(sourceCount, 20));
  }

  function getCurrentRivals(country = {}) {
    const current = country.politics?.relations?.currentRivals;
    if (Array.isArray(current)) return current.filter(Boolean);
    return (country.politics?.rivals || []).filter(rival =>
      typeof rival === "string" || rival?.type === "actual"
    );
  }

  function getRiskComponents(country = {}) {
    const conflicts = getConflicts(country);
    const activeConflicts = conflicts.filter(conflict => conflict?.ongoing || conflict?.active || conflict?.status === "activo").length;
    const conflictExposure = Math.min(100, conflicts.length * 6 + activeConflicts * 18);
    const inflation = Math.max(0, Number(country.economy?.inflation || 0));
    const economicStress = Math.min(100, inflation / 3);
    const rivalPressure = Math.min(100, getCurrentRivals(country).length * 14);
    const militaryPressure = Math.min(100, getMilitaryActive(country) / 12000);
    const diplomaticBuffer = Math.min(100, getOrganizations(country).length * 4 + getBlocs(country).length * 7);
    const dataQuality = getDataQualityScore(country);
    const fragility = Math.max(0, Math.min(100, conflictExposure * 0.38 + economicStress * 0.24 + rivalPressure * 0.2 + militaryPressure * 0.18 - diplomaticBuffer * 0.12));
    return {
      conflictExposure,
      activeConflicts,
      economicStress,
      rivalPressure,
      militaryPressure,
      diplomaticBuffer,
      dataQuality,
      fragility,
      risk: Math.max(0, Math.min(100, fragility + activeConflicts * 6)),
      estimatedFields: country.metadata?.quality?.estimatedFields || [],
      proxyFields: ["inflation", "rivals", "organizations", "military.active"]
    };
  }

  function explainScore(country = {}, metric = "risk") {
    const components = getRiskComponents(country);
    const componentLabels = {
      risk: ["conflictExposure", "economicStress", "rivalPressure", "militaryPressure", "diplomaticBuffer"],
      fragility: ["conflictExposure", "economicStress", "rivalPressure", "militaryPressure"],
      diplomacy: ["diplomaticBuffer"],
      military: ["militaryPressure"],
      dataQuality: ["dataQuality"],
      activeConflicts: ["activeConflicts"]
    };
    return (componentLabels[metric] || componentLabels.risk).map(key => ({
      key,
      value: components[key],
      source: components.proxyFields.includes(key) ? "proxy" : "dataset",
      estimated: components.estimatedFields.includes(key)
    }));
  }

  function metricValue(country = {}, metric = "risk") {
    const components = getRiskComponents(country);
    const values = {
      population: country.general?.population || 0,
      gdp: country.economy?.gdp || 0,
      gdpPerCapita: country.economy?.gdpPerCapita || 0,
      conflicts: getConflicts(country).length,
      activeConflicts: components.activeConflicts,
      organizations: getOrganizations(country).length,
      military: components.militaryPressure,
      fragility: components.fragility,
      diplomacy: components.diplomaticBuffer,
      dataQuality: components.dataQuality,
      risk: components.risk
    };
    return values[metric] || 0;
  }

  function filterCountries(countries = [], filters = {}) {
    return countries.filter(country => {
      if (filters.continent && country.continent !== filters.continent) return false;
      if (filters.minPopulation && (country.general?.population || 0) < filters.minPopulation) return false;
      if (filters.region && country.metadata?.region !== filters.region && country.continent !== filters.region) return false;
      return true;
    });
  }

  function buildRanking(countries = [], metric = "risk", options = {}) {
    return filterCountries(countries, options.filters || {})
      .map(country => ({
        country,
        code: country.code || "",
        name: country.name,
        metric,
        score: metricValue(country, metric),
        components: explainScore(country, metric)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "es"))
      .slice(0, options.limit || 10);
  }

  function createRankingsCache() {
    const cache = new Map();
    return {
      get(key, revision, build) {
        const cacheKey = `${key}:${revision}`;
        if (!cache.has(cacheKey)) cache.set(cacheKey, build());
        return cache.get(cacheKey);
      },
      invalidate(prefix = "") {
        for (const key of [...cache.keys()]) {
          if (!prefix || key.startsWith(prefix)) cache.delete(key);
        }
      },
      size() {
        return cache.size;
      }
    };
  }

  window.GeoRiskRankings = {
    getRiskComponents,
    explainScore,
    metricValue,
    filterCountries,
    buildRanking,
    createRankingsCache
  };
})();
