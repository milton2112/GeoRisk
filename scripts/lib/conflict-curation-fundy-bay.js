function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  novaScotiaHistoricalReview: source(
    "Nova Scotia Historical Review: reconstrucci\u00f3n documentada de la expedici\u00f3n de 1696, su salida a la bah\u00eda de Fundy y el combate del 14 de julio",
    "https://archives.novascotia.ca/pdf/library/NovaScotiaHistoricalReview-15-1-1995.pdf"
  ),
  dictionaryMaisonnat: source(
    "Diccionario Biogr\u00e1fico de Canad\u00e1: perfil de Pierre Maisonnat que sit\u00faa la captura de la fragata inglesa Newport cerca del Saint John el 14 de julio de 1696",
    "https://www.biographi.ca/fr/bio/maisonnat_pierre_2E.html?print=1"
  ),
  dictionaryIberville: source(
    "Diccionario Biogr\u00e1fico de Canad\u00e1: perfil de Pierre Le Moyne d'Iberville y de la operaci\u00f3n contra el bloqueo ingl\u00e9s en la desembocadura del Saint John",
    "https://www.biographi.ca/en/bio/le_moyne_d_iberville_et_d_ardillieres_pierre_2E.html"
  )
};

const PARENT = "Guerra de los Nueve A\u00f1os (1688-1697)";
const CAMPAIGN = "Operaciones franco-inglesas en Acadia y Pemaquid (1696)";

function fundyBayFix() {
  const hierarchySources = [
    SOURCES.novaScotiaHistoricalReview,
    SOURCES.dictionaryMaisonnat,
    SOURCES.dictionaryIberville
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate naval",
    conflictType: "colonial",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1696,
    endYear: 1696,
    region: "Bah\u00eda de Fundy, cerca de la desembocadura del r\u00edo Saint John, actual Nuevo Brunswick, Canad\u00e1",
    normalizedRegion: "Bah\u00eda de Fundy, cerca de la desembocadura del r\u00edo Saint John, actual Nuevo Brunswick, Canad\u00e1",
    cause: "Durante la Guerra de los Nueve A\u00f1os, una fuerza inglesa bloqueaba la desembocadura del r\u00edo Saint John en Acadia. A pedido del gobernador Joseph Robinau de Villebon, Pierre Le Moyne d'Iberville y Simon-Pierre Denys de Bonaventure navegaron hacia la bah\u00eda de Fundy para desafiar ese bloqueo.",
    outcome: "El 14 de julio de 1696, las fuerzas francesas capturaron la fragata inglesa Newport cerca de la desembocadura del Saint John; otros dos buques ingleses se retiraron. La ficha no fija efectivos, duraci\u00f3n ni bajas porque las fuentes consultadas no ofrecen una relaci\u00f3n bilateral y homog\u00e9nea.",
    consequences: "La acci\u00f3n permiti\u00f3 a la expedici\u00f3n francesa continuar hacia las operaciones de Pemaquid. No se atribuye a este solo combate la resoluci\u00f3n del conflicto colonial ni un cambio territorial permanente en Acadia.",
    chronology: [
      {
        year: 1688,
        event: "Comenz\u00f3 la Guerra de los Nueve A\u00f1os, cuyo teatro norteamericano se conoce tambi\u00e9n como guerra del Rey Guillermo."
      },
      {
        year: 1696,
        event: "El 4 de julio, Iberville naveg\u00f3 hacia la bah\u00eda de Fundy tras recibir informaci\u00f3n sobre buques ingleses frente al Saint John."
      },
      {
        year: 1696,
        event: "El 14 de julio, la expedici\u00f3n de Iberville y Bonaventure captur\u00f3 la fragata inglesa Newport cerca de la desembocadura del Saint John."
      },
      {
        year: 1696,
        event: "En agosto, la expedici\u00f3n francesa prosigui\u00f3 hacia Pemaquid y captur\u00f3 Fort William Henry."
      },
      {
        year: 1697,
        event: "El Tratado de Ryswick puso fin a la Guerra de los Nueve A\u00f1os entre Francia e Inglaterra."
      }
    ],
    treaties: ["Tratado de Ryswick (1697)"],
    related: [PARENT, CAMPAIGN, "Acadia", "Bah\u00eda de Fundy", "r\u00edo Saint John", "Pierre Le Moyne d'Iberville", "Simon-Pierre Denys de Bonaventure", "Fragata Newport"],
    participants: [
      {
        side: "Fuerza francesa y aliada en Acadia",
        members: ["Nueva Francia", "Fuerzas francesas de Acadia", "L'Envieux", "Profond", "Pierre Le Moyne d'Iberville", "Simon-Pierre Denys de Bonaventure", "Guerreros mi'kmaq"],
        casualties: "No consolidadas: las fuentes consultadas permiten identificar la captura de Newport, pero no proporcionan una serie bilateral homog\u00e9nea de muertos y heridos."
      },
      {
        side: "Fuerza naval inglesa",
        members: ["Reino de Inglaterra", "Buques ingleses que bloqueaban la desembocadura del Saint John", "Fragata Newport"],
        casualties: "No consolidadas: la ficha no transforma relatos parciales sobre la captura y retirada en un total verificable de bajas."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "14 de julio de 1696",
    sourceDispute: "La Nova Scotia Historical Review y el perfil de Pierre Maisonnat del Diccionario Biogr\u00e1fico de Canad\u00e1 sit\u00faan expl\u00edcitamente la captura de Newport el 14 de julio de 1696. El perfil general de Iberville confirma la captura de una fragata inglesa y la huida de otros dos buques, pero la inserta de forma m\u00e1s amplia en agosto. Por ello la fecha exacta se atribuye a las dos fuentes que la expresan de modo directo y no se fijan cifras de fuerzas, bajas ni un parte t\u00e1ctico m\u00e1s detallado.",
    curationPriority: "alta",
    curationBatch: "source-backed-fundy-bay-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Las entradas previas Batalla de Fundy Bay y Batalla naval de St. John estaban asociadas solo a Francia y quedaban bajo una jerarqu\u00eda provisional. Ambas se absorben como aliases de Combate naval de la bah\u00eda de Fundy (1696): describen la acci\u00f3n del 14 de julio cerca de la desembocadura del r\u00edo Saint John, no dos batallas separadas. Francia y Reino Unido se vinculan por las fuerzas hist\u00f3ricas; Canad\u00e1 se vincula como ubicaci\u00f3n contempor\u00e1nea del Saint John, sin convertirlo en beligerante. La ficha conserva la participaci\u00f3n mi'kmaq documentada, sin presentarla como un Estado moderno ni fusionarla con las fuerzas francesas."
  };
}

export const FUNDY_BAY_CONFLICT_RENAMES = {
  "Batalla de Fundy Bay": "Combate naval de la bah\u00eda de Fundy (1696)",
  "Battle of Fundy Bay": "Combate naval de la bah\u00eda de Fundy (1696)",
  "Battle of the Bay of Fundy": "Combate naval de la bah\u00eda de Fundy (1696)",
  "Batalla de la bah\u00eda de Fundy": "Combate naval de la bah\u00eda de Fundy (1696)",
  "Combate naval de la bah\u00eda de Fundy": "Combate naval de la bah\u00eda de Fundy (1696)",
  "Bataille de la baie de Fundy": "Combate naval de la bah\u00eda de Fundy (1696)",
  "Batalla naval de St. John": "Combate naval de la bah\u00eda de Fundy (1696)"
};

export const FUNDY_BAY_COUNTRY_CONFLICT_ADDITIONS = {
  "Canad\u00e1": ["Combate naval de la bah\u00eda de Fundy (1696)"],
  Francia: ["Combate naval de la bah\u00eda de Fundy (1696)"],
  "Reino Unido": ["Combate naval de la bah\u00eda de Fundy (1696)"]
};

export const FUNDY_BAY_CONFLICT_DETAIL_FIXES = {
  "Combate naval de la bah\u00eda de Fundy (1696)": fundyBayFix()
};
