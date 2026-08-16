function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  campecheUsNavy: source(
    "U.S. Naval History and Heritage Command: historia del sloop Austin y los combates frente a Campeche de abril y mayo de 1843",
    "https://www.history.navy.mil/research/histories/ship-histories/danfs/a/austin-i.html"
  ),
  campecheMexicanNavy: source(
    "Secretaria de Marina de Mexico: estudio historico sobre la escuadrilla de Tomas Marin y la accion naval de Campeche de mayo de 1843",
    "https://www.semar.gob.mx/unhicun/publicaciones_historicas/militares_y_marinos.pdf"
  ),
  antivariNavalHistory: source(
    "Naval-History.net: cronologia de la guerra naval mediterranea de 1914 y combate frente a Antivari del 16 de agosto",
    "https://www.naval-history.net/WW1AreaMed1914-18.htm"
  ),
  antivariMilitaryHistory: source(
    "Hadtortenelmi Kozlemenyek: estudio archivistico sobre la tripulacion del SMS Zenta hundido el 16 de agosto de 1914",
    "https://epa.oszk.hu/00000/00018/00060/pdf/EPA00018_hadtortenelmi_2009_03.pdf"
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
    curationBatch: "source-backed-campeche-antivari-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const CAMPECHE_ANTIVARI_CONFLICT_RENAMES = {
  "Batalla de Campeche": "Batalla naval de Campeche (1843)",
  "Batalla de Antivari": "Batalla de Antivari (1914)"
};

export const CAMPECHE_ANTIVARI_COUNTRY_CONFLICT_ADDITIONS = {
  Austria: ["Batalla de Antivari (1914)"],
  "Estados Unidos": ["Batalla naval de Campeche (1843)"],
  "Hungr\u00eda": ["Batalla de Antivari (1914)"],
  Montenegro: ["Batalla de Antivari (1914)"],
  "Reino Unido": ["Batalla de Antivari (1914)"]
};

export const CAMPECHE_ANTIVARI_CONFLICT_DETAIL_FIXES = {
  "Batalla naval de Campeche (1843)": historicalFix({
    parent: "Conflicto entre el gobierno central de M\u00e9xico y Yucat\u00e1n",
    campaign: "Bloqueo naval de Campeche de 1843",
    region: "Sonda de Campeche, golfo de M\u00e9xico",
    hierarchySources: [SOURCES.campecheUsNavy, SOURCES.campecheMexicanNavy],
    startYear: 1843,
    type: "batalla naval",
    conflictType: "civil",
    scale: "regional",
    participants: [
      {
        side: "Armada mexicana",
        members: ["Vapores Guadalupe y Moctezuma", "Escuadrilla de Tomas Marin"]
      },
      {
        side: "Escuadra texano-yucateca",
        members: ["Austin", "Wharton", "Buques auxiliares yucatecos"]
      }
    ],
    cause: "El gobierno central mexicano mantenia un bloqueo sobre la costa de Yucatan, mientras buques de la Republica de Texas y fuerzas yucatecas intentaban sostener el acceso a Campeche frente a la escuadrilla mexicana.",
    outcome: "Los enfrentamientos del 30 de abril y 16 de mayo produjeron danos en ambos bandos sin un desenlace comunmente aceptado. Las fuentes mexicanas y estadounidenses difieren al valorar la retirada y el efecto operativo, por lo que la ficha no fija una victoria absoluta.",
    consequences: "La accion mantuvo abierto el acceso naval a Campeche en el corto plazo y se integro en las negociaciones entre Mexico y Yucatan. No se presenta como el cierre politico del conflicto ni se atribuye a la batalla un tratado propio.",
    chronology: [
      { year: 1843, event: "El 15 de abril, los buques texanos Austin y Wharton zarparon hacia la costa de Yucatan durante el bloqueo mexicano." },
      { year: 1843, event: "El 30 de abril, la escuadra texano-yucateca se enfrento a la escuadrilla mexicana entre Lerma y Campeche." },
      { year: 1843, event: "El 16 de mayo, una segunda accion naval frente a Campeche causo danos en ambos bandos y cerro la fase principal registrada del combate." }
    ],
    treaties: [],
    related: ["Republica de Texas", "Negociaciones entre Mexico y Yucatan de 1843"],
    curationNote: "Estados Unidos se usa como enlace de navegacion por la Republica de Texas de 1843, no como participante contemporaneo. Las fuentes discrepan sobre la valoracion tactica y algunas bajas; por eso la ficha conserva los actores de epoca, no fija cifras y evita declarar un vencedor total.",
    sourceDispute: true
  }),
  "Batalla de Antivari (1914)": historicalFix({
    parent: "Primera Guerra Mundial",
    campaign: "Operaciones navales de la Entente en el Adriatico (agosto de 1914)",
    region: "Frente a Antivari, actual Bar, y Castellastua, costa de Montenegro, mar Adriatico",
    hierarchySources: [SOURCES.antivariNavalHistory, SOURCES.antivariMilitaryHistory],
    startYear: 1914,
    type: "combate naval",
    conflictType: "interestatal",
    scale: "mundial",
    participants: [
      {
        side: "Fuerzas navales franco-britanicas",
        members: ["Flota francesa del Mediterraneo", "Royal Navy"]
      },
      {
        side: "Fuerzas navales austrohungaras",
        members: ["SMS Zenta", "SMS Ulan", "Marina Imperial y Real Austrohungara"]
      }
    ],
    cause: "Al inicio de la Primera Guerra Mundial, fuerzas austrohungaras bloqueaban la costa montenegrina. Una escuadra franco-britanica entro al Adriatico para desafiar ese bloqueo y buscar contacto con las unidades enemigas.",
    outcome: "El 16 de agosto, el crucero SMS Zenta fue hundido frente a la costa de Montenegro, mientras el destructor SMS Ulan consiguio retirarse. La accion fue una ventaja tactica para la Entente, sin resolver por si sola la campana naval del Adriatico.",
    consequences: "El combate inicio una secuencia de operaciones de la Entente para apoyar a Montenegro y presionar el litoral austrohungaro. El Adriatico siguio siendo un teatro disputado durante la guerra.",
    chronology: [
      { year: 1914, event: "En las primeras semanas de guerra, unidades austrohungaras realizaron el bloqueo de la costa de Montenegro y de Antivari." },
      { year: 1914, event: "El 16 de agosto, una fuerza franco-britanica encontro al SMS Zenta y al SMS Ulan frente a la costa montenegrina." },
      { year: 1914, event: "El SMS Zenta fue hundido cerca de Castellastua; el SMS Ulan se retiro, mientras continuaron las operaciones navales en el Adriatico." }
    ],
    treaties: [],
    related: ["Bloqueo austrohungaro de la costa de Montenegro (1914)"],
    curationNote: "Antivari es el nombre historico de Bar. Austria, Hungria, Montenegro y Reino Unido se usan como enlaces de navegacion contemporanea; los bandos describen las marinas de 1914. La bibliografia difiere sobre la dotacion y las bajas del SMS Zenta, por lo que la ficha no consolida una cifra unica.",
    sourceDispute: true
  })
};
