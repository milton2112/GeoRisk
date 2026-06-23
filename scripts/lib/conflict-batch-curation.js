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
  { name: "Guerra entre Iran e Irak", start: 1980, end: 1988, scale: "regional", type: "interestatal", region: "Oriente Medio" },
  { name: "Guerra Iran-Irak", start: 1980, end: 1988, scale: "regional", type: "interestatal", region: "Oriente Medio" },
  { name: "Guerra de Kosovo", start: 1998, end: 1999, scale: "internacional", type: "insurgencia", region: "Balcanes" },
  { name: "Guerra de Afganistan", start: 2001, end: 2021, scale: "internacional", type: "insurgencia", region: "Asia central" },
  { name: "Guerra de Irak", start: 2003, end: 2011, scale: "internacional", type: "interestatal", region: "Oriente Medio" },
  { name: "Invasion rusa a Ucrania", start: 2022, end: 2026, scale: "internacional", type: "interestatal", region: "Europa oriental", active: true }
];

const CAMPAIGN_HINTS = [
  { pattern: /\b(corea|korean|chosin|pusan|naktong|seoul|inchon|incheon|osan|wonju|kumsong|pork chop|outpost|imjin|kapyong|bloody ridge|heartbreak ridge|punchbowl|yeonpyeong)\b/i, war: "Guerra de Corea", campaign: "Campana de Corea", region: "Peninsula coreana" },
  { pattern: /\boperacion encore\b/i, war: "Guerra de Corea", campaign: "Campana de Corea", region: "Peninsula coreana" },
  { pattern: /\b(vietnam|saigon|tet)\b/i, war: "Guerra de Vietnam", campaign: "Campanas de Vietnam", region: "Sudeste asiatico" },
  { pattern: /\b(anaconda|afganistan|taliban|uzbin)\b/i, war: "Guerra de Afganistan", campaign: "Campanas de Afganistan", region: "Asia central" },
  { pattern: /\b(malvinas|falklands|goose green|monte longdon|harriet|tumbledown|agradable|sheffield|general belgrano|black buck|san carlos|wireless ridge|dos hermanas|murrell)\b/i, war: "Guerra de las Malvinas", campaign: "Campana de las Malvinas", region: "Atlantico Sur" },
  { pattern: /\b(isla decepci[oó]n|islote snipe)\b/i, war: "Disputas australes", campaign: "Incidentes territoriales australes", region: "Atlantico Sur y Antartida" },
  { pattern: /\b(invasion brasile[nñ]a de 1864|guerra del uruguay|uruguayan war)\b/i, war: "Guerra del Uruguay", campaign: "Campana de Uruguay de 1864", region: "America del Sur" },
  { pattern: /\bbattleford\b/i, war: "Rebelion del Noroeste", campaign: "Campana de Saskatchewan", region: "Canada" },
  { pattern: /\bdeliberate force\b/i, war: "Guerra de Bosnia", campaign: "Intervencion de la OTAN en Bosnia", region: "Balcanes" },
  { pattern: /\b(73 easting|guerra del golfo|kuwait)\b/i, war: "Guerra del Golfo", campaign: "Campanas del Golfo Persico", region: "Golfo Persico" },
  { pattern: /\b(irak|iraq|bagdad|al fao|ramadi|um kasar)\b/i, war: "Guerra de Irak", campaign: "Campanas de Irak", region: "Oriente Medio" },
  { pattern: /\b(israel|sina[ií]|gaza|majdal|mandelbaum|yom kipur|seis dias|yeonpyeong|jerusalen)\b/i, war: "Conflicto arabe-israeli", campaign: "Campanas del conflicto arabe-israeli", region: "Oriente Medio" },
  { pattern: /\b(midway|guadalcanal|java|singapur|buna|gona|wake|guam|okinawa|balikpapan|timor|tulagi|munda|sattelberg|scarlet|horaniu|rennell|guerra del pacifico de la segunda guerra mundial)\b/i, war: "Segunda Guerra Mundial", campaign: "Guerra del Pacifico de la Segunda Guerra Mundial", region: "Asia-Pacifico" },
  { pattern: /\b(normandia|dunkerque|sedan|francia|belgica|rotterdam)\b/i, war: "Segunda Guerra Mundial", campaign: "Campanas de Europa occidental de la Segunda Guerra Mundial", region: "Europa occidental" },
  { pattern: /\b(el alamein|gazala|kasserine)\b/i, war: "Segunda Guerra Mundial", campaign: "Campana del Norte de Africa", region: "Norte de Africa" },
  { pattern: /\b(sicilia|anzio|creta)\b/i, war: "Segunda Guerra Mundial", campaign: "Campanas del Mediterraneo", region: "Mediterraneo" },
  { pattern: /\b(gondar|keren|agordat)\b/i, war: "Segunda Guerra Mundial", campaign: "Campana de Africa oriental", region: "Africa oriental" }
];

const REGION_HINTS = [
  { pattern: /\bguerra de kivu\b/i, region: "Africa central" },
  { pattern: /\b(insurgencia en el magreb|incidentes de tinduf|guerra de las arenas|frente de las fuerzas socialistas)\b/i, region: "Norte de Africa" },
  { pattern: /\bfirst burundi war\b/i, region: "Africa oriental" },
  { pattern: /\bfirst chad.*frolinat.*rebellion\b/i, region: "Africa central" }
];

const GENERATED_PLACEHOLDER_MARKERS = [
  "pendiente de curaduria",
  "requiere ampliacion historiografica",
  "disputa militar o politica asociada",
  "impacto militar y politico localizado",
  "resultado pendiente"
];

function getYear(entry = {}) {
  if (Number.isFinite(entry.startYear)) return entry.startYear;
  const match = String(entry.name || "").match(/\b(1[4-9]\d{2}|20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

function getEndYear(entry = {}) {
  return Number.isFinite(entry.endYear) ? entry.endYear : getYear(entry);
}

function hasBattleName(entry = {}) {
  return /\b(batalla|battle|sitio|siege|combate|asalto|raid|incursion|ofensiva)\b/i.test(entry.name || "");
}

function isBattleLike(entry = {}) {
  return hasBattleName(entry) || /\b(batalla|battle|sitio|siege)\b/i.test(entry.type || "");
}

function inferWarRule(entry = {}) {
  const nameText = normalizeConflictKey(entry.name);
  const nameRule = WAR_RULES.find(rule => nameText.includes(normalizeConflictKey(rule.name)));
  if (nameRule) return nameRule;
  const text = normalizeConflictKey(
    [entry.parent, entry.war, entry.campaign].filter(Boolean).join(" ")
  );
  const directRule = WAR_RULES.find(rule => text.includes(normalizeConflictKey(rule.name)));
  if (directRule) return directRule;
  return null;
}

function inferCampaignHint(entry = {}) {
  const text = normalizeConflictKey(entry.name);
  return CAMPAIGN_HINTS.find(rule => rule.pattern.test(text)) || null;
}

function inferRegionHint(entry = {}) {
  const text = normalizeConflictKey(entry.name);
  return REGION_HINTS.find(rule => rule.pattern.test(text)) || null;
}

function inferConflictType(entry = {}, warRule = null) {
  const text = `${entry.name || ""} ${entry.type || ""}`.toLowerCase();
  if (entry.conflictType) return entry.conflictType;
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

function normalizeRegion(entry = {}, country = {}, warRule = null, campaignHint = null, regionHint = null) {
  if (warRule?.region && normalizeConflictKey(entry.name) === normalizeConflictKey(warRule.name)) return warRule.region;
  if (campaignHint?.region) return campaignHint.region;
  if (regionHint?.region) return regionHint.region;
  if (entry.region) return entry.region;
  if (entry.normalizedRegion) return entry.normalizedRegion;
  if (warRule?.region) return warRule.region;
  if (country.continent) {
    const continent = normalizeConflictKey(country.continent);
    return ({ america: "America", europe: "Europa", europa: "Europa", asia: "Asia", africa: "Africa", oceania: "Oceania", antarctica: "Antartida", antartida: "Antartida" })[continent] || country.continent;
  }
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

function normalizeTextForChecks(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function isGeneratedPlaceholderText(value = "") {
  const normalized = normalizeTextForChecks(value);
  return GENERATED_PLACEHOLDER_MARKERS.some(marker => normalized.includes(marker));
}

function keepSpecificText(existing, fallback) {
  if (existing && !isGeneratedPlaceholderText(existing)) return existing;
  return fallback;
}

function periodLabelFor(entry = {}) {
  const startYear = getYear(entry);
  const endYear = getEndYear(entry);
  if (startYear && endYear && startYear !== endYear) return `${startYear}-${endYear}`;
  if (startYear) return String(startYear);
  return "fecha no consolidada";
}

function conflictShapeFor(entry = {}, conflictType = "") {
  const text = `${entry.name || ""} ${entry.type || ""}`.toLowerCase();
  if (/\b(asedio|sitio|siege)\b/.test(text)) return "asedio";
  if (/\b(batalla|battle|combate)\b/.test(text)) return "batalla";
  if (/\b(incursion|raid|accion|action|operacion)\b/.test(text)) return "operacion";
  if (/\b(campana|campaign|ofensiva|expedicion)\b/.test(text)) return "campana";
  if (/\b(guerra|war|conflicto)\b/.test(text)) return "guerra";
  return conflictType || "conflicto";
}

function describeConflictCause(entry = {}, context = {}) {
  const { parent, normalizedRegion, conflictType } = context;
  const period = periodLabelFor(entry);
  const shape = conflictShapeFor(entry, conflictType);
  if (parent && isBattleLike(entry)) {
    return `Accion militar de ${period} vinculada a ${parent}, centrada en control territorial, rutas, posiciones o fuerzas en ${normalizedRegion}.`;
  }
  if (parent && ["operacion", "campana"].includes(shape)) {
    return `Operacion de ${period} dentro de ${parent}, organizada alrededor de objetivos militares y politicos en ${normalizedRegion}.`;
  }
  const byType = {
    civil: `Confrontacion interna de ${period} por poder politico, seguridad territorial o legitimidad estatal en ${normalizedRegion}.`,
    colonial: `Confrontacion de ${period} ligada al control colonial, rutas imperiales o administracion territorial en ${normalizedRegion}.`,
    independencia: `Confrontacion de ${period} asociada a autonomia politica, independencia o reorganizacion del poder estatal en ${normalizedRegion}.`,
    insurgencia: `Insurgencia o campana irregular de ${period} relacionada con control local, seguridad interna y autoridad estatal en ${normalizedRegion}.`,
    frontera: `Conflicto fronterizo de ${period} por delimitacion, control de pasos o presencia militar en ${normalizedRegion}.`,
    intervencion: `Intervencion militar de ${period} con participacion externa y objetivos estrategicos o de seguridad en ${normalizedRegion}.`
  };
  return byType[conflictType] || `Confrontacion armada de ${period} entre actores estatales o fuerzas organizadas por control, seguridad o influencia en ${normalizedRegion}.`;
}

function describeConflictOutcome(entry = {}, context = {}) {
  const { parent, normalizedRegion } = context;
  const period = periodLabelFor(entry);
  if (entry.ongoing) {
    return `Conflicto activo o con efectos abiertos; el seguimiento se mantiene por su impacto politico y de seguridad en ${normalizedRegion}.`;
  }
  if (parent && isBattleLike(entry)) {
    return `Desenlace tactico registrado dentro de ${parent}; las cifras especificas se mantienen sin consolidar cuando no hay fuente fina en la ficha.`;
  }
  return `Cierre historico registrado para ${period}; el resultado se interpreta en la ficha como cambio de control, posicion militar o equilibrio politico en ${normalizedRegion}.`;
}

function describeConflictConsequences(entry = {}, context = {}) {
  const { parent, normalizedRegion, conflictType } = context;
  if (parent && isBattleLike(entry)) {
    return `Contribuyo a la evolucion operacional de ${parent} y a la lectura territorial o militar de ${normalizedRegion}.`;
  }
  if (conflictType === "civil") {
    return `Afecto la estabilidad institucional, el control territorial y la memoria politica de ${normalizedRegion}.`;
  }
  if (conflictType === "colonial") {
    return `Influyo en el orden colonial, las rutas estrategicas y la administracion territorial de ${normalizedRegion}.`;
  }
  if (conflictType === "independencia") {
    return `Incidio en procesos de soberania, legitimidad politica y reorganizacion territorial en ${normalizedRegion}.`;
  }
  return `Influyo en la seguridad regional, la diplomacia y la comparacion historica de conflictos en ${normalizedRegion}.`;
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
  const inheritedParent = renamedEntry.parent || renamedEntry.war || "";
  const hasObsoleteGenericParent = renamedEntry.curationBatch === "safe-structured-conflict-curation-2026-06"
    && /^Conflicto regional de\b/i.test(inheritedParent)
    && !hasBattleName(renamedEntry);
  const baseEntry = { ...renamedEntry };
  if (hasObsoleteGenericParent) {
    delete baseEntry.type;
  }
  const warRule = inferWarRule(baseEntry);
  const isTopLevelWar = Boolean(warRule && normalizeConflictKey(name) === normalizeConflictKey(warRule.name));
  if (isTopLevelWar || normalizeConflictKey(inheritedParent) === normalizeConflictKey(name) || hasObsoleteGenericParent) {
    delete baseEntry.parent;
    delete baseEntry.war;
    if (isTopLevelWar || /^Campana vinculada a\b/i.test(baseEntry.campaign || "")) {
      delete baseEntry.campaign;
    }
  }
  const campaignHint = isTopLevelWar ? null : inferCampaignHint(baseEntry);
  const regionHint = inferRegionHint(baseEntry);
  const preferNameHint = baseEntry.curationBatch === "safe-structured-conflict-curation-2026-06" && campaignHint;
  const countryCount = context.countriesByConflict?.get(normalizeConflictKey(name))?.size || 1;
  const normalizedRegion = normalizeRegion(baseEntry, context.country, warRule, campaignHint, regionHint);
  const parent = (preferNameHint ? campaignHint.war : null) || baseEntry.parent || baseEntry.war || campaignHint?.war || (isBattleLike(baseEntry) ? (warRule?.name || `Conflicto regional de ${normalizedRegion}`) : null);
  const campaign = (preferNameHint ? campaignHint.campaign : null) || baseEntry.campaign || campaignHint?.campaign || (parent && isBattleLike(baseEntry) ? `Campana vinculada a ${parent}` : null);
  const conflictType = inferConflictType(baseEntry, warRule);
  const scale = inferScale(baseEntry, countryCount, warRule);
  const active = Boolean(baseEntry.ongoing || warRule?.active || (getEndYear(baseEntry) ?? 0) >= ACTIVE_THRESHOLD_YEAR);

  return {
    ...baseEntry,
    ...(parent ? { parent, war: parent } : {}),
    ...(campaign ? { campaign } : {}),
    type: baseEntry.type || (isBattleLike(baseEntry) ? "batalla" : conflictType),
    conflictType,
    scale: baseEntry.scale || scale,
    status: active ? "activo" : "historico",
    active,
    normalizedRegion,
    region: normalizedRegion,
    cause: keepSpecificText(baseEntry.cause, describeConflictCause(baseEntry, { parent, normalizedRegion, conflictType })),
    outcome: keepSpecificText(baseEntry.outcome, describeConflictOutcome(baseEntry, { parent, normalizedRegion, conflictType })),
    consequences: keepSpecificText(baseEntry.consequences, describeConflictConsequences(baseEntry, { parent, normalizedRegion, conflictType })),
    participants: buildParticipants(baseEntry, context.countriesByConflict, context.country),
    chronology: chronologyFor(baseEntry),
    treaties: closeAgreementsFor(baseEntry),
    curationPriority: isBattleLike(baseEntry) || countryCount >= 3 || active ? "alta" : "media",
    curationBatch: "safe-structured-conflict-curation-2026-06",
    curationStatus: baseEntry.curationStatus || "estructural",
    dataConfidence: baseEntry.dataConfidence || "parcial",
    curationNote: baseEntry.curationNote || "Metadatos estructurales agregados por tanda segura; bajas, tratados y resultados finos no se inventan si no habia fuente especifica."
  };
}

export function curateConflictDetail(name, detail = {}, context = {}) {
  return curateConflictEntry({ name, ...detail }, context);
}
