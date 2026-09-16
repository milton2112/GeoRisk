import { exportAssets } from "./vendor/exports/manifest.js";

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

function loadExportLibrary(name, isReady) {
  const asset = exportAssets[name];
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = new URL(asset.path, import.meta.url).href;
    script.integrity = asset.integrity;
    script.crossOrigin = "anonymous";
    script.async = true;
    script.dataset.exportLibrary = name;
    let settled = false;
    const finish = success => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
      if (success) {
        resolve(true);
      } else {
        script.remove();
        reject(new Error(`No se pudo verificar o cargar ${name}. Reintenta la exportacion.`));
      }
    };
    const onLoad = () => finish(isReady());
    const onError = () => finish(false);
    const timer = setTimeout(onError, 15000);
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    try {
      document.head.appendChild(script);
    } catch {
      finish(false);
    }
  });
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
  wrapper.style.boxSizing = "border-box";

  const reportTitle = {
    "left-panel": language === "en" ? "Global rankings" : "Rankings globales",
    "compare-results": language === "en" ? "Country comparison" : "Comparacion de paises",
    "compare-modal-content": language === "en" ? "Country comparison" : "Comparacion de paises"
  }[node.id] || title || (language === "en" ? "GeoRisk report" : "Informe GeoRisk");
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
  // Screen panels use fixed positions and scroll limits, which clip report captures.
  for (const element of [clone, ...clone.querySelectorAll("#rankings-panel, .left-panel-inner")]) {
    for (const [property, value] of Object.entries({
      position: "static", inset: "auto", transform: "none", opacity: "1", width: "100%",
      height: "auto", "max-height": "none", "max-width": "none", overflow: "visible",
      margin: "0", "box-sizing": "border-box", transition: "none"
    })) element.style.setProperty(property, value, "important");
  }
  clone.querySelectorAll(".compare-toolbar, .ranking-group:not([open])").forEach(element => element.remove());
  clone.querySelectorAll("summary").forEach(element => element.style.setProperty("position", "static", "important"));
  const originalSelects = node.querySelectorAll("select");
  clone.querySelectorAll("select").forEach((select, index) => {
    const label = document.createElement("span");
    label.textContent = originalSelects[index]?.selectedOptions[0]?.textContent || "";
    select.replaceWith(label);
  });
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  return wrapper;
}

async function ensureExportLibraries(format = "image", context = {}) {
  exportCanvasLibraryPromise ||= loadExportLibrary("html2canvas", () => typeof window.html2canvas === "function").catch(error => {
    exportCanvasLibraryPromise = null;
    throw error;
  });
  await exportCanvasLibraryPromise;

  if (format === "pdf") {
    exportPdfLibraryPromise ||= loadExportLibrary("jspdf", () =>
      typeof window.jspdf?.jsPDF === "function" && window.jspdf.jsPDF.version === exportAssets.jspdf.version
    ).catch(error => {
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
    notify(context, "Export tools could not load. Check your connection and retry.", "No se pudieron cargar las herramientas de exportacion. Revisa tu conexion y reintenta.");
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
  } catch (error) {
    console.warn("No se pudo generar la imagen:", error);
    notify(context, "Could not generate the image. Retry the export.", "No se pudo generar la imagen. Reintenta la exportacion.");
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
    notify(context, "PDF tools could not load. Check your connection and retry.", "No se pudieron cargar las herramientas de PDF. Revisa tu conexion y reintenta.");
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
  } catch (error) {
    console.warn("No se pudo generar el PDF:", error);
    notify(context, "Could not generate the PDF. Retry the export.", "No se pudo generar el PDF. Reintenta la exportacion.");
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
