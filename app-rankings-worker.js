self.addEventListener("message", event => {
  const { id, countries = [] } = event.data || {};

  const top = (items, score, limit = 10) => items
    .map(country => ({ code: country.code, name: country.name, score: score(country) || 0 }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "es"))
    .slice(0, limit);

  const countBy = collect => {
    const totals = {};
    countries.forEach(country => {
      collect(country).forEach(label => {
        if (!label) {
          return;
        }
        totals[label] = (totals[label] || 0) + 1;
      });
    });
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
      .slice(0, 10)
      .map(([label, count]) => ({ label, count }));
  };

  self.postMessage({
    id,
    rankings: {
      gdpPerCapita: top(countries, country => country.economy?.gdpPerCapita),
      militaryActive: top(countries, country => country.military?.activePersonnel),
      conflicts: top(countries, country => (country.military?.conflicts || country.conflicts || []).length),
      organizations: countBy(country => country.politics?.organizations || []),
      blocs: countBy(country => country.politics?.relations?.blocs || [])
    }
  });
});
