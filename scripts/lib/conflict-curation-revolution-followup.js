function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  opening: source(
    "Centro de Historia Militar del Ejército de EE. UU.: primeros combates de 1775-1776",
    "https://history.army.mil/Publications/Publications-Catalog/Opening-Shots-in-the-Colonies/"
  ),
  newYork: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de Nueva York de 1776",
    "https://history.army.mil/Publications/Publications-Catalog/The-New-York-Campaign/"
  ),
  newJersey: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de Nueva Jersey de 1776-1777",
    "https://history.army.mil/Publications/Publications-Catalog/The-New-Jersey-Campaign/"
  ),
  philadelphia: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de Filadelfia de 1777",
    "https://history.army.mil/Publications/Publications-Catalog/The-Philadelphia-Campaign/"
  ),
  saratoga: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de Saratoga de 1777",
    "https://history.army.mil/Publications/Publications-Catalog/Saratoga-Campaign/"
  ),
  north: source(
    "Centro de Historia Militar del Ejército de EE. UU.: guerra en el norte de 1778-1781",
    "https://history.army.mil/Publications/Publications-Catalog/The-War-in-the-North/"
  ),
  south: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña del sur de 1778-1780",
    "https://history.army.mil/Publications/Publications-Catalog/The-War-in-the-South/"
  ),
  virginia: source(
    "Servicio de Parques Nacionales de EE. UU.: cronología de la guerra de Independencia",
    "https://www.nps.gov/waro/learn/historyculture/timeline-of-the-war-for-independence.htm"
  ),
  finalCarolinas: source(
    "Sitios Históricos de Carolina del Norte: batalla de Lindley's Mill de 1781",
    "https://historicsites.nc.gov/all-sites/house-horseshoe/history/surrender-terms-and-david-fanning"
  ),
  southernStudy: source(
    "Servicio de Parques Nacionales de EE. UU.: campaña del sur de la Revolución",
    "https://www.nps.gov/subjects/heritageareas/upload/Southern-Campaign-of-the-Revolution_July_2015-Final-Study.pdf"
  ),
  battles: source(
    "Centro de Historia Militar del Ejército de EE. UU.: batallas y campañas de la Revolución",
    "https://history.army.mil/Revwar250/Battles/",
    "media"
  ),
  naval: source(
    "Servicio de Parques Nacionales de EE. UU.: Joshua Barney y la batalla de la bahía de Delaware",
    "https://home.nps.gov/stsp/learn/historyculture/joshua-barney.htm"
  )
};

function hierarchyFix({
  campaign,
  region,
  source: hierarchySource,
  startYear,
  type = "batalla"
}) {
  const parent = "Guerra de Independencia de Estados Unidos";
  return {
    parent,
    war: parent,
    campaign,
    type,
    conflictType: "independencia",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear,
    endYear: startYear,
    region,
    normalizedRegion: region,
    related: [parent, campaign],
    hierarchyConfidence: hierarchySource.confidence || "alta",
    hierarchySources: [{ label: hierarchySource.label, url: hierarchySource.url }],
    curationPriority: "alta",
    curationBatch: "source-backed-revolution-followup-2026-07",
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
  ]) => [name, hierarchyFix({ campaign, region, source: hierarchySource, startYear, type })]));
}

export const REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Delaware Bay": "Batalla de la bahía de Delaware",
  "Batalla de Delaware Capes": "Batalla de la bahía de Delaware",
  "Inteligencia en la batalla de Princeton": "Batalla de Princeton",
  "Batalla de Forts Clinton y Montgomery": "Batalla de los fuertes Clinton y Montgomery",
  "Batalla de Sullivan's Island": "Batalla de la isla de Sullivan"
};

export const REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  ...groupFixes([
    ["Batalla de Great Bridge", "Campaña de Virginia de 1775", "Great Bridge, Virginia, Estados Unidos", 1775],
    ["Batalla de la isla de Sullivan", "Campaña de Charleston de 1776", "Isla de Sullivan, Carolina del Sur, Estados Unidos", 1776]
  ], SOURCES.opening),
  ...groupFixes([
    ["Batalla de Pell's Point", "Campaña de Nueva York de 1776", "Pelham, Nueva York, Estados Unidos", 1776],
    ["Batalla de White Plains", "Campaña de Nueva York de 1776", "White Plains, Nueva York, Estados Unidos", 1776]
  ], SOURCES.newYork),
  ...groupFixes([
    ["Batalla de Millstone", "Campaña de Nueva Jersey de 1776-1777", "Somerset County, Nueva Jersey, Estados Unidos", 1777],
    ["Batalla de Princeton", "Campaña de Nueva Jersey de 1776-1777", "Princeton, Nueva Jersey, Estados Unidos", 1777],
    ["Batalla de Short Hills", "Campaña de Nueva Jersey de 1776-1777", "Scotch Plains, Nueva Jersey, Estados Unidos", 1777]
  ], SOURCES.newJersey),
  ...groupFixes([
    ["Batalla de Gloucester", "Campaña de Filadelfia de 1777", "Gloucester County, Nueva Jersey, Estados Unidos", 1777],
    ["Batalla de Matson's Ford", "Campaña de Filadelfia de 1777", "West Conshohocken, Pensilvania, Estados Unidos", 1777],
    ["Batalla de Paoli", "Campaña de Filadelfia de 1777", "Malvern, Pensilvania, Estados Unidos", 1777],
    ["Batalla de Red Bank", "Campaña de Filadelfia de 1777", "National Park, Nueva Jersey, Estados Unidos", 1777]
  ], SOURCES.philadelphia),
  ...groupFixes([
    ["Batalla de Hubbardton", "Campaña de Saratoga de 1777", "Hubbardton, Vermont, Estados Unidos", 1777],
    ["Batalla de Oriskany", "Campaña de Saratoga de 1777", "Oriskany, Nueva York, Estados Unidos", 1777],
    ["Batalla de los fuertes Clinton y Montgomery", "Campaña de Saratoga de 1777", "Hudson Highlands, Nueva York, Estados Unidos", 1777]
  ], SOURCES.saratoga),
  ...groupFixes([
    ["Batalla de Ridgefield", "Incursión de Danbury de 1777", "Ridgefield, Connecticut, Estados Unidos", 1777],
    ["Batalla de Setauket", "Operaciones en Long Island de 1777", "Setauket, Nueva York, Estados Unidos", 1777],
    ["Batalla de Quinton's Bridge", "Operaciones en Nueva Jersey de 1778", "Salem County, Nueva Jersey, Estados Unidos", 1778],
    ["Batalla de Rhode Island", "Campaña de Rhode Island de 1778", "Aquidneck Island, Rhode Island, Estados Unidos", 1778],
    ["Batalla de Cobleskill", "Guerra fronteriza de 1778-1781", "Cobleskill, Nueva York, Estados Unidos", 1778],
    ["Batalla de Paulus Hook", "Operaciones del Hudson de 1779", "Jersey City, Nueva Jersey, Estados Unidos", 1779],
    ["Batalla de Newtown", "Expedición de Sullivan de 1779", "Elmira, Nueva York, Estados Unidos", 1779],
    ["Batalla de Stony Point", "Operaciones del Hudson de 1779", "Stony Point, Nueva York, Estados Unidos", 1779],
    ["Batalla de Young's House", "Operaciones en Westchester de 1780", "Westchester County, Nueva York, Estados Unidos", 1780],
    ["Batalla de Connecticut Farms", "Campaña de Springfield de 1780", "Union, Nueva Jersey, Estados Unidos", 1780],
    ["Batalla de Fort St. George", "Operaciones en Long Island de 1780", "Mastic, Nueva York, Estados Unidos", 1780],
    ["Batalla de Klock's Field", "Guerra fronteriza de 1778-1781", "St. Johnsville, Nueva York, Estados Unidos", 1780],
    ["Batalla de Johnstown", "Guerra fronteriza de 1778-1781", "Johnstown, Nueva York, Estados Unidos", 1781],
    ["Batalla de Groton Heights", "Incursión de Nueva Londres de 1781", "Groton, Connecticut, Estados Unidos", 1781]
  ], SOURCES.north),
  ...groupFixes([
    ["Batalla de la bahía de Delaware", "Guerra naval en la costa atlántica de 1782", "Bahía de Delaware, Estados Unidos", 1782, "batalla naval"]
  ], SOURCES.naval),
  ...groupFixes([
    ["Batalla de Thomas Creek", "Expedición a Florida Oriental de 1777", "Duval County, Florida, Estados Unidos", 1777]
  ], SOURCES.battles),
  ...groupFixes([
    ["Batalla de Stono Ferry", "Campaña del sur de 1778-1780", "Charleston County, Carolina del Sur, Estados Unidos", 1779],
    ["Batalla de Charlotte", "Campaña del sur de 1778-1780", "Charlotte, Carolina del Norte, Estados Unidos", 1780],
    ["Batalla de Fishdam Ford", "Campaña del sur de 1778-1780", "Chester County, Carolina del Sur, Estados Unidos", 1780],
    ["Batalla de Hanging Rock", "Campaña del sur de 1778-1780", "Lancaster County, Carolina del Sur, Estados Unidos", 1780],
    ["Batalla de Lenud's Ferry", "Campaña del sur de 1778-1780", "Berkeley County, Carolina del Sur, Estados Unidos", 1780],
    ["Batalla de Monck's Corner", "Campaña del sur de 1778-1780", "Moncks Corner, Carolina del Sur, Estados Unidos", 1780],
    ["Batalla de Musgrove Mill", "Campaña del sur de 1778-1780", "Spartanburg County, Carolina del Sur, Estados Unidos", 1780],
    ["Batalla de Ramsour's Mill", "Campaña del sur de 1778-1780", "Lincolnton, Carolina del Norte, Estados Unidos", 1780],
    ["Batalla de Rocky Mount", "Campaña del sur de 1778-1780", "Chester County, Carolina del Sur, Estados Unidos", 1780],
    ["Batalla de Waxhaws", "Campaña del sur de 1778-1780", "Lancaster County, Carolina del Sur, Estados Unidos", 1780]
  ], SOURCES.southernStudy),
  ...groupFixes([
    ["Batalla de Lindley's Mill", "Campaña de las Carolinas y Georgia de 1781-1782", "Alamance County, Carolina del Norte, Estados Unidos", 1781]
  ], SOURCES.finalCarolinas),
  ...groupFixes([
    ["Batalla de Green Spring", "Campaña de Virginia de 1781", "Williamsburg, Virginia, Estados Unidos", 1781],
    ["Batalla de Spencer's Ordinary", "Campaña de Virginia de 1781", "Williamsburg, Virginia, Estados Unidos", 1781]
  ], SOURCES.virginia)
};
