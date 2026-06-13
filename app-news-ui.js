(() => {
  function buildSelectedCard(country, linksMarkup, escapeHtml, context = {}) {
    if (!country) {
      return "";
    }
    const topic = context.topicLabel ? `<span>${escapeHtml(context.topicLabel)}</span>` : "";
    return `
      <div class="news-hub-selected-card">
        <strong>${escapeHtml(country.name)}</strong>
        <div class="news-hub-meta">${escapeHtml(country.general?.officialName || country.name)}</div>
        ${topic ? `<div class="news-hub-meta">${topic}</div>` : ""}
        ${linksMarkup ? `<div class="news-source-links">${linksMarkup}</div>` : ""}
      </div>
    `;
  }

  function buildArticleCard({ title, summary, meta, actionLabel, actionUrl, relatedMarkup = "" }) {
    return `
      <div class="news-hub-article-card">
        <strong>${title}</strong>
        <p>${summary}</p>
        ${meta ? `<div class="news-hub-meta">${meta}</div>` : ""}
        ${actionUrl ? `<a class="news-link" href="${actionUrl}" target="_blank" rel="noreferrer">${actionLabel}</a>` : ""}
      </div>
      ${relatedMarkup}
    `;
  }

  function buildStateCard(title, body, linksMarkup = "") {
    return `
      <div class="news-hub-article-card news-state-card">
        <strong>${title}</strong>
        <p>${body}</p>
        ${linksMarkup ? `<div class="news-source-links">${linksMarkup}</div>` : ""}
      </div>
    `;
  }

  function buildRelatedList(items, escapeHtml, fallbackUrl, label) {
    const rows = (items || []).slice(1, 4).map(item => `
      <a class="news-headline-item" href="${item.url || fallbackUrl}" target="_blank" rel="noreferrer">
        <span>${escapeHtml(item.title)}</span>
        <small>${escapeHtml(item.source || "Fuente")}${item.date ? ` · ${escapeHtml(item.date)}` : ""}</small>
      </a>
    `).join("");
    return rows ? `<div class="news-headline-list"><strong>${label}</strong>${rows}</div>` : "";
  }

  function buildNewsList(countries, activeCode, escapeHtml, getUrl, context = {}) {
    const openLabel = context.openLabel || "Abrir busqueda externa";
    const emptyLabel = context.emptyLabel || "Sin paises para mostrar.";
    if (!countries.length) {
      return `<div class="news-hub-empty">${emptyLabel}</div>`;
    }
    return countries.map(({ code, country }) => {
      const url = getUrl(country);
      return `
        <div class="news-hub-item${code === activeCode ? " is-active" : ""}">
          <button type="button" class="news-link-block" data-news-country="${escapeHtml(code)}">
            <strong>${escapeHtml(country.name)}</strong>
            <span class="news-hub-meta">${escapeHtml(country.general?.officialName || country.name)}</span>
          </button>
          <a class="news-external-link" href="${url}" target="_blank" rel="noreferrer">${openLabel}</a>
        </div>
      `;
    }).join("");
  }

  window.GeoRiskNewsUI = {
    buildSelectedCard,
    buildArticleCard,
    buildStateCard,
    buildRelatedList,
    buildNewsList
  };
})();
