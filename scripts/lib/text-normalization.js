const directPairs = [
  ["ÃƒÂ¡", "á"], ["ÃƒÂ©", "é"], ["ÃƒÂ­", "í"], ["ÃƒÂ³", "ó"], ["ÃƒÂº", "ú"], ["ÃƒÂ±", "ñ"], ["ÃƒÂ¼", "ü"],
  ["ÃƒÂ", "Á"], ["Ãƒâ€°", "É"], ["ÃƒÂ", "Í"], ["Ãƒâ€œ", "Ó"], ["ÃƒÅ¡", "Ú"], ["Ãƒâ€˜", "Ñ"], ["ÃƒÅ“", "Ü"],
  ["Ã¡", "á"], ["Ã©", "é"], ["Ã­", "í"], ["Ã³", "ó"], ["Ãº", "ú"], ["Ã±", "ñ"], ["Ã¼", "ü"],
  ["Ã", "Á"], ["Ã‰", "É"], ["Ã", "Í"], ["Ã“", "Ó"], ["Ãš", "Ú"], ["Ã‘", "Ñ"], ["Ãœ", "Ü"],
  ["Ã¨", "è"], ["Ã ", "à"], ["Ã¬", "ì"], ["Ã²", "ò"], ["Ã¹", "ù"], ["Ã¢", "â"], ["Ãª", "ê"], ["Ã®", "î"],
  ["Ã´", "ô"], ["Ã»", "û"], ["Ã§", "ç"], ["Ãˆ", "È"], ["Ã€", "À"], ["ÃŒ", "Ì"], ["Ã’", "Ò"], ["Ã™", "Ù"],
  ["Ã‚", "Â"], ["ÃŠ", "Ê"], ["ÃŽ", "Î"], ["Ã”", "Ô"], ["Ã›", "Û"], ["Ã‡", "Ç"],
  ["ã¡", "á"], ["ã©", "é"], ["ã­", "í"], ["ã³", "ó"], ["ãº", "ú"], ["ã±", "ñ"],
  ["Â·", "·"], ["Â¿", "¿"], ["Â¡", "¡"], ["Â²", "²"], ["Â³", "³"],
  ["â€¢", "•"], ["â€“", "–"], ["â€”", "—"], ["â€˜", "‘"], ["â€™", "’"], ["â€œ", "“"], ["â€", "”"], ["â€¦", "…"],
  ["Ã‚Â·", "·"], ["Ã‚Â¿", "¿"], ["Ã‚Â¡", "¡"], ["Ã‚Â²", "²"], ["Ã‚Â³", "³"],
  ["Ã¢â‚¬Â¢", "•"], ["Ã¢â‚¬â€œ", "–"], ["Ã¢â‚¬â€", "—"], ["Ã¢â‚¬Ëœ", "‘"], ["Ã¢â‚¬â„¢", "’"], ["Ã¢â‚¬Å“", "“"], ["Ã¢â‚¬Â¦", "…"]
];

function applyDirectPairs(raw) {
  return directPairs.reduce((text, [from, to]) => text.replaceAll(from, to), raw)
    .replaceAll("Ã‚", "")
    .replaceAll("Â", "");
}

export function repairMojibake(value) {
  const raw = String(value || "");
  if (!raw || !(/[ÃÂâãï¿½]/.test(raw) || /�/.test(raw))) {
    return raw;
  }

  let repaired = applyDirectPairs(raw);
  if (repaired !== raw && !repaired.includes("Ã")) {
    return repaired;
  }

  for (let index = 0; index < 2; index += 1) {
    try {
      const decoded = Buffer.from(repaired, "latin1").toString("utf8");
      if (!decoded || decoded === repaired) {
        break;
      }
      repaired = applyDirectPairs(decoded);
      if (!repaired.includes("Ã") && !repaired.includes("Â")) {
        break;
      }
    } catch {
      break;
    }
  }

  return repaired;
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
  const cleaned = repairMojibake(String(value))
    .replace(/[%~\u2248]/g, "")
    .replace(",", ".")
    .trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}
