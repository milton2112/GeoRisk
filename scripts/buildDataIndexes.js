import fs from "fs-extra";
import path from "node:path";
import { readJsonWithRetry, statWithRetry, writeJsonWithRetry } from "./lib/resilient-fs.js";
import { buildPublicCountryConflictRecord, buildPublicCountryRecord } from "./lib/public-country-record.js";
import { normalizeVisibleValue } from "./lib/visible-data-corrections.js";

const projectRoot = path.resolve(process.cwd());
const dataDir = path.join(projectRoot, "data");
const reportsDir = path.join(projectRoot, "reports");
const perCountryDir = path.join(dataDir, "countries");
const perCountryConflictsDir = path.join(perCountryDir, "conflicts");
const conflictDetailsDir = path.join(dataDir, "conflicts", "details");

const LARGE_COUNTRY_BYTES = 42000;
const PUBLIC_DATA_FILES = [
  "data/countries_index.json",
  "data/conflicts_index.json",
  "data/timeline_index.json",
  "data/search_index.json",
  "data/country_weights.json",
  "data/conflicts/details_index.json",
  "data/geo_aliases.json",
  "data/world_countries_simplified.geo.json",
  "data/countries/*.json",
  "data/countries/conflicts/*.json"
];
const TECHNICAL_DATA_FILES = [
  "data/countries_full.json",
  "data/conflict_details.generated.json",
  "data/conflict_dyadic_summary.json",
  "data/raw/**",
  "reports/*.json"
];
const EDUCATIONAL_DATA_FILES = [
  "USER_GUIDE.md",
  "TECHNICAL.md",
  "CHANGELOG.md",
  "data/timeline_index.json",
  "data/conflicts_index.json"
];
const INTERNAL_DATA_FILES = [
  "reports/data-curation-audit.json",
  "reports/project-audit.json",
  "reports/conflict-audit.json",
  "reports/startup-assets.json"
];

function normalizeText(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function compactName(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.name || value.label || value.abbreviation || value.code || "";
}

function unique(values) {
  const seen = new Set();
  return values.filter(value => {
    const key = normalizeText(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function minFinite(values) {
  const finite = values.filter(Number.isFinite);
  return finite.length ? Math.min(...finite) : null;
}

function maxFinite(values) {
  const finite = values.filter(Number.isFinite);
  return finite.length ? Math.max(...finite) : null;
}

function compactConflict(conflict = {}, code = "") {
  const name = compactName(conflict);
  if (!name) return null;
  return {
    name,
    country: code,
    startYear: conflict.startYear ?? null,
    endYear: conflict.endYear ?? null,
    ongoing: Boolean(conflict.ongoing),
    region: conflict.region || null,
    type: conflict.conflictType || conflict.type || null,
    intensity: conflict.intensityLevel || conflict.intensity || null
  };
}

function getCountryConflicts(country = {}, code = "") {
  return unique([
    ...normalizeArray(country.military?.conflicts).map(conflict => compactConflict(conflict, code)),
    ...normalizeArray(country.conflicts).map(conflict => compactConflict(conflict, code))
  ].filter(Boolean).map(item => JSON.stringify(item))).map(item => JSON.parse(item));
}

function getTimelineEvents(country = {}, code = "") {
  const base = [];
  if (country.history?.year) {
    base.push({
      country: code,
      year: country.history.year,
      type: country.history.type || "formacion",
      title: country.history.origin || country.name,
      source: "history"
    });
  }
  normalizeArray(country.history?.events).forEach(event => {
    const year = event.year ?? event.startYear ?? null;
    if (!year) return;
    base.push({
      country: code,
      year,
      type: event.type || "evento",
      title: event.title || event.name || event.description || "Evento historico",
      source: "history.events"
    });
  });
  getCountryConflicts(country, code).forEach(conflict => {
    if (!conflict.startYear) return;
    base.push({
      country: code,
      year: conflict.startYear,
      endYear: conflict.endYear,
      type: "conflicto",
      title: conflict.name,
      source: "military.conflicts"
    });
  });
  return base;
}

function buildConflictIndex(countries) {
  const byName = new Map();
  for (const [code, country] of Object.entries(countries)) {
    for (const conflict of getCountryConflicts(country, code)) {
      const key = normalizeText(conflict.name);
      const entry = byName.get(key) || {
        name: conflict.name,
        countries: [],
        startYear: conflict.startYear,
        endYear: conflict.endYear,
        ongoing: false,
        regions: [],
        types: [],
        intensities: []
      };
      entry.countries.push(code);
      entry.startYear = minFinite([entry.startYear, conflict.startYear]);
      entry.endYear = maxFinite([entry.endYear, conflict.endYear]);
      entry.ongoing = entry.ongoing || conflict.ongoing;
      entry.regions = unique([...entry.regions, conflict.region].filter(Boolean));
      entry.types = unique([...entry.types, conflict.type].filter(Boolean));
      entry.intensities = unique([...entry.intensities, conflict.intensity].filter(Boolean));
      byName.set(key, entry);
    }
  }
  const entries = [...byName.values()]
    .map(entry => ({ ...entry, countries: unique(entry.countries).sort() }));
  const undated = entries
    .filter(entry => !Number.isFinite(entry.startYear))
    .map(entry => ({
      name: entry.name,
      countries: entry.countries,
      regions: entry.regions,
      types: entry.types,
      reason: "sin startYear consolidado en fuentes internas"
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
  const dated = entries
    .filter(entry => Number.isFinite(entry.startYear))
    .sort((a, b) => (a.startYear ?? 99999) - (b.startYear ?? 99999) || a.name.localeCompare(b.name, "es"));
  return { dated, undated };
}

function buildTimelineIndex(countries) {
  return Object.entries(countries)
    .flatMap(([code, country]) => getTimelineEvents(country, code))
    .sort((a, b) => (a.year ?? 99999) - (b.year ?? 99999) || a.country.localeCompare(b.country));
}

function buildSearchIndex(countries) {
  return Object.entries(countries).map(([code, country]) => {
    const relations = country.politics?.relations || {};
    const aliases = unique([
      code,
      country.name,
      country.general?.officialName,
      ...normalizeArray(country.general?.historicalNames),
      country.general?.capital?.name,
      ...normalizeArray(country.general?.capitals).map(compactName),
      ...normalizeArray(country.general?.languages).map(compactName),
      country.continent,
      country.politics?.system,
      country.religion?.summary,
      ...normalizeArray(country.politics?.organizations).map(compactName),
      ...normalizeArray(country.politics?.rivals).map(compactName),
      ...normalizeArray(relations.blocs),
      ...normalizeArray(relations.disputedTerritories || relations.disputes),
      ...getCountryConflicts(country, code).slice(0, 8).map(conflict => conflict.name)
    ].filter(Boolean));
    return {
      code,
      name: country.name,
      continent: country.continent || null,
      aliases: aliases.slice(0, 28),
      facets: unique([
        country.politics?.system,
        country.religion?.summary,
        ...normalizeArray(country.general?.languages).map(compactName).slice(0, 4),
        ...normalizeArray(relations.blocs).slice(0, 4)
      ].filter(Boolean)).slice(0, 10),
      metrics: {
        population: country.general?.population || 0,
        conflicts: getCountryConflicts(country, code).length,
        activeConflicts: getCountryConflicts(country, code).filter(conflict => conflict.ongoing).length,
        organizations: normalizeArray(country.politics?.organizations).length,
        military: country.military?.active || country.military?.activePersonnel || 0
      }
    };
  }).sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function slugifyConflictName(name) {
  const slug = normalizeText(name).replace(/\s+/g, "-").slice(0, 90);
  let hash = 0;
  for (const char of String(name || "")) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }
  return `${slug || "conflicto"}-${Math.abs(hash).toString(36)}`;
}

async function buildConflictDetailShards() {
  const sourcePath = path.join(dataDir, "conflict_details.generated.json");
  if (!(await fs.pathExists(sourcePath))) {
    return { generatedAt: new Date().toISOString(), conflicts: [], missingSource: true };
  }
  const source = await readJsonWithRetry(sourcePath);
  const conflicts = source.conflicts || {};
  await fs.emptyDir(conflictDetailsDir);
  const index = [];
  for (const [name, detail] of Object.entries(conflicts)) {
    const normalizedDetail = normalizeVisibleValue({ name, ...detail });
    const normalizedName = normalizedDetail.name || name;
    const file = `${slugifyConflictName(normalizedName)}.json`;
    const relativePath = `data/conflicts/details/${file}`;
    await writeJsonWithRetry(path.join(conflictDetailsDir, file), normalizedDetail, { spaces: 0 });
    index.push({
      name: normalizedName,
      path: relativePath,
      bytes: Buffer.byteLength(JSON.stringify(normalizedDetail)),
      source: normalizedDetail.source || normalizedDetail.wikipedia?.source || "Wikipedia"
    });
  }
  return {
    generatedAt: new Date().toISOString(),
    source: source._meta || null,
    conflicts: index.sort((a, b) => a.name.localeCompare(b.name, "es"))
  };
}

async function buildCountryWeights(countries) {
  const entries = [];
  let duplicatedCountryFilesBytes = 0;
  let countryConflictShardBytes = 0;
  for (const [code, country] of Object.entries(countries)) {
    const countryPath = path.join(perCountryDir, `${code}.json`);
    const conflictShardPath = path.join(perCountryConflictsDir, `${code}.json`);
    const publicRecord = buildPublicCountryRecord(country, code);
    const sectionBytes = Object.fromEntries(
      Object.entries(publicRecord)
        .map(([section, value]) => [section, Buffer.byteLength(JSON.stringify(value))])
        .sort((a, b) => b[1] - a[1])
    );
    const compactConflicts = buildPublicCountryConflictRecord(country);
    const conflictsBytes = Buffer.byteLength(JSON.stringify(compactConflicts));
    const inlineBytes = Buffer.byteLength(JSON.stringify(country));
    const fileBytes = await fs.pathExists(countryPath) ? (await statWithRetry(countryPath)).size : 0;
    const conflictShardBytes = await fs.pathExists(conflictShardPath) ? (await statWithRetry(conflictShardPath)).size : 0;
    const countryConflicts = getCountryConflicts(country, code);
    duplicatedCountryFilesBytes += fileBytes;
    countryConflictShardBytes += conflictShardBytes;
    entries.push({
      code,
      name: country.name,
      bytes: fileBytes || inlineBytes,
      inlineBytes,
      tooLarge: (fileBytes || inlineBytes) > LARGE_COUNTRY_BYTES,
      counts: {
        cities: normalizeArray(country.general?.cities).length,
        capitals: normalizeArray(country.general?.capitals).length,
        languages: normalizeArray(country.general?.languages).length,
        religionGroups: normalizeArray(country.religion?.composition).length,
        organizations: normalizeArray(country.politics?.organizations).length,
        rivals: normalizeArray(country.politics?.rivals).length,
        conflicts: countryConflicts.length,
        timelineEvents: normalizeArray(country.history?.events).length
      },
      metrics: {
        sectionBytes,
        largestSections: Object.entries(sectionBytes).slice(0, 4).map(([section, bytes]) => ({ section, bytes })),
        conflictsBytes,
        conflictShardBytes,
        averageConflictBytes: compactConflicts.length ? Math.round(conflictsBytes / compactConflicts.length) : 0
      }
    });
  }
  const fullBytes = (await statWithRetry(path.join(dataDir, "countries_full.json"))).size;
  return {
    generatedAt: new Date().toISOString(),
    thresholdBytes: LARGE_COUNTRY_BYTES,
    countries: entries.sort((a, b) => b.bytes - a.bytes),
    summary: {
      totalCountries: entries.length,
      fullBytes,
      duplicatedCountryFilesBytes,
      countryConflictShardBytes,
      tooLargeCount: entries.filter(entry => entry.tooLarge).length,
      largest: entries.sort((a, b) => b.bytes - a.bytes).slice(0, 12)
    }
  };
}

async function writePublicCountryShards(countries) {
  await fs.emptyDir(perCountryDir);
  await fs.ensureDir(perCountryConflictsDir);
  for (const [code, country] of Object.entries(countries)) {
    const publicRecord = buildPublicCountryRecord(country, code);
    await writeJsonWithRetry(
      path.join(perCountryDir, `${code}.json`),
      publicRecord,
      { spaces: 0 }
    );
    if (publicRecord.military?.conflictsShard) {
      await writeJsonWithRetry(
        path.join(perCountryConflictsDir, `${code}.json`),
        buildPublicCountryConflictRecord(country),
        { spaces: 0 }
      );
    }
  }
}

function sectionSourceTrace(country = {}) {
  const sources = country.metadata?.sources || {};
  const provenanceSections = country.metadata?.provenance?.sections || {};
  return Object.fromEntries(
    ["general", "history", "economy", "military", "politics", "religion", "symbols", "relations"].map(section => [
      section,
      {
        sources: normalizeArray(sources[section]),
        sourceCount: provenanceSections[section]?.sourceCount ?? normalizeArray(sources[section]).length,
        status: provenanceSections[section]?.status || country.metadata?.quality?.sectionStatus?.[section] || "sin_estado"
      }
    ])
  );
}

function buildCurationAudit(countries, weights, undatedConflicts = []) {
  const gaps = [];
  const languageIssues = [];
  const singlePrimaryLanguageProfiles = new Set(["PRK", "KOR"]);
  const languageDiversityPriorityPopulation = 20000000;
  const specialOrDependentCodes = new Set([
    "-99", "ATA", "ATF", "BMU", "ESH", "FLK", "GRL", "GUF", "NCL", "PRI", "PSE", "CS-KM"
  ]);
  const rivalryPriorityCodes = new Set([
    "ARG", "ARM", "AZE", "CHN", "GBR", "GRC", "IND", "IRN", "ISR", "KOR", "MAR", "PAK", "PRK", "RUS", "SAU", "SRB", "SYR", "TUR", "TWN", "UKR", "USA"
  ]);
  const englishSignal = /\b(of|the|for|realm|british|cameroon|republic|federation|strategic|capability|commission)\b/i;
  for (const [code, country] of Object.entries(countries)) {
    const relations = country.politics?.relations || {};
    const addGap = (type, detail, severity = "media") => gaps.push({ code, name: country.name, type, severity, detail });
    const trackLanguageIssue = (field, value) => {
      if (typeof value === "string" && englishSignal.test(value)) {
        languageIssues.push({ code, name: country.name, field, value });
      }
    };
    trackLanguageIssue("history.origin", country.history?.origin);
    for (const organization of normalizeArray(country.politics?.organizations)) {
      trackLanguageIssue("politics.organizations.name", typeof organization === "string" ? organization : organization?.name);
    }
    const cityNames = new Set(
      normalizeArray(country.general?.cities)
        .map(city => normalizeText(city?.name || city))
        .filter(Boolean)
    );
    normalizeArray(country.general?.capitals)
      .concat(country.general?.capital || [])
      .map(city => normalizeText(city?.name || city))
      .filter(Boolean)
      .forEach(name => cityNames.add(name));
    const population = Number(country.general?.population || 0);
    const expectedCityCount = population >= 20000000 ? 5 : population >= 1000000 ? 4 : 3;
    if (cityNames.size < expectedCityCount) {
      addGap("general.cities", `menos de ${expectedCityCount} ciudades y capitales destacadas`);
    }
    if (normalizeArray(country.general?.capitals).length < 1 && !country.general?.capital?.name) addGap("general.capitals", "sin capital estructurada", "alta");
    if (normalizeArray(country.general?.capitals).length === 1 && /Bolivia|Sudafrica|Países Bajos|Netherlands|South Africa/i.test(country.name)) {
      addGap("general.capitals.multiple", "posible capital multiple a revisar");
    }
    if (
      normalizeArray(country.religion?.composition).length < 2 &&
      !specialOrDependentCodes.has(code)
    ) addGap("religion.denominations", "composicion religiosa sin desglose suficiente");
    const languageCount = normalizeArray(country.general?.languages).length;
    if (!languageCount) {
      addGap("general.languages", "sin idiomas principales documentados", "alta");
    } else if (
      population >= languageDiversityPriorityPopulation &&
      languageCount < 2 &&
      !singlePrimaryLanguageProfiles.has(code)
    ) {
      addGap("general.languages", "pais de alta poblacion sin diversidad linguistica documentada");
    }
    if (
      normalizeArray(country.politics?.organizations).length < 3 &&
      !specialOrDependentCodes.has(code)
    ) addGap("politics.organizations", "sin membresias internacionales suficientes");
    const rivalryCount = normalizeArray(country.politics?.rivals).length + normalizeArray(relations.currentRivals).length;
    if (rivalryPriorityCodes.has(code) && rivalryCount < 1) {
      addGap("politics.rivals", "pais con tension prioritaria sin rivalidades documentadas");
    }
    const blocCount = normalizeArray(relations.blocs).length +
      normalizeArray(relations.militaryBlocs).length +
      normalizeArray(relations.economicBlocs).length +
      normalizeArray(relations.diplomaticBlocs).length;
    if (!specialOrDependentCodes.has(code) && blocCount < 1) {
      addGap("politics.relations.blocs", "sin alianzas o bloques documentados");
    }
    if (normalizeArray(relations.disputedTerritories || relations.disputes).length < 1 && ["RUS", "UKR", "IND", "PAK", "CHN", "ISR", "TUR", "GRC", "ARG", "GBR"].includes(code)) {
      addGap("politics.relations.disputes", "disputas territoriales prioritarias sin profundidad", "alta");
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    purpose: "Auditoria interna/tecnica para priorizar curaduria. No forma parte del shell de produccion.",
    weightSummary: weights.summary,
    sourceTrace: Object.fromEntries(
      Object.entries(countries).map(([code, country]) => [code, sectionSourceTrace(country)])
    ),
    languageQuality: {
      issueCount: languageIssues.length,
      issues: languageIssues.slice(0, 200)
    },
    conflictDateQuality: {
      pendingCount: undatedConflicts.length,
      description: "Conflictos retenidos en fichas de pais pero excluidos del indice publico fechable hasta curaduria segura.",
      examples: undatedConflicts.slice(0, 160)
    },
    gapsByType: gaps.reduce((acc, gap) => {
      acc[gap.type] = (acc[gap.type] || 0) + 1;
      return acc;
    }, {}),
    priorityGaps: gaps
      .sort((a, b) => Number(b.severity === "alta") - Number(a.severity === "alta") || a.type.localeCompare(b.type))
      .slice(0, 240)
  };
}

function buildManifest() {
  return {
    generatedAt: new Date().toISOString(),
    productionPublic: {
      description: "Datos livianos aptos para produccion y cache inicial/bajo demanda.",
      files: PUBLIC_DATA_FILES
    },
    internalTechnical: {
      description: "Datos pesados, auditorias y fuentes internas. Excluir de builds prod estaticos.",
      files: TECHNICAL_DATA_FILES
    },
    educational: {
      description: "Material docente/documental que puede mostrarse desde la app sin cargar datasets internos.",
      files: EDUCATIONAL_DATA_FILES
    },
    internalReports: {
      description: "Reportes de mantenimiento; no deben entrar en APP_SHELL ni build prod.",
      files: INTERNAL_DATA_FILES
    },
    prodExcludes: ["reports/*.json", "data/raw/**", "data/countries_full.json", "data/conflict_details.generated.json", "data/conflict_dyadic_summary.json"]
  };
}

await fs.ensureDir(reportsDir);
const countries = await readJsonWithRetry(path.join(dataDir, "countries_full.json"));
const conflictIndexResult = buildConflictIndex(countries);
const conflictIndex = conflictIndexResult.dated;
const timelineIndex = buildTimelineIndex(countries);
const searchIndex = buildSearchIndex(countries);
await writePublicCountryShards(countries);
const weights = await buildCountryWeights(countries);
const curationAudit = buildCurationAudit(countries, weights, conflictIndexResult.undated);
const manifest = buildManifest();
const conflictDetailsIndex = await buildConflictDetailShards();

await writeJsonWithRetry(path.join(dataDir, "conflicts_index.json"), conflictIndex, { spaces: 0 });
await writeJsonWithRetry(path.join(dataDir, "timeline_index.json"), timelineIndex, { spaces: 0 });
await writeJsonWithRetry(path.join(dataDir, "search_index.json"), searchIndex, { spaces: 0 });
await writeJsonWithRetry(path.join(dataDir, "country_weights.json"), weights, { spaces: 0 });
await writeJsonWithRetry(path.join(dataDir, "data_manifest.json"), manifest, { spaces: 2 });
await writeJsonWithRetry(path.join(dataDir, "conflicts", "details_index.json"), conflictDetailsIndex, { spaces: 0 });
await writeJsonWithRetry(path.join(reportsDir, "data-curation-audit.json"), curationAudit, { spaces: 2 });

console.log(`conflicts_index: ${conflictIndex.length} conflictos`);
console.log(`conflict_date_pending: ${conflictIndexResult.undated.length} conflictos fuera del indice fechable`);
console.log(`timeline_index: ${timelineIndex.length} eventos`);
console.log(`search_index: ${searchIndex.length} paises`);
console.log(`country_weights: ${weights.summary.tooLargeCount} fichas sobre ${LARGE_COUNTRY_BYTES} bytes`);
console.log(`conflict detail shards: ${conflictDetailsIndex.conflicts.length} archivos`);
