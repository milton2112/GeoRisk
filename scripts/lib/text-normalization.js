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

directPairs.push(
  ["\u00c5\u2018", "\u0151"],
  ["\u00c5\u0090", "\u0150"],
  ["\u00c5\u00b1", "\u0171"],
  ["\u00c5\u00b0", "\u0170"],
  ["\u00c3\u00a4", "ä"],
  ["\u00c3\u0084", "Ä"],
  ["\u00c3\u00b6", "ö"],
  ["\u00c3\u0096", "Ö"],
  ["\u00c3\u00b8", "ø"],
  ["\u00c3\u0098", "Ø"],
  ["\u00c3\u00a5", "å"],
  ["\u00c3\u0085", "Å"],
  ["\u00c3\u00a6", "æ"],
  ["\u00c3\u0086", "Æ"]
);

function applyDirectPairs(raw) {
  return directPairs.reduce((text, [from, to]) => text.replaceAll(from, to), raw)
    .replaceAll("Ã‚", "")
    .replaceAll("Â", "");
}

function hasMojibakeSignal(raw) {
  const text = String(raw || "");
  return (
    text.includes("\uFFFD") ||
    text.includes("\u00C3") ||
    text.includes("\u00C2") ||
    text.includes("\u00C5\u2018") ||
    text.includes("\u00C5\u00B1") ||
    text.includes("\u00EF\u00BF\u00BD") ||
    text.includes("\u00E2\u20AC")
  );
}

function mojibakeScore(value) {
  const text = String(value || "");
  const signalMatches = text.match(/[\u00C2\u00C3\uFFFD]|Ã|Â|â€|ï¿½/g) || [];
  const replacementMatches = text.match(/\uFFFD/g) || [];
  return signalMatches.length * 10 + replacementMatches.length * 30;
}

function decodeLatin1Utf8(value) {
  try {
    return Buffer.from(String(value || ""), "latin1").toString("utf8");
  } catch {
    return String(value || "");
  }
}

export function repairMojibake(value) {
  const raw = String(value || "");
  if (!raw || !hasMojibakeSignal(raw)) {
    return raw;
  }

  const candidates = new Set([raw, applyDirectPairs(raw)]);
  let decoded = raw;
  for (let index = 0; index < 3; index += 1) {
    decoded = decodeLatin1Utf8(decoded);
    if (!decoded) break;
    candidates.add(decoded);
    candidates.add(applyDirectPairs(decoded));
  }

  return [...candidates].sort((left, right) => {
    const scoreDelta = mojibakeScore(left) - mojibakeScore(right);
    if (scoreDelta !== 0) return scoreDelta;
    return left.length - right.length;
  })[0];
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
