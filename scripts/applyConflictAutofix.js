import fs from "fs-extra";
import path from "node:path";
import { SAFE_CONFLICT_RENAMES, CURATED_CONFLICT_DETAIL_FIXES } from "./lib/conflict-autofix-rules.js";
import { EXTRA_CURATED_CONFLICT_DETAIL_FIXES, EXTRA_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-extra.js";
import { US_REVOLUTION_CONFLICT_DETAIL_FIXES } from "./lib/conflict-curation-us-revolution.js";
import { EARLY_1800_CONFLICT_DETAIL_FIXES, EARLY_1800_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-early-1800.js";
import { MID_1800_CONFLICT_DETAIL_FIXES, MID_1800_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-1847-1864.js";
import { LATE_1800_CONFLICT_DETAIL_FIXES, LATE_1800_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-1877-1914.js";
import { INTERWAR_CONFLICT_DETAIL_FIXES, INTERWAR_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-1919-1941.js";
import { WWII_1942_CONFLICT_DETAIL_FIXES, WWII_1942_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-1942.js";
import {
  getContextualConflictName,
  THEATER_CONFLICT_DETAIL_FIXES,
  THEATER_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-theater.js";
import {
  VISIBLE_MODERN_CONFLICT_DETAIL_FIXES,
  VISIBLE_MODERN_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-visible-modern.js";
import {
  VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  VISIBLE_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-visible-followup.js";
import {
  KOREA_MODERN_CONFLICT_DETAIL_FIXES,
  KOREA_MODERN_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-korea-modern.js";
import {
  HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES,
  HISTORICAL_VIETNAM_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-historical-vietnam.js";
import {
  POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES,
  POSTWAR_1970_1991_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-1970-1991.js";
import {
  MODERN_1992_2021_CONFLICT_DETAIL_FIXES,
  MODERN_1992_2021_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-1992-2021.js";
import {
  UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES,
  UNDATED_AMERICAS_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-undated-americas.js";
import {
  REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-revolution-followup.js";
import {
  TRANSITION_1846_1902_COUNTRY_CONFLICT_ADDITIONS,
  TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES,
  TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-1846-1902.js";
import {
  WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-war-1812-followup.js";
import {
  US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-civil-war-followup.js";
import {
  US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-wwii-followup.js";
import {
  US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-indian-wars-followup.js";
import {
  BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-british-wwii-followup.js";
import {
  US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-overseas-followup.js";
import {
  ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ACTIVE_AFRICA_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-active-africa-followup.js";
import { collectConflictCountryNames, curateConflictDetail, curateConflictEntry } from "./lib/conflict-batch-curation.js";
import {
  cleanConflictLabel,
  isProvisionalConflictHierarchy,
  mergeConflictEntries,
  normalizeConflictKey
} from "./lib/conflict-cleaning.js";
import { normalizeVisibleValue } from "./lib/visible-data-corrections.js";
import {
  areJsonValuesEquivalent,
  readJsonWithRetry,
  writeJsonIfChanged,
  writeJsonWithRetry
} from "./lib/resilient-fs.js";

const projectRoot = path.resolve(process.cwd());
const fullPath = path.join(projectRoot, "data", "countries_full.json");
const generatedDetailsPath = path.join(projectRoot, "data", "conflict_details.generated.json");
const reportPath = path.join(projectRoot, "reports", "conflict-autofix-applied.json");
const curatedConflictDetailFixes = {
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
  ...BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES
};
const safeConflictRenames = {
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
  ...BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...ACTIVE_AFRICA_FOLLOWUP_SAFE_CONFLICT_RENAMES
};

function renameConflictName(name) {
  const cleanName = cleanConflictLabel(name);
  return safeConflictRenames[cleanName] || safeConflictRenames[name] || cleanName;
}

function isBattleLike(entry) {
  return /\b(batalla|battle|sitio|siege)\b/i.test(`${entry?.name || ""} ${entry?.type || ""}`);
}

function getConflictYear(entry) {
  if (Number.isFinite(entry?.startYear)) {
    return entry.startYear;
  }
  const match = String(entry?.name || "").match(/\b(1[4-9]\d{2}|20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

function inferWorldWarBattleCuration(entry) {
  if (!entry || !isBattleLike(entry)) {
    return null;
  }

  const year = getConflictYear(entry);
  const hasParent = entry.parent || entry.war || entry.campaign || (Array.isArray(entry.related) && entry.related.length);
  const hasUsefulDetail = entry.cause || entry.outcome || entry.consequences || (Array.isArray(entry.participants) && entry.participants.length);

  if (year >= 1914 && year <= 1918) {
    return {
      parent: entry.parent || entry.war || "Primera Guerra Mundial",
      type: entry.type || (String(entry.name || "").toLowerCase().includes("sitio") ? "sitio" : "batalla"),
      scope: entry.scope || "internacional",
      region: entry.region || "Europa y teatros asociados de la Primera Guerra Mundial",
      related: [...new Set([...(entry.related || []), "Primera Guerra Mundial"].filter(Boolean))],
      ...(hasUsefulDetail ? {} : {
        cause: "Operacion militar dentro de la Primera Guerra Mundial, vinculada a la disputa de posiciones estrategicas entre los bloques beligerantes.",
        outcome: "Resultado tactico integrado en el desarrollo general del frente correspondiente.",
        consequences: "Contribuyo al desgaste militar y a la evolucion operacional de la Primera Guerra Mundial.",
        participants: [
          { side: "Aliados", members: ["Aliados de la Primera Guerra Mundial"], organizations: ["Aliados"], troops: "fuerzas variables segun el frente", casualties: "significativas o inciertas" },
          { side: "Potencias Centrales", members: ["Potencias Centrales"], organizations: ["Potencias Centrales"], troops: "fuerzas variables segun el frente", casualties: "significativas o inciertas" }
        ]
      })
    };
  }

  if (year >= 1939 && year <= 1945) {
    return {
      parent: entry.parent || entry.war || "Segunda Guerra Mundial",
      type: entry.type || (String(entry.name || "").toLowerCase().includes("sitio") ? "sitio" : "batalla"),
      scope: entry.scope || "mundial",
      region: entry.region || "Teatro de operaciones de la Segunda Guerra Mundial",
      related: [...new Set([...(entry.related || []), "Segunda Guerra Mundial"].filter(Boolean))],
      ...(hasUsefulDetail ? {} : {
        cause: "Operacion militar dentro de la Segunda Guerra Mundial, ligada al control de posiciones, rutas o territorios estrategicos.",
        outcome: "Resultado tactico integrado en la campana correspondiente de la Segunda Guerra Mundial.",
        consequences: "Influyo en el avance, desgaste o reordenamiento operacional de las fuerzas beligerantes.",
        participants: [
          { side: "Aliados", members: ["Aliados de la Segunda Guerra Mundial"], organizations: ["Aliados"], troops: "fuerzas variables segun la campana", casualties: "significativas o inciertas" },
          { side: "Eje", members: ["Potencias del Eje"], organizations: ["Eje"], troops: "fuerzas variables segun la campana", casualties: "significativas o inciertas" }
        ]
      })
    };
  }

  return null;
}

function formatParticipantSide(participant, index) {
  const members = Array.isArray(participant?.members) ? participant.members.filter(Boolean) : [];
  const organizations = Array.isArray(participant?.organizations) ? participant.organizations.filter(Boolean) : [];
  const source = members.length ? members : organizations;

  if (source.length) {
    const label = source.slice(0, 3).join(", ");
    return source.length > 3 ? `${label} y aliados` : label;
  }

  return index === 0 ? "Parte beligerante principal" : `Parte beligerante ${index + 1}`;
}

function normalizeParticipantSides(detail) {
  if (!Array.isArray(detail?.participants)) {
    return detail;
  }

  return {
    ...detail,
    participants: detail.participants.map((participant, index) => {
      if (!/^Bando\s+\d+$/i.test(String(participant?.side || "").trim())) {
        return participant;
      }
      return {
        ...participant,
        side: formatParticipantSide(participant, index)
      };
    })
  };
}

function normalizeConflictEntry(entry) {
  return normalizeConflictEntryWithContext(entry, {});
}

function buildGeneratedHierarchyMap(generatedDetails = {}) {
  const conflicts = generatedDetails.conflicts || generatedDetails;
  const map = new Map();
  for (const [rawName, detail] of Object.entries(conflicts || {})) {
    const parent = detail?.parent || detail?.war || "";
    const campaign = detail?.campaign || "";
    const specificParent = parent && !isProvisionalConflictHierarchy({ parent }) ? parent : "";
    const specificCampaign = campaign && !isProvisionalConflictHierarchy({ campaign }) ? campaign : "";
    if (!specificParent && !specificCampaign) continue;
    map.set(normalizeConflictKey(renameConflictName(detail?.pageTitle || rawName)), {
      ...(specificParent ? { parent: specificParent, war: specificParent } : {}),
      ...(specificCampaign ? { campaign: specificCampaign } : {})
    });
  }
  return map;
}

function getGeneratedHierarchyPatch(entry = {}, generatedHierarchyByConflict = new Map()) {
  const imported = generatedHierarchyByConflict.get(normalizeConflictKey(entry.name));
  if (!imported) return {};
  const currentParent = entry.parent || entry.war || "";
  const currentCampaign = entry.campaign || "";
  const patch = {};
  if ((!currentParent || isProvisionalConflictHierarchy({ parent: currentParent })) && imported.parent) {
    patch.parent = imported.parent;
    patch.war = imported.war || imported.parent;
  }
  if ((!currentCampaign || isProvisionalConflictHierarchy({ campaign: currentCampaign })) && imported.campaign) {
    patch.campaign = imported.campaign;
  }
  return patch;
}

function normalizeConflictEntryWithContext(entry, context) {
  if (!entry || typeof entry !== "object") {
    return entry;
  }
  const renamedEntry = {
    ...entry,
    name: renameConflictName(entry.name)
  };
  renamedEntry.name = getContextualConflictName(renamedEntry);
  const inferredCuration = inferWorldWarBattleCuration(renamedEntry);
  const importedHierarchy = getGeneratedHierarchyPatch(renamedEntry, context.generatedHierarchyByConflict);
  const curatedDetailFix = curatedConflictDetailFixes[renamedEntry.name] || {};
  const curatedEntry = {
    ...renamedEntry,
    ...(inferredCuration || {}),
    ...importedHierarchy,
    ...curatedDetailFix
  };
  return normalizeVisibleValue(curateConflictEntry(curatedEntry, context));
}

function getCountryConflictAdditions(country) {
  return (TRANSITION_1846_1902_COUNTRY_CONFLICT_ADDITIONS[country?.name] || [])
    .map(name => ({ name, ...(curatedConflictDetailFixes[name] || {}) }));
}

function fixCountryConflicts(country, countriesByConflict, generatedHierarchyByConflict) {
  let changed = 0;
  const context = { country, countriesByConflict, generatedHierarchyByConflict };
  const additions = getCountryConflictAdditions(country);

  for (const pathKey of ["conflicts"]) {
    if (!Array.isArray(country[pathKey])) {
      continue;
    }
    const before = country[pathKey];
    const updated = normalizeVisibleValue(
      mergeConflictEntries([...before, ...additions].map(entry => normalizeConflictEntryWithContext(entry, context)))
        .sort((a, b) => (a.startYear ?? 99999) - (b.startYear ?? 99999) || String(a.name).localeCompare(String(b.name), "es"))
    );
    if (!areJsonValuesEquivalent(updated, before)) {
      country[pathKey] = updated;
      changed += 1;
    }
  }

  if (Array.isArray(country.military?.conflicts)) {
    const before = country.military.conflicts;
    const updated = normalizeVisibleValue(
      mergeConflictEntries([...before, ...additions].map(entry => normalizeConflictEntryWithContext(entry, context)))
        .sort((a, b) => (a.startYear ?? 99999) - (b.startYear ?? 99999) || String(a.name).localeCompare(String(b.name), "es"))
    );
    if (!areJsonValuesEquivalent(updated, before)) {
      country.military.conflicts = updated;
      changed += 1;
    }
  }

  return changed;
}

async function fixCountriesFile(filePath, countriesByConflict, generatedHierarchyByConflict) {
  const data = await readJsonWithRetry(filePath);
  let changedCountries = 0;

  if (data.name) {
    changedCountries += fixCountryConflicts(data, countriesByConflict, generatedHierarchyByConflict) ? 1 : 0;
  } else {
    for (const country of Object.values(data)) {
      changedCountries += fixCountryConflicts(country, countriesByConflict, generatedHierarchyByConflict) ? 1 : 0;
    }
  }

  if (changedCountries) {
    await writeJsonIfChanged(filePath, data, { spaces: 0 });
  }

  return changedCountries;
}

async function fixGeneratedDetails(countriesByConflict) {
  const generated = await readJsonWithRetry(generatedDetailsPath);
  const currentText = await fs.readFile(generatedDetailsPath, "utf8");
  const conflicts = generated.conflicts || generated;
  let renamed = 0;
  let enriched = 0;
  let changed = false;

  for (const [from, to] of Object.entries(safeConflictRenames)) {
    if (from !== to && conflicts[from]) {
      const merged = {
        ...(conflicts[from] || {}),
        ...(conflicts[to] || {}),
        pageTitle: to
      };
      if (!areJsonValuesEquivalent(conflicts[to], merged)) {
        conflicts[to] = merged;
      }
      delete conflicts[from];
      renamed += 1;
      changed = true;
    }
  }

  for (const [rawName, detail] of Object.entries(curatedConflictDetailFixes)) {
    const name = getContextualConflictName({ name: renameConflictName(rawName), ...detail });
    const current = conflicts[name] || {};
    const updated = normalizeVisibleValue({
      ...current,
      ...detail,
      source: current.source || "Curaduria GeoRisk",
      pageTitle: name
    });
    if (!areJsonValuesEquivalent(current, updated)) {
      conflicts[name] = updated;
      enriched += 1;
      changed = true;
    }
    if (rawName !== name && conflicts[rawName]) {
      delete conflicts[rawName];
      renamed += 1;
      changed = true;
    }
  }

  for (const [name, detail] of Object.entries(conflicts)) {
    const curated = curateConflictDetail(name, normalizeParticipantSides(detail), { countriesByConflict });
    const finalName = renameConflictName(curated.name);
    const normalized = normalizeVisibleValue({ ...curated, name: undefined });
    delete normalized.name;
    if (finalName !== name) {
      const updated = normalizeVisibleValue({
        ...(conflicts[finalName] || {}),
        ...normalized,
        pageTitle: finalName
      });
      if (!areJsonValuesEquivalent(conflicts[finalName], updated)) {
        conflicts[finalName] = updated;
      }
      delete conflicts[name];
      renamed += 1;
      enriched += 1;
      changed = true;
    } else if (!areJsonValuesEquivalent(normalized, detail)) {
      conflicts[name] = normalized;
      enriched += 1;
      changed = true;
    }
  }

  const written = changed
    ? await writeJsonIfChanged(generatedDetailsPath, generated, { spaces: 0 })
    : false;
  const compacted = !written && currentText.trimEnd().includes("\n");
  if (compacted) {
    await writeJsonWithRetry(generatedDetailsPath, generated, { spaces: 0 });
  }
  return written
    ? { renamed, enriched, written, compacted: false }
    : { renamed: 0, enriched: 0, written, compacted };
}

let changedFullCountries = 0;
let countriesByConflict = new Map();
const generatedHierarchyByConflict = buildGeneratedHierarchyMap(await readJsonWithRetry(generatedDetailsPath));
const fullPassChanges = [];
for (let pass = 0; pass < 8; pass += 1) {
  const fullCountries = await readJsonWithRetry(fullPath);
  countriesByConflict = collectConflictCountryNames(fullCountries);
  const changedThisPass = await fixCountriesFile(fullPath, countriesByConflict, generatedHierarchyByConflict);
  fullPassChanges.push(changedThisPass);
  changedFullCountries += changedThisPass;
  if (!changedThisPass) break;
}
if (fullPassChanges.at(-1) !== 0) {
  throw new Error(`La curaduria de countries_full no convergio: ${fullPassChanges.join(", ")}`);
}
countriesByConflict = collectConflictCountryNames(await readJsonWithRetry(fullPath));
const detailStats = await fixGeneratedDetails(countriesByConflict);

const report = {
  generatedAt: new Date().toISOString(),
  changedFullCountries,
  fullPassChanges,
  compactCountryFilesStrategy: "regenerated-by-buildDataIndexes",
  detailStats,
  generatedHierarchyCandidates: generatedHierarchyByConflict.size,
  countryConflictAdditions: TRANSITION_1846_1902_COUNTRY_CONFLICT_ADDITIONS,
  safeRenames: safeConflictRenames,
  curatedDetails: [...new Set(Object.keys(curatedConflictDetailFixes).map(renameConflictName))]
};

await fs.ensureDir(path.dirname(reportPath));
await writeJsonWithRetry(reportPath, report, { spaces: 2 });

console.log(`Paises actualizados en countries_full: ${changedFullCountries}`);
console.log("Fichas compactas: se regeneran una sola vez con build:indexes");
console.log(`Detalles renombrados: ${detailStats.renamed}`);
console.log(`Detalles enriquecidos: ${detailStats.enriched}`);
console.log(`Reporte: ${path.relative(projectRoot, reportPath)}`);
