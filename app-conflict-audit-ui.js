(() => {
  function renderConflictAuditPanelContent({ language = "es", report, issueCards = "", focusRows = "", topRows = "" }) {
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
        <div>${focusRows || `<span><b>0</b>${isEnglish ? "No dated urgent rows" : "Sin urgentes fechados"}</span>`}</div>
      </div>
      <div class="conflict-editorial-note">
        <strong>${dominantLabel}</strong>
        <span>${isEnglish
          ? "The fastest quality gain is to enrich existing conflict detail while preserving safe parent links."
          : "La mejora mas rapida de calidad es enriquecer detalle existente sin perder parentado seguro."}</span>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Issue map" : "Mapa de problemas"}</h3>
        <div class="risk-watch-grid">${issueCards}</div>
      </div>
      <div class="help-section">
        <h3>${isEnglish ? "Next top issues" : "Proximos casos urgentes"}</h3>
        <div class="audit-issue-list">${topRows || `<p class="empty-state">${noRowsText}</p>`}</div>
      </div>
    `;
  }

  window.GeoRiskConflictAuditUi = {
    renderConflictAuditPanelContent
  };
})();
