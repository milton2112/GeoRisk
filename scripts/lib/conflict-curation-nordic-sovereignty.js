function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  assandunHistoricEngland: source(
    "Historic England: registro del combate de Assandun o Ashingdon de 1016",
    "https://www.heritagegateway.org.uk/Gateway/Results_Single.aspx?resourceID=19191&uid=f63f5d7a-bb37-476c-8f77-bbc646adce9f"
  ),
  assandunEnglishHeritage: source(
    "English Heritage: Canuto derrota a Edmundo II en Assandun y conmemora la accion",
    "https://www.english-heritage.org.uk/visit/places/1066-battle-of-hastings-abbey-and-battlefield/history-and-stories/the-foundation-of-battle-abbey/"
  ),
  helgeaLex: source(
    "Lex Denmark: fuentes y discrepancias sobre Helgea de 1026",
    "https://lex.dk/Helge%C3%A5n"
  ),
  helgeaRoskildeMuseum: source(
    "Museo de Roskilde: Canuto, las fuerzas noruego-suecas y Helgea de 1026",
    "https://roskildemuseum.dk/events/foredrag-knud-den-store-og-slaget-ved-helgeaa-1026/"
  ),
  largsRothesay: source(
    "Historic Environment Scotland: retirada noruega tras la escaramuza de Largs",
    "https://www.historicenvironment.scot/visit/all/rothesay-castle/history-and-stories/"
  ),
  largsSkipness: source(
    "Historic Environment Scotland: Largs y el Tratado de Perth de 1266",
    "https://www.historicenvironment.scot/visit/all/skipness-castle-and-chapel/history-and-stories/"
  ),
  kringenNationalArchives: source(
    "Archivos Nacionales de Noruega: expedicion escocesa y combate de Kringen de 1612",
    "https://www.nasjonalarkivet.no/skottetoget/"
  ),
  kringenGermanHistoryMuseum: source(
    "Museo Historico Aleman: Kringen como episodio de la Guerra de Kalmar",
    "https://www.dhm.de/archiv/ausstellungen/mythen/norweg.html"
  ),
  bornholmNatureAgency: source(
    "Agencia Danesa de Naturaleza: Roskilde, cesion de Bornholm y contexto de 1658",
    "https://naturstyrelsen.dk/find-et-naturomraade/naturguider/bornholm/hammershus/historie"
  ),
  bornholmVisitDenmark: source(
    "Visit Denmark: levantamiento de Bornholm y fin local del dominio sueco en 1658",
    "https://www.visitdenmark.com/denmark/plan-your-trip/the-printzenskold-stones-gdk1154672"
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
    curationBatch: "source-backed-nordic-sovereignty-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const NORDIC_SOVEREIGNTY_SAFE_CONFLICT_RENAMES = {
  "Batalla de Assandun": "Batalla de Assandun (1016)",
  "Batalla de Helge\u00e5": "Batalla de Helge\u00e5 (1026)",
  "Batalla de Largs": "Batalla de Largs (1263)",
  "Batalla de Kringen": "Batalla de Kringen (1612)",
  "Batalla de Bornholm": "Rebeli\u00f3n de Bornholm (1658)"
};

export const NORDIC_SOVEREIGNTY_COUNTRY_CONFLICT_ADDITIONS = {
  Dinamarca: [
    "Batalla de Assandun (1016)",
    "Batalla de Helge\u00e5 (1026)",
    "Batalla de Kringen (1612)",
    "Rebeli\u00f3n de Bornholm (1658)"
  ],
  Noruega: [
    "Batalla de Helge\u00e5 (1026)",
    "Batalla de Largs (1263)",
    "Batalla de Kringen (1612)"
  ],
  Suecia: [
    "Batalla de Helge\u00e5 (1026)",
    "Batalla de Kringen (1612)",
    "Rebeli\u00f3n de Bornholm (1658)"
  ],
  "Reino Unido": [
    "Batalla de Assandun (1016)",
    "Batalla de Largs (1263)",
    "Batalla de Kringen (1612)"
  ]
};

export const NORDIC_SOVEREIGNTY_CONFLICT_DETAIL_FIXES = {
  "Batalla de Assandun (1016)": historicalFix({
    parent: "Invasion danesa de Inglaterra (1013-1016)",
    campaign: "Campana de Essex de 1016",
    region: "Assandun o Ashingdon/Ashdon, Essex, actual Reino Unido",
    hierarchySources: [SOURCES.assandunHistoricEngland, SOURCES.assandunEnglishHeritage],
    startYear: 1016,
    participants: [
      { side: "Ejercito de Canuto", members: ["Reino de Dinamarca"] },
      { side: "Ejercito de Edmundo II", members: ["Reino de Inglaterra"] }
    ],
    cause: "La invasion danesa de Inglaterra enfrento a Canuto con Edmundo II por el control de la corona inglesa.",
    outcome: "Canuto derroto al ejercito de Edmundo II en un combate de 1016 cuyo lugar exacto sigue debatido.",
    consequences: "La victoria llevo a un reparto temporal del reino; tras la muerte de Edmundo ese mismo ano, Canuto consolido el control de Inglaterra.",
    chronology: [
      { year: 1016, event: "Edmundo II alcanzo a las fuerzas danesas en Essex tras la campana de Canuto." },
      { year: 1016, event: "La derrota inglesa en Assandun abrio el acuerdo politico posterior entre ambos reyes." }
    ],
    curationNote: "Assandun tambien aparece como Ashingdon, Assingdon, Assendun o Ashdon. Las fuentes patrimoniales discrepan sobre el punto preciso en Essex; la ficha conserva una region amplia y evita fijar bajas o coordenadas no consolidadas.",
    sourceDispute: true
  }),
  "Batalla de Helge\u00e5 (1026)": historicalFix({
    parent: "Conflicto escandinavo de Canuto el Grande (1025-1026)",
    campaign: "Operaciones navales de Helge\u00e5 de 1026",
    region: "Helge\u00e5, localizacion debatida entre Escania y Uppland, actual Suecia",
    hierarchySources: [SOURCES.helgeaLex, SOURCES.helgeaRoskildeMuseum],
    startYear: 1026,
    type: "batalla naval",
    participants: [
      { side: "Fuerzas de Canuto", members: ["Reinos de Dinamarca e Inglaterra"] },
      { side: "Fuerzas noruego-suecas", members: ["Reinos de Noruega y Suecia"] }
    ],
    cause: "Canuto intento preservar su predominio en Dinamarca e Inglaterra frente a la cooperacion entre Olaf II de Noruega y Anund Jacobo de Suecia.",
    outcome: "El desenlace no es concluyente: la Cronica anglosajona y la poesia escaldica transmiten resultados distintos.",
    consequences: "El choque ilustra la competencia por la hegemonia escandinava, pero no permite atribuir un cambio territorial o bajas verificadas.",
    chronology: [
      { year: 1026, event: "Las fuerzas vinculadas a Canuto y a los reyes noruego y sueco se enfrentaron cerca de un rio Helge." },
      { year: 1026, event: "Los relatos contemporaneos y posteriores difirieron tanto sobre el resultado como sobre la localizacion del combate." }
    ],
    curationNote: "La fecha puede figurar 1025 o 1026; Helge\u00e5 tambien puede situarse en Escania o Uppland. La ficha conserva 1026, marca la controversia y no convierte asociaciones de paises actuales en identidades estatales medievales.",
    sourceDispute: true
  }),
  "Batalla de Largs (1263)": historicalFix({
    parent: "Expedicion noruega a Escocia occidental (1263)",
    campaign: "Operaciones del fiordo de Clyde de 1263",
    region: "Largs, fiordo de Clyde, actual Reino Unido",
    hierarchySources: [SOURCES.largsRothesay, SOURCES.largsSkipness],
    startYear: 1263,
    participants: [
      { side: "Fuerzas noruegas de Haakon IV", members: ["Reino de Noruega"] },
      { side: "Fuerzas del reino de Escocia", members: ["Reino de Escocia"] }
    ],
    cause: "La expedicion de Haakon IV respondio a la disputa por el control de las islas y de la costa occidental escocesa.",
    outcome: "La accion de Largs fue una escaramuza de resultado tactico discutido; las fuerzas noruegas se retiraron despues de la campana.",
    consequences: "La retirada noruega y la muerte de Haakon facilitaron el arreglo de 1266 que transfirio las Hebridas a la corona escocesa.",
    chronology: [
      { year: 1263, event: "Haakon IV llevo una expedicion noruega al fiordo de Clyde durante la disputa por las islas occidentales." },
      { year: 1263, event: "Tras el choque de Largs, las fuerzas noruegas se replegaron y el rey regreso hacia Orcadas." }
    ],
    treaties: ["Tratado de Perth (1266)"],
    curationNote: "La memoria posterior suele presentar Largs como una victoria absoluta, mientras las fuentes patrimoniales tambien la describen como escaramuza inconclusa. La ficha no consolida cifras ni proyecta Reino Unido o Noruega contemporaneos sobre los beligerantes medievales.",
    sourceDispute: true
  }),
  "Batalla de Kringen (1612)": historicalFix({
    parent: "Guerra de Kalmar (1611-1613)",
    campaign: "Expedicion escocesa hacia Suecia de 1612",
    region: "Kringen, Gudbrandsdalen, actual Noruega",
    hierarchySources: [SOURCES.kringenNationalArchives, SOURCES.kringenGermanHistoryMuseum],
    startYear: 1612,
    type: "emboscada",
    participants: [
      { side: "Milicia local de Dinamarca-Noruega", members: ["Dinamarca-Noruega"] },
      { side: "Mercenarios escoceses al servicio sueco", members: ["Reino de Suecia"] }
    ],
    cause: "Mercenarios escoceses desembarcaron en Noruega para atravesar el territorio y entrar al servicio sueco durante la Guerra de Kalmar.",
    outcome: "La milicia local detuvo y derroto a la columna escocesa en Kringen el 26 de agosto de 1612.",
    consequences: "La derrota impidio que el contingente alcanzara Suecia y convirtio el episodio en una referencia duradera de la memoria noruega.",
    chronology: [
      { year: 1612, event: "La fuerza escocesa desembarco en Romsdalen con el objetivo de marchar hacia Suecia." },
      { year: 1612, event: "Campesinos movilizados de Gudbrandsdalen emboscaron a la columna en Kringen." }
    ],
    treaties: ["Paz de Knared (1613)"],
    curationNote: "Kringen fue una emboscada de milicias locales contra mercenarios que iban a servir a Suecia, no una guerra entre los Estados contemporaneos de Noruega y el Reino Unido. Las cifras de fuerzas y bajas cambian entre relatos y no se presentan como cerradas.",
    sourceDispute: true
  }),
  "Rebeli\u00f3n de Bornholm (1658)": historicalFix({
    parent: "Guerra danesa-sueca de 1658-1660",
    campaign: "Levantamiento de Bornholm de diciembre de 1658",
    region: "Bornholm, actual Dinamarca",
    hierarchySources: [SOURCES.bornholmNatureAgency, SOURCES.bornholmVisitDenmark],
    startYear: 1658,
    type: "levantamiento local",
    participants: [
      { side: "Rebeldes bornholmeses pro-daneses", members: ["Reino de Dinamarca"] },
      { side: "Guarnicion sueca", members: ["Reino de Suecia"] }
    ],
    cause: "El Tratado de Roskilde cedio Bornholm a Suecia y la administracion sueca genero oposicion local durante la reanudacion de la guerra danesa-sueca.",
    outcome: "Los rebeldes eliminaron al comandante Johan Printzenskold y forzaron la rendicion de la guarnicion sueca en diciembre de 1658.",
    consequences: "El levantamiento termino localmente el dominio sueco y ayudo a encauzar el retorno de la isla a Dinamarca en el arreglo de 1660.",
    chronology: [
      { year: 1658, event: "El Tratado de Roskilde cedio Bornholm a Suecia y una guarnicion asumio el control de la isla." },
      { year: 1658, event: "En diciembre, el levantamiento local desarticulo la administracion y la fuerza sueca de Bornholm." }
    ],
    treaties: ["Tratado de Copenhague (1660)"],
    related: ["Segunda guerra del Norte (1655-1660)"],
    curationNote: "El registro se renombra de Batalla de Bornholm a Rebelion de Bornholm para no presentar un levantamiento local como batalla campal. Dinamarca y Suecia se vinculan para navegacion historica, sin reducir los actores de 1658 a Estados contemporaneos."
  })
};
