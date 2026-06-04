import { cleanConflictLabel, normalizeConflictKey } from "./conflict-cleaning.js";

const ACTIVE_THRESHOLD_YEAR = 2020;

const NAME_RENAMES = new Map([
  ["Allied bombings de Amsterdam-Noord", "Bombardeos aliados de Amsterdam-Noord"],
  ["April 2009 raid off Somalia", "Incursion de abril de 2009 frente a Somalia"],
  ["Battle for Outpost Vegas", "Batalla por Outpost Vegas"],
  ["Chinese Spring Offensive", "Ofensiva china de primavera"],
  ["Ethiopian-Somali border conflict", "Conflicto fronterizo etiope-somali"],
  ["First y Second Battles de Wonju", "Primera y segunda batallas de Wonju"],
  ["Indochina Wars", "Guerras de Indochina"],
  ["Ingham incident", "Incidente Ingham"],
  ["Korean Theater", "Teatro coreano"],
  ["Outpost Harry", "Puesto avanzado Harry"],
  ["Batalla de Hjörungavágr", "Batalla de Hjorungavagr"],
  ["Batalla de Niså", "Batalla de Nisa"],
  ["Batalla naval de Rügen", "Batalla naval de Rugen"],
  ["Batalla naval de RÃ¼gen", "Batalla naval de Rugen"],
  ["Batalla de Rügen", "Batalla naval de Rugen"],
  ["Batalla de Crête-à-Pierrot", "Batalla de Crete-a-Pierrot"],
  ["Batalla del puerto de Trípoli", "Batalla del puerto de Tripoli"],
  ["Batalla de Sandöström", "Batalla de Sandostrom"],
  ["Batalla del puente del río Pacora", "Batalla del puente del rio Pacora"],
  ["Batalla de San Juan de Ulúa", "Batalla de San Juan de Ulua"],
  ["Batalla de la Fosse-à-l'Eau", "Batalla de la Fosse-a-l'Eau"],
  ["Batalla de Juárez", "Batalla de Juarez"],
  ["Primera Batalla de Alihuatá", "Primera Batalla de Alihuata"],
  ["Batalla del Atlántico", "Batalla del Atlantico"],
  ["Batalla de Bélgica", "Batalla de Belgica"],
  ["Batalla de Sedán (1940)", "Batalla de Sedan (1940)"],
  ["Batalla del Cabo Matapán", "Batalla del cabo Matapan"],
  ["Batalla de la Bahía de Milne", "Batalla de la Bahia de Milne"]
]);

const YEAR_PREFIX = /^(\d{4})\s+(.+)$/u;

const SPECIAL_CONFLICT_METADATA = new Map([
  ["China Burma India Teatro", {
    name: "Teatro China-Birmania-India",
    startYear: 1942,
    endYear: 1945,
    parent: "Segunda Guerra Mundial",
    campaign: "Teatro China-Birmania-India",
    scale: "mundial",
    conflictType: "interestatal",
    region: "Asia-Pacifico"
  }]
]);

const WAR_RULES = [
  { name: "Primera Guerra Mundial", start: 1914, end: 1918, scale: "mundial", type: "interestatal", region: "Europa y teatros globales" },
  { name: "Segunda Guerra Mundial", start: 1939, end: 1945, scale: "mundial", type: "interestatal", region: "Europa, Asia-Pacifico, Africa y Atlantico" },
  { name: "Guerra de Independencia de Estados Unidos", start: 1775, end: 1783, scale: "internacional", type: "independencia", region: "America del Norte y Atlantico" },
  { name: "Guerras napoleonicas", start: 1803, end: 1815, scale: "internacional", type: "interestatal", region: "Europa y teatros coloniales" },
  { name: "Guerra de 1812", start: 1812, end: 1815, scale: "regional", type: "interestatal", region: "America del Norte" },
  { name: "Guerra mexicano-estadounidense", start: 1846, end: 1848, scale: "regional", type: "interestatal", region: "America del Norte" },
  { name: "Guerra Civil estadounidense", start: 1861, end: 1865, scale: "regional", type: "civil", region: "America del Norte" },
  { name: "Guerra de la Triple Alianza", start: 1864, end: 1870, scale: "regional", type: "interestatal", region: "America del Sur" },
  { name: "Guerra del Pacifico", start: 1879, end: 1884, scale: "regional", type: "interestatal", region: "America del Sur" },
  { name: "Guerra hispano-estadounidense", start: 1898, end: 1898, scale: "internacional", type: "interestatal", region: "Caribe y Pacifico" },
  { name: "Guerra filipino-estadounidense", start: 1899, end: 1902, scale: "regional", type: "colonial", region: "Sudeste asiatico" },
  { name: "Guerra de Corea", start: 1950, end: 1953, scale: "internacional", type: "interestatal", region: "Peninsula coreana" },
  { name: "Guerra de Vietnam", start: 1955, end: 1975, scale: "internacional", type: "insurgencia", region: "Sudeste asiatico" },
  { name: "Guerra del Sinai", start: 1956, end: 1956, scale: "internacional", type: "interestatal", region: "Oriente Medio" },
  { name: "Guerra de los Seis Dias", start: 1967, end: 1967, scale: "regional", type: "interestatal", region: "Oriente Medio" },
  { name: "Guerra de Yom Kipur", start: 1973, end: 1973, scale: "regional", type: "interestatal", region: "Oriente Medio" },
  { name: "Guerra de las Malvinas", start: 1982, end: 1982, scale: "regional", type: "interestatal", region: "Atlantico Sur" },
  { name: "Guerra del Golfo", start: 1990, end: 1991, scale: "internacional", type: "interestatal", region: "Golfo Persico" },
  { name: "Guerra de Kosovo", start: 1998, end: 1999, scale: "internacional", type: "insurgencia", region: "Balcanes" },
  { name: "Guerra de Afganistan", start: 2001, end: 2021, scale: "internacional", type: "insurgencia", region: "Asia central" },
  { name: "Guerra de Irak", start: 2003, end: 2011, scale: "internacional", type: "interestatal", region: "Oriente Medio" },
  { name: "Invasion rusa a Ucrania", start: 2022, end: 2026, scale: "internacional", type: "interestatal", region: "Europa oriental", active: true }
];

const CAMPAIGN_HINTS = [
  { pattern: /\b(corea|korean|chosin|pusan|naktong|seoul|inchon|incheon|osan|wonju|kumsong|pork chop|outpost|imjin|kapyong|bloody ridge|heartbreak ridge|punchbowl)\b/i, war: "Guerra de Corea", campaign: "Campana de Corea", region: "Peninsula coreana" },
  { pattern: /\b(vietnam|saigon|tet|anaconda|afganistan|taliban|uzbin)\b/i, war: "Guerra de Vietnam", campaign: "Campanas de Indochina y Asia contemporanea", region: "Asia" },
  { pattern: /\b(malvinas|falklands|goose green|monte longdon|harriet|tumbledown|agradable)\b/i, war: "Guerra de las Malvinas", campaign: "Campana de las Malvinas", region: "Atlantico Sur" },
  { pattern: /\b(irak|iraq|bagdad|al fao|ramadi|um kasar|73 easting|golfo)\b/i, war: "Guerra del Golfo", campaign: "Campanas del Golfo Persico", region: "Golfo Persico" },
  { pattern: /\b(israel|sina[ií]|gaza|majdal|mandelbaum|yom kipur|seis dias|yeonpyeong|jerusalen)\b/i, war: "Conflicto arabe-israeli", campaign: "Campanas del conflicto arabe-israeli", region: "Oriente Medio" },
  { pattern: /\b(pacifico|midway|guadalcanal|java|singapur|buna|gona|wake|guam|okinawa|balikpapan|timor|tulagi|munda|sattelberg|scarlet|horaniu|rennell)\b/i, war: "Segunda Guerra Mundial", campaign: "Guerra del Pacifico de la Segunda Guerra Mundial", region: "Asia-Pacifico" },
  { pattern: /\b(normandia|dunkerque|sedan|francia|belgica|rotterdam|crete|creta|el alamein|gazala|kasserine|sicilia|anzio|gondar|keren|agordat)\b/i, war: "Segunda Guerra Mundial", campaign: "Campanas de Europa y Africa de la Segunda Guerra Mundial", region: "Europa y Africa" }
];

function getYear(entry = {}) {
  if (Number.isFinite(entry.startYear)) return entry.startYear;
  const match = String(entry.name || "").match(/\b(1[4-9]\d{2}|20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

function getEndYear(entry = {}) {
  return Number.isFinite(entry.endYear) ? entry.endYear : getYear(entry);
}

function isBattleLike(entry = {}) {
  return /\b(batalla|battle|sitio|siege|combate|asalto|raid|incursion|ofensiva)\b/i.test(`${entry.name || ""} ${entry.type || ""}`);
}

function inferWarRule(entry = {}) {
  const year = getYear(entry);
  const endYear = getEndYear(entry) ?? year;
  if (!year) return null;
  return WAR_RULES.find(rule => year >= rule.start && endYear <= rule.end + 1) || null;
}

function inferCampaignHint(entry = {}) {
  const text = `${entry.name || ""} ${entry.region || ""} ${entry.parent || ""} ${entry.campaign || ""}`;
  return CAMPAIGN_HINTS.find(rule => rule.pattern.test(text)) || null;
}

function inferConflictType(entry = {}, warRule = null) {
  const text = `${entry.name || ""} ${entry.type || ""}`.toLowerCase();
  if (warRule?.type) return warRule.type;
  if (/\bcivil\b|guerra civil/.test(text)) return "civil";
  if (/\bindependencia|liberacion\b/.test(text)) return "independencia";
  if (/\bcolonial|protectorado|imperio\b/.test(text)) return "colonial";
  if (/\binsurgencia|guerrilla|terrorismo|rebelion|revuelta\b/.test(text)) return "insurgencia";
  if (/\bfrontera|fronterizo|border\b/.test(text)) return "frontera";
  return "interestatal";
}

function inferScale(entry = {}, countryCount = 1, warRule = null) {
  if (warRule?.scale) return warRule.scale;
  if (countryCount >= 8) return "mundial";
  if (countryCount >= 4) return "internacional";
  if (countryCount >= 2) return "regional";
  return "local";
}

function normalizeRegion(entry = {}, country = {}, warRule = null, campaignHint = null) {
  if (entry.normalizedRegion) return entry.normalizedRegion;
  if (warRule?.region) return warRule.region;
  if (campaignHint?.region) return campaignHint.region;
  if (entry.region) return entry.region;
  if (country.continent) return country.continent;
  return "Region por determinar";
}

function buildParticipants(entry = {}, countriesByConflict = new Map(), country = {}) {
  if (Array.isArray(entry.participants) && entry.participants.length) {
    return entry.participants;
  }
  const key = normalizeConflictKey(entry.name);
  const countries = [...(countriesByConflict.get(key) || [])];
  const members = countries.length ? countries : [country.name].filter(Boolean);
  return [
    {
      side: members.length > 1 ? "Estados participantes registrados" : "Actor registrado",
      members,
      casualties: "No consolidado en fuentes livianas"
    },
    {
      side: "Oponente o fuerza local documentada",
      members: [],
      casualties: "No consolidado en fuentes livianas"
    }
  ];
}

function chronologyFor(entry = {}) {
  if (Array.isArray(entry.chronology) && entry.chronology.length) return entry.chronology;
  const startYear = getYear(entry);
  const endYear = getEndYear(entry);
  if (!startYear) return [];
  return [
    { year: startYear, event: "Inicio registrado del conflicto o accion militar." },
    ...(endYear && endYear !== startYear ? [{ year: endYear, event: "Cierre registrado de la fase principal." }] : [])
  ];
}

function closeAgreementsFor(entry = {}) {
  if (Array.isArray(entry.treaties) && entry.treaties.length) return entry.treaties;
  if (entry.closeAgreement) return [entry.closeAgreement];
  const year = getEndYear(entry);
  if (!year || entry.ongoing) return [];
  return [`Cierre o arreglo posterior pendiente de curaduria especifica (${year})`];
}

function renameConflict(name) {
  const cleaned = cleanConflictLabel(name);
  const explicit = NAME_RENAMES.get(cleaned);
  if (explicit) return explicit;
  const special = SPECIAL_CONFLICT_METADATA.get(cleaned);
  if (special?.name) return special.name;
  return cleaned
    .replace(YEAR_PREFIX, "$2 ($1)")
    .replace(/\bBattle of\b/gi, "Batalla de")
    .replace(/\bBattle for\b/gi, "Batalla por")
    .replace(/\bBattles of\b/gi, "Batallas de")
    .replace(/\bWar of\b/gi, "Guerra de")
    .replace(/\bWar in\b/gi, "Guerra en")
    .replace(/\bCivil War\b/gi, "Guerra civil")
    .replace(/\bCampaign of\b/gi, "Campana de")
    .replace(/\bCampaign\b/gi, "Campana")
    .replace(/\bInvasion of\b/gi, "Invasion de")
    .replace(/\bRaid off\b/gi, "Incursion frente a")
    .replace(/\bRaid on\b/gi, "Incursion sobre")
    .replace(/\braid de\b/gi, "incursion de")
    .replace(/\bJune\b/gi, "junio")
    .replace(/\bFront in\b/gi, "Frente en")
    .replace(/\bTheater\b/gi, "Teatro")
    .replace(/\bWorld War II\b/gi, "Segunda Guerra Mundial")
    .replace(/\bWorld War I\b/gi, "Primera Guerra Mundial")
    .replace(/\bKorean\b/gi, "coreano")
    .replace(/\s+/g, " ")
    .trim();
}

export function collectConflictCountryNames(countries = {}) {
  const map = new Map();
  for (const country of Object.values(countries)) {
    for (const entry of [...(country.conflicts || []), ...(country.military?.conflicts || [])]) {
      if (!entry?.name) continue;
      const key = normalizeConflictKey(renameConflict(entry.name));
      if (!key) continue;
      const set = map.get(key) || new Set();
      set.add(country.name);
      map.set(key, set);
    }
  }
  return map;
}

export function curateConflictEntry(entry = {}, context = {}) {
  if (!entry?.name) return entry;
  const name = renameConflict(entry.name);
  const special = SPECIAL_CONFLICT_METADATA.get(cleanConflictLabel(entry.name)) || SPECIAL_CONFLICT_METADATA.get(name) || {};
  const renamedEntry = { ...entry, ...special, name };
  const warRule = inferWarRule(renamedEntry);
  const campaignHint = inferCampaignHint(renamedEntry);
  const countryCount = context.countriesByConflict?.get(normalizeConflictKey(name))?.size || 1;
  const normalizedRegion = normalizeRegion(renamedEntry, context.country, warRule, campaignHint);
  const parent = renamedEntry.parent || renamedEntry.war || campaignHint?.war || (isBattleLike(renamedEntry) ? (warRule?.name || `Conflicto regional de ${normalizedRegion}`) : null);
  const campaign = renamedEntry.campaign || campaignHint?.campaign || (parent && isBattleLike(renamedEntry) ? `Campana vinculada a ${parent}` : null);
  const conflictType = inferConflictType(renamedEntry, warRule);
  const scale = inferScale(renamedEntry, countryCount, warRule);
  const active = Boolean(renamedEntry.ongoing || warRule?.active || (getEndYear(renamedEntry) ?? 0) >= ACTIVE_THRESHOLD_YEAR);

  return {
    ...renamedEntry,
    ...(parent ? { parent, war: parent } : {}),
    ...(campaign ? { campaign } : {}),
    type: renamedEntry.type || (isBattleLike(renamedEntry) ? "batalla" : conflictType),
    conflictType,
    scale: renamedEntry.scale || scale,
    status: active ? "activo" : "historico",
    active,
    normalizedRegion,
    region: renamedEntry.region || normalizedRegion,
    cause: renamedEntry.cause || `Disputa militar o politica asociada a ${parent || normalizedRegion}.`,
    outcome: renamedEntry.outcome || "Resultado pendiente de curaduria especifica; registrado como evento historico verificado por presencia en el dataset.",
    consequences: renamedEntry.consequences || `Impacto militar y politico localizado en ${normalizedRegion}; requiere ampliacion historiografica fina.`,
    participants: buildParticipants(renamedEntry, context.countriesByConflict, context.country),
    chronology: chronologyFor(renamedEntry),
    treaties: closeAgreementsFor(renamedEntry),
    curationPriority: isBattleLike(renamedEntry) || countryCount >= 3 || active ? "alta" : "media",
    curationBatch: "safe-structured-conflict-curation-2026-06",
    curationNote: renamedEntry.curationNote || "Metadatos estructurales agregados por tanda segura; bajas y tratados especificos quedan como no consolidados si no habia fuente fina."
  };
}

export function curateConflictDetail(name, detail = {}, context = {}) {
  return curateConflictEntry({ name, ...detail }, context);
}
