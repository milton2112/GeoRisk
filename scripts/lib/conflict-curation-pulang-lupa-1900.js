function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Pulang Lupa (1900)";
const PARENT = "Guerra filipino-estadounidense";
const CAMPAIGN = "Operaciones de Marinduque (1900)";

const SOURCES = {
  nationalHistoricalCommissionMarker: source(
    "Comisi\u00f3n Hist\u00f3rica Nacional de Filipinas, registro del marcador de la Fuerza Revolucionaria de Marinduque: organizaci\u00f3n de las unidades, Pulang Lupa en Torrijos el 13 de septiembre de 1900 y rendici\u00f3n posterior de la fuerza local",
    "https://philhistoricsites.nhcp.gov.ph/registry_database/marinduque-revolutionary-force/"
  ),
  marinduqueProvinceHistory: source(
    "Provincia de Marinduque, historia oficial: Pulang Lupa en Torrijos durante la guerra filipino-estadounidense, mando de M\u00e1ximo Abad y Devereux Shields y victoria de la fuerza local",
    "https://marinduque.gov.ph/history/"
  ),
  republicAct6702: source(
    "Biblioteca electr\u00f3nica de la Corte Suprema de Filipinas, Ley de la Rep\u00fablica 6702: reconocimiento legal del 13 de septiembre como D\u00eda de la Batalla de Pulang Lupa en Marinduque",
    "https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/2/4433"
  )
};

function pulangLupa1900Fix() {
  const hierarchySources = [
    SOURCES.nationalHistoricalCommissionMarker,
    SOURCES.marinduqueProvinceHistory,
    SOURCES.republicAct6702
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla terrestre",
    conflictType: "independencia",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1900,
    endYear: 1900,
    region: "Pulang Lupa, municipio de Torrijos, isla y provincia de Marinduque, Filipinas",
    normalizedRegion: "Pulang Lupa, municipio de Torrijos, isla y provincia de Marinduque, Filipinas",
    cause: "Durante la guerra filipino-estadounidense, la Fuerza Revolucionaria de Marinduque operaba contra la presencia militar estadounidense en la isla. Una fuerza dirigida por M\u00e1ximo Abad se enfrent\u00f3 al contingente estadounidense de Devereux Shields en el \u00e1rea de Pulang Lupa.",
    outcome: "Las fuentes institucionales filipinas coinciden en que, el 13 de septiembre de 1900, la fuerza local de M\u00e1ximo Abad derrot\u00f3 al contingente estadounidense dirigido por Devereux Shields. La ficha no convierte esa victoria local en un resultado definitivo de toda la guerra ni fija bajas, capturas o tama\u00f1os de fuerza como cifras cerradas.",
    consequences: "La batalla qued\u00f3 incorporada a la memoria hist\u00f3rica de Marinduque y el 13 de septiembre se reconoce legalmente como D\u00eda de la Batalla de Pulang Lupa en la provincia. La Fuerza Revolucionaria de Marinduque continu\u00f3 operando hasta su rendici\u00f3n ante fuerzas estadounidenses en abril de 1901; el combate no cerr\u00f3 por s\u00ed solo la guerra filipino-estadounidense.",
    chronology: [
      {
        year: 1900,
        event: "El 6 de mayo, el batall\u00f3n de infanter\u00eda de la Fuerza Revolucionaria de Marinduque fue reorganizado en cuatro unidades de guerrilla, seg\u00fan el marcador hist\u00f3rico nacional."
      },
      {
        year: 1900,
        event: "El 13 de septiembre, las fuerzas de M\u00e1ximo Abad derrotaron al contingente estadounidense de Devereux Shields en Pulang Lupa, Torrijos."
      },
      {
        year: 1901,
        event: "En abril, M\u00e1ximo Abad y la fuerza revolucionaria restante de Marinduque se rindieron ante las fuerzas estadounidenses en Boac."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Pulang Lupa", "Torrijos", "Marinduque", "M\u00e1ximo Abad", "Devereux Shields", "Fuerza Revolucionaria de Marinduque", "D\u00eda de la Batalla de Pulang Lupa"],
    participants: [
      {
        side: "Fuerza Revolucionaria de Marinduque",
        members: ["Fuerza Revolucionaria de Marinduque", "M\u00e1ximo Abad", "Unidades de infanter\u00eda y milicia de Marinduque"],
        casualties: "No consolidadas: las fuentes institucionales confirman la victoria local, pero no proporcionan un parte bilateral homog\u00e9neo de muertos, heridos, prisioneros, capturados o efectivos."
      },
      {
        side: "Contingente estadounidense de Devereux Shields",
        members: ["Estados Unidos", "Ej\u00e9rcito de Estados Unidos", "Devereux Shields"],
        casualties: "No consolidadas: la ficha no adopta cifras locales o relatos posteriores como un balance humano definitivo para la fuerza estadounidense."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "13 de septiembre de 1900",
    sourceDispute: "El marcador de la Comisi\u00f3n Hist\u00f3rica Nacional de Filipinas, la provincia de Marinduque y el reconocimiento legal del D\u00eda de la Batalla de Pulang Lupa coinciden en la identidad, el lugar y la fecha. Los registros consultados no aportan una tabla bilateral verificable de efectivos, bajas, cautivos o la secuencia completa del combate; por eso la ficha no repite cifras locales ni presenta como confirmado un desenlace mayor que la derrota del contingente estadounidense.",
    curationPriority: "alta",
    curationBatch: "source-backed-pulang-lupa-1900-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de la Monta\u00f1a Roja, no ten\u00eda fecha, detalle ni jerarqu\u00eda verificable y estaba situada de forma gen\u00e9rica en Am\u00e9rica por su asociaci\u00f3n exclusiva con Estados Unidos. Se normaliza como Batalla de Pulang Lupa (1900), en Marinduque, Filipinas, dentro de la guerra filipino-estadounidense. Estados Unidos se conserva como fuerza participante y Filipinas se a\u00f1ade como ubicaci\u00f3n contempor\u00e1nea y referente de la fuerza local; no se convierte a la Fuerza Revolucionaria de Marinduque en un Estado nacional contempor\u00e1neo. La campa\u00f1a es una agrupaci\u00f3n editorial de GeoRisk para ordenar operaciones locales, no el nombre formal de una campa\u00f1a citado literalmente por las fuentes."
  };
}

export const PULANG_LUPA_1900_CONFLICT_RENAMES = {
  "Batalla de la Monta\u00f1a Roja": CANONICAL,
  "Batalla de Pulang Lupa": CANONICAL,
  "Battle of Pulang Lupa": CANONICAL,
  "Battle of Red Mountain": CANONICAL,
  "Batalla de Tierra Roja": CANONICAL
};

export const PULANG_LUPA_1900_COUNTRY_CONFLICT_ADDITIONS = {
  Filipinas: [CANONICAL]
};

export const PULANG_LUPA_1900_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: pulangLupa1900Fix()
};
