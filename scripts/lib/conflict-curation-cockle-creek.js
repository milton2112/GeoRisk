function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  navyHistory: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: operaciones del USS Louisiana y destrucción de una goleta corsaria en Chincoteague Inlet",
    "https://www.history.navy.mil/research/histories/ship-histories/danfs/l/louisiana-ii.html"
  ),
  navyArchive: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: carta de Murray sobre la destrucción de la goleta confederada y los heridos de Chincoteague Inlet",
    "https://www.history.navy.mil/research/library/manuscripts/h/commander-edward-hooker.html"
  ),
  libraryOfCongress: source(
    "Biblioteca del Congreso de EE. UU.: cronología impresa de la acción de Chincoteague Inlet y sus cuatro heridos federales",
    "https://tile.loc.gov/storage-services/public/gdcmassbookdig/hitchcockschrono01hitc/hitchcockschrono01hitc.pdf"
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
    type: "acción naval",
    conflictType: "civil",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1861,
    endYear: 1861,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology,
    treaties: [],
    related: [...new Set([parent, campaign, "USS Louisiana", "Alexander Murray", "Chincoteague Inlet"].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-chincoteague-inlet-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: true,
    curationNote: "Cockle Creek se conserva como alias de importación. Las fuentes navales sitúan la acción en Chincoteague Inlet, pero una cronología impresa consigna el 4 de octubre y la historia naval de EE. UU. el 5; por eso la ficha muestra solo 1861. Los relatos también difieren en la fuerza opuesta y las bajas, por lo que no presenta cifras cerradas."
  };
}

export const COCKLE_CREEK_CONFLICT_RENAMES = {
  "Batalla de Cockle Creek": "Acción naval de Chincoteague Inlet (1861)",
  "Battle of Cockle Creek": "Acción naval de Chincoteague Inlet (1861)",
  "Accion naval de Chincoteague Inlet (1861)": "Acción naval de Chincoteague Inlet (1861)"
};

export const COCKLE_CREEK_CONFLICT_DETAIL_FIXES = {
  "Acción naval de Chincoteague Inlet (1861)": historicalFix({
    parent: "Guerra Civil estadounidense",
    campaign: "Operaciones del Escuadrón de Bloqueo del Atlántico Norte en Virginia (1861)",
    region: "Chincoteague Inlet, costa oriental de Virginia, Estados Unidos",
    hierarchySources: [SOURCES.navyHistory, SOURCES.navyArchive, SOURCES.libraryOfCongress],
    participants: [
      {
        side: "Armada de la Unión",
        members: ["USS Louisiana", "Teniente Alexander Murray", "Botes del USS Louisiana"]
      },
      {
        side: "Fuerzas confederadas",
        members: ["Goleta confederada en preparación como corsario"]
      }
    ],
    cause: "Durante la Guerra Civil estadounidense, el USS Louisiana operaba con el Escuadrón de Bloqueo del Atlántico Norte para impedir el paso de corredores de bloqueo y atacar sus bases en la costa de Virginia. La acción se dirigió contra una goleta confederada que se preparaba para actuar como corsario en Chincoteague Inlet.",
    outcome: "Los botes del USS Louisiana destruyeron la goleta confederada en preparación como corsario. Las fuentes consultadas no ofrecen un parte táctico completo y discrepan sobre el día y las bajas; por eso la ficha no consolida cifras ni atribuye resultados más amplios que la destrucción de la embarcación.",
    consequences: "La acción se integró en las operaciones de bloqueo de la Unión en la costa de Virginia. Dos días después, el USS Louisiana capturó la goleta S. T. Carrison cerca de Wallops Island, prolongando la presión naval sobre el tráfico confederado de la zona.",
    chronology: [
      { year: 1861, event: "El USS Louisiana se incorporó al Escuadrón de Bloqueo del Atlántico Norte y operó contra corredores de bloqueo en la costa de Virginia." },
      { year: 1861, event: "A comienzos de octubre, los botes del USS Louisiana destruyeron una goleta confederada en preparación como corsario en Chincoteague Inlet." },
      { year: 1861, event: "Dos días después de la acción, el USS Louisiana capturó la goleta S. T. Carrison cerca de Wallops Island." }
    ]
  })
};
