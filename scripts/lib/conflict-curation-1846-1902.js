function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  mexicanArmy: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campañas de la guerra mexicano-estadounidense",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Mexican-War-Campaigns/"
  ),
  mexicanOccupation: source(
    "Centro de Historia Militar del Ejército de EE. UU.: ocupación de México, 1846-1848",
    "https://history.army.mil/Publications/Publications-Catalog/Occupation-Of-Mexico/"
  ),
  huamantla: source(
    "Centro de Historia Militar del Ejército de EE. UU.: batalla de Huamantla de 1847",
    "https://history.army.mil/Portals/143/Images/Publications/ArmyHistoryMag/pdf/20102019/AH102%28W%29.pdf"
  ),
  caminoReal: source(
    "Servicio de Parques Nacionales de EE. UU.: campaña de Nuevo México y Chihuahua",
    "https://www.nps.gov/elca/learn/historyculture/upload/ELCA-Archival-Study-12-2020.pdf"
  ),
  taos: source(
    "Servicio de Parques Nacionales de EE. UU.: revuelta de Taos de 1847",
    "https://npgallery.nps.gov/pdfhost/docs/NRHP/Text/83004157.pdf"
  ),
  mora: source(
    "Servicio de Parques Nacionales de EE. UU.: enfrentamientos de Mora de 1847",
    "https://npgallery.nps.gov/pdfhost/docs/NRHP/Text/64500437.pdf"
  ),
  laMesa: source(
    "Parques Estatales de California: campo de batalla de La Mesa",
    "https://ohp.parks.ca.gov/ListedResources/Detail/167"
  ),
  santaClara: source(
    "Parques Estatales de California: campaña de Santa Clara",
    "https://ohp.parks.ca.gov/ListedResources/Detail/260"
  ),
  natividad: source(
    "Parques Estatales de California: batalla de Natividad",
    "https://ohp.parks.ca.gov/ListedResources/Detail/651"
  ),
  dominguez: source(
    "Parques Estatales de California: batalla del Rancho Domínguez",
    "https://ohp.parks.ca.gov/?page_id=21427"
  ),
  mulege: source(
    "Gobierno de México: defensa de Mulegé de 1847",
    "https://sil.gobernacion.gob.mx/Archivos/Documentos/2008/10/asun_2476536_20081007_1223396494.pdf"
  ),
  tuxpan: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: captura de Tuxpan de 1847",
    "https://www.history.navy.mil/content/history/nhhc/research/histories/ship-histories/danfs/b/bonito-i.html"
  ),
  tuxpanSecond: source(
    "Wikipedia: segunda batalla de Tuxpan",
    "https://en.wikipedia.org/wiki/Second_Battle_of_Tuxpan",
    "media"
  ),
  tuxpanThird: source(
    "Wikipedia: tercera batalla de Tuxpan",
    "https://en.wikipedia.org/wiki/Third_Battle_of_Tuxpan",
    "media"
  ),
  warWithSpain: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campañas de la guerra con España",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/War-with-Spain/"
  ),
  manilaBay: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: batalla de la bahía de Manila",
    "https://www.history.navy.mil/research/publications/documentary-histories/united-states-navy-s/the-battle-of-manila.html"
  ),
  nipe: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: combates navales de 1898",
    "https://www.history.navy.mil/content/history/nhhc/research/publications/documentary-histories/united-states-navy-s/naval-operations-in/list-of-naval-engage.html"
  ),
  cardenas: source(
    "Wikipedia: primera batalla de Cárdenas",
    "https://en.wikipedia.org/wiki/First_Battle_of_C%C3%A1rdenas",
    "media"
  ),
  tayacoba: source(
    "Servicio de Parques Nacionales de EE. UU.: operaciones de Tayabacoa de 1898",
    "https://www.nps.gov/articles/000/busospanamwar.htm"
  ),
  philippineArmy: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campañas de la guerra filipino-estadounidense",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Philippine-Insurrection/"
  ),
  philippineTimeline: source(
    "Wikipedia: cronología de la guerra filipino-estadounidense",
    "https://en.wikipedia.org/wiki/Timeline_of_the_Philippine%E2%80%93American_War",
    "media"
  ),
  marilao: source(
    "Wikipedia: batalla del río Marilao",
    "https://en.wikipedia.org/wiki/Battle_of_Marilao_River",
    "media"
  ),
  quingua: source(
    "Wikipedia: batalla de Quingua",
    "https://en.wikipedia.org/wiki/Battle_of_Quingua",
    "media"
  ),
  santoTomas: source(
    "Wikipedia: batalla de Santo Tomás",
    "https://en.wikipedia.org/wiki/Battle_of_Santo_Tomas",
    "media"
  ),
  mindanao: source(
    "Gobierno de Cagayan de Oro: resistencia durante la guerra filipino-estadounidense",
    "https://www.cagayandeoro.gov.ph/index.php/item/303-history-of-cagayan-de-oro-city.html"
  ),
  agusan: source(
    "Comisión Histórica Nacional de Filipinas: batalla de la colina de Agusan",
    "https://philhistoricsites.nhcp.gov.ph/registry_database/labanan-sa-burol-agusan/"
  ),
  tirad: source(
    "Comisión Histórica Nacional de Filipinas: batalla del paso de Tirad",
    "https://philhistoricsites.nhcp.gov.ph/registry_database/battle-of-tirad-pass/"
  ),
  lonoy: source(
    "Oficina de Asuntos de Veteranos de Filipinas: conmemoración de la batalla de Lonoy",
    "https://pvao.gov.ph/wp-content/uploads/2022/05/PVAO-Bulletin-Vol.-15-Issue-1.pdf"
  ),
  manila1945: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de Luzón y batalla de Manila de 1945",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/T%20PDF/CMH_Pub_5-10-1.pdf?ver=RhKFECk4bTQ2YlxH6Iu6VA%3D%3D"
  )
};

const PARTICIPANTS = {
  mexican: [
    { side: "Estados Unidos", members: ["Estados Unidos"] },
    { side: "México", members: ["México"] }
  ],
  spanish: [
    { side: "Estados Unidos", members: ["Estados Unidos"] },
    { side: "España", members: ["España"] }
  ],
  philippine: [
    { side: "Primera República Filipina", members: ["Filipinas"] },
    { side: "Estados Unidos", members: ["Estados Unidos"] }
  ],
  manila1945: [
    { side: "Aliados y fuerzas filipinas", members: ["Estados Unidos", "Filipinas"] },
    { side: "Japón", members: ["Japón"] }
  ]
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
  scale = "regional",
  participants = []
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
    participants,
    hierarchyConfidence: hierarchySource.confidence || "alta",
    hierarchySources: [{ label: hierarchySource.label, url: hierarchySource.url }],
    curationPriority: "alta",
    curationBatch: "source-backed-1846-1902-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial"
  };
}

function groupFixes(rows, defaults) {
  return Object.fromEntries(rows.map(([
    name,
    campaign,
    region,
    startYear,
    type = defaults.type || "batalla"
  ]) => [name, hierarchyFix({ ...defaults, campaign, region, startYear, type })]));
}

export const TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES = {
  "Batalla de Monterey": "Batalla de Monterrey",
  "Batalla de Mora": "Primera batalla de Mora",
  "Batalla de Mulege": "Batalla de Mulegé",
  "Batalla de Tuxpan": "Primera batalla de Tuxpan",
  "Batalla de Agusan Hill": "Batalla de la colina de Agusan",
  "Batalla de Caloocan": "Primera batalla de Caloocan",
  "Batalla de Makahambus Hill": "Batalla de la colina de Makahambus",
  "Batalla de Marilao River": "Batalla del río Marilao",
  "Batalla de Zapote River": "Batalla del río Zapote"
};

export const TRANSITION_1846_1902_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": ["Batalla de Manila (1945)"]
};

const MEXICAN_WAR_FIXES = {
  ...groupFixes([
    ["Batalla de Cerro Gordo", "Campaña de Veracruz a Ciudad de México de 1847", "Cerro Gordo, Veracruz, México", 1847],
    ["Batalla de Churubusco", "Campaña de Veracruz a Ciudad de México de 1847", "Churubusco, Ciudad de México, México", 1847],
    ["Batalla de Padierna", "Campaña de Veracruz a Ciudad de México de 1847", "Padierna, Ciudad de México, México", 1847],
    ["Batalla del Molino del Rey", "Campaña de Veracruz a Ciudad de México de 1847", "Molino del Rey, Ciudad de México, México", 1847]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.mexicanArmy,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Batalla de Monterrey", "Campaña de Monterrey de 1846", "Monterrey, Nuevo León, México", 1846]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.mexicanArmy,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Batalla de Huamantla", "Operaciones de ocupación y guerrilla de 1847", "Huamantla, Tlaxcala, México", 1847]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.huamantla,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Batalla de El Brazito", "Campaña de Nuevo México y Chihuahua de 1846-1848", "El Brazito, Nuevo México, Estados Unidos", 1846],
    ["Batalla de Sacramento", "Campaña de Nuevo México y Chihuahua de 1846-1848", "Río Sacramento, Chihuahua, México", 1847]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.caminoReal,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Batalla de la Cañada", "Revuelta de Taos de 1847", "Santa Cruz de la Cañada, Nuevo México, Estados Unidos", 1847],
    ["Batalla del Paso de Embudo", "Revuelta de Taos de 1847", "Embudo, Nuevo México, Estados Unidos", 1847]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.taos,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Primera batalla de Mora", "Revuelta de Taos de 1847", "Mora, Nuevo México, Estados Unidos", 1847],
    ["Segunda batalla de Mora", "Revuelta de Taos de 1847", "Mora, Nuevo México, Estados Unidos", 1847]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.mora,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Batalla de La Mesa", "Campaña de California de 1846-1847", "Vernon, California, Estados Unidos", 1847]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.laMesa,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Batalla de Santa Clara", "Campaña de California de 1846-1847", "Santa Clara, California, Estados Unidos", 1847]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.santaClara,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Batalla de Natividad", "Campaña de California de 1846-1847", "Natividad, California, Estados Unidos", 1846]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.natividad,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Batalla del Rancho Domínguez", "Campaña de California de 1846-1847", "Rancho Domínguez, California, Estados Unidos", 1846]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.dominguez,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Batalla de Mulegé", "Campaña de Baja California de 1847", "Mulegé, Baja California Sur, México", 1847]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.mulege,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Batalla de Santa Cruz de Rosales", "Campaña de Nuevo México y Chihuahua de 1846-1848", "Santa Cruz de Rosales, Chihuahua, México", 1848]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.mexicanOccupation,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Primera batalla de Tuxpan", "Campaña naval del golfo de México de 1847", "Tuxpan, Veracruz, México", 1847, "batalla naval"]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.tuxpan,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Segunda batalla de Tuxpan", "Campaña naval del golfo de México de 1847", "Tuxpan, Veracruz, México", 1847, "batalla naval"]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.tuxpanSecond,
    participants: PARTICIPANTS.mexican
  }),
  ...groupFixes([
    ["Tercera batalla de Tuxpan", "Campaña naval del golfo de México de 1847", "Tuxpan, Veracruz, México", 1847, "batalla naval"]
  ], {
    parent: "Guerra mexicano-estadounidense",
    source: SOURCES.tuxpanThird,
    participants: PARTICIPANTS.mexican
  })
};

const SPANISH_AMERICAN_WAR_FIXES = {
  ...groupFixes([
    ["Batalla de Aguadores", "Campaña de Santiago de Cuba de 1898", "Aguadores, Santiago de Cuba, Cuba", 1898],
    ["Batalla de El Caney", "Campaña de Santiago de Cuba de 1898", "El Caney, Santiago de Cuba, Cuba", 1898],
    ["Batalla de las Colinas de San Juan", "Campaña de Santiago de Cuba de 1898", "Colinas de San Juan, Santiago de Cuba, Cuba", 1898]
  ], {
    parent: "Guerra hispano-estadounidense",
    source: SOURCES.warWithSpain,
    conflictType: "interestatal",
    scale: "internacional",
    participants: PARTICIPANTS.spanish
  }),
  ...groupFixes([
    ["Batalla de Cavite", "Campaña de Manila de 1898", "Bahía de Manila, Filipinas", 1898, "batalla naval"]
  ], {
    parent: "Guerra hispano-estadounidense",
    source: SOURCES.manilaBay,
    conflictType: "interestatal",
    scale: "internacional",
    participants: PARTICIPANTS.spanish
  }),
  ...groupFixes([
    ["Batalla de la bahía de Nipe", "Bloqueo naval de Cuba de 1898", "Bahía de Nipe, Cuba", 1898, "batalla naval"]
  ], {
    parent: "Guerra hispano-estadounidense",
    source: SOURCES.nipe,
    conflictType: "interestatal",
    scale: "internacional",
    participants: PARTICIPANTS.spanish
  }),
  ...groupFixes([
    ["Primera batalla de Cárdenas", "Bloqueo naval de Cuba de 1898", "Cárdenas, Matanzas, Cuba", 1898, "batalla naval"]
  ], {
    parent: "Guerra hispano-estadounidense",
    source: SOURCES.cardenas,
    conflictType: "interestatal",
    scale: "internacional",
    participants: PARTICIPANTS.spanish
  }),
  ...groupFixes([
    ["Batalla de Tayacoba", "Operaciones en Cuba de 1898", "Tayabacoa, Cuba", 1898]
  ], {
    parent: "Guerra hispano-estadounidense",
    source: SOURCES.tayacoba,
    conflictType: "interestatal",
    scale: "internacional",
    participants: PARTICIPANTS.spanish
  })
};

const PHILIPPINE_AMERICAN_WAR_FIXES = {
  ...groupFixes([
    ["Batalla de Manila (1899)", "Campaña de Manila de 1899", "Manila, Filipinas", 1899],
    ["Primera batalla de Caloocan", "Campaña de Malolos de 1899", "Caloocan, Filipinas", 1899],
    ["Batalla de San Fernando", "Campaña de Malolos de 1899", "San Fernando, Pampanga, Filipinas", 1899],
    ["Batalla del río Zapote", "Campaña del río Zapote de 1899", "Río Zapote, Filipinas", 1899]
  ], {
    parent: "Guerra filipino-estadounidense",
    source: SOURCES.philippineArmy,
    conflictType: "colonial",
    participants: PARTICIPANTS.philippine
  }),
  ...groupFixes([
    ["Batalla de Paete", "Campaña de Laguna de Bay de 1899", "Paete, Laguna, Filipinas", 1899],
    ["Batalla de Pagsanjan", "Campaña de Laguna de Bay de 1899", "Pagsanjan, Laguna, Filipinas", 1899]
  ], {
    parent: "Guerra filipino-estadounidense",
    source: SOURCES.philippineTimeline,
    conflictType: "colonial",
    participants: PARTICIPANTS.philippine
  }),
  ...groupFixes([
    ["Batalla del río Marilao", "Campaña de Malolos de 1899", "Marilao, Bulacán, Filipinas", 1899]
  ], {
    parent: "Guerra filipino-estadounidense",
    source: SOURCES.marilao,
    conflictType: "colonial",
    participants: PARTICIPANTS.philippine
  }),
  ...groupFixes([
    ["Batalla de Quingua", "Campaña de Malolos de 1899", "Quingua, Bulacán, Filipinas", 1899]
  ], {
    parent: "Guerra filipino-estadounidense",
    source: SOURCES.quingua,
    conflictType: "colonial",
    participants: PARTICIPANTS.philippine
  }),
  ...groupFixes([
    ["Batalla de Santo Tomás", "Campaña de Malolos de 1899", "Santo Tomás, Pampanga, Filipinas", 1899]
  ], {
    parent: "Guerra filipino-estadounidense",
    source: SOURCES.santoTomas,
    conflictType: "colonial",
    participants: PARTICIPANTS.philippine
  }),
  ...groupFixes([
    ["Batalla de Cagayan de Misamis", "Campaña del norte de Mindanao de 1900", "Cagayan de Misamis, Mindanao, Filipinas", 1900],
    ["Batalla de la colina de Makahambus", "Campaña del norte de Mindanao de 1900", "Makahambus, Mindanao, Filipinas", 1900]
  ], {
    parent: "Guerra filipino-estadounidense",
    source: SOURCES.mindanao,
    conflictType: "colonial",
    participants: PARTICIPANTS.philippine
  }),
  ...groupFixes([
    ["Batalla de la colina de Agusan", "Campaña del norte de Mindanao de 1900", "Agusan, Mindanao, Filipinas", 1900]
  ], {
    parent: "Guerra filipino-estadounidense",
    source: SOURCES.agusan,
    conflictType: "colonial",
    participants: PARTICIPANTS.philippine
  }),
  ...groupFixes([
    ["Batalla del paso de Tirad", "Campaña del norte de Luzón de 1899", "Paso de Tirad, Ilocos Sur, Filipinas", 1899]
  ], {
    parent: "Guerra filipino-estadounidense",
    source: SOURCES.tirad,
    conflictType: "colonial",
    participants: PARTICIPANTS.philippine
  }),
  ...groupFixes([
    ["Batalla de Lonoy", "Campaña de Bohol de 1901", "Lonoy, Bohol, Filipinas", 1901]
  ], {
    parent: "Guerra filipino-estadounidense",
    source: SOURCES.lonoy,
    conflictType: "colonial",
    participants: PARTICIPANTS.philippine
  })
};

const MANILA_1945_FIX = {
  "Batalla de Manila (1945)": hierarchyFix({
    parent: "Segunda Guerra Mundial",
    campaign: "Campaña de Luzón de 1945",
    region: "Manila, Filipinas",
    source: SOURCES.manila1945,
    startYear: 1945,
    conflictType: "interestatal",
    scale: "mundial",
    participants: PARTICIPANTS.manila1945
  })
};

export const TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES = {
  ...MEXICAN_WAR_FIXES,
  ...SPANISH_AMERICAN_WAR_FIXES,
  ...PHILIPPINE_AMERICAN_WAR_FIXES,
  ...MANILA_1945_FIX
};
