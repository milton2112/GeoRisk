function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  nevaChronicle: source(
    "University of Washington: traduccion de la Cronica de Novgorod con el registro del combate del Neva de 1240",
    "https://faculty.washington.edu/dwaugh/rus/texts/MF1914.pdf"
  ),
  nevaScholarship: source(
    "Instituto de Arqueologia y Etnologia de la Academia Polaca de Ciencias: estudio sobre la batalla del Neva de 1240",
    "https://rcin.org.pl/dlibra/publication/33365/edition/20467/content"
  ),
  shanhaiguanScholarship: source(
    "Hong Kong Baptist University: estudio revisado por pares sobre la campana de Shanhaiguan-Rehe de 1924",
    "https://scholars.hkbu.edu.hk/en/publications/%E5%B0%8B%E6%B1%82%E6%B1%BA%E5%AE%9A%E6%80%A7%E6%88%B01924%E5%B9%B4%E7%AC%AC%E4%BA%8C%E6%AC%A1%E7%9B%B4%E5%A5%89%E6%88%B0%E7%88%AD%E7%9A%84%E7%86%B1%E6%B2%B3%E5%B1%B1%E6%B5%B7%E9%97%9C%E6%88%B0%E5%BD%B9/"
  ),
  shanhaiguanSpanishStudy: source(
    "Universidad Rey Juan Carlos: estudio de la Segunda guerra Zhili-Fengtian de 1924",
    "https://guerracolonial.oa.urjc.es/index.php/gc/article/view/22/82"
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
    curationBatch: "source-backed-neva-shanhaiguan-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const NEVA_SHANHAIGUAN_CONFLICT_RENAMES = {
  "Batalla del Neva": "Batalla del Neva (1240)",
  "Batalla de Shanhaiguan": "Campana de Shanhaiguan-Rehe (1924)"
};

export const NEVA_SHANHAIGUAN_COUNTRY_CONFLICT_ADDITIONS = {
  Rusia: ["Batalla del Neva (1240)"],
  "Republica Popular China": ["Campana de Shanhaiguan-Rehe (1924)"]
};

export const NEVA_SHANHAIGUAN_COUNTRY_CONFLICT_EXCLUSIONS = {
  "Estados Unidos": ["Batalla de Shanhaiguan", "Campana de Shanhaiguan-Rehe (1924)"]
};

export const NEVA_SHANHAIGUAN_CONFLICT_DETAIL_FIXES = {
  "Batalla del Neva (1240)": historicalFix({
    parent: "Guerras sueco-novgorodenses",
    campaign: "Incursion sueca en el Neva de 1240",
    region: "Rio Neva, cerca de Ust-Izhora, actual Rusia",
    hierarchySources: [SOURCES.nevaChronicle, SOURCES.nevaScholarship],
    startYear: 1240,
    type: "batalla fronteriza",
    conflictType: "frontera",
    scale: "regional",
    participants: [
      {
        side: "Fuerzas de la Republica de Novgorod",
        members: ["Republica de Novgorod", "Destacamentos de Ladoga y aliados carelios"]
      },
      {
        side: "Fuerza sueca citada por las cronicas rusas",
        members: ["Reino de Suecia", "Contingentes finlandeses, tavastianos y noruegos citados por la tradicion cronistica"]
      }
    ],
    cause: "La accion se inserto en la competencia sueco-novgorodense por las rutas del Neva, Carelia y las zonas de influencia del Baltico oriental.",
    outcome: "La Cronica de Novgorod atribuye una victoria a las fuerzas de Alejandro de Novgorod el 15 de julio de 1240. La escala, los mandos y la composicion exacta de la fuerza sueca siguen discutidos porque no hay un relato sueco contemporaneo equivalente.",
    consequences: "El episodio quedo integrado en la memoria politica de Novgorod y en la rivalidad fronteriza medieval. No permite fijar bajas, una conquista territorial ni una consecuencia estrategica unica con el nivel de certeza de una campana documentada por ambas partes.",
    chronology: [
      { year: 1240, event: "El 15 de julio, segun la Cronica de Novgorod, las fuerzas de Alejandro Yaroslavich atacaron una fuerza sueca en el Neva." },
      { year: 1240, event: "La tradicion novgorodense asocio la victoria con el sobrenombre Nevsky de Alejandro; la magnitud del combate sigue siendo objeto de debate historiografico." }
    ],
    related: ["Alejandro de Novgorod", "Carelia"],
    curationNote: "Suecia y Rusia se enlazan para navegacion contemporanea, pero los participantes se mantienen como entidades medievales. La ficha no convierte una unica cronica en certeza absoluta: el registro sueco falta y la investigacion discute si fue una gran invasion o una escaramuza fronteriza.",
    sourceDispute: true
  }),
  "Campana de Shanhaiguan-Rehe (1924)": historicalFix({
    parent: "Segunda guerra Zhili-Fengtian",
    campaign: "Campana de Shanhaiguan-Rehe de 1924",
    region: "Paso de Shanhaiguan y Rehe/Jehol, norte de China",
    hierarchySources: [SOURCES.shanhaiguanScholarship, SOURCES.shanhaiguanSpanishStudy],
    startYear: 1924,
    type: "campana terrestre",
    conflictType: "civil",
    scale: "regional",
    participants: [
      {
        side: "Camarilla de Zhili",
        members: ["Fuerzas de la camarilla de Zhili", "Ejercito de Wu Peifu"]
      },
      {
        side: "Camarilla de Fengtian",
        members: ["Fuerzas de la camarilla de Fengtian", "Ejercito de Zhang Zuolin"]
      }
    ],
    cause: "Las camarillas de Zhili y Fengtian disputaban el control del gobierno de Beiyang y de las rutas entre Manchuria y el norte de China durante la era de los senores de la guerra.",
    outcome: "Los combates de Shanhaiguan-Rehe desgastaron a ambos bandos sin una decision local inmediata. El golpe de Pekin de Feng Yuxiang altero el equilibrio de la guerra y contribuyo a la derrota posterior de la camarilla de Zhili.",
    consequences: "La campana ilustro la fragmentacion militar de la Republica de China y acelero la recomposicion del poder en Pekin. Estados Unidos no se presenta como beligerante: las referencias a intereses empresariales angloestadounidenses no equivalen a una participacion militar estatal.",
    chronology: [
      { year: 1924, event: "El 15 de septiembre comenzo la Segunda guerra Zhili-Fengtian y los frentes de Shanhaiguan y Rehe se volvieron decisivos para el acceso desde Manchuria." },
      { year: 1924, event: "Durante septiembre y octubre, los dos ejercitos se desgastaron en la campana alrededor del paso de Shanhaiguan." },
      { year: 1924, event: "El golpe de Pekin de Feng Yuxiang cambio el equilibrio politico-militar y precipito el desenlace adverso para Zhili." }
    ],
    related: ["Era de los senores de la guerra en China", "Feng Yuxiang", "Zhang Zuolin", "Wu Peifu"],
    curationNote: "La fuente academica describe una campana de Shanhaiguan-Rehe, por eso el registro se renombra y no se presenta como una batalla aislada. La Republica Popular China se agrega solo como referencia geografica contemporanea; los participantes son las camarillas de 1924. Estados Unidos se elimina porque no fue beligerante en la campana.",
    sourceDispute: true
  })
};
