function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  biddleProfile: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: Nicholas Biddle y el combate frente a Barbados del 7 de marzo de 1778",
    "https://www.history.navy.mil/our-collections/art/travelling-exhibits/the-american-navy-in-the-revolutionary-war/captain-nicholas-biddle.html"
  ),
  randolphHistory: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: historia operativa de la fragata continental Randolph",
    "https://www.history.navy.mil/research/histories/ship-histories/danfs/r/randolph-i.html"
  ),
  navalAnalysis: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: análisis de las operaciones navales globales de 1778",
    "https://www.history.navy.mil/about-us/leadership/director/directors-corner/h-grams/h-gram-094/h-094-2.html"
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
    type: "combate naval",
    conflictType: "independencia",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1778,
    endYear: 1778,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology,
    treaties: [],
    related: [...new Set([parent, campaign, "Nicholas Biddle", "Randolph", "HMS Yarmouth"].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-barbados-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: true,
    curationNote: "Reino Unido se incorpora como referencia contemporánea de la Royal Navy; los participantes conservan las denominaciones navales e históricas de 1778. Las fuentes institucionales coinciden en la fecha, los buques y la destrucción de la Randolph, pero señalan que la secuencia precisa del combate no es idéntica en todos los relatos; por eso no se atribuye una causa definitiva a la explosión."
  };
}

export const BARBADOS_CONFLICT_RENAMES = {
  "Batalla de Barbados": "Combate naval frente a Barbados (1778)",
  "Battle off Barbados": "Combate naval frente a Barbados (1778)"
};

export const BARBADOS_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": ["Combate naval frente a Barbados (1778)"]
};

export const BARBADOS_CONFLICT_DETAIL_FIXES = {
  "Combate naval frente a Barbados (1778)": historicalFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Operaciones de la Randolph en el Caribe (1778)",
    region: "Al este de Barbados, mar Caribe",
    hierarchySources: [SOURCES.biddleProfile, SOURCES.randolphHistory, SOURCES.navalAnalysis],
    participants: [
      {
        side: "Escuadra continental estadounidense",
        members: ["Fragata continental Randolph", "Capitán Nicholas Biddle", "General Moultrie", "Notre Dame", "Fair American", "Polly"],
        casualties: "311 muertos; 4 supervivientes de los 315 tripulantes de la Randolph"
      },
      {
        side: "Royal Navy británica",
        members: ["HMS Yarmouth (64 cañones)", "Capitán Nicholas Vincent"]
      }
    ],
    cause: "Tras salir de Charleston con mercantes y buques de Carolina del Sur para evadir el bloqueo británico, la escuadra de la Randolph navegó hacia el Caribe. El 7 de marzo de 1778, el HMS Yarmouth detectó a la formación al este de Barbados y la persiguió.",
    outcome: "La Randolph se enfrentó al HMS Yarmouth para facilitar la dispersión de los otros buques estadounidenses. Durante el combate explotó su santabárbara y la fragata fue destruida: hubo 311 muertos entre sus 315 tripulantes, incluido Nicholas Biddle. Los demás buques de la escuadra lograron escapar en la oscuridad.",
    consequences: "La pérdida de la Randolph eliminó una fragata continental y causó una de las mayores pérdidas humanas de la Marina estadounidense durante la guerra. El choque no resolvió la campaña caribeña, pero permitió que los otros buques asociados a la misión evitaran la captura inmediata.",
    chronology: [
      { year: 1778, event: "El 14 de febrero, la Randolph y los buques bajo el mando de Nicholas Biddle salieron de Carolina del Sur rumbo al Caribe." },
      { year: 1778, event: "El 7 de marzo, el HMS Yarmouth alcanzó a la escuadra al este de Barbados y la Randolph quedó atrás para combatir." },
      { year: 1778, event: "La explosión de la santabárbara destruyó la Randolph; los otros buques estadounidenses se dispersaron y evitaron la persecución británica inmediata." }
    ]
  })
};
