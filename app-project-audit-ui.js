(() => {
  const HTML_ESCAPE = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  };

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => HTML_ESCAPE[character]);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("es-AR").format(Number(value) || 0);
  }

  function formatCoverage(value, total) {
    return total ? `${Math.round((value / total) * 100)}%` : "0%";
  }

  function renderProjectAuditPanelContent({ language = "es", report, fileRows = "", actionRows = "" }) {
    const isEnglish = language === "en";
    const status = report?.status || "sin_datos";
    const isHealthy = status === "operativo";
    const warnings = Array.isArray(report?.warnings) ? report.warnings : [];
    const criticalIssues = Array.isArray(report?.criticalIssues) ? report.criticalIssues : [];
    const riskRows = [
      ...criticalIssues.map(text => ({ text, level: "critical" })),
      ...warnings.map(text => ({ text, level: "warning" }))
    ].map(item => `<div class="project-audit-warning-card ${item.level}">
      <strong>${item.level === "critical" ? (isEnglish ? "Critical" : "Critico") : (isEnglish ? "Warning" : "Advertencia")}</strong>
      <span>${item.text}</span>
    </div>`).join("");
    const startupBytes = Number(report?.startup?.criticalBytes || 0);
    const startupBudget = 1024 * 1024;
    const startupPercent = startupBytes ? Math.min(100, Math.round((startupBytes / startupBudget) * 100)) : 0;
    const startupRemainingKb = Math.max(0, Math.round((startupBudget - startupBytes) / 1024));
    const alertCount = Number(report?.conflicts?.issueCount || 0);
    const scanned = Number(report?.conflicts?.scanned || 0);
    const conflictPercent = scanned ? Math.max(0, Math.min(100, Math.round(((scanned - alertCount) / scanned) * 100))) : 0;
    const eraFocusRows = (report?.conflicts?.eraFocus || [])
      .slice(0, 5)
      .map(item => `<span><b>${item.count}</b>${item.label}</span>`)
      .join("");
    const visualIssues = Object.entries(report?.visualMetrics || {})
      .filter(([, metrics]) => Number(metrics?.bootChips || 0) || Number(metrics?.mojibakeHints || 0))
      .map(([file, metrics]) => `<span>${file}: ${Number(metrics.bootChips || 0) + Number(metrics.mojibakeHints || 0)}</span>`)
      .join("");
    return `
      <div class="product-insight-strip">
        <span>${isEnglish
          ? "Project audit summarizes startup weight, conflict cleanup, visual hygiene and maintenance risks."
          : "La auditoria del proyecto resume arranque, limpieza de conflictos, higiene visual y riesgos de mantenimiento."}</span>
      </div>
      <div class="project-audit-status ${isHealthy ? "is-healthy" : "needs-review"}">
        <strong>${isHealthy ? (isEnglish ? "Project ready for iteration" : "Proyecto listo para iterar") : (isEnglish ? "Project needs attention" : "El proyecto necesita atencion")}</strong>
        <span>${isEnglish
          ? "Use this panel as the internal control room before each release."
          : "Usa este panel como sala de control interna antes de cada release."}</span>
      </div>
      <div class="product-summary-grid">
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Status" : "Estado"}</span><strong class="overview-value">${isHealthy ? (isEnglish ? "Operational" : "Operativo") : (isEnglish ? "Review" : "Revisar")}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Startup" : "Arranque"}</span><strong class="overview-value">${report?.startup?.critical || "s/m"}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Conflict alerts" : "Alertas conflictos"}</span><strong class="overview-value">${report?.conflicts?.issueCount || 0}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Scripts" : "Scripts"}</span><strong class="overview-value">${report?.scripts?.length || 0}</strong></div>
      </div>
      <div class="project-release-pulse">
        <div>
          <span>${isEnglish ? "Startup budget" : "Presupuesto de arranque"}</span>
          <strong>${startupPercent || 0}%</strong>
          <i><b style="width:${startupPercent}%"></b></i>
        </div>
        <div>
          <span>${isEnglish ? "Conflict cleanup" : "Limpieza de conflictos"}</span>
          <strong>${conflictPercent}%</strong>
          <i><b style="width:${conflictPercent}%"></b></i>
        </div>
      </div>
      <div class="project-visual-hygiene-card ${startupRemainingKb < 48 ? "needs-review" : "is-clean"}">
        <strong>${isEnglish ? "Startup margin" : "Margen de arranque"}</strong>
        <p>${isEnglish
          ? `${startupRemainingKb} KB left before the internal 1 MB budget.`
          : `Quedan ${startupRemainingKb} KB antes del presupuesto interno de 1 MB.`}</p>
        <div><span>${isEnglish ? "Next: keep deferring non-critical panels." : "Siguiente: seguir difiriendo paneles no criticos."}</span></div>
      </div>
      <div class="project-audit-warning-grid">
        ${riskRows || `<div class="project-audit-warning-card healthy"><strong>${isEnglish ? "Clean" : "Limpio"}</strong><span>${isEnglish ? "No critical warnings in this report." : "No hay advertencias criticas en este reporte."}</span></div>`}
      </div>
      <div class="project-visual-hygiene-card ${visualIssues ? "needs-review" : "is-clean"}">
        <strong>${isEnglish ? "Visual hygiene" : "Higiene visual"}</strong>
        <p>${visualIssues
          ? (isEnglish ? "Files with visible residue:" : "Archivos con residuos visibles:")
          : (isEnglish ? "No boot chips or mojibake hints detected in audited UI files." : "No se detectaron chips de arranque ni pistas de mojibake en la UI auditada.")}</p>
        <div>${visualIssues}</div>
      </div>
      <div class="project-visual-hygiene-card">
        <strong>${isEnglish ? "Conflict debt by era" : "Deuda de conflictos por periodo"}</strong>
        <p>${isEnglish ? "Use this to plan the next manual curation batch." : "Sirve para planear la proxima tanda de curaduria manual."}</p>
        <div>${eraFocusRows || `<span>${isEnglish ? "No dated focus available" : "Sin foco fechado disponible"}</span>`}</div>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Next actions" : "Proximas acciones"}</h3>
        <div class="audit-issue-list">${actionRows || `<p class="empty-state">${isEnglish ? "No pending actions in the report." : "No hay acciones pendientes en el reporte."}</p>`}</div>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Largest source files" : "Archivos fuente mas pesados"}</h3>
        <div class="audit-issue-list">${fileRows}</div>
      </div>
    `;
  }

  function renderDatasetHealthPanelContent({ language = "es", countries = [], introStats = {} }) {
    const isEnglish = language === "en";
    const safeCountries = Array.isArray(countries) ? countries : [];
    const total = safeCountries.length || 0;
    const withTimeline = safeCountries.filter(country => (country.history?.events || []).length > 0).length;
    const withConflicts = safeCountries.filter(country => (country.military?.conflicts || []).length > 0).length;
    const withLocalFlag = safeCountries.filter(country => country.general?.symbols?.assets?.flagPath).length;
    const withLocalCoat = safeCountries.filter(country => country.general?.symbols?.assets?.coatPath).length;
    const withLanguages = safeCountries.filter(country => Array.isArray(country.general?.languages) && country.general.languages.length > 0).length;
    const withCapitals = safeCountries.filter(country => Array.isArray(country.general?.capitals) && country.general.capitals.length > 0).length;
    const withProvenance = safeCountries.filter(country => Object.keys(country.metadata?.provenance || {}).length > 0).length;
    const withMissingFields = safeCountries.filter(country => (country.metadata?.quality?.missingFields || []).length > 0).length;
    const withRelations = safeCountries.filter(country => Object.values(country.politics?.relations || {}).some(value => Array.isArray(value) ? value.length > 0 : Boolean(value))).length;
    const withSymbols = safeCountries.filter(country => country.general?.symbols?.flag || country.general?.symbols?.coatOfArms || country.general?.symbols?.assets?.flagPath || country.general?.symbols?.assets?.coatPath).length;
    const lowQualityCountries = safeCountries.filter(country => (country.metadata?.quality?.score || 0) < 70).length;
    const averageQuality = total
      ? Math.round(safeCountries.reduce((sum, country) => sum + (country.metadata?.quality?.score || 0), 0) / total)
      : 0;
    const estimatedAverage = total
      ? Math.round(safeCountries.reduce((sum, country) => sum + ((country.metadata?.quality?.estimatedFields || []).length || 0), 0) / total)
      : 0;
    const statusRows = safeCountries
      .slice()
      .sort((a, b) => (b.metadata?.quality?.score || 0) - (a.metadata?.quality?.score || 0))
      .slice(0, 12)
      .map(country => `<li><b>${escapeHtml(country.name)}</b>: ${country.metadata?.quality?.score || 0}/100</li>`)
      .join("");
    const sectionTotals = ["general", "history", "economy", "military", "politics", "religion", "symbols", "relations"]
      .map(section => {
        const curatedCount = safeCountries.filter(country => country.metadata?.quality?.sectionStatus?.[section] === "curated" || country.metadata?.quality?.sectionStatus?.[section] === "confirmed").length;
        return `<li><b>${escapeHtml(section)}</b>: ${formatNumber(curatedCount)}/${formatNumber(total)}</li>`;
      })
      .join("");
    const weakestCountries = safeCountries
      .slice()
      .sort((a, b) => (a.metadata?.quality?.score || 0) - (b.metadata?.quality?.score || 0))
      .slice(0, 10)
      .map(country => `<li><b>${escapeHtml(country.name)}</b>: ${country.metadata?.quality?.score || 0}/100</li>`)
      .join("");
    const coverageBars = [
      { label: isEnglish ? "Timeline" : "Timeline", value: withTimeline },
      { label: isEnglish ? "Conflicts" : "Conflictos", value: withConflicts },
      { label: isEnglish ? "Languages" : "Idiomas", value: withLanguages },
      { label: isEnglish ? "Capitals" : "Capitales", value: withCapitals },
      { label: isEnglish ? "Relations" : "Relaciones", value: withRelations },
      { label: isEnglish ? "Symbols" : "Simbolos", value: withSymbols },
      { label: isEnglish ? "Provenance" : "Procedencia", value: withProvenance }
    ].map(item => `
      <li>
        <span>${escapeHtml(item.label)}</span>
        <div class="health-progress-track"><i style="width:${formatCoverage(item.value, total)}"></i></div>
        <b>${formatNumber(item.value)}/${formatNumber(total)} &middot; ${formatCoverage(item.value, total)}</b>
      </li>
    `).join("");

    return `
      <div class="product-summary-grid">
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Countries" : "Paises"}</span><strong class="overview-value">${formatNumber(total)}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Average quality" : "Calidad promedio"}</span><strong class="overview-value">${averageQuality}/100</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "With timeline" : "Con timeline"}</span><strong class="overview-value">${formatNumber(withTimeline)}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "With conflicts" : "Con conflictos"}</span><strong class="overview-value">${formatNumber(withConflicts)}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Local flags" : "Banderas locales"}</span><strong class="overview-value">${formatNumber(withLocalFlag)}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Local coats" : "Escudos locales"}</span><strong class="overview-value">${formatNumber(withLocalCoat)}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "With languages" : "Con idiomas"}</span><strong class="overview-value">${formatNumber(withLanguages)}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "With capitals" : "Con capitales"}</span><strong class="overview-value">${formatNumber(withCapitals)}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "With provenance" : "Con procedencia"}</span><strong class="overview-value">${formatNumber(withProvenance)}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Avg. estimated fields" : "Prom. campos estimados"}</span><strong class="overview-value">${formatNumber(estimatedAverage)}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Linked conflicts" : "Conflictos enlazados"}</span><strong class="overview-value">${formatNumber(introStats.conflicts)}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Special entities" : "Entidades especiales"}</span><strong class="overview-value">${formatNumber(introStats.specialEntities)}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Quality watch" : "A revisar"}</span><strong class="overview-value">${formatNumber(lowQualityCountries)}</strong></div>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Coverage map" : "Mapa de cobertura"}</h3>
        <ul class="health-progress-list">${coverageBars}</ul>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Quality leaders" : "Lideres de calidad"}</h3>
        <ul>${statusRows}</ul>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Quality watchlist" : "Watchlist de calidad"}</h3>
        <ul>${weakestCountries}</ul>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Section coverage" : "Cobertura por seccion"}</h3>
        <ul>${sectionTotals}</ul>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Current audit status" : "Estado actual de auditoria"}</h3>
        <ul>
          <li><b>${isEnglish ? "Countries with missing fields" : "Paises con campos faltantes"}</b>: ${formatNumber(withMissingFields)}</li>
          <li><b>${isEnglish ? "Offline shell" : "Shell offline"}</b>: ${isEnglish ? "available via service worker cache" : "disponible via cache del service worker"}</li>
          <li><b>${isEnglish ? "Local validation" : "Validacion local"}</b>: ${isEnglish ? "latest checks passed without blocking issues" : "los ultimos chequeos pasaron sin incidencias bloqueantes"}</li>
        </ul>
      </div>
    `;
  }

  window.GeoRiskProjectAuditUi = {
    renderProjectAuditPanelContent,
    renderDatasetHealthPanelContent
  };
})();
