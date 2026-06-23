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
import { collectConflictCountryNames, curateConflictDetail, curateConflictEntry } from "./lib/conflict-batch-curation.js";
import { cleanConflictLabel, mergeConflictEntries } from "./lib/conflict-cleaning.js";

const projectRoot = path.resolve(process.cwd());
const fullPath = path.join(projectRoot, "data", "countries_full.json");
const countriesDir = path.join(projectRoot, "data", "countries");
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
  ...THEATER_CONFLICT_DETAIL_FIXES
};
const safeConflictRenames = {
  ...SAFE_CONFLICT_RENAMES,
  ...EXTRA_SAFE_CONFLICT_RENAMES,
  ...EARLY_1800_SAFE_CONFLICT_RENAMES,
  ...MID_1800_SAFE_CONFLICT_RENAMES,
  ...LATE_1800_SAFE_CONFLICT_RENAMES,
  ...INTERWAR_SAFE_CONFLICT_RENAMES,
  ...WWII_1942_SAFE_CONFLICT_RENAMES,
  ...THEATER_SAFE_CONFLICT_RENAMES
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
  const curatedDetailFix = curatedConflictDetailFixes[renamedEntry.name] || {};
  const curatedEntry = {
    ...renamedEntry,
    ...(inferredCuration || {}),
    ...curatedDetailFix
  };
  return curateConflictEntry(curatedEntry, context);
}

function fixCountryConflicts(country, countriesByConflict) {
  let changed = 0;
  const context = { country, countriesByConflict };

  for (const pathKey of ["conflicts"]) {
    if (!Array.isArray(country[pathKey])) {
      continue;
    }
    const before = JSON.stringify(country[pathKey]);
    country[pathKey] = mergeConflictEntries(country[pathKey].map(entry => normalizeConflictEntryWithContext(entry, context)))
      .sort((a, b) => (a.startYear ?? 99999) - (b.startYear ?? 99999) || String(a.name).localeCompare(String(b.name), "es"));
    if (JSON.stringify(country[pathKey]) !== before) {
      changed += 1;
    }
  }

  if (Array.isArray(country.military?.conflicts)) {
    const before = JSON.stringify(country.military.conflicts);
    country.military.conflicts = mergeConflictEntries(country.military.conflicts.map(entry => normalizeConflictEntryWithContext(entry, context)))
      .sort((a, b) => (a.startYear ?? 99999) - (b.startYear ?? 99999) || String(a.name).localeCompare(String(b.name), "es"));
    if (JSON.stringify(country.military.conflicts) !== before) {
      changed += 1;
    }
  }

  return changed;
}

async function fixCountriesFile(filePath, countriesByConflict) {
  const data = await fs.readJson(filePath);
  let changedCountries = 0;

  if (data.name) {
    changedCountries += fixCountryConflicts(data, countriesByConflict) ? 1 : 0;
  } else {
    for (const country of Object.values(data)) {
      changedCountries += fixCountryConflicts(country, countriesByConflict) ? 1 : 0;
    }
  }

  if (changedCountries) {
    await fs.writeJson(filePath, data, { spaces: 0 });
  }

  return changedCountries;
}

async function fixGeneratedDetails(countriesByConflict) {
  const generated = await fs.readJson(generatedDetailsPath);
  const conflicts = generated.conflicts || generated;
  let renamed = 0;
  let enriched = 0;

  for (const [from, to] of Object.entries(safeConflictRenames)) {
    if (conflicts[from]) {
      conflicts[to] = {
        ...(conflicts[from] || {}),
        ...(conflicts[to] || {}),
        pageTitle: to
      };
      delete conflicts[from];
      renamed += 1;
    }
  }

  for (const [name, detail] of Object.entries(curatedConflictDetailFixes)) {
    conflicts[name] = {
      ...(conflicts[name] || {}),
      ...detail,
      source: conflicts[name]?.source || "Curaduria GeoRisk",
      pageTitle: conflicts[name]?.pageTitle || name
    };
    enriched += 1;
  }

  for (const [name, detail] of Object.entries(conflicts)) {
    const curated = curateConflictDetail(name, normalizeParticipantSides(detail), { countriesByConflict });
    const finalName = renameConflictName(curated.name);
    const normalized = { ...curated, name: undefined };
    delete normalized.name;
    if (finalName !== name) {
      conflicts[finalName] = {
        ...(conflicts[finalName] || {}),
        ...normalized,
        pageTitle: finalName
      };
      delete conflicts[name];
      enriched += 1;
    } else if (JSON.stringify(normalized) !== JSON.stringify(detail)) {
      conflicts[name] = normalized;
      enriched += 1;
    }
  }

  await fs.writeJson(generatedDetailsPath, generated, { spaces: 2 });
  return { renamed, enriched };
}

let changedFullCountries = 0;
let countriesByConflict = new Map();
for (let pass = 0; pass < 3; pass += 1) {
  const fullCountries = await fs.readJson(fullPath);
  countriesByConflict = collectConflictCountryNames(fullCountries);
  const changedThisPass = await fixCountriesFile(fullPath, countriesByConflict);
  changedFullCountries += changedThisPass;
  if (!changedThisPass) break;
}
countriesByConflict = collectConflictCountryNames(await fs.readJson(fullPath));
let changedCountryFiles = 0;
for (const file of (await fs.readdir(countriesDir)).filter(item => item.endsWith(".json"))) {
  changedCountryFiles += await fixCountriesFile(path.join(countriesDir, file), countriesByConflict);
}
const detailStats = await fixGeneratedDetails(countriesByConflict);

const report = {
  generatedAt: new Date().toISOString(),
  changedFullCountries,
  changedCountryFiles,
  detailStats,
  safeRenames: safeConflictRenames,
  curatedDetails: Object.keys(curatedConflictDetailFixes)
};

await fs.ensureDir(path.dirname(reportPath));
await fs.writeJson(reportPath, report, { spaces: 2 });

console.log(`Paises actualizados en countries_full: ${changedFullCountries}`);
console.log(`Fichas por pais actualizadas: ${changedCountryFiles}`);
console.log(`Detalles renombrados: ${detailStats.renamed}`);
console.log(`Detalles enriquecidos: ${detailStats.enriched}`);
console.log(`Reporte: ${path.relative(projectRoot, reportPath)}`);
