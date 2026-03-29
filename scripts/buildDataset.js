import fs from "fs-extra";
import csvParser from "csv-parser";

const YEAR_COLUMNS = Array.from({ length: 2025 - 1960 + 1 }, (_, index) =>
  String(2025 - index)
);

const COUNTRY_NAME_OVERRIDES = {
  PNG: "Papua Nueva Guinea",
  GRL: "Groenlandia",
  FLK: "Islas Malvinas",
  SSD: "Sudan del Sur",
  ESH: "Sahara Occidental",
  SWZ: "Esuatini",
  "CS-KM": "Kosovo",
  TKM: "Turkmenistan",
  BTN: "Butan",
  TLS: "Timor Oriental",
  SLB: "Islas Salomon",
  NCL: "Nueva Caledonia",
  VUT: "Vanuatu",
  FJI: "Fiyi",
  BHS: "Bahamas",
  BLZ: "Belice",
  BMU: "Bermudas",
  GUF: "Guayana Francesa",
  PRI: "Puerto Rico",
  PSE: "Cisjordania",
  ATA: "Antartida",
  ATF: "Tierras Australes y Antarticas Francesas",
  "-99": "Somalilandia"
};

const CONTINENT_OVERRIDES = {
  PNG: "Oceania",
  GRL: "America",
  FLK: "America",
  SSD: "Africa",
  ESH: "Africa",
  SWZ: "Africa",
  "CS-KM": "Europe",
  TKM: "Asia",
  BTN: "Asia",
  TLS: "Asia",
  SLB: "Oceania",
  NCL: "Oceania",
  VUT: "Oceania",
  FJI: "Oceania",
  BHS: "America",
  BLZ: "America",
  BMU: "America",
  GUF: "America",
  PRI: "America",
  PSE: "Asia",
  ATA: "Antarctica",
  ATF: "Antarctica",
  "-99": "Africa"
};

const HISTORY_OVERRIDES = {
  AND: { year: 1278, type: "legal" },
  ARE: { year: 1971, type: "union" },
  BHS: { year: 1973, type: "independencia", origin: "Reino Unido" },
  BIH: { year: 1992, type: "disolucion de otro estado" },
  BLZ: { year: 1981, type: "independencia", origin: "Reino Unido" },
  BMU: { year: 1609, type: "legal", origin: "Reino Unido" },
  BTN: { year: 1907, type: "legal" },
  COD: { year: 1960, type: "independencia" },
  COG: { year: 1960, type: "independencia" },
  CZE: { year: 1993, type: "disolucion de otro estado" },
  DEU: { year: 1990, type: "union" },
  DNK: { year: 965, type: "legal" },
  FJI: { year: 1970, type: "independencia" },
  FRA: { year: 1958, type: "legal" },
  GBR: { year: 1707, type: "union" },
  GMB: { year: 1965, type: "independencia" },
  GRL: { year: 1979, type: "legal" },
  HTI: { year: 1804, type: "independencia", origin: "Francia" },
  HUN: { year: 1989, type: "legal" },
  KGZ: { year: 1991, type: "disolucion de otro estado" },
  LAO: { year: 1953, type: "independencia" },
  MAR: { year: 1956, type: "independencia" },
  MKD: { year: 1991, type: "disolucion de otro estado" },
  MMR: { year: 1948, type: "independencia" },
  NCL: { year: 1853, type: "legal" },
  NLD: { year: 1815, type: "legal", origin: "Republica de las Provincias Unidas" },
  NOR: { year: 1905, type: "legal" },
  PNG: { year: 1975, type: "independencia", origin: "Australia" },
  PRT: { year: 1143, type: "independencia" },
  PSE: { year: 1988, type: "legal", origin: "Mandato britanico de Palestina" },
  RUS: { year: 1991, type: "disolucion de otro estado" },
  SLB: { year: 1978, type: "independencia" },
  SOM: { year: 1960, type: "union" },
  SSD: { year: 2011, type: "independencia" },
  SVK: { year: 1993, type: "disolucion de otro estado" },
  SWE: { year: 1523, type: "independencia", origin: "Union de Kalmar" },
  SWZ: { year: 1968, type: "independencia" },
  SYR: { year: 1946, type: "independencia" },
  TKM: { year: 1991, type: "disolucion de otro estado" },
  TLS: { year: 2002, type: "independencia" },
  TWN: { year: 1949, type: "guerra civil" },
  TZA: { year: 1964, type: "union" },
  VNM: { year: 1976, type: "union" },
  VEN: { year: 1811, type: "independencia" },
  VUT: { year: 1980, type: "independencia" },
  YEM: { year: 1990, type: "union" }
};

const ENTITY_FALLBACKS = {
  USA: {
    replaceCities: true,
    capital: { name: "Washington D. C.", population: 689545, isCapital: true },
    cities: [
      { name: "Nueva York", population: 8258035, isCapital: false },
      { name: "Los Angeles", population: 3820914, isCapital: false },
      { name: "Chicago", population: 2664452, isCapital: false },
      { name: "Houston", population: 2314157, isCapital: false },
      { name: "Phoenix", population: 1650070, isCapital: false }
    ]
  },
  GBR: {
    replaceCities: true,
    capital: { name: "Londres", population: 8135667, isCapital: true },
    cities: [
      { name: "Birmingham", population: 1085810, isCapital: false },
      { name: "Manchester", population: 552858, isCapital: false },
      { name: "Glasgow", population: 635640, isCapital: false },
      { name: "Liverpool", population: 496784, isCapital: false },
      { name: "Leeds", population: 536280, isCapital: false }
    ]
  },
  PRI: {
    population: 3203295,
    geography: "Archipielago del Caribe",
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
    capital: { name: "San Juan", population: 333005, isCapital: true },
    cities: [
      { name: "Bayamon", population: 180835, isCapital: false },
      { name: "Carolina", population: 150843, isCapital: false },
      { name: "Ponce", population: 130251, isCapital: false },
      { name: "Caguas", population: 124608, isCapital: false },
      { name: "Guaynabo", population: 89039, isCapital: false }
    ]
  },
  ATA: {
    population: 1106,
    geography: "Continente polar antartico",
    history: { year: 1959, type: "territorio antartico", origin: "Tratado Antartico" },
    politics: { system: "territorio antartico administrado por el Sistema del Tratado Antartico" },
    religion: {
      summary: "Sin religion predominante",
      composition: [{ name: "No afiliados / ateos / agnosticos", percentage: 100 }]
    },
    capital: { name: "Sin capital oficial", population: null, isCapital: true },
    cities: [
      { name: "Estacion McMurdo", population: 1200, isCapital: false },
      { name: "Base Esperanza", population: 70, isCapital: false }
    ]
  },
  GUF: {
    population: 313189,
    geography: "Selva amazonica y costa atlantica",
    history: { year: 1946, type: "departamento de ultramar", origin: "Francia" },
    politics: { system: "departamento y region de ultramar de Francia" },
    religion: {
      summary: "Cristianismo",
      composition: [
        { name: "Cristianismo", percentage: 84 },
        { name: "No afiliados / ateos / agnosticos", percentage: 10 },
        { name: "Otras religiones", percentage: 6 }
      ]
    },
    capital: { name: "Cayena", population: 61550, isCapital: true },
    cities: [
      { name: "Saint-Laurent-du-Maroni", population: 49500, isCapital: false },
      { name: "Kourou", population: 25200, isCapital: false }
    ]
  },
  ATF: {
    population: 120,
    geography: "Territorios subantarticos e islas australes",
    history: {
      year: 1955,
      type: "territorio frances de ultramar",
      origin: "Francia"
    },
    politics: { system: "territorio frances de ultramar administrado por Francia" },
    religion: {
      summary: "Sin religion predominante",
      composition: [{ name: "No afiliados / ateos / agnosticos", percentage: 100 }]
    },
    capital: { name: "Port-aux-Francais", population: 120, isCapital: true },
    cities: [{ name: "Martin-de-Vivies", population: 30, isCapital: false }]
  },
  FLK: {
    population: 3662,
    geography: "Archipielago del Atlantico Sur",
    history: {
      year: 1833,
      type: "territorio britanico de ultramar",
      origin: "Reino Unido"
    },
    politics: { system: "territorio britanico de ultramar" },
    religion: {
      summary: "Cristianismo",
      composition: [
        { name: "Cristianismo", percentage: 82 },
        { name: "No afiliados / ateos / agnosticos", percentage: 18 }
      ]
    },
    capital: { name: "Stanley", population: 2460, isCapital: true },
    cities: [{ name: "Monte Agradable", population: 1300, isCapital: false }]
  },
  BHS: {
    religion: {
      summary: "Cristianismo",
      composition: [
        { name: "Cristianos", percentage: 90.6 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 7.9 },
        { name: "Otras religiones", percentage: 1.5 }
      ]
    }
  },
  BRN: {
    religion: {
      summary: "Islam (Sunismo)",
      composition: [
        { name: "Musulmanes sunitas", percentage: 81 },
        { name: "Budistas", percentage: 7 },
        { name: "Cristianos", percentage: 7 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 5 }
      ]
    }
  },
  "CS-KM": {
    population: 1756374,
    geography: "Balcanes centrales",
    history: { year: 2008, type: "republica parlamentaria", origin: "Serbia" },
    politics: { system: "republica parlamentaria" },
    religion: {
      summary: "Islam",
      composition: [
        { name: "Islam", percentage: 95.6 },
        { name: "Cristianismo", percentage: 3.7 },
        { name: "No afiliados / ateos / agnosticos", percentage: 0.7 }
      ]
    },
    capital: { name: "Pristina", population: 227466, isCapital: true },
    cities: [
      { name: "Prizren", population: 177781, isCapital: false },
      { name: "Ferizaj", population: 108690, isCapital: false },
      { name: "Peja", population: 82745, isCapital: false }
    ]
  },
  "-99": {
    population: 6200000,
    geography: "Cuerno de Africa",
    history: {
      year: 1991,
      type: "estado con reconocimiento limitado",
      origin: "Somalia"
    },
    politics: { system: "republica presidencialista con reconocimiento limitado" },
    religion: {
      summary: "Islam",
      composition: [
        { name: "Islam", percentage: 99 },
        { name: "Cristianismo", percentage: 0.5 },
        { name: "No afiliados / ateos / agnosticos", percentage: 0.5 }
      ]
    },
    capital: { name: "Hargeisa", population: 1200000, isCapital: true },
    cities: [
      { name: "Burao", population: 330000, isCapital: false },
      { name: "Berbera", population: 242000, isCapital: false },
      { name: "Borama", population: 215000, isCapital: false }
    ]
  },
  ESH: {
    population: 652271,
    geography: "Desierto costero del Sahara Occidental",
    history: {
      year: 1976,
      type: "territorio disputado",
      origin: "Sahara Espanol"
    },
    politics: { system: "territorio disputado" },
    religion: {
      summary: "Islam",
      composition: [
        { name: "Islam", percentage: 99 },
        { name: "No afiliados / ateos / agnosticos", percentage: 1 }
      ]
    },
    capital: { name: "El Aaiun", population: 217732, isCapital: true },
    cities: [
      { name: "Dajla", population: 106277, isCapital: false },
      { name: "Smara", population: 57035, isCapital: false }
    ]
  },
  TWN: {
    population: 23420442,
    geography: "Isla montanosa del Pacifico occidental",
    history: {
      year: 1949,
      type: "republica semipresidencialista",
      origin: "Republica de China"
    },
    politics: { system: "republica semipresidencialista" },
    religion: {
      summary: "Religiones populares y budismo",
      composition: [
        { name: "Religiones populares", percentage: 43.8 },
        { name: "Budismo", percentage: 21.2 },
        { name: "No afiliados / ateos / agnosticos", percentage: 13.7 },
        { name: "Cristianismo", percentage: 5.8 },
        { name: "Otras religiones", percentage: 15.5 }
      ]
    },
    capital: { name: "Taipéi", population: 2489394, isCapital: true },
    cities: [
      { name: "Kaohsiung", population: 2739661, isCapital: false },
      { name: "Taichung", population: 2820143, isCapital: false },
      { name: "Tainan", population: 1850000, isCapital: false }
    ]
  },
  COD: {
    religion: {
      summary: "Cristianismo (Catolicismo y Protestantismo)",
      composition: [
        { name: "Catolicos", percentage: 43 },
        { name: "Protestantes y evangelicos", percentage: 32 },
        { name: "Cristianos kimbanguistas y otros", percentage: 10 },
        { name: "Religiones animistas y populares", percentage: 11 },
        { name: "Musulmanes", percentage: 2 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 2 }
      ]
    }
  },
  VNM: {
    religion: {
      summary: "Religiones populares y Budismo",
      composition: [
        { name: "Religiones animistas y populares", percentage: 45.3 },
        { name: "Budistas", percentage: 16.4 },
        { name: "Cristianos", percentage: 8.2 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 29.1 },
        { name: "Otras religiones", percentage: 1 }
      ]
    }
  },
  MMR: {
    religion: {
      summary: "Budismo",
      composition: [
        { name: "Budistas", percentage: 87.9 },
        { name: "Cristianos", percentage: 6.2 },
        { name: "Musulmanes sunitas", percentage: 4.3 },
        { name: "Religiones animistas y populares", percentage: 1 },
        { name: "Hindues", percentage: 0.5 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.1 }
      ]
    }
  },
  YEM: {
    religion: {
      summary: "Islam (Sunismo y Chiismo)",
      composition: [
        { name: "Musulmanes sunitas", percentage: 65 },
        { name: "Musulmanes chiitas", percentage: 34 },
        { name: "Cristianos", percentage: 0.5 },
        { name: "Hindues", percentage: 0.3 },
        { name: "Judios", percentage: 0.1 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.1 }
      ]
    }
  },
  CIV: {
    religion: {
      summary: "Islam y Cristianismo",
      composition: [
        { name: "Musulmanes sunitas", percentage: 42.9 },
        { name: "Cristianos", percentage: 39.8 },
        { name: "Religiones animistas y populares", percentage: 12.6 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 4.7 }
      ]
    }
  },
  VEN: {
    religion: {
      summary: "Cristianismo (Catolicismo)",
      composition: [
        { name: "Catolicos", percentage: 71 },
        { name: "Protestantes y evangelicos", percentage: 17 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 8 },
        { name: "Religiones animistas y populares", percentage: 2 },
        { name: "Otras religiones", percentage: 2 }
      ]
    }
  },
  SYR: {
    religion: {
      summary: "Islam (Sunismo)",
      composition: [
        { name: "Musulmanes sunitas", percentage: 74 },
        { name: "Musulmanes chiitas y alauitas", percentage: 13 },
        { name: "Cristianos", percentage: 10 },
        { name: "Drusos", percentage: 3 }
      ]
    }
  },
  SOM: {
    religion: {
      summary: "Islam (Sunismo)",
      composition: [
        { name: "Musulmanes sunitas", percentage: 99 },
        { name: "Cristianos", percentage: 0.5 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.5 }
      ]
    }
  },
  CZE: {
    religion: {
      summary: "Sin afiliacion religiosa",
      composition: [
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 72 },
        { name: "Catolicos", percentage: 18 },
        { name: "Protestantes", percentage: 4 },
        { name: "Otros cristianos", percentage: 3 },
        { name: "Otras religiones", percentage: 3 }
      ]
    }
  },
  LAO: {
    religion: {
      summary: "Budismo",
      composition: [
        { name: "Budistas", percentage: 66 },
        { name: "Religiones animistas y populares", percentage: 30.7 },
        { name: "Cristianos", percentage: 1.5 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 1.8 }
      ]
    }
  },
  KGZ: {
    religion: {
      summary: "Islam (Sunismo)",
      composition: [
        { name: "Musulmanes sunitas", percentage: 88 },
        { name: "Cristianos ortodoxos", percentage: 9 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 2 },
        { name: "Otras religiones", percentage: 1 }
      ]
    }
  },
  COG: {
    religion: {
      summary: "Cristianismo",
      composition: [
        { name: "Catolicos", percentage: 33 },
        { name: "Protestantes y evangelicos", percentage: 52 },
        { name: "Religiones animistas y populares", percentage: 8 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 5 },
        { name: "Musulmanes", percentage: 2 }
      ]
    }
  },
  SVK: {
    religion: {
      summary: "Cristianismo (Catolicismo)",
      composition: [
        { name: "Catolicos", percentage: 55.8 },
        { name: "Protestantes", percentage: 9.3 },
        { name: "Cristianos ortodoxos", percentage: 4.1 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 28.3 },
        { name: "Otras religiones", percentage: 2.5 }
      ]
    }
  },
  PSE: {
    religion: {
      summary: "Islam (Sunismo)",
      composition: [
        { name: "Musulmanes sunitas", percentage: 96.5 },
        { name: "Cristianos", percentage: 2.5 },
        { name: "Drusos", percentage: 0.5 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.5 }
      ]
    }
  },
  BIH: {
    religion: {
      summary: "Islam, Cristianismo ortodoxo y Catolicismo",
      composition: [
        { name: "Musulmanes sunitas", percentage: 50.7 },
        { name: "Cristianos ortodoxos", percentage: 30.7 },
        { name: "Catolicos", percentage: 15.2 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 3.4 }
      ]
    }
  },
  GMB: {
    religion: {
      summary: "Islam (Sunismo)",
      composition: [
        { name: "Musulmanes sunitas", percentage: 95.7 },
        { name: "Cristianos", percentage: 4.2 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.1 }
      ]
    }
  },
  MKD: {
    religion: {
      summary: "Cristianismo ortodoxo e Islam",
      composition: [
        { name: "Cristianos ortodoxos", percentage: 58.6 },
        { name: "Musulmanes sunitas", percentage: 39.3 },
        { name: "Catolicos", percentage: 0.4 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 1.7 }
      ]
    }
  }
};

function readJson(path) {
  if (!fs.existsSync(path)) {
    return {};
  }

  return fs.readJsonSync(path);
}

function pickLatestNumericValue(row) {
  for (const year of YEAR_COLUMNS) {
    const rawValue = row[year];

    if (rawValue === undefined || rawValue === null || rawValue === "") {
      continue;
    }

    const numericValue = Number(String(rawValue).replace(/,/g, ""));

    if (!Number.isNaN(numericValue)) {
      return numericValue;
    }
  }

  return null;
}

function parseIndicatorCsv(path) {
  return new Promise((resolve, reject) => {
    const result = {};

    fs.createReadStream(path)
      .pipe(csvParser({ skipLines: 4 }))
      .on("data", row => {
        const code = row["Country Code"];

        if (!code) {
          return;
        }

        result[code] = {
          name: row["Country Name"] || code,
          value: pickLatestNumericValue(row)
        };
      })
      .on("end", () => resolve(result))
      .on("error", reject);
  });
}

function compactList(list) {
  return Array.isArray(list) ? list.filter(Boolean) : [];
}

function compactNumber(value) {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function normalizeKey(value) {
  return String(value || "")
    .replace(/\s*\([A-Z]{2,}\)\s*$/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizeYear(year, fallbackYear = null) {
  if (typeof year !== "number" || Number.isNaN(year) || year < 1400 || year > 2100) {
    return fallbackYear;
  }

  return year;
}

function normalizeFormationLabel(value) {
  const normalized = normalizeKey(value);

  if (!normalized) {
    return null;
  }

  if (
    normalized.includes("independ") ||
    normalized.includes("colonia") ||
    normalized.includes("protectorado")
  ) {
    return "independencia";
  }

  if (normalized.includes("union") || normalized.includes("reunif")) {
    return "union";
  }

  if (
    normalized.includes("soviet") ||
    normalized.includes("yugoslav") ||
    normalized.includes("checoslova") ||
    normalized.includes("disol")
  ) {
    return "disolucion de otro estado";
  }

  if (normalized.includes("revolu")) {
    return "revolucion";
  }

  if (normalized.includes("guerra civil")) {
    return "guerra civil";
  }

  if (
    normalized.includes("territorio") ||
    normalized.includes("departamento") ||
    normalized.includes("monarquia") ||
    normalized.includes("republica") ||
    normalized.includes("coprincipado") ||
    normalized.includes("pais")
  ) {
    return "legal";
  }

  return null;
}

function formatFormationType(value) {
  const labels = {
    independencia: "Independencia",
    union: "Union",
    "disolucion de otro estado": "Disolucion de otro estado",
    revolucion: "Revolucion",
    "guerra civil": "Guerra civil",
    legal: "Legal y pacifica"
  };

  return labels[value] || "Legal y pacifica";
}

function buildCityList(...lists) {
  const seen = new Set();
  const result = [];

  lists.flat().forEach(entry => {
    if (!entry) {
      return;
    }

    const normalizedEntry =
      typeof entry === "string"
        ? { name: entry, population: null, isCapital: false }
        : {
            name: entry.name || null,
            population: compactNumber(entry.population),
            isCapital: Boolean(entry.isCapital)
          };

    if (!normalizedEntry.name) {
      return;
    }

    const key = normalizeKey(normalizedEntry.name);

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    result.push(normalizedEntry);
  });

  return result;
}

const RELIGION_DETAIL_OVERRIDES = {
  ARG: [
    { name: "Catolicos", percentage: 62.9 },
    { name: "Protestantes y evangelicos", percentage: 15.3 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 18.9 },
    { name: "Judios", percentage: 1.2 },
    { name: "Musulmanes", percentage: 0.9 },
    { name: "Otras religiones", percentage: 0.8 }
  ],
  USA: [
    { name: "Protestantes y evangelicos", percentage: 46.6 },
    { name: "Catolicos", percentage: 23.5 },
    { name: "Mormones", percentage: 1.7 },
    { name: "Judios", percentage: 1.8 },
    { name: "Budistas", percentage: 1.2 },
    { name: "Musulmanes", percentage: 1 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 23.2 }
  ],
  GBR: [
    { name: "Anglicanos", percentage: 33 },
    { name: "Catolicos", percentage: 8.9 },
    { name: "Otros cristianos", percentage: 22.4 },
    { name: "Musulmanes sunitas", percentage: 4.8 },
    { name: "Hindues", percentage: 1.4 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 29.5 }
  ],
  FRA: [
    { name: "Catolicos", percentage: 47 },
    { name: "Otros cristianos", percentage: 16 },
    { name: "Musulmanes sunitas", percentage: 7.5 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 28 },
    { name: "Judios", percentage: 1.5 }
  ],
  DEU: [
    { name: "Catolicos", percentage: 28.5 },
    { name: "Protestantes", percentage: 27.2 },
    { name: "Cristianos ortodoxos", percentage: 4.5 },
    { name: "Musulmanes sunitas", percentage: 5.8 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 34 }
  ],
  JPN: [
    { name: "Sintoistas", percentage: 48 },
    { name: "Budistas", percentage: 36.2 },
    { name: "Cristianos", percentage: 1.6 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 14.2 }
  ],
  IND: [
    { name: "Hindues", percentage: 79.5 },
    { name: "Musulmanes sunitas", percentage: 14.4 },
    { name: "Cristianos", percentage: 2.5 },
    { name: "Sijs", percentage: 1.7 },
    { name: "Budistas", percentage: 0.7 },
    { name: "Jainistas", percentage: 0.4 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.8 }
  ],
  RUS: [
    { name: "Cristianos ortodoxos", percentage: 42.5 },
    { name: "Musulmanes sunitas", percentage: 6.5 },
    { name: "Otros cristianos", percentage: 1.5 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 49.5 }
  ]
};

function expandReligionComposition(code, summary, composition) {
  if (RELIGION_DETAIL_OVERRIDES[code]) {
    return RELIGION_DETAIL_OVERRIDES[code];
  }

  const summaryText = normalizeKey(summary);

  return composition.map(entry => {
    if (!entry?.name) {
      return entry;
    }

    const normalizedName = normalizeKey(entry.name);

    if (normalizedName === "cristianismo") {
      if (summaryText.includes("catolic")) {
        return { ...entry, name: "Catolicos" };
      }
      if (summaryText.includes("protest")) {
        return { ...entry, name: "Protestantes" };
      }
      if (summaryText.includes("ortodox")) {
        return { ...entry, name: "Cristianos ortodoxos" };
      }
      if (summaryText.includes("anglican")) {
        return { ...entry, name: "Anglicanos" };
      }
      return { ...entry, name: "Cristianos" };
    }

    if (normalizedName === "islam") {
      if (summaryText.includes("chiit")) {
        return { ...entry, name: "Musulmanes chiitas" };
      }
      if (summaryText.includes("suni")) {
        return { ...entry, name: "Musulmanes sunitas" };
      }
      return { ...entry, name: "Musulmanes" };
    }

    if (normalizedName === "budismo") {
      return { ...entry, name: "Budistas" };
    }

    if (normalizedName === "hinduismo") {
      return { ...entry, name: "Hindues" };
    }

    if (normalizedName === "judaismo") {
      return { ...entry, name: "Judios" };
    }

    if (normalizedName === "religiones populares") {
      if (code === "JPN" || summaryText.includes("sinto")) {
        return { ...entry, name: "Sintoistas" };
      }
      return { ...entry, name: "Religiones animistas y populares" };
    }

    if (normalizedName === "no afiliados / ateos / agnosticos") {
      return { ...entry, name: "Ateos / agnosticos / sin afiliacion" };
    }

    return entry;
  });
}

function normalizeConflicts(conflictEntries) {
  if (!Array.isArray(conflictEntries)) {
    return [];
  }

  return conflictEntries
    .map(entry => {
      if (!entry) {
        return null;
      }

      if (typeof entry === "string") {
        return {
          name: entry,
          startYear: null,
          endYear: null,
          ongoing: false
        };
      }

      return {
        name: entry.name || null,
        startYear: entry.startYear ?? null,
        endYear: entry.endYear ?? null,
        ongoing: Boolean(entry.ongoing)
      };
    })
    .filter(entry => entry?.name);
}

const base = readJson("./data/raw/countries_base.json");
const continents = readJson("./data/raw/continents.json");
const history = readJson("./data/raw/history.json");
const countryNames = readJson("./data/raw/country_names.json");
const cityDetails = readJson("./data/raw/city_details.json");
const politics = readJson("./data/raw/politics.json");
const politicsDetails = readJson("./data/raw/politics_details.json");
const religion = readJson("./data/raw/religion.json");
const religionDetails = readJson("./data/raw/religion_details.json");
const military = readJson("./data/raw/military.json");
const conflicts = readJson("./data/raw/conflicts.json");
const inflation = readJson("./data/raw/inflation.json");

const continentByCode = Object.fromEntries(
  continents.map(entry => [entry.code, entry.continent])
);

const [populationByCode, gdpByCode, gdpPerCapitaByCode] = await Promise.all([
  parseIndicatorCsv("./data/raw/population.csv"),
  parseIndicatorCsv("./data/raw/worldbank_gdp.csv"),
  parseIndicatorCsv("./data/raw/gdp_per_capita.csv")
]);

const allCodes = Array.from(
  new Set([
  ...Object.keys(continentByCode),
  ...Object.keys(base),
  ...Object.keys(history),
  ...Object.keys(countryNames),
  ...Object.keys(cityDetails),
  ...Object.keys(COUNTRY_NAME_OVERRIDES),
  ...Object.keys(CONTINENT_OVERRIDES),
  ...Object.keys(politics),
  ...Object.keys(politicsDetails),
  ...Object.keys(religion),
  ...Object.keys(religionDetails),
  ...Object.keys(military),
  ...Object.keys(conflicts),
  ...Object.keys(inflation),
  ...Object.keys(populationByCode),
  ...Object.keys(gdpByCode),
  ...Object.keys(gdpPerCapitaByCode)
  ])
).filter(
  code =>
    (/^[A-Z]{3}$/.test(code) || Boolean(COUNTRY_NAME_OVERRIDES[code]) || Boolean(CONTINENT_OVERRIDES[code])) &&
    (Boolean(continentByCode[code]) ||
      Boolean(base[code]) ||
      Boolean(countryNames[code]) ||
      Boolean(COUNTRY_NAME_OVERRIDES[code]) ||
      Boolean(CONTINENT_OVERRIDES[code]))
);

const result = {};

for (const code of allCodes) {
  const baseData = base[code] || {};
  const historyData = history[code] || null;
  const militaryData = military[code] || null;
  const politicsData = politicsDetails[code] || {};
  const religionData = religionDetails[code] || {};
  const cityData = cityDetails[code] || {};
  const populationData = populationByCode[code] || null;
  const gdpData = gdpByCode[code] || null;
  const gdpPerCapitaData = gdpPerCapitaByCode[code] || null;
  const fallback = ENTITY_FALLBACKS[code] || {};
  const capital = cityData.capital
    ? {
        ...fallback.capital,
        ...cityData.capital,
        population: cityData.capital.population ?? fallback.capital?.population ?? null
      }
    : fallback.capital ||
      (baseData.cities?.[0]
        ? { name: baseData.cities[0], population: null, isCapital: true }
        : null);
  const baseCityFallback =
    compactList(cityData.cities).length >= 3 ? [] : compactList(baseData.cities).slice(capital ? 1 : 0);
  const primaryCitySource = fallback.replaceCities ? fallback.cities : cityData.cities;
  const secondaryCitySource = fallback.replaceCities ? [] : fallback.cities;
  const cities = buildCityList(primaryCitySource, secondaryCitySource, baseCityFallback).filter(
    city => !capital || city.name !== capital.name
  );
  const populationFallbackFromCities =
    compactNumber(capital?.population) ||
    compactNumber(cities.reduce((sum, city) => sum + (city.population || 0), 0)) ||
    0;
  const historyOverride = HISTORY_OVERRIDES[code] || {};
  const normalizedHistoryYear = normalizeYear(
    historyData?.year,
    historyOverride.year ?? fallback.history?.year ?? null
  );
  const normalizedFormationType =
    historyOverride.type ||
    normalizeFormationLabel(historyData?.type) ||
    normalizeFormationLabel(historyData?.origin) ||
    normalizeFormationLabel(fallback.history?.type) ||
    normalizeFormationLabel(fallback.history?.origin) ||
    "legal";
  const historyEntry =
    historyData || fallback.history || historyOverride.year || historyOverride.type
      ? {
          year: normalizedHistoryYear,
          type: formatFormationType(normalizedFormationType),
          origin:
            historyOverride.origin ||
            historyData?.origin ||
            fallback.history?.origin ||
            null
        }
      : null;

  const religionSummary =
    religionData.summary ||
    religion[code] ||
    fallback.religion?.summary ||
    baseData.religion ||
    null;
  const religionCompositionSource = compactList(religionData.composition).length
    ? compactList(religionData.composition)
    : compactList(fallback.religion?.composition);
  const religionComposition = expandReligionComposition(
    code,
    religionSummary,
    religionCompositionSource
  );

  result[code] = {
    name:
      COUNTRY_NAME_OVERRIDES[code] ||
      countryNames[code] ||
      baseData.name ||
      populationData?.name ||
      gdpData?.name ||
      gdpPerCapitaData?.name ||
      code,
    continent: CONTINENT_OVERRIDES[code] || continentByCode[code] || "Unknown",
    general: {
      population:
        populationData?.value ??
        fallback.population ??
        baseData.population ??
        populationFallbackFromCities ??
        0,
      geography: baseData.geography || fallback.geography || null,
      capital,
      cities
    },
    history: historyEntry,
    economy: {
      gdp: gdpData?.value ?? null,
      gdpPerCapita: gdpPerCapitaData?.value ?? null,
      inflation: inflation[code] ?? null,
      exports: compactList(baseData.exports),
      industries: compactList(baseData.industries)
    },
    military: militaryData
      ? {
          active: militaryData.active ?? null,
          reserve: militaryData.reserve ?? null
        }
      : null,
    politics: {
      system:
        politicsData.system ||
        politics[code] ||
        fallback.politics?.system ||
        baseData.system ||
        historyEntry?.type ||
        "Estado soberano",
      organizations: compactList(politicsData.organizations),
      rivals: compactList(politicsData.rivals)
    },
    religion: {
      summary: religionSummary,
      composition: religionComposition
    },
    conflicts: normalizeConflicts(conflicts[code] || baseData.conflicts),
    organizations: compactList(baseData.organizations),
    rivals: compactList(baseData.rivals)
  };
}

fs.writeJsonSync("./data/countries_full.json", result, { spaces: 2 });

console.log(`Dataset generado: ${Object.keys(result).length} paises.`);
