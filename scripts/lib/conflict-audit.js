const BLOCK_FALSE_POSITIVES = {
  post2000: new Set([
    "1919 Soviet invasion de Ukraine",
    "Crisis constitucional groenlandesa de 1940",
    "Crisis de Malaui de 1964",
    "Crisis fronteriza germano-polaca de 2025"
  ]),
  latin_america: new Set([
    "Ataque misilístico libio contra Lampedusa",
    "Campaña de Nils Bielke contra el Imperio otomano (1684-1687)",
    "Contraofensiva del Óblast de Járkov de 2022",
    "Expedición contra Quebec",
    "Guerra contra el Estado Islámico",
    "Guerra contra el terrorismo",
    "Guerra contra Segismundo",
    "Guerra de la Confederación de Colonia contra Dinamarca",
    "Resistencia popular argelina contra la invasión francesa"
  ])
};

import {
  cleanConflictLabel,
  inferConflictYearsFromText,
  isProvisionalConflictHierarchy,
  normalizeConflictKey
} from "./conflict-cleaning.js";
import { repairMojibake } from "./text-normalization.js";
import { CURATED_CONFLICT_DETAIL_FIXES, SAFE_CONFLICT_RENAMES } from "./conflict-autofix-rules.js";
import { EXTRA_CURATED_CONFLICT_DETAIL_FIXES, EXTRA_SAFE_CONFLICT_RENAMES } from "./conflict-curation-extra.js";
import { US_REVOLUTION_CONFLICT_DETAIL_FIXES } from "./conflict-curation-us-revolution.js";
import { EARLY_1800_CONFLICT_DETAIL_FIXES, EARLY_1800_SAFE_CONFLICT_RENAMES } from "./conflict-curation-early-1800.js";
import { MID_1800_CONFLICT_DETAIL_FIXES, MID_1800_SAFE_CONFLICT_RENAMES } from "./conflict-curation-1847-1864.js";
import { LATE_1800_CONFLICT_DETAIL_FIXES, LATE_1800_SAFE_CONFLICT_RENAMES } from "./conflict-curation-1877-1914.js";
import { INTERWAR_CONFLICT_DETAIL_FIXES, INTERWAR_SAFE_CONFLICT_RENAMES } from "./conflict-curation-1919-1941.js";
import { WWII_1942_CONFLICT_DETAIL_FIXES, WWII_1942_SAFE_CONFLICT_RENAMES } from "./conflict-curation-1942.js";
import { THEATER_CONFLICT_DETAIL_FIXES, THEATER_SAFE_CONFLICT_RENAMES } from "./conflict-curation-theater.js";
import {
  VISIBLE_MODERN_CONFLICT_DETAIL_FIXES,
  VISIBLE_MODERN_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-visible-modern.js";
import {
  VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  VISIBLE_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-visible-followup.js";
import {
  KOREA_MODERN_CONFLICT_DETAIL_FIXES,
  KOREA_MODERN_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-korea-modern.js";
import {
  HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES,
  HISTORICAL_VIETNAM_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-historical-vietnam.js";
import {
  POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES,
  POSTWAR_1970_1991_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-1970-1991.js";
import {
  MODERN_1992_2021_CONFLICT_DETAIL_FIXES,
  MODERN_1992_2021_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-1992-2021.js";
import {
  UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES,
  UNDATED_AMERICAS_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-undated-americas.js";
import {
  REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-revolution-followup.js";
import {
  TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES,
  TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-1846-1902.js";
import {
  WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-war-1812-followup.js";
import {
  US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-us-civil-war-followup.js";
import {
  US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-us-wwii-followup.js";
import {
  US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-us-indian-wars-followup.js";
import {
  BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./conflict-curation-british-wwii-followup.js";
import { applyVisibleStringReplacements } from "./visible-data-corrections.js";

const ALL_CURATED_CONFLICT_DETAIL_FIXES = {
  ...CURATED_CONFLICT_DETAIL_FIXES,
  ...EXTRA_CURATED_CONFLICT_DETAIL_FIXES,
  ...US_REVOLUTION_CONFLICT_DETAIL_FIXES,
  ...EARLY_1800_CONFLICT_DETAIL_FIXES,
  ...MID_1800_CONFLICT_DETAIL_FIXES,
  ...LATE_1800_CONFLICT_DETAIL_FIXES,
  ...INTERWAR_CONFLICT_DETAIL_FIXES,
  ...WWII_1942_CONFLICT_DETAIL_FIXES,
  ...THEATER_CONFLICT_DETAIL_FIXES,
  ...VISIBLE_MODERN_CONFLICT_DETAIL_FIXES,
  ...VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...KOREA_MODERN_CONFLICT_DETAIL_FIXES,
  ...HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES,
  ...POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES,
  ...MODERN_1992_2021_CONFLICT_DETAIL_FIXES,
  ...UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES,
  ...REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES,
  ...WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES
};
const ALL_SAFE_CONFLICT_RENAMES = {
  ...SAFE_CONFLICT_RENAMES,
  ...EXTRA_SAFE_CONFLICT_RENAMES,
  ...EARLY_1800_SAFE_CONFLICT_RENAMES,
  ...MID_1800_SAFE_CONFLICT_RENAMES,
  ...LATE_1800_SAFE_CONFLICT_RENAMES,
  ...INTERWAR_SAFE_CONFLICT_RENAMES,
  ...WWII_1942_SAFE_CONFLICT_RENAMES,
  ...THEATER_SAFE_CONFLICT_RENAMES,
  ...VISIBLE_MODERN_SAFE_CONFLICT_RENAMES,
  ...VISIBLE_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...KOREA_MODERN_SAFE_CONFLICT_RENAMES,
  ...HISTORICAL_VIETNAM_SAFE_CONFLICT_RENAMES,
  ...POSTWAR_1970_1991_SAFE_CONFLICT_RENAMES,
  ...MODERN_1992_2021_SAFE_CONFLICT_RENAMES,
  ...UNDATED_AMERICAS_SAFE_CONFLICT_RENAMES,
  ...REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES,
  ...WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES
};

const ENGLISH_CONFLICT_MARKERS = [
  "war of ",
  "war in ",
  "world war",
  "battle of ",
  "invasion of ",
  "campaign of ",
  "campaign ",
  "siege of ",
  "operation ",
  "raid on ",
  "raid in ",
  "conflict in ",
  "civil war",
  "front in "
];
const ENGLISH_NAME_EXCEPTIONS = new Set([
  "Batalla de Battle Mountain"
]);

export function isConflictAuditFalsePositive(block, name) {
  const set = BLOCK_FALSE_POSITIVES[block];
  return Boolean(set && set.has(name));
}

export function filterAuditConflicts(block, names) {
  return names.filter(name => !isConflictAuditFalsePositive(block, name));
}

export function getConflictNameIssues(name) {
  const text = String(name || "");
  const normalized = text.toLowerCase();
  const issues = [];

  if (/^Q\d+$/i.test(text)) {
    issues.push("technical_identifier");
  }

  if (repairMojibake(text) !== text) {
    issues.push("mojibake");
  }
  if (!ENGLISH_NAME_EXCEPTIONS.has(text) && ENGLISH_CONFLICT_MARKERS.some(marker => normalized.includes(marker))) {
    issues.push("english");
  }
  if (!ENGLISH_NAME_EXCEPTIONS.has(text) && /\b(?:war|battle|siege|campaign|battlefield|theater)\b/i.test(text)) {
    issues.push("english");
  }
  if (/^\d{4}\s+/.test(text)) {
    issues.push("leading_year");
  }
  if (/\s{2,}/.test(text)) {
    issues.push("spacing");
  }

  return [...new Set(issues)];
}

export function getConflictDetailIssues(detail = {}) {
  const issues = [];
  const participants = Array.isArray(detail.participants) ? detail.participants : [];
  const textBlocks = flattenConflictText(detail);

  if (participants.some(item => /^Bando\s+\d+$/i.test(String(item?.side || "").trim()))) {
    issues.push("generic_side");
  }
  if (/\b(?:ver|vease|v[eé]ase)\s+(?:el\s+)?anexo\b/i.test(textBlocks)) {
    issues.push("wiki_residue");
  }
  if (/&&&&|&#\d+;?|&#x[a-f0-9]+;?/i.test(textBlocks)) {
    issues.push("parse_residue");
  }
  if (
    isBattleLike(detail.name || detail.pageTitle, detail.type) &&
    !(detail.parent || detail.campaign || detail.war || (detail.related || []).length)
  ) {
    issues.push("battle_without_parent");
  }

  return issues;
}

function flattenConflictText(value) {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(flattenConflictText).join(" ");
  }
  if (typeof value === "object") {
    return Object.values(value).map(flattenConflictText).join(" ");
  }
  return "";
}

function isBattleLike(name, type) {
  const text = `${name || ""} ${type || ""}`.toLowerCase();
  return /\b(batalla|battle|sitio|siege)\b/.test(text);
}

function asConflictEntry(value) {
  if (!value) {
    return null;
  }
  if (typeof value === "string") {
    return { name: value };
  }
  if (typeof value === "object" && value.name) {
    return value;
  }
  return null;
}

function collectCountryConflictEntries(country) {
  return [
    ...(Array.isArray(country?.conflicts) ? country.conflicts : []),
    ...(Array.isArray(country?.military?.conflicts) ? country.military.conflicts : [])
  ].map(asConflictEntry).filter(Boolean);
}

function getGeneratedConflictMap(generatedDetails) {
  if (!generatedDetails) {
    return {};
  }
  if (generatedDetails.conflicts && typeof generatedDetails.conflicts === "object") {
    return generatedDetails.conflicts;
  }
  return generatedDetails;
}

function getRenamedConflictRecord(name, generatedConflictMap) {
  const renamed = ALL_SAFE_CONFLICT_RENAMES[name] || ALL_SAFE_CONFLICT_RENAMES[cleanConflictLabel(name)];
  return renamed ? generatedConflictMap[renamed] : null;
}

function getCanonicalAuditName(name) {
  const cleanName = cleanConflictLabel(name);
  return applyVisibleStringReplacements(ALL_SAFE_CONFLICT_RENAMES[name] || ALL_SAFE_CONFLICT_RENAMES[cleanName] || cleanName);
}

function getConflictYears(record) {
  const explicitStart = Number.isFinite(record.startYear) ? record.startYear : null;
  const explicitEnd = Number.isFinite(record.endYear) ? record.endYear : null;
  if (explicitStart || explicitEnd) {
    return { startYear: explicitStart, endYear: explicitEnd, ongoing: Boolean(record.ongoing) };
  }

  const semanticText = [
    record.name,
    record.pageTitle,
    record.title,
    record.summary,
    record.description,
    record.parent,
    record.war,
    record.campaign,
    record.cause,
    record.outcome,
    record.consequences,
    record.chronology,
    record.treaties,
    record.related
  ];
  return inferConflictYearsFromText(flattenConflictText(semanticText));
}

const WEAK_DETAIL_MARKERS = [
  "pendiente de curaduria",
  "requiere ampliacion historiografica",
  "disputa militar o politica asociada",
  "impacto militar y politico localizado",
  "actor registrado",
  "oponente o fuerza local documentada",
  "no consolidado en fuentes livianas",
  "cierre o arreglo posterior pendiente",
  "inicio registrado del conflicto o accion militar",
  "cierre registrado de la fase principal",
  "resultado pendiente"
];

function isSubstantiveConflictText(value) {
  const normalized = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  return normalized.length >= 12 && !WEAK_DETAIL_MARKERS.some(marker => normalized.includes(marker));
}

export function hasUsefulDetail(detail) {
  if ([detail?.cause, detail?.outcome, detail?.consequences].some(isSubstantiveConflictText)) {
    return true;
  }
  const participants = Array.isArray(detail?.participants) ? detail.participants : [];
  const chronology = Array.isArray(detail?.chronology) ? detail.chronology : [];
  if (participants.some(item =>
    isSubstantiveConflictText(item?.side)
    && Array.isArray(item?.members)
    && item.members.some(isSubstantiveConflictText)
  )) {
    return true;
  }
  return chronology.some(item =>
    isSubstantiveConflictText(item?.text || item?.event || item?.description)
  );
}

function scoreIssueSet(issues) {
  const weights = {
    duplicate_names: 3,
    english: 3,
    generic_side: 3,
    battle_without_parent: 3,
    weak_detail: 3,
    parse_residue: 2,
    wiki_residue: 2,
    mojibake: 2,
    leading_year: 1,
    spacing: 1
  };
  return [...issues].reduce((sum, issue) => sum + (weights[issue] || 1), 0);
}

export function suggestConflictAutoFix(name) {
  const explicit = ALL_SAFE_CONFLICT_RENAMES[name] || ALL_SAFE_CONFLICT_RENAMES[cleanConflictLabel(name)];
  if (explicit) {
    return explicit;
  }

  const cleaned = cleanConflictLabel(name)
    .replace(/^(\d{4})\s+(.+)$/u, "$2 ($1)")
    .replace(/\bWorld War I\b/gi, "Primera Guerra Mundial")
    .replace(/\bWorld War II\b/gi, "Segunda Guerra Mundial")
    .replace(/\bBattle of\b/gi, "Batalla de")
    .replace(/\bWar of\b/gi, "Guerra de")
    .replace(/\bWar in\b/gi, "Guerra en")
    .replace(/\bCivil War\b/gi, "Guerra civil")
    .replace(/\bInvasion of\b/gi, "Invasion de")
    .replace(/\bCampaign of\b/gi, "Campana de")
    .replace(/\bSiege of\b/gi, "Sitio de")
    .replace(/\bOperation\b/gi, "Operacion")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned && cleaned !== name ? cleaned : null;
}

export function buildConflictAuditReport({ countries = {}, generatedDetails = {}, maxItems = 250 } = {}) {
  const recordsByKey = new Map();
  const generatedConflictMap = getGeneratedConflictMap(generatedDetails);

  function ensureRecord(name) {
    const cleanName = getCanonicalAuditName(name);
    const key = normalizeConflictKey(cleanName);
    if (!key) {
      return null;
    }
    if (!recordsByKey.has(key)) {
      recordsByKey.set(key, {
        key,
        names: new Set(),
        countries: new Set(),
        entries: [],
        details: []
      });
    }
    const record = recordsByKey.get(key);
    record.names.add(cleanName);
    return record;
  }

  for (const [countryCode, country] of Object.entries(countries || {})) {
    for (const entry of collectCountryConflictEntries(country)) {
      const record = ensureRecord(entry.name);
      if (!record) {
        continue;
      }
      record.countries.add(countryCode);
      record.entries.push({ ...entry, countryCode });
    }
  }

  for (const [name, detail] of Object.entries(generatedConflictMap || {})) {
    const record = ensureRecord(name);
    if (!record) {
      continue;
    }
    record.details.push({ name, ...detail });
  }

  for (const [name, detail] of Object.entries(ALL_CURATED_CONFLICT_DETAIL_FIXES)) {
    const record = ensureRecord(name);
    if (!record) {
      continue;
    }
    record.details.push({ name, ...detail });
  }

  const analyzedItems = [...recordsByKey.values()].map(record => {
    const names = [...record.names].sort((a, b) => a.localeCompare(b, "es"));
    const representativeName = names.find(name => !getConflictNameIssues(name).includes("english")) || names[0];
    const issues = new Set();
    const autoFixes = new Set();
    const allDetails = [
      ...record.entries,
      ...record.details,
      ...names.map(name => getRenamedConflictRecord(name, generatedConflictMap)).filter(Boolean)
    ];

    for (const name of names) {
      getConflictNameIssues(name).forEach(issue => issues.add(issue));
      const suggestion = suggestConflictAutoFix(name);
      if (suggestion) {
        autoFixes.add(suggestion);
      }
    }

    if (names.length > 1) {
      issues.add("duplicate_names");
    }

    for (const detail of allDetails) {
      getConflictDetailIssues({ ...detail, name: detail.name || representativeName }).forEach(issue => issues.add(issue));
    }

    if (!allDetails.some(hasUsefulDetail)) {
      issues.add("weak_detail");
    }
    if (allDetails.some(detail => detail?.parent || detail?.campaign || detail?.war)) {
      issues.delete("battle_without_parent");
    }
    if (allDetails.some(hasUsefulDetail)) {
      issues.delete("weak_detail");
    }

    const parentLabels = allDetails.map(detail => detail?.parent || detail?.war || "").filter(Boolean);
    const campaignLabels = allDetails.map(detail => detail?.campaign || "").filter(Boolean);
    const specificParent = parentLabels.find(parent => !isProvisionalConflictHierarchy({ parent })) || "";
    const provisionalParent = parentLabels.find(parent => isProvisionalConflictHierarchy({ parent })) || "";
    const specificCampaign = campaignLabels.find(campaign => !isProvisionalConflictHierarchy({ campaign })) || "";
    const provisionalCampaign = campaignLabels.find(campaign => isProvisionalConflictHierarchy({ campaign })) || "";
    const provisionalHierarchy = Boolean(
      (provisionalParent && !specificParent)
      || (provisionalCampaign && !specificCampaign)
    );

    const yearSource = record.details.find(item =>
      item?.hierarchySources?.length && (Number.isFinite(item.startYear) || Number.isFinite(item.endYear))
    ) || record.details.find(item => Number.isFinite(item.startYear) || Number.isFinite(item.endYear))
      || record.entries.find(item => Number.isFinite(item.startYear) || Number.isFinite(item.endYear))
      || allDetails[0]
      || {};
    const years = getConflictYears(yearSource);
    const issueList = [...issues].sort();

    return {
      key: record.key,
      name: representativeName,
      names,
      countries: [...record.countries].sort(),
      startYear: years.startYear,
      endYear: years.endYear,
      ongoing: years.ongoing,
      provisionalHierarchy,
      hierarchyLabel: specificParent || provisionalParent || specificCampaign || provisionalCampaign || "",
      issues: issueList,
      severity: scoreIssueSet(issueList),
      autoFixes: [...autoFixes].sort()
    };
  });

  const items = analyzedItems.filter(item => item.issues.length);
  const provisionalItems = analyzedItems
    .filter(item => item.provisionalHierarchy)
    .map(item => ({
      key: item.key,
      name: item.name,
      countries: item.countries,
      startYear: item.startYear,
      endYear: item.endYear,
      hierarchyLabel: item.hierarchyLabel,
      issues: ["provisional_parent"],
      severity: 1
    }))
    .sort((a, b) =>
      (b.countries?.length || 0) - (a.countries?.length || 0)
      || (a.startYear ?? 9999) - (b.startYear ?? 9999)
      || a.name.localeCompare(b.name, "es")
    );

  items.sort((a, b) =>
    b.severity - a.severity ||
    (a.startYear ?? 9999) - (b.startYear ?? 9999) ||
    a.name.localeCompare(b.name, "es")
  );

  const summary = items.reduce((acc, item) => {
    for (const issue of item.issues) {
      acc[issue] = (acc[issue] || 0) + 1;
    }
    return acc;
  }, {});
  summary.provisional_parent = provisionalItems.length;
  const reviewCount = analyzedItems.filter(item => item.issues.length || item.provisionalHierarchy).length;

  return {
    generatedAt: new Date().toISOString(),
    scannedConflicts: recordsByKey.size,
    issueCount: items.length,
    advisoryCount: provisionalItems.length,
    reviewCount,
    summary,
    topIssues: items.slice(0, maxItems),
    topAdvisories: provisionalItems.slice(0, Math.min(maxItems, 80))
  };
}
