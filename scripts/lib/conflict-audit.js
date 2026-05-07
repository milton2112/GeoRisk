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

import { cleanConflictLabel, inferConflictYearsFromText, normalizeConflictKey } from "./conflict-cleaning.js";
import { CURATED_CONFLICT_DETAIL_FIXES, SAFE_CONFLICT_RENAMES } from "./conflict-autofix-rules.js";
import { EXTRA_CURATED_CONFLICT_DETAIL_FIXES, EXTRA_SAFE_CONFLICT_RENAMES } from "./conflict-curation-extra.js";

const ALL_CURATED_CONFLICT_DETAIL_FIXES = {
  ...CURATED_CONFLICT_DETAIL_FIXES,
  ...EXTRA_CURATED_CONFLICT_DETAIL_FIXES
};
const ALL_SAFE_CONFLICT_RENAMES = {
  ...SAFE_CONFLICT_RENAMES,
  ...EXTRA_SAFE_CONFLICT_RENAMES
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

  if (/[ÃÂ]/.test(text)) {
    issues.push("mojibake");
  }

  if (/[ÃÂâ€]/.test(text)) {
    issues.push("mojibake");
  }
  if (ENGLISH_CONFLICT_MARKERS.some(marker => normalized.includes(marker))) {
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

function getConflictYears(record) {
  const explicitStart = Number.isFinite(record.startYear) ? record.startYear : null;
  const explicitEnd = Number.isFinite(record.endYear) ? record.endYear : null;
  if (explicitStart || explicitEnd) {
    return { startYear: explicitStart, endYear: explicitEnd, ongoing: Boolean(record.ongoing) };
  }
  return inferConflictYearsFromText(flattenConflictText(record));
}

function hasUsefulDetail(detail) {
  return Boolean(
    detail?.cause ||
    detail?.outcome ||
    detail?.consequences ||
    (Array.isArray(detail?.participants) && detail.participants.length) ||
    (Array.isArray(detail?.chronology) && detail.chronology.length)
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
    const cleanName = cleanConflictLabel(name);
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

  const items = [...recordsByKey.values()].map(record => {
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

    const years = getConflictYears(allDetails.find(item => item.startYear || item.endYear) || allDetails[0] || {});
    const issueList = [...issues].sort();

    return {
      key: record.key,
      name: representativeName,
      names,
      countries: [...record.countries].sort(),
      startYear: years.startYear,
      endYear: years.endYear,
      ongoing: years.ongoing,
      issues: issueList,
      severity: scoreIssueSet(issueList),
      autoFixes: [...autoFixes].sort()
    };
  }).filter(item => item.issues.length);

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

  return {
    generatedAt: new Date().toISOString(),
    scannedConflicts: recordsByKey.size,
    issueCount: items.length,
    summary,
    topIssues: items.slice(0, maxItems)
  };
}
