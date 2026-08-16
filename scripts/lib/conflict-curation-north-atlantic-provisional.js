function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  signalHillParks: source(
    "Parks Canada: cronologia de la toma de Signal Hill y su lugar como ultima batalla del teatro norteamericano de la Guerra de los Siete Anos",
    "https://parks.canada.ca/lhn-nhs/nl/signalhill/culture/histoire-history/def"
  ),
  signalHillDefence: source(
    "Gobierno de Canada: sintesis militar de la Guerra de los Siete Anos en Canada (1756-1763)",
    "https://www.canada.ca/en/services/defence/caf/militaryhistory/wars-operations/seven-years.html"
  ),
  sjaellandsOddeDefence: source(
    "Fuerzas Armadas de Dinamarca: conmemoracion oficial del combate de Sj\u00e6llands Odde del 22 de marzo de 1808",
    "https://www.forsvaret.dk/da/nyhedsarkiv/marinestaben/2008/26-03-2008/"
  ),
  sjaellandsOddeMuseum: source(
    "Museo Naval Real Danes: historia de la Guerra de las Canoneras y perdida del Prinds Christian Frederik frente a Sj\u00e6llands Odde",
    "https://www.marinehist.dk/orlogsbib/J/JensenOrlogsmuseet.pdf"
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
  type = "batalla",
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
    curationBatch: "source-backed-north-atlantic-provisional-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const NORTH_ATLANTIC_PROVISIONAL_CONFLICT_RENAMES = {
  "Batalla de Signal Hill": "Batalla de Signal Hill (1762)",
  "Batalla de Zealand Point": "Batalla de Sjaellands Odde (1808)"
};

export const NORTH_ATLANTIC_PROVISIONAL_COUNTRY_CONFLICT_ADDITIONS = {
  "Canad\u00e1": ["Batalla de Signal Hill (1762)"],
  Noruega: ["Batalla de Sjaellands Odde (1808)"],
  "Reino Unido": ["Batalla de Signal Hill (1762)", "Batalla de Sjaellands Odde (1808)"]
};

export const NORTH_ATLANTIC_PROVISIONAL_CONFLICT_DETAIL_FIXES = {
  "Batalla de Signal Hill (1762)": historicalFix({
    parent: "Guerra de los Siete A\u00f1os (1756-1763)",
    campaign: "Campa\u00f1a de Terranova de 1762",
    region: "Signal Hill y St. John's, Terranova y Labrador, actual Canad\u00e1",
    hierarchySources: [SOURCES.signalHillParks, SOURCES.signalHillDefence],
    startYear: 1762,
    type: "asalto a posicion fortificada",
    conflictType: "colonial",
    scale: "mundial",
    participants: [
      {
        side: "Tropas britanicas de Terranova",
        members: ["Ejercito britanico", "Guarnicion britanica de Terranova"]
      },
      {
        side: "Fuerzas francesas de Terranova",
        members: ["Expedicion francesa de Charles-Henri-Louis d'Arsac de Ternay", "Infanteria francesa de St. John's"]
      }
    ],
    cause: "Tras la captura francesa de St. John's en junio de 1762, las fuerzas britanicas organizaron una contraofensiva para recuperar la altura de Signal Hill y restablecer el control sobre el puerto y la ciudad.",
    outcome: "El asalto britanico del 15 de septiembre sorprendio a la artilleria francesa en Signal Hill. Las fuerzas francesas se retiraron hacia Fort William, que fue tomado poco despues; la accion abrio la recuperacion britanica de St. John's.",
    consequences: "La batalla cerro la fase militar decisiva de la campana de Terranova y fue la ultima accion del teatro norteamericano de la Guerra de los Siete Anos. El Tratado de Paris de 1763 formalizo el arreglo global de la guerra.",
    chronology: [
      { year: 1762, event: "El 24 de junio, una expedicion francesa desembarco en Bay Bulls y sus fuerzas ocuparon St. John's." },
      { year: 1762, event: "El 15 de septiembre, las tropas britanicas de William Amherst atacaron Signal Hill desde el area de Torbay y sorprendieron las posiciones francesas." },
      { year: 1762, event: "Despues del repliegue frances hacia Fort William, los britanicos recuperaron la posicion y reanudaron el control de St. John's." }
    ],
    treaties: ["Tratado de Paris (1763)"],
    related: ["Captura francesa de St. John's (1762)"],
    curationNote: "Signal Hill es el nombre propio historico y actual del lugar. Canada y el Reino Unido se usan para navegacion contemporanea; los participantes se conservan como fuerzas imperiales de 1762 y no equivalen automaticamente a Estados actuales.",
    sourceDispute: true
  }),
  "Batalla de Sjaellands Odde (1808)": historicalFix({
    parent: "Guerra de las Ca\u00f1oneras (1807-1814)",
    campaign: "Operaciones del Kattegat de marzo de 1808",
    region: "Frente a Sj\u00e6llands Odde, Kattegat, actual Dinamarca",
    hierarchySources: [SOURCES.sjaellandsOddeDefence, SOURCES.sjaellandsOddeMuseum],
    startYear: 1808,
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "regional",
    participants: [
      {
        side: "Fuerzas danesas-noruegas",
        members: ["Navio de linea Prinds Christian Frederik", "Marina Real Danesa-Noruega"]
      },
      {
        side: "Fuerzas britanicas",
        members: ["HMS Stately", "HMS Nassau", "Royal Navy"]
      }
    ],
    cause: "En la Guerra de las Canoneras, la flota britanica mantenia el bloqueo de los estrechos daneses. El Prinds Christian Frederik intento proteger los movimientos daneses y aliados en torno al Gran Belt y fue alcanzado por una fuerza britanica superior.",
    outcome: "El 22 de marzo, el Prinds Christian Frederik combatio contra los navios britanicos Stately y Nassau hasta quedar varado frente a Sj\u00e6llands Odde. La nave danesa-noruega arreo la bandera y fue destruida al dia siguiente; la accion fue una victoria tactica britanica.",
    consequences: "La perdida del ultimo navio daneso-noruego de linea en servicio redujo la capacidad de combate convencional de la monarquia y reforzo la dependencia de canoneras y unidades menores durante la guerra naval en los estrechos.",
    chronology: [
      { year: 1807, event: "La captura britanica de la flota danesa cambio el equilibrio naval y dio inicio a la Guerra de las Canoneras." },
      { year: 1808, event: "El 22 de marzo, el Prinds Christian Frederik fue perseguido y enfrento al Stately y al Nassau frente a Sj\u00e6llands Odde." },
      { year: 1808, event: "El buque daneso-noruego quedo varado, arreo la bandera y fue destruido el 23 de marzo despues de evacuar a sus heridos y supervivientes." }
    ],
    treaties: [],
    related: ["Guerras napoleonicas"],
    curationNote: "Sj\u00e6llands Odde es el toponimo danes; Zealand Point es su denominacion inglesa. Dinamarca, Noruega y el Reino Unido son enlaces de navegacion contemporanea, mientras que los participantes reflejan las fuerzas navales de 1808. Las fuentes no ofrecen una tabla de bajas plenamente coincidente, por lo que la ficha no fija cifras.",
    sourceDispute: true
  })
};
