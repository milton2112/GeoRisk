import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const projectRoot = process.cwd();
const source = await fs.readFile(path.join(projectRoot, "app-rankings.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context);

const rankings = context.window.GeoRiskRankings;
assert.ok(rankings, "app-rankings debe exponer GeoRiskRankings");

const countries = [
  {
    code: "AAA",
    name: "Alta Presion",
    continent: "Asia",
    general: { population: 50000000 },
    economy: { inflation: 90 },
    military: { active: 240000, conflicts: [{ name: "Guerra A", ongoing: true }, { name: "Guerra B" }] },
    politics: { rivals: ["Rival"], organizations: [{ name: "ONU" }], relations: { blocs: [] } },
    metadata: { quality: { missingFields: ["economy"], estimatedFields: ["military.active"] } }
  },
  {
    code: "BBB",
    name: "Baja Presion",
    continent: "Europe",
    general: { population: 10000000 },
    economy: { inflation: 2 },
    military: { active: 10000, conflicts: [] },
    politics: { rivals: [], organizations: [{ name: "ONU" }, { name: "UE" }], relations: { blocs: ["UE"] } },
    metadata: { quality: { missingFields: [], estimatedFields: [] }, sources: { economy: ["World Bank"] } }
  }
];

const high = rankings.getRiskComponents(countries[0]);
const low = rankings.getRiskComponents(countries[1]);
assert.ok(high.risk > low.risk, "riesgo debe subir con conflictos, inflacion y presion militar");
assert.ok(low.diplomaticBuffer > high.diplomaticBuffer, "buffer diplomatico debe reflejar organizaciones/bloques");

const historicalOnly = rankings.getRiskComponents({
  politics: {
    rivals: [{ name: "Antiguo rival", type: "historico" }],
    relations: { currentRivals: [] },
    organizations: []
  },
  metadata: { quality: { score: 73 } }
});
assert.equal(historicalOnly.rivalPressure, 0, "rivalidades historicas no deben inflar el riesgo actual");
assert.equal(historicalOnly.dataQuality, 73, "ranking de calidad debe usar el score curado del dataset");

const ranking = rankings.buildRanking(countries, "risk", { limit: 2 });
assert.equal(ranking[0].name, "Alta Presion", "ranking de riesgo debe ordenar por score");
assert.ok(ranking[0].components.length, "cada score debe explicar componentes");

const filtered = rankings.buildRanking(countries, "population", { filters: { continent: "Europe" } });
assert.equal(filtered[0].name, "Baja Presion", "filtros por continente deben aplicarse");

console.log("ranking-formulas.test.js ok");
