function source(label, url) {
  return { label, url };
}

const SOURCES = {
  koreaPhase1: source(
    "US Army Center of Military History: Korean War, phase 1",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/K%20Pdf/KW-P1.pdf"
  ),
  koreaAustralia: source(
    "Australian War Memorial: Korean War, 1950-1953",
    "https://www.awm.gov.au/articles/atwar/korea"
  ),
  koreaWhiteHorse: source(
    "US Army Center of Military History: White Horse Mountain",
    "https://history.army.mil/Portals/143/Images/Publications/ArmyHistoryMag/pdf/20102019/AH89%28W%29.pdf"
  ),
  vietnamGangToi: source(
    "Australian War Memorial: Gang Toi",
    "https://www.awm.gov.au/wartime/23/australian-mias-vietnam"
  ),
  vietnamLongTan: source(
    "Australian War Memorial: Battle of Long Tan",
    "https://www.awm.gov.au/collection/E84327"
  ),
  vietnamCoral: source(
    "Australian War Memorial: Coral and Balmoral",
    "https://www.awm.gov.au/articles/encyclopedia/coral"
  ),
  gulfWar: source(
    "US Naval History and Heritage Command: Desert Storm",
    "https://www.history.navy.mil/about-us/leadership/director/directors-corner/h-grams/h-gram-058/h-058-1.html"
  ),
  joybar: source(
    "Ministere des Armees: mission de securisation a Joybar",
    "https://www.defense.gouv.fr/de/node/6167"
  ),
  alasay: source(
    "Ministerio de Defensa de Espana: tropas de montana y Alasay",
    "https://publicaciones.defensa.gob.es/media/downloadable/files/links/t/r/tropas-montana-013.pdf"
  ),
  buenavista: source(
    "Municipalidad Provincial de Tacna: Combate de Buenavista",
    "https://www.munitacna.gob.pe/noticia/m/2023/04/18/municipalidad-provincial-de-tacna-conmemora-por-primera-vez-el-143-aniversario-del-combate-de-buenavista--6289"
  ),
  elManzano: source(
    "Biblioteca Virtual Miguel de Cervantes: Campana de Lima",
    "https://www.cervantesvirtual.com/obra-visor/la-campana-de-lima--0/html/ff9199e2-82b1-11df-acc7-002185ce6064_4.html"
  ),
  pacificWar: source(
    "Armada de Chile: Guerra del Pacifico",
    "https://www.armada.cl/tradicion-e-historia/principales-acciones-navales/5-la-guerra-del-pacifico"
  ),
  italy1945: source(
    "US Army Center of Military History: Po Valley campaign",
    "https://history.army.mil/portals/143/Images/Publications/catalog/72-33.pdf"
  ),
  suez: source(
    "National Army Museum: Suez Crisis",
    "https://www.nam.ac.uk/explore/suez-crisis"
  ),
  sinoIndianWar: source(
    "Government of India: Indian war memorials and the 1962 war",
    "https://www.mea.gov.in/Uploads/PublicationDocs/23460_IWM_Book__11-06-2014_.pdf"
  ),
  walong: source(
    "Government of India: Battle of Walong",
    "https://bharatrannbhoomidarshan.gov.in/shaurya_gatha/details/18/walong"
  )
};

function hierarchyFix({
  parent,
  campaign,
  region,
  source: hierarchySource,
  startYear,
  endYear = startYear,
  type = "batalla",
  conflictType = "interestatal",
  scale = "regional"
}) {
  return {
    parent,
    war: parent,
    campaign,
    type,
    conflictType,
    scale,
    status: "historico",
    active: false,
    ongoing: false,
    startYear,
    endYear,
    region,
    normalizedRegion: region,
    related: [...new Set([parent, campaign].filter(Boolean))],
    hierarchyConfidence: "alta",
    hierarchySources: [hierarchySource],
    curationPriority: "alta",
    curationBatch: "source-backed-visible-hierarchy-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial"
  };
}

export const VISIBLE_MODERN_SAFE_CONFLICT_RENAMES = {
  "Batalla de Cheonpyeong Valley": "Batalla de Cheonpyeong",
  "Batalla de Coral-Balmoral": "Batalla de Coral\u2013Balmoral",
  "Guerra de Malvinas (1982)": "Guerra de las Malvinas",
  "Guerra indo-Pakist\u00e1n\u00ed de 1965": "Guerra indo-pakistan\u00ed de 1965",
  "Guerra indo-Pakist\u00e1n\u00ed de 1971": "Guerra indo-pakistan\u00ed de 1971",
  "Guerra afgano-Pakist\u00e1n\u00ed de 2026": "Guerra afgano-pakistan\u00ed de 2026"
};

const KOREAN_WAR = "Guerra de Corea";
const KOREAN_CAMPAIGN = "Campana de Corea";
const VIETNAM_WAR = "Guerra de Vietnam";
const GULF_WAR = "Guerra del Golfo";
const PACIFIC_WAR = "Guerra del Pac\u00edfico";
const AFGHANISTAN_WAR = "Guerra de Afganist\u00e1n";

export const VISIBLE_MODERN_CONFLICT_DETAIL_FIXES = {
  "Batalla de Ad-Dawrah": hierarchyFix({
    parent: GULF_WAR,
    campaign: "Operacion Tormenta del Desierto",
    region: "Golfo Persico",
    source: SOURCES.gulfWar,
    startYear: 1991,
    type: "batalla naval",
    scale: "internacional"
  }),
  "Batalla de Cheonpyeong": hierarchyFix({
    parent: KOREAN_WAR,
    campaign: "Perimetro de Pusan",
    region: "Peninsula coreana",
    source: SOURCES.koreaPhase1,
    startYear: 1950,
    scale: "internacional"
  }),
  "Batalla de White Horse": hierarchyFix({
    parent: KOREAN_WAR,
    campaign: KOREAN_CAMPAIGN,
    region: "Peninsula coreana",
    source: SOURCES.koreaWhiteHorse,
    startYear: 1952,
    scale: "internacional"
  }),
  "Batalla de Gang Toi": hierarchyFix({
    parent: VIETNAM_WAR,
    campaign: "Operacion Hump",
    region: "Vietnam del Sur",
    source: SOURCES.vietnamGangToi,
    startYear: 1965,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla de Long Tan": hierarchyFix({
    parent: VIETNAM_WAR,
    campaign: "Operacion Smithfield",
    region: "Vietnam del Sur",
    source: SOURCES.vietnamLongTan,
    startYear: 1966,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla de Coral\u2013Balmoral": hierarchyFix({
    parent: VIETNAM_WAR,
    campaign: "Ofensiva del Tet de 1968",
    region: "Vietnam del Sur",
    source: SOURCES.vietnamCoral,
    startYear: 1968,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla de Bubiyan": hierarchyFix({
    parent: GULF_WAR,
    campaign: "Operacion Tormenta del Desierto",
    region: "Golfo Persico",
    source: SOURCES.gulfWar,
    startYear: 1991,
    type: "batalla naval",
    scale: "internacional"
  }),
  "Batalla de Joybar": hierarchyFix({
    parent: AFGHANISTAN_WAR,
    campaign: "Operaciones en Kapisa",
    region: "Kapisa, Afganistan",
    source: SOURCES.joybar,
    startYear: 2011,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla de Alasay": hierarchyFix({
    parent: AFGHANISTAN_WAR,
    campaign: "Operaciones en Kapisa",
    region: "Kapisa, Afganistan",
    source: SOURCES.alasay,
    startYear: 2009,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Combate de Buenavista": hierarchyFix({
    parent: PACIFIC_WAR,
    campaign: "Campana de Tacna y Arica",
    region: "Tacna, Peru",
    source: SOURCES.buenavista,
    startYear: 1880,
    type: "combate"
  }),
  "Combate de El Manzano": hierarchyFix({
    parent: PACIFIC_WAR,
    campaign: "Campana de Lima",
    region: "Lurin, Peru",
    source: SOURCES.elManzano,
    startYear: 1880,
    type: "combate"
  }),
  "Combate de R\u00edo Grande": hierarchyFix({
    parent: PACIFIC_WAR,
    campaign: "Campana terrestre de 1879",
    region: "Frontera entre Bolivia y Chile",
    source: SOURCES.pacificWar,
    startYear: 1879,
    type: "combate"
  }),
  "Combate naval de Iquique": hierarchyFix({
    parent: PACIFIC_WAR,
    campaign: "Campana naval de la Guerra del Pacifico",
    region: "Iquique, Oceano Pacifico",
    source: SOURCES.pacificWar,
    startYear: 1879,
    type: "combate naval"
  }),
  "Segundo combate naval de Iquique": hierarchyFix({
    parent: PACIFIC_WAR,
    campaign: "Campana naval de la Guerra del Pacifico",
    region: "Iquique, Oceano Pacifico",
    source: SOURCES.pacificWar,
    startYear: 1879,
    type: "combate naval"
  }),
  "Combate naval de Arica": hierarchyFix({
    parent: PACIFIC_WAR,
    campaign: "Campana naval de la Guerra del Pacifico",
    region: "Arica, Oceano Pacifico",
    source: SOURCES.pacificWar,
    startYear: 1880,
    type: "combate naval"
  }),
  "Ofensiva de primavera de 1945 en Italia": hierarchyFix({
    parent: "Segunda Guerra Mundial",
    campaign: "Campana de Italia",
    region: "Norte de Italia",
    source: SOURCES.italy1945,
    startYear: 1945,
    type: "ofensiva",
    scale: "mundial"
  }),
  "Batalla de Chongju": hierarchyFix({
    parent: KOREAN_WAR,
    campaign: "Ofensiva de la ONU en Corea del Norte",
    region: "Peninsula coreana",
    source: SOURCES.koreaAustralia,
    startYear: 1950,
    scale: "internacional"
  }),
  "Batalla de Kujin": hierarchyFix({
    parent: KOREAN_WAR,
    campaign: "Ofensiva de la ONU en Corea del Norte",
    region: "Peninsula coreana",
    source: SOURCES.koreaAustralia,
    startYear: 1950,
    scale: "internacional"
  }),
  "Batalla de Yongju": hierarchyFix({
    parent: KOREAN_WAR,
    campaign: "Ofensiva de la ONU en Corea del Norte",
    region: "Peninsula coreana",
    source: SOURCES.koreaAustralia,
    startYear: 1950,
    scale: "internacional"
  }),
  "Batalla de Chuam-ni": hierarchyFix({
    parent: KOREAN_WAR,
    campaign: KOREAN_CAMPAIGN,
    region: "Peninsula coreana",
    source: SOURCES.koreaAustralia,
    startYear: 1951,
    scale: "internacional"
  }),
  "Batalla de Maehwa-san": hierarchyFix({
    parent: KOREAN_WAR,
    campaign: KOREAN_CAMPAIGN,
    region: "Peninsula coreana",
    source: SOURCES.koreaAustralia,
    startYear: 1951,
    scale: "internacional"
  }),
  "Ofensiva china de primavera": hierarchyFix({
    parent: KOREAN_WAR,
    campaign: "Ofensiva china de primavera de 1951",
    region: "Peninsula coreana",
    source: SOURCES.koreaAustralia,
    startYear: 1951,
    type: "ofensiva",
    scale: "internacional"
  }),
  "Batalla de Hook": hierarchyFix({
    parent: KOREAN_WAR,
    campaign: KOREAN_CAMPAIGN,
    region: "Peninsula coreana",
    source: SOURCES.koreaAustralia,
    startYear: 1953,
    scale: "internacional"
  }),
  "Batalla de Burullus": hierarchyFix({
    parent: "Guerra del Sina\u00ed",
    campaign: "Crisis de Suez",
    region: "Mediterraneo oriental",
    source: SOURCES.suez,
    startYear: 1956,
    type: "batalla naval",
    scale: "internacional"
  }),
  "Batalla de Gurung Hill": hierarchyFix({
    parent: "Guerra sino-india",
    campaign: "Frente occidental de la guerra sino-india",
    region: "Ladakh",
    source: SOURCES.sinoIndianWar,
    startYear: 1962,
    scale: "internacional"
  }),
  "Batalla de Rezang La": hierarchyFix({
    parent: "Guerra sino-india",
    campaign: "Frente occidental de la guerra sino-india",
    region: "Ladakh",
    source: SOURCES.sinoIndianWar,
    startYear: 1962,
    scale: "internacional"
  }),
  "Batalla de Walong": hierarchyFix({
    parent: "Guerra sino-india",
    campaign: "Frente oriental de la guerra sino-india",
    region: "Arunachal Pradesh",
    source: SOURCES.walong,
    startYear: 1962,
    scale: "internacional"
  })
};
