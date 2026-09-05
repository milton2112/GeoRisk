import { Readable } from "node:stream";
import csvParser from "csv-parser";

export async function buildRuntimeSupplemental(countries, populationCsv) {
  const header = populationCsv.search(/^"Country Name","Country Code"/m);
  if (header < 0) throw new Error("Population CSV: falta cabecera del Banco Mundial.");
  const populationGrowth = {};
  const populationPeriods = {};
  const countryNames = [];
  const rows = Readable.from([populationCsv.slice(header)]).pipe(csvParser());
  for await (const row of rows) {
    const code = row["Country Code"];
    if (!Object.hasOwn(countries, code)) continue;
    if (row["Country Name"]) countryNames.push([row["Country Name"], code]);
    if (row["Indicator Code"] !== "SP.POP.TOTL") continue;
    const values = Object.entries(row)
      .filter(([year, value]) => /^\d{4}$/.test(year) && value.trim() !== "" && Number.isFinite(Number(value)))
      .map(([year, value]) => ({ year: Number(year), value: Number(value) }))
      .sort((a, b) => b.year - a.year);
    const [latest, previous] = values;
    // A multi-year gap is not an annual growth observation.
    if (!latest || !previous || latest.year - previous.year !== 1 || previous.value <= 0 || latest.value <= 0) continue;
    populationGrowth[code] = Number(((latest.value / previous.value - 1) * 100).toFixed(2));
    populationPeriods[code] = [previous.year, latest.year];
  }
  return {
    source: { population: "data/raw/population.csv", method: "Percent change between consecutive observed years; not a live estimate." },
    politics: Object.fromEntries(Object.entries(countries).filter(([, country]) => country.politics?.system).map(([code, country]) => [code, country.politics.system])),
    history: Object.fromEntries(Object.entries(countries).filter(([, country]) => country.history?.type).map(([code, country]) => [code, { type: country.history.type }])),
    inflation: Object.fromEntries(Object.entries(countries).filter(([, country]) => Number.isFinite(country.economy?.inflation)).map(([code, country]) => [code, country.economy.inflation])),
    populationGrowth, populationPeriods, countryNames
  };
}
