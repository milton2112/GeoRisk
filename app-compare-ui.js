(() => {
  function buildCompareChips(compareSelection, countriesData, getFlagEmoji, escapeHtml) {
    return compareSelection
      .map(code => `<span class="compare-chip">${getFlagEmoji(code)} ${escapeHtml(countriesData[code]?.name || code)} <button type="button" data-remove-compare="${escapeHtml(code)}">x</button></span>`)
      .join("");
  }

  function buildLightCards(compareSelection, countriesData, getFlagEmoji, escapeHtml) {
    return `
      <div class="compare-insight-grid">
        ${compareSelection.map(code => {
          const country = countriesData[code];
          return `
            <div class="compare-insight-card">
              <strong>${getFlagEmoji(code)} ${escapeHtml(country.name)}</strong>
              <span>${escapeHtml(country.general?.officialName || country.name)}</span>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function buildCountryCards(compareSelection, countriesData, escapeHtml, renderFlagVisual, translateContinentName, t, getCountryBlocLabel, getComparisonBenchmark, formatPercentage) {
    return compareSelection.map(code => {
      const country = countriesData[code];
      const benchmark = getComparisonBenchmark(country);
      const populationDelta = benchmark.populationAvg ? (((country.general?.population || 0) - benchmark.populationAvg) / benchmark.populationAvg) * 100 : 0;
      const gdpDelta = benchmark.gdpPcAvg ? (((country.economy?.gdpPerCapita || 0) - benchmark.gdpPcAvg) / benchmark.gdpPcAvg) * 100 : 0;
      return `
        <div class="compare-country-card">
          <div class="compare-country-flag">${renderFlagVisual(code, country.name, "compare-country-flag-badge")}</div>
          <div class="compare-country-name">${escapeHtml(country.name)}</div>
          <div class="compare-country-meta compare-country-official">${escapeHtml(country.general?.officialName || country.name)}</div>
          <div class="compare-country-meta">${escapeHtml(translateContinentName(country.continent))}</div>
          <div class="compare-country-meta">${escapeHtml(country.politics?.system || t("noData"))}</div>
          <div class="compare-country-meta">${escapeHtml(getCountryBlocLabel(country))}</div>
          <div class="compare-benchmark-grid">
            <div class="compare-benchmark-card">
              <strong>${t("comparePopulation")}</strong>
              <span>${formatPercentage(populationDelta)}</span>
            </div>
            <div class="compare-benchmark-card">
              <strong>${t("compareGdpPerCapita")}</strong>
              <span>${formatPercentage(gdpDelta)}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  function normalizeText(value = "") {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function getMetricValue(country, metric) {
    const values = {
      population: country.general?.population || 0,
      gdp: country.economy?.gdp || 0,
      gdpPerCapita: country.economy?.gdpPerCapita || 0,
      inflation: country.economy?.inflation || 0,
      military: country.military?.active || country.military?.activePersonnel || 0,
      reserve: country.military?.reserve || 0,
      conflicts: (country.military?.conflicts || country.conflicts || []).length,
      organizations: (country.politics?.organizations || []).length,
      rivals: (country.politics?.rivals || []).length,
      languages: (country.general?.languages || []).length
    };
    return values[metric] || 0;
  }

  function buildComparisonModel(codes, countriesData) {
    const countries = codes.map(code => ({ code, country: countriesData[code] })).filter(item => item.country);
    const metrics = ["population", "gdp", "gdpPerCapita", "inflation", "military", "conflicts", "organizations", "rivals", "languages"];
    const metricRows = metrics.map(metric => {
      const values = countries.map(item => ({ ...item, value: getMetricValue(item.country, metric) }));
      const max = Math.max(...values.map(item => item.value), 0);
      const min = Math.min(...values.map(item => item.value), 0);
      const leader = values.find(item => item.value === max);
      return { metric, values, max, min, leader, spread: max - min };
    });
    const similarities = [
      ["continent", item => item.country.continent],
      ["system", item => item.country.politics?.system],
      ["religion", item => item.country.religion?.summary]
    ]
      .map(([key, getter]) => ({ key, values: countries.map(getter).filter(Boolean) }))
      .filter(item => item.values.length > 1 && new Set(item.values.map(normalizeText)).size === 1)
      .map(item => ({ key: item.key, value: item.values[0] }));
    const differences = metricRows
      .filter(row => row.spread > 0)
      .sort((a, b) => b.spread - a.spread)
      .slice(0, 5);
    return { countries, metricRows, similarities, differences };
  }

  function formatMetric(metric, value, helpers) {
    const { formatNumber, compactNumber, formatInflation } = helpers;
    if (metric === "gdp") return `US$ ${compactNumber(value)}`;
    if (metric === "gdpPerCapita") return `US$ ${formatNumber(Math.round(value))}`;
    if (metric === "inflation") return formatInflation(value);
    return formatNumber(Math.round(value));
  }

  function metricLabel(metric, language = "es") {
    const labels = {
      population: language === "en" ? "Population" : "Poblacion",
      gdp: "PBI",
      gdpPerCapita: language === "en" ? "GDP pc" : "PBI pc",
      inflation: language === "en" ? "Inflation" : "Inflacion",
      military: language === "en" ? "Military" : "Militar",
      reserve: language === "en" ? "Reserve" : "Reserva",
      conflicts: language === "en" ? "Conflicts" : "Conflictos",
      organizations: language === "en" ? "Organizations" : "Organizaciones",
      rivals: language === "en" ? "Rivals" : "Rivales",
      languages: language === "en" ? "Languages" : "Idiomas"
    };
    return labels[metric] || metric;
  }

  function buildProfessionalSections(model, helpers) {
    const { language, escapeHtml, getFlagEmoji, formatNumber } = helpers;
    const diffMarkup = model.differences.map(row => `
      <div class="compare-mini-chart">
        <strong>${escapeHtml(metricLabel(row.metric, language))}</strong>
        ${row.values.map(item => {
          const width = row.max ? (item.value / row.max) * 100 : 0;
          return `<span><b>${getFlagEmoji(item.code)} ${escapeHtml(item.country.name)}</b><i style="width:${width}%"></i><em>${escapeHtml(formatMetric(row.metric, item.value, helpers))}</em></span>`;
        }).join("")}
      </div>
    `).join("");
    const similarityMarkup = model.similarities.length
      ? model.similarities.map(item => `<span class="country-meta-pill"><b>${escapeHtml(item.key)}:</b> ${escapeHtml(item.value)}</span>`).join("")
      : `<span class="country-meta-pill">${language === "en" ? "No strong similarities in the selected fields" : "Sin similitudes fuertes en los campos seleccionados"}</span>`;
    const explanationMarkup = model.metricRows.slice(0, 7).map(row => `
      <div><b>${escapeHtml(metricLabel(row.metric, language))}:</b> ${row.leader ? `${getFlagEmoji(row.leader.code)} ${escapeHtml(row.leader.country.name)}` : "s/d"} · ${language === "en" ? "gap" : "brecha"} ${formatNumber(Math.round(row.spread || 0))}</div>
    `).join("");
    return `
      <div class="compare-row compare-summary-row">
        <strong>${language === "en" ? "Highlighted differences" : "Diferencias destacadas"}</strong>
        <div class="compare-values">${diffMarkup}</div>
      </div>
      <div class="compare-row compare-summary-row">
        <strong>${language === "en" ? "Similarities" : "Similitudes"}</strong>
        <div class="compare-values compare-pill-row">${similarityMarkup}</div>
      </div>
      <div class="compare-row compare-summary-row">
        <strong>${language === "en" ? "Metric explanation" : "Explicacion por metrica"}</strong>
        <div class="compare-values">${explanationMarkup}</div>
      </div>
    `;
  }

  function getPresetCountries(preset, countriesData) {
    const presets = {
      south_america: ["ARG", "BRA", "CHL", "URY", "PRY"],
      powers: ["USA", "CHN", "RUS", "IND", "DEU"],
      conflicts: ["UKR", "RUS", "ISR", "IRN", "YEM"],
      teachers: ["ARG", "BRA", "USA"]
    };
    return (presets[preset] || []).filter(code => countriesData[code]);
  }

  window.GeoRiskCompareUI = {
    buildCompareChips,
    buildLightCards,
    buildCountryCards,
    buildComparisonModel,
    buildProfessionalSections,
    getPresetCountries
  };
})();
