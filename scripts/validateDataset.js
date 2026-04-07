import fs from "fs-extra";
import path from "path";

const projectRoot = path.resolve(process.cwd());
const datasetPath = path.join(projectRoot, "data", "countries_full.json");

function normalizeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "" && value !== "Sin datos";
}

function isTerritoryLike(country = {}) {
  const system = String(country.politics?.system || country.general?.stateStructure || "").toLowerCase();
  const officialName = String(country.general?.officialName || country.name || "").toLowerCase();
  return [
    "territorio",
    "ultramar",
    "dependencia",
    "disputado",
    "protectorado",
    "tratado antartico",
    "no incorporado",
    "reconocimiento limitado"
  ].some(token => system.includes(token) || officialName.includes(token));
}

const ORGANIZATION_OPTIONAL_CODES = new Set(["BMU", "CS-KM", "-99", "FLK", "ATF", "PRI", "GUF", "ATA"]);
const CONFLICT_OPTIONAL_CODES = new Set(["ATF", "GUF", "ATA"]);
const LANGUAGE_OPTIONAL_CODES = new Set(["ATA", "ATF"]);

async function main() {
  const countries = await fs.readJson(datasetPath);
  const rows = Object.entries(countries);

  const issues = [];

  rows.forEach(([code, country]) => {
    const cities = normalizeArray(country.general?.cities);
    const organizations = normalizeArray(country.politics?.organizations);
    const religionComposition = normalizeArray(country.religion?.composition);
    const meaningfulConflicts = normalizeArray(country.military?.conflicts || country.conflicts);
    const capitals = normalizeArray(country.general?.capitals);
    const languages = normalizeArray(country.general?.languages);
    const metadataSources = country.metadata?.sources || {};
    const territoryLike = isTerritoryLike(country);

    if (!hasValue(country.name)) issues.push({ code, type: "name", detail: "sin nombre" });
    if (!hasValue(country.continent)) issues.push({ code, type: "continent", detail: "sin continente" });
    if (!hasValue(country.history?.year)) issues.push({ code, type: "history.year", detail: "sin año de formación" });
    if (!hasValue(country.history?.type)) issues.push({ code, type: "history.type", detail: "sin tipo histórico" });
    if (!hasValue(country.history?.origin)) issues.push({ code, type: "history.origin", detail: "sin origen histórico" });
    if (!hasValue(country.politics?.system)) issues.push({ code, type: "politics.system", detail: "sin sistema político" });
    if (!hasValue(country.economy?.inflation)) issues.push({ code, type: "economy.inflation", detail: "sin inflación" });
    if (!hasValue(country.metadata?.updatedAt)) issues.push({ code, type: "metadata.updatedAt", detail: "sin fecha de actualización" });
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
    if (cities.length < 2) issues.push({ code, type: "general.cities", detail: `solo ${cities.length} ciudades` });
    if (!territoryLike && !ORGANIZATION_OPTIONAL_CODES.has(code) && !organizations.length) {
      issues.push({ code, type: "politics.organizations", detail: "sin organizaciones" });
    }
    if (!religionComposition.length && !hasValue(country.religion?.summary)) {
      issues.push({ code, type: "religion", detail: "sin religión estructurada" });
    }
    if (!territoryLike && !CONFLICT_OPTIONAL_CODES.has(code) && !meaningfulConflicts.length) {
      issues.push({ code, type: "military.conflicts", detail: "sin conflictos" });
    }

    ["general", "history", "economy", "military", "politics", "religion"].forEach(section => {
      if (!normalizeArray(metadataSources[section]).length) {
        issues.push({ code, type: `metadata.sources.${section}`, detail: `sin fuentes en ${section}` });
      }
    });
  });

  const byType = issues.reduce((acc, issue) => {
    acc[issue.type] = acc[issue.type] || [];
    acc[issue.type].push(issue);
    return acc;
  }, {});

  console.log(`Paises analizados: ${rows.length}`);
  console.log(`Incidencias detectadas: ${issues.length}`);
  console.log("");

  Object.entries(byType)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([type, list]) => {
      const sample = list.slice(0, 10).map(item => `${item.code} (${item.detail})`).join(", ");
      console.log(`${type}: ${list.length}`);
      console.log(`  ${sample}`);
    });

  console.log("");
  console.log("Validacion terminada.");
}

main().catch(error => {
  console.error("No se pudo validar countries_full.json:", error);
  process.exitCode = 1;
});
