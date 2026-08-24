function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  nationalParkService: source(
    "Servicio de Parques Nacionales de EE. UU.: las fuerzas británicas y estadounidenses se preparaban para combatir el 16 de septiembre de 1777 cuando intervino una lluvia torrencial",
    "https://www.nps.gov/vafo/learn/historyculture/johnlaurens.htm?fullweb=1"
  ),
  armyCampaignHistory: source(
    "Centro de Historia Militar del Ejército de EE. UU.: la marcha hacia la Batalla de las Nubes dentro de la campaña de Filadelfia de 1777",
    "https://history.army.mil/portals/143/Images/Publications/catalog/71-46.pdf"
  ),
  armyUnitHistory: source(
    "Ejército de EE. UU.: la tormenta tropical empapó la pólvora e impidió que ambos ejércitos se vieran al prepararse para la batalla",
    "https://api.army.mil/e2/c/downloads/2025/05/29/205b60af/unit-and-era-history-parade.pdf"
  ),
  pennsylvaniaMarkers: source(
    "Comisión Histórica y de Museos de Pensilvania: marcador histórico de Battle of the Clouds en Frazer",
    "https://www.pa.gov/content/dam/copapwp-pagov/en/phmc/documents/preservation/about/documents/power%20of%20place-digital_live.pdf"
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
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1777,
    endYear: 1777,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology,
    treaties: [],
    related: [...new Set([parent, campaign, "Batalla de Brandywine", "George Washington", "William Howe"].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-clouds-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: true,
    curationNote: "Battle of the Clouds se conserva como alias de importación y se normaliza como Batalla de las Nubes (1777). Las fuentes institucionales coinciden en la fecha, el encuentro de ambos ejércitos y la tormenta que lo interrumpió, pero no sostienen un balance verificable de bajas ni una victoria táctica; por eso la ficha no presenta cifras ni un vencedor."
  };
}

export const CLOUDS_CONFLICT_RENAMES = {
  "Batalla de Clouds": "Batalla de las Nubes (1777)",
  "Battle of the Clouds": "Batalla de las Nubes (1777)",
  "Batalla de las Nubes": "Batalla de las Nubes (1777)"
};

export const CLOUDS_CONFLICT_DETAIL_FIXES = {
  "Batalla de las Nubes (1777)": historicalFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Campaña de Filadelfia de 1777",
    region: "White Horse Tavern, Great Valley, condado de Chester, Pensilvania, Estados Unidos",
    hierarchySources: [
      SOURCES.nationalParkService,
      SOURCES.armyCampaignHistory,
      SOURCES.armyUnitHistory,
      SOURCES.pennsylvaniaMarkers
    ],
    participants: [
      {
        side: "Ejército Continental estadounidense",
        members: ["Ejército Continental de George Washington", "Brigada de John Morin Scott"]
      },
      {
        side: "Ejército británico",
        members: ["Ejército británico de William Howe", "Escaramuzadores y jaegers británicos"]
      }
    ],
    cause: "Tras la derrota estadounidense en Brandywine, George Washington intentó impedir que el ejército de William Howe siguiera avanzando hacia Filadelfia. El 16 de septiembre ambos ejércitos se concentraron en torno a White Horse Tavern, en Great Valley, para un nuevo choque.",
    outcome: "Una tormenta tropical convirtió el terreno en barro, empapó la pólvora y redujo la visibilidad cuando los ejércitos se preparaban para combatir. El enfrentamiento terminó antes de una batalla decisiva y ninguno de los dos ejércitos lo reanudó; la ficha no atribuye una victoria táctica ni consolida bajas.",
    consequences: "Howe continuó hacia los vados del Schuylkill y Washington se retiró hacia Yellow Springs y luego Warwick Furnace para reponer munición. La acción no detuvo la campaña británica contra Filadelfia, pero mostró cómo el clima condicionó las operaciones de septiembre de 1777.",
    chronology: [
      { year: 1777, event: "Después de Brandywine, Washington reagrupó al Ejército Continental para bloquear el avance británico sobre Filadelfia." },
      { year: 1777, event: "El 16 de septiembre, los ejércitos de Washington y Howe se desplegaron cerca de White Horse Tavern mientras escaramuzadores avanzaban entre ambas líneas." },
      { year: 1777, event: "La tormenta tropical interrumpió el combate antes de una batalla decisiva; ningún ejército lo reanudó al día siguiente." }
    ]
  })
};
