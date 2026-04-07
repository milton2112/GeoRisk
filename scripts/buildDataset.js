import fs from "fs-extra";
import csvParser from "csv-parser";

const YEAR_COLUMNS = Array.from({ length: 2025 - 1960 + 1 }, (_, index) =>
  String(2025 - index)
);

const TERRITORY_LINKS = {
  FRA: ["GUF", "NCL", "ATF"],
  GUF: ["FRA"],
  NCL: ["FRA"],
  ATF: ["FRA"],
  DNK: ["GRL"],
  GRL: ["DNK"],
  GBR: ["FLK", "BMU"],
  FLK: ["GBR"],
  BMU: ["GBR"],
  USA: ["PRI"],
  PRI: ["USA"]
};

const INFLATION_OVERRIDES = {
  AND: 3.2,
  ATA: 2.1,
  ATF: 2.4,
  BMU: 3.3,
  "CS-KM": 3.4,
  CUB: 18.5,
  ERI: 7.5,
  ESH: 3.1,
  FLK: 4.0,
  GRL: 2.8,
  GUF: 3.0,
  PRI: 3.7,
  PRK: 14.2,
  SOM: 6.1,
  TKM: 8.6,
  TWN: 2.5,
  "-99": 5.4
};

const BUILD_UPDATED_AT = "2026-04-06";

const LANGUAGE_OVERRIDES = {
  ARG: ["Español"],
  AND: ["Catalán"],
  ARE: ["Árabe"],
  AFG: ["Pastún", "Darí"],
  AGO: ["Portugués"],
  ALB: ["Albanés"],
  ARM: ["Armenio"],
  AUS: ["Inglés"],
  AUT: ["Alemán"],
  AZE: ["Azerí"],
  BEL: ["Neerlandés", "Francés", "Alemán"],
  BEN: ["Francés"],
  BGD: ["Bengalí"],
  BHR: ["Árabe"],
  BIH: ["Bosnio", "Croata", "Serbio"],
  BLR: ["Bielorruso", "Ruso"],
  BOL: ["Español", "Quechua", "Aimara", "Guaraní"],
  BRA: ["Portugués"],
  BRN: ["Malayo"],
  BTN: ["Dzongkha"],
  BWA: ["Inglés", "Setsuana"],
  BDI: ["Kirundi", "Francés", "Inglés"],
  BFA: ["Francés"],
  BGR: ["Búlgaro"],
  CAN: ["Inglés", "Francés"],
  CAF: ["Sango", "Francés"],
  CMR: ["Francés", "Inglés"],
  CHE: ["Alemán", "Francés", "Italiano", "Romanche"],
  CHL: ["Español"],
  CHN: ["Chino mandarín"],
  COL: ["Español"],
  COD: ["Francés", "Lingala", "Suajili", "Kikongo", "Tshiluba"],
  COG: ["Francés"],
  COM: ["Comorense", "Árabe", "Francés"],
  CRI: ["Español"],
  CUB: ["Español"],
  CIV: ["Francés"],
  CYP: ["Griego", "Turco"],
  CZE: ["Checo"],
  DEU: ["Alemán"],
  DNK: ["Danés"],
  DOM: ["Español"],
  DJI: ["Árabe", "Francés"],
  DZA: ["Árabe", "Tamazight"],
  ECU: ["Español"],
  EGY: ["Árabe"],
  ERI: ["Tigriña", "Árabe", "Inglés"],
  ESH: ["Árabe", "Español"],
  ESP: ["Español"],
  EST: ["Estonio"],
  ETH: ["Amárico"],
  FIN: ["Finés", "Sueco"],
  FJI: ["Inglés", "Fiyiano", "Hindi fiyiano"],
  FLK: ["Inglés"],
  FRA: ["Francés"],
  GAB: ["Francés"],
  GBR: ["Inglés"],
  GEO: ["Georgiano"],
  GHA: ["Inglés"],
  GMB: ["Inglés"],
  GIN: ["Francés"],
  GNB: ["Portugués"],
  GNQ: ["Español", "Francés", "Portugués"],
  GRC: ["Griego"],
  GRL: ["Groenlandés", "Danés"],
  GTM: ["Español"],
  GUF: ["Francés"],
  GUY: ["Inglés"],
  HND: ["Español"],
  HRV: ["Croata"],
  HTI: ["Criollo haitiano", "Francés"],
  HUN: ["Húngaro"],
  IDN: ["Indonesio"],
  IND: ["Hindi", "Inglés"],
  IRL: ["Irlandés", "Inglés"],
  IRN: ["Persa"],
  IRQ: ["Árabe", "Kurdo"],
  ISL: ["Islandés"],
  ISR: ["Hebreo", "Árabe"],
  ITA: ["Italiano"],
  JAM: ["Inglés"],
  JPN: ["Japonés"],
  JOR: ["Árabe"],
  KAZ: ["Kazajo", "Ruso"],
  KEN: ["Suajili", "Inglés"],
  KGZ: ["Kirguís", "Ruso"],
  KHM: ["Jemer"],
  KOR: ["Coreano"],
  KWT: ["Árabe"],
  LAO: ["Lao"],
  LBN: ["Árabe"],
  LBR: ["Inglés"],
  LBY: ["Árabe"],
  LKA: ["Cingalés", "Tamil"],
  LSO: ["Sesoto", "Inglés"],
  LTU: ["Lituano"],
  LUX: ["Luxemburgués", "Francés", "Alemán"],
  LVA: ["Letón"],
  MAR: ["Árabe", "Tamazight"],
  MDA: ["Rumano"],
  MDG: ["Malgache", "Francés"],
  MEX: ["Español"],
  MKD: ["Macedonio", "Albanés"],
  MLI: ["Francés"],
  MMR: ["Birmano"],
  MNE: ["Montenegrino"],
  MNG: ["Mongol"],
  MOZ: ["Portugués"],
  MRT: ["Árabe"],
  MWI: ["Inglés", "Chichewa"],
  MYS: ["Malayo"],
  NAM: ["Inglés"],
  NCL: ["Francés"],
  NER: ["Francés"],
  NGA: ["Inglés"],
  NIC: ["Español"],
  NLD: ["Neerlandés"],
  NOR: ["Noruego"],
  NPL: ["Nepalí"],
  NZL: ["Inglés", "Maorí", "Lengua de señas neozelandesa"],
  OMN: ["Árabe"],
  PAK: ["Urdu", "Inglés"],
  PAN: ["Español"],
  PER: ["Español", "Quechua", "Aimara"],
  PHL: ["Filipino", "Inglés"],
  PNG: ["Inglés", "Tok pisin", "Hiri motu"],
  POL: ["Polaco"],
  PRY: ["Español", "Guaraní"],
  PRI: ["Español", "Inglés"],
  PRK: ["Coreano"],
  PRT: ["Portugués"],
  PSE: ["Árabe"],
  QAT: ["Árabe"],
  ROU: ["Rumano"],
  RUS: ["Ruso"],
  RWA: ["Kinyarwanda", "Francés", "Inglés", "Suajili"],
  SAU: ["Árabe"],
  SDN: ["Árabe", "Inglés"],
  SEN: ["Francés"],
  SGP: ["Inglés", "Malayo", "Mandarín", "Tamil"],
  SLB: ["Inglés"],
  SLE: ["Inglés"],
  SLV: ["Español"],
  SOM: ["Somalí", "Árabe"],
  SRB: ["Serbio"],
  SSD: ["Inglés"],
  SUR: ["Neerlandés"],
  SVK: ["Eslovaco"],
  SVN: ["Esloveno"],
  SWE: ["Sueco"],
  SWZ: ["Suazi", "Inglés"],
  SYR: ["Árabe"],
  TCD: ["Árabe", "Francés"],
  THA: ["Tailandés"],
  TJK: ["Tayiko"],
  TGO: ["Francés"],
  TKM: ["Turcomano"],
  TLS: ["Tetun", "Portugués"],
  TTO: ["Inglés"],
  TUN: ["Árabe"],
  TUR: ["Turco"],
  TWN: ["Chino mandarín"],
  TZA: ["Suajili", "Inglés"],
  UGA: ["Inglés", "Suajili"],
  UKR: ["Ucraniano"],
  URY: ["Español"],
  USA: ["Inglés"],
  UZB: ["Uzbeko"],
  VEN: ["Español"],
  VNM: ["Vietnamita"],
  VUT: ["Bislama", "Inglés", "Francés"],
  YEM: ["Árabe"],
  ZAF: ["Zulú", "Xhosa", "Afrikáans", "Inglés", "Sepedi", "Setsuana", "Sesoto", "Xitsonga", "Siswati", "Tshivenda", "Ndebele del sur"],
  ZMB: ["Inglés"],
  ZWE: ["Inglés", "Shona", "Sindebele"],
  "CS-KM": ["Albanés", "Serbio"],
  "-99": ["Somalí", "Árabe"]
};

const CAPITAL_ROLE_OVERRIDES = {
  BOL: [
    { role: "constitucional", name: "Sucre" },
    { role: "ejecutiva y legislativa", name: "La Paz" }
  ],
  MYS: [
    { role: "constitucional", name: "Kuala Lumpur" },
    { role: "administrativa", name: "Putrajaya" }
  ],
  NLD: [
    { role: "constitucional", name: "Ámsterdam" },
    { role: "administrativa", name: "La Haya" }
  ],
  LKA: [
    { role: "legislativa", name: "Sri Jayawardenepura Kotte" },
    { role: "ejecutiva", name: "Colombo" }
  ],
  ZAF: [
    { role: "ejecutiva", name: "Pretoria" },
    { role: "legislativa", name: "Ciudad del Cabo" },
    { role: "judicial", name: "Bloemfontein" }
  ],
  PSE: [
    { role: "reclamada", name: "Jerusalén Este" },
    { role: "administrativa", name: "Ramala" }
  ]
};

const STATE_STRUCTURE_OVERRIDES = {
  ARG: "Estado federal presidencial",
  AUS: "Monarquía constitucional federal parlamentaria",
  AUT: "República federal parlamentaria",
  BEL: "Monarquía constitucional federal parlamentaria",
  BOL: "Estado plurinacional unitario descentralizado",
  BIH: "Estado federal complejo con entidades constitutivas",
  BRA: "República federal presidencial",
  CAN: "Monarquía constitucional federal parlamentaria",
  CHE: "República federal directorial",
  CHN: "Estado socialista unitario de partido único",
  DEU: "República federal parlamentaria",
  ESP: "Monarquía constitucional con Estado autonómico",
  FRA: "República unitaria semipresidencial",
  GBR: "Monarquía constitucional unitaria con devolucion",
  IND: "República federal parlamentaria",
  IRN: "República teocrática unitaria",
  ISR: "República parlamentaria unitaria",
  ITA: "República parlamentaria unitaria regionalizada",
  MEX: "República federal presidencial",
  MYS: "Monarquía constitucional federal parlamentaria",
  NGA: "República federal presidencial",
  NLD: "Monarquía constitucional unitaria descentralizada",
  PAK: "República federal parlamentaria",
  RUS: "República federal semipresidencial",
  ZAF: "República parlamentaria unitaria descentralizada",
  USA: "República federal presidencial",
  ARE: "Federación de emiratos",
  PRI: "Territorio no incorporado de Estados Unidos",
  GUF: "Departamento y región de ultramar de Francia",
  NCL: "Colectividad especial francesa de ultramar",
  ATF: "Territorio francés de ultramar",
  BMU: "Territorio británico de ultramar",
  FLK: "Territorio británico de ultramar",
  GRL: "Territorio autónomo dentro del Reino de Dinamarca",
  PSE: "Estado con reconocimiento limitado y administración dividida",
  ATA: "Espacio internacional regido por el Sistema del Tratado Antártico"
};

const SUBDIVISION_OVERRIDES = {
  ARG: { type: "provincias y ciudad autónoma", count: 24 },
  ARE: { type: "emiratos", count: 7 },
  AUS: { type: "estados y territorios", count: 8 },
  AUT: { type: "estados federados", count: 9 },
  BEL: { type: "regiones y comunidades", count: 6, notes: "Sistema federal complejo con doble eje territorial y lingüístico" },
  BOL: { type: "departamentos", count: 9 },
  BRA: { type: "estados y distrito federal", count: 27 },
  CAN: { type: "provincias y territorios", count: 13 },
  CHE: { type: "cantones", count: 26 },
  CHN: { type: "provincias, regiones autónomas, municipios y regiones administrativas especiales", count: 34 },
  DEU: { type: "estados federados", count: 16 },
  ESP: { type: "comunidades y ciudades autónomas", count: 19 },
  FRA: { type: "regiones y departamentos", notes: "Incluye Francia metropolitana y ultramar" },
  GBR: { type: "naciones constituyentes y subdivisiones", count: 4 },
  IND: { type: "estados y territorios de la Unión", count: 36 },
  ITA: { type: "regiones", count: 20 },
  JPN: { type: "prefecturas", count: 47 },
  MEX: { type: "estados y ciudad capital", count: 32 },
  MYS: { type: "estados y territorios federales", count: 16 },
  NGA: { type: "estados y territorio de la capital federal", count: 37 },
  NLD: { type: "provincias", count: 12 },
  PAK: { type: "provincias, territorios y capital", count: 6 },
  RUS: { type: "sujetos federales", count: 89 },
  USA: { type: "estados y distrito federal", count: 51 },
  ZAF: { type: "provincias", count: 9 },
  PRI: { type: "municipios", count: 78 },
  GRL: { type: "municipios", count: 5 },
  BMU: { type: "parroquias y municipios", count: 11 }
};

const ORGANIZATION_FILL_OVERRIDES = {
  BHS: [
    { name: "Organización de las Naciones Unidas", abbreviation: "UN", startYear: 1973, endYear: null },
    { name: "Organización de los Estados Americanos", abbreviation: "OEA", startYear: 1982, endYear: null },
    { name: "Comunidad del Caribe", abbreviation: "CARICOM", startYear: 1983, endYear: null },
    { name: "Mancomunidad de Naciones", abbreviation: null, startYear: 1973, endYear: null }
  ],
  BLZ: [
    { name: "Organización de las Naciones Unidas", abbreviation: "UN", startYear: 1981, endYear: null },
    { name: "Organización de los Estados Americanos", abbreviation: "OEA", startYear: 1981, endYear: null },
    { name: "Comunidad del Caribe", abbreviation: "CARICOM", startYear: 1974, endYear: null },
    { name: "Mancomunidad de Naciones", abbreviation: null, startYear: 1981, endYear: null }
  ],
  PNG: [
    { name: "Organización de las Naciones Unidas", abbreviation: "UN", startYear: 1975, endYear: null },
    { name: "Mancomunidad de Naciones", abbreviation: null, startYear: 1975, endYear: null },
    { name: "Foro de las Islas del Pacífico", abbreviation: "PIF", startYear: 1975, endYear: null },
    { name: "Cooperación Económica Asia-Pacífico", abbreviation: "APEC", startYear: 1993, endYear: null }
  ],
  PSE: [
    { name: "Liga Árabe", abbreviation: null, startYear: 1976, endYear: null },
    { name: "Organización para la Cooperación Islámica", abbreviation: "OIC", startYear: 1969, endYear: null },
    { name: "Movimiento de Países No Alineados", abbreviation: "NAM", startYear: 1976, endYear: null }
  ],
  ESH: [
    { name: "Unión Africana", abbreviation: "UA", startYear: 1984, endYear: null }
  ]
};

const RIVAL_FILL_OVERRIDES = {
  BLZ: [{ name: "Guatemala", type: "historico" }],
  PSE: [{ name: "Israel", type: "actual" }],
  ESH: [{ name: "Marruecos", type: "actual" }],
  PNG: [{ name: "Indonesia", type: "historico" }],
  BHR: [{ name: "Iran", type: "actual" }],
  BRN: [{ name: "Malasia", type: "historico" }],
  BEN: [{ name: "Niger", type: "historico" }],
  COM: [{ name: "Francia", type: "historico" }],
  CRI: [{ name: "Nicaragua", type: "historico" }],
  CIV: [{ name: "Burkina Faso", type: "historico" }],
  GNQ: [{ name: "Gabón", type: "historico" }],
  GAB: [{ name: "Guinea Ecuatorial", type: "historico" }]
};

const CURATED_CONFLICT_OVERRIDES = {
  BHS: [],
  BEN: [
    { name: "Golpe de Estado dahomeyano de 1963", startYear: 1963, endYear: 1963, ongoing: false }
  ],
  BWA: [],
  CIV: [
    { name: "Primera guerra civil marfilena", startYear: 2002, endYear: 2007, ongoing: false },
    { name: "Segunda guerra civil marfilena", startYear: 2010, endYear: 2011, ongoing: false }
  ],
  COM: [
    { name: "Crisis separatista de las Comoras", startYear: 1997, endYear: 2001, ongoing: false }
  ],
  CRI: [
    { name: "Guerra civil costarricense", startYear: 1948, endYear: 1948, ongoing: false }
  ],
  ESH: [
    { name: "Guerra del Sahara Occidental", startYear: 1975, endYear: 1991, ongoing: false }
  ],
  FLK: [
    { name: "Guerra de las Malvinas", startYear: 1982, endYear: 1982, ongoing: false }
  ],
  GAB: [
    { name: "Golpe de Estado gabones de 1964", startYear: 1964, endYear: 1964, ongoing: false }
  ],
  GHA: [
    { name: "Golpe de Estado ghanes de 1966", startYear: 1966, endYear: 1966, ongoing: false }
  ],
  GIN: [
    { name: "Golpe de Estado guineano de 2021", startYear: 2021, endYear: 2021, ongoing: false }
  ],
  GMB: [
    { name: "Intento de golpe en Gambia de 1981", startYear: 1981, endYear: 1981, ongoing: false }
  ],
  GNQ: [
    { name: "Intento de golpe en Guinea Ecuatorial de 2004", startYear: 2004, endYear: 2004, ongoing: false }
  ],
  GNB: [
    { name: "Guerra civil de Guinea-Bisau", startYear: 1998, endYear: 1999, ongoing: false }
  ],
  GUF: [],
  GUY: [],
  IRL: [
    { name: "Guerra de Independencia irlandesa", startYear: 1919, endYear: 1921, ongoing: false },
    { name: "The Troubles", startYear: 1968, endYear: 1998, ongoing: false }
  ],
  JAM: [
    { name: "Rebelion de Morant Bay", startYear: 1865, endYear: 1865, ongoing: false }
  ],
  PSE: [
    { name: "Primera intifada", startYear: 1987, endYear: 1993, ongoing: false },
    { name: "Segunda intifada", startYear: 2000, endYear: 2005, ongoing: false },
    { name: "Guerra de Gaza", startYear: 2023, endYear: null, ongoing: true }
  ],
  PRI: [
    { name: "Grito de Lares", startYear: 1868, endYear: 1868, ongoing: false }
  ],
  SSD: [
    { name: "Guerra civil sursudanesa", startYear: 2013, endYear: 2020, ongoing: false },
    { name: "Segunda guerra civil sudanesa", startYear: 1983, endYear: 2005, ongoing: false }
  ],
  PNG: [
    { name: "Conflicto de Bougainville", startYear: 1988, endYear: 1998, ongoing: false }
  ],
  TLS: [
    { name: "Crisis de Timor Oriental", startYear: 2006, endYear: 2006, ongoing: false },
    { name: "Ocupacion indonesia de Timor Oriental", startYear: 1975, endYear: 1999, ongoing: false }
  ],
  SLB: [
    { name: "Conflicto etnico de las Islas Salomon", startYear: 1998, endYear: 2003, ongoing: false }
  ],
  SLE: [
    { name: "Guerra civil de Sierra Leona", startYear: 1991, endYear: 2002, ongoing: false }
  ],
  SUR: [
    { name: "Guerra civil de Surinam", startYear: 1986, endYear: 1992, ongoing: false }
  ],
  NCL: [
    { name: "Levantamiento canaco de Nueva Caledonia", startYear: 1984, endYear: 1988, ongoing: false }
  ],
  TGO: [
    { name: "Crisis togolesa de 2005", startYear: 2005, endYear: 2005, ongoing: false }
  ],
  TKM: [
    { name: "Rebelion basmachi en Turkmenistan", startYear: 1916, endYear: 1931, ongoing: false }
  ],
  VUT: [
    { name: "Coconut War", startYear: 1980, endYear: 1980, ongoing: false }
  ],
  FJI: [
    { name: "Crisis constitucional de Fiyi", startYear: 2000, endYear: 2000, ongoing: false }
  ],
  ATA: [],
  ATF: [],
  BMU: [],
  GRL: [],
  AND: [
    { name: "Revolucion andorrana de 1933", startYear: 1933, endYear: 1933, ongoing: false }
  ],
  BHR: [
    { name: "Levantamiento de Barein de 2011", startYear: 2011, endYear: 2011, ongoing: false }
  ],
  BRN: [
    { name: "Revuelta de Brunéi", startYear: 1962, endYear: 1962, ongoing: false }
  ],
  BTN: [
    { name: "Guerra de los Duars", startYear: 1864, endYear: 1865, ongoing: false }
  ],
  CHE: [
    { name: "Guerra del Sonderbund", startYear: 1847, endYear: 1847, ongoing: false }
  ],
  "CS-KM": [
    { name: "Guerra de Kosovo", startYear: 1998, endYear: 1999, ongoing: false }
  ],
  LSO: [
    { name: "Intervencion en Lesoto de 1998", startYear: 1998, endYear: 1998, ongoing: false }
  ],
  LVA: [
    { name: "Guerra de Independencia letona", startYear: 1918, endYear: 1920, ongoing: false }
  ],
  MLT: [
    { name: "Asedio de Malta", startYear: 1940, endYear: 1942, ongoing: false }
  ],
  MNE: [
    { name: "Guerra de independencia montenegrina", startYear: 2006, endYear: 2006, ongoing: false }
  ],
  MDG: [
    { name: "Crisis politica malgache de 2009", startYear: 2009, endYear: 2009, ongoing: false }
  ],
  NPL: [
    { name: "Guerra civil nepalesa", startYear: 1996, endYear: 2006, ongoing: false }
  ],
  SRB: [
    { name: "Guerra de Kosovo", startYear: 1998, endYear: 1999, ongoing: false }
  ],
  BHS: [
    { name: "Batalla de Nassau", startYear: 1776, endYear: 1776, ongoing: false }
  ],
  BLZ: [
    { name: "Guerra de Castas en Honduras Britanica", startYear: 1847, endYear: 1901, ongoing: false }
  ],
  GUY: [
    { name: "Levantamiento del Rupununi", startYear: 1969, endYear: 1969, ongoing: false }
  ],
  TTO: [
    { name: "Intento de golpe de Estado en Trinidad y Tobago de 1990", startYear: 1990, endYear: 1990, ongoing: false }
  ],
  BMU: [
    { name: "Motin de Bermuda de 1977", startYear: 1977, endYear: 1977, ongoing: false }
  ],
  GRL: [
    { name: "Crisis constitucional groenlandesa de 1940", startYear: 1940, endYear: 1940, ongoing: false }
  ],
  MWI: [
    { name: "Crisis de Malaui de 1964", startYear: 1964, endYear: 1964, ongoing: false }
  ],
  SWZ: [
    { name: "Golpe de Estado en Suazilandia de 1973", startYear: 1973, endYear: 1973, ongoing: false }
  ],
  ATA: [],
  ATF: [],
  GUF: [],
  "-99": [
    { name: "Guerra de Somalilandia", startYear: 1981, endYear: 1991, ongoing: false }
  ]
};

const POST_BUILD_ENTITY_OVERRIDES = {
  CIV: {
    general: {
      capital: { name: "Yamusukro", population: 355573, isCapital: true },
      cities: [
        { name: "Abiyan", population: 6321000, isCapital: false },
        { name: "Bouake", population: 832371, isCapital: false },
        { name: "Daloa", population: 255921, isCapital: false }
      ]
    }
  },
  GMB: {
    general: {
      capital: { name: "Banjul", population: 42326, isCapital: true },
      cities: [
        { name: "Serekunda", population: 340000, isCapital: false },
        { name: "Brikama", population: 119434, isCapital: false },
        { name: "Bakau", population: 43400, isCapital: false }
      ]
    }
  },
  BEN: {
    general: {
      capital: { name: "Porto-Novo", population: 264320, isCapital: true },
      cities: [
        { name: "Cotonou", population: 679012, isCapital: false },
        { name: "Parakou", population: 255478, isCapital: false },
        { name: "Abomey-Calavi", population: 655965, isCapital: false }
      ]
    }
  },
  GAB: {
    general: {
      capital: { name: "Libreville", population: 703904, isCapital: true },
      cities: [
        { name: "Port-Gentil", population: 136462, isCapital: false },
        { name: "Franceville", population: 110568, isCapital: false },
        { name: "Oyem", population: 60798, isCapital: false }
      ]
    }
  },
  GNQ: {
    general: {
      capital: { name: "Ciudad de la Paz", population: 8000, isCapital: true },
      cities: [
        { name: "Bata", population: 362220, isCapital: false },
        { name: "Malabo", population: 315665, isCapital: false },
        { name: "Ebibeyin", population: 24831, isCapital: false }
      ]
    }
  },
  GHA: {
    general: {
      capital: { name: "Accra", population: 2291352, isCapital: true },
      cities: [
        { name: "Kumasi", population: 1730249, isCapital: false },
        { name: "Tema", population: 292773, isCapital: false },
        { name: "Tamale", population: 467054, isCapital: false }
      ]
    }
  },
  GIN: {
    general: {
      capital: { name: "Conakry", population: 1660973, isCapital: true },
      cities: [
        { name: "Kankan", population: 200000, isCapital: false },
        { name: "Nzerekore", population: 195027, isCapital: false },
        { name: "Labe", population: 249515, isCapital: false }
      ]
    }
  },
  MDG: {
    general: {
      capital: { name: "Antananarivo", population: 1564000, isCapital: true },
      cities: [
        { name: "Toamasina", population: 325857, isCapital: false },
        { name: "Antsirabe", population: 257163, isCapital: false },
        { name: "Mahajanga", population: 246354, isCapital: false }
      ]
    }
  },
  CAF: {
    general: {
      capital: { name: "Bangui", population: 889231, isCapital: true },
      cities: [
        { name: "Bimbo", population: 267859, isCapital: false },
        { name: "Berberati", population: 76159, isCapital: false },
        { name: "Carnot", population: 45700, isCapital: false }
      ]
    }
  },
  COG: {
    general: {
      capital: { name: "Brazzaville", population: 2387000, isCapital: true },
      cities: [
        { name: "Pointe-Noire", population: 1389000, isCapital: false },
        { name: "Dolisie", population: 117920, isCapital: false },
        { name: "Nkayi", population: 71500, isCapital: false }
      ]
    }
  },
  SVK: {
    general: {
      capital: { name: "Bratislava", population: 475503, isCapital: true },
      cities: [
        { name: "Kosice", population: 229040, isCapital: false },
        { name: "Presov", population: 84000, isCapital: false },
        { name: "Zilina", population: 80810, isCapital: false }
      ]
    }
  },
  HTI: {
    general: {
      capital: { name: "Puerto Principe", population: 987310, isCapital: true },
      cities: [
        { name: "Cap-Haitien", population: 274812, isCapital: false },
        { name: "Gonaives", population: 356324, isCapital: false },
        { name: "Les Cayes", population: 126053, isCapital: false }
      ]
    }
  },
  JAM: {
    general: {
      capital: { name: "Kingston", population: 584627, isCapital: true },
      cities: [
        { name: "Portmore", population: 182153, isCapital: false },
        { name: "Spanish Town", population: 145018, isCapital: false },
        { name: "Montego Bay", population: 110115, isCapital: false }
      ]
    }
  },
  CRI: {
    general: {
      capital: { name: "San Jose", population: 342188, isCapital: true },
      cities: [
        { name: "Alajuela", population: 332676, isCapital: false },
        { name: "Desamparados", population: 255000, isCapital: false },
        { name: "Cartago", population: 156600, isCapital: false }
      ]
    }
  },
  ARE: {
    general: {
      capital: { name: "Abu Dabi", population: 1600000, isCapital: true },
      cities: [
        { name: "Dubai", population: 3565000, isCapital: false },
        { name: "Sharjah", population: 1800000, isCapital: false },
        { name: "Al Ain", population: 766936, isCapital: false }
      ]
    }
  },
  PRI: {
    general: {
      capital: { name: "San Juan", population: 333005, isCapital: true },
      cities: [
        { name: "Bayamon", population: 180835, isCapital: false },
        { name: "Carolina", population: 150843, isCapital: false },
        { name: "Ponce", population: 130251, isCapital: false }
      ]
    }
  },
  LAO: {
    general: {
      capital: { name: "Vientian", population: 948477, isCapital: true },
      cities: [
        { name: "Savanakhet", population: 125760, isCapital: false },
        { name: "Pakse", population: 87693, isCapital: false },
        { name: "Luang Prabang", population: 56000, isCapital: false }
      ]
    }
  },
  TKM: {
    general: {
      capital: { name: "Asjabad", population: 1031992, isCapital: true },
      cities: [
        { name: "Turkmenabat", population: 267000, isCapital: false },
        { name: "Dasoguz", population: 275424, isCapital: false },
        { name: "Mary", population: 123000, isCapital: false }
      ]
    }
  },
  AFG: {
    general: {
      capital: { name: "Kabul", population: 4601789, isCapital: true },
      cities: [
        { name: "Kandahar", population: 614118, isCapital: false },
        { name: "Herat", population: 556205, isCapital: false },
        { name: "Mazar-e Sarif", population: 500207, isCapital: false }
      ]
    }
  },
  EGY: {
    general: {
      capital: { name: "El Cairo", population: 10230350, isCapital: true },
      cities: [
        { name: "Alejandria", population: 5760000, isCapital: false },
        { name: "Guiza", population: 4239988, isCapital: false },
        { name: "Shubra el Jeima", population: 1186246, isCapital: false }
      ]
    }
  },
  TUR: {
    general: {
      capital: { name: "Ankara", population: 5800000, isCapital: true },
      cities: [
        { name: "Estambul", population: 15655924, isCapital: false },
        { name: "Esmirna", population: 4470000, isCapital: false },
        { name: "Bursa", population: 3101833, isCapital: false }
      ]
    }
  },
  VNM: {
    general: {
      capital: { name: "Hanói", population: 8053663, isCapital: true },
      cities: [
        { name: "Ciudad Ho Chi Minh", population: 9446000, isCapital: false },
        { name: "Hai Phong", population: 2103500, isCapital: false },
        { name: "Da Nang", population: 1193814, isCapital: false }
      ]
    }
  },
  COD: {
    general: {
      capital: { name: "Kinsasa", population: 17071000, isCapital: true },
      cities: [
        { name: "Lubumbashi", population: 2589000, isCapital: false },
        { name: "Mbuji-Mayi", population: 2500000, isCapital: false },
        { name: "Kisangani", population: 1600000, isCapital: false }
      ]
    }
  },
  ETH: {
    general: {
      capital: { name: "Adis Abeba", population: 5677000, isCapital: true },
      cities: [
        { name: "Dire Dawa", population: 506936, isCapital: false },
        { name: "Mekele", population: 500000, isCapital: false },
        { name: "Gondar", population: 443156, isCapital: false }
      ]
    }
  },
  MAR: {
    general: {
      capital: { name: "Rabat", population: 1886190, isCapital: true },
      cities: [
        { name: "Casablanca", population: 3297311, isCapital: false },
        { name: "Fez", population: 1250000, isCapital: false },
        { name: "Marrakech", population: 928850, isCapital: false }
      ]
    }
  },
  NLD: {
    general: {
      capital: { name: "Amsterdam", population: 921468, isCapital: true },
      cities: [
        { name: "Rotterdam", population: 663900, isCapital: false },
        { name: "La Haya", population: 565701, isCapital: false },
        { name: "Utrecht", population: 361742, isCapital: false }
      ]
    }
  },
  PSE: {
    general: {
      capital: { name: "Ramallah", population: 38998, isCapital: true },
      cities: [
        { name: "Gaza", population: 778187, isCapital: false },
        { name: "Hebron", population: 215452, isCapital: false },
        { name: "Nablus", population: 156906, isCapital: false }
      ]
    }
  },
  ERI: {
    general: {
      capital: { name: "Asmara", population: 963000, isCapital: true },
      cities: [
        { name: "Keren", population: 120000, isCapital: false },
        { name: "Massawa", population: 53989, isCapital: false },
        { name: "Assab", population: 21100, isCapital: false }
      ]
    }
  },
  DJI: {
    general: {
      capital: { name: "Yibuti", population: 623891, isCapital: true },
      cities: [
        { name: "Ali Sabieh", population: 45000, isCapital: false },
        { name: "Tadjoura", population: 22000, isCapital: false },
        { name: "Obock", population: 17600, isCapital: false }
      ]
    }
  },
  LBR: {
    general: {
      capital: { name: "Monrovia", population: 1518652, isCapital: true },
      cities: [
        { name: "Gbarnga", population: 45835, isCapital: false },
        { name: "Buchanan", population: 34370, isCapital: false },
        { name: "Kakata", population: 33945, isCapital: false }
      ]
    }
  },
  TZA: {
    general: {
      capital: { name: "Dodoma", population: 765179, isCapital: true },
      cities: [
        { name: "Dar es Salaam", population: 5383728, isCapital: false },
        { name: "Mwanza", population: 706453, isCapital: false },
        { name: "Arusha", population: 617631, isCapital: false }
      ]
    }
  },
  AGO: {
    general: {
      capital: { name: "Luanda", population: 8917000, isCapital: true },
      cities: [
        { name: "Huambo", population: 1167000, isCapital: false },
        { name: "Benguela", population: 513000, isCapital: false },
        { name: "Lobito", population: 393079, isCapital: false }
      ]
    }
  },
  SDN: {
    general: {
      capital: { name: "Jartum", population: 5274321, isCapital: true },
      cities: [
        { name: "Omdurman", population: 2395159, isCapital: false },
        { name: "Port Sudan", population: 489725, isCapital: false },
        { name: "Nyala", population: 565000, isCapital: false }
      ]
    }
  },
  SOM: {
    general: {
      capital: { name: "Mogadiscio", population: 2610000, isCapital: true },
      cities: [
        { name: "Hargeisa", population: 1200000, isCapital: false },
        { name: "Bosaso", population: 719512, isCapital: false },
        { name: "Kismayo", population: 234852, isCapital: false }
      ]
    }
  },
  LBY: {
    general: {
      capital: { name: "Tripoli", population: 1163810, isCapital: true },
      cities: [
        { name: "Bengasi", population: 956100, isCapital: false },
        { name: "Misrata", population: 386120, isCapital: false },
        { name: "Sabha", population: 130000, isCapital: false }
      ]
    }
  },
  TCD: {
    general: {
      capital: { name: "Yamena", population: 1600000, isCapital: true },
      cities: [
        { name: "Moundou", population: 156705, isCapital: false },
        { name: "Sarh", population: 108061, isCapital: false },
        { name: "Abeche", population: 74520, isCapital: false }
      ]
    }
  },
  SGP: {
    general: {
      capital: { name: "Singapur", population: 5917600, isCapital: true },
      cities: [
        { name: "Jurong West", population: 292000, isCapital: false },
        { name: "Woodlands", population: 254730, isCapital: false },
        { name: "Tampines", population: 257000, isCapital: false }
      ]
    }
  },
  KGZ: {
    general: {
      capital: { name: "Biskek", population: 1128279, isCapital: true },
      cities: [
        { name: "Osh", population: 322164, isCapital: false },
        { name: "Yalal-Abad", population: 123239, isCapital: false },
        { name: "Karakol", population: 80000, isCapital: false }
      ]
    }
  },
  KHM: {
    general: {
      capital: { name: "Nom Pen", population: 2281951, isCapital: true },
      cities: [
        { name: "Siem Reap", population: 245494, isCapital: false },
        { name: "Battambang", population: 196709, isCapital: false },
        { name: "Sihanoukville", population: 89946, isCapital: false }
      ]
    }
  },
  SYR: {
    general: {
      capital: { name: "Damasco", population: 2079000, isCapital: true },
      cities: [
        { name: "Alepo", population: 2132000, isCapital: false },
        { name: "Homs", population: 1400000, isCapital: false },
        { name: "Latakia", population: 709000, isCapital: false }
      ]
    }
  },
  LBN: {
    general: {
      capital: { name: "Beirut", population: 361366, isCapital: true },
      cities: [
        { name: "Tripoli", population: 850000, isCapital: false },
        { name: "Sidon", population: 163554, isCapital: false },
        { name: "Tiro", population: 135204, isCapital: false }
      ]
    }
  },
  SVN: {
    general: {
      capital: { name: "Liubliana", population: 295504, isCapital: true },
      cities: [
        { name: "Maribor", population: 97019, isCapital: false },
        { name: "Celje", population: 37743, isCapital: false },
        { name: "Kranj", population: 37941, isCapital: false }
      ]
    }
  },
  LVA: {
    general: {
      capital: { name: "Riga", population: 605273, isCapital: true },
      cities: [
        { name: "Daugavpils", population: 82046, isCapital: false },
        { name: "Liepaja", population: 66780, isCapital: false },
        { name: "Jelgava", population: 55172, isCapital: false }
      ]
    }
  },
  EST: {
    general: {
      capital: { name: "Tallin", population: 461602, isCapital: true },
      cities: [
        { name: "Tartu", population: 100724, isCapital: false },
        { name: "Narva", population: 54090, isCapital: false },
        { name: "Parnu", population: 40762, isCapital: false }
      ]
    }
  },
  MKD: {
    general: {
      capital: { name: "Skopie", population: 544086, isCapital: true },
      cities: [
        { name: "Bitola", population: 69151, isCapital: false },
        { name: "Kumanovo", population: 70842, isCapital: false },
        { name: "Tetovo", population: 84530, isCapital: false }
      ]
    }
  },
  LUX: {
    general: {
      capital: { name: "Luxemburgo", population: 132780, isCapital: true },
      cities: [
        { name: "Esch-sur-Alzette", population: 36728, isCapital: false },
        { name: "Differdange", population: 28654, isCapital: false },
        { name: "Dudelange", population: 21813, isCapital: false }
      ]
    }
  },
  NIC: {
    general: {
      capital: { name: "Managua", population: 1055247, isCapital: true },
      cities: [
        { name: "Leon", population: 211278, isCapital: false },
        { name: "Masaya", population: 166588, isCapital: false },
        { name: "Chinandega", population: 126387, isCapital: false }
      ]
    }
  },
  URY: {
    general: {
      capital: { name: "Montevideo", population: 1319108, isCapital: true },
      cities: [
        { name: "Salto", population: 104028, isCapital: false },
        { name: "Paysandu", population: 76429, isCapital: false },
        { name: "Las Piedras", population: 71636, isCapital: false }
      ]
    }
  },
  GNB: {
    general: {
      capital: { name: "Bisau", population: 592000, isCapital: true },
      cities: [
        { name: "Bafata", population: 22700, isCapital: false },
        { name: "Gabu", population: 14500, isCapital: false },
        { name: "Cacheu", population: 10000, isCapital: false }
      ]
    }
  },
  BWA: {
    general: {
      capital: { name: "Gaborone", population: 273602, isCapital: true },
      cities: [
        { name: "Francistown", population: 103416, isCapital: false },
        { name: "Molepolole", population: 74191, isCapital: false },
        { name: "Maun", population: 60763, isCapital: false }
      ]
    }
  },
  BDI: {
    general: {
      capital: { name: "Gitega", population: 41944, isCapital: true },
      cities: [
        { name: "Buyumbura", population: 497169, isCapital: false },
        { name: "Ngozi", population: 21506, isCapital: false },
        { name: "Ruyigi", population: 38458, isCapital: false }
      ]
    }
  },
  MRT: {
    general: {
      capital: { name: "Nuakchot", population: 1195600, isCapital: true },
      cities: [
        { name: "Nuadibu", population: 121000, isCapital: false },
        { name: "Kiffa", population: 66779, isCapital: false },
        { name: "Rosso", population: 48922, isCapital: false }
      ]
    }
  },
  TUN: {
    general: {
      capital: { name: "Tunis", population: 1056247, isCapital: true },
      cities: [
        { name: "Sfax", population: 330440, isCapital: false },
        { name: "Susa", population: 271428, isCapital: false },
        { name: "Monastir", population: 548828, isCapital: false }
      ]
    }
  },
  FLK: {
    general: {
      capital: { name: "Stanley", population: 2460, isCapital: true },
      cities: [
        { name: "Monte Agradable", population: 1300, isCapital: false },
        { name: "Goose Green", population: 100, isCapital: false }
      ]
    }
  },
  MDG: {
    general: {
      capital: { name: "Antananarivo", population: 1564000, isCapital: true },
      cities: [
        { name: "Toamasina", population: 325857, isCapital: false },
        { name: "Antsirabe", population: 257163, isCapital: false },
        { name: "Mahajanga", population: 246354, isCapital: false }
      ]
    }
  },
  ATF: {
    general: {
      capital: { name: "Port-aux-Francais", population: 120, isCapital: true },
      cities: [
        { name: "Martin-de-Vivies", population: 30, isCapital: false },
        { name: "Base Alfred Faure", population: 25, isCapital: false }
      ]
    }
  },
  VUT: {
    general: {
      capital: { name: "Port Vila", population: 49034, isCapital: true },
      cities: [
        { name: "Luganville", population: 18000, isCapital: false },
        { name: "Norsup", population: 3000, isCapital: false },
        { name: "Isangel", population: 1600, isCapital: false }
      ]
    }
  }
};

const OFFICIAL_NAME_OVERRIDES = {
  ARG: "Republica Argentina",
  AUS: "Mancomunidad de Australia",
  BOL: "Estado Plurinacional de Bolivia",
  BRA: "Republica Federativa del Brasil",
  CAN: "Canada",
  CHN: "Republica Popular China",
  CIV: "Republica de Costa de Marfil",
  COD: "Republica Democratica del Congo",
  COG: "Republica del Congo",
  DEU: "Republica Federal de Alemania",
  ESP: "Reino de España",
  FRA: "Republica Francesa",
  GBR: "Reino Unido de Gran Bretaña e Irlanda del Norte",
  GRC: "Republica Helenica",
  IRN: "Republica Islamica de Iran",
  LAO: "Republica Democratica Popular Lao",
  MAR: "Reino de Marruecos",
  MEX: "Estados Unidos Mexicanos",
  NLD: "Reino de los Paises Bajos",
  PRK: "Republica Popular Democratica de Corea",
  RUS: "Federacion de Rusia",
  SWZ: "Reino de Esuatini",
  SYR: "Republica Arabe Siria",
  TWN: "Republica de China",
  USA: "Estados Unidos de America",
  VEN: "Republica Bolivariana de Venezuela",
  VNM: "Republica Socialista de Vietnam",
  GUF: "Guayana Francesa",
  PRI: "Estado Libre Asociado de Puerto Rico",
  FLK: "Islas Malvinas",
  BMU: "Bermudas",
  NCL: "Nueva Caledonia",
  GRL: "Groenlandia",
  ATA: "Antartida",
  ATF: "Tierras Australes y Antarticas Francesas",
  "CS-KM": "Republica de Kosovo",
  "-99": "Republica de Somalilandia"
};

const HISTORICAL_NAME_OVERRIDES = {
  COD: ["Zaire", "Congo Belga"],
  CIV: ["Costa de Marfil francesa"],
  DEU: ["Republica Democratica Alemana", "Republica Federal de Alemania"],
  GBR: ["Imperio Britanico"],
  GHA: ["Costa de Oro"],
  IRN: ["Persia"],
  MMR: ["Birmania"],
  MKD: ["Republica de Macedonia"],
  NAM: ["Africa del Sudoeste"],
  RUS: ["Union Sovietica"],
  SWZ: ["Suazilandia"],
  TZA: ["Tanganica", "Zanzibar"],
  VNM: ["Vietnam del Norte", "Vietnam del Sur"],
  ZWE: ["Rodesia del Sur"],
  ESH: ["Sahara Espanol"],
  PSE: ["Palestina bajo mandato britanico"],
  GUF: ["Guyane francaise"],
  FLK: ["Falkland Islands"],
  PRI: ["Puerto Rico español"],
  "CS-KM": ["Kosovo y Metohija"],
  "-99": ["Somalilandia Britanica"]
};

const SYMBOL_OVERRIDES = {
  ARG: {
    flagDescription: "Bandera celeste y blanca con Sol de Mayo",
    coatOfArms: "Escudo ovalado con manos entrelazadas, pica y gorro frigio"
  },
  BRA: {
    flagDescription: "Bandera verde con rombo amarillo y globo azul estrellado",
    coatOfArms: "Escudo con estrella verde-amarilla y espada"
  },
  CHN: {
    flagDescription: "Bandera roja con cinco estrellas amarillas",
    coatOfArms: "Emblema rojo y dorado con Tiananmén, engranaje y espigas"
  },
  ESP: {
    flagDescription: "Bandera roja y amarilla con escudo nacional",
    coatOfArms: "Escudo cuartelado con corona real y Columnas de Hercules"
  },
  FRA: {
    flagDescription: "Bandera tricolor azul, blanca y roja",
    coatOfArms: "Emblema republicano con fasces, ramas y monograma RF"
  },
  GBR: {
    flagDescription: "Union Jack con cruces de San Jorge, San Andres y San Patricio",
    coatOfArms: "Escudo real con leon y unicornio"
  },
  USA: {
    flagDescription: "Bandera de barras y estrellas",
    coatOfArms: "Gran Sello con aguila calva, escudo y flechas"
  },
  GUF: {
    flagDescription: "Usa la bandera de Francia junto a simbolos locales",
    coatOfArms: "Armas territoriales asociadas a la colectividad"
  },
  PRI: {
    flagDescription: "Bandera con franjas rojas y blancas y triangulo azul con estrella",
    coatOfArms: "Escudo historico de Puerto Rico con cordero místico"
  },
  FLK: {
    flagDescription: "Blue Ensign con escudo de las Islas Malvinas",
    coatOfArms: "Escudo con carnero, barco Desire y lema territorial"
  },
  "-99": {
    flagDescription: "Bandera tricolor con shahada y estrella negra",
    coatOfArms: "Emblema no estandarizado de la republica autodeclarada"
  }
};

const TIMELINE_EVENT_OVERRIDES = {
  ARG: [
    { year: 1810, category: "politica", text: "Revolucion de Mayo" },
    { year: 1816, category: "estado", text: "Declaracion de la Independencia" },
    { year: 1853, category: "constitucion", text: "Sancion de la Constitucion nacional" },
    { year: 1982, category: "guerra", text: "Guerra de las Malvinas" },
    { year: 1983, category: "politica", text: "Retorno definitivo a la democracia" }
  ],
  BRA: [
    { year: 1822, category: "estado", text: "Independencia del Brasil" },
    { year: 1889, category: "politica", text: "Proclamacion de la Republica" },
    { year: 1964, category: "golpe", text: "Golpe militar e inicio de la dictadura" },
    { year: 1988, category: "constitucion", text: "Constitucion de la Nueva Republica" }
  ],
  USA: [
    { year: 1776, category: "estado", text: "Declaracion de Independencia" },
    { year: 1787, category: "constitucion", text: "Convencion y Constitucion federal" },
    { year: 1861, category: "guerra", text: "Inicio de la Guerra Civil" },
    { year: 1865, category: "estado", text: "Abolicion de la esclavitud y preservacion de la Union" }
  ],
  CHN: [
    { year: 1911, category: "revolucion", text: "Revolucion de Xinhai y fin de la dinastia Qing" },
    { year: 1949, category: "estado", text: "Proclamacion de la Republica Popular China" },
    { year: 1978, category: "economia", text: "Inicio de la reforma y apertura" },
    { year: 1997, category: "territorio", text: "Reintegracion de Hong Kong" }
  ],
  RUS: [
    { year: 1917, category: "revolucion", text: "Revoluciones de Febrero y Octubre" },
    { year: 1922, category: "union", text: "Creacion de la Union Sovietica" },
    { year: 1991, category: "disolucion", text: "Disolucion de la URSS" },
    { year: 1993, category: "constitucion", text: "Nueva Constitucion de la Federacion de Rusia" }
  ],
  IND: [
    { year: 1858, category: "imperio", text: "Inicio del Raj britanico" },
    { year: 1947, category: "estado", text: "Independencia y Particion" },
    { year: 1950, category: "constitucion", text: "Entrada en vigor de la Constitucion" },
    { year: 1971, category: "guerra", text: "Guerra indo-paquistani y nacimiento de Bangladesh" }
  ],
  DEU: [
    { year: 1871, category: "union", text: "Unificacion alemana" },
    { year: 1919, category: "constitucion", text: "Constitucion de Weimar" },
    { year: 1949, category: "division", text: "Division en RFA y RDA" },
    { year: 1990, category: "union", text: "Reunificacion alemana" }
  ],
  FRA: [
    { year: 1789, category: "revolucion", text: "Revolucion francesa" },
    { year: 1792, category: "estado", text: "Proclamacion de la Primera Republica" },
    { year: 1958, category: "constitucion", text: "Fundacion de la Quinta Republica" },
    { year: 1962, category: "descolonizacion", text: "Independencia de Argelia" }
  ],
  GBR: [
    { year: 1707, category: "union", text: "Acta de Union entre Inglaterra y Escocia" },
    { year: 1801, category: "union", text: "Union con Irlanda" },
    { year: 1931, category: "imperio", text: "Estatuto de Westminster y autonomia imperial" },
    { year: 1998, category: "acuerdo", text: "Acuerdo del Viernes Santo" }
  ],
  JPN: [
    { year: 1868, category: "reforma", text: "Restauracion Meiji" },
    { year: 1889, category: "constitucion", text: "Constitucion del Imperio del Japon" },
    { year: 1947, category: "constitucion", text: "Constitucion pacifista de posguerra" },
    { year: 1951, category: "tratado", text: "Tratado de San Francisco" }
  ],
  UKR: [
    { year: 1991, category: "estado", text: "Independencia tras la disolucion de la Union Sovietica" },
    { year: 1996, category: "constitucion", text: "Adopcion de la Constitucion de Ucrania" },
    { year: 2014, category: "territorio", text: "Anexion rusa de Crimea y guerra en Donbas" },
    { year: 2022, category: "guerra", text: "Invasion rusa a gran escala" }
  ],
  ISR: [
    { year: 1947, category: "acuerdo", text: "Plan de particion de Palestina de la ONU" },
    { year: 1948, category: "estado", text: "Declaracion de independencia y guerra arabe-israeli" },
    { year: 1967, category: "guerra", text: "Guerra de los Seis Dias" },
    { year: 1979, category: "tratado", text: "Tratado de paz con Egipto" },
    { year: 1993, category: "acuerdo", text: "Acuerdos de Oslo" }
  ],
  PAK: [
    { year: 1947, category: "estado", text: "Independencia y particion del Raj britanico" },
    { year: 1956, category: "constitucion", text: "Primera Constitucion y proclamacion como republica" },
    { year: 1971, category: "guerra", text: "Guerra indo-paquistani y secesion de Bangladesh" },
    { year: 1973, category: "constitucion", text: "Constitucion vigente de la Republica Islamica" }
  ],
  TUR: [
    { year: 1923, category: "estado", text: "Proclamacion de la Republica de Turquia" },
    { year: 1938, category: "reforma", text: "Consolidacion del kemalismo tras Ataturk" },
    { year: 1960, category: "golpe", text: "Golpe de Estado militar" },
    { year: 1980, category: "golpe", text: "Nuevo golpe militar y reordenamiento institucional" },
    { year: 2017, category: "constitucion", text: "Reforma constitucional hacia presidencialismo reforzado" }
  ],
  IRN: [
    { year: 1906, category: "constitucion", text: "Revolucion constitucional persa" },
    { year: 1953, category: "golpe", text: "Golpe contra Mohammad Mosaddegh" },
    { year: 1979, category: "revolucion", text: "Revolucion islamica y caida del Sha" },
    { year: 1979, category: "constitucion", text: "Constitucion de la Republica Islamica" }
  ],
  ZAF: [
    { year: 1910, category: "union", text: "Creacion de la Union Sudafricana" },
    { year: 1948, category: "politica", text: "Institucionalizacion del apartheid" },
    { year: 1961, category: "estado", text: "Proclamacion de la Republica de Sudafrica" },
    { year: 1994, category: "politica", text: "Fin del apartheid y primeras elecciones multirraciales" },
    { year: 1996, category: "constitucion", text: "Nueva Constitucion democratica" }
  ],
  MEX: [
    { year: 1810, category: "revolucion", text: "Grito de Dolores e inicio de la independencia" },
    { year: 1821, category: "estado", text: "Consumacion de la independencia" },
    { year: 1910, category: "revolucion", text: "Revolucion mexicana" },
    { year: 1917, category: "constitucion", text: "Constitucion de Queretaro" }
  ],
  NGA: [
    { year: 1914, category: "union", text: "Amalgama colonial del Norte y el Sur britanicos" },
    { year: 1960, category: "estado", text: "Independencia del Reino Unido" },
    { year: 1967, category: "guerra", text: "Comienzo de la Guerra de Biafra" },
    { year: 1999, category: "constitucion", text: "Retorno al gobierno civil y constitucion vigente" }
  ],
  EGY: [
    { year: 1922, category: "estado", text: "Independencia nominal del Reino Unido" },
    { year: 1952, category: "golpe", text: "Revolucion de los Oficiales Libres" },
    { year: 1953, category: "estado", text: "Abolicion de la monarquia y proclamacion de la republica" },
    { year: 2011, category: "revolucion", text: "Levantamiento de la Primavera Arabe" },
    { year: 2013, category: "golpe", text: "Derrocamiento de Mohamed Morsi" }
  ]
};

const RELATION_OVERRIDES = {
  ARG: {
    allies: ["Brasil", "Uruguay", "Paraguay", "Bolivia"],
    blocs: ["Mercosur", "ONU"],
    disputes: ["Islas Malvinas", "Antartida"],
    rivalStates: ["Reino Unido"]
  },
  BRA: {
    allies: ["Argentina", "Uruguay", "Paraguay"],
    blocs: ["Mercosur", "BRICS", "ONU"]
  },
  USA: {
    allies: ["Reino Unido", "Canada", "Japon", "Corea del Sur"],
    blocs: ["OTAN", "ONU"],
    disputes: ["Taiwan", "Mar de China Meridional"],
    rivalStates: ["China", "Rusia", "Iran", "Corea del Norte"]
  },
  CHN: {
    allies: ["Pakistan", "Rusia", "Corea del Norte"],
    blocs: ["BRICS", "ONU"],
    disputes: ["Taiwan", "Mar de China Meridional", "Aksai Chin"],
    rivalStates: ["Estados Unidos", "India", "Japon", "Taiwan"]
  },
  RUS: {
    allies: ["Belarusia", "Armenia"],
    blocs: ["ONU", "BRICS"],
    disputes: ["Crimea", "Kuriles del Sur"],
    rivalStates: ["Estados Unidos", "Ucrania", "Polonia", "OTAN"]
  },
  UKR: {
    allies: ["Estados Unidos", "Polonia", "Reino Unido", "Union Europea"],
    blocs: ["ONU"],
    disputes: ["Crimea", "Donbas"],
    rivalStates: ["Rusia"]
  },
  ISR: {
    allies: ["Estados Unidos"],
    blocs: ["ONU"],
    disputes: ["Jerusalen Este", "Cisjordania", "Altos del Golan"],
    rivalStates: ["Iran", "Hamas", "Hezbola"]
  },
  IND: {
    allies: ["Francia", "Estados Unidos", "Japon"],
    blocs: ["BRICS", "ONU"],
    disputes: ["Cachemira", "Aksai Chin", "Arunachal Pradesh"],
    rivalStates: ["Pakistan", "China"]
  },
  PAK: {
    allies: ["China", "Turquia"],
    blocs: ["ONU"],
    disputes: ["Cachemira"],
    rivalStates: ["India"]
  },
  TUR: {
    allies: ["Azerbaiyan", "Qatar"],
    blocs: ["OTAN", "ONU"],
    disputes: ["Chipre del Norte", "Mar Egeo"],
    rivalStates: ["Grecia", "Siria"]
  },
  IRN: {
    allies: ["Siria", "Hezbola"],
    blocs: ["ONU", "BRICS"],
    rivalStates: ["Estados Unidos", "Israel", "Arabia Saudita"]
  },
  GBR: {
    allies: ["Estados Unidos", "Canada", "Australia"],
    blocs: ["OTAN", "Commonwealth", "ONU"],
    disputes: ["Islas Malvinas", "Gibraltar"],
    rivalStates: ["Argentina", "Rusia"]
  },
  FRA: {
    allies: ["Alemania", "Italia", "España"],
    blocs: ["Union Europea", "OTAN", "ONU"],
    disputes: ["Mayotte"],
    rivalStates: ["Rusia"]
  }
};

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

const POLITICAL_SYSTEM_OVERRIDES = {
  AFG: "Teocracia",
  ARE: "Monarquia constitucional",
  AUS: "Monarquia constitucional",
  BHR: "Monarquia constitucional",
  BEL: "Monarquia constitucional",
  BMU: "Monarquia constitucional",
  BLZ: "Monarquia constitucional",
  BHS: "Monarquia constitucional",
  BTN: "Monarquia constitucional",
  BRN: "Monarquia absoluta",
  CAN: "Monarquia constitucional",
  CHE: "Parlamentarismo",
  CHN: "Parlamentarismo",
  CUB: "Presidencialismo",
  DEU: "Parlamentarismo",
  DNK: "Monarquia constitucional",
  ESP: "Monarquia constitucional",
  FRA: "Semipresidencialismo",
  GBR: "Monarquia constitucional",
  GRL: "Monarquia constitucional",
  GUF: "Semipresidencialismo",
  IRN: "Teocracia",
  ISR: "Parlamentarismo",
  ITA: "Parlamentarismo",
  JPN: "Monarquia constitucional",
  KWT: "Monarquia constitucional",
  LUX: "Monarquia constitucional",
  MAR: "Monarquia constitucional",
  MYS: "Monarquia constitucional",
  NCL: "Semipresidencialismo",
  NLD: "Monarquia constitucional",
  NOR: "Monarquia constitucional",
  NZL: "Monarquia constitucional",
  OMN: "Monarquia absoluta",
  PAK: "Parlamentarismo",
  PNG: "Monarquia constitucional",
  PRI: "Presidencialismo",
  QAT: "Monarquia absoluta",
  SAU: "Monarquia absoluta",
  SLB: "Monarquia constitucional",
  SWE: "Monarquia constitucional",
  SWZ: "Monarquia absoluta",
  THA: "Monarquia constitucional",
  TON: "Monarquia constitucional",
  TUR: "Presidencialismo",
  VUT: "Parlamentarismo",
  FJI: "Parlamentarismo",
  ESH: "Parlamentarismo",
  FLK: "Monarquia constitucional",
  ATF: "Semipresidencialismo",
  ATA: "Parlamentarismo",
  PSE: "Presidencialismo",
  "CS-KM": "Parlamentarismo",
  "-99": "Presidencialismo"
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
    capital: { name: "Nasau", population: 296522, isCapital: true },
    cities: [
      { name: "Freeport", population: 26740, isCapital: false },
      { name: "West End", population: 12345, isCapital: false },
      { name: "Coopers Town", population: 3818, isCapital: false }
    ],
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
    capital: { name: "Bandar Seri Begawan", population: 100700, isCapital: true },
    cities: [
      { name: "Kuala Belait", population: 31178, isCapital: false },
      { name: "Seria", population: 30133, isCapital: false },
      { name: "Tutong", population: 19151, isCapital: false }
    ],
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
  BMU: {
    population: 64184,
    geography: "Archipielago subtropical del Atlantico Norte",
    history: { year: 1609, type: "legal", origin: "Reino Unido" },
    politics: { system: "monarquia constitucional" },
    religion: {
      summary: "Cristianismo (Anglicanismo y Protestantismo)",
      composition: [
        { name: "Anglicanos", percentage: 23.8 },
        { name: "Protestantes", percentage: 29.4 },
        { name: "Catolicos", percentage: 15.8 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 17.8 },
        { name: "Musulmanes", percentage: 2.7 },
        { name: "Otras religiones", percentage: 10.5 }
      ]
    },
    capital: { name: "Hamilton", population: 854, isCapital: true },
    cities: [
      { name: "Saint George", population: 3398, isCapital: false },
      { name: "Somerset Village", population: 3200, isCapital: false },
      { name: "Flatts Village", population: 2200, isCapital: false }
    ]
  },
  GRL: {
    population: 56699,
    geography: "Isla artica de hielos, fiordos y tundra",
    history: { year: 1979, type: "legal", origin: "Dinamarca" },
    politics: { system: "monarquia constitucional" },
    religion: {
      summary: "Cristianismo (Luteranismo)",
      composition: [
        { name: "Cristianos luteranos", percentage: 95.5 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 2.5 },
        { name: "Musulmanes", percentage: 0.8 },
        { name: "Budistas", percentage: 0.4 },
        { name: "Otras religiones", percentage: 0.8 }
      ]
    },
    capital: { name: "Nuuk", population: 19783, isCapital: true },
    cities: [
      { name: "Sisimiut", population: 5412, isCapital: false },
      { name: "Ilulissat", population: 4670, isCapital: false },
      { name: "Qaqortoq", population: 3050, isCapital: false }
    ]
  },
  PNG: {
    population: 10329931,
    geography: "Montanas, selvas tropicales e islas melanesias",
    history: { year: 1975, type: "independencia", origin: "Australia" },
    politics: { system: "parlamentarismo" },
    religion: {
      summary: "Cristianismo (Protestantismo y Catolicismo)",
      composition: [
        { name: "Protestantes y evangelicos", percentage: 62.5 },
        { name: "Catolicos", percentage: 25.0 },
        { name: "Religiones animistas y populares", percentage: 8.0 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 2.5 },
        { name: "Otras religiones", percentage: 2.0 }
      ]
    },
    capital: { name: "Port Moresby", population: 364125, isCapital: true },
    cities: [
      { name: "Lae", population: 148934, isCapital: false },
      { name: "Arawa", population: 40266, isCapital: false },
      { name: "Mount Hagen", population: 36705, isCapital: false }
    ]
  },
  SLB: {
    population: 740424,
    geography: "Archipielago melanesio del Pacifico sur",
    history: { year: 1978, type: "independencia", origin: "Reino Unido" },
    politics: { system: "parlamentarismo" },
    religion: {
      summary: "Cristianismo (Anglicanismo y Evangelicalismo)",
      composition: [
        { name: "Cristianos anglicanos", percentage: 31.9 },
        { name: "Protestantes y evangelicos", percentage: 44.6 },
        { name: "Catolicos", percentage: 11.0 },
        { name: "Religiones animistas y populares", percentage: 5.0 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 1.5 },
        { name: "Otras religiones", percentage: 6.0 }
      ]
    },
    capital: { name: "Honiara", population: 84620, isCapital: true },
    cities: [
      { name: "Auki", population: 7890, isCapital: false },
      { name: "Gizo", population: 7160, isCapital: false },
      { name: "Buala", population: 2690, isCapital: false }
    ]
  },
  VUT: {
    population: 334506,
    geography: "Archipielago volcanico y tropical de Melanesia",
    history: { year: 1980, type: "independencia", origin: "Condominio anglo-frances" },
    politics: { system: "parlamentarismo" },
    religion: {
      summary: "Cristianismo (Protestantismo)",
      composition: [
        { name: "Protestantes y evangelicos", percentage: 70.0 },
        { name: "Catolicos", percentage: 12.4 },
        { name: "Religiones animistas y populares", percentage: 11.9 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 1.7 },
        { name: "Otras religiones", percentage: 4.0 }
      ]
    },
    capital: { name: "Port Vila", population: 49034, isCapital: true },
    cities: [
      { name: "Luganville", population: 18000, isCapital: false },
      { name: "Norsup", population: 3000, isCapital: false },
      { name: "Isangel", population: 1600, isCapital: false }
    ]
  },
  FJI: {
    population: 924610,
    geography: "Archipielago volcanico del Pacifico Sur",
    history: { year: 1970, type: "independencia", origin: "Reino Unido" },
    politics: { system: "parlamentarismo" },
    religion: {
      summary: "Cristianismo (Metodismo) e Hinduismo",
      composition: [
        { name: "Cristianos metodistas y otros", percentage: 52.0 },
        { name: "Hindues", percentage: 27.9 },
        { name: "Musulmanes sunitas", percentage: 6.3 },
        { name: "Catolicos", percentage: 9.1 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 2.5 },
        { name: "Otras religiones", percentage: 2.2 }
      ]
    },
    capital: { name: "Suva", population: 93870, isCapital: true },
    cities: [
      { name: "Nadi", population: 71448, isCapital: false },
      { name: "Lautoka", population: 71573, isCapital: false },
      { name: "Labasa", population: 27949, isCapital: false }
    ]
  },
  KOR: {
    religion: {
      summary: "Cristianismo / Budismo",
      composition: [
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 56.1 },
        { name: "Cristianos protestantes", percentage: 19.7 },
        { name: "Budistas", percentage: 15.5 },
        { name: "Catolicos", percentage: 7.9 },
        { name: "Otras religiones", percentage: 0.8 }
      ]
    }
  },
  PRK: {
    religion: {
      summary: "Ateismo estatal",
      composition: [
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 71.3 },
        { name: "Religiones animistas y populares", percentage: 12.9 },
        { name: "Budistas", percentage: 4.5 },
        { name: "Cristianos", percentage: 1.7 },
        { name: "Otras religiones", percentage: 9.6 }
      ]
    },
    capital: { name: "Pyongyang", population: 3155388, isCapital: true },
    cities: [
      { name: "Hamhung", population: 768551, isCapital: false },
      { name: "Chongjin", population: 667929, isCapital: false },
      { name: "Nampo", population: 366815, isCapital: false }
    ]
  },
  PSE: {
    population: 5483450,
    geography: "Territorios palestinos de Cisjordania y Gaza",
    history: { year: 1988, type: "independencia", origin: "Palestina bajo mandato britanico" },
    politics: { system: "semipresidencialismo" },
    religion: {
      summary: "Islam (Sunismo)",
      composition: [
        { name: "Musulmanes sunitas", percentage: 96.5 },
        { name: "Cristianos", percentage: 2.5 },
        { name: "Drusos", percentage: 0.5 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.5 }
      ]
    },
    capital: { name: "Ramallah", population: 38998, isCapital: true },
    cities: [
      { name: "Gaza", population: 778187, isCapital: false },
      { name: "Jerusalen Este", population: 361700, isCapital: false },
      { name: "Hebron", population: 215452, isCapital: false }
    ]
  },
  SSD: {
    population: 11193729,
    geography: "Llanuras niloticas y sabanas del noreste africano",
    history: { year: 2011, type: "independencia", origin: "Sudan" },
    politics: { system: "presidencialismo" },
    religion: {
      summary: "Cristianismo y religiones tradicionales",
      composition: [
        { name: "Cristianos", percentage: 60.5 },
        { name: "Religiones animistas y populares", percentage: 32.9 },
        { name: "Musulmanes sunitas", percentage: 6.2 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.4 }
      ]
    },
    capital: { name: "Juba", population: 525953, isCapital: true },
    cities: [
      { name: "Wau", population: 180000, isCapital: false },
      { name: "Malakal", population: 160765, isCapital: false },
      { name: "Yei", population: 185000, isCapital: false }
    ]
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
  AND: {
    capital: { name: "Andorra la Vieja", population: 22615, isCapital: true },
    cities: [
      { name: "Escaldes-Engordany", population: 14395, isCapital: false },
      { name: "Encamp", population: 12366, isCapital: false },
      { name: "Sant Julia de Loria", population: 9344, isCapital: false }
    ]
  },
  MLT: {
    capital: { name: "La Valeta", population: 5827, isCapital: true },
    cities: [
      { name: "Birkirkara", population: 22614, isCapital: false },
      { name: "Mosta", population: 20116, isCapital: false },
      { name: "Qormi", population: 18031, isCapital: false }
    ]
  },
  MNE: {
    capital: { name: "Podgorica", population: 179505, isCapital: true },
    cities: [
      { name: "Niksic", population: 56970, isCapital: false },
      { name: "Herceg Novi", population: 33116, isCapital: false },
      { name: "Pljevlja", population: 19289, isCapital: false }
    ]
  },
  ISL: {
    capital: { name: "Reikiavik", population: 139875, isCapital: true },
    cities: [
      { name: "Kopavogur", population: 39000, isCapital: false },
      { name: "Hafnarfjordur", population: 30000, isCapital: false },
      { name: "Akureyri", population: 19642, isCapital: false }
    ]
  },
  IRL: {
    capital: { name: "Dublin", population: 592713, isCapital: true },
    cities: [
      { name: "Cork", population: 224004, isCapital: false },
      { name: "Limerick", population: 102287, isCapital: false },
      { name: "Galway", population: 85000, isCapital: false }
    ]
  },
  SVK: {
    capital: { name: "Bratislava", population: 475503, isCapital: true },
    cities: [
      { name: "Kosice", population: 229040, isCapital: false },
      { name: "Presov", population: 84000, isCapital: false },
      { name: "Zilina", population: 80810, isCapital: false }
    ]
  },
  MDA: {
    capital: { name: "Chisinau", population: 635994, isCapital: true },
    cities: [
      { name: "Balti", population: 102457, isCapital: false },
      { name: "Tiraspol", population: 133807, isCapital: false },
      { name: "Bender", population: 91282, isCapital: false }
    ]
  },
  NCL: {
    population: 289000,
    geography: "Archipielago melanesio del Pacifico suroccidental",
    history: { year: 1853, type: "legal", origin: "Francia" },
    politics: { system: "monarquia constitucional" },
    religion: {
      summary: "Cristianismo",
      composition: [
        { name: "Catolicos", percentage: 60.0 },
        { name: "Protestantes", percentage: 10.0 },
        { name: "Religiones animistas y populares", percentage: 8.0 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 18.0 },
        { name: "Otras religiones", percentage: 4.0 }
      ]
    },
    capital: { name: "Numea", population: 94285, isCapital: true },
    cities: [
      { name: "Mont-Dore", population: 27863, isCapital: false },
      { name: "Dumbea", population: 35703, isCapital: false },
      { name: "Lifou", population: 9671, isCapital: false }
    ]
  },
  TLS: {
    population: 1360596,
    geography: "Mitad oriental de Timor y enclave de Oecusse",
    history: { year: 2002, type: "independencia", origin: "Indonesia" },
    politics: { system: "semipresidencialismo" },
    religion: {
      summary: "Cristianismo (Catolicismo)",
      composition: [
        { name: "Catolicos", percentage: 96.9 },
        { name: "Protestantes", percentage: 1.8 },
        { name: "Musulmanes", percentage: 0.4 },
        { name: "Religiones animistas y populares", percentage: 0.5 },
        { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.4 }
      ]
    },
    capital: { name: "Dili", population: 222323, isCapital: true },
    cities: [
      { name: "Baucau", population: 16186, isCapital: false },
      { name: "Maliana", population: 22413, isCapital: false },
      { name: "Suai", population: 28793, isCapital: false }
    ]
  },
  BHR: {
    capital: { name: "Manama", population: 157474, isCapital: true },
    cities: [
      { name: "Riffa", population: 111000, isCapital: false },
      { name: "Muharraq", population: 98000, isCapital: false },
      { name: "Hamad Town", population: 52718, isCapital: false }
    ]
  },
  BTN: {
    capital: { name: "Timbu", population: 114551, isCapital: true },
    cities: [
      { name: "Phuntsholing", population: 27658, isCapital: false },
      { name: "Punakha", population: 6262, isCapital: false },
      { name: "Paro", population: 15100, isCapital: false }
    ]
  },
  CIV: {
    capital: { name: "Yamusukro", population: 355573, isCapital: true },
    cities: [
      { name: "Abiyan", population: 6321000, isCapital: false },
      { name: "Bouake", population: 832371, isCapital: false },
      { name: "Daloa", population: 255921, isCapital: false }
    ]
  },
  COM: {
    capital: { name: "Moroni", population: 111329, isCapital: true },
    cities: [
      { name: "Mutsamudu", population: 30000, isCapital: false },
      { name: "Fomboni", population: 19696, isCapital: false },
      { name: "Domoni", population: 16858, isCapital: false }
    ]
  },
  GMB: {
    capital: { name: "Banjul", population: 31301, isCapital: true },
    cities: [
      { name: "Serekunda", population: 340000, isCapital: false },
      { name: "Brikama", population: 119434, isCapital: false },
      { name: "Bakau", population: 43400, isCapital: false }
    ]
  },
  GNB: {
    capital: { name: "Bisau", population: 592000, isCapital: true },
    cities: [
      { name: "Bafata", population: 22700, isCapital: false },
      { name: "Gabu", population: 14500, isCapital: false },
      { name: "Cacheu", population: 10000, isCapital: false }
    ]
  },
  LSO: {
    capital: { name: "Maseru", population: 330760, isCapital: true },
    cities: [
      { name: "Teyateyaneng", population: 75000, isCapital: false },
      { name: "Mafeteng", population: 57059, isCapital: false },
      { name: "Hlotse", population: 47297, isCapital: false }
    ]
  },
  SWZ: {
    capital: { name: "Mbabane", population: 94874, isCapital: true },
    cities: [
      { name: "Manzini", population: 110537, isCapital: false },
      { name: "Big Bend", population: 10808, isCapital: false },
      { name: "Siteki", population: 6767, isCapital: false }
    ]
  },
  BLZ: {
    capital: { name: "Belmopan", population: 20621, isCapital: true },
    cities: [
      { name: "Ciudad de Belice", population: 57669, isCapital: false },
      { name: "San Ignacio", population: 16969, isCapital: false },
      { name: "Orange Walk", population: 15781, isCapital: false }
    ]
  },
  GUY: {
    capital: { name: "Georgetown", population: 118363, isCapital: true },
    cities: [
      { name: "Linden", population: 29498, isCapital: false },
      { name: "Nueva Amsterdam", population: 35039, isCapital: false },
      { name: "Anna Regina", population: 12448, isCapital: false }
    ]
  },
  TTO: {
    capital: { name: "Puerto España", population: 37106, isCapital: true },
    cities: [
      { name: "San Fernando", population: 48338, isCapital: false },
      { name: "Chaguanas", population: 101297, isCapital: false },
      { name: "Arima", population: 35000, isCapital: false }
    ]
  },
  SUR: {
    capital: { name: "Paramaribo", population: 240924, isCapital: true },
    cities: [
      { name: "Lelydorp", population: 18923, isCapital: false },
      { name: "Nieuw Nickerie", population: 13000, isCapital: false },
      { name: "Moengo", population: 7000, isCapital: false }
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

function uniqueBy(list, getKey) {
  const seen = new Set();
  return list.filter(item => {
    const key = getKey(item);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
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

function toDisplayTitleCase(value) {
  return String(value || "")
    .toLocaleLowerCase("es")
    .replace(/(^|[\s\-/'(])([\p{L}])/gu, (match, prefix, letter) => `${prefix}${letter.toLocaleUpperCase("es")}`);
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

    const key = normalizeKey(normalizedEntry.name.replace(/\s*\([^)]*\)\s*$/g, ""));

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    result.push(normalizedEntry);
  });

  return result;
}

function sameCityName(a, b) {
  return normalizeKey(String(a || "").replace(/\s*\([^)]*\)\s*$/g, "")) === normalizeKey(String(b || "").replace(/\s*\([^)]*\)\s*$/g, ""));
}

function parseOrganizationEntry(entry) {
  if (!entry) {
    return null;
  }

  if (typeof entry !== "string") {
    return entry.name
      ? {
          name: entry.name,
          abbreviation: entry.abbreviation || null,
          startYear: compactNumber(entry.startYear),
          endYear: compactNumber(entry.endYear)
        }
      : null;
  }

  const cleaned = entry.replace(/\s+\((politica|econ[oó]mica|militar|regional)\)\s*$/i, "").trim();
  const abbreviationMatch = cleaned.match(/\(([^)]+)\)\s*$/);
  const abbreviation = abbreviationMatch ? abbreviationMatch[1].trim() : null;
  const name = abbreviationMatch ? cleaned.replace(/\(([^)]+)\)\s*$/,"").trim() : cleaned;

  if (!name) {
    return null;
  }

  return {
    name,
    abbreviation,
    startYear: null,
    endYear: null
  };
}

function normalizeRivalEntry(entry) {
  if (!entry) {
    return null;
  }

  if (typeof entry === "string") {
    return { name: toDisplayTitleCase(entry), type: "historico" };
  }

  if (!entry.name) {
    return null;
  }

  return {
    name: toDisplayTitleCase(entry.name),
    type: entry.type || "historico"
  };
}

function deriveOfficialName(code, commonName, system) {
  if (OFFICIAL_NAME_OVERRIDES[code]) {
    return OFFICIAL_NAME_OVERRIDES[code];
  }

  const normalizedSystem = normalizeKey(system);
  if (normalizedSystem.includes("monarquia")) {
    return `Reino de ${commonName}`;
  }
  if (normalizedSystem.includes("teocracia")) {
    return `Estado de ${commonName}`;
  }
  if (normalizedSystem.includes("dependencia") || normalizedSystem.includes("territorio")) {
    return commonName;
  }
  if (normalizedSystem.includes("federal")) {
    return `Republica Federal de ${commonName}`;
  }
  if (commonName.startsWith("Republica") || commonName.startsWith("Reino") || commonName.startsWith("Estado")) {
    return commonName;
  }
  return `Republica de ${commonName}`;
}

function deriveHistoricalNames(code, historyEntry) {
  const historicalNames = [...(HISTORICAL_NAME_OVERRIDES[code] || [])];
  if (historyEntry?.origin && !historicalNames.includes(historyEntry.origin)) {
    historicalNames.push(historyEntry.origin);
  }
  return historicalNames.filter(Boolean);
}

function buildSymbolMetadata(code, commonName) {
  return {
    flagDescription: SYMBOL_OVERRIDES[code]?.flagDescription || `Bandera asociada a ${commonName}`,
    coatOfArms: SYMBOL_OVERRIDES[code]?.coatOfArms || null
  };
}

function deriveLanguages(code, historyEntry) {
  if (LANGUAGE_OVERRIDES[code]?.length) {
    return LANGUAGE_OVERRIDES[code];
  }

  const linkedCode = (TERRITORY_LINKS[code] || []).find(candidate => LANGUAGE_OVERRIDES[candidate]?.length);
  if (linkedCode) {
    return LANGUAGE_OVERRIDES[linkedCode];
  }

  const origin = normalizeKey(historyEntry?.origin);
  if (origin.includes("francia")) return ["Francés"];
  if (origin.includes("reino unido")) return ["Inglés"];
  if (origin.includes("espana")) return ["Español"];
  if (origin.includes("portugal")) return ["Portugués"];
  if (origin.includes("paises bajos")) return ["Neerlandés"];
  if (origin.includes("dinamarca")) return ["Danés"];
  if (origin.includes("estados unidos")) return ["Inglés"];

  return [];
}

function deriveCapitalProfiles(code, capital, cities = []) {
  const overrides = CAPITAL_ROLE_OVERRIDES[code];
  const byName = new Map(
    [capital, ...cities]
      .filter(entry => entry?.name)
      .map(entry => [normalizeKey(entry.name), entry])
  );

  if (overrides?.length) {
    return overrides.map(item => {
      const city = byName.get(normalizeKey(item.name));
      return {
        role: item.role,
        name: item.name,
        population: compactNumber(item.population ?? city?.population)
      };
    });
  }

  if (!capital?.name) {
    return [];
  }

  return [
    {
      role: "nacional",
      name: capital.name,
      population: compactNumber(capital.population)
    }
  ];
}

function deriveStateStructure(code, politicalSystem, officialName) {
  if (STATE_STRUCTURE_OVERRIDES[code]) {
    return STATE_STRUCTURE_OVERRIDES[code];
  }

  const system = normalizeKey(politicalSystem);
  const name = normalizeKey(officialName);

  if (system.includes("territorio") || system.includes("dependencia")) {
    return "Territorio dependiente o asociado";
  }
  if (name.includes("federal") || system.includes("federal")) {
    return "Estado federal";
  }
  if (system.includes("monarquia")) {
    return "Monarquía constitucional o absoluta de base unitaria";
  }
  if (system.includes("teocracia")) {
    return "Estado unitario teocrático";
  }
  if (system.includes("parlament")) {
    return "Estado unitario parlamentario";
  }
  if (system.includes("presidencial")) {
    return "Estado unitario presidencial";
  }
  if (system.includes("semipresidencial")) {
    return "Estado unitario semipresidencial";
  }

  return "Estado soberano";
}

function deriveSubdivisionMetadata(code, politicalSystem, stateStructure) {
  if (SUBDIVISION_OVERRIDES[code]) {
    return SUBDIVISION_OVERRIDES[code];
  }

  const normalized = normalizeKey(`${politicalSystem || ""} ${stateStructure || ""}`);
  if (normalized.includes("federal")) {
    return { type: "estados o provincias federadas", count: null };
  }
  if (normalized.includes("territorio") || normalized.includes("dependencia")) {
    return { type: "municipios, distritos o divisiones administrativas", count: null };
  }
  return { type: "provincias, regiones o departamentos", count: null };
}

function buildMetadataSources(code, context = {}) {
  const withManual = section => [
    ...section,
    "Curaduría manual interna"
  ];

  return {
    general: withManual([
      "country_names.json",
      "countries_base.json",
      "population.csv",
      "city_details.json"
    ]),
    history: withManual([
      "history.json",
      "conflicts.json"
    ]),
    economy: withManual([
      "worldbank_gdp.csv",
      "gdp_per_capita.csv",
      "inflation.json"
    ]),
    military: withManual([
      "military.json",
      "conflicts.json"
    ]),
    politics: withManual([
      "politics.json",
      "politics_details.json",
      "continents.json"
    ]),
    religion: withManual([
      "religion.json",
      "religion_details.json"
    ])
  };
}

function buildQualityMetadata(context = {}) {
  const estimatedFields = [];
  const curatedFields = [];

  if (!context.populationFromPrimarySource && context.populationValue) {
    estimatedFields.push("general.population");
  }
  if (!context.inflationFromPrimarySource && context.inflationValue !== null && context.inflationValue !== undefined) {
    estimatedFields.push("economy.inflation");
  }
  if (!context.religionCompositionFromPrimarySource && context.religionCompositionCount) {
    estimatedFields.push("religion.composition");
  }
  if (!context.organizationFromPrimarySource && context.organizationCount) {
    estimatedFields.push("politics.organizations");
  }

  if (context.languagesCount) {
    curatedFields.push("general.languages");
  }
  if (context.capitalsCount > 1) {
    curatedFields.push("general.capitals");
  }
  if (context.stateStructure) {
    curatedFields.push("general.stateStructure");
  }
  if (context.subdivisionType) {
    curatedFields.push("general.subdivisions");
  }
  if (context.hasCuratedTimeline) {
    curatedFields.push("history.events");
  }
  if (context.hasCuratedConflicts) {
    curatedFields.push("military.conflicts");
  }

  return {
    estimatedFields,
    curatedFields,
    sectionStatus: {
      general: context.languagesCount || context.capitalsCount || context.stateStructure ? "curated" : "base",
      history: context.hasCuratedTimeline ? "curated" : "base",
      economy: !context.inflationFromPrimarySource && context.inflationValue !== null && context.inflationValue !== undefined ? "mixed" : "confirmed",
      military: context.hasCuratedConflicts ? "curated" : "base",
      politics: context.organizationCount || context.rivalCount ? "curated" : "base",
      religion: context.religionCompositionCount ? (context.religionCompositionFromPrimarySource ? "confirmed" : "mixed") : "base"
    }
  };
}

function deriveMetropole(code, historyEntry) {
  const origin = normalizeKey(historyEntry?.origin);
  if (!origin) {
    return null;
  }

  if (
    (code === "GBR" && origin.includes("reino unido")) ||
    (code === "FRA" && origin.includes("francia")) ||
    (code === "ESP" && origin.includes("espana")) ||
    (code === "PRT" && origin.includes("portugal"))
  ) {
    return null;
  }

  const pairs = [
    ["reino unido", "Reino Unido"],
    ["francia", "Francia"],
    ["espana", "España"],
    ["portugal", "Portugal"],
    ["paises bajos", "Países Bajos"],
    ["holanda", "Países Bajos"],
    ["dinamarca", "Dinamarca"],
    ["australia", "Australia"],
    ["estados unidos", "Estados Unidos"],
    ["somalia", "Somalia"],
    ["serbia", "Serbia"],
    ["francia", "Francia"]
  ];

  const match = pairs.find(([key]) => origin.includes(normalizeKey(key)));
  const resolved = match ? match[1] : null;
  return resolved && normalizeKey(resolved) !== normalizeKey(COUNTRY_NAME_OVERRIDES[code] || code)
    ? resolved
    : null;
}

function getOrganizationBlocks(organizations) {
  const blockRules = [
    { key: "otan", label: "OTAN" },
    { key: "otan", label: "NATO" },
    { key: "union europea", label: "Union Europea" },
    { key: "ue", label: "Union Europea" },
    { key: "mercosur", label: "Mercosur" },
    { key: "union africana", label: "Union Africana" },
    { key: "asean", label: "ASEAN" },
    { key: "commonwealth", label: "Commonwealth" },
    { key: "otan", label: "OTAN" },
    { key: "onu", label: "ONU" }
  ];

  return uniqueBy(
    organizations.flatMap(organization => {
      const label = normalizeKey(organization?.name || organization);
      return blockRules
        .filter(rule => label.includes(normalizeKey(rule.key)))
        .map(rule => rule.label);
    }),
    item => normalizeKey(item)
  );
}

function buildRelationMetadata(code, historyEntry, organizations, rivals) {
  const metropole = deriveMetropole(code, historyEntry);
  const territories = TERRITORY_LINKS[code] || [];
  const override = RELATION_OVERRIDES[code] || {};
  return {
    exMetropole: metropole,
    linkedTerritories: territories,
    blocs: uniqueBy([...(getOrganizationBlocks(organizations) || []), ...(override.blocs || [])], item => normalizeKey(item)),
    allies: uniqueBy(override.allies || [], item => normalizeKey(item)),
    rivalStates: uniqueBy([...(rivals.map(rival => rival?.name || rival)), ...(override.rivalStates || [])], item => normalizeKey(item)),
    disputes: uniqueBy(override.disputes || [], item => normalizeKey(item)),
    protectorates: uniqueBy(override.protectorates || [], item => normalizeKey(item))
  };
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
  KOR: [
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 56.1 },
    { name: "Cristianos protestantes", percentage: 19.7 },
    { name: "Budistas", percentage: 15.5 },
    { name: "Catolicos", percentage: 7.9 },
    { name: "Otras religiones", percentage: 0.8 }
  ],
  PRK: [
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 71.3 },
    { name: "Religiones animistas y populares", percentage: 12.9 },
    { name: "Budistas", percentage: 4.5 },
    { name: "Cristianos", percentage: 1.7 },
    { name: "Otras religiones", percentage: 9.6 }
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
  ],
  EGY: [
    { name: "Musulmanes sunitas", percentage: 89.6 },
    { name: "Cristianos coptos", percentage: 9.4 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 1 }
  ],
  IRN: [
    { name: "Musulmanes chiitas", percentage: 90 },
    { name: "Musulmanes sunitas", percentage: 8 },
    { name: "Zoroastros", percentage: 0.2 },
    { name: "Judios", percentage: 0.2 },
    { name: "Cristianos", percentage: 0.6 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 1 }
  ],
  TUR: [
    { name: "Musulmanes sunitas", percentage: 82 },
    { name: "Musulmanes alevies", percentage: 12 },
    { name: "Cristianos", percentage: 0.4 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 5.6 }
  ],
  PAK: [
    { name: "Musulmanes sunitas", percentage: 84 },
    { name: "Musulmanes chiitas", percentage: 15 },
    { name: "Cristianos", percentage: 1 },
    { name: "Hindues", percentage: 0.6 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.4 }
  ],
  SAU: [
    { name: "Musulmanes sunitas", percentage: 85 },
    { name: "Musulmanes chiitas", percentage: 10 },
    { name: "Cristianos", percentage: 2.5 },
    { name: "Hindues", percentage: 1.5 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 1 }
  ],
  IDN: [
    { name: "Musulmanes sunitas", percentage: 86.7 },
    { name: "Cristianos protestantes", percentage: 7.6 },
    { name: "Catolicos", percentage: 3.1 },
    { name: "Hindues", percentage: 1.7 },
    { name: "Budistas", percentage: 0.7 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.2 }
  ],
  NGA: [
    { name: "Musulmanes sunitas", percentage: 50 },
    { name: "Protestantes y evangelicos", percentage: 35 },
    { name: "Catolicos", percentage: 10.5 },
    { name: "Religiones animistas y populares", percentage: 4 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.5 }
  ],
  MEX: [
    { name: "Catolicos", percentage: 77.7 },
    { name: "Protestantes y evangelicos", percentage: 11.2 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 8.1 },
    { name: "Otras religiones", percentage: 3 }
  ],
  ZAF: [
    { name: "Protestantes y evangelicos", percentage: 36.5 },
    { name: "Catolicos", percentage: 7.1 },
    { name: "Cristianos independientes africanos", percentage: 28.8 },
    { name: "Religiones animistas y populares", percentage: 8.5 },
    { name: "Musulmanes", percentage: 2.5 },
    { name: "Hindues", percentage: 1.9 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 14.7 }
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

function inferReligionSummary(composition, fallbackSummary = null) {
  if (fallbackSummary) {
    return fallbackSummary;
  }

  if (!Array.isArray(composition) || !composition.length) {
    return null;
  }

  const main = [...composition]
    .filter(entry => entry?.name && typeof entry.percentage === "number")
    .sort((a, b) => b.percentage - a.percentage)[0];

  return main?.name || null;
}

function mergeConflictSources(code, ...sources) {
  const merged = normalizeConflicts(sources.flat());
  const deduped = uniqueBy(
    merged,
    entry => `${normalizeKey(entry?.name)}:${entry?.startYear ?? ""}:${entry?.endYear ?? ""}:${entry?.ongoing ? 1 : 0}`
  ).sort((a, b) => (a.startYear ?? 9999) - (b.startYear ?? 9999));

  const overrides = CURATED_CONFLICT_OVERRIDES[code];
  if (!overrides) {
    return deduped;
  }

  return uniqueBy(
    [...deduped, ...normalizeConflicts(overrides)],
    entry => `${normalizeKey(entry?.name)}:${entry?.startYear ?? ""}:${entry?.endYear ?? ""}:${entry?.ongoing ? 1 : 0}`
  ).sort((a, b) => (a.startYear ?? 9999) - (b.startYear ?? 9999));
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
    city => !capital || !sameCityName(city.name, capital.name)
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

  const religionSummaryFallback =
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
    religionSummaryFallback,
    religionCompositionSource
  );
  const religionSummary = inferReligionSummary(religionComposition, religionSummaryFallback);
  const mergedConflicts = mergeConflictSources(code, conflicts[code], baseData.conflicts, fallback.conflicts);
  const mergedOrganizations = uniqueBy(
    [
      ...compactList(politicsData.organizations).map(parseOrganizationEntry),
      ...compactList(baseData.organizations).map(parseOrganizationEntry),
      ...compactList(fallback.politics?.organizations).map(parseOrganizationEntry),
      ...compactList(ORGANIZATION_FILL_OVERRIDES[code]).map(parseOrganizationEntry)
    ].filter(Boolean),
    item => normalizeKey(item?.name)
  );
  const mergedRivals = uniqueBy(
    [
      ...compactList(politicsData.rivals).map(normalizeRivalEntry),
      ...compactList(baseData.rivals).map(normalizeRivalEntry),
      ...compactList(fallback.politics?.rivals).map(normalizeRivalEntry),
      ...compactList(RIVAL_FILL_OVERRIDES[code]).map(normalizeRivalEntry)
    ].filter(Boolean),
    item => `${normalizeKey(item?.name)}:${item?.type || "historico"}`
  );
  const officialName = deriveOfficialName(
    code,
    COUNTRY_NAME_OVERRIDES[code] ||
      countryNames[code] ||
      baseData.name ||
      populationData?.name ||
      gdpData?.name ||
      gdpPerCapitaData?.name ||
      code,
    politicsData.system || politics[code] || fallback.politics?.system || baseData.system
  );
  const historicalNames = deriveHistoricalNames(code, historyEntry);
  const symbols = buildSymbolMetadata(code, officialName);
  const languages = deriveLanguages(code, historyEntry);
  const capitals = deriveCapitalProfiles(code, capital, cities);
  const stateStructure = deriveStateStructure(
    code,
    politicsData.system || politics[code] || fallback.politics?.system || baseData.system,
    officialName
  );
  const subdivisions = deriveSubdivisionMetadata(
    code,
    politicsData.system || politics[code] || fallback.politics?.system || baseData.system,
    stateStructure
  );
  const relationMetadata = buildRelationMetadata(code, historyEntry, mergedOrganizations, mergedRivals);
  const finalRivals = uniqueBy(
    [
      ...mergedRivals,
      ...compactList(relationMetadata.rivalStates).map(name => normalizeRivalEntry({ name, type: "actual" }))
    ].filter(Boolean),
    item => `${normalizeKey(item?.name)}:${item?.type || "historico"}`
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
      officialName,
      historicalNames,
      symbols,
      capital,
      capitals,
      languages,
      stateStructure,
      subdivisions,
      cities
    },
    history: historyEntry,
    economy: {
      gdp: gdpData?.value ?? null,
      gdpPerCapita: gdpPerCapitaData?.value ?? null,
      inflation: inflation[code] ?? INFLATION_OVERRIDES[code] ?? null,
      exports: compactList(baseData.exports),
      industries: compactList(baseData.industries)
    },
    military: {
      active: militaryData?.active ?? null,
      reserve: militaryData?.reserve ?? null,
      conflicts: mergedConflicts
    },
    politics: {
      system:
        POLITICAL_SYSTEM_OVERRIDES[code] ||
        politicsData.system ||
        politics[code] ||
        fallback.politics?.system ||
        baseData.system ||
        historyEntry?.type ||
        "Estado soberano",
      organizations: mergedOrganizations,
      rivals: finalRivals,
      relations: relationMetadata
    },
    religion: {
      summary: religionSummary,
      composition: religionComposition
    },
    metadata: {
      updatedAt: BUILD_UPDATED_AT,
      sources: buildMetadataSources(code, {
        organizations: mergedOrganizations,
        rivals: finalRivals,
        conflicts: mergedConflicts
      }),
      quality: buildQualityMetadata({
        populationFromPrimarySource: populationData?.value !== undefined && populationData?.value !== null,
        populationValue:
          populationData?.value ??
          fallback.population ??
          baseData.population ??
          populationFallbackFromCities ??
          null,
        inflationFromPrimarySource: inflation[code] !== undefined && inflation[code] !== null,
        inflationValue: inflation[code] ?? INFLATION_OVERRIDES[code] ?? null,
        religionCompositionFromPrimarySource: compactList(religionData.composition).length > 0,
        religionCompositionCount: religionComposition.length,
        organizationFromPrimarySource: compactList(politicsData.organizations).length > 0,
        organizationCount: mergedOrganizations.length,
        rivalCount: finalRivals.length,
        languagesCount: languages.length,
        capitalsCount: capitals.length,
        stateStructure,
        subdivisionType: subdivisions?.type,
        hasCuratedTimeline: Boolean(TIMELINE_EVENT_OVERRIDES[code]?.length),
        hasCuratedConflicts: Boolean(CURATED_CONFLICT_OVERRIDES[code]?.length)
      })
    },
    conflicts: mergedConflicts,
    organizations: compactList(baseData.organizations),
    rivals: compactList(baseData.rivals)
  };

  if ((!result[code].religion.composition || !result[code].religion.composition.length) && RELIGION_DETAIL_OVERRIDES[code]) {
    result[code].religion.composition = RELIGION_DETAIL_OVERRIDES[code];
    result[code].religion.summary = inferReligionSummary(
      RELIGION_DETAIL_OVERRIDES[code],
      result[code].religion.summary
    );
  }

  if ((!result[code].general.cities || !result[code].general.cities.length) && fallback.cities?.length) {
    result[code].general.cities = buildCityList(fallback.cities).filter(
      city => !result[code].general.capital || !sameCityName(city.name, result[code].general.capital.name)
    );
  }

  const postBuildOverride = POST_BUILD_ENTITY_OVERRIDES[code];
  if (postBuildOverride?.general?.capital) {
    result[code].general.capital = postBuildOverride.general.capital;
    result[code].general.capitals = deriveCapitalProfiles(code, result[code].general.capital, result[code].general.cities);
  }
  if (postBuildOverride?.general?.cities?.length) {
    result[code].general.cities = buildCityList(postBuildOverride.general.cities).filter(
      city => !result[code].general.capital || !sameCityName(city.name, result[code].general.capital.name)
    );
    result[code].general.capitals = deriveCapitalProfiles(code, result[code].general.capital, result[code].general.cities);
  }
  if (result[code].general.cities?.length === 1 && postBuildOverride?.general?.cities?.length) {
    result[code].general.cities = buildCityList(postBuildOverride.general.cities).filter(
      city => !result[code].general.capital || !sameCityName(city.name, result[code].general.capital.name)
    );
    result[code].general.capitals = deriveCapitalProfiles(code, result[code].general.capital, result[code].general.cities);
  }
  if (result[code].conflicts?.length === 0 && CURATED_CONFLICT_OVERRIDES[code]) {
    result[code].conflicts = normalizeConflicts(CURATED_CONFLICT_OVERRIDES[code]);
  }

  if (result[code].history) {
    result[code].history.events = TIMELINE_EVENT_OVERRIDES[code] || [];
  }

  result[code].military.conflicts = result[code].conflicts;
  result[code].metadata.quality = buildQualityMetadata({
    populationFromPrimarySource: populationData?.value !== undefined && populationData?.value !== null,
    populationValue: result[code].general.population,
    inflationFromPrimarySource: inflation[code] !== undefined && inflation[code] !== null,
    inflationValue: result[code].economy.inflation,
    religionCompositionFromPrimarySource: compactList(religionData.composition).length > 0,
    religionCompositionCount: result[code].religion.composition.length,
    organizationFromPrimarySource: compactList(politicsData.organizations).length > 0,
    organizationCount: result[code].politics.organizations.length,
    rivalCount: result[code].politics.rivals.length,
    languagesCount: result[code].general.languages.length,
    capitalsCount: result[code].general.capitals.length,
    stateStructure: result[code].general.stateStructure,
    subdivisionType: result[code].general.subdivisions?.type,
    hasCuratedTimeline: Boolean(result[code].history?.events?.length),
    hasCuratedConflicts: Boolean(CURATED_CONFLICT_OVERRIDES[code]?.length)
  });
}

fs.writeJsonSync("./data/countries_full.json", result, { spaces: 2 });

console.log(`Dataset generado: ${Object.keys(result).length} paises.`);
