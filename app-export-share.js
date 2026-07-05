let exportCanvasLibraryPromise = null;
let exportPdfLibraryPromise = null;

function getLanguage(context = {}) {
  return context.language === "en" ? "en" : "es";
}

function getLocale(context = {}) {
  return getLanguage(context) === "en" ? "en-US" : "es-AR";
}

function fallbackEscapeHtml(value = "") {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fallbackNormalizeText(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getEscapeHtml(context = {}) {
  return typeof context.escapeHtml === "function" ? context.escapeHtml : fallbackEscapeHtml;
}

function getNormalizeText(context = {}) {
  return typeof context.normalizeText === "function" ? context.normalizeText : fallbackNormalizeText;
}

function localLoadScriptOnce(src, globalFlag) {
  if (globalFlag && window[globalFlag]) {
    return Promise.resolve(window[globalFlag]);
  }

  const existing = document.querySelector(`script[data-dynamic-src="${src}"]`);
  if (existing?.dataset.loaded === "true") {
    return Promise.resolve(globalFlag ? window[globalFlag] : true);
  }

  return new Promise((resolve, reject) => {
    const script = existing || document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.dynamicSrc = src;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve(globalFlag ? window[globalFlag] : true);
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`No se pudo cargar ${src}`)), { once: true });
    if (!existing) {
      document.body.appendChild(script);
    }
  });
}

function getScriptLoader(context = {}) {
  return typeof context.loadScriptOnce === "function" ? context.loadScriptOnce : localLoadScriptOnce;
}

function notify(context = {}, en, es) {
  const message = getLanguage(context) === "en" ? en : es;
  if (typeof context.showToast === "function") {
    context.showToast(message);
  }
}

function buildExportFilename(base, context = {}) {
  const stamp = new Date().toISOString().slice(0, 10);
  const normalizeText = getNormalizeText(context);
  const label = [
    base || context.contextLabel || "georisk",
    context.theme && context.theme !== "default" ? context.theme : "",
    context.mode && context.mode !== "default" ? context.mode : ""
  ].filter(Boolean).join("-");
  return `${normalizeText(label).replace(/\s+/g, "-") || "georisk"}-${stamp}`;
}

function buildReportCaptureNode(node, title, context = {}) {
  const escapeHtml = getEscapeHtml(context);
  const language = getLanguage(context);
  const wrapper = document.createElement("div");
  wrapper.className = "export-report-shell";
  wrapper.style.position = "fixed";
  wrapper.style.left = "-99999px";
  wrapper.style.top = "0";
  wrapper.style.width = `${Math.min(1280, Math.max(900, node?.scrollWidth || 960))}px`;
  wrapper.style.padding = "32px";
  wrapper.style.background = "#071320";
  wrapper.style.color = "#eef5ff";

  const reportTitle = title || (language === "en" ? "GeoRisk report" : "Informe GeoRisk");
  const contextLine = [
    context.selectedCountryName || "",
    context.theme && context.theme !== "default" ? context.theme : (language === "en" ? "political view" : "vista politica"),
    context.mode && context.mode !== "default" ? context.mode : (language === "en" ? "exploration" : "exploracion")
  ].filter(Boolean).join(" - ");

  wrapper.innerHTML = `
    <div class="export-report-header">
      <div>
        <div class="export-report-kicker">GeoRisk</div>
        <h1>${escapeHtml(reportTitle)}</h1>
        <p>${escapeHtml(contextLine)}</p>
      </div>
      <div class="export-report-meta">${new Date().toLocaleString(getLocale(context), { dateStyle: "medium", timeStyle: "short" })}</div>
    </div>
  `;

  const clone = node.cloneNode(true);
  clone.classList.add("export-report-body");
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  return wrapper;
}

async function ensureExportLibraries(format = "image", context = {}) {
  if (typeof html2canvas === "function" && (format !== "pdf" || window.jspdf?.jsPDF)) {
    return true;
  }

  const loadScriptOnce = getScriptLoader(context);
  exportCanvasLibraryPromise ||= loadScriptOnce("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js", "html2canvas").catch(error => {
    exportCanvasLibraryPromise = null;
    throw error;
  });
  await exportCanvasLibraryPromise;

  if (format === "pdf") {
    exportPdfLibraryPromise ||= loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js", "jspdf").catch(error => {
      exportPdfLibraryPromise = null;
      throw error;
    });
    await exportPdfLibraryPromise;
  }

  return typeof html2canvas === "function" && (format !== "pdf" || Boolean(window.jspdf?.jsPDF));
}

async function exportNodeAsImage(node, filename, context = {}) {
  if (!node) {
    return;
  }

  const ready = await ensureExportLibraries("image", context).catch(error => {
    console.warn("No se pudieron cargar las librerias de exportacion:", error);
    notify(context, "Export tools could not load.", "No se pudieron cargar las herramientas de exportacion.");
    return false;
  });
  if (!ready) {
    return;
  }

  const captureNode = buildReportCaptureNode(node, filename?.replace(/\.(png|pdf)$/i, ""), context);
  try {
    const canvas = await html2canvas(captureNode, {
      backgroundColor: "#071320",
      scale: Math.min(window.devicePixelRatio > 1 ? 2 : 1.8, 2.2),
      useCORS: true
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${buildExportFilename(filename?.replace(/\.png$/i, ""), context)}.png`;
    link.click();
  } finally {
    captureNode.remove();
  }
}

async function exportNodeAsPdf(node, filename, context = {}) {
  if (!node) {
    return;
  }

  const ready = await ensureExportLibraries("pdf", context).catch(error => {
    console.warn("No se pudieron cargar las librerias de exportacion:", error);
    notify(context, "PDF tools could not load.", "No se pudieron cargar las herramientas de PDF.");
    return false;
  });
  if (!ready) {
    return;
  }

  const captureNode = buildReportCaptureNode(node, filename?.replace(/\.(png|pdf)$/i, ""), context);
  try {
    const canvas = await html2canvas(captureNode, {
      backgroundColor: "#071320",
      scale: 2,
      useCORS: true
    });
    const image = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${buildExportFilename(filename?.replace(/\.pdf$/i, ""), context)}.pdf`);
  } finally {
    captureNode.remove();
  }
}

async function shareText(title, text, context = {}) {
  const payload = `${title}\n\n${text}\n\nGeoRisk - ${new Date().toLocaleDateString(getLocale(context))}`;
  if (navigator.share) {
    try {
      await navigator.share({ title, text: payload });
      return;
    } catch (error) {
      console.error("No se pudo compartir:", error);
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(payload);
    notify(context, "Copied to clipboard.", "Copiado al portapapeles.");
  }
}

window.GeoRiskExportShare = {
  ensureExportLibraries,
  exportNodeAsImage,
  exportNodeAsPdf,
  shareText,
  buildExportFilename,
  buildReportCaptureNode
};

export {
  ensureExportLibraries,
  exportNodeAsImage,
  exportNodeAsPdf,
  shareText,
  buildExportFilename,
  buildReportCaptureNode
};
