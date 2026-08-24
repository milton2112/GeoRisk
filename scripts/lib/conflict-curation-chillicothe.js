function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  armyCampaignHistory: source(
    "Centro de Historia Militar del Ejército de EE. UU.: Battle of Chillicothe dentro del teatro occidental de la Guerra de Independencia",
    "https://history.army.mil/Portals/143/Images/Publications/catalog/71-54.pdf"
  ),
  kentuckyMilitaryHistory: source(
    "Servicios Históricos de la Guardia Nacional de Kentucky: expedición de John Bowman contra Old Chillicothe a finales de mayo de 1779",
    "https://kynghistory.ky.gov/Media/Publications/DMA/MilitaryHistoryKY1939AnlRpt.pdf"
  ),
  ohioHistoryJournal: source(
    "Ohio History Journal: incursión de John Bowman contra Chillicothe en mayo de 1779 y retirada de la milicia de Kentucky",
    "https://resources.ohiohistory.org/ohj/browse/displaypages.php?display%5B%5D=0014&display%5B%5D=39&display%5B%5D=59"
  )
};

function historicalFix({
  parent,
  campaign,
  region,
  hierarchySources,
  participants,
  cause,
  outcome,
  consequences,
  chronology
}) {
  const sources = hierarchySources.filter(Boolean);
  return {
    parent,
    war: parent,
    campaign,
    type: "incursión y combate",
    conflictType: "frontera",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1779,
    endYear: 1779,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology,
    treaties: ["Tratado de París (1783)"],
    related: [...new Set([parent, campaign, "Frontera de Ohio y Kentucky", "Old Chillicothe", "John Bowman"].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-chillicothe-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: true,
    curationNote: "El material del Centro de Historia Militar del Ejército de EE. UU. etiqueta la acción como 29 de mayo de 1779 en un mapa global, pero como 29 de mayo de 1782 en un mapa fronterizo del mismo volumen. La historia militar de Kentucky y la fuente histórica de Ohio la sitúan en mayo de 1779; por eso la ficha muestra solo 1779. Las fuentes también difieren sobre efectivos, destrucción, bajas y si fue victoria o derrota, por lo que no consolida bajas ni adjudica una victoria táctica simple."
  };
}

export const CHILLICOTHE_CONFLICT_RENAMES = {
  "Batalla de Chillicothe": "Batalla de Chillicothe (1779)",
  "Battle of Chillicothe": "Batalla de Chillicothe (1779)",
  "Expedición de Bowman contra Chillicothe": "Batalla de Chillicothe (1779)"
};

export const CHILLICOTHE_CONFLICT_DETAIL_FIXES = {
  "Batalla de Chillicothe (1779)": historicalFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Expedición de Bowman contra Chillicothe de 1779",
    region: "Old Chillicothe, valle del río Little Miami, actual condado de Greene, Ohio, Estados Unidos",
    hierarchySources: [SOURCES.armyCampaignHistory, SOURCES.kentuckyMilitaryHistory, SOURCES.ohioHistoryJournal],
    participants: [
      {
        side: "Milicia del condado de Kentucky, Virginia",
        members: ["Coronel John Bowman", "Milicianos voluntarios del condado de Kentucky"]
      },
      {
        side: "Defensores shawnee de Chillicothe",
        members: ["Combatientes shawnee de Old Chillicothe"]
      }
    ],
    cause: "En un contexto de violencia fronteriza y represalias entre los asentamientos de Kentucky y las comunidades shawnee, John Bowman organizó una expedición desde Kentucky County contra Old Chillicothe, una población shawnee al norte del río Ohio.",
    outcome: "La columna de Bowman alcanzó Chillicothe y atacó el asentamiento, pero la resistencia shawnee obligó a los milicianos a retirarse. Los relatos coinciden en que hubo destrucción durante la incursión, aunque no en su alcance ni en quién la efectuó; por eso la ficha no la presenta como una victoria táctica simple.",
    consequences: "La incursión no puso fin a la guerra fronteriza ni eliminó las incursiones posteriores en Kentucky. Formó parte de una secuencia de campañas cada vez más duras contra poblaciones y recursos de la frontera de Ohio durante la Guerra de Independencia.",
    chronology: [
      { year: 1779, event: "A finales de mayo, voluntarios de Kentucky County se reunieron y cruzaron hacia el territorio shawnee al norte del río Ohio." },
      { year: 1779, event: "La expedición de John Bowman atacó Old Chillicothe y se retiró después de encontrar resistencia shawnee." },
      { year: 1779, event: "La violencia fronteriza entre asentamientos de Kentucky y comunidades indígenas continuó después de la incursión." }
    ]
  })
};
