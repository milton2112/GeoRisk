function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  frenchArchive: source(
    "Service historique de la Defense de Francia: documentos sobre el combate naval del 13 de julio de 1795",
    "https://www.servicehistorique.sga.defense.gouv.fr/node?page=154625"
  ),
  maritimeMuseumAction: source(
    "Royal Museums Greenwich: accion frente a las islas Hyeres el 13 de julio de 1795",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-14072"
  ),
  maritimeMuseumPlan: source(
    "Royal Museums Greenwich: plano manuscrito de la accion de Hotham de 1795",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-496261"
  )
};

function historicalFix({
  parent,
  campaign,
  region,
  hierarchySources,
  startYear,
  participants,
  cause,
  outcome,
  consequences,
  chronology,
  type = "batalla naval",
  conflictType = "interestatal",
  scale = "regional",
  treaties = [],
  related = [],
  curationNote,
  sourceDispute = false
}) {
  const sources = Array.isArray(hierarchySources) ? hierarchySources : [hierarchySources];
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
    endYear: startYear,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology,
    treaties,
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence: "alta",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-hyeres-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const HYERES_CONFLICT_RENAMES = {
  "Batalla de Hyeres Islands": "Batalla de las islas Hyères (1795)",
  "Batalla de Hyères Islands": "Batalla de las islas Hyères (1795)",
  "Batalla de las islas Hyeres (1795)": "Batalla de las islas Hyères (1795)"
};

export const HYERES_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": ["Batalla de las islas Hyères (1795)"],
  Italia: ["Batalla de las islas Hyères (1795)"]
};

export const HYERES_CONFLICT_DETAIL_FIXES = {
  "Batalla de las islas Hyères (1795)": historicalFix({
    parent: "Guerra de la Primera Coalición (1792-1797)",
    campaign: "Campaña naval mediterránea de 1793-1796",
    region: "Frente a las islas Hyères, Mediterráneo occidental, Francia",
    hierarchySources: [SOURCES.frenchArchive, SOURCES.maritimeMuseumAction, SOURCES.maritimeMuseumPlan],
    startYear: 1795,
    participants: [
      {
        side: "Escuadra británica y napolitana",
        members: ["Reino de Gran Bretaña", "Reino de Nápoles", "Flota mediterránea de William Hotham"]
      },
      {
        side: "Flota mediterránea francesa",
        members: ["República Francesa", "Flota de Pierre Martin"]
      }
    ],
    cause: "La flota francesa salió de Toulon durante la guerra de la Primera Coalición; la escuadra de William Hotham la persiguió en el Mediterráneo occidental junto con buques napolitanos.",
    outcome: "La acción del 13 de julio dio una ventaja táctica a la escuadra británico-napolitana, pero la mayor parte de la flota francesa logró retirarse a Toulon. No se fijan bajas ni una decisión estratégica concluyente porque los recuentos y la valoración posterior de la acción difieren.",
    consequences: "La acción mantuvo la presión sobre la flota francesa en el Mediterráneo, pero no resolvió la campaña naval. La retirada francesa y la falta de una persecución decisiva alimentaron las críticas contemporáneas a Hotham.",
    chronology: [
      { year: 1795, event: "A comienzos de julio, la escuadra francesa salió de Toulon y fue detectada por elementos de la flota de Hotham." },
      { year: 1795, event: "El 13 de julio, las vanguardias británicas y napolitanas alcanzaron a la flota francesa frente a las islas Hyères." },
      { year: 1795, event: "La flota de Pierre Martin se retiró hacia Toulon; el choque no produjo una decisión naval completa en el Mediterráneo." }
    ],
    related: ["Guerras revolucionarias francesas", "William Hotham", "Horatio Nelson", "Pierre Martin", "Toulon"],
    curationNote: "Reino Unido se enlaza porque la Royal Navy fue beligerante. Italia se incorpora solo como referencia contemporánea del Reino de Nápoles: los participantes conservan las entidades políticas de 1795. Las fuentes institucionales confirman fecha y acción; la ficha evita consolidar bajas o transformar una ventaja táctica en una victoria estratégica decisiva.",
    sourceDispute: true
  })
};
