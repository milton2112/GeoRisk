import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isProvisionalConflictHierarchy, normalizeConflictKey } from "./lib/conflict-cleaning.js";
import { fetchWikipediaConflictDetail } from "./lib/wikipedia-conflicts.js";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(__filename), "..");
const countriesPath = path.join(projectRoot, "data", "countries_full.json");
const reportPath = path.join(projectRoot, "reports", "provisional-conflict-candidates.json");

function readArg(name, fallback = "") {
  const direct = process.argv.find(arg => arg.startsWith(`--${name}=`));
  return direct ? direct.slice(name.length + 3) : fallback;
}

function readListArg(name) {
  return new Set(readArg(name)
    .split(",")
    .map(value => value.trim().toUpperCase())
    .filter(Boolean));
}

function getConflictEntries(country) {
  return [
    ...(Array.isArray(country?.conflicts) ? country.conflicts : []),
    ...(Array.isArray(country?.military?.conflicts) ? country.military.conflicts : [])
  ].map(entry => typeof entry === "string" ? { name: entry } : entry).filter(Boolean);
}

function asText(value) {
  const text = Array.isArray(value) ? value.filter(Boolean).join(" | ") : String(value || "").trim();
  return /^(?:null|undefined|n\/?a|-)$/i.test(text) ? "" : text;
}

export function extractCandidateYears(value) {
  const years = [...asText(value).matchAll(/\b([1-9]\d{2,3})\b/g)]
    .map(match => Number(match[1]))
    .filter(Number.isFinite);
  const startYear = years[0] || null;
  const endYear = years.length > 1 ? years.at(-1) : startYear;
  return { startYear, endYear };
}

export function toWikipediaPageUrl(pageTitle, language = "es") {
  if (!pageTitle) return "";
  const normalizedLanguage = language === "en" ? "en" : "es";
  return `https://${normalizedLanguage}.wikipedia.org/wiki/${encodeURIComponent(pageTitle.replace(/ /g, "_"))}`;
}

export function classifyWikipediaCandidate(detail = {}) {
  const partOf = asText(detail.partOf || detail.wikipedia?.partOf);
  const date = asText(detail.wikipedia?.date);
  const { startYear, endYear } = extractCandidateYears(date);
  const pageTitle = asText(detail.pageTitle);
  const language = detail.wikipedia?.language === "en" ? "en" : "es";
  const status = !pageTitle
    ? "sin_ficha"
    : !partOf
      ? "revisar_padre"
      : !startYear
        ? "revisar_fecha"
        : "listo_para_revision";

  return {
    status,
    pageTitle,
    language,
    sourceUrl: toWikipediaPageUrl(pageTitle, language),
    date,
    partOf,
    startYear,
    endYear,
    region: asText(detail.region),
    outcome: asText(detail.outcome)
  };
}

export function collectProvisionalConflictCandidates(countries, countryFilter = new Set()) {
  const candidates = new Map();

  for (const [code, country] of Object.entries(countries || {})) {
    if (countryFilter.size && !countryFilter.has(code)) continue;
    for (const conflict of getConflictEntries(country)) {
      if (!isProvisionalConflictHierarchy(conflict)) continue;
      const key = normalizeConflictKey(conflict.name);
      if (!key) continue;
      const current = candidates.get(key) || {
        name: conflict.name,
        countries: new Set(),
        provisionalParents: new Set(),
        provisionalCampaigns: new Set()
      };
      current.countries.add(code);
      if (conflict.parent || conflict.war) current.provisionalParents.add(conflict.parent || conflict.war);
      if (conflict.campaign) current.provisionalCampaigns.add(conflict.campaign);
      candidates.set(key, current);
    }
  }

  return [...candidates.values()]
    .map(candidate => ({
      name: candidate.name,
      countries: [...candidate.countries].sort(),
      provisionalParents: [...candidate.provisionalParents].sort(),
      provisionalCampaigns: [...candidate.provisionalCampaigns].sort()
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function buildReport(records, requestedCount) {
  const summary = records.reduce((result, record) => {
    result[record.status] = (result[record.status] || 0) + 1;
    return result;
  }, {});

  return {
    generatedAt: new Date().toISOString(),
    source: "Wikipedia MediaWiki API; candidates require editorial validation before publication.",
    requestedCount,
    summary,
    candidates: records
  };
}

async function main() {
  const countries = await fs.readJson(countriesPath);
  const countryFilter = readListArg("country");
  const requested = collectProvisionalConflictCandidates(countries, countryFilter);
  const rawLimit = Number(readArg("limit", "0"));
  const delayMs = Math.max(0, Number(readArg("delay", "120")) || 0);
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : requested.length;
  const candidates = requested.slice(0, limit);
  const records = [];

  console.log(`Jerarquias provisionales seleccionadas: ${candidates.length}/${requested.length}`);

  for (const [index, candidate] of candidates.entries()) {
    let detail = null;
    let error = "";
    try {
      detail = await fetchWikipediaConflictDetail(candidate.name);
    } catch (reason) {
      error = reason instanceof Error ? reason.message : String(reason);
    }
    const resolved = classifyWikipediaCandidate(detail || {});
    records.push({
      ...candidate,
      ...resolved,
      ...(error ? { error } : {})
    });

    if ((index + 1) % 10 === 0 || index + 1 === candidates.length) {
      await fs.outputJson(reportPath, buildReport(records, candidates.length), { spaces: 2 });
    }
    if (delayMs && index + 1 < candidates.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  const report = buildReport(records, candidates.length);
  await fs.outputJson(reportPath, report, { spaces: 2 });
  console.log(`Candidatos listos para revision: ${report.summary.listo_para_revision || 0}`);
  console.log(`Reporte: ${path.relative(projectRoot, reportPath)}`);
}

if (path.resolve(process.argv[1] || "") === __filename) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
