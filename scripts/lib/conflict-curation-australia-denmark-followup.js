function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  aidabasalalaArmy: source(
    "Centro de Investigación del Ejército Australiano: cronología de INTERFET y combate de Aidabasalala",
    "https://researchcentre.army.gov.au/sites/default/files/sp304_primary_responsibilities_and_primary_risks-alan_ryan.pdf"
  ),
  aidabasalalaAwm: source(
    "Australian War Memorial: estudio de las operaciones de INTERFET y la acción de Aidabasalala",
    "https://wm.awm.gov.au/read/exploring-east-timor"
  ),
  broodseinde: source(
    "Australian War Memorial: batalla de Broodseinde Ridge",
    "https://www.awm.gov.au/collection/E84313"
  ),
  sydneyKormoran: source(
    "Australian War Memorial: combate entre el HMAS Sydney y el Kormoran",
    "https://www.awm.gov.au/articles/encyclopedia/hmas_sydney"
  ),
  dernancourt: source(
    "Australian War Memorial: ataques de Dernancourt de 1918",
    "https://www.awm.gov.au/collection/E84291"
  ),
  schleswigWar: source(
    "Universidad de Aarhus, danmarkshistorien.dk: Primera Guerra de Schleswig de 1848 a 1850",
    "https://danmarkshistorien.dk/fileadmin/filer/E-boeger_-_pdf/7-Det-unge-demokrati.pdf"
  ),
  schleswigNationalMuseum: source(
    "Museo Nacional de Dinamarca: guerra de 1848 y batalla de Isted",
    "https://natmus.dk/historisk-viden/danmark/nationalstaten-1849-1915/det-nye-folkestyre/krigen-1848/"
  ),
  isted: source(
    "Museo Nacional de Dinamarca: combates de Isted del 24 y 25 de julio de 1850",
    "https://samlinger.natmus.dk/dnt/asset/25589"
  ),
  timorOccupation: source(
    "Naciones Unidas, UNMISET: antecedentes de la invasión, ocupación y consulta de Timor Oriental",
    "https://peacekeeping.un.org/sites/default/files/past/unmiset/background.html"
  ),
  timorSeriousCrimes: source(
    "Naciones Unidas: informe sobre violaciones graves cometidas en Timor Oriental entre 1975 y 1999",
    "https://digitallibrary.un.org/record/553995/files/S_2005_458-EN.pdf"
  ),
  timor2006: source(
    "Naciones Unidas, UNMIT: antecedentes de la crisis política, humanitaria y de seguridad de 2006",
    "https://peacekeeping.un.org/sites/default/files/past/unmit/background.shtml"
  )
};

function conflictFix({
  parent,
  campaign,
  region,
  hierarchySources,
  startYear,
  endYear = startYear,
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
  curationNote
}) {
  const sources = Array.isArray(hierarchySources) ? hierarchySources : [hierarchySources];
  const confidence = sources.some(item => item.confidence === "media") ? "media" : "alta";

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
    endYear,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology: chronology || [{ year: startYear, event: outcome }],
    treaties,
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence: confidence,
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-australia-denmark-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    ...(curationNote ? { curationNote } : {})
  };
}

export const AUSTRALIA_DENMARK_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla entre el HMAS Sydney y el Kormoran": "Combate naval entre el HMAS Sydney y el Kormoran (1941)",
  "Batalla de Schleswig": "Batalla de Schleswig (1848)",
  "Invasion indonesia de Timor Oriental": "Invasion indonesia de Timor Oriental (1975)",
  "Crisis de Timor Oriental": "Crisis de Timor Oriental de 2006"
};

export const AUSTRALIA_DENMARK_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  "Timor Oriental": ["Batalla de Aidabasalala"],
  "Bélgica": ["Batalla de Broodseinde"],
  Francia: ["Primera batalla de Dernancourt"],
  Alemania: ["Batalla de Schleswig (1848)", "Batalla de Isted"]
};

export const AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Aidabasalala": conflictFix({
    parent: "Intervención de INTERFET en Timor Oriental",
    campaign: "Operaciones de seguridad en la frontera occidental de Timor Oriental",
    region: "Aidabasalala, Timor Oriental",
    hierarchySources: [SOURCES.aidabasalalaArmy, SOURCES.aidabasalalaAwm],
    startYear: 1999,
    type: "combate",
    conflictType: "intervención",
    scale: "internacional",
    participants: [
      { side: "Patrulla de INTERFET", members: ["Australia", "Regimiento del Servicio Aéreo Especial"], casualties: "Sin bajas registradas en la patrulla" },
      { side: "Milicia proindonesia", members: ["Milicias prointegración de Timor Oriental"], casualties: "4 muertos y 4 heridos según la cronología australiana" }
    ],
    cause: "Una patrulla australiana de reconocimiento encontró una fuerza de milicianos armados cerca de la frontera con Timor Occidental durante el despliegue de INTERFET.",
    outcome: "La patrulla rompió el contacto después del enfrentamiento y fue extraída por helicóptero.",
    consequences: "La acción confirmó que las milicias conservaban capacidad armada en la frontera y condicionó las operaciones posteriores de seguridad de INTERFET.",
    curationNote: "La estimación del tamaño de la fuerza miliciana varía entre las fuentes; se conservan únicamente las bajas de la cronología institucional australiana."
  }),
  "Batalla de Broodseinde": conflictFix({
    parent: "Primera Guerra Mundial",
    campaign: "Tercera batalla de Ypres (Passchendaele)",
    region: "Broodseinde, Flandes Occidental, Bélgica",
    hierarchySources: SOURCES.broodseinde,
    startYear: 1917,
    scale: "mundial",
    participants: [
      { side: "Fuerzas aliadas", members: ["Australia", "Nueva Zelanda", "Reino Unido"], casualties: "Aproximadamente 6.500 bajas australianas" },
      { side: "Imperio alemán", members: ["Ejército Imperial Alemán"], casualties: "No consolidado en la fuente institucional utilizada" }
    ],
    cause: "El ejército británico intentó ocupar las alturas de Broodseinde como la tercera operación escalonada de la ofensiva de Ypres de 1917.",
    outcome: "Las divisiones aliadas capturaron sus objetivos principales sobre la cresta y derrotaron el contraataque alemán que coincidió con el avance.",
    consequences: "La victoria permitió ocupar la cresta al sur de Passchendaele, aunque el costo australiano redujo la capacidad ofensiva de sus divisiones."
  }),
  "Combate naval entre el HMAS Sydney y el Kormoran (1941)": conflictFix({
    parent: "Segunda Guerra Mundial",
    campaign: "Guerra naval en aguas australianas",
    region: "Océano Índico frente a Australia Occidental",
    hierarchySources: SOURCES.sydneyKormoran,
    startYear: 1941,
    type: "combate naval",
    scale: "mundial",
    participants: [
      { side: "Real Armada Australiana", members: ["Australia", "HMAS Sydney"], casualties: "645 muertos; no hubo supervivientes" },
      { side: "Kriegsmarine", members: ["Alemania", "Crucero auxiliar Kormoran"], casualties: "80 muertos y 317 supervivientes" }
    ],
    cause: "El HMAS Sydney interceptó frente a Australia Occidental al crucero auxiliar alemán Kormoran, que navegaba disfrazado como mercante.",
    outcome: "Ambos buques quedaron mortalmente dañados y se hundieron después del combate del 19 de noviembre.",
    consequences: "La pérdida completa del Sydney fue el mayor desastre naval australiano y originó décadas de investigación hasta localizar ambos pecios en 2008.",
    curationNote: "El desarrollo del combate se reconstruye principalmente con testimonios de supervivientes del Kormoran porque no sobrevivió ningún tripulante del Sydney."
  }),
  "Primera batalla de Dernancourt": conflictFix({
    parent: "Primera Guerra Mundial",
    campaign: "Ofensiva de primavera alemana de 1918",
    region: "Dernancourt, Somme, Francia",
    hierarchySources: SOURCES.dernancourt,
    startYear: 1918,
    scale: "mundial",
    participants: [
      { side: "Fuerza defensora australiana", members: ["Australia", "12.ª Brigada australiana"], casualties: "137 bajas" },
      { side: "Imperio alemán", members: ["50.ª División de Reserva prusiana"], casualties: "Aproximadamente 550 bajas" }
    ],
    cause: "La ofensiva alemana de primavera intentó abrir el corredor hacia Amiens atacando las posiciones australianas junto al ferrocarril Albert-Amiens.",
    outcome: "La 12.ª Brigada australiana rechazó los ataques del 28 de marzo y mantuvo la barrera defensiva del terraplén ferroviario.",
    consequences: "La defensa frenó el avance local alemán, pero precedió al ataque mucho mayor librado en Dernancourt el 5 de abril."
  }),
  "Batalla de Bov": conflictFix({
    parent: "Primera Guerra de Schleswig",
    campaign: "Campaña inicial de Schleswig de 1848",
    region: "Bov, ducado de Schleswig, actual Dinamarca",
    hierarchySources: SOURCES.schleswigWar,
    startYear: 1848,
    conflictType: "civil",
    participants: [
      { side: "Reino de Dinamarca", members: ["Dinamarca", "Ejército danés"] },
      { side: "Gobierno provisional de los ducados", members: ["Ejército de Schleswig-Holstein"] }
    ],
    cause: "El ejército danés avanzó en Schleswig contra el gobierno provisional y las fuerzas secesionistas formadas tras la crisis constitucional de marzo de 1848.",
    outcome: "Las fuerzas danesas derrotaron y dispersaron al contingente de Schleswig-Holstein el 9 de abril.",
    consequences: "La primera batalla de la guerra permitió a Dinamarca ocupar inicialmente gran parte de Schleswig antes de la intervención prusiana."
  }),
  "Batalla de Schleswig (1848)": conflictFix({
    parent: "Primera Guerra de Schleswig",
    campaign: "Intervención prusiana en Schleswig de 1848",
    region: "Schleswig, actual Alemania",
    hierarchySources: SOURCES.schleswigWar,
    startYear: 1848,
    participants: [
      { side: "Reino de Dinamarca", members: ["Dinamarca", "Ejército danés"] },
      { side: "Coalición alemana", members: ["Prusia", "Confederación Alemana", "Ejército de Schleswig-Holstein"] }
    ],
    cause: "Prusia y la Confederación Alemana intervinieron en apoyo de Schleswig-Holstein y atacaron las posiciones danesas junto a Dannevirke y Schleswig.",
    outcome: "La coalición alemana derrotó al ejército danés el 23 de abril y lo obligó a retirarse hacia la isla de Als.",
    consequences: "La derrota puso fin al avance inicial danés y permitió la ocupación alemana de amplias zonas de Jutlandia.",
    curationNote: "Se agrega el año al nombre para distinguir esta batalla de otras acciones libradas en torno a Schleswig."
  }),
  "Batalla de Fredericia": conflictFix({
    parent: "Primera Guerra de Schleswig",
    campaign: "Campaña de Jutlandia de 1849",
    region: "Fredericia, Jutlandia, Dinamarca",
    hierarchySources: SOURCES.schleswigWar,
    startYear: 1849,
    participants: [
      { side: "Reino de Dinamarca", members: ["Dinamarca", "Ejército danés"] },
      { side: "Fuerzas sitiadoras", members: ["Ejército de Schleswig-Holstein", "Tropas de la Confederación Alemana"] }
    ],
    cause: "Las fuerzas de Schleswig-Holstein sitiaron la fortaleza de Fredericia durante la reanudación de la guerra en 1849.",
    outcome: "Una salida danesa dirigida por Olaf Rye y Christian de Meza rompió el sitio el 6 de julio.",
    consequences: "La victoria restauró la iniciativa danesa y fue seguida cuatro días después por el acuerdo preliminar de paz de Berlín."
  }),
  "Batalla de Isted": conflictFix({
    parent: "Primera Guerra de Schleswig",
    campaign: "Campaña de Schleswig de 1850",
    region: "Isted, Schleswig, actual Alemania",
    hierarchySources: [SOURCES.schleswigWar, SOURCES.schleswigNationalMuseum, SOURCES.isted],
    startYear: 1850,
    conflictType: "civil",
    participants: [
      { side: "Reino de Dinamarca", members: ["Dinamarca", "Ejército danés"] },
      { side: "Schleswig-Holstein", members: ["Ejército de Schleswig-Holstein"] }
    ],
    cause: "Después de la paz entre Dinamarca y Prusia, el gobierno provisional de los ducados continuó la guerra y concentró su ejército en Schleswig.",
    outcome: "El ejército danés obtuvo una victoria el 25 de julio tras dos días de combates sobre un frente extenso.",
    consequences: "La mayor batalla de la guerra debilitó decisivamente a Schleswig-Holstein, aunque las operaciones continuaron hasta comienzos de 1851.",
    curationNote: "Las fuentes institucionales difieren en sus agregados de muertos y heridos; se evita presentar una cifra única como definitiva."
  }),
  "Invasion indonesia de Timor Oriental (1975)": conflictFix({
    parent: "Ocupación indonesia de Timor Oriental",
    campaign: "Invasión de diciembre de 1975",
    region: "Timor Oriental",
    hierarchySources: [SOURCES.timorOccupation, SOURCES.timorSeriousCrimes],
    startYear: 1975,
    type: "invasión",
    scale: "internacional",
    participants: [
      { side: "República de Indonesia", members: ["Indonesia", "Fuerzas Armadas de Indonesia"] },
      { side: "Fuerzas independentistas timorenses", members: ["FRETILIN", "FALINTIL"] }
    ],
    cause: "Tras el colapso de la administración portuguesa y la declaración de independencia de FRETILIN, Indonesia lanzó una invasión terrestre, aérea y naval el 7 de diciembre.",
    outcome: "Indonesia ocupó Dili y amplió su control militar; en 1976 declaró la integración del territorio como provincia, decisión no reconocida por Naciones Unidas.",
    consequences: "La invasión inició una ocupación de veinticuatro años, resistencia armada y graves violaciones de derechos humanos.",
    curationNote: "Esta corrección elimina la relación automática e históricamente imposible con la Segunda Guerra Mundial."
  }),
  "Ocupacion indonesia de Timor Oriental": conflictFix({
    parent: "Conflicto de Timor Oriental (1975-1999)",
    campaign: "Ocupación y resistencia timorense",
    region: "Timor Oriental",
    hierarchySources: [SOURCES.timorOccupation, SOURCES.timorSeriousCrimes],
    startYear: 1975,
    endYear: 1999,
    type: "ocupación",
    conflictType: "independencia",
    scale: "internacional",
    participants: [
      { side: "Administración indonesia", members: ["Indonesia", "Fuerzas Armadas de Indonesia"] },
      { side: "Resistencia timorense", members: ["FRETILIN", "FALINTIL", "Consejo Nacional de la Resistencia Timorense"] }
    ],
    cause: "Indonesia integró unilateralmente el territorio después de la invasión de 1975, mientras Naciones Unidas continuó considerándolo un territorio no autónomo.",
    outcome: "La ocupación terminó tras la consulta popular de 1999, el retiro indonesio y la transferencia de la administración a Naciones Unidas.",
    consequences: "Timor Oriental inició una transición internacional hacia la independencia alcanzada en 2002, después de un período de violencia y desplazamiento.",
    treaties: ["Acuerdos de Nueva York del 5 de mayo de 1999"],
    chronology: [
      { year: 1975, event: "Indonesia invade Timor Oriental e inicia la ocupación militar." },
      { year: 1976, event: "Indonesia declara la integración; Naciones Unidas no la reconoce." },
      { year: 1999, event: "La consulta popular rechaza la autonomía y abre la transición administrada por Naciones Unidas." }
    ],
    curationNote: "No se fija una cifra única de víctimas porque los alcances y métodos de estimación difieren entre investigaciones."
  }),
  "Crisis de Timor Oriental de 2006": conflictFix({
    parent: "Conflicto interno de Timor Oriental de 2006",
    campaign: "Crisis política y de seguridad de abril a junio de 2006",
    region: "Dili y otros distritos de Timor Oriental",
    hierarchySources: SOURCES.timor2006,
    startYear: 2006,
    type: "crisis interna",
    conflictType: "civil",
    participants: [
      { side: "Instituciones estatales", members: ["Gobierno de Timor Oriental", "F-FDTL", "Policía Nacional de Timor Oriental"] },
      { side: "Peticionarios y facciones armadas", members: ["Militares destituidos", "Facciones disidentes", "Grupos juveniles armados"] }
    ],
    cause: "La destitución de casi seiscientos miembros de las fuerzas armadas agravó fracturas regionales, institucionales y políticas dentro del nuevo Estado.",
    outcome: "La violencia disminuyó después del despliegue de fuerzas internacionales y la formación de un nuevo gobierno; Naciones Unidas creó UNMIT en agosto.",
    consequences: "Decenas de personas murieron y unas 155.000 fueron desplazadas; la crisis abrió una reforma prolongada de la policía, las fuerzas armadas y el Estado de derecho.",
    related: ["Misión Integrada de las Naciones Unidas en Timor Oriental", "Fuerzas internacionales de seguridad en Timor Oriental"],
    curationNote: "Esta corrección sustituye la campaña del Pacífico de 1941-1945 que el generador había asociado por error."
  })
};
