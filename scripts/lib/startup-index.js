function limitArray(value, maxItems = 2) {
  return Array.isArray(value) ? value.slice(0, maxItems) : [];
}

function compactConflict(entry = {}) {
  return {
    name: entry.name,
    startYear: entry.startYear ?? null,
    endYear: entry.endYear ?? null,
    ongoing: Boolean(entry.ongoing)
  };
}

function compactSymbols(symbols = {}) {
  return {
    assets: symbols.assets || {}
  };
}

function compactQuality(quality = {}) {
  return {
    score: quality.score ?? null
  };
}

function compactRelations(relations = {}) {
  return {
    exMetropole: relations.exMetropole || null,
    blocs: limitArray(relations.blocs, 1),
    militaryBlocs: limitArray(relations.militaryBlocs, 1),
    economicBlocs: limitArray(relations.economicBlocs, 1),
    currentRivals: limitArray(relations.currentRivals, 1),
    disputedTerritories: limitArray(relations.disputedTerritories || relations.disputes, 1)
  };
}

function compactNameList(values, maxItems = 2) {
  return limitArray(values, maxItems).map(value => {
    if (typeof value === "string") {
      return value;
    }
    return value?.name || value?.label || value?.code || String(value || "");
  }).filter(Boolean);
}

export function buildStartupCountryIndex(countries = {}) {
  return Object.fromEntries(
    Object.entries(countries).map(([code, country]) => [
      code,
      {
        name: country.name,
        continent: country.continent,
        general: {
          population: country.general?.population ?? 0,
          officialName: country.general?.officialName ?? country.name,
          symbols: compactSymbols(country.general?.symbols),
          capital: country.general?.capital || null,
          languages: compactNameList(country.general?.languages, 2),
          stateStructure: country.general?.stateStructure || null,
          cities: compactNameList(country.general?.cities, 1).map(name => ({ name }))
        },
        history: {
          year: country.history?.year ?? null,
          type: country.history?.type ?? null,
          origin: country.history?.origin ?? null
        },
        economy: {
          gdp: country.economy?.gdp ?? null,
          gdpPerCapita: country.economy?.gdpPerCapita ?? null,
          inflation: country.economy?.inflation ?? null
        },
        military: {
          active: country.military?.active ?? null,
          reserve: country.military?.reserve ?? null,
          conflicts: limitArray(country.military?.conflicts, 1).map(compactConflict)
        },
        politics: {
          system: country.politics?.system ?? null,
          organizations: compactNameList(country.politics?.organizations, 1),
          rivals: compactNameList(country.politics?.rivals, 1),
          relations: compactRelations(country.politics?.relations)
        },
        religion: {
          summary: country.religion?.summary || null,
          majority: country.religion?.majority || null,
          branch: country.religion?.branch || null,
          composition: limitArray(country.religion?.composition, 1)
        },
        metadata: {
          updatedAt: country.metadata?.updatedAt,
          quality: compactQuality(country.metadata?.quality),
          isIndex: true
        },
        conflicts: limitArray(country.conflicts, 1).map(compactConflict)
      }
    ])
  );
}
