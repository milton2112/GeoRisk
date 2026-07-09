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

  function getIssueLabels(isEnglish) {
    return {
      battle_without_parent: isEnglish ? "Battles without parent war" : "Batallas sin guerra padre",
      weak_detail: isEnglish ? "Weak detail" : "Detalle flojo",
      generic_side: isEnglish ? "Generic sides" : "Bandos genericos",
      duplicate_names: isEnglish ? "Duplicate names" : "Nombres duplicados",
      english: isEnglish ? "English titles" : "Titulos en ingles",
      leading_year: isEnglish ? "Leading year" : "Anio al inicio"
    };
  }

  function buildIssueCards({ isEnglish, report }) {
    const issueLabels = getIssueLabels(isEnglish);
    const summary = report?.summary || {};
    return Object.entries(issueLabels).map(([key, label]) => `
      <article class="risk-watch-card audit-summary-card">
        <strong>${escapeHtml(label)}</strong>
        <span>${formatNumber(summary[key] || 0)} ${isEnglish ? "cases" : "casos"}</span>
      </article>
    `).join("");
  }

  function buildFocusRows({ isEnglish, report }) {
    const focusBuckets = [
      { label: isEnglish ? "Before 1850" : "Antes de 1850", min: -Infinity, max: 1849 },
      { label: "1850-1899", min: 1850, max: 1899 },
      { label: "1900-1918", min: 1900, max: 1918 },
      { label: "1919-1945", min: 1919, max: 1945 },
      { label: isEnglish ? "Post-1945" : "Pos-1945", min: 1946, max: Infinity }
    ];
    const focusCounts = focusBuckets.map(bucket => ({
      ...bucket,
      count: (report?.topIssues || []).filter(issue => {
        const year = Number(issue.startYear);
        return Number.isFinite(year) && year >= bucket.min && year <= bucket.max;
      }).length
    })).filter(bucket => bucket.count > 0);
    return focusCounts.slice(0, 5).map(bucket => `
      <span><b>${formatNumber(bucket.count)}</b>${escapeHtml(bucket.label)}</span>
    `).join("");
  }

  function buildTopRows({ isEnglish, report, countriesData = {} }) {
    const issueLabels = getIssueLabels(isEnglish);
    return (report?.topIssues || []).slice(0, 40).map(issue => {
      const countryCode = Array.isArray(issue.countries) ? issue.countries.find(code => countriesData?.[code]) : "";
      const issueTags = (issue.issues || []).map(key => `<span class="issue-chip">${escapeHtml(issueLabels[key] || key)}</span>`).join("");
      return `
        <article class="audit-issue-card">
          <div>
            <strong>${escapeHtml(issue.name || issue.key || "Sin titulo")}</strong>
            <span>${issueTags || `<span class="issue-chip">${isEnglish ? "Review" : "Revisar"}</span>`}</span>
            <small>${isEnglish ? "Severity" : "Severidad"} ${formatNumber(issue.severity || 0)}${issue.startYear ? ` - ${escapeHtml(String(issue.startYear))}` : ""}</small>
          </div>
          <div class="audit-issue-actions">
            ${countryCode ? `<button type="button" data-open-country="${escapeHtml(countryCode)}">${isEnglish ? "Open country" : "Abrir pais"}</button>` : ""}
            <button type="button" data-open-conflict="${escapeHtml(issue.name || issue.key || "")}">${isEnglish ? "Open conflict" : "Abrir conflicto"}</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderConflictAuditPanelContent({ language = "es", report, countriesData = {}, issueCards = "", focusRows = "", topRows = "" }) {
    const isEnglish = language === "en";
    const summary = report?.summary || {};
    const scanned = report?.scannedConflicts || 0;
    const issueCount = report?.issueCount || 0;
    const cleanCount = Math.max(0, scanned - issueCount);
    const cleanPercent = scanned ? Math.max(0, Math.min(100, Math.round((cleanCount / scanned) * 100))) : 0;
    const dominantIssue = Object.entries(summary).sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))[0];
    const dominantLabel = dominantIssue?.[0] === "weak_detail"
      ? (isEnglish ? "Weak detail dominates" : "Domina el detalle flojo")
      : dominantIssue?.[0] === "battle_without_parent"
        ? (isEnglish ? "Missing parent wars dominate" : "Dominan batallas sin padre")
        : (isEnglish ? "Mixed cleanup debt" : "Deuda de limpieza mixta");
    const noRowsText = isEnglish
      ? "No urgent rows in the current report. Run the audit again after the next data import."
      : "No hay filas urgentes en el reporte actual. Volve a correr la auditoria despues de la proxima importacion.";
    const renderedIssueCards = issueCards || buildIssueCards({ isEnglish, report });
    const renderedFocusRows = focusRows || buildFocusRows({ isEnglish, report });
    const renderedTopRows = topRows || buildTopRows({ isEnglish, report, countriesData });
    return `
      <div class="product-insight-strip">
        <span>${isEnglish
          ? "Conflict audit reads the generated report and shows what to clean next without opening JSON files."
          : "La auditoria de conflictos lee el reporte generado y muestra que limpiar despues sin abrir JSON."}</span>
      </div>
      <div class="product-summary-grid">
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Scanned" : "Escaneados"}</span><strong class="overview-value">${scanned}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "With alerts" : "Con alertas"}</span><strong class="overview-value">${issueCount}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Weak detail" : "Detalle flojo"}</span><strong class="overview-value">${summary.weak_detail || 0}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "No parent" : "Sin padre"}</span><strong class="overview-value">${summary.battle_without_parent || 0}</strong></div>
      </div>
      <div class="help-section audit-progress-section">
        <div class="audit-progress-header">
          <strong>${isEnglish ? "Cleaning progress" : "Progreso de limpieza"}</strong>
          <span>${cleanPercent}%</span>
        </div>
        <div class="health-progress-track"><i style="width:${cleanPercent}%"></i></div>
        <p>${isEnglish
          ? `${cleanCount} conflicts without current audit alerts. Prioritize generic sides, missing parent wars and weak detail.`
          : `${cleanCount} conflictos sin alertas actuales. Prioridad: bandos genericos, batallas sin guerra padre y detalle flojo.`}</p>
      </div>
      <div class="conflict-priority-strip">
        <span><b>1</b>${isEnglish ? "Parent battles" : "Parentar batallas"}</span>
        <span><b>2</b>${isEnglish ? "Clean sides" : "Limpiar bandos"}</span>
        <span><b>3</b>${isEnglish ? "Raise detail" : "Subir detalle"}</span>
      </div>
      <div class="conflict-era-focus">
        <strong>${isEnglish ? "Current editorial focus" : "Foco editorial actual"}</strong>
        <div>${renderedFocusRows || `<span><b>0</b>${isEnglish ? "No dated urgent rows" : "Sin urgentes fechados"}</span>`}</div>
      </div>
      <div class="conflict-editorial-note">
        <strong>${dominantLabel}</strong>
        <span>${isEnglish
          ? "The fastest quality gain is to enrich existing conflict detail while preserving safe parent links."
          : "La mejora mas rapida de calidad es enriquecer detalle existente sin perder parentado seguro."}</span>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Issue map" : "Mapa de problemas"}</h3>
        <div class="risk-watch-grid">${renderedIssueCards}</div>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Next top issues" : "Proximos casos urgentes"}</h3>
        <div class="audit-issue-list">${renderedTopRows || `<p class="empty-state">${noRowsText}</p>`}</div>
      </div>
    `;
  }

  window.GeoRiskConflictAuditUi = {
    renderConflictAuditPanelContent
  };
})();
