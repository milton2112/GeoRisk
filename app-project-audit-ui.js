(() => {
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

  window.GeoRiskProjectAuditUi = {
    renderProjectAuditPanelContent
  };
})();
