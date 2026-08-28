function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  royalMuseumsGreenwich: source(
    "Royal Museums Greenwich: acci\u00f3n de Barrington en Santa Luc\u00eda el 15 de diciembre de 1778, el ataque de d'Estaing y la rendici\u00f3n posterior de la guarnici\u00f3n francesa",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-11914"
  ),
  navalHistoryImage: source(
    "Naval History and Heritage Command: grabado de la batalla de Santa Luc\u00eda del 15 de diciembre de 1778; la l\u00ednea francesa no logr\u00f3 romper la l\u00ednea brit\u00e1nica",
    "https://www.history.navy.mil/our-collections/photography/numerical-list-of-images/nhhc-series/nh-series/NH-58000/NH-58926.html"
  ),
  navalHistoryStudy: source(
    "Naval History and Heritage Command: s\u00edntesis de la campa\u00f1a de 1778, llegada de d'Estaing y ca\u00edda de Santa Luc\u00eda al final de diciembre",
    "https://www.history.navy.mil/content/dam/nhhc/research/publications/Sea%20Stories_final.pdf"
  )
};

const PARENT = "Guerra de Independencia de Estados Unidos";
const CAMPAIGN = "Campa\u00f1a de las Antillas de 1778-1783";

function santaLuciaFix() {
  const hierarchySources = [
    SOURCES.royalMuseumsGreenwich,
    SOURCES.navalHistoryImage,
    SOURCES.navalHistoryStudy
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla naval",
    conflictType: "independencia",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1778,
    endYear: 1778,
    region: "Grand Cul de Sac, costa occidental de Santa Luc\u00eda, Caribe",
    normalizedRegion: "Grand Cul de Sac, costa occidental de Santa Luc\u00eda, Caribe",
    cause: "Tras la alianza de Francia con los rebeldes estadounidenses en 1778, Samuel Barrington desembarc\u00f3 tropas brit\u00e1nicas en Santa Luc\u00eda. Su l\u00ednea naval proteg\u00eda los transportes en Grand Cul de Sac cuando la flota francesa de Charles Henri d'Estaing lleg\u00f3 para desalojarla.",
    outcome: "\u00c9xito defensivo brit\u00e1nico en el combate naval del 15 de diciembre de 1778: la flota francesa no logr\u00f3 romper la l\u00ednea de Barrington ni destruir los transportes. La acci\u00f3n no resolvi\u00f3 por s\u00ed sola la campa\u00f1a terrestre; d'Estaing intent\u00f3 nuevas operaciones y la guarnici\u00f3n francesa termin\u00f3 rindi\u00e9ndose a finales de diciembre.",
    consequences: "La acci\u00f3n contribuy\u00f3 a consolidar la ocupaci\u00f3n brit\u00e1nica de Santa Luc\u00eda durante la campa\u00f1a caribe\u00f1a de 1778. La guerra entre Gran Breta\u00f1a, Francia y sus aliados continu\u00f3 en las Antillas y en Norteam\u00e9rica.",
    chronology: [
      {
        year: 1778,
        event: "Francia se ali\u00f3 con los rebeldes estadounidenses y la guerra se extendi\u00f3 con fuerza al Caribe."
      },
      {
        year: 1778,
        event: "El 12 de diciembre, Barrington desembarc\u00f3 tropas brit\u00e1nicas en Grand Cul de Sac para ocupar Santa Luc\u00eda."
      },
      {
        year: 1778,
        event: "El 15 de diciembre, d'Estaing atac\u00f3 la l\u00ednea naval brit\u00e1nica sin conseguir desplazarla ni destruir los transportes."
      },
      {
        year: 1778,
        event: "Tras nuevos intentos franceses, el gobernador y la guarnici\u00f3n de Santa Luc\u00eda se rindieron al final de diciembre."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Santa Luc\u00eda", "Grand Cul de Sac", "Samuel Barrington", "Charles Henri d'Estaing", "Caribe"],
    participants: [
      {
        side: "Fuerza brit\u00e1nica",
        members: ["Reino de Gran Breta\u00f1a", "Royal Navy", "Samuel Barrington", "William Hotham"]
      },
      {
        side: "Flota francesa de las Indias Occidentales",
        members: ["Reino de Francia", "Marina Real francesa", "Charles Henri d'Estaing"]
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "15 de diciembre de 1778",
    curationPriority: "alta",
    curationBatch: "source-backed-santa-lucia-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa quedaba bajo una jerarqu\u00eda europea gen\u00e9rica. Se normaliza como batalla naval de Santa Luc\u00eda de 1778 dentro de la Guerra de Independencia de Estados Unidos y de la Campa\u00f1a de las Antillas. Reino Unido se vincula por la fuerza brit\u00e1nica; Francia ya estaba vinculada. Santa Luc\u00eda se conserva como lugar de la acci\u00f3n, no como un Estado contempor\u00e1neo beligerante. La ficha evita consolidar bajas y no confunde el rechazo naval del 15 de diciembre con la rendici\u00f3n francesa posterior."
  };
}

export const SANTA_LUCIA_CONFLICT_RENAMES = {
  "Batalla de St. Lucia": "Batalla naval de Santa Luc\u00eda (1778)",
  "Batalla de St. Luc\u00eda": "Batalla naval de Santa Luc\u00eda (1778)",
  "Batalla de Santa Lucia": "Batalla naval de Santa Luc\u00eda (1778)",
  "Batalla naval de St. Lucia": "Batalla naval de Santa Luc\u00eda (1778)",
  "Batalla naval de St. Luc\u00eda": "Batalla naval de Santa Luc\u00eda (1778)",
  "Battle of St. Lucia": "Batalla naval de Santa Luc\u00eda (1778)",
  "Battle of Saint Lucia": "Batalla naval de Santa Luc\u00eda (1778)",
  "Barrington's Action at St Lucia": "Batalla naval de Santa Luc\u00eda (1778)",
  "Action at St Lucia": "Batalla naval de Santa Luc\u00eda (1778)"
};

export const SANTA_LUCIA_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": ["Batalla naval de Santa Luc\u00eda (1778)"]
};

export const SANTA_LUCIA_CONFLICT_DETAIL_FIXES = {
  "Batalla naval de Santa Luc\u00eda (1778)": santaLuciaFix()
};
