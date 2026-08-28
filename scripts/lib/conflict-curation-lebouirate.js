function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  elPaisInitial: source(
    "El Pa\u00eds (26 de agosto de 1979): recoge el comunicado del Frente Polisario sobre el ataque a Lebuirat y un balance que seguia sin verificar",
    "https://elpais.com/diario/1979/08/26/internacional/304466406_850215.html"
  ),
  leMondeVerification: source(
    "Le Monde (19 de septiembre de 1979): informa que Rabat reconocio que Lebouirate fue investida y senala limites en los balances difundidos",
    "https://www.lemonde.fr/archives/article/1979/09/19/une-visite-a-l-ancienne-place-forte-de-lebouirate-confirme-l-ampleur-de-la-defaite-marocaine_2785465_1819218.html"
  ),
  unReport: source(
    "Naciones Unidas, informe de 1980: registra Lebouirate entre las posiciones atacadas en el sur de Marruecos durante la escalada de 1979",
    "https://documents.un.org/doc/undoc/gen/n80/133/64/pdf/n8013364.pdf"
  )
};

const PARENT = "Guerra del Sahara Occidental";
const CAMPAIGN = "Ofensivas del Frente Polisario de 1979";

function historicalFix({
  region,
  cause,
  outcome,
  consequences,
  chronology
}) {
  const hierarchySources = [
    SOURCES.elPaisInitial,
    SOURCES.leMondeVerification,
    SOURCES.unReport
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "ataque a guarnicion",
    conflictType: "independencia",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1979,
    endYear: 1979,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology,
    treaties: [],
    related: [PARENT, CAMPAIGN, "Frente Polisario", "Zag", "Sahara Occidental"],
    participants: [
      {
        side: "Fuerzas Armadas Reales de Marruecos",
        members: ["Marruecos", "Guarnicion marroqui de Lebouirate"]
      },
      {
        side: "Frente Polisario",
        members: ["Frente Polisario", "Combatientes saharauis"]
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-lebouirate-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: true,
    datePrecision: "24 de agosto de 1979",
    curationNote: "Sahara Occidental se incorpora como referencia geografica e historica de navegacion, sin adjudicar soberania sobre Lebouirate. Las fuentes contemporaneas confirman el ataque y la escalada de 1979, pero difieren de forma material sobre control, bajas, prisioneros y equipo. La ficha evita cifras cerradas, una victoria territorial definitiva y la atribucion de participacion directa a Estados no documentados en la accion."
  };
}

export const LEBOUIRATE_CONFLICT_RENAMES = {
  "Batalla de Lebouirate": "Ataque a Lebouirate (1979)",
  "Batalla de Lebuirate": "Ataque a Lebouirate (1979)",
  "Attack on Lebouirate": "Ataque a Lebouirate (1979)",
  "Attaque de Lebouirate": "Ataque a Lebouirate (1979)"
};

export const LEBOUIRATE_COUNTRY_CONFLICT_ADDITIONS = {
  "Sahara Occidental": ["Ataque a Lebouirate (1979)"]
};

export const LEBOUIRATE_CONFLICT_DETAIL_FIXES = {
  "Ataque a Lebouirate (1979)": historicalFix({
    region: "Lebouirate, al sur de Zag, Marruecos meridional; cerca del Sahara Occidental",
    cause: "Tras la retirada de Mauritania y la reconfiguracion de la guerra en 1979, el Frente Polisario incremento las operaciones contra posiciones de las Fuerzas Armadas Reales de Marruecos. Lebouirate era una guarnicion fortificada al sur de Zag y fue atacada el 24 de agosto.",
    outcome: "El ataque alcanzo la guarnicion de Lebouirate el 24 de agosto de 1979. El Frente Polisario declaro haber tomado la posicion y la prensa registro que Rabat reconocio que la localidad habia sido investida; las fuentes no permiten consolidar control territorial, bajas, prisioneros ni material capturado en una cifra unica.",
    consequences: "La accion evidencio la presion sobre las posiciones marroquies del sur durante la escalada de 1979 y fue seguida por nuevas operaciones en la zona. No resolvio la Guerra del Sahara Occidental ni permite por si sola establecer un cambio territorial duradero.",
    chronology: [
      {
        year: 1979,
        event: "La retirada de Mauritania reconfiguro el conflicto y abrio una fase de mayor presion sobre posiciones marroquies."
      },
      {
        year: 1979,
        event: "El 24 de agosto, el Frente Polisario ataco la guarnicion de Lebouirate, al sur de Zag."
      },
      {
        year: 1979,
        event: "Las partes difundieron relatos y balances incompatibles; los reportes posteriores no permiten cerrar cifras ni un cambio territorial permanente."
      }
    ]
  })
};
