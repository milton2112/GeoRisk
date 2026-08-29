function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  swedishMilitaryMemorial: source(
    "Svenska Milit\u00e4ra Minnesm\u00e4rken, registro del monumento de Kaipiais: fecha, contexto de la guerra de Gustavo III, mando de Kaulbars y derrota sueca",
    "https://svmm.se/registerkort-nr-fi35/"
  ),
  mankellRegimentalHistory: source(
    "Project Runeberg, digitalizaci\u00f3n de Julius Mankell: artiller\u00eda empleada en el combate de Kaipiais el 15 de julio de 1789",
    "https://runeberg.org/mjantreg/0159.html"
  ),
  kaulbarsBiography: source(
    "Project Runeberg, biograf\u00eda de Lars Fredrik von Kaulbars: retroceso desde Kaipiais ante una fuerza rusa superior y efecto sobre la posici\u00f3n sueca",
    "https://runeberg.org/smok/4/0245.html"
  )
};

const PARENT = "Guerra ruso-sueca (1788-1790)";
const CAMPAIGN = "Operaciones terrestres en Finlandia durante la guerra ruso-sueca (1789)";

function kaipiais1789Fix() {
  const hierarchySources = [
    SOURCES.swedishMilitaryMemorial,
    SOURCES.mankellRegimentalHistory,
    SOURCES.kaulbarsBiography
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla terrestre",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1789,
    endYear: 1789,
    region: "Kaipiais, cerca de la actual Kouvola, Finlandia; territorio del Reino de Suecia en 1789",
    normalizedRegion: "Kaipiais, cerca de la actual Kouvola, Finlandia; territorio del Reino de Suecia en 1789",
    cause: "Durante la ofensiva sueca en Finlandia en la guerra ruso-sueca, Gustavo III orden\u00f3 a la fuerza de Lars Fredrik von Kaulbars avanzar contra la posici\u00f3n rusa de Kaipiais.",
    outcome: "El 15 de julio de 1789, la fuerza sueca de Lars Fredrik von Kaulbars fue rechazada por una fuerza rusa superior y se retir\u00f3. Las fuentes consultadas respaldan la derrota sueca y el retroceso posterior, pero no proporcionan un parte bilateral homog\u00e9neo de bajas.",
    consequences: "La retirada de Kaulbars comprometi\u00f3 la posici\u00f3n de la fuerza principal sueca y contribuy\u00f3 al repliegue de Gustavo III hacia Anjala y V\u00e4r\u00e4l\u00e4. La acci\u00f3n no decidi\u00f3 por s\u00ed sola la guerra, que termin\u00f3 con el Tratado de V\u00e4r\u00e4l\u00e4 de 1790.",
    chronology: [
      {
        year: 1788,
        event: "Comenz\u00f3 la guerra ruso-sueca entre el Reino de Suecia y el Imperio ruso."
      },
      {
        year: 1789,
        event: "El 15 de julio, la fuerza de Lars Fredrik von Kaulbars atac\u00f3 la posici\u00f3n rusa de Kaipiais y se retir\u00f3 tras ser rechazada."
      },
      {
        year: 1790,
        event: "El Tratado de V\u00e4r\u00e4l\u00e4 puso fin a la guerra ruso-sueca."
      }
    ],
    treaties: ["Tratado de V\u00e4r\u00e4l\u00e4 (1790)"],
    related: [PARENT, CAMPAIGN, "Kaipiais", "Lars Fredrik von Kaulbars", "Fedor Denisov", "Gustavo III de Suecia", "Kouvola"],
    participants: [
      {
        side: "Destacamento sueco de Lars Fredrik von Kaulbars",
        members: ["Reino de Suecia", "Fuerza de Lars Fredrik von Kaulbars"],
        casualties: "No consolidadas: las fuentes verifican la retirada sueca, pero no una tabla bilateral compatible de muertos, heridos, prisioneros y desaparecidos."
      },
      {
        side: "Fuerza rusa de Fedor Denisov",
        members: ["Imperio ruso", "Fuerza de Fedor Denisov"],
        casualties: "No consolidadas: la ficha no infiere bajas rusas ni adopta estimaciones aisladas de efectivos como un parte cerrado."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "15 de julio de 1789",
    sourceDispute: "El registro memorial sueco describe una fuerza sueca de alrededor de dos mil hombres frente a una fuerza rusa aproximadamente doble, mientras que res\u00famenes posteriores ofrecen otras cifras redondeadas. Las fuentes coinciden en la fecha, el mando de Kaulbars, la superioridad rusa y la retirada sueca; por eso la ficha no fija efectivos exactos ni bajas humanas.",
    curationPriority: "alta",
    curationBatch: "source-backed-kaipiais-1789-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa no ten\u00eda fecha ni jerarqu\u00eda y quedaba bajo un conflicto regional gen\u00e9rico. Se normaliza como Batalla de Kaipiais (1789) dentro de la guerra ruso-sueca. Suecia y Rusia se vinculan por las fuerzas hist\u00f3ricas; Finlandia se a\u00f1ade solo como ubicaci\u00f3n contempor\u00e1nea de navegaci\u00f3n. La campa\u00f1a es una agrupaci\u00f3n editorial de GeoRisk para ordenar acciones locales de 1789, no el nombre de una campa\u00f1a oficial atribuido a las fuentes."
  };
}

export const KAIPIAIS_1789_SAFE_CONFLICT_RENAMES = {
  "Batalla de Kaipiais": "Batalla de Kaipiais (1789)",
  "Battle of Kaipiais": "Batalla de Kaipiais (1789)",
  "Slaget vid Kaipiais": "Batalla de Kaipiais (1789)"
};

export const KAIPIAIS_1789_COUNTRY_CONFLICT_ADDITIONS = {
  Finlandia: ["Batalla de Kaipiais (1789)"],
  Rusia: ["Batalla de Kaipiais (1789)"],
  Suecia: ["Batalla de Kaipiais (1789)"]
};

export const KAIPIAIS_1789_CONFLICT_DETAIL_FIXES = {
  "Batalla de Kaipiais (1789)": kaipiais1789Fix()
};
