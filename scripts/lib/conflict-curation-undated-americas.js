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
  valleyForge: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de Valley Forge a Monmouth",
    "https://history.army.mil/Revwar250/Publications-and-Videos/"
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
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de Virginia de 1781",
    "https://history.army.mil/Revwar250/Publications-and-Videos/"
  ),
  frontier: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campañas de la Revolución estadounidense",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Revolutionary-War-Campaigns/",
    "media"
  ),
  campaign1812: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de 1812",
    "https://history.army.mil/Publications/Publications-Catalog/The-Campaign-of-1812/"
  ),
  canada1813: source(
    "Centro de Historia Militar del Ejército de EE. UU.: teatro canadiense de 1813",
    "https://history.army.mil/Publications/Publications-Catalog/Canadian-Theater-1813/"
  ),
  creek: source(
    "Centro de Historia Militar del Ejército de EE. UU.: guerra Creek de 1813-1814",
    "https://history.army.mil/Publications/Publications-Catalog/The-Creek-War/"
  ),
  chesapeake: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de Chesapeake de 1813-1814",
    "https://history.army.mil/Publications/Publications-Catalog/The-Chesapeake-Campaign-18131814/"
  ),
  canada1814: source(
    "Centro de Historia Militar del Ejército de EE. UU.: teatro canadiense de 1814",
    "https://history.army.mil/Publications/Publications-Catalog/Canadian-Theater-1814/"
  ),
  gulf: source(
    "Centro de Historia Militar del Ejército de EE. UU.: teatro del Golfo de 1813-1815",
    "https://history.army.mil/Publications/Publications-Catalog/The-Gulf-Theater/"
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
  conflictType = "independencia",
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
    curationBatch: "source-backed-undated-americas-2026-07",
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
    endYear = startYear,
    type = defaults.type || "batalla"
  ]) => [name, hierarchyFix({ ...defaults, campaign, region, startYear, endYear, type })]));
}

export const UNDATED_AMERICAS_SAFE_CONFLICT_RENAMES = {
  "Batalla de Ch-teauguay": "Batalla de Châteauguay"
};

const REVOLUTIONARY_WAR_FIXES = {
  ...groupFixes([
    ["Batalla de Chelsea Creek", "Sitio de Boston", "Chelsea Creek, Massachusetts, Estados Unidos", 1775]
  ], {
    parent: "Guerra de Independencia de Estados Unidos",
    source: SOURCES.opening
  }),
  ...groupFixes([
    ["Batalla de Fort Washington", "Campaña de Nueva York de 1776", "Manhattan, Nueva York, Estados Unidos", 1776],
    ["Batalla de Harlem Heights", "Campaña de Nueva York de 1776", "Manhattan, Nueva York, Estados Unidos", 1776]
  ], {
    parent: "Guerra de Independencia de Estados Unidos",
    source: SOURCES.newYork
  }),
  ...groupFixes([
    ["Batalla de Assunpink Creek", "Campaña de Nueva Jersey de 1776-1777", "Trenton, Nueva Jersey, Estados Unidos", 1777],
    ["Batalla de Bound Brook", "Campaña de Nueva Jersey de 1776-1777", "Bound Brook, Nueva Jersey, Estados Unidos", 1777]
  ], {
    parent: "Guerra de Independencia de Estados Unidos",
    source: SOURCES.newJersey
  }),
  ...groupFixes([
    ["Batalla de Cooch's Bridge", "Campaña de Filadelfia de 1777", "Newark, Delaware, Estados Unidos", 1777],
    ["Batalla de Germantown", "Campaña de Filadelfia de 1777", "Filadelfia, Pensilvania, Estados Unidos", 1777]
  ], {
    parent: "Guerra de Independencia de Estados Unidos",
    source: SOURCES.philadelphia
  }),
  ...groupFixes([
    ["Batalla de Bemis Heights", "Campaña de Saratoga de 1777", "Stillwater, Nueva York, Estados Unidos", 1777],
    ["Batalla de Bennington", "Campaña de Saratoga de 1777", "Walloomsac, Nueva York, Estados Unidos", 1777],
    ["Batalla de Fort Anne", "Campaña de Saratoga de 1777", "Fort Ann, Nueva York, Estados Unidos", 1777],
    ["Batalla de Freeman's Farm", "Campaña de Saratoga de 1777", "Stillwater, Nueva York, Estados Unidos", 1777]
  ], {
    parent: "Guerra de Independencia de Estados Unidos",
    source: SOURCES.saratoga
  }),
  ...groupFixes([
    ["Batalla de Barren Hill", "Campaña de Valley Forge a Monmouth de 1778", "Lafayette Hill, Pensilvania, Estados Unidos", 1778],
    ["Batalla de Crooked Billet", "Campaña de Valley Forge a Monmouth de 1778", "Hatboro, Pensilvania, Estados Unidos", 1778],
    ["Batalla de Monmouth", "Campaña de Valley Forge a Monmouth de 1778", "Monmouth, Nueva Jersey, Estados Unidos", 1778]
  ], {
    parent: "Guerra de Independencia de Estados Unidos",
    source: SOURCES.valleyForge
  }),
  ...groupFixes([
    ["Batalla de Chestnut Neck", "Guerra en el norte de 1778-1781", "Chestnut Neck, Nueva Jersey, Estados Unidos", 1778]
  ], {
    parent: "Guerra de Independencia de Estados Unidos",
    source: SOURCES.north
  }),
  ...groupFixes([
    ["Batalla de Alligator Bridge", "Expedición a Florida Oriental de 1778", "Alligator Creek, Florida, Estados Unidos", 1778],
    ["Batalla de Beaufort", "Campaña del sur de 1778-1780", "Port Royal Island, Carolina del Sur, Estados Unidos", 1779],
    ["Batalla de Blackstock's Farm", "Campaña del sur de 1778-1780", "Union County, Carolina del Sur, Estados Unidos", 1780],
    ["Batalla de Camden", "Campaña del sur de 1778-1780", "Camden, Carolina del Sur, Estados Unidos", 1780],
    ["Batalla de Kettle Creek", "Campaña del sur de 1778-1780", "Wilkes County, Georgia, Estados Unidos", 1779]
  ], {
    parent: "Guerra de Independencia de Estados Unidos",
    source: SOURCES.south
  }),
  ...groupFixes([
    ["Batalla de Blandford", "Campaña de Virginia de 1781", "Petersburg, Virginia, Estados Unidos", 1781]
  ], {
    parent: "Guerra de Independencia de Estados Unidos",
    source: SOURCES.virginia
  }),
  ...groupFixes([
    ["Batalla de Blue Licks", "Guerra fronteriza de 1775-1783", "Blue Licks, Kentucky, Estados Unidos", 1782],
    ["Batalla de Eutaw Springs", "Campaña de las Carolinas y Georgia de 1781-1782", "Eutawville, Carolina del Sur, Estados Unidos", 1781],
    ["Batalla de Guilford Court House", "Campaña de las Carolinas y Georgia de 1781-1782", "Greensboro, Carolina del Norte, Estados Unidos", 1781]
  ], {
    parent: "Guerra de Independencia de Estados Unidos",
    source: SOURCES.frontier
  })
};

const WAR_OF_1812_FIXES = {
  ...groupFixes([
    ["Batalla de Brownstown", "Campaña del noroeste de 1812", "Brownstown, Michigan, Estados Unidos", 1812],
    ["Batalla de Frenchtown", "Campaña del noroeste de 1812-1813", "Monroe, Michigan, Estados Unidos", 1813]
  ], {
    parent: "Guerra de 1812",
    source: SOURCES.campaign1812,
    conflictType: "interestatal"
  }),
  ...groupFixes([
    ["Batalla de Beaver Dams", "Teatro canadiense de 1813", "Thorold, Ontario, Canadá", 1813],
    ["Batalla de Buffalo", "Teatro canadiense de 1813", "Buffalo, Nueva York, Estados Unidos", 1813],
    ["Batalla de Châteauguay", "Campaña del San Lorenzo de 1813", "Châteauguay, Quebec, Canadá", 1813],
    ["Batalla de Crysler's Farm", "Campaña del San Lorenzo de 1813", "Morrisburg, Ontario, Canadá", 1813],
    ["Batalla de Fort Stephenson", "Campaña del noroeste de 1813", "Fremont, Ohio, Estados Unidos", 1813]
  ], {
    parent: "Guerra de 1812",
    source: SOURCES.canada1813,
    conflictType: "interestatal"
  }),
  ...groupFixes([
    ["Batalla de Burnt Corn", "Guerra Creek de 1813-1814", "Burnt Corn Creek, Alabama, Estados Unidos", 1813]
  ], {
    parent: "Guerra de 1812",
    source: SOURCES.creek,
    conflictType: "insurgencia"
  }),
  ...groupFixes([
    ["Batalla de Baltimore", "Campaña de Chesapeake de 1813-1814", "Baltimore, Maryland, Estados Unidos", 1814],
    ["Batalla de Bladensburg", "Campaña de Chesapeake de 1813-1814", "Bladensburg, Maryland, Estados Unidos", 1814],
    ["Batalla de Caulk's Field", "Campaña de Chesapeake de 1813-1814", "Kent County, Maryland, Estados Unidos", 1814],
    ["Batalla de Craney Island", "Campaña de Chesapeake de 1813-1814", "Portsmouth, Virginia, Estados Unidos", 1813],
    ["Batalla de North Point", "Campaña de Chesapeake de 1813-1814", "Baltimore County, Maryland, Estados Unidos", 1814]
  ], {
    parent: "Guerra de 1812",
    source: SOURCES.chesapeake,
    conflictType: "interestatal"
  }),
  ...groupFixes([
    ["Batalla de Chippawa", "Teatro canadiense de 1814", "Niagara, Ontario, Canadá", 1814],
    ["Batalla de Cook's Mills", "Teatro canadiense de 1814", "Welland, Ontario, Canadá", 1814]
  ], {
    parent: "Guerra de 1812",
    source: SOURCES.canada1814,
    conflictType: "interestatal"
  }),
  ...groupFixes([
    ["Batalla de Nueva Orleans", "Teatro del Golfo de 1813-1815", "Chalmette, Luisiana, Estados Unidos", 1815]
  ], {
    parent: "Guerra de 1812",
    source: SOURCES.gulf,
    conflictType: "interestatal"
  })
};

export const UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES = {
  ...REVOLUTIONARY_WAR_FIXES,
  ...WAR_OF_1812_FIXES
};
