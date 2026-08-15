function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  paracelUsni: source(
    "U.S. Naval Institute, Naval History: estudio de la batalla de las Islas Paracelso de 1974 entre la Republica Popular China y Vietnam del Sur",
    "https://www.usni.org/ClashOfFleets"
  ),
  paracelStateDepartment: source(
    "Departamento de Estado de EE. UU., Foreign Relations of the United States: documento de enero de 1974 sobre la batalla entre China y Vietnam del Sur por las Islas Paracelso",
    "https://history.state.gov/historicaldocuments/frus1969-76v18/d66"
  ),
  staketSwedishMemorials: source(
    "Svenska Militaria Minnesmarken: relato del combate de Staket del 13 de agosto de 1719 durante la Gran Guerra del Norte",
    "https://svmm.se/1719-slaget-vid-staket/"
  ),
  staketNationalLibrary: source(
    "Libris, Biblioteca Nacional de Suecia: registro bibliografico de Slaget vid Staket y su fecha de 1719",
    "https://libris.kb.se/bib/11521788"
  ),
  itterArmyUniversityPress: source(
    "Army University Press, Military Review: resena documental de la defensa de Schloss Itter en las horas finales de la Segunda Guerra Mundial",
    "https://www.armyupress.army.mil/Portals/7/military-review/Archives/English/MilitaryReview_20140831_art018.pdf"
  ),
  itterArmyHistory: source(
    "Centro de Historia Militar del Ejercito de EE. UU.: informe oficial de las operaciones aliadas en Europa hasta el 8 de mayo de 1945",
    "https://history.army.mil/portals/143/Images/Publications/catalog/70-58.pdf",
    "media"
  )
};

function historicalFix({
  parent,
  campaign,
  region,
  hierarchySources,
  startYear,
  participants,
  cause,
  outcome,
  consequences,
  chronology,
  type = "batalla",
  conflictType = "interestatal",
  scale = "regional",
  treaties = [],
  related = [],
  hierarchyConfidence = "alta",
  dataConfidence = "parcial",
  curationNote,
  sourceDispute = false
}) {
  const sources = Array.isArray(hierarchySources) ? hierarchySources : [hierarchySources];
  return {
    parent,
    war: parent,
    campaign,
    type,
    conflictType,
    scale,
    status: "historico",
    active: false,
    ongoing: false,
    startYear,
    endYear: startYear,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology,
    treaties,
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence,
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-priority-safe-batch-2026-08",
    curationStatus: "estructural",
    dataConfidence,
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const PRIORITY_SAFE_BATCH_CONFLICT_RENAMES = {
  "Batalla de las Islas Paracelso": "Batalla de las Islas Paracelso (1974)",
  "Batalla de St\u00e4ket": "Batalla de St\u00e4ket (1719)",
  "Batalla por el Castillo Itter": "Batalla por el Castillo Itter (1945)"
};

export const PRIORITY_SAFE_BATCH_COUNTRY_CONFLICT_ADDITIONS = {
  "Rep\u00fablica Popular China": ["Batalla de las Islas Paracelso (1974)"],
  Vietnam: ["Batalla de las Islas Paracelso (1974)"],
  Suecia: ["Batalla de St\u00e4ket (1719)"],
  Rusia: ["Batalla de St\u00e4ket (1719)"],
  "Estados Unidos": ["Batalla por el Castillo Itter (1945)"],
  Alemania: ["Batalla por el Castillo Itter (1945)"],
  Austria: ["Batalla por el Castillo Itter (1945)"],
  Francia: ["Batalla por el Castillo Itter (1945)"]
};

export const PRIORITY_SAFE_BATCH_CONFLICT_DETAIL_FIXES = {
  "Batalla de las Islas Paracelso (1974)": historicalFix({
    parent: "Disputa territorial del mar de China Meridional",
    campaign: "Crisis de las Islas Paracelso de enero de 1974",
    region: "Islas Paracelso, mar de China Meridional; archipielago disputado entre China, Vietnam y Taiwan",
    hierarchySources: [SOURCES.paracelUsni, SOURCES.paracelStateDepartment],
    startYear: 1974,
    type: "batalla naval y operacion anfibia",
    scale: "internacional",
    participants: [
      { side: "Fuerzas de la Republica Popular China", members: ["Armada del Ejercito Popular de Liberacion"] },
      { side: "Fuerzas de la Republica de Vietnam", members: ["Armada de la Republica de Vietnam"] }
    ],
    cause: "La disputa de soberania sobre las Islas Paracelso escalo cuando fuerzas de la Republica Popular China y de Vietnam del Sur se enfrentaron por el control de islas, instalaciones y accesos del archipielago.",
    outcome: "Las fuerzas de la Republica Popular China prevalecieron sobre la Armada de la Republica de Vietnam y pasaron a controlar de facto el conjunto del archipielago. La ficha no adjudica la soberania juridica, que continua disputada.",
    consequences: "La accion consolido el control de facto chino sobre las Islas Paracelso y se convirtio en un antecedente central de la disputa en el mar de China Meridional, sin resolver las reclamaciones rivales.",
    chronology: [
      { year: 1974, event: "A mediados de enero, la tension por las posiciones en las Islas Paracelso paso de la presencia naval a enfrentamientos terrestres y maritimos." },
      { year: 1974, event: "El 19 y el 20 de enero, las fuerzas chinas y survietnamitas combatieron por las islas y los accesos navales del archipielago." }
    ],
    treaties: [],
    related: ["Islas Paracelso", "Mar de China Meridional"],
    curationNote: "China, Vietnam y Taiwan mantienen posiciones de soberania incompatibles sobre el archipielago. La ficha describe el control de facto posterior a 1974, no una resolucion juridica de la disputa, y evita consolidar bajas porque las fuentes y las partes difieren en sus recuentos.",
    sourceDispute: true
  }),
  "Batalla de St\u00e4ket (1719)": historicalFix({
    parent: "Gran Guerra del Norte",
    campaign: "Incursiones rusas en la costa sueca de 1719",
    region: "Baggenstaket, archipielago de Estocolmo, Suecia",
    hierarchySources: [SOURCES.staketSwedishMemorials, SOURCES.staketNationalLibrary],
    startYear: 1719,
    type: "batalla terrestre y naval",
    participants: [
      { side: "Defensores suecos", members: ["Reino de Suecia"] },
      { side: "Fuerza de galeras rusas", members: ["Imperio ruso"] }
    ],
    cause: "Durante las incursiones rusas de 1719, una fuerza de galeras intento alcanzar Estocolmo por Baggenstaket para presionar a Suecia en las negociaciones de paz de la Gran Guerra del Norte.",
    outcome: "La fuerza rusa no logro atravesar Baggenstaket hacia Estocolmo y se retiro tras los combates. Ambos bandos declararon victoria, por lo que la ficha no presenta una victoria tactica indiscutida.",
    consequences: "El combate formo parte de la presion militar rusa sobre la costa sueca durante la fase final de la guerra y antecedio al Tratado de Nystad de 1721.",
    chronology: [
      { year: 1719, event: "En agosto, una flota rusa de galeras amenazo el acceso a Estocolmo por Baggenstaket durante las incursiones sobre la costa sueca." },
      { year: 1719, event: "El 13 de agosto, defensores suecos y la fuerza rusa combatieron por el paso; los rusos embarcaron de nuevo al caer la noche." }
    ],
    treaties: ["Tratado de Nystad (1721)"],
    curationNote: "Staket tambien aparece como Baggenstaket. La fuente conmemorativa sueca describe un resultado disputado: ambos bandos proclamaron victoria y la retirada rusa impidio la aproximacion a Estocolmo. Por eso no se fijan bajas ni una victoria cerrada.",
    sourceDispute: true
  }),
  "Batalla por el Castillo Itter (1945)": historicalFix({
    parent: "Segunda Guerra Mundial",
    campaign: "Operaciones finales en el Tirol de mayo de 1945",
    region: "Schloss Itter, Tirol, Austria",
    hierarchySources: [SOURCES.itterArmyUniversityPress, SOURCES.itterArmyHistory],
    startYear: 1945,
    type: "defensa de posicion",
    scale: "mundial",
    participants: [
      { side: "Defensores aliados, prisioneros franceses y soldados alemanes disidentes", members: ["Ejercito de Estados Unidos", "soldados de la Wehrmacht", "detenidos franceses"] },
      { side: "Fuerzas de las Waffen-SS", members: ["17. SS-Panzergrenadier-Division Gotz von Berlichingen"] }
    ],
    cause: "En las horas finales de la guerra en Europa, prisioneros franceses retenidos en Schloss Itter buscaron impedir su ejecucion o recaptura mientras las fuerzas alemanas se desintegraban y los Aliados se aproximaban al Tirol.",
    outcome: "La fuerza defensora mantuvo el castillo hasta la llegada de refuerzos estadounidenses, preservando a los detenidos frente al ataque de una fuerza de las Waffen-SS.",
    consequences: "El episodio ilustra la fragmentacion de las fuerzas alemanas al final de la guerra en Europa y quedo asociado a la proteccion de detenidos politicos franceses antes de la rendicion alemana.",
    chronology: [
      { year: 1945, event: "A comienzos de mayo, los detenidos de Schloss Itter y una pequena fuerza defensora pidieron ayuda a las tropas aliadas que se aproximaban al Tirol." },
      { year: 1945, event: "Durante la defensa, soldados estadounidenses, alemanes disidentes y detenidos franceses resistieron a una fuerza de las Waffen-SS hasta la llegada de refuerzos." }
    ],
    treaties: ["Rendicion alemana en Europa (1945)"],
    related: ["Fin de la guerra en Europa (1945)"],
    curationNote: "El registro se limita a una defensa local de 1945 dentro de la Segunda Guerra Mundial. Austria, Alemania, Francia y Estados Unidos se agregan para navegacion historica; los participantes se conservan como formaciones y grupos de epoca. Las reconstrucciones publicas difieren en efectivos y bajas, por lo que no se fijan cifras cerradas.",
    sourceDispute: true
  })
};
