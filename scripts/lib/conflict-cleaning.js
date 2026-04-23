export function repairConflictMojibake(value) {
  const text = String(value || "");
  if (!text) {
    return "";
  }

  if (!/[ÃƒÃ‚Ã¢â‚¬]/.test(text)) {
    return text;
  }

  try {
    const repaired = Buffer.from(text, "latin1").toString("utf8");
    return /\uFFFD/.test(repaired) ? text : repaired;
  } catch {
    return text;
  }
}

export function applyConflictUnicodeCorrections(value) {
  return String(value || "")
    .replace(/Operaci.{0,2}n/gi, "Operacion")
    .replace(/Campa.{0,2}a/gi, "Campana")
    .replace(/Intervenci.{0,2}n/gi, "Intervencion")
    .replace(/Rebeli.{0,2}n/gi, "Rebelion")
    .replace(/Insurrecci.{0,2}n/gi, "Insurreccion")
    .replace(/Expedici.{0,2}n/gi, "Expedicion")
    .replace(/Acci.{0,2}n/gi, "Accion")
    .replace(/Ocupaci.{0,2}n/gi, "Ocupacion")
    .replace(/Liberaci.{0,2}n/gi, "Liberacion")
    .replace(/Invasi.{0,2}n/gi, "Invasion")
    .replace(/M[eé]xico/gi, "Mexico")
    .replace(/Per[uú]/gi, "Peru")
    .replace(/Pakist[aá]n/gi, "Pakistan")
    .replace(/Afganist[aá]n/gi, "Afganistan")
    .replace(/Ir[aá]n/gi, "Iran")
    .replace(/Jerusal[eé]n/gi, "Jerusalen")
    .replace(/Luxembourg/gi, "Luxemburgo");
}

export function normalizeConflictKey(value) {
  return applyConflictUnicodeCorrections(repairConflictMojibake(String(value || "")))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanConflictLabel(value) {
  return applyConflictUnicodeCorrections(repairConflictMojibake(value))
    .replace(/[â€“â€”âˆ’]/g, "-")
    .replace(/[â€œâ€]/g, "\"")
    .replace(/[â€˜â€™]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function canonicalizeConflictNameWithRules(name, rules = []) {
  let canonical = cleanConflictLabel(name);
  if (!canonical) {
    return "";
  }

  for (const [pattern, replacement] of rules) {
    canonical = canonical.replace(pattern, replacement);
  }

  canonical = canonical
    .replace(/\bthe\b/gi, "")
    .replace(/\bof\b/gi, "de")
    .replace(/\bin\b/gi, "en")
    .replace(/\band\b/gi, "y")
    .replace(/\s+/g, " ")
    .trim();

  return canonical.charAt(0).toUpperCase() + canonical.slice(1);
}

export function extractYearsFromConflictText(value) {
  return [...new Set(
    [...String(value || "").matchAll(/\b(1[4-9]\d{2}|20\d{2}|2100)\b/g)].map(match => Number(match[1]))
  )].sort((a, b) => a - b);
}

export function inferConflictYearsFromText(value) {
  const years = extractYearsFromConflictText(value);
  if (!years.length) {
    return { startYear: null, endYear: null, ongoing: false };
  }

  return {
    startYear: years[0] ?? null,
    endYear: years.length > 1 ? years.at(-1) : years[0] ?? null,
    ongoing: /\b(presente|present|actualidad)\b/i.test(String(value || ""))
  };
}

function pickPreferredConflictName(currentName, nextName) {
  const current = cleanConflictLabel(currentName);
  const next = cleanConflictLabel(nextName);
  const currentScore = Number(/[áéíóúñÁÉÍÓÚÑ]/.test(current)) + current.length;
  const nextScore = Number(/[áéíóúñÁÉÍÓÚÑ]/.test(next)) + next.length;
  return nextScore > currentScore ? next : current;
}

function normalizeYearValue(year) {
  return typeof year === "number" && Number.isFinite(year) ? year : null;
}

function mergeConflictField(currentValue, nextValue) {
  if (Array.isArray(currentValue) || Array.isArray(nextValue)) {
    const merged = [...(Array.isArray(currentValue) ? currentValue : []), ...(Array.isArray(nextValue) ? nextValue : [])]
      .filter(value => value !== null && value !== undefined && value !== "");
    return [...new Set(merged.map(value => JSON.stringify(value)))].map(value => JSON.parse(value));
  }

  if (
    currentValue &&
    nextValue &&
    typeof currentValue === "object" &&
    typeof nextValue === "object"
  ) {
    return { ...currentValue, ...nextValue };
  }

  return currentValue ?? nextValue ?? null;
}

export function mergeConflictEntries(entries) {
  const merged = new Map();

  for (const rawEntry of entries || []) {
    if (!rawEntry?.name) {
      continue;
    }

    const entry = {
      ...rawEntry,
      name: cleanConflictLabel(rawEntry.name),
      startYear: normalizeYearValue(rawEntry.startYear),
      endYear: normalizeYearValue(rawEntry.endYear),
      ongoing: Boolean(rawEntry.ongoing)
    };

    const key = normalizeConflictKey(entry.name);
    if (!key) {
      continue;
    }

    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, { ...entry });
      continue;
    }

    existing.name = pickPreferredConflictName(existing.name, entry.name);
    existing.startYear = [existing.startYear, entry.startYear]
      .filter(year => year !== null)
      .sort((a, b) => a - b)[0] ?? null;

    const mergedOngoing = existing.ongoing || entry.ongoing;
    const latestEndYear = [existing.endYear, entry.endYear, existing.startYear, entry.startYear]
      .filter(year => year !== null)
      .sort((a, b) => b - a)[0] ?? null;

    existing.ongoing = mergedOngoing;
    existing.endYear = mergedOngoing ? null : latestEndYear;

    for (const [key, value] of Object.entries(entry)) {
      if (["name", "startYear", "endYear", "ongoing"].includes(key)) {
        continue;
      }
      existing[key] = mergeConflictField(existing[key], value);
    }
  }

  return [...merged.values()];
}
