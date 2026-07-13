function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  armyCampaigns: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campañas de la Guerra Civil",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Civil-War/"
  ),
  bricesCrossRoads: source(
    "Servicio de Parques Nacionales de EE. UU.: Brices Cross Roads",
    "https://www.nps.gov/civilwar/search-battles-detail.htm?battleCode=ms014"
  ),
  cedarCreek: source(
    "Centro de Historia Militar del Ejército de EE. UU.: batalla de Cedar Creek",
    "https://history.army.mil/Publications/Publications-Catalog/The-Battle-of-Cedar-Creek-Self-Guided-Tour/"
  ),
  transMississippi: source(
    "Centro de Historia Militar del Ejército de EE. UU.: Guerra Civil en el teatro Trans-Misisipi",
    "https://history.army.mil/portals/143/Images/Publications/catalog/75-3.pdf"
  ),
  fredericksburgSpotsylvania: source(
    "Servicio de Parques Nacionales de EE. UU.: Fredericksburg y Spotsylvania",
    "https://www.nps.gov/frsp/index.htm"
  ),
  altamaha: source(
    "Sociedad Histórica de Georgia: defensa del puente del Altamaha",
    "https://www.georgiahistory.com/ghmi_marker_updated/the-defense-of-the-altamaha-bridge/"
  ),
  corricksFord: source(
    "Servicio de Parques Nacionales de EE. UU.: campaña de Virginia Occidental y Corrick's Ford",
    "https://www.nps.gov/civilwar/search-battles-detail.htm?battleCode=WV003"
  ),
  devilsBackbone: source(
    "Servicio de Parques Nacionales de EE. UU.: acción de Devil's Backbone",
    "https://www.nps.gov/civilwar/search-battles-person-detail.htm?personId=6910B429-CF7D-4766-AE47-194BE94C58B2"
  ),
  fortMcAllister: source(
    "Servicio de Parques Nacionales de EE. UU.: segunda batalla de Fort McAllister",
    "https://www.nps.gov/civilwar/search-battles-detail.htm?battleCode=ga028"
  ),
  georgiaBattles: source(
    "Servicio de Parques Nacionales de EE. UU.: acciones de la Guerra Civil en Georgia",
    "https://www.nps.gov/civilwar/georgia.htm"
  ),
  naval1862: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: operaciones navales de 1862",
    "https://www.history.navy.mil/browse-by-topic/wars-conflicts-and-operations/civil-war/cw-operations-and-engagements/1862-civil-war.html"
  ),
  headOfPasses: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: ataque de Head of Passes",
    "https://www.history.navy.mil/browse-by-topic/wars-conflicts-and-operations/civil-war/cw-operations-and-engagements/1862-civil-war/forts-jackson-and-stphilip.html"
  ),
  helena: source(
    "Ejército de EE. UU.: batalla de Helena y caída de Vicksburg",
    "https://www.army.mil/article/106837/july_4_1863_turning_point_in_the_civil_war"
  ),
  lexington: source(
    "Servicio de Parques Nacionales de EE. UU.: expedición de Forrest y combate de Lexington",
    "https://www.nps.gov/civilwar/search-battles-detail.htm?battleCode=tn009"
  ),
  selma: source(
    "Servicio de Parques Nacionales de EE. UU.: batalla de Selma",
    "https://www.nps.gov/civilwar/search-battles-detail.htm?battleCode=AL007"
  ),
  stCharles: source(
    "Servicio de Parques Nacionales de EE. UU.: acciones de la Guerra Civil en Arkansas",
    "https://www.nps.gov/civilwar/arkansas.htm"
  ),
  colliervilleFirst: source(
    "Municipio de Collierville: primera batalla de Collierville",
    "https://www.colliervilletn.gov/government/town-departments/morton-museum/mission/morton-museum"
  ),
  colliervilleSecond: source(
    "Municipio de Collierville: segunda batalla de Collierville",
    "https://www.colliervilletn.gov/home/showpublisheddocument/2091/637586633338130000"
  )
};

const CIVIL_WAR_PARTICIPANTS = [
  { side: "Unión", members: ["Estados Unidos"] },
  { side: "Confederación", members: ["Estados Confederados de América"] }
];

function hierarchyFix({
  campaign,
  region,
  hierarchySource,
  startYear,
  type = "batalla"
}) {
  const parent = "Guerra Civil estadounidense";
  return {
    parent,
    war: parent,
    campaign,
    type,
    conflictType: "civil",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear,
    endYear: startYear,
    region,
    normalizedRegion: region,
    related: [parent, campaign],
    participants: CIVIL_WAR_PARTICIPANTS,
    hierarchyConfidence: hierarchySource.confidence || "alta",
    hierarchySources: [{ label: hierarchySource.label, url: hierarchySource.url }],
    curationPriority: "alta",
    curationBatch: "source-backed-us-civil-war-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial"
  };
}

function groupFixes(rows, hierarchySource) {
  return Object.fromEntries(rows.map(([
    name,
    campaign,
    region,
    startYear,
    type = "batalla"
  ]) => [name, hierarchyFix({ campaign, region, startYear, type, hierarchySource })]));
}

export const US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Altamaha Bridge": "Batalla del puente del Altamaha",
  "Batalla de Columbus": "Batalla de Columbus de 1865",
  "Batalla de Fort McAllister": "Segunda batalla de Fort McAllister",
  "Batalla de Galveston Harbor": "Batalla del puerto de Galveston de 1862",
  "Batalla de Head de Passes": "Batalla de Head of Passes",
  "Batalla de Memphis": "Batalla naval de Memphis",
  "Batalla de Spotsylvania": "Batalla de Spotsylvania Court House",
  "Batalla de St. Charles": "Batalla naval de St. Charles"
};

export const US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  ...groupFixes([
    ["Batalla de Spotsylvania Court House", "Campaña de Overland de 1864", "Spotsylvania Court House, Virginia, Estados Unidos", 1864]
  ], SOURCES.fredericksburgSpotsylvania),
  ...groupFixes([
    ["Batalla de Cedar Creek", "Campaña del valle de Shenandoah de 1864", "Cedar Creek, Virginia, Estados Unidos", 1864]
  ], SOURCES.cedarCreek),
  ...groupFixes([
    ["Batalla de Brice's Cross Roads", "Operaciones contra Forrest en Misisipi de 1864", "Brice's Cross Roads, Misisipi, Estados Unidos", 1864]
  ], SOURCES.bricesCrossRoads),
  ...groupFixes([
    ["Batalla de Mansfield", "Campaña del río Rojo de 1864", "Mansfield, Luisiana, Estados Unidos", 1864],
    ["Batalla de Pleasant Hill", "Campaña del río Rojo de 1864", "Pleasant Hill, Luisiana, Estados Unidos", 1864]
  ], SOURCES.transMississippi),
  ...groupFixes([
    ["Batalla del puente del Altamaha", "Marcha de Sherman hacia el mar", "Doctortown, Georgia, Estados Unidos", 1864]
  ], SOURCES.altamaha),
  ...groupFixes([
    ["Batalla de Corrick's Ford", "Campaña de Virginia Occidental de 1861", "Corrick's Ford, Virginia Occidental, Estados Unidos", 1861]
  ], SOURCES.corricksFord),
  ...groupFixes([
    ["Batalla de Devil's Backbone", "Operaciones de Fort Smith de 1863", "Devil's Backbone, Arkansas, Estados Unidos", 1863]
  ], SOURCES.devilsBackbone),
  ...groupFixes([
    ["Segunda batalla de Fort McAllister", "Marcha de Sherman hacia el mar", "Fort McAllister, Georgia, Estados Unidos", 1864]
  ], SOURCES.fortMcAllister),
  ...groupFixes([
    ["Batalla de Columbus de 1865", "Incursión de Wilson de 1865", "Columbus, Georgia, Estados Unidos", 1865]
  ], SOURCES.georgiaBattles),
  ...groupFixes([
    ["Batalla del puerto de Galveston de 1862", "Bloqueo naval de la costa de Texas", "Galveston, Texas, Estados Unidos", 1862, "batalla naval"],
    ["Batalla naval de Memphis", "Campaña del río Misisipi de 1862", "Memphis, Tennessee, Estados Unidos", 1862, "batalla naval"]
  ], SOURCES.naval1862),
  ...groupFixes([
    ["Batalla de Head of Passes", "Bloqueo naval del bajo Misisipi", "Delta del Misisipi, Luisiana, Estados Unidos", 1861, "batalla naval"]
  ], SOURCES.headOfPasses),
  ...groupFixes([
    ["Batalla de Helena", "Campaña de Helena de 1863", "Helena, Arkansas, Estados Unidos", 1863]
  ], SOURCES.helena),
  ...groupFixes([
    ["Batalla de Lexington, Tennessee", "Expedición de Forrest en Tennessee Occidental de 1862", "Lexington, Tennessee, Estados Unidos", 1862]
  ], SOURCES.lexington),
  ...groupFixes([
    ["Batalla de Selma", "Incursión de Wilson de 1865", "Selma, Alabama, Estados Unidos", 1865]
  ], SOURCES.selma),
  ...groupFixes([
    ["Batalla naval de St. Charles", "Operaciones navales del río Blanco de 1862", "St. Charles, Arkansas, Estados Unidos", 1862, "batalla naval"]
  ], SOURCES.stCharles),
  ...groupFixes([
    ["Primera batalla de Collierville", "Operaciones del ferrocarril Memphis-Charleston de 1863", "Collierville, Tennessee, Estados Unidos", 1863]
  ], SOURCES.colliervilleFirst),
  ...groupFixes([
    ["Segunda batalla de Collierville", "Operaciones del ferrocarril Memphis-Charleston de 1863", "Collierville, Tennessee, Estados Unidos", 1863]
  ], SOURCES.colliervilleSecond),
  ...groupFixes([
    ["Batalla de Fredericksburg", "Campaña de Fredericksburg", "Fredericksburg, Virginia, Estados Unidos", 1862]
  ], SOURCES.armyCampaigns)
};
