import fs from "fs-extra";
import path from "node:path";
import { SAFE_CONFLICT_RENAMES, CURATED_CONFLICT_DETAIL_FIXES } from "./lib/conflict-autofix-rules.js";
import { EXTRA_CURATED_CONFLICT_DETAIL_FIXES, EXTRA_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-extra.js";
import { cleanConflictLabel, mergeConflictEntries } from "./lib/conflict-cleaning.js";

const projectRoot = path.resolve(process.cwd());
const fullPath = path.join(projectRoot, "data", "countries_full.json");
const countriesDir = path.join(projectRoot, "data", "countries");
const generatedDetailsPath = path.join(projectRoot, "data", "conflict_details.generated.json");
const reportPath = path.join(projectRoot, "reports", "conflict-autofix-applied.json");
const curatedConflictDetailFixes = {
  ...CURATED_CONFLICT_DETAIL_FIXES,
  ...EXTRA_CURATED_CONFLICT_DETAIL_FIXES
};
const safeConflictRenames = {
  ...SAFE_CONFLICT_RENAMES,
  ...EXTRA_SAFE_CONFLICT_RENAMES
};

function renameConflictName(name) {
  const cleanName = cleanConflictLabel(name);
  return safeConflictRenames[cleanName] || safeConflictRenames[name] || cleanName;
}

function normalizeConflictEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return entry;
  }
  return {
    ...entry,
    name: renameConflictName(entry.name)
  };
}

function fixCountryConflicts(country) {
  let changed = 0;

  for (const pathKey of ["conflicts"]) {
    if (!Array.isArray(country[pathKey])) {
      continue;
    }
    const before = JSON.stringify(country[pathKey]);
    country[pathKey] = mergeConflictEntries(country[pathKey].map(normalizeConflictEntry))
      .sort((a, b) => (a.startYear ?? 99999) - (b.startYear ?? 99999) || String(a.name).localeCompare(String(b.name), "es"));
    if (JSON.stringify(country[pathKey]) !== before) {
      changed += 1;
    }
  }

  if (Array.isArray(country.military?.conflicts)) {
    const before = JSON.stringify(country.military.conflicts);
    country.military.conflicts = mergeConflictEntries(country.military.conflicts.map(normalizeConflictEntry))
      .sort((a, b) => (a.startYear ?? 99999) - (b.startYear ?? 99999) || String(a.name).localeCompare(String(b.name), "es"));
    if (JSON.stringify(country.military.conflicts) !== before) {
      changed += 1;
    }
  }

  return changed;
}

async function fixCountriesFile(filePath) {
  const data = await fs.readJson(filePath);
  let changedCountries = 0;

  if (data.name) {
    changedCountries += fixCountryConflicts(data) ? 1 : 0;
  } else {
    for (const country of Object.values(data)) {
      changedCountries += fixCountryConflicts(country) ? 1 : 0;
    }
  }

  if (changedCountries) {
    await fs.writeJson(filePath, data, { spaces: 0 });
  }

  return changedCountries;
}

async function fixGeneratedDetails() {
  const generated = await fs.readJson(generatedDetailsPath);
  const conflicts = generated.conflicts || generated;
  let renamed = 0;
  let enriched = 0;

  for (const [from, to] of Object.entries(safeConflictRenames)) {
    if (conflicts[from] && !conflicts[to]) {
      conflicts[to] = { ...conflicts[from], pageTitle: to };
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

  await fs.writeJson(generatedDetailsPath, generated, { spaces: 2 });
  return { renamed, enriched };
}

const changedFullCountries = await fixCountriesFile(fullPath);
let changedCountryFiles = 0;
for (const file of (await fs.readdir(countriesDir)).filter(item => item.endsWith(".json"))) {
  changedCountryFiles += await fixCountriesFile(path.join(countriesDir, file));
}
const detailStats = await fixGeneratedDetails();

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
