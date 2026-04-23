import fetch from "node-fetch";
import fs from "fs-extra";

const WIKIPEDIA_API_ES = "https://es.wikipedia.org/w/api.php";
const WIKIPEDIA_API_EN = "https://en.wikipedia.org/w/api.php";

export const CONFLICT_WIKIPEDIA_TITLE_OVERRIDES = {
  "Primera Guerra Mundial": "Primera_Guerra_Mundial",
  "Segunda Guerra Mundial": "Segunda_Guerra_Mundial",
  "Guerra de Corea": "Guerra_de_Corea",
  "Guerra de Vietnam": "Guerra_de_Vietnam",
  "Guerra del Golfo": "Guerra_del_Golfo",
  "Guerra de Afganistan": "Guerra_de_Afganistán_(2001-2021)",
  "Guerra de Afganistán": "Guerra_de_Afganistán_(2001-2021)",
  "Guerra de Irak": "Guerra_de_Irak",
  "Guerra civil siria": "Guerra_civil_siria",
  "Guerra civil espanola": "Guerra_civil_española",
  "Guerra Iran-Iraq": "Guerra_Irán-Irak",
  "Guerra ruso-japonesa": "Guerra_ruso-japonesa",
  "Guerra de Argelia": "Guerra_de_Argelia",
  "Guerra del Pacifico": "Guerra_del_Pacífico",
  "Guerra del Chaco": "Guerra_del_Chaco",
  "Guerra de la Triple Alianza": "Guerra_de_la_Triple_Alianza",
  "Guerra de las Malvinas": "Guerra_de_las_Malvinas",
  "Guerra civil china": "Guerra_civil_china",
  "Guerra rusoucraniana": "Invasión_rusa_de_Ucrania_de_2022",
  "Guerra arabe-israeli de 1948": "Guerra_árabe-israelí_de_1948",
  "Primera intifada": "Primera_Intifada",
  "Segunda intifada": "Segunda_Intifada",
  "Operación Deliberate Force": "Operación_Deliberate_Force",
  "Operacion Deliberate Force": "Operación_Deliberate_Force",
  "Conflicto de Sa'dah": "Insurgencia_huzí_en_Yemen",
  "Guerra por el agua del río Jordán": "Guerra_por_el_agua",
  "Guerra por el agua del rio Jordan": "Guerra_por_el_agua",
  "1984 DMZ incident": "Incidente_de_la_ZDC_de_1984",
  "Campaña en África del Suroeste": "Campaña_de_África_del_Sudoeste",
  "Campana en Africa del Suroeste": "Campaña_de_África_del_Sudoeste",
  "Guerra en el noroeste de Pakistán": "Guerra_en_el_noroeste_de_Pakistán",
  "Batalla de Amiens": "Batalla_de_Amiens_(1918)",
  "Batalla de Manila": "Batalla_de_Manila_(1945)",
  "Batalla de Long Tan": "Batalla_de_Long_Tan",
  "Batalla de Bubiyan": "Batalla_de_Bubiyan",
  "Batalla de Jutlandia": "Batalla_de_Jutlandia",
  "Batalla de Faluya": "Primera_batalla_de_Faluya",
  "Batalla de Kapyong": "Batalla_de_Kapyong",
  "Batalla de Kisangani": "Batalla_de_Kisangani"
};

const FIELD_ALIASES = {
  fecha: "date",
  lugar: "place",
  "casus belli": "casusBelli",
  casusbelli: "casusBelli",
  resultado: "result",
  consecuencias: "consequences",
  "cambios territoriales": "territorialChanges",
  beligerantes: "belligerents",
  comandantes: "commanders",
  "figuras politicas": "commanders",
  "fuerzas en combate": "strength",
  bajas: "casualties",
  date: "date",
  location: "place",
  result: "result",
  belligerents: "belligerents",
  commanders: "commanders",
  "commanders and leaders": "commanders",
  strength: "strength",
  casualties: "casualties",
  losses: "casualties",
  "territorial changes": "territorialChanges",
  cause: "casusBelli"
};

const COMPLEX_LIST_FIELDS = new Set(["belligerents", "commanders", "strength", "casualties"]);
const WIKIPEDIA_HEADERS = {
  "User-Agent": "GeoRiskConflictImporter/1.0 (educational dataset curation)",
  Accept: "application/json"
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWikipediaJson(url, attempt = 1) {
  const response = await fetch(url, { headers: WIKIPEDIA_HEADERS });
  if (response.status === 429 && attempt < 4) {
    await sleep(600 * attempt);
    return fetchWikipediaJson(url, attempt + 1);
  }
  if (!response.ok) {
    throw new Error(`Wikipedia request fallo con ${response.status}`);
  }
  return response.json();
}

function decodeHtmlEntities(text = "") {
  return String(text)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#160;/gi, " ")
    .replace(/&#8203;|&#x200b;/gi, " ")
    .replace(/&#8211;|&#x2013;/gi, " - ")
    .replace(/&#8212;|&#x2014;/gi, " - ")
    .replace(/&#8216;|&#8217;/gi, "'")
    .replace(/&#8220;|&#8221;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);?/g, (_, code) => {
      const parsed = Number(code);
      return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : " ";
    })
    .replace(/&#x([a-f0-9]+);?/gi, (_, code) => {
      const parsed = parseInt(code, 16);
      return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : " ";
    });
}

function repairMojibakeString(text = "") {
  const value = String(text || "");
  if (!/[ÃÂÅÐ]/.test(value)) {
    return value;
  }

  try {
    return Buffer.from(value, "latin1").toString("utf8");
  } catch {
    return value;
  }
}

function stripTags(html = "") {
  return repairMojibakeString(decodeHtmlEntities(
    String(html)
      .replace(/<sup[\s\S]*?<\/sup>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?(?:p|div|li|ul|ol|tr|td|th|tbody|thead|span|a|small|b|strong|i|em)[^>]*>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\[[^\]]+\]/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/\n\s+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{2,}/g, "\n")
      .trim()
  ));
}

function normalizeFieldLabel(value = "") {
  return stripTags(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanInlineText(value = "") {
  return repairMojibakeString(stripTags(value))
    .replace(/â€“|â€”|âˆ’/g, " - ")
    .replace(/â€‹|â€¯|â€¦/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, " ")
    .replace(/&&&&+[^ \n]*/g, " ")
    .replace(/(?:^|\s)0(?:\s|$)/g, " ")
    .replace(/Expresi[^:]{0,40}err[^:]{0,20}nea:[^.;\n]*/gi, " ")
    .replace(/Â·/g, " · ")
    .replace(/Â/g, " ")
    .replace(/\s*†\s*/g, " ")
    .replace(/\s*\.\s*$/g, "")
    .replace(/(?:^|\s)(?:ver|vease|v[eé]ase)\s+el?\s+anexo(?:$|\s)/gi, " ")
    .replace(/\b(?:ver|mostrar|ocultar)\b/gi, " ")
    .replace(/\s*\u00B7\s*/g, " · ")
    .replace(/\?{2,}/g, " - ")
    .replace(/\s*-\s*-\s*/g, " - ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function splitCompoundItems(items = []) {
  return (items || [])
    .flatMap(item => cleanInlineText(item)
      .split(/\n| · | \| |;(?=\s*[A-ZÁÉÍÓÚÑ0-9])|:(?=\s*[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/u)
      .map(part => part.trim())
      .filter(Boolean)
    );
}

function dedupeScalarItems(items = []) {
  const seen = new Set();
  const result = [];
  for (const item of splitCompoundItems(items)) {
    const cleaned = cleanInlineText(item);
    if (!cleaned) continue;
    const collapsed = cleaned
      .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*(?:\s+[\p{L}\p{N}][\p{L}\p{N}.-]*)+)\s+\1\b/gu, "$1")
      .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*)\s+\1\b/gu, "$1");
    const normalized = collapsed
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!normalized || normalized === "0" || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(collapsed);
  }
  return result;
}

function shouldDropWikipediaValue(value = "") {
  const cleaned = cleanInlineText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  return !cleaned
    || cleaned === "vease el anexo"
    || cleaned === "ver anexo"
    || cleaned === "vease anexo"
    || (/^v/.test(cleaned) && cleaned.includes("anexo"));
}

function normalizeStructuredWikipediaValue(value) {
  if (Array.isArray(value)) {
    if (value.some(item => Array.isArray(item))) {
      return value
        .map(item => dedupeScalarItems(item).filter(entry => !shouldDropWikipediaValue(entry) && entry !== "0"))
        .filter(item => item.length);
    }
    return dedupeScalarItems(value).filter(entry => !shouldDropWikipediaValue(entry) && entry !== "0");
  }
  const cleaned = cleanInlineText(value);
  return shouldDropWikipediaValue(cleaned) ? "" : cleaned;
}

function extractCoalitionLabel(items = []) {
  const candidates = items.slice(0, 2).filter(Boolean);
  for (const candidate of candidates) {
    const cleaned = cleanInlineText(candidate).replace(/\s*:\s*$/, "");
    const collapsed = cleaned
      .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*(?:\s+[\p{L}\p{N}][\p{L}\p{N}.-]*)+)\s+\1\b/gu, "$1")
      .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*)\s+\1\b/gu, "$1");
    const normalized = collapsed
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    if (/^(aliados?|eje|potencias centrales|potencias del eje|onu|otan|coalicion|entente|bando \d+)$/i.test(normalized)) {
      return cleaned;
    }
  }
  return "";
}

function tokenizeForMatch(value = "") {
  return cleanInlineText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(token => token && !["de", "del", "la", "el", "the", "of", "war", "battle", "guerra", "batalla"].includes(token));
}

function extractTemporalHints(value = "") {
  const normalized = cleanInlineText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const years = normalized.match(/\b(1[6-9]\d{2}|20\d{2})\b/g) || [];
  const days = normalized.match(/\b([12]?\d|3[01])\b/g) || [];
  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "setiembre", "octubre", "noviembre", "diciembre",
    "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"
  ].filter(month => normalized.includes(month));

  return {
    years: [...new Set(years)],
    days: [...new Set(days.map(String))],
    months: [...new Set(monthNames)]
  };
}

function hasReasonableTitleMatch(conflictName, pageTitle) {
  const conflictTokens = tokenizeForMatch(conflictName);
  const pageTokens = tokenizeForMatch(pageTitle);

  if (!conflictTokens.length || !pageTokens.length) {
    return true;
  }

  const yearsInConflict = conflictName.match(/\b(1[6-9]\d{2}|20\d{2})\b/g) || [];
  const yearsInPage = pageTitle.match(/\b(1[6-9]\d{2}|20\d{2})\b/g) || [];
  if (yearsInConflict.length && yearsInPage.length && !yearsInConflict.some(year => yearsInPage.includes(year))) {
    return false;
  }

  const overlap = conflictTokens.filter(token => pageTokens.includes(token)).length;
  return overlap >= Math.max(1, Math.ceil(conflictTokens.length * 0.35));
}

function hasReasonableTemporalMatch(conflictName, pageTitle = "", infoboxDate = "") {
  const conflictHints = extractTemporalHints(conflictName);
  if (!conflictHints.years.length && !conflictHints.months.length && !conflictHints.days.length) {
    return true;
  }

  const targetHints = extractTemporalHints(`${pageTitle} ${infoboxDate}`);

  if (conflictHints.years.length && !conflictHints.years.some(year => targetHints.years.includes(year))) {
    return false;
  }

  if (conflictHints.months.length && !conflictHints.months.some(month => targetHints.months.includes(month))) {
    return false;
  }

  if (conflictHints.days.length && targetHints.days.length && !conflictHints.days.some(day => targetHints.days.includes(day))) {
    return false;
  }

  return true;
}

function extractListItemsFromHtml(html = "") {
  const liMatches = [...String(html).matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(match => cleanInlineText(match[1]));
  if (liMatches.length) {
    return dedupeScalarItems(liMatches);
  }

  return dedupeScalarItems(
    cleanInlineText(html)
      .split(/\n|\u2022|\u00B7|;(?=\s*[A-Z\u00C1\u00C9\u00CD\u00D3\u00DA\u00D10-9])/)
      .map(item => item.trim())
      .filter(Boolean)
  );
}

function extractFirstInfoboxTable(html = "") {
  const infoboxIndex = html.search(/<table[^>]*class="[^"]*infobox/i);
  if (infoboxIndex === -1) {
    return "";
  }

  let depth = 0;
  let endIndex = -1;
  const tableRegex = /<\/?table\b[^>]*>/gi;
  tableRegex.lastIndex = infoboxIndex;
  let match;
  while ((match = tableRegex.exec(html))) {
    if (match[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        endIndex = tableRegex.lastIndex;
        break;
      }
    } else {
      depth += 1;
    }
  }

  return endIndex !== -1 ? html.slice(infoboxIndex, endIndex) : "";
}

function parseInfoboxRows(tableHtml = "") {
  const rows = [];
  const rowRegex = /<tr[\s\S]*?<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(tableHtml))) {
    const rowHtml = rowMatch[0];
    const thMatches = [...rowHtml.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)];
    const tdMatches = [...rowHtml.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)];

    rows.push({
      rowHtml,
      headerHtml: thMatches.map(match => match[1]),
      dataHtml: tdMatches.map(match => match[1]),
      headerText: thMatches.map(match => cleanInlineText(match[1])).filter(Boolean),
      dataText: tdMatches.map(match => cleanInlineText(match[1])).filter(Boolean)
    });
  }

  return rows;
}

function normalizeInfoboxValue(key, html = "", row = null) {
  if (COMPLEX_LIST_FIELDS.has(key)) {
    const cells = row?.dataHtml?.length ? row.dataHtml : [html];
    const structured = cells
      .map(cellHtml => dedupeScalarItems(extractListItemsFromHtml(cellHtml)))
      .filter(items => items.length);
    if (structured.length > 1) {
      return structured;
    }
    return structured[0] || [];
  }

  if (["consequences", "territorialChanges"].includes(key)) {
    return dedupeScalarItems(extractListItemsFromHtml(html)).filter(item => !shouldDropWikipediaValue(item));
  }

  const cleaned = cleanInlineText(html);
  return shouldDropWikipediaValue(cleaned) ? "" : cleaned;
}

function parseInfobox(tableHtml = "") {
  const rows = parseInfoboxRows(tableHtml);
  const parsed = {};

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const labelCandidates = [...row.headerText];
    if (!labelCandidates.length) {
      continue;
    }

    let mappedKey = null;
    for (const candidate of labelCandidates) {
      const normalizedHeader = normalizeFieldLabel(candidate);
      if (FIELD_ALIASES[normalizedHeader]) {
        mappedKey = FIELD_ALIASES[normalizedHeader];
        break;
      }
    }

    if (!mappedKey) {
      continue;
    }

    let sourceRow = row;
    if (!row.dataHtml.length && rows[index + 1]?.dataHtml?.length) {
      sourceRow = rows[index + 1];
      index += 1;
    }

    if (!sourceRow.dataHtml.length) {
      continue;
    }

    parsed[mappedKey] = normalizeInfoboxValue(mappedKey, sourceRow.dataHtml[0], sourceRow);
  }

  return parsed;
}

function flattenStructuredText(value) {
  if (Array.isArray(value)) {
    if (value.some(item => Array.isArray(item))) {
      return value
        .map(item => flattenStructuredText(item))
        .filter(Boolean)
        .join(" | ");
    }
    return dedupeScalarItems(value).join(" · ");
  }
  return cleanInlineText(String(value || ""));
}

function inferCoalitionLabelFromMembers(members = []) {
  const normalizedMembers = members.map(member =>
    cleanInlineText(member)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
  );

  const hasAny = needles => needles.some(needle => normalizedMembers.some(member => member.includes(needle)));

  if (hasAny(["corea del norte", "china"])) return "Corea del Norte y apoyos";
  if (hasAny(["corea del sur", "estados unidos", "reino unido", "australia", "canada"])) return "Corea del Sur y ONU";
  if (hasAny(["vietnam del norte", "viet cong"])) return "Vietnam del Norte y Viet Cong";
  if (hasAny(["vietnam del sur", "estados unidos", "australia"])) return "Vietnam del Sur y aliados";
  if (hasAny(["alemania", "italia", "japon"])) return "Eje";
  if (hasAny(["austria-hungria", "imperio otomano", "bulgaria"]) && hasAny(["alemania"])) return "Potencias Centrales";
  if (hasAny(["reino unido", "union sovietica", "estados unidos", "francia", "china", "belgica", "paises bajos", "luxemburgo"])) return "Aliados";
  return "";
}

function dedupeParticipantEntries(items = []) {
  const duplicateSideCounts = items.reduce((acc, item) => {
    const key = normalizeFieldLabel(item?.side || "");
    if (key) {
      acc.set(key, (acc.get(key) || 0) + 1);
    }
    return acc;
  }, new Map());
  const byKey = new Map();

  for (const item of items) {
    const members = dedupeScalarItems(item?.members || []);
    const organizations = dedupeScalarItems(item?.organizations || []);
    const rawSide = cleanInlineText(item?.side || "") || inferCoalitionLabelFromMembers(members);
    const sideKey = normalizeFieldLabel(rawSide);
    const side = sideKey && (duplicateSideCounts.get(sideKey) || 0) > 1
      ? (inferCoalitionLabelFromMembers(members) || rawSide)
      : rawSide;
    const key = `${members.map(normalizeFieldLabel).sort().join("|")}::${organizations.map(normalizeFieldLabel).sort().join("|")}`;
    if (!key) {
      continue;
    }

    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, {
        side,
        members,
        organizations,
        troops: cleanInlineText(item?.troops || ""),
        casualties: cleanInlineText(item?.casualties || "")
      });
      continue;
    }

    const existingGeneric = /^Bando \d+$/i.test(existing.side || "") || /^(Beligerantes|Belligerents)$/i.test(existing.side || "");
    const currentGeneric = /^Bando \d+$/i.test(side || "") || /^(Beligerantes|Belligerents)$/i.test(side || "");
    byKey.set(key, {
      side: !existingGeneric ? existing.side : (currentGeneric ? existing.side : side),
      members: existing.members.length >= members.length ? existing.members : members,
      organizations: dedupeScalarItems([...existing.organizations, ...organizations]),
      troops: existing.troops || cleanInlineText(item?.troops || ""),
      casualties: existing.casualties || cleanInlineText(item?.casualties || "")
    });
  }

  const merged = [...byKey.values()].filter(item => item.members.length || item.troops || item.casualties);
  const hasNamedCoalitions = merged.some(item => item.side && !/^Bando \d+$/i.test(item.side) && !/^(Beligerantes|Belligerents)$/i.test(item.side));
  return merged.filter(item => !hasNamedCoalitions || !/^Bando \d+$/i.test(item.side || ""));
}

function buildParticipantsFromInfobox(parsed) {
  if (!Array.isArray(parsed.belligerents) || !parsed.belligerents.length) {
    return [];
  }

  const belligerents = Array.isArray(parsed.belligerents[0]) ? parsed.belligerents : [parsed.belligerents];
  const strength = Array.isArray(parsed.strength?.[0]) ? parsed.strength : [parsed.strength || []];
  const casualties = Array.isArray(parsed.casualties?.[0]) ? parsed.casualties : [parsed.casualties || []];

  return dedupeParticipantEntries(belligerents.map((members, index) => {
    const dedupedMembers = dedupeScalarItems(members || []);
    const coalitionLabel = extractCoalitionLabel(dedupedMembers) || inferCoalitionLabelFromMembers(dedupedMembers);
    const filteredMembers = coalitionLabel
      ? dedupedMembers.filter(item => cleanInlineText(item).replace(/\s*:\s*$/, "") !== coalitionLabel)
      : dedupedMembers;
    const troops = flattenStructuredText(strength[index] || []);
    const casualtiesText = flattenStructuredText(casualties[index] || []);
    return {
      side: coalitionLabel || (belligerents.length === 1 ? "Beligerantes" : `Bando ${index + 1}`),
      members: filteredMembers,
      organizations: [],
      troops: troops && troops !== "0" && troops !== "0 ." ? troops : "",
      casualties: casualtiesText && casualtiesText !== "0" && casualtiesText !== "0 ." ? casualtiesText : ""
    };
  }));
}

function buildChronologyFromInfobox(parsed) {
  if (!parsed.date) {
    return [];
  }
  return [{ year: null, text: parsed.date }];
}

function toGeoRiskConflictDetail(parsed, pageTitle) {
  return {
    source: "Wikipedia",
    pageTitle,
    wikipedia: parsed,
    cause: parsed.casusBelli || null,
    participants: buildParticipantsFromInfobox(parsed),
    outcome: parsed.result || null,
    consequences: flattenStructuredText(parsed.consequences || parsed.territorialChanges || []),
    chronology: buildChronologyFromInfobox(parsed),
    related: [],
    region: parsed.place || null
  };
}

export function sanitizeWikipediaConflictDetail(detail = {}) {
  if (!detail || typeof detail !== "object") {
    return detail;
  }

  const wikipedia = detail.wikipedia && typeof detail.wikipedia === "object"
    ? Object.fromEntries(
        Object.entries(detail.wikipedia).map(([key, value]) => [key, normalizeStructuredWikipediaValue(value)])
      )
    : null;

  const participants = Array.isArray(detail.participants)
    ? dedupeParticipantEntries(detail.participants
        .map(item => ({
          ...item,
          side: cleanInlineText(item?.side || ""),
          members: dedupeScalarItems(item?.members || []),
          organizations: dedupeScalarItems(item?.organizations || []),
          troops: normalizeStructuredWikipediaValue(item?.troops),
          casualties: normalizeStructuredWikipediaValue(item?.casualties)
        }))
        .filter(item => item.side || item.members.length || item.organizations.length || item.troops || item.casualties))
    : [];

  const rebuiltParticipants = wikipedia?.belligerents
    ? buildParticipantsFromInfobox(wikipedia)
    : dedupeParticipantEntries(participants);

  const hasParticipantTroops = rebuiltParticipants.some(item => item?.troops);
  const hasParticipantCasualties = rebuiltParticipants.some(item => item?.casualties);
  const hasNamedCoalitions = rebuiltParticipants.some(item => item?.side && !/^Bando \d+$/i.test(item.side));

  if (wikipedia) {
    if (rebuiltParticipants.length || hasNamedCoalitions) {
      delete wikipedia.belligerents;
    }
    if (hasParticipantTroops) {
      delete wikipedia.strength;
    }
    if (hasParticipantCasualties) {
      delete wikipedia.casualties;
    }
  }

  return {
    ...detail,
    pageTitle: cleanInlineText(detail.pageTitle || ""),
    wikipedia,
    cause: normalizeStructuredWikipediaValue(detail.cause),
    outcome: normalizeStructuredWikipediaValue(detail.outcome),
    consequences: normalizeStructuredWikipediaValue(detail.consequences),
    region: normalizeStructuredWikipediaValue(detail.region),
    chronology: Array.isArray(detail.chronology)
      ? detail.chronology
          .map(item => ({
            ...item,
            text: normalizeStructuredWikipediaValue(item?.text)
          }))
          .filter(item => item.text)
      : [],
    related: dedupeScalarItems(detail.related || []),
    participants: rebuiltParticipants
  };
}

async function resolveWikipediaConflictTitleFromApi(conflictName, apiUrl) {
  const direct = CONFLICT_WIKIPEDIA_TITLE_OVERRIDES[conflictName];
  if (direct && apiUrl === WIKIPEDIA_API_ES) {
    return direct;
  }

  const url = new URL(apiUrl);
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("srsearch", conflictName);
  url.searchParams.set("srlimit", "5");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const json = await fetchWikipediaJson(url);
  const results = json?.query?.search || [];
  const best = results.find(entry => hasReasonableTitleMatch(conflictName, entry.title));
  return best?.title || null;
}

export async function resolveWikipediaConflictTitle(conflictName) {
  const spanishTitle = await resolveWikipediaConflictTitleFromApi(conflictName, WIKIPEDIA_API_ES);
  if (spanishTitle) {
    return { pageTitle: spanishTitle, apiUrl: WIKIPEDIA_API_ES, language: "es" };
  }
  const englishTitle = await resolveWikipediaConflictTitleFromApi(conflictName, WIKIPEDIA_API_EN);
  if (englishTitle) {
    return { pageTitle: englishTitle, apiUrl: WIKIPEDIA_API_EN, language: "en" };
  }
  return null;
}

export async function fetchWikipediaConflictDetail(conflictName) {
  const resolved = await resolveWikipediaConflictTitle(conflictName);
  if (!resolved?.pageTitle) {
    return null;
  }

  const url = new URL(resolved.apiUrl);
  url.searchParams.set("action", "parse");
  url.searchParams.set("page", resolved.pageTitle);
  url.searchParams.set("prop", "text");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const json = await fetchWikipediaJson(url);
  const html = json?.parse?.text?.["*"] || "";
  const tableHtml = extractFirstInfoboxTable(html);
  if (!tableHtml) {
    return null;
  }

  const parsed = parseInfobox(tableHtml);
  if (!Object.keys(parsed).length) {
    return null;
  }

  if (!hasReasonableTemporalMatch(conflictName, resolved.pageTitle, parsed.date || "")) {
    return null;
  }

  const detail = sanitizeWikipediaConflictDetail(toGeoRiskConflictDetail(parsed, repairMojibakeString(resolved.pageTitle)));
  detail.wikipedia.language = resolved.language;
  return detail;
}

export async function importWikipediaConflictDetails(conflictNames, options = {}) {
  const {
    cachePath,
    delayMs = 50,
    force = false,
    limit = Infinity
  } = options;

  const uniqueNames = [...new Set((conflictNames || []).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"))
    .slice(0, limit);

  const cache = cachePath && await fs.pathExists(cachePath) ? await fs.readJson(cachePath) : { conflicts: {} };
  const result = cache?.conflicts ? { ...cache.conflicts } : { ...cache };
  let failedCount = 0;

  for (const conflictName of uniqueNames) {
    if (!force && result[conflictName]?.wikipedia) {
      continue;
    }

    try {
      const detail = await fetchWikipediaConflictDetail(conflictName);
      if (detail) {
        result[conflictName] = detail;
      } else {
        failedCount += 1;
      }
    } catch (error) {
      failedCount += 1;
    }

    if (cachePath) {
      await fs.writeJson(cachePath, {
        _meta: {
          source: "Wikipedia (MediaWiki API)",
          generatedAt: new Date().toISOString(),
          importedCount: Object.values(result).filter(item => item?.wikipedia).length,
          requestedCount: uniqueNames.length,
          missingCount: failedCount
        },
        conflicts: result
      }, { spaces: 2 });
    }

    if (delayMs) {
      await sleep(delayMs);
    }
  }

  return {
    conflicts: result,
    importedCount: Object.values(result).filter(item => item?.wikipedia).length,
    missingCount: failedCount,
    requestedCount: uniqueNames.length
  };
}
