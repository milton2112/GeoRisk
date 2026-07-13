function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  ivangorod: source(
    "Gran Enciclopedia Rusa: Ivángorod y la guerra ruso-sueca de 1495-1497",
    "https://bigenc.ru/c/ivangorod-322e21"
  ),
  leHavre: source(
    "Archivos municipales de Le Havre: bombardeo de 1759",
    "https://archives.lehavre.fr/document-archives/dessins/vue-du-bombardement-de-la-ville-du-havre"
  ),
  atlantic1796: source(
    "Síntesis historiográfica: incursión atlántica de junio de 1796",
    "https://en.wikipedia.org/wiki/Atlantic_raid_of_June_1796",
    "media"
  ),
  boulogne: source(
    "Royal Museums Greenwich: ataque sobre Boulogne de octubre de 1804",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-157586"
  ),
  junonFox: source(
    "Museo del Louvre: combate de la Junon contra la Fox del 14 de septiembre de 1778",
    "https://collections.louvre.fr/ark:/53355/cl020527368"
  ),
  valparaiso1814: source(
    "Naval History and Heritage Command: USS Essex frente a Valparaíso en 1814",
    "https://www.history.navy.mil/our-collections/art/exhibits/conflicts-and-operations/the-war-of-1812/uss-essex-vs-hms-phoebe-and-hms-cherub.html"
  ),
  alexandria1814: source(
    "National Park Service: incursión sobre Alexandria durante la guerra de 1812",
    "https://www.nps.gov/pohe/learn/historyculture/the-war-of-1812.htm"
  ),
  caboManglares: source(
    "Síntesis documentada: combate naval de Cabo Manglares",
    "https://es.wikipedia.org/wiki/Combate_naval_de_Cabo_Manglares",
    "media"
  ),
  heartland: source(
    "National Park Service: Confederate Heartland Offensive de 1862",
    "https://www.nps.gov/civilwar/search-battles-detail.htm?battleCode=ky007"
  ),
  csaszarko: source(
    "Historia del levantamiento de Hungría Occidental: combate de Császárkőbánya",
    "https://mtda.hu/books/hejjas_jeno_a_nyugatmagyarorszagi_felkeles.pdf",
    "media"
  ),
  oum1956: source(
    "Síntesis historiográfica: ataque de Oum El Achar de 1956",
    "https://fr.wikipedia.org/wiki/Attaque_d%27Oum_El_Achar_%281956%29",
    "media"
  ),
  oum1957: source(
    "Ministerio de Defensa de Francia: defensa del puesto de Oum El Achar en 1957",
    "https://imagesdefense.gouv.fr/fr/tindouf-andre-morice-felicite-des-aviateurs.html"
  ),
  vietnamCampaigns: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campañas de la guerra de Vietnam",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Vietnam/"
  ),
  iaDrang: source(
    "Centro de Historia Militar del Ejército de EE. UU.: Seven Firefights in Vietnam",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/S%20PDF/cmhPub_70-4.pdf?ver=PWfa_8KK3PMSSwmWm5ImjA%3D%3D"
  ),
  northern1968: source(
    "Centro de Historia Militar del Ejército de EE. UU.: The War in the Northern Provinces, 1966-1968",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/W%20PDF/CMH_Pub_90-24.pdf?ver=Drek0wK3LJr2tSicb0g39A%3D%3D"
  ),
  lima85: source(
    "Central Intelligence Agency: caída de Lima Site 85 en marzo de 1968",
    "https://www.cia.gov/resources/csi/studies-in-intelligence/volume-59-no-1/the-war-in-laos-the-fall-of-lima-site-85-in-march-1968/"
  ),
  drawdown: source(
    "Centro de Historia Militar del Ejército de EE. UU.: The Drawdown, 1970-1971",
    "https://history.army.mil/Publications/Publications-Catalog/The-Drawdown/"
  ),
  lastBattles: source(
    "Centro de Historia Militar del Ejército de EE. UU.: Last Battles, 1972-1975",
    "https://history.army.mil/Publications/Publications-Catalog/Last-Battles/"
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
    curationBatch: "source-backed-historical-vietnam-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial"
  };
}

function vietnamFix({ campaign, region, startYear, endYear = startYear, source: hierarchySource = SOURCES.vietnamCampaigns }) {
  return hierarchyFix({
    parent: "Guerra de Vietnam",
    campaign,
    region,
    source: hierarchySource,
    startYear,
    endYear,
    conflictType: "insurgencia",
    scale: "internacional"
  });
}

export const HISTORICAL_VIETNAM_SAFE_CONFLICT_RENAMES = {
  "Incursion sobre Le Havre": "Incursión sobre Le Havre",
  "Atlantic incursion de junio 1796": "Incursión atlántica de junio de 1796",
  "Incursion sobre Boulogne": "Incursión sobre Boulogne",
  "Combate de la Junon contra el Fox": "Combate naval de la Junon contra la Fox (1778)",
  "Incursion sobre Alejandria": "Incursión sobre Alejandría (Virginia)",
  "Ofensiva confederada Heartland": "Ofensiva confederada del Heartland",
  "Batalla de Császárkőbanya": "Batalla de Császárkőbánya",
  "Batalla de Oum El Achar (1956)": "Ataque de Oum El Achar (1956)",
  "Batalla de Oum El Achar (1957)": "Combate de Oum El Achar (1957)",
  "Batalla de Hill 488": "Batalla de la colina 488",
  "Batalla de Hill 881": "Batallas de las colinas 881",
  "Batalla de Fire Support Base Ripcord": "Batalla de la base Ripcord",
  "Batalla de la Colina de la Hamburguesa": "Batalla de la colina de la Hamburguesa"
};

const HISTORICAL_FIXES = {
  "Asalto de Ivángorod": hierarchyFix({
    parent: "Guerra ruso-sueca de 1495-1497",
    campaign: "Campaña sueca de 1496",
    region: "Ivángorod, frontera entre Moscovia y Livonia",
    source: SOURCES.ivangorod,
    startYear: 1496,
    type: "asalto",
    conflictType: "frontera"
  }),
  "Incursión sobre Le Havre": hierarchyFix({
    parent: "Guerra de los Siete Años",
    campaign: "Operaciones navales contra los preparativos franceses de invasión",
    region: "Le Havre, Francia",
    source: SOURCES.leHavre,
    startYear: 1759,
    type: "bombardeo naval",
    scale: "internacional"
  }),
  "Incursión atlántica de junio de 1796": hierarchyFix({
    parent: "Guerras revolucionarias francesas",
    campaign: "Incursión atlántica de junio de 1796",
    region: "Accesos occidentales del Atlántico nororiental",
    source: SOURCES.atlantic1796,
    startYear: 1796,
    type: "campaña naval",
    scale: "internacional"
  }),
  "Incursión sobre Boulogne": hierarchyFix({
    parent: "Guerras napoleónicas",
    campaign: "Operaciones contra la flotilla de Boulogne",
    region: "Boulogne-sur-Mer, Francia",
    source: SOURCES.boulogne,
    startYear: 1804,
    type: "incursión naval",
    scale: "internacional"
  }),
  "Combate naval de la Junon contra la Fox (1778)": hierarchyFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Guerra naval anglo-francesa de 1778",
    region: "Atlántico frente a Brest, Francia",
    source: SOURCES.junonFox,
    startYear: 1778,
    type: "combate naval",
    scale: "internacional"
  }),
  "Combate naval de Valparaíso (1814)": hierarchyFix({
    parent: "Guerra anglo-estadounidense de 1812",
    campaign: "Campaña del USS Essex en el Pacífico",
    region: "Valparaíso, Chile",
    source: SOURCES.valparaiso1814,
    startYear: 1814,
    type: "combate naval",
    scale: "internacional"
  }),
  "Incursión sobre Alejandría (Virginia)": hierarchyFix({
    parent: "Guerra anglo-estadounidense de 1812",
    campaign: "Campaña de Chesapeake",
    region: "Alexandria, Virginia, Estados Unidos",
    source: SOURCES.alexandria1814,
    startYear: 1814,
    type: "incursión",
    scale: "internacional"
  }),
  "Combate naval de Cabo Manglares": hierarchyFix({
    parent: "Guerras de independencia hispanoamericanas",
    campaign: "Campaña naval de la independencia en el Pacífico",
    region: "Cabo Manglares y Punta Galera, costa del Pacífico",
    source: SOURCES.caboManglares,
    startYear: 1820,
    type: "combate naval",
    conflictType: "independencia"
  }),
  "Ofensiva confederada del Heartland": hierarchyFix({
    parent: "Guerra de Secesión estadounidense",
    campaign: "Campaña de Kentucky de 1862",
    region: "Kentucky, Estados Unidos",
    source: SOURCES.heartland,
    startYear: 1862,
    type: "ofensiva",
    conflictType: "civil"
  }),
  "Batalla de Császárkőbánya": hierarchyFix({
    parent: "Levantamiento de Hungría Occidental de 1921",
    campaign: "Combates por Burgenland",
    region: "Kaisersteinbruch, Burgenland",
    source: SOURCES.csaszarko,
    startYear: 1921,
    conflictType: "frontera"
  }),
  "Ataque de Oum El Achar (1956)": hierarchyFix({
    parent: "Conflictos franco-marroquíes del Sahara (1956-1957)",
    campaign: "Operaciones del Ejército de Liberación marroquí en Tinduf",
    region: "Oum El Achar, región de Tinduf, Argelia francesa",
    source: SOURCES.oum1956,
    startYear: 1956,
    type: "ataque",
    conflictType: "colonial"
  }),
  "Combate de Oum El Achar (1957)": hierarchyFix({
    parent: "Conflictos franco-marroquíes del Sahara (1956-1957)",
    campaign: "Operaciones del Ejército de Liberación marroquí en Tinduf",
    region: "Oum El Achar, región de Tinduf, Argelia francesa",
    source: SOURCES.oum1957,
    startYear: 1957,
    type: "combate",
    conflictType: "colonial"
  })
};

const VIETNAM_ROWS = [
  ["Batalla de An Lao", "Fase de asesoramiento (1962-1965)", "An Lão, Bình Định, Vietnam del Sur", 1964],
  ["Batalla de Binh Gia", "Fase de asesoramiento (1962-1965)", "Bình Giã, Phước Tuy, Vietnam del Sur", 1964, 1965],
  ["Batalla de Nam Dong", "Fase de asesoramiento (1962-1965)", "Nam Đông, Thừa Thiên, Vietnam del Sur", 1964],
  ["Batalla de Ba Gia", "Campaña de defensa de 1965", "Ba Gia, Quảng Ngãi, Vietnam del Sur", 1965],
  ["Batalla de Dong Xoai", "Campaña de defensa de 1965", "Đồng Xoài, Phước Long, Vietnam del Sur", 1965],
  ["Batalla de Song Be", "Campaña de defensa de 1965", "Sông Bé, Phước Long, Vietnam del Sur", 1965],
  ["Batalla del valle de Ia Drang", "Campaña de defensa de 1965", "Valle de Ia Drang, Tierras Altas Centrales", 1965, 1965, SOURCES.iaDrang],
  ["Batalla de A Shau", "Contraofensiva de 1965-1966", "Valle de A Shau, Thừa Thiên, Vietnam del Sur", 1966],
  ["Batalla de Bong Son", "Operación Masher-White Wing", "Bồng Sơn, Bình Định, Vietnam del Sur", 1966],
  ["Batalla de la colina 488", "Operación Kansas", "Colina 488, Quảng Tín, Vietnam del Sur", 1966],
  ["Batalla de Suoi Bong Trang", "Operación Rolling Stone", "Suối Bông Trang, Bình Dương, Vietnam del Sur", 1966],
  ["Batalla de Xa Cam My", "Operación Abilene", "Xã Cam Mỹ, Phước Tuy, Vietnam del Sur", 1966],
  ["Batalla de Ap Bau Bang II", "Contraofensiva, fase II", "Ấp Bàu Bàng, Bình Dương, Vietnam del Sur", 1967],
  ["Batalla de Dak To", "Contraofensiva, fase III", "Đắk Tô, Kon Tum, Vietnam del Sur", 1967],
  ["Batallas de las colinas 881", "Campaña de Khe Sanh", "Colinas 881, Quảng Trị, Vietnam del Sur", 1967],
  ["Batalla de Tra Vinh Dong", "Contraofensiva, fase II", "Trà Bình, Quảng Ngãi, Vietnam del Sur", 1967],
  ["Primera batalla de Loc Ninh", "Contraofensiva, fase III", "Lộc Ninh, Bình Long, Vietnam del Sur", 1967],
  ["Batalla de Duc Lap", "Contraofensiva, fase V", "Đức Lập, Quảng Đức, Vietnam del Sur", 1968],
  ["Batalla de Hat Dich", "Contraofensiva, fase VI", "Hắc Dịch, Phước Tuy, Vietnam del Sur", 1968, 1969],
  ["Batalla de Huế", "Ofensiva del Tet de 1968", "Huế, Thừa Thiên, Vietnam del Sur", 1968, 1968, SOURCES.northern1968],
  ["Batalla de Kham Duc", "Contraofensiva, fase IV", "Khâm Đức, Quảng Tín, Vietnam del Sur", 1968],
  ["Batalla de Lang Vei", "Campaña de Khe Sanh", "Làng Vây, Quảng Trị, Vietnam del Sur", 1968, 1968, SOURCES.northern1968],
  ["Batalla de Quang Tri", "Ofensiva del Tet de 1968", "Quảng Trị, Vietnam del Sur", 1968, 1968, SOURCES.northern1968],
  ["Sitio de Khe Sanh", "Campaña de Khe Sanh", "Khe Sanh, Quảng Trị, Vietnam del Sur", 1968, 1968, SOURCES.northern1968],
  ["Batalla de la colina de la Hamburguesa", "Operación Apache Snow", "Valle de A Shau, Thừa Thiên, Vietnam del Sur", 1969],
  ["Batalla de la base Ripcord", "Operación Texas Star", "Base Ripcord, Thừa Thiên, Vietnam del Sur", 1970, 1970, SOURCES.drawdown],
  ["Batalla de Long Khanh", "Operación Overlord", "Long Khánh, Vietnam del Sur", 1971, 1971, SOURCES.drawdown],
  ["Batalla de An Lộc", "Ofensiva de Pascua de 1972", "An Lộc, Bình Long, Vietnam del Sur", 1972, 1972, SOURCES.lastBattles],
  ["Batalla de Kontum", "Ofensiva de Pascua de 1972", "Kon Tum, Vietnam del Sur", 1972, 1972, SOURCES.lastBattles],
  ["Batalla de Loc Ninh", "Ofensiva de Pascua de 1972", "Lộc Ninh, Bình Long, Vietnam del Sur", 1972, 1972, SOURCES.lastBattles],
  ["Segunda batalla de Quảng Trị", "Ofensiva de Pascua de 1972", "Quảng Trị, Vietnam del Sur", 1972, 1972, SOURCES.lastBattles],
  ["Batalla de Cửa Việt", "Operaciones finales previas a los Acuerdos de París", "Cửa Việt, Quảng Trị, Vietnam del Sur", 1973, 1973, SOURCES.lastBattles]
];

const VIETNAM_FIXES = Object.fromEntries(
  VIETNAM_ROWS.map(([name, campaign, region, startYear, endYear = startYear, hierarchySource = SOURCES.vietnamCampaigns]) => [
    name,
    vietnamFix({ campaign, region, startYear, endYear, source: hierarchySource })
  ])
);

export const HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES = {
  ...HISTORICAL_FIXES,
  ...VIETNAM_FIXES,
  "Batalla de Lima Site 85": hierarchyFix({
    parent: "Guerra civil de Laos",
    campaign: "Guerra secreta en Laos",
    region: "Phou Pha Thi, provincia de Houaphanh, Laos",
    source: SOURCES.lima85,
    startYear: 1968,
    conflictType: "insurgencia",
    scale: "internacional"
  })
};
