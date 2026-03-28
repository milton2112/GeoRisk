import fs from "fs-extra";
import fetch from "node-fetch";
import csvParser from "csv-parser";
import { Readable } from "stream";

const continents = fs.readJsonSync("./data/raw/continents.json");
const base = fs.readJsonSync("./data/raw/countries_base.json");
const existingHistory = fs.readJsonSync("./data/raw/history.json");
const existingCountryNames = fs.existsSync("./data/raw/country_names.json")
  ? fs.readJsonSync("./data/raw/country_names.json")
  : {};
const existingPoliticsDetails = fs.existsSync("./data/raw/politics_details.json")
  ? fs.readJsonSync("./data/raw/politics_details.json")
  : {};
const existingReligionDetails = fs.existsSync("./data/raw/religion_details.json")
  ? fs.readJsonSync("./data/raw/religion_details.json")
  : {};
const existingCityDetails = fs.existsSync("./data/raw/city_details.json")
  ? fs.readJsonSync("./data/raw/city_details.json")
  : {};
const EXTRA_GEO_CODES = [
  "GRL",
  "FLK",
  "SSD",
  "ESH",
  "SWZ",
  "CS-KM",
  "TKM",
  "BTN",
  "TLS",
  "SLB",
  "NCL",
  "VUT",
  "FJI",
  "-99"
];

const TERRITORY_DEFAULTS = {
  PRI: {
    history: { year: 1898, type: "territorio no incorporado", origin: "Estados Unidos" },
    politics: { system: "territorio no incorporado de Estados Unidos" },
    religion: {
      summary: "Cristianismo",
      composition: [
        { name: "Cristianismo", percentage: 92 },
        { name: "No afiliados / ateos / agnosticos", percentage: 6 },
        { name: "Otras religiones", percentage: 2 }
      ]
    },
    cityDetails: {
      capital: { name: "San Juan", population: 342259, isCapital: true },
      cities: [
        { name: "Bayamon", population: 185187, isCapital: false },
        { name: "Carolina", population: 154815, isCapital: false },
        { name: "Ponce", population: 132138, isCapital: false }
      ]
    }
  },
  ATA: {
    history: { year: 1959, type: "territorio antartico", origin: "Tratado Antartico" },
    politics: { system: "territorio antartico administrado por el Sistema del Tratado Antartico" },
    religion: {
      summary: "Sin religion predominante",
      composition: [{ name: "No afiliados / ateos / agnosticos", percentage: 100 }]
    },
    cityDetails: {
      capital: { name: "Sin capital oficial", population: null, isCapital: true },
      cities: [
        { name: "Estacion McMurdo", population: 1200, isCapital: false },
        { name: "Base Esperanza", population: 70, isCapital: false }
      ]
    }
  }
};

const isoCodes = Array.from(
  new Set([...continents.map(entry => entry.code), ...Object.keys(base), ...EXTRA_GEO_CODES])
).sort();

function toSparqlValues(values) {
  return values.map(value => `"${value}"`).join(" ");
}

function chunked(list, size) {
  const result = [];

  for (let index = 0; index < list.length; index += size) {
    result.push(list.slice(index, index + size));
  }

  return result;
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const CITY_NAME_OVERRIDES = {
  london: "Londres",
  paris: "Paris",
  berlin: "Berlin",
  rome: "Roma",
  moscow: "Moscu",
  tokyo: "Tokio",
  kyiv: "Kiev",
  kiev: "Kiev",
  beijing: "Pekin",
  seoul: "Seul",
  taipei: "Taipéi",
  "new delhi": "Nueva Delhi",
  delhi: "Delhi",
  "mexico city": "Ciudad de Mexico",
  "new york": "Nueva York",
  "new york city": "Nueva York",
  "new york ny": "Nueva York",
  "los angeles": "Los Angeles",
  "los angeles ca": "Los Angeles",
  "chicago il": "Chicago",
  "houston tx": "Houston",
  "phoenix az": "Phoenix",
  "washington, d.c.": "Washington D. C.",
  washington: "Washington D. C.",
  athens: "Atenas",
  bucharest: "Bucarest",
  brussels: "Bruselas",
  copenhagen: "Copenhague",
  geneva: "Ginebra",
  stockholm: "Estocolmo",
  vienna: "Viena",
  warsaw: "Varsovia",
  prague: "Praga",
  lisbon: "Lisboa",
  amsterdam: "Amsterdam",
  "the hague": "La Haya",
  venice: "Venecia",
  florence: "Florencia",
  naples: "Napoles",
  turin: "Turin",
  milan: "Milan",
  munich: "Munich",
  cologne: "Colonia",
  nuremberg: "Nuremberg",
  "sao paulo": "San Pablo",
  "rio de janeiro": "Rio de Janeiro",
  moskva: "Moscu",
  "st petersburg": "San Petersburgo",
  "saint petersburg": "San Petersburgo",
  "mumbai bombay": "Mumbai",
  "greater mumbai": "Mumbai",
  "mumbai (bombay)": "Mumbai",
  mumbai: "Mumbai",
  "mexico ciudad de": "Ciudad de Mexico",
  "mexico, ciudad de": "Ciudad de Mexico",
  "bruhat bengaluru mahanagara palike bbmp": "Bangalore",
  bangalore: "Bangalore",
  ahmadabad: "Ahmedabad",
  brasilia: "Brasilia",
  "porto alegre": "Porto Alegre",
  "santiago de chile": "Santiago",
  "cape town": "Ciudad del Cabo",
  "guatemala city": "Ciudad de Guatemala",
  "panama city": "Ciudad de Panama",
  "san jose": "San Jose",
  "san salvador": "San Salvador",
  "port au prince": "Puerto Principe",
  "port-au-prince": "Puerto Principe",
  cayenne: "Cayena",
  noumea: "Numea",
  "port vila": "Port Vila",
  "suva": "Suva",
  honiara: "Honiara",
  "port moresby": "Port Moresby",
  "newcastle upon tyne": "Newcastle upon Tyne",
  "buenos aires": "Buenos Aires",
  cordoba: "Cordoba",
  rosario: "Rosario",
  mendoza: "Mendoza",
  "la plata": "La Plata"
};

const CITY_NAME_REJECTIONS = new Set([
  "la matanza",
  "west midlands",
  "west yorkshire",
  "tyneside"
]);

function translateCityName(name) {
  const normalized = normalizeText(name);
  return CITY_NAME_OVERRIDES[normalized] || name;
}

function isLikelyAdministrativeArea(name) {
  const normalized = normalizeText(name);

  if (CITY_NAME_REJECTIONS.has(normalized)) {
    return true;
  }

  return [
    "greater ",
    "municipal corporation",
    "metropolitan",
    "district",
    "province",
    "department",
    "region",
    "regional municipality",
    "borough",
    "county",
    "prefecture",
    "governorate",
    "mahanagara palike"
  ].some(fragment => normalized.includes(fragment));
}

async function runSparqlQuery(query) {
  const url =
    "https://query.wikidata.org/sparql?format=json&query=" +
    encodeURIComponent(query);

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const res = await fetch(url, {
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": "GeoRisk/1.0 (local enrichment script)"
      }
    });

    const body = await res.text();

    if (res.ok) {
      try {
        return JSON.parse(body);
      } catch (error) {
        const jsonStart = body.indexOf("{");
        const jsonEnd = body.lastIndexOf("}");
        const cleanBody =
          jsonStart >= 0 && jsonEnd >= jsonStart
            ? body.slice(jsonStart, jsonEnd + 1)
            : body;

        try {
          return JSON.parse(cleanBody);
        } catch {
          throw new Error(`Invalid SPARQL response\n${body.slice(0, 1000)}`);
        }
      }
    }

    if (attempt === 4 || (res.status !== 429 && res.status < 500)) {
      throw new Error(`Wikidata query failed: ${res.status} ${res.statusText}\n${body}`);
    }

    await new Promise(resolve => setTimeout(resolve, attempt * 2000));
  }
}

function extractYear(value) {
  if (!value) {
    return null;
  }

  const text = String(value);
  const dateMatch = text.match(/(-?\d{4})-\d{2}-\d{2}/);
  if (dateMatch) {
    const year = Number(dateMatch[1]);
    return year >= -3000 && year <= 2100 ? year : null;
  }

  const yearMatch = text.match(/\b(-?\d{4})\b/);
  if (yearMatch) {
    const year = Number(yearMatch[1]);
    return year >= -3000 && year <= 2100 ? year : null;
  }

  return null;
}

function translateHistoryText(value) {
  if (!value) {
    return value;
  }

  const replacements = [
    [/constitutional monarchy/gi, "monarquía constitucional"],
    [/parliamentary monarchy/gi, "monarquía parlamentaria"],
    [/absolute monarchy/gi, "monarquía absoluta"],
    [/elective monarchy/gi, "monarquía electiva"],
    [/federal monarchy/gi, "monarquía federal"],
    [/federal republic/gi, "república federal"],
    [/parliamentary republic/gi, "república parlamentaria"],
    [/presidential republic/gi, "república presidencialista"],
    [/semi-presidential republic/gi, "república semipresidencialista"],
    [/constitutional republic/gi, "república constitucional"],
    [/democratic republic/gi, "república democrática"],
    [/republic/gi, "república"],
    [/presidentialism/gi, "presidencialismo"],
    [/parliamentary system/gi, "sistema parlamentario"],
    [/unitary state/gi, "estado unitario"],
    [/federal state/gi, "estado federal"],
    [/sovereign state/gi, "estado soberano"],
    [/dependent territory/gi, "territorio dependiente"],
    [/country/gi, "país"],
    [/state/gi, "estado"],
    [/empire/gi, "imperio"],
    [/kingdom/gi, "reino"],
    [/sultanate/gi, "sultanato"],
    [/colony/gi, "colonia"],
    [/commonwealth/gi, "mancomunidad"],
    [/union/gi, "unión"],
    [/federation/gi, "federación"],
    [/grand duchy/gi, "gran ducado"],
    [/duchy/gi, "ducado"]
  ];

  let translated = String(value);

  for (const [pattern, replacement] of replacements) {
    translated = translated.replace(pattern, replacement);
  }

  return translated;
}

function translateOrganizationName(value) {
  if (!value) {
    return value;
  }

  let translated = String(value);
  const replacements = [
    [/Organization/gi, "Organizacion"],
    [/Organisation/gi, "Organizacion"],
    [/International/gi, "Internacional"],
    [/United Nations/gi, "Naciones Unidas"],
    [/World/gi, "Mundial"],
    [/Union/gi, "Union"],
    [/Bank/gi, "Banco"],
    [/Fund/gi, "Fondo"],
    [/Agency/gi, "Agencia"],
    [/Council/gi, "Consejo"],
    [/Treaty/gi, "Tratado"],
    [/Community/gi, "Comunidad"],
    [/Commonwealth/gi, "Mancomunidad"],
    [/Association/gi, "Asociacion"],
    [/Alliance/gi, "Alianza"],
    [/Court/gi, "Corte"],
    [/Trade/gi, "Comercio"],
    [/Health/gi, "Salud"],
    [/Meteorological/gi, "Meteorologica"],
    [/Postal/gi, "Postal"],
    [/Telecommunication/gi, "Telecomunicaciones"],
    [/Customs/gi, "Aduanas"],
    [/Hydrographic/gi, "Hidrografica"],
    [/Development/gi, "Desarrollo"],
    [/Renewable Energy/gi, "Energias Renovables"],
    [/Holocaust Remembrance/gi, "Conmemoracion del Holocausto"]
  ];

  for (const [pattern, replacement] of replacements) {
    translated = translated.replace(pattern, replacement);
  }

  return translated.replace(/\s+/g, " ").trim();
}

function uniqueByKey(items, keySelector) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    const key = keySelector(item);

    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(item);
  }

  return result;
}

function normalizeConflictName(name) {
  return String(name || "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseLegacyConflict(entry) {
  const raw = String(entry || "").trim();

  if (!raw) {
    return null;
  }

  const match = raw.match(/^(.*?)(?:\s*\((\d{3,4})(?:-(\d{3,4}))?\))?$/);

  if (!match) {
    return {
      name: raw,
      startYear: null,
      endYear: null,
      ongoing: false
    };
  }

  const [, name, startYear, endYear] = match;

  return {
    name: normalizeConflictName(name),
    startYear: startYear ? Number(startYear) : null,
    endYear: endYear ? Number(endYear) : startYear ? Number(startYear) : null,
    ongoing: false
  };
}

function buildHistoryRecord(binding) {
  const year =
    extractYear(binding.independenceDate?.value) ||
    extractYear(binding.inception?.value) ||
    extractYear(binding.startTime?.value);

  const type =
    translateHistoryText(
      binding.formOfGovernmentLabel?.value ||
        binding.instanceLabel?.value ||
        binding.statusLabel?.value ||
        "Estado soberano"
    ) || null;

  const origin =
    translateHistoryText(
      binding.fromLabel?.value ||
        binding.partOfLabel?.value ||
        binding.colonizerLabel?.value ||
        binding.originLabel?.value
    ) || null;

  return {
    year,
    type,
    origin
  };
}

function conflictSort(a, b) {
  const yearA = a.startYear ?? Number.MAX_SAFE_INTEGER;
  const yearB = b.startYear ?? Number.MAX_SAFE_INTEGER;

  if (yearA !== yearB) {
    return yearA - yearB;
  }

  const endA = a.endYear ?? yearA;
  const endB = b.endYear ?? yearB;

  if (endA !== endB) {
    return endA - endB;
  }

  return a.name.localeCompare(b.name, "es");
}

async function fetchHistoryData(codes) {
  const historyByCode = {};

  for (const chunk of chunked(codes, 20)) {
    const query = `
      SELECT ?iso3 ?inception ?independenceDate ?startTime ?instanceLabel ?formOfGovernmentLabel ?statusLabel ?fromLabel ?partOfLabel ?colonizerLabel ?originLabel WHERE {
        VALUES ?iso3 { ${toSparqlValues(chunk)} }
        ?country wdt:P298 ?iso3.

        OPTIONAL { ?country wdt:P571 ?inception. }
        OPTIONAL { ?country wdt:P7471 ?independenceDate. }
        OPTIONAL { ?country wdt:P580 ?startTime. }
        OPTIONAL { ?country wdt:P31 ?instance. }
        OPTIONAL { ?country wdt:P122 ?formOfGovernment. }
        OPTIONAL { ?country wdt:P31 ?status. }
        OPTIONAL { ?country wdt:P155 ?from. }
        OPTIONAL { ?country wdt:P1365 ?partOf. }
        OPTIONAL { ?country wdt:P17 ?origin. }
        OPTIONAL { ?country wdt:P1366 ?colonizer. }

        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "es,en".
          ?instance rdfs:label ?instanceLabel.
          ?formOfGovernment rdfs:label ?formOfGovernmentLabel.
          ?status rdfs:label ?statusLabel.
          ?from rdfs:label ?fromLabel.
          ?partOf rdfs:label ?partOfLabel.
          ?colonizer rdfs:label ?colonizerLabel.
          ?origin rdfs:label ?originLabel.
        }
      }
    `;

    const json = await runSparqlQuery(query);

    for (const binding of json.results.bindings) {
      const code = binding.iso3?.value;

      if (!code || historyByCode[code]) {
        continue;
      }

      historyByCode[code] = buildHistoryRecord(binding);
    }
  }

  return historyByCode;
}

async function fetchCountryNames(codes) {
  const namesByCode = {};

  for (const chunk of chunked(codes, 25)) {
    const query = `
      SELECT ?iso3 ?countryLabel WHERE {
        VALUES ?iso3 { ${toSparqlValues(chunk)} }
        ?country wdt:P298 ?iso3.

        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "es,en".
          ?country rdfs:label ?countryLabel.
        }
      }
    `;

    const json = await runSparqlQuery(query);

    for (const binding of json.results.bindings) {
      const code = binding.iso3?.value;
      const label = binding.countryLabel?.value;

      if (!code || !label) {
        continue;
      }

      namesByCode[code] = label;
    }
  }

  return namesByCode;
}

async function parseCsvFromText(text) {
  return new Promise((resolve, reject) => {
    const rows = [];
    Readable.from([text])
      .pipe(csvParser())
      .on("data", row => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

async function fetchReligionDetails() {
  const populationCsv = fs.readFileSync("./data/raw/population.csv", "utf8");
  const populationRows = await parseCsvFromText(
    populationCsv.split(/\r?\n/).slice(4).join("\n")
  );
  const codeByCountryName = {};

  for (const row of populationRows) {
    if (row["Country Name"] && row["Country Code"]) {
      codeByCountryName[row["Country Name"]] = row["Country Code"];
    }
  }

  const religionCsv = await fetch(
    "https://raw.githubusercontent.com/datasets/world-religion-projections/main/rounded_percentage.csv"
  ).then(res => res.text());
  const religionRows = await parseCsvFromText(religionCsv);

  const religionByCode = {};
  const countryNameOverrides = {
    "Papua New Guinea": "PNG",
    Greenland: "GRL",
    "Falkland Islands": "FLK",
    "South Sudan": "SSD",
    "Western Sahara": "ESH",
    Swaziland: "SWZ",
    Bhutan: "BTN",
    Turkmenistan: "TKM",
    "East Timor": "TLS",
    "Solomon Islands": "SLB",
    Vanuatu: "VUT",
    Fiji: "FJI"
  };

  for (const row of religionRows) {
    if (row.Year !== "2010") {
      continue;
    }

    const code = codeByCountryName[row.Country] || countryNameOverrides[row.Country];

    if (!code) {
      continue;
    }

    const entries = [
      { name: "Budismo", percentage: Number(row.Buddhists) || 0 },
      { name: "Cristianismo", percentage: Number(row.Christians) || 0 },
      { name: "Religiones populares", percentage: Number(row["Folk Religions"]) || 0 },
      { name: "Hinduismo", percentage: Number(row.Hindus) || 0 },
      { name: "Judaismo", percentage: Number(row.Jews) || 0 },
      { name: "Islam", percentage: Number(row.Muslims) || 0 },
      { name: "Otras religiones", percentage: Number(row["Other Religions"]) || 0 },
      {
        name: "No afiliados / ateos / agnosticos",
        percentage: Number(row.Unaffiliated) || 0
      }
    ]
      .filter(entry => entry.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage);

    religionByCode[code] = {
      summary: null,
      composition: entries
    };
  }

  return religionByCode;
}

async function fetchCityDetails(codes) {
  const cityDetailsByCode = {};
  const populationCsv = fs.readFileSync("./data/raw/population.csv", "utf8");
  const populationRows = await parseCsvFromText(
    populationCsv.split(/\r?\n/).slice(4).join("\n")
  );
  const capitalsResponse = await fetch(
    "https://restcountries.com/v3.1/all?fields=cca3,name,capital,capitalInfo,population"
  ).then(res => res.json());

  const capitalNamesByCode = {};
  for (const item of capitalsResponse) {
    const code = item.cca3;
    if (!code) {
      continue;
    }
    capitalNamesByCode[code] = item.capital?.[0] ? translateCityName(item.capital[0]) : null;
    cityDetailsByCode[code] = cityDetailsByCode[code] || { capital: null, cities: [] };
    if (item.capital?.[0]) {
      cityDetailsByCode[code].capital = {
        name: translateCityName(item.capital[0]),
        population: null,
        isCapital: true
      };
    }
  }

  const cityCsv = await fetch(
    "https://raw.githubusercontent.com/datasets/population-city/master/data/unsd-citypopulation-year-both.csv"
  ).then(res => res.text());
  const cityRows = await parseCsvFromText(cityCsv);
  const codeByCountryName = {};

  for (const row of populationRows) {
    if (row["Country Name"] && row["Country Code"]) {
      codeByCountryName[row["Country Name"]] = row["Country Code"];
    }
  }

  Object.entries(existingCountryNames).forEach(([code, name]) => {
    codeByCountryName[name] = code;
  });
  Object.entries({
    "Papua New Guinea": "PNG",
    Greenland: "GRL",
    "Falkland Islands": "FLK",
    "South Sudan": "SSD",
    "Western Sahara": "ESH",
    Swaziland: "SWZ",
    Bhutan: "BTN",
    Turkmenistan: "TKM",
    "East Timor": "TLS",
    "Solomon Islands": "SLB",
    Vanuatu: "VUT",
    Fiji: "FJI",
    Bahamas: "BHS",
    Belize: "BLZ",
    Bermuda: "BMU",
    "Puerto Rico": "PRI",
    Antarctica: "ATA",
    "United States of America": "USA",
    "United Kingdom of Great Britain and Northern Ireland": "GBR",
    "Russian Federation": "RUS",
    "Republic of Korea": "KOR",
    "Korea, Republic of": "KOR",
    "Iran (Islamic Republic of)": "IRN",
    "Viet Nam": "VNM",
    "Syrian Arab Republic": "SYR",
    "Bolivia (Plurinational State of)": "BOL",
    "Venezuela (Bolivarian Republic of)": "VEN",
    "Lao People's Democratic Republic": "LAO",
    "Brunei Darussalam": "BRN",
    Czechia: "CZE"
  }).forEach(([name, code]) => {
    codeByCountryName[name] = code;
  });

  const bestByCountryCity = new Map();
  for (const row of cityRows) {
    const code = codeByCountryName[row["Country or Area"]];
    const cityName = translateCityName(row.City);
    const population = Number(row.Value) || null;
    const year = Number(row.Year) || null;

    if (!code || !cityName || !population || isLikelyAdministrativeArea(cityName)) {
      continue;
    }

    const key = `${code}|${cityName}`;
    const existing = bestByCountryCity.get(key);
    if (!existing || (year || 0) > (existing.year || 0)) {
      bestByCountryCity.set(key, {
        code,
        name: cityName,
        population,
        year
      });
    }
  }

  for (const entry of bestByCountryCity.values()) {
    cityDetailsByCode[entry.code] = cityDetailsByCode[entry.code] || { capital: null, cities: [] };
    const isCapital =
      capitalNamesByCode[entry.code] &&
      normalizeText(capitalNamesByCode[entry.code]) === normalizeText(entry.name);

    if (isCapital && cityDetailsByCode[entry.code].capital) {
      cityDetailsByCode[entry.code].capital.population = entry.population;
    } else {
      cityDetailsByCode[entry.code].cities.push({
        name: entry.name,
        population: entry.population,
        isCapital: false
      });
    }
  }

  for (const code of Object.keys(cityDetailsByCode)) {
    const capital = cityDetailsByCode[code].capital;
    const preferredNames = (base[code]?.cities || []).map(translateCityName);
    const dedupedCities = uniqueByKey(cityDetailsByCode[code].cities, city => normalizeText(city.name))
      .sort((a, b) => (b.population || 0) - (a.population || 0))
      .filter(city => !capital || normalizeText(city.name) !== normalizeText(capital.name));
    const preferredCities = preferredNames
      .map(name =>
        dedupedCities.find(city => normalizeText(city.name) === normalizeText(name))
      )
      .filter(Boolean);
    const remainingCities = dedupedCities.filter(
      city =>
        !preferredCities.some(preferred => normalizeText(preferred.name) === normalizeText(city.name))
    );
    const cities = uniqueByKey(
      [...preferredCities, ...remainingCities],
      city => normalizeText(city.name)
    ).slice(0, 5);

    cityDetailsByCode[code] = { capital, cities };
  }

  return cityDetailsByCode;
}

async function fetchConflictData(codes) {
  const conflictsByCode = {};

  for (const chunk of chunked(codes, 20)) {
    const query = `
      SELECT ?iso3 ?conflict ?conflictLabel ?start ?end WHERE {
        VALUES ?iso3 { ${toSparqlValues(chunk)} }
        ?country wdt:P298 ?iso3.
        ?conflict wdt:P710 ?country.
        ?conflict wdt:P31/wdt:P279* wd:Q350604.
        OPTIONAL { ?conflict wdt:P580 ?start. }
        OPTIONAL { ?conflict wdt:P582 ?end. }

        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "es,en".
          ?conflict rdfs:label ?conflictLabel.
        }
      }
    `;

    const json = await runSparqlQuery(query);

    for (const binding of json.results.bindings) {
      const code = binding.iso3?.value;
      const name = normalizeConflictName(binding.conflictLabel?.value);

      if (!code || !name) {
        continue;
      }

      const startYear = extractYear(binding.start?.value);
      const endYear = extractYear(binding.end?.value);

      if (!conflictsByCode[code]) {
        conflictsByCode[code] = [];
      }

      conflictsByCode[code].push({
        id: binding.conflict?.value || name,
        name,
        startYear,
        endYear,
        ongoing: Boolean(startYear && !endYear)
      });
    }
  }

  for (const code of Object.keys(conflictsByCode)) {
    conflictsByCode[code] = uniqueByKey(
      conflictsByCode[code],
      entry => entry.id || `${entry.name}|${entry.startYear}|${entry.endYear}`
    )
      .map(({ id, ...entry }) => entry)
      .sort(conflictSort);
  }

  return conflictsByCode;
}

async function fetchOrganizationMemberships(codes) {
  const membershipsByCode = {};

  for (const chunk of chunked(codes, 15)) {
    const query = `
      SELECT ?iso3 ?orgLabel ?abbr ?start ?end WHERE {
        VALUES ?iso3 { ${toSparqlValues(chunk)} }
        ?country wdt:P298 ?iso3.
        ?country p:P463 ?membershipStatement.
        ?membershipStatement ps:P463 ?org.
        OPTIONAL { ?membershipStatement pq:P580 ?start. }
        OPTIONAL { ?membershipStatement pq:P582 ?end. }
        OPTIONAL { ?org wdt:P1813 ?abbr. FILTER(LANG(?abbr) = "es" || LANG(?abbr) = "en" || LANG(?abbr) = "") }

        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "es,en".
          ?org rdfs:label ?orgLabel.
        }
      }
    `;

    const json = await runSparqlQuery(query);

    for (const binding of json.results.bindings) {
      const code = binding.iso3?.value;
      const orgName = binding.orgLabel?.value;

      if (!code || !orgName) {
        continue;
      }

      if (!membershipsByCode[code]) {
        membershipsByCode[code] = [];
      }

      membershipsByCode[code].push({
        name: translateOrganizationName(orgName),
        abbreviation: binding.abbr?.value || null,
        startYear: extractYear(binding.start?.value),
        endYear: extractYear(binding.end?.value)
      });
    }
  }

  for (const code of Object.keys(membershipsByCode)) {
    membershipsByCode[code] = uniqueByKey(
      membershipsByCode[code],
      entry => `${entry.name}|${entry.startYear || ""}|${entry.endYear || ""}`
    ).sort((a, b) => {
      const yearA = a.startYear ?? Number.MAX_SAFE_INTEGER;
      const yearB = b.startYear ?? Number.MAX_SAFE_INTEGER;
      if (yearA !== yearB) {
        return yearA - yearB;
      }
      return a.name.localeCompare(b.name, "es");
    });
  }

  return membershipsByCode;
}

async function fetchRivalsFromConflicts(codes) {
  const rivalsByCode = {};

  for (const chunk of chunked(codes, 10)) {
    const query = `
      SELECT ?iso3 ?otherIso3 ?otherLabel ?start ?end WHERE {
        VALUES ?iso3 { ${toSparqlValues(chunk)} }
        ?country wdt:P298 ?iso3.
        ?conflict wdt:P710 ?country.
        ?conflict wdt:P31/wdt:P279* wd:Q350604.
        ?conflict wdt:P710 ?otherCountry.
        ?otherCountry wdt:P298 ?otherIso3.
        FILTER(?otherCountry != ?country)
        OPTIONAL { ?conflict wdt:P580 ?start. }
        OPTIONAL { ?conflict wdt:P582 ?end. }

        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "es,en".
          ?otherCountry rdfs:label ?otherLabel.
        }
      }
    `;

    const json = await runSparqlQuery(query);

    for (const binding of json.results.bindings) {
      const code = binding.iso3?.value;
      const otherCode = binding.otherIso3?.value;
      const otherLabel = binding.otherLabel?.value;

      if (!code || !otherCode || !otherLabel) {
        continue;
      }

      if (!rivalsByCode[code]) {
        rivalsByCode[code] = [];
      }

      rivalsByCode[code].push({
        code: otherCode,
        name: otherLabel,
        type: binding.end?.value ? "historico" : "actual",
        startYear: extractYear(binding.start?.value)
      });
    }
  }

  for (const code of Object.keys(rivalsByCode)) {
    const grouped = new Map();

    for (const rival of rivalsByCode[code]) {
      const existing = grouped.get(rival.code);

      if (!existing) {
        grouped.set(rival.code, { ...rival });
        continue;
      }

      if (rival.type === "actual") {
        existing.type = "actual";
      }

      const currentYear = rival.startYear ?? Number.MAX_SAFE_INTEGER;
      const existingYear = existing.startYear ?? Number.MAX_SAFE_INTEGER;
      if (currentYear < existingYear) {
        existing.startYear = rival.startYear;
      }
    }

    rivalsByCode[code] = Array.from(grouped.values()).sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "actual" ? -1 : 1;
      }

      const yearA = a.startYear ?? Number.MAX_SAFE_INTEGER;
      const yearB = b.startYear ?? Number.MAX_SAFE_INTEGER;
      if (yearA !== yearB) {
        return yearA - yearB;
      }

      return a.name.localeCompare(b.name, "es");
    });
  }

  return rivalsByCode;
}

function mergeHistory(existing, fetched) {
  const result = { ...existing };

  for (const code of isoCodes) {
    const current = existing[code];
    const incoming = fetched[code];

    const territoryDefault = TERRITORY_DEFAULTS[code]?.history;

    if (!incoming && !territoryDefault) {
      continue;
    }

    result[code] = {
      year: current?.year ?? incoming?.year ?? territoryDefault?.year ?? null,
      type: current?.type
        ? translateHistoryText(current.type)
        : incoming?.type ?? territoryDefault?.type ?? null,
      origin: current?.origin
        ? translateHistoryText(current.origin)
        : incoming?.origin ?? territoryDefault?.origin ?? null
    };
  }

  return result;
}

function mergeConflicts(fetched, historyByCode) {
  const result = {};

  for (const code of isoCodes) {
    const formationYear = historyByCode[code]?.year || null;
    const legacyEntries = (base[code]?.conflicts || [])
      .map(parseLegacyConflict)
      .filter(Boolean);
    const fetchedEntries = fetched[code] || [];

    const merged = uniqueByKey(
      [...legacyEntries, ...fetchedEntries],
      entry => `${entry.name}|${entry.startYear ?? ""}|${entry.endYear ?? ""}`
    )
      .filter(entry => {
        if (!formationYear || !entry.startYear) {
          return true;
        }

        return entry.startYear >= formationYear;
      })
      .sort(conflictSort);

    result[code] = merged;
  }

  return result;
}

const fetchedHistory = await fetchHistoryData(isoCodes);
const fetchedCountryNames = await fetchCountryNames(isoCodes);
const mergedHistory = mergeHistory(existingHistory, fetchedHistory);
const fetchedConflicts = await fetchConflictData(isoCodes);
const mergedConflicts = mergeConflicts(fetchedConflicts, mergedHistory);
const fetchedMemberships = await fetchOrganizationMemberships(isoCodes);
const fetchedRivals = await fetchRivalsFromConflicts(isoCodes);
const fetchedReligionDetails = await fetchReligionDetails();
const fetchedCityDetails = await fetchCityDetails(isoCodes);
const mergedCountryNames = { ...existingCountryNames, ...fetchedCountryNames };
const mergedPoliticsDetails = {};
const mergedReligionDetails = { ...existingReligionDetails, ...fetchedReligionDetails };
const mergedCityDetails = { ...existingCityDetails, ...fetchedCityDetails };

for (const code of isoCodes) {
  mergedPoliticsDetails[code] = {
    organizations: fetchedMemberships[code] || existingPoliticsDetails[code]?.organizations || [],
    rivals: [
      ...((base[code]?.rivals || []).map(name => ({ name, type: "historico" }))),
      ...((fetchedRivals[code] || []).map(entry => ({
        name: existingCountryNames[entry.code] || fetchedCountryNames[entry.code] || entry.name,
        type: entry.type
      })))
    ]
  };

  mergedPoliticsDetails[code].rivals = uniqueByKey(
    mergedPoliticsDetails[code].rivals,
    rival => `${rival.name}|${rival.type}`
  );

  if (!mergedPoliticsDetails[code].organizations.length && TERRITORY_DEFAULTS[code]?.politics) {
    mergedPoliticsDetails[code].organizations = [];
  }

  if (!mergedPoliticsDetails[code].system && TERRITORY_DEFAULTS[code]?.politics?.system) {
    mergedPoliticsDetails[code].system = TERRITORY_DEFAULTS[code].politics.system;
  }

  if (!mergedReligionDetails[code] && TERRITORY_DEFAULTS[code]?.religion) {
    mergedReligionDetails[code] = TERRITORY_DEFAULTS[code].religion;
  }

  if (!mergedCityDetails[code] && TERRITORY_DEFAULTS[code]?.cityDetails) {
    mergedCityDetails[code] = TERRITORY_DEFAULTS[code].cityDetails;
  }
}

fs.writeJsonSync("./data/raw/history.json", mergedHistory, { spaces: 2 });
fs.writeJsonSync("./data/raw/conflicts.json", mergedConflicts, { spaces: 2 });
fs.writeJsonSync("./data/raw/country_names.json", mergedCountryNames, { spaces: 2 });
fs.writeJsonSync("./data/raw/politics_details.json", mergedPoliticsDetails, { spaces: 2 });
fs.writeJsonSync("./data/raw/religion_details.json", mergedReligionDetails, { spaces: 2 });
fs.writeJsonSync("./data/raw/city_details.json", mergedCityDetails, { spaces: 2 });

console.log(
  `Referencia enriquecida: ${Object.keys(mergedHistory).length} historias, ${Object.keys(mergedConflicts).length} listas de conflictos, ${Object.keys(mergedCountryNames).length} nombres de países, ${Object.keys(mergedPoliticsDetails).length} fichas políticas, ${Object.keys(mergedReligionDetails).length} fichas religiosas y ${Object.keys(mergedCityDetails).length} fichas urbanas.`
);
