function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  colbergerNationalMuseum: source(
    "Museo Nacional de Dinamarca: registro historico de Colberger Heide",
    "https://samlinger.natmus.dk/thm/asset/14130"
  ),
  colbergerVikingMuseum: source(
    "Museo de Barcos Vikingos: guerra naval danesa y sueca durante la Guerra de Torstenson",
    "https://www.vikingeskibsmuseet.dk/en/visit-the-museum/exhibitions/in-smoke-and-flames/essays/essay-by-martin-segschneider"
  ),
  fehmarnVikingMuseum: source(
    "Museo de Barcos Vikingos: combate de Fehmarn y perdida de naves danesas en 1644",
    "https://www.vikingeskibsmuseet.dk/en/professions/maritime-archaeology/maritime-archaeology-projects/missing-for-400-years-archaeologists-discover-missing-17th-century-warship"
  ),
  fehmarnRmg: source(
    "Royal Museums Greenwich: registro de la batalla de Fehmarn de 1644",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-37891"
  ),
  dynekilenSwedishMemorials: source(
    "Museo Sueco de Monumentos Militares: batalla de Dynekilen de 1716",
    "https://svmm.se/1716-slaget-vid-dynekilen/"
  ),
  dynekilenSnl: source(
    "Store norske leksikon: contexto y resultado de la batalla de Dynekilen",
    "https://snl.no/slaget_ved_Dynekilen"
  ),
  grengamRussianMuseum: source(
    "Museo Ruso: Grengam como ultima gran batalla naval de la Gran Guerra del Norte",
    "https://rusmuseumvrm.ru/data/collections/painting/19_20/zh-5587/index.php?lang=en"
  ),
  grengamNavalMuseum: source(
    "Museo Naval de Rusia: conmemoracion y contexto de Grengam",
    "https://navalmuseum.ru/news/memorable?id=824"
  ),
  hoglandSwedishMemorials: source(
    "Museo Sueco de Monumentos Militares: guerra de Gustavo III y operaciones en Finlandia",
    "https://svmm.se/1789-91-gustaf-iiis-finska-krig-fi07-12/"
  ),
  hoglandRoyalCollections: source(
    "Royal Collection Trust: mapa contemporaneo de la batalla naval cerca de Hogland de 1788",
    "https://militarymaps.rct.uk/other-18th/19th-century-conflicts/naval-battle-near-hogland-island-1788-gulf-of-finland-leningrad-russia-60deg0314n-26deg5906e"
  ),
  kircholmPolandGov: source(
    "Gobierno de Polonia: conmemoracion de la batalla de Kircholm de 1605",
    "https://www.gov.pl/web/lotwa/417-ta-rocznica-bitwy-pod-kircholmem"
  ),
  kircholmLandForcesMuseum: source(
    "Museo de las Fuerzas Terrestres de Polonia: la batalla de Kircholm en la historia militar polaca",
    "https://muzeumwl.pl/en/polish-army-between-the-16th-and-19th-century/"
  ),
  kliszowPolishArmyMuseum: source(
    "Museo del Ejercito Polaco: batalla de Kliszow de 1702",
    "https://muzeumwp.pl/timeline/bitwa-pod-kliszowem/"
  ),
  kliszowSwedishMemorials: source(
    "Museo Sueco de Monumentos Militares: ficha de la batalla de Kliszow",
    "https://svmm.se/registerkort-nr-pl04/"
  ),
  gorznoMunicipality: source(
    "Municipio de Gorzno: historia local y batalla de 1629",
    "https://www.gorzno.pl/miasto-i-gmina/historia/"
  ),
  gorznoAcademic: source(
    "Biblioteka Nauki: estudio historico sobre la batalla de Gorzno",
    "https://bibliotekanauki.pl/articles/482823.pdf"
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
    curationBatch: "source-backed-nordic-baltic-followup-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const NORDIC_BALTIC_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Colberger Heide": "Batalla de Colberger Heide (1644)",
  "Batalla de Fehmarn": "Batalla de Fehmarn (1644)",
  "Batalla de Dynekilen": "Batalla de Dynekilen (1716)",
  "Batalla de Grengam": "Batalla de Grengam (1720)",
  "Batalla de Hogland": "Batalla de Hogland (1788)",
  "Batalla de Kircholm": "Batalla de Kircholm (1605)",
  "Batalla de Klisz\u00f3w": "Batalla de Klisz\u00f3w (1702)",
  "Batalla de G\u00f3rzno": "Batalla de G\u00f3rzno (1629)"
};

export const NORDIC_BALTIC_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  Dinamarca: [
    "Batalla de Colberger Heide (1644)",
    "Batalla de Fehmarn (1644)",
    "Batalla de Dynekilen (1716)"
  ],
  Noruega: [
    "Batalla de Colberger Heide (1644)",
    "Batalla de Fehmarn (1644)",
    "Batalla de Dynekilen (1716)"
  ],
  "Reino de los Pa\u00edses Bajos": ["Batalla de Fehmarn (1644)"],
  Rusia: ["Batalla de Grengam (1720)", "Batalla de Hogland (1788)"],
  Polonia: [
    "Batalla de Kircholm (1605)",
    "Batalla de Klisz\u00f3w (1702)",
    "Batalla de G\u00f3rzno (1629)"
  ]
};

export const NORDIC_BALTIC_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Colberger Heide (1644)": historicalFix({
    parent: "Guerra de Torstenson (1643-1645)",
    campaign: "Campa\u00f1a naval del Baltico de 1644",
    region: "Mar Baltico occidental, frente a Kiel",
    hierarchySources: [SOURCES.colbergerNationalMuseum, SOURCES.colbergerVikingMuseum],
    startYear: 1644,
    type: "batalla naval",
    participants: [
      { side: "Flota danesa-noruega", members: ["Reino de Dinamarca y Noruega"] },
      { side: "Flota sueca", members: ["Imperio sueco"] }
    ],
    cause: "Las flotas danesa-noruega y sueca buscaron controlar las rutas del Baltico occidental durante la Guerra de Torstenson.",
    outcome: "El combate de 1644 no produjo una destruccion decisiva; la flota danesa-noruega conservo una ventaja tactica inmediata y Suecia mantuvo su capacidad naval.",
    consequences: "La accion no resolvio la guerra en el mar. La perdida danesa posterior en Fehmarn altero el equilibrio naval antes de la paz de 1645.",
    chronology: [
      { year: 1644, event: "Las flotas sueca y danesa-noruega se encontraron frente a Kiel durante la campa\u00f1a naval del Baltico." },
      { year: 1644, event: "Ninguna escuadra fue destruida, por lo que el resultado tactico siguio siendo objeto de interpretacion." }
    ],
    treaties: ["Tratado de Br\u00f6msebro (1645)"],
    sourceDispute: true,
    curationNote: "La ficha conserva el resultado tactico como no decisivo y separa esta accion de Fehmarn de 1644. Las asociaciones con Dinamarca y Noruega representan la monarquia compuesta de la epoca, no Estados nacionales separados en 1644."
  }),
  "Batalla de Fehmarn (1644)": historicalFix({
    parent: "Guerra de Torstenson (1643-1645)",
    campaign: "Campa\u00f1a naval del Baltico de 1644",
    region: "Cinturon de Fehmarn, mar Baltico occidental",
    hierarchySources: [SOURCES.fehmarnVikingMuseum, SOURCES.fehmarnRmg],
    startYear: 1644,
    type: "batalla naval",
    scale: "internacional",
    participants: [
      { side: "Flota sueco-neerlandesa", members: ["Imperio sueco", "Republica Neerlandesa"] },
      { side: "Flota danesa-noruega", members: ["Reino de Dinamarca y Noruega"] }
    ],
    cause: "Suecia obtuvo apoyo naval neerlandes para desafiar el control danes-noruego de los estrechos y rutas del Baltico occidental.",
    outcome: "La flota sueco-neerlandesa vencio a la escuadra danesa-noruega y capturo o destruyo parte importante de sus buques.",
    consequences: "La derrota debilito la posicion naval danesa-noruega y contribuyo a la presion que condujo al acuerdo de Br\u00f6msebro.",
    chronology: [
      { year: 1644, event: "Las fuerzas suecas y neerlandesas se concentraron en el entorno de Fehmarn contra la flota danesa-noruega." },
      { year: 1644, event: "La victoria sueco-neerlandesa redujo la capacidad de Dinamarca-Noruega para disputar las rutas de los estrechos." }
    ],
    treaties: ["Tratado de Br\u00f6msebro (1645)"],
    curationNote: "Se identifica como Fehmarn de 1644 para evitar homonimos navales. La Republica Neerlandesa se vincula con el actual Reino de los Paises Bajos solo como entrada historica de exploracion."
  }),
  "Batalla de Dynekilen (1716)": historicalFix({
    parent: "Gran Guerra del Norte",
    campaign: "Campa\u00f1a noruega de Carlos XII de 1716",
    region: "Fiordo de Dynekilen, Bohusl\u00e4n, costa noruega",
    hierarchySources: [SOURCES.dynekilenSwedishMemorials, SOURCES.dynekilenSnl],
    startYear: 1716,
    type: "batalla naval",
    participants: [
      { side: "Flotilla danesa-noruega", members: ["Reino de Dinamarca y Noruega"] },
      { side: "Flota de transporte sueca", members: ["Imperio sueco"] }
    ],
    cause: "Carlos XII dependia de suministros embarcados para sostener su ofensiva terrestre contra Noruega durante la Gran Guerra del Norte.",
    outcome: "La flotilla danesa-noruega dirigida por Peter Wessel Tordenskjold capturo o inutilizo el convoy sueco y obtuvo una victoria decisiva local.",
    consequences: "La perdida de pertrechos comprometio la ofensiva sueca sobre Noruega y obligo a reconsiderar su abastecimiento y retirada.",
    chronology: [
      { year: 1716, event: "La flotilla de Tordenskjold entro en Dynekilen para atacar los transportes que abastecian al ejercito sueco." },
      { year: 1716, event: "La captura del convoy dejo sin el suministro previsto a la campa\u00f1a noruega de Carlos XII." }
    ],
    treaties: ["Tratado de Nystad (1721)"],
    sourceDispute: true,
    curationNote: "La accion puede fecharse a fines de junio o comienzos de julio segun el calendario empleado. Se conserva 1716 y se evita transformar la victoria naval en una victoria total de toda la guerra."
  }),
  "Batalla de Grengam (1720)": historicalFix({
    parent: "Gran Guerra del Norte",
    campaign: "Operaciones navales de Aland de 1720",
    region: "Estrecho de Ledsund, islas Aland",
    hierarchySources: [SOURCES.grengamRussianMuseum, SOURCES.grengamNavalMuseum],
    startYear: 1720,
    type: "batalla naval",
    participants: [
      { side: "Flota rusa", members: ["Imperio ruso"] },
      { side: "Flota sueca", members: ["Imperio sueco"] }
    ],
    cause: "Rusia y Suecia buscaban controlar los accesos maritimos de Aland en la fase final de la Gran Guerra del Norte.",
    outcome: "Las fuerzas rusas capturaron cuatro fragatas suecas y lograron una victoria naval que redujo la capacidad sueca de frenar las operaciones en Aland.",
    consequences: "Grengam reforzo la presion negociadora sobre Suecia en los meses anteriores al Tratado de Nystad.",
    chronology: [
      { year: 1720, event: "Las unidades rusas y suecas maniobraron alrededor de los estrechos de Aland durante la ultima fase de la guerra." },
      { year: 1720, event: "La captura de cuatro fragatas suecas dio a Rusia una ventaja naval y diplomatica antes de la paz." }
    ],
    treaties: ["Tratado de Nystad (1721)"],
    sourceDispute: true,
    curationNote: "Las cronologias usan fechas de julio o agosto segun el calendario. La ficha mantiene el hecho comun de la captura de cuatro fragatas, sin extrapolarlo a una medicion unica de bajas."
  }),
  "Batalla de Hogland (1788)": historicalFix({
    parent: "Guerra ruso-sueca (1788-1790)",
    campaign: "Campa\u00f1a naval del golfo de Finlandia de 1788",
    region: "Golfo de Finlandia, cerca de Hogland",
    hierarchySources: [SOURCES.hoglandSwedishMemorials, SOURCES.hoglandRoyalCollections],
    startYear: 1788,
    type: "batalla naval",
    participants: [
      { side: "Flota sueca", members: ["Reino de Suecia"] },
      { side: "Flota rusa", members: ["Imperio ruso"] }
    ],
    cause: "Suecia intento disputar el control del golfo de Finlandia y apoyar los objetivos de la guerra iniciada por Gustavo III contra Rusia.",
    outcome: "El combate resulto tacticamente indeciso: ambas flotas sufrieron danos, y Rusia retuvo la capacidad de operar en el golfo.",
    consequences: "La falta de una victoria sueca clara frustro el objetivo de imponer rapidamente una decision naval sobre San Petersburgo.",
    chronology: [
      { year: 1788, event: "Las flotas sueca y rusa se enfrentaron cerca de la isla de Hogland durante la apertura de la guerra." },
      { year: 1788, event: "Tras la accion, ninguna fuerza logro destruir a la otra ni imponer por si sola el control del golfo." }
    ],
    treaties: ["Tratado de V\u00e4r\u00e4l\u00e4 (1790)"],
    sourceDispute: true,
    curationNote: "La fecha puede aparecer como 6 de julio segun calendario ruso o 17 de julio segun calendario gregoriano. Se conserva un resultado no decisivo para no confundir el balance tactico con los objetivos estrategicos de Suecia."
  }),
  "Batalla de Kircholm (1605)": historicalFix({
    parent: "Guerra polaco-sueca de 1600-1611",
    campaign: "Campa\u00f1a de Livonia de 1605",
    region: "Kircholm, Livonia, actual Salaspils (Letonia)",
    hierarchySources: [SOURCES.kircholmPolandGov, SOURCES.kircholmLandForcesMuseum],
    startYear: 1605,
    participants: [
      { side: "Ejercito de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Ejercito sueco", members: ["Reino de Suecia"] }
    ],
    cause: "La Mancomunidad Polaco-Lituana y Suecia competian por el control politico y militar de Livonia durante la guerra de 1600-1611.",
    outcome: "La caballeria de la Mancomunidad obtuvo una victoria decisiva sobre el ejercito sueco cerca de Riga.",
    consequences: "La victoria no pudo explotarse por completo por las limitaciones financieras y politicas de la Mancomunidad, y la guerra continuo hasta la tregua de 1611.",
    chronology: [
      { year: 1605, event: "El ejercito sueco avanzo hacia Riga y encontro a las fuerzas de la Mancomunidad cerca de Kircholm." },
      { year: 1605, event: "La victoria de la Mancomunidad preservo temporalmente su posicion en Livonia." }
    ],
    treaties: [],
    sourceDispute: true,
    curationNote: "La asociacion con Polonia facilita la exploracion historica, pero la ficha nombra a la Mancomunidad Polaco-Lituana y no atribuye el combate al Estado polaco contemporaneo. Las cifras de fuerzas y bajas varian entre cronologias."
  }),
  "Batalla de Klisz\u00f3w (1702)": historicalFix({
    parent: "Gran Guerra del Norte",
    campaign: "Campa\u00f1a sueca en la Mancomunidad de 1702",
    region: "Kliszow, Peque\u00f1a Polonia",
    hierarchySources: [SOURCES.kliszowPolishArmyMuseum, SOURCES.kliszowSwedishMemorials],
    startYear: 1702,
    participants: [
      { side: "Ejercito sueco", members: ["Imperio sueco"] },
      { side: "Fuerzas polaco-sajonas", members: ["Mancomunidad Polaco-Lituana", "Electorado de Sajonia"] }
    ],
    cause: "Carlos XII intento quebrar el respaldo polaco-sajon a Augusto II dentro de la Gran Guerra del Norte.",
    outcome: "El ejercito sueco obtuvo una victoria sobre las fuerzas de Augusto II y mantuvo la iniciativa en la Mancomunidad.",
    consequences: "La derrota agravo la crisis politica de Augusto II y abrio el camino a nuevas operaciones suecas en Polonia y Sajonia.",
    chronology: [
      { year: 1702, event: "Las fuerzas de Carlos XII enfrentaron al ejercito polaco-sajon cerca de Kliszow." },
      { year: 1702, event: "La victoria sueca reforzo su intervencion en la politica de la Mancomunidad durante la guerra." }
    ],
    treaties: ["Tratado de Altranst\u00e4dt (1706)", "Tratado de Nystad (1721)"],
    curationNote: "La ficha evita convertir al Electorado de Sajonia en Alemania contemporanea. Polonia se mantiene como acceso historico a la Mancomunidad, con la entidad original explicitada entre los participantes."
  }),
  "Batalla de G\u00f3rzno (1629)": historicalFix({
    parent: "Guerra polaco-sueca de 1626-1629",
    campaign: "Campa\u00f1a de Prusia Real de 1629",
    region: "Gorzno, Prusia Real, actual Polonia",
    hierarchySources: [SOURCES.gorznoMunicipality, SOURCES.gorznoAcademic],
    startYear: 1629,
    participants: [
      { side: "Ejercito sueco", members: ["Imperio sueco"] },
      { side: "Ejercito de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] }
    ],
    cause: "Suecia y la Mancomunidad disputaban Prusia Real y Livonia durante la fase final de la guerra polaco-sueca de 1626-1629.",
    outcome: "Las fuerzas suecas derrotaron al ejercito de la Mancomunidad cerca de Gorzno y conservaron la iniciativa en la campa\u00f1a.",
    consequences: "La victoria sueca contribuyo a la presion militar que precedio a la Tregua de Altmark de 1629.",
    chronology: [
      { year: 1629, event: "Las fuerzas suecas y de la Mancomunidad se concentraron en el entorno de Gorzno durante la campa\u00f1a de Prusia Real." },
      { year: 1629, event: "La victoria sueca se produjo poco antes de la negociacion de la Tregua de Altmark." }
    ],
    treaties: ["Tregua de Altmark (1629)"],
    sourceDispute: true,
    curationNote: "Las fuentes locales y academicas pueden fechar los combates entre el 11 y el 12 de febrero. Se registra el ano comun y se identifica a la Mancomunidad Polaco-Lituana en vez de proyectar el Estado polaco actual sobre 1629."
  })
};
