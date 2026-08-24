function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  leMonde: source(
    "Le Monde (14 de agosto de 1979): confirma combates cerca de Bir-Anzaran entre las Fuerzas Armadas Reales y unidades guerrilleras",
    "https://www.lemonde.fr/archives/article/1979/08/14/la-prise-de-controle-de-dakhla-par-le-maroc-est-qualifiee-de-coup-de-force-a-alger-la-fete-de-l-allegeance_3053371_1819218.html"
  ),
  elPaisContext: source(
    "El Pais (16 de agosto de 1979): contexto de la operacion de Bir Anzaran tras la retirada mauritana",
    "https://elpais.com/diario/1979/08/16/internacional/303602413_850215.html"
  ),
  elPaisVerification: source(
    "El Pais (21 de agosto de 1979): verificacion sobre el terreno y limites de las cifras de ambas partes",
    "https://elpais.com/diario/1979/08/21/internacional/304034406_850215.html?outputType=amp"
  )
};

function historicalFix({
  parent,
  campaign,
  region,
  hierarchySources,
  participants,
  cause,
  outcome,
  consequences,
  chronology
}) {
  const sources = hierarchySources.filter(Boolean);
  return {
    parent,
    war: parent,
    campaign,
    type: "batalla",
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
    related: [...new Set([parent, campaign, "Frente Polisario", "Dajla", "Sahara Occidental"].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-bir-enzaran-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: true,
    curationNote: "Sahara Occidental se incorpora como referencia geografica del dataset, sin adjudicar soberania. Los reportes contemporaneos confirman combates cerca de Bir Enzaran el 11 de agosto de 1979, pero las partes difundieron balances incompatibles y la verificacion periodistica posterior no confirmo sus cifras. La ficha no consolida bajas, efectivos, prisioneros ni una victoria tactica."
  };
}

export const BIR_ENZARAN_CONFLICT_RENAMES = {
  "Batalla de Bir Enzaran": "Batalla de Bir Enzaran (1979)",
  "Batalla de Bir Enzarán": "Batalla de Bir Enzaran (1979)"
};

export const BIR_ENZARAN_COUNTRY_CONFLICT_ADDITIONS = {
  "Sahara Occidental": ["Batalla de Bir Enzaran (1979)"]
};

export const BIR_ENZARAN_CONFLICT_DETAIL_FIXES = {
  "Batalla de Bir Enzaran (1979)": historicalFix({
    parent: "Guerra del Sahara Occidental",
    campaign: "Ofensivas del Frente Polisario de 1979",
    region: "Bir Enzaran, Sahara Occidental",
    hierarchySources: [SOURCES.leMonde, SOURCES.elPaisContext, SOURCES.elPaisVerification],
    participants: [
      {
        side: "Fuerzas Armadas Reales de Marruecos",
        members: ["Marruecos", "Guarnicion marroqui de Bir Enzaran"]
      },
      {
        side: "Frente Polisario",
        members: ["Frente Polisario", "Unidades guerrilleras saharauis"]
      }
    ],
    cause: "En el contexto de la retirada mauritana de la zona y de la entrada de fuerzas marroquies en Dajla, el Frente Polisario lanzo una operacion contra la posicion de Bir Enzaran. La accion formo parte de la ofensiva de 1979 contra posiciones marroquies durante la guerra del Sahara Occidental.",
    outcome: "Los reportes contemporaneos coinciden en que hubo combate cerca de Bir Enzaran el 11 de agosto de 1979. Las partes difundieron resultados incompatibles y una verificacion periodistica posterior no confirmo las cifras de bajas ni de danos; por eso la ficha no atribuye una victoria tactica ni consolida bajas, capturas o efectivos.",
    consequences: "La batalla se inscribio en la escalada de operaciones del Frente Polisario contra posiciones marroquies durante 1979. No resolvio la guerra, pero ilustra la intensificacion militar posterior a la retirada mauritana y a la disputa por Dajla.",
    chronology: [
      { year: 1979, event: "La retirada de Mauritania de la zona reconfiguro el conflicto y abrio una nueva fase de operaciones por el control del antiguo sector mauritano." },
      { year: 1979, event: "El 11 de agosto, fuerzas marroquies y unidades del Frente Polisario combatieron cerca de Bir Enzaran." },
      { year: 1979, event: "Los comunicados de ambos bandos ofrecieron balances incompatibles; una verificacion periodistica posterior no pudo confirmar sus cifras de bajas o danos." }
    ]
  })
};
