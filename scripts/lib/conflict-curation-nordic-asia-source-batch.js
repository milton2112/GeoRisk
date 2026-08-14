function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  firstSvensksundRoyalCollection: source(
    "Royal Collection Trust: mapa y ficha de la primera batalla de Svensksund/Ruotsinsalmi del 24 de agosto de 1789",
    "https://militarymaps.rct.uk/other-18th/19th-century-conflicts/map-of-ruotsinsalmi-and-svenskund-1789-ruotsinsalmi-sound-baltic-sea-finland-60deg2800n-26deg5859e"
  ),
  firstSvensksundSwedishArchive: source(
    "Riksarkivet de Suecia: biografia militar con el desarrollo de la primera batalla de Svensksund",
    "https://sok.riksarkivet.se/SBL/Mobil/Artikel/16733"
  ),
  fredrikshamnSwedishMemorials: source(
    "Svenska Militaria Minnesmarken: guerra finlandesa de Gustavo III y ataque naval sueco a Fredrikshamn el 15 de mayo de 1790",
    "https://svmm.se/1789-91-gustaf-iiis-finska-krig-fi07-12/"
  ),
  fredrikshamnHistoricalMuseums: source(
    "Statens historiska museer: medalla contemporanea de Fredrikshamn y Svensksund de 1790",
    "https://samlingar.shm.se/object/B57188C0-0654-41E9-8C89-34108AB9A872"
  ),
  petajasaariYle: source(
    "Yle: reconstruccion de la toma sovietica de Petajasaari el 6 de marzo de 1940",
    "https://yle.fi/a/3-9996452"
  ),
  petajasaariFinnishMilitaryHistory: source(
    "Sociedad Finlandesa de Historia Militar: sitio de la Guerra de Invierno en Petajasaari",
    "https://www.sotahistoriallisetkohteet.fi/app/sights/view/-/id/408/country/9/area/27/"
  ),
  nuiLeAustralianWarMemorial: source(
    "Australian War Memorial: historia de la batalla de Nui Le y de la Operacion Ivanhoe",
    "https://www.awm.gov.au/articles/blog/battle-nui-le"
  ),
  nuiLeAustralianWarMemorialTimeline: source(
    "Australian War Memorial: cronologia del 21 de septiembre de 1971 en Nui Le",
    "https://www.awm.gov.au/articles/atwar/sep"
  ),
  longJawaiAnzacPortal: source(
    "Anzac Portal del Departamento de Veteranos de Australia: contexto y cierre de la Confrontacion Indonesia-Malasia",
    "https://anzacportal.dva.gov.au/wars-and-missions/indonesian-confrontation-1962-1966"
  ),
  longJawaiVeteransAssociation: source(
    "Asociacion de Veteranos de Malaya y Borneo: relato documental de la accion de Long Jawai de 1963",
    "https://www.nmbvaa.org.au/docs/NMBVAA%20SA-NT_Observation%20Post%2005-25.pdf",
    "media"
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
    curationBatch: "source-backed-nordic-asia-followup-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const NORDIC_ASIA_SOURCE_BATCH_SAFE_CONFLICT_RENAMES = {
  "Primera batalla de Svensksund": "Primera batalla de Svensksund (1789)",
  "Segunda batalla de Fredrikshamn": "Batalla de Fredrikshamn (1790)",
  "Batalla de Pet\u00e4j\u00e4saari": "Batalla de Pet\u00e4j\u00e4saari (1940)",
  "Batalla de Nui Le": "Batalla de Nui Le (1971)",
  "Batalla de Long Jawai": "Batalla de Long Jawai (1963)"
};

export const NORDIC_ASIA_SOURCE_BATCH_COUNTRY_CONFLICT_ADDITIONS = {
  Suecia: [
    "Primera batalla de Svensksund (1789)",
    "Batalla de Fredrikshamn (1790)"
  ],
  Rusia: [
    "Primera batalla de Svensksund (1789)",
    "Batalla de Fredrikshamn (1790)",
    "Batalla de Pet\u00e4j\u00e4saari (1940)"
  ],
  Finlandia: [
    "Primera batalla de Svensksund (1789)",
    "Batalla de Fredrikshamn (1790)",
    "Batalla de Pet\u00e4j\u00e4saari (1940)"
  ],
  Australia: ["Batalla de Nui Le (1971)"],
  "Nueva Zelanda": ["Batalla de Nui Le (1971)"],
  Vietnam: ["Batalla de Nui Le (1971)"],
  Indonesia: ["Batalla de Long Jawai (1963)"],
  Malasia: ["Batalla de Long Jawai (1963)"],
  "Reino Unido": ["Batalla de Long Jawai (1963)"]
};

export const NORDIC_ASIA_SOURCE_BATCH_CONFLICT_DETAIL_FIXES = {
  "Primera batalla de Svensksund (1789)": historicalFix({
    parent: "Guerra ruso-sueca (1788-1790)",
    campaign: "Operaciones navales de Svensksund de agosto de 1789",
    region: "Svensksund o Ruotsinsalmi, golfo de Finlandia, cerca de la actual Kotka, Finlandia",
    hierarchySources: [SOURCES.firstSvensksundRoyalCollection, SOURCES.firstSvensksundSwedishArchive],
    startYear: 1789,
    type: "batalla naval",
    participants: [
      { side: "Flota sueca del archipielago", members: ["Reino de Suecia"] },
      { side: "Flotilla rusa del archipielago", members: ["Imperio ruso"] }
    ],
    cause: "Suecia intentaba sostener el control de las aguas del golfo de Finlandia durante la ofensiva de Gustavo III contra Rusia.",
    outcome: "La flotilla rusa forzo la retirada sueca tras irrumpir en la posicion de Svensksund; la accion termino en victoria rusa.",
    consequences: "La derrota altero el equilibrio naval inmediato en el golfo, aunque la guerra continuo hasta el acuerdo de Varala del ano siguiente.",
    chronology: [
      { year: 1789, event: "El 24 de agosto, las flotillas rusa y sueca se enfrentaron en Svensksund, frente a la actual Kotka." },
      { year: 1789, event: "La fuerza rusa atraveso las defensas y la flota sueca se retiro de la posicion." }
    ],
    treaties: ["Tratado de Varala (1790)"],
    curationNote: "Svensksund aparece tambien como Ruotsinsalmi o Rochensalm. Las fuentes suecas usan el 24 de agosto; los relatos rusos pueden usar el 15 de agosto por el calendario juliano. La ficha conserva 1789 y no proyecta la Finlandia independiente sobre los beligerantes de epoca.",
    sourceDispute: true
  }),
  "Batalla de Fredrikshamn (1790)": historicalFix({
    parent: "Guerra ruso-sueca (1788-1790)",
    campaign: "Ofensiva de la flota sueca en el golfo de Finlandia (mayo de 1790)",
    region: "Fredrikshamn, hoy Hamina, golfo de Finlandia, actual Finlandia",
    hierarchySources: [SOURCES.fredrikshamnSwedishMemorials, SOURCES.fredrikshamnHistoricalMuseums],
    startYear: 1790,
    type: "batalla naval",
    participants: [
      { side: "Flota sueca del archipielago", members: ["Reino de Suecia"] },
      { side: "Flotilla rusa del archipielago", members: ["Imperio ruso"] }
    ],
    cause: "Gustavo III ordeno una ofensiva naval contra la flotilla rusa fondeada en Fredrikshamn para recuperar iniciativa en el golfo de Finlandia.",
    outcome: "El ataque sueco del 15 de mayo destruyo o capturo una parte importante de la flotilla rusa y produjo una victoria naval sueca.",
    consequences: "El exito permitio a Suecia prolongar su avance hacia el interior del golfo, pero no decidio por si solo la guerra.",
    chronology: [
      { year: 1790, event: "El 15 de mayo, la flota sueca del archipielago ataco a la fuerza rusa en Fredrikshamn." },
      { year: 1790, event: "Tras la accion, la flota sueca prosiguio hacia el interior del golfo de Finlandia antes de las operaciones de Kronstadt y Viborg." }
    ],
    treaties: ["Tratado de Varala (1790)"],
    related: ["Segunda batalla de Svensksund (1790)"],
    curationNote: "El registro previo la llamaba segunda batalla de Fredrikshamn. Las fuentes consultadas identifican una batalla naval de Fredrikshamn el 15 de mayo de 1790 y distinguen la segunda batalla de Svensksund de julio; por eso se normaliza el nombre sin ordinal y sin fijar un recuento cerrado de naves."
  }),
  "Batalla de Pet\u00e4j\u00e4saari (1940)": historicalFix({
    parent: "Guerra de Invierno",
    campaign: "Combates insulares del noreste del lago Ladoga (marzo de 1940)",
    region: "Pet\u00e4j\u00e4saari, noreste del lago Ladoga, Carelia; territorio finlandes de la epoca, actual Republica de Carelia, Rusia",
    hierarchySources: [SOURCES.petajasaariYle, SOURCES.petajasaariFinnishMilitaryHistory],
    startYear: 1940,
    type: "batalla terrestre",
    participants: [
      { side: "Defensores finlandeses", members: ["Republica de Finlandia"] },
      { side: "Ejercito sovietico", members: ["Union Sovietica"] }
    ],
    cause: "En la fase final de la Guerra de Invierno, las fuerzas sovieticas buscaron tomar las islas que dominaban las rutas y posiciones del noreste del lago Ladoga.",
    outcome: "Las fuerzas sovieticas tomaron Petajasaari el 6 de marzo tras concentrar superioridad de fuego y efectivos sobre la defensa finlandesa.",
    consequences: "La caida de la isla agravo la presion sobre el frente de Carelia pocos dias antes del cierre de la Guerra de Invierno.",
    chronology: [
      { year: 1940, event: "A comienzos de marzo, los combates por las islas del noreste del lago Ladoga se concentraron en Petajasaari." },
      { year: 1940, event: "El 6 de marzo, la fuerza sovietica tomo la isla; el conflicto concluyo dias despues con la paz de Moscu." }
    ],
    treaties: ["Tratado de Paz de Moscu (1940)"],
    curationNote: "La batalla pertenece a la Guerra de Invierno de 1940, no a la Guerra de Finlandia de 1808-1809. Las fuentes coinciden en la toma sovietica del 6 de marzo, pero no consolidan una cifra unica de bajas; la geografia actual se muestra solo como referencia de navegacion.",
    sourceDispute: true
  }),
  "Batalla de Nui Le (1971)": historicalFix({
    parent: "Guerra de Vietnam",
    campaign: "Operacion Ivanhoe (septiembre-octubre de 1971)",
    region: "Nui Le, provincia de Phuoc Tuy, Vietnam del Sur de la epoca, actual Vietnam",
    hierarchySources: [SOURCES.nuiLeAustralianWarMemorial, SOURCES.nuiLeAustralianWarMemorialTimeline],
    startYear: 1971,
    type: "batalla terrestre",
    conflictType: "insurgencia",
    scale: "internacional",
    participants: [
      { side: "Fuerzas australianas y neozelandesas", members: ["Australia", "Nueva Zelanda"] },
      { side: "Fuerzas comunistas vietnamitas", members: ["Ejercito Popular de Vietnam", "Viet Cong"] }
    ],
    cause: "Durante la Operacion Ivanhoe, unidades australianas y neozelandesas buscaron a formaciones comunistas que habian vuelto a operar en Phuoc Tuy.",
    outcome: "Las companias de 4RAR/NZ resistieron una accion intensa en torno a un sistema de bunkeres; las fuerzas comunistas se retiraron antes del amanecer siguiente.",
    consequences: "Nui Le fue la ultima gran accion de combate de tropas australianas en Vietnam antes de la retirada de la fuerza de tarea de Nui Dat.",
    chronology: [
      { year: 1971, event: "El 19 de septiembre, comenzo la Operacion Ivanhoe en el norte de Phuoc Tuy." },
      { year: 1971, event: "El 21 de septiembre, las companias de 4RAR/NZ combatieron en Nui Le contra elementos del 33.er Regimiento norvietnamita." }
    ],
    treaties: ["Acuerdos de Paz de Paris (1973)"],
    curationNote: "La asociacion con Estados Unidos se conserva por el apoyo aereo citado por la fuente, pero los participantes principales se limitan a las fuerzas de 4RAR/NZ y a las fuerzas comunistas vietnamitas. Las fuentes del Memorial difieren entre 24 y 30 heridos australianos segun el corte de la accion, por lo que la ficha no fija una cifra unica.",
    sourceDispute: true
  }),
  "Batalla de Long Jawai (1963)": historicalFix({
    parent: "Confrontacion Indonesia-Malasia (1962-1966)",
    campaign: "Incursion y contraoperaciones en Long Jawai (septiembre-octubre de 1963)",
    region: "Long Jawai, distrito de Belaga, Sarawak, isla de Borneo, actual Malasia",
    hierarchySources: [SOURCES.longJawaiAnzacPortal, SOURCES.longJawaiVeteransAssociation],
    startYear: 1963,
    type: "batalla terrestre",
    participants: [
      { side: "Fuerzas indonesias", members: ["Indonesia"] },
      { side: "Defensores del puesto fronterizo y fuerzas de la Commonwealth", members: ["Reino Unido", "Malasia", "soldados gurkhas del Ejercito britanico"] }
    ],
    cause: "Tras la formacion de Malasia, la Confrontacion paso a incursiones transfronterizas indonesias contra puestos y poblaciones de Sarawak.",
    outcome: "La fuerza indonesia sobrepaso el puesto inicial y los defensores se retiraron; las contraoperaciones gurkhas interceptaron despues a parte de la fuerza durante su repliegue.",
    consequences: "La accion se convirtio en una de las primeras incursiones relevantes en el sector central de Sarawak y reforzo la respuesta de la Commonwealth en la frontera de Borneo.",
    chronology: [
      { year: 1963, event: "El 28 de septiembre, una fuerza indonesia ataco el puesto fronterizo de Long Jawai en Sarawak." },
      { year: 1963, event: "Durante los dias posteriores, refuerzos gurkhas establecieron emboscadas contra elementos de la fuerza que se retiraba hacia la frontera." }
    ],
    treaties: ["Acuerdo de Bangkok entre Indonesia y Malasia (1966)"],
    curationNote: "Long Jawai se ubica en la actual Malasia, pero la defensa de 1963 incluia gurkhas bajo mando britanico y exploradores fronterizos locales. La ficha no añade a Australia como beligerante: las fuentes oficiales situan su despliegue en Borneo desde 1965. Las cifras de bajas y la etiqueta de victoria tactica varian entre relatos, por lo que no se presentan como cerradas.",
    sourceDispute: true
  })
};
