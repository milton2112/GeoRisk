function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  finnishWarOverview: source(
    "Svenska Militarhistoriska Minnesmarken: Guerra de Finlandia de 1808-1809",
    "https://svmm.se/finska-kriget-1808-1809/"
  ),
  bockholmssundMemorial: source(
    "Svenska Militarhistoriska Minnesmarken: combate naval de Bockholmssund de 1808",
    "https://svmm.se/registerkort-nr-fi69/"
  ),
  gronvikssundMemorial: source(
    "Svenska Militarhistoriska Minnesmarken: memorial de Gr\u00f6nvikssund o Isoluoto de 1808",
    "https://svmm.se/category/registerkort/page/39/?action=genpdf&id=7973"
  ),
  kimitoMemorial: source(
    "Svenska Militarhistoriska Minnesmarken: combate del estrecho de Kimito previo a Sandostrom",
    "https://svmm.se/category/registerkort/page/46/?action=genpdf&id=8583"
  ),
  siikajokiMemorial: source(
    "Svenska Militarhistoriska Minnesmarken: batalla de Siikajoki de 1808",
    "https://svmm.se/slaget-vid-siikajoki-1808-fi16/"
  ),
  siikajokiVisitFinland: source(
    "Visit Finland: monumento y contexto de la batalla de Siikajoki",
    "https://www.visitfinland.com/en/product/6f56a659-601b-4181-95df-c08fb6a4e4fa/monument-to-the-battle-of-siikajoki/"
  ),
  napueMemorial: source(
    "Svenska Militarhistoriska Minnesmarken: batalla de Storkyro o Napue de 1714",
    "https://svmm.se/slaget-vid-storkyro-1714-fi04/"
  ),
  napueMuseum: source(
    "Museo de Isokyro y Centro Carolino: Napue como ultima batalla terrestre de la Gran Guerra del Norte en Finlandia",
    "https://www.museiportalosterbotten.fi/museum-a-o-en/museum/69-isokyro-museum-and-carolinian-centre"
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
    curationBatch: "source-backed-finnish-theater-operations-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const FINNISH_THEATER_OPERATIONS_SAFE_CONFLICT_RENAMES = {
  "Batalla de Bockholmssund": "Batalla de Bockholmssund (1808)",
  "Batalla de Gr\u00f6nvikssund": "Batalla de Gr\u00f6nvikssund (1808)",
  "Batalla de Kimito Strait": "Batalla del estrecho de Kimito (1808)",
  "Batalla de Siikajoki": "Batalla de Siikajoki (1808)",
  "Batalla de Napue": "Batalla de Napue (1714)"
};

export const FINNISH_THEATER_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS = {
  Finlandia: [
    "Batalla de Bockholmssund (1808)",
    "Batalla de Gr\u00f6nvikssund (1808)",
    "Batalla del estrecho de Kimito (1808)",
    "Batalla de Siikajoki (1808)",
    "Batalla de Napue (1714)"
  ],
  Rusia: [
    "Batalla de Bockholmssund (1808)",
    "Batalla de Gr\u00f6nvikssund (1808)",
    "Batalla del estrecho de Kimito (1808)",
    "Batalla de Siikajoki (1808)",
    "Batalla de Napue (1714)"
  ]
};

export const FINNISH_THEATER_OPERATIONS_CONFLICT_DETAIL_FIXES = {
  "Batalla de Bockholmssund (1808)": historicalFix({
    parent: "Guerra de Finlandia (1808-1809)",
    campaign: "Operaciones navales del archipielago de \u00c5bo de 1808",
    region: "Bockholmssund o Farskinnsholmarna, archipielago de \u00c5bo, actual Finlandia",
    hierarchySources: [SOURCES.bockholmssundMemorial, SOURCES.finnishWarOverview],
    startYear: 1808,
    type: "batalla naval",
    participants: [
      { side: "Flotilla sueca del archipielago", members: ["Reino de Suecia"] },
      { side: "Flotilla costera rusa", members: ["Imperio ruso"] }
    ],
    cause: "Suecia intento bloquear a la flotilla rusa que operaba cerca de los accesos a \u00c5bo durante la campana naval de 1808.",
    outcome: "El combate nocturno dano buques de ambos bandos sin lograr una ruptura decisiva de la posicion rusa.",
    consequences: "La accion mantuvo abierta la disputa por las rutas costeras de \u00c5bo y antecedio a nuevas operaciones suecas en el archipielago.",
    chronology: [
      { year: 1808, event: "Tras los combates de Rimito Kramp, la fuerza sueca se concentro frente a los accesos de \u00c5bo." },
      { year: 1808, event: "La accion de Bockholmssund concluyo durante la noche sin una decision naval concluyente." }
    ],
    treaties: ["Tratado de Fredrikshamn (1809)"],
    sourceDispute: true,
    curationNote: "Bockholmssund aparece tambien como Farskinnsholmarna o Pukinsaari. Las fuentes describen danos y bajas de manera desigual; la ficha conserva el ano y un resultado local no decisivo, sin fijar cifras cerradas."
  }),
  "Batalla de Gr\u00f6nvikssund (1808)": historicalFix({
    parent: "Guerra de Finlandia (1808-1809)",
    campaign: "Operaciones navales del archipielago de \u00c5bo-Aland de 1808",
    region: "Gr\u00f6nvikssund o Isoluoto, cerca de Kustavi, archipielago de \u00c5bo, actual Finlandia",
    hierarchySources: [SOURCES.gronvikssundMemorial, SOURCES.finnishWarOverview],
    startYear: 1808,
    type: "batalla naval",
    participants: [
      { side: "Flotilla sueca del archipielago", members: ["Reino de Suecia"] },
      { side: "Flotilla rusa", members: ["Imperio ruso"] }
    ],
    cause: "Suecia busco impedir que la flotilla rusa avanzara hacia el norte del archipielago y amenazara las comunicaciones de sus fuerzas terrestres.",
    outcome: "La flotilla sueca obtuvo una victoria local y obligo a la fuerza rusa a retirarse hacia el sur.",
    consequences: "El resultado retraso la presion rusa sobre las aguas septentrionales del archipielago, sin cambiar el desenlace general de la guerra.",
    chronology: [
      { year: 1808, event: "La flota rusa recibio refuerzos tras las operaciones de Sandostrom y amenazo las rutas hacia el norte." },
      { year: 1808, event: "La escuadra sueca alcanzo a la flotilla rusa cerca de Gr\u00f6nvikssund y sostuvo un duelo de artilleria de varias horas." }
    ],
    treaties: ["Tratado de Fredrikshamn (1809)"],
    curationNote: "Gr\u00f6nvikssund se registra tambien como Isoluoto en la conmemoracion finlandesa. La ficha conserva la victoria sueca y evita consolidar los recuentos de naves, efectivos y bajas que difieren entre relatos."
  }),
  "Batalla del estrecho de Kimito (1808)": historicalFix({
    parent: "Guerra de Finlandia (1808-1809)",
    campaign: "Operaciones navales del archipielago de \u00c5bo de 1808",
    region: "Estrecho de Kimito, archipielago de \u00c5bo, actual Finlandia",
    hierarchySources: [SOURCES.kimitoMemorial, SOURCES.finnishWarOverview],
    startYear: 1808,
    type: "combate naval",
    participants: [
      { side: "Flotilla sueca del archipielago", members: ["Reino de Suecia"] },
      { side: "Flotilla rusa", members: ["Imperio ruso"] }
    ],
    cause: "Las fuerzas suecas preparaban defensas en el estrecho de Kimito para frenar la progresion costera rusa hacia el archipielago occidental.",
    outcome: "La presion rusa en el estrecho obligo a la fuerza sueca a replegarse hacia una linea defensiva mas estrecha en torno a Sandostrom.",
    consequences: "El combate condiciono la disposicion sueca antes de las acciones de Sandostrom y de los intentos de desembarco posteriores.",
    chronology: [
      { year: 1808, event: "Suecia concentro medios navales y defensas costeras en los pasos del archipielago de \u00c5bo." },
      { year: 1808, event: "El combate menor del estrecho de Kimito llevo a una retirada sueca hacia la posicion de Sandostrom." }
    ],
    treaties: ["Tratado de Fredrikshamn (1809)"],
    curationNote: "El registro se traduce de Kimito Strait a estrecho de Kimito para eliminar el rotulo ingles. Se refiere al combate de julio de 1808 previo a Sandostrom y no a una operacion terrestre posterior en la isla."
  }),
  "Batalla de Siikajoki (1808)": historicalFix({
    parent: "Guerra de Finlandia (1808-1809)",
    campaign: "Contraofensiva sueca-finlandesa de primavera de 1808",
    region: "Siikajoki, Ostrobotnia, actual Finlandia",
    hierarchySources: [SOURCES.siikajokiMemorial, SOURCES.siikajokiVisitFinland],
    startYear: 1808,
    type: "batalla terrestre",
    participants: [
      { side: "Ejercito sueco-finlandes", members: ["Reino de Suecia"] },
      { side: "Vanguardia rusa", members: ["Imperio ruso"] }
    ],
    cause: "Tras el repliegue sueco desde el sur de Finlandia, las fuerzas de Carl Johan Adlercreutz buscaron detener la persecucion rusa cerca de Siikajoki.",
    outcome: "Las fuerzas sueco-finlandesas derrotaron a la vanguardia rusa y frenaron temporalmente su avance.",
    consequences: "La victoria abrio un margen para la contraofensiva local de primavera, aunque no revirtio el resultado general de la guerra.",
    chronology: [
      { year: 1808, event: "El mando sueco se retiro hacia el norte mientras buscaba reforzar sus tropas en Finlandia." },
      { year: 1808, event: "Adlercreutz intervino en Siikajoki y las fuerzas sueco-finlandesas vencieron a la vanguardia rusa." }
    ],
    treaties: ["Tratado de Fredrikshamn (1809)"],
    curationNote: "Las fuentes describen a las tropas como sueco-finlandesas; la ficha conserva al Reino de Suecia como beligerante de epoca y vincula Finlandia como acceso geografico e historico, no como Estado independiente en 1808."
  }),
  "Batalla de Napue (1714)": historicalFix({
    parent: "Gran Guerra del Norte",
    campaign: "Campana de Finlandia de 1713-1714",
    region: "Napue o Storkyro, Isokyro, Ostrobotnia, actual Finlandia",
    hierarchySources: [SOURCES.napueMemorial, SOURCES.napueMuseum],
    startYear: 1714,
    type: "batalla terrestre",
    participants: [
      { side: "Ejercito sueco-finlandes", members: ["Imperio sueco"] },
      { side: "Ejercito ruso", members: ["Imperio ruso"] }
    ],
    cause: "Rusia continuo su ofensiva en Finlandia tras ocupar gran parte del territorio durante la Gran Guerra del Norte.",
    outcome: "El ejercito ruso derroto decisivamente a las fuerzas de Carl Gustaf Armfeldt en Napue.",
    consequences: "La derrota redujo la capacidad sueca de sostener una defensa organizada en Finlandia y consolido la ocupacion rusa del teatro.",
    chronology: [
      { year: 1714, event: "Las fuerzas de Armfeldt se concentraron cerca de Storkyro para responder a la ofensiva rusa hacia Ostrobotnia." },
      { year: 1714, event: "El contraataque ruso envolvio las posiciones sueco-finlandesas y decidio la batalla." }
    ],
    treaties: ["Tratado de Nystad (1721)"],
    sourceDispute: true,
    curationNote: "Napue tambien aparece como Storkyro, Isokyro o Lappola. La fecha puede figurar como 19 de febrero o 2 de marzo segun el calendario; la ficha conserva 1714 y no proyecta una Finlandia independiente sobre los beligerantes de la epoca."
  })
};
