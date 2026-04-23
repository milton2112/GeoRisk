import fs from "fs-extra";
import path from "path";
import { hasMojibake, hasValue, isTerritoryLike, normalizeArray } from "./lib/dataset-shared.js";
import { loadAliasConfig, createCountryAliasIndex, resolveCountryNameToCode } from "./lib/country-matching.js";

const projectRoot = path.resolve(process.cwd());
const datasetPath = path.join(projectRoot, "data", "countries_full.json");

const ORGANIZATION_OPTIONAL_CODES = new Set(["BMU", "CS-KM", "-99", "FLK", "ATF", "PRI", "GUF", "ATA"]);
const CONFLICT_OPTIONAL_CODES = new Set(["ATF", "GUF", "ATA"]);
const LANGUAGE_OPTIONAL_CODES = new Set(["ATA", "ATF"]);
const LOW_LEVEL_CONFLICT_WARNING_PATTERN = /batalla|battle|combate|combat|sitio|asedio|escaramuza|skirmish|hundimiento|bombardeo|bombing|ataque|attack|captura|capture|desembarco|landing|operaci[oÃ³]n|operation|acci[oÃ³]n|action|incursi[oÃ³]n|raid|naval battle|enfrentamiento|choque|uprising|levantamiento|rebeli[oÃ³]n|rebelion|massacre|masacre|blitz|affair|incident|incidente|expedition|expedici[oÃ³]n|occupation|ocupaci[oÃ³]n|campaign|campa[aÃ±]a|theater|theatre|pocket|disaster|blockade|bloqueo|assault|asalto|ambush|fight|defeat|ridge|fort|adlertag|viernes negro|bolsa del ruhr|toma de|paso de|vs /i;
const CONFLICT_NOISE_NAME_PATTERN = /^Q\d+$/i;

async function main() {
  const countries = await fs.readJson(datasetPath);
  const geoJson = await fs.readJson(path.join(projectRoot, "data", "world_countries.geo.json"));
  const countryNames = await fs.readJson(path.join(projectRoot, "data", "raw", "country_names.json"));
  const populationCsv = await fs.readFile(path.join(projectRoot, "data", "raw", "population.csv"), "utf8");
  const aliasConfig = await loadAliasConfig();
  const rows = Object.entries(countries);
  const issues = [];
  const warnings = [];
  const populationNames = {};
  const lines = populationCsv.split(/\r?\n/).filter(Boolean);
  const headerIndex = lines.findIndex(line => line.startsWith("\"Country Name\""));

  for (const line of lines.slice(headerIndex + 1)) {
    if (!line.startsWith("\"")) continue;
    const parts = line.trim().replace(/^"/, "").replace(/",?$/, "").split('","');
    if (parts.length < 2) continue;
    populationNames[parts[0]] = parts[1];
  }

  const aliasIndexes = createCountryAliasIndex(countries, aliasConfig, { countryNames, populationNames });

  rows.forEach(([code, country]) => {
    const cities = normalizeArray(country.general?.cities);
    const organizations = normalizeArray(country.politics?.organizations);
    const religionComposition = normalizeArray(country.religion?.composition);
    const meaningfulConflicts = normalizeArray(country.military?.conflicts || country.conflicts);
    const capitals = normalizeArray(country.general?.capitals);
    const languages = normalizeArray(country.general?.languages);
    const metadataSources = country.metadata?.sources || {};
    const provenance = country.metadata?.provenance || null;
    const quality = country.metadata?.quality || null;
    const territoryLike = isTerritoryLike(country);
    const serialized = JSON.stringify(country);

    if (!hasValue(country.name)) issues.push({ code, type: "name", detail: "sin nombre" });
    if (!hasValue(country.continent)) issues.push({ code, type: "continent", detail: "sin continente" });
    if (!hasValue(country.history?.year)) issues.push({ code, type: "history.year", detail: "sin ano de formacion" });
    if (!hasValue(country.history?.type)) issues.push({ code, type: "history.type", detail: "sin tipo historico" });
    if (!hasValue(country.history?.origin)) issues.push({ code, type: "history.origin", detail: "sin origen historico" });
    if (!hasValue(country.politics?.system)) issues.push({ code, type: "politics.system", detail: "sin sistema politico" });
    if (!hasValue(country.economy?.inflation)) issues.push({ code, type: "economy.inflation", detail: "sin inflacion" });
    if (!hasValue(country.metadata?.updatedAt)) issues.push({ code, type: "metadata.updatedAt", detail: "sin fecha de actualizacion" });
    if (!provenance) issues.push({ code, type: "metadata.provenance", detail: "sin trazabilidad" });
    if (!hasValue(quality?.status)) issues.push({ code, type: "metadata.quality.status", detail: "sin estado de calidad" });
    if (typeof quality?.sourceCoverageScore !== "number") {
      issues.push({ code, type: "metadata.quality.sourceCoverageScore", detail: "sin score de cobertura" });
    }
    if (typeof quality?.score !== "number" || quality.score < 0 || quality.score > 100) {
      issues.push({ code, type: "metadata.quality.score", detail: "score fuera de rango" });
    }
    if (typeof quality?.score === "number" && quality.score < 60) {
      issues.push({ code, type: "metadata.quality.score", detail: `score bajo (${quality.score})` });
    }
    if (!capitals.length && !hasValue(country.general?.capital?.name)) {
      issues.push({ code, type: "general.capitals", detail: "sin capital estructurada" });
    }
    if (!LANGUAGE_OPTIONAL_CODES.has(code) && !territoryLike && !languages.length) {
      issues.push({ code, type: "general.languages", detail: "sin idiomas curados" });
    }
    if (!hasValue(country.general?.stateStructure)) {
      issues.push({ code, type: "general.stateStructure", detail: "sin estructura estatal" });
    }
    if (!hasValue(country.general?.subdivisions?.type)) {
      issues.push({ code, type: "general.subdivisions", detail: "sin subdivisiones" });
    }
    if (!hasValue(country.general?.officialName)) {
      issues.push({ code, type: "general.officialName", detail: "sin nombre oficial" });
    }
    if (!normalizeArray(country.general?.historicalNames).length) {
      issues.push({ code, type: "general.historicalNames", detail: "sin nombres historicos" });
    }
    if (cities.length < 2) issues.push({ code, type: "general.cities", detail: `solo ${cities.length} ciudades` });
    if (!territoryLike && !ORGANIZATION_OPTIONAL_CODES.has(code) && !organizations.length) {
      issues.push({ code, type: "politics.organizations", detail: "sin organizaciones" });
    }
    if (!religionComposition.length && !hasValue(country.religion?.summary)) {
      issues.push({ code, type: "religion", detail: "sin religion estructurada" });
    }
    if (!territoryLike && !CONFLICT_OPTIONAL_CODES.has(code) && !meaningfulConflicts.length) {
      issues.push({ code, type: "military.conflicts", detail: "sin conflictos" });
    }
    if (!country.general?.symbols?.assets?.flagPath && !hasValue(country.general?.symbols?.flagDescription)) {
      issues.push({ code, type: "general.symbols.flag", detail: "sin bandera ni descripcion" });
    }
    if (!country.politics?.relations || typeof country.politics.relations !== "object") {
      issues.push({ code, type: "politics.relations", detail: "sin bloque de relaciones" });
    }
    if (country.politics?.relations && !normalizeArray(country.politics.relations.disputedTerritories || country.politics.relations.disputes).length && !territoryLike && ["RUS", "UKR", "IND", "PAK", "CHN", "ISR"].includes(code)) {
      issues.push({ code, type: "politics.relations.disputes", detail: "sin disputas curadas" });
    }
    if (country.politics?.relations && !normalizeArray(country.politics.relations.currentRivals).length && !territoryLike && ["USA", "CHN", "RUS", "IRN", "ISR", "IND", "PAK", "UKR"].includes(code)) {
      issues.push({ code, type: "politics.relations.currentRivals", detail: "sin rivales actuales curados" });
    }
    if (!metadataSources || typeof metadataSources !== "object") {
      issues.push({ code, type: "metadata.sources", detail: "sin estructura de fuentes" });
    }
    if (!provenance || typeof provenance !== "object" || !hasValue(provenance.code) || !provenance.sections) {
      issues.push({ code, type: "metadata.provenance", detail: "trazabilidad incompleta" });
    }
    if (hasMojibake(serialized)) {
      issues.push({ code, type: "encoding", detail: "texto con mojibake" });
    }

    ["general", "history", "economy", "military", "politics", "religion", "symbols", "relations"].forEach(section => {
      if (!normalizeArray(metadataSources[section]).length) {
        issues.push({ code, type: `metadata.sources.${section}`, detail: `sin fuentes en ${section}` });
      }
    });

    normalizeArray(country.military?.conflicts).forEach(conflict => {
      const conflictName = String(conflict?.name || "");
      if (!hasValue(conflict?.name)) {
        issues.push({ code, type: "military.conflicts.name", detail: "conflicto sin nombre" });
      }
      if (
        !hasValue(conflict?.startYear) &&
        !hasValue(conflict?.endYear) &&
        !CONFLICT_NOISE_NAME_PATTERN.test(conflictName) &&
        !LOW_LEVEL_CONFLICT_WARNING_PATTERN.test(conflictName)
      ) {
        warnings.push({ code, type: "military.conflicts.startYear", detail: `conflicto sin fecha (${conflictName || "s/n"})` });
      }
    });
  });

  geoJson.features.forEach(feature => {
    const featureName = feature?.properties?.name;
    if (!featureName) {
      return;
    }
    const resolved = resolveCountryNameToCode(featureName, countries, aliasIndexes);
    if (!resolved) {
      issues.push({ code: "MAP", type: "map.alias", detail: `sin match para ${featureName}` });
    }
  });

  const byType = issues.reduce((acc, issue) => {
    acc[issue.type] = acc[issue.type] || [];
    acc[issue.type].push(issue);
    return acc;
  }, {});
  const warningByType = warnings.reduce((acc, issue) => {
    acc[issue.type] = acc[issue.type] || [];
    acc[issue.type].push(issue);
    return acc;
  }, {});

  console.log(`Paises analizados: ${rows.length}`);
  console.log(`Incidencias detectadas: ${issues.length}`);
  console.log(`Advertencias: ${warnings.length}`);
  console.log("");

  Object.entries(byType)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([type, list]) => {
      const sample = list.slice(0, 10).map(item => `${item.code} (${item.detail})`).join(", ");
      console.log(`${type}: ${list.length}`);
      console.log(`  ${sample}`);
    });

  if (warnings.length) {
    console.log("");
    Object.entries(warningByType)
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([type, list]) => {
        const sample = list.slice(0, 10).map(item => `${item.code} (${item.detail})`).join(", ");
        console.log(`${type}: ${list.length}`);
        console.log(`  ${sample}`);
      });
  }

  console.log("");
  console.log("Validacion terminada.");
}

main().catch(error => {
  console.error("No se pudo validar countries_full.json:", error);
  process.exitCode = 1;
});
