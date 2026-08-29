function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const PARENT = "Guerra contra Segismundo";
const CANONICAL = "Batalla de Stegeborg (1598)";
const CAMPAIGN = "Campa\u00f1a de Segismundo en Suecia (1598)";

const SOURCES = {
  soderkopingHistory: source(
    "Municipio de Soderkoping, historia local: el conflicto de 1598 entre el duque Carlos y el rey Segismundo llevo a la batalla de Stegeborg/Skallvik, donde el duque fue derrotado",
    "https://www.soderkoping.se/kultur-fritid/soderkopings-historia/fran-forntid-till-nutid/1500-tal/"
  ),
  linkopingHistory: source(
    "Municipio de Linkoping, contexto historico de Stangebro: Segismundo obtuvo victorias iniciales en Kalmar y Stegeborg antes de que su ejercito quedara debilitado",
    "https://www.linkoping.se/uppleva-och-gora/friluftsliv-och-parker/stangan-kinda-kanal/webbversioner-av-informationstavlor/slaget-vid-stangebro"
  ),
  swedishNationalArchives: source(
    "Archivo Nacional de Suecia, biografia de Joran Posse: participacion en la campana de 1598 y negociaciones posteriores al encuentro de Stegeborg, donde el duque Carlos quedo amenazado de derrota",
    "https://sok.riksarkivet.se/sbl/mobil/Artikel/7395"
  ),
  runebergHistoricalHandbook: source(
    "Proyecto Runeberg, digitalizacion de un manual historico sueco: registra el encuentro de Stegeborg el 8 de septiembre de 1598 bajo el calendario entonces usado en Suecia",
    "https://runeberg.org/skh/0228.html",
    "media"
  )
};

function warAgainstSigismundFix() {
  const hierarchySources = [
    SOURCES.soderkopingHistory,
    SOURCES.linkopingHistory,
    SOURCES.swedishNationalArchives,
    SOURCES.runebergHistoricalHandbook
  ];

  return {
    type: "guerra civil dinastica",
    conflictType: "civil",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1598,
    endYear: 1599,
    region: "Suecia, con conexiones politicas y militares con Polonia-Lituania",
    normalizedRegion: "Suecia, con conexiones politicas y militares con Polonia-Lituania",
    cause: "La disputa enfrento a Segismundo III Vasa, rey de Suecia y de Polonia, con su tio el duque Carlos por el control del gobierno sueco. Las tensiones dinasticas, religiosas y constitucionales desembocaron en una campana armada en Suecia.",
    outcome: "La iniciativa inicial de Segismundo logro victorias tacticas como Stegeborg, pero la recuperacion de Carlos culmino en Stangebro. El resultado politico fue la perdida efectiva del control de Suecia por Segismundo y el fin de la union personal polaco-sueca; la ficha no reduce todo el conflicto al resultado de una sola batalla.",
    consequences: "La guerra reordeno el poder en Suecia y cerro la union personal con Polonia-Lituania. Tambien anticipo una etapa de rivalidad polaco-sueca; esta ficha distingue esa consecuencia de los conflictos posteriores y no los fusiona en una sola guerra continua.",
    chronology: [
      {
        year: 1598,
        event: "Segismundo regreso a Suecia y desarrollo una campana contra las fuerzas del duque Carlos."
      },
      {
        year: 1598,
        event: "La victoria inicial de Segismundo en Stegeborg no resolvio el conflicto; poco despues las fuerzas de Carlos recuperaron la iniciativa en Stangebro."
      },
      {
        year: 1599,
        event: "La derrota politica de Segismundo en Suecia consolido la ruptura de la union personal con Polonia-Lituania."
      }
    ],
    treaties: ["Negociaciones y arreglo politico posteriores a Stangebro (1598-1599), sin tratado bilateral unico en esta ficha"],
    related: ["Segismundo III Vasa", "Carlos IX de Suecia", "Batalla de Stegeborg (1598)", "Batalla de Stangebro", "Union polaco-sueca"],
    participants: [
      {
        side: "Partidarios de Segismundo III Vasa",
        members: ["Segismundo III Vasa", "Union polaco-sueca", "Fuerzas leales al rey"],
        casualties: "No consolidadas para toda la guerra: la ficha no suma recuentos de enfrentamientos distintos ni transforma estimaciones parciales en un total verificable."
      },
      {
        side: "Partidarios del duque Carlos",
        members: ["Carlos, duque de Sodermanland", "Fuerzas suecas leales al duque Carlos"],
        casualties: "No consolidadas para toda la guerra: las fuentes consultadas no ofrecen un parte bilateral homogeno de muertos, heridos, cautivos y efectivos de 1598-1599."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "1598-1599, fase armada principal registrada en la ficha",
    sourceDispute: "Las fuentes coinciden en la campana de 1598, la victoria inicial de Segismundo en Stegeborg y el vuelco posterior en Stangebro. La cronologia de la guerra puede presentarse como 1597-1599 o como su fase armada principal de 1598-1599, y las fechas de combates suecos de 1598 requieren distinguir entre calendario juliano y gregoriano. Por eso la ficha conserva 1598-1599, no convierte las cifras parciales de cada combate en bajas de la guerra y no llama a Polonia o Suecia contemporaneas beligerantes identicos a las entidades dinasticas del periodo.",
    curationPriority: "alta",
    curationBatch: "source-backed-stegeborg-1598-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa de Guerra contra Segismundo tenia fecha pero conservaba causa, resultado, participantes y fuentes genericos, y solo estaba asociada a Suecia. Se completa como conflicto dinastico y civil de 1598-1599; Polonia se agrega como enlace contemporaneo de navegacion por la posicion de Segismundo III y la union polaco-sueca, sin afirmar que el Estado actual sea un beligerante identico a la entidad historica."
  };
}

function stegeborg1598Fix() {
  const hierarchySources = [
    SOURCES.soderkopingHistory,
    SOURCES.linkopingHistory,
    SOURCES.swedishNationalArchives,
    SOURCES.runebergHistoricalHandbook
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla terrestre",
    conflictType: "civil",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1598,
    endYear: 1598,
    region: "Prado cercano al castillo de Stegeborg/Skallvik, \u00d6sterg\u00f6tland, Suecia",
    normalizedRegion: "Prado cercano al castillo de Stegeborg/Skallvik, \u00d6sterg\u00f6tland, Suecia",
    cause: "Durante la campana de Segismundo en Suecia, las fuerzas del rey y las del duque Carlos disputaban el control de posiciones en torno a Stegeborg. El combate formo parte de la lucha por el gobierno sueco y no de una guerra interestatal moderna entre los Estados actuales.",
    outcome: "Victoria tactica de los partidarios de Segismundo III Vasa: las fuentes municipales y archivisticas coinciden en que las fuerzas del duque Carlos quedaron amenazadas de derrota y se abrieron negociaciones. El exito no fue decisivo, porque Carlos recupero la iniciativa y vencio poco despues en Stangebro.",
    consequences: "Stegeborg debilito de forma temporal la posicion del duque Carlos, pero no cerro la Guerra contra Segismundo. La posterior derrota de Segismundo en Stangebro cambio el resultado politico de la campana y de la union personal polaco-sueca.",
    chronology: [
      {
        year: 1598,
        event: "El 8 de septiembre segun el calendario juliano vigente en Suecia, equivalente al 18 de septiembre gregoriano, las fuerzas de Segismundo y del duque Carlos combatieron cerca de Stegeborg."
      },
      {
        year: 1598,
        event: "Tras la victoria inicial de Segismundo, hubo tregua y negociaciones; las fuerzas de Carlos no fueron destruidas."
      },
      {
        year: 1598,
        event: "A fines de septiembre, la campana se desplazo a Stangebro, donde la correlacion militar se invirtio a favor del duque Carlos."
      }
    ],
    treaties: ["Tregua y negociaciones posteriores a Stegeborg (1598), sin tratado de cierre independiente"],
    related: [PARENT, CAMPAIGN, "Stegeborg", "Skallvik", "Segismundo III Vasa", "Carlos, duque de Sodermanland", "Batalla de Stangebro"],
    participants: [
      {
        side: "Partidarios de Segismundo III Vasa",
        members: ["Segismundo III Vasa", "Union polaco-sueca", "Fuerzas leales al rey"],
        casualties: "No consolidadas: la ficha no adopta las cifras parciales atribuidas a cada bando como un balance bilateral definitivo."
      },
      {
        side: "Partidarios del duque Carlos",
        members: ["Carlos, duque de Sodermanland", "Fuerzas suecas leales al duque Carlos"],
        casualties: "No consolidadas: las fuentes institucionales confirman la derrota tactica, pero no ofrecen una tabla comun de bajas, heridos, capturados y efectivos."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "8 de septiembre de 1598 (calendario juliano; 18 de septiembre de 1598 en calendario gregoriano)",
    sourceDispute: "La identidad, el lugar, la campana de 1598 y la victoria tactica de Segismundo estan respaldados por fuentes municipales y archivisticas suecas. La fecha aparece como 8 de septiembre en las fuentes que usan el calendario juliano vigente entonces y como 18 de septiembre al convertirla al calendario gregoriano; por eso ambas referencias se muestran juntas. Los recuentos de efectivos y bajas no son uniformes y la ficha no fija un total ni convierte la victoria tactica en un resultado definitivo de la guerra.",
    curationPriority: "alta",
    curationBatch: "source-backed-stegeborg-1598-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de Stegeborg, carecia de fecha, jerarquia y participantes concretos y quedaba bajo un conflicto regional europeo generico. Se normaliza como Batalla de Stegeborg (1598), dentro de Guerra contra Segismundo. Suecia se conserva como ubicacion y bando interno; Polonia se agrega como enlace contemporaneo por la union personal y el rey Segismundo, sin convertir a los Estados actuales ni a Polonia-Lituania en categorias intercambiables."
  };
}

export const STEGEBORG_1598_CONFLICT_RENAMES = {
  "Batalla de Stegeborg": CANONICAL,
  "Batalla de Stegeborg (1598)": CANONICAL,
  "Battle of Stegeborg": CANONICAL,
  "Slaget vid Stegeborg": CANONICAL,
  "Batalla de Skallvik": CANONICAL
};

export const STEGEBORG_1598_COUNTRY_CONFLICT_ADDITIONS = {
  Polonia: [PARENT, CANONICAL]
};

export const STEGEBORG_1598_CONFLICT_DETAIL_FIXES = {
  [PARENT]: warAgainstSigismundFix(),
  [CANONICAL]: stegeborg1598Fix()
};
