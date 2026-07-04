import fs from "fs-extra";
import path from "node:path";
import { writeJsonWithRetry } from "./lib/resilient-fs.js";

const projectRoot = path.resolve(process.cwd());
const reportsDir = path.join(projectRoot, "reports");
const reportPath = path.join(reportsDir, "data-automation-audit.json");

function normalizeText(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function sample(items, max = 40) {
  return items.slice(0, max);
}

function looksLikeUppercaseName(name) {
  const value = String(name || "").trim();
  const letters = value.replace(/[^\p{L}]/gu, "");
  const asciiLetters = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "");
  if (letters.length < 4 || asciiLetters.length < 4) return false;
  return letters === letters.toLocaleUpperCase("es") && /[A-Z]{3}/.test(asciiLetters);
}

async function readJsonIfExists(relativePath, fallback) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!(await fs.pathExists(absolutePath))) return fallback;
  return fs.readJson(absolutePath);
}

const countries = await readJsonIfExists("data/countries_full.json", {});
const weights = await readJsonIfExists("data/country_weights.json", { countries: [] });

const englishConflictPattern = /\b(war|battle|campaign|operation|invasion|bombing|bombings|attacks|emergency|border conflict|counteroffensive|uprising|rebellion|skirmish|siege|capture|incident|clash|offensive|phase|against|landings|landing|disaster|blitz|ambush|massacre|steamboat|combat)\b/i;
const englishConflictExceptionPattern = /\b(Batalla de Battle Mountain|Batalla de Kemp's Landing)\b/i;
const lowLevelUndatedConflictPattern = /\b(batalla|batallas|combate|combat|sitio|asedio|escaramuza|captura|incidente|acci[oó]n|operaci[oó]n|incursi[oó]n|expedici[oó]n|desembarco|desembarcos|landing|landings|choque|ofensiva|bombardeo|bombardeos|ataque|ataques|asalto|emboscada|ambush|masacre|massacre|hundimiento|bloqueo|desastre|disaster|blitz)\b/i;
const mojibakePattern = /[\u00c2\u00c3\uFFFD]|Ã|â€™|â€œ|â€|�|\u00c5[\u0080-\u00bf\u2018]/;
const suspectRegionNamePattern = /Afganist|Irak|Estado Isl|Siria|Kivu|Kosovo|Vietnam|Corea|Sa(?:'|\u2019)?dah|Pakist|Cachemira|Gaza|Israel|Iran|Irano|Kachin|Laos|Tailandia|Camerun|Camer\u00fan/i;
const suspectRegionPattern = /Oceania|America del Sur|Europa occidental|Africa occidental|Europa$|America$/i;
const sourceMojibakePattern = /Ã|Â|â€|�|ï¿½/;
const redundantReligionBranches = new Set([
  "cristianos protestantes",
  "cristianos evangelicos",
  "evangelicos",
  "otros cristianos",
  "protestantes",
  "protestantismo"
]);

const allConflicts = Object.entries(countries).flatMap(([code, country]) =>
  asArray(country.military?.conflicts).map(conflict => ({ code, ...conflict }))
);

async function collectSourceTextMojibake() {
  const targets = ["scripts/buildDataset.js"];
  const issues = [];
  for (const relativePath of targets) {
    const absolutePath = path.join(projectRoot, relativePath);
    if (!(await fs.pathExists(absolutePath))) continue;
    const lines = (await fs.readFile(absolutePath, "utf8")).split(/\r?\n/);
    lines.forEach((line, index) => {
      if (sourceMojibakePattern.test(line)) {
        issues.push({
          file: relativePath,
          line: index + 1,
          value: line.trim().slice(0, 180)
        });
      }
    });
  }
  return issues;
}

const conflictNameBuckets = new Map();
for (const conflict of allConflicts) {
  const key = normalizeText(conflict.name || "");
  if (!key) continue;
  const entry = conflictNameBuckets.get(key) || {
    name: conflict.name,
    count: 0,
    countries: new Set()
  };
  entry.count += 1;
  entry.countries.add(conflict.code);
  conflictNameBuckets.set(key, entry);
}

const englishConflictNames = allConflicts
  .filter(conflict =>
    englishConflictPattern.test(conflict.name || "") &&
    !englishConflictExceptionPattern.test(conflict.name || "")
  )
  .map(conflict => ({ code: conflict.code, name: conflict.name }));

const undatedConflicts = allConflicts
  .filter(conflict => !Number.isFinite(conflict.startYear))
  .map(conflict => ({ code: conflict.code, name: conflict.name, region: conflict.normalizedRegion || conflict.region || null }));

const undatedHighLevelConflicts = allConflicts
  .filter(conflict =>
    !Number.isFinite(conflict.startYear) &&
    !lowLevelUndatedConflictPattern.test(conflict.name || "")
  )
  .map(conflict => ({ code: conflict.code, name: conflict.name, region: conflict.normalizedRegion || conflict.region || null }));

const suspectRegions = allConflicts
  .filter(conflict =>
    suspectRegionNamePattern.test(conflict.name || "") &&
    suspectRegionPattern.test(conflict.normalizedRegion || conflict.region || "")
  )
  .map(conflict => ({
    code: conflict.code,
    name: conflict.name,
    region: conflict.normalizedRegion || conflict.region || null
  }));

const duplicateConflictNames = [...conflictNameBuckets.values()]
  .filter(entry => entry.count > 1)
  .map(entry => ({ name: entry.name, count: entry.count, countries: [...entry.countries].sort() }));

const sameCountryDuplicateConflicts = duplicateConflictNames
  .filter(entry => entry.count > entry.countries.length)
  .map(entry => ({
    name: entry.name,
    count: entry.count,
    countries: entry.countries
  }));

const redundantReligions = Object.entries(countries).flatMap(([code, country]) =>
  asArray(country.religion?.composition)
    .filter(entry => redundantReligionBranches.has(normalizeText(entry?.name)))
    .map(entry => ({ code, label: entry.name }))
);

const uppercaseCities = Object.entries(countries).flatMap(([code, country]) =>
  [...asArray(country.general?.cities), ...asArray(country.general?.capitals)]
    .map(city => ({ code, name: typeof city === "string" ? city : city?.name || "" }))
    .filter(city => looksLikeUppercaseName(city.name))
);

const mojibakeText = Object.entries(countries).flatMap(([code, country]) => {
  const matches = [];
  function visit(value, pathParts = []) {
    if (matches.length >= 12) return;
    if (typeof value === "string") {
      if (mojibakePattern.test(value)) {
        matches.push({ code, path: pathParts.join("."), value });
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, pathParts.concat(String(index))));
      return;
    }
    if (value && typeof value === "object") {
      Object.entries(value).forEach(([key, item]) => visit(item, pathParts.concat(key)));
    }
  }
  visit(country);
  return matches;
});

const sourceTextMojibake = await collectSourceTextMojibake();

const weakDataProfiles = Object.entries(countries).flatMap(([code, country]) => {
  const quality = country.metadata?.quality || {};
  const weakSections = Object.entries(quality.sectionStatus || {})
    .filter(([, status]) => ["base", "mixed"].includes(status))
    .map(([section, status]) => ({ section, status }));
  return weakSections.length || Number(quality.score || 0) < 85
    ? [{ code, score: quality.score ?? null, status: quality.status || null, weakSections }]
    : [];
});

const largeCountries = asArray(weights.countries || weights.items)
  .filter(item => item.tooLarge || item.bytes > (weights.summary?.thresholdBytes || 42000))
  .map(item => ({
    code: item.code,
    bytes: item.bytes,
    human: item.human || null,
    metrics: item.metrics || null
  }));

const sections = {
  englishConflictNames,
  undatedConflicts,
  undatedHighLevelConflicts,
  suspectRegions,
  duplicateConflictNames,
  sameCountryDuplicateConflicts,
  redundantReligions,
  uppercaseCities,
  mojibakeText,
  sourceTextMojibake,
  largeCountries,
  weakDataProfiles
};

const actionPlan = [
  {
    priority: "alta",
    title: "Corregir texto visible roto, fuente corrupta o en ingles",
    count: englishConflictNames.length + mojibakeText.length + sourceTextMojibake.length + uppercaseCities.length,
    command: "npm run fix:source-text && npm run fix:data-visible && npm run build:indexes && npm run audit:data"
  },
  {
    priority: "media",
    title: "Curar conflictos relevantes sin fecha",
    count: undatedHighLevelConflicts.length,
    command: "npm run fix:conflicts:batches"
  },
  {
    priority: "media",
    title: "Revisar duplicados dentro del mismo pais",
    count: sameCountryDuplicateConflicts.length,
    command: "npm run audit:data"
  },
  {
    priority: "baja",
    title: "Reducir fichas pesadas",
    count: largeCountries.length,
    command: "npm run build:indexes && npm run measure:startup"
  }
].filter(item => item.count > 0);

const report = {
  generatedAt: new Date().toISOString(),
  summary: Object.fromEntries(
    Object.entries(sections).map(([key, items]) => [key, { count: items.length }])
  ),
  samples: Object.fromEntries(
    Object.entries(sections).map(([key, items]) => [key, sample(items)])
  ),
  actionPlan,
  notes: [
    "Este reporte es diagnostico y no reemplaza validate:data ni los tests estrictos.",
    "Los duplicados de conflictos pueden ser esperados cuando varios paises participan del mismo conflicto.",
    "undatedHighLevelConflicts y sameCountryDuplicateConflicts son las listas mas accionables."
  ]
};

await fs.ensureDir(reportsDir);
await writeJsonWithRetry(reportPath, report, { spaces: 2 });

console.log(`Auditoria de datos programable: ${path.relative(projectRoot, reportPath)}`);
for (const [key, value] of Object.entries(report.summary)) {
  console.log(`${key}: ${value.count}`);
}
