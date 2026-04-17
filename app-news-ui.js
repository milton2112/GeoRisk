(() => {
  function buildSelectedCard(country, linksMarkup, escapeHtml) {
    if (!country) {
      return "";
    }
    return `
      <div class="news-hub-selected-card">
        <strong>${escapeHtml(country.name)}</strong>
        <div class="news-hub-meta">${escapeHtml(country.general?.officialName || country.name)}</div>
        ${linksMarkup ? `<div class="news-source-links">${linksMarkup}</div>` : ""}
      </div>
    `;
  }

  function buildArticleCard({ title, summary, meta, actionLabel, actionUrl }) {
    return `
      <div class="news-hub-article-card">
        <strong>${title}</strong>
        <p>${summary}</p>
        ${meta ? `<div class="news-hub-meta">${meta}</div>` : ""}
        ${actionUrl ? `<a class="news-link" href="${actionUrl}" target="_blank" rel="noreferrer">${actionLabel}</a>` : ""}
      </div>
    `;
  }

  function buildNewsList(countries, activeCode, escapeHtml, getUrl) {
    return countries
      .map(({ code, country }) => `
        <div class="news-hub-item${code === activeCode ? " is-active" : ""}">
          <a class="news-link-block" href="${getUrl(country)}" target="_blank" rel="noreferrer" title="${escapeHtml(country.name)}">
            <strong>${escapeHtml(country.name)}</strong>
            <span class="news-hub-meta">${escapeHtml(country.general?.officialName || country.name)}</span>
          </a>
        </div>
      `)
      .join("");
  }

  window.GeoRiskNewsUI = {
    buildSelectedCard,
    buildArticleCard,
    buildNewsList
  };
})();
