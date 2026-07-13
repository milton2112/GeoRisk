function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  campaign1812: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de 1812",
    "https://history.army.mil/Publications/Publications-Catalog/The-Campaign-of-1812/"
  ),
  canada1813: source(
    "Centro de Historia Militar del Ejército de EE. UU.: teatro canadiense de 1813",
    "https://history.army.mil/portals/143/Images/Publications/catalog/74-3.pdf"
  ),
  canada1814: source(
    "Centro de Historia Militar del Ejército de EE. UU.: teatro canadiense de 1814",
    "https://history.army.mil/Publications/Publications-Catalog/Canadian-Theater-1814/"
  ),
  chesapeake: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de Chesapeake de 1813-1814",
    "https://history.army.mil/Publications/Publications-Catalog/The-Chesapeake-Campaign-18131814/"
  ),
  shannon: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: captura del USS Chesapeake por el HMS Shannon",
    "https://www.history.navy.mil/browse-by-topic/wars-conflicts-and-operations/1812/capture-of-chesapeake.html"
  ),
  saintMichaels: source(
    "Servicio de Parques Nacionales de EE. UU.: ataques británicos sobre Saint Michaels en 1813",
    "https://www.nps.gov/stsp/learn/historyculture/the-town-that-fooled-the-british.htm"
  ),
  hampden: source(
    "Gobierno de Maine: historia de Hampden y batalla de 1814",
    "https://www.maine.gov/dacf/municipalplanning/comp_plans/Hampden_2024.pdf"
  ),
  creek: source(
    "Centro de Historia Militar del Ejército de EE. UU.: guerra Creek de 1813-1814",
    "https://history.army.mil/Publications/Publications-Catalog/The-Creek-War/"
  )
};

const PARTICIPANTS = {
  war1812: [
    { side: "Estados Unidos", members: ["Estados Unidos"] },
    { side: "Fuerzas británicas y canadienses", members: ["Reino Unido"] }
  ],
  northwest1812: [
    { side: "Estados Unidos", members: ["Estados Unidos"] },
    { side: "Fuerzas británicas, canadienses y confederadas indígenas", members: ["Reino Unido", "Confederación de Tecumseh"] }
  ],
  fortDearborn: [
    { side: "Guarnición y evacuados estadounidenses", members: ["Estados Unidos"] },
    { side: "Guerreros potawatomi", members: ["Potawatomi"] }
  ],
  fortWayne: [
    { side: "Guarnición estadounidense", members: ["Estados Unidos"] },
    { side: "Fuerzas miami y potawatomi", members: ["Miami", "Potawatomi"] }
  ],
  creek: [
    { side: "Estados Unidos y aliados indígenas", members: ["Estados Unidos", "Cheroqui", "Creek del Bajo"] },
    { side: "Red Sticks creek", members: ["Red Sticks creek"] }
  ]
};

function hierarchyFix({
  parent,
  campaign,
  region,
  hierarchySource,
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
    curationBatch: "source-backed-war-1812-followup-2026-07",
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

export const WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Guerra de 1812": "Guerra anglo-estadounidense de 1812",
  "Batalla de Fort Wayne": "Sitio de Fort Wayne",
  "Batalla de River Canard": "Batalla del río Canard",
  "Batalla de Queenston Heights": "Batalla de las alturas de Queenston",
  "Incursion sobre Black Rock": "Incursión sobre Black Rock",
  "Incursion sobre Havre de Grace": "Incursión sobre Havre de Grace",
  "Combate de la Shannon y de la Chesapeake": "Combate naval entre el HMS Shannon y el USS Chesapeake",
  "Batalla de St. Michaels": "Batalla de Saint Michaels",
  "Batalla del rio Eel en la Guerra de 1812": "Batalla del río Eel"
};

const WAR_1812_FIXES = {
  ...groupFixes([
    ["Batalla de Fort Dearborn", "Campaña del noroeste de 1812", "Chicago, Illinois, Estados Unidos", 1812]
  ], {
    parent: "Guerra anglo-estadounidense de 1812",
    hierarchySource: SOURCES.campaign1812,
    participants: PARTICIPANTS.fortDearborn
  }),
  ...groupFixes([
    ["Sitio de Fort Wayne", "Campaña del noroeste de 1812", "Fort Wayne, Indiana, Estados Unidos", 1812, "sitio"]
  ], {
    parent: "Guerra anglo-estadounidense de 1812",
    hierarchySource: SOURCES.campaign1812,
    participants: PARTICIPANTS.fortWayne
  }),
  ...groupFixes([
    ["Batalla de Maguaga", "Campaña de Detroit de 1812", "Monguagon, territorio de Míchigan, Estados Unidos", 1812],
    ["Batalla del río Canard", "Campaña de Detroit de 1812", "Río Canard, Alto Canadá", 1812],
    ["Batalla de las alturas de Queenston", "Campaña del Niágara de 1812", "Queenston, Alto Canadá", 1812],
    ["Batalla de Frenchman's Creek", "Campaña del Niágara de 1812", "Frenchman's Creek, Alto Canadá", 1812]
  ], {
    parent: "Guerra anglo-estadounidense de 1812",
    hierarchySource: SOURCES.campaign1812,
    participants: PARTICIPANTS.northwest1812
  }),
  ...groupFixes([
    ["Batalla de Ogdensburg", "Campaña del San Lorenzo de 1813", "Ogdensburg, Nueva York, Estados Unidos", 1813],
    ["Batalla de York", "Campaña del lago Ontario de 1813", "York, Alto Canadá", 1813],
    ["Batalla de Stoney Creek", "Campaña del Niágara de 1813", "Stoney Creek, Alto Canadá", 1813],
    ["Batalla del Támesis", "Campaña del noroeste de 1813", "Río Támesis, Alto Canadá", 1813],
    ["Incursión sobre Black Rock", "Operaciones de la frontera del Niágara de 1813", "Black Rock, Nueva York, Estados Unidos", 1813]
  ], {
    parent: "Guerra anglo-estadounidense de 1812",
    hierarchySource: SOURCES.canada1813,
    participants: PARTICIPANTS.war1812
  }),
  ...groupFixes([
    ["Incursión sobre Havre de Grace", "Campaña de Chesapeake de 1813", "Havre de Grace, Maryland, Estados Unidos", 1813]
  ], {
    parent: "Guerra anglo-estadounidense de 1812",
    hierarchySource: SOURCES.chesapeake,
    participants: PARTICIPANTS.war1812
  }),
  ...groupFixes([
    ["Batalla de Saint Michaels", "Campaña de Chesapeake de 1813", "Saint Michaels, Maryland, Estados Unidos", 1813]
  ], {
    parent: "Guerra anglo-estadounidense de 1812",
    hierarchySource: SOURCES.saintMichaels,
    participants: PARTICIPANTS.war1812
  }),
  ...groupFixes([
    ["Combate naval entre el HMS Shannon y el USS Chesapeake", "Guerra naval del Atlántico de 1813", "Frente a Boston, Massachusetts, Estados Unidos", 1813, "batalla naval"]
  ], {
    parent: "Guerra anglo-estadounidense de 1812",
    hierarchySource: SOURCES.shannon,
    scale: "internacional",
    participants: PARTICIPANTS.war1812
  }),
  ...groupFixes([
    ["Batalla de Fort Oswego", "Campaña del lago Ontario de 1814", "Oswego, Nueva York, Estados Unidos", 1814],
    ["Batalla de Lacolle Mills", "Campaña del Bajo Canadá de 1814", "Lacolle, Bajo Canadá", 1814],
    ["Batalla de Longwoods", "Campaña del Alto Canadá de 1814", "Longwoods, Alto Canadá", 1814],
    ["Batalla de Lundy's Lane", "Campaña del Niágara de 1814", "Lundy's Lane, Alto Canadá", 1814],
    ["Batalla de Malcolm's Mills", "Campaña del Alto Canadá de 1814", "Malcolm's Mills, Alto Canadá", 1814]
  ], {
    parent: "Guerra anglo-estadounidense de 1812",
    hierarchySource: SOURCES.canada1814,
    participants: PARTICIPANTS.war1812
  }),
  ...groupFixes([
    ["Batalla de Hampden", "Campaña británica de Maine de 1814", "Hampden, Maine, Estados Unidos", 1814]
  ], {
    parent: "Guerra anglo-estadounidense de 1812",
    hierarchySource: SOURCES.hampden,
    participants: PARTICIPANTS.war1812
  })
};

const CREEK_WAR_FIXES = {
  ...groupFixes([
    ["Batalla de Tallushatchee", "Campaña contra los Red Sticks de 1813-1814", "Tallushatchee, Alabama, Estados Unidos", 1813],
    ["Batalla de Talladega", "Campaña contra los Red Sticks de 1813-1814", "Talladega, Alabama, Estados Unidos", 1813],
    ["Batalla de Holy Ground", "Campaña contra los Red Sticks de 1813-1814", "Holy Ground, Alabama, Estados Unidos", 1813],
    ["Batalla de Calebee Creek", "Campaña contra los Red Sticks de 1813-1814", "Calebee Creek, Alabama, Estados Unidos", 1814],
    ["Batalla de Horseshoe Bend", "Campaña del Tallapoosa de 1814", "Horseshoe Bend, Alabama, Estados Unidos", 1814]
  ], {
    parent: "Guerra Creek",
    hierarchySource: SOURCES.creek,
    conflictType: "civil",
    participants: PARTICIPANTS.creek
  })
};

export const WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  ...WAR_1812_FIXES,
  ...CREEK_WAR_FIXES
};
