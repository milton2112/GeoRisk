const NAME = "Combates del sector de Zag (13 de octubre de 1984)";
const PARENT = "Guerra del Sahara Occidental";
const CAMPAIGN = "Ofensiva Grand Maghreb (1984)";
const REGION = "Sector de Zag, entre Khachbyine y Z'Moul Niran, Sahara Occidental";

const SOURCES = [
  {
    label: "Olivier Verniot, «La question du Sahara occidental 1983-1984», Annuaire de l'Afrique du Nord: fecha la ofensiva Grand Maghreb el 13 de octubre de 1984, en el sector de Zag, y advierte que no se distingue un vencedor claro ni se concilian las bajas.",
    url: "https://cinumedpub.mmsh.fr/aan/Pdf/AAN-1984-23_56.pdf"
  },
  {
    label: "Le Monde/AFP, «Violents combats dans le secteur de Zag», 17 de octubre de 1984: informa los comunicados marroquí y saharaui sobre los combates del sábado 13 y la línea Khachbyine-Z'Moul Niran.",
    url: "https://www.lemonde.fr/archives/article/1984/10/17/violents-combats-dans-le-secteur-de-zag_3006196_1819218.html"
  },
  {
    label: "El País/EFE, «El Frente Polisario afirma haber lanzado una fuerte ofensiva contra Marruecos», 15 de octubre de 1984: sitúa los ataques del sábado entre Khachblyin y Zemul Niran, al suroeste de Zag.",
    url: "https://elpais.com/diario/1984/10/15/internacional/466642818_850215.html"
  }
];

export const ZMOUL_NIRAN_1984_CONFLICT_RENAMES = {
  "Batalla de Z'Moul NIran": NAME,
  "batalla de Z'Moul Niran": NAME,
  "Batalla de Z'Moul Niran": NAME,
  "Bataille de Z'Moul Niran": NAME,
  "Battle of Z'Moul Niran": NAME
};

export const ZMOUL_NIRAN_1984_COUNTRY_CONFLICT_ADDITIONS = {
  "Sahara Occidental": [NAME]
};

export const ZMOUL_NIRAN_1984_CONFLICT_DETAIL_FIXES = {
  [NAME]: {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    related: [PARENT, CAMPAIGN, "Frente Polisario", "Sahara Occidental", "Zag", "Z'Moul Niran"],
    type: "batalla",
    conflictType: "independencia",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1984,
    endYear: 1984,
    startDay: "1984-10-13",
    endDay: "1984-10-13",
    datePrecision: "13 de octubre de 1984; la prensa contemporánea sitúa los combates cerca de Zag y el comunicado saharaui ubica posiciones entre Khachbyine y Z'Moul Niran.",
    region: REGION,
    normalizedRegion: REGION,
    cause: "Durante la Guerra del Sahara Occidental, el Frente Polisario atacó la línea defensiva marroquí en el sector de Zag; la prensa de la época identificó la acción como el inicio de la ofensiva Grand Maghreb.",
    outcome: "No se adjudica un vencedor táctico: los comunicados de Marruecos y del Frente Polisario discrepan sobre el resultado y las pérdidas, y la síntesis de Olivier Verniot indica que no emerge un vencedor claro en los combates de la ofensiva.",
    consequences: "La acción abrió la ofensiva Grand Maghreb, cuyos ataques continuaron durante las semanas siguientes. Las fuentes consultadas no atribuyen a estos combates un cambio territorial duradero.",
    participants: [
      {
        side: "Fuerzas Armadas Reales de Marruecos",
        members: ["Marruecos", "Fuerzas Armadas Reales de Marruecos"],
        casualties: "Las cifras difundidas por Marruecos y por el Frente Polisario son incompatibles y no están verificadas de forma independiente; no se consolidan."
      },
      {
        side: "Frente Polisario",
        members: ["Frente Polisario", "Ejército de Liberación del Pueblo Saharaui"],
        casualties: "Las cifras difundidas por Marruecos y por el Frente Polisario son incompatibles y no están verificadas de forma independiente; no se consolidan."
      }
    ],
    chronology: [
      {
        year: 1984,
        event: "13 de octubre: comienzan combates en el sector de Zag; el comunicado saharaui ubica ataques contra posiciones entre Khachbyine y Z'Moul Niran."
      },
      {
        year: 1984,
        event: "El Frente Polisario presenta la acción como inicio de la ofensiva Grand Maghreb; los comunicados de ambos bandos discrepan sobre el saldo."
      }
    ],
    treaties: [],
    hierarchyConfidence: "alta",
    hierarchySources: SOURCES,
    sourceDispute: "Le Monde informa versiones incompatibles: Marruecos atribuyó 176 muertos al Polisario y reconoció 37 bajas propias; el comunicado saharaui reclamó bajas marroquíes mucho mayores. El medio sitúa los combates cerca de Zag, mientras el comunicado saharaui especifica posiciones entre Khachbyine y Z'Moul Niran. No se convierten esos partes en un balance independiente ni se adjudica control territorial.",
    curationPriority: "alta",
    curationBatch: "source-backed-zmoul-niran-1984-2026-11",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Se renombra la importación imprecisa con la fecha y el sector descritos por fuentes contemporáneas. Sahara Occidental se agrega como perfil territorial e histórico de navegación, sin resolver soberanía. La ofensiva Grand Maghreb se conserva como marco operacional, no como resultado de esta acción; los partes de bajas de ambos bandos no son comparables ni están corroborados de forma independiente."
  }
};
