(() => {
  function renderConflictAuditPanelContent({ language = "es", report, issueCards = "", topRows = "" }) {
    const isEnglish = language === "en";
    const summary = report?.summary || {};
    return `
      <div class="product-insight-strip">
        <span>${isEnglish
          ? "Conflict audit reads the generated report and shows what to clean next without opening JSON files."
          : "La auditoria de conflictos lee el reporte generado y muestra que limpiar despues sin abrir JSON."}</span>
      </div>
      <div class="product-summary-grid">
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Scanned" : "Escaneados"}</span><strong class="overview-value">${report?.scannedConflicts || 0}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "With alerts" : "Con alertas"}</span><strong class="overview-value">${report?.issueCount || 0}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "Weak detail" : "Detalle flojo"}</span><strong class="overview-value">${summary.weak_detail || 0}</strong></div>
        <div class="overview-card"><span class="overview-label">${isEnglish ? "No parent" : "Sin padre"}</span><strong class="overview-value">${summary.battle_without_parent || 0}</strong></div>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Issue map" : "Mapa de problemas"}</h3>
        <div class="risk-watch-grid">${issueCards}</div>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Next top issues" : "Proximos casos urgentes"}</h3>
        <div class="audit-issue-list">${topRows}</div>
      </div>
    `;
  }

  window.GeoRiskConflictAuditUi = {
    renderConflictAuditPanelContent
  };
})();
