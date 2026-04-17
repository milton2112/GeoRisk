export function repairMojibake(value) {
  const raw = String(value || "");
  if (!raw || !/[\u00C2\u00C3\uFFFD]/.test(raw)) {
    return raw;
  }

  return raw
    .replace(/\u00C3\u00A1/g, "á")
    .replace(/\u00C3\u00A9/g, "é")
    .replace(/\u00C3\u00AD/g, "í")
    .replace(/\u00C3\u00B3/g, "ó")
    .replace(/\u00C3\u00BA/g, "ú")
    .replace(/\u00C3\u00B1/g, "ñ")
    .replace(/\u00C3\u00BC/g, "ü")
    .replace(/\u00C3\u0081/g, "Á")
    .replace(/\u00C3\u0089/g, "É")
    .replace(/\u00C3\u008D/g, "Í")
    .replace(/\u00C3\u0093/g, "Ó")
    .replace(/\u00C3\u009A/g, "Ú")
    .replace(/\u00C3\u0091/g, "Ñ")
    .replace(/\u00C3\u009C/g, "Ü")
    .replace(/\u00E2\u20AC\u201C|\u00E2\u20AC\u201D/g, "-")
    .replace(/\u00E2\u20AC\u02DC|\u00E2\u20AC\u2122/g, "'")
    .replace(/\u00E2\u20AC\u0153|\u00E2\u20AC\u009D/g, "\"")
    .replace(/\u00C2/g, "");
}

export function normalizeText(value) {
  return repairMojibake(String(value || ""))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseInflationValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  const cleaned = String(value)
    .replace(/[%~\u2248]/g, "")
    .replace(",", ".")
    .trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}
