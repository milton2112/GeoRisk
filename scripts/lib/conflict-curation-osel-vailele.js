function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  oselNavalMuseum: source(
    "Museo Naval Central de Rusia: reconstrucci\u00f3n del combate de \u00d6sel de 1719 durante la Gran Guerra del Norte",
    "https://navalmuseum.ru/news?id=723"
  ),
  oselSwedishContext: source(
    "HEM 1719: exposici\u00f3n de historia cultural del archipi\u00e9lago de Estocolmo sobre el marco de la ofensiva rusa de 1719",
    "https://1719.se/hem-1"
  ),
  vaileleHistory: source(
    "History of Samoa, cap\u00edtulo VI: relato hist\u00f3rico de la expedici\u00f3n de Vailele del 18 de diciembre de 1888",
    "https://en.wikisource.org/wiki/History_of_Samoa/Chapter_6"
  ),
  vaileleNavyContext: source(
    "U.S. Naval History and Heritage Command: fuentes primarias sobre la crisis de Apia de 1889 y la intervenci\u00f3n alemana en Samoa",
    "https://www.history.navy.mil/content/history/nhhc/research/library/online-reading-room/title-list-alphabetically/t/typhoons-and-hurricanes-the-storm-at-apia-samoa-15-16-march-1889.html"
  ),
  vaileleArchive: source(
    "National Library of New Zealand: archivo sobre la guerra civil samoana de 1888-1889",
    "https://natlib.govt.nz/records/22632198"
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
    curationBatch: "source-backed-osel-vailele-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const OSEL_VAILELE_CONFLICT_RENAMES = {
  "Batalla de \u00d6sel Island": "Batalla de \u00d6sel (1719)",
  "Primera batalla de Vailele": "Primera batalla de Vailele (1888)"
};

export const OSEL_VAILELE_COUNTRY_CONFLICT_ADDITIONS = {
  Rusia: ["Batalla de \u00d6sel (1719)"],
  Estonia: ["Batalla de \u00d6sel (1719)"],
  Alemania: ["Primera batalla de Vailele (1888)"]
};

export const OSEL_VAILELE_COUNTRY_CONFLICT_EXCLUSIONS = {
  "Estados Unidos": ["Primera batalla de Vailele", "Primera batalla de Vailele (1888)"]
};

export const OSEL_VAILELE_CONFLICT_DETAIL_FIXES = {
  "Batalla de \u00d6sel (1719)": historicalFix({
    parent: "Gran Guerra del Norte",
    campaign: "Operaciones navales de \u00d6sel de 1719",
    region: "Frente a la isla de \u00d6sel/Saaremaa, mar B\u00e1ltico, actual Estonia",
    hierarchySources: [SOURCES.oselNavalMuseum, SOURCES.oselSwedishContext],
    startYear: 1719,
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "regional",
    participants: [
      {
        side: "Escuadron ruso de Naum Seniavin",
        members: ["Flota del B\u00e1ltico del Zarato ruso", "Escuadr\u00f3n de Naum Seniavin", "Nav\u00edos Portsmouth, Devonshire y Natalia"]
      },
      {
        side: "Escuadron sueco de Anton Johan Wrangel",
        members: ["Marina del Imperio sueco", "Escuadr\u00f3n de Anton Johan Wrangel", "Nav\u00edos Wachtmeister, Karlskrona Vapen y Bernhardus"]
      }
    ],
    cause: "En la fase final de la Gran Guerra del Norte, una escuadra rusa sali\u00f3 de Reval para interceptar tres buques suecos que escoltaban mercantes y realizaban reconocimiento en la ruta hacia Estocolmo.",
    outcome: "El 24 de mayo juliano / 4 de junio gregoriano de 1719, la escuadra de Seniavin derrot\u00f3 y captur\u00f3 los tres buques suecos tras un combate de varias horas. Fue una victoria naval rusa, aunque las cifras de bajas y la descripci\u00f3n t\u00e1ctica var\u00edan entre relatos posteriores.",
    consequences: "La captura reforz\u00f3 la presi\u00f3n naval rusa en el B\u00e1ltico durante la etapa final de la guerra. El conflicto se cerr\u00f3 dos a\u00f1os despu\u00e9s con el Tratado de Nystad, sin que esta acci\u00f3n por si sola determinara sus t\u00e9rminos.",
    chronology: [
      { year: 1719, event: "A fines de mayo, la escuadra de Naum Seniavin zarp\u00f3 de Reval con la misi\u00f3n de interceptar una peque\u00f1a fuerza sueca." },
      { year: 1719, event: "El 24 de mayo juliano, equivalente al 4 de junio gregoriano, los destacamentos combatieron frente a \u00d6sel/Saaremaa y los tres buques suecos fueron capturados." },
      { year: 1721, event: "El Tratado de Nystad puso fin a la Gran Guerra del Norte y redefini\u00f3 el equilibrio de poder en el B\u00e1ltico." }
    ],
    treaties: ["Tratado de Nystad (1721)"],
    related: ["Isla de Saaremaa", "Flota del B\u00e1ltico del Zarato ruso"],
    curationNote: "El nombre hist\u00f3rico \u00d6sel se conserva para la acci\u00f3n y Saaremaa identifica la isla actual. Rusia, Suecia y Estonia se ofrecen solo para navegaci\u00f3n contempor\u00e1nea; los participantes son el Zarato ruso y el Imperio sueco. La bibliograf\u00eda usa calendarios distintos para la fecha y no permite fijar una contabilidad \u00fanica de bajas, por lo que la ficha no consolida cifras.",
    sourceDispute: true
  }),
  "Primera batalla de Vailele (1888)": historicalFix({
    parent: "Primera guerra civil de Samoa",
    campaign: "Expedici\u00f3n alemana a Vailele de diciembre de 1888",
    region: "Plantaci\u00f3n de Vailele y Fagali'i, isla de Upolu, Samoa",
    hierarchySources: [SOURCES.vaileleHistory, SOURCES.vaileleNavyContext, SOURCES.vaileleArchive],
    startYear: 1888,
    type: "combate de desembarco",
    conflictType: "colonial",
    scale: "regional",
    participants: [
      {
        side: "Fuerza alemana y partidarios de Tamasese",
        members: ["Marina Imperial Alemana", "Destacamento naval alem\u00e1n", "Fuerzas samoanas de Tamasese"]
      },
      {
        side: "Fuerzas samoanas de Mata'afa Iosefo",
        members: ["Partidarios de Mata'afa Iosefo", "Defensores samoanos de Fagali'i y Vailele"]
      }
    ],
    cause: "Durante la guerra civil samoana, los partidarios de Tamasese y la intervenci\u00f3n alemana planearon desarmar a las fuerzas de Mata'afa Iosefo y recuperar la zona de Vailele.",
    outcome: "El 18 de diciembre, Tamasese no lleg\u00f3 con la fuerza prevista y el destacamento naval alem\u00e1n avanz\u00f3 por su cuenta hacia Vailele. Tras sufrir bajas y quedar bajo fuerte presi\u00f3n, regres\u00f3 a los buques. La acci\u00f3n suele describirse como un rev\u00e9s para la expedici\u00f3n alemana y una victoria de las fuerzas de Mata'afa, sin que las fuentes permitan cerrar una contabilidad \u00fanica de efectivos o bajas.",
    consequences: "El combate debilit\u00f3 la posici\u00f3n alemana en la crisis samoana y agrav\u00f3 la tensi\u00f3n entre los intereses alemanes, brit\u00e1nicos y estadounidenses en Apia. La disputa sigui\u00f3 abierta hasta el arreglo internacional de 1889.",
    chronology: [
      { year: 1888, event: "En septiembre, la rebeli\u00f3n se transform\u00f3 en guerra abierta entre las facciones samoanas de Mata'afa y Tamasese, con intervenci\u00f3n extranjera." },
      { year: 1888, event: "El 18 de diciembre, una fuerza de desembarco alemana intent\u00f3 alcanzar Vailele sin el contingente de Tamasese y se retir\u00f3 tras el combate." },
      { year: 1889, event: "La concentraci\u00f3n de buques de guerra en Apia y la crisis diplom\u00e1tica desembocaron en el Acta General de Berl\u00edn sobre Samoa." }
    ],
    treaties: ["Acta General de Berl\u00edn sobre Samoa (1889)"],
    related: ["Crisis de Apia de 1889", "Mata'afa Iosefo", "Tamasese"],
    curationNote: "La ficha se refiere a la primera batalla de Vailele, de 1888, y no a la segunda de 1899, donde hubo presencia angloestadounidense. Estados Unidos se elimina del enlace de esta acci\u00f3n y Alemania se agrega como referencia de navegaci\u00f3n. Samoa no se presenta como Estado contempor\u00e1neo beligerante: los bandos nombran las fuerzas de \u00e9poca. Las fuentes contempor\u00e1neas y retrospectivas difieren sobre el orden del ataque, la retirada y las bajas, por lo que no se consolidan cifras.",
    sourceDispute: true
  })
};
