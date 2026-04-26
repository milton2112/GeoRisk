import fs from "fs-extra";
import csvParser from "csv-parser";
import {
  canonicalizeConflictNameWithRules,
  inferConflictYearsFromText,
  mergeConflictEntries
} from "./lib/conflict-cleaning.js";
import { repairMojibake as repairMojibakeShared } from "./lib/text-normalization.js";

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

const BUILD_UPDATED_AT = "2026-04-11";

const LANGUAGE_OVERRIDES = {
  ATA: ["Sin idioma oficial continental", "Ingles", "Español", "Frances", "Ruso"],
  ARG: ["EspaÃ±ol"],
  AND: ["CatalÃ¡n"],
  ARE: ["Ãrabe"],
  AFG: ["PastÃºn", "DarÃ­"],
  AGO: ["PortuguÃ©s"],
  ALB: ["AlbanÃ©s"],
  ARM: ["Armenio"],
  AUS: ["InglÃ©s"],
  AUT: ["AlemÃ¡n"],
  AZE: ["AzerÃ­"],
  BEL: ["NeerlandÃ©s", "FrancÃ©s", "AlemÃ¡n"],
  BEN: ["FrancÃ©s"],
  BGD: ["BengalÃ­"],
  BHR: ["Ãrabe"],
  BIH: ["Bosnio", "Croata", "Serbio"],
  BLR: ["Bielorruso", "Ruso"],
  BOL: ["EspaÃ±ol", "Quechua", "Aimara", "GuaranÃ­"],
  BRA: ["PortuguÃ©s"],
  BRN: ["Malayo"],
  BTN: ["Dzongkha"],
  BWA: ["InglÃ©s", "Setsuana"],
  BDI: ["Kirundi", "FrancÃ©s", "InglÃ©s"],
  BFA: ["FrancÃ©s"],
  BGR: ["BÃºlgaro"],
  CAN: ["InglÃ©s", "FrancÃ©s"],
  CAF: ["Sango", "FrancÃ©s"],
  CMR: ["FrancÃ©s", "InglÃ©s"],
  CHE: ["AlemÃ¡n", "FrancÃ©s", "Italiano", "Romanche"],
  CHL: ["EspaÃ±ol"],
  CHN: ["Chino mandarÃ­n"],
  COL: ["EspaÃ±ol"],
  COD: ["FrancÃ©s", "Lingala", "Suajili", "Kikongo", "Tshiluba"],
  COG: ["FrancÃ©s"],
  COM: ["Comorense", "Ãrabe", "FrancÃ©s"],
  CRI: ["EspaÃ±ol"],
  CUB: ["EspaÃ±ol"],
  CIV: ["FrancÃ©s"],
  CYP: ["Griego", "Turco"],
  CZE: ["Checo"],
  DEU: ["AlemÃ¡n"],
  DNK: ["DanÃ©s"],
  DOM: ["EspaÃ±ol"],
  DJI: ["Ãrabe", "FrancÃ©s"],
  DZA: ["Ãrabe", "Tamazight"],
  ECU: ["EspaÃ±ol"],
  EGY: ["Ãrabe"],
  ERI: ["TigriÃ±a", "Ãrabe", "InglÃ©s"],
  ESH: ["Ãrabe", "EspaÃ±ol"],
  ESP: ["EspaÃ±ol"],
  EST: ["Estonio"],
  ETH: ["AmÃ¡rico"],
  FIN: ["FinÃ©s", "Sueco"],
  FJI: ["InglÃ©s", "Fiyiano", "Hindi fiyiano"],
  FLK: ["InglÃ©s"],
  FRA: ["FrancÃ©s"],
  GAB: ["FrancÃ©s"],
  GBR: ["InglÃ©s"],
  GEO: ["Georgiano"],
  GHA: ["InglÃ©s"],
  GMB: ["InglÃ©s"],
  GIN: ["FrancÃ©s"],
  GNB: ["PortuguÃ©s"],
  GNQ: ["EspaÃ±ol", "FrancÃ©s", "PortuguÃ©s"],
  GRC: ["Griego"],
  GRL: ["GroenlandÃ©s", "DanÃ©s"],
  GTM: ["EspaÃ±ol"],
  GUF: ["FrancÃ©s"],
  GUY: ["InglÃ©s"],
  HND: ["EspaÃ±ol"],
  HRV: ["Croata"],
  HTI: ["Criollo haitiano", "FrancÃ©s"],
  HUN: ["HÃºngaro"],
  IDN: ["Indonesio"],
  IND: ["Hindi", "InglÃ©s"],
  IRL: ["IrlandÃ©s", "InglÃ©s"],
  IRN: ["Persa"],
  IRQ: ["Ãrabe", "Kurdo"],
  ISL: ["IslandÃ©s"],
  ISR: ["Hebreo", "Ãrabe"],
  ITA: ["Italiano"],
  JAM: ["InglÃ©s"],
  JPN: ["JaponÃ©s"],
  JOR: ["Ãrabe"],
  KAZ: ["Kazajo", "Ruso"],
  KEN: ["Suajili", "InglÃ©s"],
  KGZ: ["KirguÃ­s", "Ruso"],
  KHM: ["Jemer"],
  KOR: ["Coreano"],
  KWT: ["Ãrabe"],
  LAO: ["Lao"],
  LBN: ["Ãrabe"],
  LBR: ["InglÃ©s"],
  LBY: ["Ãrabe"],
  LKA: ["CingalÃ©s", "Tamil"],
  LSO: ["Sesoto", "InglÃ©s"],
  LTU: ["Lituano"],
  LUX: ["LuxemburguÃ©s", "FrancÃ©s", "AlemÃ¡n"],
  LVA: ["LetÃ³n"],
  MAR: ["Ãrabe", "Tamazight"],
  MDA: ["Rumano"],
  MDG: ["Malgache", "FrancÃ©s"],
  MEX: ["EspaÃ±ol"],
  MKD: ["Macedonio", "AlbanÃ©s"],
  MLI: ["FrancÃ©s"],
  MMR: ["Birmano"],
  MNE: ["Montenegrino"],
  MNG: ["Mongol"],
  MOZ: ["PortuguÃ©s"],
  MRT: ["Ãrabe"],
  MWI: ["InglÃ©s", "Chichewa"],
  MYS: ["Malayo"],
  NAM: ["InglÃ©s"],
  NCL: ["FrancÃ©s"],
  NER: ["FrancÃ©s"],
  NGA: ["InglÃ©s"],
  NIC: ["EspaÃ±ol"],
  NLD: ["NeerlandÃ©s"],
  NOR: ["Noruego"],
  NPL: ["NepalÃ­"],
  NZL: ["InglÃ©s", "MaorÃ­", "Lengua de seÃ±as neozelandesa"],
  OMN: ["Ãrabe"],
  PAK: ["Urdu", "InglÃ©s"],
  PAN: ["EspaÃ±ol"],
  PER: ["EspaÃ±ol", "Quechua", "Aimara"],
  PHL: ["Filipino", "InglÃ©s"],
  PNG: ["InglÃ©s", "Tok pisin", "Hiri motu"],
  POL: ["Polaco"],
  PRY: ["EspaÃ±ol", "GuaranÃ­"],
  PRI: ["EspaÃ±ol", "InglÃ©s"],
  PRK: ["Coreano"],
  PRT: ["PortuguÃ©s"],
  PSE: ["Ãrabe"],
  QAT: ["Ãrabe"],
  ROU: ["Rumano"],
  RUS: ["Ruso"],
  RWA: ["Kinyarwanda", "FrancÃ©s", "InglÃ©s", "Suajili"],
  SAU: ["Ãrabe"],
  SDN: ["Ãrabe", "InglÃ©s"],
  SEN: ["FrancÃ©s"],
  SGP: ["InglÃ©s", "Malayo", "MandarÃ­n", "Tamil"],
  SLB: ["InglÃ©s"],
  SLE: ["InglÃ©s"],
  SLV: ["EspaÃ±ol"],
  SOM: ["SomalÃ­", "Ãrabe"],
  SRB: ["Serbio"],
  SSD: ["InglÃ©s"],
  SUR: ["NeerlandÃ©s"],
  SVK: ["Eslovaco"],
  SVN: ["Esloveno"],
  SWE: ["Sueco"],
  SWZ: ["Suazi", "InglÃ©s"],
  SYR: ["Ãrabe"],
  TCD: ["Ãrabe", "FrancÃ©s"],
  THA: ["TailandÃ©s"],
  TJK: ["Tayiko"],
  TGO: ["FrancÃ©s"],
  TKM: ["Turcomano"],
  TLS: ["Tetun", "PortuguÃ©s"],
  TTO: ["InglÃ©s"],
  TUN: ["Ãrabe"],
  TUR: ["Turco"],
  TWN: ["Chino mandarÃ­n"],
  TZA: ["Suajili", "InglÃ©s"],
  UGA: ["InglÃ©s", "Suajili"],
  UKR: ["Ucraniano"],
  URY: ["EspaÃ±ol"],
  USA: ["InglÃ©s"],
  UZB: ["Uzbeko"],
  VEN: ["EspaÃ±ol"],
  VNM: ["Vietnamita"],
  VUT: ["Bislama", "InglÃ©s", "FrancÃ©s"],
  YEM: ["Ãrabe"],
  ZAF: ["ZulÃº", "Xhosa", "AfrikÃ¡ans", "InglÃ©s", "Sepedi", "Setsuana", "Sesoto", "Xitsonga", "Siswati", "Tshivenda", "Ndebele del sur"],
  ZMB: ["InglÃ©s"],
  ZWE: ["InglÃ©s", "Shona", "Sindebele"],
  "CS-KM": ["AlbanÃ©s", "Serbio"],
  "-99": ["SomalÃ­", "Ãrabe"]
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
    { role: "constitucional", name: "Ãmsterdam" },
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
    { role: "reclamada", name: "JerusalÃ©n Este" },
    { role: "administrativa", name: "Ramala" }
  ]
};

const STATE_STRUCTURE_OVERRIDES = {
  ARG: "Estado federal presidencial",
  AUS: "MonarquÃ­a constitucional federal parlamentaria",
  AUT: "RepÃºblica federal parlamentaria",
  BEL: "MonarquÃ­a constitucional federal parlamentaria",
  BOL: "Estado plurinacional unitario descentralizado",
  BIH: "Estado federal complejo con entidades constitutivas",
  BRA: "RepÃºblica federal presidencial",
  CAN: "MonarquÃ­a constitucional federal parlamentaria",
  CHE: "RepÃºblica federal directorial",
  CHN: "Estado socialista unitario de partido Ãºnico",
  DEU: "RepÃºblica federal parlamentaria",
  ESP: "MonarquÃ­a constitucional con Estado autonÃ³mico",
  FRA: "RepÃºblica unitaria semipresidencial",
  GBR: "MonarquÃ­a constitucional unitaria con devolucion",
  IND: "RepÃºblica federal parlamentaria",
  IRN: "RepÃºblica teocrÃ¡tica unitaria",
  ISR: "RepÃºblica parlamentaria unitaria",
  ITA: "RepÃºblica parlamentaria unitaria regionalizada",
  MEX: "RepÃºblica federal presidencial",
  MYS: "MonarquÃ­a constitucional federal parlamentaria",
  NGA: "RepÃºblica federal presidencial",
  NLD: "MonarquÃ­a constitucional unitaria descentralizada",
  PAK: "RepÃºblica federal parlamentaria",
  RUS: "RepÃºblica federal semipresidencial",
  ZAF: "RepÃºblica parlamentaria unitaria descentralizada",
  USA: "RepÃºblica federal presidencial",
  ARE: "FederaciÃ³n de emiratos",
  PRI: "Territorio no incorporado de Estados Unidos",
  GUF: "Departamento y regiÃ³n de ultramar de Francia",
  NCL: "Colectividad especial francesa de ultramar",
  ATF: "Territorio francÃ©s de ultramar",
  BMU: "Territorio britÃ¡nico de ultramar",
  FLK: "Territorio britÃ¡nico de ultramar",
  GRL: "Territorio autÃ³nomo dentro del Reino de Dinamarca",
  PSE: "Estado con reconocimiento limitado y administraciÃ³n dividida",
  ATA: "Espacio internacional regido por el Sistema del Tratado AntÃ¡rtico"
};

const SUBDIVISION_OVERRIDES = {
  ARG: { type: "provincias y ciudad autÃ³noma", count: 24 },
  ARE: { type: "emiratos", count: 7 },
  AUS: { type: "estados y territorios", count: 8 },
  AUT: { type: "estados federados", count: 9 },
  BEL: { type: "regiones y comunidades", count: 6, notes: "Sistema federal complejo con doble eje territorial y lingÃ¼Ã­stico" },
  BOL: { type: "departamentos", count: 9 },
  BRA: { type: "estados y distrito federal", count: 27 },
  CAN: { type: "provincias y territorios", count: 13 },
  CHE: { type: "cantones", count: 26 },
  CHN: { type: "provincias, regiones autÃ³nomas, municipios y regiones administrativas especiales", count: 34 },
  DEU: { type: "estados federados", count: 16 },
  ESP: { type: "comunidades y ciudades autÃ³nomas", count: 19 },
  FRA: { type: "regiones y departamentos", notes: "Incluye Francia metropolitana y ultramar" },
  GBR: { type: "naciones constituyentes y subdivisiones", count: 4 },
  IND: { type: "estados y territorios de la UniÃ³n", count: 36 },
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
  ATA: [
    { name: "Sistema del Tratado Antartico", abbreviation: "ATS", startYear: 1959, endYear: null },
    { name: "Tratado Antartico", abbreviation: null, startYear: 1959, endYear: null },
    { name: "Comite Cientifico de Investigacion Antartica", abbreviation: "SCAR", startYear: 1958, endYear: null },
    { name: "Convencion para la Conservacion de los Recursos Vivos Marinos Antarticos", abbreviation: "CCRVMA", startYear: 1982, endYear: null }
  ],
  BHS: [
    { name: "OrganizaciÃ³n de las Naciones Unidas", abbreviation: "UN", startYear: 1973, endYear: null },
    { name: "OrganizaciÃ³n de los Estados Americanos", abbreviation: "OEA", startYear: 1982, endYear: null },
    { name: "Comunidad del Caribe", abbreviation: "CARICOM", startYear: 1983, endYear: null },
    { name: "Mancomunidad de Naciones", abbreviation: null, startYear: 1973, endYear: null }
  ],
  BLZ: [
    { name: "OrganizaciÃ³n de las Naciones Unidas", abbreviation: "UN", startYear: 1981, endYear: null },
    { name: "OrganizaciÃ³n de los Estados Americanos", abbreviation: "OEA", startYear: 1981, endYear: null },
    { name: "Comunidad del Caribe", abbreviation: "CARICOM", startYear: 1974, endYear: null },
    { name: "Mancomunidad de Naciones", abbreviation: null, startYear: 1981, endYear: null }
  ],
  PNG: [
    { name: "OrganizaciÃ³n de las Naciones Unidas", abbreviation: "UN", startYear: 1975, endYear: null },
    { name: "Mancomunidad de Naciones", abbreviation: null, startYear: 1975, endYear: null },
    { name: "Foro de las Islas del PacÃ­fico", abbreviation: "PIF", startYear: 1975, endYear: null },
    { name: "CooperaciÃ³n EconÃ³mica Asia-PacÃ­fico", abbreviation: "APEC", startYear: 1993, endYear: null }
  ],
  PSE: [
    { name: "Liga Ãrabe", abbreviation: null, startYear: 1976, endYear: null },
    { name: "OrganizaciÃ³n para la CooperaciÃ³n IslÃ¡mica", abbreviation: "OIC", startYear: 1969, endYear: null },
    { name: "Movimiento de PaÃ­ses No Alineados", abbreviation: "NAM", startYear: 1976, endYear: null }
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
    { name: "Revuelta de BrunÃ©i", startYear: 1962, endYear: 1962, ongoing: false }
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

const CONFLICT_NAME_CANONICAL_RULES = [
  [/^Guerra de Malvinas$/i, "Guerra de las Malvinas"],
  [/^Falklands War$/i, "Guerra de las Malvinas"],
  [/^World War I$/i, "Primera Guerra Mundial"],
  [/^First World War$/i, "Primera Guerra Mundial"],
  [/^Great War$/i, "Primera Guerra Mundial"],
  [/^World War II$/i, "Segunda Guerra Mundial"],
  [/^Second World War$/i, "Segunda Guerra Mundial"],
  [/^Russo-Ukrainian War$/i, "Guerra rusoucraniana"],
  [/^Russian invasion of Ukraine$/i, "Guerra rusoucraniana"],
  [/^War in Donbas$/i, "Guerra del Donbas"],
  [/^Korean War$/i, "Guerra de Corea"],
  [/^Vietnam War$/i, "Guerra de Vietnam"],
  [/^Iraq War$/i, "Guerra de Irak"],
  [/^Gulf War$/i, "Guerra del Golfo"],
  [/^War in Afghanistan$/i, "Guerra de Afganistan"],
  [/^Syrian civil war$/i, "Guerra civil siria"],
  [/^Spanish Civil War$/i, "Guerra civil espanola"],
  [/^Chinese Civil War$/i, "Guerra civil china"],
  [/^Crimean War$/i, "Guerra de Crimea"],
  [/^Russo-Japanese War$/i, "Guerra ruso-japonesa"],
  [/^Algerian War$/i, "Guerra de Argelia"],
  [/^War of the Pacific$/i, "Guerra del Pacifico"],
  [/^Chaco War$/i, "Guerra del Chaco"],
  [/^Arab-Israeli War of 1948$/i, "Guerra arabe-israeli de 1948"],
  [/^Arab.*Israeli Wars$/i, "Guerras arabe-israelies"],
  [/^First Congo War$/i, "Primera Guerra del Congo"],
  [/^Second Congo War$/i, "Segunda Guerra del Congo"],
  [/^Kivu conflict$/i, "Guerra de Kivu"],
  [/^Ethiopian Civil War$/i, "Guerra civil etiope"],
  [/^Anti-piracy measures (in|en) Somalia$/i, "Medidas antipirateria en Somalia"],
  [/^Naxalbari uprising$/i, "Levantamiento de Naxalbari"],
  [/^German occupation (of|de) Luxembourg (in|en) World War II$/i, "Ocupacion alemana de Luxemburgo en la Segunda Guerra Mundial"],
  [/^Liberation (of|de) Jerusalem (in|en) Six-Day War$/i, "Liberacion de Jerusalen en la Guerra de los Seis Dias"],
  [/^Hamgyong Campaign$/i, "Campana de Hamgyong"],
  [/^Bombing (of|de) Ahvaz-Tehran passenger train$/i, "Bombardeo del tren de pasajeros Ahvaz-Teheran"],
  [/^Drone attack on Izmail$/i, "Ataque con drones a Izmail"],
  [/^Dzhangildin expedition$/i, "Expedicion de Dzhangildin"],
  [/^Shrevsky Operation$/i, "Operacion Shrevsky"],
  [/^Attack on Galle Harbour$/i, "Ataque al puerto de Galle"],
  [/^Bali Strait Incident$/i, "Incidente del estrecho de Bali"],
  [/^Psilander Affair$/i, "Asunto Psilander"],
  [/^Hudson Bay expedition$/i, "Expedicion de la bahia de Hudson"],
  [/^Allemand's escape from Lorient$/i, "Escape de Allemand desde Lorient"],
  [/^Battles? (of|de) Barfleur (and|y) La Hougue$/i, "Batallas de Barfleur y La Hougue"],
  [/^Combat de la Junon contre le Fox$/i, "Combate de la Junon contra el Fox"],
  [/^Levantamiento zapatista$/i, "Levantamiento zapatista"],
  [/^Western Sahara conflict$/i, "Conflicto del Sahara Occidental"],
  [/^Anglo-Afghan War$/i, "Guerras anglo-afganas"],
  [/^Guerra anglo-afgana$/i, "Guerras anglo-afganas"],
  [/^Battle of /i, "Batalla de "],
  [/^First Battle of /i, "Primera batalla de "],
  [/^Second Battle of /i, "Segunda batalla de "],
  [/^Third Battle of /i, "Tercera batalla de "],
  [/^Naval battle off /i, "Batalla naval de "],
  [/^Naval battle near /i, "Batalla naval cerca de "],
  [/^Campaign of /i, "Campana de "],
  [/^Campaign /i, "Campana "],
  [/^Siege of /i, "Sitio de "],
  [/^Operation /i, "Operacion "],
  [/^Invasion of /i, "Invasion de "],
  [/^Capture of /i, "Captura de "],
  [/^Capture de /i, "Captura de "],
  [/^Sinking of /i, "Hundimiento de "],
  [/^Sinking de /i, "Hundimiento de "],
  [/^Skirmish at /i, "Escaramuza en "],
  [/^Skirmish of /i, "Escaramuza de "],
  [/^Marine landing in /i, "Desembarco en "]
];

const CONFLICT_YEAR_HINTS = {
  "Primera Guerra Mundial": { startYear: 1914, endYear: 1918 },
  "Segunda Guerra Mundial": { startYear: 1939, endYear: 1945 },
  "Guerra de Corea": { startYear: 1950, endYear: 1953 },
  "Guerra de Vietnam": { startYear: 1955, endYear: 1975 },
  "Guerra del Golfo": { startYear: 1990, endYear: 1991 },
  "Guerra de Afganistan": { startYear: 2001, endYear: 2021 },
  "Guerra de Irak": { startYear: 2003, endYear: 2011 },
  "Guerra civil siria": { startYear: 2011, endYear: null, ongoing: true },
  "Guerra civil espanola": { startYear: 1936, endYear: 1939 },
  "Guerra Iran-Iraq": { startYear: 1980, endYear: 1988 },
  "Guerra ruso-japonesa": { startYear: 1904, endYear: 1905 },
  "Guerra de Argelia": { startYear: 1954, endYear: 1962 },
  "Guerra del Pacifico": { startYear: 1879, endYear: 1884 },
  "Guerra del Chaco": { startYear: 1932, endYear: 1935 },
  "Guerra arabe-israeli de 1948": { startYear: 1948, endYear: 1949 },
  "Guerras arabe-israelies": { startYear: 1948, endYear: 1973 },
  "Arab???Israeli Wars": { startYear: 1948, endYear: 1973 },
  "Guerra civil china": { startYear: 1927, endYear: 1949 },
  "Guerra civil etiope": { startYear: 1974, endYear: 1991 },
  "Guerras anglo-afganas": { startYear: 1839, endYear: 1919 },
  "Guerra anglo-afgana": { startYear: 1839, endYear: 1919 },
  "Guerra rusoucraniana": { startYear: 2014, endYear: null, ongoing: true },
  "Guerra del Donbas": { startYear: 2014, endYear: 2022 },
  "Primera intifada": { startYear: 1987, endYear: 1993 },
  "Segunda intifada": { startYear: 2000, endYear: 2005 },
  "Guerra de Gaza": { startYear: 2023, endYear: null, ongoing: true },
  "Medidas antipirateria en Somalia": { startYear: 2008, endYear: null, ongoing: true },
  "Anti-piracy measures en Somalia": { startYear: 2008, endYear: null, ongoing: true },
  "Levantamiento de Naxalbari": { startYear: 1967, endYear: 1967 },
  "Naxalbari uprising": { startYear: 1967, endYear: 1967 },
  "Ocupacion alemana de Luxemburgo en la Segunda Guerra Mundial": { startYear: 1940, endYear: 1944 },
  "German occupation de Luxembourg en World War II": { startYear: 1940, endYear: 1944 },
  "Liberacion de Jerusalen en la Guerra de los Seis Dias": { startYear: 1967, endYear: 1967 },
  "Liberation de Jerusalem en Six-Day War": { startYear: 1967, endYear: 1967 },
  "Campana de Hamgyong": { startYear: 1597, endYear: 1597 },
  "Hamgyong Campaign": { startYear: 1597, endYear: 1597 },
  "Bombardeo del tren de pasajeros Ahvaz-Teheran": { startYear: 1924, endYear: 1924 },
  "Bombing de Ahvaz-Tehran passenger train": { startYear: 1924, endYear: 1924 },
  "Ataque con drones a Izmail": { startYear: 2023, endYear: 2023 },
  "Drone attack on Izmail": { startYear: 2023, endYear: 2023 },
  "Expedicion de Dzhangildin": { startYear: 1918, endYear: 1918 },
  "Dzhangildin expedition": { startYear: 1918, endYear: 1918 },
  "Operacion Shrevsky": { startYear: 1919, endYear: 1919 },
  "Shrevsky Operation": { startYear: 1919, endYear: 1919 },
  "Ataque al puerto de Galle": { startYear: 2006, endYear: 2006 },
  "Attack on Galle Harbour": { startYear: 2006, endYear: 2006 },
  "Incidente del estrecho de Bali": { startYear: 1942, endYear: 1942 },
  "Bali Strait Incident": { startYear: 1942, endYear: 1942 },
  "Asunto Psilander": { startYear: 1940, endYear: 1940 },
  "Psilander Affair": { startYear: 1940, endYear: 1940 },
  "Expedicion de la bahia de Hudson": { startYear: 1686, endYear: 1686 },
  "Hudson Bay expedition": { startYear: 1686, endYear: 1686 },
  "Escape de Allemand desde Lorient": { startYear: 1805, endYear: 1805 },
  "Allemand's escape from Lorient": { startYear: 1805, endYear: 1805 },
  "Batallas de Barfleur y La Hougue": { startYear: 1692, endYear: 1692 },
  "Battles de Barfleur y La Hougue": { startYear: 1692, endYear: 1692 },
  "Combate de la Junon contra el Fox": { startYear: 1809, endYear: 1809 },
  "Combat de la Junon contre le Fox": { startYear: 1809, endYear: 1809 },
  "Levantamiento zapatista": { startYear: 1994, endYear: null, ongoing: true },
  "Conflicto del Sahara Occidental": { startYear: 1975, endYear: null, ongoing: true },
  "Ethiopian Civil War": { startYear: 1974, endYear: 1991 },
  "Arab-Israeli Wars": { startYear: 1948, endYear: 1973 },
  "Croisiere du Grand Hiver": { startYear: 1794, endYear: 1795 },
  "Expedicion contra Quebec": { startYear: 1775, endYear: 1775 },
  "Glorioso primero de junio": { startYear: 1794, endYear: 1794 },
  "Invasion de Inglaterra por Canuto el Grande": { startYear: 1013, endYear: 1014 },
  "Paso de Humaita": { startYear: 1868, endYear: 1868 },
  "Paso de Mercedes": { startYear: 1865, endYear: 1865 },
  "Toma de Lubumbashi": { startYear: 1998, endYear: 1998 },
  "Toma del puesto fronterizo internacional de Vrtojba": { startYear: 1991, endYear: 1991 },
  "Campana de Harald Cabellera Hermosa en Gotia": { startYear: 1026, endYear: 1026 },
  "Guerra sueco-noruega de 1063": { startYear: 1063, endYear: 1063 },
  "Invasion japonesa de Tailandia": { startYear: 1941, endYear: 1941 },
  "Incursion de Yakla": { startYear: 2017, endYear: 2017 },
  "Adlertag": { startYear: 1940, endYear: 1940 },
  "Bolsa del Ruhr": { startYear: 1945, endYear: 1945 },
  "Viernes Negro": { startYear: 1910, endYear: 1910 },
  "Dull Knife Fight": { startYear: 1876, endYear: 1876 },
  "Elsenborn Ridge": { startYear: 1944, endYear: 1945 },
  "Guerra arikara": { startYear: 1823, endYear: 1823 },
  "Kake War": { startYear: 1869, endYear: 1869 },
  "Negro Fort": { startYear: 1816, endYear: 1816 },
  "Paiute War": { startYear: 1860, endYear: 1860 },
  "St. Clair's Defeat": { startYear: 1791, endYear: 1791 },
  "USS Constitution vs HMS Guerriere": { startYear: 1812, endYear: 1812 },
  "USS United States vs HMS Macedonian": { startYear: 1812, endYear: 1812 },
  "Batalla de Long Tan": { startYear: 1966, endYear: 1966 },
  "Batalla de la Vuelta de Obligado": { startYear: 1845, endYear: 1845 },
  "Hundimiento del ARA General Belgrano": { startYear: 1982, endYear: 1982 },
  "Incidente de la Isla Decepcion": { startYear: 1952, endYear: 1952 },
  "Incidente del islote Snipe": { startYear: 1958, endYear: 1958 },
  "Operacion Black Buck": { startYear: 1982, endYear: 1982 },
  "Hundimiento de HMS Sheffield": { startYear: 1982, endYear: 1982 },
  "Batalla de Shusha": { startYear: 2020, endYear: 2020 },
  "Captura de Lachin": { startYear: 2022, endYear: 2022 },
  "Batalla de Cape Spada": { startYear: 1940, endYear: 1940 },
  "Batalla del canal de Otranto": { startYear: 1917, endYear: 1917 },
  "Batalla del Alto de la Alianza": { startYear: 1880, endYear: 1880 },
  "Operacion Encore": { startYear: 1950, endYear: 1950 },
  "Captura de la canonera Pilcomayo": { startYear: 1879, endYear: 1879 },
  "Captura del vapor Rimac": { startYear: 1879, endYear: 1879 },
  "Combate naval de Arica": { startYear: 1880, endYear: 1880 },
  "Combate naval de Iquique": { startYear: 1879, endYear: 1879 },
  "Doble ruptura del bloqueo de Arica": { startYear: 1880, endYear: 1880 },
  "Segundo combate naval de Iquique": { startYear: 1879, endYear: 1879 },
  "Batalla de Galwan": { startYear: 2020, endYear: 2020 },
  "Batalla de Gurung Hill": { startYear: 1962, endYear: 1962 },
  "Batalla de Rezang La": { startYear: 1962, endYear: 1962 },
  "Incidente del Arrecife Johnson del Sur": { startYear: 1988, endYear: 1988 },
  "Ataque a Bari Alai": { startYear: 2009, endYear: 2009 },
  "Batalla de Cheonpyeong Valley": { startYear: 1951, endYear: 1951 },
  "Batalla de Osan": { startYear: 1950, endYear: 1950 },
  "Sublevacion en Herat de 2001": { startYear: 2001, endYear: 2001 },
  "Ataques aereos de Yemen de 2024": { startYear: 2024, endYear: 2024 },
  "1984 DMZ incident": { startYear: 1984, endYear: 1984 },
  "Struggle for Negev 1947-1956": { startYear: 1947, endYear: 1956 },
  "Batalla de Joybar": { startYear: 2001, endYear: 2001 },
  "Batalla de Gang Toi": { startYear: 1965, endYear: 1965 },
  "Batalla de Svolder": { startYear: 999, endYear: 999 },
  "Batalla de Durazzo": { startYear: 1918, endYear: 1918 },
  "Batalla de Khaz Oruzgan": { startYear: 2010, endYear: 2010 },
  "Escaramuza de Karacsfa": { startYear: 1921, endYear: 1921 },
  "Batalla de Ixmiquilpan": { startYear: 1866, endYear: 1866 },
  "Combate de Rio Grande": { startYear: 1879, endYear: 1879 },
  "Combate de Buenavista": { startYear: 1838, endYear: 1838 },
  "Combate de El Manzano": { startYear: 1838, endYear: 1838 },
  "Chinese invasion de Taiwan": { startYear: 2026, endYear: 2026 },
  "Batalla de Bogesund": { startYear: 1520, endYear: 1520 },
  "Batalla de Greifswald Bodden": { startYear: 1715, endYear: 1715 },
  "Batalla de Helsingborg": { startYear: 1710, endYear: 1710 },
  "Batalla de Hjorungavagr": { startYear: 986, endYear: 986 },
  "Batalla de Kolding": { startYear: 1849, endYear: 1849 },
  "Batalla de Lena": { startYear: 1208, endYear: 1208 },
  "Batalla de Nisa": { startYear: 1062, endYear: 1062 },
  "Batalla de Stockholm": { startYear: 1518, endYear: 1518 },
  "Captura de la balandra Anne": { startYear: 1777, endYear: 1777 },
  "Batalla naval cerca de Majdal": { startYear: 1948, endYear: 1948 },
  "Batalla de Burullus": { startYear: 1956, endYear: 1956 },
  "Batalla de Flamborough Head": { startYear: 1779, endYear: 1779 },
  "Batalla de la cota 233": { startYear: 1973, endYear: 1973 },
  "Enfrentamiento entre el USS Constellation y L'Insurgente": { startYear: 1799, endYear: 1799 },
  "Incursiones en Boulogne": { startYear: 1804, endYear: 1805 },
  "Löwendalsfejden": { startYear: 1789, endYear: 1790 },
  "Guerra subsidiaria irano-saudi": { startYear: 1979, endYear: null, ongoing: true },
  "Operacion Mantis Religiosa": { startYear: 1988, endYear: 1988 },
  "Operacion Morvarid": { startYear: 1980, endYear: 1980 },
  "Liberacion de Jerusalem en Six-Day War": { startYear: 1967, endYear: 1967 },
  "Syrian front en War de Attrition": { startYear: 1967, endYear: 1970 },
  "Ataque misilistico libio contra Lampedusa": { startYear: 1986, endYear: 1986 },
  "Batalla de Failaka": { startYear: 1991, endYear: 1991 },
  "Accion del golfo de Sidra": { startYear: 1981, endYear: 1981 },
  "Batalla de Palo Alto": { startYear: 1846, endYear: 1846 },
  "Batalla de Resaca de la Palma": { startYear: 1846, endYear: 1846 },
  "Ingham incident": { startYear: 1959, endYear: 1959 },
  "Batalla del Estrecho de Corea": { startYear: 1950, endYear: 1950 },
  "LÃ¶wendalsfejden": { startYear: 1789, endYear: 1790 },
  "Batalla de Mirbat": { startYear: 1972, endYear: 1972 },
  "Batalla del puente del rio Pacora": { startYear: 1821, endYear: 1821 },
  "Artillery Duel at Korkiansaari": { startYear: 1941, endYear: 1941 }
};

const CONFLICT_YEAR_HINTS_NORMALIZED = Object.fromEntries(
  Object.entries(CONFLICT_YEAR_HINTS).map(([name, value]) => [normalizeKey(name), value])
);

const GLOBAL_CONFLICT_PARTICIPATION = {
  ARG: [],
  AUS: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1939, endYear: 1945, ongoing: false }
  ],
  AUT: [{ name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false }],
  BEL: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1939, endYear: 1945, ongoing: false }
  ],
  BRA: [
    { name: "Primera Guerra Mundial", startYear: 1917, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1942, endYear: 1945, ongoing: false }
  ],
  BGR: [{ name: "Primera Guerra Mundial", startYear: 1915, endYear: 1918, ongoing: false }],
  CAN: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1939, endYear: 1945, ongoing: false }
  ],
  CHN: [
    { name: "Primera Guerra Mundial", startYear: 1917, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1937, endYear: 1945, ongoing: false }
  ],
  CUB: [{ name: "Segunda Guerra Mundial", startYear: 1941, endYear: 1945, ongoing: false }],
  DEU: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1939, endYear: 1945, ongoing: false }
  ],
  FRA: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1939, endYear: 1945, ongoing: false }
  ],
  GBR: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1939, endYear: 1945, ongoing: false }
  ],
  GRC: [
    { name: "Primera Guerra Mundial", startYear: 1917, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1940, endYear: 1945, ongoing: false }
  ],
  HUN: [{ name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false }],
  ITA: [
    { name: "Primera Guerra Mundial", startYear: 1915, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1940, endYear: 1945, ongoing: false }
  ],
  JPN: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1937, endYear: 1945, ongoing: false }
  ],
  MEX: [{ name: "Segunda Guerra Mundial", startYear: 1942, endYear: 1945, ongoing: false }],
  NLD: [{ name: "Segunda Guerra Mundial", startYear: 1940, endYear: 1945, ongoing: false }],
  NOR: [{ name: "Segunda Guerra Mundial", startYear: 1940, endYear: 1945, ongoing: false }],
  NZL: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1939, endYear: 1945, ongoing: false }
  ],
  POL: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1939, endYear: 1945, ongoing: false }
  ],
  PRT: [
    { name: "Primera Guerra Mundial", startYear: 1916, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1939, endYear: 1945, ongoing: false }
  ],
  ROU: [
    { name: "Primera Guerra Mundial", startYear: 1916, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1941, endYear: 1945, ongoing: false }
  ],
  RUS: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1941, endYear: 1945, ongoing: false }
  ],
  SRB: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1941, endYear: 1945, ongoing: false }
  ],
  TUR: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Guerra de Corea", startYear: 1950, endYear: 1953, ongoing: false }
  ],
  UKR: [
    { name: "Primera Guerra Mundial", startYear: 1914, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1941, endYear: 1945, ongoing: false }
  ],
  USA: [
    { name: "Primera Guerra Mundial", startYear: 1917, endYear: 1918, ongoing: false },
    { name: "Segunda Guerra Mundial", startYear: 1941, endYear: 1945, ongoing: false },
    { name: "Guerra de Corea", startYear: 1950, endYear: 1953, ongoing: false },
    { name: "Guerra de Vietnam", startYear: 1955, endYear: 1975, ongoing: false }
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
      capital: { name: "HanÃ³i", population: 8053663, isCapital: true },
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
  ESP: "Reino de EspaÃ±a",
  FRA: "Republica Francesa",
  GBR: "Reino Unido de Gran BretaÃ±a e Irlanda del Norte",
  GRC: "Republica Helenica",
  IND: "Republica de la India",
  IRN: "Republica Islamica de Iran",
  JPN: "Estado del Japon",
  LAO: "Republica Democratica Popular Lao",
  MAR: "Reino de Marruecos",
  MEX: "Estados Unidos Mexicanos",
  NLD: "Reino de los Paises Bajos",
  PAK: "Republica Islamica del Pakistan",
  PRK: "Republica Popular Democratica de Corea",
  RUS: "Federacion de Rusia",
  SAU: "Reino de Arabia Saudita",
  SWZ: "Reino de Esuatini",
  SYR: "Republica Arabe Siria",
  TWN: "Republica de China",
  TUR: "Republica de Turquia",
  UKR: "Ucrania",
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
  ARG: ["Confederacion Argentina", "Provincias Unidas del Rio de la Plata"],
  COD: ["Zaire", "Congo Belga"],
  CIV: ["Costa de Marfil francesa"],
  DEU: ["Republica Democratica Alemana", "Republica Federal de Alemania"],
  EGY: ["Reino de Egipto", "Republica Arabe Unida"],
  GBR: ["Imperio Britanico"],
  GHA: ["Costa de Oro"],
  IRN: ["Persia"],
  JPN: ["Imperio del Japon"],
  MMR: ["Birmania"],
  MKD: ["Republica de Macedonia"],
  NAM: ["Africa del Sudoeste"],
  PAK: ["Dominio de Pakistan"],
  RUS: ["Union Sovietica"],
  SWZ: ["Suazilandia"],
  TUR: ["Imperio Otomano"],
  TZA: ["Tanganica", "Zanzibar"],
  UKR: ["Republica Socialista Sovietica de Ucrania"],
  VNM: ["Vietnam del Norte", "Vietnam del Sur"],
  ZWE: ["Rodesia del Sur"],
  ESH: ["Sahara Espanol"],
  PSE: ["Palestina bajo mandato britanico"],
  GUF: ["Guyane francaise"],
  FLK: ["Falkland Islands"],
  PRI: ["Puerto Rico espaÃ±ol"],
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
    coatOfArms: "Emblema rojo y dorado con TiananmÃ©n, engranaje y espigas"
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
  DEU: {
    flagDescription: "Bandera tricolor horizontal negra, roja y dorada",
    coatOfArms: "Aguila federal negra sobre escudo dorado"
  },
  IND: {
    flagDescription: "Bandera tricolor con rueda Ashoka azul en el centro",
    coatOfArms: "Emblema con el Leon Capital de Ashoka"
  },
  USA: {
    flagDescription: "Bandera de barras y estrellas",
    coatOfArms: "Gran Sello con aguila calva, escudo y flechas"
  },
  JPN: {
    flagDescription: "Bandera blanca con disco solar rojo centrado",
    coatOfArms: "Sello imperial del crisantemo usado como emblema nacional"
  },
  RUS: {
    flagDescription: "Bandera tricolor blanca, azul y roja",
    coatOfArms: "Aguila bicefala dorada coronada con San Jorge en el escuson"
  },
  UKR: {
    flagDescription: "Bandera azul y amarilla bicolor horizontal",
    coatOfArms: "Tridente dorado de Volodimir sobre campo azul"
  },
  CAN: {
    flagDescription: "Bandera roja y blanca con hoja de arce roja",
    coatOfArms: "Armas reales de Canada con hojas de arce y corona"
  },
  AUS: {
    flagDescription: "Blue Ensign con Union Jack, Commonwealth Star y Cruz del Sur",
    coatOfArms: "Escudo de los estados australianos sostenido por un canguro y un emu"
  },
  GUF: {
    flagDescription: "Usa la bandera de Francia junto a simbolos locales",
    coatOfArms: "Armas territoriales asociadas a la colectividad"
  },
  PRI: {
    flagDescription: "Bandera con franjas rojas y blancas y triangulo azul con estrella",
    coatOfArms: "Escudo historico de Puerto Rico con cordero mÃ­stico"
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
  ATA: {
    allies: ["Argentina", "Australia", "Chile", "Francia", "Nueva Zelanda", "Noruega", "Reino Unido", "Estados Unidos", "Rusia"],
    blocs: ["Sistema del Tratado Antartico"],
    disputes: ["Reclamos antarticos congelados", "Gestion de recursos marinos", "Proteccion ambiental"]
  },
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
    allies: ["Alemania", "Italia", "EspaÃ±a"],
    blocs: ["Union Europea", "OTAN", "ONU"],
    disputes: ["Mayotte"],
    rivalStates: ["Rusia"]
  }
};

const RELATION_OVERRIDES_V2 = {
  ATA: {
    diplomaticPartners: ["Argentina", "Australia", "Chile", "Francia", "Nueva Zelanda", "Noruega", "Reino Unido", "Estados Unidos", "Rusia"],
    diplomaticBlocs: ["Sistema del Tratado Antartico"],
    economicPartners: ["Programas cientificos nacionales", "Operadores logisticos polares", "Turismo antartico regulado"],
    currentRivals: [],
    disputedTerritories: ["Antartida Argentina", "Territorio Antartico Chileno", "Territorio Antartico Britanico", "Territorio Antartico Australiano", "Dependencia Ross", "Tierra Adelia", "Tierra de la Reina Maud"]
  },
  ARG: {
    militaryAllies: ["Brasil"],
    economicPartners: ["Brasil", "Uruguay", "Paraguay", "Bolivia", "Chile"],
    diplomaticPartners: ["Brasil", "Uruguay", "Paraguay"],
    economicBlocs: ["Mercosur", "BRICS"],
    diplomaticBlocs: ["ONU", "CELAC"],
    currentRivals: ["Reino Unido"]
  },
  BRA: {
    militaryAllies: ["Argentina"],
    economicPartners: ["Argentina", "Uruguay", "Paraguay", "China"],
    diplomaticPartners: ["Argentina", "India", "Sudafrica"],
    economicBlocs: ["Mercosur", "BRICS"],
    diplomaticBlocs: ["ONU", "CELAC"]
  },
  USA: {
    militaryAllies: ["Reino Unido", "Canada", "Japon", "Corea del Sur", "Australia", "Polonia"],
    economicPartners: ["Canada", "Mexico", "Union Europea", "Japon"],
    diplomaticPartners: ["Reino Unido", "Canada", "Australia", "Japon"],
    militaryBlocs: ["OTAN"],
    economicBlocs: ["USMCA", "APEC"],
    diplomaticBlocs: ["ONU", "G7"],
    currentRivals: ["China", "Rusia", "Iran", "Corea del Norte"],
    associatedTerritories: ["Puerto Rico", "Guam", "Samoa Americana"]
  },
  CHN: {
    militaryAllies: ["Pakistan", "Corea del Norte"],
    economicPartners: ["Rusia", "Pakistan", "ASEAN", "Africa subsahariana"],
    diplomaticPartners: ["Rusia", "Pakistan", "Iran"],
    economicBlocs: ["BRICS", "OCS"],
    diplomaticBlocs: ["ONU"],
    currentRivals: ["Estados Unidos", "India", "Japon", "Taiwan"]
  },
  RUS: {
    militaryAllies: ["Belarusia"],
    economicPartners: ["China", "Belarusia", "Kazajistan"],
    diplomaticPartners: ["China", "Belarusia", "Iran"],
    militaryBlocs: ["OTSC"],
    economicBlocs: ["UEE", "BRICS"],
    diplomaticBlocs: ["ONU"],
    currentRivals: ["Estados Unidos", "Ucrania", "Polonia", "OTAN"]
  },
  UKR: {
    militaryAllies: ["Estados Unidos", "Polonia", "Reino Unido", "Francia"],
    economicPartners: ["Union Europea", "Polonia"],
    diplomaticPartners: ["Estados Unidos", "Polonia", "Reino Unido", "Union Europea"],
    diplomaticBlocs: ["ONU", "Consejo de Europa"],
    currentRivals: ["Rusia"]
  },
  ISR: {
    militaryAllies: ["Estados Unidos"],
    economicPartners: ["Estados Unidos", "Union Europea", "India"],
    diplomaticPartners: ["Estados Unidos", "Egipto", "Jordania"],
    diplomaticBlocs: ["ONU"],
    currentRivals: ["Iran", "Hamas", "Hezbola"],
    historicalRivals: ["Egipto", "Siria"]
  },
  IND: {
    militaryAllies: ["Francia", "Estados Unidos", "Japon"],
    economicPartners: ["Estados Unidos", "Union Europea", "Emiratos Arabes Unidos"],
    diplomaticPartners: ["Francia", "Estados Unidos", "Japon", "Australia"],
    economicBlocs: ["BRICS"],
    diplomaticBlocs: ["ONU", "Quad"],
    currentRivals: ["Pakistan", "China"]
  },
  PAK: {
    militaryAllies: ["China", "Turquia"],
    economicPartners: ["China", "Arabia Saudita"],
    diplomaticPartners: ["China", "Turquia", "Arabia Saudita"],
    economicBlocs: ["OCS"],
    diplomaticBlocs: ["ONU", "OIC"],
    currentRivals: ["India"]
  },
  TUR: {
    militaryAllies: ["Azerbaiyan", "Qatar"],
    economicPartners: ["Union Europea", "Qatar", "Azerbaiyan"],
    diplomaticPartners: ["Azerbaiyan", "Qatar", "Pakistan"],
    militaryBlocs: ["OTAN"],
    diplomaticBlocs: ["ONU", "OIC"],
    currentRivals: ["Grecia", "Siria"],
    dependencies: ["Chipre del Norte"]
  },
  IRN: {
    militaryAllies: ["Siria", "Hezbola"],
    economicPartners: ["China", "Rusia"],
    diplomaticPartners: ["Siria", "Rusia", "China"],
    economicBlocs: ["BRICS"],
    diplomaticBlocs: ["ONU", "OIC"],
    currentRivals: ["Estados Unidos", "Israel", "Arabia Saudita"]
  },
  GBR: {
    militaryAllies: ["Estados Unidos", "Canada", "Australia", "Polonia"],
    economicPartners: ["Estados Unidos", "Union Europea", "Canada"],
    diplomaticPartners: ["Estados Unidos", "Canada", "Australia", "India"],
    militaryBlocs: ["OTAN"],
    economicBlocs: ["CPTPP"],
    diplomaticBlocs: ["Commonwealth", "ONU", "G7"],
    currentRivals: ["Rusia"],
    historicalRivals: ["Argentina"],
    dependencies: ["Bermudas", "Islas Malvinas", "Gibraltar", "Islas Caiman"]
  },
  FRA: {
    militaryAllies: ["Alemania", "Italia", "Estados Unidos"],
    economicPartners: ["Alemania", "Italia", "Espana"],
    diplomaticPartners: ["Alemania", "Italia", "Espana"],
    militaryBlocs: ["OTAN"],
    economicBlocs: ["Union Europea"],
    diplomaticBlocs: ["ONU", "Francofonia"],
    currentRivals: ["Rusia"],
    dependencies: ["Guayana Francesa", "Nueva Caledonia", "Mayotte", "Reunion"]
  }
};

Object.assign(LANGUAGE_OVERRIDES, {
  BOL: ["Espanol", "Quechua", "Aimara", "Guarani"],
  COL: ["Espanol", "Wayuu", "Nasa Yuwe"],
  DZA: ["Arabe", "Tamazight", "Frances"],
  ECU: ["Espanol", "Quechua", "Shuar"],
  GTM: ["Espanol", "Kiche", "Qeqchi"],
  HND: ["Espanol", "Garifuna", "Misquito"],
  MLT: ["Maltes", "Ingles"],
  MEX: ["Espanol", "Nahuatl", "Maya yucateco", "Mixteco", "Zapoteco"],
  NIC: ["Espanol", "Miskitu", "Mayangna"],
  PAN: ["Espanol", "Ngabere", "Guna"],
  PER: ["Espanol", "Quechua", "Aimara", "Ashaninka"],
  PHL: ["Filipino", "Ingles", "Cebuano"],
  PRY: ["Espanol", "Guarani"],
  SDN: ["Arabe", "Ingles", "Beja"],
  SOM: ["Somali", "Arabe", "Ingles"],
  TUN: ["Arabe", "Frances"],
  URY: ["Espanol", "Portunol fronterizo"],
  VEN: ["Espanol", "Wayuu", "Pemon"],
  VNM: ["Vietnamita", "Ingles"],
  YEM: ["Arabe", "Mehri"],
  MLI: ["Frances", "Bambara"],
  SEN: ["Frances", "Wolof"]
});

Object.assign(CAPITAL_ROLE_OVERRIDES, {
  BEN: [
    { role: "constitucional", name: "Porto-Novo" },
    { role: "ejecutiva", name: "Cotonu" }
  ],
  BOL: [
    { role: "constitucional", name: "Sucre" },
    { role: "ejecutiva y legislativa", name: "La Paz" }
  ],
  CHL: [
    { role: "administrativa", name: "Santiago" },
    { role: "legislativa", name: "Valparaiso" }
  ],
  CIV: [
    { role: "constitucional", name: "Yamusukro" },
    { role: "ejecutiva", name: "Abiyan" }
  ],
  TZA: [
    { role: "constitucional", name: "Dodoma" },
    { role: "economica", name: "Dar es-Salam" }
  ],
  ECU: [
    { role: "constitucional y ejecutiva", name: "Quito" },
    { role: "economica", name: "Guayaquil" }
  ],
  PAN: [
    { role: "nacional", name: "Ciudad de Panama" },
    { role: "judicial", name: "Ancon" }
  ]
});

Object.assign(SYMBOL_OVERRIDES, {
  BOL: {
    flagDescription: "Bandera tricolor horizontal roja, amarilla y verde con escudo al centro",
    coatOfArms: "Escudo ovalado con cerro Potosi, alpaca, canones y condor"
  },
  CHL: {
    flagDescription: "Bandera blanca, azul y roja con estrella solitaria",
    coatOfArms: "Escudo con huemul y condor coronados"
  },
  COL: {
    flagDescription: "Bandera tricolor horizontal amarilla, azul y roja",
    coatOfArms: "Escudo con condor, granada y dos cornucopias"
  },
  CUB: {
    flagDescription: "Bandera con cinco franjas azules y blancas y triangulo rojo con estrella",
    coatOfArms: "Escudo con llave del golfo, gorro frigio y paisaje tropical"
  },
  ECU: {
    flagDescription: "Bandera amarilla, azul y roja con escudo nacional",
    coatOfArms: "Escudo con condor, Chimborazo, rio Guayas y signos del zodiaco"
  },
  CHE: {
    flagDescription: "Bandera roja cuadrada con cruz blanca centrada",
    coatOfArms: "Escudo rojo con cruz blanca, version heraldica del emblema federal"
  },
  EGY: {
    flagDescription: "Bandera roja, blanca y negra con aguila dorada de Saladino",
    coatOfArms: "Aguila de Saladino sobre escudo tricolor"
  },
  IDN: {
    flagDescription: "Bandera bicolor horizontal roja y blanca",
    coatOfArms: "Garuda Pancasila con escudo de cinco principios"
  },
  IRN: {
    flagDescription: "Bandera verde, blanca y roja con emblema central rojo",
    coatOfArms: "Emblema estilizado de la Republica Islamica"
  },
  ISR: {
    flagDescription: "Bandera blanca con dos franjas azules y estrella de David",
    coatOfArms: "Menora flanqueada por ramas de olivo"
  },
  ITA: {
    flagDescription: "Bandera tricolor vertical verde, blanca y roja",
    coatOfArms: "Emblema republicano con estrella, rueda dentada y ramas de olivo y encina"
  },
  KOR: {
    flagDescription: "Bandera blanca con taegeuk rojo-azul y trigramas negros",
    coatOfArms: "Emblema estatal circular con hibisco y taegeuk central"
  },
  MEX: {
    flagDescription: "Bandera tricolor verde, blanca y roja con escudo al centro",
    coatOfArms: "Aguila sobre nopal devorando una serpiente"
  },
  NGA: {
    flagDescription: "Bandera tricolor vertical verde, blanca y verde",
    coatOfArms: "Escudo negro con banda ondulada blanca y caballos plateados"
  },
  NLD: {
    flagDescription: "Bandera tricolor horizontal roja, blanca y azul",
    coatOfArms: "Armas reales neerlandesas con leon coronado"
  },
  PAK: {
    flagDescription: "Bandera verde con banda blanca, media luna y estrella",
    coatOfArms: "Escudo con cuarto de algodon, trigo, te y yute"
  },
  PRK: {
    flagDescription: "Bandera roja con franjas azules y blancas y estrella roja",
    coatOfArms: "Emblema con presa hidroelÃ©ctrica, monte Paektu y estrella roja"
  },
  SAU: {
    flagDescription: "Bandera verde con shahada blanca y espada",
    coatOfArms: "Palmera sobre dos espadas cruzadas"
  },
  TUR: {
    flagDescription: "Bandera roja con media luna y estrella blancas",
    coatOfArms: "Emblema no heraldico con luna creciente y estrella"
  },
  URY: {
    flagDescription: "Bandera blanca con franjas azules y Sol de Mayo",
    coatOfArms: "Escudo oval con balanza, cerro, caballo y buey"
  },
  VEN: {
    flagDescription: "Bandera amarilla, azul y roja con arco de estrellas blancas",
    coatOfArms: "Escudo con caballo blanco, armas y cuernos de abundancia"
  },
  ZAF: {
    flagDescription: "Bandera multicolor en Y horizontal convergente",
    coatOfArms: "Escudo con figura khoisan, lanza, elefante y ave secretaria"
  }
});

Object.assign(TIMELINE_EVENT_OVERRIDES, {
  BOL: [
    { year: 1825, category: "estado", text: "Independencia de Bolivia" },
    { year: 1879, category: "guerra", text: "Guerra del Pacifico y perdida del litoral" },
    { year: 2009, category: "constitucion", text: "Nueva Constitucion del Estado Plurinacional" }
  ],
  CAN: [
    { year: 1867, category: "union", text: "Confederacion canadiense" },
    { year: 1931, category: "tratado", text: "Estatuto de Westminster y autonomia legislativa" },
    { year: 1982, category: "constitucion", text: "Patriacion constitucional y Carta de Derechos" }
  ],
  EGY: [
    { year: 1956, category: "tratado", text: "Crisis de Suez y afirmacion del nacionalismo egipcio" },
    { year: 1978, category: "tratado", text: "Acuerdos de Camp David" }
  ],
  ITA: [
    { year: 1861, category: "union", text: "Proclamacion del Reino de Italia" },
    { year: 1922, category: "cambio_regimen", text: "Marcha sobre Roma y ascenso del fascismo" },
    { year: 1946, category: "cambio_regimen", text: "Referendum institucional y nacimiento de la republica" },
    { year: 1948, category: "constitucion", text: "Entrada en vigor de la Constitucion republicana" }
  ],
  JPN: [
    { year: 1868, category: "reforma", text: "Restauracion Meiji y modernizacion estatal" },
    { year: 1945, category: "cambio_regimen", text: "Derrota imperial y ocupacion aliada" }
  ],
  KOR: [
    { year: 1948, category: "estado", text: "Fundacion de la Republica de Corea" },
    { year: 1961, category: "golpe", text: "Golpe de Park Chung-hee" },
    { year: 1987, category: "constitucion", text: "Transicion democratica y nueva constitucion" }
  ],
  PRK: [
    { year: 1948, category: "estado", text: "Fundacion de Corea del Norte" },
    { year: 1994, category: "cambio_regimen", text: "Sucesion de Kim Jong-il tras la muerte de Kim Il-sung" },
    { year: 2011, category: "cambio_regimen", text: "Sucesion de Kim Jong-un" }
  ],
  PSE: [
    { year: 1947, category: "tratado", text: "Plan de particion de Palestina de la ONU" },
    { year: 1988, category: "estado", text: "Proclamacion del Estado de Palestina" },
    { year: 1993, category: "tratado", text: "Acuerdos de Oslo" }
  ],
  SAU: [
    { year: 1932, category: "union", text: "Unificacion del Reino de Arabia Saudita" },
    { year: 1992, category: "constitucion", text: "Ley Basica de Gobierno" }
  ],
  URY: [
    { year: 1828, category: "estado", text: "Convencion Preliminar de Paz y nacimiento del Uruguay independiente" },
    { year: 1830, category: "constitucion", text: "Primera constitucion uruguaya" },
    { year: 1973, category: "golpe", text: "Golpe de Estado y comienzo de la dictadura" },
    { year: 1985, category: "reforma", text: "Restauracion democratica" }
  ],
  VEN: [
    { year: 1811, category: "estado", text: "Primera declaracion de independencia" },
    { year: 1830, category: "secesion", text: "Separacion de la Gran Colombia" },
    { year: 1958, category: "cambio_regimen", text: "Caida de Perez Jimenez y apertura democratica" },
    { year: 1999, category: "constitucion", text: "Constitucion de la Republica Bolivariana" }
  ]
});

Object.assign(RELATION_OVERRIDES, {
  BOL: {
    allies: ["Brasil", "Peru", "Paraguay"],
    blocs: ["Mercosur", "CAN", "ONU"],
    disputes: ["Reivindicacion maritima frente a Chile"],
    rivalStates: ["Chile"]
  },
  CHL: {
    allies: ["Argentina", "Brasil", "Estados Unidos"],
    blocs: ["Alianza del Pacifico", "APEC", "ONU"],
    disputes: ["Hielos Continentales", "Reivindicacion maritima boliviana"],
    rivalStates: []
  },
  COL: {
    allies: ["Estados Unidos", "Peru", "Ecuador"],
    blocs: ["Alianza del Pacifico", "ONU", "OEA"],
    disputes: ["Golfo de Venezuela", "Archipielago de San Andres y Providencia"],
    rivalStates: ["Venezuela", "ELN"]
  },
  CUB: {
    allies: ["Venezuela", "Nicaragua", "Bolivia"],
    blocs: ["ALBA", "ONU", "CELAC"],
    rivalStates: ["Estados Unidos"]
  },
  DEU: {
    allies: ["Francia", "Polonia", "Paises Bajos", "Italia"],
    blocs: ["Union Europea", "OTAN", "ONU"],
    rivalStates: ["Rusia"]
  },
  EGY: {
    allies: ["Arabia Saudita", "Emiratos Arabes Unidos"],
    blocs: ["Liga Arabe", "ONU", "OIC"],
    disputes: ["Triangulo de Halaib", "Franja de Gaza"],
    rivalStates: ["Etiopia", "Hamas"]
  },
  JPN: {
    allies: ["Estados Unidos", "Australia", "Corea del Sur"],
    blocs: ["G7", "ONU"],
    disputes: ["Kuriles del Sur", "Senkaku/Diaoyu"],
    rivalStates: ["China", "Corea del Norte", "Rusia"]
  },
  MEX: {
    allies: ["Estados Unidos", "Canada", "Guatemala"],
    blocs: ["USMCA", "CELAC", "ONU"],
    rivalStates: []
  },
  PER: {
    allies: ["Estados Unidos", "Chile", "Colombia", "Ecuador"],
    blocs: ["Alianza del Pacifico", "APEC", "ONU"],
    disputes: ["Triangulo terrestre con Chile"],
    rivalStates: []
  },
  PRY: {
    allies: ["Brasil", "Argentina", "Uruguay"],
    blocs: ["Mercosur", "ONU"],
    rivalStates: ["Bolivia"]
  },
  POL: {
    allies: ["Estados Unidos", "Reino Unido", "Ucrania"],
    blocs: ["OTAN", "Union Europea", "ONU"],
    rivalStates: ["Rusia", "Belarusia"]
  },
  SAU: {
    allies: ["Estados Unidos", "Emiratos Arabes Unidos", "Bahrein"],
    blocs: ["OIC", "ONU", "Consejo de Cooperacion del Golfo"],
    rivalStates: ["Iran", "Huties"]
  },
  URY: {
    allies: ["Argentina", "Brasil", "Paraguay"],
    blocs: ["Mercosur", "ONU", "CELAC"],
    rivalStates: []
  },
  VEN: {
    allies: ["Cuba", "Nicaragua", "Bolivia", "Rusia"],
    blocs: ["ALBA", "OPEP", "ONU"],
    disputes: ["Esequibo"],
    rivalStates: ["Colombia", "Estados Unidos", "Guyana"]
  }
});

Object.assign(RELATION_OVERRIDES_V2, {
  BOL: {
    economicPartners: ["Brasil", "Argentina", "Peru", "Chile"],
    diplomaticPartners: ["Brasil", "Argentina", "Peru"],
    economicBlocs: ["Mercosur", "CAN"],
    diplomaticBlocs: ["ONU", "CELAC"],
    currentRivals: ["Chile"]
  },
  CHL: {
    militaryAllies: ["Estados Unidos"],
    economicPartners: ["China", "Estados Unidos", "Brasil", "Peru"],
    diplomaticPartners: ["Argentina", "Brasil", "Peru", "Colombia"],
    economicBlocs: ["Alianza del Pacifico", "APEC"],
    diplomaticBlocs: ["ONU", "CELAC"]
  },
  COL: {
    militaryAllies: ["Estados Unidos"],
    economicPartners: ["Estados Unidos", "Mexico", "Peru", "Brasil"],
    diplomaticPartners: ["Estados Unidos", "Peru", "Ecuador", "Chile"],
    economicBlocs: ["Alianza del Pacifico"],
    diplomaticBlocs: ["ONU", "OEA", "CELAC"],
    currentRivals: ["Venezuela"],
    historicalRivals: ["FARC", "ELN"]
  },
  CUB: {
    diplomaticPartners: ["Venezuela", "Nicaragua", "Bolivia", "Mexico"],
    diplomaticBlocs: ["ALBA", "ONU", "CELAC"],
    currentRivals: ["Estados Unidos"]
  },
  DEU: {
    militaryAllies: ["Francia", "Estados Unidos", "Polonia"],
    economicPartners: ["Francia", "Paises Bajos", "Italia", "Polonia"],
    diplomaticPartners: ["Francia", "Italia", "Polonia", "Union Europea"],
    militaryBlocs: ["OTAN"],
    economicBlocs: ["Union Europea"],
    diplomaticBlocs: ["ONU", "G7"],
    currentRivals: ["Rusia"]
  },
  EGY: {
    militaryAllies: ["Arabia Saudita", "Emiratos Arabes Unidos"],
    economicPartners: ["Arabia Saudita", "Emiratos Arabes Unidos", "Union Europea"],
    diplomaticPartners: ["Estados Unidos", "Arabia Saudita", "Jordania"],
    diplomaticBlocs: ["ONU", "Liga Arabe", "OIC"],
    currentRivals: ["Etiopia"],
    historicalRivals: ["Israel"]
  },
  JPN: {
    militaryAllies: ["Estados Unidos", "Australia"],
    economicPartners: ["Estados Unidos", "China", "Corea del Sur", "ASEAN"],
    diplomaticPartners: ["Estados Unidos", "Australia", "India"],
    diplomaticBlocs: ["ONU", "G7"],
    currentRivals: ["Corea del Norte", "China"],
    historicalRivals: ["Rusia"]
  },
  MEX: {
    economicPartners: ["Estados Unidos", "Canada", "Union Europea"],
    diplomaticPartners: ["Estados Unidos", "Canada", "Colombia", "Chile"],
    economicBlocs: ["USMCA", "APEC"],
    diplomaticBlocs: ["ONU", "CELAC"]
  },
  PER: {
    economicPartners: ["China", "Estados Unidos", "Chile", "Colombia"],
    diplomaticPartners: ["Chile", "Colombia", "Ecuador", "Estados Unidos"],
    economicBlocs: ["Alianza del Pacifico", "APEC"],
    diplomaticBlocs: ["ONU", "CELAC"]
  },
  PRY: {
    economicPartners: ["Brasil", "Argentina", "Uruguay"],
    diplomaticPartners: ["Brasil", "Argentina", "Uruguay"],
    economicBlocs: ["Mercosur"],
    diplomaticBlocs: ["ONU", "CELAC"],
    historicalRivals: ["Bolivia"]
  },
  POL: {
    militaryAllies: ["Estados Unidos", "Reino Unido", "Ucrania"],
    economicPartners: ["Alemania", "Francia", "Chequia"],
    diplomaticPartners: ["Estados Unidos", "Reino Unido", "Ucrania", "Union Europea"],
    militaryBlocs: ["OTAN"],
    economicBlocs: ["Union Europea"],
    diplomaticBlocs: ["ONU", "Consejo de Europa"],
    currentRivals: ["Rusia", "Belarusia"]
  },
  SAU: {
    militaryAllies: ["Estados Unidos", "Emiratos Arabes Unidos", "Bahrein"],
    economicPartners: ["China", "Estados Unidos", "India"],
    diplomaticPartners: ["Estados Unidos", "Emiratos Arabes Unidos", "Egipto"],
    diplomaticBlocs: ["ONU", "OIC", "Consejo de Cooperacion del Golfo"],
    currentRivals: ["Iran", "Huties"]
  },
  URY: {
    economicPartners: ["Brasil", "Argentina", "China"],
    diplomaticPartners: ["Argentina", "Brasil", "Paraguay", "Chile"],
    economicBlocs: ["Mercosur"],
    diplomaticBlocs: ["ONU", "CELAC"]
  },
  VEN: {
    militaryAllies: ["Cuba"],
    economicPartners: ["China", "Cuba", "Rusia"],
    diplomaticPartners: ["Cuba", "Bolivia", "Nicaragua", "Rusia"],
    economicBlocs: ["ALBA", "OPEP"],
    diplomaticBlocs: ["ONU", "CELAC"],
    currentRivals: ["Estados Unidos", "Guyana"],
    historicalRivals: ["Colombia"]
  }
});

const RELATION_BLOC_CATEGORY_RULES = [
  { key: "otan", label: "OTAN", category: "military" },
  { key: "otsc", label: "OTSC", category: "military" },
  { key: "quad", label: "Quad", category: "military" },
  { key: "mercosur", label: "Mercosur", category: "economic" },
  { key: "union europea", label: "Union Europea", category: "economic" },
  { key: "uee", label: "UEE", category: "economic" },
  { key: "usmca", label: "USMCA", category: "economic" },
  { key: "apec", label: "APEC", category: "economic" },
  { key: "asean", label: "ASEAN", category: "economic" },
  { key: "brics", label: "BRICS", category: "economic" },
  { key: "cptpp", label: "CPTPP", category: "economic" },
  { key: "ocs", label: "OCS", category: "economic" },
  { key: "onu", label: "ONU", category: "diplomatic" },
  { key: "commonwealth", label: "Commonwealth", category: "diplomatic" },
  { key: "celac", label: "CELAC", category: "diplomatic" },
  { key: "consejo de europa", label: "Consejo de Europa", category: "diplomatic" },
  { key: "oic", label: "OIC", category: "diplomatic" },
  { key: "francofonia", label: "Francofonia", category: "diplomatic" },
  { key: "g7", label: "G7", category: "diplomatic" }
];

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
  ATA: "Sistema del Tratado Antartico",
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
    geography: "Continente polar antartico sin poblacion permanente; presencia humana cientifica y logistica estacional",
    history: { year: 1959, type: "tratado internacional", origin: "Tratado Antartico" },
    politics: { system: "Sistema del Tratado Antartico" },
    economy: {
      exports: ["Investigacion cientifica", "Logistica polar", "Turismo antartico regulado"],
      industries: ["Bases cientificas", "Apoyo logistico", "Observacion ambiental y climatica"]
    },
    religion: {
      summary: "Sin poblacion permanente",
      composition: []
    },
    capital: { name: "Sin capital oficial", population: null, isCapital: true },
    cities: [
      { name: "Estacion McMurdo", population: 1200, isCapital: false },
      { name: "Base Amundsen-Scott", population: 150, isCapital: false },
      { name: "Base Esperanza", population: 70, isCapital: false },
      { name: "Base Marambio", population: 55, isCapital: false },
      { name: "Base Vostok", population: 25, isCapital: false },
      { name: "Base Rothera", population: 100, isCapital: false },
      { name: "Base Palmer", population: 46, isCapital: false },
      { name: "Base Dumont d'Urville", population: 80, isCapital: false }
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
    capital: { name: "Puerto EspaÃ±a", population: 37106, isCapital: true },
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
    capital: { name: "TaipÃ©i", population: 2489394, isCapital: true },
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

function repairMojibake(value) {
  return repairMojibakeShared(value);
}

function sanitizeText(value) {
  if (typeof value !== "string") {
    return value;
  }

  return repairMojibake(value)
    .replace(/\bRepublica\b/g, "\u0052\u0065\u0070\u00FA\u0062\u006C\u0069\u0063\u0061")
    .replace(/\bDemocratica\b/g, "\u0044\u0065\u006D\u006F\u0063\u0072\u00E1\u0074\u0069\u0063\u0061")
    .replace(/\bIslamica\b/g, "\u0049\u0073\u006C\u00E1\u006D\u0069\u0063\u0061")
    .replace(/\bHelenica\b/g, "\u0048\u0065\u006C\u00E9\u006E\u0069\u0063\u0061")
    .replace(/\bArabe\b/g, "\u00C1\u0072\u0061\u0062\u0065")
    .replace(/\bMonarquia\b/g, "\u004D\u006F\u006E\u0061\u0072\u0071\u0075\u00ED\u0061")
    .replace(/\bConstitucion\b/g, "\u0043\u006F\u006E\u0073\u0074\u0069\u0074\u0075\u0063\u0069\u00F3\u006E")
    .replace(/\bUnion\b/g, "\u0055\u006E\u0069\u00F3\u006E")
    .replace(/\bDisolucion\b/g, "\u0044\u0069\u0073\u006F\u006C\u0075\u0063\u0069\u00F3\u006E")
    .replace(/\bRevolucion\b/g, "\u0052\u0065\u0076\u006F\u006C\u0075\u0063\u0069\u00F3\u006E")
    .replace(/\bSecesion\b/g, "\u0053\u0065\u0063\u0065\u0073\u0069\u00F3\u006E")
    .replace(/\bAnexion\b/g, "\u0041\u006E\u0065\u0078\u0069\u00F3\u006E")
    .replace(/\bpacifica\b/g, "\u0070\u0061\u0063\u00ED\u0066\u0069\u0063\u0061")
    .replace(/\bEspanol\b/g, "\u0045\u0073\u0070\u0061\u00F1\u006F\u006C")
    .replace(/\bPortugues\b/g, "\u0050\u006F\u0072\u0074\u0075\u0067\u0075\u00E9\u0073")
    .replace(/\bDanes\b/g, "\u0044\u0061\u006E\u00E9\u0073")
    .replace(/\bJapones\b/g, "\u004A\u0061\u0070\u006F\u006E\u00E9\u0073")
    .replace(/\bAleman\b/g, "\u0041\u006C\u0065\u006D\u00E1\u006E")
    .replace(/\bFrances\b/g, "\u0046\u0072\u0061\u006E\u0063\u00E9\u0073")
    .replace(/\bAno\b/g, "\u0041\u00F1\u006F")
    .replace(/\bOrganizacion\b/g, "\u004F\u0072\u0067\u0061\u006E\u0069\u007A\u0061\u0063\u0069\u00F3\u006E")
    .replace(/\bPoblacion\b/g, "\u0050\u006F\u0062\u006C\u0061\u0063\u0069\u00F3\u006E")
    .replace(/\bMetr[óo]polis\b/g, "\u004D\u0065\u0074\u0072\u00F3\u0070\u006F\u006C\u0069\u0073")
    .replace(/\bIran\b/g, "\u0049\u0072\u00E1\u006E")
    .replace(/\bPakistan\b/g, "\u0050\u0061\u006B\u0069\u0073\u0074\u00E1\u006E")
    .replace(/\bAfganistan\b/g, "\u0041\u0066\u0067\u0061\u006E\u0069\u0073\u0074\u00E1\u006E")
    .replace(/\bTiananmen\b/g, "\u0054\u0069\u0061\u006E\u0061\u006E\u006D\u00E9\u006E")
    .trim();
}

function applyUnicodeCorrections(value) {
  if (typeof value !== "string") {
    return value;
  }

  return sanitizeText(value);
}

function sanitizeDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeDeep);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, innerValue]) => [key, sanitizeDeep(innerValue)]));
  }

  return sanitizeText(value);
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
  if (typeof year !== "number" || Number.isNaN(year) || year < 900 || year > 2100) {
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
    union: "UniÃ³n",
    "disolucion de otro estado": "DisoluciÃ³n de otro estado",
    revolucion: "RevoluciÃ³n",
    "guerra civil": "Guerra civil",
    legal: "Legal y pacÃ­fica"
  };

  return labels[value] || "Legal y pacÃ­fica";
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

  const cleaned = entry.replace(/\s+\((politica|econ[oÃ³]mica|militar|regional)\)\s*$/i, "").trim();
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
    return `RepÃºblica Federal de ${commonName}`;
  }
  if (
    commonName.startsWith("RepÃºblica") ||
    commonName.startsWith("Republica") ||
    commonName.startsWith("Reino") ||
    commonName.startsWith("Estado")
  ) {
    return commonName;
  }
  return `RepÃºblica de ${commonName}`;
}

function deriveHistoricalNames(code, historyEntry) {
  const historicalNames = [...(HISTORICAL_NAME_OVERRIDES[code] || [])];
  if (historyEntry?.origin && !historicalNames.includes(historyEntry.origin)) {
    historicalNames.push(historyEntry.origin);
  }
  return historicalNames.filter(Boolean);
}

function getLocalSymbolAssets(code) {
  const flagPath = `./assets/flags/${code}.svg`;
  const coatPath = `./assets/coats/${code}.svg`;
  return {
    flagPath: fs.existsSync(flagPath) ? `/assets/flags/${code}.svg` : null,
    coatPath: fs.existsSync(coatPath) ? `/assets/coats/${code}.svg` : null
  };
}

function buildSymbolMetadata(code, commonName) {
  const assets = getLocalSymbolAssets(code);
  return {
    flagDescription: SYMBOL_OVERRIDES[code]?.flagDescription || `Bandera asociada a ${commonName}`,
    coatOfArms: SYMBOL_OVERRIDES[code]?.coatOfArms || null,
    assets
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
  if (origin.includes("francia")) return ["FrancÃ©s"];
  if (origin.includes("reino unido")) return ["InglÃ©s"];
  if (origin.includes("espana")) return ["EspaÃ±ol"];
  if (origin.includes("portugal")) return ["PortuguÃ©s"];
  if (origin.includes("paises bajos")) return ["NeerlandÃ©s"];
  if (origin.includes("dinamarca")) return ["DanÃ©s"];
  if (origin.includes("estados unidos")) return ["InglÃ©s"];

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
    return "MonarquÃ­a constitucional o absoluta de base unitaria";
  }
  if (system.includes("teocracia")) {
    return "Estado unitario teocrÃ¡tico";
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
    "CuradurÃ­a manual interna"
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
    ]),
    symbols: withManual([
      "assets/flags",
      "assets/coats"
    ]),
    relations: withManual([
      "politics.json",
      "politics_details.json",
      "curated relation overrides"
    ])
  };
}

function buildQualityMetadata(context = {}) {
  const estimatedFields = [];
  const curatedFields = [];
  const confirmedFields = [];
  const missingFields = [];

  if (!context.populationFromPrimarySource && context.populationValue) {
    estimatedFields.push("general.population");
  } else if (context.populationValue) {
    confirmedFields.push("general.population");
  }
  if (!context.inflationFromPrimarySource && context.inflationValue !== null && context.inflationValue !== undefined) {
    estimatedFields.push("economy.inflation");
  } else if (context.inflationValue !== null && context.inflationValue !== undefined) {
    confirmedFields.push("economy.inflation");
  }
  if (!context.religionCompositionFromPrimarySource && context.religionCompositionCount) {
    estimatedFields.push("religion.composition");
  } else if (context.religionCompositionCount) {
    confirmedFields.push("religion.composition");
  }
  if (!context.organizationFromPrimarySource && context.organizationCount) {
    estimatedFields.push("politics.organizations");
  } else if (context.organizationCount) {
    confirmedFields.push("politics.organizations");
  }

  if (!context.languagesCount) {
    missingFields.push("general.languages");
  }
  if (!context.capitalsCount) {
    missingFields.push("general.capitals");
  }
  if (!context.stateStructure) {
    missingFields.push("general.stateStructure");
  }
  if (!context.subdivisionType) {
    missingFields.push("general.subdivisions");
  }
  if (!context.religionCompositionCount) {
    missingFields.push("religion.composition");
  }
  if (!context.organizationCount) {
    missingFields.push("politics.organizations");
  }
  if (!context.conflictCount) {
    missingFields.push("military.conflicts");
  }

  if (context.languagesCount) {
    curatedFields.push("general.languages");
  }
  if (context.symbolCoverage > 0) {
    curatedFields.push("general.symbols");
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
  if (context.relationCoverageCount) {
    curatedFields.push("politics.relations");
  }

  const sourceCoverageScore = Math.min(
    100,
    Math.round((Object.values(context.sourceSectionCoverage || {}).filter(Boolean).length / 8) * 100)
  );
  const score = Math.min(
    100,
    Math.max(0, 100 - estimatedFields.length * 6 - missingFields.length * 10 + curatedFields.length * 3 + Math.round(sourceCoverageScore * 0.08))
  );

  return {
    estimatedFields,
    curatedFields,
    confirmedFields,
    missingFields,
    score,
    sourceCoverageScore,
    status: score >= 90 ? "alta" : score >= 75 ? "buena" : score >= 60 ? "media" : "basica",
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

function buildMetadataProvenance(code, context = {}) {
  const sectionCoverage = Object.fromEntries(
    Object.entries(context.sources || {}).map(([section, list]) => [section, compactList(list).length])
  );

  return {
    code,
    updatedAt: BUILD_UPDATED_AT,
    sections: {
      general: { sourceCount: sectionCoverage.general || 0, status: context.quality?.sectionStatus?.general || "base" },
      history: { sourceCount: sectionCoverage.history || 0, status: context.quality?.sectionStatus?.history || "base" },
      economy: { sourceCount: sectionCoverage.economy || 0, status: context.quality?.sectionStatus?.economy || "base" },
      military: { sourceCount: sectionCoverage.military || 0, status: context.quality?.sectionStatus?.military || "base" },
      politics: { sourceCount: sectionCoverage.politics || 0, status: context.quality?.sectionStatus?.politics || "base" },
      religion: { sourceCount: sectionCoverage.religion || 0, status: context.quality?.sectionStatus?.religion || "base" },
      symbols: { sourceCount: sectionCoverage.symbols || 0, status: context.symbolCoverage > 0 ? "curated" : "fallback" },
      relations: { sourceCount: sectionCoverage.relations || 0, status: context.relationCoverageCount ? "curated" : "base" }
    },
    flags: {
      hasLocalFlag: Boolean(context.symbolAssets?.flagPath),
      hasLocalCoat: Boolean(context.symbolAssets?.coatPath),
      hasCuratedTimeline: Boolean(context.hasCuratedTimeline),
      hasCuratedConflicts: Boolean(context.hasCuratedConflicts)
    }
  };
}

function createMetadataBundle(code, context = {}) {
  const sources = buildMetadataSources(code, {
    organizations: context.organizations || [],
    rivals: context.rivals || [],
    conflicts: context.conflicts || []
  });
  const relationCoverageCount =
    (context.relationMetadata?.militaryAllies?.length || 0) +
    (context.relationMetadata?.economicPartners?.length || 0) +
    (context.relationMetadata?.diplomaticPartners?.length || 0) +
    (context.relationMetadata?.currentRivals?.length || 0) +
    (context.relationMetadata?.historicalRivals?.length || 0) +
    (context.relationMetadata?.disputedTerritories?.length || 0);
  const symbolCoverage =
    Number(Boolean(context.symbolAssets?.flagPath)) +
    Number(Boolean(context.symbolAssets?.coatPath));
  const sourceSectionCoverage = Object.fromEntries(
    Object.entries(sources).map(([section, list]) => [section, compactList(list).length])
  );
  const quality = buildQualityMetadata({
    populationFromPrimarySource: context.populationFromPrimarySource,
    populationValue: context.populationValue,
    inflationFromPrimarySource: context.inflationFromPrimarySource,
    inflationValue: context.inflationValue,
    religionCompositionFromPrimarySource: context.religionCompositionFromPrimarySource,
    religionCompositionCount: context.religionCompositionCount,
    organizationFromPrimarySource: context.organizationFromPrimarySource,
    organizationCount: context.organizationCount,
    rivalCount: context.rivalCount,
    conflictCount: context.conflictCount,
    languagesCount: context.languagesCount,
    capitalsCount: context.capitalsCount,
    stateStructure: context.stateStructure,
    subdivisionType: context.subdivisionType,
    hasCuratedTimeline: context.hasCuratedTimeline,
    hasCuratedConflicts: context.hasCuratedConflicts,
    symbolCoverage,
    relationCoverageCount,
    sourceSectionCoverage
  });

  return {
    updatedAt: BUILD_UPDATED_AT,
    sources,
    quality,
    provenance: buildMetadataProvenance(code, {
      sources,
      quality,
      symbolCoverage,
      relationCoverageCount,
      symbolAssets: context.symbolAssets,
      hasCuratedTimeline: context.hasCuratedTimeline,
      hasCuratedConflicts: context.hasCuratedConflicts
    })
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
    ["espana", "EspaÃ±a"],
    ["portugal", "Portugal"],
    ["paises bajos", "PaÃ­ses Bajos"],
    ["holanda", "PaÃ­ses Bajos"],
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

function getCategorizedOrganizationBlocks(organizations) {
  const grouped = {
    military: [],
    economic: [],
    diplomatic: []
  };

  compactList(organizations).forEach(organization => {
    const label = normalizeKey(organization?.name || organization);
    RELATION_BLOC_CATEGORY_RULES.forEach(rule => {
      if (label.includes(rule.key)) {
        grouped[rule.category].push(rule.label);
      }
    });
  });

  return {
    military: uniqueBy(grouped.military, item => normalizeKey(item)),
    economic: uniqueBy(grouped.economic, item => normalizeKey(item)),
    diplomatic: uniqueBy(grouped.diplomatic, item => normalizeKey(item))
  };
}

function buildRelationMetadata(code, historyEntry, organizations, rivals) {
  const metropole = deriveMetropole(code, historyEntry);
  const territories = TERRITORY_LINKS[code] || [];
  const override = {
    ...(RELATION_OVERRIDES[code] || {}),
    ...(RELATION_OVERRIDES_V2[code] || {})
  };
  const categorizedBlocs = getCategorizedOrganizationBlocks(organizations);
  const currentRivals = uniqueBy(
    [
      ...compactList(override.currentRivals),
      ...rivals.filter(rival => (rival?.type || "historico") === "actual").map(rival => rival?.name || rival)
    ],
    item => normalizeKey(item)
  );
  const historicalRivals = uniqueBy(
    [
      ...compactList(override.historicalRivals),
      ...rivals.filter(rival => (rival?.type || "historico") !== "actual").map(rival => rival?.name || rival)
    ],
    item => normalizeKey(item)
  );
  const militaryBlocs = uniqueBy(
    [...categorizedBlocs.military, ...compactList(override.militaryBlocs)],
    item => normalizeKey(item)
  );
  const economicBlocs = uniqueBy(
    [...categorizedBlocs.economic, ...compactList(override.economicBlocs)],
    item => normalizeKey(item)
  );
  const diplomaticBlocs = uniqueBy(
    [...categorizedBlocs.diplomatic, ...compactList(override.diplomaticBlocs), ...(override.blocs || [])],
    item => normalizeKey(item)
  );
  const militaryAllies = uniqueBy(compactList(override.militaryAllies), item => normalizeKey(item));
  const economicPartners = uniqueBy(compactList(override.economicPartners), item => normalizeKey(item));
  const diplomaticPartners = uniqueBy(compactList(override.diplomaticPartners), item => normalizeKey(item));
  const linkedTerritories = uniqueBy(
    [...territories, ...compactList(override.associatedTerritories), ...compactList(override.linkedTerritories)],
    item => normalizeKey(item)
  );
  const dependencies = uniqueBy(
    [...compactList(override.dependencies), ...compactList(override.protectorates)],
    item => normalizeKey(item)
  );
  const exColonies = uniqueBy(compactList(override.exColonies), item => normalizeKey(item));
  return {
    exMetropole: metropole,
    exColonies,
    linkedTerritories,
    associatedTerritories: linkedTerritories,
    militaryBlocs,
    economicBlocs,
    diplomaticBlocs,
    blocs: uniqueBy(
      [...(getOrganizationBlocks(organizations) || []), ...militaryBlocs, ...economicBlocs, ...diplomaticBlocs],
      item => normalizeKey(item)
    ),
    militaryAllies,
    economicPartners,
    diplomaticPartners,
    allies: uniqueBy(
      [...compactList(override.allies), ...militaryAllies, ...economicPartners, ...diplomaticPartners],
      item => normalizeKey(item)
    ),
    currentRivals,
    historicalRivals,
    rivalStates: uniqueBy(
      [...currentRivals, ...historicalRivals, ...(rivals.map(rival => rival?.name || rival)), ...(override.rivalStates || [])],
      item => normalizeKey(item)
    ),
    disputes: uniqueBy(override.disputes || [], item => normalizeKey(item)),
    disputedTerritories: uniqueBy(
      compactList(compactList(override.disputedTerritories).length ? override.disputedTerritories : override.disputes),
      item => normalizeKey(item)
    ),
    protectorates: dependencies,
    dependencies
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

Object.assign(RELIGION_DETAIL_OVERRIDES, {
  BOL: [
    { name: "Catolicos", percentage: 64.0 },
    { name: "Protestantes y evangelicos", percentage: 18.2 },
    { name: "Religiones animistas y populares", percentage: 8.3 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 8.7 },
    { name: "Otras religiones", percentage: 0.8 }
  ],
  CHL: [
    { name: "Catolicos", percentage: 54.0 },
    { name: "Protestantes y evangelicos", percentage: 16.3 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 27.5 },
    { name: "Otras religiones", percentage: 2.2 }
  ],
  COL: [
    { name: "Catolicos", percentage: 68.8 },
    { name: "Protestantes y evangelicos", percentage: 16.7 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 11.8 },
    { name: "Otras religiones", percentage: 2.7 }
  ],
  CUB: [
    { name: "Catolicos", percentage: 41.0 },
    { name: "Religiones afrocubanas", percentage: 18.0 },
    { name: "Protestantes y evangelicos", percentage: 12.0 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 26.0 },
    { name: "Otras religiones", percentage: 3.0 }
  ],
  ECU: [
    { name: "Catolicos", percentage: 67.9 },
    { name: "Protestantes y evangelicos", percentage: 19.2 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 10.4 },
    { name: "Otras religiones", percentage: 2.5 }
  ],
  EGY: [
    { name: "Musulmanes sunitas", percentage: 89.6 },
    { name: "Cristianos coptos", percentage: 9.4 },
    { name: "Cristianos protestantes", percentage: 0.5 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 0.5 }
  ],
  ETH: [
    { name: "Cristianos ortodoxos", percentage: 43.8 },
    { name: "Musulmanes sunitas", percentage: 31.3 },
    { name: "Protestantes y evangelicos", percentage: 22.8 },
    { name: "Religiones animistas y populares", percentage: 1.6 },
    { name: "Catolicos", percentage: 0.5 }
  ],
  ISR: [
    { name: "Judios", percentage: 73.6 },
    { name: "Musulmanes sunitas", percentage: 18.1 },
    { name: "Cristianos", percentage: 1.9 },
    { name: "Drusos", percentage: 1.6 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 4.8 }
  ],
  ITA: [
    { name: "Catolicos", percentage: 74.4 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 19.6 },
    { name: "Musulmanes sunitas", percentage: 3.7 },
    { name: "Cristianos ortodoxos", percentage: 1.1 },
    { name: "Otros cristianos", percentage: 1.2 }
  ],
  PER: [
    { name: "Catolicos", percentage: 63.6 },
    { name: "Protestantes y evangelicos", percentage: 14.1 },
    { name: "Religiones animistas y populares", percentage: 6.8 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 13.0 },
    { name: "Otras religiones", percentage: 2.5 }
  ],
  POL: [
    { name: "Catolicos", percentage: 84.2 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 11.4 },
    { name: "Cristianos ortodoxos", percentage: 1.3 },
    { name: "Protestantes", percentage: 0.8 },
    { name: "Otras religiones", percentage: 2.3 }
  ],
  PRY: [
    { name: "Catolicos", percentage: 73.3 },
    { name: "Protestantes y evangelicos", percentage: 17.2 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 7.5 },
    { name: "Otras religiones", percentage: 2.0 }
  ],
  SAU: [
    { name: "Musulmanes sunitas", percentage: 85.0 },
    { name: "Musulmanes chiitas", percentage: 10.0 },
    { name: "Cristianos", percentage: 2.5 },
    { name: "Hindues", percentage: 1.5 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 1.0 }
  ],
  URY: [
    { name: "Catolicos", percentage: 38.0 },
    { name: "Protestantes y evangelicos", percentage: 5.7 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 53.8 },
    { name: "Otras religiones", percentage: 2.5 }
  ],
  UKR: [
    { name: "Cristianos ortodoxos", percentage: 67.4 },
    { name: "Catolicos orientales", percentage: 8.8 },
    { name: "Protestantes", percentage: 2.2 },
    { name: "Musulmanes sunitas", percentage: 1.1 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 20.5 }
  ],
  VEN: [
    { name: "Catolicos", percentage: 67.0 },
    { name: "Protestantes y evangelicos", percentage: 17.0 },
    { name: "Ateos / agnosticos / sin afiliacion", percentage: 12.5 },
    { name: "Otras religiones", percentage: 3.5 }
  ]
});

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

Object.assign(POST_BUILD_ENTITY_OVERRIDES, {
  CHE: {
    general: {
      cities: [
        { name: "Zurich", population: 421878, isCapital: false },
        { name: "Ginebra", population: 203951, isCapital: false },
        { name: "Basilea", population: 177654, isCapital: false },
        { name: "Lausana", population: 140202, isCapital: false }
      ]
    }
  },
  ARG: {
    general: {
      cities: [
        { name: "Cordoba", population: 1565112, isCapital: false },
        { name: "Rosario", population: 1343425, isCapital: false },
        { name: "Mendoza", population: 1150414, isCapital: false },
        { name: "La Plata", population: 772618, isCapital: false }
      ]
    }
  },
  BOL: {
    general: {
      cities: [
        { name: "Santa Cruz de la Sierra", population: 1680000, isCapital: false },
        { name: "El Alto", population: 1093017, isCapital: false },
        { name: "Cochabamba", population: 856198, isCapital: false },
        { name: "Sucre", population: 329000, isCapital: false }
      ]
    }
  },
  BRA: {
    general: {
      cities: [
        { name: "Sao Paulo", population: 11451999, isCapital: false },
        { name: "Rio de Janeiro", population: 6211223, isCapital: false },
        { name: "Salvador", population: 2417678, isCapital: false },
        { name: "Belo Horizonte", population: 2315560, isCapital: false }
      ]
    }
  },
  CAN: {
    general: {
      cities: [
        { name: "Toronto", population: 2794356, isCapital: false },
        { name: "Montreal", population: 1762949, isCapital: false },
        { name: "Vancouver", population: 662248, isCapital: false },
        { name: "Calgary", population: 1306784, isCapital: false },
        { name: "Ottawa", population: 1017449, isCapital: true }
      ]
    }
  },
  CHL: {
    general: {
      cities: [
        { name: "Valparaiso", population: 296655, isCapital: false },
        { name: "Concepcion", population: 223574, isCapital: false },
        { name: "Antofagasta", population: 361873, isCapital: false },
        { name: "La Serena", population: 221054, isCapital: false }
      ]
    }
  },
  COL: {
    general: {
      cities: [
        { name: "Medellin", population: 2569000, isCapital: false },
        { name: "Cali", population: 2227642, isCapital: false },
        { name: "Barranquilla", population: 1326588, isCapital: false },
        { name: "Cartagena", population: 1036412, isCapital: false }
      ]
    }
  },
  CUB: {
    general: {
      cities: [
        { name: "Santiago de Cuba", population: 431272, isCapital: false },
        { name: "Camaguey", population: 321992, isCapital: false },
        { name: "Holguin", population: 302158, isCapital: false },
        { name: "Santa Clara", population: 220210, isCapital: false }
      ]
    }
  },
  ECU: {
    general: {
      cities: [
        { name: "Guayaquil", population: 2697801, isCapital: false },
        { name: "Cuenca", population: 596101, isCapital: false },
        { name: "Santo Domingo", population: 458580, isCapital: false },
        { name: "Machala", population: 276669, isCapital: false }
      ]
    }
  },
  EGY: {
    general: {
      cities: [
        { name: "Alejandria", population: 5230000, isCapital: false },
        { name: "Giza", population: 4239988, isCapital: false },
        { name: "Port Said", population: 749371, isCapital: false },
        { name: "Suez", population: 744189, isCapital: false }
      ]
    }
  },
  MEX: {
    general: {
      cities: [
        { name: "Guadalajara", population: 1385621, isCapital: false },
        { name: "Monterrey", population: 1142994, isCapital: false },
        { name: "Puebla", population: 1692181, isCapital: false },
        { name: "Tijuana", population: 1810645, isCapital: false }
      ]
    }
  },
  PER: {
    general: {
      cities: [
        { name: "Arequipa", population: 1100000, isCapital: false },
        { name: "Trujillo", population: 970016, isCapital: false },
        { name: "Chiclayo", population: 799675, isCapital: false },
        { name: "Piura", population: 505028, isCapital: false }
      ]
    }
  },
  PRY: {
    general: {
      cities: [
        { name: "Ciudad del Este", population: 301815, isCapital: false },
        { name: "San Lorenzo", population: 252561, isCapital: false },
        { name: "Luque", population: 263604, isCapital: false },
        { name: "Encarnacion", population: 134059, isCapital: false }
      ]
    }
  },
  URY: {
    general: {
      cities: [
        { name: "Salto", population: 104028, isCapital: false },
        { name: "Ciudad de la Costa", population: 112449, isCapital: false },
        { name: "Paysandu", population: 76429, isCapital: false },
        { name: "Las Piedras", population: 71343, isCapital: false }
      ]
    }
  },
  VEN: {
    general: {
      cities: [
        { name: "Maracaibo", population: 1650000, isCapital: false },
        { name: "Valencia", population: 1200000, isCapital: false },
        { name: "Barquisimeto", population: 1016000, isCapital: false },
        { name: "Maracay", population: 955362, isCapital: false }
      ]
    }
  },
  ETH: {
    general: {
      cities: [
        { name: "Dire Dawa", population: 506936, isCapital: false },
        { name: "Mekelle", population: 500000, isCapital: false },
        { name: "Adama", population: 387000, isCapital: false },
        { name: "Bahir Dar", population: 348429, isCapital: false }
      ]
    }
  },
  ITA: {
    general: {
      cities: [
        { name: "Milan", population: 1374582, isCapital: false },
        { name: "Napoles", population: 914758, isCapital: false },
        { name: "Turin", population: 848748, isCapital: false },
        { name: "Palermo", population: 630828, isCapital: false }
      ]
    }
  },
  JPN: {
    general: {
      cities: [
        { name: "Yokohama", population: 3777491, isCapital: false },
        { name: "Osaka", population: 2752412, isCapital: false },
        { name: "Nagoya", population: 2332176, isCapital: false },
        { name: "Sapporo", population: 1973395, isCapital: false }
      ]
    }
  },
  POL: {
    general: {
      cities: [
        { name: "Cracovia", population: 804237, isCapital: false },
        { name: "Lodz", population: 655279, isCapital: false },
        { name: "Wroclaw", population: 674079, isCapital: false },
        { name: "Poznan", population: 540365, isCapital: false }
      ]
    }
  },
  SAU: {
    general: {
      cities: [
        { name: "Yeda", population: 3976000, isCapital: false },
        { name: "La Meca", population: 2150000, isCapital: false },
        { name: "Medina", population: 1411000, isCapital: false },
        { name: "Dammam", population: 1252000, isCapital: false }
      ]
    }
  }
});

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

function canonicalizeConflictName(name) {
  return canonicalizeConflictNameWithRules(name, CONFLICT_NAME_CANONICAL_RULES);
}

function getConflictYearHints(name) {
  const canonicalName = canonicalizeConflictName(name);
  return {
    ...(getImportedConflictYearHints(canonicalName) || {}),
    ...(CONFLICT_YEAR_HINTS[canonicalName] || CONFLICT_YEAR_HINTS_NORMALIZED[normalizeKey(canonicalName)] || {})
  };
}

function getGlobalConflictParticipation(code) {
  return GLOBAL_CONFLICT_PARTICIPATION[code] || [];
}

let importedConflictYearHintsCache = null;
let dyadicCountryIndexCache = null;

function getImportedConflictYearHints(name) {
  if (!importedConflictYearHintsCache) {
    importedConflictYearHintsCache = new Map();
    const importedConflicts = importedConflictDetails?.conflicts || importedConflictDetails || {};
    Object.entries(importedConflicts).forEach(([rawName, detail]) => {
      const canonicalName = canonicalizeConflictName(rawName);
      const chronologyText = (Array.isArray(detail?.chronology) ? detail.chronology : [])
        .map(item => `${item?.year ?? ""} ${item?.text ?? ""}`.trim())
        .join(" ");
      const inferred = inferConflictYearsFromText(chronologyText);
      if (inferred.startYear || inferred.endYear || inferred.ongoing) {
        importedConflictYearHintsCache.set(canonicalName, inferred);
        importedConflictYearHintsCache.set(normalizeKey(canonicalName), inferred);
      }
    });
  }

  return importedConflictYearHintsCache.get(name) || importedConflictYearHintsCache.get(normalizeKey(name)) || null;
}

function getDyadicRegionLabel(regions = []) {
  const primary = compactList(regions)[0];
  return DYADIC_REGION_LABELS[String(primary)] || null;
}

function getDyadicConflictTypeLabel(conflictTypes = []) {
  const primary = compactList(conflictTypes)[0];
  return DYADIC_CONFLICT_TYPE_LABELS[String(primary)] || null;
}

function getDyadicIntensityLabel(intensityLevels = []) {
  const levels = compactList(intensityLevels).map(value => String(value));
  if (levels.includes("2")) {
    return "guerra";
  }
  if (levels.includes("1")) {
    return "conflicto armado";
  }
  return null;
}

function buildDyadicCountryIndex() {
  if (dyadicCountryIndexCache) {
    return dyadicCountryIndexCache;
  }

  const reverseAliasMap = new Map();
  const countryIndex = new Map();

  const registerAlias = (code, alias) => {
    const normalized = normalizeKey(alias);
    if (!normalized) {
      return;
    }
    if (!reverseAliasMap.has(normalized)) {
      reverseAliasMap.set(normalized, code);
    }
  };

  allCodes.forEach(code => {
    registerAlias(code, code);
    registerAlias(code, COUNTRY_NAME_OVERRIDES[code]);
    registerAlias(code, countryNames[code]);
    registerAlias(code, base[code]?.name);
    registerAlias(code, OFFICIAL_NAME_OVERRIDES[code]);
    compactList(HISTORICAL_NAME_OVERRIDES[code]).forEach(name => registerAlias(code, name));
    compactList(DYADIC_COUNTRY_ALIAS_OVERRIDES[code]).forEach(name => registerAlias(code, name));
    countryIndex.set(code, []);
  });

  compactList(dyadicConflictSummary?.conflicts).forEach(conflict => {
    const aliases = [...compactList(conflict.locations), ...compactList(conflict.territoryNames)];
    const matchedCodes = new Set(
      aliases
        .map(alias => reverseAliasMap.get(normalizeKey(alias)))
        .filter(Boolean)
    );

    const normalizedConflict = {
      dyadicConflictId: conflict.conflictId,
      startYear: conflict.startYear ?? null,
      endYear: conflict.endYear ?? null,
      region: getDyadicRegionLabel(conflict.regions),
      conflictType: getDyadicConflictTypeLabel(conflict.conflictTypes),
      intensityLevel: getDyadicIntensityLabel(conflict.intensityLevels),
      participants: {
        sideA: compactList(conflict.sideA),
        sideB: compactList(conflict.sideB)
      },
      locations: compactList(conflict.locations),
      territoryNames: compactList(conflict.territoryNames),
      source: "UCDP Dyadic Dataset v25.1"
    };

    matchedCodes.forEach(code => {
      countryIndex.get(code)?.push(normalizedConflict);
    });
  });

  dyadicCountryIndexCache = countryIndex;
  return dyadicCountryIndexCache;
}

function conflictsYearsOverlap(conflict, candidate) {
  const leftStart = conflict.startYear ?? conflict.endYear ?? null;
  const leftEnd = conflict.endYear ?? conflict.startYear ?? null;
  const rightStart = candidate.startYear ?? candidate.endYear ?? null;
  const rightEnd = candidate.endYear ?? candidate.startYear ?? null;

  if (leftStart === null || rightStart === null) {
    return false;
  }

  return leftStart <= rightEnd && rightStart <= leftEnd;
}

function scoreDyadicConflictCandidate(conflict, candidate) {
  let score = 0;
  const conflictStart = conflict.startYear ?? conflict.endYear ?? null;
  const conflictEnd = conflict.endYear ?? conflict.startYear ?? null;
  const candidateStart = candidate.startYear ?? candidate.endYear ?? null;
  const candidateEnd = candidate.endYear ?? candidate.startYear ?? null;

  if (conflictsYearsOverlap(conflict, candidate)) {
    score += 5;
  }
  if (conflict.startYear !== null && candidate.startYear !== null && conflict.startYear === candidate.startYear) {
    score += 2;
  }
  if (conflict.endYear !== null && candidate.endYear !== null && conflict.endYear === candidate.endYear) {
    score += 2;
  }
  if (conflict.ongoing && candidate.endYear === null) {
    score += 1;
  }
  if (candidateStart !== null && candidateEnd !== null) {
    const candidateSpan = Math.max(1, candidateEnd - candidateStart + 1);
    score += Math.max(0, 3 - Math.min(3, Math.floor(candidateSpan / 10)));
  }
  if (conflictStart !== null && candidateStart !== null) {
    score += Math.max(0, 3 - Math.min(3, Math.floor(Math.abs(conflictStart - candidateStart) / 5)));
  }
  if (conflictEnd !== null && candidateEnd !== null) {
    score += Math.max(0, 3 - Math.min(3, Math.floor(Math.abs(conflictEnd - candidateEnd) / 5)));
  }

  return score;
}

function isSpecificDyadicMatch(conflict, candidate) {
  const conflictStart = conflict.startYear ?? conflict.endYear ?? null;
  const conflictEnd = conflict.endYear ?? conflict.startYear ?? null;
  const candidateStart = candidate.startYear ?? candidate.endYear ?? null;
  const candidateEnd = candidate.endYear ?? candidate.startYear ?? null;

  if (conflictStart === null || candidateStart === null || candidateEnd === null) {
    return false;
  }

  const candidateSpan = Math.max(1, candidateEnd - candidateStart + 1);
  if (candidateSpan <= 15) {
    return true;
  }

  const startDistance = Math.abs(conflictStart - candidateStart);
  const endDistance = Math.abs((conflictEnd ?? conflictStart) - candidateEnd);
  return startDistance <= 3 && endDistance <= 3;
}

function enrichConflictsWithDyadic(code, conflicts = []) {
  const countryCandidates = buildDyadicCountryIndex().get(code) || [];
  if (!countryCandidates.length) {
    return conflicts;
  }

  return conflicts.map(conflict => {
    if (!conflict?.name) {
      return conflict;
    }

    if ((conflict.startYear ?? conflict.endYear ?? 0) < 2000) {
      return conflict;
    }

    const needsSupplement = !conflict.region || !conflict.participants || !conflict.conflictType || !conflict.intensityLevel;
    if (!needsSupplement) {
      return conflict;
    }

    const ranked = countryCandidates
      .map(candidate => ({ candidate, score: scoreDyadicConflictCandidate(conflict, candidate) }))
      .filter(entry => entry.score > 0 && isSpecificDyadicMatch(conflict, entry.candidate))
      .sort((a, b) => b.score - a.score);

    if (!ranked.length) {
      return conflict;
    }

    const best = ranked[0];
    const second = ranked[1];
    if (second && best.score <= second.score) {
      return conflict;
    }

    const supplementalSources = uniqueBy(
      [...compactList(conflict.sources), best.candidate.source],
      value => normalizeKey(value)
    );

    return {
      ...conflict,
      region: conflict.region || best.candidate.region || null,
      conflictType: conflict.conflictType || best.candidate.conflictType || null,
      intensityLevel: conflict.intensityLevel || best.candidate.intensityLevel || null,
      participants:
        conflict.participants ||
        (best.candidate.participants.sideA.length || best.candidate.participants.sideB.length
          ? best.candidate.participants
          : null),
      dyadicConflictId: conflict.dyadicConflictId || best.candidate.dyadicConflictId,
      locations: uniqueBy(
        [...compactList(conflict.locations), ...compactList(best.candidate.locations)],
        value => normalizeKey(value)
      ),
      territoryNames: uniqueBy(
        [...compactList(conflict.territoryNames), ...compactList(best.candidate.territoryNames)],
        value => normalizeKey(value)
      ),
      sources: supplementalSources
    };
  });
}

function stripHistoricalDyadicSupplement(conflicts = []) {
  return conflicts.map(conflict => {
    if (!conflict?.dyadicConflictId) {
      return conflict;
    }

    const conflictYear = conflict.startYear ?? conflict.endYear ?? 0;
    if (conflictYear >= 2000) {
      return conflict;
    }

    const remainingSources = compactList(conflict.sources).filter(source => normalizeKey(source) !== normalizeKey("UCDP Dyadic Dataset v25.1"));
    const { dyadicConflictId, participants, region, conflictType, intensityLevel, locations, territoryNames, sources, ...rest } = conflict;

    return {
      ...rest,
      ...(remainingSources.length ? { sources: remainingSources } : {})
    };
  });
}

function mergeConflictSources(code, ...sources) {
  const merged = normalizeConflicts([...sources.flat(), ...getGlobalConflictParticipation(code)]);
  const deduped = mergeConflictEntries(merged)
    .sort((a, b) => (a.startYear ?? 9999) - (b.startYear ?? 9999) || (a.endYear ?? 9999) - (b.endYear ?? 9999) || String(a.name || "").localeCompare(String(b.name || ""), "es"));

  const overrides = CURATED_CONFLICT_OVERRIDES[code];
  const baseConflicts = overrides
    ? mergeConflictEntries([...deduped, ...normalizeConflicts(overrides)])
    : deduped;

  return stripHistoricalDyadicSupplement(enrichConflictsWithDyadic(code, baseConflicts))
    .sort((a, b) => (a.startYear ?? 9999) - (b.startYear ?? 9999) || (a.endYear ?? 9999) - (b.endYear ?? 9999) || String(a.name || "").localeCompare(String(b.name || ""), "es"));
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
        const canonicalName = canonicalizeConflictName(entry);
        const hints = getConflictYearHints(canonicalName);
        const inferredFromName = inferConflictYearsFromText(entry);
        return {
          name: canonicalName,
          startYear: hints?.startYear ?? inferredFromName.startYear ?? inferredFromName.endYear ?? null,
          endYear: hints?.endYear ?? inferredFromName.endYear ?? inferredFromName.startYear ?? null,
          ongoing: Boolean(hints?.ongoing ?? inferredFromName.ongoing)
        };
      }

      const canonicalName = canonicalizeConflictName(entry.name || null);
      const hints = getConflictYearHints(canonicalName);
      const inferredFromName = inferConflictYearsFromText(entry.name || "");
      const explicitStartYear = entry.startYear ?? null;
      const explicitEndYear = entry.endYear ?? null;
      const resolvedStartYear = explicitStartYear ?? hints?.startYear ?? inferredFromName.startYear ?? explicitEndYear ?? hints?.endYear ?? inferredFromName.endYear ?? null;
      const resolvedEndYear = explicitEndYear ?? hints?.endYear ?? inferredFromName.endYear ?? resolvedStartYear ?? null;

      return {
        ...entry,
        name: canonicalName,
        startYear: resolvedStartYear,
        endYear: resolvedEndYear,
        ongoing: Boolean(entry.ongoing ?? hints?.ongoing ?? inferredFromName.ongoing)
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
const importedConflictDetails = readJson("./data/conflict_details.generated.json");
const dyadicConflictSummary = readJson("./data/conflict_dyadic_summary.json");

const DYADIC_REGION_LABELS = {
  "1": "Europa",
  "2": "Medio Oriente",
  "3": "Asia",
  "4": "Africa",
  "5": "America"
};

const DYADIC_CONFLICT_TYPE_LABELS = {
  "1": "interestatal",
  "2": "extraestatal",
  "3": "interno",
  "4": "internacionalizado"
};

const DYADIC_COUNTRY_ALIAS_OVERRIDES = {
  AFG: ["afghanistan"],
  COD: ["dr congo (zaire)", "democratic republic of congo", "democratic republic of the congo", "zaire", "dr congo"],
  COG: ["republic of congo", "congo-brazzaville"],
  CIV: ["ivory coast"],
  CZE: ["czech republic", "czechia"],
  SWZ: ["eswatini", "swaziland"],
  MKD: ["macedonia", "north macedonia"],
  TZA: ["tanzania", "united republic of tanzania"],
  PSE: ["west bank", "palestine"],
  TWN: ["taiwan", "republic of china"],
  GRL: ["greenland"],
  GUF: ["french guiana"],
  ATA: ["antarctica"],
  "-99": ["somaliland"],
  IRQ: ["iraq"],
  ISR: ["israel"],
  UKR: ["ukraine"],
  VNM: ["north vietnam", "south vietnam", "vietnam"],
  KHM: ["cambodia", "cambodia (kampuchea)"],
  LAO: ["laos", "lao pdr"],
  SYR: ["syria", "syrian arab republic"],
  IRN: ["iran", "iran (persia)"],
  PRK: ["north korea", "korea, north", "democratic people's republic of korea"],
  KOR: ["south korea", "korea, south", "republic of korea"],
  USA: ["united states", "united states of america"],
  GBR: ["united kingdom", "great britain"],
  RUS: ["russia", "russian federation"],
  BOL: ["bolivia"],
  VEN: ["venezuela"],
  ETH: ["ethiopia"],
  SOM: ["somalia"],
  SDN: ["sudan"],
  SSD: ["south sudan"]
};

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
      exports: compactList(baseData.exports).length ? compactList(baseData.exports) : compactList(fallback.economy?.exports),
      industries: compactList(baseData.industries).length ? compactList(baseData.industries) : compactList(fallback.economy?.industries)
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
    metadata: createMetadataBundle(code, {
      organizations: mergedOrganizations,
      rivals: finalRivals,
      conflicts: mergedConflicts,
      relationMetadata,
      symbolAssets: symbols.assets,
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
      conflictCount: mergedConflicts.length,
      languagesCount: languages.length,
      capitalsCount: capitals.length,
      stateStructure,
      subdivisionType: subdivisions?.type,
      hasCuratedTimeline: Boolean(TIMELINE_EVENT_OVERRIDES[code]?.length),
      hasCuratedConflicts: Boolean(CURATED_CONFLICT_OVERRIDES[code]?.length)
    }),
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
  result[code].metadata = createMetadataBundle(code, {
    organizations: result[code].politics.organizations,
    rivals: result[code].politics.rivals,
    conflicts: result[code].military.conflicts,
    relationMetadata: result[code].politics.relations,
    symbolAssets: result[code].general.symbols?.assets,
    populationFromPrimarySource: populationData?.value !== undefined && populationData?.value !== null,
    populationValue: result[code].general.population,
    inflationFromPrimarySource: inflation[code] !== undefined && inflation[code] !== null,
    inflationValue: result[code].economy.inflation,
    religionCompositionFromPrimarySource: compactList(religionData.composition).length > 0,
    religionCompositionCount: result[code].religion.composition.length,
    organizationFromPrimarySource: compactList(politicsData.organizations).length > 0,
    organizationCount: result[code].politics.organizations.length,
    rivalCount: result[code].politics.rivals.length,
    conflictCount: result[code].military.conflicts.length,
    languagesCount: result[code].general.languages.length,
    capitalsCount: result[code].general.capitals.length,
    stateStructure: result[code].general.stateStructure,
    subdivisionType: result[code].general.subdivisions?.type,
    hasCuratedTimeline: Boolean(result[code].history?.events?.length),
    hasCuratedConflicts: Boolean(CURATED_CONFLICT_OVERRIDES[code]?.length)
  });
}

const exColoniesByMetropole = {};
for (const country of Object.values(result)) {
  const metropole = country.politics?.relations?.exMetropole;
  if (!metropole || !country?.name) {
    continue;
  }
  if (!exColoniesByMetropole[metropole]) {
    exColoniesByMetropole[metropole] = [];
  }
  exColoniesByMetropole[metropole].push(country.name);
}

for (const country of Object.values(result)) {
  const relationData = country.politics?.relations || {};
  relationData.exColonies = uniqueBy(
    [
      ...(relationData.exColonies || []),
      ...(exColoniesByMetropole[country.name] || [])
    ],
    item => normalizeKey(item)
  );
  relationData.associatedTerritories = uniqueBy(
    [
      ...(relationData.associatedTerritories || []),
      ...(relationData.linkedTerritories || [])
    ],
    item => normalizeKey(item)
  );
  relationData.dependencies = uniqueBy(
    [
      ...(relationData.dependencies || []),
      ...(relationData.protectorates || [])
    ],
    item => normalizeKey(item)
  );
  relationData.protectorates = relationData.dependencies;
}

const sanitizedResult = sanitizeDeep(result);

fs.writeJsonSync("./data/countries_full.json", sanitizedResult, { spaces: 2 });

const countryIndex = Object.fromEntries(
  Object.entries(sanitizedResult).map(([code, country]) => [
    code,
    {
      name: country.name,
      continent: country.continent,
      general: {
        population: country.general?.population ?? 0,
        geography: country.general?.geography ?? null,
        officialName: country.general?.officialName ?? country.name,
        historicalNames: country.general?.historicalNames || [],
        symbols: country.general?.symbols || {},
        capital: country.general?.capital || null,
        capitals: country.general?.capitals || [],
        languages: country.general?.languages || [],
        stateStructure: country.general?.stateStructure || null,
        subdivisions: country.general?.subdivisions || null,
        cities: (country.general?.cities || []).slice(0, 5)
      },
      history: {
        year: country.history?.year ?? null,
        type: country.history?.type ?? null,
        origin: country.history?.origin ?? null,
        events: (country.history?.events || []).slice(0, 4)
      },
      economy: {
        gdp: country.economy?.gdp ?? null,
        gdpPerCapita: country.economy?.gdpPerCapita ?? null,
        inflation: country.economy?.inflation ?? null,
        exports: (country.economy?.exports || []).slice(0, 6),
        industries: (country.economy?.industries || []).slice(0, 6)
      },
      military: {
        active: country.military?.active ?? null,
        reserve: country.military?.reserve ?? null,
        conflicts: (country.military?.conflicts || []).slice(0, 8)
      },
      politics: {
        system: country.politics?.system ?? null,
        organizations: (country.politics?.organizations || []).slice(0, 8),
        rivals: (country.politics?.rivals || []).slice(0, 8),
        relations: country.politics?.relations || {}
      },
      religion: country.religion || {},
      metadata: {
        updatedAt: country.metadata?.updatedAt,
        quality: country.metadata?.quality,
        isIndex: true
      },
      conflicts: (country.conflicts || []).slice(0, 8)
    }
  ])
);
fs.writeJsonSync("./data/countries_index.json", sanitizeDeep(countryIndex), { spaces: 0 });
fs.emptyDirSync("./data/countries");
Object.entries(sanitizedResult).forEach(([code, country]) => {
  fs.writeJsonSync(`./data/countries/${code}.json`, country, { spaces: 0 });
});

console.log(`Dataset generado: ${Object.keys(sanitizedResult).length} paises.`);
/*
  PAN: {
    flagDescription: "Bandera cuartelada blanca, roja y azul con estrellas",
    coatOfArms: "Escudo con aguila harpÃ­a, armas, cornucopia y lema nacional"
  },
  PER: {
    flagDescription: "Bandera roja, blanca y roja vertical con escudo en version estatal",
    coatOfArms: "Escudo con vicuna, quina y cornucopia"
  },
  PRY: {
    flagDescription: "Bandera tricolor roja, blanca y azul con escudos distintos en anverso y reverso",
    coatOfArms: "Escudo nacional con estrella amarilla y ramas de palma y olivo"
  },
  COL: [
    { year: 1810, category: "revolucion", text: "Cabildo Abierto de Santa Fe y proceso independentista" },
    { year: 1886, category: "constitucion", text: "Constitucion centralista de 1886" },
    { year: 1948, category: "guerra", text: "Bogotazo y comienzo de La Violencia" },
    { year: 1991, category: "constitucion", text: "Nueva Constitucion de Colombia" },
    { year: 2016, category: "tratado", text: "Acuerdo de paz con las FARC" }
  ],
  CUB: [
    { year: 1902, category: "estado", text: "Proclamacion de la Republica de Cuba" },
    { year: 1959, category: "revolucion", text: "Triunfo de la Revolucion cubana" },
    { year: 1976, category: "constitucion", text: "Constitucion socialista" }
  ],
  ECU: [
    { year: 1809, category: "revolucion", text: "Primer grito de independencia de Quito" },
    { year: 1830, category: "estado", text: "Separacion de la Gran Colombia" },
    { year: 1941, category: "guerra", text: "Guerra peruano-ecuatoriana" },
    { year: 2008, category: "constitucion", text: "Constitucion de Montecristi" }
  ],
  PER: [
    { year: 1821, category: "estado", text: "Proclamacion de la independencia del Peru" },
    { year: 1879, category: "guerra", text: "Participacion en la Guerra del Pacifico" },
    { year: 1992, category: "golpe", text: "Autogolpe de Alberto Fujimori" },
    { year: 1993, category: "constitucion", text: "Constitucion vigente de 1993" }
  ],
  ECU: {
    allies: ["Colombia", "Peru"],
    blocs: ["CAN", "ONU", "CELAC"],
    disputes: ["Espacios maritimos con Peru"],
    rivalStates: []
  },
  ECU: {
    economicPartners: ["Estados Unidos", "China", "Peru", "Colombia"],
    diplomaticPartners: ["Colombia", "Peru", "Chile"],
    economicBlocs: ["CAN"],
    diplomaticBlocs: ["ONU", "CELAC"]
  },
*/

