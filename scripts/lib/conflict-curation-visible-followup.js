function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  bunkerHill: source(
    "National Park Service: Battle of Bunker Hill",
    "https://home.nps.gov/articles/000/the-battle-of-bunker-hill.htm"
  ),
  brandywine: source(
    "National Park Service: Philadelphia Campaign of 1777",
    "https://www.nps.gov/articles/000/philadelphia-campaign-1777.htm"
  ),
  longIsland: source(
    "National Park Service: Battle of Brooklyn",
    "https://www.nps.gov/gois/learn/historyculture/battle-of-brooklyn.htm"
  ),
  greatNorthernWar: source(
    "Svenska Militara minnesmarken: Holowczyn 1708",
    "https://svmm.se/slaget-vid-holowzcyn-1708-vi01/"
  ),
  rajovka: source(
    "Wikipedia: Battle of Rajovka",
    "https://en.wikipedia.org/wiki/Battle_of_Rajovka",
    "media"
  ),
  tripoli: source(
    "US Naval History and Heritage Command: Barbary Wars",
    "https://www.history.navy.mil/content/history/nhhc/browse-by-topic/wars-conflicts-and-operations/barbary-wars.html"
  ),
  korea: source(
    "Australian War Memorial: Korean War operations",
    "https://www.awm.gov.au/articles/atwar/korea"
  ),
  pakchon: source(
    "Australian War Memorial: Pakchon",
    "https://www.awm.gov.au/visit/exhibitions/korea/operations/pakchon"
  ),
  gulfWar: source(
    "US Army Center of Military History: The Whirlwind War",
    "https://history.army.mil/portals/143/Images/Publications/catalog/70-30.pdf"
  ),
  afghanistanArmy: source(
    "US Army Center of Military History: Modern War in an Ancient Land",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/M%20Pdf/cmhPub_59-1_volI.pdf?ver=pjV4D5ULAOAowsmgbiMJYw%3D%3D"
  ),
  afghanistanUk: source(
    "UK Government: Afghanistan timeline",
    "https://www.gov.uk/government/publications/uks-work-in-afghanistan/the-uks-work-in-afghanistan-timeline"
  ),
  garmsir: source(
    "United States Marine Corps: Garmsir operations",
    "https://www.24thmeu.marines.mil/News/Article/Article/511007/24th-meu-returns-a-safer-more-stable-garmsir-to-british-army/"
  ),
  snakeIsland: source(
    "Defence Intelligence of Ukraine: liberation of Zmiinyi Island",
    "https://gur.gov.ua/en/content/na-ostrovi-zmiinyi-vstanovleno-derzhavnyi-prapor-ukrainy"
  ),
  pryluky: source(
    "Pryluky District Administration: resistance in 2022",
    "https://pladm.cg.gov.ua/index.php?id=534942&tp=page"
  ),
  kupiansk: source(
    "President of Ukraine: liberation of Kharkiv region",
    "https://www.president.gov.ua/en/news/rosiya-povtorila-v-izyumi-te-sho-zrobila-v-buchi-svit-povine-77849/"
  ),
  basantar: source(
    "Government of India, Ministry of Defence: Battle of Basantar",
    "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1708252&lang=2&reg=48"
  ),
  mirbat: source(
    "National Army Museum: Dhofar Insurgency and Mirbat",
    "https://www.nam.ac.uk/whats-on/unknown-war-britain-and-dhofar-insurgency-1963-76"
  ),
  nicosia: source(
    "UNFICYP: Nicosia Airport and the 1974 fighting",
    "https://unficyp.unmissions.org/sites/default/files/blueberet_marchapril2014_finalweb.pdf"
  ),
  westernSahara: source(
    "US Office of the Historian: Western Sahara issue",
    "https://history.state.gov/historicaldocuments/frus1969-76ve09p1/d116"
  ),
  ugandaTanzania: source(
    "US Office of the Historian: Uganda-Tanzania War",
    "https://history.state.gov/historicaldocuments/frus1977-80v17p2/d160"
  ),
  falklands: source(
    "Imperial War Museums: Falklands Conflict on land",
    "https://www.iwm.org.uk/history/cold-war/falklands-conflict/falklands-conflict-on-land"
  ),
  mogadishu: source(
    "United Nations: UNOSOM II background",
    "https://peacekeeping.un.org/sites/default/files/past/unosom2backgr2.html"
  ),
  galwan: source(
    "Government of India, Ministry of Defence: Galwan Valley clash",
    "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1632967&lang=2&reg=48"
  ),
  shusha: source(
    "Presidencia de Azerbaiy\u00e1n: Shusha, 8 de noviembre de 2020",
    "https://president.az/en/articles/view/45756"
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
    curationBatch: "source-backed-visible-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial"
  };
}

export const VISIBLE_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Galwan": "Combate del valle de Galwan de 2020",
  "Combate en el valle del Galwan de 2020": "Combate del valle de Galwan de 2020",
  "Batalla de Samichon River": "Batalla del r\u00edo Samichon",
  "Batalla del puerto de Tripoli": "Primera batalla del puerto de Tr\u00edpoli"
};

const US_REVOLUTION = "Guerra de Independencia de Estados Unidos";
const GREAT_NORTHERN_WAR = "Gran Guerra del Norte";
const TRIPOLI_WAR = "Guerra de Tr\u00edpoli";
const KOREAN_WAR = "Guerra de Corea";
const GULF_WAR = "Guerra del Golfo";
const AFGHANISTAN_WAR = "Guerra de Afganist\u00e1n";
const RUSSIAN_INVASION = "Invasi\u00f3n rusa de Ucrania de 2022";
const WESTERN_SAHARA_WAR = "Guerra del S\u00e1hara Occidental";
const UGANDA_TANZANIA_WAR = "Guerra Uganda-Tanzania";

export const VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Bunker Hill": hierarchyFix({
    parent: US_REVOLUTION,
    campaign: "Sitio de Boston",
    region: "Massachusetts, Estados Unidos",
    source: SOURCES.bunkerHill,
    startYear: 1775,
    scale: "internacional"
  }),
  "Batalla de Long Island": hierarchyFix({
    parent: US_REVOLUTION,
    campaign: "Campa\u00f1a de Nueva York y Nueva Jersey",
    region: "Nueva York, Estados Unidos",
    source: SOURCES.longIsland,
    startYear: 1776,
    scale: "internacional"
  }),
  "Batalla de Brandywine": hierarchyFix({
    parent: US_REVOLUTION,
    campaign: "Campa\u00f1a de Filadelfia",
    region: "Pensilvania, Estados Unidos",
    source: SOURCES.brandywine,
    startYear: 1777,
    scale: "internacional"
  }),
  "Batalla de Holowczyn": hierarchyFix({
    parent: GREAT_NORTHERN_WAR,
    campaign: "Campa\u00f1a sueca en Rusia",
    region: "Holowczyn, actual Bielorrusia",
    source: SOURCES.greatNorthernWar,
    startYear: 1708,
    scale: "internacional"
  }),
  "Batalla de Rajovka": hierarchyFix({
    parent: GREAT_NORTHERN_WAR,
    campaign: "Campa\u00f1a sueca en Rusia",
    region: "Raievka, actual Rusia",
    source: SOURCES.rajovka,
    startYear: 1708,
    scale: "internacional"
  }),
  "Primera batalla del puerto de Tr\u00edpoli": hierarchyFix({
    parent: TRIPOLI_WAR,
    campaign: "Campa\u00f1a naval de Tr\u00edpoli",
    region: "Puerto de Tr\u00edpoli, Mediterr\u00e1neo",
    source: SOURCES.tripoli,
    startYear: 1804,
    type: "batalla naval",
    scale: "internacional"
  }),
  "Batalla de Sariwon": hierarchyFix({
    parent: KOREAN_WAR,
    campaign: "Ofensiva de la ONU en Corea del Norte",
    region: "Pen\u00ednsula coreana",
    source: SOURCES.korea,
    startYear: 1950,
    scale: "internacional"
  }),
  "Batalla de Pakchon": hierarchyFix({
    parent: KOREAN_WAR,
    campaign: "Primera ofensiva china",
    region: "Pen\u00ednsula coreana",
    source: SOURCES.pakchon,
    startYear: 1950,
    scale: "internacional"
  }),
  "Batalla del r\u00edo Samichon": hierarchyFix({
    parent: KOREAN_WAR,
    campaign: "Combates finales de la Guerra de Corea",
    region: "Pen\u00ednsula coreana",
    source: SOURCES.korea,
    startYear: 1953,
    scale: "internacional"
  }),
  "Batalla de Norfolk": hierarchyFix({
    parent: GULF_WAR,
    campaign: "Operaci\u00f3n Tormenta del Desierto",
    region: "Sur de Irak",
    source: SOURCES.gulfWar,
    startYear: 1991,
    scale: "internacional"
  }),
  "Batalla de Failaka": hierarchyFix({
    parent: GULF_WAR,
    campaign: "Operaci\u00f3n Tormenta del Desierto",
    region: "Isla Failaka, Kuwait",
    source: SOURCES.gulfWar,
    startYear: 1991,
    scale: "internacional"
  }),
  "Batalla de Wadi Al-Batin": hierarchyFix({
    parent: GULF_WAR,
    campaign: "Operaci\u00f3n Tormenta del Desierto",
    region: "Frontera entre Arabia Saudita, Kuwait e Irak",
    source: SOURCES.gulfWar,
    startYear: 1991,
    scale: "internacional"
  }),
  "Batalla de Qala-i-Jangi": hierarchyFix({
    parent: AFGHANISTAN_WAR,
    campaign: "Ca\u00edda de Mazar-i-Sharif",
    region: "Balkh, Afganist\u00e1n",
    source: SOURCES.afghanistanArmy,
    startYear: 2001,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla de Tora Bora": hierarchyFix({
    parent: AFGHANISTAN_WAR,
    campaign: "Campa\u00f1a del este de Afganist\u00e1n",
    region: "Nangarhar, Afganist\u00e1n",
    source: SOURCES.afghanistanUk,
    startYear: 2001,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Sitio de Musa Qala": hierarchyFix({
    parent: AFGHANISTAN_WAR,
    campaign: "Campa\u00f1a de Helmand",
    region: "Helmand, Afganist\u00e1n",
    source: SOURCES.afghanistanUk,
    startYear: 2006,
    type: "sitio",
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla de Musa Qala": hierarchyFix({
    parent: AFGHANISTAN_WAR,
    campaign: "Campa\u00f1a de Helmand",
    region: "Helmand, Afganist\u00e1n",
    source: SOURCES.afghanistanUk,
    startYear: 2007,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla de Garmsir": hierarchyFix({
    parent: AFGHANISTAN_WAR,
    campaign: "Campa\u00f1a de Helmand",
    region: "Helmand, Afganist\u00e1n",
    source: SOURCES.garmsir,
    startYear: 2008,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla de la isla de las Serpientes": hierarchyFix({
    parent: RUSSIAN_INVASION,
    campaign: "Campa\u00f1a del mar Negro",
    region: "Isla de las Serpientes, mar Negro",
    source: SOURCES.snakeIsland,
    startYear: 2022,
    scale: "internacional"
  }),
  "Batalla de Pryluky": hierarchyFix({
    parent: RUSSIAN_INVASION,
    campaign: "Ofensiva del norte de Ucrania",
    region: "Chernihiv, Ucrania",
    source: SOURCES.pryluky,
    startYear: 2022,
    scale: "internacional"
  }),
  "Batalla de K\u00fapiansk": hierarchyFix({
    parent: RUSSIAN_INVASION,
    campaign: "Contraofensiva de J\u00e1rkov de 2022",
    region: "J\u00e1rkov, Ucrania",
    source: SOURCES.kupiansk,
    startYear: 2022,
    scale: "internacional"
  }),
  "Batalla de Basantar": hierarchyFix({
    parent: "Guerra indo-pakistan\u00ed de 1971",
    campaign: "Frente occidental de la guerra de 1971",
    region: "Shakargarh, frontera indo-pakistan\u00ed",
    source: SOURCES.basantar,
    startYear: 1971,
    scale: "internacional"
  }),
  "Batalla de Mirbat": hierarchyFix({
    parent: "Guerra de Dhofar",
    campaign: "Campa\u00f1a de Dhofar",
    region: "Dhofar, Om\u00e1n",
    source: SOURCES.mirbat,
    startYear: 1972,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla del Aeropuerto de Nicosia": hierarchyFix({
    parent: "Invasi\u00f3n turca de Chipre de 1974",
    campaign: "Operaci\u00f3n Atila",
    region: "Nicosia, Chipre",
    source: SOURCES.nicosia,
    startYear: 1974,
    scale: "internacional"
  }),
  "Batalla de Ain Ben Tili (enero de 1976)": hierarchyFix({
    parent: WESTERN_SAHARA_WAR,
    campaign: "Campa\u00f1a del S\u00e1hara Occidental",
    region: "Frontera entre Mauritania y el S\u00e1hara Occidental",
    source: SOURCES.westernSahara,
    startYear: 1976,
    conflictType: "independencia",
    scale: "regional"
  }),
  "Primera batalla de Amgala": hierarchyFix({
    parent: WESTERN_SAHARA_WAR,
    campaign: "Campa\u00f1a del S\u00e1hara Occidental",
    region: "Amgala, S\u00e1hara Occidental",
    source: SOURCES.westernSahara,
    startYear: 1976,
    conflictType: "independencia",
    scale: "regional"
  }),
  "Segunda batalla de Amgala": hierarchyFix({
    parent: WESTERN_SAHARA_WAR,
    campaign: "Campa\u00f1a del S\u00e1hara Occidental",
    region: "Amgala, S\u00e1hara Occidental",
    source: SOURCES.westernSahara,
    startYear: 1976,
    conflictType: "independencia",
    scale: "regional"
  }),
  "Batalla de Zu\u00e9rate (agosto de 1977)": hierarchyFix({
    parent: WESTERN_SAHARA_WAR,
    campaign: "Campa\u00f1a de Mauritania",
    region: "Zu\u00e9rate, Mauritania",
    source: SOURCES.westernSahara,
    startYear: 1977,
    conflictType: "independencia",
    scale: "regional"
  }),
  "Batalla de Masaka": hierarchyFix({
    parent: UGANDA_TANZANIA_WAR,
    campaign: "Campa\u00f1a del sur de Uganda",
    region: "Masaka, Uganda",
    source: SOURCES.ugandaTanzania,
    startYear: 1979,
    scale: "internacional"
  }),
  "Batalla de Lukaya": hierarchyFix({
    parent: UGANDA_TANZANIA_WAR,
    campaign: "Campa\u00f1a del sur de Uganda",
    region: "Lukaya, Uganda",
    source: SOURCES.ugandaTanzania,
    startYear: 1979,
    scale: "internacional"
  }),
  "Batalla de Pradera del Ganso": hierarchyFix({
    parent: "Guerra de las Malvinas",
    campaign: "Campa\u00f1a terrestre de las Malvinas",
    region: "Isla Soledad, Islas Malvinas",
    source: SOURCES.falklands,
    startYear: 1982,
    scale: "internacional"
  }),
  "Batalla de Mogadiscio": hierarchyFix({
    parent: "Guerra civil somal\u00ed",
    campaign: "Operaci\u00f3n Serpiente G\u00f3tica",
    region: "Mogadiscio, Somalia",
    source: SOURCES.mogadishu,
    startYear: 1993,
    conflictType: "civil",
    scale: "internacional"
  }),
  "Combate del valle de Galwan de 2020": hierarchyFix({
    parent: "Disputa fronteriza sino-india",
    campaign: "Crisis fronteriza sino-india de 2020",
    region: "Valle de Galwan, Ladakh",
    source: SOURCES.galwan,
    startYear: 2020,
    type: "combate",
    scale: "regional"
  }),
  "Batalla de Shusha (2020)": hierarchyFix({
    parent: "Segunda guerra de Nagorno-Karabaj",
    campaign: "Ofensiva de Shusha de 2020",
    region: "Shusha, Nagorno-Karabaj",
    source: SOURCES.shusha,
    startYear: 2020,
    scale: "regional"
  })
};
