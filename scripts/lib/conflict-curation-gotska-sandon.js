function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  brillChronology: source(
    "Brill: cronolog\u00eda de la Guerra N\u00f3rdica de los Siete A\u00f1os con el combate naval frente a Gotska Sand\u00f6n en 1563",
    "https://brill.com/display/book/9789004475700/front-6.pdf"
  ),
  divaBagge: source(
    "DiVA: Jacob Bagge particip\u00f3 en el combate de Gotska Sand\u00f6n durante la Guerra N\u00f3rdica de los Siete A\u00f1os",
    "https://www.diva-portal.org/smash/get/diva2%3A885914/FULLTEXT01.pdf"
  ),
  swedishMaritimeSociety: source(
    "Sj\u00f6historiska samfundet: registros navales suecos fechados en Gotska Sand\u00f6n el 11 de septiembre de 1563",
    "https://sjohistoriskasamfundet.se/wp-content/uploads/2017/08/skrift04.pdf"
  )
};

function gotskaSandonFix() {
  const parent = "Guerra N\u00f3rdica de los Siete A\u00f1os (1563-1570)";
  const campaign = "Operaciones navales del B\u00e1ltico central de 1563";
  const hierarchySources = [SOURCES.brillChronology, SOURCES.divaBagge, SOURCES.swedishMaritimeSociety];

  return {
    parent,
    war: parent,
    campaign,
    type: "combate naval",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1563,
    endYear: 1563,
    region: "Frente a Gotska Sand\u00f6n, B\u00e1ltico central, actual Suecia",
    normalizedRegion: "Frente a Gotska Sand\u00f6n, B\u00e1ltico central, actual Suecia",
    cause: "El encuentro form\u00f3 parte de la lucha naval entre Suecia y Dinamarca-Noruega por el control de las rutas y el equilibrio de poder en el B\u00e1ltico durante la Guerra N\u00f3rdica de los Siete A\u00f1os.",
    outcome: "Las fuentes consultadas describen un combate naval sin una decisi\u00f3n t\u00e1ctica ampliamente consolidada. Una s\u00edntesis hist\u00f3rica destaca que la flota sueca no fue derrotada; no se fijan victorias absolutas, cifras de buques ni bajas porque los res\u00famenes disponibles no las reconcilian de forma uniforme.",
    consequences: "La acci\u00f3n no resolvi\u00f3 la guerra naval en el B\u00e1ltico. Las operaciones entre las flotas continuaron durante el conflicto, que concluy\u00f3 por el Tratado de Stettin de 1570.",
    chronology: [
      { year: 1563, event: "La Guerra N\u00f3rdica de los Siete A\u00f1os abri\u00f3 una disputa naval y territorial entre Suecia y Dinamarca-Noruega en el B\u00e1ltico." },
      { year: 1563, event: "Las flotas se enfrentaron frente a Gotska Sand\u00f6n en septiembre; registros navales suecos fechan participaciones el 11 de septiembre." },
      { year: 1570, event: "El Tratado de Stettin puso fin a la Guerra N\u00f3rdica de los Siete A\u00f1os, sin que el combate de Gotska Sand\u00f6n hubiera decidido por si solo el conflicto." }
    ],
    treaties: ["Tratado de Stettin (1570)"],
    related: [parent, campaign, "Gotska Sand\u00f6n", "Mar B\u00e1ltico", "Jacob Bagge", "Dinamarca-Noruega"],
    participants: [
      {
        side: "Flota del Reino de Suecia",
        members: ["Reino de Suecia", "Jacob Bagge"],
        casualties: "No consolidadas en las fuentes revisadas"
      },
      {
        side: "Flota de Dinamarca-Noruega",
        members: ["Dinamarca-Noruega"],
        casualties: "No consolidadas en las fuentes revisadas"
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "septiembre de 1563; los registros navales suecos sit\u00faan participaciones en Gotska Sand\u00f6n el 11 de septiembre, sin homogeneizar calendarios hist\u00f3ricos",
    sourceDispute: true,
    curationPriority: "alta",
    curationBatch: "source-backed-gotska-sandon-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa no ten\u00eda fecha, adversario ni guerra asignada y quedaba bajo una jerarqu\u00eda gen\u00e9rica de Europa. Se identifica como el combate naval de Gotska Sand\u00f6n de 1563 dentro de la Guerra N\u00f3rdica de los Siete A\u00f1os. La ficha conserva Suecia y Dinamarca como enlaces contempor\u00e1neos de navegaci\u00f3n, mientras que los participantes mantienen los reinos hist\u00f3ricos. L\u00fcbeck fue aliado de Dinamarca-Noruega en la guerra, pero no se le asigna una escuadra concreta en este combate sin una relaci\u00f3n de orden de batalla consistente. Tampoco se transforman el resultado no decisivo, las bajas o los barcos en cifras cerradas."
  };
}

export const GOTSKA_SANDON_CONFLICT_RENAMES = {
  "Batalla de Gotska Sand\u00f6n": "Batalla naval de Gotska Sand\u00f6n (1563)",
  "Batalla de Gotska Sandon": "Batalla naval de Gotska Sand\u00f6n (1563)",
  "Batalla de Gotska Sand\u00f6n (1563)": "Batalla naval de Gotska Sand\u00f6n (1563)",
  "Batalla naval de Gotska Sand\u00f6n": "Batalla naval de Gotska Sand\u00f6n (1563)",
  "Battle of Gotska Sand\u00f6n": "Batalla naval de Gotska Sand\u00f6n (1563)",
  "Slaget vid Gotska Sand\u00f6n": "Batalla naval de Gotska Sand\u00f6n (1563)"
};

export const GOTSKA_SANDON_COUNTRY_CONFLICT_ADDITIONS = {
  Dinamarca: ["Batalla naval de Gotska Sand\u00f6n (1563)"]
};

export const GOTSKA_SANDON_CONFLICT_DETAIL_FIXES = {
  "Batalla naval de Gotska Sand\u00f6n (1563)": gotskaSandonFix()
};
