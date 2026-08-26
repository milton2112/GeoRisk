function source(label, url, confidence = "media") {
  return { label, url, confidence };
}

const SOURCES = {
  leMonde: source(
    "Le Monde (7 de septiembre de 1977): parte contemporaneo sobre el enfrentamiento entre el Polisario y el ejercito mauritano",
    "https://www.lemonde.fr/archives/article/1977/09/07/un-violent-accrochage-entre-le-polisario-et-l-armee-mauritanienne-a-fait-une-centaine-de-morts_2869252_1819218.html"
  ),
  elPais: source(
    "El Pais (15 de septiembre de 1977): reportaje contemporaneo sobre los prisioneros mauritanos capturados en los combates de agosto y septiembre",
    "https://elpais.com/diario/1977/09/15/internacional/243122402_850215.html"
  ),
  unitedNations: source(
    "Naciones Unidas (1977): informe sobre enfrentamientos entre el Frente Polisario, Marruecos y Mauritania y la variacion de los balances",
    "https://digitallibrary.un.org/record/700761/files/A_32_23_Rev-1%5EVol-II%5E-EN.pdf"
  )
};

function deglebatLegliaFix() {
  const hierarchySources = [SOURCES.leMonde, SOURCES.elPais, SOURCES.unitedNations];
  const parent = "Guerra del Sahara Occidental";
  const campaign = "Operaciones del Frente Polisario contra Mauritania de agosto-septiembre de 1977";

  return {
    parent,
    war: parent,
    campaign,
    type: "combate",
    conflictType: "independencia",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1977,
    endYear: 1977,
    region: "Deglebat-Leglia, entorno de Auserd/Aousserd, Sahara Occidental disputado",
    normalizedRegion: "Deglebat-Leglia, entorno de Auserd/Aousserd, Sahara Occidental disputado",
    cause: "El combate se produjo durante la guerra del Sahara Occidental, en la escalada de operaciones del Frente Polisario contra fuerzas mauritanas durante el verano de 1977. La disputa se relacionaba con el proceso inconcluso de descolonizacion y con el control del territorio.",
    outcome: "Las fuentes periodisticas contemporaneas confirman un enfrentamiento intenso el 31 de agosto de 1977 entre fuerzas mauritanas y el Frente Polisario. Los balances difundidos por las partes fueron incompatibles, por lo que la ficha no consolida bajas, capturas, danos materiales ni una victoria tactica.",
    consequences: "El combate formo parte de la presion militar sobre Mauritania durante 1977 dentro de la guerra del Sahara Occidental. Ilustra la intensidad de las operaciones de ese periodo, pero no permite por si solo atribuir una consecuencia estrategica decisiva ni explicar de forma lineal la retirada mauritana de 1979.",
    chronology: [
      { year: 1977, event: "Durante el verano, el Frente Polisario y las fuerzas de Marruecos y Mauritania sostuvieron enfrentamientos en distintos sectores vinculados a la guerra del Sahara Occidental." },
      { year: 1977, event: "El 31 de agosto, fuerzas mauritanas y el Frente Polisario combatieron en el area de Deglebat-Leglia." },
      { year: 1977, event: "Los informes posteriores de las partes ofrecieron cifras incompatibles sobre bajas, heridos, prisioneros y equipo; la ficha conserva la discrepancia en vez de fijar un balance." }
    ],
    treaties: [],
    related: [parent, campaign, "Frente Polisario", "Mauritania", "Sahara Occidental"],
    participants: [
      {
        side: "Fuerzas Armadas de Mauritania",
        members: ["Mauritania", "Ejercito mauritano"]
      },
      {
        side: "Frente Polisario",
        members: ["Frente Polisario", "Ejercito Popular de Liberacion Saharaui"]
      }
    ],
    hierarchyConfidence: "media",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "31 de agosto de 1977; los partes posteriores discrepan sobre el balance del combate",
    sourceDispute: true,
    curationPriority: "alta",
    curationBatch: "source-backed-deglebat-leglia-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Deglebat-Leglia figura en fuentes en frances, espanol e ingles con variantes de guion y transliteracion. El area se muestra como Sahara Occidental disputado y no adjudica soberania. La etiqueta de campana es una categoria descriptiva de GeoRisk, no el nombre oficial de una operacion. El registro evita repetir los balances incompatibles de los comunicados contemporaneos."
  };
}

export const DEGLEBAT_LEGLIA_CONFLICT_RENAMES = {
  "Batalla de Deglebat-Leglia": "Combate de Deglebat-Leglia (1977)",
  "Batalla de Deglebat Leglia": "Combate de Deglebat-Leglia (1977)",
  "Combate de Deglebat-Leglia": "Combate de Deglebat-Leglia (1977)",
  "Combat de Deglebat-Leglia": "Combate de Deglebat-Leglia (1977)",
  "Battle of Deglebat-Leglia": "Combate de Deglebat-Leglia (1977)"
};

export const DEGLEBAT_LEGLIA_COUNTRY_CONFLICT_ADDITIONS = {
  "Sahara Occidental": ["Combate de Deglebat-Leglia (1977)"]
};

export const DEGLEBAT_LEGLIA_CONFLICT_DETAIL_FIXES = {
  "Combate de Deglebat-Leglia (1977)": deglebatLegliaFix()
};
