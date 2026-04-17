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

  window.GeoRiskCompareUI = {
    buildCompareChips,
    buildLightCards,
    buildCountryCards
  };
})();
