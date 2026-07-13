function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  korea1950: source(
    "Centro de Historia Militar del Ejercito de EE. UU.: guerra de Corea en 1950",
    "https://history.army.mil/portals/143/Images/Publications/catalog/19-1.pdf"
  ),
  koreaOffensive: source(
    "Centro de Historia Militar del Ejercito de EE. UU.: ofensiva de la ONU en Corea",
    "https://history.army.mil/portals/143/Images/Publications/catalog/19-7.pdf"
  ),
  korea1951: source(
    "Centro de Historia Militar del Ejercito de EE. UU.: Corea, 1951-1953",
    "https://history.army.mil/portals/143/Images/Publications/catalog/21-2.pdf"
  ),
  koreaCampaigns: source(
    "Centro de Historia Militar del Ejercito de EE. UU.: campanas de la guerra de Corea",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Korean-War/"
  ),
  hook: source(
    "National Army Museum: la guerra de Corea y The Hook",
    "https://www.nam.ac.uk/explore/korean-war"
  ),
  marker233: source(
    "Patrimonio militar de Túnez: batalla de la borne 233",
    "https://hmp.defense.tn/fr/les-batailles-d-evacuation/"
  ),
  fakashan: source(
    "The Washington Post: enfrentamiento fronterizo de Fakashan en 1981",
    "https://www.washingtonpost.com/archive/national/1981/05/17/china-vietnam-clash-at-border/d5722600-3c73-4c18-89d5-1ac1c6bcfd60/",
    "media"
  ),
  kisangani: source(
    "Naciones Unidas: informe de mapeo sobre la Republica Democratica del Congo",
    "https://digitallibrary.un.org/nanna/record/709895/files/DRC_MAPPING_REPORT_FINAL_EN.pdf?registerDownload=1&version=1&withMetadata=0&withWatermark=0"
  ),
  rasKamboni: source(
    "Naciones Unidas: informe del Secretario General sobre Somalia de 2007",
    "https://digitallibrary.un.org/record/599858/files/S_2007_259-EN.pdf"
  ),
  basra: source(
    "Centro de Historia Militar del Ejercito de EE. UU.: The Surge, 2006-2008",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/S%20PDF/cmhPub_078-1.pdf?ver=42q-oDd7pU_UuTwpwf29bQ%3D%3D"
  ),
  georgia: source(
    "Mision internacional independiente: conflicto de Georgia de agosto de 2008",
    "https://echr.coe.int/Documents/hudoc_38263_08_Annexes_eng.pdf"
  ),
  dahaneh: source(
    "Departamento de Defensa de EE. UU.: Operacion Eastern Resolve II en Dahaneh",
    "https://www.dvidshub.net/news/37420/operation-aims-secure-southern-afghanistan-elections"
  ),
  khazOruzgan: source(
    "Australian War Memorial: batalla de Khaz Oruzgan",
    "https://www.awm.gov.au/visit/exhibitions/against-all-odds/troy-simmonds"
  ),
  douz: source(
    "Gobierno del Reino Unido: inseguridad en la frontera entre Tunez y Libia",
    "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/268793/SAS-WP17-Tunisia-On-the-Edge.pdf"
  ),
  fallujah: source(
    "Naciones Unidas: informe de 2016 sobre la operacion de Faluya",
    "https://digitallibrary.un.org/record/833436/files/S_2016_592-EN.pdf"
  ),
  sanaa: source(
    "Naciones Unidas: escalada de los combates en Sana en diciembre de 2017",
    "https://www.un.org/sg/en/content/sg/notes-correspondents/2017-12-02/statement-attributable-the-un-special-envoy-for-yemen-ismail-ould-cheikh-ahmed"
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
    hierarchyConfidence: hierarchySource.confidence || "alta",
    hierarchySources: [{ label: hierarchySource.label, url: hierarchySource.url }],
    curationPriority: "alta",
    curationBatch: "source-backed-korea-modern-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial"
  };
}

const KOREAN_WAR = "Guerra de Corea";
const KOREAN_REGION = "Península coreana";

function koreanFix(campaign, hierarchySource, startYear, region = KOREAN_REGION) {
  return hierarchyFix({
    parent: KOREAN_WAR,
    campaign,
    region,
    source: hierarchySource,
    startYear,
    scale: "internacional"
  });
}

const KOREAN_CONFLICT_ROWS = [
  ["Batalla de Chochiwon", "Acciones dilatorias de la ONU", SOURCES.korea1950, 1950],
  ["Batalla de Chonan", "Acciones dilatorias de la ONU", SOURCES.korea1950, 1950],
  ["Batalla de Hwanggan", "Acciones dilatorias de la ONU", SOURCES.korea1950, 1950],
  ["Batalla de Sangju", "Acciones dilatorias de la ONU", SOURCES.korea1950, 1950],
  ["Batalla de Taejon", "Acciones dilatorias de la ONU", SOURCES.korea1950, 1950],
  ["Batalla de Yongdong", "Acciones dilatorias de la ONU", SOURCES.korea1950, 1950],
  ["Batalla de Battle Mountain", "Perímetro de Pusan", SOURCES.korea1950, 1950],
  ["Batalla de Bowling Alley", "Perímetro de Pusan", SOURCES.korea1950, 1950],
  ["Batalla de Haman", "Perímetro de Pusan", SOURCES.korea1950, 1950],
  ["Batalla de Ka-san", "Perímetro de Pusan", SOURCES.korea1950, 1950],
  ["Batalla de Kyongju", "Perímetro de Pusan", SOURCES.korea1950, 1950],
  ["Batalla de Masan", "Perímetro de Pusan", SOURCES.korea1950, 1950],
  ["Batalla del río Nam", "Perímetro de Pusan", SOURCES.korea1950, 1950],
  ["Batalla de P'ohang-dong", "Perímetro de Pusan", SOURCES.korea1950, 1950],
  ["Batalla de Tabu-dong", "Perímetro de Pusan", SOURCES.korea1950, 1950],
  ["Batalla de Taegu", "Perímetro de Pusan", SOURCES.korea1950, 1950],
  ["Batalla de Yongsan", "Perímetro de Pusan", SOURCES.korea1950, 1950],
  ["Segunda batalla de Seúl", "Campaña de Incheon-Seúl", SOURCES.koreaOffensive, 1950, "Seúl, Corea del Sur"],
  ["Batalla de Unsan", "Intervención china en Corea", SOURCES.koreaOffensive, 1950],
  ["Batalla de Uijeongbu (1951)", "Tercera ofensiva china", SOURCES.korea1951, 1951, "Uijeongbu, Corea del Sur"],
  ["Batalla de Hoengsong", "Contraofensiva china de febrero de 1951", SOURCES.korea1951, 1951],
  ["Batalla de Chipyong-ni", "Contraofensiva china de febrero de 1951", SOURCES.korea1951, 1951],
  ["Batalla de la colina Eerie", "Frente estabilizado de Corea en 1952", SOURCES.koreaCampaigns, 1952, "Chorwon, península coreana"],
  ["Segunda batalla de The Hook", "Frente del río Imjin en 1952", SOURCES.hook, 1952, "Río Imjin, península coreana"]
];

const KOREAN_CONFLICT_DETAIL_FIXES = Object.fromEntries(
  KOREAN_CONFLICT_ROWS.map(([name, campaign, hierarchySource, year, region]) => [
    name,
    koreanFix(campaign, hierarchySource, year, region)
  ])
);

export const KOREA_MODERN_SAFE_CONFLICT_RENAMES = {
  "Batalla de la cota 233": "Batalla de la borne 233",
  "Batalla de Nam River": "Batalla del río Nam",
  "Batalla de Hill Eerie": "Batalla de la colina Eerie",
  "Segunda Batalla de Seúl": "Segunda batalla de Seúl",
  "Segunda batalla de Hook": "Segunda batalla de The Hook",
  "Batalla de Kisangani": "Batalla de Kisangani de 1997",
  "Batalla del desfiladero de Liakhvi": "Combates del desfiladero de Liakhvi",
  "Batalla de Douz": "Escaramuza de Douz de 2011",
  "Batalla de Faluya": "Batalla de Faluya de 2016",
  "Batalla de Saná": "Batalla de Saná de 2017"
};

export const KOREA_MODERN_CONFLICT_DETAIL_FIXES = {
  ...KOREAN_CONFLICT_DETAIL_FIXES,
  "Batalla de la borne 233": hierarchyFix({
    parent: "Crisis de Bizerta de 1961",
    campaign: "Batallas de la evacuación francesa de Túnez",
    region: "Garet al Hamel, frontera sahariana de Túnez",
    source: SOURCES.marker233,
    startYear: 1961,
    conflictType: "colonial"
  }),
  "Batalla de Fakashan": hierarchyFix({
    parent: "Conflictos fronterizos sino-vietnamitas (1979-1991)",
    campaign: "Enfrentamientos fronterizos de mayo de 1981",
    region: "Fakashan, frontera entre China y Vietnam",
    source: SOURCES.fakashan,
    startYear: 1981,
    conflictType: "frontera"
  }),
  "Batalla de Kisangani de 1997": hierarchyFix({
    parent: "Primera Guerra del Congo",
    campaign: "Ofensiva de la AFDL hacia Kisangani",
    region: "Kisangani, República Democrática del Congo",
    source: SOURCES.kisangani,
    startYear: 1997,
    conflictType: "civil",
    scale: "internacional"
  }),
  "Batalla de Ras Kamboni": hierarchyFix({
    parent: "Guerra civil somalí (2006-2009)",
    campaign: "Ofensiva etíope y del Gobierno Federal de Transición",
    region: "Ras Kamboni, Somalia",
    source: SOURCES.rasKamboni,
    startYear: 2007,
    conflictType: "civil",
    scale: "internacional"
  }),
  "Batalla de Basra": hierarchyFix({
    parent: "Guerra de Irak",
    campaign: "Operación Carga de los Caballeros",
    region: "Basora, Irak",
    source: SOURCES.basra,
    startYear: 2008,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Combates del desfiladero de Liakhvi": hierarchyFix({
    parent: "Guerra ruso-georgiana de 2008",
    campaign: "Ofensiva de Osetia del Sur",
    region: "Valle del Liakhvi, Georgia",
    source: SOURCES.georgia,
    startYear: 2008,
    type: "serie de combates",
    scale: "internacional"
  }),
  "Batalla de Dahaneh": hierarchyFix({
    parent: "Guerra de Afganistán",
    campaign: "Operación Eastern Resolve II",
    region: "Helmand, Afganistán",
    source: SOURCES.dahaneh,
    startYear: 2009,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla de Khaz Oruzgan": hierarchyFix({
    parent: "Guerra de Afganistán",
    campaign: "Campaña de Uruzgan",
    region: "Uruzgan, Afganistán",
    source: SOURCES.khazOruzgan,
    startYear: 2008,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Escaramuza de Douz de 2011": hierarchyFix({
    parent: "Primera guerra civil libia",
    campaign: "Incidentes fronterizos entre Libia y Túnez de 2011",
    region: "Douz, Túnez",
    source: SOURCES.douz,
    startYear: 2011,
    type: "escaramuza",
    conflictType: "civil"
  }),
  "Batalla de Faluya de 2016": hierarchyFix({
    parent: "Guerra contra el Estado Islámico",
    campaign: "Ofensiva de Faluya de 2016",
    region: "Faluya, Irak",
    source: SOURCES.fallujah,
    startYear: 2016,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla de Saná de 2017": hierarchyFix({
    parent: "Guerra civil yemení",
    campaign: "Enfrentamientos de Saná de diciembre de 2017",
    region: "Saná, Yemen",
    source: SOURCES.sanaa,
    startYear: 2017,
    conflictType: "civil"
  })
};
