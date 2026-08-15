function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  ungvaryBattleForBudapest: source(
    "Krisztian Ungvary, Battle for Budapest: ofensiva sovietica de octubre de 1944, combates de Debrecen y retirada germano-hungara",
    "https://api.pageplace.de/preview/DT0400.9780857710710_A23732120/preview-9780857710710_A23732120.pdf"
  ),
  samaraDebrecenOperation: source(
    "Samara Journal of Science: operaciones del Segundo Frente Ucraniano, incluida la ofensiva de Debrecen de 1944",
    "https://journals.rcsi.science/2309-4370/article/view/271353/en_US"
  )
};

export const DEBRECEN_1944_SAFE_CONFLICT_RENAMES = {
  "Batalla de Debrecen": "Batalla de Debrecen (1944)"
};

export const DEBRECEN_1944_COUNTRY_CONFLICT_ADDITIONS = {
  Alemania: ["Batalla de Debrecen (1944)"],
  Rumania: ["Batalla de Debrecen (1944)"],
  Rusia: ["Batalla de Debrecen (1944)"]
};

export const DEBRECEN_1944_CONFLICT_DETAIL_FIXES = {
  "Batalla de Debrecen (1944)": {
    parent: "Segunda Guerra Mundial",
    war: "Segunda Guerra Mundial",
    campaign: "Ofensiva de Debrecen (octubre de 1944)",
    type: "batalla terrestre y de maniobra",
    conflictType: "interestatal",
    scale: "mundial",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1944,
    endYear: 1944,
    region: "Llanura hungara, con ejes en Oradea, Debrecen y Nyiregyhaza; Hungria y el oeste de Rumania",
    normalizedRegion: "Llanura hungara, con ejes en Oradea, Debrecen y Nyiregyhaza; Hungria y el oeste de Rumania",
    cause: "Tras las ofensivas sovieticas de 1944 en Rumania, el Segundo Frente Ucraniano avanzo hacia Hungria con el objetivo de derrotar y cercar fuerzas alemanas y hungaras en Transilvania y la llanura oriental.",
    outcome: "Las fuerzas sovieticas ocuparon Debrecen el 20 de octubre, pero no lograron cercar al Octavo Ejercito aleman ni a los ejercitos hungaros situados en Transilvania y los Carpatos; las fuerzas del Eje consiguieron replegar parte de sus unidades.",
    consequences: "La operacion llevo el frente mas al oeste dentro de Hungria y condiciono la siguiente fase hacia Budapest. La captura de la ciudad no elimino de inmediato la capacidad defensiva germano-hungara ni resolvio por si sola la campana.",
    chronology: [
      { year: 1944, event: "El 6 de octubre, el Segundo Frente Ucraniano inicio su ofensiva general hacia la llanura hungara y Debrecen." },
      { year: 1944, event: "Entre el 10 y el 14 de octubre, los combates blindados se concentraron en el sector de Debrecen mientras ambos bandos reorganizaban sus fuerzas." },
      { year: 1944, event: "El 20 de octubre, tropas sovieticas ocuparon Debrecen; durante el resto del mes continuaron los combates y repliegues en torno a Nyiregyhaza." }
    ],
    treaties: [],
    related: ["Frente oriental de la Segunda Guerra Mundial"],
    participants: [
      {
        side: "Segundo Frente Ucraniano y fuerzas rumanas aliadas",
        members: ["Ejercito Rojo", "Ejercito Real Rumano"]
      },
      {
        side: "Fuerzas alemanas y hungaras del Grupo de Ejercitos Sur",
        members: ["Sexto Ejercito Aleman", "Ejercito Real Hungaro"]
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: [
      { label: SOURCES.ungvaryBattleForBudapest.label, url: SOURCES.ungvaryBattleForBudapest.url },
      { label: SOURCES.samaraDebrecenOperation.label, url: SOURCES.samaraDebrecenOperation.url }
    ],
    curationPriority: "alta",
    curationBatch: "source-backed-debrecen-1944-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: true,
    curationNote: "El nombre Debrecen tambien corresponde a una batalla distinta de 1849. Esta ficha se fecha explicitamente en 1944 y se limita a la ofensiva de octubre. Rusia, Rumania y Alemania se agregan para navegacion historica, mientras los participantes se conservan como formaciones y Estados de epoca; no se fijan bajas ni una victoria estrategica unica porque las evaluaciones operacionales difieren."
  }
};
