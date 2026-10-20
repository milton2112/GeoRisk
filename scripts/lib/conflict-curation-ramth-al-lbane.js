const NAME = "Combates de Ramth al-Lbane (1979)";
const PARENT = "Guerra del Sahara Occidental";
const CAMPAIGN = "Ofensivas del Frente Polisario de 1979";

const SOURCES = [
  {
    label: "Naciones Unidas, informe de 1980, sección 6, párrs. 43-45: registra el anuncio marroquí sobre posiciones del Frente Polisario en Ramth Al Lbane",
    url: "https://documents.un.org/doc/undoc/gen/n80/133/64/pdf/n8013364.pdf"
  },
  {
    label: "Le Monde (15 de marzo de 1979), Louis Gravier: sitúa los combates el lunes 12 de marzo y fecha el comunicado marroquí al martes 13",
    url: "https://www.lemonde.fr/archives/article/1979/03/15/rabat-affirme-avoir-inflige-de-lourdes-pertes-au-front-polisario-a-120-kilometres-d-el-aioun_2769596_1819218.html"
  }
];

export const RAMTH_AL_LBANE_CONFLICT_RENAMES = {
  "Batalla de Ramth-al-Lbane": NAME,
  "Bataille de Ramth-al-Lbane": NAME,
  "Battle of Ramth-al-Lbane": NAME,
  "Battle of Ramth al-Lbane": NAME
};

export const RAMTH_AL_LBANE_COUNTRY_CONFLICT_ADDITIONS = {
  "Sahara Occidental": [NAME]
};

export const RAMTH_AL_LBANE_CONFLICT_DETAIL_FIXES = {
  [NAME]: {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    related: [PARENT, CAMPAIGN, "Frente Polisario", "Sahara Occidental"],
    type: "batalla",
    conflictType: "independencia",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1979,
    endYear: 1979,
    datePrecision: "12 de marzo de 1979; Le Monde sitúa el comunicado al día 13, mientras el informe de la ONU lo fecha al 12",
    region: "Ramth Al Lbane, Sahara Occidental",
    normalizedRegion: "Ramth Al Lbane, Sahara Occidental",
    cause: "Los combates se enmarcaron en la Guerra del Sahara Occidental y en las ofensivas del Frente Polisario de 1979; las fuentes consultadas no documentan un objetivo operacional más específico para esta acción.",
    outcome: "El informe de la ONU recoge la versión marroquí de que las posiciones del Frente Polisario fueron destruidas y hubo muchas bajas. Las fuentes disponibles no corroboran de forma independiente ese balance ni establecen control territorial duradero; GeoRisk no asigna un vencedor.",
    consequences: "La acción queda documentada como parte de las operaciones de 1979 en la Guerra del Sahara Occidental. Las fuentes consultadas no acreditan un cambio político o territorial duradero atribuible a estos combates.",
    participants: [
      {
        side: "Fuerzas Armadas Reales de Marruecos",
        members: ["Marruecos", "Fuerzas Armadas Reales de Marruecos"],
        casualties: "Sin cifra independiente y comparable en las fuentes consultadas; no equivale a cero"
      },
      {
        side: "Frente Polisario",
        members: ["Frente Polisario", "Combatientes saharauis"],
        casualties: "Las cifras publicadas proceden de comunicados marroquíes y no están corroboradas de forma independiente"
      }
    ],
    chronology: [
      {
        year: 1979,
        event: "El 12 de marzo, fuerzas marroquíes y del Frente Polisario combatieron en el sector de Ramth Al Lbane, según la crónica contemporánea de Le Monde."
      },
      {
        year: 1979,
        event: "Las fuentes discrepan sobre la fecha del comunicado marroquí: Le Monde lo sitúa el 13 de marzo y el informe de la ONU, el 12."
      }
    ],
    treaties: [],
    hierarchyConfidence: "alta",
    hierarchySources: SOURCES,
    sourceDispute: "Le Monde informa de combates el lunes 12 de marzo y de un comunicado publicado el martes 13; el informe de la ONU sitúa el anuncio oficial el 12. Ambos registran la versión marroquí sobre el resultado, sin una verificación independiente de bajas o control territorial.",
    curationPriority: "alta",
    curationBatch: "source-backed-ramth-al-lbane-1979-2026-10",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Se fecha la acción el 12 de marzo según la crónica contemporánea de Le Monde; la diferencia con el informe de la ONU afecta al día del anuncio oficial y queda visible. El perfil Sahara Occidental se añade como referencia geográfica e histórica de navegación, sin adjudicar soberanía. El Frente Polisario se conserva como actor documentado. Los balances disponibles proceden de la versión marroquí, por lo que no se fijan vencedor, bajas ni control territorial."
  }
};
