function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  northCarolinaHistory: source(
    "Departamento de Recursos Naturales y Culturales de Carolina del Norte: Fight at Colson's, con la corrección del mando lealista del marcador histórico",
    "https://www.dncr.nc.gov/blog/2024/01/12/fight-colsons-l-51"
  ),
  northCarolinaEncyclopedia: source(
    "NCpedia y Biblioteca de Carolina del Norte: Colson's Mill, la acción del 21 de julio de 1780 y su relación con el depósito de suministros posterior",
    "https://www.ncpedia.org/colsons-supply-depot"
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
    type: "batalla",
    conflictType: "independencia",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1780,
    endYear: 1780,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology,
    treaties: ["Tratado de París (1783)"],
    related: [...new Set([parent, campaign, "Batalla de Ramseur's Mill", "Batalla de Guilford Court House", "William Lee Davidson", "Charles Cornwallis"].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-colsons-mill-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: true,
    curationNote: "El antiguo texto del marcador histórico atribuye la fuerza lealista a Samuel Bryan. La investigación explicativa del propio Departamento de Recursos Naturales y Culturales de Carolina del Norte aclara que Bryan ya había llegado a las líneas británicas y estaba a más de 80 km de Colson's Mill ese día. Por eso la ficha conserva una fuerza lealista colectiva, no le adjudica ese mando, y mantiene las bajas como cifras de la síntesis estatal, no como un parte independiente completo."
  };
}

export const COLSONS_MILL_CONFLICT_RENAMES = {
  "Batalla de Colson's Mill": "Batalla de Colson's Mill (1780)",
  "Battle of Colson's Mill": "Batalla de Colson's Mill (1780)",
  "Fight at Colson's": "Batalla de Colson's Mill (1780)"
};

export const COLSONS_MILL_CONFLICT_DETAIL_FIXES = {
  "Batalla de Colson's Mill (1780)": historicalFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Campaña del sur de 1780",
    region: "Confluencia de los ríos Pee Dee y Rocky, cerca de Norwood, Carolina del Norte, Estados Unidos",
    hierarchySources: [SOURCES.northCarolinaHistory, SOURCES.northCarolinaEncyclopedia],
    participants: [
      {
        side: "Milicia patriota de Carolina del Norte",
        members: ["Coronel William Lee Davidson", "Milicia patriota (aprox. 160 hombres)"],
        casualties: "2 heridos, incluido Davidson, según la síntesis estatal"
      },
      {
        side: "Milicia lealista de Carolina del Norte",
        members: ["Voluntarios lealistas parcialmente armados (aprox. 250 hombres)"],
        casualties: "3 muertos, 4 o 5 heridos y 10 capturados, según la síntesis estatal"
      }
    ],
    cause: "Durante la campaña del Sur de 1780, una concentración de lealistas parcialmente armados se reunió en Colson's Mill para dirigirse hacia el puesto británico de Cheraw. William Lee Davidson, que patrullaba la ribera occidental de los ríos Yadkin y Pee Dee, decidió interceptarla antes de que alcanzara apoyo británico.",
    outcome: "El 21 de julio la fuerza lealista abrió fuego al detectar a los patriotas, pero los hombres de Davidson continuaron el ataque incluso después de que su comandante fuera herido y desalojaron a los lealistas del lugar. La síntesis estatal registra dos heridos patriotas y, para los lealistas, tres muertos, cuatro o cinco heridos y diez capturados.",
    consequences: "La victoria local debilitó la disposición de los lealistas de Carolina del Norte a concentrarse abiertamente para unirse a Cornwallis. No decidió la campaña por sí sola, pero formó parte de la erosión del apoyo lealista que limitó la ofensiva británica posterior en el estado.",
    chronology: [
      { year: 1780, event: "Después de la derrota lealista en Ramseur's Mill, grupos lealistas descendieron por el valle del Yadkin con la intención de alcanzar protección británica." },
      { year: 1780, event: "El 21 de julio, Davidson atacó la concentración lealista de Colson's Mill; resultó herido, pero su milicia dispersó a la fuerza opuesta." },
      { year: 1780, event: "La derrota redujo el incentivo para que otros lealistas salieran de la clandestinidad y se incorporaran a una futura ofensiva de Cornwallis." }
    ]
  })
};
