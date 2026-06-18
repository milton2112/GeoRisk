(() => {
  const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  const TOOLTIP_MAP = {
    "map-search-button": "Buscar en paises, grupos y consultas naturales",
    "save-search-button": "Guardar esta busqueda",
    "world-view-button": "Volver a la vista global",
    "auto-rotate-button": "Activar o detener rotacion automatica",
    "apply-filters-button": "Aplicar filtros al mapa",
    "save-filters-button": "Guardar combinacion de filtros",
    "reset-view-button": "Limpiar filtros y volver al mundo",
    "presentation-mode-button": "Alternar modo presentacion",
    "save-view-button": "Guardar tema, filtros y vista actual",
    "open-help-button": "Abrir ayuda contextual",
    "open-performance-button": "Ver rendimiento y degradaciones",
    "clear-local-cache-button": "Borrar cache offline de GeoRisk",
    "toggle-left-panel": "Abrir rankings y estadisticas",
    "toggle-tools-panel": "Abrir capas y herramientas",
    "toggle-country-panel": "Abrir ficha del pais seleccionado"
  };

  function enhanceTooltips(root = document) {
    Object.entries(TOOLTIP_MAP).forEach(([id, text]) => {
      const element = root.getElementById ? root.getElementById(id) : document.getElementById(id);
      if (!element) return;
      element.title = element.title || text;
      element.setAttribute("aria-label", element.getAttribute("aria-label") || text);
    });
  }

  function markDialogs(root = document) {
    root.querySelectorAll("[id$='-modal']").forEach(modal => {
      const dialog = modal.querySelector("[role='dialog']");
      if (!dialog) return;
      if (!dialog.hasAttribute("tabindex")) dialog.tabIndex = -1;
      const bodyId = `${modal.id}-body`;
      if (!dialog.getAttribute("aria-describedby") && document.getElementById(bodyId)) {
        dialog.setAttribute("aria-describedby", bodyId);
      }
    });
  }

  function focusFirstIn(container) {
    const target = container?.querySelector?.(FOCUSABLE_SELECTOR);
    target?.focus?.({ preventScroll: true });
  }

  function trapFocus(event, container) {
    if (event.key !== "Tab" || !container) return;
    const focusable = [...container.querySelectorAll(FOCUSABLE_SELECTOR)]
      .filter(element => element.offsetParent !== null || element === document.activeElement);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function getOpenDialog() {
    return document.querySelector("#country-modal:not([hidden]) .country-modal-dialog, #compare-modal:not([hidden]) .compare-modal-dialog, #conflict-modal:not([hidden]) .conflict-modal-dialog, #timeline-modal:not([hidden]) .conflict-modal-dialog, #help-modal:not([hidden]) .help-modal-dialog, #intro-modal:not([hidden]) .help-modal-dialog, #product-modal:not([hidden]) .help-modal-dialog");
  }

  function installKeyboardA11y() {
    document.addEventListener("keydown", event => {
      const dialog = getOpenDialog();
      if (dialog) trapFocus(event, dialog);
    });
  }

  function applyCompactLabels(root = document) {
    root.querySelectorAll(".panel-action-button, .toolbar-content button, .status-chip").forEach(button => {
      button.dataset.compactLabel = button.dataset.compactLabel || button.textContent.trim();
    });
  }

  function init() {
    enhanceTooltips();
    markDialogs();
    applyCompactLabels();
  }

  window.GeoRiskUiPolish = {
    FOCUSABLE_SELECTOR,
    TOOLTIP_MAP,
    enhanceTooltips,
    markDialogs,
    focusFirstIn,
    trapFocus,
    applyCompactLabels,
    init
  };
})();
